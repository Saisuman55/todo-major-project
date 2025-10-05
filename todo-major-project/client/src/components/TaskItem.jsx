import React, { useState } from 'react';
import { tasksApi } from '../services/api';

export default function TaskItem({ task, refresh }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'Medium',
    completed: !!task.completed,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleComplete = async () => {
    try {
      setLoading(true);
      await tasksApi.update(task._id, { completed: !form.completed });
      await refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not toggle');
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      setLoading(true);
      await tasksApi.remove(task._id);
      await refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await tasksApi.update(task._id, form);
      setEditing(false);
      await refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className={`task-item ${form.completed ? 'completed' : ''}`}>
      {!editing ? (
        <div className="task-view">
          <div className="left">
            <input
              type="checkbox"
              checked={form.completed}
              onChange={toggleComplete}
              disabled={loading}
              aria-label={`Mark ${task.title} completed`}
            />
            <div className="meta">
              <strong className="title">{task.title}</strong>
              {task.description ? <p className="desc">{task.description}</p> : null}
              <div className="small">
                <span>Priority: {task.priority || 'Medium'}</span>
                {task.dueDate ? (
                  <span> • Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="actions">
            <button onClick={() => setEditing(true)} disabled={loading}>Edit</button>
            <button onClick={remove} disabled={loading}>Delete</button>
          </div>
        </div>
      ) : (
        <form className="edit-form" onSubmit={save}>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows="2"
          />
          <div className="row">
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <label className="small-checkbox">
              <input
                type="checkbox"
                checked={form.completed}
                onChange={(e) => setForm({ ...form, completed: e.target.checked })}
              />
              Completed
            </label>
          </div>

          <div className="row actions">
            <button type="submit" disabled={loading}>Save</button>
            <button type="button" onClick={() => { setEditing(false); setForm({ title: task.title, description: task.description || '', priority: task.priority || 'Medium', completed: !!task.completed }); }}>Cancel</button>
          </div>
          {error ? <p className="error">{error}</p> : null}
        </form>
      )}
    </li>
  );
}
