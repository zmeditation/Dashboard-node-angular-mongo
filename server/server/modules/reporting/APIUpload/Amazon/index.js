const AWS = require('aws-sdk');
const moment = require('moment');
const ReportSaver = require('../../../../services/reporting/ReportSaver');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');

class AmazonAPI extends ReportSaver {
  constructor({ accessKeyId, secretAccessKey }) {
    if (!accessKeyId || !secretAccessKey) {
      throw new Error('MISSING_CONFIG_DATA');
    }

    super();

    AWS.config.update({ accessKeyId, secretAccessKey });
    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01'
    });
    this.programmatic = 'Amazon';
    this.sendReportMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  async start(dateForLoad) {
    try {
      const { textDate, parameters } = this.getParameters(dateForLoad);
      this.sendReportMessage.text = textDate;

      const sortedReports = await this.downloadReports(parameters);

      return await this.handleReports(sortedReports);
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  getParameters(customDate) {
    let date = moment().subtract(2, 'days').format('YYYY-MM-DD');

    if (customDate) {
      date = moment(customDate).format('YYYY-MM-DD');
    }

    return {
      parameters: {
        Bucket: 'aps-external-download',
        Key: `aps-download-publisher-20225d70-0d78-4b5e-9cb8-b69178e535c7/earnings_report/${ date }/report_data`
      },
      textDate: `(${ date })`
    };
  }

  downloadReports(parameters) {
    return new Promise((resolve) => {
      const customText = `${ this.programmatic }, error in downloadReports`;

      try {
        this.s3.getObject(parameters, (error, data) => {
          if (error) {
            handleErrors(error, customText);
            throw {
              statusCode: error.statusCode,
              statusMessage: error.message
            };
          }

          const reports = data.Body.toString()
            .trim()
            .split(/\r?\n/)
            .map((line) => JSON.parse(line));

          const sortedReports = this.reduceReportsToSingleArray(this.combineReportsByUniqueId(reports));
          resolve(sortedReports);
        });
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  handleReports(sortedReports) {
    return new Promise((resolve) => {
      try {
        this.uploadReports(sortedReports).then((reportPromises) => {
          if (!reportPromises.length) {
            throw (this.sendReportMessage.typeMsg = 'noData');
          }
          resolve(this.programmatic);
        });
      } catch (error) {
        const customText = `${ this.programmatic }, error in handleReports`;
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  async uploadReports(reports) {
    const reportsPromises = reports.map((elem) => {
      const inventory_sizes = elem.size;
      const inventory_type = 'banner';

      const object = {
        property: {
          domain: elem.sitename,
          property_id: elem.slotname,
          refs_to_user: null,
          am: null
        },
        inventory: getInventory({ inventory_sizes, inventory_type }),
        inventory_sizes,
        inventory_type,
        clicks: 0,
        ad_request: parseInt(elem.incoming_bid_requests, 10),
        matched_request: parseInt(elem.impressions, 10),
        day: elem.date,
        ecpm: (elem.earnings / 1000000000 / (elem.impressions || 1)) * 1000,
        report_origin: this.programmatic
      };
      return object;
    });
    return await this.saveToDataBase(reportsPromises, true);
  }

  combineReportsByUniqueId(reports) {
    return reports.reduce((acc, report) => {
      if ((report.slotname && report.slotname.toLowerCase() === 'unknown') || !report.slotname) {
        return acc;
      }
      const currentId = `${ report.date }-${ report.sitename }-${ report.size }-${ report.slotname }`;

      acc[currentId] = acc[currentId] ? acc[currentId] : [];

      if (Array.isArray(acc[currentId]) && acc[currentId].length) {
        acc[currentId] = [...acc[currentId], report];
      } else {
        acc[currentId] = [report];
      }
      return acc;
    }, {});
  }

  reduceReportsToSingleArray(reports) {
    const reducedReportsToObject = [];
    const reducedToArray = Object.entries(reports);

    for (const report of reducedToArray) {
      const object = report[1].reduce(
        (acc, report) => {
          return {
            date: report.date,
            sitename: report.sitename,
            size: report.size,
            slotname: report.slotname,
            incoming_bid_requests: acc.incoming_bid_requests + report.incoming_bid_requests,
            impressions: acc.impressions + report.impressions,
            earnings: acc.earnings + report.earnings
          };
        },
        {
          incoming_bid_requests: 0,
          impressions: 0,
          earnings: 0
        }
      );
      reducedReportsToObject.push(object);
    }

    return reducedReportsToObject;
  }
}

exports.AmazonAPI = AmazonAPI;
