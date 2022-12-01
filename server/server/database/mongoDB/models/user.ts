import UserTable from '../../../database/mongoDB/migrations/UserModel';
import PaginationUtil from '../../../utils/pagination';
import SortUtil from '../../../utils/sort';
import allowedUserFields from '../../../constants/allowedUserFields';
import { ROLES } from '../../../constants/roles';
import { UserModelContract } from '../../../interfaces/database/user';
import { DomainModelContract } from '../../../interfaces/database/domain';
import {
  GetTestUsersParamsType,
  TestUserType,
  GetUsersWithPaginationParamsType,
  GetUsersResultType,
  UserType,
  GetUserByIdParamsType,
  GetUsersIdsParamsType
} from '../../../types/database/user';
import { ResultSettingsMongoDb } from '../../../utils/pagination/types';
import { StringKeyObject, KeyValueExtraValueObject } from '../../../types/object';

type HandleUsersWithIncludeParamsType = {
  query: StringKeyObject;
  users: UserType[];
  paginationSettings: ResultSettingsMongoDb;
  include: KeyValueExtraValueObject[];
  sort?: object;
};

type HandleUsersWithIncludeResult = {
  extra: boolean;
  indent?: number;
  users?: UserType[];
};

export default class UserModel implements UserModelContract {
  protected domainModel: DomainModelContract;

  protected readonly convertedFields = {
    id: '_id',
    dateToConnectAM: 'date_to_connect_am',
    connectedUsers: 'connected_users'
  };

  protected convertedFieldsKeys: string[];

  public constructor(domainModel: DomainModelContract) {
    this.domainModel = domainModel;
    this.convertedFieldsKeys = Object.keys(this.convertedFields);
  }

  public getTestUsers(data: GetTestUsersParamsType): Promise<TestUserType[] | never> {
    const roles = data.filter && data.filter.roles ? data.filter.roles : [];
    const query: any = {
      is_test: true
    };

    if (roles.length) {
      query.role = { $in: roles };
    }

    return UserTable.find(query, ['_id', 'uuid', 'name'])
      .lean()
      .then((result: UserType[]) => {
        return result.map((el) => {
          return {
            // @ts-ignore
            id: el._id!.toString(),
            uuid: el.uuid,
            name: el.name
          };
        });
      });
  }

  public async getUserById(data: GetUserByIdParamsType): Promise<UserType | null | never> {
    let result = await UserTable.findById(data.id, this.getUsersFields(data.fields)).lean();

    if (result) {
      if (data.fields) {
        result = this.convertUserFieldsByFieldsParam(result, data.fields!);
      } else {
        result.id = result._id.toString();

        delete result._id;
      }
    }

    return result;
  }

  public async getUsersWithPaginationCount(data: GetUsersWithPaginationParamsType): Promise<number | never> {
    const query = await this.getUsersQuery(data);

    return UserTable.countDocuments(query).exec();
  }

  public async getUsersWithPagination(data: GetUsersWithPaginationParamsType): Promise<GetUsersResultType | never> {
    let result: GetUsersResultType = {
      countPages: 1,
      totalRows: 0,
      page: 1,
      users: []
    };
    const query = await this.getUsersQuery(data);

    if (query._id && !query._id.$in.length) {
      return result;
    }

    const limit = data.limit ? data.limit : 10;
    const page = data.page ? data.page : 1;
    const indent = data.indent ? data.indent : 0;
    const step = data.step ? data.step : 5;
    const totalRows = data.totalRows ? data.totalRows : await UserTable.countDocuments(query).exec();
    const fields = this.getUsersFields(data.fields);
    const sort = data.sort ? SortUtil.queryStringToMongoDBObject(data.sort) : undefined;
    const paginationSettings = PaginationUtil.getMongoDBSettings({
      limit,
      page,
      indent,
      step,
      totalRows
    });
    const isInclude = data?.include?.length ? true : false;

    if (isInclude) {
      for (const obj of data.include!) {
        query[obj.key] = obj.value;
      }
    }

    if (data.sort) {
      result.users = await UserTable.find(query, fields)
        .limit(paginationSettings.limit)
        .skip(paginationSettings.startIndex)
        .sort(sort)
        .lean();
    } else {
      result.users = await UserTable.find(query, fields).limit(paginationSettings.limit).skip(paginationSettings.startIndex).lean();
    }

    result.countPages = paginationSettings.countPages;
    result.totalRows = paginationSettings.totalRows;
    result.page = paginationSettings.page;

    if (isInclude) {
      const handleIncludeCheck = await this.handleResponseUsersWithInclude({
        query,
        users: result.users,
        paginationSettings,
        sort,
        include: data.include!
      });

      if (handleIncludeCheck.extra) {
        result.users = [...result.users, ...handleIncludeCheck.users!];

        result.extra = {
          indent: handleIncludeCheck.indent!
        };
      }

      result.totalIncludeRows = await UserTable.countDocuments(query).exec();
    }

    if (fields === allowedUserFields) {
      result.users = result.users.map((user: UserType) => {
        // @ts-ignore
        const id = user._id;

        // @ts-ignore
        delete user._id;

        user.id = id;

        return user;
      });
    } else {
      result.users = result.users.map((user: UserType) => {
        return this.convertUserFieldsByFieldsParam(user, data.fields!);
      });
    }

    return result;
  }

  protected async getUsersQuery(data: GetUsersWithPaginationParamsType): Promise<StringKeyObject | never> {
    const query: StringKeyObject = {};

    if (data.roles && !data.ids) {
      query.role = { $in: data.roles };
    }

    if (data.ids && !data.roles) {
      query._id = { $in: data.ids };
    }

    if (data.search) {
      if (data.search.by === 'domain') {
        query.role = { $in: [ROLES.PUBLISHER] };
        const usersIds = await this.domainModel.getDomainUsersIds(data.search.value);

        if (query._id) {
          const queryIds = [];

          for (const userId of usersIds) {
            if (query._id.$in.includes(userId)) {
              queryIds.push(userId);
            }
          }

          query._id.$in = queryIds;
        } else {
          query._id = { $in: usersIds };
        }
      } else {
        query[data.search.by] = { $regex: data.search.value, $options: 'i' };
      }
    }

    return query;
  }

  protected getUsersFields(fields?: string[]): string[] | object {
    if (fields && fields.length) {
      const result = [];
      const convertedFieldsKeys = Object.keys(this.convertedFields);

      for (let field of fields) {
        if (convertedFieldsKeys.includes(field)) {
          // @ts-ignore
          field = this.convertedFields[field];
        }

        result.push(field);
      }

      return result;
    } else {
      return allowedUserFields;
    }
  }

  protected convertUserFieldsByFieldsParam(user: UserType, fields: string[]): UserType {
    const convertedUser: any = {};

    for (const field of fields!) {
      // @ts-ignore
      const notConvertedField = this.convertedFieldsKeys.includes(field) ? this.convertedFields[field] : field;

      // @ts-ignore
      convertedUser[field] = user[notConvertedField];
    }

    return convertedUser;
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
  }: HandleUsersWithIncludeParamsType): Promise<HandleUsersWithIncludeResult> {
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
      users = await UserTable.find(query).limit(limit).sort(sort).lean();
    } else {
      users = await UserTable.find(query).limit(limit).lean();
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

  public getUsersIds(data: GetUsersIdsParamsType): Promise<string[] | number[] | never> {
    const query: any = {};

    if (data.roles) {
      query.role = { $in: data.roles };
    }

    if (data.am) {
      query.am = data.am;
    }

    console.log(query);

    return UserTable.find(query, ['_id'])
      .distinct('_id')
      .lean()
      .then((result: any) => {
        return result.map((el: any) => el._id.toString());
      });
  }
}
