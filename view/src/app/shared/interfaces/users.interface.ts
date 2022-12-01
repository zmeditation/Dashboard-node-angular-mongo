import { ROLES } from './roles.interface';

export interface GetUsersQuery {
  findBy: string[];
  options: string;
}

interface UnitInterface {
  placement_name: string;
  property_id: string;
  property_description: string;
  property_origin: string;
}

export interface User {
  id: string;
  name: string;
  permissions: string[];
  email: string;
  additional: {
    company: string;
    phone: string;
    skype: string;
    address: string;
    birthday: Date;
    description: string;
  };
  commission: {
    commission_number: number;
    commission_type: string;
  };
  enabled: {
    changed: boolean;
    status: boolean;
  };
  photo: string;
  domains: Array<string>;
  cwe: boolean;
  properties: Array<UnitInterface>;
  role: ROLES;
  wbidUserId: number | null;
  oRTBId: number;
  oRTBType: string;
  adWMGAdapter: boolean;
  connected_users: {
    p: Array<any>;
    am: Array<any>;
  };
  am: string | any;
  sam: string | any;
  wbidType: Array<string>;
  _id: string;
}
