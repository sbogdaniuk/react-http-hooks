import React from 'react'
import { Alert, Button } from 'reactstrap'
import { get } from 'lodash'

export const PostsError = ({ error, loading, refetch }) => {
  const retry = e => refetch(get(error, 'config'))

  return (
    <Alert color="danger">
      {get(error, 'message')}!{' '}
      <Button
        color="danger"
        size="sm"
        onClick={loading ? undefined : retry}
        disabled={loading}
      >
        {loading ? 'Loading ...' : 'Retry'}
      </Button>
    </Alert>
  )
}
