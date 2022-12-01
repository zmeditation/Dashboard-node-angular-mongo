import express from 'express';

import permissionController from '../http/controllers/permissionsController';
import { versionController } from '../providers/version/controllers';

import {
  createVersionRequest,
  deleteVersionRequest,
  getVersionInformationRequest,
  updateVersionRequest,
  getVersionListRequest
} from '../providers/version/middlewares/request';

import {
  updateVersionCheckVersionExistMiddleware,
  deleteVersionCheckVersionExistMiddleware,
  createVersionCheckVersionExistMiddleware
} from '../providers/version/middlewares';

const router = express.Router();

router.get('/',
  getVersionInformationRequest.use.bind(getVersionInformationRequest),
  versionController.getVersionInformation.bind(versionController)
);

router.get('/last-version',
  versionController.getLastVersion.bind(versionController)
);

router.get('/list/',
  getVersionListRequest.use.bind(getVersionListRequest),
  versionController.getVersionsList.bind(versionController)
);

router.post('/',
  permissionController.permissionCheck(['canEditVersion']),
  createVersionRequest.use.bind(createVersionRequest),
  createVersionCheckVersionExistMiddleware.use.bind(createVersionCheckVersionExistMiddleware),
  versionController.createVersion.bind(versionController)
);

router.put('/',
  permissionController.permissionCheck(['canEditVersion']),
  updateVersionRequest.use.bind(updateVersionRequest),
  updateVersionCheckVersionExistMiddleware.use.bind(updateVersionCheckVersionExistMiddleware),
  versionController.updateVersion.bind(versionController)
);

router.delete('/',
  permissionController.permissionCheck(['canEditVersion']),
  deleteVersionRequest.use.bind(deleteVersionRequest),
  deleteVersionCheckVersionExistMiddleware.use.bind(deleteVersionCheckVersionExistMiddleware),
  versionController.deleteVersion.bind(versionController)
);

export default router;
