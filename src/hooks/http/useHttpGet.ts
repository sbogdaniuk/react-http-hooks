import { useCallback, useState, useEffect } from 'react'
import { get } from 'lodash'
import qs from 'query-string'

import { getUrl } from '../../utils'
import { defaultUpdateData, initialState, UpdateData } from './common'
import { useClient } from '../../contexts'
import { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'

interface IProps {
  endpoint?: string
  params?: { [key: string]: any }
  updateData?: UpdateData
}

interface IState extends IProps {
  loading?: boolean
  data?: any
  fetchMoreParams?: { [key: string]: any }
  headers?: any
  error?: AxiosError | boolean
}

export const useHttpGet = (
  { endpoint, params }: IProps,
  options: AxiosRequestConfig = {},
) => {
  const { subscribe, unsubscribe, client } = useClient()
  const [state, setState] = useState<IState>({
    ...initialState,
    endpoint,
    params,
  })

  const makeRequest = useCallback(
    ({ url, updateData = defaultUpdateData, ...rest } = {}) => {
      setState(s => ({
        ...s,
        loading: true,
      }))
      return subscribe(url)
        .get(url, {
          ...rest,
          ...options,
        })
        .then((response: AxiosResponse) => {
          setState(s => ({
            ...s,
            loading: false,
            error: false,
            data: updateData(s.data, {
              data: get(response, 'data'),
            }),
            headers: response.headers,
          }))
          return response
        })
        .catch((error: AxiosError) => {
          if (!client.isCancel(error)) {
            setState(s => ({
              ...s,
              data: updateData(s.data, { error }),
              loading: false,
              error,
            }))
          }
          throw error
        })
    },
    [setState],
  )

  const stringifiedParams =
    typeof params === 'object' ? qs.stringify(params) : ''

  useEffect(() => {
    const url = getUrl({ path: endpoint, search: params })
    if (url) {
      setState(s => ({
        ...s,
        ...initialState,
        loading: true,
        fetchMoreParams: undefined,
      }))
      makeRequest({ url })
    }

    return () => {
      unsubscribe(url)
    }
  }, [endpoint, stringifiedParams, makeRequest, setState])

  const fetchMore = ({
    endpoint = state.endpoint,
    params,
    updateData,
  }: IProps) => {
    setState(s => ({
      ...s,
      endpoint,
      fetchMoreParams: params,
      loading: true,
    }))
    const endpointUrl = getUrl({ path: endpoint, search: params })
    return makeRequest({ url: endpointUrl, updateData })
  }

  const refetch = ({ updateData, ...config }: IProps) =>
    makeRequest({ updateData, ...config })

  const setData = useCallback(
    newData => {
      setState(s => ({ ...s, data: newData }))
    },
    [setState],
  )

  return {
    endpoint: state.endpoint,
    params: state.fetchMoreParams || state.params,
    data: state.data,
    loading: state.loading,
    error: state.error,
    headers: state.headers,
    fetchMore,
    setData,
    makeRequest,
    refetch,
  }
}
