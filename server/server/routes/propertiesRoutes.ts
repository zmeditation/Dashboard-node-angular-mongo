import permissionController from '../http/controllers/permissionsController';
const express = require('express');
const router = express.Router();
const propertiesController = require('../http/controllers/propertiesController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get(
  '/get',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs']),
  catchErrors(propertiesController.getUsersProperties)
);

export default router;
