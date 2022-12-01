import permissionController from '../http/controllers/permissionsController';
const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const {
  noticeController,
  createNoticeCheck,
  getNoticeQuery,
  deletionQueryCheck
} = require('../providers/notice/index');

router.get('/',
  permissionController.permissionCheck([]),
  getNoticeQuery.use.bind(getNoticeQuery),
  catchErrors(noticeController.getNotice.bind(noticeController))
);

router.get('/list',
  catchErrors(noticeController.getList.bind(noticeController))
);

router.post('/',
  permissionController.permissionCheck([]),
  createNoticeCheck.use.bind(createNoticeCheck),
  catchErrors(noticeController.create.bind(noticeController))
);

router.delete('/',
  permissionController.permissionCheck([]),
  deletionQueryCheck.use.bind(deletionQueryCheck),
  catchErrors(noticeController.delete.bind(noticeController))
)

export default router;
