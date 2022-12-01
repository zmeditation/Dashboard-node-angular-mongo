const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');
const { ManageAPI } = require('../../../modules/reporting/APIUpload/index');
const { checkResponseOnError } = require('../../../handlers/checkResponseOnError');

class UploadAPIReports extends Base {
  constructor(args) {
    super(args);
  }

  async execute({ body: { additional: { permission }, query } }) {
    try {
      this.hasRequiredFields(query);
      let response = undefined;

      switch (permission) {
        case "canAddReports":
          response = await this.canAddReports(query);
          break;
        default:
          throw { response: { statusCode: 403 } };
      }

      // if programmatic is error not executing further.
      if (!response) {
        return;
      }

      return {
        success: true,
        message: 'REPORT_UPLOADED'
      };
    } catch (error) {
      await checkResponseOnError({ error, customText: 'Error in UploadAPIReports', runNext: false })
    }
  }

  async canAddReports(query) {
    const manageAPI = new ManageAPI();
    return manageAPI.runAPIUpload(query)
  }

  hasRequiredFields(query) {
    const keys = ['programmatic'];

    for (let key of keys) {
      if (!query[key]) {
        throw new ServerError('MISSING_OBJECT_VALUES', 'BAD_REQUEST');
      }
    }

    return true;
  }
}

module.exports = UploadAPIReports;
