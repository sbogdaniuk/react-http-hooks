import React from 'react'
import { Alert, Button } from 'reactstrap'
import { get } from 'lodash'
import { AxiosError } from 'axios'

interface Props {
  error?: AxiosError | boolean
  loading?: boolean
  refetch: (config: any) => Promise<any>
}

export const PostsError = ({ error, loading, refetch }: Props) => {
  const retry = () => refetch(get(error, 'config'))

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
