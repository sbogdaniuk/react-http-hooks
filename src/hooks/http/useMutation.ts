import { useCallback, useEffect, useState } from 'react'
import { get } from 'lodash'
import { AxiosError } from 'axios'

import { getUrl } from '../../utils'
import { defaultUpdateData, initialState, UpdateData } from './common'
import { useClient } from '../../contexts'

interface IProps {
  method?: TMethod
  endpoint?: string
  params?: { [key: string]: any }
}

type TMethod =
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'POST'
  | 'PATCH'
  | 'PUT'
  | 'DELETE'

interface IState {
  endpoint?: string
  params?: { [key: string]: any }
  loading?: boolean
  data?: any
  error?: boolean | Error
  headers?: { [key: string]: string }
  url?: string
}

interface IMutationProps {
  endpoint?: string
  params?: { [key: string]: any }
  data?: any
  updateData?: UpdateData
}

const useMutation = ({ method, endpoint, params }: IProps = {}) => {
  const { subscribe, unsubscribe, client } = useClient()
  const url = getUrl({
    path: endpoint,
    search: params,
  })
  const [state, setState] = useState<IState>({
    ...initialState,
    url,
  })

  const mutation = useCallback(
    (props: IMutationProps) => {
      const {
        endpoint,
        params,
        data,
        updateData = defaultUpdateData,
        ...config
      } = props
      const newUrl = getUrl({ path: endpoint, search: params }) || url
      setState(s => ({
        ...s,
        url: newUrl,
        loading: true,
      }))
      return subscribe(newUrl)
        .request(newUrl, data, {
          method,
          ...config,
        })
        .then((payload: any) => {
          setState(state => ({
            ...state,
            loading: false,
            error: false,
            data: updateData(state.data, { data: get(payload, 'data') }),
            headers: get(payload, 'meta.headers'),
          }))
          return payload
        })
        .catch((error: AxiosError) => {
          if (!client.isCancel(error)) {
            setState(state => ({
              ...state,
              loading: false,
              error,
              headers: get(error, 'headers'),
            }))
          }
          throw error
        })
    },
    [setState, url, client],
  )

  useEffect(() => () => unsubscribe(state.url), [state.url])

  const setData = useCallback(
    newData => {
      setState(s => ({ ...s, data: newData }))
    },
    [setState],
  )

  return [
    mutation,
    {
      endpoint: state.endpoint,
      params: state.params,
      data: state.data,
      loading: state.loading,
      error: state.error,
      headers: state.headers,
      setData,
    },
  ]
}

export const useHttpPost = (config: IProps) =>
  useMutation({ method: 'post', ...config })
export const useHttpPut = (config: IProps) =>
  useMutation({ method: 'put', ...config })
export const useHttpPatch = (config: IProps) =>
  useMutation({ method: 'patch', ...config })
export const useHttpDelete = (config: IProps) =>
  useMutation({ method: 'delete', ...config })
