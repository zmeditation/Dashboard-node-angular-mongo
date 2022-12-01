const moment = require('moment');
const ReportSaver = require('../../../../services/reporting/ReportSaver');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const { reportDates } = require('../../../../services/helperFunctions/dateFunctions');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const { httpsRequest } = require('../helperFunctions/httpsRequest');
const { isJson } = require('../../../../services/helperFunctions/stringFunctions');
const querystring = require('querystring');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const ProgrammaticHandler = require('../helperFunctions/programmaticHandlers');

class DistrictMAPI extends ReportSaver {
  constructor({ clientId, clientSecret }) {
    if (!clientId || !clientSecret) {
      throw new Error('MISSING_CONFIG_DATA');
    }
    super();
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.programmatic = 'DistrictM';
    this.sendReportMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
    this.handler = new ProgrammaticHandler(this.programmatic);
  }

  async start(startDate, endDate) {
    try {
      const { dates, textDate } = this.generateDates(startDate, endDate);
      this.sendReportMessage.text = textDate;

      const token = await this.getToken(this.clientId, this.clientSecret);
      const body = this.getBody(dates);
      const reports = await this.getReports(token, body);
      const editedReports = await this.uploadAllReports(reports);
      if (!editedReports.length) {
        throw (this.sendReportMessage.typeMsg = 'noData');
      }

      return this.programmatic;
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  generateDates(startDate, endDate) {
    try {
      const dates = {
        startDate: moment().subtract(1, 'days').set({ hour: 0, minute: 0 }).format('YYYY/MM/DD'),
        endDate: moment().set({ hour: 23, minute: 59 }).format('YYYY/MM/DD')
      };

      if (startDate && endDate) {
        [startDate, endDate] = moment(startDate).unix() > moment(endDate).unix() ? [endDate, startDate] : [startDate, endDate];
        dates.startDate = moment(startDate).set({ hour: 0, minute: 0 }).format('YYYY/MM/DD');
        dates.endDate = moment(endDate).add(1, 'days').set({ hour: 23, minute: 59 }).format('YYYY/MM/DD');
      }

      return {
        dates,
        textDate: reportDates(dates.startDate, dates.endDate).textDate
      };
    } catch (error) {
      const text = !startDate || !endDate ? textDate : reportDates(startDate, endDate).textDate;
      this.sendReportMessage.text = text;
      const customText = `${this.programmatic}, error in generateDates`;
      checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, customText);
    }
  }

  getToken(clientId, clientSecret) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in  getToken.`;

      try {
        const postData = querystring.stringify({ grant_type: 'client_credentials' });

        const reqOptions = {
          method: 'POST',
          hostname: 'api.districtm.ca',
          path: '/oauth/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          },
          auth: `${clientId}:${clientSecret}`
        };

        httpsRequest({ options: reqOptions, customText, bodyChunk: postData })
          .then((response) => {
            this.handleTokenResponse(response).then(resolve);
          })
          .catch(() => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  handleTokenResponse(response) {
    return new Promise((resolve) => {
      try {
        const receiveToken = (res) => {
          if (isJson(res)) {
            const { access_token } = JSON.parse(res);
            return access_token ? access_token : false;
          }
          return false;
        };

        const token = receiveToken(response);
        if (token) {
          return resolve(token);
        }

        const customText = `${this.programmatic}, getToken response is not valid.`;
        sendReport({ message: this.sendReportMessage });
        checkResponseOnError({ error: response, customText });
      } catch (error) {
        handleErrors(error, 'handleTokenResponse');
      }
    });
  }

  getBody(dates) {
    return {
      model: 'api',
      view: 'boost3_metrics_api',
      fields: [
        'boost3_metrics_api.day_date',
        'boost3_metrics_api.domain_name',
        'boost3_metrics_api.zone_name',
        'boost3_metrics_api.media_type',
        'boost3_metrics_api.placement_id',
        'boost3_metrics_api.adsize',
        'boost3_metrics_api.tagname',
        'boost3_metrics_api.ad_requests',
        'boost3_metrics_api.net_ecpm_usd',
        'boost3_metrics_api.matched_ad_requests'
      ],
      filters: {
        'boost3_metrics_api.day_date': `${dates.startDate} to ${dates.endDate}`
      }
    };
  }

  getReports(token, body) {
    return new Promise((resolve) => {
      if (!token) {
        throw 'missing token';
      }
      if (!body) {
        throw 'missing body';
      }

      const postData = JSON.stringify(body);
      const reqOptions = {
        method: 'POST',
        hostname: 'api.districtm.ca',
        path: '/looker/queries/json',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const customText = `${this.programmatic} downloadReports`;
      httpsRequest({ options: reqOptions, customText, bodyChunk: postData })
        .then((response) => {
          this.handler.handleReportsResponse(response, this.sendReportMessage).then(resolve);
        })
        .catch(() => sendReport({ message: this.sendReportMessage }));
    });
  }

  async uploadAllReports(reports) {
    const reportsPromises = reports
      .map((elem) => {
        if (elem['boost3_metrics_api.net_ecpm_usd']) {
          const inventory_sizes = this.getInventorySize(elem['boost3_metrics_api.adsize'], elem['boost3_metrics_api.media_type']);
          const inventory_type = this.getInventoryType(elem['boost3_metrics_api.media_type']);

          const object = {
            property: {
              domain: this.getDomain(elem['boost3_metrics_api.domain_name']),
              property_id: elem['boost3_metrics_api.zone_name'],
              refs_to_user: null,
              am: null
            },
            inventory: getInventory({ inventory_sizes, inventory_type }),
            inventory_type,
            inventory_sizes,
            clicks: 0,
            ad_request: this.parseRequests(elem['boost3_metrics_api.ad_requests']),
            matched_request: this.parseRequests(elem['boost3_metrics_api.matched_ad_requests']),
            day: elem['boost3_metrics_api.day_date'],
            ecpm: parseFloat(elem['boost3_metrics_api.net_ecpm_usd']),
            report_origin: this.programmatic
          };

          return object;
        }
      })
      .filter((elem) => elem !== undefined);

    return await this.saveToDataBase(reportsPromises, true);
  }

  getDomain(url) {
    const cutUrl = url.split(' ')[0];
    const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(cutUrl);
    return url2[1].toLowerCase();
  }

  getInventorySize(inventorySize, inventoryType) {
    return inventoryType === 'video' ? 'Video/Overlay' : inventorySize;
  }

  getInventoryType(inventory) {
    return inventory.toLowerCase() === 'banner' ? 'banner' : 'video';
  }

  parseECPM(ecpm) {
    return typeof ecpm === 'string' && ecpm.includes(',') ? parseFloat(ecpm.replace(',', '.')) : parseFloat(ecpm);
  }

  parseRequests(string) {
    return parseFloat(string.replace(/,/g, ''));
  }
}

exports.DistrictMAPI = DistrictMAPI;
