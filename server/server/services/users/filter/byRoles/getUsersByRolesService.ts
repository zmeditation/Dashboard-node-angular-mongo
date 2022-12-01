import GetFilterUsersRoleExeption from './exeptions/getFilterUsersRoleExeption';
import GetFilterUsersAllPubsAndAMsPermissionExeption from './exeptions/getFilterUsersAllPubsAndAMsPermissionExeption';
import GetUsersWithPaginationCountDBExeption from './exeptions/getUsersWithPaginationCountDBExeption';
import GetUsersWithPaginationDBExeption from './exeptions/getUsersWithPaginationDBExeption';
import { GetUsersByRolesContract } from './interfaces';
import { UserModelContract } from '../../../../interfaces/database/user';
import { ROLES } from '../../../../constants/roles';
import { GetUsersByRoleParamsType, GetUsersByRolesResultType } from './types';
import { GetUsersWithPaginationParamsType, GetUsersResultType } from '../../../../types/database/user';
import { StringKeyObject } from '../../../../types/object';

export default class GetUsersByRolesService implements GetUsersByRolesContract {
  protected filterFuncsNameByRoles: StringKeyObject = {
    ADMIN: 'byAllUsers',
    CEO: 'byAllUsers',
    'AD OPS': 'byAllPubsAndAMs',
    'SENIOR ACCOUNT MANAGER': 'byOwnInfoAndOwnPublishersAndAllPubs',
    'ACCOUNT MANAGER': 'byOwnPubs',
    'FINANCE MANAGER': 'byAllPubsAndAMs'
  };

  protected userModel: UserModelContract;

  public constructor(userModel: UserModelContract) {
    this.userModel = userModel;
  }

  public getUsers(params: GetUsersByRoleParamsType): Promise<GetUsersByRolesResultType | never> {
    // @ts-ignore params.permissions is string
    const funcName = this.filterFuncsNameByRoles[params.role];

    if (!funcName) {
      throw new GetFilterUsersRoleExeption();
    }

    // @ts-ignore
    return this[funcName](params);
  }

  protected async byAllUsers(params: GetUsersByRoleParamsType): Promise<GetUsersByRolesResultType | never> {
    let result: GetUsersByRolesResultType = {
      countPages: 1,
      totalRows: 0,
      page: 1,
      users: []
    };
    const totalRows = await this.getTotalRows({
      roles: params.roles,
      search: params.search,
      include: params.include,
      indent: params.indent,
      limit: params.limit,
      page: params.page,
      sort: params.sort,
      step: params.step
    });

    if (!totalRows) {
      return result;
    }

    result = await this.getUsersWithPagination({
      roles: params.roles,
      search: params.search,
      include: params.include,
      indent: params.indent,
      limit: params.limit,
      page: params.page,
      sort: params.sort,
      step: params.step,
      totalRows,
      fields: params.fields
    });

    return result;
  }

  protected async byAllPubsAndAMs(params: GetUsersByRoleParamsType): Promise<GetUsersByRolesResultType | never> {
    let result: GetUsersByRolesResultType = {
      countPages: 1,
      totalRows: 0,
      page: 1,
      users: []
    };

    params.roles = this.filterRolesPubsAndAMs(params.roles);

    const totalRows = await this.getTotalRows({
      roles: params.roles,
      search: params.search,
      include: params.include,
      indent: params.indent,
      limit: params.limit,
      page: params.page,
      sort: params.sort,
      step: params.step
    });

    if (!totalRows) {
      return result;
    }

    result = await this.getUsersWithPagination({
      roles: params.roles,
      search: params.search,
      include: params.include,
      indent: params.indent,
      limit: params.limit,
      page: params.page,
      sort: params.sort,
      step: params.step,
      totalRows,
      fields: params.fields
    });

    return result;
  }

  protected async byOwnInfoAndOwnPublishersAndAllPubs(params: GetUsersByRoleParamsType): Promise<GetUsersByRolesResultType | never> {
    let result: GetUsersByRolesResultType = {
      countPages: 1,
      totalRows: 0,
      page: 1,
      users: []
    };

    params.roles = this.filterRolesPubsAndAMs(params.roles);

    if ((params.roles.length === 1 && params.roles.includes(ROLES.PUBLISHER)) || (params.search && params.search.by === 'domain')) {
      params.roles = [ROLES.PUBLISHER];

      const totalRows = await this.getTotalRows({
        roles: params.roles,
        search: params.search,
        include: params.include,
        indent: params.indent,
        limit: params.limit,
        page: params.page,
        sort: params.sort,
        step: params.step
      });

      if (!totalRows) {
        return result;
      }

      result = await this.getUsersWithPagination({
        roles: params.roles,
        search: params.search,
        include: params.include,
        indent: params.indent,
        limit: params.limit,
        page: params.page,
        sort: params.sort,
        step: params.step,
        totalRows,
        fields: params.fields
      });

      return result;
    } else {
      let ids: any = [];
      let currentUser;
      const includesSAMInRoles = params.roles.includes(ROLES.SENIOR_ACCOUNT_MANAGER);
      const includesAMInRoles = params.roles.includes(ROLES.ACCOUNT_MANAGER);

      if (includesSAMInRoles || includesAMInRoles) {
        currentUser = await this.userModel.getUserById({
          id: params.userTokenId,
          fields: ['connectedUsers']
        });

        includesSAMInRoles && ids.push(params.userTokenId);
      }

      if (includesAMInRoles) {
        ids = [...ids, ...currentUser?.connectedUsers?.am!];
      }

      if (params.roles.includes(ROLES.PUBLISHER)) {
        const publishersIds = await this.userModel.getUsersIds({ roles: [ROLES.PUBLISHER] });

        ids = [...ids, ...publishersIds];
      }

      const totalRows = await this.getTotalRows({
        ids,
        search: params.search,
        include: params.include,
        indent: params.indent,
        limit: params.limit,
        page: params.page,
        sort: params.sort,
        step: params.step
      });

      if (!totalRows) {
        return result;
      }

      result = await this.getUsersWithPagination({
        ids,
        search: params.search,
        include: params.include,
        indent: params.indent,
        limit: params.limit,
        page: params.page,
        sort: params.sort,
        step: params.step,
        totalRows,
        fields: params.fields
      });

      return result;
    }
  }

  private filterRolesPubsAndAMs(roles?: string[]): string[] | never {
    const result = [];

    if (roles && roles.length) {
      for (const role of roles) {
        if (role === ROLES.PUBLISHER || role === ROLES.SENIOR_ACCOUNT_MANAGER || role === ROLES.ACCOUNT_MANAGER) {
          result.push(role);
        }
      }
    } else {
      result.push(ROLES.PUBLISHER);
      result.push(ROLES.SENIOR_ACCOUNT_MANAGER);
      result.push(ROLES.ACCOUNT_MANAGER);
    }

    if (!result.length) {
      throw new GetFilterUsersAllPubsAndAMsPermissionExeption();
    }

    return result;
  }

  protected async byOwnPubs(params: GetUsersByRoleParamsType): Promise<GetUsersByRolesResultType | never> {
    let result: GetUsersByRolesResultType = {
      countPages: 1,
      totalRows: 0,
      page: 1,
      users: []
    };

    if (!params.roles || params.roles.length > 1 || (params.roles.length === 1 && !params.roles.includes(ROLES.PUBLISHER))) {
      params.roles = [ROLES.PUBLISHER];
    }

    const ids = await this.userModel.getUsersIds({ roles: params.roles, am: params.userTokenId });

    const totalRows = await this.getTotalRows({
      ids,
      search: params.search,
      include: params.include,
      indent: params.indent,
      limit: params.limit,
      page: params.page,
      sort: params.sort,
      step: params.step
    });

    if (!totalRows) {
      return result;
    }

    result = await this.getUsersWithPagination({
      ids,
      search: params.search,
      include: params.include,
      indent: params.indent,
      limit: params.limit,
      page: params.page,
      sort: params.sort,
      step: params.step,
      totalRows,
      fields: params.fields
    });

    return result;
  }

  protected async getTotalRows(params: GetUsersWithPaginationParamsType): Promise<number | never> {
    try {
      return await this.userModel.getUsersWithPaginationCount(params);
    } catch (error: any) {
      throw new GetUsersWithPaginationCountDBExeption(error.stack);
    }
  }

  protected async getUsersWithPagination(params: GetUsersWithPaginationParamsType): Promise<GetUsersResultType | never> {
    try {
      return await this.userModel.getUsersWithPagination(params);
    } catch (error: any) {
      throw new GetUsersWithPaginationDBExeption(error.stack);
    }
  }
}
