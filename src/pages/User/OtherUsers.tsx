import React from 'react'
import { sampleSize, isEmpty, isUndefined } from 'lodash'
import { Link } from 'react-router-dom'

import { ID } from '../../global'
import { getLocation } from '../../utils'
import { routes } from '../../constants'
import { useUsers } from '../../hooks'

interface Props {
  excludeId?: ID
}

interface User {
  id: ID
  name: string
}

export const OtherUsers = ({ excludeId }: Props) => {
  const { data: users, loading, error } = useUsers<User[]>()

  return (
    <div>
      <h4>OtherUsers</h4>
      {loading ? <div>Loading...</div> : error && <div>Error...</div>}
      {!isUndefined(users) && !isEmpty(users) && (
        <ul>
          {sampleSize(users.filter(d => d.id !== excludeId), 3).map(user => (
            <li key={user.id}>
              <Link
                to={getLocation({
                  path: routes.user,
                  pathParams: { id: user.id },
                })}
              >
                {user.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
