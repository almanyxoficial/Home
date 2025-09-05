'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

type Post = { id: string; titulo: string; data?: string; tags?: string[]; corpo: string };

const dt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'America/Sao_Paulo' });
const SRC = '/almanyx.json'; // sua fonte única

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [q, setQ] = useState('');
  const [updated, setUpdated] = useState(false);
  const lastHash = useRef<string>('');

  // gera um hash simples do conteúdo para sabermos se mudou
  const hash = (arr: Post[]) => JSON.stringify(arr.map(p => [p.id, p.data, p.titulo])).slice(0, 512);

  async function loadOnce(showToast = false) {
    const url = `${SRC}?_=${Date.now()}`; // cache-buster
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) return;
    const d = await r.json();
    const list: Post[] = Array.isArray(d?.posts) ? d.posts : [];
    const h = hash(list);
    if (h !== lastHash.current) {
      lastHash.current = h;
      setPosts(list);
      if (showToast) {
        setUpdated(true);
        setTimeout(() => setUpdated(false), 2500);
      }
    }
  }

  useEffect(() => {
    loadOnce(false);           // inicial
    const id = setInterval(() => loadOnce(true), 60_000); // checa a cada 60s
    return () => clearInterval(id);
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
      {/* Toast de atualização */}
      {updated && (
        <div style={{
          position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
          background: '#0f172a', color: '#e5e7eb', border: '1px solid #22c55e',
          padding: '10px 14px', borderRadius: 12, zIndex: 60
        }}>
          Memória atualizada 💾
        </div>
      )}

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