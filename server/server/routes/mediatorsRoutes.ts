import permissionController from '../http/controllers/permissionsController';

const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const mediatorsController = require('../http/controllers/mediatorsController')

router.post('/add-new-unit',
  permissionController.permissionCheck(['canCreateNewAdUnit']),
  catchErrors(mediatorsController.addNewUnit)
);

router.post('/get-google-units',
  permissionController.permissionCheck(['canGetAdUnit']),
  catchErrors(mediatorsController.getAdUnits)
);

router.post('/write-google-units',
  permissionController.permissionCheck(['canCreateNewAdUnit']),
  catchErrors(mediatorsController.writingAdUnitsInfo)
);

router.post(
  '/get-pack-code',
  permissionController.permissionCheck(['canCreateNewAdUnit']),
  catchErrors(mediatorsController.getPackCode));

router.delete(
  '/delete-pack-code',
  permissionController.permissionCheck(['canCreateNewAdUnit']),
  catchErrors(mediatorsController.deletePackCode)
  );

router.put(
  '/update-pack-code',
  permissionController.permissionCheck(['canCreateNewAdUnit']),
  catchErrors(mediatorsController.updatePackCode)
)

export default router;
