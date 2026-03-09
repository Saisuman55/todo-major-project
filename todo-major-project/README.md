# 📝 Premium Full-Stack To-Do Application

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

A stunning, full-stack ToDo web application built with **React (frontend)** and **Node.js + Express (backend)**.  
It allows users to manage daily tasks — add, edit, delete, and mark tasks as completed — with real-time updates and secure authentication.

---

## 🚀 Features

- **Premium UI/UX:** Dark mode aesthetics with dynamic gradients, `backdrop-filter` glassmorphism, and sleek hover animations.
- **Advanced Date Tracking:** Native Day/Month/Year dropdown pickers mapped strictly to user locale contexts.
- **Smart Progress Tracker:** Automatic visual calculation of completed vs. internal tasks.
- **Priority Badging:** Dynamic color-coded visual tagging (`High`, `Medium`, `Low`).
- **Unified Full-Stack Service:** Express backend natively serves the compiled React production client, eliminating the need for dual dev servers!
- **Secure Authentication:** JWT-based user-specific task compartmentalization.

---

## 🧩 Project Structure

```
todo-major-project/
│
├── client/              # React frontend (run `npm run build` here)
├── server/              # Node.js + Express backend (serves the client automatically)
├── docker-compose.yml   # Optional Docker setup
├── package.json
└── README.md
```

---

## ⚙️ Prerequisites

Before you start, make sure you have the following installed:

- [Node.js (v16 or higher)](https://nodejs.org/)
- npm (comes with Node)
- [MongoDB](https://www.mongodb.com/) running locally or cloud (Atlas)

---

## 🧠 Run Locally (Unified Production Setup)

You no longer need to run the client and server separately. The Express backend serves the React frontend cleanly.

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Saisuman55/todo-major-project.git
cd todo-major-project
```

### 2️⃣ Configure Backend Environment
Navigate to the `server` folder, create a `.env` file and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key_here
```

### 3️⃣ Build the Premium Frontend
Navigate to the `client/` directory and compile the React production build:
```bash
cd client
npm install
npm run build
```

### 4️⃣ Start the Backend
Navigate back to the `server/` directory, install dependencies, and run it:
```bash
cd ../server
npm install
npm run dev
```

**That's it!** Navigate to **http://localhost:5000** in your web browser. Express will automatically route your API requests securely and serve your beautiful React Client UI.

---

## 🔌 API Endpoints 

**Authentication**
- `POST /api/auth/register` — Requires `{ name, email, password }`
- `POST /api/auth/login` — Requires `{ email, password }` → Returns `{ token }`

**Tasks (Protected)**
- `GET /api/tasks` — Fetch user's tasks (optional `?filter=completed|pending`)
- `POST /api/tasks` — Create task `{ title, description, dueDate, priority }`
- `GET /api/tasks/:id` — Get one specific task
- `PUT /api/tasks/:id` — Update existing task
- `DELETE /api/tasks/:id` — Delete task

---

## 🧑‍💻 Author

**Sai Suman Samantaray**
📍 Khordha, Odisha, India
🔗 [GitHub](https://github.com/Saisuman55)

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
