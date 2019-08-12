import React, { useState } from 'react'
import { times, sample } from 'lodash'

import { client } from '../../services'
import { LogItem } from './LogItem'

const userIds = times(10, i => i + 1)
const postIds = times(10, i => i + 1)
const commentsIds = times(10, i => i + 1)

const log = () => {
  console.log(111, 'log', client.getCache())
}

const randomizeLogs = () =>
  times(Math.random() * 10 + 10, i => ({
    id: i + 1,
    user: sample(userIds),
    post: sample(postIds),
    comment: sample(commentsIds),
  }))

export const Logs = () => {
  const [logs, setLogs] = useState(randomizeLogs())

  const randomize = () => setLogs(randomizeLogs())

  return (
    <div>
      <h1>Logs</h1>
      <button onClick={randomize} type="button">
        randomize
      </button>
      <br />

      <button onClick={log} type="button">
        client
      </button>
      <ul>
        {logs.map(log => (
          <li key={log.id}>
            <LogItem {...log} />
          </li>
        ))}
      </ul>
    </div>
  )
}
