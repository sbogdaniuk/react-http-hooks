import React, { createContext, useContext, useRef, useMemo } from 'react'
import { uniqueId } from 'lodash'

const HttpContext = createContext(null)

export const HttpProvider = ({ client, ...props }) => {
  return <HttpContext.Provider value={client} {...props} />
}

export const useClient = (id = uniqueId()) => {
  const uuid = useRef(id)
  const client = useContext(HttpContext)

  if (!client) {
    throw new Error(`You should use 'useClient' inside of 'HttpProvider'`)
  }

  return useMemo(
    () => ({
      subscribe: url => client.subscribe(uuid.current, url),
      unsubscribe: url => client.unsubscribe(uuid.current, url),
      client,
    }),
    [client],
  )
}
