import React, { useState, useEffect } from 'react'
import { map } from 'lodash'

import { useHttpGet } from '../../hooks'
import { endpoints } from '../../constants'
import { commentApi } from '../../services'

const useComment = id => {
  const [payload, setPayload] = useState(undefined)

  useEffect(() => {
    let isSubscribed = true
    commentApi.getComment(id).then(payload => {
      if (isSubscribed) setPayload(payload)
    })
    return () => (isSubscribed = false)
  }, [id])

  return payload
}

export const Comment = ({ id }) => {
  const data = useComment(id)

  return <div>{JSON.stringify(data, 0, 2)}</div>
}

export const PostComments = ({ id }) => {
  const { data: comments } = useHttpGet({
    endpoint: endpoints.comments,
    params: {
      postId: id,
    },
  })

  const ids = map(comments, d => d.id)

  return (
    <div>
      <h1>Comments</h1>
      <ul>
        {ids.map(id => (
          <Comment key={id} id={id} />
        ))}
      </ul>
    </div>
  )
}
