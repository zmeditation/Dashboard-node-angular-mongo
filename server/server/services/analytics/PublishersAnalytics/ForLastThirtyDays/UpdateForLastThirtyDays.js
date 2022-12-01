const Base = require('../../../Base');
const { sendSocketByRootPath } = require('../../../websocket/websocket_service');
const PublishersAnalyticsService = require('../PublishersAnalyticsService');
const { handleErrors } = require('../../../helperFunctions/handleErrors');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');

class UpdateForLastThirtyDays extends Base {
  constructor(args) {
    super(args);
    this.publishersAnalyticsService = new PublishersAnalyticsService();
  }

  async execute({ body: { runAnalyticsUpdate } }) {
    try {
      if (!runAnalyticsUpdate) {
        throw 'Analytics not will be update';
      }

      const pubsAnalytics = await this.analyticsUpdate();
      this.sendMessageBySocket();
      return pubsAnalytics;
    } catch (error) {
      const customText = 'Error in UpdateForLastThirtyDays';
      const response = { statusCode: 400 };

      handleErrors(error, customText);
      await checkResponseOnError({ response, error, customText, runNext: false });
    }
  }

  async analyticsUpdate() {
    try {
      const pathToFile = `${__dirname}/../../storage/publishersForLastThirtyDays.json`;
      const pubsAnalytics = await this.publishersAnalyticsService.getPublishersAnalytics({ pathToFile });
      if (!pubsAnalytics) {
        throw 'pubsAnalytics is not valid';
      }

      return pubsAnalytics;
    } catch (err) {
      const customText = 'Error in analyticsUpdate.';
      throw handleErrors(error, customText);
    }
  }

  sendMessageBySocket() {
    const message = {
      message: {
        message: 'Publishers Analytics Updated Last Thirty Days',
        last: true,
        event: 'analytics'
      },
      eventHandler: 'push_to_all'
    };

    process?.send && process.send(message);
  }
}

module.exports = UpdateForLastThirtyDays;
