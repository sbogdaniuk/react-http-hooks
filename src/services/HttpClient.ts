import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { setupCache } from 'axios-cache-adapter'
import { throttleAdapterEnhancer } from 'axios-extensions'
import { get, set, isEmpty } from 'lodash'
import qs from 'query-string'

import { settings } from '../settings'
import { ID } from '../global'

interface RequestConfig extends AxiosRequestConfig {
  requestId?: number | string
}

interface ISubscription {
  id: ID
  callback?: (response: AxiosResponse) => void
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
  adapter: throttleAdapterEnhancer(cache.adapter),
  baseURL: settings.baseURL,
})

export class HttpClient {
  requests: { [key: string]: any } = {}
  subscriptions: { [key: string]: ISubscription[] } = {}
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

  async get(url: string, config = {}) {
    return this.request({
      method: 'get',
      url,
      ...config,
    }).then((response: AxiosResponse) => {
      // this.notifySubscribers(url, response)
      return response
    })
  }

  request(config: RequestConfig) {
    return api(config)
  }

  notifySubscribers(url: string, response: AxiosResponse) {
    console.log(
      111,
      'notifySubscribers',
      url,
      response,
      response.request.fromCache,
    )
    console.log(222, 'subscriptions', this.subscriptions)
  }

  subscribe(
    id: ISubscription['id'],
    url: string,
    callback: ISubscription['callback'] = undefined,
  ) {
    set(
      this.subscriptions,
      url,
      get(this.subscriptions, url, [] as ISubscription[]).concat({
        id,
        callback,
      }),
    )
    this.log()
    console.log(111, 'subscribe', this.subscriptions, { id, url })
    return this
  }

  unsubscribe(id: ISubscription['id'], url: string) {
    this.log({ id, url })
    if (id) {
      const ids = get(this.subscriptions, url, [] as ISubscription[]).filter(
        d => d.id !== id,
      )
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
