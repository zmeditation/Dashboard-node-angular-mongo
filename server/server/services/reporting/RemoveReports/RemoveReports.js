const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');
const { canDeleteReports, canDeleteCommissionReports } = require('./RemoveReportsHelpers');

class RunCustomReport extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ body: { additional: { permission }, query }}) {
        if (permission && this.hasRequiredFields(query)) {
            let status = undefined;

            switch (permission) {
                case "canDeleteReports":
                    status = query.programmatic !== 'Google Ad Manager Commission'
                        ? await canDeleteReports(query)
                        : await canDeleteCommissionReports(query);
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

    hasRequiredFields(query) {

        const keys = [ 'programmatic', 'dateFrom', 'dateTo' ];

        for (const key of keys) {
            if (!query[key]) {
                throw new ServerError('MISSING_OBJECT_VALUES', 'BAD_REQUEST');
            }
        }

        return true;
    }
}

module.exports = RunCustomReport;
