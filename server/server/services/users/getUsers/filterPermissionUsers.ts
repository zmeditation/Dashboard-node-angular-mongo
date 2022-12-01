import User from '../../../database/mongoDB/migrations/UserModel';
import PaginationUtil from '../../../utils/pagination';
import SortUtil from '../../../utils/sort';
import allowedUserFields from '../../../constants/allowedUserFields';
import { DomainModel } from '../../../database/mongoDB/migrations/domainsModel';
import { FilterUsersContract } from './interfaces';
import {
  GetUsersSettings,
  HandleResponseUsersWithIncludeSettings,
  HandleResponseUsersWithIncludeResult,
  GetUsersSuccessResult,
  GetUsersErrorResult,
  UpdateResultIfIncludeParamExistSettings
} from './types';
import { KeyValueExtraValueObject, StringKeyObject } from '../../../types/object';
import { UserMDB } from '../../../types/user';
import { ROLES } from '../../../constants/roles';

export default class FilterPermissionUsers implements FilterUsersContract {
  protected convertedFields = {
    id: '_id',
    dateToConnectAM: 'date_to_connect_am'
  };

  public constructor() {}

  public async getAllUsers(data: GetUsersSettings): Promise<GetUsersSuccessResult | GetUsersErrorResult> {
    try {
      let result: GetUsersSuccessResult = {
        countPages: 1,
        totalRows: 0,
        page: 1,
        users: []
      };
      let users;

      if (data.noRef) {
        users = await this.filterByReference(data.roles, data.noRef);
      } else {
        let sort;
        let query = this.getQueryAllUsers(data.roles, data.search);

        await this.updateQueryByDomains({ data, query });

        const totalRows = await User.countDocuments(query).exec();

        if (!totalRows) {
          return result;
        }

        let paginationSettings = PaginationUtil.getMongoDBSettings({
          limit: data.limit,
          page: data.page,
          step: data.step,
          indent: data.indent,
          totalRows
        });

        this.updateQueryIfInclude(query, data.include);

        if (data.sort) {
          sort = SortUtil.queryStringToMongoDBObject(data.sort);

          users = await User.find(query, allowedUserFields)
            .limit(paginationSettings.limit)
            .skip(paginationSettings.startIndex)
            .sort(sort)
            .lean();
        } else {
          users = await User.find(query, allowedUserFields).limit(paginationSettings.limit).skip(paginationSettings.startIndex).lean();
        }

        result.countPages = paginationSettings.countPages;
        result.totalRows = paginationSettings.totalRows;
        result.page = paginationSettings.page;

        users = await this.updateResultIfIncludeParamExist({ data, query, users, paginationSettings, sort, result });
      }

      if (data.fields.length) {
        result.users = this.structureUsersByFieldsParameter(users, data.fields);
      } else {
        result.users = users;
      }

      return result;
    } catch (err: any) {
      console.error(err);
      return this.errorToObject(err);
    }
  }

  protected async updateQueryByDomains({ query, data }: { query: any; data: GetUsersSettings }): Promise<void> {
    const totalRows = await User.countDocuments(query).exec();

    if (!totalRows && data.roles.includes(ROLES.PUBLISHER) && data.search) {
      const domains = await DomainModel.find({ domain: { $regex: data.search, $options: 'i' } });

      if (domains.length) {
        delete query.name;

        const ids: string[] = [];

        for (const domainElement of domains) {
          for (let userId of domainElement.refs_to_user) {
            userId = userId.toString();

            if (!ids.includes(userId)) {
              ids.push(userId);
            }
          }
        }

        query._id = ids;
      }
    }
  }

  protected async updateResultIfIncludeParamExist({
    data,
    query,
    users,
    paginationSettings,
    sort,
    result
  }: UpdateResultIfIncludeParamExistSettings): Promise<UserMDB[] | never> {
    if (data.include && data.include.length) {
      const handleIncludeCheck = await this.handleResponseUsersWithInclude({
        query,
        users,
        paginationSettings,
        sort,
        include: data.include
      });

      if (handleIncludeCheck.extra) {
        users = [...users, ...handleIncludeCheck.users!];

        result.extra = {
          indent: handleIncludeCheck.indent!
        };
      }

      result.totalIncludeRows = await User.countDocuments(query).exec();
    }

    return users;
  }

  protected structureUsersByFieldsParameter(users: UserMDB[], fields: string[]): any[] {
    return users.map((user) => {
      const result: any = {};

      for (const field of fields) {
        // @ts-ignore
        const convertedField = this.convertedFields[field];

        if (convertedField) {
          // @ts-ignore
          result[field] = user[convertedField];
        } else {
          // @ts-ignore
          result[field] = user[field];
        }
      }
      return result;
    });
  }

  /**
   * If there are fewer users than it should be, then add the missing users by extra parameters
   */
  protected async handleResponseUsersWithInclude({
    query,
    users,
    paginationSettings,
    include,
    sort
  }: HandleResponseUsersWithIncludeSettings): Promise<HandleResponseUsersWithIncludeResult> {
    if (paginationSettings.limit === users.length || this.checkIncludeDataEquallyExtra(include)) {
      return {
        extra: false
      };
    }

    for (const obj of include) {
      query[obj.key] = obj.extraValue;
    }

    const limit = paginationSettings.limit - users.length;

    if (sort) {
      users = await User.find(query).limit(limit).sort(sort).lean();
    } else {
      users = await User.find(query).limit(limit).lean();
    }

    return {
      extra: true,
      users,
      indent: users.length
    };
  }

  protected checkIncludeDataEquallyExtra(include: KeyValueExtraValueObject[]): boolean {
    for (const obj of include) {
      if (obj.value !== obj.extraValue) {
        return false;
      }
    }

    return true;
  }

  protected getQueryAllUsers(roles: string[], search: string): object {
    const query: StringKeyObject = {};

    if (roles.length) {
      query.role = { $in: roles };
    }

    this.updateQueryIfSearchExist(query, search);

    return query;
  }

  protected updateQueryIfInclude(query: StringKeyObject, include: KeyValueExtraValueObject[]) {
    if (include.length) {
      for (const obj of include) {
        query[obj.key] = obj.value;
      }
    }
  }

  public async getAllPubs(data: GetUsersSettings): Promise<GetUsersSuccessResult | GetUsersErrorResult> {
    try {
      let result: GetUsersSuccessResult = {
        countPages: 1,
        totalRows: 0,
        page: 1,
        users: []
      };
      let users;

      if (data.noRef) {
        users = await this.filterByReference(data.roles, data.noRef);
      } else {
        let sort;
        const query = await this._getQueryAllPubs(data.roles, data.search, data.userTokenId);

        await this.updateQueryByDomains({ data, query });

        const totalRows = await User.countDocuments(query).exec();

        if (!totalRows) {
          return result;
        }

        let paginationSettings = PaginationUtil.getMongoDBSettings({
          limit: data.limit,
          page: data.page,
          step: data.step,
          indent: data.indent,
          totalRows
        });

        this.updateQueryIfInclude(query, data.include);

        if (data.sort) {
          sort = SortUtil.queryStringToMongoDBObject(data.sort);

          users = await User.find(query, allowedUserFields)
            .limit(paginationSettings.limit)
            .skip(paginationSettings.startIndex)
            .sort(sort)
            .lean();
        } else {
          users = await User.find(query, allowedUserFields).limit(paginationSettings.limit).skip(paginationSettings.startIndex).lean();
        }

        result.countPages = paginationSettings.countPages;
        result.totalRows = paginationSettings.totalRows;
        result.page = paginationSettings.page;

        users = await this.updateResultIfIncludeParamExist({ data, query, users, paginationSettings, sort, result });
      }

      if (data.fields.length) {
        result.users = this.structureUsersByFieldsParameter(users, data.fields);
      } else {
        result.users = users;
      }

      return result;
    } catch (err: any) {
      return this.errorToObject(err);
    }
  }

  protected async _getQueryAllPubs(roles: string[], search: string, userTokenId: string | number) {
    const query = await this._preparingQuerySeniorAM(roles, userTokenId);

    this.updateQueryIfSearchExist(query, search);

    return query;
  }

  protected async _preparingQuerySeniorAM(roles: string[], userTokenId: string | number) {
    const currentUser = await User.findOne({ _id: userTokenId }, allowedUserFields).lean();
    const allPubsIds = await User.find({ role: 'PUBLISHER' }).distinct('_id');
    const idsArray = [];

    idsArray.push(userTokenId);

    currentUser.connected_users.am.forEach((el: string) => {
      idsArray.push(el);
    });

    const idsAllPubs = allPubsIds.concat(idsArray);
    const queryToFind = this.filterByRole(currentUser, idsAllPubs, roles);

    return queryToFind;
  }

  public async getOwnPubs(data: GetUsersSettings): Promise<GetUsersSuccessResult | GetUsersErrorResult> {
    try {
      let result: GetUsersSuccessResult = {
        countPages: 1,
        totalRows: 0,
        page: 1,
        users: []
      };
      let users;
      let sort;
      const query = await this.getQueryOwnPubs(data.roles, data.search, data.userTokenId);

      await this.updateQueryByDomainsOwnPubs({ data, query });

      const totalRows = await User.countDocuments(query).exec();

      if (!totalRows) {
        return result;
      }

      const paginationSettings = PaginationUtil.getMongoDBSettings({
        limit: data.limit,
        page: data.page,
        step: data.step,
        indent: data.indent,
        totalRows: await User.countDocuments(query).exec()
      });

      this.updateQueryIfInclude(query, data.include);

      if (data.sort) {
        sort = SortUtil.queryStringToMongoDBObject(data.sort);

        users = await User.find(query, allowedUserFields)
          .limit(paginationSettings.limit)
          .skip(paginationSettings.startIndex)
          .sort(sort)
          .lean();
      } else {
        users = await User.find(query, allowedUserFields).limit(paginationSettings.limit).skip(paginationSettings.startIndex).lean();
      }

      result.countPages = paginationSettings.countPages;
      result.totalRows = paginationSettings.totalRows;
      result.page = paginationSettings.page;

      users = await this.updateResultIfIncludeParamExist({ data, query, users, paginationSettings, sort, result });

      if (data.fields.length) {
        result.users = this.structureUsersByFieldsParameter(users, data.fields);
      } else {
        result.users = users;
      }

      return result;
    } catch (err: any) {
      return this.errorToObject(err);
    }
  }

  protected async getQueryOwnPubs(roles: string[], search: string, userTokenId: string | number): Promise<StringKeyObject> {
    const query = await this.preparingQueryAM(roles, userTokenId);

    this.updateQueryIfSearchExist(query, search);

    return query;
  }

  protected async updateQueryByDomainsOwnPubs({ data, query }: any): Promise<void> {
    const totalRows = await User.countDocuments(query).exec();

    if (!totalRows && data.roles.includes(ROLES.PUBLISHER) && data.search) {
      const ownPubsIds = query._id.$in.map((element: object) => element.toString());
      const domains = await DomainModel.find({ domain: { $regex: data.search, $options: 'i' }, refs_to_user: { $all: ownPubsIds } });

      if (domains.length) {
        delete query.name;

        const ids: string[] = [];

        for (const domainElement of domains) {
          for (const userId of domainElement.refs_to_user) {
            if (ownPubsIds.includes(userId.toString()) && !ids.includes(userId.toString())) {
              ids.push(userId);
            }
          }
        }

        query._id = ids;
      }
    }
  }

  protected updateQueryIfSearchExist(query: StringKeyObject, search?: string): void {
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
  }

  protected async preparingQueryAM(roles: string[], userTokenId: string | number): Promise<StringKeyObject> {
    const currentUser = await User.findOne({ _id: userTokenId }, allowedUserFields).lean();
    const PubsIds = await User.find({ role: 'PUBLISHER', am: userTokenId }).distinct('_id');

    return this.filterByRole(currentUser, PubsIds, roles);
  }

  /**
   * @deprecated function gets pubs of account managers of senior manager
   */
  async _findPubsOfAM(arr: any): Promise<any> {
    const allPubsID: any = [];

    await User.find({ _id: { $in: arr } })
      .lean()
      .then((res: any) => {
        res.forEach((el: any) => {
          allPubsID.push(el._id);

          if ('ACCOUNT MANAGER' === el.role) {
            el.connected_users.p.forEach((p: any) => {
              allPubsID.push(p);
            });
          }
        });
      });

    return allPubsID;
  }

  protected filterByRole(user: UserMDB, idsAllPubs: string[], roles: string[]): StringKeyObject {
    let queryToFind: StringKeyObject;

    if (user.role === 'CEO MANAGE' || 'CEO' === user.role) {
      queryToFind =
        roles.length > 0
          ? {
              role: { $in: roles }
            }
          : {
              role: {
                $in: ['PUBLISHER', 'ACCOUNT MANAGER', 'SENIOR ACCOUNT MANAGER', 'MEDIA BUYER']
              }
            };
    } else {
      if (roles.length > 0) {
        queryToFind =
          'AD OPS' !== user.role && 'MEDIA BUYER' !== user.role
            ? {
                role: { $in: roles },
                _id: { $in: idsAllPubs }
              }
            : {
                role: { $in: roles }
              };
      } else {
        queryToFind =
          'AD OPS' !== user.role && 'MEDIA BUYER' !== user.role
            ? {
                role: {
                  $in: ['PUBLISHER', 'ACCOUNT MANAGER', 'SENIOR ACCOUNT MANAGER']
                },
                _id: { $in: idsAllPubs }
              }
            : {
                role: {
                  $in: ['PUBLISHER', 'ACCOUNT MANAGER', 'SENIOR ACCOUNT MANAGER', 'CEO MANAGE', 'CEO', 'MEDIA BUYER']
                }
              };
      }
    }
    return queryToFind;
  }

  protected filterByReference(roles: string[], noRef: string): Promise<UserMDB[] | never> {
    return User.find({ role: { $in: roles } }, { name: 1, _id: 1, sam: 1, am: 1, role: 1 })
      .lean()
      .then((result: UserMDB[]) => {
        if (noRef && 'true' === noRef) {
          result = result.filter((el) => {
            if ('ACCOUNT MANAGER' === el.role && null === el.sam) {
              return true;
            }
            if ('PUBLISHER' === el.role && null === el.am) {
              return true;
            }
            return false;
          });
        } else if (noRef && 'false' === noRef) {
          result = result.filter((el) => {
            if ('ACCOUNT MANAGER' === el.role && null !== el.sam) {
              return true;
            }
            if ('PUBLISHER' === el.role && null !== el.am) {
              return true;
            }
            return false;
          });
        }
        return result;
      });
  }

  protected errorToObject(err: Error | any): GetUsersErrorResult {
    return {
      name: 'error',
      message: err.message,
      errorName: err.name
    };
  }
}
