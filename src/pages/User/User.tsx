import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { IUser } from '../../global'
import { useHttpGet } from '../../hooks'
import { getUrl } from '../../utils'
import { endpoints } from '../../constants'
import { OtherUsers } from './OtherUsers'

interface Params {
  id?: string
}

interface Props extends RouteComponentProps<Params> {}

export const User = ({ match }: Props) => {
  const result = useHttpGet<IUser>({
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
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <OtherUsers excludeId={match.params.id} />
    </div>
  )
}
