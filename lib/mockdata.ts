// =============================================================
// MOCK-DATEN für Dashboard Testing
// Später durch echte Prisma-Queries ersetzen
// =============================================================

// ─── UNTERNEHMEN ─────────────────────────────────────────────

export interface MockUnternehmen {
  id: string;
  firmenname: string;
  land: 'deutschland' | 'daenemark' | 'andere';
  standort: string;
  website?: string;
  linkedin?: string;
  branche: string;
  groesse: string;
  ansprechpartner: string;
  email: string;
  telefon?: string;
  sprachen: string[];
  kurzbeschreibung: string;
  // Verifizierung
  verifizierungsStatus: string;
  verifiziertAm?: string;
  verifiziertDurch?: string;
  verifizierungsNotiz?: string;
  // Vertrauen
  vertrauensScore: number;
  vertrauensLevel: 'niedrig' | 'mittel' | 'hoch' | 'sehr_hoch';
  // Vertrauensfaktoren
  persoenlichesGespraech: boolean;
  websiteGeprueft: boolean;
  linkedinGeprueft: boolean;
  empfehlungVorhanden: boolean;
  negativeHinweise: boolean;
  spamRisiko: boolean;
  // Netzwerk
  netzwerkStatus: string;
  erstkontakt: string;
  letzteAktivitaet: string;
  interneNotiz?: string;
  anfrageCount: number;
  interessentCount: number;
  successStories: number;
  events: MockEvent[];
}

export interface MockEvent {
  eventName: string;
  eventDatum: string;
  format: string;
  rolle: string;
}

export const MOCK_UNTERNEHMEN: MockUnternehmen[] = [
  {
    id: 'unt-001',
    firmenname: 'Nordic Fish A/S',
    land: 'daenemark',
    standort: 'Esbjerg, Dänemark',
    website: 'https://nordicfish.dk',
    linkedin: 'nordic-fish-as',
    branche: 'Lebensmittel & Fischerei',
    groesse: 'mittel',
    ansprechpartner: 'Lars Henriksen',
    email: 'lars@nordicfish.dk',
    telefon: '+45 12 34 56 78',
    sprachen: ['daenisch', 'englisch'],
    kurzbeschreibung: 'Dänischer Fischverarbeiter mit 40 Jahren Erfahrung. Premium-Produkte für den europäischen Markt.',
    verifizierungsStatus: 'verifiziert',
    verifiziertAm: '2025-05-12',
    verifiziertDurch: 'Jan Thomsen',
    verifizierungsNotiz: 'Website geprüft, Handelsregister bestätigt. Telefonat mit Lars war professionell.',
    vertrauensScore: 65,
    vertrauensLevel: 'hoch',
    persoenlichesGespraech: true,
    websiteGeprueft: true,
    linkedinGeprueft: true,
    empfehlungVorhanden: false,
    negativeHinweise: false,
    spamRisiko: false,
    netzwerkStatus: 'aktiv',
    erstkontakt: '2025-05-10',
    letzteAktivitaet: '2025-05-28',
    anfrageCount: 1,
    interessentCount: 0,
    successStories: 0,
    events: [],
  },
  {
    id: 'unt-002',
    firmenname: 'Müller Maschinenbau GmbH',
    land: 'deutschland',
    standort: 'Flensburg, Deutschland',
    website: 'https://maschinenbau-fl.de',
    branche: 'Maschinenbau & Industrie',
    groesse: 'mittel',
    ansprechpartner: 'Thomas Müller',
    email: 'mueller@maschinenbau-fl.de',
    telefon: '+49 461 123 456',
    sprachen: ['deutsch', 'englisch'],
    kurzbeschreibung: 'Mittelständischer Maschinenbauer mit Fokus auf CNC-Fertigung und Stahlverarbeitung. Grenznah zu Dänemark.',
    verifizierungsStatus: 'verifiziert',
    verifiziertAm: '2025-05-20',
    verifiziertDurch: 'Jan Thomsen',
    verifizierungsNotiz: 'Persönliches Gespräch auf dem Branchentag Flensburg. Sehr seriöser Eindruck.',
    vertrauensScore: 55,
    vertrauensLevel: 'mittel',
    persoenlichesGespraech: true,
    websiteGeprueft: true,
    linkedinGeprueft: false,
    empfehlungVorhanden: false,
    negativeHinweise: false,
    spamRisiko: false,
    netzwerkStatus: 'aktiv',
    erstkontakt: '2025-05-18',
    letzteAktivitaet: '2025-05-25',
    anfrageCount: 1,
    interessentCount: 0,
    successStories: 0,
    events: [
      { eventName: 'Pitch & Meet Flensburg', eventDatum: '2025-06-15', format: 'pitch_and_meet', rolle: 'Pitcher' },
    ],
  },
  {
    id: 'unt-003',
    firmenname: 'Dansk Design Studio ApS',
    land: 'daenemark',
    standort: 'Kolding, Dänemark',
    website: 'https://danskdesign.dk',
    linkedin: 'dansk-design-studio',
    branche: 'Möbel & Design',
    groesse: 'klein',
    ansprechpartner: 'Mette Andersen',
    email: 'mette@danskdesign.dk',
    sprachen: ['daenisch', 'englisch', 'deutsch'],
    kurzbeschreibung: 'Preisgekröntes Designstudio für nachhaltige Möbel im skandinavischen Stil.',
    verifizierungsStatus: 'verifiziert',
    verifiziertAm: '2025-05-05',
    verifiziertDurch: 'Jan Thomsen',
    verifizierungsNotiz: 'Empfehlung über BVMW-Netzwerk. LinkedIn aktiv, Portfolio überzeugt.',
    vertrauensScore: 85,
    vertrauensLevel: 'sehr_hoch',
    persoenlichesGespraech: true,
    websiteGeprueft: true,
    linkedinGeprueft: true,
    empfehlungVorhanden: true,
    negativeHinweise: false,
    spamRisiko: false,
    netzwerkStatus: 'aktiv',
    erstkontakt: '2025-05-01',
    letzteAktivitaet: '2025-05-26',
    anfrageCount: 1,
    interessentCount: 0,
    successStories: 0,
    events: [],
  },
  {
    id: 'unt-004',
    firmenname: 'Frische-Markt Hamburg GmbH',
    land: 'deutschland',
    standort: 'Hamburg, Deutschland',
    website: 'https://frischemarkt-hh.de',
    branche: 'Lebensmittelhandel',
    groesse: 'gross',
    ansprechpartner: 'Klaus Bergmann',
    email: 'bergmann@frischemarkt-hh.de',
    telefon: '+49 40 123 456',
    sprachen: ['deutsch'],
    kurzbeschreibung: 'Großer Lebensmittel-Distributor in Norddeutschland. Spezialisiert auf frische Fisch- und Meeresfrüchte.',
    verifizierungsStatus: 'verifiziert',
    verifiziertAm: '2025-05-20',
    verifiziertDurch: 'Jan Thomsen',
    vertrauensScore: 45,
    vertrauensLevel: 'mittel',
    persoenlichesGespraech: true,
    websiteGeprueft: true,
    linkedinGeprueft: false,
    empfehlungVorhanden: false,
    negativeHinweise: false,
    spamRisiko: false,
    netzwerkStatus: 'partner',
    erstkontakt: '2025-05-18',
    letzteAktivitaet: '2025-05-28',
    anfrageCount: 0,
    interessentCount: 1,
    successStories: 0,
    events: [],
  },
  {
    id: 'unt-005',
    firmenname: 'Schleswig Logistik GmbH',
    land: 'deutschland',
    standort: 'Schleswig, Deutschland',
    website: 'https://schleswig-logistik.de',
    branche: 'Logistik & Transport',
    groesse: 'mittel',
    ansprechpartner: 'Jens Petersen',
    email: 'petersen@schleswig-logistik.de',
    telefon: '+49 4621 456 789',
    sprachen: ['deutsch', 'daenisch'],
    kurzbeschreibung: 'Speditionsunternehmen mit täglichen Routen Hamburg–Kopenhagen. Zweisprachig, grenznah.',
    verifizierungsStatus: 'verifiziert',
    verifiziertAm: '2025-04-15',
    verifiziertDurch: 'Jan Thomsen',
    verifizierungsNotiz: 'Sehr zuverlässiger Partner. Kooperation mit DSV erfolgreich. Für weitere Anfragen vormerken.',
    vertrauensScore: 95,
    vertrauensLevel: 'sehr_hoch',
    persoenlichesGespraech: true,
    websiteGeprueft: true,
    linkedinGeprueft: true,
    empfehlungVorhanden: true,
    negativeHinweise: false,
    spamRisiko: false,
    netzwerkStatus: 'partner',
    erstkontakt: '2025-04-10',
    letzteAktivitaet: '2025-05-20',
    interneNotiz: 'Sehr zuverlässiger Partner. Kooperation mit DSV erfolgreich. Für weitere Anfragen vormerken.',
    anfrageCount: 1,
    interessentCount: 0,
    successStories: 1,
    events: [
      { eventName: 'Branchentag Logistik Südjütland', eventDatum: '2025-03-20', format: 'branchentag', rolle: 'Teilnehmer' },
    ],
  },
  {
    id: 'unt-006',
    firmenname: 'DSV Transport Kolding',
    land: 'daenemark',
    standort: 'Kolding, Dänemark',
    website: 'https://dsv.com',
    branche: 'Logistik & Transport',
    groesse: 'konzern',
    ansprechpartner: 'Henrik Larsen',
    email: 'larsen@dsv-kolding.dk',
    sprachen: ['daenisch', 'englisch', 'deutsch'],
    kurzbeschreibung: 'Internationaler Logistikkonzern. Kolding-Niederlassung fokussiert auf deutsch-dänischen Korridor.',
    verifizierungsStatus: 'verifiziert',
    verifiziertAm: '2025-04-20',
    verifiziertDurch: 'Jan Thomsen',
    vertrauensScore: 90,
    vertrauensLevel: 'sehr_hoch',
    persoenlichesGespraech: true,
    websiteGeprueft: true,
    linkedinGeprueft: true,
    empfehlungVorhanden: true,
    negativeHinweise: false,
    spamRisiko: false,
    netzwerkStatus: 'partner',
    erstkontakt: '2025-04-18',
    letzteAktivitaet: '2025-05-15',
    anfrageCount: 0,
    interessentCount: 1,
    successStories: 1,
    events: [],
  },
  {
    id: 'unt-007',
    firmenname: 'GreenTech Aarhus',
    land: 'daenemark',
    standort: 'Aarhus, Dänemark',
    website: 'https://greentech-aarhus.dk',
    linkedin: 'greentech-aarhus',
    branche: 'Umwelttechnologie',
    groesse: 'klein',
    ansprechpartner: 'Mikkel Jensen',
    email: 'mikkel@greentech-aarhus.dk',
    sprachen: ['daenisch', 'englisch', 'deutsch'],
    kurzbeschreibung: 'CleanTech-Startup mit innovativer Wasseraufbereitungstechnologie. Sucht erste Pilotpartner in Deutschland.',
    verifizierungsStatus: 'in_pruefung',
    verifizierungsNotiz: 'Erste E-Mail beantwortet. Gespräch noch ausständig.',
    vertrauensScore: 10,
    vertrauensLevel: 'niedrig',
    persoenlichesGespraech: false,
    websiteGeprueft: true,
    linkedinGeprueft: false,
    empfehlungVorhanden: false,
    negativeHinweise: false,
    spamRisiko: false,
    netzwerkStatus: 'interessiert',
    erstkontakt: '2025-05-22',
    letzteAktivitaet: '2025-05-28',
    anfrageCount: 1,
    interessentCount: 0,
    successStories: 0,
    events: [
      { eventName: 'Pitch & Meet Hamburg', eventDatum: '2025-06-20', format: 'pitch_and_meet', rolle: 'Pitcher' },
    ],
  },
  {
    id: 'unt-008',
    firmenname: 'Bornholm Keramik',
    land: 'daenemark',
    standort: 'Rønne, Dänemark',
    branche: 'Kunsthandwerk & Keramik',
    groesse: 'solo',
    ansprechpartner: 'Pia Sørensen',
    email: 'pia@bornholm-keramik.dk',
    sprachen: ['daenisch', 'englisch'],
    kurzbeschreibung: 'Handgefertigte Keramik aus Bornholm. Kleine Manufaktur mit starker Marke in Skandinavien.',
    verifizierungsStatus: 'verifiziert',
    verifiziertAm: '2025-05-02',
    verifiziertDurch: 'Jan Thomsen',
    vertrauensScore: 55,
    vertrauensLevel: 'mittel',
    persoenlichesGespraech: true,
    websiteGeprueft: true,
    linkedinGeprueft: false,
    empfehlungVorhanden: false,
    negativeHinweise: false,
    spamRisiko: false,
    netzwerkStatus: 'aktiv',
    erstkontakt: '2025-04-28',
    letzteAktivitaet: '2025-05-27',
    anfrageCount: 1,
    interessentCount: 0,
    successStories: 0,
    events: [],
  },
  {
    id: 'unt-009',
    firmenname: 'Baltic Trade Solutions',
    land: 'deutschland',
    standort: 'Kiel, Deutschland',
    branche: 'Handel & Vermittlung',
    groesse: 'klein',
    ansprechpartner: 'Unbekannt',
    email: 'info@baltictrade.de',
    sprachen: ['deutsch'],
    kurzbeschreibung: 'Handelsagentur. Wirkte im Gespräch ausweichend. Referenzen nicht prüfbar.',
    verifizierungsStatus: 'eingeschraenkt',
    verifizierungsNotiz: 'Referenzen konnten nicht verifiziert werden. Website seit 3 Monaten offline. Vorsicht.',
    vertrauensScore: 5,
    vertrauensLevel: 'niedrig',
    persoenlichesGespraech: false,
    websiteGeprueft: false,
    linkedinGeprueft: false,
    empfehlungVorhanden: false,
    negativeHinweise: true,
    spamRisiko: false,
    netzwerkStatus: 'pausiert',
    erstkontakt: '2025-04-01',
    letzteAktivitaet: '2025-04-10',
    interneNotiz: 'VORSICHT: Hat bereits zwei Interessenten angeschrieben ohne Freigabe. Nicht weiterleiten.',
    anfrageCount: 0,
    interessentCount: 0,
    successStories: 0,
    events: [],
  },
];

export interface MockAnfrage {
  id: string;
  anzeigenId: string;
  firmenname: string;
  standort: string;
  richtung: 'de_dk' | 'dk_de';
  art: string;
  branche: string;
  beschreibung: string;
  ziel: string;
  status: string;
  sichtbarkeit: string;
  sprachen: string[];
  ansprechpartner: string;
  email: string;
  telefon?: string;
  interessentenCount: number;
  createdAt: string;
}

export interface MockInteressent {
  id: string;
  anfrageId: string;
  anfrageFirma: string;
  firmenname: string;
  ansprechpartner: string;
  email: string;
  telefon?: string;
  status: string;
  matchScore?: number;
  createdAt: string;
  notiz?: string;
}

export interface MockMatch {
  anfrageId: string;
  anfrageFirma: string;
  anfrageBranche: string;
  interessentId: string;
  interessentFirma: string;
  score: number;
  grund: string;
  status: string;
}

// ─── ANFRAGEN ────────────────────────────────────────────────

export const MOCK_ANFRAGEN: MockAnfrage[] = [
  {
    id: 'anf-001',
    anzeigenId: 'EB-2025-001',
    firmenname: 'Nordic Fish A/S',
    standort: 'Esbjerg, Dänemark',
    richtung: 'dk_de',
    art: 'vertrieb',
    branche: 'Lebensmittel & Fischerei',
    beschreibung: 'Wir sind ein dänischer Fischverarbeiter mit 40 Jahren Erfahrung. Wir suchen einen deutschen Vertriebspartner für unsere Premium-Fischprodukte (Lachs, Kabeljau, Hering) im norddeutschen Einzelhandel.',
    ziel: 'Deutschen Vertriebspartner für den Einzelhandel finden',
    status: 'aktiv',
    sichtbarkeit: 'oeffentlich',
    sprachen: ['daenisch', 'englisch'],
    ansprechpartner: 'Lars Henriksen',
    email: 'lars@nordicfish.dk',
    telefon: '+45 12 34 56 78',
    interessentenCount: 3,
    createdAt: '2025-05-15',
  },
  {
    id: 'anf-002',
    anzeigenId: 'EB-2025-002',
    firmenname: 'Müller Maschinenbau GmbH',
    standort: 'Flensburg, Deutschland',
    richtung: 'de_dk',
    art: 'kooperation',
    branche: 'Maschinenbau & Industrie',
    beschreibung: 'Mittelständischer Maschinenbauer sucht dänischen Kooperationspartner für gemeinsame Entwicklung von Windkraft-Komponenten. Wir bringen CNC-Fertigung und Stahlverarbeitung mit.',
    ziel: 'Kooperationspartner für Windkraft-Komponenten',
    status: 'aktiv',
    sichtbarkeit: 'oeffentlich',
    sprachen: ['deutsch', 'englisch'],
    ansprechpartner: 'Thomas Müller',
    email: 'mueller@maschinenbau-fl.de',
    telefon: '+49 461 123 456',
    interessentenCount: 1,
    createdAt: '2025-05-20',
  },
  {
    id: 'anf-003',
    anzeigenId: 'EB-2025-003',
    firmenname: 'Dansk Design Studio ApS',
    standort: 'Kolding, Dänemark',
    richtung: 'dk_de',
    art: 'vertrieb',
    branche: 'Möbel & Design',
    beschreibung: 'Dänisches Designstudio mit preisgekrönten Möbelkollektionen sucht deutschen Distributor oder Einzelhandelpartner. Unsere Stücke sind nachhaltig produziert und im skandinavischen Stil.',
    ziel: 'Vertriebspartner für den deutschen Möbelmarkt',
    status: 'interessent_vorhanden',
    sichtbarkeit: 'oeffentlich',
    sprachen: ['daenisch', 'englisch', 'deutsch'],
    ansprechpartner: 'Mette Andersen',
    email: 'mette@danskdesign.dk',
    interessentenCount: 2,
    createdAt: '2025-05-10',
  },
  {
    id: 'anf-004',
    anzeigenId: 'EB-2025-004',
    firmenname: 'Nordwind Energie AG',
    standort: 'Husum, Deutschland',
    richtung: 'de_dk',
    art: 'lieferant',
    branche: 'Erneuerbare Energien',
    beschreibung: 'Wir suchen dänische Zulieferer für Offshore-Windpark-Komponenten. Speziell: Kabelverlegung, Unterwasser-Fundamente und Wartungsdienstleistungen.',
    ziel: 'Dänische Zulieferer für Offshore-Windpark',
    status: 'eingehend',
    sichtbarkeit: 'anonym',
    sprachen: ['deutsch', 'englisch'],
    ansprechpartner: 'Dr. Stefan Weber',
    email: 'weber@nordwind-energie.de',
    telefon: '+49 4841 789 012',
    interessentenCount: 0,
    createdAt: '2025-05-28',
  },
  {
    id: 'anf-005',
    anzeigenId: 'EB-2025-005',
    firmenname: 'Bornholm Keramik',
    standort: 'Rønne, Dänemark',
    richtung: 'dk_de',
    art: 'vertrieb',
    branche: 'Kunsthandwerk & Keramik',
    beschreibung: 'Handgefertigte Keramik aus Bornholm. Wir suchen Einzelhändler, Concept Stores oder Online-Shops in Deutschland, die skandinavisches Handwerk schätzen.',
    ziel: 'Deutsche Einzelhändler für handgefertigte Keramik',
    status: 'aktiv',
    sichtbarkeit: 'oeffentlich',
    sprachen: ['daenisch', 'englisch'],
    ansprechpartner: 'Pia Sørensen',
    email: 'pia@bornholm-keramik.dk',
    interessentenCount: 4,
    createdAt: '2025-05-01',
  },
  {
    id: 'anf-006',
    anzeigenId: 'EB-2025-006',
    firmenname: 'Schleswig Logistik GmbH',
    standort: 'Schleswig, Deutschland',
    richtung: 'de_dk',
    art: 'kooperation',
    branche: 'Logistik & Transport',
    beschreibung: 'Speditionsunternehmen mit täglichen Routen Hamburg-Kopenhagen sucht dänische Logistikpartner für Stückgut und Teilladungen. Kapazitäten frei.',
    ziel: 'Dänische Logistikpartner für grenzüberschreitenden Transport',
    status: 'vermittelt',
    sichtbarkeit: 'oeffentlich',
    sprachen: ['deutsch', 'daenisch'],
    ansprechpartner: 'Jens Petersen',
    email: 'petersen@schleswig-logistik.de',
    telefon: '+49 4621 456 789',
    interessentenCount: 2,
    createdAt: '2025-04-15',
  },
  {
    id: 'anf-007',
    anzeigenId: 'EB-2025-007',
    firmenname: 'GreenTech Aarhus',
    standort: 'Aarhus, Dänemark',
    richtung: 'dk_de',
    art: 'kunden',
    branche: 'Umwelttechnologie',
    beschreibung: 'CleanTech-Startup aus Aarhus mit innovativer Wasseraufbereitungstechnologie. Suchen deutsche Industriekunden für Pilotprojekte.',
    ziel: 'Deutsche Industriekunden für Pilotprojekte',
    status: 'aktiv',
    sichtbarkeit: 'oeffentlich',
    sprachen: ['daenisch', 'englisch', 'deutsch'],
    ansprechpartner: 'Mikkel Jensen',
    email: 'mikkel@greentech-aarhus.dk',
    interessentenCount: 1,
    createdAt: '2025-05-22',
  },
  {
    id: 'anf-008',
    anzeigenId: 'EB-2025-008',
    firmenname: 'Kieler Brauerei',
    standort: 'Kiel, Deutschland',
    richtung: 'de_dk',
    art: 'vertrieb',
    branche: 'Lebensmittel & Getränke',
    beschreibung: 'Craft-Brauerei aus Kiel möchte den dänischen Markt erschließen. Suchen Importeure, Gastropartner oder Einzelhändler in Dänemark.',
    ziel: 'Dänische Importeure für Craft-Bier',
    status: 'pausiert',
    sichtbarkeit: 'oeffentlich',
    sprachen: ['deutsch', 'englisch'],
    ansprechpartner: 'Hannah Schmidt',
    email: 'hannah@kieler-brauerei.de',
    telefon: '+49 431 987 654',
    interessentenCount: 0,
    createdAt: '2025-04-28',
  },
];

// ─── INTERESSENTEN ───────────────────────────────────────────

export const MOCK_INTERESSENTEN: MockInteressent[] = [
  {
    id: 'int-001',
    anfrageId: 'anf-001',
    anfrageFirma: 'Nordic Fish A/S',
    firmenname: 'Frische-Markt Hamburg GmbH',
    ansprechpartner: 'Klaus Bergmann',
    email: 'bergmann@frischemarkt-hh.de',
    telefon: '+49 40 123 456',
    status: 'freigegeben',
    matchScore: 87,
    createdAt: '2025-05-18',
    notiz: 'Großer Fisch-Distributor in Norddeutschland, sehr interessiert.',
  },
  {
    id: 'int-002',
    anfrageId: 'anf-001',
    anfrageFirma: 'Nordic Fish A/S',
    firmenname: 'EDEKA Nordwest Frischfisch',
    ansprechpartner: 'Sabine Lüders',
    email: 'luders@edeka-nordwest.de',
    status: 'neu',
    matchScore: 72,
    createdAt: '2025-05-25',
  },
  {
    id: 'int-003',
    anfrageId: 'anf-001',
    anfrageFirma: 'Nordic Fish A/S',
    firmenname: 'Fisch-König Bremen',
    ansprechpartner: 'Marco Fischer',
    email: 'fischer@fischkoenig-hb.de',
    telefon: '+49 421 789 012',
    status: 'kontakt_laeuft',
    matchScore: 65,
    createdAt: '2025-05-20',
    notiz: 'Kleiner Händler, aber spezialisiert auf Premium-Fisch.',
  },
  {
    id: 'int-004',
    anfrageId: 'anf-002',
    anfrageFirma: 'Müller Maschinenbau GmbH',
    firmenname: 'Vestas Wind Components ApS',
    ansprechpartner: 'Søren Nielsen',
    email: 'nielsen@vestas-comp.dk',
    telefon: '+45 87 65 43 21',
    status: 'freigegeben',
    matchScore: 92,
    createdAt: '2025-05-22',
    notiz: 'Perfekter Match. Vestas-Zulieferer sucht deutsche CNC-Partner.',
  },
  {
    id: 'int-005',
    anfrageId: 'anf-003',
    anfrageFirma: 'Dansk Design Studio ApS',
    firmenname: 'Möbelhaus Stilwerk Berlin',
    ansprechpartner: 'Katharina Wolff',
    email: 'wolff@stilwerk-berlin.de',
    status: 'neu',
    matchScore: 78,
    createdAt: '2025-05-26',
  },
  {
    id: 'int-006',
    anfrageId: 'anf-003',
    anfrageFirma: 'Dansk Design Studio ApS',
    firmenname: 'Nordic Living Store Hamburg',
    ansprechpartner: 'Anne Paulsen',
    email: 'paulsen@nordicliving-hh.de',
    telefon: '+49 40 456 789',
    status: 'freigegeben',
    matchScore: 85,
    createdAt: '2025-05-12',
    notiz: 'Spezialisiert auf skandinavisches Design. Sehr guter Fit.',
  },
  {
    id: 'int-007',
    anfrageId: 'anf-005',
    anfrageFirma: 'Bornholm Keramik',
    firmenname: 'Concept Store "Nordlicht" München',
    ansprechpartner: 'Lisa Bauer',
    email: 'bauer@nordlicht-muenchen.de',
    status: 'neu',
    matchScore: 70,
    createdAt: '2025-05-27',
  },
  {
    id: 'int-008',
    anfrageId: 'anf-005',
    anfrageFirma: 'Bornholm Keramik',
    firmenname: 'Keramik & Kunst Düsseldorf',
    ansprechpartner: 'Martin Schneider',
    email: 'schneider@keramik-kunst.de',
    telefon: '+49 211 345 678',
    status: 'kontakt_laeuft',
    matchScore: 82,
    createdAt: '2025-05-05',
    notiz: 'Hat bereits dänische Keramik im Sortiment. Sehr interessiert an Bornholm-Produkten.',
  },
  {
    id: 'int-009',
    anfrageId: 'anf-005',
    anfrageFirma: 'Bornholm Keramik',
    firmenname: 'Scandi-Shop Online GmbH',
    ansprechpartner: 'Julia Hansen',
    email: 'hansen@scandi-shop.de',
    status: 'freigegeben',
    matchScore: 75,
    createdAt: '2025-05-15',
  },
  {
    id: 'int-010',
    anfrageId: 'anf-005',
    anfrageFirma: 'Bornholm Keramik',
    firmenname: 'Handwerk Manufaktur Berlin',
    ansprechpartner: 'Tom Richter',
    email: 'richter@handwerk-berlin.de',
    status: 'spam',
    createdAt: '2025-05-08',
    notiz: 'Falsche Angaben, kein echtes Unternehmen.',
  },
  {
    id: 'int-011',
    anfrageId: 'anf-007',
    anfrageFirma: 'GreenTech Aarhus',
    firmenname: 'Stadtwerke Lübeck',
    ansprechpartner: 'Dr. Peter Krause',
    email: 'krause@sw-luebeck.de',
    telefon: '+49 451 234 567',
    status: 'neu',
    matchScore: 88,
    createdAt: '2025-05-28',
    notiz: 'Stadtwerk sucht innovative Wasseraufbereitungslösungen. Hoher Match-Score.',
  },
  {
    id: 'int-012',
    anfrageId: 'anf-006',
    anfrageFirma: 'Schleswig Logistik GmbH',
    firmenname: 'DSV Transport Kolding',
    ansprechpartner: 'Henrik Larsen',
    email: 'larsen@dsv-kolding.dk',
    status: 'erfolgreich',
    matchScore: 95,
    createdAt: '2025-04-20',
    notiz: 'Kooperation erfolgreich gestartet. Tägliche Routen laufen.',
  },
  {
    id: 'int-013',
    anfrageId: 'anf-006',
    anfrageFirma: 'Schleswig Logistik GmbH',
    firmenname: 'Scandinavian Freight ApS',
    ansprechpartner: 'Ole Madsen',
    email: 'madsen@scanfreight.dk',
    status: 'erfolgreich',
    matchScore: 80,
    createdAt: '2025-04-22',
    notiz: 'Zusätzlicher Partner für Stückgut etabliert.',
  },
];

// ─── MATCH-VORSCHLÄGE ────────────────────────────────────────

export const MOCK_MATCHES: MockMatch[] = [
  {
    anfrageId: 'anf-004',
    anfrageFirma: 'Nordwind Energie AG',
    anfrageBranche: 'Erneuerbare Energien',
    interessentId: 'match-001',
    interessentFirma: 'Offshore Solutions Esbjerg ApS',
    score: 91,
    grund: 'Spezialisiert auf Offshore-Fundamente, 15 Jahre Erfahrung, englischsprachig',
    status: 'vorgeschlagen',
  },
  {
    anfrageId: 'anf-004',
    anfrageFirma: 'Nordwind Energie AG',
    anfrageBranche: 'Erneuerbare Energien',
    interessentId: 'match-002',
    interessentFirma: 'Danish Cable Lay A/S',
    score: 85,
    grund: 'Kabelverlegung Offshore, arbeitet bereits mit deutschen Energiekonzernen',
    status: 'vorgeschlagen',
  },
  {
    anfrageId: 'anf-007',
    anfrageFirma: 'GreenTech Aarhus',
    anfrageBranche: 'Umwelttechnologie',
    interessentId: 'match-003',
    interessentFirma: 'Hamburger Wasserwerke GmbH',
    score: 78,
    grund: 'Sucht innovative Wasseraufbereitungstechnologien, Budget für Pilotprojekte vorhanden',
    status: 'vorgeschlagen',
  },
  {
    anfrageId: 'anf-008',
    anfrageFirma: 'Kieler Brauerei',
    anfrageBranche: 'Lebensmittel & Getränke',
    interessentId: 'match-004',
    interessentFirma: 'Carlsberg Import Division',
    score: 72,
    grund: 'Importiert Craft-Bier für den dänischen Markt, offen für neue Marken',
    status: 'vorgeschlagen',
  },
  {
    anfrageId: 'anf-008',
    anfrageFirma: 'Kieler Brauerei',
    anfrageBranche: 'Lebensmittel & Getränke',
    interessentId: 'match-005',
    interessentFirma: 'Mikkeller Bar København',
    score: 68,
    grund: 'Craft-Bier-Bar-Kette, immer offen für neue internationale Brauereien',
    status: 'vorgeschlagen',
  },
];

// ─── HELPER FUNCTIONS ────────────────────────────────────────

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    eingehend: 'Eingehend',
    aktiv: 'Aktiv',
    interessent_vorhanden: 'Interessent vorhanden',
    mehrere_interessenten: 'Mehrere Interessenten',
    kontakt_laeuft: 'Kontakt läuft',
    vermittelt: 'Vermittelt',
    stalled: 'Stillstand',
    pausiert: 'Pausiert',
    archiviert: 'Archiviert',
    neu: 'Neu',
    freigegeben: 'Freigegeben',
    feedback_ausstehend: 'Feedback ausstehend',
    erfolgreich: 'Erfolgreich',
    spam: 'Spam',
    unqualifiziert: 'Unqualifiziert',
    abgelehnt: 'Abgelehnt',
    vorgeschlagen: 'Vorgeschlagen',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    eingehend: '#2196F3',
    aktiv: '#4CAF50',
    interessent_vorhanden: '#FF9900',
    mehrere_interessenten: '#FF9900',
    kontakt_laeuft: '#9C27B0',
    vermittelt: '#4CAF50',
    stalled: '#f44336',
    pausiert: '#999',
    archiviert: '#666',
    neu: '#2196F3',
    freigegeben: '#4CAF50',
    feedback_ausstehend: '#FF9900',
    erfolgreich: '#4CAF50',
    spam: '#f44336',
    unqualifiziert: '#999',
    abgelehnt: '#f44336',
    vorgeschlagen: '#2196F3',
  };
  return colors[status] || '#999';
}

export function getRichtungLabel(richtung: string): string {
  return richtung === 'de_dk' ? '🇩🇪 → 🇩🇰' : '🇩🇰 → 🇩🇪';
}

export function getVerifizierungsLabel(status: string): string {
  const labels: Record<string, string> = {
    unbekannt: 'Unbekannt',
    in_pruefung: 'In Prüfung',
    verifiziert: 'Verifiziert',
    abgelehnt: 'Abgelehnt',
  };
  return labels[status] || status;
}

export function getVerifizierungsColor(status: string): string {
  const colors: Record<string, string> = {
    unbekannt: '#999',
    in_pruefung: '#FF9900',
    verifiziert: '#4CAF50',
    abgelehnt: '#f44336',
  };
  return colors[status] || '#999';
}

export function getNetzwerkLabel(status: string): string {
  const labels: Record<string, string> = {
    interessiert: 'Interessiert',
    aktiv: 'Aktiv',
    partner: 'Partner',
    pausiert: 'Pausiert',
    inaktiv: 'Inaktiv',
  };
  return labels[status] || status;
}

export function getNetzwerkColor(status: string): string {
  const colors: Record<string, string> = {
    interessiert: '#2196F3',
    aktiv: '#4CAF50',
    partner: '#9C27B0',
    pausiert: '#999',
    inaktiv: '#ccc',
  };
  return colors[status] || '#999';
}

export function getGroesseLabel(groesse: string): string {
  const labels: Record<string, string> = {
    solo: 'Solo (1)',
    klein: 'Klein (2–10)',
    mittel: 'Mittel (11–50)',
    gross: 'Groß (51–250)',
    konzern: 'Konzern (250+)',
  };
  return labels[groesse] || groesse;
}

export function getLandFlag(land: string): string {
  const flags: Record<string, string> = {
    deutschland: '🇩🇪',
    daenemark: '🇩🇰',
    andere: '🌍',
  };
  return flags[land] || '🌍';
}

export function getEventFormatLabel(format: string): string {
  const labels: Record<string, string> = {
    pitch_and_meet: 'Pitch & Meet',
    betriebsbesichtigung: 'Betriebsbesichtigung',
    branchentag: 'Branchentag',
    connect_in_car: 'Connect in Car',
    netzwerktreffen: 'Netzwerktreffen',
    interview: 'Interview',
    sonstiges: 'Sonstiges',
  };
  return labels[format] || format;
}
