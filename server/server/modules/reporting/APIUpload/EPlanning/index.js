const moment = require('moment');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const ReportSaver = require('../../../../services/reporting/ReportSaver');
const { getYesterdayDate, reportDates } = require('../../../../services/helperFunctions/dateFunctions');
const { httpsRequest } = require('../helperFunctions/httpsRequest');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const { isJson } = require('../../../../services/helperFunctions/stringFunctions');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');

class EPlanningAPI extends ReportSaver {
  constructor({ login, password, auth_token, hostname, path }) {
    if (!login || !password || !auth_token) {
      throw new Error('MISSING_CONFIGURATION_VALUES');
    }
    super();
    this.credentials = {
      login,
      password,
      hostname,
      path,
      auth_token
    };
    this.programmatic = 'E-Planning';
    this.sendReportMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  async start(dateForQuery) {
    try {
      const { period, textDate } = this.generateDate(dateForQuery);
      this.sendReportMessage.text = textDate;
      this.getReportPath(this.credentials, period);

      const placements = await this.downloadReport(this.credentials, period);

      await this.preparingObjects(placements, dateForQuery);
      /* Here must logic end of API uploading */
      return this.programmatic;
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  generateDate(date) {
    let textDate = `(${getYesterdayDate().stringDateYesterday})`;

    try {
      const yesterday = moment().subtract(1, 'day').format('DD/MM/YYYY');
      let period = `fecha_inicio=${yesterday}&fecha_fin=${yesterday}`;

      if (date) {
        const startDate = moment(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('DD/MM/YYYY');
        const endDate = moment(date).set({ hour: 23, minute: 59, second: 59 }).format('DD/MM/YYYY');
        period = `fecha_inicio=${startDate}&fecha_fin=${endDate}`;

        textDate = reportDates(startDate, endDate).textDate;
      }

      return {
        period,
        textDate
      };
    } catch (error) {
      const text = !startDate || !endDate ? textDate : reportDates(startDate, endDate).textDate;
      this.sendReportMessage.text = text;
      const customText = `${this.programmatic}, error in generateDate`;
      checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, customText);
    }
  }

  getReportPath(creds, period) {
    creds.path = creds.path + '&' + period;
  }

  downloadReport(options) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in downloadReport.`;

      try {
        const reqOptions = {
          method: 'GET',
          hostname: options.hostname,
          path: options.path,
          headers: {
            Authorization: options.auth_token,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        };

        httpsRequest({ options: reqOptions, customText })
          .then((response) => {
            this.downloadReportHandleResponse(response).then(resolve);
          })
          .catch(() => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  downloadReportHandleResponse(response) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic} response not valid.`;

      try {
        if (isJson(response)) {
          const reportsParsed = JSON.parse(response);

          if (!reportsParsed.data) throw 'response not have field data';
          if (!reportsParsed.data.length) {
            this.sendReportMessage.typeMsg = 'noData';
            checkResponseOnError({ error, customText: `${this.programmatic}, No data in response.` }).catch(() =>
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

  async preparingObjects(reports, date) {
    const reportsPromises = reports.data.map((elem) => {
      const inventory_sizes = this.getInventorySize(elem[1]);
      const inventory_type = this.getInventoryType();

      const object = {
        property: {
          domain: this.getDomain(elem[0]),
          property_id: `${this.getDomain(elem[0])}_${this.getPlacementId(elem[0])}`,
          refs_to_user: null,
          am: null
        },
        inventory: getInventory({ inventory_sizes, inventory_type }),
        inventory_sizes,
        inventory_type,
        clicks: 0,
        ad_request: this.parseFromStringToInt(elem[2]),
        matched_request: this.parseFromStringToInt(elem[3]),
        day: this.getDay(date),
        ecpm: this.parseECPM(elem[6]),
        report_origin: this.programmatic
      };

      return object;
    });

    return this.saveToDataBase(reportsPromises, true);
  }

  getDay(date) {
    if (date) {
      return moment(date).format('YYYY-MM-DD');
    }
    return moment().subtract(1, 'day').format('YYYY-MM-DD');
  }

  getDomain(site) {
    const cutUrl = site.split(/ - /)[0];
    const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(cutUrl);
    return url2[1].toLowerCase();
  }

  getInventorySize(inventory) {
    if (inventory === '- N/A -' || inventory === '0') return 'Other';
    return inventory;
  }

  getPlacementId(space) {
    const id = space.split(/ - /)[2];
    return id;
  }

  getInventoryType(inventory = 'banner') {
    return inventory;
  }

  parseECPM(ecpm) {
    return typeof ecpm === 'string' && ecpm.includes(',') ? parseFloat(ecpm.replace(',', '.')) : parseFloat(ecpm);
  }

  parseFromStringToInt(str) {
    return typeof str === 'string' ? parseInt(str.replace(/,|\./, ''), 10) : str;
  }

  // updateAuthToken() {
  //   return new Promise((resolve, reject) => {
  //     const params = {
  //       method: 'POST',
  //       hostname: 'admin.us.e-planning.net',
  //       path: '/hblogin',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json'
  //       },
  //       body: {
  //         user: 'mpylypenko@wmghb',
  //         password: 'change123',
  //         dologin: 1,
  //         u: '/hblogin'
  //       }
  //     }

  //     const req = https.request(params, (res, re) => {
  //       console.log('statusCode', res.statusCode);
  //       console.log('headers', res.headers);
  //       console.log(res);
  //       res.on('data', (d) => {
  //         /* В ответе приходит контент text/html, но должен приходить application/json
  //         Это из-за того, что период надо передавать на испанском языке */
  //         // console.log(d);
  //         process.stdout.write(d);
  //       })
  //     }).on('error', (e) => {
  //       console.error(e);
  //     });

  //     req.end();
  //   });
  // }
}

exports.EPlanningAPI = EPlanningAPI;
