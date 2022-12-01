const moment = require('moment');
const ReportSaver = require('../../../../services/reporting/ReportSaver.ts');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const { httpsRequest } = require('../helperFunctions/httpsRequest');
const ProgrammaticHandler = require('../helperFunctions/programmaticHandlers');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');

class CriteoAPI extends ReportSaver {
  constructor({ token }) {
    if (!token) {
      throw new Error('MISSING_CONFIG_DATA');
    }
    super();
    this.token = token;
    this.programmatic = 'Criteo';
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
      const { dates, textDate } = this.generateDate(startDate, endDate);
      this.sendReportMessage.text = textDate;

      const urlData = this.getDownloadURL(dates);
      const parsedReports = await this.getReports(urlData);
      const reports = this.removeUnitsFromGooglesyndication(parsedReports);
      const editedReports = await this.uploadAllReports(reports);
      if (!editedReports.length) {
        throw (this.sendReportMessage.typeMsg = 'noData');
      }
      await this.saveToDataBase(editedReports, true);
      return this.programmatic;
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  generateDate(startDate, endDate) {
    const dates = {
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      endDate: moment().subtract(1, 'days').format('YYYY-MM-DD')
    };

    if (startDate && endDate) {
      [startDate, endDate] = moment(startDate).unix() > moment(endDate).unix() ? [endDate, startDate] : [startDate, endDate];
      dates.startDate = moment(startDate).format('YYYY-MM-DD');
      dates.endDate = moment(endDate).format('YYYY-MM-DD');
    }

    return {
      dates,
      textDate: `(${dates.startDate} -- ${dates.endDate})`
    };
  }

  getDownloadURL({ startDate, endDate }) {
    const metrics = 'Requests,Participation,CriteoDisplays,Clicks,CTR,CPM,TakeRate,TotalImpressions';
    const dimensions = 'Networkid,Domain,Subid,ZoneName,ZoneFormat';

    return {
      hostname: 'pmc.criteo.com',
      path: `/api/stats?apitoken=${this.token}&begindate=${startDate}&enddate=${endDate}&currency=USD&dimensions=${dimensions}&metrics=${metrics}`
    };
  }

  getReports(params) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic} getReports`;
      const { hostname, path } = params;

      if (!hostname) {
        throw 'missing hostname';
      }
      if (!path) {
        throw 'path hostname';
      }

      const reqOptions = {
        method: 'GET',
        hostname,
        path,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      };

      httpsRequest({ options: reqOptions, customText })
        .then((response) => {
          this.handler.handleReportsResponse(response, this.sendReportMessage).then(resolve);
        })
        .catch(() => sendReport({ message: this.sendReportMessage }));
    });
  }

  removeUnitsFromGooglesyndication(reports) {
    return reports.filter((el) => {
      return el.Domain.search(/safeframe\.googlesyndication\.com/) === -1;
    });
  }

  async uploadAllReports(reports) {
    return reports.map((report) => {
      const inventory_sizes = this.inventorySizes(report.ZoneFormat);
      const inventory_type = this.getInventoryType();

      const object = {
        property: {
          domain: this.getURL(report.Domain),
          property_id: report['Subid']
            ? this.ifSubIdExist(report['Subid'], report['NetworkId'])
            : this.ifTagExist(report.ZoneName, report.Domain, report.ZoneFormat, report.NetworkId),
          refs_to_user: null,
          am: null
        },
        inventory: getInventory({ inventory_sizes, inventory_type }),
        inventory_sizes,
        inventory_type,
        clicks: parseInt(report.Clicks, 10),
        ad_request: parseInt(report['CriteoDisplays'], 10),
        matched_request: parseInt(report['CriteoDisplays'], 10),
        day: this.parseDate(report.TimeId),
        ecpm: this.parseECPM(report.CPM),
        report_origin: 'Criteo'
      };
      return object;
    });
  }

  getURL(url) {
    const cutUrl = url.split(' ')[0];
    const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(cutUrl);
    return url2[1].toLowerCase();
  }

  ifTagExist(tag, site, size, network) {
    return tag !== undefined ? `${network}-${site}_${size}` : 'undefined';
  }

  ifSubIdExist(subId, networkId) {
    return `${networkId}-${subId}`;
  }

  inventorySizes(inventory) {
    let inv = inventory.match(/[0-9]{1,3}x[0-9]{1,3}|[0-9]{1,3}х[0-9]{1,3}/g);
    if (inv && inv.length) {
      return inv[0];
    }
  }

  getInventoryType() {
    return 'banner';
  }

  parseECPM(ecpm) {
    return typeof ecpm === 'string' && ecpm.includes(',') ? parseFloat(ecpm.replace(',', '.')) : parseFloat(ecpm);
  }

  parseDate(date) {
    return date.split('T')[0];
  }
}

exports.CriteoAPI = CriteoAPI;
