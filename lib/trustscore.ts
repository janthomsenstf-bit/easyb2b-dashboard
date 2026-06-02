// =============================================================
// VERTRAUENS-SCORE LOGIK für Easy-B2B Dashboard
// Intern — nicht öffentlich sichtbar
// =============================================================

export interface TrustFactors {
  persoenlichesGespraech: boolean;
  websiteGeprueft: boolean;
  linkedinGeprueft: boolean;
  empfehlungVorhanden: boolean;
  eventTeilnahmen: number;     // Anzahl Events
  erfolgreicheMatches: number; // Anzahl erfolgreicher Matches
  negativeHinweise: boolean;
  spamRisiko: boolean;
  verifizierungsStatus: string;
}

export interface TrustResult {
  score: number;           // 0–100
  level: TrustLevel;
  breakdown: TrustBreakdown[];
  warnung: string | null;
}

export interface TrustBreakdown {
  faktor: string;
  punkte: number;
  aktiv: boolean;
  typ: 'positiv' | 'negativ' | 'neutral';
}

export type TrustLevel = 'niedrig' | 'mittel' | 'hoch' | 'sehr_hoch';

// ─── PUNKTE-TABELLE ──────────────────────────────────────────

const PUNKTE = {
  persoenlichesGespraech: 20,
  websiteGeprueft:         15,
  linkedinGeprueft:        10,
  empfehlungVorhanden:     20,
  proEvent:                10,   // pro Event (max. 1 Event gewertet = 10)
  proMatch:                15,   // pro Match (max. 2 Matches = 30)
  negativeHinweise:       -30,
  spamRisiko:             -50,
};

// ─── SCORE BERECHNEN ─────────────────────────────────────────

export function berechneTrustScore(faktoren: TrustFactors): TrustResult {
  let score = 0;
  const breakdown: TrustBreakdown[] = [];

  // +20: Persönliches Gespräch
  breakdown.push({
    faktor: 'Persönliches Gespräch geführt',
    punkte: PUNKTE.persoenlichesGespraech,
    aktiv: faktoren.persoenlichesGespraech,
    typ: 'positiv',
  });
  if (faktoren.persoenlichesGespraech) score += PUNKTE.persoenlichesGespraech;

  // +15: Website geprüft
  breakdown.push({
    faktor: 'Website geprüft',
    punkte: PUNKTE.websiteGeprueft,
    aktiv: faktoren.websiteGeprueft,
    typ: 'positiv',
  });
  if (faktoren.websiteGeprueft) score += PUNKTE.websiteGeprueft;

  // +10: LinkedIn geprüft
  breakdown.push({
    faktor: 'LinkedIn geprüft',
    punkte: PUNKTE.linkedinGeprueft,
    aktiv: faktoren.linkedinGeprueft,
    typ: 'positiv',
  });
  if (faktoren.linkedinGeprueft) score += PUNKTE.linkedinGeprueft;

  // +20: Empfehlung vorhanden
  breakdown.push({
    faktor: 'Empfehlung vorhanden',
    punkte: PUNKTE.empfehlungVorhanden,
    aktiv: faktoren.empfehlungVorhanden,
    typ: 'positiv',
  });
  if (faktoren.empfehlungVorhanden) score += PUNKTE.empfehlungVorhanden;

  // +10: Event-Teilnahme (max. 1 × 10)
  const eventPunkte = Math.min(faktoren.eventTeilnahmen, 1) * PUNKTE.proEvent;
  breakdown.push({
    faktor: `Event-Teilnahme (${faktoren.eventTeilnahmen}×)`,
    punkte: eventPunkte,
    aktiv: faktoren.eventTeilnahmen > 0,
    typ: 'positiv',
  });
  score += eventPunkte;

  // +15 pro Match (max. 2 × 15 = 30)
  const matchPunkte = Math.min(faktoren.erfolgreicheMatches, 2) * PUNKTE.proMatch;
  breakdown.push({
    faktor: `Erfolgreiche Matches (${faktoren.erfolgreicheMatches}×)`,
    punkte: matchPunkte,
    aktiv: faktoren.erfolgreicheMatches > 0,
    typ: 'positiv',
  });
  score += matchPunkte;

  // -30: Negative Hinweise
  breakdown.push({
    faktor: 'Negative Hinweise vorhanden',
    punkte: PUNKTE.negativeHinweise,
    aktiv: faktoren.negativeHinweise,
    typ: 'negativ',
  });
  if (faktoren.negativeHinweise) score += PUNKTE.negativeHinweise;

  // -50: Spam-Risiko
  breakdown.push({
    faktor: 'Spam-Risiko erkannt',
    punkte: PUNKTE.spamRisiko,
    aktiv: faktoren.spamRisiko,
    typ: 'negativ',
  });
  if (faktoren.spamRisiko) score += PUNKTE.spamRisiko;

  // Clamp: 0–100
  score = Math.max(0, Math.min(100, score));

  // Level bestimmen
  const level = getLevel(score, faktoren);

  // Warnung
  const warnung = getWarnung(faktoren);

  return { score, level, breakdown, warnung };
}

// ─── LEVEL BESTIMMEN ─────────────────────────────────────────

function getLevel(score: number, faktoren: TrustFactors): TrustLevel {
  // Spam/Negativ immer niedrig
  if (faktoren.spamRisiko) return 'niedrig';
  if (score <= 30) return 'niedrig';
  if (score <= 60) return 'mittel';
  if (score <= 80) return 'hoch';
  return 'sehr_hoch';
}

// ─── WARNUNGEN ───────────────────────────────────────────────

function getWarnung(faktoren: TrustFactors): string | null {
  if (faktoren.spamRisiko) return '⚠️ Spam-Risiko — Dieses Unternehmen wurde als potentieller Spam markiert.';
  if (faktoren.negativeHinweise) return '⚠️ Negative Hinweise — Bitte interne Notizen prüfen bevor Kontakt hergestellt wird.';
  if (faktoren.verifizierungsStatus === 'abgelehnt') return '🚫 Abgelehnt — Dieses Unternehmen wurde vom Easy-B2B-Team abgelehnt.';
  if (faktoren.verifizierungsStatus === 'eingeschraenkt') return '⚡ Eingeschränkt — Vorsicht bei der Weitervermittlung.';
  return null;
}

// ─── HILFSFUNKTIONEN FÜR UI ──────────────────────────────────

export function getLevelLabel(level: TrustLevel): string {
  const labels: Record<TrustLevel, string> = {
    niedrig: 'Niedrig',
    mittel: 'Mittel',
    hoch: 'Hoch',
    sehr_hoch: 'Sehr hoch',
  };
  return labels[level];
}

export function getLevelColor(level: TrustLevel): string {
  const colors: Record<TrustLevel, string> = {
    niedrig: '#f44336',
    mittel: '#FF9900',
    hoch: '#4CAF50',
    sehr_hoch: '#2e7d32',
  };
  return colors[level];
}

export function getLevelBackground(level: TrustLevel): string {
  const colors: Record<TrustLevel, string> = {
    niedrig: '#fce4ec',
    mittel: '#fff3e0',
    hoch: '#e8f5e9',
    sehr_hoch: '#c8e6c9',
  };
  return colors[level];
}

export function getVerifizierungsStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ungeprueft: 'Ungeprüft',
    in_pruefung: 'In Prüfung',
    verifiziert: 'Verifiziert',
    eingeschraenkt: 'Eingeschränkt',
    abgelehnt: 'Abgelehnt',
  };
  return labels[status] || status;
}

export function getVerifizierungsStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ungeprueft: '#999',
    in_pruefung: '#FF9900',
    verifiziert: '#4CAF50',
    eingeschraenkt: '#FF5722',
    abgelehnt: '#f44336',
  };
  return colors[status] || '#999';
}
