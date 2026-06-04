'use client';

// =============================================================
// DASHBOARD DATA STORE — gemeinsame Session-Datenschicht
// Liegt im Dashboard-Layout → bleibt über Seitenwechsel erhalten.
// Globale Suche + Edit-Formulare greifen auf dieselben Daten zu.
// Echte Anfragen werden beim Start aus der Neon-DB geladen.
// =============================================================

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  MOCK_UNTERNEHMEN, MOCK_ANFRAGEN, MOCK_NETZWERKKONTAKTE,
  MOCK_INTERESSENTEN, MOCK_EVENTS, MOCK_SUCCESS_STORIES,
  type MockUnternehmen, type MockAnfrage, type MockNetzwerkkontakt,
} from './mockdata';

export interface Aktivitaet {
  id: string;
  zeit: string;
  wer: string;       // Operator
  was: string;       // Beschreibung
  bezug: string;     // betroffene Entität
  typ: 'anlegen' | 'bearbeiten' | 'status';
}

// Zwischen-Entität: n:m zwischen Projekt (Anfrage) und Interessent
export interface ProjektInteressent {
  id: string;
  projektId: string;       // = anfrageId
  interessentId: string;
  zuordnungsart: 'automatisch' | 'manuell';
  status: string;          // vorgeschlagen | in_pruefung | freigegeben | abgelehnt | kontakt_hergestellt | abgeschlossen
  grund?: string;
  notiz?: string;
  erstelltAm: string;
  erstelltVon: string;
  letzteAktivitaet: string;
}

interface DashboardStore {
  // Editierbare Entitäten
  unternehmen: MockUnternehmen[];
  anfragen: MockAnfrage[];
  kontakte: MockNetzwerkkontakt[];
  dbLadenStatus: 'laden' | 'fertig' | 'fehler';

  // Mutatoren
  updateUnternehmen: (id: string, patch: Partial<MockUnternehmen>) => void;
  addUnternehmen: (u: MockUnternehmen) => void;
  updateAnfrage: (id: string, patch: Partial<MockAnfrage>) => void;
  updateKontakt: (id: string, patch: Partial<MockNetzwerkkontakt>) => void;
  addKontakt: (k: MockNetzwerkkontakt) => void;

  // Projektzuordnungen (n:m)
  zuordnungen: ProjektInteressent[];
  addZuordnung: (z: Omit<ProjektInteressent, 'id'>) => void;
  updateZuordnung: (id: string, patch: Partial<ProjektInteressent>) => void;

  // Aktivitätenprotokoll
  aktivitaeten: Aktivitaet[];
  logge: (was: string, bezug: string, typ?: Aktivitaet['typ']) => void;
}

// Seed: jede automatische Marktplatz-Zuordnung aus MOCK_INTERESSENTEN
function statusZuZuordnung(s: string): string {
  return {
    neu: 'vorgeschlagen', freigegeben: 'freigegeben', kontakt_laeuft: 'kontakt_hergestellt',
    erfolgreich: 'abgeschlossen', abgelehnt: 'abgelehnt', feedback_ausstehend: 'kontakt_hergestellt',
  }[s] || 'in_pruefung';
}

const SEED_ZUORDNUNGEN: ProjektInteressent[] = MOCK_INTERESSENTEN.map(i => ({
  id: `zo-${i.id}`,
  projektId: i.anfrageId,
  interessentId: i.id,
  zuordnungsart: 'automatisch' as const,
  status: statusZuZuordnung(i.status),
  grund: 'Über Marktplatz-Formular gemeldet',
  erstelltAm: i.createdAt,
  erstelltVon: 'System',
  letzteAktivitaet: i.createdAt,
}));

const Ctx = createContext<DashboardStore | null>(null);

let counter = 1000;
function neueId(prefix: string) {
  counter += 1;
  return `${prefix}-${counter}`;
}

export function DashboardStoreProvider({ children }: { children: ReactNode }) {
  const [unternehmen, setUnternehmen] = useState<MockUnternehmen[]>(MOCK_UNTERNEHMEN);
  const [anfragen, setAnfragen] = useState<MockAnfrage[]>(MOCK_ANFRAGEN);
  const [kontakte, setKontakte] = useState<MockNetzwerkkontakt[]>(MOCK_NETZWERKKONTAKTE);
  const [zuordnungen, setZuordnungen] = useState<ProjektInteressent[]>(SEED_ZUORDNUNGEN);
  const [aktivitaeten, setAktivitaeten] = useState<Aktivitaet[]>([]);
  const [dbLadenStatus, setDbLadenStatus] = useState<'laden' | 'fertig' | 'fehler'>('laden');

  // Echte Anfragen aus Neon-DB laden (ersetzt Mock-Daten)
  useEffect(() => {
    fetch('/api/anfragen')
      .then(r => r.json())
      .then((dbAnfragen: MockAnfrage[]) => {
        if (Array.isArray(dbAnfragen) && dbAnfragen.length > 0) {
          setAnfragen(dbAnfragen);
          setDbLadenStatus('fertig');
        } else {
          // Keine echten Daten → Mock-Daten behalten
          setDbLadenStatus('fertig');
        }
      })
      .catch(() => {
        // Bei Fehler Mock-Daten behalten
        setDbLadenStatus('fehler');
      });
  }, []);

  const logge = (was: string, bezug: string, typ: Aktivitaet['typ'] = 'bearbeiten') => {
    setAktivitaeten(prev => [{
      id: neueId('act'),
      zeit: 'gerade eben',
      wer: 'Operator',
      was, bezug, typ,
    }, ...prev].slice(0, 50));
  };

  const updateUnternehmen = (id: string, patch: Partial<MockUnternehmen>) => {
    setUnternehmen(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u));
  };
  const addUnternehmen = (u: MockUnternehmen) => setUnternehmen(prev => [u, ...prev]);

  const updateAnfrage = (id: string, patch: Partial<MockAnfrage>) => {
    setAnfragen(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  };

  const updateKontakt = (id: string, patch: Partial<MockNetzwerkkontakt>) => {
    setKontakte(prev => prev.map(k => k.id === id ? { ...k, ...patch } : k));
  };
  const addKontakt = (k: MockNetzwerkkontakt) => setKontakte(prev => [k, ...prev]);

  const addZuordnung = (z: Omit<ProjektInteressent, 'id'>) => {
    setZuordnungen(prev => [{ ...z, id: neueId('zo') }, ...prev]);
  };
  const updateZuordnung = (id: string, patch: Partial<ProjektInteressent>) => {
    setZuordnungen(prev => prev.map(z => z.id === id ? { ...z, ...patch, letzteAktivitaet: 'gerade eben' } : z));
  };

  return (
    <Ctx.Provider value={{
      unternehmen, anfragen, kontakte,
      updateUnternehmen, addUnternehmen, updateAnfrage, updateKontakt, addKontakt,
      zuordnungen, addZuordnung, updateZuordnung,
      aktivitaeten, logge, dbLadenStatus,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore(): DashboardStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore muss innerhalb von DashboardStoreProvider verwendet werden');
  return ctx;
}

export function neueEntityId(prefix: string) {
  return neueId(prefix);
}

// ─── GLOBALE SUCHE ────────────────────────────────────────────

export interface Suchergebnis {
  modul: string;
  modulIcon: string;
  titel: string;
  untertitel: string;
  href: string;
  badge?: string;
}

export function globaleSuche(query: string, store: DashboardStore): Suchergebnis[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const treffer: Suchergebnis[] = [];
  const match = (...felder: (string | undefined)[]) => felder.some(f => f?.toLowerCase().includes(q));

  // Unternehmen
  store.unternehmen.forEach(u => {
    if (match(u.firmenname, u.ansprechpartner, u.website, u.branche, u.email, u.standort)) {
      treffer.push({
        modul: 'Unternehmen', modulIcon: '🏢',
        titel: u.firmenname, untertitel: `${u.ansprechpartner} · ${u.branche || ''} · ${u.standort}`,
        href: '/dashboard/unternehmen', badge: u.land === 'deutschland' ? '🇩🇪' : '🇩🇰',
      });
    }
  });

  // Anfragen
  store.anfragen.forEach(a => {
    if (match(a.firmenname, a.anzeigenId, a.beschreibung, a.ziel, a.ansprechpartner, a.email)) {
      treffer.push({
        modul: 'Anfrage', modulIcon: '📋',
        titel: `${a.anzeigenId} – ${a.firmenname}`, untertitel: a.ziel,
        href: '/dashboard/anfragen', badge: a.status,
      });
    }
  });

  // Interessenten (read-only)
  MOCK_INTERESSENTEN.forEach(i => {
    if (match(i.firmenname, i.ansprechpartner, i.email, i.telefon, i.anfrageFirma)) {
      treffer.push({
        modul: 'Interessent', modulIcon: '👥',
        titel: i.firmenname, untertitel: `${i.ansprechpartner} · Interesse an ${i.anfrageFirma}`,
        href: '/dashboard/interessenten', badge: i.status,
      });
    }
  });

  // Netzwerkkontakte
  store.kontakte.forEach(k => {
    if (match(k.name, k.organisation, k.email, k.telefon, k.region, k.branche)) {
      treffer.push({
        modul: 'Netzwerk', modulIcon: '🕸',
        titel: k.name, untertitel: `${k.position || ''} · ${k.organisation || ''}`,
        href: '/dashboard/netzwerk',
      });
    }
  });

  // Events
  MOCK_EVENTS.forEach(e => {
    const teilnehmerMatch = e.teilnehmer.some(t => match(t.firmenname, t.ansprechpartner));
    if (match(e.titel, e.untertitel, e.ort) || teilnehmerMatch) {
      treffer.push({
        modul: 'Event', modulIcon: '🎤',
        titel: e.titel, untertitel: `${e.datum} · ${e.ort}${teilnehmerMatch ? ' · Teilnehmer-Treffer' : ''}`,
        href: '/dashboard/events', badge: e.status,
      });
    }
  });

  // Success Stories
  MOCK_SUCCESS_STORIES.forEach(s => {
    if (match(s.titel, s.firma1Name, s.firma2Name, s.kurzbeschreibung)) {
      treffer.push({
        modul: 'Success Story', modulIcon: '⭐',
        titel: s.titel, untertitel: `${s.firma1Name} ↔ ${s.firma2Name}`,
        href: '/dashboard/success-stories',
      });
    }
  });

  return treffer;
}
