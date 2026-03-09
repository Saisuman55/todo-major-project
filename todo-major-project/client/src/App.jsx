import React, { useEffect, useState } from 'react';
import { auth, tasksApi, setAuthToken } from './services/api';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import AuthForm from './components/AuthForm';
import './styles.css';

function App(){
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(''); // '', 'completed', 'pending'
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      loadTasks(filter);
    } else {
      setAuthToken(null);
      setTasks([]);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadTasks(filter);
  }, [filter]);

  const loadTasks = async (f = '') => {
    try {
      setLoading(true);
      setError('');
      const res = await tasksApi.getAll(f);
      setTasks(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (data) => {
    if (!data || !data.token) return;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setAuthToken(data.token);
    loadTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setTasks([]);
    setFilter('');
    setAuthToken(null);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
  };
  stats.pending = stats.total - stats.completed;

  const progressPct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="container">
      <header>
        <div className="brand">
          <h1>To-Do App</h1>
          {user ? <p className="subtitle">Stay on top of your day, {user.name}.</p> : <p className="subtitle">Sign in and organize your tasks with ease.</p>}
        </div>
        <div>
          {user ? (
            <button className="btn-outline" onClick={handleLogout} aria-label="Logout">Logout</button>
          ) : null}
        </div>
      </header>

      {!token ? (
        <div className="glass-card auth">
          <AuthForm onAuthSuccess={handleLogin} />
        </div>
      ) : (
        <>
          {stats.total > 0 && (
            <div className="progress-container glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
              <div className="progress-text">
                <span>Your Progress</span>
                <span>{progressPct}% ({stats.completed}/{stats.total})</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
              </div>
            </div>
          )}

          <div className="glass-card" style={{ padding: '1rem 1.5rem' }}>
            <TaskForm onTaskCreated={() => loadTasks(filter)} />
          </div>

          <div className="task-toolbar glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
            <input
              className="search-input"
              placeholder="Search tasks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filter-group">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {loading ? <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading tasks…</p> : null}
          {error ? <p className="error" style={{ textAlign: 'center' }}>{error}</p> : null}

          <TaskList
            tasks={tasks}
            refresh={() => loadTasks(filter)}
            search={search}
            stats={stats}
          />
        </>
      )}

      <footer style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Built for Major Project — Premium Glassmorphism UI
      </footer>
    </div>
  );
}

export default App;
