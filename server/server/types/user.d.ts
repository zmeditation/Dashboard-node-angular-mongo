export type UnitType = {
  placement_name: string;
  property_id: string;
  property_description: string;
  property_origin: string;
}

export type UserMDB = {
  _id: string;
  name: string;
  email: string;
  additional: AdditionalUserMDB;
  password: string;
  uuid: string;
  commission: CommissionUserMDB;
  enabled: EnabledUserMDB;
  role: string;
  permissions: string[];
  photo?: string;
  domains: any[];
  cwe: boolean;
  properties: UnitType[];
  property_origin: PropertyOriginUserMDB;
  am: string;
  sam: string;
  date_to_connect_am: Date | null;
  previouslyUploadedReports: any; // TODO: Type
  generatedReport?: string;
  wbidType: any[];
  wbidUserId: number | null;
  oRTBId: number | null,
  oRTBType: string | null,
  adWMGAdapter: boolean | null
};

export type AdditionalUserMDB = {
  company?: string;
  phone?: string;
  skype?: string;
  address?: string;
  birthday?: Date;
  description?: string;
};

export type CommissionUserMDB = {
  commission_number: number;
  commission_type: string;
}

export type EnabledUserMDB = {
  changed: boolean;
  status: boolean;
};

export type PropertyOriginUserMDB = {
  p: UserMDB;
  am: UserMDB;
};

export type GetAccountManagerType = {
  id: string;
  role: string;
  name: string;
  enabled: boolean;
};
