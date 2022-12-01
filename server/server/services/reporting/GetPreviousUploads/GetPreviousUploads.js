const { canReadPreviouslyUploadedReports } = require('./getPreviousUploadsSmaller');

const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');

class RunCustomReport extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ body: { additional: { permission, id: userTokenId } }}) {
        if (permission) {
            let reports = undefined;
            switch (permission) {
                case "canReadPreviouslyUploadedReports":
                    reports = await canReadPreviouslyUploadedReports(userTokenId);
                    break;
                default:
                    throw new ServerError('FORBIDDEN', 'FORBIDDEN');
            }

            if (!reports) { throw new ServerError('REPORT_RETRIEVAL_ERROR', 'BAD_REQUEST')}

            return {
                success: true,
                reports,
                msg: 'SUCCESS'
            };
        } else {
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }
    }

}

module.exports = RunCustomReport;