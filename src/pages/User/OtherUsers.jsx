import React from 'react'
import { sampleSize, isEmpty } from 'lodash'
import { Link } from 'react-router-dom'

import { getLocation } from '../../utils'
import { routes } from '../../constants'
import { useUsers } from '../../hooks'

export const OtherUsers = ({ excludeId }) => {
  const { data: users, loading, error } = useUsers()

  return (
    <div>
      <h4>OtherUsers</h4>
      {loading ? <div>Loading...</div> : error && <div>Error...</div>}
      {!isEmpty(users) && (
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
