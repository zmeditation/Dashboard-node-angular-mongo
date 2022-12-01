const moment = require('moment');
const ReportSaver = require('../../../../services/reporting/ReportSaver');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const { reportDates } = require('../../../../services/helperFunctions/dateFunctions');
const { httpsRequest } = require('../helperFunctions/httpsRequest');
const { isJson } = require('../../../../services/helperFunctions/stringFunctions');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');

class PubMaticAPI extends ReportSaver {
  constructor({ token }) {
    if (!token) {
      throw new Error('MISSING_CONFIG_VALUES');
    }
    super();
    this.token = `Bearer ${ token }`;
    this.programmatic = 'PubMatic';
    this.sendReportMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  async start(fromDate, toDate) {
    try {
      const { downloadReportsOptions, textDate } = await this.generateURL(this.token, fromDate, toDate);
      this.sendReportMessage.text = textDate;

      const domains = await this.requestDomains();

      const downloadedReports = await this.downloadReports(downloadReportsOptions, domains);

      console.log('Start Loading to DB');
      const { reports, error: dbErr } = await this.dbCall(downloadedReports);
      if (dbErr) {
        throw dbErr;
      }

      return this.programmatic;
    } catch (error) {
      checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, customText);
    }
  }

  generateURL(token, fromDate, toDate) {
    return new Promise((resolve) => {
      try {
        const query = {
          publisherID: '156736',
          dateUnit: 'date',
          dimensions: ['date', 'siteId', 'adFormatId', 'adTagId', 'adSizeId'],
          filters: [],
          metrics: ['clicks', 'totalRequests', 'paidImpressions', 'ecpm', 'revenue'],
          fromDate: moment().subtract(1, 'days').set({ hour: 0, minute: 0 }).format('YYYY-MM-DDTHH:mm'),
          toDate: moment().subtract(1, 'days').set({ hour: 23, minute: 59 }).format('YYYY-MM-DDTHH:mm')
        };

        if (fromDate && toDate) {
          [fromDate, toDate] = moment(fromDate).unix() > moment(toDate).unix() ? [toDate, fromDate] : [fromDate, toDate];
          query.fromDate = moment(fromDate).set({ hour: 0, minute: 0 }).format('YYYY-MM-DDTHH:mm');
          query.toDate = moment(toDate).set({ hour: 23, minute: 59 }).format('YYYY-MM-DDTHH:mm');
        }

        resolve({
          downloadReportsOptions: {
            method: 'GET',
            host: 'api.pubmatic.com',
            path: `/v1/analytics/data/publisher/${query.publisherID}?dateUnit=${query.dateUnit}&dimensions=${query.dimensions}&filters=&fromDate=${query.fromDate}&metrics=${query.metrics}&pageNumber=&pageSize=&sort=-revenue&toDate=${query.toDate}`,
            headers: {
              Authorization: token
            }
          },
          textDate: reportDates(query.fromDate, query.toDate).textDate
        });
      } catch (error) {
        const text = !startDate || !endDate ? textDate : reportDates(fromDate, toDate).textDate;
        this.sendReportMessage.text = text;
        const customText = `${ this.programmatic }, error in generateURL`;
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  requestDomains() {
    return new Promise((resolve) => {
      const customText = `${ this.programmatic }, error in requestDomains.`;

      try {
        const reqOptions = {
          method: 'GET',
          host: 'api.pubmatic.com',
          path:
            '/v1/inventorymgmt/publisherSites?dimensions=modificationTime&filters=publisherId+eq+156736&pageNumber=1&pageSize=100&sort=-modificationTime',
          headers: {
            Authorization: this.token
          }
        };

        httpsRequest({ options: reqOptions, customText })
          .then((response) => {
            this.requestDomainsHandleResponse(response).then(resolve);
          })
          .catch(() => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  requestDomainsHandleResponse(response) {
    return new Promise((resolve) => {
      const customText = `${ this.programmatic } response not valid.`;

      try {
        if (isJson(response)) {
          let domainObj = JSON.parse(response);
          if (!domainObj.items) {
            throw 'response not have field items';
          }
          if (!domainObj.items.length) {
            this.sendReportMessage.typeMsg = 'noData';
            checkResponseOnError({ error: customText, customText: `${ this.programmatic }, Array is empty, no data.` })
              .catch(() =>
                sendReport({ message: this.sendReportMessage })
              );
            handleErrors(error, customText);
          }

          const object = {};
          domainObj = domainObj.items.map((el) => ({ [el.siteId]: el.siteDomain.domainName }));
          domainObj.forEach((domain) => {
            Object.assign(object, domain);
          });
          resolve(object);
        } else {
          throw response;
        }
      } catch (error) {
        checkResponseOnError({ error: response, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  downloadReports(options, domains) {
    return new Promise((resolve) => {
      const customText = `${ this.programmatic }, error in downloadReports.`;

      try {
        httpsRequest({ options, customText })
          .then((response) => {
            this.downloadReportsHandleResponse(response, domains).then(resolve);
          })
          .catch(() => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  downloadReportsHandleResponse(response, domains) {
    return new Promise((resolve) => {
      const customText = `${ this.programmatic }, error in downloadReports.`;

      try {
        if (isJson(response)) {
          const parsedReports = JSON.parse(response);

          if (!parsedReports.rows) throw 'response not have field rows';
          if (!parsedReports.rows.length) {
            this.sendReportMessage.typeMsg = 'noData';
            checkResponseOnError({ error: customText, customText: `${this.programmatic}, Array is ampty, no data.` }).catch(() =>
              sendReport({ message: this.sendReportMessage })
            );
            handleErrors(error, customText);
          }

          const { error: sortErr } = this.sortDataFunctions(parsedReports, domains);
          if (sortErr) throw sortErr;

          const { arrayOfObj, error: makeObjErr } = this.makeObject(parsedReports);
          if (makeObjErr) throw makeObjErr;

          resolve(arrayOfObj);
        } else {
          throw response;
        }
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  sortDataFunctions(data, domains) {
    try {
      this.filter(data.rows, domains);
      this.filter(data.rows, data.displayValue.adFormatId);
      this.filter(data.rows, data.displayValue.adTagId);
      this.filter(data.rows, data.displayValue.adSizeId);

      return { error: null };
    } catch (error) {
      return handleErrors(error, 'sortDataFunctions');
    }
  }

  filter(data, def) {
    Object.entries(def).forEach((entry) => {
      let key = entry[0];
      let value = entry[1];
      data.forEach((row) => {
        row.forEach((val, index, array) => {
          if (key === val) {
            array[index] = value;
          }
        });
      });
    });
  }

  makeObject(data) {
    try {
      let arr = [];
      data.rows.forEach((values) => {
        if (values[4] === 'Unknown') {
          return;
        }
        arr.push(this.returnObject(values, data.displayValue.siteId));
      });
      return {
        arrayOfObj: arr,
        error: null
      };
    } catch (error) {
      return handleErrors(error, 'makeObject');
    }
  }

  returnObject(values, sitesList) {
    const inventory_type = this.inventoryType(values[2]);
    const inventory_sizes = this.inventorySize(values[4]);

    return {
      day: values[0],
      report_origin: 'PubMatic',
      property: {
        domain: this.getURL(values[1], sitesList),
        property_id: values[3],
        refs_to_user: null,
        am: null
      },
      inventory: getInventory({ inventory_sizes, inventory_type }),
      inventory_sizes,
      inventory_type,
      clicks: parseInt(values[5], 10),
      ad_request: parseInt(values[6], 10),
      matched_request: parseInt(values[7], 10),
      ecpm: this.cutProgrammaticCommission(this.parseECPM(values[8]))
    };
  }

  inventoryType(val) {
    return val === 'Display' ? 'banner' : 'video';
  }

  inventorySize(val) {
    const index = val.indexOf(' ');
    let str = val.match(/x400/);
    if (str !== null) {
      return str.input;
    }
    let str2 = val.match(/video|Video/);
    if (str2 !== null) {
      return 'Video/Overlay';
    } else {
      return val.substring(index, 0);
    }
  }

  getURL(url, list) {
    if (Object.keys(list).includes(url)) {
      const currentUrl = list[url];
      const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(currentUrl);
      return url2[1];
    }
    const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(url);
    return url2[1];
  }

  parseECPM(ecpm) {
    ecpm = typeof ecpm === 'string' && ecpm.includes(',') ? parseFloat(ecpm.replace(',', '.')) : parseFloat(ecpm);
    return parseFloat(ecpm.toFixed(2));
  }

  cutProgrammaticCommission(cpm) {
    const commission = 23;
    const cpmByPercent = (commission * cpm) / 100;
    return parseFloat((cpm - cpmByPercent).toString());
  }

  async dbCall(downloadedReports) {
    try {
      return {
        reports: await this.saveToDataBase(downloadedReports, true),
        error: null
      };
    } catch (error) {
      return handleErrors(error, 'dbCall');
    }
  }
}

exports.PubMaticAPI = PubMaticAPI;
