import React, { useState, FC } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { IUser, ID } from '../../global'
import { useHttpGet } from '../../hooks'
import { getUrl } from '../../utils'
import { endpoints } from '../../constants'
import { OtherUsers } from './OtherUsers'

const usePerson = (id: ID) => {
  const url = id
    ? getUrl({
        path: endpoints.user,
        params: { id },
      })
    : ''
  return useHttpGet<IUser>(
    {
      url,
    },
    {
      cache: {
        maxAge: 2 * 1000,
      },
    },
  )
}

interface Props {
  id?: string
  test?: any
}

const Person: FC<Props> = props => {
  const result = usePerson(props.id as ID)

  const { data: user, loading, error } = result

  return (
    <div>
      {loading ? <div>Loading...</div> : error && <div>Error...</div>}
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}

export const User: FC<RouteComponentProps<{ id?: string }>> = ({ match }) => {
  const {
    params: { id },
  } = match

  const [visible, setVisible] = useState(false)

  return (
    <div>
      <h1>User</h1>
      {typeof id !== 'undefined' && (
        <>
          <Person id={id} test="test" />
          <div>
            <button onClick={() => setVisible(!visible)}>
              visible: {String(visible)}
            </button>
            {visible && <Person id={id} />}
          </div>
          <OtherUsers excludeId={id} />
        </>
      )}
    </div>
  )
}
