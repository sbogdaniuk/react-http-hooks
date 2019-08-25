import React from 'react'
import { get, isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { Table } from 'reactstrap'
import qs from 'query-string'
import InfiniteScroll from 'react-infinite-scroller'

import { IPost, UpdateData } from '../../global'
import { useHttpGet } from '../../hooks'
import { getLocation, getUrl } from '../../utils'
import { routes, endpoints } from '../../constants'
import { PostsError } from './PostsError'

const updateData: UpdateData = (
  prevData = [],
  { data }: { data?: IPost[] } = {},
) => {
  return data ? prevData.concat(data) : prevData
}

export const Posts = () => {
  const postData = useHttpGet<IPost[]>({
    url: getUrl({
      path: endpoints.posts,
      search: {
        _page: 1,
        _limit: 20,
      },
    }),
  })
  const {
    url,
    data: posts,
    loading,
    error,
    fetchMore,
    headers,
    refetch,
  } = postData
  const total = +get(headers, 'x-total-count') || 0
  const hasMore = (!error && total > (posts || []).length) || false

  const loadMorePosts = () => {
    if (!loading && hasMore && url) {
      const parsedUrl = qs.parseUrl(url)
      fetchMore({
        url: getUrl({
          path: parsedUrl.url,
          search: {
            _page: +(parsedUrl.query._page as string) + 1,
            _limit: 20,
          },
        }),
        updateData,
      })
    }
  }

  const refetchOnError = (config: any): Promise<any> => {
    return refetch({
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
            loader={undefined}
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
                {posts.map((post: IPost) => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>
                      <Link
                        to={getLocation({
                          path: routes.post,
                          params: { id: post.id },
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
