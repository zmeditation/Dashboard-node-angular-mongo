import { KeyValueExtraValueObject } from '../../../types/object';

export type GetAccountManagersParametersType = {
  roles: string[]|readonly string[];
  sort?: string;
  include?: KeyValueExtraValueObject[]|string;
};

export type BindPublisherToAccountManagerType = {
  publisherId: string;
  newAccountManagerId: string;
  currentAccountManagerId?: string;
};
