import permissionController from '../http/controllers/permissionsController';
const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const notificationsController = require('../http/controllers/notificationsController');

router.get('/:userId',
    permissionController.permissionCheck(['canReadOwnNotices']),
    catchErrors(notificationsController.getUserNotices)
);

router.delete('/delete-collections/',
    permissionController.permissionCheck(['canDeleteOwnNotice']),
    catchErrors(notificationsController.deleteNoticesCollections)
);

router.delete('/:msgId',
    permissionController.permissionCheck(['canDeleteOwnNotice']),
    catchErrors(notificationsController.deleteUserNotice)
);

router.post('/create',
    permissionController.permissionCheck(['canCreateNotification']),
    catchErrors(notificationsController.createNewNotification)
);

export default router;
