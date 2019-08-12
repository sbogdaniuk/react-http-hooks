import React from 'react'

import { useHttpGet } from '../../hooks'
import { endpoints } from '../../constants'
import { getUrl } from '../../utils'

const style = { width: 30 }

export const LogItem = ({ user, post, comment }) => {
  const { data: userData } = useHttpGet({
    endpoint: getUrl({
      path: endpoints.user,
      pathParams: { id: user },
    }),
  })

  const { data: postData } = useHttpGet({
    endpoint: getUrl({
      path: endpoints.post,
      pathParams: { id: post },
    }),
  })

  const { data: commentData } = useHttpGet({
    endpoint: getUrl({
      path: endpoints.comment,
      pathParams: { id: comment },
    }),
  })

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td style={style}>{user}</td>
            <td style={style}>{post}</td>
            <td style={style}>{comment}</td>
          </tr>
        </tbody>
      </table>
      {userData && <pre>{JSON.stringify(userData, 0, 2)}</pre>}
      {postData && <pre>{JSON.stringify(postData, 0, 2)}</pre>}
      {commentData && <pre>{JSON.stringify(commentData, 0, 2)}</pre>}
    </div>
  )
}
