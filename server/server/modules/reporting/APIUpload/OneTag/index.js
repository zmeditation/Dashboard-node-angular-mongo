const ReportSaver = require('../../../../services/reporting/ReportSaver.ts');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const csv = require('csvtojson');
const time = require('date-and-time');
const axios = require('axios');
const wait = require('wait');

class OneTagAPI extends ReportSaver {

  /**
   * @typedef OneTagReport
   * @property {string} Day - '16/01/2022'
   * @property {string} Site-BundleId - 'elnorte.com'
   * @property {string} ['Sites & Apps'] - 'elnorte.com'
   * @property {string} Earnings - '0,50'
   * @property {string} ['BID RESPONSE RATE'] - '34,21%'
   * @property {string} WINRATE - '5,72%'
   * @property {string} FILLRATE - '1,84%'
   * @property {string} ['Paid Impression'] - '1256'
   * @property {string} eCPM: '0,40'
   * @property {string} ['Incoming BidRequest'] - '66680'
   * @property {string} ['Auction Win'] - '1256'
   * @property {string} ['Sent BidResponse'] - '21945'
   * @property {string} Impression - '1230'
   */

  constructor() {
    super();
    this.programmatic = 'OneTag';
    this.errorMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  /**
   * @returns {Promise<string>}
   */
  async start() {
    try {
      const reports = await this.getReports();

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
   * @returns {Promise<OneTagReport[]>}
   */
  async getReports() {
    console.log(`${this.programmatic} starts to download reports`);
    let counter = 0;
    try {
      const url = 'https://api.onetag.com/daily_report/?report=4310&key=9b30419bf263694fe6fec87c8fd3bf87&entity=5d0d72448d8bfb0';
      const { data } = await axios.get(url, { responseType: 'arraybuffer' });
      const parsed = await csv().fromString(data.toString());
      if (!parsed || !Array.isArray(parsed)) {
        throw new Error(`Cannot get reports from ${this.programmatic} Server!`);
      }
      parsed.pop(); // remove last element of array, because it's consist of total values
      return parsed;
    } catch (e) {
      counter++;
      console.error(e.message || e);
      if (counter <= 10) {
        console.log(`Unsuccessful ${this.programmatic} report download attempt. Wait 20 seconds for next one`);
        await wait(20000);
        await this.getReports();
      } else {
        throw new Error(e);
      }
    }
  }

  /**
   * @param {string} date - DD/MM/YYYY
   * @returns {string}
   */
  parseDate(date) {
    const parsedDate = time.parse(date, 'DD/MM/YYYY', true);
    return time.format(parsedDate, 'YYYY-MM-DD');
  }

  /**
   * @param {OneTagReport[]} reports
   * @returns {Promise<any>}
   */
  async uploadReports(reports) {
    const parsedReports = reports.map(report => {
      const inventory_sizes = '1x1';
      const inventory_type = 'banner';
      return {
        property: {
          domain: report['Site-BundleId'],
          property_id: `${report['Site-BundleId']}_OneTag`,
          refs_to_user: null,
          am: null
        },
        inventory: getInventory({ inventory_sizes, inventory_type }),
        inventory_sizes,
        inventory_type,
        clicks: 0,
        ad_request: parseInt(report['Incoming BidRequest']),
        matched_request: parseInt(report.Impression),
        day: this.parseDate(report.Day),
        ecpm: parseFloat(report.eCPM.replace(',', '.')),
        report_origin: 'OneTag'
      };
    });
    return await this.saveToDataBase(parsedReports, true);
  }
}

exports.OneTagAPI = OneTagAPI;