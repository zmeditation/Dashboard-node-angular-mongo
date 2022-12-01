const { canReadAllReports, canReadAllPubsReports, canReadOwnPubsReports, canReadOwnReports } = require("./getFilterValuesSmaller");

const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');

class GetFilterValues extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ body: { additional: { permission, id: userTokenId } }, filterId}) {
        if (permission) {
            let results;
            switch (permission) {
                case "canReadAllReports":
                    results = await canReadAllReports(filterId, userTokenId);
                    break;
                case "canReadAllPubsReports":
                    results = await canReadAllPubsReports(filterId, userTokenId);
                    break;
                case "canReadOwnPubsReports":
                    results = await canReadOwnPubsReports(filterId, userTokenId);
                    break;
                case "canReadOwnReports":
                    results = await canReadOwnReports(filterId, userTokenId);
                    break;
                case "canReadAllTacReports":
                    results = await canReadAllReports(filterId, userTokenId);
                    break;
                case "canReadOwnTacReports":
                    results = await canReadOwnReports(filterId, userTokenId);
                    break;
                default:
                    throw new ServerError('FORBIDDEN', 'FORBIDDEN');
            }
            if (!results) { throw new ServerError('REPORT_RETRIEVAL_ERROR', 'BAD_REQUEST')}

            return {
                success: true,
                name: results.name,
                results: results.results
            }
        } else {
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }
    }
}

module.exports = GetFilterValues;
