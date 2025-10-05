import React, { useState } from 'react';
import { auth } from '../services/api';

export default function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErr('');
      const res = mode === 'login' ? await auth.login(form) : await auth.register(form);
      onAuthSuccess(res.data);
    } catch (error) {
      setErr(error.response?.data?.message || 'Auth error');
    }
  };

  return (
    <div className="auth">
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        )}
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
      <p className="error">{err}</p>
      <p>
        {mode === 'login' ? 'No account?' : 'Have an account?'} <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Register' : 'Login'}</button>
      </p>
    </div>
  );
}
