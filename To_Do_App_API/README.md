# To-Do App Backend API

A RESTful To-Do Application API built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB (Mongoose)**.

## Architecture

This project follows a clean, 3-tier layered architecture:

```text
React Frontend (http://localhost:5173)
  ↓
Express App (CORS, JSON Parser, Error Handlers)
  ↓
Routes (src/routes/todo.routes.ts)
  ↓
Controllers (src/controllers/todo.controller.ts)
  ↓
Services (src/services/todo.service.ts)
  ↓
Mongoose Model (src/models/ToDo.ts)
  ↓
MongoDB Database
```

## Folder Structure

```text
To_Do_App_API/
├── src/
│   ├── config/
│   │   └── database.ts        # MongoDB connection with Mongoose
│   ├── controllers/
│   │   └── todo.controller.ts # Validates HTTP inputs and formats responses
│   ├── middleware/
│   │   └── error.middleware.ts# Centralized error & 404 handlers
│   ├── models/
│   │   └── ToDo.ts            # Mongoose Schema and TypeScript interface
│   ├── routes/
│   │   └── todo.routes.ts     # REST endpoints routing
│   ├── services/
│   │   └── todo.service.ts    # Business logic & database operations
│   ├── app.ts                 # Express application setup
│   └── server.ts              # Server bootstrap and DB initialization
├── .env                       # Environment variables (secret)
├── .env.example               # Example template for .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Setup & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

### 3. Run in Development Mode
```bash
npm run dev
```

### 4. Build and Run in Production
```bash
npm run build
npm start
```

## REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check |
| `POST` | `/api/todos` | Create a new Todo |
| `GET` | `/api/todos` | Fetch all Todos (sorted newest first) |
| `GET` | `/api/todos/:id` | Fetch a single Todo by ID |
| `PUT` | `/api/todos/:id` | Update a Todo (`title` and/or `completed`) |
| `PATCH`| `/api/todos/:id/toggle` | Toggle `completed` status (`true` ↔ `false`) |
| `DELETE` | `/api/todos/:id` | Delete a Todo by ID |

## Request & Response Examples

### 1. Create a Todo
**Request**:
```http
POST /api/todos
Content-Type: application/json

{
  "title": "Learn Docker"
}
```

**Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "_id": "664bf87b92f74e92a8190c10",
    "title": "Learn Docker",
    "completed": false,
    "createdAt": "2026-09-19T20:30:00.000Z",
    "updatedAt": "2026-09-19T20:30:00.000Z"
  }
}
```

**Validation Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Title is required and cannot be empty"
}
```

---

### 2. Get All Todos
**Request**:
```http
GET /api/todos
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "664bf87b92f74e92a8190c10",
      "title": "Learn Docker",
      "completed": false,
      "createdAt": "2026-09-19T20:30:00.000Z",
      "updatedAt": "2026-09-19T20:30:00.000Z"
    }
  ]
}
```

---

### 3. Update a Todo
**Request**:
```http
PUT /api/todos/664bf87b92f74e92a8190c10
Content-Type: application/json

{
  "title": "Learn Docker and Kubernetes",
  "completed": true
}
```

---

### 4. Toggle Todo Status
**Request**:
```http
PATCH /api/todos/664bf87b92f74e92a8190c10/toggle
```

---

### 5. Delete a Todo
**Request**:
```http
DELETE /api/todos/664bf87b92f74e92a8190c10
```

---

## React Frontend Integration (Axios / Fetch)

Example service file for React:

```typescript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api/todos'
});

export const getTodos = async () => {
  const res = await API.get('/');
  return res.data.data;
};

export const createTodo = async (title: string) => {
  const res = await API.post('/', { title });
  return res.data.data;
};

export const toggleTodo = async (id: string) => {
  const res = await API.patch(`/${id}/toggle`);
  return res.data.data;
};

export const deleteTodo = async (id: string) => {
  const res = await API.delete(`/${id}`);
  return res.data.data;
};
```
