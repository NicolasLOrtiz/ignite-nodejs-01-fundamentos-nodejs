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

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333, () => {
  console.log('HTTP Server running on http://localhost:3333')
})
