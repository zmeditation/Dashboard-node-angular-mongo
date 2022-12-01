const { canAddReports, canAddOwnPubsReports } = require('./manualUploadSmaller');

const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');

class RunCustomReport extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ body: { reports: reportsObject, additional: { permission, id: userTokenId } }}) {

        if (permission) {
            let reports = undefined;
            switch (permission) {
                case "canAddReports":
                    reports = await canAddReports(reportsObject, userTokenId);
                    break;
                case "canAddOwnPubsReports":
                    reports = await canAddOwnPubsReports(reportsObject, userTokenId);
                    break;
                default:
                    throw new ServerError('FORBIDDEN', 'FORBIDDEN');
            }

            if (!reports) { throw new ServerError('REPORT_RETRIEVAL_ERROR', 'BAD_REQUEST')}

            return {
                success: true,
                msg: "The reports were successfully added!"
            };
        } else {
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }
    }

}

module.exports = RunCustomReport;