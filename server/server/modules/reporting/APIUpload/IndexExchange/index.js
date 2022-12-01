const moment = require('moment');
const ReportSaver = require('../../../../services/reporting/ReportSaver.ts');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const axios = require('axios');
const wait = require('wait');
const csv = require('csvtojson');

class IndexExchangeAPI extends ReportSaver {

  /**
   * @typedef IndexExchangeReport
   * @property {string} creative_type - "Banner"
   * @property {string} domain - "elnorte.com"
   * @property {string} site_name - "Mail.ru_mobile_short_320x50"
   * @property {string} size - "320x50"
   * @property {string} day - "2022-01-15 00:00:00"
   * @property {string} impressions - "1267"
   * @property {string} slot_request - "243173"
   * @property {string} ecpm - "2.15491158642462509865825000"
   */

  constructor(config) {
    super();
    this.config = config;
    this.programmatic = 'IndexExchange';
    this.errorMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
    this.token = '';
    this.refreshToken = '';
  }

  /**
   * Main procedure to download and save reports from IndexExchange
   * @param {string} startDate
   * @param {string} endDate
   * @returns {Promise<string>}
   */
  async start(startDate, endDate) {
    console.log(`${this.programmatic} starts to download reports`);
    try {
      await this.getTokens(this.config);
      const { dates } = this.generateDates(startDate, endDate);
      const reportSpecID = await this.buildReport(dates); // build and save report on IE part
      const reportRunID = await this.runReport(reportSpecID); // run created report
      let reports = await this.downloadAndParseReports(reportRunID); // download report CSV and parse it

      if (reports?.length) {
        await this.uploadReports(reports);
      }

      return this.programmatic;
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic })
        .catch(() => sendReport({ message: this.errorMessage || `Error in ${this.programmatic} API upload` }));
      handleErrors(error, this.programmatic);
    }
  }

  /**
   * Get current dates or format input
   * @param {string} startDate - start date
   * @param {string} endDate - end date
   * @returns {{dates: {from: string, to: string}}}
   */
  generateDates(startDate, endDate) {
    if (startDate && endDate) {
      return {
        dates: {
          from: moment(startDate).format('YYYY-MM-DD'),
          to: moment(endDate).format('YYYY-MM-DD')
        }
      }
    }

    return {
      dates: {
        from: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
      }
    }
  }

  /**
   * Get refresh and access tokens
   * @param {string} config.username
   * @param {string} config.password
   * @returns {Promise<boolean>}
   */
  async getTokens(config) {
    const { username, password } = this.config;
    const url = 'https://app.indexexchange.com/api/authentication/v1/login';
    /**
     * @property {object} data
     * @property {object} data.loginResponse
     * @property {object} data.loginResponse.authResponse
     * @property {string} data.loginResponse.authResponse.access_token
     * @property {number} data.loginResponse.authResponse.expires_in
     * @property {string} data.loginResponse.authResponse.refresh_token
     * @property {string} data.loginResponse.authResponse.token_type
     * @property {string} data.loginResponse.authResponse.id_token
     */
    const { data } = await axios.post(url, { username, password });
    console.log(data);
    const { access_token: token, refresh_token: refreshToken } = data.loginResponse.authResponse;
    if (!token || !refreshToken) {
      throw new Error(`Cannot receive token from ${this.programmatic} server`);
    }
    this.token = token;
    this.refreshToken = refreshToken;
    return true;
  }

  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise<string | undefined>}
   */
  async RefreshToken(refreshToken) {
    const url = 'https://app.indexexchange.com/api/authentication/v1/refresh';
    const { data } = await axios.post(url, { refreshToken });
    return data?.access_token;
  }

  /**
   * Config and build daily report with selected params
   * @param {object} dates
   * @param {string} dates.from
   * @param {string} dates.to
   * @returns {Promise<number>}
   */
  async buildReport(dates) {
    const { from, to } = dates;
    const accountId = 196291;
    const hash = (Math.random() + 1).toString(36).substring(5);
    const reportTitle = `WMG Daily Report ${from}-${to} ${hash}`;
    const fileType = 'csv';
    const fields = [
      'creative_type',
      'domain',
      'site_name',
      'size',
      'day',
      'impressions',
      'slot_request',
      'ecpm'
    ];
    const reportRequestBody = {
      accounts: [accountId],
      fileType,
      reportTitle,
      querySpec: { fields },
      dateRange: { from, to }
    };
    const url = 'https://app.indexexchange.com/api/reporting/agg/v1/report-specs';
    const headers = { 'Authorization': `Bearer ${this.token}` };
    /**
     * @property {object} data
     * @property {number} data.reportSpecID
     */
    const { data } = await axios.post(url, reportRequestBody, { headers });
    return data?.reportSpecID;
  }

  /**
   * Start run-report routine
   * @param {number}reportID
   * @returns {Promise<number>}
   */
  async runReport(reportID) {
    const url = 'https://app.indexexchange.com/api/reporting/agg/v1/report-runs';
    const headers = { 'Authorization': `Bearer ${this.token}` };
    /**
     * @property {object} data
     * @property {number} data.reportRunID
     */
    const { data } = await axios.post(url, { reportID }, { headers });
    return data?.reportRunID;
  }

  /**
   * Download report as CSV file and parse it
   * @param {number} fileID
   * @returns {Promise<IndexExchangeReport[]>}
   */
  async downloadAndParseReports(fileID) {
    try {
      const url = 'http://app.indexexchange.com/api/reporting/agg/v1/report-files/download/' + fileID;
      console.log({ url });
      await wait(30000);
      const token = await this.RefreshToken(this.refreshToken);
      const headers = { 'Authorization': `Bearer ${token}` };
      await wait(30000);
      const config = {
        headers,
        responseType: 'stream'
      };
      const response = await axios.get(url, config);
      return new Promise((resolve, reject) => {
        let file = '';
        response.data.on('readable', () => {
          let chunk;
          while (null !== (chunk = response.data.read())) {
            file += chunk;
            console.log(`Read ${chunk.length} bytes of data...`);
          }
        });
        response.data.on('close', async () => {
          const parsed = await csv().fromString(file.toString());
          if (!parsed) {
            reject('No reports or error occurred');
          }
          resolve(parsed.filter(report => report.impressions !== '0'));
        });
      });
    } catch (e) {
      console.error(e.message);
      return [];
    }
  }

  /**
   * Convert date from 'YYYY-MM-DD HH:MM:SS' to 'YYYY-MM-DD'
   * @param {string} date
   * @returns {string}
   */
  parseDate(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * If property looks like 'Kommersant.ru - Desktop - Kommersant_970x250_n1HB - 970x250', save it as 'Kommersant_970x250_n1HB'
   * @param {string} propertyName
   * @returns {string}
   */
  beautifyProperty(propertyName) {
    if (propertyName.includes('Desktop') || propertyName.includes('Mobile')) {
      const arr = propertyName.split(' - ');
      return arr[2];
    }
    return propertyName;
  }

  /**
   * Upload parsed reports to DB
   * @param {IndexExchangeReport[]} reports
   * @returns {Promise<any>}
   */
  async uploadReports(reports) {
    const parsedReports = reports.map(report => {
      const inventory_sizes = report.size;
      const inventory_type = report.creative_type.toLowerCase();
      return {
        property: {
          domain: report.domain,
          property_id: this.beautifyProperty(report.site_name),
          refs_to_user: null,
          am: null
        },
        inventory: getInventory({ inventory_sizes, inventory_type }),
        inventory_sizes,
        inventory_type,
        clicks: 0,
        ad_request: parseInt(report.slot_request),
        matched_request: parseInt(report.impressions),
        day: this.parseDate(report.day),
        ecpm: parseFloat(report.ecpm),
        report_origin: 'IndexExchange'
      };
    });
    return await this.saveToDataBase(parsedReports, true);
  }
}

exports.IndexExchangeAPI = IndexExchangeAPI;