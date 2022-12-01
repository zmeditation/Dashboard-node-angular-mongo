import { NoticeQueryType } from 'services/notice/types';
import { Request, Response } from '../../../../interfaces/express';
import { MiddlewareContract } from '../../../../interfaces/middleware';
const moment = require('moment');

export class GetNoticeQueryRequest implements MiddlewareContract {

  constructor() {

  }

  async use(req: Request, response: Response, next: Function) {
    const { id, role } = req.body.additional;
    const query: NoticeQueryType = {
      role: role,
      target_users: [id],
      today: this.getTodayDate()
    };
    req.body.query = query;
    next();
  }

  private getTodayDate() {
    return moment(new Date(), "YYYY-MM-DD");
  }
}