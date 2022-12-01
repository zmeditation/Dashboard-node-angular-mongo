const ReportSaver = require('../../../../services/reporting/ReportSaver');
const { BigQuery } = require('@google-cloud/bigquery');
const pathToKey = `${ __dirname }/rtb_account_key.json`;
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const { getYesterdayDate } = require('../../../../services/helperFunctions/dateFunctions');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');

class RTBHouseAPI extends ReportSaver {
  constructor() {
    super();
    this.programmatic = 'RTB House';
    this.sendReportMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  async start(startDate, endDate) {
    try {
      const { dateString, textDate } = this.getRangeOfDays(startDate, endDate);
      this.sendReportMessage.text = textDate;
      const access = this.getAccountBigQuery();
      const rows = await this.getRows(access, dateString);
      const status = await this.beginAPIUpload(rows);

      if (status.includes('reports of RTB House uploaded successful!')) {
        return this.programmatic;
      } else {
        checkResponseOnError({ error, customText: `${ this.programmatic }, no reports length.` }).catch(() =>
          sendReport({ message: this.sendReportMessage })
        );
        handleErrors(error, customText);
      }
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  getRangeOfDays(startDate, endDate) {
    try {
      let toDay, rangeOfDays, dateString;
      if (!startDate || !endDate) {
        toDay = new Date().toISOString().split('T')[0];
        rangeOfDays = -1;
        dateString = `datestamp = DATE_ADD("${ toDay }", INTERVAL ${ rangeOfDays } DAY)`;

        return {
          dateString,
          textDate: `(${ getYesterdayDate().stringDateYesterday })`
        };
      }

      dateString = `datestamp BETWEEN '${ startDate }' AND '${ endDate }'`;
      const textDate = `(${ startDate } -- ${ endDate })`;

      return {
        dateString,
        textDate
      };
    } catch (error) {
      const customText = `${ this.programmatic }, error in getRangeOfDays.`;
      checkResponseOnError({ error, customText })
        .catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, customText);
    }
  }

  getAccountBigQuery() {
    const options = {
      keyFilename: pathToKey,
      projectId: 'rtb-house-api'
    };
    return new BigQuery(options);
  }

  async getRows(bigquery, dateString) {
    try {
      const query = `SELECT datestamp AS date,slot_name,site_name AS site,bid_request_domain AS domain,ad_type,ad_width_x_height AS size,impressions,cost_usd AS revenue,device_type
                FROM \`inventory-infogate-prod.UA_WMG_prebid.ads_data_last_45_days\`
                WHERE ${dateString} AND ssp = 'prebid' AND publisher_name = 'L9mpDKGuioBmI257VKeJ' AND (impressions IS NOT NULL) AND slot_name IS NOT NULL
                ORDER BY datestamp,slot_name`;

      const options = {
        query: query,
        location: 'EU'
        // Location must match that of the dataset(s) referenced in the query.
      };

      // Run the query as a job
      const [job] = await this.runBigQueryCreateQueryJob(options, bigquery);
      console.log(`RTB House: Job ${ job.id } started.`);

      // Wait for the query to finish
      const [rows] = await job.getQueryResults();
      return rows;
    } catch (error) {
      const customText = `${ this.programmatic }, error in getRangeOfDays.`;
      checkResponseOnError({ error, customText })
        .catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, customText);
    }
  }

  runBigQueryCreateQueryJob(options, bigquery) {
    return new Promise((resolve) => {
      const customText = `${ this.programmatic }, error in runBigQueryCreateQueryJob.`;

      try {
        bigquery
          .createQueryJob(options)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            const errorResponse = {
              statusCode: error.code || 400,
              statusMessage: error.message || undefined
            };

            checkResponseOnError({ response: errorResponse, error, customText })
              .catch(() =>
                sendReport({ message: this.sendReportMessage })
              );
          });
      } catch (error) {
        checkResponseOnError({ error, customText })
          .catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  async beginAPIUpload(reports) {
    try {
      const reportsPromises = reports.map((report) => {
        const inventory_sizes = this.inventorySizes(report.size, report['slot_name']);
        const inventory_type = this.getInventoryType(report['ad_type']);

        return {
          property: {
            domain: report['domain'] !== '' && report.domain !== null ? this.getURL(report.domain) : this.getURL(report.site),
            property_id: this.getAdUnit(report['slot_name']),
            refs_to_user: null,
            am: null
          },
          inventory: getInventory({ inventory_sizes, inventory_type }),
          inventory_sizes,
          inventory_type,
          clicks: 0,
          ad_request: this.convertToInteger(report['impressions'], 10),
          matched_request: this.convertToInteger(report['impressions'], 10),
          day: this.parseDate(report.date.value),
          ecpm: this.parseECPM(report.impressions, report.revenue),
          report_origin: this.programmatic
        };
      });
      return await this.saveToDataBase(reportsPromises, true);
    } catch (error) {
      const customText = `${ this.programmatic }, error in beginAPIUpload.`;
      checkResponseOnError({ error, customText })
        .catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, customText);
    }
  }

  getURL(url) {
    const cutUrl = url.split(' ')[0];
    const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(cutUrl);
    return url2[1].toLowerCase();
  }

  getAdUnit(string) {
    if (string !== undefined) {
      let replBegin = string.replace(/^(www.|http:\/\/|https:\/\/|)/, '');
      let splitSpace = replBegin.split(/\s/g);
      return splitSpace[0].toLowerCase();
    }
  }

  inventorySizes(inventory, name) {
    if (inventory) {
      let inv = inventory.match(/[0-9]{1,3}x[0-9]{1,3}|[0-9]{1,3}х[0-9]{1,3}/g);
      if (inv && inv.length) {
        return inv[0];
      }
    } else {
      let inv = name.match(/[0-9]{1,3}x[0-9]{1,3}|[0-9]{1,3}х[0-9]{1,3}/g);
      if (inv && inv.length) {
        return inv[0];
      } else {
        return '1x1';
      }
    }
  }

  getInventoryType(value) {
    return value.toLowerCase();
  }

  parseECPM(imp, rev) {
    imp = parseInt(imp);
    rev = Math.round(parseFloat(rev) * 100) / 100;
    return Math.round((rev / imp) * 1000 * 100) / 100;
  }

  parseDate(date) {
    return date.split('T')[0];
  }

  convertToInteger(string) {
    if (typeof string === 'string') {
      return string.includes(',') ? parseFloat(string.split(',').join('')) : parseFloat(string);
    }
    return string;
  }
}

exports.RTBHouseAPI = RTBHouseAPI;
