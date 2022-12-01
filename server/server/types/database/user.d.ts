import { KeyValueExtraValueObject } from '../../types/object';

export type GetTestUsersParamsType = {
  filter?: {
    roles: string[];
  };
};

export type TestUserType = {
  id: string | number;
  uuid: string | number;
  name: string;
  is_test: boolean;
};

type SearchField = {
  value: string;
  by: string;
};

export type GetUsersWithPaginationParamsType = {
  ids?: string[] | number[];
  roles?: string[];
  search?: SearchField;
  sort?: string;
  limit?: number;
  page?: number;
  step?: number;
  indent?: number;
  totalRows?: number;
  include?: KeyValueExtraValueObject[];
  fields?: string[];
};

export type UserType = {
  id?: string | number;
  uuid?: string | number;
  name?: string;
  email?: string;
  role?: string;
  password?: string;
  status?: string;
  photo?: string;
  am?: string;
  sam?: string;
  dateToConnectAm?: string;
  connectedUsers?: {
    p: string[] | number[];
    am: string[] | number[];
  };
  isTest?: string;
};

export type GetUsersResultType = {
  countPages: number;
  totalRows: number;
  page: number;
  extra?: {
    indent: number;
  };
  totalIncludeRows?: number;
  users: any[];
};

export type GetUserByIdParamsType = {
  id: string | number;
  fields?: string[];
};

export type GetUsersIdsParamsType = {
  roles?: string[];
  am?: string | number;
};
