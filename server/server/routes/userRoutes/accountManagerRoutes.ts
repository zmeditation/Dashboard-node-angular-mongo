import express from 'express';

import permissionController from '../../http/controllers/permissionsController';
import { accountManagerController, getUserController } from '../../providers/users/controllers';
import { bindToPublisherRequest, getAMsByEditAllPubsPermissionRequest } from '../../providers/users/accountManager/middlewares/request';
import {
  checkAMExistBindAMToPubMiddleware,
  checkCurrentAMExistBindToPubMiddleware,
  checkPubExistBindAMToPubMiddleware
} from '../../providers/users/accountManager/middlewares';

const router = express.Router();

router.get('/by-edit-all-pubs-permission',
  permissionController.permissionCheck(['canEditAllPubs', 'canEditAllUsers']),
  getAMsByEditAllPubsPermissionRequest.use.bind(getAMsByEditAllPubsPermissionRequest),
  getUserController.getAccountManagers.bind(getUserController)
);

router.post('/bind-to-publisher',
  permissionController.permissionCheck(['canEditAllPubs', 'canEditAllUsers']),
  bindToPublisherRequest.use.bind(bindToPublisherRequest),
  checkCurrentAMExistBindToPubMiddleware.use.bind(checkCurrentAMExistBindToPubMiddleware),
  checkPubExistBindAMToPubMiddleware.use.bind(checkPubExistBindAMToPubMiddleware),
  checkAMExistBindAMToPubMiddleware.use.bind(checkAMExistBindAMToPubMiddleware),
  accountManagerController.bindAccountManagerToPublisher.bind(accountManagerController)
);

export default router;
