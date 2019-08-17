import React from 'react'
import { get, isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { Table } from 'reactstrap'
import InfiniteScroll from 'react-infinite-scroller'

import { useHttpGet } from '../../hooks'
import { getLocation } from '../../utils'
import { routes, endpoints } from '../../constants'
import { PostsError } from './PostsError'
import { UpdateData } from '../../hooks/http/common'

const updateData: UpdateData = (
  prevData = [],
  { data }: { data?: any } = {},
) => {
  return data ? prevData.concat(data) : prevData
}

export const Posts = () => {
  const postData = useHttpGet({
    endpoint: endpoints.posts,
    params: {
      _page: 1,
      _limit: 20,
    },
  })
  const {
    data: posts,
    loading,
    error,
    fetchMore,
    headers,
    params = {},
    refetch,
  } = postData
  const total = +get(headers, 'x-total-count') || 0
  const hasMore = (!error && total > get(posts, 'length')) || false

  const loadMorePosts = () => {
    console.log(111, 'loadMorePosts', loadMorePosts, { loading, hasMore })
    if (!loading && hasMore) {
      console.log(111, 'params._page', params._page)
      fetchMore({
        params: {
          _page: params._page + 1,
          _limit: 20,
        },
        updateData,
      })
    }
  }

  const refetchOnError = config => {
    refetch({
      ...config,
      updateData,
    })
  }

  return (
    <div>
      <h1>Posts</h1>
      {posts &&
        (isEmpty(posts) ? (
          <div>Nothing to show</div>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMorePosts}
            hasMore={hasMore}
            loader={null}
          >
            <Table striped bordered>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Body</th>
                  <th>UserId</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>
                      <Link
                        to={getLocation({
                          path: routes.post,
                          pathParams: { id: post.id },
                        })}
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td>{post.body}</td>
                    <td>{post.userId}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </InfiniteScroll>
        ))}

      {error && (
        <PostsError error={error} loading={loading} refetch={refetchOnError} />
      )}
      {loading && !error && <div>Loading...</div>}
    </div>
  )
}
