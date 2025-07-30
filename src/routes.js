import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

// - Create user
// - Update user
// - Delete user
// - List users

// HTTP Methods
// GET - Read information (e.g., list users, get user details)
// POST - Create new information (e.g., create a new user)
// PUT - Update existing information (e.g., update user details)
// DELETE - Remove information (e.g., delete a user)

// Stateful vs Stateless
// Stateful - The server keeps track of the state of the application (e.g., user sessions)
// Stateless - The server does not keep track of the state, each request is independent (e.g., REST APIs)

// JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy to read and write for humans and machines.
// It is often used to transmit data between a server and a web application as an alternative to XML.
// In this code, we are using JSON to parse the request body and send responses in JSON format.

// Headers are key-value pairs sent in HTTP requests and responses.
// They provide metadata about the request or response, such as content type, authorization, and caching

// HTTP Status Codes
// 200 OK - The request was successful.
// 201 Created - The request was successful and a new resource was created.
// 204 No Content - The request was successful, but there is no content to return.

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { search } = req.query

      const users = database.select('users', search ? {
        name: search,
        email: search
      } : null)

      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { name, email } = req.body

      const user = {
        // Generate a unique identifier for the user
        // Using randomUUID from the crypto module
        // This ensures that each user has a unique ID
        // UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify
        // information in computer systems.
        // It is often represented as a string in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        id: randomUUID(),
        name,
        email,
      }

      database.insert('users', user)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { name, email } = req.body

      database.update('users', id, {
        name,
        email,
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('users', id)

      return res.writeHead(204).end()
    }
  }
]
