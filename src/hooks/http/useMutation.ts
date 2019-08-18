import { useCallback, useEffect, useState } from 'react'
import { get } from 'lodash'
import { AxiosError, AxiosResponse, AxiosPromise } from 'axios'

import { UpdateData } from '../../global'
import { getUrl } from '../../utils'
import { defaultUpdateData, initialState } from './common'
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

interface IState<Data> {
  endpoint?: string
  params?: { [key: string]: any }
  loading?: boolean
  data?: Data
  error?: boolean | Error
  headers?: { [key: string]: string }
  url?: string
}

interface IMutationProps<Values, Data> {
  endpoint?: string
  params?: { [key: string]: any }
  data?: Values
  updateData?: UpdateData<Data>
}

export type TMutationFunc<Values, Data> = (
  props: IMutationProps<Values, Data>,
) => AxiosPromise<AxiosResponse<Data>>

type TSetData<Data> = (d?: Data) => void

type TMutationResponse<Values, Data> = [
  TMutationFunc<Values, Data>,
  IState<Data> & { setData: TSetData<Data> }
]

const useMutation = <Values = any, Data = any>({
  method,
  endpoint,
  params,
}: IProps = {}): TMutationResponse<Values, Data> => {
  const { subscribe, unsubscribe, client } = useClient()
  const url = getUrl({
    path: endpoint,
    search: params,
  })
  const [state, setState] = useState<IState<Data>>({
    ...initialState,
    url,
  })

  const mutation = useCallback(
    (props: IMutationProps<Values, Data>) => {
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
        .request({
          url: newUrl,
          data,
          method,
          ...config,
        })
        .then((payload: AxiosResponse<Data>) => {
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

  const setData = useCallback<TSetData<Data>>(
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

export const useHttpPost = <Values, Data = any>(config: IProps) =>
  useMutation<Values, Data>({ method: 'post', ...config })
export const useHttpPut = <Values, Data = any>(config: IProps) =>
  useMutation<Values, Data>({ method: 'put', ...config })
export const useHttpPatch = <Values, Data = any>(config: IProps) =>
  useMutation<Values, Data>({ method: 'patch', ...config })
export const useHttpDelete = <Values, Data = any>(config: IProps) =>
  useMutation<Values, Data>({ method: 'delete', ...config })
