import { KeyValueExtraValueObject } from '../../../../types/object';

type SearchFieldType = {
  value: string;
  by: string;
};

export type GetUsersByRoleParamsType = {
  role: string;
  userTokenId: string | number;
  roles: Array<string>;
  search?: SearchFieldType;
  page?: number;
  limit?: number;
  step?: number;
  sort?: string;
  include?: KeyValueExtraValueObject[];
  indent?: number;
  fields?: string[];
};

export type GetUsersByRolesResultType = {
  countPages: number;
  totalRows: number;
  page: number;
  extra?: {
    indent: number;
  };
  totalIncludeRows?: number;
  users: any[];
};
