'use client';

import { useState } from 'react';
import { MOCK_INTERESSENTEN, MOCK_UNTERNEHMEN, getStatusLabel, getStatusColor } from '@/lib/mockdata';
import { berechneTrustScore, getLevelColor, getLevelLabel, getLevelBackground } from '@/lib/trustscore';

export default function InteressentenPage() {
  const [filterStatus, setFilterStatus] = useState('alle');
  const [interessenten, setInteressenten] = useState(MOCK_INTERESSENTEN);
  const [toast, setToast] = useState<string | null>(null);

  const zeigeToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const aendereStatus = (id: string, neuerStatus: string, meldung: string) => {
    setInteressenten(prev => prev.map(i => i.id === id ? { ...i, status: neuerStatus } : i));
    zeigeToast(meldung);
  };

  const filtered = interessenten.filter(i => {
    if (filterStatus !== 'alle' && i.status !== filterStatus) return false;
    return true;
  });

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          backgroundColor: '#003366', color: 'white', padding: '14px 20px',
          borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '14px', fontWeight: 600,
        }}>
          {toast}
        </div>
      )}

      <h1 style={{ marginTop: 0, marginBottom: '24px', color: '#003366', fontSize: '24px' }}>
        Interessenten Verwaltung
      </h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '4px' }}>Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', minWidth: '180px' }}
          >
            <option value="alle">Alle Status</option>
            <option value="neu">Neu</option>
            <option value="freigegeben">Freigegeben</option>
            <option value="kontakt_laeuft">Kontakt läuft</option>
            <option value="erfolgreich">Erfolgreich</option>
            <option value="abgelehnt">Abgelehnt</option>
            <option value="spam">Spam</option>
          </select>
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>{filtered.length} Interessent(en)</span>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
        {filtered.map((i) => (
          <div
            key={i.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              padding: '20px',
              borderLeft: `4px solid ${getStatusColor(i.status)}`,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#003366' }}>{i.firmenname}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
                  {i.ansprechpartner}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {i.matchScore && (
                  <span style={{
                    padding: '4px 8px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
                    backgroundColor: i.matchScore >= 80 ? '#e8f5e9' : '#fff3e0',
                    color: i.matchScore >= 80 ? '#2e7d32' : '#e65100',
                  }}>
                    {i.matchScore}%
                  </span>
                )}
                <span style={{
                  padding: '4px 10px', borderRadius: '12px', fontSize: '11px',
                  fontWeight: 600, color: 'white', backgroundColor: getStatusColor(i.status),
                }}>
                  {getStatusLabel(i.status)}
                </span>
              </div>
            </div>

            {/* Anfrage-Bezug + Trust-Badge */}
            <div style={{ backgroundColor: '#f9f9f9', borderRadius: '6px', padding: '10px', marginBottom: '12px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#999' }}>Interesse an:</span>{' '}
                <strong>{i.anfrageFirma}</strong>
              </div>
              {/* Trust-Score falls Unternehmen bekannt */}
              {(() => {
                const u = MOCK_UNTERNEHMEN.find(u => u.email === i.email);
                if (!u) return null;
                const trust = berechneTrustScore({
                  persoenlichesGespraech: u.persoenlichesGespraech,
                  websiteGeprueft: u.websiteGeprueft,
                  linkedinGeprueft: u.linkedinGeprueft,
                  empfehlungVorhanden: u.empfehlungVorhanden,
                  eventTeilnahmen: u.events.length,
                  erfolgreicheMatches: u.successStories,
                  negativeHinweise: u.negativeHinweise,
                  spamRisiko: u.spamRisiko,
                  verifizierungsStatus: u.verifizierungsStatus,
                });
                return (
                  <div style={{
                    padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                    backgroundColor: getLevelBackground(trust.level),
                    color: getLevelColor(trust.level),
                    border: `1px solid ${getLevelColor(trust.level)}40`,
                  }}>
                    Trust {trust.score} · {getLevelLabel(trust.level)}
                  </div>
                );
              })()}
            </div>

            {/* Kontakt-Info */}
            <div style={{ fontSize: '13px', color: '#333', marginBottom: '12px' }}>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ color: '#999', marginRight: '8px' }}>Email:</span>
                <a href={`mailto:${i.email}`} style={{ color: '#003366' }}>{i.email}</a>
              </div>
              {i.telefon && (
                <div>
                  <span style={{ color: '#999', marginRight: '8px' }}>Tel:</span>
                  {i.telefon}
                </div>
              )}
            </div>

            {/* Notiz */}
            {i.notiz && (
              <div style={{ fontSize: '13px', color: '#666', fontStyle: 'italic', padding: '8px', backgroundColor: '#fffde7', borderRadius: '4px', marginBottom: '12px' }}>
                {i.notiz}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {i.status === 'neu' && (
                <>
                  <button onClick={() => aendereStatus(i.id, 'freigegeben', `${i.firmenname} freigegeben ✓`)} style={{ padding: '6px 14px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                    Freigeben
                  </button>
                  <button onClick={() => aendereStatus(i.id, 'abgelehnt', `${i.firmenname} abgelehnt`)} style={{ padding: '6px 14px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                    Ablehnen
                  </button>
                </>
              )}
              {i.status === 'freigegeben' && (
                <button onClick={() => aendereStatus(i.id, 'kontakt_laeuft', `Kontakt zu ${i.firmenname} hergestellt`)} style={{ padding: '6px 14px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  Kontakt herstellen
                </button>
              )}
              {i.status === 'kontakt_laeuft' && (
                <>
                  <button onClick={() => aendereStatus(i.id, 'erfolgreich', `${i.firmenname}: Kooperation erfolgreich!`)} style={{ padding: '6px 14px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                    Feedback: Erfolg
                  </button>
                  <button onClick={() => aendereStatus(i.id, 'neu', `Feedback eingeholt von ${i.firmenname}`)} style={{ padding: '6px 14px', backgroundColor: '#FF9900', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                    Feedback einholen
                  </button>
                </>
              )}
              {i.status === 'abgelehnt' && (
                <span style={{ fontSize: '13px', color: '#f44336', fontWeight: 600 }}>Abgelehnt</span>
              )}
              {i.status === 'erfolgreich' && (
                <span style={{ fontSize: '13px', color: '#4CAF50', fontWeight: 600 }}>Kooperation erfolgreich gestartet</span>
              )}
              {i.status === 'spam' && (
                <span style={{ fontSize: '13px', color: '#f44336', fontWeight: 600 }}>Als Spam markiert</span>
              )}
            </div>

            <div style={{ fontSize: '11px', color: '#999', marginTop: '12px' }}>
              Eingegangen: {i.createdAt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
