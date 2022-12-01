const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');
const { getPublishersFilter } = require('./getPublishersSmaller');
const { handleErrors } = require('../../helperFunctions/handleErrors');

class GetPublishers extends Base {
  constructor(args) {
    super(args);
  }

  async execute({
    body: {
      additional: { permission },
      query
    }
  }) {
    try {
      if (permission) {
        let results = undefined;

        switch (permission) {
          case 'canReadAllReports':
          case 'canReadOwnPubsReports':
          case 'canReadAllPubsReports':
          case 'canReadOwnReports':
            results = await getPublishersFilter(query);
            break;

          default:
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }

        if (!results) {
          throw new ServerError('GET_PUBLISHERS_ERROR', 'BAD_REQUEST');
        }

        return {
          success: true,
          publishers: results
        };
      }
    } catch (error) {
      const errorMsg = handleErrors(error, 'GetPublishers').error;
      throw new ServerError(`${errorMsg}`, 'BAD_REQUEST');
      /// write here new Error hendler that work via event emiter
    }
  }
}

module.exports = GetPublishers;
