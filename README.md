# Todo Basic

A simple Node.js Express API for managing todos with user authentication via headers.

## Features

- CRUD operations for todos (Create, Read, Update, Delete)
- User-specific todos (requires `user-id` header)
- Pagination, filtering, and sorting for GET all todos
- Swagger API documentation
- CORS enabled
- Morgan logging

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.

## Running the Application

- Development: `npm run dev` (uses nodemon)
- Production: `npm start`

The server will run on port 3000 by default (configurable via `PORT` environment variable).

## API Endpoints

All endpoints require a `user-id` header (e.g., `user-id: user1`).

- `GET /api/todos` - Get all todos with optional pagination (`?page=1&limit=10`), filtering (`?completed=true&search=term`), and sorting (`?sortBy=createdAt&sortOrder=desc`)
- `GET /api/todos/:id` - Get a specific todo by ID
- `POST /api/todos` - Create a new todo (body: `{ "title": "Todo title", "completed": false }`)
- `PUT /api/todos/:id` - Update a todo (body: `{ "title": "New title", "completed": true }`)
- `DELETE /api/todos/:id` - Delete a todo
- `DELETE /api/todos/clear/all` - Clear all cached todos and reset to sample data

## API Documentation

Swagger UI is available at `http://localhost:3000/api-docs` when the server is running.

## Docker

A Dockerfile is provided for containerization. Build and run with:

```bash
docker build -t todo-basic .
docker run -p 3000:3000 todo-basic
```

## Dependencies

- Express.js
- CORS
- Morgan
- Swagger UI Express
- YAML.js

## License

ISC
