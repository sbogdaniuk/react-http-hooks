import React from 'react'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { ListGroup, ListGroupItem } from 'reactstrap'
import qs from 'query-string'

import { getLocation, updateLocation } from '../../utils'
import { routes } from '../../constants'
import { useUsers } from '../../hooks'

export const Users = props => {
  const { history, location } = props
  const parsedSearch = qs.parse(location.search)
  const usersData = useUsers({
    params: { _limit: parsedSearch.limit },
  })

  const { data: users, loading, error } = usersData

  const changeFilter = ({ target: { name, value } }) => {
    const newLocation = updateLocation(
      { search: { [name]: value || undefined } },
      location,
    )
    history.replace(newLocation)
  }

  return (
    <div>
      <h1>Users</h1>
      <div>
        Limit to:
        <select name="limit" value={parsedSearch.limit} onChange={changeFilter}>
          <option value="">---</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      {loading ? <div>Loading...</div> : error && <div>Error...</div>}
      {users &&
        (isEmpty(users) ? (
          <div>Nothing to show</div>
        ) : (
          <ListGroup flush>
            {users.map(user => (
              <ListGroupItem
                key={user.id}
                tag={Link}
                to={getLocation({
                  path: routes.user,
                  pathParams: { id: user.id },
                })}
              >
                {user.name}
              </ListGroupItem>
            ))}
          </ListGroup>
        ))}
    </div>
  )
}
