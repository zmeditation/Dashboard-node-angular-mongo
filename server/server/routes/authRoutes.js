const express = require('express');
const router = express.Router();
const authController = require('../http/controllers/authController');
const permissionController = require('../http/controllers/permissionsController').default;
const { validateAuthentication } = require('../services/validation/ValidationService');
const { catchErrors } = require('../handlers/errorHandlers');

//Auth Routes
router.get('/verify', catchErrors(authController.verify));

router.post( '/authenticate', validateAuthentication, catchErrors( authController.authenticate ) );

router.post('/passchange', catchErrors(authController.passchange));

router.get(
    '/publisher-view-authenticate/:userId', 
    permissionController.permissionCheck(['canViewPublisher']),
    catchErrors(authController.publisherViewAuth)
);

module.exports = router;