import { NoticeType } from 'models/NoticeModel/types';

type TitleType = {
  title: string,
  createdAt: Date,
  status: boolean
}

export type CreationNoticeType = {
  creator: string,
  notice_type: string,
  text: string,
  remove_date?: Date,
  target_roles?: Array<string>,
  target_users?: Array<string>,
  title: string
}

export type DeletionNoticeType = {
  id: string
}

export type NoticeQueryType = {
  target_users: string[],
  today: Date,
  role: string
}

export interface NoticeServiceInterface {
  getNotice(query: NoticeQueryType): Promise<NoticeType>,
  getList(): Promise<TitleType[]>,
  createNotice(params: CreationNoticeType): Promise<NoticeType>
  deleteNotice(params: DeletionNoticeType): Promise<any>
}