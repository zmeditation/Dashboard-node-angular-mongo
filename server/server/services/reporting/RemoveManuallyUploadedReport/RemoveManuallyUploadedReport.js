const { canDeletePreviouslyUploadedReports } = require('./removeManuallyUploadedReportSmaller');

const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');

class RunCustomReport extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ body: { additional: { permission, id: userTokenId }}, reportId }) {
        if (permission) {
            let status = undefined;
            switch (permission) {
                case "canDeletePreviouslyUploadedReports":
                    status = await canDeletePreviouslyUploadedReports(reportId, userTokenId);
                    break;
                default:
                    throw new ServerError('FORBIDDEN', 'FORBIDDEN');
            }

            if (!status) { throw new ServerError('REPORT_RETRIEVAL_ERROR', 'BAD_REQUEST')}

            return {
                success: true,
                status
            };
        } else {
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }
    }

}

module.exports = RunCustomReport;