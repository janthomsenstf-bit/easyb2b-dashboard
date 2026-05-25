'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalAnfragen: number;
  activeAnfragen: number;
  totalInteressenten: number;
  newInteressenten: number;
  successfulMatches: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        // For now, mock data
        // TODO: Fetch real stats from API
        setStats({
          totalAnfragen: 24,
          activeAnfragen: 12,
          totalInteressenten: 38,
          newInteressenten: 5,
          successfulMatches: 3,
        });
      } catch (err) {
        setError('Fehler beim Laden der Daten');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div>Lädt Daten...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color }}>
        {value}
      </p>
    </div>
  );

  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: '24px', color: '#003366' }}>
        Dashboard Übersicht
      </h1>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        <StatCard label="Gesamt Anfragen" value={stats?.totalAnfragen || 0} color="#003366" />
        <StatCard label="Aktive Anfragen" value={stats?.activeAnfragen || 0} color="#FF9900" />
        <StatCard label="Interessenten" value={stats?.totalInteressenten || 0} color="#4CAF50" />
        <StatCard label="Neue Interessenten" value={stats?.newInteressenten || 0} color="#2196F3" />
        <StatCard label="Erfolgreiche Matches" value={stats?.successfulMatches || 0} color="#9C27B0" />
      </div>

      {/* Quick Links */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
        <h2 style={{ marginTop: 0, color: '#003366' }}>Schnellzugriff</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
          }}
        >
          <a
            href="/dashboard/anfragen"
            style={{
              padding: '12px',
              backgroundColor: '#003366',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#001a4d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#003366';
            }}
          >
            Anfragen anzeigen
          </a>
          <a
            href="/dashboard/interessenten"
            style={{
              padding: '12px',
              backgroundColor: '#FF9900',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E68900';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF9900';
            }}
          >
            Interessenten prüfen
          </a>
          <a
            href="/dashboard/matchmaking"
            style={{
              padding: '12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#45a049';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4CAF50';
            }}
          >
            Matchmaking
          </a>
        </div>
      </div>
    </div>
  );
}
