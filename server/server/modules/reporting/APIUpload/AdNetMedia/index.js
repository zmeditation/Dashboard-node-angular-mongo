const moment = require('moment');
const ReportSaver = require('../../../../services/reporting/ReportSaver.ts');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const axios = require('axios');
const { reportDates } = require("../../../../services/helperFunctions/dateFunctions");

class AdNetMediaAPI extends ReportSaver {
  /**
   * @typedef {object} AdNetConfig
   * @property {string} grant_type - type of request to Adnet API
   * @property {number} client_id - id from AdNet database
   * @property {string} client_secret - secret value for auth
   * @property {string} username - Adnet username (e-mail)
   * @property {string} password -AdNet password
   */

  /**
   * @typedef {object} Dates - start and end dates of request
   * @property {string} startDate - start date
   * @property {string} endDate - end date
   */

  /**
   * @typedef {object} AdNetAuthData
   * @property {string} token_type - 'Bearer'
   * @property {number} expires_in - token lifetime, 3600 s by default
   * @property {string} access_token - token to access AdNet API
   * @property {string} refresh_token - token to refresh main token
   */

  /**
   * @typedef {object} AdNetReport
   * @property {number} impressions - number of imps
   * @property {string} date - date, format "2021-08-01",
   * @property {string} position_name - ad unit name, like "sur_728x90",
   * @property {string} group - ad unit size, like "728x90",
   * @property {number} viewable_imps - viewable imps
   * @property {number} revenue - revenue
   * @property {number} cpm - CPM value
   * @property {number} viewability - viewability percentage
   * @property {string} site_name - domain
   */

  /**
   * @typedef {object} NBURates
   * @property {number} r030
   * @property {string} txt
   * @property {number} rate
   * @property {string} cc
   * @property {string} exchangedate
   */

  /**
   * @constructor
   * @param {AdNetConfig} config - AdNet config
   */
  constructor(config) {
    super();
    this.config = config;
    this.programmatic = 'AdNet Media';
    this.errorMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  /**
   * @param {string} startDate
   * @param {string} endDate
   * @returns {Promise<string>}
   */
  async start(startDate, endDate) {
    try {
      const { dates, textDate } = this.generateDates(startDate, endDate);
      this.errorMessage.text = textDate;

      const token = await this.getToken(this.config);
      const query = this.generateReqQuery(dates);
      const reports = await this.getReports(token, query, dates.startDate);

      if (reports.length) {
        await this.uploadReports(reports);
      }

      return this.programmatic;
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic })
        .catch(() => sendReport({ message: this.errorMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  /**
   * @param {string} startDate - start date
   * @param {string} endDate - end date
   * @returns {{dates: Dates, textDate: string}}
   */
  generateDates(startDate, endDate) {
    try {
      const dates = {
        startDate: moment().subtract(1, 'days').set({ hour: 0, minute: 0 }).format('YYYY-MM-DD'),
        endDate: moment().set({ hour: 23, minute: 59 }).format('YYYY-MM-DD')
      };

      if (startDate && endDate) {
        [startDate, endDate] = moment(startDate).unix() > moment(endDate).unix() ? [endDate, startDate] : [startDate, endDate];
        dates.startDate = moment(startDate).set({ hour: 0, minute: 0 }).format('YYYY-MM-DD');
        dates.endDate = moment(endDate).set({ hour: 23, minute: 59 }).format('YYYY-MM-DD');
      }

      return {
        dates,
        textDate: reportDates(dates.startDate, dates.endDate).textDate
      };
    } catch (error) {
      this.errorMessage.text = !startDate || !endDate ? textDate : reportDates(startDate, endDate).textDate;
      const customText = `${ this.programmatic }, error in generateDates`;
      checkResponseOnError({ error, customText })
        .catch(() => sendReport({ message: this.errorMessage }));
      handleErrors(error, customText);
    }
  }

  /**
   * @param {AdNetConfig} config
   * @returns {Promise<string>}
   */
  async getToken(config) {
    const axiosConfig = {
      url: "https://api.adnetmedia.lt/api/v2/user/token",
      method: 'POST',
      data: config
    }

    const { data } = await axios(axiosConfig);

    /** @type {AdNetAuthData} */
    const auth = data;
    return auth.access_token;
  }

  /**
   * @param {Dates} dates
   * @returns {string}
   */
  generateReqQuery(dates) {
    return `?period_from=${ dates.startDate }&period_to=${ dates.endDate }&separators=site_id,position_name,group&date_sep=days`;
  }

  /**
   * @param {string} date
   * @param {AdNetReport[]} reports
   * @returns {Promise<AdNetReport[]>}
   */
  async EURtoUSD(date, reports) {
    const NBUEndpoint = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${ date.replace(/-/g, '') }&json`;
    const { data } = await axios.get(NBUEndpoint);

    /**
     * @type {NBURates[]}
     */
    const rates = data;
    const EURRate = rates.filter(rate => rate.cc === 'EUR')[0];
    const USDRate = rates.filter(rate => rate.cc === 'USD')[0];
    const cross = EURRate.rate / USDRate.rate;
    return reports.map(report => {
      report.cpm = parseFloat((report.cpm * cross).toFixed(2));
      return report;
    })
  }

  /**
   * @param {string} token
   * @param {string} query
   * @param {string} date
   * @returns {Promise<AdNetReport[]>}
   */
  async getReports(token, query, date) {
    const config = {
      headers: { Authorization: `Bearer ${ token }` }
    };
    const baseUrl = 'https://api.adnetmedia.lt/api/v2/stats';
    const { data } = await axios.get(baseUrl + query, config);
    return await this.EURtoUSD(date, data.data);
  }

  /**
   * @param {number} cpm
   * @returns {number}
   */
  parseCpm(cpm) {
    return parseFloat(cpm.toFixed(2));
  }

  /**
   * @param {AdNetReport[]} reports
   * @returns {Promise<unknown>}
   */
  async uploadReports(reports) {
    const parsedReports = reports.map(report => {
      const inventory_sizes = report.group;
      const inventory_type = 'banner';
      return {
        property: {
          domain: report.site_name,
          property_id: report.position_name,
          refs_to_user: null,
          am: null
        },
        inventory: getInventory({ inventory_sizes, inventory_type }),
        inventory_sizes,
        inventory_type,
        clicks: 0,
        ad_request: report.impressions,
        matched_request: report.impressions,
        day: report.date,
        ecpm: this.parseCpm(report.cpm),
        report_origin: 'AdNet Media'
      }
    })
    return await this.saveToDataBase(parsedReports, true);
  }
}

exports.AdNetMediaAPI = AdNetMediaAPI;
