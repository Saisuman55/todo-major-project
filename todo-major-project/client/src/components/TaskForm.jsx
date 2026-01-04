import React, { useState } from 'react';
import { tasksApi } from '../services/api';

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('Medium');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await tasksApi.create({ title, description: desc, priority });
      setTitle(''); setDesc('');
      onTaskCreated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" required />
      <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option>Low</option><option>Medium</option><option>High</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
}
