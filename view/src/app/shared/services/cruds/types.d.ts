// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { KeyValueExtraObject } from 'shared/types/object';
import { AccountManager, TestUserType } from 'shared/types/users';

export type SearchField = {
  value: string;
  by: string;
};

export type GetUsersRequestType = {
  roles?: string;
  /**
   * JSON object
   *
   * @param {SearchField}
   */
  search?: string;
  noRef?: string;
  page?: string;
  limit?: string;
  step?: string;
  sort?: string;

  /**
   * JSON string
   *
   * @param {KeyValueExtraObject[]} include
   */
  include?: string;
  indent?: string;
  /**
   * Fields like = "id,name,enabled"
   */
  fields?: string;
};

export type UserGetUsersResponseType = {
  _id: string;
  name: string;
  email: string;
  role: string;
  enabled: {
    status: boolean;
  };
};

export type GetUsersResponseType = {
  status: number;
  data: {
    users: Array<UserGetUsersResponseType>;
    countPages: number;
    totalRows: number;
    totalIncludeRows?: number;
    extra?: {
      indent: number;
    };
  };
};

export type GetAccountManagersByEditPermissionsParametersType = {
  sort?: string;

  /**
   * JSON object
   *
   * @param {KeyValueExtraObject[]} include
   */
  include?: string;
};

export type GetAccountManagersByEditPermissionsResponseType = {
  status: number;
  data: AccountManager[];
};

export type BindAccountManagerToPublisherParams = {
  publisherId: string;
  newAccountManagerId: string;
  currentAccountManagerId?: string;
};

export type GetUserRequestQueryParametersType = {
  /**
   * Fields like = "id,name,enabled"
   */
  fields?: string;
};

export type UserProgrammaticReportCountType = {
  name: string;
  count: number;
};

export type GetCountOfReportsTotalAndProgrammaticsResponseType = {
  status: number;
  data: {
    total: number;
    byProgrammatics: UserProgrammaticReportCountType[];
  };
};

export type TestUsersStatisticsResponseType = {
  status: number;
  data: TestUserType[];
};
