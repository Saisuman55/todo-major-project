# Full-Stack To-Do List Application

## Project Title & Objective
**Title:** Full-Stack To-Do List Application  
**Objective:** Build a full-stack CRUD To-Do app demonstrating frontend-backend communication, RESTful API design, and persistence using MongoDB.

---

## Project Description (what & why)
This app allows users to create, read, update, and delete tasks. Optional authentication via JWT enables private task lists per user. The project demonstrates:
- REST API design with Node.js + Express
- MongoDB storage with Mongoose
- React frontend with responsive UI and filters
- Deployment-ready configuration for client + server

---

## Tech Stack
- Frontend: React (Create React App), HTML, CSS, JS
- Backend: Node.js, Express.js
- Database: MongoDB (Atlas or local)
- Auth: bcrypt for password hashing, JWT for tokens
- Tools: Postman, Git/GitHub, Vercel/Netlify (client), Render/Heroku (server)

---

## Repo Link
`https://github.com/<your-username>/todo-major-project`  *(replace with your repo link)*

---

## Live / Deployed Links
- Frontend: `https://<your-frontend-app>.vercel.app`  
- Backend: `https://<your-backend-app>.onrender.com`  
*(Replace with actual deployed links)*

---

## Setup Instructions

### Prerequisites
- Node.js >= 16, npm
- MongoDB Atlas account (or local MongoDB)
- Git

### Server (backend)
1. `cd server`
2. Copy `.env.example` to `.env` and fill values:
   ```bash
   PORT=5000
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   ```
3. Install & run:
   ```bash
   npm install
   npm run dev      # uses nodemon (dev) or npm start for production
   ```
4. Seed sample tasks (optional):
   ```bash
   npm run seed
   ```

### Client (frontend)
1. `cd client`
2. Create `.env` (optional) to set `REACT_APP_API_URL` (default used: `http://localhost:5000/api`)
3. Install & run:
   ```bash
   npm install
   npm start
   ```

---

## API Endpoints (summary)

**Auth**
- `POST /api/auth/register` — { name, email, password }
- `POST /api/auth/login` — { email, password } → returns `{ token }`

**Tasks** (protected)
- `GET /api/tasks` — get tasks of authenticated user (query: ?filter=completed|pending)
- `POST /api/tasks` — create task `{ title, description, dueDate?, priority? }`
- `GET /api/tasks/:id` — get one task
- `PUT /api/tasks/:id` — update task
- `DELETE /api/tasks/:id` — delete task

---

## Test Credentials (for review)
- **Email:** reviewer@example.com  
- **Password:** Password123
