import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import Chat from './components/Chat';

const SOCKET_URL = process.env.REACT_APP_SOCKET || 'http://localhost:5000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [socket, setSocket] = useState(null);
  const [me, setMe] = useState(null);

  useEffect(() => {
    if (token) {
      const s = io(SOCKET_URL, { auth: { token } });
      s.on('connect_error', (err) => console.error('Socket error', err.message));
      setSocket(s);
    } else {
      if (socket) socket.disconnect();
      setSocket(null);
    }
    return () => socket?.disconnect();
  }, [token]);

  return (
    <div style={{ padding: 20 }}>
      {!token ? (
        <Login onLogin={(tok, user) => { localStorage.setItem('token', tok); setToken(tok); setMe(user); }} />
      ) : (
        <Chat socket={socket} me={me} onLogout={() => { localStorage.removeItem('token'); setToken(null); setMe(null); }} />
      )}
    </div>
  );
}