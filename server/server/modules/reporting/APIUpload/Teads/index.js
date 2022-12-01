const ReportSaver = require('../../../../services/reporting/ReportSaver');
const moment = require('moment');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const { reportDates } = require('../../../../services/helperFunctions/dateFunctions');
const { httpsRequest } = require('../helperFunctions/httpsRequest');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { isJson } = require('../../../../services/helperFunctions/stringFunctions');
const Iterator = require('../../../../utils/iterator');

class TeadsAPI extends ReportSaver {
  constructor(args) {
    super();
    this.config = args;
    this.programmatic = 'Teads';
    this.sendReportMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  async start(startDate, endDate) {
    try {
      const { period, textDate } = this.setPeriod(startDate, endDate);
      this.sendReportMessage.text = textDate;

      const reportId = await this.getReportId(this.config, period);
      const uri = await this.getUriForReport(reportId);

      const report = await this.downloadReport(uri);

      const formatedReports = await this.formatedReports(report);
      const allReports = await this.beginAPIUpload(formatedReports);

      if (!allReports.length) {
        throw (this.sendReportMessage.typeMsg = 'noData');
      }

      return this.programmatic;
    } catch (error) {
      // checkResponseOnError({ error, customText: this.programmatic })
      //   .catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  setPeriod(startDate, endDate) {
    if (startDate && endDate) {
      [startDate, endDate] = moment.utc(startDate).unix() > moment.utc(endDate).unix() ? [endDate, startDate] : [startDate, endDate];
      startDate = moment.utc(startDate).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss+HH:mm');
      endDate = moment.utc(endDate).set({ hour: 23, minute: 59, second: 59 }).format('YYYY-MM-DDTHH:mm:ss+HH:mm');
    } else {
      startDate = moment
        .utc()
        .subtract(1, 'days')
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .format('YYYY-MM-DDTHH:mm:ss+HH:mm');
      endDate = moment.utc().subtract(1, 'days').set({ hour: 23, minute: 59, second: 59 }).format('YYYY-MM-DDTHH:mm:ss+HH:mm');
    }

    return {
      period: {
        startDate,
        endDate
      },
      textDate: reportDates(startDate, endDate).textDate
    };
  }

  getReportId(config, period) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in getReportId`;

      try {
        const { token, hostname, path } = config;
        const { startDate, endDate } = period;
        const options = {
          method: 'POST',
          hostname,
          path,
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        };

        if (!token) throw 'missed token.';
        if (!hostname) throw 'missed hostname.';
        if (!path) throw 'missed path.';
        if (!startDate) throw 'missed startDate.';
        if (!endDate) throw 'missed endDate.';

        const postData = JSON.stringify({
          dimensions: [
            'day',
            'placement',
            // "format_position",
            // "format_size",
            'website_domain'
          ],
          filters: {
            date: {
              start: startDate,
              end: endDate
            }
          },
          metrics: ['placementCall', 'impression', 'click', 'publisher_billable_volume', 'teads_billing-usd'],
          format: 'jsonv1'
        });

        httpsRequest({ options, customText, bodyChunk: postData })
          .then((response) => {
            this.getReportIdHandleResponse(response).then(resolve);
          })
          .catch((error) => handleErrors(error, customText));
        // .catch(() => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        // checkResponseOnError({ error, customText })
        //   .catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  getReportIdHandleResponse(response) {
    return new Promise((resolve) => {
      try {
        if (isJson(response)) {
          const parsedResponse = JSON.parse(response);
          const reportId = parsedResponse.id;

          if (!reportId) throw `reportId is ${reportId}`;

          resolve(reportId);
        } else {
          throw response;
        }
      } catch (error) {
        const customText = `${this.programmatic}, getReportIdHandleResponse response not valid`;

        // checkResponseOnError({ response, error, customText })
        //     .catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  getUriForReport(reportId) {
    return new Promise(async (resolve) => {
      try {
        const maxIterateCount = 4;
        const getUri = this.requestForReportUri.bind(this);
        const iteratorParams = {
          from: 0,
          to: maxIterateCount,
          limit: 1,
          asyncFunction: getUri,
          asyncFuncParams: { reportId, config: this.config }
        };
        const iterateObj = Iterator.default.generateAsyncLimitIterator(iteratorParams);

        let iterateCount = 0;
        let uri = null;

        for await (let value of iterateObj) {
          if (value) {
            uri = value;
            break;
          }
          ++iterateCount;
        }

        if (iterateCount >= 4 && !uri) {
          throw 'Exceeded attempts to get uri';
        }

        resolve(uri);
      } catch (error) {
        const customText = `${this.programmatic}, error in getUriForReport`;

        // checkResponseOnError({ error, customText })
        //   .catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  requestForReportUri({ reportId, config }) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in requestForReportUri`;

      try {
        const { hostname, path, token } = config;

        if (!reportId) throw 'missed reportId.';
        if (!token) throw 'missed token.';
        if (!hostname) throw 'missed hostname.';
        if (!path) throw 'missed path.';

        const options = {
          method: 'GET',
          hostname,
          path: path + reportId,
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        };

        httpsRequest({ options, customText })
          .then((response) => {
            this.requestForReportUriHandleResponse(response).then(resolve);
          })
          .catch((error) => handleErrors(error, customText));
        // .catch(() => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        // checkResponseOnError({ error, customText })
        //     .catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  requestForReportUriHandleResponse(response) {
    return new Promise((resolve) => {
      try {
        if (isJson(response)) {
          const parsedResponse = JSON.parse(response);
          const uri = parsedResponse.uri;
          resolve(uri);
        } else {
          throw response;
        }
      } catch (error) {
        const customText = `${this.programmatic}, requestForReportUriHandleResponse response not valid`;

        // checkResponseOnError({ response, error, customText })
        //   .catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  //
  // Not checked method downloadReport
  //
  downloadReport(url) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in downloadReport`;

      try {
        const { hostname, path } = url;

        if (!hostname) throw 'missed hostname.';
        if (!path) throw 'missed path.';

        const options = {
          method: 'GET',
          hostname,
          path,
          headers: {
            // 'Authorization': token,
            'Content-Type': 'application/json'
          }
        };

        httpsRequest({ options, customText })
          .then((response) => {
            this.downloadReportHandleResponse(response).then(resolve);
          })
          .catch((error) => handleErrors(error, customText));
        // .catch(() => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        // checkResponseOnError({ error, customText })
        //   .catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  //
  // Not checked method downloadReportHandleResponse
  //
  downloadReportHandleResponse(response) {
    return new Promise((resolve) => {
      try {
        if (isJson(response)) {
          const parsedResponse = JSON.parse(response);
          resolve(parsedResponse);
        } else {
          throw response;
        }
      } catch (error) {
        const customText = `${this.programmatic}, requestForReportUriHandleResponse response not valid`;

        // checkResponseOnError({ response, error, customText })
        //   .catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  async formatedReports(report) {
    const changedObject = [],
      allMetrics = report.dimensions;
    for (let i of report.metrics) {
      allMetrics.push(i);
    }
    for (let i of report.lines) {
      const lineObject = {};
      allMetrics.forEach((el, index) => {
        lineObject[el] = i[index];
      });
      changedObject.push(lineObject);
    }
    return changedObject;
  }

  async beginAPIUpload(reports) {
    const reportsPromises = reports.map((report) => {
      const inventory_sizes = this.inventorySizes();
      const inventory_type = this.getInventoryType();

      const object = {
        property: {
          domain: this.getURL(report['website_domain']),
          property_id: this.getAdUnit(report['placement']),
          refs_to_user: null,
          am: null
        },
        inventory: getInventory({ inventory_sizes, inventory_type }),
        inventory_sizes,
        inventory_type,
        clicks: this.convertToInteger(report['click']),
        ad_request: this.convertToInteger(report['placementCall']),
        matched_request: this.convertToInteger(report['impression']),
        day: this.parseDate(report['day']),
        ecpm: this.parseECPM(report['impression'], report['teads_billing-usd']),
        report_origin: 'Teads'
      };
      return object;
    });

    return await this.saveToDataBase(reportsPromises, true);
  }

  getURL(url) {
    const cutUrl = url.split(' ')[0];
    const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(cutUrl);
    return url2[1].toLowerCase();
  }

  getAdUnit(string) {
    let replBegin = string.replace(/[0-9]*.- /i, '');
    return replBegin.toLowerCase();
  }

  inventorySizes() {
    return '300x250';
  }

  getInventoryType() {
    return 'banner';
  }

  parseECPM(imp, rev) {
    imp = parseInt(imp.replace(/ /g, ''));
    rev = Math.round(parseFloat(rev) * 10000) / 10000;
    const ecpm = imp !== 0 ? Math.round((rev / imp) * 1000 * 100) / 100 : 0.0;
    return ecpm;
  }

  parseDate(date) {
    return date.replace(/\//g, '-');
  }

  convertToInteger(string) {
    if (typeof string === 'string') {
      string = string.replace(/ /g, '');
      return string.includes(',') ? parseFloat(string.split(',').join('')) : parseInt(string);
    }
    return string;
  }
}

exports.TeadsAPI = TeadsAPI;
