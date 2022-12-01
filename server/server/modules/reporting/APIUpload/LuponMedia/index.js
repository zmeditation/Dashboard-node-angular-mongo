const moment = require('moment');
const ReportSaver = require('../../../../services/reporting/ReportSaver.ts');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const axios = require('axios');

class LuponMediaAPI extends ReportSaver {

  /**
   * @typedef {object} LuponReport
   * @property {number} site_id - id of site in Lupon dashboard
   * @property {string} domain - site domain
   * @property {string} metric - by default site_id (as string), can be device_type or geo
   * @property {string} total_requests - total requests
   * @property {number} matched_requests - matched requests
   * @property {number} impressions - impressions
   * @property {string} revenue - revenue
   * @property {string | null} cpm - cpm '0.28' | null
   * @property {string} date - date
   */

  /**
   * @constructor
   * @param {string} token
   */
  constructor({ token }) {
    super();
    this.token = token;
    this.programmatic = 'Lupon Media';
    this.errorMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  /**
   *
   * @param {string | undefined} date
   * @returns {Promise<string>}
   */
  async start(date) {
    try {
      const targetDate = this.getDate(date);
      this.errorMessage.text = targetDate;
      const query = this.generateReqQuery(targetDate);
      const reports = await this.getReports(query);

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
   * @param {string | undefined} date
   * @returns {string}
   */
  getDate(date) {
    if (!date) {
      return moment().subtract(1, 'days').format('YYYY-MM-DD');
    }
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * @param {string} date
   * @returns {string}
   */
  generateReqQuery(date) {
    return `${ date }?api_token=${ this.token }`;
  }

  /**
   * @typedef {object} NBURates
   * @property {number} r030
   * @property {string} txt
   * @property {number} rate
   * @property {string} cc
   * @property {string} exchangedate
   */

  /**
   * @param {string} date
   * @param {LuponReport[]} reports
   * @returns {Promise<LuponReport[]>}
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

    return reports
      .filter(report => report.cpm !== null)
      .map(report => {
        report.cpm = (report.cpm * cross).toFixed(2);
        return report;
      })
  }

  /**
   * @param {string} query
   * @returns {Promise<LuponReport[]>}
   */
  async getReports(query) {
    const baseUrl = 'http://adxpremium.services/api/getReport/';
    const { data } = await axios.get(baseUrl + query);
    const metrics = data.report.metrics;
    const date = data.report.period;
    if (metrics.length) {
      for (const report of metrics) {
        report.date = date;
      }
    }
    return await this.EURtoUSD(date, metrics);
  }

  /**
   * @param {string | null} cpm
   * @returns {number}
   */
  parseCpm(cpm) {
    return cpm ? parseFloat(cpm) : 0;
  }

  /**
   * @param {LuponReport} report
   * @returns {string}
   */
  getPropertyId(report) {
    return `${ report.domain }_lupon_${ report.metric }`;
  }

  /**
   * @param {LuponReport[]} reports
   * @returns {Promise<unknown>}
   */
  async uploadReports(reports) {
    const parsedReports = reports.map(report => {
      const inventory_sizes = '1x1';
      const inventory_type = 'banner';
      return {
        property: {
          domain: report.domain.replace('_wmg', ''),
          property_id: this.getPropertyId(report),
          refs_to_user: null,
          am: null
        },
        inventory: getInventory({ inventory_sizes, inventory_type }),
        inventory_sizes,
        inventory_type,
        clicks: 0,
        ad_request: parseInt(report.total_requests),
        matched_request: report.impressions,
        day: report.date,
        ecpm: this.parseCpm(report.cpm),
        report_origin: 'Lupon Media'
      }
    })
    return await this.saveToDataBase(parsedReports, true);
  }
}

exports.LuponMediaAPI = LuponMediaAPI;
