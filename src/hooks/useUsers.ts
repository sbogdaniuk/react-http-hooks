import { useHttpGet } from './http'
import { endpoints } from '../constants'

export const useUsers = (config: any) =>
  useHttpGet(
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
