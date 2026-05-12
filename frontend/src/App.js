import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/tasks`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data && data.rows && Array.isArray(data.rows)) {
        setTasks(data.rows);
      } else {
        console.error('Unexpected /tasks response:', data);
        setTasks([]);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
      setTasks([]);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const add = async () => {
    if (!text) return;
    try {
      const res = await fetch(`${API}/tasks`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ title: text }) });
      if (!res.ok) throw new Error(`POST /tasks returned ${res.status}`);
      setText('');
      fetchTasks();
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const toggle = async (t) => {
    try {
      const res = await fetch(`${API}/tasks/${t.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ title: t.title, completed: !t.completed }) });
      if (!res.ok) throw new Error(`PUT /tasks/${t.id} returned ${res.status}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to toggle task', err);
    }
  };

  const remove = async (id) => {
    try {
      const res = await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error(`DELETE /tasks/${id} returned ${res.status}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <div className="title">
          <h1>Todo</h1>
          <p>Focus on what matters — simple, elegant tasks.</p>
        </div>
        <div className="stats">{tasks.length} total • {tasks.filter(t=>!t.completed).length} open</div>
      </div>

      <div className="input">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Add a new task..." />
        <button onClick={add}>Add</button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty">No tasks yet — add something to get started ✨</div>
      ) : (
        <ul>
          {tasks.map(t => (
            <li key={t.id}>
              <div className="task-left">
                <label className="task-checkbox">
                  <input type="checkbox" checked={!!t.completed} onChange={() => toggle(t)} />
                </label>
                <div className={"task-title" + (t.completed ? ' done' : '')}>{t.title}</div>
              </div>
              <div className="actions">
                <button className="btn-delete" onClick={() => remove(t.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
