import React, { useState } from 'react';
import { tasksApi } from '../services/api';

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await tasksApi.create({ title, description: desc, priority });
      setTitle(''); setDesc('');
      onTaskCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title"
        required
        aria-label="Task title"
        disabled={loading}
      />
      <input
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="Description"
        aria-label="Task description"
        disabled={loading}
      />
      <select
        value={priority}
        onChange={e => setPriority(e.target.value)}
        aria-label="Task priority"
        disabled={loading}
      >
        <option>Low</option><option>Medium</option><option>High</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
