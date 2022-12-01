import { INameableEntity } from 'shared/interfaces/nameable-entity.interface';

export interface IOwnManagersResponse {
  seniorManager: INameableEntity | null;
  accountManager: INameableEntity | null;
}
