const moment = require('moment');
const ReportSaver = require('../../../../services/reporting/ReportSaver.ts');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const time = require('date-and-time');
const axios = require('axios');
const wait = require('wait');

class MediaNetAPI extends ReportSaver {

  /**
   * @typedef MediaNetReport
   * @property {string} stats_date - report  date, 'YYYYMMDD' format
   * @property {string} domain_name - name of domain
   * @property {string} size - creative size
   * @property {number} creative_id - internal unit name
   * @property {string} creative_name - ad unit mane
   * @property {string} provider_name - "Media.net"
   * @property {number} impressions - number of impressions
   * @property {number} rpm - CPM
   * @property {number} audited_pub_revenue - revenue
   */

  constructor(config) {
    super();
    this.config = config;
    this.programmatic = 'MediaNet';
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
    console.log(`${this.programmatic} starts to download reports`);
    try {
      const { dates } = this.generateDates(startDate, endDate);
      const token = await this.getToken(this.config);
      if (!token) {
        throw new Error(`Cannot receive token from ${this.programmatic} server`);
      }
      const reports = await this.getReports(token, dates);

      if (reports?.length) {
        await this.uploadReports(reports);
      } else {
        throw new Error(`Incorrect or empty data from ${this.programmatic} API`);
      }

      return this.programmatic;
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic })
        .catch(() => sendReport({ message: this.errorMessage || `Error in ${this.programmatic} API upload` }));
      handleErrors(error, this.programmatic);
    }
  }

  /**
   * @param {object } config
   * @param {string} config.login
   * @param {string} config.password
   * @returns {Promise<string | undefined>}
   */
  async getToken(config) {
    const { login, password } = config;
    const url = 'https://neo.media.net/pub/api/v1/login';
    const { data } = await axios.post(url, { user_email: login, password });
    return data?.data?.token;
  }

  /**
   * @param {string} startDate - start date
   * @param {string} endDate - end date
   * @returns {{dates: {start_date: string, end_date: string}}}
   */
  generateDates(startDate, endDate) {
    if (startDate && endDate) {
      return {
        dates: {
          start_date: moment(startDate).format('YYYYMMDD'),
          end_date: moment(endDate).format('YYYYMMDD')
        }
      };
    }

    return {
      dates: {
        start_date: moment().subtract(1, 'day').format('YYYYMMDD'),
        end_date: moment().subtract(1, 'day').format('YYYYMMDD')
      }
    };
  }

  /**
   * @param {string} token
   * @param {Dates} dates
   * @returns {Promise<MediaNetReport[]>}
   */
  async getReports(token, dates) {
    let counter = 0;
    try {
      const headers = { token };
      const url = 'https://neo.media.net/pub/api/v1/reports';
      const dimensions = ['stats_date', 'domain_name', 'size', 'creative_id', 'provider_id'];
      const { start_date, end_date } = dates;
      const request = {
        start_date, end_date, group_by: dimensions
      };
      const { data } = await axios.post(url, request, { headers });
      if (!Array.isArray(data?.data?.rows)) {
        throw new Error(`Cannot get reports from ${this.programmatic} Server!`);
      }
      return data?.data?.rows;
    } catch (e) {
      console.error(e.message || e);
      if (counter <= 10) {
        console.log(`Unsuccessful ${this.programmatic} report download attempt. Wait 20 seconds for next one`);
        await wait(20000);
        await this.getReports(token, dates);
        counter++;
      } else {
        throw new Error(e);
      }
    }
  }

  /**
   * @param {string} date
   * @returns {string}
   */
  parseDate(date) {
    let parsedDate = time.parse(date, 'YYYYMMDD', true);
    return time.format(parsedDate, 'YYYY-MM-DD');
  }

  /**
   * @param {MediaNetReport[]} reports
   * @returns {Promise<any>}
   */
  async uploadReports(reports) {
    const parsedReports = reports.map(report => {
      const inventory_sizes = report.size;
      const inventory_type = 'banner';
      return {
        property: {
          domain: report.domain_name,
          property_id: report.creative_name,
          refs_to_user: null,
          am: null
        },
        inventory: getInventory({ inventory_sizes, inventory_type }),
        inventory_sizes,
        inventory_type,
        clicks: 0,
        ad_request: report.impressions,
        matched_request: report.impressions,
        day: this.parseDate(report.stats_date),
        ecpm: report.rpm,
        report_origin: 'MediaNet'
      };
    });
    return await this.saveToDataBase(parsedReports, true);
  }
}

exports.MediaNetAPI = MediaNetAPI;