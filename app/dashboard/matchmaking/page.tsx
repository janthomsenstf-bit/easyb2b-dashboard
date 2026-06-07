'use client';

import { useState } from 'react';
import { MOCK_MATCHES, MOCK_ANFRAGEN, getStatusColor } from '@/lib/mockdata';

export default function MatchmakingPage() {
  const anfrageOhneInteressenten = MOCK_ANFRAGEN.filter(a => a.interessentenCount === 0 && a.status !== 'pausiert');
  const [matches, setMatches] = useState(MOCK_MATCHES.map((m, i) => ({ ...m, _id: `match-${i}`, _status: 'offen' as string })));
  const [toast, setToast] = useState<string | null>(null);

  const zeigeToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const setzeMatchStatus = (id: string, status: string, msg: string) => {
    setMatches(prev => prev.map(m => m._id === id ? { ...m, _status: status } : m));
    zeigeToast(msg);
  };

  const offeneMatches = matches.filter(m => m._status === 'offen');

  return (
    <div>
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          backgroundColor: '#003366', color: 'white', padding: '14px 20px',
          borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '14px', fontWeight: 600,
        }}>{toast}</div>
      )}

      <h1 style={{ marginTop: 0, marginBottom: '24px', color: '#003366', fontSize: '24px' }}>
        Matchmaking
      </h1>

      {/* Anfragen ohne Interessenten */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '32px' }}>
        <h2 style={{ marginTop: 0, color: '#003366', fontSize: '18px', marginBottom: '16px' }}>
          Anfragen ohne Interessenten ({anfrageOhneInteressenten.length})
        </h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          Diese Anfragen brauchen aktive Vermittlung:
        </p>
        {anfrageOhneInteressenten.map((a) => (
          <div key={a.id} style={{
            padding: '16px', borderBottom: '1px solid #f0f0f0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px', color: '#003366' }}>
                {a.richtung === 'de_dk' ? 'DE > DK' : 'DK > DE'} {a.firmenname}
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                {a.branche} · {a.ziel}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                {a.standort} · Seit: {a.createdAt}
              </div>
            </div>
            <span style={{
              padding: '4px 10px', borderRadius: '12px', fontSize: '11px',
              fontWeight: 600, color: 'white', backgroundColor: getStatusColor(a.status),
            }}>
              {a.status}
            </span>
          </div>
        ))}
      </div>

      {/* Match-Vorschläge */}
      <h2 style={{ color: '#003366', fontSize: '18px', marginBottom: '16px' }}>
        Match-Vorschläge ({offeneMatches.length})
      </h2>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
        Basierend auf Branche, Sprache und Kooperationsart:
      </p>

      {offeneMatches.length === 0 && (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '40px', textAlign: 'center', color: '#4CAF50', fontWeight: 600 }}>
          ✓ Alle Match-Vorschläge bearbeitet
        </div>
      )}

      <div style={{ display: 'grid', gap: '16px' }}>
        {offeneMatches.map((m) => (
          <div
            key={m._id}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr auto',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {/* Suchende Firma */}
            <div>
              <div style={{ fontSize: '11px', color: '#666', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Sucht</div>
              <div style={{ fontWeight: 600, fontSize: '15px', color: '#003366' }}>{m.anfrageFirma}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{m.anfrageBranche}</div>
            </div>

            {/* Score */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                backgroundColor: m.score >= 85 ? '#e8f5e9' : m.score >= 70 ? '#fff3e0' : '#fce4ec',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '18px',
                color: m.score >= 85 ? '#2e7d32' : m.score >= 70 ? '#e65100' : '#c62828',
              }}>
                {m.score}%
              </div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>Match</div>
            </div>

            {/* Vorgeschlagene Firma */}
            <div>
              <div style={{ fontSize: '11px', color: '#666', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Vorschlag</div>
              <div style={{ fontWeight: 600, fontSize: '15px', color: '#003366' }}>{m.interessentFirma}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{m.grund}</div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setzeMatchStatus(m._id, 'gestartet', `Match gestartet: ${m.anfrageFirma} ↔ ${m.interessentFirma}`)}
                style={{
                  padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white',
                  border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}>
                Match starten
              </button>
              <button
                onClick={() => setzeMatchStatus(m._id, 'abgelehnt', `Match abgelehnt: ${m.interessentFirma}`)}
                style={{
                  padding: '8px 16px', backgroundColor: 'transparent', color: '#666',
                  border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
                  whiteSpace: 'nowrap',
                }}>
                Ablehnen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
