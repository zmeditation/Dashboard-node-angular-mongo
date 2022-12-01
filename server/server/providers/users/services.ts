import TestUsersService from '../../services/users/test/testUsersService';
import FilterUsersByRolesService from '../../services/users/filter/byRoles/getUsersByRolesService';
import { userModel } from '../database/mongoDB/models';

const testUsersService = new TestUsersService(userModel);
const filterUsersByRolesService = new FilterUsersByRolesService(userModel);

export { testUsersService, filterUsersByRolesService };
