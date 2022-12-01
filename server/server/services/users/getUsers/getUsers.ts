import Base from '../../Base';
import FilterPermissionUsers from './filterPermissionUsers';
import GetUsersSettingsDTO from './DTO/getUsersSettingsDTO';
import { ServerError } from '../../../handlers/errorHandlers';
import { FilterUsersContract } from './interfaces';
import { GetUsersSuccessResult } from './types';
import { StringKeyObject } from '../../../types/object';

// GET: api/users/get
// Without Query - gets all users that the current user is allowed to see.
// With Query - u: gets all users that have the role that was passed into a query. e.g., ?u=PUBLISHER,ACCOUNT MANAGER
//              noRef: if noRef is true it only returns those users that still don't have a reference to an Account manager or publisher
//                     if noRef is false it only returns those users that already have a reference to an Account manager or publisher
//                     if a noRef query isn't attached to the request it returns all selected user types

export default class GetUsers extends Base {
  protected filterUsers: FilterUsersContract|any;
  protected filterFuncsNameByPerms: StringKeyObject = {
    canReadAllUsers: 'getAllUsers',
    canReadAllPubs: 'getAllPubs',
    canReadOwnPubs: 'getOwnPubs'
  };

  public constructor(args: any) {
    super(args);
    this.filterUsers = new FilterPermissionUsers();
  }

  public async execute({ body, query }: { body: any, query: any }): Promise<GetUsersSuccessResult|never> {
    const { permission, id: userTokenId } = body.additional;
    const data = new GetUsersSettingsDTO();

    data.roles = query.roles ? query.roles : [];
    data.search = query.search || '';
    data.page = query.page ? parseInt(query.page) : 1;
    data.limit = query.limit ? parseInt(query.limit) : 10;
    data.step = query.step ? parseInt(query.step) : 5;
    data.noRef = query.noRef || '';
    data.sort = query.sort || '';
    data.include = query.include ? query.include : [];
    data.indent = query.indent ? parseInt(query.indent) : 0;
    data.userTokenId = userTokenId;
    data.fields = query.fields ? query.fields : [];

    if (permission) {
      const filterFunctionName: string | undefined = this.filterFuncsNameByPerms[permission];

      if (!filterFunctionName) {
        throw new ServerError('FORBIDDEN', 'FORBIDDEN');
      }

      const result = await this.filterUsers[filterFunctionName!](data.toObject());

      if (result.name === 'error' || !result) {
        throw new ServerError(result.message, 'BAD_REQUEST');
      }

      return result;
    } else {
      throw new ServerError('FORBIDDEN', 'FORBIDDEN');
    }
  }
}
