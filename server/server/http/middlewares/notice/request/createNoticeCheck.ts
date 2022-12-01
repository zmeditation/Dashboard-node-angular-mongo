import { Request, Response } from 'interfaces/express';
import { MiddlewareContract } from '../../../../interfaces/middleware';
import { CreationNoticeType } from 'services/notice/types';
import mongoose from 'mongoose';

export class CreateNoticeCheckRequest implements MiddlewareContract {

  constructor() {

  }

  async use(req: Request, response: Response, next: Function) {
    const query: CreationNoticeType = req.body.query ? req.body.query : {};
    const validationArray: boolean[] = [];
    query.creator = req.body.additional.id;

    validationArray.push(this.creatorValidate(query.creator));
    validationArray.push(this.noticeTypeValidate(query.notice_type));
    validationArray.push(this.titleValidate(query.title));
    if (validationArray.includes(false)) {
      next(new Error('doesn\'t pass validate'));
    }
    next();
  }

  private creatorValidate(creator: string) {
    const ObjectId = mongoose.Types.ObjectId;
    if (ObjectId.isValid(creator)) {
      if((String)(new ObjectId(creator)) == creator) {
        return true;
      }
      return false;
    }
    return false;
  }

  private noticeTypeValidate(type: string) {
    const noticeTypes = [
      'information',
      'warning'
    ];
    if (typeof type === 'string') {
      if(noticeTypes.includes(type)) {
        return true;
      }
      return false;
    }
    return false;
  }

  private titleValidate(title: string) {
    const [maxLength, minLength] = [50, 3];
    if (typeof title === 'string') {
      if(title.length >= minLength && title.length <= maxLength) {
        return true;
      }
      return false;
    }
    return false;
  }

}