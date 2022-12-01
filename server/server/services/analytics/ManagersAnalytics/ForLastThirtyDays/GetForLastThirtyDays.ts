import Base from '../../../Base';
import { handleErrors } from '../../../helperFunctions/handleErrors';
import { checkResponseOnError } from '../../../../handlers/checkResponseOnError';
import HandleAnalyticsFiles from '../../handleAnalyticsFiles';

export class GetForLastThirtyDays extends Base {
  protected filePath = `${__dirname}/../../storage/managersForLastThirtyDays.json`;
  protected handleAnalyticsFiles = new HandleAnalyticsFiles(this.filePath);

  constructor(args: any) {
    super(args);
  }

  async execute() {
    try {
      const analytics = await this.handleAnalyticsFiles.readFile();
      if (analytics) {
        return analytics;
      }

      return await this.handleAnalyticsFiles.writeFile();
    } catch (error) {
      const customText = 'Error in ManagersAnalytics GetForLastThirtyDays';
      const response = { statusCode: 400 };

      handleErrors(error, customText);
      await checkResponseOnError({ response, error, customText, runNext: false });
    }
  }
}
