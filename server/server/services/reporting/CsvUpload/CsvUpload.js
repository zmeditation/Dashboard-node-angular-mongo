const { canAddReports } = require('./csvUploadSmaller');

const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');

class RunCustomReport extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ body: { origin, additional: { permission, id: userTokenId } }, file }) {
        if (permission) {
            let status = undefined;
            switch (permission) {
                case "canAddReports":
                    status = await canAddReports(file, origin, userTokenId);
                    break;
                default:
                    throw new ServerError('FORBIDDEN', 'FORBIDDEN');
            }

            if (!status) { throw new ServerError('CSV_UPLOAD_ERROR', 'BAD_REQUEST')}

            return {
                success: true,
                msg: "REPORTS_SUCCESSFULLY_UPLOADED"
            };
        } else {
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }
    }

}

module.exports = RunCustomReport;