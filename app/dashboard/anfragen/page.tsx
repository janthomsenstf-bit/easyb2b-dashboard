'use client';

import { useState } from 'react';
import {
  getStatusLabel, getStatusColor, getRichtungLabel, MOCK_INTERESSENTEN,
  getWorkflowStatusLabel, getWorkflowStatusColor, getWorkflowStatusSchritt,
  WORKFLOW_SCHRITTE, type AnfrageWorkflowStatus,
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
  const [detailId, setDetailId] = useState<string | null>(null);
  const [kiLaedt, setKiLaedt] = useState<string | null>(null);
  const [kiErgebnisse, setKiErgebnisse] = useState<Record<string, string>>({});
  const [editOffen, setEditOffen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [duplikatWarnung, setDuplikatWarnung] = useState<{ anfrageId: string; kandidaten: typeof store.unternehmen } | null>(null);

  const zeigeToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = store.anfragen.filter(a => {
    if (filterStatus !== 'alle' && a.status !== filterStatus) return false;
    if (filterRichtung !== 'alle' && a.richtung !== filterRichtung) return false;
    return true;
  });

  const selectedAnfrage = detailId ? store.anfragen.find(a => a.id === detailId) : null;

  const speichereAnfrage = async (werte: Record<string, any>) => {
    if (detailId) {
      // Lokal sofort aktualisieren
      store.updateAnfrage(detailId, werte);
      store.logge(`Anfrage bearbeitet: ${werte.firmenname}`, werte.anzeigenId || werte.firmenname, 'bearbeiten');
      // Status in DB persistieren
      if (werte.status) {
        try {
          await fetch('/api/anfragen', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: detailId, status: werte.status }),
          });
          zeigeToast(`✅ Anfrage gespeichert und in Datenbank aktualisiert`);
        } catch {
          zeigeToast(`⚠️ Lokal gespeichert – DB-Update fehlgeschlagen`);
        }
      } else {
        zeigeToast(`Anfrage aktualisiert ✓`);
      }
    }
    setEditOffen(false);
  };

  const unternehmenAnlegen = (anfrageId: string) => {
    const anfrage = store.anfragen.find(a => a.id === anfrageId);
    if (!anfrage) return;
    // Duplikat-Check
    const kandidaten = store.unternehmen.filter(u =>
      u.firmenname.toLowerCase() === anfrage.firmenname.toLowerCase() ||
      u.email.toLowerCase() === anfrage.email.toLowerCase()
    );
    if (kandidaten.length > 0) {
      setDuplikatWarnung({ anfrageId, kandidaten });
    } else {
      store.legeUnternehmenAusAnfrageAn(anfrageId);
      zeigeToast(`✅ Unternehmen "${anfrage.firmenname}" angelegt`);
    }
  };

  const projektErstellen = (anfrageId: string) => {
    const anfrage = store.anfragen.find(a => a.id === anfrageId);
    if (!anfrage) return;
    store.setzeWorkflowStatus(anfrageId, 'projekt_erstellt');
    store.logge(`Projekt aus Anfrage erstellt`, anfrage.anzeigenId || anfrageId, 'anlegen');
    zeigeToast(`✅ Projekt erstellt — jetzt unter "Projekte" sichtbar`);
  };

  const statusSchnellAendern = async (anfrageId: string, neuerStatus: string, label: string) => {
    store.updateAnfrage(anfrageId, { status: neuerStatus });
    store.logge(`Status geändert zu "${label}"`, anfrageId, 'status');
    try {
      const res = await fetch('/api/anfragen', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: anfrageId, status: neuerStatus }),
      });
      if (res.ok) {
        zeigeToast(`✅ Status auf "${label}" gesetzt — Änderung live auf der Homepage`);
      } else {
        zeigeToast(`⚠️ DB-Update fehlgeschlagen. Bitte nochmal versuchen.`);
      }
    } catch {
      zeigeToast(`⚠️ Verbindungsfehler – Status nur lokal geändert`);
    }
  };

  const handleKiVerbessern = async (anfrageId: string, frage: string, antwort: string, firma: string) => {
    setKiLaedt(anfrageId);
    // Mock: 1 Sekunde "Ladezeit" simulieren
    await new Promise(r => setTimeout(r, 1000));
    const verbessert = verbessereAntwortMock(frage, antwort, firma);
    setKiErgebnisse(prev => ({ ...prev, [anfrageId]: verbessert }));
    setKiLaedt(null);
  };

  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          backgroundColor: '#003366', color: 'white', padding: '14px 20px',
          borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontSize: '14px', fontWeight: 600,
        }}>{toast}</div>
      )}
      {editOffen && selectedAnfrage && (
        <EntityModal
          titel="Anfrage bearbeiten"
          felder={ANFRAGE_FELDER}
          initial={selectedAnfrage as any}
          onSpeichern={speichereAnfrage}
          onSchliessen={() => setEditOffen(false)}
        />
      )}
      {/* LINKE SPALTE: Tabelle */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ marginTop: 0, marginBottom: '24px', color: '#003366', fontSize: '24px' }}>
          Anfragen Verwaltung
        </h1>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
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
          <div style={{ alignSelf: 'flex-end', fontSize: '14px', color: '#666' }}>
            {filtered.length} Anfrage(n)
          </div>
        </div>

        {/* Tabelle */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#003366', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Richtung</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Firma</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Ziel</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>FunFact</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Interessenten</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, idx) => (
                <tr
                  key={a.id}
                  onClick={() => setDetailId(detailId === a.id ? null : a.id)}
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: detailId === a.id ? '#f0f4ff' : idx % 2 === 0 ? 'white' : '#fafafa',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { if (detailId !== a.id) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#f9f9f9'; }}
                  onMouseLeave={e => { if (detailId !== a.id) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = idx % 2 === 0 ? 'white' : '#fafafa'; }}
                >
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{a.anzeigenId}</td>
                  <td style={{ padding: '12px' }}>{getRichtungLabel(a.richtung)}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600 }}>{a.firmenname}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{a.standort}</div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', maxWidth: '200px' }}>{a.ziel}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {a.funFactAntwort ? (
                      <span title={a.funFactAntwortKI || a.funFactAntwort} style={{
                        fontSize: '16px', cursor: 'help',
                        filter: a.funFactOeffentlich ? 'none' : 'grayscale(1)',
                      }}>
                        {a.funFactOeffentlich ? '😊' : '🔒'}
                      </span>
                    ) : (
                      <span style={{ color: '#ccc', fontSize: '13px' }}>–</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block', width: '28px', height: '28px', borderRadius: '50%', lineHeight: '28px',
                      backgroundColor: a.interessentenCount > 0 ? '#e8f5e9' : '#f5f5f5',
                      color: a.interessentenCount > 0 ? '#4CAF50' : '#999',
                      fontWeight: 600, fontSize: '13px', textAlign: 'center',
                    }}>
                      {a.interessentenCount}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '12px', fontSize: '11px',
                      fontWeight: 600, color: 'white', backgroundColor: getStatusColor(a.status),
                    }}>
                      {getStatusLabel(a.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECHTES DETAIL-PANEL */}
      {selectedAnfrage && (
        <div style={{
          width: '380px', flexShrink: 0, backgroundColor: 'white',
          borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          padding: '24px', alignSelf: 'flex-start', position: 'sticky', top: '20px',
          maxHeight: 'calc(100vh - 80px)', overflowY: 'auto',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ margin: 0, color: '#003366', fontSize: '17px' }}>{selectedAnfrage.firmenname}</h2>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                {getRichtungLabel(selectedAnfrage.richtung)} · {selectedAnfrage.anzeigenId}
              </div>
            </div>
            <button onClick={() => setDetailId(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#999' }}>×</button>
          </div>

          {/* ── PROZESS-FORTSCHRITTSLEISTE ── */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '6px' }}>
              {WORKFLOW_SCHRITTE.filter(w => w.status !== 'archiviert').map((w, idx, arr) => {
                const aktuell = getWorkflowStatusSchritt(selectedAnfrage.workflowStatus);
                const istErledigt = w.schritt < aktuell;
                const istAktiv = w.schritt === aktuell;
                return (
                  <div key={w.status} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', fontWeight: 700, flexShrink: 0,
                        backgroundColor: istErledigt ? '#4CAF50' : istAktiv ? getWorkflowStatusColor(w.status) : '#e0e0e0',
                        color: istErledigt || istAktiv ? 'white' : '#999',
                        boxShadow: istAktiv ? `0 0 0 3px ${getWorkflowStatusColor(w.status)}30` : 'none',
                      }}>
                        {istErledigt ? '✓' : w.schritt}
                      </div>
                      <div style={{ fontSize: '9px', color: istAktiv ? getWorkflowStatusColor(w.status) : '#999', fontWeight: istAktiv ? 700 : 400, whiteSpace: 'nowrap' }}>{w.label}</div>
                    </div>
                    {idx < arr.length - 1 && (
                      <div style={{ flex: 1, height: '2px', backgroundColor: istErledigt ? '#4CAF50' : '#e0e0e0', marginBottom: '12px' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── WORKFLOW-AKTIONEN ── */}
          {/* Schritt: Unternehmen anlegen */}
          {(!selectedAnfrage.workflowStatus || selectedAnfrage.workflowStatus === 'neu' || selectedAnfrage.workflowStatus === 'in_pruefung') && (
            <div style={{ backgroundColor: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1565C0', marginBottom: '8px' }}>
                🏢 Nächster Schritt: Unternehmen anlegen
              </div>
              {duplikatWarnung?.anfrageId === selectedAnfrage.id ? (
                <div>
                  <div style={{ fontSize: '12px', color: '#c62828', marginBottom: '8px', padding: '8px', backgroundColor: '#ffebee', borderRadius: '6px' }}>
                    ⚠️ Mögliches bestehendes Unternehmen gefunden: <strong>{duplikatWarnung.kandidaten.map(k => k.firmenname).join(', ')}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button onClick={() => { store.legeUnternehmenAusAnfrageAn(selectedAnfrage.id); setDuplikatWarnung(null); zeigeToast('✅ Neues Unternehmen angelegt'); }}
                      style={{ padding: '6px 12px', backgroundColor: '#1565C0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                      + Trotzdem neu anlegen
                    </button>
                    {duplikatWarnung.kandidaten.map(k => (
                      <button key={k.id} onClick={() => { store.verknuepfeMitUnternehmen(selectedAnfrage.id, k.id); setDuplikatWarnung(null); zeigeToast(`✅ Mit "${k.firmenname}" verknüpft`); }}
                        style={{ padding: '6px 12px', backgroundColor: 'white', color: '#1565C0', border: '1px solid #1565C0', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                        🔗 Mit "{k.firmenname}" verknüpfen
                      </button>
                    ))}
                    <button onClick={() => setDuplikatWarnung(null)}
                      style={{ padding: '6px 12px', backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                      Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => unternehmenAnlegen(selectedAnfrage.id)}
                  style={{ padding: '8px 14px', backgroundColor: '#1565C0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
                  🏢 Unternehmen aus Anfrage anlegen
                </button>
              )}
            </div>
          )}

          {/* Schritt: Projekt erstellen */}
          {(selectedAnfrage.workflowStatus === 'unternehmen_angelegt' || selectedAnfrage.workflowStatus === 'unternehmen_verifiziert') && (
            <div style={{ backgroundColor: '#f3e5f5', border: '1px solid #ce93d8', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#6a1b9a', marginBottom: '8px' }}>
                🚀 Nächster Schritt: Projekt erstellen
                {selectedAnfrage.workflowStatus === 'unternehmen_angelegt' && (
                  <span style={{ marginLeft: '8px', padding: '2px 6px', backgroundColor: '#fff3e0', color: '#E65100', borderRadius: '4px', fontSize: '10px' }}>
                    ⚠️ Unternehmen noch nicht verifiziert
                  </span>
                )}
              </div>
              <button onClick={() => projektErstellen(selectedAnfrage.id)}
                style={{ padding: '8px 14px', backgroundColor: '#6a1b9a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
                🚀 Projekt erstellen → Projekte-Modul
              </button>
            </div>
          )}

          {/* Status + Bearbeiten */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{
              padding: '4px 12px', borderRadius: '12px', fontSize: '12px',
              fontWeight: 600, color: 'white', backgroundColor: getStatusColor(selectedAnfrage.status),
            }}>
              {getStatusLabel(selectedAnfrage.status)}
            </span>
            <button onClick={() => setEditOffen(true)} style={{ padding: '6px 14px', backgroundColor: '#FF9900', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
              ✏️ Bearbeiten
            </button>
          </div>

          {/* ── SCHNELL-AKTIONEN nach Status ── */}
          {selectedAnfrage.status === 'eingehend' && (
            <div style={{ backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#8a6d00', marginBottom: '10px' }}>
                ⏳ Wartet auf Prüfung — Anfrage ist noch nicht öffentlich sichtbar
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => statusSchnellAendern(selectedAnfrage.id, 'aktiv', 'Aktiv')}
                  style={{ padding: '8px 14px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
                  ✅ Freigeben & auf Marktplatz
                </button>
                <button
                  onClick={() => statusSchnellAendern(selectedAnfrage.id, 'pausiert', 'Pausiert')}
                  style={{ padding: '8px 14px', backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  ⏸ Ablehnen / Pausieren
                </button>
              </div>
            </div>
          )}

          {selectedAnfrage.status === 'aktiv' && (
            <div style={{ backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#2e7d32', marginBottom: '10px' }}>
                🌐 Öffentlich sichtbar auf dem Marktplatz
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => statusSchnellAendern(selectedAnfrage.id, 'pausiert', 'Pausiert')}
                  style={{ padding: '8px 14px', backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  ⏸ Vom Marktplatz nehmen
                </button>
                <button
                  onClick={() => statusSchnellAendern(selectedAnfrage.id, 'vermittelt', 'Vermittelt')}
                  style={{ padding: '8px 14px', backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  🏆 Als vermittelt markieren
                </button>
              </div>
            </div>
          )}

          {selectedAnfrage.status === 'pausiert' && (
            <div style={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#666', marginBottom: '10px' }}>
                ⏸ Pausiert — nicht öffentlich sichtbar
              </div>
              <button
                onClick={() => statusSchnellAendern(selectedAnfrage.id, 'aktiv', 'Aktiv')}
                style={{ padding: '8px 14px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
                ▶ Wieder auf Marktplatz schalten
              </button>
            </div>
          )}

          {/* Beschreibung */}
          <div style={{ marginTop: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
            <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.6, margin: 0 }}>{selectedAnfrage.beschreibung}</p>
          </div>

          {/* ── INTERESSENTEN für diese Anfrage ─── */}
          {(() => {
            const interessenten = MOCK_INTERESSENTEN.filter(i => i.anfrageId === selectedAnfrage.id);
            return (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 700, color: '#003366', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Interessenten ({interessenten.length})
                </h3>
                {interessenten.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>Noch keine Interessenten für diese Anfrage.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {interessenten.map(i => (
                      <div key={i.id} style={{
                        padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px',
                        borderLeft: `3px solid ${getStatusColor(i.status)}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: '#003366' }}>{i.firmenname}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {i.matchScore && (
                              <span style={{ fontSize: '11px', fontWeight: 700, color: i.matchScore >= 80 ? '#4CAF50' : '#FF9900' }}>{i.matchScore}%</span>
                            )}
                            <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, color: 'white', backgroundColor: getStatusColor(i.status) }}>
                              {getStatusLabel(i.status)}
                            </span>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{i.ansprechpartner}</div>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>
                          <a href={`mailto:${i.email}`} style={{ color: '#003366' }}>{i.email}</a>
                          {i.telefon && <span style={{ color: '#999' }}> · {i.telefon}</span>}
                        </div>
                        {i.notiz && (
                          <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', marginTop: '6px', padding: '6px 8px', backgroundColor: '#fffde7', borderRadius: '4px' }}>
                            {i.notiz}
                          </div>
                        )}
                      </div>
                    ))}
                    <a href="/dashboard/interessenten" style={{ fontSize: '12px', color: '#003366', fontWeight: 600, textDecoration: 'none', marginTop: '4px' }}>
                      → Im Interessenten-Modul verwalten
                    </a>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── FUNFACT & PERSÖNLICHE NOTE ─── */}
          {selectedAnfrage.funFactFrage && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 700, color: '#003366', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Persönliche Note
              </h3>

              {/* Sichtbarkeit */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, marginBottom: '12px',
                backgroundColor: selectedAnfrage.funFactOeffentlich ? '#e8f5e9' : '#f5f5f5',
                color: selectedAnfrage.funFactOeffentlich ? '#2e7d32' : '#666',
              }}>
                {selectedAnfrage.funFactOeffentlich ? '🌐 Öffentlich sichtbar' : '🔒 Nur intern'}
              </div>

              {/* Frage */}
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px', fontStyle: 'italic' }}>
                Frage: {selectedAnfrage.funFactFrage}
              </div>

              {/* Roh-Antwort */}
              <div style={{ backgroundColor: '#f9f9f9', borderRadius: '6px', padding: '12px', marginBottom: '12px', fontSize: '13px', color: '#555' }}>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px', fontWeight: 600 }}>ORIGINAL-ANTWORT</div>
                {selectedAnfrage.funFactAntwort}
              </div>

              {/* KI-verbesserte Version */}
              {(kiErgebnisse[selectedAnfrage.id] || selectedAnfrage.funFactAntwortKI) ? (
                <div style={{
                  backgroundColor: '#e8f0fe', borderRadius: '6px', padding: '12px',
                  marginBottom: '12px', fontSize: '13px', color: '#333',
                  border: '1px solid #c5d3f0',
                }}>
                  <div style={{ fontSize: '11px', color: '#003366', marginBottom: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ✨ KI-VERBESSERUNG
                    {kiErgebnisse[selectedAnfrage.id] && (
                      <span style={{ backgroundColor: '#003366', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '9px' }}>NEU</span>
                    )}
                  </div>
                  {kiErgebnisse[selectedAnfrage.id] || selectedAnfrage.funFactAntwortKI}
                </div>
              ) : null}

              {/* KI-Button */}
              <button
                onClick={() => handleKiVerbessern(
                  selectedAnfrage.id,
                  selectedAnfrage.funFactFrage!,
                  selectedAnfrage.funFactAntwort!,
                  selectedAnfrage.firmenname
                )}
                disabled={kiLaedt === selectedAnfrage.id}
                style={{
                  width: '100%', padding: '10px', marginBottom: '12px',
                  backgroundColor: kiLaedt === selectedAnfrage.id ? '#ccc' : '#003366',
                  color: 'white', border: 'none', borderRadius: '6px', cursor: kiLaedt === selectedAnfrage.id ? 'wait' : 'pointer',
                  fontSize: '13px', fontWeight: 600,
                }}
              >
                {kiLaedt === selectedAnfrage.id ? '✨ KI verbessert...' : '✨ FunFact mit KI verbessern'}
              </button>
            </div>
          )}

          {/* Kulturhinweis */}
          {selectedAnfrage.kulturHinweis && (
            <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, color: '#003366', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Kulturhinweis (intern)
              </h3>
              <div style={{ backgroundColor: '#fff8e1', borderRadius: '6px', padding: '12px', fontSize: '13px', color: '#555', border: '1px solid #ffe082' }}>
                🌍 {selectedAnfrage.kulturHinweis}
              </div>
            </div>
          )}

          {/* Gesprächseinstieg */}
          {selectedAnfrage.gespraechseinstieg && (
            <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, color: '#003366', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Gesprächseinstieg
              </h3>
              <div style={{ backgroundColor: '#e8f5e9', borderRadius: '6px', padding: '12px', fontSize: '13px', color: '#2e7d32', border: '1px solid #a5d6a7' }}>
                💬 {selectedAnfrage.gespraechseinstieg}
              </div>
            </div>
          )}

          {/* Kontakt */}
          <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kontakt</h3>
            <div style={{ fontSize: '13px' }}>
              <div style={{ marginBottom: '4px' }}><span style={{ color: '#999', marginRight: '8px' }}>Person:</span>{selectedAnfrage.ansprechpartner}</div>
              <div><span style={{ color: '#999', marginRight: '8px' }}>Email:</span>
                <a href={`mailto:${selectedAnfrage.email}`} style={{ color: '#003366' }}>{selectedAnfrage.email}</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
