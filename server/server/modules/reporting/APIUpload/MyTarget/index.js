const ReportSaver = require('../../../../services/reporting/ReportSaver');
const moment = require('moment');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const { reportDates } = require('../../../../services/helperFunctions/dateFunctions');
const { httpsRequest } = require('../helperFunctions/httpsRequest');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const { isJson } = require('../../../../services/helperFunctions/stringFunctions');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');

class MyTargetAPI extends ReportSaver {
  constructor(args) {
    super();
    this.config = args;
    this.programmatic = 'MyTarget';
    this.sendReportMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  async start(startDate, endDate) {
    try {
      const { dates, textDate } = this.setPeriod(startDate, endDate);
      this.sendReportMessage.text = textDate;

      const reportQueued = await this.getReportId(this.config, dates);
      const allUnits = await this.getUriForReport(this.config);
      const namedReports = this.namingUnits(reportQueued, allUnits);

      const promises = await this.uploadReports(namedReports);
      await this.saveToDataBase(promises, true);

      return this.programmatic;
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  setPeriod(startDate, endDate) {
    if (startDate && endDate) {
      [startDate, endDate] = moment.utc(startDate).unix() > moment.utc(endDate).unix() ? [endDate, startDate] : [startDate, endDate];
      startDate = moment.utc(startDate).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD');
      endDate = moment.utc(endDate).set({ hour: 23, minute: 59, second: 59 }).format('YYYY-MM-DD');
    } else {
      startDate = moment.utc().subtract(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD');
      endDate = moment.utc().subtract(1, 'days').set({ hour: 23, minute: 59, second: 59 }).format('YYYY-MM-DD');
    }

    return {
      dates: {
        startDate,
        endDate
      },
      textDate: reportDates(startDate, endDate).textDate
    };
  }

  getReportId(config, dates) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in getReportId.`;

      try {
        const { token, hostname, path } = config;
        const { startDate, endDate } = dates;
        if (!token) throw 'missed token.';
        if (!hostname) throw 'missed hostname.';
        if (!path) throw 'missed path.';
        if (!startDate) throw 'missed startDate.';
        if (!endDate) throw 'missed endDate.';

        const reqOptions = {
          host: hostname,
          path: `${path}?date_from=${startDate}&date_to=${endDate}`,
          method: 'GET',
          headers: {
            Authorization: token
          }
        };

        httpsRequest({ options: reqOptions, customText })
          .then((response) => {
            this.handleResponses(response).then(resolve);
          })
          .catch(() => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  getUriForReport(config) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in getUriForReport.`;

      try {
        const { token, pathForIds: path, hostname } = config;
        if (!token) throw 'missed token.';
        if (!hostname) throw 'missed hostname.';
        if (!path) throw 'missed path.';

        const reqOptions = {
          host: hostname,
          method: 'GET',
          path,
          headers: {
            Authorization: token
          }
        };

        httpsRequest({ options: reqOptions, customText })
          .then((response) => {
            this.handleResponses(response).then(resolve);
          })
          .catch(() => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  handleResponses(response) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic} response not valid.`;

      try {
        if (isJson(response)) {
          const reportsParsed = JSON.parse(response);

          if (!reportsParsed.items) throw 'response not have field items';
          if (!reportsParsed.items.length) {
            this.sendReportMessage.typeMsg = 'noData';
            checkResponseOnError({ error, customText: `${this.programmatic}, Array is ampty, no data.` }).catch(() =>
              sendReport({ message: this.sendReportMessage })
            );
            handleErrors(error, customText);
          }

          return resolve(reportsParsed);
        } else {
          throw response;
        }
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  namingUnits(reports, listUnits) {
    const result = [];
    reports.items.forEach((el) => {
      for (let i of listUnits.items) {
        if (el.id === i.id) {
          const domain = this.getURL(i.url);
          el.rows.forEach((row) => {
            row.nameUnit = `${el.id}_${domain}`;
            row.url = domain;
            row.size = '-';
            result.push(row);
          });
        }
      }
    });
    return result;
  }

  async uploadReports(reports) {
    // return new Promise((resolve) => {
    const customText = `${this.programmatic}, error in uploadReports`;

    try {
      return reports.map((report) => {
        const inventory_sizes = report['size'];
        const inventory_type = this.getInventoryType();

        const object = {
          property: {
            domain: report['url'],
            property_id: report['nameUnit'],
            refs_to_user: null,
            am: null
          },
          inventory: getInventory({ inventory_sizes, inventory_type }),
          inventory_sizes,
          inventory_type,
          clicks: this.convertToInteger(report['clicks']),
          ad_request: this.convertToInteger(report['requests']),
          matched_request: this.convertToInteger(report['shows']),
          day: this.parseDate(report['date']),
          ecpm: this.parseECPM(report['cpm']),
          report_origin: this.programmatic
        };
        return object;
      });
    } catch (error) {
      checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, customText);
    }
    // });
  }

  getURL(url) {
    const cutUrl = url.split(' ')[0];
    const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(cutUrl);
    return url2[1].toLowerCase();
  }

  getInventoryType() {
    return 'banner';
  }

  parseECPM(ecpm) {
    return parseFloat(ecpm);
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

exports.MyTargetAPI = MyTargetAPI;
