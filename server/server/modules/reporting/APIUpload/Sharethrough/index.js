const moment = require('moment');
const ReportSaver = require('../../../../services/reporting/ReportSaver.ts');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const axios = require('axios');
const wait = require('wait');

class SharethroughAPI extends ReportSaver {

  /**
   * @typedef SharethroughReport
   * @property {string} DOMAIN "mail.ru"
   * @property {string} CREATIVE_TYPE "banner"
   * @property {string} PLACEMENT_NAME "Prebid_320x50"
   * @property {string} DATE "2022-01-01"
   * @property {string} PLACEMENT_SIZE "320x50"
   * @property {number} RENDERED_IMPRESSIONS 1200
   * @property {number} PUB_EARNINGS 1.5403
   * @property {number} CPM 1.2836
   * @property {number} CLICKS 0
   */

  constructor(config) {
    super();
    this.config = config;
    this.programmatic = 'Sharethrough';
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
      const { token } = this.config;
      const reports = await this.getReports(token, dates);

      if (reports.length) {
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
   * @param {string} startDate - start date
   * @param {string} endDate - end date
   * @returns {{dates: {endDate: string, startDate: string}}}
   */
  generateDates(startDate, endDate) {
    if (startDate && endDate) {
      return {
        dates: {
          startDate: moment(startDate).format('YYYY-MM-DD'),
          endDate: moment(endDate).format('YYYY-MM-DD')
        }
      };
    }

    return {
      dates: {
        startDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        endDate: moment().subtract(1, 'day').format('YYYY-MM-DD')
      }
    };
  }

  /**
   * @param {string} token
   * @param {Dates} dates
   * @returns {Promise<SharethroughReport[]>}
   */
  async getReports(token, dates) {
    let counter = 0;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const url = 'https://reporting-api.sharethrough.com/v2/programmatic';
      const fields = ['rendered_impressions', 'pub_earnings', 'cpm', 'clicks'];
      const groupBy = ['domain', 'placement_name', 'date', 'placement_size'];
      const timezone = 'Europe/Kiev';
      const { startDate, endDate } = dates;
      const request = {
        startDate,
        endDate,
        fields,
        groupBy,
        timezone
      };
      const { data } = await axios.post(url, request, { headers });
      if (!Array.isArray(data.results)) {
        throw new Error(`Cannot get reports from ${this.programmatic} Server!`);
      }
      return data?.results;
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
   * @param {SharethroughReport[]} reports
   * @returns {Promise<any>}
   */
  async uploadReports(reports) {
    const parsedReports = reports.map(report => {
      const inventory_sizes = report.PLACEMENT_SIZE;
      const inventory_type = report.CREATIVE_TYPE === 'banner' ? report.CREATIVE_TYPE : 'video';
      return {
        property: {
          domain: report.DOMAIN,
          property_id: `${report.DOMAIN}_${report.PLACEMENT_NAME}`,
          refs_to_user: null,
          am: null
        },
        inventory: getInventory({ inventory_sizes, inventory_type }),
        inventory_sizes,
        inventory_type,
        clicks: report.CLICKS,
        ad_request: report.RENDERED_IMPRESSIONS,
        matched_request: report.RENDERED_IMPRESSIONS,
        day: report.DATE,
        ecpm: report.CPM,
        report_origin: 'Sharethrough'
      };
    });
    return await this.saveToDataBase(parsedReports, true);
  }
}

exports.SharethroughAPI = SharethroughAPI;