import React, { useState } from 'react';
import API from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('login');
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const url = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' ? { email, password } : { name, email, password };
      const res = await API.post(url, payload);
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      setErr(err.response?.data?.error || 'Error');
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={submit}>
        {mode === 'register' && (
          <div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
          </div>
        )}
        <div>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        </div>
        <div>
          <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
        </div>
      </form>
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          Switch to {mode === 'login' ? 'Register' : 'Login'}
        </button>
      </div>
      {err && <p style={{ color: 'red' }}>{err}</p>}
    </div>
  );
}