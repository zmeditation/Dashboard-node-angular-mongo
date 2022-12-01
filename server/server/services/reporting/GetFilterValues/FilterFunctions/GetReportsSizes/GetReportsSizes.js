const { ServerError } = require('../../../../../handlers/errorHandlers');
const Base = require('../../../../Base');
const buildErrorObj = require('../../../../helperFunctions/buildErrorObj');
const { searchReportsSizes } = require('./getReportsSizes-Performers.js');

class GetReportsSizes extends Base {
    constructor(args) {
        super(args);
    }

    async execute ({ body: { additional: { permission, id } }, params }) {
        try {
            const allowedPermissions = ['canReadAllReports', 'canReadAllPubsReports', 'canReadOwnPubsReports', 'canReadOwnReports', 'canReadAllTacReports', 'canReadOwnTacReports'];
            if (!allowedPermissions.includes(permission)) throw buildErrorObj('FORBIDDEN');
            if (!params) throw buildErrorObj('params is not valid');

            const { error, _id, name, results } = await searchReportsSizes(id, params);
            if (error) { throw error }

            return {
                error,
                _id,
                name,
                results
            }
        } catch (error) {
            throw new ServerError(`${error && error.msg ? error.msg : 'ERROR_TO_GET_SIZES'}`, 'BAD_REQUEST');
        }
    }
}

module.exports = GetReportsSizes;