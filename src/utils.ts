import pathToRegexp from 'path-to-regexp'
import qs from 'query-string'

interface IProps {
  path?: string
  pathParams?: { [key: string]: any }
  search?: { [key: string]: any } | string | undefined
}

export const getLocation = ({
  path = '',
  pathParams = {},
  search,
}: IProps = {}) => ({
  pathname: pathToRegexp.compile(path)(pathParams),
  search: typeof search === 'object' ? qs.stringify(search) : search,
})

export const getUrl = ({ path, pathParams, search }: IProps = {}): string => {
  const location = getLocation({ path, pathParams, search })

  return [location.pathname, location.search].filter(d => d).join('?')
}

const getWindowLocation = () => ({
  pathname: window.location.pathname,
  search: window.location.search,
})

interface ILocation {
  search?: { [key: string]: string } | string
  pathname?: string
}

export const updateLocation = (
  { search, pathname }: ILocation = {},
  location = getWindowLocation(),
) => ({
  pathname: pathname || location.pathname,
  search: qs.stringify({
    ...qs.parse(location.search),
    ...(typeof search === 'string' ? qs.parse(search) : search),
  }),
})

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))
