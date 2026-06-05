'use client';

import { useState } from 'react';
import {
  getStatusLabel, getStatusColor, getRichtungLabel, MOCK_INTERESSENTEN,
  getWorkflowStatusColor, getWorkflowStatusSchritt,
  WORKFLOW_SCHRITTE,
  type MockAnfrage,
} from '@/lib/mockdata';
import { verbessereAntwortMock } from '@/lib/funfact';
import { useStore } from '@/lib/store';
import EntityModal, { type FeldDef } from '@/components/EntityModal';

const ANFRAGE_FELDER: FeldDef[] = [
  { key: 'firmenname', label: 'Firmenname', pflicht: true, spalte: 1 },
  { key: 'standort', label: 'Standort', spalte: 2 },
  { key: 'branche', label: 'Branche', spalte: 1 },
  { key: 'status', label: 'Status', typ: 'select', spalte: 2, optionen: [
    { value: 'eingehend', label: 'Eingehend' }, { value: 'aktiv', label: 'Aktiv' },
    { value: 'interessent_vorhanden', label: 'Interessent vorhanden' }, { value: 'kontakt_laeuft', label: 'Kontakt läuft' },
    { value: 'vermittelt', label: 'Vermittelt' }, { value: 'pausiert', label: 'Pausiert' },
  ] },
  { key: 'ziel', label: 'Ziel', pflicht: true },
  { key: 'beschreibung', label: 'Beschreibung', typ: 'textarea' },
  { key: 'ansprechpartner', label: 'Ansprechpartner', spalte: 1 },
  { key: 'email', label: 'E-Mail', typ: 'email', spalte: 2 },
  { key: 'telefon', label: 'Telefon', typ: 'tel', spalte: 1 },
  { key: 'sichtbarkeit', label: 'Sichtbarkeit', typ: 'select', spalte: 2, optionen: [
    { value: 'oeffentlich', label: 'Öffentlich' }, { value: 'anonym', label: 'Anonym' }, { value: 'intern', label: 'Intern' },
  ] },
];

export default function AnfragenPage() {
  const store = useStore();
  const [filterStatus, setFilterStatus] = useState('alle');
  const [filterRichtung, setFilterRichtung] = useState('alle');
  // Variante B: nur eine Anfrage gleichzeitig offen
  const [offeneIds, setOffeneIds] = useState<Set<string>>(new Set());
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const zeigeToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const toggleDetail = (id: string) => {
    setOffeneIds(prev => {
      const neu = new Set(prev);
      if (neu.has(id)) {
        neu.delete(id);
      } else {
        // Variante B: alles andere zuklappen, dann diese öffnen
        neu.clear();
        neu.add(id);
      }
      return neu;
    });
  };

  const filtered = store.anfragen.filter(a => {
    if (filterStatus !== 'alle' && a.status !== filterStatus) return false;
    if (filterRichtung !== 'alle' && a.richtung !== filterRichtung) return false;
    return true;
  });

  const editAnfrage = editId ? store.anfragen.find(a => a.id === editId) : null;

  const speichereAnfrage = async (werte: Record<string, any>) => {
    if (editId) {
      store.updateAnfrage(editId, werte);
      store.logge(`Anfrage bearbeitet: ${werte.firmenname}`, werte.anzeigenId || werte.firmenname, 'bearbeiten');
      if (werte.status) {
        try {
          await fetch('/api/anfragen', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editId, status: werte.status }),
          });
          zeigeToast(`✅ Anfrage gespeichert und in Datenbank aktualisiert`);
        } catch {
          zeigeToast(`⚠️ Lokal gespeichert – DB-Update fehlgeschlagen`);
        }
      } else {
        zeigeToast(`Anfrage aktualisiert ✓`);
      }
    }
    setEditId(null);
  };

  // KPIs
  const eingehend = store.anfragen.filter(a => a.status === 'eingehend').length;
  const aktivCount = store.anfragen.filter(a => a.status === 'aktiv').length;
  const vermittelt = store.anfragen.filter(a => a.status === 'vermittelt').length;

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, backgroundColor: '#003366', color: 'white', padding: '14px 20px', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '14px', fontWeight: 600 }}>
          {toast}
        </div>
      )}

      {/* Edit-Modal */}
      {editAnfrage && (
        <EntityModal
          titel="Anfrage bearbeiten"
          felder={ANFRAGE_FELDER}
          initial={editAnfrage as any}
          onSpeichern={speichereAnfrage}
          onSchliessen={() => setEditId(null)}
        />
      )}

      <div style={{ marginBottom: '8px' }}>
        <h1 style={{ margin: 0, color: '#003366', fontSize: '24px' }}>Anfragen</h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
          Eingangskorb — Klick auf eine Anfrage öffnet die Details direkt darunter.
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', margin: '24px 0' }}>
        {[
          { label: 'Anfragen gesamt', value: store.anfragen.length, color: '#003366' },
          { label: '⏳ Eingehend', value: eingehend, color: '#FF9900' },
          { label: '🌐 Aktiv', value: aktivCount, color: '#4CAF50' },
          { label: '🏆 Vermittelt', value: vermittelt, color: '#9C27B0' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.07)', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '12px', color: '#666' }}>{s.label}</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: s.color, marginTop: '4px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '4px' }}>Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', minWidth: '160px' }}>
            <option value="alle">Alle Status</option>
            <option value="eingehend">Eingehend</option>
            <option value="aktiv">Aktiv</option>
            <option value="interessent_vorhanden">Interessent vorhanden</option>
            <option value="kontakt_laeuft">Kontakt läuft</option>
            <option value="vermittelt">Vermittelt</option>
            <option value="pausiert">Pausiert</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '4px' }}>Richtung</label>
          <select value={filterRichtung} onChange={e => setFilterRichtung(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', minWidth: '160px' }}>
            <option value="alle">Alle Richtungen</option>
            <option value="de_dk">Deutschland → Dänemark</option>
            <option value="dk_de">Dänemark → Deutschland</option>
          </select>
        </div>
        <div style={{ fontSize: '14px', color: '#666', paddingBottom: '9px' }}>
          {filtered.length} Anfrage(n)
        </div>
      </div>

      {/* Liste mit Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '14px', backgroundColor: 'white', borderRadius: '8px' }}>
            Keine Anfragen gefunden.
          </div>
        ) : filtered.map(a => {
          const isOpen = offeneIds.has(a.id);
          return (
            <div key={a.id} style={{
              borderRadius: '10px', overflow: 'hidden',
              boxShadow: isOpen ? '0 4px 16px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.07)',
              transition: 'box-shadow 0.2s',
            }}>
              {/* ── Karten-Header (immer sichtbar) ── */}
              <div
                onClick={() => toggleDetail(a.id)}
                style={{
                  backgroundColor: 'white', padding: '16px 20px', cursor: 'pointer',
                  borderLeft: `5px solid ${getStatusColor(a.status)}`,
                  borderBottom: isOpen ? '1px solid #f0f0f0' : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#999', backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>{a.anzeigenId}</span>
                    <span style={{ fontWeight: 700, fontSize: '16px', color: '#003366' }}>{a.firmenname}</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>{getRichtungLabel(a.richtung)}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>{a.ziel}</div>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#888', flexWrap: 'wrap' }}>
                    <span>{a.branche}</span>
                    <span>{a.standort}</span>
                    {a.funFactAntwort && (
                      <span title={a.funFactAntwortKI || a.funFactAntwort} style={{ filter: a.funFactOeffentlich ? 'none' : 'grayscale(1)' }}>
                        {a.funFactOeffentlich ? '😊 FunFact' : '🔒 FunFact (intern)'}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{
                    display: 'inline-block', minWidth: '28px', height: '24px', borderRadius: '12px', lineHeight: '24px', padding: '0 8px',
                    backgroundColor: a.interessentenCount > 0 ? '#e8f5e9' : '#f5f5f5',
                    color: a.interessentenCount > 0 ? '#2e7d32' : '#999',
                    fontWeight: 700, fontSize: '12px',
                  }}>
                    {a.interessentenCount} 👥
                  </span>
                  <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, color: 'white', backgroundColor: getStatusColor(a.status) }}>
                    {getStatusLabel(a.status)}
                  </span>
                </div>
                <span style={{ fontSize: '18px', color: '#ccc', flexShrink: 0, lineHeight: 1 }}>{isOpen ? '▴' : '▾'}</span>
              </div>

              {/* ── Detail (Accordion) ── */}
              {isOpen && (
                <AnfrageInhalt
                  anfrage={a}
                  store={store}
                  onEdit={() => setEditId(a.id)}
                  onToast={zeigeToast}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ACCORDION-INHALT ─────────────────────────────────────────

function AnfrageInhalt({ anfrage: a, store, onEdit, onToast }: {
  anfrage: MockAnfrage;
  store: ReturnType<typeof useStore>;
  onEdit: () => void;
  onToast: (m: string) => void;
}) {
  const [kiLaedt, setKiLaedt] = useState(false);
  const [kiErgebnis, setKiErgebnis] = useState<string | null>(null);
  const [duplikatKandidaten, setDuplikatKandidaten] = useState<typeof store.unternehmen | null>(null);

  const interessenten = MOCK_INTERESSENTEN.filter(i => i.anfrageId === a.id);
  const verknuepftesUnternehmen = a.unternehmensId ? store.unternehmen.find(u => u.id === a.unternehmensId) : null;

  // Aktionen
  async function statusSchnellAendern(neuerStatus: string, label: string) {
    store.updateAnfrage(a.id, { status: neuerStatus });
    store.logge(`Status geändert zu "${label}"`, a.anzeigenId || a.id, 'status');
    try {
      const res = await fetch('/api/anfragen', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: a.id, status: neuerStatus }),
      });
      if (res.ok) {
        onToast(`✅ Status auf "${label}" gesetzt — Änderung live auf der Homepage`);
      } else {
        onToast(`⚠️ DB-Update fehlgeschlagen.`);
      }
    } catch {
      onToast(`⚠️ Verbindungsfehler – Status nur lokal geändert`);
    }
  }

  function unternehmenAnlegen() {
    const kandidaten = store.unternehmen.filter(u =>
      u.firmenname.toLowerCase() === a.firmenname.toLowerCase() ||
      u.email.toLowerCase() === a.email.toLowerCase()
    );
    if (kandidaten.length > 0) {
      setDuplikatKandidaten(kandidaten);
    } else {
      store.legeUnternehmenAusAnfrageAn(a.id);
      onToast(`✅ Unternehmen "${a.firmenname}" angelegt`);
    }
  }

  function projektErstellen() {
    store.setzeWorkflowStatus(a.id, 'projekt_erstellt');
    store.logge('Projekt aus Anfrage erstellt', a.anzeigenId || a.id, 'anlegen');
    onToast(`✅ Projekt erstellt — jetzt unter "Projekte" sichtbar`);
  }

  async function kiVerbessern() {
    if (!a.funFactFrage || !a.funFactAntwort) return;
    setKiLaedt(true);
    await new Promise(r => setTimeout(r, 1000));
    const verbessert = verbessereAntwortMock(a.funFactFrage, a.funFactAntwort, a.firmenname);
    setKiErgebnis(verbessert);
    setKiLaedt(false);
  }

  const formular = a.anfrageFormularId ? store.formulare.find(f => f.id === a.anfrageFormularId) : null;

  return (
    <div style={{ backgroundColor: '#f9fafb', padding: '24px' }}>
      {/* ── PROZESS-FORTSCHRITTSLEISTE ── */}
      <Section titel="Workflow-Fortschritt">
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '4px 0' }}>
          {WORKFLOW_SCHRITTE.filter(w => w.status !== 'archiviert').map((w, idx, arr) => {
            const aktuell = getWorkflowStatusSchritt(a.workflowStatus);
            const istErledigt = w.schritt < aktuell;
            const istAktiv = w.schritt === aktuell;
            return (
              <div key={w.status} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700,
                    backgroundColor: istErledigt ? '#4CAF50' : istAktiv ? getWorkflowStatusColor(w.status) : '#e0e0e0',
                    color: istErledigt || istAktiv ? 'white' : '#999',
                    boxShadow: istAktiv ? `0 0 0 4px ${getWorkflowStatusColor(w.status)}30` : 'none',
                  }}>
                    {istErledigt ? '✓' : w.schritt}
                  </div>
                  <div style={{ fontSize: '10px', color: istAktiv ? getWorkflowStatusColor(w.status) : '#999', fontWeight: istAktiv ? 700 : 400, whiteSpace: 'nowrap' }}>{w.label}</div>
                </div>
                {idx < arr.length - 1 && (
                  <div style={{ flex: 1, height: '2px', backgroundColor: istErledigt ? '#4CAF50' : '#e0e0e0', marginBottom: '16px', minWidth: '20px' }} />
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── WORKFLOW-AKTIONEN ── */}
      {(!a.workflowStatus || a.workflowStatus === 'neu' || a.workflowStatus === 'in_pruefung') && (
        <div style={{ backgroundColor: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1565C0', marginBottom: '10px' }}>
            🏢 Nächster Schritt: Unternehmen aus dieser Anfrage anlegen
          </div>
          {duplikatKandidaten ? (
            <div>
              <div style={{ fontSize: '12px', color: '#c62828', marginBottom: '10px', padding: '8px 10px', backgroundColor: '#ffebee', borderRadius: '6px' }}>
                ⚠️ Mögliches bestehendes Unternehmen gefunden: <strong>{duplikatKandidaten.map(k => k.firmenname).join(', ')}</strong>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => { store.legeUnternehmenAusAnfrageAn(a.id); setDuplikatKandidaten(null); onToast('✅ Neues Unternehmen angelegt'); }}
                  style={btnStyle('#1565C0')}>+ Trotzdem neu anlegen</button>
                {duplikatKandidaten.map(k => (
                  <button key={k.id} onClick={() => { store.verknuepfeMitUnternehmen(a.id, k.id); setDuplikatKandidaten(null); onToast(`✅ Mit "${k.firmenname}" verknüpft`); }}
                    style={{ ...btnStyle('white'), color: '#1565C0', border: '1px solid #1565C0' }}>
                    🔗 Mit „{k.firmenname}" verknüpfen
                  </button>
                ))}
                <button onClick={() => setDuplikatKandidaten(null)} style={{ ...btnStyle('#f5f5f5'), color: '#666', border: '1px solid #ddd' }}>Abbrechen</button>
              </div>
            </div>
          ) : (
            <button onClick={unternehmenAnlegen} style={btnStyle('#1565C0')}>🏢 Unternehmen aus Anfrage anlegen</button>
          )}
        </div>
      )}

      {(a.workflowStatus === 'unternehmen_angelegt' || a.workflowStatus === 'unternehmen_verifiziert') && (
        <div style={{ backgroundColor: '#f3e5f5', border: '1px solid #ce93d8', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#6a1b9a', marginBottom: '10px' }}>
            🚀 Nächster Schritt: Projekt erstellen
            {a.workflowStatus === 'unternehmen_angelegt' && (
              <span style={{ marginLeft: '8px', padding: '2px 6px', backgroundColor: '#fff3e0', color: '#E65100', borderRadius: '4px', fontSize: '10px' }}>
                ⚠️ Unternehmen noch nicht verifiziert
              </span>
            )}
          </div>
          <button onClick={projektErstellen} style={btnStyle('#6a1b9a')}>🚀 Projekt erstellen → Projekte-Modul</button>
        </div>
      )}

      {/* ── SCHNELL-AKTIONEN nach Marktplatz-Status ── */}
      {a.status === 'eingehend' && (
        <div style={{ backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#8a6d00', marginBottom: '10px' }}>
            ⏳ Wartet auf Prüfung — Anfrage ist noch nicht öffentlich sichtbar
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => statusSchnellAendern('aktiv', 'Aktiv')} style={btnStyle('#4CAF50')}>✅ Freigeben & auf Marktplatz</button>
            <button onClick={() => statusSchnellAendern('pausiert', 'Pausiert')} style={{ ...btnStyle('#f5f5f5'), color: '#666', border: '1px solid #ddd' }}>⏸ Ablehnen / Pausieren</button>
          </div>
        </div>
      )}

      {a.status === 'aktiv' && (
        <div style={{ backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#2e7d32', marginBottom: '10px' }}>
            🌐 Öffentlich sichtbar auf dem Marktplatz
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => statusSchnellAendern('pausiert', 'Pausiert')} style={{ ...btnStyle('#f5f5f5'), color: '#666', border: '1px solid #ddd' }}>⏸ Vom Marktplatz nehmen</button>
            <button onClick={() => statusSchnellAendern('vermittelt', 'Vermittelt')} style={btnStyle('#9C27B0')}>🏆 Als vermittelt markieren</button>
          </div>
        </div>
      )}

      {a.status === 'pausiert' && (
        <div style={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#666', marginBottom: '10px' }}>⏸ Pausiert — nicht öffentlich sichtbar</div>
          <button onClick={() => statusSchnellAendern('aktiv', 'Aktiv')} style={btnStyle('#4CAF50')}>▶ Wieder auf Marktplatz schalten</button>
        </div>
      )}

      {/* 2-Spalten-Layout: Inhalt + Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* LINKE SPALTE */}
        <div>
          {/* Anfrage-Inhalt */}
          <Section titel="Beschreibung">
            <p style={{ fontSize: '14px', color: '#333', lineHeight: 1.7, margin: 0 }}>{a.beschreibung}</p>
            {formular && (
              <div style={{ marginTop: '12px', padding: '10px 12px', backgroundColor: '#f0f4ff', borderRadius: '6px', fontSize: '12px', color: '#555' }}>
                📝 <strong>Anfrageformular:</strong> {formular.name} ({formular.fragen.length} Fragen)
                <a href="/dashboard/formulare" style={{ marginLeft: '8px', color: '#003366', fontWeight: 600, textDecoration: 'none' }}>ansehen →</a>
              </div>
            )}
          </Section>

          {/* Interessenten */}
          <Section titel={`Interessenten (${interessenten.length})`}>
            {interessenten.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>Noch keine Interessenten für diese Anfrage.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {interessenten.map(i => (
                  <div key={i.id} style={{ padding: '12px 14px', backgroundColor: 'white', borderRadius: '8px', borderLeft: `3px solid ${getStatusColor(i.status)}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '4px' }}>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#003366' }}>{i.firmenname}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        {i.matchScore && <span style={{ fontSize: '11px', fontWeight: 700, color: i.matchScore >= 80 ? '#4CAF50' : '#FF9900' }}>{i.matchScore}%</span>}
                        <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, color: 'white', backgroundColor: getStatusColor(i.status) }}>{getStatusLabel(i.status)}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{i.ansprechpartner}</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      <a href={`mailto:${i.email}`} style={{ color: '#003366' }}>{i.email}</a>
                      {i.telefon && <span style={{ color: '#999' }}> · {i.telefon}</span>}
                    </div>
                    {i.notiz && (
                      <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', marginTop: '6px', padding: '6px 8px', backgroundColor: '#fffde7', borderRadius: '4px' }}>{i.notiz}</div>
                    )}
                  </div>
                ))}
                <a href="/dashboard/interessenten" style={{ fontSize: '12px', color: '#003366', fontWeight: 600, textDecoration: 'none', marginTop: '4px' }}>
                  → Im Interessenten-Modul verwalten
                </a>
              </div>
            )}
          </Section>

          {/* FunFact & Persönliche Note */}
          {a.funFactFrage && (
            <Section titel="Persönliche Note (FunFact)">
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, marginBottom: '12px',
                backgroundColor: a.funFactOeffentlich ? '#e8f5e9' : '#f5f5f5',
                color: a.funFactOeffentlich ? '#2e7d32' : '#666',
              }}>
                {a.funFactOeffentlich ? '🌐 Öffentlich sichtbar' : '🔒 Nur intern'}
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px', fontStyle: 'italic' }}>
                Frage: {a.funFactFrage}
              </div>
              <div style={{ backgroundColor: 'white', borderRadius: '6px', padding: '12px', marginBottom: '12px', fontSize: '13px', color: '#444' }}>
                <div style={{ fontSize: '10px', color: '#999', marginBottom: '4px', fontWeight: 700 }}>ORIGINAL-ANTWORT</div>
                {a.funFactAntwort}
              </div>
              {(kiErgebnis || a.funFactAntwortKI) && (
                <div style={{ backgroundColor: '#e8f0fe', borderRadius: '6px', padding: '12px', marginBottom: '12px', fontSize: '13px', color: '#333', border: '1px solid #c5d3f0' }}>
                  <div style={{ fontSize: '10px', color: '#003366', marginBottom: '6px', fontWeight: 700 }}>
                    ✨ KI-VERBESSERUNG {kiErgebnis && <span style={{ backgroundColor: '#003366', color: 'white', padding: '1px 6px', borderRadius: '4px', fontSize: '9px', marginLeft: '6px' }}>NEU</span>}
                  </div>
                  {kiErgebnis || a.funFactAntwortKI}
                </div>
              )}
              <button onClick={kiVerbessern} disabled={kiLaedt}
                style={{
                  padding: '8px 14px',
                  backgroundColor: kiLaedt ? '#ccc' : '#003366',
                  color: 'white', border: 'none', borderRadius: '6px',
                  cursor: kiLaedt ? 'wait' : 'pointer', fontSize: '12px', fontWeight: 600,
                }}>
                {kiLaedt ? '✨ KI verbessert…' : '✨ FunFact mit KI verbessern'}
              </button>
            </Section>
          )}

          {a.kulturHinweis && (
            <Section titel="Kulturhinweis (intern)">
              <div style={{ backgroundColor: '#fff8e1', borderRadius: '6px', padding: '12px', fontSize: '13px', color: '#555', border: '1px solid #ffe082' }}>
                🌍 {a.kulturHinweis}
              </div>
            </Section>
          )}

          {a.gespraechseinstieg && (
            <Section titel="Gesprächseinstieg">
              <div style={{ backgroundColor: '#e8f5e9', borderRadius: '6px', padding: '12px', fontSize: '13px', color: '#2e7d32', border: '1px solid #a5d6a7' }}>
                💬 {a.gespraechseinstieg}
              </div>
            </Section>
          )}
        </div>

        {/* RECHTE SPALTE: Sidebar mit Eckdaten */}
        <div>
          {/* Aktions-Buttons */}
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '14px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <button onClick={onEdit} style={{ width: '100%', padding: '10px', backgroundColor: '#FF9900', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              ✏️ Anfrage bearbeiten
            </button>
          </div>

          {/* Verknüpftes Unternehmen */}
          {verknuepftesUnternehmen && (
            <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '14px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                🏢 Verknüpftes Unternehmen
              </div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#003366', marginBottom: '4px' }}>{verknuepftesUnternehmen.firmenname}</div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{verknuepftesUnternehmen.ansprechpartner}</div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
                <strong>Verifizierung:</strong> {verknuepftesUnternehmen.verifizierungsStatus}
              </div>
              <a href="/dashboard/unternehmen" style={{ fontSize: '12px', color: '#003366', fontWeight: 600, textDecoration: 'none' }}>
                → Zur Unternehmensakte
              </a>
            </div>
          )}

          {/* Kontaktdaten */}
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '14px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              📞 Kontaktdaten
            </div>
            <Row label="Person" value={a.ansprechpartner} />
            <Row label="E-Mail" value={<a href={`mailto:${a.email}`} style={{ color: '#003366' }}>{a.email}</a>} />
            {a.telefon && <Row label="Telefon" value={a.telefon} />}
            <Row label="Standort" value={a.standort} />
            <Row label="Sichtbarkeit" value={a.sichtbarkeit} />
          </div>

          {/* Eckdaten */}
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              📋 Eckdaten
            </div>
            <Row label="Branche" value={a.branche} />
            <Row label="Art" value={a.art} />
            <Row label="Eingegangen" value={a.createdAt} />
            <Row label="Interessenten" value={String(a.interessentenCount)} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HILFSKOMPONENTEN ─────────────────────────────────────────

function Section({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 700, color: '#003366', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{titel}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: '12px' }}>
      <span style={{ color: '#999', width: '90px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#333', wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}

function btnStyle(bg: string): React.CSSProperties {
  return { padding: '8px 14px', backgroundColor: bg, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 };
}
