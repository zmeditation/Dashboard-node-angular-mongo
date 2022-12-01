import BindToPublisherRequest from '../../../../http/middlewares/users/accountManager/request/bindToPublisherRequest';
import GetAMsByEditAllPubsPermissionRequest from '../../../../http/middlewares/users/accountManager/request/getAMsByEditAllPubsPermissionRequest';

const bindToPublisherRequest =  new BindToPublisherRequest();
const getAMsByEditAllPubsPermissionRequest = new GetAMsByEditAllPubsPermissionRequest();

export {
  bindToPublisherRequest,
  getAMsByEditAllPubsPermissionRequest
}
