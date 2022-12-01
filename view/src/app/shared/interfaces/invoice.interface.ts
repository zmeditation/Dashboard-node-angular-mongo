import { INameableEntity } from './nameable-entity.interface';

export enum INVOICE_STATUS {
  DECLINED = 'declined',
  APPROVED = 'approved',
  PENDING = 'pending',
  PAID = 'paid'
}

export interface IInvoice {
  name: string;
  status: INVOICE_STATUS;
  publisher: INameableEntity;
  createdAt: string;
  _id: string;
}

export interface CancelReason {
  reason: string;
  custom: boolean;
}

export enum CANCEL_REASON {
  AMOUNT = 'INCORRECT_AMOUNT',
  INCORRECT_DATA = 'INCORRECT_DATA',
  INCOMPLETE_DATA = 'INCOMPLETE_DATA',
  PERIOD = 'INCORRECT_PERIOD',
  PAID = 'ALREADY_PAID'
}

export interface Revenue {
  revenue: number;
  revenue_rtb: number;
  deduction: number;
  publisher: string;
  total?: number;
  begin: string;
  end: string;
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}
