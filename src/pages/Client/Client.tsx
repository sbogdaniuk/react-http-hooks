import React, { useState, useEffect, useRef } from 'react'
import { times, uniqueId } from 'lodash'
import axios, { AxiosResponse, AxiosError } from 'axios'

import { client } from '../../services'
import { getUrl } from '../../utils'
import { endpoints } from '../../constants'

type ID = string | number

const Post = ({ id }: { id: ID }) => {
  const requestId = useRef<string | null>(null)
  const [state, setState] = useState({})

  const url = getUrl({
    path: endpoints.post,
    pathParams: { id },
  })

  useEffect(() => {
    setState({})
  }, [id])

  useEffect(() => {
    if (!requestId.current) {
      requestId.current = uniqueId()
    }
    setState(s => ({ ...s, loading: true }))
    client
      .subscribe(requestId.current, url)
      .get(url)
      .then((response: AxiosResponse) => {
        if (requestId.current) {
          setState(s => ({
            ...s,
            data: response.data,
            loading: false,
            error: false,
            headers: response.headers,
          }))
        }
      })
      .catch((error: AxiosError) => {
        if (!axios.isCancel(error) && requestId.current) {
          setState(s => ({ ...s, loading: false, error }))
        }
      })
    return () => {
      client.unsubscribe(requestId.current as string, url)
      requestId.current = null
    }
  }, [url, setState])

  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  )
}

export const Client = () => {
  const [count, setCount] = useState()
  const [range, setRange] = useState('50')
  const randomize = () => setCount(Math.ceil(Math.random() * 50 + 25))
  const onRangeChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setRange(value)
  }
  return (
    <div>
      <h1>Client</h1>
      <button
        onClick={() => {
          console.log(222, 'allRequests', client.getAllRequests())
        }}
      >
        allRequests
      </button>
      <div>
        <input
          type="range"
          value={range}
          min={0}
          max={100}
          onChange={onRangeChange}
        />
        {range}
      </div>
      <button onClick={randomize}>randomize</button>
      <Post id={range} />
      {times(count, (i: number) => (
        <Post key={i} id={(i % 15) + 1} />
      ))}
    </div>
  )
}
