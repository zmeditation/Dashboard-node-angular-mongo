import { DomainType, GetDomainByNameParamsType } from '../../types/database/domain';

export interface DomainModelContract {
  getDomainsByName(data: GetDomainByNameParamsType): Promise<DomainType[] | never>;
  getDomainUsersIds(name: string): Promise<string[] | number[] | never>;
}