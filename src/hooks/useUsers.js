import { useHttpGet } from './useHttpGet'
import { endpoints } from '../constants'

export const useUsers = config =>
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
