import express from 'express';
import permissionController from '../http/controllers/permissionsController';
import analyticsController from '../http/controllers/analyticsController';
import { getTestUsersRequest } from '../providers/users/middlewares/requests';
import { getUserController } from '../providers/users/controllers';
import { catchErrors } from '../handlers/errorHandlers';

const router = express.Router();

const allowedPermissions = ['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs'];
//Analytics Routes

// Managers
router.get(
  '/managers-for-last-thirty-days',
  permissionController.permissionCheck(allowedPermissions),
  catchErrors(analyticsController.getManagersForLastThirtyDays)
);

router.post(
  '/managers-for-last-thirty-days',
  permissionController.permissionCheck(allowedPermissions),
  catchErrors(analyticsController.updateManagersForLastThirtyDays)
);

// Publishers
router.get(
  '/publishers-for-last-thirty-days',
  permissionController.permissionCheck(allowedPermissions),
  catchErrors(analyticsController.getPublishersForLastThirtyDays)
);

router.post(
  '/publishers-for-last-thirty-days',
  permissionController.permissionCheck(allowedPermissions),
  catchErrors(analyticsController.updatePublishersForLastThirtyDays)
);

router.get(
  '/pubs-connection-statistics',
  permissionController.permissionCheck(allowedPermissions),
  catchErrors(analyticsController.getPublishersConnectionStatistics)
);

router.get(
  '/users/test',
  permissionController.permissionCheck(allowedPermissions),
  getTestUsersRequest.use.bind(getTestUsersRequest),
  getUserController.getTestUsers.bind(getUserController)
);

export default router;
