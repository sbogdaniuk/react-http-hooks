import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { setupCache } from 'axios-cache-adapter'
import { get, set, isEmpty } from 'lodash'
import qs from 'query-string'

import { settings } from '../settings'

interface RequestConfig extends AxiosRequestConfig {
  requestId?: number | string
}

// Create `axios-cache-adapter` instance
// const maxAge = 15 * 60 * 1000
const maxAge = 10 * 1000
// const maxAge = 0

const cache = setupCache({
  maxAge,
  key: req => req.url + qs.stringify(req.params),
  exclude: {
    query: false,
  },
})

// Create `axios` instance passing the newly created `cache.adapter`
const api = axios.create({
  adapter: cache.adapter,
  baseURL: settings.baseURL,
})

export class HttpClient {
  requests: { [key: string]: any } = {}
  subscriptions: { [key: string]: string[] } = {}
  cancelTokens: { [key: string]: any } = {}

  log(props: any = {}) {
    if (!isEmpty(props)) {
      console.log(111, 'HttpClient', props)
    }
    console.log(111, 'HttpClient', {
      requests: this.requests,
      subscriptions: this.subscriptions,
      cancelTokens: this.cancelTokens,
    })
  }

  getCache() {
    return cache
  }

  getAllRequests() {
    this.log()
    return this.requests
  }

  isCancel(error: AxiosError) {
    return axios.isCancel(error)
  }

  get(url: string, config = {}) {
    const runningRequest = get(this.requests, url)

    if (runningRequest) {
      return runningRequest
    }

    const source = axios.CancelToken.source()
    const request = this.request({
      method: 'get',
      url,
      requestId: url,
      cancelToken: source.token,
      ...config,
    }).then((response: AxiosResponse) => {
      delete this.subscriptions[url]
      delete this.cancelTokens[url]
      delete this.requests[url]
      return response
    })

    set(this.requests, url, request)
    set(this.cancelTokens, url, source)

    return request
  }

  request(config: RequestConfig) {
    return api(config)
  }

  subscribe(id: string, url: string) {
    set(
      this.subscriptions,
      url,
      get(this.subscriptions, url, [] as string[]).concat(id),
    )
    this.log()
    console.log(111, 'subscribe', this.subscriptions, { id, url })
    return this
  }

  unsubscribe(id: string, url: string) {
    this.log({ id, url })
    if (id) {
      const ids = get(this.subscriptions, url, []).filter(d => d !== id)
      if (isEmpty(ids)) {
        const cancel = get(this.cancelTokens, [url, 'cancel'])
        console.log(111, 'cancel', cancel)
        if (cancel) {
          cancel('Cancel previous request.')
        }
        delete this.subscriptions[url]
        delete this.cancelTokens[url]
        delete this.requests[url]
      } else {
        set(this.subscriptions, url, ids)
      }
    }

    console.log(222, 'unsubscribe', this.subscriptions, { id, url })
  }
}

export const client = new HttpClient()
