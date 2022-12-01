const { GAM } = require('../Google_Ad_Manager/src/gam');
const { auth } = require('google-auth-library');
const time = require('date-and-time');
const csvParser = require('csvtojson');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const moment = require('moment');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const { httpsRequest } = require('../helperFunctions/httpsRequest');
const { FileService } = require('../../../../services/helperFunctions/FileService');

class Google_Ad_Manager_API_HB extends GAM {
  constructor({ queryId, networkSettings, keys }) {
    if (!queryId || !networkSettings) {
      throw new Error('MISSING_CONFIG_VALUES');
    }

    super(networkSettings);
    this.networkSettings = networkSettings;
    this.queryId = queryId;
    this.placementsIds = [28846285, 29446895];
    this.programmatic = 'Google Ad Manager HB';

    this.pathToFile = `${__dirname}/gam-reports/gam-report.csv`;
    this.fileService = new FileService();
    this.fileService.setPaths(this.pathToFile);

    this.parsedData = [];
    this.keys = keys;
    this.reportService = null;

    this.sendReportMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  async start(dateFrom, dateTo) {
    try {
      this.sendReportMessage.text = `${dateFrom} -- ${dateTo}`;
      const adUnits = await this.getAdUnitList(this.networkSettings, this.placementsIds);
      const adUnitNames = await this.getAdUnitNames(this.networkSettings, adUnits);
      await this.saveAdUnits(adUnitNames);
      const adUnitIds = adUnitNames.map((adUnit) => `112081842 » ${adUnit}`).join("', '");

      const statement = {
        query: `where ad_exchange_dfp_ad_unit in ('${adUnitIds}')`
      };

      this.reportService = await this.initializeGAMService('ReportService', this.networkSettings);
      const savedQuery = await this.getSavedQuery(this.queryId, dateFrom, dateTo);

      const report_job = {
        reportJob: {
          reportQuery: savedQuery
        }
      };

      const reportJob = await this.reportService.runReportJob(report_job);
      const reportJobId = reportJob.id;
      console.log('GAM Report Job ID: ', reportJobId);

      let status = await this.getGAMAPIStatus(reportJobId);
      console.log('GAM HB API upload status: ', status);

      if (status === 'IN_PROGRESS') {
        status = await this.reportService.getReportJobStatus({ reportJobId });
      } else if (status === 'COMPLETED') {
        await this.uploadReports(reportJobId);
      }
      return this.programmatic;
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  async uploadReports(reportJobId) {
    const downloadURL = await this.getDownloadUrl(reportJobId);
    console.log(downloadURL ? 'GAM HB API download URL retrieved!' : "Couldn't find a GAM HB API download URL");

    const options = this.separateUrl(downloadURL);
    options.method = 'GET';

    const response = await httpsRequest({ options, customText: `uploadReports ${this.programmatic}` });
    if (!response) {
      throw new Error(`response is ${response}`);
    }

    // await this.fileService.writeFile(response);
    // console.log(`The Google Report File Was Successfully Write By Path ${ this.pathToFile } \n`);

    await this.uploadReportsCSV(response);
    // await this.fileService.deleteFile();
    // console.log(`File has been deleted by path ${ this.pathToFile } \n`);
  }

  getDownloadUrl(reportJobId) {
    return this.reportService.getReportDownloadUrlWithOptions({
      reportJobId,
      reportDownloadOptions: {
        exportFormat: 'CSV_DUMP',
        includeTotalsRow: false,
        useGzipCompression: false
      }
    });
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

  async uploadReportsCSV(csvData) {
    try {
      const data = await this.readSavedData(csvData);
      await this.saveToDataBase(data, true);
    } catch (error) {
      throw handleErrors(error, 'uploadReportsCSV').error;
    }
  }

  async getGAMAPIStatus(reportJobId) {
    return new Promise((resolve, reject) => {
      let tries = 5;

      const funcGetter = async () => {
        tries -= 1;
        if (tries < 0) {
          reject('NO_STATUS');
        }
        const status = await this.reportService.getReportJobStatus({ reportJobId });
        const timeoutHandler = setTimeout(funcGetter, 10000);
        if (status === 'COMPLETED') {
          clearTimeout(timeoutHandler);
          resolve(status);
        }
      };
      funcGetter();
    });
  }

  async saveAdUnits(adUnits) {
    const configPath = `${__dirname}/../../../../services/reporting/config/hb_ad_units.txt`;
    const data = JSON.stringify({ adUnits });
    await this.fileService.writeSpecifiedFile(configPath, data);
    console.log('HB Ad Units Were Saved To the Config File');
  }

  async initializeGAMService(serviceName, networkSettings) {
    const client = auth.fromJSON(this.keys);
    client.scopes = ['https://www.googleapis.com/auth/dfp'];
    await client.authorize();
    const gam = new GAM(networkSettings);
    const service = await gam.getService(serviceName);
    service.setToken(client.credentials.access_token);
    return service;
  }

  async getAdUnitList(networkSettings, placementId) {
    const PlacementService = await this.initializeGAMService('PlacementService', networkSettings);
    let adUnitsArrayHB = [];
    for (const id of placementId) {
      const res = await PlacementService.getPlacementsByStatement({
        filterStatement: {
          query: `WHERE id = ${id}`
        }
      });
      adUnitsArrayHB.push(res.results[0].targetedAdUnitIds);
    }
    adUnitsArrayHB = adUnitsArrayHB.join(',').split(',');
    if (adUnitsArrayHB.length) {
      return adUnitsArrayHB;
    }
  }

  async getAdUnitNames(networkSettings, adUnitIds) {
    const InventoryService = await this.initializeGAMService('InventoryService', this.networkSettings);
    const res = await InventoryService.getAdUnitsByStatement({
      filterStatement: {
        query: `WHERE id in (${adUnitIds.join(', ')})`
      }
    });

    if (res.results.length) {
      return res.results.map((adUnit) => adUnit.adUnitCode);
    }
  }

  async getSavedQuery(queryId, startDate, endDate) {
    const { totalResultSetSize, results } = await this.reportService.getSavedQueriesByStatement({
      filterStatement: {
        query: `WHERE id = '${queryId}'`
      }
    });
    if (!totalResultSetSize) {
      throw new Error('QUERY_WAS_NOT_FOUND');
    }

    const [{ reportQuery }] = results;
    let customQuery = {};

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
      clicks: 0,
      ad_request: this.convertToInteger(object['AD_EXCHANGE_AD_REQUESTS'], 10),
      matched_request: 0,
      day: this.parseDate(object['AD_EXCHANGE_DATE']),
      ecpm: 0,
      report_origin: this.programmatic
    };
  }

  getReportName(siteName) {
    let replBegin = siteName.replace(/^(www.|http:\/\/|https:\/\/|)/, '');
    let splitSpace = replBegin.split(/\s/g);
    return splitSpace[0].toLowerCase();
  }

  getURL(url) {
    const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(url);
    return url2[1];
  }

  /**
   * @param {string} string
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

  convertToInteger(string, radix) {
    return string.includes(',') ? parseFloat(string.split(',').join('')) : parseFloat(string);
  }
}

exports.Google_Ad_Manager_API_HB = Google_Ad_Manager_API_HB;
