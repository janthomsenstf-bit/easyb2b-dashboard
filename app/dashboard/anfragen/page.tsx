'use client';

import { useState } from 'react';
import { MOCK_ANFRAGEN, getStatusLabel, getStatusColor, getRichtungLabel } from '@/lib/mockdata';

export default function AnfragenPage() {
  const [filterStatus, setFilterStatus] = useState('alle');
  const [filterRichtung, setFilterRichtung] = useState('alle');

  const filtered = MOCK_ANFRAGEN.filter(a => {
    if (filterStatus !== 'alle' && a.status !== filterStatus) return false;
    if (filterRichtung !== 'alle' && a.richtung !== filterRichtung) return false;
    return true;
  });

  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: '24px', color: '#003366', fontSize: '24px' }}>
        Anfragen Verwaltung
      </h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '4px' }}>Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', minWidth: '160px' }}
          >
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
          <select
            value={filterRichtung}
            onChange={(e) => setFilterRichtung(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', minWidth: '160px' }}
          >
            <option value="alle">Alle Richtungen</option>
            <option value="de_dk">Deutschland → Dänemark</option>
            <option value="dk_de">Dänemark → Deutschland</option>
          </select>
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>{filtered.length} Anfrage(n)</span>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#003366', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Richtung</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Firma</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Branche</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Ziel</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Interessenten</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Datum</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, idx) => (
              <tr key={a.id} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: idx % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{a.anzeigenId}</td>
                <td style={{ padding: '12px' }}>{getRichtungLabel(a.richtung)}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 600 }}>{a.firmenname}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{a.standort}</div>
                </td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{a.branche}</td>
                <td style={{ padding: '12px', fontSize: '13px', maxWidth: '250px' }}>{a.ziel}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block', width: '28px', height: '28px', borderRadius: '50%', lineHeight: '28px',
                    backgroundColor: a.interessentenCount > 0 ? '#e8f5e9' : '#f5f5f5',
                    color: a.interessentenCount > 0 ? '#4CAF50' : '#999',
                    fontWeight: 600, fontSize: '13px',
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
                <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>{a.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
