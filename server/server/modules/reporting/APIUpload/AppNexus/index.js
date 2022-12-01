const { appNexusToken } = require('./helpers/AppNexusTokenManager');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { httpsRequest } = require('../helperFunctions/httpsRequest');
const { writeFile } = require('../../../../services/helperFunctions/workWithFiles');
const { isJson } = require('../../../../services/helperFunctions/stringFunctions');
const { appNexusUrlManager } = require('./helpers/AppNexusUrlManager');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const ReportSaver = require('../../../../services/reporting/ReportSaver');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');
const time = require('date-and-time');
const csvParser = require('csvtojson/v1');
const fs = require('fs');

class AppNexusAndPartnersAPI extends ReportSaver {
  constructor({ credentials, reportID, programmatic }) {
    super();
    if (!reportID || !programmatic || !credentials) {
      throw new Error('MISSING_CONFIGURATION_VALUES');
    }
    this.credentials = credentials;
    this.options = {
      reportID: reportID,
      tokenPath: `${ __dirname }/token.txt`,
      reportPath: `${ __dirname }/report/APPNEXUS_API.csv`
    };
    this.programmatic = programmatic;
    this.parsedData = [];
    this.sendReportMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
    this.sizes = [
      '88x31',
      '120x20',
      '120x30',
      '120x60',
      '120x90',
      '120x240',
      '120x600',
      '125x125',
      '160x600',
      '168x28',
      '168x42',
      '180x150',
      '200x200',
      '200x446',
      '216x36',
      '216x54',
      '220x90',
      '234x60',
      '240x133',
      '240x400',
      '250x250',
      '250x350',
      '250x360',
      '250x400',
      '292x30',
      '300x31',
      '300x50',
      '300x75',
      '300x100',
      '300x250',
      '300x450',
      '300x600',
      '300x1050',
      '320x50',
      '320x100',
      '320x480',
      '336x280',
      '468x60',
      '480x320',
      '580x250',
      '580x400',
      '728x90',
      '750x100',
      '750x200',
      '750x300',
      '768x1024',
      '930x180',
      '950x90',
      '960x90',
      '970x66',
      '970x90',
      '970x250',
      '980x90',
      '980x120',
      '1024x768',
      '1060x90',
      '970x200',
      '640x480',
      '640x400',
      '580x450',
      '512x288',
      '430x288',
      '300x300',
      '1x1',
      '1x0',
      '2x0',
      '3x0',
      '4x0',
      'Video/Overlay',
      'custom'
    ];
  }

  async start() {
    try {
      this.options.token = await appNexusToken.getToken(this.options, this.credentials);
      const reportDownloadURL = await appNexusUrlManager.getReportUrl(this.options);
      await this.downloadReport(this.options, reportDownloadURL);
      return await this.startReportUpload(this.options.reportPath, this.programmatic);
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  startReportUpload(path, programmatic) {
    return new Promise(async (resolve) => {
      const customText = `${ this.programmatic } startReportUpload`;
      try {
        const data = await this.readSavedData(path);
        const result = await this.saveToDataBase(data, true);
        resolve(result);
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  readSavedData(pathToFile) {
    return new Promise((resolve, reject) => {
      try {
        csvParser()
          .fromFile(pathToFile)
          .on('json', (file) => this.sortOfData(file, this.preparingObjects.bind(this)))
          .on('done', () => {
            fs.unlink(pathToFile, (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log('File has been deleted');
                resolve(this.parsedData);
              }
            });
          });
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
    if (object.mediatype === 'Unknown') {
      return 'missing data';
    }
    const inventory_sizes = this.getInventorySize(object['size']);
    const inventory_type = this.getInventoryType(object['mediatype']);

    return {
      property: {
        domain: this.getDomain(object['placement']),
        property_id: this.getPropertyID(object['placement']),
        refs_to_user: null,
        am: null
      },
      inventory: getInventory({ inventory_sizes, inventory_type }),
      clicks: parseInt(object['clicks'], 10),
      ad_request: this.convertToInteger(object['imp_requests'], 10),
      matched_request: this.convertToInteger(object['imps'], 10),
      day: this.parseDate(object['day']),
      ecpm: this.parseECPM(object['rpm']),
      report_origin: this.programmatic
    };
  }

  parseECPM(ecpm) {
    ecpm = typeof ecpm === 'string' && ecpm.includes(',') ? parseFloat(ecpm.replace(',', '.')) : parseFloat(ecpm);
    return parseFloat(ecpm.toFixed(2));
  }

  getDomain(siteName) {
    const [domain] = siteName.split('_');
    if (domain) {
      return this.getURL(domain);
    } else {
      return 'invalid.domain';
    }
  }

  getURL(url) {
    url = url.replace(/ .*/, '');
    const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(url);
    return url2[1];
  }

  getPropertyID(placement) {
    const [propertyId] = placement.split(' ');
    return propertyId;
  }

  getInventorySize(inventory) {
    if (inventory.indexOf('_') >= 0) {
      const tempInventory = inventory.split('_')[0];
      return this.sizes.includes(tempInventory) ? tempInventory : 'Native';
    } else {
      return this.sizes.includes(inventory) ? inventory : 'Native';
    }
  }

  getInventoryType(inventory) {
    const allowed = ['banner', 'video'];
    return allowed.includes(inventory.toLowerCase()) ? 'banner' : 'video';
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

  downloadReport(options, reportUrl) {
    return new Promise((resolve) => {
      const customText = `${ this.programmatic } downloadReport`;

      try {
        const { token, reportPath } = options;
        const reqOptions = {
          method: 'GET',
          hostname: 'api.appnexus.com',
          path: `/${ reportUrl }`,
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        };

        httpsRequest({ options: reqOptions, customText })
          .then((response) => {
            this.handleResponseDownloadReport(response, this.sendReportMessage)
              .then((handledResponse) => {
                const writeFileParams = { path: reportPath, writeData: handledResponse };
                return writeFileParams;
              })
              .then(writeFile)
              .then(resolve);
          })
          .catch((error) => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  async handleResponseDownloadReport(response) {
    if (isJson(response)) {
      const reportsParsed = JSON.parse(response);
      if (reportsParsed.response.error) {
        throw reportsParsed.response.error;
      }

      return response;
    } else if (response) {
      return response;
    } else {
      throw 'Response is not valid.';
    }
  }
}

exports.AppNexusAndPartnersAPI = AppNexusAndPartnersAPI;
