import { ACCOUNT_MANAGER_ROLES } from '../../../constants/roles';
import { ERRORS, ERROR_CODES } from '../../../constants/errors';
import { GetUsersByRolesContract } from '../../../services/users/filter/byRoles/interfaces';
import { TestUsersContract } from '../../../services/users/test/interfaces';
import { AccountManagerContract } from '../../../services/users/accountManager/interfaces';
import { GetAccountManagersParametersType } from '../../../services/users/accountManager/types';
import { Request, Response } from '../../../interfaces/express';
import { Objectable } from '../../../interfaces/objectable';

export default class GetUserController {
  private filterUsersByRoleService: GetUsersByRolesContract;
  private testUsersService: TestUsersContract;
  private accountManagerService: AccountManagerContract;

  public constructor(
    filterUsersByRoleService: GetUsersByRolesContract,
    testUsersService: TestUsersContract,
    accountManagerService: AccountManagerContract
  ) {
    this.filterUsersByRoleService = filterUsersByRoleService;
    this.testUsersService = testUsersService;
    this.accountManagerService = accountManagerService;
  }

  public async listByPermissions(request: Request, response: Response): Promise<void> {
    try {
      let result;
      let statusCode = 200;
      let { roles, search, page, limit, step, sort, include, indent, fields } = request.query;
      const { id: userTokenId, role } = request.body.additional;

      try {
        const usersData = await this.filterUsersByRoleService.getUsers({
          role,
          roles,
          search,
          page,
          limit,
          step,
          sort,
          include,
          indent,
          fields,
          userTokenId
        });

        result = {
          status: statusCode,
          data: usersData
        };
      } catch (error: any) {
        statusCode = error.statusCode;
        result = this._getErrorResponse(error);
      }

      response.status(statusCode).send(JSON.stringify(result));
    } catch (error: any) {
      const errorResult = this._getErrorResponse(error);
      response.status(errorResult.status).send(JSON.stringify(errorResult));
    }
  }

  public async getTestUsers(request: Request, response: Response) {
    try {
      let result;
      let statusCode = 200;
      const roles = request.query.roles ? request.query.roles.split(',') : [];

      try {
        const testUsers = await this.testUsersService.getTestUsers({
          roles
        });

        result = {
          status: statusCode,
          data: testUsers
        };
      } catch (error: any) {
        statusCode = error.statusCode;
        result = this._getErrorResponse(error);
      }

      response.status(statusCode).send(JSON.stringify(result));
    } catch (error: any) {
      const errorResult = this._getErrorResponse(error);
      response.status(errorResult.status).send(JSON.stringify(errorResult));
    }
  }

  public async getAccountManagers(request: Request, response: Response): Promise<void> {
    try {
      let result;
      let statusCode = 200;
      const { sort, include } = request.query;

      const data: GetAccountManagersParametersType = {
        roles: [...ACCOUNT_MANAGER_ROLES],
        sort,
        include
      };

      try {
        const accountManagers = await this.accountManagerService.getAccountManagers(data);
        result = {
          status: statusCode,
          data: accountManagers
        };
      } catch (error: any) {
        statusCode = error.statusCode;
        result = this._getErrorResponse(error);
      }

      response.status(statusCode).send(JSON.stringify(result));
    } catch (error: any) {
      const errorResult = this._getErrorResponse(error);
      response.status(errorResult.status).send(JSON.stringify(errorResult));
    }
  }

  private _getErrorResponse(error: Objectable | any): any {
    console.error(error);

    // check not exception error
    const errorData = error.toObject
      ? error.toObject()
      : {
          status: ERROR_CODES.INTERNAL_SERVER_ERROR,
          error: {
            message: ERRORS.INTERNAL_SERVER_ERROR
          }
        };

    return errorData;
  }
}
