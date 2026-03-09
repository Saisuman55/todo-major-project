const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error(
    [
      'Missing JWT_SECRET.',
      'Create a file at todo-major-project/server/.env with:',
      'JWT_SECRET=<your-secret>',
      'MONGO_URI=<your-mongodb-uri> (optional; defaults to mongodb://localhost:27017/todo_db)',
      'PORT=5000 (optional)'
    ].join('\n')
  );
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const path = require('path');
// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production' || true) { // Always serve it for convenience
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todo_db';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('MongoDB connected');
    const server = app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process or change PORT in server/.env`);
        process.exit(1);
      }
      console.error('Server listen error:', err);
      process.exit(1);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
