import Base from '../../../Base';
import { handleErrors } from '../../../helperFunctions/handleErrors';
import { checkResponseOnError } from '../../../../handlers/checkResponseOnError';
import ManagersAnalyticsService from '../ManagersAnalyticsService';

export class UpdateForLastThirtyDays extends Base {
  constructor(args: any, protected managersAnalyticsService = new ManagersAnalyticsService()) {
    super(args);
  }

  async execute(params: any): Promise<any> {
    try {
      const {
        body: { runAnalyticsUpdate }
      } = params;
      if (!runAnalyticsUpdate) {
        throw 'Analytics will not be update';
      }

      const managersAnalytics = await this.analyticsUpdate();
      this.sendMessageBySocket();
      return managersAnalytics;
    } catch (error) {
      const customText = 'Error in ManagersAnalytics UpdateForLastThirtyDays';
      const response = { statusCode: 400 };

      handleErrors(error, customText);
      await checkResponseOnError({ response, error, customText, runNext: false });
    }
  }

  async analyticsUpdate() {
    try {
      const pathToFile = `${__dirname}/../../storage/managersForLastThirtyDays.json`;
      const managersAnalytics = await this.managersAnalyticsService.getManagersAnalytics({ pathToFile });
      if (!managersAnalytics) {
        throw 'managersAnalytics is not valid';
      }

      return managersAnalytics;
    } catch (error) {
      const customText = 'Error in analyticsUpdate.';
      throw handleErrors(error, customText).error;
    }
  }

  protected sendMessageBySocket(): void {
    const message = {
      message: {
        message: 'Managers Analytics Updated Last Thirty Days',
        last: true,
        event: 'analytics'
      },
      eventHandler: 'push_to_all'
    };

    process?.send && (<any>process).send(message);
  }
}
