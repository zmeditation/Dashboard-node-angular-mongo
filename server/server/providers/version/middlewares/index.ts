import CreateVersionCheckVersionExistMiddleware from '../../../http/middlewares/version/createVersionCheckVersionExistMiddleware';
import DeleteVersionCheckVersionExistMiddleware from '../../../http/middlewares/version/deleteVersionCheckVersionExistMiddleware';
import UpdateVersionCheckVersionExistMiddleware from'../../../http/middlewares/version/updateVersionCheckVersionExistMiddleware';

const updateVersionCheckVersionExistMiddleware = new UpdateVersionCheckVersionExistMiddleware();
const deleteVersionCheckVersionExistMiddleware = new DeleteVersionCheckVersionExistMiddleware();
const createVersionCheckVersionExistMiddleware = new CreateVersionCheckVersionExistMiddleware();

export {
  updateVersionCheckVersionExistMiddleware,
  deleteVersionCheckVersionExistMiddleware,
  createVersionCheckVersionExistMiddleware
}
