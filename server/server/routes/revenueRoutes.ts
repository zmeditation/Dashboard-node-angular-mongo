import permissionController from '../http/controllers/permissionsController';
const express = require('express');
const router = express.Router();
const { create, get, find, update, remove, rewrite, getAllData } = require('../http/controllers/revenueController');
const { catchErrors } = require('../handlers/errorHandlers');
const {
  PERMISSIONS: { REVENUE }
} = require('../constants/permissions');

router.post('/create', permissionController.permissionCheck([REVENUE.EDIT]), catchErrors(create));
router.get('/', permissionController.permissionCheck([REVENUE.SEE]), catchErrors(get));
router.get('/find', permissionController.permissionCheck([REVENUE.SEE]), catchErrors(find));
router.patch('/update', permissionController.permissionCheck([REVENUE.EDIT]), catchErrors(update));
router.delete('/delete', permissionController.permissionCheck([REVENUE.DELETE]), catchErrors(remove));
router.get('/all', permissionController.permissionCheck([REVENUE.SEE]), catchErrors(getAllData));
router.post('/rewrite', permissionController.permissionCheck([REVENUE.EDIT]), catchErrors(rewrite))
// router.get('/setFakeData', catchErrors(setFakeRevenues))

export default router;
