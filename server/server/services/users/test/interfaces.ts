import { GetUsersParamsType } from './types';

export interface TestUsersContract {
  getTestUsers(data: GetUsersParamsType): Promise<any>;
}