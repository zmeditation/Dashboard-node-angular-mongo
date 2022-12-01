import permissionController from '../http/controllers/permissionsController';
const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');

// Permissions & Roles

router.get('/get',
    permissionController.permissionCheck([ 'canReadPermissions' ]),
    catchErrors(permissionController.getPermissions)
);

router.post('/add',
    permissionController.permissionCheck([ 'canReadPermissions' ]),
    catchErrors(permissionController.addPermissions)
);

router.post('/',
    permissionController.permissionCheck([ 'canReadPermissions' ]),
    catchErrors(permissionController.addPermission)
);

router.post('/add-role',
    permissionController.permissionCheck([ 'canReadPermissions' ]),
    catchErrors(permissionController.addRole)
);

router.patch('/remove-one/',
    permissionController.permissionCheck([ 'canReadPermissions' ]),
    catchErrors(permissionController.removePermission)
);

router.get('/remove-role/:id',
    permissionController.permissionCheck([ 'canReadPermissions' ]),
    catchErrors(permissionController.removeRole)
);

router.post('/edit-permissions',
    permissionController.permissionCheck(['canEditAllUsers', 'canEditOwnPermissions']),
    catchErrors(permissionController.editPermissions)
);

export default router;
