// @ts-ignore
import multer from 'multer';
import ServiceRunner from '../../../services/ServiceRunner';
import GetUser from '../../../services/users/getUser/GetUser';
import GetUsers from '../../../services/users/getUsers/getUsers';
import GetPublishers from '../../../services/users/GetPublishers/GetPublishers';
import SearchUsers from '../../../services/users/SearchUsers/SearchUsers';
import GetRoles from '../../../services/users/GetRoles/GetRoles';
import AddUser from '../../../services/users/AddUser/AddUser';
import UpdateUser from '../../../services/users/updateUser/updateUser';
import DeleteUser from '../../../services/users/DeleteUser/DeleteUser';
import GetVacantProperties from '../../../services/users/GetVacantProperties/GetVacantProperties';
import { GetCheckedDomains } from '../../../services/users/AdsTxtDomains/GetCheckedDomains';
import UploadAvatar from '../../../services/users/UploadAvatar/UploadAvatar';
import SetterApiToken from '../../../services/reporting/apiToken';
import GetUsersEmails from '../../../services/users/GetEmails';
import GetSSPPartners from '../../../services/users/SSPPubs';
import GetDSPPartners from '../../../services/users/DSPPubs';
import AddRTBUser from '../../../services/users/AddRTBUser';
import { GetOwnManagers } from '../../../services/users/GetOwnManagers/GetOwnManagers';

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req: any, file: any, next: any) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (!isPhoto) {
      next({ message: 'FILE_NOT_ALLOWED' }, false);
    }
    next(null, true);
  }
};

export default {
  getUser: ServiceRunner(GetUser, (req: any) => {
    return { body: req.body, paramsId: req.params.id, query: req.query };
  }),
  getUsers: ServiceRunner(GetUsers, (req: any) => {
    return { body: req.body, query: req.query };
  }),
  getPublishers: ServiceRunner(GetPublishers, (req: any) => {
    return { body: req.body };
  }),
  getOwnManagers: ServiceRunner(GetOwnManagers, (req: any) => {
    return { body: req.body };
  }),
  getRoles: ServiceRunner(GetRoles, (req: any) => {
    return { body: req.body };
  }),
  getUsersEmails: ServiceRunner(GetUsersEmails, (req: any) => {
    return { req, body: req.body };
  }),
  getVacantProperties: ServiceRunner(GetVacantProperties, (req: any) => {
    return { body: req.body, paramsId: req.params.id };
  }),
  getCheckedDomains: ServiceRunner(GetCheckedDomains, (req: any) => {
    return { body: req.body, query: req.query };
  }),
  search: ServiceRunner(SearchUsers, (req: any) => {
    return { body: req.body };
  }),
  addUser: ServiceRunner(AddUser, (req: any) => {
    return { body: req.body };
  }),
  updateUser: ServiceRunner(UpdateUser, (req: any) => {
    return { body: req.body, paramsId: req.params.id };
  }),
  deleteUser: ServiceRunner(DeleteUser, (req: any) => {
    return { body: req.body, paramsId: req.params.id };
  }),
  getAPIToken: ServiceRunner(SetterApiToken, (req: any) => {
    return { body: req.body };
  }),
  uploadAvatar: ServiceRunner(UploadAvatar, (req: any) => {
    return { req, body: req.body };
  }),
  getSspPartners: ServiceRunner(GetSSPPartners, (req: any) => {
    return { req, body: req.body };
  }),
  getDspPartners: ServiceRunner(GetDSPPartners, (req: any) => {
    return { req, body: req.body };
  }),
  addRTBUSer: ServiceRunner(AddRTBUser, (req: any) => {
    return { body: req.body };
  }),
  upload: multer(multerOptions).single('file')
};
