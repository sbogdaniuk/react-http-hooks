import DataLoader from 'dataloader'
import { get, head, uniq } from 'lodash'

import { endpoints } from '../constants'
import { HttpClient } from './HttpClient'
import { ID, IComment } from '../global'

type Config = { [key: string]: any }

type Prop = {
  id: ID
  config?: Config
}

class CommentsApi extends HttpClient {
  commentsLoader = new DataLoader(async (props: Prop[]) => {
    const { config } = head(props) as Prop
    const ids = props.reduce((acc, item) => [...acc, item.id], [] as ID[])
    const { data: commentsList } = (await this.get(endpoints.comments, {
      ...config,
      params: { ...get(config, 'params'), id: ids },
    })) as { data: IComment[] }
    return ids.map(id => commentsList.find(comment => comment.id === id))
  })

  async getComment(id: ID, config: Config = {}) {
    return this.commentsLoader.load({ id, config })
  }
}

export const commentApi = new CommentsApi()
