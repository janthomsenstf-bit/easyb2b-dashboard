'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, globaleSuche } from '@/lib/store';

export default function GlobaleSuche() {
  const store = useStore();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [offen, setOffen] = useState(false);

  const ergebnisse = globaleSuche(query, store);

  // Gruppieren nach Modul
  const gruppen = ergebnisse.reduce((acc, e) => {
    (acc[e.modul] = acc[e.modul] || []).push(e);
    return acc;
  }, {} as Record<string, typeof ergebnisse>);

  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: '560px' }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: '#666' }}>🔍</span>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOffen(true); }}
          onFocus={() => setOffen(true)}
          onBlur={() => setTimeout(() => setOffen(false), 200)}
          placeholder="Global suchen: Firma, Person, Anfrage, E-Mail, Telefon..."
          style={{
            width: '100%', padding: '10px 14px 10px 40px', borderRadius: '8px',
            border: '1px solid #d0d7de', fontSize: '14px', boxSizing: 'border-box',
            backgroundColor: '#f6f8fa', outline: 'none',
          }}
        />
        {query && (
          <button onClick={() => { setQuery(''); setOffen(false); }}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '16px' }}>×</button>
        )}
      </div>

      {/* Ergebnis-Dropdown */}
      {offen && query.trim().length >= 2 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 2000,
          backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
          maxHeight: '70vh', overflowY: 'auto', border: '1px solid #e0e0e0',
        }}>
          {ergebnisse.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
              Keine Treffer für „{query}"
            </div>
          ) : (
            <>
              <div style={{ padding: '10px 16px', fontSize: '12px', color: '#666', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                {ergebnisse.length} Treffer in {Object.keys(gruppen).length} Bereichen
              </div>
              {Object.entries(gruppen).map(([modul, items]) => (
                <div key={modul}>
                  <div style={{ padding: '8px 16px 4px 16px', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {items[0].modulIcon} {modul} ({items.length})
                  </div>
                  {items.map((e, i) => (
                    <div
                      key={`${modul}-${i}`}
                      onMouseDown={() => { router.push(e.href); setOffen(false); setQuery(''); }}
                      style={{
                        padding: '10px 16px', cursor: 'pointer', display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                      }}
                      onMouseEnter={ev => (ev.currentTarget as HTMLDivElement).style.backgroundColor = '#f0f4ff'}
                      onMouseLeave={ev => (ev.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#003366', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {e.badge && <span style={{ marginRight: '6px' }}>{e.badge}</span>}{e.titel}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.untertitel}</div>
                      </div>
                      <span style={{ fontSize: '11px', color: '#888', flexShrink: 0 }}>→</span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
