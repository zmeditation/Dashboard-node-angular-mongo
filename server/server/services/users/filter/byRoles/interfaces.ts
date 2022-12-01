import { GetUsersByRoleParamsType, GetUsersByRolesResultType } from './types';

export interface GetUsersByRolesContract {
  getUsers(params: GetUsersByRoleParamsType): Promise<GetUsersByRolesResultType | never>;
}
