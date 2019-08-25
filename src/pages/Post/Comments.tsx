import React from 'react'
import { map, isEmpty, isUndefined } from 'lodash'

import { ID } from '../../global'
import { useHttpGet } from '../../hooks'
import { endpoints } from '../../constants'
import { getUrl } from '../../utils'

interface Comment {
  id: ID
  name?: string
  email?: string
  body?: string
}

export const Comment = ({ id }: { id: ID }) => {
  const { data: comment } = useHttpGet<Comment>({
    url: getUrl({
      path: endpoints.comment,
      params: { id },
    }),
  })

  if (!isUndefined(comment) && !isEmpty(comment)) {
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

  return null
}

export const Comments = ({ id }: { id: ID }) => {
  const { data: comments } = useHttpGet<Comment[]>({
    url: getUrl({
      path: endpoints.comments,
      search: {
        postId: id,
      },
    }),
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
