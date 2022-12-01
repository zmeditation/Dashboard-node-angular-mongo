import { ROLES } from 'shared/interfaces/roles.interface';

export interface IPaginationRequest {
  page: number;
  perPage: number;
}

export interface IPaginationResponse extends IPaginationRequest {
  total: number;
  pages: number;
}

export interface ISelectUserRequest {
  role: ROLES;
  manager?: string;
  am?: string;
}

export interface PaginationInterface {
  page: number;
  total: number;
}
