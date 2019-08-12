import React from 'react'
import { isEmpty } from 'lodash'

import { useHttpGet } from '../../hooks'
import { getUrl } from '../../utils'
import { endpoints } from '../../constants'
import { Comments } from './Comments'
import { AddComment } from './AddComment/AddComment'

export const Post = ({ match }) => {
  const { data: post, loading, error } = useHttpGet({
    endpoint: getUrl({
      path: endpoints.post,
      pathParams: { id: match.params.id },
    }),
  })

  return (
    <div>
      <h1>Post</h1>
      {loading ? <div>Loading...</div> : error && <div>Error...</div>}
      {!isEmpty(post) && (
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
