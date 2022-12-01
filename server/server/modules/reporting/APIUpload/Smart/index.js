const moment = require('moment');
const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { CSVUploader } = require('../../CSVUpload/main');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { reportDates } = require('../../../../services/helperFunctions/dateFunctions');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const { httpsRequest } = require('../helperFunctions/httpsRequest');
const { isJson } = require('../../../../services/helperFunctions/stringFunctions');
const { writeFile } = require('../../../../services/helperFunctions/workWithFiles');
const Iterator = require('../../../../utils/iterator');

class SmartAPI {
  constructor({ token }) {
    this.startDate = null;
    this.endDate = null;
    this.authToken = `Basic ${token}`;
    this.hostname = 'reporting.smartadserverapis.com';
    this.path = '/3277/reports';
    this.programmatic = 'Smart';
    this.sendReportMessage = {
      event: 'reports',
      trigger: this.programmatic,
      typeMsg: 'error',
      text: null
    };
  }

  async start(startDate, endDate) {
    try {
      const textDate = await this.generateDate(startDate, endDate);
      this.sendReportMessage.text = textDate;

      const taskId = await this.reportJobRequest(this.reportJobString);
      const reportPath = await this.processReport(taskId);
      const finishResult = await this.startReportUpload(reportPath, this.programmatic);
      return finishResult;
    } catch (error) {
      checkResponseOnError({ error, customText: this.programmatic }).catch(() => sendReport({ message: this.sendReportMessage }));
      handleErrors(error, this.programmatic);
    }
  }

  generateDate(startDate, endDate) {
    return new Promise((resolve) => {
      try {
        if (startDate && endDate) {
          [startDate, endDate] = moment(startDate).unix() > moment(endDate).unix() ? [endDate, startDate] : [startDate, endDate];
          this.startDate = moment(startDate).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss');
          this.endDate = moment(endDate).set({ hour: 23, minute: 59, second: 59 }).format('YYYY-MM-DDTHH:mm:ss');
        } else {
          this.startDate = moment().subtract(3, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss');
          this.endDate = moment().subtract(2, 'days').set({ hour: 0, minute: 0, second: 0 }).format('YYYY-MM-DDTHH:mm:ss');
        }

        const textDate = reportDates(this.startDate, this.endDate).textDate;
        resolve(textDate);
      } catch (error) {
        const text = reportDates(this.startDate, this.endDate).textDate;
        this.sendReportMessage.text = text;
        const customText = `${this.programmatic}, error in generateDate`;
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  reportJobRequest(reportJobQuery) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in reportJobRequest`;

      try {
        const postData = JSON.stringify(reportJobQuery);

        const reqOptions = {
          method: 'POST',
          hostname: this.hostname,
          path: this.path,
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.authToken
          }
        };

        httpsRequest({ options: reqOptions, customText, bodyChunk: postData })
          .then((response) => {
            this.reportJobRequestHandleResponse(response).then(resolve);
          })
          .catch(() => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  reportJobRequestHandleResponse(response) {
    return new Promise((resolve) => {
      try {
        if (isJson(response)) {
          const parsedResponse = JSON.parse(response);
          const taskId = parsedResponse.taskId;

          if (!taskId) throw `taskId is ${taskId}`;

          resolve(taskId);
        } else {
          throw response;
        }
      } catch (error) {
        const customText = `${this.programmatic}, reportJobRequest response not valid`;

        checkResponseOnError({ response, error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  processReport(taskId) {
    return new Promise(async (resolve) => {
      const customText = `${this.programmatic}, error in processReport`;

      try {
        const maxIterateCount = 10;
        const getReport = this.getReportJobStatus.bind(this);
        const iteratorParams = {
          from: 0,
          to: maxIterateCount,
          limit: 1,
          asyncFunction: getReport,
          asyncFunctionParams: taskId
        };
        const iterateObj = Iterator.default.generateAsyncLimitIterator(iteratorParams);

        let iterateCount = 0;
        let status = '';

        for await (let value of iterateObj) {
          await this.awaitByStatus(value);

          if (value === 'SUCCESS') {
            status = value;
            break;
          }
          ++iterateCount;
        }

        if (iterateCount >= maxIterateCount && status !== 'SUCCESS') {
          console.error(`Exceeded attempts to get status, ${this.programmatic}`);
        }

        const reportPath = await this.downloadReport(taskId);

        resolve(reportPath);
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  getReportJobStatus(task, params) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in getReportJobStatus`;
      try {
        const options = {
          method: 'GET',
          hostname: this.hostname,
          path: `${this.path}/${task}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.authToken
          }
        };

        httpsRequest({ options, customText })
          .then((response) => {
            this.getReportJobStatusHandleResponse(response).then(resolve);
          })
          .catch(() => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  getReportJobStatusHandleResponse(response) {
    return new Promise((resolve) => {
      try {
        if (isJson(response)) {
          const parsedResponse = JSON.parse(response);
          if (!parsedResponse.lastTaskInstance) throw 'not found field lastTaskInstance';

          const status = parsedResponse?.lastTaskInstance?.instanceStatus;
          if (!status) throw 'status not valid';

          resolve(status);
        } else {
          throw response;
        }
      } catch (error) {
        const customText = `${this.programmatic}, getReportJobStatusHandleResponse response not valid`;

        checkResponseOnError({ response, error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  async awaitByStatus(status) {
    return new Promise((resolve) => {
      if (status !== 'SUCCESS') {
        setTimeout(() => resolve(), 12_000);
        return;
      }
      resolve();
    });
  }

  downloadReport(taskId) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic}, error in downloadReport`;

      try {
        const options = {
          method: 'GET',
          hostname: this.hostname,
          path: `${this.path}/${taskId}/file`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.authToken
          }
        };

        httpsRequest({ options, customText })
          .then((response) => {
            this.downloadReportHandleResponse(response).then(resolve);
          })
          .catch(() => sendReport({ message: this.sendReportMessage }));
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  downloadReportHandleResponse(response) {
    return new Promise((resolve) => {
      try {
        if (response) {
          const replacedReports = response.replace(/;/g, ',');

          const path = `${__dirname}/test.csv`;
          const writeFileParams = { path, writeData: replacedReports };

          writeFile(writeFileParams).then((_) => {
            console.log('The Smart Report File Was Successfully Formatted.');
            resolve(path);
          });
        } else {
          throw response;
        }
      } catch (error) {
        const customText = `${this.programmatic}, downloadReportHandleResponse response not valid`;

        checkResponseOnError({ response, error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  startReportUpload(path, programmatic) {
    return new Promise((resolve) => {
      const customText = `${this.programmatic} startReportUpload`;
      const csvUploader = new CSVUploader();
      try {
        csvUploader
          .upload(path, programmatic, true)
          .then((message) => {
            if (message) {
              resolve(message);
            }

            this.sendReportMessage.typeMsg = 'noData';
          })
          .catch((error) => {
            checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
            handleErrors(error, customText);
          });
      } catch (error) {
        checkResponseOnError({ error, customText }).catch(() => sendReport({ message: this.sendReportMessage }));
        handleErrors(error, customText);
      }
    });
  }

  get reportJobString() {
    return {
      outputParameters: {
        FilenameTemplate: 'RTB_Report_Test',
        FileFormat: 'CSV'
      },
      onFinish: {
        Callback: 'https://manage.smartadserver.com/rest/Internal/ZbrPublic'
      },
      StartDate: this.startDate,
      EndDate: this.endDate,
      Fields: [
        { Day: { OutputName: 'Time' } },
        { SiteUrl: { OutputName: 'Site URL' } },
        { InsertionName: { OutputName: 'Name (Insertion)' } },
        { FormatWidth: { OutputName: 'Width (Format)' } },
        { FormatHeight: { OutputName: 'Height (Format)' } },
        { ImpressionsTrueCount: { OutputName: 'RTB+ Impressions' } },
        { AverageClearingCpm: { OutputName: 'RTB+ eCPM' } },
        { TotalPaidPriceNetworkCurrencyTrueCount: { OutputName: 'RTB+ Gross revenue' } },
        { Auctions: { OutputName: 'RTB+ Auctions' } }
      ]
    };
  }
}

exports.SmartAPI = SmartAPI;
