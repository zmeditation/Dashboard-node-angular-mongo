import UserModel from '../../../../database/mongoDB/models/user';
import DomainModel from '../../../../database/mongoDB/models/domain';

const domainModel = new DomainModel();
const userModel = new UserModel(domainModel);

export {
  domainModel,
  userModel
}
