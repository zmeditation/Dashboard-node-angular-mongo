import { KeyValueExtraValueObject, StringKeyObject } from '../../../types/object';
import { ResultSettingsMongoDb } from '../../../utils/pagination/types';
import { UserMDB } from '../../../types/user';

export type GetUsersSettings = {
  roles: Array<string>;
  search: string;
  page: number;
  limit: number;
  step: number;
  sort: string;
  noRef: string;
  include: KeyValueExtraValueObject[];
  indent: number;
  userTokenId: string | number;
  fields: string[];
};

export type GetUsersResylt = {
  users: Array<any>;
  countPages?: number;
  totalRows?: number;
};

export type HandleResponseUsersWithIncludeSettings = {
  query: StringKeyObject;
  users: UserMDB[];
  paginationSettings: ResultSettingsMongoDb;
  include: KeyValueExtraValueObject[];
  sort?: object;
};

export type HandleResponseUsersWithIncludeResult = {
  extra: boolean;
  indent?: number;
  users?: UserMDB[];
};

export type GetUsersSuccessResult = {
  countPages: number;
  totalRows: number;
  page: number;
  extra?: {
    indent: number;
  };
  totalIncludeRows?: number;
  users: UserMDB[];
};

export type GetUsersErrorResult = {
  name: string;
  message: string;
  errorName: string;
};

export type UpdateResultIfIncludeParamExistSettings = {
  data: GetUsersSettings;
  query: any;
  users: UserMDB[];
  paginationSettings: ResultSettingsMongoDb;
  sort?: object;
  result: GetUsersSuccessResult;
};
