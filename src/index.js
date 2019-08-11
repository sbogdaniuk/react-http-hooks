import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import { history } from './services'
import { App } from './App'

const rootElement = document.getElementById('root')

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  rootElement,
)
