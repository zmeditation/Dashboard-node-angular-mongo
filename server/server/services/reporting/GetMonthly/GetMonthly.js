const {
  canReadAllReports,
  canReadAllPubsReports,
  canReadOwnPubsReports,
  canReadOwnReports
} = require("./getMonthlySmaller");

const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');

// GET: api/reports/monthly/:userid?
// Generate a "Month to Date" report by the user's permission

class GetMonthly extends Base {
  constructor(args) {
    super(args);
  }

  async execute({ body: { additional: { id: userTokenId, permission } }, userId, gfc }) {
    if (permission) {
      let reports = undefined;
      switch (permission) {
        case "canReadAllReports":
          reports = userId
            ? await canReadOwnReports(gfc, userId)
            : await canReadAllReports(gfc);
          break;
        case "canReadAllPubsReports":
          reports = userId
            ? await canReadOwnPubsReports(gfc, userId)
            : await canReadAllPubsReports(gfc);
          break;
        case "canReadOwnPubsReports":
          reports = await canReadOwnPubsReports(gfc, userTokenId);
          break;
        case "canReadOwnReports":
          reports = await canReadOwnReports(gfc, userTokenId);
          break;
        default:
          throw new ServerError('FORBIDDEN', 'FORBIDDEN');
      }

      if (!reports) { throw new ServerError('REPORT_RETRIEVAL_ERROR', 'BAD_REQUEST') }

      return {
        result: reports,
        success: true
      };
    } else {
      throw new ServerError('FORBIDDEN', 'FORBIDDEN');
    }
  }
}

module.exports = GetMonthly;
