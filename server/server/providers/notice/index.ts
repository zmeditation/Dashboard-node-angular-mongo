/** Export controller */

import { NoticeService } from '../../services/notice';
import { NoticeController } from '../../http/controllers/noticeController';
import { CreateNoticeCheckRequest } from '../../http/middlewares/notice/request/createNoticeCheck';
import { GetNoticeQueryRequest } from '../../http/middlewares/notice/request/getNoticeQuery';
import { DeletionQueryCheckRequest } from '../../http/middlewares/notice/request/deletionQueryCheck';

const noticeController = new NoticeController(new NoticeService());
const createNoticeCheck = new CreateNoticeCheckRequest();
const getNoticeQuery = new GetNoticeQueryRequest();
const deletionQueryCheck = new DeletionQueryCheckRequest();

module.exports = { 
  noticeController,
  createNoticeCheck,
  getNoticeQuery,
  deletionQueryCheck
};

/** Export request middleware */

