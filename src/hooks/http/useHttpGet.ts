import { useCallback, useState, useEffect } from 'react'
import { get } from 'lodash'
import qs from 'query-string'

import { getUrl } from '../../utils'
import { defaultUpdateData, initialState } from './common'
import { useClient } from '../../contexts'

export const useHttpGet = ({ endpoint, params }, options) => {
  const { subscribe, unsubscribe, client } = useClient()
  const [state, setState] = useState({
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
    [setState],
  )

  useEffect(() => {
    const url = getUrl({ path: endpoint, search: params })
    if (url) {
      setState(s => ({
        ...s,
        ...initialState,
        loading: true,
      }))
      makeRequest({ url })
    }

    return () => {
      unsubscribe(url)
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
