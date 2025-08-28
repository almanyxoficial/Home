'use client';
import { useEffect, useMemo, useState } from 'react';

type Post = {
  id: string;
  titulo: string;
  data: string;
  tags?: string[];
  corpo: string; // HTML
};

const dt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'America/Sao_Paulo' });

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/memoria.json', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setPosts(Array.isArray(d.posts) ? d.posts : []))
      .catch(() => setPosts([]));
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return posts;
    return posts.filter(p => {
      const t = (p.titulo || '').toLowerCase();
      const tags = (p.tags || []).join(',').toLowerCase();
      const body = (p.corpo || '').replace(/<[^>]+>/g, ' ').toLowerCase();
      return t.includes(qq) || tags.includes(qq) || body.includes(qq);
    });
  }, [posts, q]);

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: 20 }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: 12, margin: '10px 0 18px',
        border: '1px solid #1e293b', padding: 14, borderRadius: 16, background: '#0b1325'
      }}>
        <div style={{ fontWeight: 800, letterSpacing: .3 }}>AlmaNyx — Diário vivo</div>
        <input
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar por título, tag ou texto…"
          aria-label="Buscar"
          style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#0b1020', color: '#e5e7eb' }}
        />
      </header>

      <section style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr' }}>
        {filtered.map(p => (
          <article key={p.id} style={{ border: '1px solid #1f2a44', borderRadius: 18, padding: 16, background: '#0f172a' }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 20 }}>{p.titulo}</h2>
            <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>
              {p.data ? dt.format(new Date(p.data)) : ''}
            </div>
            {!!p.tags?.length && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                {p.tags.map(t => (
                  <span key={t} style={{ border: '1px solid #334155', padding: '4px 8px', borderRadius: 999, fontSize: 12 }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: p.corpo }} />
          </article>
        ))}
      </section>

      {!filtered.length && (
        <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: 24 }}>
          Nada encontrado com esse filtro.
        </div>
      )}
    </main>
  );
}
