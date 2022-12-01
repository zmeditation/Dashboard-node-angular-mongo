const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');
const { ManageAPI } = require('../../../modules/reporting/APIUpload/index');

class GetAPIAdapters extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ body: { additional: { permission } }}) {
  
            let result = undefined;

            switch (permission) {
                case "canAddReports":
                    result = await this.canAddReports();
                    break;
                default:
                    throw new ServerError('FORBIDDEN', 'FORBIDDEN');
            }

            if (!result) { throw new ServerError('REPORT_RETRIEVAL_ERROR', 'BAD_REQUEST')}

            return {
                success: true,
                result
            };
    }
    canAddReports() {
      const manageAPI = new ManageAPI();
      return manageAPI.adaptersAPIByType;
    }
}

module.exports = GetAPIAdapters;