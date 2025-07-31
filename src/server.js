// Description: This file sets up an HTTP server that handles requests and routes them to the appropriate handlers based on the method and path.
// It also includes middleware for parsing JSON request bodies and extracting query parameters.
// We can use module imports because in package.json we set "type": "module"
// and we are using Node.js version that supports ES modules.
import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    // The params object contains the parameters extracted from the URL path.
    // For example, if the URL is /users/123, params would be { id: '123' }.
    // These parameters are often used to identify specific resources in the database
    // or to perform actions on them.
    req.params = params

    // Query parameters are often used to filter or sort data in a request.
    // They are typically appended to the URL after a question mark (?)
    // For example, in the URL /users?search=john, "search=john" is a query parameter.
    // The extractQueryParams function is used to parse these parameters into
    // an object for easier access in the route handler.
    // URL Stateful => filter, sort, pagination
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333, () => {
  console.log('HTTP Server running on http://localhost:3333')
})
