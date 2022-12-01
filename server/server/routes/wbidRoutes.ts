import permissionController from '../http/controllers/permissionsController';
const express = require('express');
const router = express.Router();
const wbidController = require('../http/controllers/wbidController');
const { catchErrors } = require('../handlers/errorHandlers');

//wBid Routes

router.post(
  '/get-all-adapters',
  permissionController.permissionCheck(['canCreateWBidPlacements', 'canPreviewWBidPlacements']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/get-all-analytics-adapters',
  permissionController.permissionCheck(['canCreateWBidPlacements', 'canPreviewWBidPlacements']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/get-list-users',
  permissionController.permissionCheck(['canSeeAllWBidUsers', 'canSeeOwnWBidUsers']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/get-adapters-settings',
  permissionController.permissionCheck(['canCreateWBidPlacements', 'canEditWBidPlacements']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/postbid-settings',
  permissionController.permissionCheck(['canCreateWBidPlacements', 'canEditWBidPlacements']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/add-config-to-user',
  permissionController.permissionCheck(['canCreateWBidPlacements']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/edit-postbid-config',
  permissionController.permissionCheck(['canEditWBidPlacements']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/get-placement-history',
  permissionController.permissionCheck(['canSeeWBidPlacementHistory']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/get-user',
  permissionController.permissionCheck(['canSeeAllWBidUsers', 'canSeeOwnWBidUsers', 'canSeeOwnWBidSettings']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/get-site',
  permissionController.permissionCheck(['canSeeAllWBidUsers', 'canSeeOwnWBidUsers', 'canSeeOwnWBidSettings']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/edit-publisher-name',
  permissionController.permissionCheck(['canSeeAllWBidUsers', 'canSeeOwnWBidUsers']),
  catchErrors(wbidController.wBidManager)
);

router.post('/delete-config', permissionController.permissionCheck(['canDeleteWBidPlacements']), catchErrors(wbidController.wBidManager));

router.post('/delete-user', permissionController.permissionCheck(['canDeleteAllUsers']), catchErrors(wbidController.wBidManager));

router.post(
  '/get-tags',
  permissionController.permissionCheck(['canSeeAllWBidUsers', 'canSeeOwnWBidUsers', 'canCreateWBidPlacements', 'canEditWBidPlacements']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/get-config',
  permissionController.permissionCheck(['canCreateWBidPlacements', 'canEditWBidPlacements', 'canPreviewWBidPlacements']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/user',
  permissionController.permissionCheck(['canAddAllUsers', 'canAddAllPubs', 'canAddOwnPubs']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/update-user',
  permissionController.permissionCheck(['canEditAllUsers', 'canEditAllPubs', 'canEditOwnPubs']),
  catchErrors(wbidController.wBidManager)
);

router.post('/edit-site-name', permissionController.permissionCheck(['canEditWBidSites']), catchErrors(wbidController.wBidManager));

router.post('/get-auth', permissionController.permissionCheck(['canSeeWBidIntegrationPage']), catchErrors(wbidController.DfpAuth));

router.post(
  '/get-server-bidders',
  permissionController.permissionCheck(['canCreateWBidPlacements', 'canEditWBidPlacements', 'canPreviewWBidPlacements']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/analytics-charts',
  permissionController.permissionCheck(['canSeeWBidChartsPage', 'canSeeAllWBidUsers']),
  catchErrors(wbidController.wBidAnalyticsCharts)
);

router.post(
  '/run-report',
  permissionController.permissionCheck([
    'canReadWBidAllPubsReports',
    'canReadWBidOwnPubsReports',
    'canReadAllWBidReports',
    'canReadOwnWBidReports'
  ]),
  catchErrors(wbidController.wBidAnalyticsReport)
);

router.post('/check-ads-txt', permissionController.permissionCheck(['canSeeWBidStatusAdsTxt']), catchErrors(wbidController.adsTxtManager));

router.post(
  '/disable-user-configs',
  permissionController.permissionCheck(['canEditWBidPlacements']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/enable-user-configs',
  permissionController.permissionCheck(['canEditWBidPlacements']),
  catchErrors(wbidController.wBidManager)
);

router.post(
  '/user-check-ads-txt',
  permissionController.permissionCheck(['canSeeWBidStatusAdsTxt']),
  catchErrors(wbidController.wBidManager)
);

// 63509 - get wbid publishers - REPORT_FILTERS.WBID_PUBLISHERS
// 10123 - get inventory_type - REPORT_FILTERS.INVENTORY_TYPE
// 16710 - get publishers -> domains -> placements;
// 78003 - get countries;
// 29012 - get sizes;
// 99033 - get bidders list;
// 32356 - get devices list;
// 26789 - for sites only
// 28009 - for OS list
// 28010 - for browsers list

router.post(
  '/16710',
  permissionController.permissionCheck([
    'canReadWBidAllPubsReports',
    'canReadAllWBidReports',
    'canReadWBidOwnPubsReports',
    'canReadOwnWBidReports'
  ]),
  catchErrors(wbidController.getDomainsPlacements)
);

router.post(
  '/26789',
  permissionController.permissionCheck([
    'canReadWBidAllPubsReports',
    'canReadAllWBidReports',
    'canReadWBidOwnPubsReports',
    'canReadOwnWBidReports'
  ]),
  catchErrors(wbidController.sitesList)
);

router.get(
  '/78003',
  permissionController.permissionCheck([
    'canReadWBidAllPubsReports',
    'canReadAllWBidReports',
    'canReadWBidOwnPubsReports',
    'canReadOwnWBidReports'
  ]),
  catchErrors(wbidController.countriesList)
);

router.post(
  '/29012',
  permissionController.permissionCheck([
    'canReadWBidAllPubsReports',
    'canReadAllWBidReports',
    'canReadWBidOwnPubsReports',
    'canReadOwnWBidReports'
  ]),
  catchErrors(wbidController.sizesConfig)
);

router.post(
  '/99033',
  permissionController.permissionCheck([
    'canReadWBidAllPubsReports',
    'canReadAllWBidReports',
    'canReadWBidOwnPubsReports',
    'canReadOwnWBidReports'
  ]),
  catchErrors(wbidController.wBidManager)
);

router.get(
  '/32356',
  permissionController.permissionCheck([
    'canReadWBidAllPubsReports',
    'canReadAllWBidReports',
    'canReadWBidOwnPubsReports',
    'canReadOwnWBidReports'
  ]),
  catchErrors(wbidController.devicesConfig)
);

router.get(
  '/10123',
  permissionController.permissionCheck([
    'canReadWBidAllPubsReports',
    'canReadAllWBidReports',
    'canReadWBidOwnPubsReports',
    'canReadOwnWBidReports'
  ]),
  catchErrors(wbidController.inventoryTypeConfig)
);

router.get(
  '/28009',
  permissionController.permissionCheck([
    'canReadWBidAllPubsReports',
    'canReadAllWBidReports',
    'canReadWBidOwnPubsReports',
    'canReadOwnWBidReports'
  ]),
  catchErrors(wbidController.operationSystemsList)
);

router.get(
  '/28010',
  permissionController.permissionCheck([
    'canReadWBidAllPubsReports',
    'canReadAllWBidReports',
    'canReadWBidOwnPubsReports',
    'canReadOwnWBidReports'
  ]),
  catchErrors(wbidController.browsersList)
);

router.get(
  '/63509',
  permissionController.permissionCheck([
    'canReadWBidAllPubsReports',
    'canReadAllWBidReports',
    'canReadWBidOwnPubsReports',
    'canReadOwnWBidReports'
  ]),
  catchErrors(wbidController.getWbidPublishers)
);

export default router;
