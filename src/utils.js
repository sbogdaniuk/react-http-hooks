import pathToRegexp from 'path-to-regexp'
import qs from 'query-string'
import { isPlainObject } from 'lodash'

export const getLocation = ({ path = '', pathParams = {}, search }) => ({
  pathname: pathToRegexp.compile(path)(pathParams),
  search: typeof search === 'string' ? search : qs.stringify(search),
})

export const getUrl = ({ path, pathParams, search }) => {
  const location = getLocation({ path, pathParams, search })

  return [location.pathname, location.search].filter(d => d).join('?')
}

const getWindowLocation = () => ({
  pathname: window.location.pathname,
  search: window.location.search,
})

export const updateLocation = (
  { search, pathname } = {},
  location = getWindowLocation(),
) => ({
  pathname: pathname || location.pathname,
  search: qs.stringify({
    ...qs.parse(location.search),
    ...(isPlainObject(search) ? search : qs.parse(search)),
  }),
})
