import { useCallback, useEffect, useRef, useState } from 'react'
import { get } from 'lodash'

import { getUrl } from '../../utils'
import { defaultUpdateData, initialState } from './common'
import { useClient } from '../../contexts'

interface IProps {
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
  loading: boolean
  data: any
  error: boolean | Error
  headers: { [key: string]: string }
  url: string
}

interface IMutationProps {
  endpoint?: string
  params?: { [key: string]: any }
  data?: any
  updateData?: () => null
}

export const useMutation = (method: TMethod) => ({
  endpoint,
  params,
}: IProps = {}) => {
  const { subscribe, unsubscribe, client } = useClient()
  const [state, setState] = useState<IState>({
    ...initialState,
    url: getUrl({
      path: endpoint,
      search: params,
    }),
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
      const url = getUrl({ path: endpoint, search: params }) || state.url
      setState(s => ({
        ...s,
        url,
        loading: true,
      }))
      return subscribe(url)
        .request(url, data, {
          method,
          ...config,
        })
        .then(payload => {
          setState(state => ({
            ...state,
            loading: false,
            error: false,
            data: updateData(state.data, { data: get(payload, 'data') }),
            headers: get(payload, 'meta.headers'),
          }))
        })
        .catch(error => {
          if (!client.isCancel(error.error)) {
            setState(state => ({
              ...state,
              loading: false,
              error,
              headers: get(error, 'headers'),
            }))
          }
        })
    },
    [setState, state.url, client],
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
