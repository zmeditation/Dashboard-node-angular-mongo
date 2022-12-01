import permissionController from '../http/controllers/permissionsController';
const express = require('express');
const { getAll, getAllCodesByPublisher, addCode } = require('../http/controllers/codesController');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const {
  PERMISSIONS: { CODES }
} = require('../constants/permissions');


router.get('/', permissionController.permissionCheck([CODES.CREATE]), catchErrors(getAll));

router.get('/:publisher', permissionController.permissionCheck([CODES.CREATE]), catchErrors(getAllCodesByPublisher));

router.post('/create', permissionController.permissionCheck([CODES.CREATE]), catchErrors(addCode));

export default router;
