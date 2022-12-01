import { GetAccountManagersParametersType, BindPublisherToAccountManagerType } from './types';
import { GetAccountManagerType } from '../../../../types/user';

export interface AccountManagerContract {
  getAccountManagers(roles: GetAccountManagersParametersType): Promise<GetAccountManagerType[]|never>;
  bindPublisherToAccountManager(data: BindPublisherToAccountManagerType): Promise<any>;
}