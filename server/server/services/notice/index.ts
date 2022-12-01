import { 
  NoticeServiceInterface, 
  CreationNoticeType, 
  NoticeQueryType, 
  DeletionNoticeType 
} from "./types";
import { NoticeModel } from '../../database/mongoDB/migrations/NoticeModel';
import { NoticeType } from '../../database/mongoDB/migrations/NoticeModel/types';

export class NoticeService implements NoticeServiceInterface {
  constructor() {

  }

  public async getNotice(query: NoticeQueryType) {
    const userId = query.target_users;
    const outputFields = { text: 1, notice_type: 1, title: 1, _id: 0, target_roles: 1, target_users: 1 };
    const notice = await NoticeModel.find({ 
      target_users: { $in: userId },
      remove_date: { $gt: query.today }
    }, outputFields).then((notes: any) => {
      if (notes.length) {
        return notes;
      }
      return NoticeModel.find({
        target_roles: { $in: query.role },
        remove_date: { $gt: query.today }
      }, outputFields);
    });
    return notice;
  }

  public async getList() {
    const notice_types = ['warning', 'information'];

    return await NoticeModel.find({})
      .populate({ path: 'creator', select: '_id name' })
      .populate({ path: 'target_users', select: '_id name'})
      .lean()
      .then((notes: NoticeType[])  => {
        return notice_types.map(type => {
          return {
            type,
            notices: notes.filter(user => user.notice_type === type)
          }
        });
    })
  }

  public async createNotice(query: CreationNoticeType) {
    return await NoticeModel.create(query);
  }

  public async deleteNotice(query: DeletionNoticeType) {
    const { id } = query;
    const request = await NoticeModel.deleteOne({ _id: id });
    return {
      ok: request.ok,
      n: request.n
    }
  }

}
