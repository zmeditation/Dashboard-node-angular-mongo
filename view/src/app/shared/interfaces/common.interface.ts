export interface Publisher {
  name: string;
  id: string;
  enabled: { status: boolean; changed: boolean };
  domains: string[];
  am?: string;
  _id: string;
}

export interface Manager {
  manager: string;
  _id: string;
  photo?: string | null;
  publishers: Publisher[];
}

export enum STATUSES {
  declined = 'DECLINED',
  approved = 'APPROVED',
  pending = 'PENDING',
  paid = 'PAID'
}

export interface Invoice {
  createdAt: string;
  fileName?: string;
  name: string;
  publisher: Publisher;
  status: STATUSES;
  updatedAt?: string;
  _id: string;
}

export enum PERMISSIONS {
  PAGE = 'canSeeInvoicesPage',
  CREATE = 'canUploadInvoices',
  EDIT = 'canEditInvoiceStatus',
  SEE_ALL = 'canSeeAllInvoices',
  SEE_OWN = 'canSeeOwnInvoices',
  DELETE = 'canDeleteInvoices'
}

export interface ErrorMessageFromServer {
  msg: string;
}

export interface UserInfo {
  _id: string;
  email: string;
  name: string;
  permissions: string[];
  photo: string;
  wbidUserId: string | null;
  role: string;
  oRTBType?: string;
  oRTBId?: number;
  adWMGAdapter?: boolean | null;
}

export interface SuccessSignIn {
  msg: string;
  success: boolean;
  token: string;
  user: UserInfo;
}

export interface ErrorInfo {
  msg: string;
  success: boolean;
}

export interface User {
  id: string;
  name: string;
  enabled?: boolean;
  domains?: string[];
  selected?: boolean;
}

export type Property = {
  placement_name: string;
  property_description: string;
  property_id: string;
  property_origin: string;
  _id: string;
}

export type PublisherT = {
  name: string;
  _id: string;
  properties?: Array<Property>;
}

export type AdUnitQuery = {
  adUnitParams: {
    configname: string,
    size: {
      width: number,
      height: number
    },
    targetWindow: string,
    environmentType: string,
    isFluid: boolean
  }
}

export type AdUnitResponse = {
  data: {
    type: string,
    attributes: {
      newUnit: any[]
    }
  }
}

export type TServerError = {
	msg: string;
	response: ErrorFromServer
}

export type ErrorFromServer = {
  statusCode:	number;
  statusMessage: string;
  customText: string;
  error: string | any;
}

export type CommonResponse = {
  success: boolean;
  successMsg: string;
  error: ErrorMessageFromServer;
}

export type RevenueManagementMode = 'input' | 'update' | 'delete';
