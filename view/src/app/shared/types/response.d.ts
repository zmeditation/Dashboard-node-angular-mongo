type MetaType = {
  copyright: string,
  authors: string[]
}

type ErrorSourceType = {
  pointer: string,
  parameter: string,
  header: string
}

type ErrorType = {
  id?: number,
  links?: boolean,
  status: number,
  code: string,
  title: string,
  detail?: string,
  source?: ErrorSourceType
  meta?: MetaType
}

export type GetResponseType = {
  data: any,
  errors?: ErrorType,
  meta?: MetaType
}
