import { useCallback, useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { get } from 'lodash'
import qs from 'query-string'

import { getUrl } from '../utils'
import { client } from '../services'

const defaultUpdateData = (a, { data }) => data

const initialState = {
  loading: undefined,
  data: undefined,
  error: undefined,
  headers: undefined,
}

export const useHttpGet = ({ endpoint, params }, options) => {
  const source = useRef()
  const [state, setState] = useState({
    ...initialState,
    endpoint,
    params,
  })

  const cancelRequest = (message = 'Cancel previous request.') => {
    const cancel = get(source, 'current.cancel')
    if (cancel) {
      cancel(message)
    }
  }

  const makeRequest = useCallback(
    ({ url, updateData = defaultUpdateData, ...rest } = {}) => {
      cancelRequest()
      source.current = axios.CancelToken.source()
      setState(s => ({
        ...s,
        loading: true,
      }))
      return client
        .get(url, {
          ...rest,
          cancelToken: source.current.token,
          ...options,
        })
        .then(response => {
          setState(s => ({
            ...s,
            loading: false,
            error: false,
            data: updateData(s.data, {
              data: get(response, 'data'),
            }),
            headers: response.headers,
          }))
        })
        .catch(error => {
          if (!client.isCancel(error)) {
            setState(s => ({
              ...s,
              data: updateData(s.data, { error }),
              loading: false,
              error,
            }))
          }
        })
    },
    [setState, source],
  )

  useEffect(() => {
    const url = getUrl({ path: endpoint, search: params })
    // const url = getUrl({ path: endpoint })
    if (url) {
      setState(s => ({
        ...s,
        ...initialState,
        loading: true,
      }))
      makeRequest({ url })
    }

    return () => {
      cancelRequest()
    }
  }, [endpoint, qs.stringify(params), makeRequest, setState])

  const fetchMore = ({ endpoint = state.endpoint, params, updateData }) => {
    setState(s => ({
      ...s,
      endpoint,
      fetchMoreParams: params,
      loading: true,
    }))
    const endpointUrl = getUrl({ path: endpoint, search: params })
    return makeRequest({ url: endpointUrl, updateData })
  }

  const refetch = ({ updateData, ...config }) =>
    makeRequest({ updateData, ...config })

  return {
    endpoint: state.endpoint,
    params: state.fetchMoreParams || state.params,
    data: state.data,
    loading: state.loading,
    error: state.error,
    headers: state.headers,
    fetchMore,
    setState,
    makeRequest,
    refetch,
  }
}
