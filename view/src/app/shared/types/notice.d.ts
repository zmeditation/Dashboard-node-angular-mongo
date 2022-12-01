type PopulatedCreator = {
  name: string,
  _id: string
}

export type NoticeType = {
  creator: PopulatedCreator,
  notice_type: string,
  text: string,
  remove_date: Date,
  target_roles?: Array<string>,
  target_users?: Array<string>,
  title: string,
  status: boolean
}
