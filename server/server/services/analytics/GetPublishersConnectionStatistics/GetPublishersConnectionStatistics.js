const { handleErrors } = require('../../helperFunctions/handleErrors');
const Base = require('../../Base');
const PublishersConnectionStatisticsService = require('./PublishersConnectionStatisticsService');
const { checkResponseOnError } = require('../../../handlers/checkResponseOnError');

class GetPublishersConnectionStatistics extends Base {
  constructor(args) {
    super(args);
    this.pubsConnectionStatServ = new PublishersConnectionStatisticsService(100);
  }

  async execute({
    body: {
      additional: { permissions }
    }
  }) {
    try {
      const allowedPermissions = ['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs'];
      if (!permissions.some((str) => allowedPermissions.includes(str))) {
        throw { statusCode: 403, statusMessage: 'Permissions not valid.' };
      }

      const publishersCountByMonth = await this.pubsConnectionStatServ.getPubsCountByMonth();
      return { publishersCountByMonth };
    } catch (error) {
      const customText = 'Error in GetPublishersConnectionStatistics';
      handleErrors(error, customText);
      await checkResponseOnError({ response: error, error, customText, runNext: false });
    }
  }
}

module.exports = GetPublishersConnectionStatistics;
