import { IPaginationResponse } from './pagination.interface';
import { INameableEntity } from './nameable-entity.interface';

interface IPublisherSimple extends INameableEntity {
  am?: INameableEntity;
}

export interface IUsersSearchResponse {
  pagination: IPaginationResponse;
  list: INameableEntity[] | IPublisherSimple[];
}
