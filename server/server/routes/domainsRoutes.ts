import permissionController from '../http/controllers/permissionsController';
const express = require('express');
const router = express.Router();
const domainsController = require('../http/controllers/domainsController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get(
  '/get',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs']),
  catchErrors(domainsController.getDomains)
);

router.post(
  '/create',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs']),
  catchErrors(domainsController.addNewDomain)
);

router.post(
  '/update',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs']),
  catchErrors(domainsController.updateDomain)
);

export default router;
