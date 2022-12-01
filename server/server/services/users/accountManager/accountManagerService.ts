import GetAccoutManagersMDBException from './exceptions/getAccoutManagersMDBException';
import GetAccoutManagersRolesValidationException from './exceptions/getAccoutManagersRolesValidationException';
import UpdatePublisherAccountManagerMDBException from './exceptions/updatePublisherAccountManagerMDBException';
import AddPublisherToAccountManagerMDBException from './exceptions/addPublisherToAccountManagerMDBException';
import RemoveInCurrentAccountManagerPublisherMDBException from './exceptions/removeInCurrentAccountManagerPublisherMDBException';
import Validator from '../../../utils/validator';
import Sort from '../../../utils/sort';
import { model } from 'mongoose';
import { AccountManagerContract } from './interfaces';
import { GetAccountManagersParametersType, BindPublisherToAccountManagerType } from './types';
import { ACCOUNT_MANAGER_ROLES } from '../../../constants/roles';
import { UserMDB, GetAccountManagerType } from '../../../types/user';
import { KeyValueExtraValueObject } from '../../../types/object';

const User = model('User');

export default class AccountManagerService implements AccountManagerContract {
  public constructor() {}

  public async getAccountManagers(data: GetAccountManagersParametersType): Promise<GetAccountManagerType[]|never> {
    let result: UserMDB | any;

    if (!Validator.arrayEqualsValues(data.roles, ACCOUNT_MANAGER_ROLES)) {
      throw new GetAccoutManagersRolesValidationException(data.roles);
    }

    try {
      const query = this.getAccountManagersQuery(data.roles, data.include);

      if (data.sort) {
        result = await User.find(query).sort(Sort.queryStringToMongoDBObject(data.sort));
      } else {
        result = await User.find(query);
      }
    } catch (error: any) {
      throw new GetAccoutManagersMDBException(error.stack);
    }

    return result.map((element: UserMDB) => {
      return {
        id: element._id,
        role: element.role,
        name: element.name,
        enabled: element.enabled.status
      }
    });
  }

  private getAccountManagersQuery(roles: string[]|readonly string[], include?: KeyValueExtraValueObject[] | string | any): object {
    const result: any = {};
    const or: object[] = [];

    for (const role of roles) {
      or.push({
        role
      });
    }

    result.$or = or;

    if (include) {
      include = typeof include === 'string' ? JSON.parse(include) : include;
      for (const obj of include) {
        result[obj.key] = obj.value;
      }
    }

    return result;
  }

  public bindPublisherToAccountManager(data: BindPublisherToAccountManagerType): Promise<any|never> {
    let result: Promise<any|never>;

    if (data.currentAccountManagerId) {
      result = Promise.all([
        this.removeInCurrentAccountManagerPublisher(data),
        this.updatePublisherAccountManager(data),
        this.addPublisherToAccountManager(data)
      ]);
    } else {
      result = Promise.all([this.updatePublisherAccountManager(data), this.addPublisherToAccountManager(data)]);
    }

    return result;
  }

  protected async removeInCurrentAccountManagerPublisher(data: BindPublisherToAccountManagerType): Promise<void|never> {
    try {
      await User.updateOne({
        _id: data.currentAccountManagerId
      }, {
        $pullAll: {
          'connected_users.p': [data.publisherId]
        }
      });
    } catch (error: any) {
      throw new RemoveInCurrentAccountManagerPublisherMDBException(error.stack);
    }
  }

  protected async updatePublisherAccountManager(data: BindPublisherToAccountManagerType): Promise<void|never> {
    try {
      await User.updateOne({
        _id: data.publisherId
      }, {
        am: data.newAccountManagerId,
        date_to_connect_am: new Date().toUTCString()
      });
    } catch (error: any) {
      throw new UpdatePublisherAccountManagerMDBException(error.stack);
    }
  }

  protected async addPublisherToAccountManager(data: BindPublisherToAccountManagerType): Promise<void|never> {
    try {
      await User.updateOne({
        _id: data.newAccountManagerId
      }, {
        $push: {
          'connected_users.p': data.publisherId
        }
      });
    } catch (error: any) {
      throw new AddPublisherToAccountManagerMDBException(error.stack);
    }
  }
}
