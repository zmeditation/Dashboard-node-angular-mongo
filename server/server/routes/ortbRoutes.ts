import permissionController from '../http/controllers/permissionsController';
const express = require('express');
const router = express.Router();
const ortbController = require('../http/controllers/ortbController');
const {catchErrors} = require('../handlers/errorHandlers');

// permissions for oRTB reports
const ortbReportsPermsArray = [
    'canReadOwnOrtbReports',
    'canReadAllOrtbReports'
];


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
// 52487 - source type
// 89564 - DSP List
// 25369 - SSP List
// 13371 - Currencies
// 77554 - is HB
// 11281 - partners (RTB SSP/DSP) list



router.get('/78003', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.countriesList));
router.get('/89564', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.dspList));
router.get('/32356', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.devicesList));
router.get('/17695', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.impTypesList));
router.get('/28009', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.operationSystemsList));
router.get('/28010', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.browsersList));
router.get('/29012', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.sizesList));
router.get('/97677', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.domainsList));
router.get('/77081', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.adUnitsList));
router.get('/63508', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.publishersList));
router.get('/25369', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.sspList));
router.get('/13371', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.currenciesList));
router.get('/11522', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.sourcesList));
router.get('/77554', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.isHbFilter));
router.get('/11281', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.partnersList));
router.post('/run-report', permissionController.permissionCheck(ortbReportsPermsArray), catchErrors(ortbController.ortbAnalyticsReport));

export default router;
