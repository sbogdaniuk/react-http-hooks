import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import { history, client } from './services'
import { HttpProvider } from './contexts'
import { App } from './App'

const rootElement = document.getElementById('root')

ReactDOM.render(
  <HttpProvider client={client}>
    <Router history={history}>
      <App />
    </Router>
  </HttpProvider>,
  rootElement,
)
