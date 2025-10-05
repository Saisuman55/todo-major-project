const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Task = require('../models/Task');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todo_db';
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    const email = 'reviewer@example.com';
    let user = await User.findOne({ email });
    if (!user) {
      const hashed = await bcrypt.hash('Password123', 10);
      user = await User.create({ name: 'Reviewer', email, password: hashed });
      console.log('Created demo user:', email);
    } else {
      console.log('Demo user exists:', email);
    }

    await Task.deleteMany({ user: user._id });
    await Task.insertMany([
      { user: user._id, title: 'Welcome to your To-Do', description: 'Edit or delete this task', priority: 'High' },
      { user: user._id, title: 'Study React', description: 'Finish project UI', priority: 'Medium' },
      { user: user._id, title: 'Deploy app', description: 'Push to GitHub & deploy', priority: 'Low' }
    ]);
    console.log('Seeded tasks');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

seed();
