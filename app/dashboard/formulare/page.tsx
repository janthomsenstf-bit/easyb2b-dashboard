'use client';

import { useState } from 'react';
import { useStore, neueEntityId } from '@/lib/store';
import {
  FRAGETYP_OPTIONEN, getFrageTypLabel,
  type FormularVorlage, type FormularFrage, type FormularTyp, type FrageTyp,
} from '@/lib/mockdata';
import { schlageBranchenFragenVor, pruefeFormular, type FormularPruefErgebnis } from '@/lib/formulare';

export default function FormularePage() {
  const store = useStore();
  const [tab, setTab] = useState<FormularTyp | 'branchen'>('anfrage');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [neuOffen, setNeuOffen] = useState(false);

  const zeigeToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  // Für anfrage/interessent: alle dieses Typs; für branchen: alle mit Branche
  const liste = tab === 'branchen'
    ? store.formulare.filter(f => !!f.branche)
    : store.formulare.filter(f => f.typ === tab);

  const selected = selectedId ? store.formulare.find(f => f.id === selectedId) : null;

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, backgroundColor: '#003366', color: 'white', padding: '14px 20px', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '14px', fontWeight: 600 }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#003366', fontSize: '24px' }}>Formulare & Fragebögen</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
            Verwaltbare Vorlagen für Anfragen und Interessenten — branchenspezifisch anpassbar. Bessere Fragen → bessere Matches.
          </p>
        </div>
        <button onClick={() => setNeuOffen(true)} style={{ padding: '10px 18px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, flexShrink: 0 }}>
          + Neue Vorlage
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', margin: '20px 0' }}>
        {([['anfrage', '📋 Anfrageformulare'], ['interessent', '👥 Interessentenformulare'], ['branchen', '🏷 Branchenvorlagen']] as const).map(([id, label]) => (
          <button key={id} onClick={() => { setTab(id); setSelectedId(null); }} style={{
            padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            backgroundColor: tab === id ? '#003366' : '#f0f0f0', color: tab === id ? 'white' : '#666',
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* LISTE */}
        <div style={{ width: selected ? '320px' : '100%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {liste.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#666', fontSize: '14px', backgroundColor: 'white', borderRadius: '8px' }}>
              Keine Vorlagen. Lege eine neue an.
            </div>
          ) : liste.map(f => (
            <div key={f.id} onClick={() => setSelectedId(f.id)} style={{
              backgroundColor: selectedId === f.id ? '#f0f4ff' : 'white', borderRadius: '10px', padding: '16px', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: `4px solid ${f.istStandard ? '#4CAF50' : '#9C27B0'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#003366' }}>{f.name}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                    {f.typ === 'anfrage' ? '📋 Anfrage' : '👥 Interessent'} · {f.fragen.length} Fragen
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end', flexShrink: 0 }}>
                  {f.istStandard && <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, backgroundColor: '#e8f5e9', color: '#2e7d32' }}>STANDARD</span>}
                  {f.branche && <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 600, backgroundColor: '#f3e5f5', color: '#6a1b9a' }}>{f.branche}</span>}
                  {!f.aktiv && <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 600, backgroundColor: '#e8e8e8', color: '#444' }}>inaktiv</span>}
                </div>
              </div>
              {f.beschreibung && <div style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>{f.beschreibung}</div>}
            </div>
          ))}
        </div>

        {/* EDITOR */}
        {selected && (
          <FormularEditor
            key={selected.id}
            formular={selected}
            store={store}
            onClose={() => setSelectedId(null)}
            onToast={zeigeToast}
          />
        )}
      </div>

      {/* Neue Vorlage Modal */}
      {neuOffen && (
        <NeueVorlageModal
          onClose={() => setNeuOffen(false)}
          onErstellen={(name, typ, branche) => {
            const neu: FormularVorlage = {
              id: neueEntityId('form'),
              name, typ, branche: branche || undefined,
              istStandard: false, beschreibung: '',
              fragen: [], aktiv: true,
              createdAt: new Date().toISOString().split('T')[0],
            };
            store.addFormular(neu);
            store.logge(`Formular-Vorlage angelegt: ${name}`, name, 'anlegen');
            setNeuOffen(false);
            setTab(typ);
            setSelectedId(neu.id);
            zeigeToast('Vorlage angelegt — jetzt Fragen hinzufügen');
          }}
        />
      )}
    </div>
  );
}

// ─── EDITOR ───────────────────────────────────────────────────

function FormularEditor({ formular: f, store, onClose, onToast }: {
  formular: FormularVorlage;
  store: ReturnType<typeof useStore>;
  onClose: () => void;
  onToast: (m: string) => void;
}) {
  const [editorTab, setEditorTab] = useState<'editor' | 'vorschau' | 'ki'>('editor');
  const [neueFrage, setNeueFrage] = useState('');
  const [neuerTyp, setNeuerTyp] = useState<FrageTyp>('text_kurz');
  const [kiBeschreibung, setKiBeschreibung] = useState('');
  const [kiFragen, setKiFragen] = useState<FormularFrage[] | null>(null);
  const [kiBranche, setKiBranche] = useState('');
  const [kiLoading, setKiLoading] = useState(false);
  const [pruefErgebnis, setPruefErgebnis] = useState<FormularPruefErgebnis | null>(null);

  const setFragen = (fragen: FormularFrage[]) => {
    const neu = fragen.map((fr, idx) => ({ ...fr, reihenfolge: idx + 1 }));
    store.updateFormular(f.id, { fragen: neu });
  };

  const frageHinzufuegen = () => {
    if (!neueFrage.trim()) return;
    const neu: FormularFrage = {
      id: neueEntityId('frq'),
      reihenfolge: f.fragen.length + 1,
      text: neueFrage.trim(),
      typ: neuerTyp,
      pflicht: true,
      optionen: ['auswahl_single', 'auswahl_multi'].includes(neuerTyp) ? ['Option 1', 'Option 2'] : undefined,
    };
    setFragen([...f.fragen, neu]);
    setNeueFrage('');
    onToast('Frage hinzugefügt');
  };

  const frageLoeschen = (id: string) => {
    setFragen(f.fragen.filter(fr => fr.id !== id));
    onToast('Frage gelöscht');
  };

  const frageBearbeiten = (id: string, patch: Partial<FormularFrage>) => {
    setFragen(f.fragen.map(fr => fr.id === id ? { ...fr, ...patch } : fr));
  };

  const verschieben = (index: number, richtung: -1 | 1) => {
    const neu = [...f.fragen];
    const ziel = index + richtung;
    if (ziel < 0 || ziel >= neu.length) return;
    [neu[index], neu[ziel]] = [neu[ziel], neu[index]];
    setFragen(neu);
  };

  async function kiVorschlagen() {
    if (!kiBeschreibung.trim()) return;
    setKiLoading(true);
    const res = await schlageBranchenFragenVor(kiBeschreibung, f.typ);
    setKiFragen(res.fragen);
    setKiBranche(res.erkannteBranche);
    setKiLoading(false);
  }

  function kiFragenUebernehmen() {
    if (!kiFragen) return;
    const mitNeuenIds = kiFragen.map(fr => ({ ...fr, id: neueEntityId('frq') }));
    setFragen([...f.fragen, ...mitNeuenIds]);
    setKiFragen(null);
    setKiBeschreibung('');
    onToast(`${mitNeuenIds.length} Fragen übernommen`);
  }

  async function kiPruefen() {
    setKiLoading(true);
    const res = await pruefeFormular(f.fragen, f.typ);
    setPruefErgebnis(res);
    setKiLoading(false);
  }

  const INPUT: React.CSSProperties = { padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box' };

  return (
    <div style={{ flex: 1, minWidth: 0, backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <input
            value={f.name}
            onChange={e => store.updateFormular(f.id, { name: e.target.value })}
            style={{ fontSize: '18px', fontWeight: 700, color: '#003366', border: 'none', borderBottom: '1px dashed transparent', outline: 'none', width: '100%' }}
            onFocus={e => e.currentTarget.style.borderBottomColor = '#ddd'}
            onBlur={e => e.currentTarget.style.borderBottomColor = 'transparent'}
          />
          <input
            value={f.beschreibung || ''}
            onChange={e => store.updateFormular(f.id, { beschreibung: e.target.value })}
            placeholder="Beschreibung (optional)…"
            style={{ fontSize: '12px', color: '#666', border: 'none', outline: 'none', width: '100%', marginTop: '4px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <label style={{ fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            <input type="checkbox" checked={f.aktiv} onChange={e => store.updateFormular(f.id, { aktiv: e.target.checked })} /> aktiv
          </label>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }}>×</button>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '6px', padding: '12px 20px 0 20px' }}>
        {([['editor', '✏️ Editor'], ['vorschau', '👁 Vorschau'], ['ki', '🤖 KI-Hilfe']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setEditorTab(id)} style={{
            padding: '7px 14px', borderRadius: '6px 6px 0 0', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
            backgroundColor: editorTab === id ? '#f0f4ff' : 'transparent', color: editorTab === id ? '#003366' : '#666',
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px' }}>
        {/* TAB: EDITOR */}
        {editorTab === 'editor' && (
          <div>
            {f.fragen.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', padding: '20px' }}>Noch keine Fragen. Füge unten die erste hinzu oder nutze die KI-Hilfe.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {f.fragen.map((fr, idx) => (
                  <div key={fr.id} style={{ padding: '12px', backgroundColor: '#f5f7fa', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                        <button onClick={() => verschieben(idx, -1)} disabled={idx === 0} style={arrowBtn(idx === 0)}>▲</button>
                        <span style={{ fontSize: '10px', color: '#555', textAlign: 'center', fontWeight: 600 }}>{idx + 1}</span>
                        <button onClick={() => verschieben(idx, 1)} disabled={idx === f.fragen.length - 1} style={arrowBtn(idx === f.fragen.length - 1)}>▼</button>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <input value={fr.text} onChange={e => frageBearbeiten(fr.id, { text: e.target.value })} style={{ ...INPUT, width: '100%', fontWeight: 600, color: '#333', marginBottom: '6px' }} />
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <select value={fr.typ} onChange={e => {
                            const t = e.target.value as FrageTyp;
                            frageBearbeiten(fr.id, { typ: t, optionen: ['auswahl_single','auswahl_multi'].includes(t) ? (fr.optionen || ['Option 1','Option 2']) : undefined });
                          }} style={{ ...INPUT, fontSize: '12px' }}>
                            {FRAGETYP_OPTIONEN.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                          <label style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={fr.pflicht} onChange={e => frageBearbeiten(fr.id, { pflicht: e.target.checked })} /> Pflicht
                          </label>
                          <button onClick={() => frageLoeschen(fr.id)} style={{ marginLeft: 'auto', padding: '4px 10px', backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>🗑 Löschen</button>
                        </div>
                        {['auswahl_single', 'auswahl_multi'].includes(fr.typ) && (
                          <div style={{ marginTop: '6px' }}>
                            <input
                              value={(fr.optionen || []).join(', ')}
                              onChange={e => frageBearbeiten(fr.id, { optionen: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                              placeholder="Optionen, durch Komma getrennt"
                              style={{ ...INPUT, width: '100%', fontSize: '12px', backgroundColor: 'white' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Frage hinzufügen */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '12px', backgroundColor: '#f0f4ff', borderRadius: '8px' }}>
              <input value={neueFrage} onChange={e => setNeueFrage(e.target.value)} onKeyDown={e => e.key === 'Enter' && frageHinzufuegen()} placeholder="Neue Frage eingeben…" style={{ ...INPUT, flex: 1 }} />
              <select value={neuerTyp} onChange={e => setNeuerTyp(e.target.value as FrageTyp)} style={{ ...INPUT, fontSize: '12px' }}>
                {FRAGETYP_OPTIONEN.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button onClick={frageHinzufuegen} style={{ padding: '8px 16px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, flexShrink: 0 }}>+ Hinzufügen</button>
            </div>
          </div>
        )}

        {/* TAB: VORSCHAU */}
        {editorTab === 'vorschau' && (
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <div style={{ padding: '10px 14px', backgroundColor: '#003366', color: 'white', borderRadius: '8px 8px 0 0', fontSize: '13px', fontWeight: 700 }}>
              {f.typ === 'anfrage' ? '📋 Anfrage einreichen' : '👥 Interesse bekunden'} — Vorschau
            </div>
            <div style={{ border: '1px solid #e0e0e0', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '20px' }}>
              {f.fragen.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#666' }}>Noch keine Fragen.</p>
              ) : f.fragen.map((fr, idx) => (
                <div key={fr.id} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '5px' }}>
                    {idx + 1}. {fr.text}{fr.pflicht && <span style={{ color: '#f44336' }}> *</span>}
                  </label>
                  <VorschauFeld frage={fr} />
                  {fr.hinweis && <div style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>{fr.hinweis}</div>}
                </div>
              ))}
              {f.fragen.length > 0 && (
                <button style={{ padding: '10px 24px', backgroundColor: '#FF9900', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'default', marginTop: '8px' }}>Absenden</button>
              )}
            </div>
          </div>
        )}

        {/* TAB: KI-HILFE */}
        {editorTab === 'ki' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Branchenfragen vorschlagen */}
            <div style={{ padding: '16px', backgroundColor: '#f0f4ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#003366', marginBottom: '8px' }}>✨ Branchenfragen vorschlagen</div>
              <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>Beschreibe das Vorhaben — die KI schlägt passende Zusatzfragen vor.</p>
              <textarea value={kiBeschreibung} onChange={e => setKiBeschreibung(e.target.value)} rows={2} placeholder="z.B. Lebensmittelunternehmen aus Dänemark sucht Vertriebspartner in Deutschland" style={{ ...INPUT, width: '100%', marginBottom: '8px', resize: 'vertical' }} />
              <button onClick={kiVorschlagen} disabled={kiLoading || !kiBeschreibung.trim()} style={{ padding: '8px 16px', backgroundColor: kiLoading ? '#ccc' : '#003366', color: 'white', border: 'none', borderRadius: '6px', cursor: kiLoading ? 'wait' : 'pointer', fontSize: '13px', fontWeight: 600 }}>
                {kiLoading ? '⏳ Analysiere…' : '✨ Fragen vorschlagen'}
              </button>
              {kiFragen && (
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #90caf9' }}>
                  <div style={{ fontSize: '11px', color: '#1565C0', fontWeight: 700, marginBottom: '8px' }}>Erkannt: {kiBranche} · {kiFragen.length} Vorschläge</div>
                  {kiFragen.map((fr, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#444', padding: '4px 0', borderBottom: '1px solid #f5f5f5' }}>
                      • {fr.text} <span style={{ color: '#666' }}>({getFrageTypLabel(fr.typ)})</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button onClick={kiFragenUebernehmen} style={{ padding: '6px 14px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>✓ Alle übernehmen</button>
                    <button onClick={() => setKiFragen(null)} style={{ padding: '6px 14px', backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Verwerfen</button>
                  </div>
                </div>
              )}
            </div>

            {/* Formular prüfen */}
            <div style={{ padding: '16px', backgroundColor: '#fff8e1', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#8a6d00', marginBottom: '8px' }}>🔍 Formular prüfen</div>
              <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>Erkennt doppelte Fragen, fehlende wichtige Felder und gibt Tipps.</p>
              <button onClick={kiPruefen} disabled={kiLoading} style={{ padding: '8px 16px', backgroundColor: kiLoading ? '#ccc' : '#8a6d00', color: 'white', border: 'none', borderRadius: '6px', cursor: kiLoading ? 'wait' : 'pointer', fontSize: '13px', fontWeight: 600 }}>
                {kiLoading ? '⏳ Prüfe…' : '🔍 Jetzt prüfen'}
              </button>
              {pruefErgebnis && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: pruefErgebnis.score >= 80 ? '#2e7d32' : pruefErgebnis.score >= 60 ? '#E65100' : '#c62828', marginBottom: '8px' }}>
                    Qualitäts-Score: {pruefErgebnis.score}/100
                  </div>
                  {pruefErgebnis.hinweise.length === 0 ? (
                    <div style={{ fontSize: '12px', color: '#2e7d32' }}>✅ Keine Probleme gefunden — gutes Formular!</div>
                  ) : pruefErgebnis.hinweise.map((h, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#555', padding: '6px 10px', backgroundColor: 'white', borderRadius: '6px', marginBottom: '6px', borderLeft: `3px solid ${h.typ === 'doppelt' ? '#FF9900' : h.typ === 'fehlt' ? '#f44336' : '#2196F3'}` }}>
                      {h.typ === 'doppelt' ? '🔁' : h.typ === 'fehlt' ? '⚠️' : '💡'} {h.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── VORSCHAU-FELD ────────────────────────────────────────────

function VorschauFeld({ frage }: { frage: FormularFrage }) {
  const base: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', backgroundColor: 'white', color: '#333' };
  switch (frage.typ) {
    case 'text_lang': return <textarea rows={3} disabled style={{ ...base, resize: 'none' }} placeholder="Antwort…" />;
    case 'zahl': return <input type="number" disabled style={base} placeholder="0" />;
    case 'datum': return <input type="date" disabled style={base} />;
    case 'datei': return <div style={{ ...base, color: '#666' }}>📎 Datei auswählen…</div>;
    case 'ja_nein': return (
      <div style={{ display: 'flex', gap: '12px' }}>
        <label style={{ fontSize: '13px' }}><input type="radio" disabled /> Ja</label>
        <label style={{ fontSize: '13px' }}><input type="radio" disabled /> Nein</label>
      </div>
    );
    case 'skala': return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => <span key={n} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#666' }}>{n}</span>)}
      </div>
    );
    case 'auswahl_single': return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {(frage.optionen || []).map((o, i) => <label key={i} style={{ fontSize: '13px' }}><input type="radio" disabled /> {o}</label>)}
      </div>
    );
    case 'auswahl_multi': return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {(frage.optionen || []).map((o, i) => <label key={i} style={{ fontSize: '13px' }}><input type="checkbox" disabled /> {o}</label>)}
      </div>
    );
    default: return <input disabled style={base} placeholder="Antwort…" />;
  }
}

// ─── NEUE VORLAGE MODAL ───────────────────────────────────────

function NeueVorlageModal({ onClose, onErstellen }: {
  onClose: () => void;
  onErstellen: (name: string, typ: FormularTyp, branche: string) => void;
}) {
  const [name, setName] = useState('');
  const [typ, setTyp] = useState<FormularTyp>('anfrage');
  const [branche, setBranche] = useState('');

  const INPUT: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', marginTop: '5px' };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 3000, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '440px', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#003366' }}>Neue Formular-Vorlage</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: '#666' }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>Name *
            <input value={name} onChange={e => setName(e.target.value)} placeholder="z.B. Food-Markteintritt Deutschland" style={INPUT} />
          </label>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginTop: '16px' }}>Formulartyp *
            <select value={typ} onChange={e => setTyp(e.target.value as FormularTyp)} style={INPUT}>
              <option value="anfrage">📋 Anfrageformular</option>
              <option value="interessent">👥 Interessentenformular</option>
            </select>
          </label>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginTop: '16px' }}>Branche (optional — leer = allgemein)
            <input value={branche} onChange={e => setBranche(e.target.value)} placeholder="z.B. Lebensmittel & Fischerei" style={INPUT} />
          </label>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>Abbrechen</button>
          <button onClick={() => name.trim() && onErstellen(name.trim(), typ, branche.trim())} disabled={!name.trim()} style={{ padding: '10px 24px', backgroundColor: name.trim() ? '#003366' : '#ccc', color: 'white', border: 'none', borderRadius: '6px', cursor: name.trim() ? 'pointer' : 'not-allowed', fontSize: '14px', fontWeight: 600 }}>Erstellen</button>
        </div>
      </div>
    </div>
  );
}

function arrowBtn(disabled: boolean): React.CSSProperties {
  return { background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer', fontSize: '10px', color: disabled ? '#ddd' : '#666', padding: '2px', lineHeight: 1 };
}
