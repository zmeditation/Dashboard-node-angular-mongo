import {
  GetTestUsersParamsType,
  TestUserType,
  GetUsersWithPaginationParamsType,
  GetUsersResultType,
  UserType,
  GetUserByIdParamsType,
  GetUsersIdsParamsType
} from '../../types/database/user';

export interface UserModelContract {
  getTestUsers(data: GetTestUsersParamsType): Promise<TestUserType[] | never>;
  getUsersWithPaginationCount(data: GetUsersWithPaginationParamsType): Promise<number | never>;
  getUsersWithPagination(data: GetUsersWithPaginationParamsType): Promise<GetUsersResultType | never>;
  getUserById(data: GetUserByIdParamsType): Promise<UserType | null | never>;
  getUsersIds(data: GetUsersIdsParamsType): Promise<string[] | number[] | never>;
}
