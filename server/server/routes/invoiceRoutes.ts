import permissionController from '../http/controllers/permissionsController';
const express = require('express');
const multer = require('multer');
const { ValidationWrapper } = require('../services/validation/ValidationWrapper');
const { ObjectIdValidation } = require('../services/validation/middlewares/ObjectIdValidation');
const { example, create, remove, get, edit, download } = require('../http/controllers/invoiceController');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const {
  PERMISSIONS: { INVOICES }
} = require('../constants/permissions');
const { param } = require('express-validator-next');

router.get('/example', permissionController.permissionCheck([INVOICES.PAGE]), catchErrors(example));

router.post(
  '/create',
  multer({ storage: multer.memoryStorage() }).single('file'),
  permissionController.permissionCheck([INVOICES.UPLOAD]),
  catchErrors(create)
);

router.delete(
  '/:id',
  ValidationWrapper([ObjectIdValidation('id', param)]),
  permissionController.permissionCheck([INVOICES.DELETE]),
  catchErrors(remove)
);

router.post('/get', permissionController.permissionCheck([INVOICES.SEE_ALL, INVOICES.SEE_OWN]), catchErrors(get));

router.patch('/:id', permissionController.permissionCheck([INVOICES.EDIT]), catchErrors(edit));

router.get('/:id', permissionController.permissionCheck([INVOICES.SEE_ALL, INVOICES.SEE_OWN]), catchErrors(download));

export default router;
