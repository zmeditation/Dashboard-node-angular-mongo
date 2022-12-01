const moment = require('moment');
const ReportSaver = require('../../../../services/reporting/ReportSaver');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const { reportDates, getYesterdayDate } = require('../../../../services/helperFunctions/dateFunctions');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { httpsRequest } = require('../helperFunctions/httpsRequest');
const { isJson } = require('../../../../services/helperFunctions/stringFunctions');

class RubiconAPI extends ReportSaver {
  constructor({ token }) {
    if (!token) {
      throw new Error('MISSING_CONFIG_DATA');
    }
    super();
    this.headers = {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json'
    };
    this.programmatic = 'Rubicon';
    this.sendReportMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  async start(startDate, endDate) {
    try {
      const { period, textDate } = await this.generateDate(startDate, endDate);
      this.sendReportMessage.text = textDate;

      const options = this.getRequestOptions(period);
      const reports = await this.getReports(options);
      const uploadedReports = await this.uploadReports(reports);

      return this.programmatic;
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  generateDate(startDate, endDate) {
    return new Promise((resolve) => {
      let textDate = `(${getYesterdayDate().stringDateYesterday})`;

      try {
        let period = `daterange=yesterday`;

        if (startDate && endDate) {
          startDate = `${startDate} 00:00:00`;
          endDate = `${endDate} 23:59:59`;
          startDate = moment.utc(startDate).toISOString();
          endDate = moment.utc(endDate).toISOString();
          period =
            moment(startDate).unix() > moment(endDate).unix() ? `start=${endDate}&end=${startDate}` : `start=${startDate}&end=${endDate}`;

          textDate = reportDates(startDate, endDate).textDate;
        }

        resolve({ period, textDate });
      } catch (error) {
        const text = !startDate || !endDate ? textDate : reportDates(startDate, endDate).textDate;
        this.sendReportMessage.text = text;
        const customText = `${this.programmatic}, error in generateDate`;
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  getRequestOptions(period) {
    const publisherId = '19652';
    const dimensions = ['date', 'site_url', 'site_id', 'size', 'ad_format', 'site'].join(',');
    const metrics = ['impressions', 'paid_impression', 'ad_requests', 'ecpm'];

    return {
      method: 'GET',
      host: 'api.rubiconproject.com',
      path: `/analytics/v1/report/?account=publisher/${publisherId}&${period}&dimensions=${dimensions}&metrics=${metrics}`,
      headers: this.headers
    };
  }

  getReports(options) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in getReports.`;

      try {
        if (!options) throw 'missed options.';
        if (!options.host) throw 'missed hostname.';
        if (!options.path) throw 'missed path.';
        if (!options.headers) throw 'missed headers.';

        httpsRequest({ options, customText })
          .then((response) => {
            this.getReportsHandleResponse(response).then(resolve);
          })
          .catch(() => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  getReportsHandleResponse(response) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic} getReportsHandleResponse, response not valid.`;

      try {
        if (isJson(response)) {
          const reportsParsed = JSON.parse(response);

          if (!reportsParsed.data) throw 'response not have field data';
          if (!reportsParsed.data.items) throw 'response not have field items';
          if (!reportsParsed.data.items.length) {
            this.sendReportMessage.typeMsg = 'noData';
            checkResponseOnError({ response: error, error, customText: `${this.programmatic}, Array is ampty, no data.` }).catch(() =>
              sendReport({ message: this.sendReportMessage })
            );
            handleErrors(error, customText);
          }

          return resolve(reportsParsed.data.items);
        } else {
          throw response;
        }
      } catch (error) {
        checkResponseOnError({ response: error, error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  async uploadReports(reports) {
    const customText = `${this.programmatic}, error in uploadReports`;

    try {
      const reportsPromises = reports
        .map((elem, Rubicon) => {
          if (elem.site_id !== '0') {
            const inventory_sizes = this.getInventorySize(elem.size);
            const inventory_type = this.getInventoryType(elem.ad_format);

            const object = {
              property: {
                domain: this.getDomain(elem.site_url, elem.site),
                property_id: `${this.getDomain(elem.site_url, elem.site)}_${this.getInventorySize(elem.size)}_${elem.site_id}`,
                refs_to_user: null,
                am: null
              },
              inventory: getInventory({ inventory_sizes, inventory_type }),
              inventory_sizes,
              inventory_type,
              clicks: 0,
              ad_request: parseInt(elem.ad_requests, 10),
              matched_request: parseInt(elem.paid_impression, 10),
              day: elem.date,
              ecpm: this.cutProgrammaticCommission(this.parseECPM(elem.ecpm)),
              report_origin: this.programmatic
            };
            return object;
          }
        })
        .filter((el) => el !== undefined);
      return await this.saveToDataBase(reportsPromises, true);
    } catch (error) {
      checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, customText);
    }
  }

  getDomain(url, site) {
    const cutUrl = url === '' ? site.split(' ')[0] : url.split(' ')[0];
    const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(cutUrl);
    return url2[1].toLowerCase();
  }

  getInventorySize(inventory) {
    if (inventory === '- N/A -' || inventory === '0') return 'Other';

    const size = /\((.*?)\)/gm.exec(inventory);
    return size[1] === 'Video' ? 'Video/Overlay' : size[1];
  }

  getInventoryType(inventory) {
    return inventory.toLowerCase() === 'display' ? 'banner' : 'video';
  }

  parseECPM(ecpm) {
    return typeof ecpm === 'string' && ecpm.includes(',') ? parseFloat(ecpm.replace(',', '.')) : parseFloat(ecpm);
  }

  cutProgrammaticCommission(cpm) {
    const commission = 20;
    const cpmByPercent = (commission * cpm) / 100;
    return parseFloat(cpm - cpmByPercent);
  }
}

exports.RubiconAPI = RubiconAPI;
