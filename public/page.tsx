'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/memoria.json')
      .then(r => r.json())
      .then(d => setPosts(d.posts || []))
      .catch(() => setPosts([]));
  }, []);

  const filtered = posts.filter(p => {
    const texto = (p.titulo + ' ' + (p.tags || []).join(' ') + ' ' + p.corpo)
      .toLowerCase();
    return texto.includes(q.toLowerCase());
  });

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>AlmaNyx — Diário</h1>
      <input
        type="search"
        placeholder="Buscar…"
        value={q}
        onChange={e => setQ(e.target.value)}
        style={{ width: '100%', padding: 10, margin: '12px 0' }}
      />
      {filtered.map(p => (
        <article key={p.id} style={{ border: '1px solid #333', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <h2>{p.titulo}</h2>
          <small>{p.data}</small>
          <div dangerouslySetInnerHTML={{ __html: p.corpo }} />
          <div>
            {(p.tags || []).map(tag => (
              <span key={tag} style={{ marginRight: 8, fontSize: 12, opacity: 0.7 }}>#{tag}</span>
            ))}
          </div>
        </article>
      ))}
    </main>
  );
}