import React, { useState, useEffect } from 'react';
import { tasksApi } from '../services/api';
import DatePicker from 'react-datepicker';

export default function TaskItem({ task, refresh }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'Medium',
    completed: !!task.completed,
    dueDate: task.dueDate ? new Date(task.dueDate) : null
  });
  
  useEffect(() => {
    setForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'Medium',
      completed: !!task.completed,
      dueDate: task.dueDate ? new Date(task.dueDate) : null
    });
  }, [task]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleComplete = async () => {
    try {
      setLoading(true);
      await tasksApi.update(task._id, { completed: !task.completed });
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
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      {!editing ? (
        <>
          <div className="task-checkbox-wrapper">
            <input
              type="checkbox"
              checked={!!task.completed}
              onChange={toggleComplete}
              disabled={loading}
              title="Mark complete"
            />
          </div>
          
          <div className="task-content">
            <div className="task-header">
              <h3 className="title">{task.title}</h3>
              <div className="task-actions">
                <button className="btn-icon" onClick={() => setEditing(true)} aria-label="Edit" title="Edit">✎</button>
                <button className="btn-icon" onClick={remove} aria-label="Delete" title="Delete">✕</button>
              </div>
            </div>
            
            {task.description && <p className="desc">{task.description}</p>}
            
            <div className="task-badges">
              <span className={`badge badge-${task.priority || 'Medium'}`}>
                {task.priority || 'Medium'}
              </span>
              
              {task.dueDate && (
                <span className="badge-date">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <form className="edit-form" onSubmit={save} style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="2"
              placeholder="Task details..."
            />
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
               <DatePicker
                 selected={form.dueDate}
                 onChange={(date) => setForm({ ...form, dueDate: date })}
                 dateFormat="dd/MM/yyyy"
                 placeholderText="dd/mm/yyyy"
                 isClearable
                 showYearDropdown
                 showMonthDropdown
                 dropdownMode="select"
                 portalId="root"
                 customInput={<input style={{ flex: 1, width: '100%' }} />}
               />
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                style={{ flex: 1 }}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button type="submit" className="btn-primary" disabled={loading}>Save</button>
            <button type="button" className="btn-outline" onClick={() => { 
                setEditing(false); 
                setForm({ 
                  title: task.title, 
                  description: task.description || '', 
                  priority: task.priority || 'Medium', 
                  completed: !!task.completed,
                  dueDate: task.dueDate ? new Date(task.dueDate) : null
                }); 
              }}>Cancel</button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </li>
  );
}
