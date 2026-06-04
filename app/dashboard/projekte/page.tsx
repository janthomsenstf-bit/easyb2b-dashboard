'use client';

import { useState } from 'react';
import {
  MOCK_INTERESSENTEN, MOCK_MATCHES, getStatusLabel, getStatusColor,
  getRichtungLabel, getLandFlag,
  getKontaktZuordnungLabel, getKontaktZuordnungColor, findeFormular,
  type MockAnfrage, type MarktplatzStatus, type MarktplatzEintrag,
} from '@/lib/mockdata';
import { useStore, type ProjektInteressent } from '@/lib/store';
import {
  berechneProjekt, getGesundheitColor, getGesundheitEmoji,
  getZuordnungLabel, getZuordnungColor, type Gesundheit,
} from '@/lib/projekte';

// ─── HAUPTSEITE ───────────────────────────────────────────────

export default function ProjektePage() {
  const store = useStore();
  const [filterGesundheit, setFilterGesundheit] = useState<'alle' | Gesundheit>('alle');
  const [offeneIds, setOffeneIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  const zeigeToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleDetail = (id: string) => {
    setOffeneIds(prev => {
      const neu = new Set(prev);
      if (neu.has(id)) neu.delete(id);
      else { neu.clear(); neu.add(id); } // nur eines gleichzeitig offen
      return neu;
    });
  };

  // Interessenten via Zuordnungs-Zwischentabelle
  const interessentenFuer = (projektId: string) => {
    const ids = store.zuordnungen.filter(z => z.projektId === projektId).map(z => z.interessentId);
    return MOCK_INTERESSENTEN.filter(i => ids.includes(i.id));
  };

  const projekte = store.anfragen.map(a => ({ anfrage: a, status: berechneProjekt(a, interessentenFuer(a.id)) }));
  const gefiltert = projekte.filter(p => filterGesundheit === 'alle' || p.status.gesundheit === filterGesundheit);

  const gruen  = projekte.filter(p => p.status.gesundheit === 'gruen').length;
  const gelb   = projekte.filter(p => p.status.gesundheit === 'gelb').length;
  const rot    = projekte.filter(p => p.status.gesundheit === 'rot').length;
  const erfolge = projekte.filter(p => p.status.kpi.erfolge > 0).length;

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, backgroundColor: '#003366', color: 'white', padding: '14px 20px', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '14px', fontWeight: 600 }}>
          {toast}
        </div>
      )}

      <div style={{ marginBottom: '8px' }}>
        <h1 style={{ margin: 0, color: '#003366', fontSize: '24px' }}>Vermittlungsprojekte</h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
          Jede Anfrage als Projekt — Klick auf eine Karte öffnet die Details.
        </p>
      </div>

      {/* Übersicht-KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', margin: '24px 0' }}>
        {[
          { label: 'Projekte gesamt', value: projekte.length, color: '#003366', filter: 'alle' as const },
          { label: '🟢 Hohe Aktivität',      value: gruen,   color: '#4CAF50', filter: 'gruen' as const },
          { label: '🟡 Wenig Interesse',      value: gelb,    color: '#FF9900', filter: 'gelb' as const },
          { label: '🔴 Aufmerksamkeit nötig', value: rot,     color: '#f44336', filter: 'rot' as const },
          { label: '⭐ Mit Erfolg',           value: erfolge, color: '#9C27B0', filter: 'alle' as const },
        ].map(stat => (
          <div key={stat.label} onClick={() => setFilterGesundheit(stat.filter)} style={{
            backgroundColor: 'white', padding: '16px', borderRadius: '8px', cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.07)', borderLeft: `4px solid ${stat.color}`,
            outline: filterGesundheit === stat.filter && stat.filter !== 'alle' ? `2px solid ${stat.color}` : 'none',
          }}>
            <div style={{ fontSize: '12px', color: '#666' }}>{stat.label}</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: stat.color, marginTop: '4px' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {filterGesundheit !== 'alle' && (
        <button onClick={() => setFilterGesundheit('alle')} style={{ marginBottom: '16px', padding: '6px 14px', backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#666' }}>
          ✕ Filter zurücksetzen ({gefiltert.length} angezeigt)
        </button>
      )}

      {/* Projekt-Liste mit Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {gefiltert.map(({ anfrage: a, status: s }) => {
          const isOpen = offeneIds.has(a.id);
          return (
            <div key={a.id} style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: isOpen ? '0 4px 16px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.07)' }}>
              {/* ── Karten-Header (immer sichtbar) ── */}
              <div
                onClick={() => toggleDetail(a.id)}
                style={{
                  backgroundColor: 'white', padding: '18px 20px', cursor: 'pointer',
                  borderLeft: `5px solid ${getGesundheitColor(s.gesundheit)}`,
                  borderBottom: isOpen ? '1px solid #f0f0f0' : 'none',
                  transition: 'background 0.1s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span>{getGesundheitEmoji(s.gesundheit)}</span>
                      <span style={{ fontWeight: 700, fontSize: '16px', color: '#003366' }}>{a.ziel}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                      {getRichtungLabel(a.richtung)} {a.firmenname} · {a.branche} · {a.anzeigenId}
                    </div>
                    <div style={{ display: 'flex', gap: '18px', fontSize: '12px', flexWrap: 'wrap' }}>
                      <Kpi label="Interessenten" value={s.kpi.interessenten} color="#2196F3" />
                      <Kpi label="Freigegeben"   value={s.kpi.freigegeben}   color="#4CAF50" />
                      <Kpi label="Kontakte"       value={s.kpi.kontakte}      color="#9C27B0" />
                      <Kpi label="Erfolge"        value={s.kpi.erfolge}       color="#2e7d32" />
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, color: 'white', backgroundColor: s.veroeffentlichungColor }}>{s.veroeffentlichung}</span>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, color: 'white', backgroundColor: getStatusColor(a.status) }}>{getStatusLabel(a.status)}</span>
                    <span style={{ fontSize: '18px', color: '#ccc', lineHeight: 1 }}>{isOpen ? '▴' : '▾'}</span>
                  </div>
                </div>
                {s.hinweis && !isOpen && (
                  <div style={{ marginTop: '10px', padding: '6px 10px', backgroundColor: '#fff8e1', borderRadius: '6px', fontSize: '12px', color: '#8a6d00', display: 'flex', gap: '6px' }}>
                    <span>💡</span><span>{s.hinweis}</span>
                  </div>
                )}
              </div>

              {/* ── Aufgeklappte Details (Accordion) ── */}
              {isOpen && (
                <ProjektInhalt
                  anfrage={a}
                  status={s}
                  zuordnungen={store.zuordnungen.filter(z => z.projektId === a.id)}
                  interessenten={interessentenFuer(a.id)}
                  store={store}
                  onToast={zeigeToast}
                />
              )}
            </div>
          );
        })}

        {gefiltert.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '14px' }}>
            Keine Projekte gefunden.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROJEKT-INHALT (Accordion-Inhalt) ────────────────────────

function ProjektInhalt({ anfrage: a, status: s, zuordnungen, interessenten, store, onToast }: {
  anfrage: MockAnfrage;
  status: ReturnType<typeof berechneProjekt>;
  zuordnungen: ProjektInteressent[];
  interessenten: typeof MOCK_INTERESSENTEN;
  store: ReturnType<typeof useStore>;
  onToast: (m: string) => void;
}) {
  const [introStatus, setIntroStatus] = useState<Record<string, 'idle'|'sending'|'sent'|'error'>>({});
  const [kontaktSucheOffen, setKontaktSucheOffen] = useState(false);
  const [kontaktSuche, setKontaktSuche] = useState('');
  const matchVorschlaege = MOCK_MATCHES.filter(m => m.anfrageId === a.id);

  // Zugeordnete Kontakte (dauerhafte Stammdaten)
  const zugeordneteKontakte = store.geschaftskontakte.filter(k =>
    k.projektZuordnungen.some(z => z.projektId === a.id)
  );
  const zugeordneteKontaktIds = zugeordneteKontakte.map(k => k.id);
  const kq = kontaktSuche.trim().toLowerCase();
  const verfuegbareKontakte = store.geschaftskontakte.filter(k =>
    !zugeordneteKontaktIds.includes(k.id) &&
    (!kq || [k.firmenname, k.ansprechpartner, k.email, k.branche, k.region].some(f => f?.toLowerCase().includes(kq)))
  );

  function kontaktHinzufuegen(kontaktId: string) {
    const k = store.geschaftskontakte.find(x => x.id === kontaktId);
    store.addKontaktProjektZuordnung(kontaktId, {
      id: `kpz-${Date.now()}`,
      projektId: a.id,
      status: 'vorgeschlagen',
      notiz: 'Aus Projekt hinzugefügt',
      erstelltAm: new Date().toISOString().split('T')[0],
      erstelltVon: 'Operator',
    });
    onToast(`Kontakt „${k?.firmenname}" hinzugefügt ✓`);
    setKontaktSucheOffen(false);
    setKontaktSuche('');
  }
  const aktiveMatches = interessenten.filter(i => ['kontakt_laeuft', 'erfolgreich', 'feedback_ausstehend'].includes(i.status));

  async function sendeIntroMail(interessentId: string, i: typeof MOCK_INTERESSENTEN[number]) {
    setIntroStatus(prev => ({ ...prev, [interessentId]: 'sending' }));
    try {
      const res = await fetch('/api/email/intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suchendeEmail: a.email, suchenderName: a.ansprechpartner,
          anfrageFirma: a.firmenname, anfrageAnzeigenId: a.anzeigenId,
          anfrageTelefon: a.telefon || '',
          interessentEmail: i.email, interessentName: i.ansprechpartner,
          interessentFirma: i.firmenname, interessentTelefon: i.telefon || '',
        }),
      });
      setIntroStatus(prev => ({ ...prev, [interessentId]: res.ok ? 'sent' : 'error' }));
      if (res.ok) store.logge(`Intro-Mail: ${i.firmenname} ↔ ${a.firmenname}`, a.anzeigenId, 'status');
    } catch {
      setIntroStatus(prev => ({ ...prev, [interessentId]: 'error' }));
    }
  }

  const ms = a.marktplatzStatus || 'intern';

  return (
    <div style={{ backgroundColor: '#f9fafb', padding: '24px' }}>
      {/* KPI-Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Interessenten', v: s.kpi.interessenten, c: '#2196F3' },
          { label: 'Freigegeben',   v: s.kpi.freigegeben,   c: '#4CAF50' },
          { label: 'Kontakte',      v: s.kpi.kontakte,      c: '#9C27B0' },
          { label: 'Erfolge',       v: s.kpi.erfolge,       c: '#2e7d32' },
          { label: 'Quote',         v: `${s.erfolgsquote}%`, c: '#FF9900' },
        ].map(k => (
          <div key={k.label} style={{ backgroundColor: k.c + '12', borderRadius: '8px', padding: '12px', textAlign: 'center', border: `1px solid ${k.c}30` }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: k.c }}>{k.v}</div>
            <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>{k.label}</div>
          </div>
        ))}
      </div>

      {s.hinweis && (
        <div style={{ marginBottom: '20px', padding: '12px 14px', backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px', fontSize: '13px', color: '#8a6d00', display: 'flex', gap: '10px' }}>
          <span>💡</span><div><strong>Optimierungsvorschlag:</strong> {s.hinweis}</div>
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

      {/* 2. Interessenten */}
      <Section titel={`2 · Interessenten (${zuordnungen.length})`}>
        {zuordnungen.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>Noch keine Interessenten. {matchVorschlaege.length > 0 && 'Es gibt Match-Vorschläge (siehe unten).'}</p>
        ) : (
          zuordnungen.map((z: ProjektInteressent) => {
            const i = MOCK_INTERESSENTEN.find(x => x.id === z.interessentId);
            if (!i) return null;
            const istatus = introStatus[i.id] || 'idle';
            const kannIntro = ['freigegeben', 'kontakt_hergestellt'].includes(z.status);
            return (
              <div key={z.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #e8e8e8', fontSize: '13px' }}>
                <div style={{ flex: 1 }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#003366' }}>{i.firmenname}</span>
                    <span style={{ color: '#999' }}> · {i.ansprechpartner}</span>
                    <span style={{ marginLeft: '6px', padding: '1px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 700, backgroundColor: z.zuordnungsart === 'manuell' ? '#FF990020' : '#99999920', color: z.zuordnungsart === 'manuell' ? '#e65100' : '#777' }}>
                      {z.zuordnungsart === 'manuell' ? '✋ manuell' : '⚙ auto'}
                    </span>
                  </div>
                  {kannIntro && (
                    <div style={{ marginTop: '5px' }}>
                      {istatus === 'idle'    && <button onClick={() => sendeIntroMail(i.id, i)} style={{ padding: '4px 10px', backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', color: '#2e7d32', fontWeight: 600 }}>✉️ Intro-Mail senden</button>}
                      {istatus === 'sending' && <span style={{ fontSize: '11px', color: '#999' }}>⏳ Wird gesendet…</span>}
                      {istatus === 'sent'    && <span style={{ fontSize: '11px', color: '#4CAF50', fontWeight: 600 }}>✅ Intro-Mail gesendet</span>}
                      {istatus === 'error'   && <span style={{ fontSize: '11px', color: '#f44336' }}>❌ Fehler — API-Key prüfen</span>}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {i.matchScore && <span style={{ fontSize: '12px', fontWeight: 700, color: i.matchScore >= 80 ? '#4CAF50' : '#FF9900' }}>{i.matchScore}%</span>}
                  <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, color: 'white', backgroundColor: getZuordnungColor(z.status) }}>{getZuordnungLabel(z.status)}</span>
                </div>
              </div>
            );
          })
        )}
        <a href="/dashboard/interessenten" style={{ fontSize: '12px', color: '#003366', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginTop: '8px' }}>→ Interessenten verwalten</a>
        <div style={{ fontSize: '11px', color: '#999', marginTop: '6px', fontStyle: 'italic' }}>
          ℹ️ Eingangskorb — neue Interessensbekundungen vom Marktplatz. Nach Prüfung „Kontakt erstellen".
        </div>
      </Section>

      {/* 2b. Zugeordnete Kontakte (dauerhafte Stammdaten) */}
      <Section titel={`2b · Zugeordnete Kontakte (${zugeordneteKontakte.length})`}>
        {zugeordneteKontakte.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#999', margin: '0 0 10px 0' }}>Noch keine dauerhaften Kontakte zugeordnet.</p>
        ) : (
          zugeordneteKontakte.map(k => {
            const z = k.projektZuordnungen.find(zz => zz.projektId === a.id)!;
            return (
              <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #e8e8e8', fontSize: '13px' }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#003366' }}>{k.firmenname}</span>
                  <span style={{ color: '#999' }}> · {k.ansprechpartner}</span>
                  {k.region && <span style={{ color: '#bbb', fontSize: '11px' }}> · {k.region}</span>}
                  {z.notiz && <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic', marginTop: '2px' }}>„{z.notiz}"</div>}
                </div>
                <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, color: 'white', backgroundColor: getKontaktZuordnungColor(z.status), flexShrink: 0 }}>
                  {getKontaktZuordnungLabel(z.status)}
                </span>
              </div>
            );
          })
        )}

        {!kontaktSucheOffen ? (
          <button onClick={() => setKontaktSucheOffen(true)} style={{ marginTop: '10px', padding: '7px 14px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
            + Kontakt hinzufügen
          </button>
        ) : (
          <div style={{ marginTop: '12px', padding: '14px', backgroundColor: '#f0f4ff', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#003366' }}>Bestehenden Kontakt suchen</div>
              <a href="/dashboard/kontakte" style={{ fontSize: '11px', color: '#003366', fontWeight: 600, textDecoration: 'none' }}>+ Neuen Kontakt anlegen →</a>
            </div>
            <input value={kontaktSuche} onChange={e => setKontaktSuche(e.target.value)} placeholder="Name, Firma, Branche, Region, E-Mail…" style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box', marginBottom: '8px' }} />
            <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {verfuegbareKontakte.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Keine passenden Kontakte. Lege im Kontakte-Modul einen neuen an.</p>
              ) : verfuegbareKontakte.slice(0, 8).map(k => (
                <button key={k.id} onClick={() => kontaktHinzufuegen(k.id)} style={{ textAlign: 'left', padding: '8px 10px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                  <div style={{ fontWeight: 600, color: '#003366' }}>{k.firmenname}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{k.ansprechpartner} · {k.email}{k.region ? ` · ${k.region}` : ''}</div>
                </button>
              ))}
            </div>
            <button onClick={() => { setKontaktSucheOffen(false); setKontaktSuche(''); }} style={{ marginTop: '8px', padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#666' }}>
              Schließen
            </button>
          </div>
        )}
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

      {/* 4. Verlauf */}
      <Section titel="4 · Verlauf & nächste Aufgabe">
        <div style={{ fontSize: '13px', color: '#444' }}>
          <div style={{ marginBottom: '6px' }}>📅 Erstellt: {a.createdAt}</div>
          <div style={{ marginBottom: '6px' }}>📊 Letzte Aktivität: {interessenten[0]?.createdAt || a.createdAt}</div>
          <div style={{ padding: '8px 12px', backgroundColor: '#f0f4ff', borderRadius: '6px', marginTop: '8px' }}>
            <strong>Nächste Aufgabe:</strong> {naechsteAufgabe(s, interessenten.length, a.workflowStatus)}
          </div>
        </div>
      </Section>

      {/* 5. Marktplatz */}
      <MarktplatzSektion anfrage={a} store={store} onToast={onToast} />

      {/* 6. Formulare */}
      <FormularSektion anfrage={a} store={store} onToast={onToast} />
    </div>
  );
}

// ─── FORMULAR-ZUORDNUNG ───────────────────────────────────────

function FormularSektion({ anfrage: a, store, onToast }: {
  anfrage: MockAnfrage;
  store: ReturnType<typeof useStore>;
  onToast: (m: string) => void;
}) {
  const anfrageFormulare = store.formulare.filter(f => f.typ === 'anfrage' && f.aktiv);
  const interessentFormulare = store.formulare.filter(f => f.typ === 'interessent' && f.aktiv);

  // Auto-Vorauswahl: Branchen-Spezial vor Standard
  const autoAnfrage = findeFormular(store.formulare, 'anfrage', a.branche);
  const autoInteressent = findeFormular(store.formulare, 'interessent', a.branche);

  const aktAnfrageId = a.anfrageFormularId || autoAnfrage?.id || '';
  const aktInteressentId = a.interessentFormularId || autoInteressent?.id || '';

  const aktAnfrage = store.formulare.find(f => f.id === aktAnfrageId);
  const aktInteressent = store.formulare.find(f => f.id === aktInteressentId);

  const SELECT: React.CSSProperties = { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '4px' };

  return (
    <Section titel="6 · Formulare">
      <p style={{ fontSize: '12px', color: '#666', margin: '0 0 12px 0' }}>
        Bestimmt, welche Fragen beim Anfragen und beim Interesse-Bekunden gestellt werden.
        Ohne Auswahl gilt automatisch das Branchen-Spezial- oder Standardformular.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#003366' }}>📋 Anfrageformular</label>
          <select
            value={aktAnfrageId}
            onChange={e => { store.updateAnfrage(a.id, { anfrageFormularId: e.target.value }); store.logge('Anfrageformular zugeordnet', a.anzeigenId, 'bearbeiten'); onToast('Anfrageformular zugeordnet ✓'); }}
            style={SELECT}
          >
            {anfrageFormulare.map(f => (
              <option key={f.id} value={f.id}>{f.name}{f.istStandard ? ' (Standard)' : f.branche ? ` · ${f.branche}` : ''}</option>
            ))}
          </select>
          {aktAnfrage && (
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
              {aktAnfrage.fragen.length} Fragen{!a.anfrageFormularId && autoAnfrage ? ' · automatisch gewählt' : ''}
              {' · '}<a href="/dashboard/formulare" style={{ color: '#003366', fontWeight: 600, textDecoration: 'none' }}>bearbeiten →</a>
            </div>
          )}
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#003366' }}>👥 Interessentenformular</label>
          <select
            value={aktInteressentId}
            onChange={e => { store.updateAnfrage(a.id, { interessentFormularId: e.target.value }); store.logge('Interessentenformular zugeordnet', a.anzeigenId, 'bearbeiten'); onToast('Interessentenformular zugeordnet ✓'); }}
            style={SELECT}
          >
            {interessentFormulare.map(f => (
              <option key={f.id} value={f.id}>{f.name}{f.istStandard ? ' (Standard)' : f.branche ? ` · ${f.branche}` : ''}</option>
            ))}
          </select>
          {aktInteressent && (
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
              {aktInteressent.fragen.length} Fragen{!a.interessentFormularId && autoInteressent ? ' · automatisch gewählt' : ''}
              {' · '}<a href="/dashboard/formulare" style={{ color: '#003366', fontWeight: 600, textDecoration: 'none' }}>bearbeiten →</a>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

// ─── MARKTPLATZ SEKTION ───────────────────────────────────────

const MS_META: Record<MarktplatzStatus, { label: string; color: string; bg: string }> = {
  intern:          { label: 'Intern',          color: '#757575', bg: '#f5f5f5' },
  entwurf:         { label: 'Entwurf',         color: '#E65100', bg: '#fff3e0' },
  zur_pruefung:    { label: 'Zur Prüfung',     color: '#1565C0', bg: '#e3f2fd' },
  veroeffentlicht: { label: 'Veröffentlicht',  color: '#2e7d32', bg: '#e8f5e9' },
  pausiert:        { label: 'Pausiert',        color: '#E65100', bg: '#fff3e0' },
  abgelaufen:      { label: 'Abgelaufen',      color: '#c62828', bg: '#ffebee' },
  archiviert:      { label: 'Archiviert',      color: '#546e7a', bg: '#eceff1' },
};

function MkBtn({ children, onClick, variant = 'default', disabled }: {
  children: React.ReactNode; onClick: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'ghost'; disabled?: boolean;
}) {
  const styles: Record<string, React.CSSProperties> = {
    default: { backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd' },
    primary: { backgroundColor: '#003366', color: 'white', border: 'none' },
    danger:  { backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a' },
    ghost:   { backgroundColor: 'transparent', color: '#003366', border: '1px solid #003366' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant], padding: '7px 14px', borderRadius: '6px', fontSize: '12px',
      fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      display: 'inline-flex', alignItems: 'center', gap: '5px',
    }}>
      {children}
    </button>
  );
}

function MarktplatzSektion({ anfrage, store, onToast }: {
  anfrage: MockAnfrage;
  store: ReturnType<typeof useStore>;
  onToast: (m: string) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [showVorschau, setShowVorschau] = useState(false);
  const [showDeaktivieren, setShowDeaktivieren] = useState(false);
  const [deaktiviereStatus, setDeaktiviereStatus] = useState<'pausiert'|'abgelaufen'|'archiviert'>('pausiert');
  const [deaktiviereGrund, setDeaktiviereGrund] = useState('');
  const [kiOutput, setKiOutput] = useState('');
  const [kiLoading, setKiLoading] = useState('');
  const [formData, setFormData] = useState<Partial<MarktplatzEintrag>>(anfrage.marktplatzDaten || {});
  const [dbSyncing, setDbSyncing] = useState(false);

  const ms: MarktplatzStatus = anfrage.marktplatzStatus || 'intern';
  const meta = MS_META[ms];
  const md = anfrage.marktplatzDaten;
  const today = new Date().toISOString().split('T')[0];

  function addMonths(date: string, n: number): string {
    const d = new Date(date);
    d.setMonth(d.getMonth() + n);
    return d.toISOString().split('T')[0];
  }

  // ── DB-Sync: Status in Neon speichern ────────────────────────
  async function syncDbStatus(neuerStatus: string) {
    setDbSyncing(true);
    try {
      await fetch('/api/anfragen', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: anfrage.id, status: neuerStatus }),
      });
    } catch (e) {
      console.warn('[Marktplatz] DB-Sync fehlgeschlagen:', e);
    } finally {
      setDbSyncing(false);
    }
  }

  function erstelleEntwurf() {
    const neu: MarktplatzEintrag = {
      titel: anfrage.ziel,
      kurzbeschreibung: anfrage.beschreibung.slice(0, 250),
      branche: anfrage.branche,
      richtung: anfrage.richtung,
      region: anfrage.standort,
      wasSuche: anfrage.ziel,
      warumGesucht: anfrage.beschreibung,
      anforderungen: '',
      persoenlicheNote: '',
      kulturHinweis: anfrage.kulturHinweis || '',
      funFact: anfrage.funFactOeffentlich ? (anfrage.funFactAntwortKI || anfrage.funFactAntwort || '') : '',
      funFactFreigegeben: anfrage.funFactOeffentlich || false,
      sichtbarkeit: (anfrage.sichtbarkeit as 'oeffentlich' | 'anonym') || 'oeffentlich',
      laufzeitMonate: 3,
      entwurfErstelltAm: today,
    };
    store.updateAnfrage(anfrage.id, { marktplatzStatus: 'entwurf', marktplatzDaten: neu });
    store.logge('Marktplatz-Entwurf erstellt', anfrage.anzeigenId, 'status');
    setFormData(neu);
    setEditMode(true);
  }

  function speichereEntwurf() {
    const updated = { ...(md || {} as MarktplatzEintrag), ...formData, letzteBearbeitungAm: today };
    store.updateAnfrage(anfrage.id, { marktplatzDaten: updated });
    store.logge('Marktplatz-Entwurf bearbeitet', anfrage.anzeigenId, 'bearbeiten');
    setEditMode(false);
  }

  function zurPruefung() {
    speichereEntwurf();
    store.updateAnfrage(anfrage.id, { marktplatzStatus: 'zur_pruefung' });
    store.logge('Marktplatz-Eintrag zur Prüfung eingereicht', anfrage.anzeigenId, 'status');
  }

  async function veroeffentlichen() {
    const lm = formData.laufzeitMonate || md?.laufzeitMonate || 3;
    store.updateAnfrage(anfrage.id, {
      marktplatzStatus: 'veroeffentlicht',
      veroeffentlichtAm: today,
      ablaufDatum: addMonths(today, lm),
      veroeffentlichtVon: 'Operator',
    });
    store.logge(`Marktplatz-Eintrag veröffentlicht (${lm} Monate)`, anfrage.anzeigenId, 'status');
    // DB-Status auf "aktiv" setzen → Homepage zeigt es
    await syncDbStatus('aktiv');
    onToast('✅ Veröffentlicht — Projekt ist jetzt auf der Homepage sichtbar');
    setEditMode(false);
  }

  async function deaktivieren() {
    const grund = deaktiviereGrund || 'Kein Grund angegeben';
    store.updateAnfrage(anfrage.id, {
      marktplatzStatus: deaktiviereStatus,
      deaktivierungsGrund: grund,
    });
    store.logge(`Marktplatz-Eintrag ${deaktiviereStatus}: ${grund}`, anfrage.anzeigenId, 'status');
    // DB-Status auf "pausiert" setzen → verschwindet von der Homepage
    await syncDbStatus('pausiert');
    onToast(`✅ Vom Marktplatz genommen — Projekt ist nicht mehr öffentlich sichtbar`);
    setShowDeaktivieren(false);
    setDeaktiviereGrund('');
  }

  async function wiederVeroeffentlichen() {
    const lm = md?.laufzeitMonate || 3;
    store.updateAnfrage(anfrage.id, {
      marktplatzStatus: 'veroeffentlicht',
      veroeffentlichtAm: today,
      ablaufDatum: addMonths(today, lm),
      deaktivierungsGrund: undefined,
    });
    store.logge('Marktplatz-Eintrag wieder veröffentlicht', anfrage.anzeigenId, 'status');
    await syncDbStatus('aktiv');
    onToast('✅ Wieder veröffentlicht — Projekt ist jetzt auf der Homepage sichtbar');
  }

  function kiSimuliere(tool: string) {
    setKiLoading(tool);
    setTimeout(() => {
      const texte: Record<string, string> = {
        generieren: `[KI-Entwurf] ${anfrage.firmenname} sucht ${anfrage.ziel.toLowerCase()}. ${anfrage.beschreibung.slice(0, 180)} Bei Interesse melden Sie sich über den Easy-B2B-Marktplatz.`,
        kuerzen: (formData.kurzbeschreibung || md?.kurzbeschreibung || '').slice(0, 140) + '…',
        voicecheck: `✅ Klarheit: 8/10 · Vertrauen: 7/10 · Ansprache: 9/10\n💡 Verbesserung: Ersten Satz aktiver formulieren.`,
        anonymisieren: (formData.kurzbeschreibung || md?.kurzbeschreibung || '').replace(new RegExp(anfrage.firmenname, 'gi'), anfrage.richtung === 'de_dk' ? 'Ein deutsches Unternehmen' : 'Ein dänisches Unternehmen'),
      };
      setKiOutput(texte[tool] || '');
      setKiLoading('');
    }, 900);
  }

  const INPUT: React.CSSProperties = { width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box' };
  const TEXTAREA: React.CSSProperties = { ...INPUT, minHeight: '70px', resize: 'vertical' };

  return (
    <Section titel="5 · Marktplatz-Veröffentlichung">
      {/* Vorschau-Modal */}
      {showVorschau && md && (
        <div onClick={() => setShowVorschau(false)} style={{ position: 'fixed', inset: 0, zIndex: 4000, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '12px', maxWidth: '620px', width: '100%', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ padding: '14px 20px', backgroundColor: '#003366', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>Vorschau — So erscheint der Eintrag auf der Homepage</span>
              <button onClick={() => setShowVorschau(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ border: '1px solid #e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#f8f9fa', padding: '12px 16px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#003366' }}>EASY-B2B MARKTPLATZ</span>
                  <span style={{ fontSize: '11px', color: '#666' }}>{anfrage.anzeigenId}</span>
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span>{md.richtung === 'dk_de' ? '🇩🇰 → 🇩🇪' : '🇩🇪 → 🇩🇰'}</span>
                    <span style={{ padding: '2px 8px', backgroundColor: '#e3f2fd', color: '#1565C0', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>{md.branche}</span>
                    {md.sichtbarkeit === 'anonym' && <span style={{ padding: '2px 8px', backgroundColor: '#f3e5f5', color: '#6a1b9a', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>Anonym</span>}
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#003366' }}>{md.titel}</h3>
                  <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#555', lineHeight: 1.6 }}>{md.kurzbeschreibung}</p>
                  {md.wasSuche && <div style={{ marginBottom: '6px', fontSize: '13px' }}><strong style={{ color: '#003366' }}>Gesucht:</strong> {md.wasSuche}</div>}
                  {md.anforderungen && <div style={{ marginBottom: '6px', fontSize: '13px' }}><strong style={{ color: '#003366' }}>Anforderungen:</strong> {md.anforderungen}</div>}
                  {md.persoenlicheNote && <div style={{ marginBottom: '6px', padding: '8px 12px', backgroundColor: '#f8f9fa', borderLeft: '3px solid #003366', fontSize: '13px', fontStyle: 'italic', color: '#444' }}>„{md.persoenlicheNote}"</div>}
                  {md.funFactFreigegeben && md.funFact && <div style={{ padding: '8px 12px', backgroundColor: '#fff8e1', borderRadius: '6px', fontSize: '12px', color: '#8a6d00', marginBottom: '6px' }}><strong>Fun Fact:</strong> {md.funFact}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deaktivieren-Dialog */}
      {showDeaktivieren && (
        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#fff3e0', border: '1px solid #ffcc80', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#E65100' }}>Eintrag vom Marktplatz nehmen</h4>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '4px' }}>Neuer Status</label>
            <select value={deaktiviereStatus} onChange={e => setDeaktiviereStatus(e.target.value as typeof deaktiviereStatus)} style={{ ...INPUT, width: 'auto' }}>
              <option value="pausiert">Pausiert (vorübergehend)</option>
              <option value="abgelaufen">Abgelaufen (Laufzeit beendet)</option>
              <option value="archiviert">Archiviert (abgeschlossen)</option>
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '4px' }}>Grund</label>
            <select value={deaktiviereGrund} onChange={e => setDeaktiviereGrund(e.target.value)} style={{ ...INPUT }}>
              <option value="">Bitte wählen…</option>
              <option value="Projekt erfolgreich abgeschlossen – Partner gefunden">Projekt erfolgreich abgeschlossen</option>
              <option value="Ansprechpartner momentan nicht erreichbar">Ansprechpartner nicht erreichbar</option>
              <option value="Inhalt soll überarbeitet werden">Inhalt überarbeiten</option>
              <option value="Keine Relevanz mehr">Keine Relevanz mehr</option>
              <option value="Anfrage abgelaufen">Anfrage abgelaufen</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <MkBtn onClick={deaktivieren} variant="danger" disabled={dbSyncing}>{dbSyncing ? '⏳ Wird gespeichert…' : '⏹ Jetzt vom Marktplatz nehmen'}</MkBtn>
            <MkBtn onClick={() => setShowDeaktivieren(false)} variant="ghost">Abbrechen</MkBtn>
          </div>
        </div>
      )}

      {/* Status-Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, color: meta.color, backgroundColor: meta.bg, border: `1px solid ${meta.color}40` }}>
          ● {meta.label}
        </span>
        {anfrage.veroeffentlichtAm && ms === 'veroeffentlicht' && <span style={{ fontSize: '12px', color: '#666' }}>Veröffentlicht: {anfrage.veroeffentlichtAm}</span>}
        {anfrage.ablaufDatum && ms === 'veroeffentlicht' && <span style={{ fontSize: '12px', color: '#666' }}>Läuft bis: {anfrage.ablaufDatum}</span>}
      </div>

      {anfrage.deaktivierungsGrund && ['pausiert','abgelaufen','archiviert'].includes(ms) && (
        <div style={{ marginBottom: '12px', padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: '6px', fontSize: '12px', color: '#555' }}>
          <strong>Grund:</strong> {anfrage.deaktivierungsGrund}
        </div>
      )}

      {/* STATE: intern */}
      {ms === 'intern' && (
        <div style={{ padding: '20px', border: '2px dashed #e0e0e0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>📋</div>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#666' }}>Noch nicht im öffentlichen Marktplatz sichtbar.</p>
          <MkBtn onClick={erstelleEntwurf} variant="primary">+ Marktplatz-Entwurf erstellen</MkBtn>
        </div>
      )}

      {/* STATE: entwurf / zur_pruefung */}
      {(ms === 'entwurf' || ms === 'zur_pruefung') && (
        <div>
          {!editMode && md && (
            <div style={{ marginBottom: '14px', padding: '12px 14px', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '13px' }}>
              <div style={{ fontWeight: 600, color: '#003366', marginBottom: '4px' }}>{md.titel}</div>
              <div style={{ color: '#555', lineHeight: 1.5 }}>{md.kurzbeschreibung?.slice(0, 150)}{(md.kurzbeschreibung?.length || 0) > 150 ? '…' : ''}</div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '12px', fontSize: '11px', color: '#888' }}>
                <span>👁 {md.sichtbarkeit === 'oeffentlich' ? 'Öffentlich' : 'Anonym'}</span>
                <span>⏱ {md.laufzeitMonate} Monate</span>
              </div>
            </div>
          )}

          {editMode && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#666', fontWeight: 600, display: 'block', marginBottom: '3px' }}>TITEL</label>
                  <input style={INPUT} value={formData.titel || ''} onChange={e => setFormData(p => ({ ...p, titel: e.target.value }))} placeholder="Kurzer, prägnanter Titel…" />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#666', fontWeight: 600, display: 'block', marginBottom: '3px' }}>KURZBESCHREIBUNG</label>
                  <textarea style={TEXTAREA} value={formData.kurzbeschreibung || ''} onChange={e => setFormData(p => ({ ...p, kurzbeschreibung: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#666', fontWeight: 600, display: 'block', marginBottom: '3px' }}>SICHTBARKEIT</label>
                    <select style={INPUT} value={formData.sichtbarkeit || 'oeffentlich'} onChange={e => setFormData(p => ({ ...p, sichtbarkeit: e.target.value as 'oeffentlich' | 'anonym' }))}>
                      <option value="oeffentlich">Öffentlich (mit Namen)</option>
                      <option value="anonym">Anonym</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#666', fontWeight: 600, display: 'block', marginBottom: '3px' }}>LAUFZEIT</label>
                    <select style={INPUT} value={formData.laufzeitMonate || 3} onChange={e => setFormData(p => ({ ...p, laufzeitMonate: Number(e.target.value) }))}>
                      <option value={1}>1 Monat</option>
                      <option value={2}>2 Monate</option>
                      <option value={3}>3 Monate</option>
                      <option value={6}>6 Monate</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', paddingBottom: '8px' }}>
                      <input type="checkbox" checked={formData.funFactFreigegeben || false} onChange={e => setFormData(p => ({ ...p, funFactFreigegeben: e.target.checked }))} />
                      FunFact freigeben
                    </label>
                  </div>
                </div>
              </div>

              {/* KI-Tools */}
              <div style={{ marginTop: '12px', padding: '12px 14px', backgroundColor: '#f0f4ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#003366', marginBottom: '8px' }}>🤖 KI-UNTERSTÜTZUNG</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[{ key: 'generieren', label: '✨ Text generieren' }, { key: 'kuerzen', label: '✂️ Kürzen' }, { key: 'voicecheck', label: '🎙 Voice Check' }, { key: 'anonymisieren', label: '👤 Anonymisieren' }].map(t => (
                    <button key={t.key} onClick={() => kiSimuliere(t.key)} disabled={kiLoading !== ''} style={{ padding: '5px 12px', backgroundColor: kiLoading === t.key ? '#e3f2fd' : 'white', border: '1px solid #90caf9', borderRadius: '6px', fontSize: '11px', cursor: kiLoading !== '' ? 'wait' : 'pointer', color: '#1565C0', fontWeight: 600 }}>
                      {kiLoading === t.key ? '⏳ …' : t.label}
                    </button>
                  ))}
                </div>
                {kiOutput && (
                  <div style={{ marginTop: '10px', padding: '10px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #90caf9', fontSize: '12px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px', fontWeight: 600 }}>KI-ERGEBNIS (Entwurf — bitte prüfen):</div>
                    {kiOutput}
                    <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
                      <button onClick={() => { setFormData(p => ({ ...p, kurzbeschreibung: kiOutput })); setKiOutput(''); }} style={{ padding: '3px 10px', backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', color: '#2e7d32' }}>Übernehmen</button>
                      <button onClick={() => setKiOutput('')} style={{ padding: '3px 10px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', color: '#666' }}>Verwerfen</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {!editMode ? (
              <>
                <MkBtn onClick={() => { setFormData(md || {}); setEditMode(true); }} variant="ghost">✏️ Bearbeiten</MkBtn>
                {md && <MkBtn onClick={() => setShowVorschau(true)} variant="default">👁 Vorschau</MkBtn>}
                {ms === 'entwurf' && <MkBtn onClick={zurPruefung} variant="default">→ Zur Prüfung</MkBtn>}
                <MkBtn onClick={veroeffentlichen} variant="primary" disabled={dbSyncing}>{dbSyncing ? '⏳ …' : '🚀 Jetzt veröffentlichen'}</MkBtn>
              </>
            ) : (
              <>
                <MkBtn onClick={speichereEntwurf} variant="primary">💾 Speichern</MkBtn>
                <MkBtn onClick={() => setShowVorschau(true)} variant="default">👁 Vorschau</MkBtn>
                <MkBtn onClick={() => setEditMode(false)} variant="ghost">Abbrechen</MkBtn>
              </>
            )}
          </div>
        </div>
      )}

      {/* STATE: veroeffentlicht */}
      {ms === 'veroeffentlicht' && (
        <div>
          {md && (
            <div style={{ marginBottom: '14px', padding: '14px', backgroundColor: '#e8f5e9', borderRadius: '8px', border: '1px solid #a5d6a7' }}>
              <div style={{ fontWeight: 700, color: '#1b5e20', marginBottom: '4px', fontSize: '14px' }}>{md.titel}</div>
              <div style={{ fontSize: '12px', color: '#2e7d32', marginBottom: '6px' }}>{md.kurzbeschreibung?.slice(0, 150)}{(md.kurzbeschreibung?.length || 0) > 150 ? '…' : ''}</div>
              <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: '#388e3c' }}>
                <span>👁 {md.sichtbarkeit === 'oeffentlich' ? 'Öffentlich sichtbar' : 'Anonym sichtbar'}</span>
                <span>⏱ {md.laufzeitMonate} Monate</span>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <MkBtn onClick={() => { setFormData(md || {}); store.updateAnfrage(anfrage.id, { marktplatzStatus: 'entwurf' }); }} variant="ghost">✏️ Inhalt bearbeiten</MkBtn>
            {md && <MkBtn onClick={() => setShowVorschau(true)} variant="default">👁 Vorschau</MkBtn>}
            <MkBtn onClick={() => setShowDeaktivieren(true)} variant="danger" disabled={dbSyncing}>
              {dbSyncing ? '⏳ Wird gespeichert…' : '⏹ Vom Marktplatz nehmen'}
            </MkBtn>
          </div>
        </div>
      )}

      {/* STATE: pausiert / abgelaufen / archiviert */}
      {['pausiert', 'abgelaufen', 'archiviert'].includes(ms) && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {ms !== 'archiviert' && (
            <MkBtn onClick={wiederVeroeffentlichen} variant="primary" disabled={dbSyncing}>
              {dbSyncing ? '⏳ Wird gespeichert…' : '🔄 Wieder veröffentlichen'}
            </MkBtn>
          )}
          {ms === 'archiviert' && (
            <MkBtn onClick={() => { store.updateAnfrage(anfrage.id, { marktplatzStatus: 'entwurf' }); store.logge('Reaktiviert als Entwurf', anfrage.anzeigenId, 'status'); onToast('Entwurf wiederhergestellt'); }} variant="ghost">↩ Als Entwurf reaktivieren</MkBtn>
          )}
          {ms !== 'archiviert' && (
            <MkBtn onClick={() => { store.updateAnfrage(anfrage.id, { marktplatzStatus: 'archiviert' }); syncDbStatus('archiviert').then(() => onToast('Archiviert')); }} variant="danger">🗄 Archivieren</MkBtn>
          )}
          {md && <MkBtn onClick={() => setShowVorschau(true)} variant="default">👁 Letzter Entwurf</MkBtn>}
        </div>
      )}
    </Section>
  );
}

// ─── HILFSFUNKTIONEN ──────────────────────────────────────────

function naechsteAufgabe(s: ReturnType<typeof berechneProjekt>, anzInteressenten: number, ms?: string): string {
  if (!ms || ms === 'intern') return 'Marktplatz-Entwurf erstellen und Anfrage veröffentlichen.';
  if (ms === 'entwurf') return 'Marktplatz-Entwurf fertigstellen und prüfen.';
  if (ms === 'zur_pruefung') return 'Marktplatz-Eintrag final prüfen und veröffentlichen.';
  if (ms === 'pausiert' || ms === 'abgelaufen') return 'Entscheiden: wieder veröffentlichen, überarbeiten oder archivieren?';
  if (anzInteressenten === 0) return 'Aktives Matchmaking starten oder Gesuch überarbeiten.';
  if (s.kpi.freigegeben === 0) return 'Neue Interessenten prüfen und freigeben.';
  if (s.kpi.kontakte === 0) return 'Kontakt zwischen Suchendem und freigegebenem Interessenten herstellen.';
  if (s.kpi.erfolge === 0) return 'Feedback zum laufenden Kontakt einholen.';
  return 'Projekt läuft erfolgreich — Success Story dokumentieren.';
}

function Kpi({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ fontWeight: 700, color, fontSize: '14px' }}>{value}</span>
      <span style={{ color: '#888' }}>{label}</span>
    </span>
  );
}

function Section({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e8e8e8' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, color: '#003366', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{titel}</h3>
      {children}
    </div>
  );
}
