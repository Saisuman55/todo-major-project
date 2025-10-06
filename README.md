# 📝 ToDo Major Project

A full-stack ToDo web application built with **React (frontend)** and **Node.js + Express (backend)**.  
It allows users to manage daily tasks — add, edit, delete, and mark tasks as completed — with real-time updates.

---

## 🚀 Features

- Add, update, and delete ToDo items  
- Mark tasks as completed  
- Responsive UI using React  
- RESTful API with Express.js backend  
- MongoDB integration for persistent data  
- Modern ES6+ syntax and component structure

---

## 🧩 Project Structure

```

todo-major-project/
│
├── client/              # React frontend
├── server/              # Node.js + Express backend
├── docker-compose.yml   # Optional Docker setup
├── package-lock.json
└── README.md

````

---

## ⚙️ Prerequisites

Before you start, make sure you have the following installed:

- [Node.js (v16 or higher)](https://nodejs.org/)
- npm (comes with Node)
- [MongoDB](https://www.mongodb.com/) running locally or cloud (Atlas)
- *(Optional)* [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## 🧠 Run Locally (Manual Setup)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Saisuman55/todo-major-project.git
cd todo-major-project
````

### 2️⃣ Run the Frontend (React)

```bash
cd client
npm install
npm start
```

Your app will run on:
👉 [http://localhost:3000](http://localhost:3000)

---

### 3️⃣ Run the Backend (Node.js)

Open a **new terminal** and run:

```bash
cd ../server
npm install
npm start
```

Your backend server will run on:
👉 [http://localhost:5000](http://localhost:5000)

---

## 🧱 Environment Variables

In your `server` folder, create a `.env` file and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## 🐳 Optional: Run with Docker

If you prefer using Docker, simply run this from the project root:

```bash
docker-compose up
```

This will build and start both client and server containers.

---

## 🧭 Quick Reference

| Part              | Folder | Commands                   | URL                                            |
| ----------------- | ------ | -------------------------- | ---------------------------------------------- |
| Frontend          | client | `npm install && npm start` | [http://localhost:3000](http://localhost:3000) |
| Backend           | server | `npm install && npm start` | [http://localhost:5000](http://localhost:5000) |
| Docker (optional) | root   | `docker-compose up`        | depends on config                              |

---

## 🧰 Troubleshooting

* **Frontend not loading:**
  Make sure backend is running and correct proxy is set in `client/package.json`.

* **Port already in use:**
  Change the port in `.env` or stop other services.

* **npm install fails:**
  Delete `node_modules` and `package-lock.json`, then run `npm install` again.

---

## 🧑‍💻 Author

**Sai Suman Samantaray**
📍 Khordha, Odisha, India
🔗 [GitHub](https://github.com/Saisuman55)

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

```

---

Would you like me to **include live deployment instructions (Render / Vercel / Netlify)** at the bottom too?  
I can tailor it for your current deployment setup.
```


