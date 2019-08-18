import { useCallback, useState, useEffect } from 'react'
import { get } from 'lodash'
import qs from 'query-string'

import { UpdateData } from '../../global'
import { getUrl } from '../../utils'
import { defaultUpdateData, initialState } from './common'
import { useClient } from '../../contexts'
import { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'

interface IProps<Data> {
  endpoint?: string
  params?: { [key: string]: any }
  updateData?: UpdateData<Data>
  skip?: boolean
}

interface IState<Data = any> {
  endpoint?: IProps<Data>['endpoint']
  params?: IProps<Data>['params']
  loading?: boolean
  data?: Data
  fetchMoreParams?: { [key: string]: any }
  headers?: any
  error?: AxiosError | boolean
}

export const useHttpGet = <Data>(
  { endpoint, params, skip }: IProps<Data>,
  options: AxiosRequestConfig = {},
) => {
  const { subscribe, unsubscribe, client } = useClient()
  const [state, setState] = useState<IState<Data>>({
    ...initialState,
    endpoint,
    params,
  })

  const makeRequest = useCallback(
    ({ url, updateData = defaultUpdateData, ...rest } = {}) => {
      if (!skip) {
        setState(s => ({
          ...s,
          loading: true,
        }))
        return subscribe(url)
          .get(url, {
            ...rest,
            ...options,
          })
          .then((response: AxiosResponse<Data>) => {
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
      }
    },
    [setState, skip, client, subscribe],
  )

  const stringifiedParams =
    typeof params === 'object' ? qs.stringify(params) : ''

  useEffect(() => {
    const url = getUrl({ path: endpoint, search: params })
    if (url && !skip) {
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
  }, [endpoint, stringifiedParams, makeRequest, setState, skip])

  const fetchMore = ({
    endpoint = state.endpoint,
    params,
    updateData,
  }: IProps<Data>) => {
    setState(s => ({
      ...s,
      endpoint,
      fetchMoreParams: params,
      loading: true,
    }))
    const endpointUrl = getUrl({ path: endpoint, search: params })
    return makeRequest({ url: endpointUrl, updateData })
  }

  const refetch = ({ updateData, ...config }: IProps<Data>) =>
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
