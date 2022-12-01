import express from 'express';
import { body } from 'express-validator-next';
import accountManagerRoutes from './accountManagerRoutes';
import userController from '../../http/controllers/user/userController';
import permissionController from '../../http/controllers/permissionsController';
import { getUsersRequest, getUserRequest, updateUserRequest, createUserRequest } from '../../providers/users/middlewares/requests';
import { getUserController } from '../../providers/users/controllers';
import { ObjectIdValidation } from '../../services/validation/middlewares/ObjectIdValidation';
import { RoleValidation } from '../../services/validation/middlewares/RoleValidation';
import { ROLES } from '../../constants/roles';
import { SearchQueryValidation } from '../../services/validation/middlewares/SearchQueryValidation';
import { PaginationValidation } from '../../services/validation/middlewares/PaginationValidation';
import { ValidationWrapper } from '../../services/validation/ValidationWrapper';
import { catchErrors } from '../../handlers/errorHandlers';

const router = express.Router();

router.use('/account-manager', accountManagerRoutes);

//User Routes

router.post(
  '/photo/:id',
  userController.upload,
  permissionController.permissionCheck(['canUploadAvatar']),
  catchErrors(userController.uploadAvatar)
);

router.get(
  '',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs']),
  getUsersRequest.use.bind(getUsersRequest),
  catchErrors(userController.getUsers)
);

router.get(
  '/list',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs']),
  getUsersRequest.use.bind(getUsersRequest),
  getUserController.listByPermissions.bind(getUserController)
);

/**
 * Create user
 */
router.post(
  '',
  permissionController.permissionCheck(['canAddAllUsers', 'canAddAllPubs', 'canAddOwnPubs']),
  createUserRequest.use.bind(createUserRequest),
  catchErrors(userController.addUser)
);

router.post(
  '/get-publishers',
  permissionController.permissionCheck(['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports']),
  catchErrors(userController.getPublishers)
);

router.get('/get-managers', permissionController.permissionCheck(['canReadOwnPubs']), catchErrors(userController.getOwnManagers));

router.post(
  '/search',
  permissionController.permissionCheck(['canCreateVideoTag', 'canSetPublisherForVideoTag']),
  ValidationWrapper([
    ...PaginationValidation,
    ...SearchQueryValidation,
    body('select.manager').optional().isMongoId().withMessage(`select.manage should be MongoId string.`),
    RoleValidation([ROLES.PUBLISHER, ROLES.ACCOUNT_MANAGER], 'select.role')
  ]),
  catchErrors(userController.search)
);

router.post(
  '/domains/search',
  permissionController.permissionCheck(['canCreateVideoTag']),
  ValidationWrapper([...PaginationValidation, ...SearchQueryValidation, ObjectIdValidation('publisher')]),
  catchErrors(userController.search)
);

router.get('/delete/:id', permissionController.permissionCheck(['canDeleteAllUsers']), catchErrors(userController.deleteUser));

router.get(
  '/roles',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs']),
  catchErrors(userController.getRoles)
);

router.get(
  '/vacant-properties/:id',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs']),
  catchErrors(userController.getVacantProperties)
);

router.get(
  '/ads-txt-monitoring',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs']),
  catchErrors(userController.getCheckedDomains)
);

router.get(
  '/get-api-token',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs', 'canReadOwnAccountInfo']),
  catchErrors(userController.getAPIToken)
);

router.get(
  '/publishers-emails',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs']),
  catchErrors(userController.getUsersEmails)
);

router.get(
  '/ssp-partners',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs']),
  catchErrors(userController.getSspPartners)
);

router.get(
  '/dsp-partners',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs']),
  catchErrors(userController.getDspPartners)
);

router.post('/add-rtb-partner', permissionController.permissionCheck(['canAddAllUsers']), catchErrors(userController.addRTBUSer));

router.get(
  '/:id',
  permissionController.permissionCheck(['canReadAllUsers', 'canReadAllPubs', 'canReadOwnPubs', 'canReadOwnAccountInfo']),
  getUserRequest.use.bind(getUserRequest),
  catchErrors(userController.getUser)
);

router.put(
  '/:id',
  permissionController.permissionCheck(['canEditAllUsers', 'canEditAllPubs', 'canEditOwnPubs', 'canConnectUnitWithPub']),
  updateUserRequest.use.bind(updateUserRequest),
  catchErrors(userController.updateUser)
);

export default router;
