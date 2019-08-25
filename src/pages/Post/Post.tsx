import React from 'react'
import { isEmpty, isUndefined } from 'lodash'
import { RouteComponentProps } from 'react-router-dom'

import { IPost } from '../../global'
import { useHttpGet } from '../../hooks'
import { getUrl } from '../../utils'
import { endpoints } from '../../constants'
import { Comments } from './Comments'
import { AddComment } from './AddComment'

interface PostProps extends RouteComponentProps<{ id?: string }> {}

export const Post = ({ match }: PostProps) => {
  const { data: post, loading, error } = useHttpGet<IPost>({
    url: getUrl({
      path: endpoints.post,
      params: { id: match.params.id },
    }),
  })

  return (
    <div>
      <h1>Post</h1>
      {loading ? <div>Loading...</div> : error && <div>Error...</div>}
      {!isUndefined(post) && !isEmpty(post) && (
        <div>
          <h2>{post.title}</h2>
          <div>{post.body}</div>
          <Comments id={post.id} />
          <AddComment />
        </div>
      )}
    </div>
  )
}
