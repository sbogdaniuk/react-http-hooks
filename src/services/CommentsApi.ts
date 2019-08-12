import DataLoader from 'dataloader'
import { get, head, uniq } from 'lodash'

import { endpoints } from '../constants'
import { HttpClient } from './HttpClient'

class CommentsApi extends HttpClient {
  commentsLoader = new DataLoader(async props => {
    const { config } = head(props)
    const ids = props.reduce((acc, item) => [...acc, item.id], [])
    const { data: commentsList } = await this.get(endpoints.comments, {
      ...config,
      params: { ...get(config, 'params'), id: ids },
    })
    return ids.map(id => commentsList.find(comment => comment.id === id))
  })

  async getComment(id, config) {
    return this.commentsLoader.load({ id, config })
  }
}

export const commentApi = new CommentsApi()
