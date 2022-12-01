import CreateVersionRequest from '../../../http/middlewares/version/request/createVersionRequest';
import DeleteVersionRequest from '../../../http/middlewares/version/request/deleteVersionRequest';
import GetVersionInformationRequest from '../../../http/middlewares/version/request/getVersionInformationRequest';
import UpdateVersionRequest from '../../../http/middlewares/version/request/updateVersionRequest';
import GetVersionListRequest from '../../../http/middlewares/version/request/getVersionListRequest';

const updateVersionRequest = new UpdateVersionRequest();
const getVersionInformationRequest = new GetVersionInformationRequest();
const deleteVersionRequest = new DeleteVersionRequest();
const createVersionRequest = new CreateVersionRequest();
const getVersionListRequest = new GetVersionListRequest();

export {
  updateVersionRequest,
  getVersionInformationRequest,
  deleteVersionRequest,
  createVersionRequest,
  getVersionListRequest
}
