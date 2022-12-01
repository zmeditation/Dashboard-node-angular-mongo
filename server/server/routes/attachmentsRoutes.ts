import permissionController from '../http/controllers/permissionsController';
const express = require('express');
const router = express.Router();
const attachmentsController = require('../http/controllers/attachmentsController');
const mimeTypes = require('../constants/mimeTypes');
const { catchErrors } = require('../handlers/errorHandlers');

const multer = require('multer');
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req: any, file: any, next: any) {
    const isJS = mimeTypes.JS.includes(file.mimetype);
    next(!isJS ? { message: 'Expected file with js mime-type.' } : null, isJS);
  }
};

//Attachments Routes
router.get(
  '/get-attachments-list',
  permissionController.permissionCheck(['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports']),
  catchErrors(attachmentsController.getAttachmentsList)
);

router.post(
  '/player-source-load',
  permissionController.permissionCheck(['canUpdateVplCDN']),
  multer(multerOptions).single('file'),
  catchErrors(attachmentsController.playerLoader)
);

export default router;
