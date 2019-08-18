export type ID = number | string

export type UpdateData<Data = any> = (
  prevData: Data | undefined,
  nextProps: { data?: Data; error?: AxiosError },
) => Data

export interface IPost {
  id: ID
  title?: string
  body?: string
  userId?: ID
}

export interface IUser {
  id: ID
  name?: string
}

export interface IComment {
  id: ID
  name?: string
  // email?: string
  // body?: string
  // postId?: ID
}
