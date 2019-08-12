import axios from 'axios'
import { setupCache } from 'axios-cache-adapter'
import { get, set, isEmpty } from 'lodash'
import qs from 'query-string'

import { settings } from '../settings'

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
  requests = {}
  subscriptions = {}
  cancelTokens = {}

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

  isCancel(error) {
    return axios.isCancel(error)
  }

  get(url, config) {
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
    }).then(response => {
      delete this.subscriptions[url]
      delete this.cancelTokens[url]
      delete this.requests[url]
      return response
    })

    set(this.requests, url, request)
    set(this.cancelTokens, url, source)

    return request
  }

  request(config) {
    return api(config)
  }

  subscribe(id, url) {
    set(this.subscriptions, url, get(this.subscriptions, url, []).concat(id))
    this.log()
    console.log(111, 'subscribe', this.subscriptions, { id, url })
    return this
  }

  unsubscribe(id, url) {
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
