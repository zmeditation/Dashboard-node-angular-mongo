const sendReport = require('../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { isJson } = require('../../../../services/helperFunctions/stringFunctions');

class ProgrammaticHandler {
  constructor(programmatic) {
    this.programmatic = programmatic;
  }

  handleReportsResponse(response, sendReportMessage) {
    return new Promise(async resolve => {
      try {
        const jsonArray = (res) => {
          if (isJson(res)) {
            const array = JSON.parse(res);
            return Array.isArray(array) ? array : null;
          }
          return false;
        };

        const reportsArray = jsonArray(response);
        if (reportsArray) {
          return resolve(reportsArray);
        } else if (Array.isArray(response)) {
          return resolve(response);
        }

        const customText = `${this.programmatic} getReports response is not valid.`;
        await sendReport({ message: sendReportMessage });
        checkResponseOnError({ error: response, customText }).catch(console.log);
      } catch (error) {
        handleErrors(error, 'handleReportsResponse');
      }
    });
  }
}

module.exports = ProgrammaticHandler;
