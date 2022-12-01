import { DomainModel as DomainTable } from '../migrations/domainsModel';
import { DomainModelContract } from '../../../interfaces/database/domain';
import { DomainType, GetDomainByNameParamsType } from '../../../types/database/domain';

export default class DomainModel implements DomainModelContract {
  protected readonly convertedFields = {
    id: '_id',
    refsToUser: 'refs_to_user'
  };

  protected convertedFieldsKeys: string[];

  public constructor() {
    this.convertedFieldsKeys = Object.keys(this.convertedFields);
  }

  public getDomainsByName(data: GetDomainByNameParamsType): Promise<DomainType[] | never> {
    const fields = this.getFields(data.fields);

    if (fields.length) {
      return DomainTable.find({ domain: { $regex: data.name, $options: 'i' } }, fields).then((response: any) => {
        return response.map((el: any) => {
          const result: any = {};

          for (const field of data.fields!) {
            // @ts-ignore
            const notConvertedField = this.convertedFieldsKeys.includes(field) ? this.convertedFields[field] : field;

            // @ts-ignore
            result[field] = el[notConvertedField];
          }

          return result;
        });
      });
    } else {
      return DomainTable.find({ domain: { $regex: data.name, $options: 'i' } });
    }
  }

  public async getDomainUsersIds(name: string): Promise<string[] | number[] | never> {
    const domains = await this.getDomainsByName({ name, fields: ['refsToUser'] });
    const ids: string[] = [];

    if (domains.length) {
      for (const domainElement of domains) {
        for (let userId of domainElement.refsToUser!) {
          userId = userId.toString();

          if (!ids.includes(userId)) {
            ids.push(userId);
          }
        }
      }
    }

    return ids;
  }

  protected getFields(fields?: string[]): string[] {
    const result = [];

    if (fields) {
      for (const field of fields) {
        if (this.convertedFields.hasOwnProperty(field)) {
          // @ts-ignore
          result.push(this.convertedFields[field]);
        }
      }
    }

    return result;
  }
}
