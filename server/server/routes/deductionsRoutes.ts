import permissionController from '../http/controllers/permissionsController';
const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const deductionController = require('../http/controllers/deductionController');

router.post(
  '/add-deduction', 
  permissionController.permissionCheck(['canAddDeduction']),
  catchErrors(deductionController.addDeduction)
);

router.post(
  '/bulk-add-deduction',
  permissionController.permissionCheck(['canAddDeduction']),
  catchErrors(deductionController.bulkAddDeduction)
);

router.get(
  '/get-all-deduction',
  permissionController.permissionCheck(['canReadAllDeductions', 'canReadOwnAndAccountDeductions', 'canReadOwnPublishersDeductions']),
  catchErrors(deductionController.getAllPubsDeductions)
);

router.get(
  '/get-deductions',
  permissionController.permissionCheck([
    'canReadAllDeductions',
    'canReadOwnAndAccountDeductions',
    'canReadOwnPublishersDeductions',
    'canReadOwnDeductions'
  ]),
  catchErrors(deductionController.getPubsDeductions)
);

router.post(
  '/deduction-by-param',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs']),
  catchErrors(deductionController.getDeductionByParam)
);

export default router;
