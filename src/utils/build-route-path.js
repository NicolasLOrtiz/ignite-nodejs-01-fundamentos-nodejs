// This function builds a regular expression from a given route path.
// /users/:id => /users/(?<id>[a-z0-9\-_]+)(?<query>\?(.*))?$/
export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const paramsWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

  return new RegExp(`^${paramsWithParams}(?<query>\\?(.*))?$`)
}
