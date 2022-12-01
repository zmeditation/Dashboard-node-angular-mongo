import AccountManagerController from '../../http/controllers/user/accountManagerController';
import GetUserController from '../../http/controllers/user/getUserController';
import { testUsersService, filterUsersByRolesService } from './services';
import { accountManagerService } from './accountManager/services';

const accountManagerController = new AccountManagerController(accountManagerService);
const getUserController = new GetUserController(filterUsersByRolesService, testUsersService, accountManagerService);

export { accountManagerController, getUserController };
