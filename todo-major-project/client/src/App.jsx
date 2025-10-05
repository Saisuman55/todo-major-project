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

  return (
    <div className="container">
      <header>
        <h1>To-Do App</h1>
        <div>
          {user ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: '#374151' }}>Hi, {user.name}</span>
              <button onClick={handleLogout} aria-label="Logout">Logout</button>
            </div>
          ) : null}
        </div>
      </header>

      {!token ? (
        <AuthForm onAuthSuccess={handleLogin} />
      ) : (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
            <TaskForm onTaskCreated={() => loadTasks(filter)} />
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ color: '#6b7280' }}>Filter:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="">All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {loading ? <p>Loading tasks…</p> : null}
          {error ? <p style={{ color: '#e11d48' }}>{error}</p> : null}

          <TaskList tasks={tasks} refresh={() => loadTasks(filter)} />
        </>
      )}

      <footer style={{ marginTop: 20, color: '#9ca3af', fontSize: 13 }}>
        Built for Major Project — follow the repo README for server setup & deployment.
      </footer>
    </div>
  );
}

export default App;
