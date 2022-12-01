const { getPubsRevenueByDateSum } = require("./getPubsRevenueSmall");

const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');


class GetPubsRevenue extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ body: { additional: { permission }, query:{ rangeForReports, minSum }}}) {
        try {
            if (permission) {
                let pubsAndRevenues, error;

                switch (permission) {
                    case "canReadAllReports":
                    case "canReadAllPubsReports":
                    case "canReadOwnPubsReports":
                    case "canReadOwnReports":

                        const reports = await getPubsRevenueByDateSum(rangeForReports, minSum)
                        pubsAndRevenues = reports.pubsAndRevenues;
                        error = reports.error;
                        break;

                    default:
                        throw new ServerError('FORBIDDEN', 'FORBIDDEN');
                }

                if (error !== null) {
                    return {
                        success: false,
                        pubsAndRevenues,
                        error
                    }
                }

                return  {
                    success: true,
                    pubsAndRevenues,
                    error
                };

            } else { throw new Error() }
        } catch (error) {
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }
    }

}

module.exports = GetPubsRevenue;