import React from 'react'
import { map, isEmpty } from 'lodash'

import { useHttpGet } from '../../hooks'
import { endpoints } from '../../constants'
import { getUrl } from '../../utils'

export const Comment = ({ id }) => {
  const { data: comment } = useHttpGet({
    endpoint: getUrl({
      path: endpoints.comment,
      pathParams: { id },
    }),
  })

  if (isEmpty(comment)) return null

  return (
    <>
      <div>
        <b>Name:</b> {comment.name}
      </div>
      <div>
        <b>Email:</b> {comment.email}
      </div>
      <div>
        <b>Body:</b> {comment.body}
      </div>
    </>
  )
}

export const Comments = ({ id }) => {
  const { data: comments } = useHttpGet({
    endpoint: endpoints.comments,
    params: {
      postId: id,
    },
  })

  const ids = map(comments, d => d.id)

  return (
    <div>
      <h4>Comments</h4>
      <ul>
        {ids.map((id, i) => (
          <li key={id}>
            {!!i && <hr />}
            <Comment id={id} />
          </li>
        ))}
      </ul>
    </div>
  )
}
