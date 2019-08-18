import { useHttpGet } from './http'
import { endpoints } from '../constants'

export const useUsers = <T>(config: any = {}) =>
  useHttpGet<T>(
    {
      endpoint: endpoints.users,
      ...config,
    },
    {
      cache: {
        maxAge: 15 * 60 * 1000,
      },
    },
  )
