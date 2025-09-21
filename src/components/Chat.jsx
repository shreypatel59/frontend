import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Chat({ socket, me, onLogout }) {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    API.get('/users').then(r => setContacts(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('private-message', (m) => {
      setMessages(prev => [...prev, m]);
    });
    return () => socket.off('private-message');
  }, [socket]);

  async function send() {
    if (!selected || !text) return;
    socket.emit('private-message', { to: selected._id, text });
    setText('');
  }

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ width: 240 }}>
        <h3>Contacts</h3>
        <button onClick={onLogout}>Logout</button>
        <ul>
          {contacts.map(c => (
            <li key={c._id} onClick={() => setSelected(c)} style={{ cursor: 'pointer' }}>{c.name}</li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1 }}>
        <h3>Chat with {selected?.name || '...'}</h3>
        <div style={{ minHeight: 300, border: '1px solid #ccc', padding: 8 }}>
          {messages.filter(m => (m.from === selected?._id || m.to === selected?._id)).map((m, i) => (
            <div key={i}><strong>{m.from === me?.id ? 'Me' : selected?.name}:</strong> {m.text}</div>
          ))}
        </div>
        <div>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Type..." />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}