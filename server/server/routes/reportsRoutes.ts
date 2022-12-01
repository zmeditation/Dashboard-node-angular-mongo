import express from 'express';
import reportsController from '../http/controllers/reports/reportsController';
import permissionController from '../http/controllers/permissionsController';
import { catchErrors } from '../handlers/errorHandlers';
import { verifyToken } from '../services/reporting/apiToken/helpers';
import {
  getUserCountOfReportsTotalAndProgrammaticsRequest,
  updatePublisherAccountManagerUpdateReportsRequest
} from '../providers/reports/middlewares/requests';
import { checkPublisherExistByRequestParam } from '../providers/reports/middlewares/update';
import { countReportsController, updateReportsController } from '../providers/reports/controllers';

const router = express.Router();

router.post(
  '/run-report',
  permissionController.permissionCheck(['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports']),
  catchErrors(reportsController.runCustomReport)
);

router.get(
  '/run-report/api/token=:token&type=:type&(range=:range&)?(dateFrom=:dateFrom&dateTo=:dateTo&)?metrics=:metrics&dimensions=:dimensions',
  verifyToken(),
  catchErrors(reportsController.runApiCustomReport)
);

router.get(
  '/filters/:id',
  permissionController.permissionCheck(['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports']),
  catchErrors(reportsController.getFilterValues)
);

router.get(
  '/sizes/:search',
  permissionController.permissionCheck(['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports']),
  catchErrors(reportsController.getReportsSizes)
);

router.post(
  '/upload/file',
  reportsController.fileUpload,
  permissionController.permissionCheck(['canAddReports']),
  catchErrors(reportsController.csvUpload)
);

router.post(
  '/upload/manual',
  permissionController.permissionCheck(['canAddReports', 'canAddOwnPubsReports']),
  catchErrors(reportsController.manualUpload)
);

router.get(
  '/upload/manual/previous-uploads',
  permissionController.permissionCheck(['canReadPreviouslyUploadedReports']),
  catchErrors(reportsController.getPreviousUploads)
);

router.delete(
  '/upload/manual/previous-uploads/:reportId',
  permissionController.permissionCheck(['canDeletePreviouslyUploadedReports']),
  catchErrors(reportsController.removeManuallyUploadedReport)
);

router.get(
  '/monthly/:userId?',
  permissionController.permissionCheck(['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports']),
  catchErrors(reportsController.getMonthly)
);

router.get(
  '/origins',
  permissionController.permissionCheck(['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports']),
  // @ts-ignore This method are commented
  catchErrors(reportsController.getOrigins)
);

router.get('/download', permissionController.permissionCheck(['canDownloadReports']), catchErrors(reportsController.downloadReport));

router.post('/remove-reports', permissionController.permissionCheck(['canDeleteReports']), catchErrors(reportsController.removeReports));

router.get('/api-adapters', permissionController.permissionCheck(['canAddReports']), catchErrors(reportsController.getAPIAdapters));

router.post('/api-upload', permissionController.permissionCheck(['canAddReports']), catchErrors(reportsController.uploadAPIReports));

router.post(
  '/get-revenue',
  permissionController.permissionCheck(['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports']),
  catchErrors(reportsController.getPubsRevenue)
);

router.get(
  '/count/reports-and-programmatics/:userId',
  permissionController.permissionCheck(['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports']),
  getUserCountOfReportsTotalAndProgrammaticsRequest.use.bind(getUserCountOfReportsTotalAndProgrammaticsRequest),
  countReportsController.getUserCountOfReportsTotalAndProgrammatics.bind(countReportsController)
);

router.put(
  '/publisher-account-manager/:publisherId',
  permissionController.permissionCheck(['canEditAllPubs', 'canEditAllUsers']),
  updatePublisherAccountManagerUpdateReportsRequest.use.bind(updatePublisherAccountManagerUpdateReportsRequest),
  checkPublisherExistByRequestParam.use.bind(checkPublisherExistByRequestParam),
  updateReportsController.updatePubAM.bind(updateReportsController)
);

export default router;
