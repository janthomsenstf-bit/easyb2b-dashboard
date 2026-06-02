'use client';

import { useState } from 'react';
import {
  getKommunikationStilLabel,
  getKommunikationStilIcon,
} from '@/lib/funfact';
import {
  MOCK_UNTERNEHMEN,
  getNetzwerkLabel,
  getNetzwerkColor,
  getGroesseLabel,
  getLandFlag,
  getEventFormatLabel,
} from '@/lib/mockdata';
import {
  berechneTrustScore,
  getLevelLabel,
  getLevelColor,
  getLevelBackground,
  getVerifizierungsStatusLabel,
  getVerifizierungsStatusColor,
} from '@/lib/trustscore';

export default function UnternehmenPage() {
  const [filterLand, setFilterLand] = useState('alle');
  const [filterNetzwerk, setFilterNetzwerk] = useState('alle');
  const [filterVerifiziert, setFilterVerifiziert] = useState('alle');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = MOCK_UNTERNEHMEN.filter(u => {
    if (filterLand !== 'alle' && u.land !== filterLand) return false;
    if (filterNetzwerk !== 'alle' && u.netzwerkStatus !== filterNetzwerk) return false;
    if (filterVerifiziert !== 'alle' && u.verifizierungsStatus !== filterVerifiziert) return false;
    return true;
  });

  const selectedUnternehmen = selected
    ? MOCK_UNTERNEHMEN.find(u => u.id === selected)
    : null;

  const totalDE = MOCK_UNTERNEHMEN.filter(u => u.land === 'deutschland').length;
  const totalDK = MOCK_UNTERNEHMEN.filter(u => u.land === 'daenemark').length;
  const totalVerifiziert = MOCK_UNTERNEHMEN.filter(u => u.verifizierungsStatus === 'verifiziert').length;
  const totalPartner = MOCK_UNTERNEHMEN.filter(u => u.netzwerkStatus === 'partner').length;

  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      {/* LINKE SPALTE */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ marginTop: 0, marginBottom: '24px', color: '#003366', fontSize: '24px' }}>
          Unternehmen
        </h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '24px' }}>
          {[
            { label: 'Gesamt', value: MOCK_UNTERNEHMEN.length, color: '#003366' },
            { label: '🇩🇪 Deutschland', value: totalDE, color: '#2196F3' },
            { label: '🇩🇰 Dänemark', value: totalDK, color: '#E91E63' },
            { label: '✅ Verifiziert', value: totalVerifiziert, color: '#4CAF50' },
            { label: '🤝 Partner', value: totalPartner, color: '#9C27B0' },
          ].map(s => (
            <div key={s.label} style={{
              backgroundColor: 'white', padding: '12px', borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.07)', borderLeft: `3px solid ${s.color}`,
            }}>
              <div style={{ fontSize: '11px', color: '#666' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'Land', value: filterLand, setter: setFilterLand, options: [
              { value: 'alle', label: 'Alle Länder' },
              { value: 'deutschland', label: '🇩🇪 Deutschland' },
              { value: 'daenemark', label: '🇩🇰 Dänemark' },
            ]},
            { label: 'Netzwerk', value: filterNetzwerk, setter: setFilterNetzwerk, options: [
              { value: 'alle', label: 'Alle Status' },
              { value: 'interessiert', label: 'Interessiert' },
              { value: 'aktiv', label: 'Aktiv' },
              { value: 'partner', label: 'Partner' },
              { value: 'pausiert', label: 'Pausiert' },
            ]},
            { label: 'Verifizierung', value: filterVerifiziert, setter: setFilterVerifiziert, options: [
              { value: 'alle', label: 'Alle' },
              { value: 'verifiziert', label: 'Verifiziert' },
              { value: 'in_pruefung', label: 'In Prüfung' },
              { value: 'eingeschraenkt', label: 'Eingeschränkt' },
              { value: 'ungeprueft', label: 'Ungeprüft' },
            ]},
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '3px' }}>{f.label}</label>
              <select
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', minWidth: '140px' }}
              >
                {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
          <div style={{ alignSelf: 'flex-end', fontSize: '13px', color: '#666' }}>
            {filtered.length} Unternehmen
          </div>
        </div>

        {/* Karten */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(u => {
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
              <div
                key={u.id}
                onClick={() => setSelected(selected === u.id ? null : u.id)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: 'pointer',
                  border: selected === u.id ? '2px solid #003366' : '2px solid transparent',
                  boxShadow: u.negativeHinweise || u.spamRisiko
                    ? '0 2px 6px rgba(244,67,54,0.2)'
                    : '0 2px 6px rgba(0,0,0,0.07)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (selected !== u.id) (e.currentTarget as HTMLDivElement).style.borderColor = '#ccc'; }}
                onMouseLeave={e => { if (selected !== u.id) (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'; }}
              >
                {/* Warnung */}
                {trust.warnung && (
                  <div style={{ backgroundColor: '#fce4ec', borderRadius: '6px', padding: '8px 12px', marginBottom: '12px', fontSize: '12px', color: '#c62828' }}>
                    {trust.warnung}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '16px' }}>{getLandFlag(u.land)}</span>
                      <span style={{ fontWeight: 700, fontSize: '15px', color: '#003366' }}>{u.firmenname}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                      {u.branche} · {u.standort} · {getGroesseLabel(u.groesse)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#444', lineHeight: 1.4 }}>
                      {u.kurzbeschreibung}
                    </div>
                  </div>

                  {/* Rechte Seite: Score + Status */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginLeft: '16px', flexShrink: 0 }}>
                    {/* Score-Kreis */}
                    <TrustScoreCircle score={trust.score} level={trust.level} size={52} />
                    {/* Status-Badges */}
                    <span style={{
                      padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600,
                      color: 'white', backgroundColor: getVerifizierungsStatusColor(u.verifizierungsStatus),
                    }}>
                      {getVerifizierungsStatusLabel(u.verifizierungsStatus)}
                    </span>
                    <span style={{
                      padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600,
                      color: 'white', backgroundColor: getNetzwerkColor(u.netzwerkStatus),
                    }}>
                      {getNetzwerkLabel(u.netzwerkStatus)}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f0f0f0', alignItems: 'center' }}>
                  <TrustFactorDots u={u} />
                  <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#bbb' }}>
                    Aktiv: {u.letzteAktivitaet}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECHTES DETAIL-PANEL */}
      {selectedUnternehmen && (() => {
        const trust = berechneTrustScore({
          persoenlichesGespraech: selectedUnternehmen.persoenlichesGespraech,
          websiteGeprueft: selectedUnternehmen.websiteGeprueft,
          linkedinGeprueft: selectedUnternehmen.linkedinGeprueft,
          empfehlungVorhanden: selectedUnternehmen.empfehlungVorhanden,
          eventTeilnahmen: selectedUnternehmen.events.length,
          erfolgreicheMatches: selectedUnternehmen.successStories,
          negativeHinweise: selectedUnternehmen.negativeHinweise,
          spamRisiko: selectedUnternehmen.spamRisiko,
          verifizierungsStatus: selectedUnternehmen.verifizierungsStatus,
        });

        return (
          <div style={{
            width: '380px', flexShrink: 0, backgroundColor: 'white',
            borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            padding: '24px', alignSelf: 'flex-start', position: 'sticky', top: '20px',
            maxHeight: 'calc(100vh - 80px)', overflowY: 'auto',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{getLandFlag(selectedUnternehmen.land)}</div>
                <h2 style={{ margin: 0, color: '#003366', fontSize: '17px' }}>{selectedUnternehmen.firmenname}</h2>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{selectedUnternehmen.standort}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#999' }}>×</button>
            </div>

            {/* Warnung */}
            {trust.warnung && (
              <div style={{ backgroundColor: '#fce4ec', border: '1px solid #ef9a9a', borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '13px', color: '#c62828' }}>
                {trust.warnung}
              </div>
            )}

            {/* TRUST SCORE BLOCK */}
            <div style={{
              backgroundColor: getLevelBackground(trust.level),
              border: `1px solid ${getLevelColor(trust.level)}40`,
              borderRadius: '10px', padding: '16px', marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <TrustScoreCircle score={trust.score} level={trust.level} size={64} />
                <div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Vertrauens-Score</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: getLevelColor(trust.level) }}>
                    {getLevelLabel(trust.level)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Score: {trust.score}/100</div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div style={{ marginTop: '14px', borderTop: `1px solid ${getLevelColor(trust.level)}30`, paddingTop: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#999', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  Score-Faktoren
                </div>
                {trust.breakdown.map((b, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '4px 0', fontSize: '12px',
                    opacity: b.aktiv ? 1 : 0.4,
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10px' }}>{b.aktiv ? (b.typ === 'negativ' ? '✗' : '✓') : '○'}</span>
                      {b.faktor}
                    </span>
                    <span style={{
                      fontWeight: 600,
                      color: b.aktiv ? (b.typ === 'negativ' ? '#f44336' : '#4CAF50') : '#ccc',
                    }}>
                      {b.punkte > 0 ? '+' : ''}{b.punkte}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verifizierung */}
            <DetailSection title="Verifizierung">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                  color: 'white', backgroundColor: getVerifizierungsStatusColor(selectedUnternehmen.verifizierungsStatus),
                }}>
                  {getVerifizierungsStatusLabel(selectedUnternehmen.verifizierungsStatus)}
                </span>
              </div>
              {selectedUnternehmen.verifiziertAm && <DetailRow label="Geprüft am" value={selectedUnternehmen.verifiziertAm} />}
              {selectedUnternehmen.verifiziertDurch && <DetailRow label="Geprüft von" value={selectedUnternehmen.verifiziertDurch} />}
              {selectedUnternehmen.verifizierungsNotiz && (
                <div style={{ fontSize: '13px', color: '#555', fontStyle: 'italic', backgroundColor: '#fffde7', padding: '10px', borderRadius: '6px', marginTop: '8px' }}>
                  {selectedUnternehmen.verifizierungsNotiz}
                </div>
              )}
            </DetailSection>

            {/* Stammdaten */}
            <DetailSection title="Stammdaten">
              <DetailRow label="Branche" value={selectedUnternehmen.branche} />
              <DetailRow label="Größe" value={getGroesseLabel(selectedUnternehmen.groesse)} />
              <DetailRow label="Sprachen" value={selectedUnternehmen.sprachen.join(', ')} />
              {selectedUnternehmen.website && (
                <DetailRow label="Website" value={
                  <a href={selectedUnternehmen.website} target="_blank" rel="noopener noreferrer" style={{ color: '#003366' }}>
                    {selectedUnternehmen.website}
                  </a>
                } />
              )}
            </DetailSection>

            {/* Kontakt */}
            <DetailSection title="Kontakt">
              <DetailRow label="Person" value={selectedUnternehmen.ansprechpartner} />
              <DetailRow label="Email" value={
                <a href={`mailto:${selectedUnternehmen.email}`} style={{ color: '#003366' }}>{selectedUnternehmen.email}</a>
              } />
              {selectedUnternehmen.telefon && <DetailRow label="Telefon" value={selectedUnternehmen.telefon} />}
            </DetailSection>

            {/* Events */}
            {selectedUnternehmen.events.length > 0 && (
              <DetailSection title="Events">
                {selectedUnternehmen.events.map((e, i) => (
                  <div key={i} style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '6px', marginBottom: '6px', fontSize: '13px' }}>
                    <div style={{ fontWeight: 600 }}>{e.eventName}</div>
                    <div style={{ color: '#666', marginTop: '2px' }}>{getEventFormatLabel(e.format)} · {e.rolle} · {e.eventDatum}</div>
                  </div>
                ))}
              </DetailSection>
            )}

            {/* ── KULTUR & ZUSAMMENARBEIT ─── */}
            {(selectedUnternehmen.kulturprofil || selectedUnternehmen.kommunikationsstil || selectedUnternehmen.funFactStandard) && (
              <DetailSection title="Kultur & Zusammenarbeit">
                {selectedUnternehmen.kommunikationsstil && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '20px', marginBottom: '10px',
                    backgroundColor: '#e8f0fe', color: '#003366',
                    fontSize: '13px', fontWeight: 600,
                  }}>
                    <span>{getKommunikationStilIcon(selectedUnternehmen.kommunikationsstil)}</span>
                    {getKommunikationStilLabel(selectedUnternehmen.kommunikationsstil)}
                  </div>
                )}
                {selectedUnternehmen.kulturprofil && (
                  <div style={{ fontSize: '13px', color: '#444', lineHeight: 1.6, marginBottom: '10px' }}>
                    {selectedUnternehmen.kulturprofil}
                  </div>
                )}
                {selectedUnternehmen.arbeitsweise && (
                  <div style={{ backgroundColor: '#f9f9f9', borderRadius: '6px', padding: '10px', fontSize: '13px', color: '#555', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 600, color: '#666', marginRight: '6px' }}>Arbeitsweise:</span>
                    {selectedUnternehmen.arbeitsweise}
                  </div>
                )}
                {selectedUnternehmen.funFactStandard && (
                  <div style={{ backgroundColor: '#fff8e1', borderRadius: '6px', padding: '10px', fontSize: '13px', color: '#555', border: '1px solid #ffe082' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#f57f17', marginBottom: '4px' }}>FUNFACT</div>
                    "{selectedUnternehmen.funFactStandard}"
                  </div>
                )}
              </DetailSection>
            )}

            {/* Persönliche Notiz des Operators */}
            {selectedUnternehmen.persoenlicheNotiz && (
              <DetailSection title="Persönliche Notiz (Operator)">
                <div style={{ backgroundColor: '#e8f5e9', borderRadius: '6px', padding: '10px', fontSize: '13px', color: '#2e7d32', border: '1px solid #a5d6a7', fontStyle: 'italic' }}>
                  💬 {selectedUnternehmen.persoenlicheNotiz}
                </div>
              </DetailSection>
            )}

            {/* Interne Notiz */}
            {selectedUnternehmen.interneNotiz && (
              <DetailSection title="Interne Notiz">
                <div style={{ fontSize: '13px', color: '#555', fontStyle: 'italic', backgroundColor: '#fffde7', padding: '10px', borderRadius: '6px' }}>
                  {selectedUnternehmen.interneNotiz}
                </div>
              </DetailSection>
            )}

            {/* Aktionen */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedUnternehmen.verifizierungsStatus === 'in_pruefung' && (
                <button style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  ✓ Verifizieren
                </button>
              )}
              <button style={{ padding: '10px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                Gespräch dokumentieren
              </button>
              <button style={{ padding: '10px', backgroundColor: 'transparent', color: '#003366', border: '1px solid #003366', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                Notiz hinzufügen
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── TRUST SCORE KREIS ───────────────────────────────────────

function TrustScoreCircle({ score, level, size }: { score: number; level: string; size: number }) {
  const color = getLevelColor(level as any);
  const bg = getLevelBackground(level as any);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      backgroundColor: bg,
      border: `3px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', flexShrink: 0,
    }}>
      <span style={{ fontSize: size > 55 ? '18px' : '13px', fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
      {size > 55 && <span style={{ fontSize: '9px', color: '#999', marginTop: '1px' }}>/ 100</span>}
    </div>
  );
}

// ─── TRUST FAKTOR DOTS ───────────────────────────────────────

function TrustFactorDots({ u }: { u: any }) {
  const faktoren = [
    { label: 'Gespräch', aktiv: u.persoenlichesGespraech, negativ: false },
    { label: 'Website', aktiv: u.websiteGeprueft, negativ: false },
    { label: 'LinkedIn', aktiv: u.linkedinGeprueft, negativ: false },
    { label: 'Empfehlung', aktiv: u.empfehlungVorhanden, negativ: false },
    { label: 'Negativ', aktiv: u.negativeHinweise, negativ: true },
    { label: 'Spam', aktiv: u.spamRisiko, negativ: true },
  ];
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      {faktoren.map(f => (
        <div key={f.label} title={f.label} style={{
          width: '8px', height: '8px', borderRadius: '50%',
          backgroundColor: f.aktiv
            ? (f.negativ ? '#f44336' : '#4CAF50')
            : '#e0e0e0',
        }} />
      ))}
      <span style={{ fontSize: '10px', color: '#999', marginLeft: '2px' }}>Faktoren</span>
    </div>
  );
}

// ─── HILFSKOMPONENTEN ────────────────────────────────────────

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '5px', fontSize: '13px' }}>
      <span style={{ color: '#999', minWidth: '80px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#333' }}>{value}</span>
    </div>
  );
}
