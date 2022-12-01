import GetTestUserException from './exceptions/getTestUserException';
import { TestUsersContract } from './interfaces';
import { UserModelContract } from '../../../interfaces/database/user';
import { GetUsersParamsType } from './types';
import { TestUserType } from '../../../types/database/user';

export default class TestUsersService implements TestUsersContract {
  protected userModel: UserModelContract;

  public constructor(userModel: UserModelContract) {
    this.userModel = userModel;
  }

  public async getTestUsers(data: GetUsersParamsType): Promise<TestUserType[] | never> {
    try {
      return await this.userModel.getTestUsers({
        filter: {
          roles: data.roles
        }
      });
    } catch (error: any) {
      throw new GetTestUserException(error.stack);
    }
  }
}
