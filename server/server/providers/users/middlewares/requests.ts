import GetUsersRequest from '../../../http/middlewares/users/request/getUsersRequest';
import GetUserRequest from '../../../http/middlewares/users/request/getUserRequest';
import UpdateUserRequest from '../../../http/middlewares/users/request/updateUserRequest';
import CreateUserRequest from '../../../http/middlewares/users/request/createUserRequest';
import GetTestUsersRequest from '../../../http/middlewares/users/request/getTestUsersRequest';

const getUsersRequest = new GetUsersRequest();
const getUserRequest = new GetUserRequest();
const updateUserRequest = new UpdateUserRequest();
const createUserRequest = new CreateUserRequest();
const getTestUsersRequest = new GetTestUsersRequest();

export {
  getUsersRequest,
  getUserRequest,
  updateUserRequest,
  createUserRequest,
  getTestUsersRequest
};

