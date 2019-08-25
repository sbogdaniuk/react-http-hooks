import { useHttpGet } from './http'
import { endpoints } from '../constants'
import { ID } from '../global'

export interface IUser {
  id: ID
  name: string
}

const options = {
  cache: {
    maxAge: 15 * 60 * 1000,
  },
}

export const useUsers = (config: any = {}) =>
  useHttpGet<IUser[]>(
    {
      url: endpoints.users,
      ...config,
    },
    options,
  )
