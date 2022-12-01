import { INameableEntity } from 'shared/interfaces/nameable-entity.interface';
import { PaginationInterface } from 'shared/interfaces/pagination.interface';

export interface IMatAutocompletePaginationData {
  list: INameableEntity[];
  pagination: PaginationInterface;
}
