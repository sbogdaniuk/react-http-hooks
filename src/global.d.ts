export type ID = number | string

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
