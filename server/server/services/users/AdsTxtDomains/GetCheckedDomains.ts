import Base from '../../Base';
import { handleErrors } from '../../helperFunctions/handleErrors';
import { checkResponseOnError } from '../../../handlers/checkResponseOnError';
import { GetCheckedDomainsService } from './GetCheckedDomainsService';
import { CheckedDomains } from './CheckedDomains';

type InputParams = { body: { additional: { permission: string; id: string }; socketId: string } };

type FunctionsByPermissions = {
  [key: string]: Function;
};

type Data = {
  type: 'ads.txt',
  attributes: {
    filteredResult?: any;
    userWhoUpdated?: string;
    lastUpdate?: number;
  }
}

export class GetCheckedDomains extends Base {
  protected pathToFile = `${__dirname}/storage/adsCheckList.json`;

  protected getCheckedDomainsService = new GetCheckedDomainsService(this.pathToFile);

  protected checkedDomains = new CheckedDomains(this.pathToFile);

  protected data: Data = {
    type: 'ads.txt',
    attributes: {}
  }

  constructor(args: any) {
    super(args);
  }

  async execute(params: InputParams): Promise<any|never> {
    try {
      const {
        body: {
          additional: { permission, id: userId }
        }
      } = params;

      const existFile = await this.getCheckedDomainsService.isFileExist();
      if (!existFile && !this.checkedDomains.stateUpdating()) {
        await this.checkedDomains.update(userId);
        return { data: this.data };
      }

      const isDomainsFileActual = await this.getCheckedDomainsService.isDomainsFileActual();
      if (!isDomainsFileActual && !this.checkedDomains.stateUpdating()) {
        this.checkedDomains.update(userId);
      }
      
      await this.getData(permission, userId);

      return { data: this.data };
    } catch (error) {
      const customText = 'Error in GetCheckedDomains';

      handleErrors(error, customText);
      await checkResponseOnError({ response: error, error, customText, runNext: false });
    }
  }

  protected async getData(permission: string, userId: string): Promise<undefined|never> {
    const functionsByPermissions: FunctionsByPermissions = {
      canReadAllUsers: () => this.getCheckedDomainsService.canReadAllUsers(),
      canReadAllPubs: () => this.getCheckedDomainsService.canReadAllPubs(userId),
      canReadOwnPubs: () => this.getCheckedDomainsService.canReadOwnPubs(userId)
    };

    const getUsersFunction = functionsByPermissions[permission];

    if (getUsersFunction) {
      const { domainsObject, filteredResult } = await getUsersFunction();

      this.data.attributes = {
        filteredResult: filteredResult,
        userWhoUpdated: domainsObject?.userWhoUpdated,
        lastUpdate: domainsObject?.lastUpdate
      }
      return;
    }

    throw { statusCode: 403, statusMessage: 'Permissions not valid.' };
  }
}