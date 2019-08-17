import React from 'react'
import { Link, Switch, Route, Redirect } from 'react-router-dom'

import { Posts, User, Users, Post, NotFound, Logs } from './pages'
import { routes } from './constants'

export const App = () => {
  return (
    <div className="App">
      <header>
        <Link to="/" className="logo">
          Logo
        </Link>
        <nav className="nav">
          <Link to={routes.posts}>Posts</Link>
          <Link to={routes.users}>Users</Link>
          {/* <Link to={routes.client}>Client</Link> */}
          <Link to={routes.logs}>Logs</Link>
        </nav>
      </header>
      <Switch>
        <Redirect exact from="/" to={routes.posts} />
        <Route path={routes.posts} component={Posts} />
        <Route path={routes.post} component={Post} />
        <Route path={routes.users} component={Users} />
        <Route path={routes.user} component={User} />
        {/* <Route path={routes.client} component={Client} /> */}
        <Route path={routes.logs} component={Logs} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}
