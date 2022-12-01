const { GAM } = require('./src/gam');
const { auth } = require('google-auth-library');
const time = require('date-and-time');
const csvParser = require('csvtojson');
const moment = require('moment');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { reportDates, getYesterdayDate } = require('../../../../services/helperFunctions/dateFunctions');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { httpsRequest } = require('../helperFunctions/httpsRequest');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const { FileService } = require('../../../../services/helperFunctions/FileService');

class GoogleAdManagerAPI extends GAM {
  constructor({ queryId, networkSettings, keys }) {
    super(networkSettings);
    if (!queryId || !networkSettings) {
      throw new Error('MISSING_CONFIG_VALUES');
    }

    this.csvFilePath = `${__dirname}/gam-reports/gam-report.csv`;
    this.fileService = new FileService();
    this.fileService.setPaths(this.csvFilePath);

    this.networkSettings = networkSettings;
    this.queryId = queryId;
    this.keys = keys;
    this.programmatic = 'Google Ad Manager';
    this.parsedData = [];
    this.sendReportMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  async start(dateFrom, dateTo) {
    try {
      this.sendReportMessage.text = dateFrom && dateTo ? reportDates(dateFrom, dateTo).textDate : getYesterdayDate().stringDateYesterday;

      const reportService = await this.initializeGAMService('ReportService', this.networkSettings);
      const savedQuery = await this.getSavedQuery(reportService, this.queryId, dateFrom, dateTo);
      const reportJobId = await this.startReportJob(reportService, savedQuery);
      const options = await this.getOptions(reportService, reportJobId);

      const downloadParams = { options, queryId: this.queryId };
      await this.uploadReports(downloadParams);
      return this.programmatic;
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  async initializeGAMService(serviceName) {
    const client = auth.fromJSON(this.keys);
    client.scopes = ['https://www.googleapis.com/auth/dfp'];
    await client.authorize();
    const service = await this.getService(serviceName);
    service.setToken(client.credentials.access_token);
    return service;
  }

  async getSavedQuery(reportService, queryId, startDate, endDate) {
    const { totalResultSetSize, results } = await reportService.getSavedQueriesByStatement({
      filterStatement: {
        query: `WHERE id = '${queryId}'`
      }
    });
    if (!totalResultSetSize) {
      throw handleErrors({ msg: 'QUERY_WAS_NOT_FOUND' }, 'getSavedQuery');
    }

    const [{ reportQuery }] = results;
    let customQuery = {};

    reportQuery?.columns?.push('AD_EXCHANGE_ACTIVE_VIEW_VIEWABLE');

    if (startDate && endDate) {
      reportQuery['startDate'] = this.getCustomQueryDate(startDate);
      reportQuery['endDate'] = this.getCustomQueryDate(endDate);
      reportQuery['dateRangeType'] = 'CUSTOM_DATE';

      const fieldOrder = [
        'dimensions',
        'adUnitView',
        'columns',
        'startDate',
        'endDate',
        'dateRangeType',
        'statement',
        'includeZeroSalesRows',
        'adxReportCurrency',
        'timeZoneType'
      ];

      customQuery = fieldOrder.reduce((acc, field) => {
        acc[field] = reportQuery[field];
        return acc;
      }, {});
    }

    return Object.keys(customQuery).length ? customQuery : reportQuery;
  }

  async startReportJob(reportService, reportQuery) {
    const report_job = {
      reportJob: {
        reportQuery: reportQuery
      }
    };
    const { id } = await reportService.runReportJob(report_job);
    if (!id) {
      throw { msg: 'REPORT_JOB_DID_NOT_GENERATE' };
    }

    console.log('GAM Report Job ID: ', id);
    return id;
  }

  async getOptions(reportService, reportJobId) {
    try {
      let status = await this.delay(20000, () => reportService.getReportJobStatus({ reportJobId }));
      let tries = 0;

      while (status === 'IN_PROGRESS') {
        console.log(status);
        status = await this.delay(20000, () => reportService.getReportJobStatus({ reportJobId }));
        if (status === 'COMPLETED') {
          break;
        }
        if (tries === 10) {
          throw { msg: 'EXCEEDED_NUMBER_OF_TRIES' };
        }
        tries++;
      }

      const downloadURL = await reportService.getReportDownloadUrlWithOptions({
        reportJobId: reportJobId,
        reportDownloadOptions: {
          exportFormat: 'CSV_DUMP',
          includeTotalsRow: false,
          useGzipCompression: false
        }
      });

      return this.separateUrl(downloadURL);
    } catch (error) {
      checkResponseOnError({ response: error, error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, customText);
    }
  }

  separateUrl(response) {
    if (!response) {
      throw "response is not valid JSON, Couldn't find a GAM API download URL";
    }
    console.log('GAM API download URL retrieved!');

    const searchString = '.com';
    const strIndex = response.indexOf(searchString) + searchString.length;
    const path = response.substring(strIndex);
    const hostname = response.split('/')[2];

    return { hostname, path };
  }

  async uploadReports(downloadParams) {
    try {
      const customText = `${this.programmatic}, error in uploadReports`;
      const { options } = downloadParams;
      if (!options) {
        throw new Error(`options is ${options}`);
      }
      if (!options.hostname) {
        throw new Error(`options.hostname is ${options.hostname}`);
      }
      if (!options.path) {
        throw new Error(`options.path is ${options.path}`);
      }

      options.method = 'GET';
      const response = await httpsRequest({ options, customText });
      if (!response) {
        throw new Error(`response is incorrect`);
      }

      await this.uploadReportsCSV(response);
    } catch (error) {
      throw handleErrors(error, 'uploadReports').error;
    }
  }

  async uploadReportsCSV(csvData) {
    try {
      const data = await this.readSavedData(csvData);
      await this.saveToDataBase(data, true);
    } catch (error) {
      throw handleErrors(error, 'uploadReportsCSV').error;
    }
  }

  readSavedData(data) {
    return new Promise((resolve, reject) => {
      try {
        csvParser()
          .fromString(data)
          .then((result) => {
            resolve(result.map((el) => this.preparingObjects(el)));
          });
        // .on('json', (file) => this.sortOfData(file, this.preparingObjects.bind(this)))
        // .on('done', () => resolve(this.parsedData));
      } catch (e) {
        reject(e);
      }
    });
  }

  sortOfData(file, preparingFunction) {
    const objectsWithMissingData = [];
    const parsedObject = preparingFunction(file);
    parsedObject !== 'missing data' ? this.parsedData.push(parsedObject) : objectsWithMissingData.push(parsedObject);
  }

  preparingObjects(object) {
    object = { ...object.Dimension, ...object.Column };

    if (!object['AD_EXCHANGE_DFP_AD_UNIT'] || object['AD_EXCHANGE_DFP_AD_UNIT'] === 'Total') {
      return 'missing data';
    }

    if (!object['AD_EXCHANGE_SITE_NAME']) {
      console.log(object, 'Sites');
    }

    const inventory_sizes = this.getSize(object['AD_EXCHANGE_INVENTORY_SIZE']);
    const inventory_type = this.getInventoryType(object['AD_EXCHANGE_INVENTORY_SIZE']);

    return {
      property: {
        domain: this.getURL(object['AD_EXCHANGE_SITE_NAME']),
        property_id: this.getAdUnit(object['AD_EXCHANGE_DFP_AD_UNIT']) || this.getReportName(bodyObject['AD_EXCHANGE_SITE_NAME']),
        refs_to_user: null,
        am: null
      },
      inventory: getInventory({ inventory_sizes, inventory_type }),
      clicks: parseInt(object['AD_EXCHANGE_CLICKS'], 10),
      ad_request: this.convertToInteger(object['AD_EXCHANGE_AD_REQUESTS'], 10),
      matched_request: this.convertToInteger(object['AD_EXCHANGE_IMPRESSIONS'], 10),
      day: this.parseDate(object['AD_EXCHANGE_DATE']),
      ecpm: this.parseECPM(object['AD_EXCHANGE_AD_ECPM']),
      report_origin: this.programmatic,
      viewability: this.calculateViewAbility(object['AD_EXCHANGE_ACTIVE_VIEW_VIEWABLE'])
    };
  }

  /**
   * @param {string | *} viewability
   * @returns {number}
   */
  calculateViewAbility(viewability) {
    return viewability ? parseFloat((viewability * 100).toFixed(1)) : 0;
  }

  /**
   * @param {string | *} ecpm
   * @returns {number}
   */
  parseECPM(ecpm) {
    const cpm = typeof ecpm === 'string' && ecpm.includes(',') ? parseFloat(ecpm.replace(',', '.')) / 1000000 : parseFloat(ecpm) / 1000000;
    return parseFloat(cpm.toFixed(2));
  }

  /**
   * @param {string} siteName
   * @returns {string}
   */
  getReportName(siteName) {
    let replBegin = siteName.replace(/^(www.|http:\/\/|https:\/\/|)/, '');
    let splitSpace = replBegin.split(/\s/g);
    return splitSpace[0].toLowerCase();
  }

  /**
   * @param {string} url
   * @returns {string}
   */
  getURL(url) {
    const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(url);
    return url2[1];
  }

  /**
   * @param {string | undefined} string
   * @returns {string | undefined}
   */
  getAdUnit(string) {
    if (string !== undefined) {
      return string.substr(string.lastIndexOf('»') + 2);
    }
  }

  getInventoryType(inventory) {
    return inventory.search(/[0-9]/i) ? 'video' : 'banner';
  }

  /**
   * @param {string} size
   * @returns {string}
   */
  getSize(size) {
    return size.includes(',Fluid') ? 'Native' : size;
  }

  parseDate(date) {
    const DateObject = date.includes('/') ? time.parse(date, 'M/D/YY', true) : time.parse(date, 'YYYY-MM-DD', true);
    const dateString = time.format(DateObject, 'YYYY-MM-DD');

    if (typeof dateString === 'string') {
      return dateString;
    }
  }

  /**
   * @param {string} string
   * @param {number} radix
   * @returns {number}
   */
  convertToInteger(string, radix) {
    return string.includes(',') ? parseFloat(string.split(',').join('')) : parseFloat(string);
  }

  delay(time, callback) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(callback());
      }, time);
    });
  }

  getCustomQueryDate(customDate) {
    const date = moment(customDate, 'YYYY-MM-DD');

    if (!date.isValid()) {
      throw new Error('INVALID_CUSTOM_DATE');
    }

    return {
      year: date.year(),
      month: date.month() + 1,
      day: date.date()
    };
  }
}

exports.GoogleAdManagerAPI = GoogleAdManagerAPI;
