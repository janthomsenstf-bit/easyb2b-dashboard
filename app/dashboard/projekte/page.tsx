'use client';

import { useState } from 'react';
import { MOCK_INTERESSENTEN, MOCK_MATCHES, getStatusLabel, getStatusColor, getRichtungLabel, getLandFlag, type MockAnfrage } from '@/lib/mockdata';
import { useStore } from '@/lib/store';
import { berechneProjekt, getGesundheitColor, getGesundheitEmoji, getZuordnungLabel, getZuordnungColor, type Gesundheit } from '@/lib/projekte';

export default function ProjektePage() {
  const store = useStore();
  const [filterGesundheit, setFilterGesundheit] = useState<'alle' | Gesundheit>('alle');
  const [detailId, setDetailId] = useState<string | null>(null);

  // Interessenten eines Projekts über die Zuordnungs-Zwischentabelle auflösen
  const interessentenFuer = (projektId: string) => {
    const ids = store.zuordnungen.filter(z => z.projektId === projektId).map(z => z.interessentId);
    return MOCK_INTERESSENTEN.filter(i => ids.includes(i.id));
  };

  // Jede Anfrage = ein Projekt
  const projekte = store.anfragen.map(a => ({ anfrage: a, status: berechneProjekt(a, interessentenFuer(a.id)) }));
  const gefiltert = projekte.filter(p => filterGesundheit === 'alle' || p.status.gesundheit === filterGesundheit);

  const detail = detailId ? projekte.find(p => p.anfrage.id === detailId) : null;

  // Übersichts-Zahlen
  const gruen = projekte.filter(p => p.status.gesundheit === 'gruen').length;
  const gelb = projekte.filter(p => p.status.gesundheit === 'gelb').length;
  const rot = projekte.filter(p => p.status.gesundheit === 'rot').length;
  const erfolge = projekte.filter(p => p.status.kpi.erfolge > 0).length;

  return (
    <div>
      {detail && (
        <ProjektDetail
          anfrage={detail.anfrage}
          status={detail.status}
          onClose={() => setDetailId(null)}
        />
      )}

      <div style={{ marginBottom: '8px' }}>
        <h1 style={{ margin: 0, color: '#003366', fontSize: '24px' }}>Vermittlungsprojekte</h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
          Jede Anfrage als Projekt — Anfrage, Interessenten, Matches und Verlauf an einem Ort.
        </p>
      </div>

      {/* Übersicht */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', margin: '24px 0' }}>
        {[
          { label: 'Projekte gesamt', value: projekte.length, color: '#003366', filter: 'alle' as const },
          { label: '🟢 Hohe Aktivität', value: gruen, color: '#4CAF50', filter: 'gruen' as const },
          { label: '🟡 Wenig Interesse', value: gelb, color: '#FF9900', filter: 'gelb' as const },
          { label: '🔴 Aufmerksamkeit nötig', value: rot, color: '#f44336', filter: 'rot' as const },
          { label: '⭐ Mit Erfolg', value: erfolge, color: '#9C27B0', filter: 'alle' as const },
        ].map(s => (
          <div key={s.label} onClick={() => setFilterGesundheit(s.filter)} style={{
            backgroundColor: 'white', padding: '16px', borderRadius: '8px', cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.07)', borderLeft: `4px solid ${s.color}`,
            outline: filterGesundheit === s.filter && s.filter !== 'alle' ? `2px solid ${s.color}` : 'none',
          }}>
            <div style={{ fontSize: '12px', color: '#666' }}>{s.label}</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: s.color, marginTop: '4px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {filterGesundheit !== 'alle' && (
        <button onClick={() => setFilterGesundheit('alle')} style={{ marginBottom: '16px', padding: '6px 14px', backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#666' }}>
          ✕ Filter zurücksetzen ({gefiltert.length} angezeigt)
        </button>
      )}

      {/* Projekt-Karten */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {gefiltert.map(({ anfrage: a, status: s }) => (
          <div key={a.id} onClick={() => setDetailId(a.id)} style={{
            backgroundColor: 'white', borderRadius: '10px', padding: '18px 20px', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: `5px solid ${getGesundheitColor(s.gesundheit)}`,
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 14px rgba(0,0,0,0.12)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              {/* Links */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span title={s.gesundheitLabel} style={{ fontSize: '14px' }}>{getGesundheitEmoji(s.gesundheit)}</span>
                  <span style={{ fontWeight: 700, fontSize: '16px', color: '#003366' }}>{a.ziel}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                  {getRichtungLabel(a.richtung)} {a.firmenname} · {a.branche} · {a.anzeigenId}
                </div>
                {/* KPI-Reihe */}
                <div style={{ display: 'flex', gap: '18px', fontSize: '12px', flexWrap: 'wrap' }}>
                  <Kpi label="Interessenten" value={s.kpi.interessenten} color="#2196F3" />
                  <Kpi label="Freigegeben" value={s.kpi.freigegeben} color="#4CAF50" />
                  <Kpi label="Kontakte" value={s.kpi.kontakte} color="#9C27B0" />
                  <Kpi label="Erfolge" value={s.kpi.erfolge} color="#2e7d32" />
                </div>
              </div>

              {/* Rechts */}
              <div style={{ flexShrink: 0, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, color: 'white', backgroundColor: s.veroeffentlichungColor }}>
                  {s.veroeffentlichung}
                </span>
                <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, color: 'white', backgroundColor: getStatusColor(a.status) }}>
                  {getStatusLabel(a.status)}
                </span>
                <span style={{ fontSize: '11px', color: getGesundheitColor(s.gesundheit), fontWeight: 600 }}>
                  {s.gesundheitLabel}
                </span>
              </div>
            </div>

            {/* Hinweis */}
            {s.hinweis && (
              <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: '#fff8e1', borderRadius: '6px', fontSize: '12px', color: '#8a6d00', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span>💡</span><span>{s.hinweis}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DETAIL ───────────────────────────────────────────────────

function ProjektDetail({ anfrage: a, status: s, onClose }: {
  anfrage: MockAnfrage;
  status: ReturnType<typeof berechneProjekt>;
  onClose: () => void;
}) {
  const store = useStore();
  // Zuordnungen dieses Projekts (automatisch + manuell), aufgelöst auf Interessenten
  const zuordnungen = store.zuordnungen
    .filter(z => z.projektId === a.id)
    .map(z => ({ z, i: MOCK_INTERESSENTEN.find(x => x.id === z.interessentId) }))
    .filter(x => x.i) as { z: typeof store.zuordnungen[number]; i: typeof MOCK_INTERESSENTEN[number] }[];
  const interessenten = zuordnungen.map(x => x.i);
  const matchVorschlaege = MOCK_MATCHES.filter(m => m.anfrageId === a.id);
  const aktiveMatches = interessenten.filter(i => ['kontakt_laeuft', 'erfolgreich', 'feedback_ausstehend'].includes(i.status));

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 3000, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '30px 20px', overflowY: 'auto' }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '820px', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, backgroundColor: 'white', borderRadius: '12px 12px 0 0', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>{getGesundheitEmoji(s.gesundheit)}</span>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#003366' }}>{a.ziel}</h2>
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                {getRichtungLabel(a.richtung)} {a.firmenname} · {a.anzeigenId}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#999' }}>×</button>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            <Tag color={s.veroeffentlichungColor}>{s.veroeffentlichung}</Tag>
            <Tag color={getStatusColor(a.status)}>{getStatusLabel(a.status)}</Tag>
            <Tag color={getGesundheitColor(s.gesundheit)}>{s.gesundheitLabel}</Tag>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Erfolgskontrolle */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Interessenten', v: s.kpi.interessenten, c: '#2196F3' },
              { label: 'Freigegeben', v: s.kpi.freigegeben, c: '#4CAF50' },
              { label: 'Kontakte', v: s.kpi.kontakte, c: '#9C27B0' },
              { label: 'Erfolge', v: s.kpi.erfolge, c: '#2e7d32' },
              { label: 'Quote', v: `${s.erfolgsquote}%`, c: '#FF9900' },
            ].map(k => (
              <div key={k.label} style={{ backgroundColor: k.c + '12', borderRadius: '8px', padding: '12px', textAlign: 'center', border: `1px solid ${k.c}30` }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: k.c }}>{k.v}</div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Hinweis / Optimierung */}
          {s.hinweis && (
            <div style={{ marginBottom: '20px', padding: '12px 14px', backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px', fontSize: '13px', color: '#8a6d00', display: 'flex', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>💡</span>
              <div><strong>Optimierungsvorschlag:</strong> {s.hinweis}</div>
            </div>
          )}

          {/* 1. Anfrage */}
          <Section titel="1 · Anfrage">
            <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.6, margin: '0 0 10px 0' }}>{a.beschreibung}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
              <div><span style={{ color: '#999' }}>Region:</span> {getLandFlag(a.standort.includes('Dänemark') ? 'daenemark' : 'deutschland')} {a.standort}</div>
              <div><span style={{ color: '#999' }}>Branche:</span> {a.branche}</div>
              <div><span style={{ color: '#999' }}>Art:</span> {a.art}</div>
              <div><span style={{ color: '#999' }}>Sichtbarkeit:</span> {a.sichtbarkeit}</div>
            </div>
            <a href="/dashboard/anfragen" style={{ fontSize: '12px', color: '#003366', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginTop: '8px' }}>→ Anfrage bearbeiten</a>
          </Section>

          {/* 2. Interessenten (über Zuordnungen) */}
          <Section titel={`2 · Interessenten (${zuordnungen.length})`}>
            {zuordnungen.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>Noch keine Interessenten. {matchVorschlaege.length > 0 && 'Aber es gibt Match-Vorschläge (siehe unten).'}</p>
            ) : (
              zuordnungen.map(({ z, i }) => (
                <div key={z.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
                  <div style={{ flex: 1 }}>
                    <div>
                      <span style={{ fontWeight: 600, color: '#003366' }}>{i.firmenname}</span>
                      <span style={{ color: '#999' }}> · {i.ansprechpartner}</span>
                      <span style={{ marginLeft: '8px', padding: '1px 7px', borderRadius: '8px', fontSize: '9px', fontWeight: 700, backgroundColor: z.zuordnungsart === 'manuell' ? '#FF990020' : '#99999920', color: z.zuordnungsart === 'manuell' ? '#e65100' : '#777' }}>
                        {z.zuordnungsart === 'manuell' ? '✋ manuell' : '⚙ auto'}
                      </span>
                    </div>
                    {z.zuordnungsart === 'manuell' && z.grund && (
                      <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic', marginTop: '2px' }}>„{z.grund}" · {z.erstelltVon}, {z.erstelltAm}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {i.matchScore && <span style={{ fontSize: '12px', fontWeight: 700, color: i.matchScore >= 80 ? '#4CAF50' : '#FF9900' }}>{i.matchScore}%</span>}
                    <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, color: 'white', backgroundColor: getZuordnungColor(z.status) }}>{getZuordnungLabel(z.status)}</span>
                  </div>
                </div>
              ))
            )}
            <a href="/dashboard/interessenten" style={{ fontSize: '12px', color: '#003366', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginTop: '8px' }}>→ Interessenten verwalten</a>
          </Section>

          {/* 3. Matches */}
          <Section titel={`3 · Matches (${aktiveMatches.length} aktiv, ${matchVorschlaege.length} Vorschläge)`}>
            {aktiveMatches.length === 0 && matchVorschlaege.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>Noch keine Matches.</p>
            ) : (
              <>
                {aktiveMatches.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#e8f5e9', borderRadius: '6px', marginBottom: '6px', fontSize: '13px' }}>
                    <span>🤝 {a.firmenname} ↔ {m.firmenname}</span>
                    <span style={{ fontWeight: 600, color: '#2e7d32' }}>{getStatusLabel(m.status)}</span>
                  </div>
                ))}
                {matchVorschlaege.map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f0f4ff', borderRadius: '6px', marginBottom: '6px', fontSize: '13px' }}>
                    <span>💡 Vorschlag: {m.interessentFirma}</span>
                    <span style={{ fontWeight: 600, color: '#003366' }}>{m.score}%</span>
                  </div>
                ))}
              </>
            )}
            <a href="/dashboard/matchmaking" style={{ fontSize: '12px', color: '#003366', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginTop: '8px' }}>→ Matchmaking</a>
          </Section>

          {/* 4. Verlauf / Aktivität */}
          <Section titel="4 · Verlauf & nächste Aufgabe">
            <div style={{ fontSize: '13px', color: '#444' }}>
              <div style={{ marginBottom: '6px' }}>📅 Erstellt: {a.createdAt}</div>
              <div style={{ marginBottom: '6px' }}>📊 Letzte Aktivität: {interessenten[0]?.createdAt || a.createdAt}</div>
              <div style={{ padding: '8px 12px', backgroundColor: '#f0f4ff', borderRadius: '6px', marginTop: '8px' }}>
                <strong>Nächste Aufgabe:</strong> {naechsteAufgabe(s, interessenten.length)}
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function naechsteAufgabe(s: ReturnType<typeof berechneProjekt>, anzInteressenten: number): string {
  if (s.veroeffentlichung === 'Nicht veröffentlicht') return 'Anfrage prüfen und im Marktplatz veröffentlichen.';
  if (anzInteressenten === 0) return 'Aktives Matchmaking starten oder Gesuch überarbeiten.';
  if (s.kpi.freigegeben === 0) return 'Neue Interessenten prüfen und freigeben.';
  if (s.kpi.kontakte === 0) return 'Kontakt zwischen Suchendem und freigegebenem Interessenten herstellen.';
  if (s.kpi.erfolge === 0) return 'Feedback zum laufenden Kontakt einholen.';
  return 'Projekt läuft erfolgreich — Success Story dokumentieren.';
}

// ─── HILFSKOMPONENTEN ─────────────────────────────────────────

function Kpi({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ fontWeight: 700, color, fontSize: '14px' }}>{value}</span>
      <span style={{ color: '#888' }}>{label}</span>
    </span>
  );
}

function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, color: 'white', backgroundColor: color }}>{children}</span>;
}

function Section({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, color: '#003366', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{titel}</h3>
      {children}
    </div>
  );
}
