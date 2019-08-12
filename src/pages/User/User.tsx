import React from 'react'

import { useHttpGet } from '../../hooks'
import { getUrl } from '../../utils'
import { endpoints } from '../../constants'
import { OtherUsers } from './OtherUsers'

export const User = ({ match }) => {
  const result = useHttpGet({
    endpoint: getUrl({
      path: endpoints.user,
      pathParams: { id: match.params.id },
    }),
  })

  const { data: user, loading, error } = result

  return (
    <div>
      <h1>User</h1>
      {loading ? <div>Loading...</div> : error && <div>Error...</div>}
      <pre>{JSON.stringify(user, 0, 2)}</pre>
      <OtherUsers excludeId={match.params.id} />
    </div>
  )
}
