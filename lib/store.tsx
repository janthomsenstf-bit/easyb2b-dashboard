'use client';

// =============================================================
// DASHBOARD DATA STORE — gemeinsame Session-Datenschicht
// Liegt im Dashboard-Layout → bleibt über Seitenwechsel erhalten.
// Globale Suche + Edit-Formulare greifen auf dieselben Daten zu.
// (Noch keine DB — Reset bei vollem Reload.)
// =============================================================

import { createContext, useContext, useState, ReactNode } from 'react';
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

interface DashboardStore {
  // Editierbare Entitäten
  unternehmen: MockUnternehmen[];
  anfragen: MockAnfrage[];
  kontakte: MockNetzwerkkontakt[];

  // Mutatoren
  updateUnternehmen: (id: string, patch: Partial<MockUnternehmen>) => void;
  addUnternehmen: (u: MockUnternehmen) => void;
  updateAnfrage: (id: string, patch: Partial<MockAnfrage>) => void;
  updateKontakt: (id: string, patch: Partial<MockNetzwerkkontakt>) => void;
  addKontakt: (k: MockNetzwerkkontakt) => void;

  // Aktivitätenprotokoll
  aktivitaeten: Aktivitaet[];
  logge: (was: string, bezug: string, typ?: Aktivitaet['typ']) => void;
}

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
  const [aktivitaeten, setAktivitaeten] = useState<Aktivitaet[]>([]);

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

  return (
    <Ctx.Provider value={{
      unternehmen, anfragen, kontakte,
      updateUnternehmen, addUnternehmen, updateAnfrage, updateKontakt, addKontakt,
      aktivitaeten, logge,
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
