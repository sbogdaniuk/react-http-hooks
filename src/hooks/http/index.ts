import { useMutation } from './useMutation'

export { useHttpGet } from './useHttpGet'

export const useHttpPost = useMutation('post')
export const useHttpPut = useMutation('put')
export const useHttpPatch = useMutation('patch')
export const useHttpDelete = useMutation('delete')
