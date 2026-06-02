'use client';

import { useState } from 'react';
import {
  MOCK_UNTERNEHMEN,
  getVerifizierungsLabel,
  getVerifizierungsColor,
  getNetzwerkLabel,
  getNetzwerkColor,
  getGroesseLabel,
  getLandFlag,
  getEventFormatLabel,
} from '@/lib/mockdata';

export default function UnternehmenPage() {
  const [filterLand, setFilterLand] = useState('alle');
  const [filterNetzwerk, setFilterNetzwerk] = useState('alle');
  const [filterVerifiziert, setFilterVerifiziert] = useState('alle');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = MOCK_UNTERNEHMEN.filter(u => {
    if (filterLand !== 'alle' && u.land !== filterLand) return false;
    if (filterNetzwerk !== 'alle' && u.netzwerkStatus !== filterNetzwerk) return false;
    if (filterVerifiziert !== 'alle' && u.verifiziert !== filterVerifiziert) return false;
    return true;
  });

  const selectedUnternehmen = selected
    ? MOCK_UNTERNEHMEN.find(u => u.id === selected)
    : null;

  const totalDE = MOCK_UNTERNEHMEN.filter(u => u.land === 'deutschland').length;
  const totalDK = MOCK_UNTERNEHMEN.filter(u => u.land === 'daenemark').length;
  const totalVerifiziert = MOCK_UNTERNEHMEN.filter(u => u.verifiziert === 'verifiziert').length;
  const totalPartner = MOCK_UNTERNEHMEN.filter(u => u.netzwerkStatus === 'partner').length;

  return (
    <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
      {/* LINKE SPALTE: Liste */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ marginTop: 0, marginBottom: '24px', color: '#003366', fontSize: '24px' }}>
          Unternehmen
        </h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Gesamt', value: MOCK_UNTERNEHMEN.length, color: '#003366' },
            { label: '🇩🇪 Deutschland', value: totalDE, color: '#2196F3' },
            { label: '🇩🇰 Dänemark', value: totalDK, color: '#E91E63' },
            { label: '✅ Verifiziert', value: totalVerifiziert, color: '#4CAF50' },
            { label: '🤝 Partner', value: totalPartner, color: '#9C27B0' },
          ].map((s) => (
            <div key={s.label} style={{
              backgroundColor: 'white', padding: '14px', borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.07)', borderLeft: `3px solid ${s.color}`,
            }}>
              <div style={{ fontSize: '12px', color: '#666' }}>{s.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: s.color }}>{s.value}</div>
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
            { label: 'Verifiziert', value: filterVerifiziert, setter: setFilterVerifiziert, options: [
              { value: 'alle', label: 'Alle' },
              { value: 'verifiziert', label: 'Verifiziert' },
              { value: 'in_pruefung', label: 'In Prüfung' },
              { value: 'unbekannt', label: 'Unbekannt' },
            ]},
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '3px' }}>{f.label}</label>
              <select
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', minWidth: '150px' }}
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
          {filtered.map((u) => (
            <div
              key={u.id}
              onClick={() => setSelected(selected === u.id ? null : u.id)}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                border: selected === u.id ? '2px solid #003366' : '2px solid transparent',
                boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (selected !== u.id) (e.currentTarget as HTMLDivElement).style.borderColor = '#ccc'; }}
              onMouseLeave={e => { if (selected !== u.id) (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '18px' }}>{getLandFlag(u.land)}</span>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: '#003366' }}>{u.firmenname}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    {u.branche} · {u.standort} · {getGroesseLabel(u.groesse)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#444', lineHeight: 1.4 }}>
                    {u.kurzbeschreibung}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', marginLeft: '16px', flexShrink: 0 }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '10px', fontSize: '11px',
                    fontWeight: 600, color: 'white',
                    backgroundColor: getNetzwerkColor(u.netzwerkStatus),
                  }}>
                    {getNetzwerkLabel(u.netzwerkStatus)}
                  </span>
                  <span style={{
                    padding: '3px 8px', borderRadius: '10px', fontSize: '11px',
                    fontWeight: 600, color: 'white',
                    backgroundColor: getVerifizierungsColor(u.verifiziert),
                  }}>
                    {getVerifizierungsLabel(u.verifiziert)}
                  </span>
                </div>
              </div>

              {/* Footer: Aktivitäts-Badges */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f0f0f0' }}>
                <ActivityBadge label="Anfragen" count={u.anfrageCount} color="#003366" />
                <ActivityBadge label="Interessent" count={u.interessentCount} color="#2196F3" />
                <ActivityBadge label="Erfolge" count={u.successStories} color="#4CAF50" />
                <ActivityBadge label="Events" count={u.events.length} color="#FF9900" />
                <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#bbb' }}>
                  Zuletzt aktiv: {u.letzteAktivitaet}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECHTE SPALTE: Detail-Panel */}
      {selectedUnternehmen && (
        <div style={{
          width: '360px', flexShrink: 0, backgroundColor: 'white',
          borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          padding: '24px', alignSelf: 'flex-start', position: 'sticky', top: '20px',
          maxHeight: 'calc(100vh - 100px)', overflowY: 'auto',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>{getLandFlag(selectedUnternehmen.land)}</div>
              <h2 style={{ margin: 0, color: '#003366', fontSize: '18px' }}>{selectedUnternehmen.firmenname}</h2>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{selectedUnternehmen.standort}</div>
            </div>
            <button
              onClick={() => setSelected(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#999', padding: '0' }}
            >×</button>
          </div>

          {/* Status Badges */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: 'white', backgroundColor: getNetzwerkColor(selectedUnternehmen.netzwerkStatus) }}>
              {getNetzwerkLabel(selectedUnternehmen.netzwerkStatus)}
            </span>
            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: 'white', backgroundColor: getVerifizierungsColor(selectedUnternehmen.verifiziert) }}>
              {getVerifizierungsLabel(selectedUnternehmen.verifiziert)}
            </span>
          </div>

          {/* Beschreibung */}
          <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.6, marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
            {selectedUnternehmen.kurzbeschreibung}
          </p>

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
            {selectedUnternehmen.linkedin && (
              <DetailRow label="LinkedIn" value={selectedUnternehmen.linkedin} />
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

          {/* Aktivität */}
          <DetailSection title="Easy-B2B Aktivität">
            <DetailRow label="Erstkontakt" value={selectedUnternehmen.erstkontakt} />
            <DetailRow label="Letzte Aktivität" value={selectedUnternehmen.letzteAktivitaet} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
              <ActivityBadgeLarge label="Anfragen" count={selectedUnternehmen.anfrageCount} color="#003366" />
              <ActivityBadgeLarge label="Interessent bei" count={selectedUnternehmen.interessentCount} color="#2196F3" />
              <ActivityBadgeLarge label="Erfolge" count={selectedUnternehmen.successStories} color="#4CAF50" />
              <ActivityBadgeLarge label="Events" count={selectedUnternehmen.events.length} color="#FF9900" />
            </div>
          </DetailSection>

          {/* Events */}
          {selectedUnternehmen.events.length > 0 && (
            <DetailSection title="Veranstaltungen">
              {selectedUnternehmen.events.map((e, idx) => (
                <div key={idx} style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '6px', marginBottom: '6px', fontSize: '13px' }}>
                  <div style={{ fontWeight: 600 }}>{e.eventName}</div>
                  <div style={{ color: '#666', marginTop: '2px' }}>
                    {getEventFormatLabel(e.format)} · {e.rolle} · {e.eventDatum}
                  </div>
                </div>
              ))}
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
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button style={{ padding: '10px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              Neue Anfrage zuordnen
            </button>
            <button style={{ padding: '10px', backgroundColor: 'transparent', color: '#003366', border: '1px solid #003366', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              Notiz hinzufügen
            </button>
            {selectedUnternehmen.verifiziert === 'in_pruefung' && (
              <button style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                Verifizieren ✓
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Hilfskomponenten ────────────────────────────────────────

function ActivityBadge({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '20px', height: '20px', borderRadius: '50%',
        backgroundColor: count > 0 ? color : '#eee',
        color: count > 0 ? 'white' : '#999',
        fontSize: '11px', fontWeight: 700,
      }}>
        {count}
      </span>
      <span style={{ fontSize: '11px', color: '#999' }}>{label}</span>
    </div>
  );
}

function ActivityBadgeLarge({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{
      padding: '10px', borderRadius: '6px',
      backgroundColor: count > 0 ? `${color}15` : '#f9f9f9',
      border: `1px solid ${count > 0 ? color : '#eee'}`,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '20px', fontWeight: 700, color: count > 0 ? color : '#ccc' }}>{count}</div>
      <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{label}</div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px' }}>
      <span style={{ color: '#999', minWidth: '80px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#333' }}>{value}</span>
    </div>
  );
}
