import permissionController from '../http/controllers/permissionsController';
const express = require('express');
const router = express.Router();
const tacController = require('../http/controllers/tacController');
const {catchErrors} = require('../handlers/errorHandlers');

// permissions for TAC access
const tacReportsPermsArray = [
    'canReadOwnTacReports',
    'canReadAllTacReports'
];

const tacGenPermArray = ['canCreateTacCodes'];


// 97677 - domains list - REPORT_FILTERS.DOMAINS
// 63508 - publishers list - REPORT_FILTERS.PUBLISHERS
// 78003 - get countries;
// 29012 - get sizes;
// 99033 - get programmatics list;
// 32356 - get devices list;
// 28009 - for OS list
// 28010 - for browsers list
// 17695 - ad types
// 77081 - for ad units list
// 60508 - publishers

router.get('/78003', permissionController.permissionCheck(tacReportsPermsArray), catchErrors(tacController.countriesList));
router.get('/32356', permissionController.permissionCheck(tacReportsPermsArray), catchErrors(tacController.devicesConfig));
router.get('/17695', permissionController.permissionCheck(tacReportsPermsArray), catchErrors(tacController.adTypeConfig));
router.get('/28009', permissionController.permissionCheck(tacReportsPermsArray), catchErrors(tacController.operationSystemsList));
router.get('/28010', permissionController.permissionCheck(tacReportsPermsArray), catchErrors(tacController.browsersList));
router.get('/29012', permissionController.permissionCheck(tacReportsPermsArray), catchErrors(tacController.sizesConfig));
router.get('/65231', permissionController.permissionCheck(tacReportsPermsArray), catchErrors(tacController.programmaticsList));
router.get('/97677', permissionController.permissionCheck(tacReportsPermsArray), catchErrors(tacController.domainsList));
router.get('/77081', permissionController.permissionCheck(tacReportsPermsArray), catchErrors(tacController.adUnitsList));
router.get('/63508', permissionController.permissionCheck(tacReportsPermsArray), catchErrors(tacController.publishersList));
router.post('/run-report', permissionController.permissionCheck(tacReportsPermsArray), catchErrors(tacController.tacAnalyticsReport));
router.post('/code-generation', permissionController.permissionCheck(tacGenPermArray), catchErrors(tacController.tacGenerator));

export default router;
