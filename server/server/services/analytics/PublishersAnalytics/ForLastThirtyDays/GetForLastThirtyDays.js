const Base = require('../../../Base');
const { handleErrors } = require('../../../helperFunctions/handleErrors');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const HandleAnalyticsFiles = require('../../handleAnalyticsFiles');

class GetForLastThirtyDays extends Base {
  constructor(args) {
    super(args);
    this.filePath = `${__dirname}/../../storage/publishersForLastThirtyDays.json`;
    this.handleAnalyticsFiles = new HandleAnalyticsFiles(this.filePath);
  }

  async execute() {
    try {
      const analytics = await this.handleAnalyticsFiles.readFile();
      if (analytics) {
        return analytics;
      }

      const newAnalytics = await this.handleAnalyticsFiles.writeFile();
      return newAnalytics;
    } catch (error) {
      const customText = 'Error in GetForLastThirtyDays';
      const response = { statusCode: 400 };

      handleErrors(error, customText);
      await checkResponseOnError({ response, error, customText, runNext: false });
    }
  }
}

module.exports = GetForLastThirtyDays;
