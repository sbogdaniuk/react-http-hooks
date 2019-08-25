import { useCallback, useState, useEffect, useRef } from 'react'
import { get } from 'lodash'

import { UpdateData } from '../../global'
import { defaultUpdateData, initialState } from './common'
import { useClient } from '../../contexts'
import {
  AxiosError,
  AxiosResponse,
  AxiosPromise,
  AxiosRequestConfig,
} from 'axios'

interface IProps<Data> {
  url?: string
  updateData?: UpdateData<Data>
  skip?: boolean
}

interface IState<Data = any> {
  url?: IProps<Data>['url']
  fetchMoreUrl?: IProps<Data>['url']
  loading?: boolean
  data?: Data
  headers?: any
  error?: AxiosError | boolean
}

type TFetchMore<Data> = (data: IProps<Data>) => AxiosPromise<Data>
type TRefetch<Data> = (data: IProps<Data>) => AxiosPromise<Data>

type TReturn<Data> = Omit<IState<Data>, 'fetchMoreUrl'> & {
  fetchMore: TFetchMore<Data>
  refetch: TRefetch<Data>
  setData: (data: Data) => void
}

const defaultOptions = {}

export const useHttpGet = <Data>(
  { url, skip }: IProps<Data>,
  options: AxiosRequestConfig = defaultOptions,
): TReturn<Data> => {
  const { client } = useClient()
  const [state, setState] = useState<IState<Data>>({
    ...initialState,
    url,
  })

  const onSuccess = (
    response: AxiosResponse<Data>,
    updateData = defaultUpdateData,
  ) => {
    setState(s => ({
      ...s,
      loading: false,
      error: false,
      data: updateData(s.data, {
        data: get(response, 'data'),
      }),
      headers: response.headers,
    }))
  }

  const makeRequest = useCallback(
    ({ url, updateData = defaultUpdateData, ...rest } = {}) => {
      if (!skip) {
        setState(s => ({
          ...s,
          loading: true,
        }))
        return client
          .get(url, {
            ...rest,
            ...options,
          })
          .then((response: AxiosResponse<Data>) => {
            onSuccess(response, updateData)
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
    [setState, skip, client],
  )

  useEffect(() => {
    if (url && !skip) {
      setState(s => ({
        ...s,
        ...initialState,
        loading: true,
      }))
      makeRequest({ url })
    }
  }, [url, makeRequest, setState, skip])

  const lastUrl = state.fetchMoreUrl || state.url

  const fetchMore = ({ url = lastUrl, updateData }: IProps<Data>) => {
    setState(s => ({
      ...s,
      fetchMoreUrl: url,
      loading: true,
    }))
    return makeRequest({ url, updateData })
  }

  const refetch = ({ updateData, ...config }: IProps<Data>) =>
    makeRequest({ url: lastUrl, updateData, ...config })

  const setData = useCallback(
    newData => {
      setState(s => ({ ...s, data: newData }))
    },
    [setState],
  )

  return {
    url: lastUrl,
    data: state.data,
    loading: state.loading,
    error: state.error,
    headers: state.headers,
    fetchMore,
    setData,
    refetch,
  }
}
