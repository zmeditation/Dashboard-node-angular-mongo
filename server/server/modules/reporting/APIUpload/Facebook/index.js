const axios = require('axios');
const moment = require('moment');
const ReportSaver = require('../../../../services/reporting/ReportSaver');
const { SaveUniqueUnits } = require('../../../../services/properties/index');
const convertFacebookCSVToJSON = require('./facebook-csv/facebook-csv');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const { reportDates } = require('../../../../services/helperFunctions/dateFunctions');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const csvFilePath = `${__dirname}/facebook-csv/facebook_placements.csv`;

class FacebookAPI extends ReportSaver {
  constructor(options) {
    super();
    this.config = this.getConfig(options);
    this.programmatic = 'Facebook';
    this.sendReportMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  getConfig({ token, secret }) {
    if (!token || !secret) {
      throw new Error('MISSING_CONFIG_DATA');
    }

    return {
      long_lived_access_token: token,
      api_version: 'v6.0',
      client_id: '119888871962164',
      client_secret: secret
    };
  }

  async start(startDate, endDate) {
    try {
      const { dates, textDate } = this.generateDates(startDate, endDate);
      this.sendReportMessage.text = textDate;

      const queryId = await this.getQueryId(this.config, dates);
      const results = await this.processFacebookQuery(queryId);
      const convertedJSONObjectArray = await convertFacebookCSVToJSON(csvFilePath);

      results.forEach((result) => {
        const { siteName, placementName } = this.addPropertyName(result.breakdowns[0].value, convertedJSONObjectArray);
        result.breakdowns[0].site = siteName;
        result.breakdowns[0].placement_name = placementName;
      });

      const siteObjects = this.divideByType(results);

      return await this.updateDB(siteObjects);
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  generateDates(startDate, endDate) {
    const dates = {
      startDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),
      endDate: moment().subtract(2, 'days').format('YYYY-MM-DD')
    };

    if (startDate && endDate) {
      [startDate, endDate] = moment(startDate).unix() > moment(endDate).unix() ? [endDate, startDate] : [startDate, endDate];
      dates.startDate = moment(startDate).format('YYYY-MM-DD');
      dates.endDate = moment(endDate).format('YYYY-MM-DD');
    }

    return {
      dates,
      textDate: reportDates(dates.startDate, dates.endDate).textDate
    };
  }

  getQueryId(config, { startDate, endDate }) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in getQueryId`;

      try {
        axios
          .post(
            `https://graph.facebook.com/${config.api_version}/${config.client_id}/adnetworkanalytics/?metrics=['fb_ad_network_request',
                    'fb_ad_network_imp', 'fb_ad_network_ctr', 'fb_ad_network_cpm', 'fb_ad_network_click', 'fb_ad_network_revenue']
                    &breakdowns=['placement','property']&since=${startDate}&until=${endDate}&access_token=${config.long_lived_access_token}`
          )
          .then((data) => {
            resolve(data.query_id);
          })
          .catch((error) => {
            const {
              response: {
                status,
                data: {
                  error: { message }
                }
              }
            } = error;
            const errResponse = {
              statusCode: status,
              statusMessage: message
            };
            checkResponseOnError({ response: errResponse, error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
          });
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  async processFacebookQuery(queryID) {
    const customText = `${this.programmatic}, error in processFacebookQuery`;

    try {
      let statusObject = await this.getReportsByQueryId(queryID);
      let tries = 0;

      console.log(
        `API Request Status: ${statusObject.status}. Received ${statusObject.results ? statusObject.results.length : 'zero'} results`
      );

      while (statusObject.status !== 'complete') {
        console.log(statusObject.status);
        statusObject = await this.getReportsByQueryId(queryID);
        if (statusObject.status === 'complete') {
          break;
        }
        if (tries === 5) {
          throw { msg: 'EXCEEDED_NUMBER_OF_TRIES' };
        }
        tries++;
      }

      return statusObject.results;
    } catch (error) {
      checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, customText);
    }
  }

  getReportsByQueryId(queryID) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in getReportsByQueryId`;

      try {
        const config = this.config;

        setTimeout(async () => {
          axios
            .get(
              `https://graph.facebook.com/${config.client_id}/adnetworkanalytics_results/
                        ?query_ids=['${queryID}']&access_token=${config.long_lived_access_token}`
            )
            .then((data) => {
              const {
                data: {
                  data: [{ status, results }]
                }
              } = data;
              resolve({ status, results });
            })
            .catch((error) => {
              const {
                response: {
                  status,
                  data: {
                    error: { message }
                  }
                }
              } = error;
              const errResponse = {
                statusCode: status,
                statusMessage: message
              };
              checkResponseOnError({ response: errResponse, error, customText }).catch(() =>
                sendReport({ message: this.sendReportMessage })
              );
            });
        }, 5000);
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  updateDB(reports) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in updateDB`;

      try {
        const reportPromises = [];

        reports
          .filter((elem) => elem.site)
          .forEach((elem, index, array) => {
            if (!array.length) {
              throw (this.sendReportMessage.typeMsg = 'noData');
            }

            const inventory_sizes = 'Video/Overlay';
            const inventory_type = 'video';

            const object = {
              property: {
                domain: elem.site,
                property_id: elem.placement_name,
                refs_to_user: null,
                am: null
              },
              inventory: getInventory({ inventory_sizes, inventory_type }),
              inventory_sizes,
              inventory_type,
              clicks: parseInt(elem.clicks, 10),
              ad_request: parseInt(elem.requests, 10),
              matched_request: parseInt(elem.impressions, 10),
              day: elem.date,
              ecpm: parseFloat(parseFloat(elem.cpm).toFixed(2)),
              report_origin: this.programmatic
            };

            const promise = this.saveToDataBase(object);

            reportPromises.push(promise);

            if (index + 1 === array.length) {
              Promise.all(reportPromises)
                .then((data) => {
                  if (data) {
                    SaveUniqueUnits(data);
                    resolve('UPLOAD_COMPLETE');
                  }
                })
                .catch((error) => {
                  checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
                  handleErrors(error, customText);
                });
            }
          });
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  divideByType(reports) {
    try {
      let sites = new Set([]);
      let siteObjects = [];

      reports.forEach((report) => sites.add(`${report.breakdowns[0].value}_${report.time}`));

      sites.forEach((id) => {
        const [site, date] = id.split('_');

        siteObjects.push({
          placement: site,
          site: site,
          placement_name: site,
          date: date.split('T')[0],
          requests: 0,
          impressions: 0,
          ctr: 0,
          cpm: 0,
          clicks: 0,
          revenue: 0
        });
      });

      siteObjects.forEach((object) => {
        reports.forEach((report) => {
          const { site, placement_name, value } = report.breakdowns[0];
          const time = report.time.split('T')[0];

          if (object.placement == value) {
            object.site = site;
            object.placement_name = placement_name;
          }
          if (report.metric === 'fb_ad_network_request' && value === object.placement && time === object.date) {
            object.requests = report.value;
          } else if (report.metric === 'fb_ad_network_imp' && value === object.placement && time === object.date) {
            object.impressions = report.value;
          } else if (report.metric === 'fb_ad_network_ctr' && value === object.placement && time === object.date) {
            object.ctr = report.value;
          } else if (report.metric === 'fb_ad_network_cpm' && value === object.placement && time === object.date) {
            object.cpm = report.value;
          } else if (report.metric === 'fb_ad_network_click' && value === object.placement && time === object.date) {
            object.clicks = report.value;
          } else if (report.metric === 'fb_ad_network_revenue' && value === object.placement && time === object.date) {
            object.revenue = report.value;
          }
        });
      });

      return siteObjects;
    } catch (error) {
      throw handleErrors(error, 'divideByType');
    }
  }

  addPropertyName(id, sitesArray) {
    let siteName, placementName;
    const sites = sitesArray;

    for (let i = 0; i < sites.length; i++) {
      if (sites[i].id === id) {
        siteName = sites[i].name;
        placementName = sites[i].placement_name;
        break;
      }
    }
    return { siteName, placementName };
  }
}

exports.FacebookAPI = FacebookAPI;
