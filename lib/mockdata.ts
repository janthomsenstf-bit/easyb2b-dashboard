// =============================================================
// MOCK-DATEN für Dashboard Testing
// Später durch echte Prisma-Queries ersetzen
// =============================================================

// ─── NETZWERKKONTAKTE ────────────────────────────────────────

export interface MockKontaktHistorie {
  id: string;
  typ: string;
  datum: string;
  notiz: string;
  ergebnis?: string;
  naechsteAktion?: string;
  naechsteAktionAm?: string;
  erledigt: boolean;
  eingetragenVon?: string;
}

export interface MockEmpfehlung {
  id: string;
  empfohleneName: string;
  datum: string;
  kontext?: string;
  status: string;
  ergebnis?: string;
  erfolgreich: boolean;
}

export interface MockNetzwerkkontakt {
  id: string;
  name: string;
  organisation?: string;
  position?: string;
  kategorie: string;
  land: string;
  region?: string;
  branche?: string;
  email?: string;
  telefon?: string;
  linkedin?: string;
  website?: string;
  quelle?: string;
  erstkontakt: string;
  letzterKontakt: string;
  aktivitaetsStatus: string;
  interneNotiz?: string;
  netzwerkWert: number;
  empfehlungen: MockEmpfehlung[];
  historie: MockKontaktHistorie[];
}

export const MOCK_NETZWERKKONTAKTE: MockNetzwerkkontakt[] = [
  {
    id: 'nk-001',
    name: 'Ulrike Brenner',
    organisation: 'IHK Schleswig-Holstein',
    position: 'Bereichsleiterin Internationales',
    kategorie: 'kammer',
    land: 'deutschland',
    region: 'Schleswig-Holstein',
    branche: 'Wirtschaftsförderung',
    email: 'brenner@ihk-sh.de',
    telefon: '+49 431 5194 200',
    linkedin: 'ulrike-brenner-ihk',
    quelle: 'BVMW-Netzwerktreffen Kiel 2024',
    erstkontakt: '2024-09-15',
    letzterKontakt: '2025-05-20',
    aktivitaetsStatus: 'aktiv',
    interneNotiz: 'Sehr starke Vernetzung in Schleswig-Holstein. Öffnet Türen zu Unternehmen in der Region. Monatlicher Austausch geplant.',
    netzwerkWert: 88,
    empfehlungen: [
      { id: 'emp-001', empfohleneName: 'Müller Maschinenbau GmbH', datum: '2025-01-15', kontext: 'Ulrike hat Thomas Müller als Mitglied erwähnt, das dänische Kontakte sucht.', status: 'erfolgreich', ergebnis: 'Anfrage bei Easy-B2B eingereicht. Aktiver Teilnehmer.', erfolgreich: true },
      { id: 'emp-002', empfohleneName: 'Kieler Brauerei', datum: '2025-03-10', kontext: 'Hannah Schmidt, IHK-Mitglied, hat Interesse an dänischem Markt geäußert.', status: 'angenommen', ergebnis: 'Anfrage eingereicht, noch kein Match.', erfolgreich: false },
      { id: 'emp-003', empfohleneName: 'Nordwind Energie AG', datum: '2025-05-05', kontext: 'Dr. Weber hat über IHK-Veranstaltung von Easy-B2B erfahren.', status: 'in_pruefung', erfolgreich: false },
    ],
    historie: [
      { id: 'h-001', typ: 'meeting', datum: '2025-05-20', notiz: 'Persönliches Treffen in Kiel. Ulrike interessiert sich für Kooperation bei Matchmaking-Events.', ergebnis: 'Will Easy-B2B beim nächsten IHK-Netzwerktag vorstellen.', naechsteAktion: 'Präsentation vorbereiten', naechsteAktionAm: '2025-06-01', erledigt: false, eingetragenVon: 'Jan Thomsen' },
      { id: 'h-002', typ: 'telefonat', datum: '2025-03-12', notiz: 'Kurzes Telefonat. Ulrike hat drei weitere Unternehmen aus dem IHK-Netzwerk, die dänische Kontakte suchen.', naechsteAktion: 'Namen per E-Mail schicken lassen', erledigt: true, eingetragenVon: 'Jan Thomsen' },
      { id: 'h-003', typ: 'event', datum: '2025-02-08', notiz: 'Failure Night Schleswig – Ulrike war als Gast dabei. Sehr positives Feedback zur Atmosphäre.', erledigt: true, eingetragenVon: 'Jan Thomsen' },
      { id: 'h-004', typ: 'email', datum: '2024-11-20', notiz: 'Erstes formelles E-Mail nach Kennenlernen auf BVMW-Treffen. Kurzvorstellung von Easy-B2B geschickt.', erledigt: true },
    ],
  },
  {
    id: 'nk-002',
    name: 'Anders Christoffersen',
    organisation: 'Syddansk Erhvervsfremme (SDE)',
    position: 'Projektleder Grenzsregion',
    kategorie: 'wirtschaftsfoerderung',
    land: 'daenemark',
    region: 'Süddänemark',
    branche: 'Wirtschaftsförderung',
    email: 'anders@sde.dk',
    telefon: '+45 76 62 22 00',
    linkedin: 'anders-christoffersen-sde',
    website: 'https://www.sde.dk',
    quelle: 'Interreg-Veranstaltung Kolding 2024',
    erstkontakt: '2024-11-08',
    letzterKontakt: '2025-05-25',
    aktivitaetsStatus: 'aktiv',
    interneNotiz: 'Schlüsselkontakt für die dänische Seite. Anders hat direkten Zugang zu hunderten dänischen KMUs in Süddänemark. Vertrauensverhältnis gut aufgebaut.',
    netzwerkWert: 95,
    empfehlungen: [
      { id: 'emp-004', empfohleneName: 'Nordic Fish A/S', datum: '2024-12-01', kontext: 'Lars Henriksen aus Anders\' Netzwerk, sucht deutschen Vertrieb.', status: 'erfolgreich', ergebnis: 'Aktive Anfrage bei Easy-B2B, 3 Interessenten.', erfolgreich: true },
      { id: 'emp-005', empfohleneName: 'Dansk Design Studio ApS', datum: '2025-01-20', kontext: 'Mette Andersen, Teil des SDE-Netzwerks, hat BVMW-Kontakt gewünscht.', status: 'erfolgreich', ergebnis: 'Aktiv bei Easy-B2B, hoher Vertrauensscore.', erfolgreich: true },
      { id: 'emp-006', empfohleneName: 'GreenTech Aarhus', datum: '2025-04-15', kontext: 'Startup aus SDE-Förderprogramm, interessiert an deutschem Markt.', status: 'angenommen', ergebnis: 'Anfrage eingereicht, Pitch & Meet angemeldet.', erfolgreich: false },
    ],
    historie: [
      { id: 'h-005', typ: 'meeting', datum: '2025-05-25', notiz: 'Strategisches Treffen in Kolding. Diskussion über gemeinsame Vermittlungsstruktur DE–DK. Anders möchte Easy-B2B als offiziellen Partner von SDE positionieren.', ergebnis: 'Entwurf für MoU (Memorandum of Understanding) soll vorbereitet werden.', naechsteAktion: 'MoU-Entwurf ausarbeiten', naechsteAktionAm: '2025-06-15', erledigt: false, eingetragenVon: 'Jan Thomsen' },
      { id: 'h-006', typ: 'event', datum: '2025-05-08', notiz: 'Failure Night in Schleswig. Anders war dabei, sehr begeistert vom Format.', erledigt: true },
      { id: 'h-007', typ: 'telefonat', datum: '2025-03-05', notiz: 'Austausch über drei potenzielle Unternehmen aus dem SDE-Portfolio.', ergebnis: 'Zwei davon haben Kontakt aufgenommen.', erledigt: true },
    ],
  },
  {
    id: 'nk-003',
    name: 'Martin Große-Boymann',
    organisation: 'BVMW Bundesverband',
    position: 'Regionsgeschäftsführer Nord',
    kategorie: 'verband',
    land: 'deutschland',
    region: 'Norddeutschland',
    branche: 'Unternehmensnetzwerk',
    email: 'grosse-boymann@bvmw.de',
    telefon: '+49 40 2263 6800',
    linkedin: 'martin-grosse-boymann',
    quelle: 'Pitch & Meet Vorbereitung 2025',
    erstkontakt: '2025-02-01',
    letzterKontakt: '2025-05-28',
    aktivitaetsStatus: 'aktiv',
    interneNotiz: 'Strategische Partnerschaft. BVMW steht hinter Pitch & Meet. Martin ist der Hauptansprechpartner und öffnet das BVMW-Netzwerk (40.000+ Unternehmen) für Easy-B2B.',
    netzwerkWert: 92,
    empfehlungen: [
      { id: 'emp-007', empfohleneName: 'Schleswig Logistik GmbH', datum: '2025-02-15', kontext: 'BVMW-Mitglied mit Interesse an grenzüberschreitender Logistik.', status: 'erfolgreich', ergebnis: 'Erfolgreiche Vermittlung mit DSV Kolding.', erfolgreich: true },
      { id: 'emp-008', empfohleneName: 'Stadtwerke Lübeck', datum: '2025-04-01', kontext: 'BVMW-nahe Kommune. Interesse an GreenTech aus Dänemark.', status: 'kontaktiert', erfolgreich: false },
    ],
    historie: [
      { id: 'h-008', typ: 'meeting', datum: '2025-05-28', notiz: 'Vorbereitung Pitch & Meet Flensburg gemeinsam. BVMW übernimmt Gästeeinladungen und Pressemitteilung.', naechsteAktion: 'Pressemitteilung abstimmen', naechsteAktionAm: '2025-06-05', erledigt: false, eingetragenVon: 'Jan Thomsen' },
      { id: 'h-009', typ: 'telefonat', datum: '2025-04-18', notiz: 'Abstimmung Teilnehmerliste für Pitch & Meet.', erledigt: true },
      { id: 'h-010', typ: 'email', datum: '2025-02-20', notiz: 'Formelle Kooperationsanfrage bestätigt. BVMW-Logo für Veranstaltungsflyer freigegeben.', erledigt: true },
    ],
  },
  {
    id: 'nk-004',
    name: 'Karin Lundqvist',
    organisation: 'Handelskammer Danmark',
    position: 'Beziehungsmanagerin Deutschland',
    kategorie: 'kammer',
    land: 'daenemark',
    region: 'Kopenhagen',
    branche: 'Wirtschaft & Handel',
    email: 'kl@handelskammer.dk',
    telefon: '+45 33 77 33 77',
    quelle: 'Empfehlung durch Anders Christoffersen',
    erstkontakt: '2025-03-20',
    letzterKontakt: '2025-05-10',
    aktivitaetsStatus: 'aktiv',
    interneNotiz: 'Durch Anders kennengelernt. Gute Kontakte zu dänischen Unternehmen mit Deutschland-Interesse. Noch am Anfang der Beziehung.',
    netzwerkWert: 42,
    empfehlungen: [
      { id: 'emp-009', empfohleneName: 'Bornholm Keramik', datum: '2025-04-10', kontext: 'Pia Sørensen ist Mitglied der Handelskammer, sucht deutschen Markt.', status: 'angenommen', erfolgreich: false },
    ],
    historie: [
      { id: 'h-011', typ: 'telefonat', datum: '2025-05-10', notiz: 'Kennenlerngespräch. Karin interessiert sich für das Modell. Möchte Easy-B2B bei internem Netzwerktag vorstellen.', naechsteAktion: 'Kurzpräsentation schicken (EN)', naechsteAktionAm: '2025-06-01', erledigt: false },
      { id: 'h-012', typ: 'email', datum: '2025-03-22', notiz: 'Erstkontakt per E-Mail. Easy-B2B vorgestellt, positives Echo.', erledigt: true },
    ],
  },
  {
    id: 'nk-005',
    name: 'Thomas Brandt',
    organisation: 'Freier Netzwerker',
    position: 'Unternehmensberater & Connector',
    kategorie: 'berater',
    land: 'deutschland',
    region: 'Hamburg',
    branche: 'Beratung & Strategie',
    email: 'thomas.brandt@strategiebuero.de',
    telefon: '+49 40 999 888 777',
    linkedin: 'thomasbrandt-hh',
    quelle: 'Failure Night Schleswig (Teilnehmer)',
    erstkontakt: '2025-05-08',
    letzterKontakt: '2025-05-14',
    aktivitaetsStatus: 'aktiv',
    interneNotiz: 'Hat sich nach der Failure Night gemeldet. Breites Netzwerk in Hamburg. Kennt viele Mittelständler, die an Dänemark interessiert sind.',
    netzwerkWert: 22,
    empfehlungen: [],
    historie: [
      { id: 'h-013', typ: 'event', datum: '2025-05-08', notiz: 'Failure Night Schleswig. Thomas hat sich nach dem Event spontan vorgestellt.', erledigt: true },
      { id: 'h-014', typ: 'nachricht', datum: '2025-05-14', notiz: 'LinkedIn-Nachricht: Fragt nach Möglichkeit zur Kooperation. Hat 3-4 Unternehmen in Hamburg, die DE-DK-Partner suchen.', naechsteAktion: 'Telefonat vereinbaren', naechsteAktionAm: '2025-06-05', erledigt: false },
    ],
  },
  {
    id: 'nk-006',
    name: 'Hanne Vestergaard',
    organisation: 'Region Syddanmark',
    position: 'Erhvervskoordinator',
    kategorie: 'kommune',
    land: 'daenemark',
    region: 'Region Süddänemark',
    branche: 'Öffentlicher Sektor',
    email: 'hanne.vestergaard@regionsyddanmark.dk',
    quelle: 'Interreg A-Programm Kontakt',
    erstkontakt: '2024-08-01',
    letzterKontakt: '2025-01-15',
    aktivitaetsStatus: 'passiv',
    interneNotiz: 'Wichtige Kontaktin in der Region. Koordiniert Interreg-Fördergelder. Weniger persönlich, aber strategisch wertvoll. Aktuell wenig Aktivität, sollte reaktiviert werden.',
    netzwerkWert: 35,
    empfehlungen: [],
    historie: [
      { id: 'h-015', typ: 'meeting', datum: '2025-01-15', notiz: 'Meeting in Odense. Diskussion über Interreg-Förderung für Easy-B2B-Aktivitäten.', ergebnis: 'Fördermöglichkeit identifiziert. Antrag bis Q3 2025 möglich.', naechsteAktion: 'Förderantrag skizzieren', naechsteAktionAm: '2025-07-01', erledigt: false },
      { id: 'h-016', typ: 'email', datum: '2024-10-10', notiz: 'Erstes Kennenlernen über Interreg-Programmveranstaltung.', erledigt: true },
    ],
  },
];

// ─── SUCCESS STORIES ─────────────────────────────────────────

export interface MockSuccessStory {
  id: string;
  titel: string;
  kurzbeschreibung: string;
  freigabe: 'intern' | 'anonymisiert' | 'freigegeben';
  anonymisiert: boolean;
  // Narrative Felder
  ausgangssituation: string;
  herausforderung?: string;
  gesuch: string;
  vermittlungsweg: string;
  ergebnis: string;
  erkenntnisse?: string;
  // Anon-Versionen
  titelAnon?: string;
  ergebnisAnon?: string;
  // KI-Content
  kiHomepage?: string;
  kiLinkedIn?: string;
  kiNewsletter?: string;
  // Kategorisierung
  branche: string;
  land: string;
  entstehungsweg: string;
  ergebnisTypen: string[];
  // Firmen
  firma1Name: string;
  firma2Name: string;
  // Verknüpfung
  anfrageId?: string;
  eventId?: string;
  createdAt: string;
}

export const MOCK_SUCCESS_STORIES: MockSuccessStory[] = [
  {
    id: 'ss-001',
    titel: 'Dänischer Premium-Gin findet Hamburger Gastronomie',
    kurzbeschreibung: 'Ein dänischer Gin-Hersteller wollte den deutschen Markt erschließen. Über Easy-B2B entstanden erste Gastronomiekontakte in Hamburg.',
    freigabe: 'freigegeben',
    anonymisiert: false,
    ausgangssituation: 'Ein kleiner dänischer Gin-Hersteller aus Kopenhagen hatte ein außergewöhnliches Produkt – botanisch, handgemacht, mit nordischer Identität. Der deutsche Markt war das Ziel, aber die Kontakte fehlten vollständig.',
    herausforderung: 'Keine Vertriebsstruktur in Deutschland, keine Sprachkenntnisse auf Kundenseite, kulturelle Unterschiede beim Verkaufsansatz (Dänen verkaufen durch Produkt, Deutsche erwarten Beratung und Zertifikate).',
    gesuch: 'Gastronomie-Partner, Importeur oder Distributeur in Hamburg und Norddeutschland',
    vermittlungsweg: 'Über die Easy-B2B-Anfrage wurde der Hersteller mit einem Hamburger Getränke-Importeur bekannt gemacht, der bereits skandinavische Produkte führte. Persönliches Gespräch wurde von Jan Thomsen vorbereitet.',
    ergebnis: 'Drei Hamburger Restaurants nehmen den Gin als Signature-Drink auf. Der Importeur hat exklusive Vertriebsrechte für Hamburg und Schleswig-Holstein übernommen.',
    erkenntnisse: 'Kleine dänische Hersteller unterschätzen oft den Aufwand des deutschen Markteintritts. Ein lokaler Partner, der die Kultur kennt, ist wichtiger als das beste Produkt.',
    titelAnon: 'Dänischer Premium-Spirituosen-Hersteller erschließt Hamburger Gastronomie',
    ergebnisAnon: 'Drei Gastronomiebetriebe nehmen das Produkt als Signature-Drink auf. Ein regionaler Importeur übernimmt exklusive Vertriebsrechte für Norddeutschland.',
    kiHomepage: 'Manchmal braucht ein außergewöhnliches Produkt nur den richtigen Türöffner. Ein dänischer Gin-Hersteller suchte den Weg in die Hamburger Gastronomie – und fand ihn über Easy-B2B. Heute steht sein Gin auf den Karten mehrerer Hamburger Restaurants.',
    kiLinkedIn: `🤝 Ein Produkt, das für sich spricht – aber trotzdem jemanden braucht, der die Tür öffnet.

Ein dänischer Premium-Gin-Hersteller wollte in Hamburg Fuß fassen. Das Produkt war überzeugend. Aber ohne lokale Kontakte und Marktkenntnisse kommt man in der Gastronomie nicht weit.

Über Easy-B2B entstand der Kontakt zu einem Hamburger Importeur, der bereits skandinavische Getränke kannte – und verstand, wie man sie in Deutschland verkauft.

Ergebnis: Drei Restaurants, exklusiver Vertrieb, ein echter Marktstart.

Das ist deutsch-dänisches Matchmaking. Persönlich. Konkret. Erfolgreich.

#EasyB2B #DeutschDänisch #Matchmaking #FoodAndBeverage`,
    kiNewsletter: 'Diese Woche möchten wir eine Geschichte teilen, die zeigt, wie schnell aus einem Gespräch etwas Reales werden kann. Ein dänischer Gin-Hersteller und ein Hamburger Importeur: unterschiedliche Kulturen, ein gemeinsames Ziel. Heute steht der Gin auf Hamburger Speisekarten. Manchmal braucht es nicht mehr als den richtigen Moment und den richtigen Anknüpfungspunkt.',
    branche: 'Lebensmittel & Getränke',
    land: 'daenemark',
    entstehungsweg: 'matchmaking',
    ergebnisTypen: ['vertriebspartner', 'markteintritt'],
    firma1Name: 'Copenhagen Gin Collective',
    firma2Name: 'Nordgetränke Hamburg GmbH',
    anfrageId: 'anf-008',
    createdAt: '2025-04-20',
  },
  {
    id: 'ss-002',
    titel: 'Dänisches Eis in deutschen Bäckereien',
    kurzbeschreibung: 'Ein dänischer Eislieferant fand über Easy-B2B eine Bäckereikette in Schleswig-Holstein als Vertriebspartner.',
    freigabe: 'anonymisiert',
    anonymisiert: true,
    ausgangssituation: 'Ein dänisches Speiseeis-Unternehmen mit langjähriger Tradition suchte deutsche Partner, die ihr Eis als Premium-Produkt positionieren könnten. Supermärkte waren nicht das Ziel – Bäckereien und Cafés schon.',
    herausforderung: 'Die Kühlkette ist bei der Zusammenarbeit mit Bäckereien ein kritischer Faktor. Außerdem mussten deutschsprachige Etiketten und Allergenkennzeichnungen angepasst werden.',
    gesuch: 'Bäckereikette oder Konditorei in Norddeutschland mit Premium-Positionierung',
    vermittlungsweg: 'Über die Easy-B2B-Anfrage wurden drei passende Bäckereiunternehmen kontaktiert. Eine Schleswig-Holsteinische Kette mit 12 Filialen zeigte sofortiges Interesse. Das Kennenlernen fand auf einem Easy-B2B-Branchentag statt.',
    ergebnis: 'Pilotprojekt mit 4 Filialen gestartet, monatliche Lieferungen laufen seit März 2025.',
    erkenntnisse: 'Persönliche Begegnung beim Branchentag hat den Deal beschleunigt. Reine Onlinekommunikation hätte es nicht geschafft.',
    titelAnon: 'Dänischer Speiseeis-Hersteller erschließt norddeutsche Bäckereien',
    ergebnisAnon: 'Pilotprojekt mit einer Bäckereikette gestartet. Monatliche Lieferungen laufen erfolgreich.',
    kiHomepage: 'Manchmal ist der Weg in den deutschen Markt kürzer als gedacht. Ein dänischer Speiseeishersteller und eine norddeutsche Bäckereikette – beide mit Anspruch auf Qualität – fanden sich über Easy-B2B. Was als Pilotprojekt begann, ist heute ein regelmäßiger Lieferrhythmus.',
    branche: 'Lebensmittel & Handwerk',
    land: 'daenemark',
    entstehungsweg: 'event',
    ergebnisTypen: ['vertriebspartner', 'markteintritt'],
    firma1Name: '[Dänischer Eishersteller]',
    firma2Name: '[Schleswig-Holsteinische Bäckereikette]',
    createdAt: '2025-03-15',
  },
  {
    id: 'ss-003',
    titel: 'Fugensand für öffentliche Auftraggeber in Deutschland',
    kurzbeschreibung: 'Ein dänischer Hersteller von Spezialbaustoffen fand über Easy-B2B den Weg zu deutschen kommunalen Auftraggebern.',
    freigabe: 'freigegeben',
    anonymisiert: false,
    ausgangssituation: 'Ein dänischer Hersteller von ökologischem Fugensand für Pflasterflächen wollte den deutschen kommunalen Markt erschließen. Das Produkt erfüllte alle EU-Normen, aber der Vertrieb an öffentliche Auftraggeber in Deutschland erfordert spezifisches Marktwissen.',
    herausforderung: 'Ausschreibungsverfahren in Deutschland unterscheiden sich erheblich von dänischen. Kommunen bevorzugen lokale oder etablierte Lieferanten. Zertifizierungen mussten geprüft und anerkannt werden.',
    gesuch: 'Vertriebspartner mit Erfahrung im kommunalen Ausschreibungsmarkt in Deutschland',
    vermittlungsweg: 'Easy-B2B vermittelte den Kontakt zu einem Tiefbau-Vertriebsunternehmen in Schleswig, das bereits kommunale Referenzen hatte und den Hersteller in Ausschreibungen einbinden konnte.',
    ergebnis: 'Zwei gewonnene kommunale Ausschreibungen in Flensburg und Husum. Rahmenvertrag für 2025/2026 in Planung.',
    erkenntnisse: 'Öffentliche Auftraggeber in Deutschland können nur über Insider-Kontakte und Rahmenverträge effizient erschlossen werden. Ein lokaler Vermittler ist unverzichtbar.',
    titelAnon: 'Dänischer Baustoff-Hersteller gewinnt kommunale Aufträge in Deutschland',
    ergebnisAnon: 'Zwei kommunale Ausschreibungen gewonnen. Rahmenvertrag in Vorbereitung.',
    kiHomepage: 'Der Weg in den kommunalen Markt ist in Deutschland steinig – buchstäblich. Ein dänischer Fugensand-Hersteller wollte seine ökologischen Produkte deutschen Städten anbieten. Über Easy-B2B fand er den richtigen Partner mit den richtigen Kontakten. Ergebnis: zwei gewonnene Ausschreibungen in Schleswig-Holstein.',
    kiLinkedIn: `🏗️ Öffentliche Aufträge in Deutschland gewinnen – ohne Ortskenntnisse fast unmöglich.

Ein dänischer Baustoff-Hersteller hatte ein Produkt, das alle Normen erfüllte. Was fehlte: der richtige Partner für den deutschen Ausschreibungsmarkt.

Easy-B2B hat das geändert. Der Kontakt zu einem schleswig-holsteinischen Tiefbau-Vertriebsunternehmen öffnete Türen, die sonst verschlossen geblieben wären.

Heute: zwei gewonnene kommunale Ausschreibungen. Rahmenvertrag in Vorbereitung.

Das ist grenzüberschreitende Zusammenarbeit, die funktioniert.

#EasyB2B #PublicProcurement #DeutschDänisch #GreenBuilding`,
    kiNewsletter: 'Kommunale Aufträge in Deutschland sind für ausländische Unternehmen eine besondere Herausforderung. Umso mehr freuen wir uns, dass wir einen dänischen Hersteller mit dem richtigen deutschen Partner zusammenbringen konnten. Das Ergebnis: zwei Ausschreibungen gewonnen, ein Rahmenvertrag in Sicht. Genau diese Art von nachhaltiger Vermittlung ist unser Ziel.',
    branche: 'Bauwesen & Kommunal',
    land: 'daenemark',
    entstehungsweg: 'matchmaking',
    ergebnisTypen: ['vertriebspartner', 'markteintritt', 'projekt'],
    firma1Name: 'Nordic Ground Materials ApS',
    firma2Name: 'Schleswig Tiefbau-Vertrieb GmbH',
    createdAt: '2025-02-28',
  },
  {
    id: 'ss-004',
    titel: 'Deutsch-dänische Logistik-Partnerschaft auf der Nordroute',
    kurzbeschreibung: 'Schleswig Logistik GmbH und DSV Kolding entwickelten nach der Failure Night eine dauerhafte Kooperation für die Hamburg–Kopenhagen-Route.',
    freigabe: 'freigegeben',
    anonymisiert: false,
    ausgangssituation: 'Schleswig Logistik hatte täglich freie Kapazitäten auf der Nordroute. DSV Kolding suchte verlässliche deutsche Teilladungs-Partner. Beide wussten voneinander – aber es hatte nie einen konkreten Anlass gegeben, ins Gespräch zu kommen.',
    herausforderung: 'Logistikkooperationen erfordern sehr genaue Absprachen zu Haftung, Versicherung und Abrechnung. Außerdem brauchte es persönliches Vertrauen, bevor operative Details besprochen werden konnten.',
    gesuch: 'Jens Petersen: "Wir haben keinen Partner gesucht. Aber als wir Henrik kennenlernten, war sofort klar: Das ist der Richtige."',
    vermittlungsweg: 'Auf der Failure Night in Schleswig. Beide erzählten von gescheiterten Kooperationsversuchen. Das war der Gesprächseinstieg. Jan Thomsen stellte sie danach formell vor.',
    ergebnis: 'Seit März 2025 laufen tägliche Teilladungen auf der Hamburg–Kopenhagen-Route. Kosteneinsparung für beide Seiten: ca. 18%. Gemeinsamer Rahmenvertrag für 2025 abgeschlossen.',
    erkenntnisse: 'Das beste Netzwerken passiert, wenn man nicht netzwerkt. Ein Event, das Ehrlichkeit fordert, schafft mehr Vertrauen als 10 Business-Präsentationen.',
    titelAnon: 'Zwei Logistik-Partner finden sich auf einem Easy-B2B-Event',
    ergebnisAnon: 'Kooperation mit 18% Kosteneinsparung für beide Seiten. Rahmenvertrag abgeschlossen.',
    kiHomepage: 'Manchmal braucht es einen ungewöhnlichen Rahmen, damit Menschen wirklich ins Gespräch kommen. Auf unserer Failure Night erzählten zwei Logistiker voneinander, was nicht geklappt hatte. Was dabei entstanden ist, läuft heute täglich auf der Hamburg–Kopenhagen-Route.',
    kiLinkedIn: `🚛 Die beste Kooperation entsteht, wenn man nicht nach einer sucht.

Auf unserer Failure Night in Schleswig erzählten zwei Logistiker öffentlich von gescheiterten Versuchen. Ehrlichkeit statt Hochglanz.

Der Rest ist Geschichte: Seit März teilen Schleswig Logistik und DSV Kolding täglich Kapazitäten auf der Nordroute. 18% Ersparnis für beide. Kein Pitch, kein Vertrieb – nur ein ehrliches Gespräch.

#EasyB2B #Logistik #FailureNight #DeutschDänisch`,
    kiNewsletter: 'Der wertvollste Moment unserer Failure Night in Schleswig war kein Pitch und keine Präsentation. Es war der Augenblick, als Jens Petersen und Henrik Larsen merkten, dass sie das gleiche Problem hatten – und dass sie es gemeinsam lösen könnten. Heute läuft ihre Kooperation. Täglich.',
    branche: 'Logistik & Transport',
    land: 'deutschland',
    entstehungsweg: 'event',
    ergebnisTypen: ['kooperation', 'projekt'],
    firma1Name: 'Schleswig Logistik GmbH',
    firma2Name: 'DSV Transport Kolding',
    eventId: 'evt-003',
    createdAt: '2025-05-01',
  },
  {
    id: 'ss-005',
    titel: 'IT-Dienstleister erschließt öffentliche Verwaltung in Dänemark',
    kurzbeschreibung: 'Ein deutsches IT-Unternehmen suchte Zugang zum dänischen öffentlichen Sektor. Über einen Netzwerkkontakt aus dem Easy-B2B-Umfeld entstand eine Partnerschaft.',
    freigabe: 'intern',
    anonymisiert: true,
    ausgangssituation: 'Ein Berliner IT-Unternehmen mit Spezialisierung auf Dokumentenmanagement für Behörden wollte sein Produkt in Dänemark testen. Dänische Behörden gelten als sehr digital-affin – ein attraktiver Testmarkt.',
    herausforderung: 'Öffentlicher Sektor in Dänemark: Ausschreibungen auf Dänisch, komplexe GDPR-Anforderungen, Bevorzugung lokaler Anbieter. Das Unternehmen hatte keine Kontakte.',
    gesuch: 'Dänischer IT-Partner mit Erfahrung im öffentlichen Sektor als Kooperationspartner oder Reseller',
    vermittlungsweg: 'Über einen Netzwerkkontakt aus einem Easy-B2B-Frühstücksformat. Kein formelles Matchmaking – ein Gespräch, eine Empfehlung, ein Folgetermin.',
    ergebnis: 'Pilotprojekt mit einer Gemeinde in Mitteljütland gestartet. Noch kein vertraglich gesichertes Ergebnis, aber Gespräche laufen konstruktiv.',
    erkenntnisse: 'Noch in Bearbeitung. Aktuell: Vorsicht bei Kommunikation über Status nach außen.',
    branche: 'IT & Digitalisierung',
    land: 'deutschland',
    entstehungsweg: 'netzwerkkontakt',
    ergebnisTypen: ['markteintritt', 'projekt'],
    firma1Name: '[Berliner IT-Unternehmen]',
    firma2Name: '[Dänischer IT-Partner]',
    createdAt: '2025-05-10',
  },
  {
    id: 'ss-006',
    titel: 'Spezialprodukte aus Dänemark finden deutschen Vertrieb',
    kurzbeschreibung: 'Ein dänisches Unternehmen für Spezialwerkzeug fand über Easy-B2B einen deutschen Großhändler als Vertriebspartner.',
    freigabe: 'anonymisiert',
    anonymisiert: true,
    ausgangssituation: 'Hochspezialisiertes Werkzeug für den Holzbearbeitungssektor. Dänischer Hersteller mit starker Marke in Skandinavien, kaum bekannt in Deutschland.',
    herausforderung: 'Der deutsche Fachhandel ist konservativ. Neue Produkte werden nur über Messen oder persönliche Empfehlungen aufgenommen. Ein Kaltakquise-Ansatz hätte Jahre gedauert.',
    gesuch: 'Fachhandel oder Großhändler für Holzbearbeitungswerkzeug in Deutschland',
    vermittlungsweg: 'Easy-B2B-Anfrage wurde durch Jan Thomsen direkt an drei bekannte Fachhändler weitergeleitet. Einer reagierte sofort – weil er bereits nach nordischen Produkten gesucht hatte.',
    ergebnis: 'Exklusiver Vertriebsvertrag für Deutschland abgeschlossen. Erste Messe-Präsenz gemeinsam auf der HOLZ-HANDWERK Nürnberg 2025 geplant.',
    erkenntnisse: 'Der Fachhändler kannte das Produkt nicht – aber er kannte Easy-B2B und vertraute der Empfehlung. Das zeigt: Vertrauen im Netzwerk überträgt sich auf neue Kontakte.',
    titelAnon: 'Dänischer Werkzeug-Spezialist gewinnt exklusiven deutschen Vertriebspartner',
    ergebnisAnon: 'Exklusiver Vertriebsvertrag abgeschlossen. Gemeinsamer Messeauftritt geplant.',
    kiHomepage: 'Vertrauen überträgt sich. Ein dänischer Werkzeughersteller und ein deutscher Fachhändler kannten sich nicht – aber beide kannten Easy-B2B. Daraus ist ein exklusiver Vertriebsvertrag für Deutschland geworden.',
    branche: 'Handwerk & Industrie',
    land: 'daenemark',
    entstehungsweg: 'matchmaking',
    ergebnisTypen: ['vertriebspartner', 'markteintritt'],
    firma1Name: '[Dänischer Werkzeughersteller]',
    firma2Name: '[Deutscher Fachgroßhändler]',
    createdAt: '2025-05-18',
  },
];

// ─── UNTERNEHMEN ─────────────────────────────────────────────

export interface MockUnternehmen {
  id: string;
  firmenname: string;
  anfrageId?: string;          // Link zur Ursprungs-Anfrage
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
  // Kultur & Zusammenarbeit
  kulturprofil?: string;
  arbeitsweise?: string;
  kommunikationsstil?: string;
  bevorzugteSprache?: string;
  funFactStandard?: string;
  persoenlicheNotiz?: string;
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
    kulturprofil: 'Familiengeführt, direkte Entscheidungswege, sehr auf langfristige Partnerschaften ausgerichtet.',
    kommunikationsstil: 'direkt_informell',
    bevorzugteSprache: 'englisch',
    funFactStandard: 'Am liebsten treffen wir uns persönlich – am besten beim Fisch.',
    persoenlicheNotiz: 'Lars ist sehr offen und herzlich. Schätzt direkte Kommunikation, kein Smalltalk nötig.',
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
    kulturprofil: 'Bodenständig, strukturiert, verlässlich. Typisch norddeutsch-pragmatisch.',
    arbeitsweise: 'Klare Aufgabenverteilung, wöchentliche Abstimmungen, wenig Bürokratie für die Größe.',
    kommunikationsstil: 'strukturiert_formal',
    bevorzugteSprache: 'deutsch',
    funFactStandard: 'Nach einem guten Deal gibt es Currywurst – das ist bei uns Tradition seit 1987.',
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
    kulturprofil: 'Kreativ, offen, sehr international. Team aus 6 Nationen. Design ist hier Lebenseinstellung.',
    arbeitsweise: 'Flat hierarchy, viele kurze Sprints, Feedback-Kultur sehr stark.',
    kommunikationsstil: 'offen_herzlich',
    bevorzugteSprache: 'englisch',
    funFactStandard: 'Als Studio würden wir eine Kooperation feiern, indem wir gemeinsam etwas bauen – buchstäblich.',
    persoenlicheNotiz: 'Mette hat selbst einen deutschen Hintergrund – spricht fließend Deutsch, was die Kommunikation sehr erleichtert.',
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
    kulturprofil: 'Das Grenzland ist ihre Heimat. Deutsch-dänisch ist nicht Herausforderung, sondern Alltag.',
    arbeitsweise: 'Operativ, schnell, lösungsorientiert. Keine langen Meetings.',
    kommunikationsstil: 'direkt_informell',
    bevorzugteSprache: 'deutsch',
    funFactStandard: 'Wir feiern Deals auf der Autobahn zwischen Hamburg und Kolding – mit dem besten Kaffee aus dem Lkw.',
    persoenlicheNotiz: 'Jens spricht fließend Dänisch. Sehr verlässlicher Charakter, hält was er verspricht.',
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

// ─── MARKTPLATZ ──────────────────────────────────────────────

export type MarktplatzStatus =
  | 'intern'
  | 'entwurf'
  | 'zur_pruefung'
  | 'veroeffentlicht'
  | 'pausiert'
  | 'abgelaufen'
  | 'archiviert';

export interface MarktplatzEintrag {
  titel: string;
  kurzbeschreibung: string;
  branche: string;
  richtung: 'de_dk' | 'dk_de';
  region: string;
  wasSuche: string;
  warumGesucht: string;
  anforderungen?: string;
  persoenlicheNote?: string;
  kulturHinweis?: string;
  funFact?: string;
  funFactFreigegeben: boolean;
  sichtbarkeit: 'oeffentlich' | 'anonym';
  laufzeitMonate: number;
  entwurfErstelltAm?: string;
  letzteBearbeitungAm?: string;
}

// ─── WORKFLOW-STATUS (Prozessfluss) ──────────────────────────

export type AnfrageWorkflowStatus =
  | 'neu'
  | 'in_pruefung'
  | 'unternehmen_angelegt'
  | 'unternehmen_verifiziert'
  | 'projekt_erstellt'
  | 'veroeffentlicht'
  | 'archiviert';

export const WORKFLOW_SCHRITTE: { status: AnfrageWorkflowStatus; label: string; schritt: number }[] = [
  { status: 'neu',                   label: 'Neu',                   schritt: 1 },
  { status: 'in_pruefung',           label: 'In Prüfung',            schritt: 2 },
  { status: 'unternehmen_angelegt',  label: 'Unternehmen',           schritt: 3 },
  { status: 'unternehmen_verifiziert',label:'Verifiziert',           schritt: 4 },
  { status: 'projekt_erstellt',      label: 'Projekt',               schritt: 5 },
  { status: 'veroeffentlicht',       label: 'Veröffentlicht',        schritt: 6 },
  { status: 'archiviert',            label: 'Archiviert',            schritt: 7 },
];

export function getWorkflowStatusLabel(s?: AnfrageWorkflowStatus): string {
  return WORKFLOW_SCHRITTE.find(w => w.status === s)?.label ?? 'Neu';
}

export function getWorkflowStatusSchritt(s?: AnfrageWorkflowStatus): number {
  return WORKFLOW_SCHRITTE.find(w => w.status === s)?.schritt ?? 1;
}

export function getWorkflowStatusColor(s?: AnfrageWorkflowStatus): string {
  const map: Record<AnfrageWorkflowStatus, string> = {
    neu:                    '#9E9E9E',
    in_pruefung:            '#FF9900',
    unternehmen_angelegt:   '#2196F3',
    unternehmen_verifiziert:'#4CAF50',
    projekt_erstellt:       '#9C27B0',
    veroeffentlicht:        '#2e7d32',
    archiviert:             '#546e7a',
  };
  return map[s ?? 'neu'] ?? '#9E9E9E';
}

export interface MockAnfrage {
  id: string;
  anzeigenId: string;
  firmenname: string;
  standort: string;
  // FunFact & Persönliche Note
  funFactFrage?: string;
  funFactAntwort?: string;
  funFactAntwortKI?: string;
  kulturHinweis?: string;
  gespraechseinstieg?: string;
  funFactOeffentlich?: boolean;
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
  // Marktplatz-Veröffentlichung
  marktplatzStatus?: MarktplatzStatus;
  marktplatzDaten?: MarktplatzEintrag;
  veroeffentlichtAm?: string;
  ablaufDatum?: string;
  veroeffentlichtVon?: string;
  deaktivierungsGrund?: string;
  // Prozess-Workflow
  workflowStatus?: AnfrageWorkflowStatus;
  unternehmensId?: string;     // Link zum verknüpften Unternehmen
  // Formular-Zuordnung
  anfrageFormularId?: string;       // welches Anfrageformular wurde verwendet
  interessentFormularId?: string;   // welches Interessentenformular für Reaktionen
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

  // Erweiterte Stammdaten (aus Formular)
  position?: string;
  website?: string;
  linkedin?: string;
  land?: string;
  region?: string;
  sprachen?: string[];
  bevorzugteSprache?: string;

  // Formular-Antworten (Bezug zur Anfrage)
  warumInteresse?: string;
  warumPassung?: string;
  beitrag?: string;
  erfahrung?: string;
  referenzen?: string;
  zusammenarbeit?: string;
  interesseLevel?: string;   // kennenlernen | gespraech | pilot | umsetzung
  reaktionszeit?: string;
  einschraenkungen?: string;
  persoenlicheNote?: string;
  funFact?: string;

  // Interne Prüfung (Operator)
  ersteindruck?: string;     // sehr_gut | gut | neutral | kritisch
  passung?: string;          // hoch | mittel | niedrig
  seriositaet?: string;      // geprueft | ungeprueft | kritisch
  gespraechGefuehrt?: boolean;
  websiteGeprueft?: boolean;
  linkedinGeprueft?: boolean;
  referenzenVorhanden?: boolean;
  gespraechsnotiz?: string;

  // Matching-Bezug
  matchGruende?: string[];
  matchRisiken?: string[];
  // Kontakt-Link (nach Konvertierung)
  kontaktId?: string;
  // Formular-Antworten (generisch, aus zugeordnetem Interessentenformular)
  formularId?: string;
  formularAntworten?: FormularAntwort[];
}

// ─── FORMULAR-VORLAGEN ───────────────────────────────────────
// Verwaltbare, branchenspezifische Fragebögen für Anfragen und
// Interessenten. Datenmodell an Homepage-Prisma ausgerichtet.

export type FormularTyp = 'anfrage' | 'interessent';

export type FrageTyp =
  | 'text_kurz' | 'text_lang' | 'auswahl_single' | 'auswahl_multi'
  | 'zahl' | 'ja_nein' | 'skala' | 'datum' | 'datei';

export const FRAGETYP_OPTIONEN: { value: FrageTyp; label: string }[] = [
  { value: 'text_kurz', label: 'Text kurz' },
  { value: 'text_lang', label: 'Text lang' },
  { value: 'auswahl_single', label: 'Auswahl (eine)' },
  { value: 'auswahl_multi', label: 'Mehrfachauswahl' },
  { value: 'zahl', label: 'Zahl' },
  { value: 'ja_nein', label: 'Ja / Nein' },
  { value: 'skala', label: 'Skala 1–10' },
  { value: 'datum', label: 'Datum' },
  { value: 'datei', label: 'Datei-Upload' },
];

export function getFrageTypLabel(t: FrageTyp): string {
  return FRAGETYP_OPTIONEN.find(o => o.value === t)?.label ?? t;
}

export interface FormularFrage {
  id: string;
  reihenfolge: number;
  text: string;
  typ: FrageTyp;
  pflicht: boolean;
  optionen?: string[];   // bei auswahl_single / auswahl_multi
  hinweis?: string;      // Hilfetext unter der Frage
}

export interface FormularVorlage {
  id: string;
  name: string;
  typ: FormularTyp;
  branche?: string;      // undefined = allgemein gültig
  istStandard: boolean;  // Fallback wenn kein Spezialformular zugeordnet
  beschreibung?: string;
  fragen: FormularFrage[];
  aktiv: boolean;
  createdAt: string;
}

export interface FormularAntwort {
  frageId: string;
  frageText: string;
  wert: string;
}

// Hilfsfunktion: passende Vorlage finden (Branchen-Spezial vor Standard)
export function findeFormular(formulare: FormularVorlage[], typ: FormularTyp, branche?: string): FormularVorlage | undefined {
  if (branche) {
    const spezial = formulare.find(f => f.aktiv && f.typ === typ && f.branche === branche);
    if (spezial) return spezial;
  }
  return formulare.find(f => f.aktiv && f.typ === typ && f.istStandard);
}

// ─── Standardfragen ──────────────────────────────────────────

let _fid = 0;
function fr(text: string, typ: FrageTyp, pflicht = true, optionen?: string[], hinweis?: string): FormularFrage {
  _fid += 1;
  return { id: `frq-${_fid}`, reihenfolge: _fid, text, typ, pflicht, optionen, hinweis };
}

const STANDARD_ANFRAGE_FRAGEN: FormularFrage[] = [
  fr('Wer seid ihr?', 'text_lang', true, undefined, 'Kurze Vorstellung eures Unternehmens'),
  fr('Was sucht ihr?', 'text_lang'),
  fr('Warum sucht ihr das?', 'text_lang'),
  fr('In welchem Land / welcher Region?', 'text_kurz'),
  fr('Welche Branche?', 'text_kurz'),
  fr('Welche Anforderungen gibt es?', 'text_lang', false),
  fr('Welche Ausschlusskriterien gibt es?', 'text_lang', false),
  fr('Wie konkret ist das Vorhaben?', 'auswahl_single', true, ['Idee', 'Konzept', 'Bereit', 'Sofort']),
  fr('Wann soll es starten?', 'datum', false),
  fr('Welche Sprachen sind möglich?', 'auswahl_multi', true, ['Deutsch', 'Dänisch', 'Englisch']),
  fr('Gibt es Unterlagen, Bilder oder Produktkataloge?', 'datei', false),
];

const STANDARD_INTERESSENT_FRAGEN: FormularFrage[] = [
  fr('Warum interessiert euch dieses Projekt?', 'text_lang'),
  fr('Warum passt ihr zu dieser Anfrage?', 'text_lang'),
  fr('Was könnt ihr konkret beitragen?', 'text_lang'),
  fr('Welche Erfahrung habt ihr in diesem Bereich?', 'text_lang'),
  fr('Welche Region deckt ihr ab?', 'text_kurz'),
  fr('Welche Sprachen sind möglich?', 'auswahl_multi', true, ['Deutsch', 'Dänisch', 'Englisch']),
  fr('Wie schnell könnt ihr reagieren?', 'auswahl_single', true, ['Sofort', 'Innerhalb 1 Woche', 'Innerhalb 1 Monat']),
  fr('Welche Art der Kooperation stellt ihr euch vor?', 'text_lang'),
  fr('Gibt es Referenzen oder Beispiele?', 'text_lang', false),
];

const FOOD_ANFRAGE_ZUSATZ: FormularFrage[] = [
  fr('Welche Produkte sollen vertrieben werden?', 'text_lang'),
  fr('Gibt es bereits deutsche Etiketten?', 'ja_nein'),
  fr('Sind Zertifikate vorhanden?', 'text_kurz', false),
  fr('Gibt es Listungserfahrung im Einzelhandel?', 'ja_nein'),
  fr('Gibt es deutsche Preislisten?', 'ja_nein', false),
  fr('Sind Logistik und Kühlung geklärt?', 'ja_nein'),
  fr('Gibt es Mindestabnahmemengen?', 'text_kurz', false),
  fr('Welche Zielgruppe wird gesucht?', 'auswahl_multi', true, ['Einzelhandel', 'Gastronomie', 'Großhandel', 'Fachhandel']),
];

const FOOD_INTERESSENT_ZUSATZ: FormularFrage[] = [
  fr('Habt ihr Erfahrung mit Lebensmittelvertrieb?', 'ja_nein'),
  fr('Habt ihr Kontakte zum Lebensmitteleinzelhandel?', 'ja_nein'),
  fr('Habt ihr Kontakte zur Gastronomie?', 'ja_nein', false),
  fr('Welche Produktgruppen vertreibt ihr bereits?', 'text_lang'),
  fr('Gibt es Kühl-/Lagerlogistik?', 'ja_nein'),
  fr('Habt ihr Erfahrung mit Importprodukten?', 'ja_nein', false),
  fr('Welche Regionen deckt ihr ab?', 'text_kurz'),
  fr('Habt ihr Referenzen im Food-Bereich?', 'text_lang', false),
];

export const MOCK_FORMULARE: FormularVorlage[] = [
  {
    id: 'form-001', name: 'Standard Anfrageformular', typ: 'anfrage',
    istStandard: true, beschreibung: 'Allgemeines Formular für alle Branchen, wenn kein Spezialformular zugeordnet ist.',
    fragen: STANDARD_ANFRAGE_FRAGEN, aktiv: true, createdAt: '2025-01-01',
  },
  {
    id: 'form-002', name: 'Standard Interessentenformular', typ: 'interessent',
    istStandard: true, beschreibung: 'Allgemeines Formular für Interessenten, wenn kein Spezialformular zugeordnet ist.',
    fragen: STANDARD_INTERESSENT_FRAGEN, aktiv: true, createdAt: '2025-01-01',
  },
  {
    id: 'form-003', name: 'Food-Markteintritt Deutschland', typ: 'anfrage',
    branche: 'Lebensmittel & Fischerei', istStandard: false,
    beschreibung: 'Für Lebensmittelunternehmen, die in den deutschen Markt möchten.',
    fragen: [...STANDARD_ANFRAGE_FRAGEN.slice(0, 5), ...FOOD_ANFRAGE_ZUSATZ], aktiv: true, createdAt: '2025-02-15',
  },
  {
    id: 'form-004', name: 'Food-Vertriebspartner Deutschland', typ: 'interessent',
    branche: 'Lebensmittel & Fischerei', istStandard: false,
    beschreibung: 'Für Interessenten, die als Food-Vertriebspartner reagieren.',
    fragen: [...STANDARD_INTERESSENT_FRAGEN.slice(0, 5), ...FOOD_INTERESSENT_ZUSATZ], aktiv: true, createdAt: '2025-02-15',
  },
];

// ─── KONTAKTE ────────────────────────────────────────────────
// Dauerhafte Stammdaten — entstehen aus geprüften Interessenten
// oder werden manuell angelegt.

export type KontaktQuelleTyp = 'interessent' | 'manuell' | 'empfehlung' | 'event' | 'gespraech' | 'netzwerk';
export type KontaktStatus    = 'aktiv' | 'pausiert' | 'archiviert';
export type KontaktZuordnungStatus = 'vorgeschlagen' | 'in_pruefung' | 'freigegeben' | 'kontakt_laeuft' | 'abgelehnt' | 'abgeschlossen';

export interface KontaktProjektZuordnung {
  id: string;
  projektId: string;          // = anfrageId
  status: KontaktZuordnungStatus;
  notiz?: string;
  erstelltAm: string;
  erstelltVon: string;
}

export interface MockKontakt {
  id: string;
  quelleTyp: KontaktQuelleTyp;
  interessentId?: string;     // Link zum Ursprungs-Interessenten
  anfrageId?: string;         // Link zur ursprünglichen Anfrage
  firmenname: string;
  ansprechpartner: string;
  email: string;
  telefon?: string;
  website?: string;
  linkedin?: string;
  land?: string;
  region?: string;
  branche?: string;
  sprachen?: string[];
  status: KontaktStatus;
  createdAt: string;
  interneNotiz?: string;
  projektZuordnungen: KontaktProjektZuordnung[];
  formularAntworten?: FormularAntwort[];   // aus Interessent übernommen
}

export function getKontaktQuelleLabel(q: KontaktQuelleTyp): string {
  const map: Record<KontaktQuelleTyp, string> = {
    interessent: '📋 Interessent', manuell: '✏️ Manuell',
    empfehlung: '⭐ Empfehlung', event: '🎤 Event',
    gespraech: '📞 Gespräch', netzwerk: '🕸 Netzwerk',
  };
  return map[q] ?? q;
}

export function getKontaktStatusLabel(s: KontaktStatus): string {
  return { aktiv: 'Aktiv', pausiert: 'Pausiert', archiviert: 'Archiviert' }[s] ?? s;
}
export function getKontaktStatusColor(s: KontaktStatus): string {
  return { aktiv: '#4CAF50', pausiert: '#FF9900', archiviert: '#9E9E9E' }[s] ?? '#999';
}

export function getKontaktZuordnungLabel(s: KontaktZuordnungStatus): string {
  const map: Record<KontaktZuordnungStatus, string> = {
    vorgeschlagen: 'Vorgeschlagen', in_pruefung: 'In Prüfung', freigegeben: 'Freigegeben',
    kontakt_laeuft: 'Kontakt läuft', abgelehnt: 'Abgelehnt', abgeschlossen: 'Abgeschlossen',
  };
  return map[s] ?? s;
}
export function getKontaktZuordnungColor(s: KontaktZuordnungStatus): string {
  const map: Record<KontaktZuordnungStatus, string> = {
    vorgeschlagen: '#2196F3', in_pruefung: '#FF9900', freigegeben: '#4CAF50',
    kontakt_laeuft: '#9C27B0', abgelehnt: '#f44336', abgeschlossen: '#2e7d32',
  };
  return map[s] ?? '#999';
}

export const MOCK_KONTAKTE: MockKontakt[] = [
  {
    id: 'kon-001',
    quelleTyp: 'interessent',
    interessentId: 'int-001',
    anfrageId: 'anf-001',
    firmenname: 'Frische-Markt Hamburg GmbH',
    ansprechpartner: 'Klaus Bergmann',
    email: 'bergmann@frischemarkt-hh.de',
    telefon: '+49 40 123 456',
    website: 'https://frischemarkt-hh.de',
    land: 'deutschland',
    region: 'Hamburg',
    branche: 'Lebensmittel & Fischerei',
    sprachen: ['deutsch', 'englisch'],
    status: 'aktiv',
    createdAt: '2025-05-20',
    interneNotiz: 'Sehr seriöser Partner. Großes Vertriebsnetz in Norddeutschland. Persönliches Gespräch sehr positiv.',
    projektZuordnungen: [
      { id: 'kpz-001', projektId: 'anf-001', status: 'kontakt_laeuft', notiz: 'Aus Interessentenformular. Passung sehr hoch.', erstelltAm: '2025-05-20', erstelltVon: 'Jan Thomsen' },
    ],
  },
  {
    id: 'kon-002',
    quelleTyp: 'interessent',
    interessentId: 'int-004',
    anfrageId: 'anf-002',
    firmenname: 'Vestas Wind Components ApS',
    ansprechpartner: 'Søren Nielsen',
    email: 'nielsen@vestas-comp.dk',
    telefon: '+45 87 65 43 21',
    land: 'daenemark',
    region: 'Jütland',
    branche: 'Maschinenbau & Industrie',
    sprachen: ['daenisch', 'englisch'],
    status: 'aktiv',
    createdAt: '2025-05-23',
    projektZuordnungen: [
      { id: 'kpz-002', projektId: 'anf-002', status: 'kontakt_laeuft', erstelltAm: '2025-05-23', erstelltVon: 'Jan Thomsen' },
    ],
  },
  {
    id: 'kon-003',
    quelleTyp: 'manuell',
    firmenname: 'Hamburger Handelskontor GmbH',
    ansprechpartner: 'Petra Müller',
    email: 'p.mueller@hh-handelskontor.de',
    telefon: '+49 40 987 654',
    website: 'https://hh-handelskontor.de',
    land: 'deutschland',
    region: 'Hamburg',
    branche: 'Handel & Vermittlung',
    sprachen: ['deutsch', 'daenisch'],
    status: 'aktiv',
    createdAt: '2025-04-10',
    interneNotiz: 'Telefonkontakt von Ulrike (IHK). Bereits Erfahrung in DE-DK Geschäften. Sehr interessiert.',
    projektZuordnungen: [],
  },
];

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
    funFactFrage: 'Wie würdet ihr eine erfolgreiche Kooperation feiern?',
    funFactAntwort: 'Wir würden wahrscheinlich zusammen Fisch essen und Bier trinken.',
    funFactAntwortKI: 'Am liebsten würden wir eine erfolgreiche Kooperation ganz unkompliziert feiern – mit frischem Fisch, einem guten dänischen Bier und einem ehrlichen Gespräch auf Augenhöhe.',
    kulturHinweis: 'Dänischer Kommunikationsstil: direkt, informell, herzlich. Kein langer Smalltalk nötig.',
    gespraechseinstieg: 'Frag nach der Familientradition im Unternehmen – Nordic Fish ist seit Generationen in Familienhand.',
    funFactOeffentlich: true,
    workflowStatus: 'veroeffentlicht',
    unternehmensId: 'unt-001',
    anfrageFormularId: 'form-003',
    interessentFormularId: 'form-004',
    marktplatzStatus: 'veroeffentlicht',
    veroeffentlichtAm: '2025-05-15',
    ablaufDatum: '2025-08-15',
    veroeffentlichtVon: 'Jan Thomsen',
    marktplatzDaten: {
      titel: 'Deutschen Vertriebspartner für Premium-Fischprodukte gesucht',
      kurzbeschreibung: 'Dänischer Fischverarbeiter mit 40 Jahren Erfahrung sucht deutschen Vertriebspartner für Premium-Fischprodukte (Lachs, Kabeljau, Hering) im norddeutschen Einzelhandel.',
      branche: 'Lebensmittel & Fischerei',
      richtung: 'dk_de',
      region: 'Norddeutschland',
      wasSuche: 'Vertriebspartner für Einzelhandel (EDEKA, REWE, Feinkost)',
      warumGesucht: 'Wir sind ein dänischer Fischverarbeiter und möchten den deutschen Einzelhandel erschließen. Qualität vor Masse – nur Premium.',
      anforderungen: 'Bestehende Einzelhandels-Kontakte, eigene Kühlkette, mindestens 5 Jahre Branchenerfahrung.',
      persoenlicheNote: 'Wir suchen einen Partner, der unsere Werte teilt – Qualität, Nachhaltigkeit und ein ehrliches Miteinander.',
      kulturHinweis: 'Dänischer Kommunikationsstil: direkt, informell, herzlich. Kein langer Smalltalk nötig.',
      funFact: 'Am liebsten würden wir eine erfolgreiche Kooperation ganz unkompliziert feiern – mit frischem Fisch, einem guten dänischen Bier und einem ehrlichen Gespräch auf Augenhöhe.',
      funFactFreigegeben: true,
      sichtbarkeit: 'oeffentlich',
      laufzeitMonate: 3,
      entwurfErstelltAm: '2025-05-14',
      letzteBearbeitungAm: '2025-05-15',
    },
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
    funFactFrage: 'Was sollte ein Partner über eure Arbeitsweise wissen?',
    funFactAntwort: 'Wir sind direkt und erwarten das auch. Keine langen E-Mail-Ketten.',
    funFactAntwortKI: 'Typisch Müller Maschinenbau: Wir reden lieber einmal kurz am Telefon als zehnmal hin und her zu mailen. Direkt, klar, verlässlich.',
    kulturHinweis: 'Strukturiert, pünktlich, erwartet klare Unterlagen. Typisch deutsch, aber ohne Bürokratie.',
    gespraechseinstieg: 'Thomas ist ein Macher – fang direkt mit konkreten Zahlen und Kapazitäten an.',
    funFactOeffentlich: true,
    workflowStatus: 'veroeffentlicht',
    unternehmensId: 'unt-002',
    marktplatzStatus: 'veroeffentlicht',
    veroeffentlichtAm: '2025-05-21',
    ablaufDatum: '2025-08-21',
    veroeffentlichtVon: 'Jan Thomsen',
    marktplatzDaten: {
      titel: 'Kooperationspartner für Windkraft-Komponenten gesucht',
      kurzbeschreibung: 'Mittelständischer Maschinenbauer sucht dänischen Kooperationspartner für gemeinsame Entwicklung von Windkraft-Komponenten (CNC-Fertigung, Stahlverarbeitung).',
      branche: 'Maschinenbau & Industrie',
      richtung: 'de_dk',
      region: 'Norddeutschland / Dänemark',
      wasSuche: 'Dänischer Entwicklungspartner im Bereich Windkraft',
      warumGesucht: 'Wir bringen CNC-Fertigung und Stahlverarbeitung mit. Gesucht: Partner, der die dänische Windkraft-Expertise einbringt.',
      anforderungen: 'Erfahrung in der Windenergiebranche, Zertifizierungen bevorzugt, Englisch Pflicht.',
      persoenlicheNote: 'Wir sind direkt und erwarten das auch. Keine langen E-Mail-Ketten – wir reden lieber einmal kurz am Telefon.',
      kulturHinweis: 'Strukturiert, pünktlich, erwartet klare Unterlagen. Typisch deutsch, aber ohne Bürokratie.',
      funFact: 'Typisch Müller Maschinenbau: Wir reden lieber einmal kurz am Telefon als zehnmal hin und her zu mailen.',
      funFactFreigegeben: true,
      sichtbarkeit: 'oeffentlich',
      laufzeitMonate: 3,
      entwurfErstelltAm: '2025-05-20',
      letzteBearbeitungAm: '2025-05-21',
    },
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
    workflowStatus: 'projekt_erstellt',
    marktplatzStatus: 'veroeffentlicht',
    veroeffentlichtAm: '2025-05-10',
    ablaufDatum: '2025-08-10',
    veroeffentlichtVon: 'Jan Thomsen',
    marktplatzDaten: {
      titel: 'Vertriebspartner für den deutschen Möbelmarkt gesucht',
      kurzbeschreibung: 'Dänisches Designstudio mit preisgekrönten Möbelkollektionen sucht deutschen Distributor oder Einzelhandelspartner. Nachhaltig produziert, skandinavischer Stil.',
      branche: 'Möbel & Design',
      richtung: 'dk_de',
      region: 'Deutschland (bundesweit)',
      wasSuche: 'Distributor oder Einzelhandelspartner in Deutschland',
      warumGesucht: 'Unsere Möbelkollektion ist in Skandinavien bereits etabliert. Wir suchen einen Partner, der unsere Marke in Deutschland aufbaut.',
      anforderungen: 'Nachhaltigkeitsorientierung, Design-Affinität, bestehende Kontakte zum deutschen Möbelhandel.',
      sichtbarkeit: 'oeffentlich',
      funFactFreigegeben: false,
      laufzeitMonate: 3,
      entwurfErstelltAm: '2025-05-09',
      letzteBearbeitungAm: '2025-05-10',
    },
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
    workflowStatus: 'unternehmen_verifiziert',
    marktplatzStatus: 'entwurf',
    marktplatzDaten: {
      titel: 'Dänische Zulieferer für Offshore-Windpark-Komponenten',
      kurzbeschreibung: 'Deutsches Energieunternehmen sucht dänische Zulieferer für Offshore-Windpark-Komponenten: Kabelverlegung, Unterwasser-Fundamente, Wartungsdienstleistungen.',
      branche: 'Erneuerbare Energien',
      richtung: 'de_dk',
      region: 'Nordsee / Offshore',
      wasSuche: 'Dänische Zulieferer für Offshore-Windpark-Komponenten',
      warumGesucht: 'Wir bauen Offshore-Windparks und suchen erfahrene dänische Zulieferer mit nachgewiesener Offshore-Erfahrung.',
      anforderungen: 'Offshore-Zertifizierungen, Referenzprojekte, Kapazität für Rahmenvertrag.',
      sichtbarkeit: 'anonym',
      funFactFreigegeben: false,
      laufzeitMonate: 3,
      entwurfErstelltAm: '2025-05-28',
    },
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
    funFactFrage: 'Was verbindet euch mit Deutschland/Dänemark?',
    funFactAntwort: 'Ich liebe es, wenn Deutsche meine Keramik in die Hand nehmen und sofort wissen, dass da Liebe drin steckt.',
    funFactAntwortKI: 'Für Pia Sørensen ist Keramik mehr als ein Produkt – es ist ein Gespräch ohne Worte. Wenn ein Kunde aus Deutschland ein Stück in die Hand nimmt und lächelt, ist das besser als jeder Vertrag.',
    kulturHinweis: 'Sehr persönlicher, künstlerischer Ansatz. Nicht als rein kommerziellen Partner angehen.',
    gespraechseinstieg: 'Frag nach der Insel Bornholm – Pia liebt es, darüber zu erzählen.',
    funFactOeffentlich: true,
    workflowStatus: 'veroeffentlicht',
    marktplatzStatus: 'veroeffentlicht',
    veroeffentlichtAm: '2025-05-02',
    ablaufDatum: '2025-08-02',
    veroeffentlichtVon: 'Jan Thomsen',
    marktplatzDaten: {
      titel: 'Deutsche Einzelhändler für handgefertigte Bornholm-Keramik',
      kurzbeschreibung: 'Handgefertigte Keramik aus Bornholm sucht Einzelhändler, Concept Stores oder Online-Shops in Deutschland, die skandinavisches Handwerk schätzen.',
      branche: 'Kunsthandwerk & Keramik',
      richtung: 'dk_de',
      region: 'Deutschland (bundesweit)',
      wasSuche: 'Einzelhändler, Concept Stores oder Online-Shops',
      warumGesucht: 'Jedes Stück ist ein Unikat – handgefertigt mit Liebe. Wir suchen Partner, die diese Philosophie teilen.',
      anforderungen: 'Liebe zum Detail, Interesse an skandinavischem Handwerk, faire Partnerschaft auf Augenhöhe.',
      persoenlicheNote: 'Wenn ein Kunde ein Stück in die Hand nimmt und lächelt, ist das besser als jeder Vertrag.',
      kulturHinweis: 'Sehr persönlicher, künstlerischer Ansatz. Nicht als rein kommerziellen Partner angehen.',
      funFact: 'Für Pia ist Keramik mehr als ein Produkt – es ist ein Gespräch ohne Worte. Wenn ein Kunde aus Deutschland ein Stück in die Hand nimmt und lächelt, ist das besser als jeder Vertrag.',
      funFactFreigegeben: true,
      sichtbarkeit: 'oeffentlich',
      laufzeitMonate: 3,
      entwurfErstelltAm: '2025-05-01',
      letzteBearbeitungAm: '2025-05-02',
    },
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
    workflowStatus: 'archiviert',
    marktplatzStatus: 'archiviert',
    veroeffentlichtAm: '2025-04-15',
    ablaufDatum: '2025-07-15',
    veroeffentlichtVon: 'Jan Thomsen',
    deaktivierungsGrund: 'Projekt erfolgreich abgeschlossen – Partner gefunden',
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
    workflowStatus: 'unternehmen_angelegt',
    marktplatzStatus: 'zur_pruefung',
    marktplatzDaten: {
      titel: 'Deutsche Industriekunden für Wasseraufbereitungs-Pilotprojekte',
      kurzbeschreibung: 'CleanTech-Startup aus Aarhus mit innovativer Wasseraufbereitungstechnologie sucht deutsche Industriekunden für Pilotprojekte.',
      branche: 'Umwelttechnologie',
      richtung: 'dk_de',
      region: 'Deutschland (bundesweit)',
      wasSuche: 'Deutsche Industriekunden für Pilotprojekte',
      warumGesucht: 'Unsere Technologie ist bereit für den Markt. Wir suchen Industriepartner, die mit uns in die Erprobung gehen.',
      anforderungen: 'Industriebetrieb mit eigenem Wasserverbrauch, Offenheit für neue Technologien, Pilotbereitschaft.',
      sichtbarkeit: 'oeffentlich',
      funFactFreigegeben: false,
      laufzeitMonate: 3,
      entwurfErstelltAm: '2025-05-22',
      letzteBearbeitungAm: '2025-05-26',
    },
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
    workflowStatus: 'in_pruefung',
    marktplatzStatus: 'pausiert',
    veroeffentlichtAm: '2025-04-29',
    deaktivierungsGrund: 'Ansprechpartner momentan nicht erreichbar – vorübergehend pausiert',
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
    position: 'Einkaufsleiter',
    website: 'https://frischemarkt-hh.de',
    land: 'deutschland',
    region: 'Hamburg',
    sprachen: ['deutsch', 'englisch'],
    bevorzugteSprache: 'deutsch',
    warumInteresse: 'Wir suchen seit längerem einen verlässlichen Premium-Fischlieferanten aus Skandinavien für unser gehobenes Sortiment.',
    warumPassung: 'Wir beliefern über 40 Restaurants und Feinkostläden in Norddeutschland und haben eine eigene Kühlkette bis Hamburg.',
    beitrag: 'Etablierte Vertriebsstruktur, eigene Logistik, direkter Zugang zu Gastronomie und Einzelhandel.',
    erfahrung: 'Seit 25 Jahren im Fischhandel. Bereits Erfahrung mit norwegischen und isländischen Lieferanten.',
    referenzen: 'Block House, EDEKA Nord, diverse Sternerestaurants.',
    zusammenarbeit: 'Exklusiver Vertrieb für Hamburg/Schleswig-Holstein, später ggf. Ausweitung.',
    interesseLevel: 'gespraech',
    reaktionszeit: 'Innerhalb 1 Woche',
    persoenlicheNote: 'Wir sind ein Familienunternehmen in dritter Generation — Qualität geht bei uns vor Marge.',
    ersteindruck: 'sehr_gut',
    passung: 'hoch',
    seriositaet: 'geprueft',
    gespraechGefuehrt: true,
    websiteGeprueft: true,
    linkedinGeprueft: false,
    referenzenVorhanden: true,
    gespraechsnotiz: 'Telefonat 20.05.: Klaus sehr engagiert, kennt den Markt genau. Will schnell starten. Kühlkette ist das starke Argument.',
    matchGruende: ['Etablierte Vertriebsstruktur in der Zielregion', 'Eigene Kühlkette löst Nordic Fishs Logistik-Sorge', 'Premium-Positionierung passt zum Produkt'],
    matchRisiken: ['Großer Player — könnte kleinen dänischen Lieferanten dominieren'],
    formularId: 'form-004',
    formularAntworten: [
      { frageId: 'fa-1', frageText: 'Habt ihr Erfahrung mit Lebensmittelvertrieb?', wert: 'Ja, seit 25 Jahren im Fischhandel' },
      { frageId: 'fa-2', frageText: 'Habt ihr Kontakte zum Lebensmitteleinzelhandel?', wert: 'Ja, über 40 Restaurants und Feinkostläden, EDEKA Nord' },
      { frageId: 'fa-3', frageText: 'Gibt es Kühl-/Lagerlogistik?', wert: 'Ja, eigene Kühlkette bis Hamburg' },
      { frageId: 'fa-4', frageText: 'Welche Regionen deckt ihr ab?', wert: 'Hamburg, Schleswig-Holstein, Niedersachsen' },
      { frageId: 'fa-5', frageText: 'Habt ihr Referenzen im Food-Bereich?', wert: 'Block House, EDEKA Nord, diverse Sternerestaurants' },
    ],
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
    status: 'kontakt_laeuft',
    matchScore: 92,
    createdAt: '2025-05-22',
    notiz: 'Perfekter Match. Vestas-Zulieferer sucht deutsche CNC-Partner.',
    position: 'Head of Procurement',
    website: 'https://vestas-comp.dk',
    linkedin: 'soren-nielsen-vestas',
    land: 'daenemark',
    region: 'Aarhus',
    sprachen: ['daenisch', 'englisch', 'deutsch'],
    bevorzugteSprache: 'englisch',
    warumInteresse: 'Wir brauchen einen zuverlässigen CNC-Fertigungspartner in Norddeutschland für Windkraft-Stahlkomponenten.',
    warumPassung: 'Wir sind etablierter Vestas-Zulieferer und kennen die Qualitätsanforderungen der Branche genau.',
    beitrag: 'Konstante Großaufträge, technisches Know-how, langfristige Abnahmegarantie.',
    erfahrung: '15 Jahre in der Windkraft-Lieferkette, ISO-zertifiziert.',
    referenzen: 'Vestas, Siemens Gamesa (auf Anfrage).',
    zusammenarbeit: 'Rahmenvertrag mit festen Abnahmemengen über 3 Jahre.',
    interesseLevel: 'umsetzung',
    reaktionszeit: 'Sofort',
    einschraenkungen: 'Benötigt ISO 9001 Zertifizierung beim Partner.',
    persoenlicheNote: 'Wir denken langfristig — uns ist Verlässlichkeit wichtiger als der günstigste Preis.',
    ersteindruck: 'sehr_gut',
    passung: 'hoch',
    seriositaet: 'geprueft',
    gespraechGefuehrt: true,
    websiteGeprueft: true,
    linkedinGeprueft: true,
    referenzenVorhanden: true,
    gespraechsnotiz: 'Video-Call 22.05.: Sehr professionell. Søren spricht gut Deutsch. ISO-Anforderung muss mit Müller geklärt werden — die haben das aber.',
    matchGruende: ['Beide in Windkraft-Lieferkette', 'Komplementär: DK sucht Fertigung, DE bietet CNC', 'Langfristige Abnahmegarantie senkt Müllers Risiko'],
    matchRisiken: ['ISO 9001 muss beim Partner vorhanden sein', 'Großkonzern-Tempo vs. Mittelstand'],
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
    in_pruefung: 'In Prüfung',
    rueckfrage: 'Rückfrage erforderlich',
    nicht_passend: 'Nicht passend',
    kontakt_erstellt: 'Kontakt erstellt',
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
    in_pruefung: '#FF9900',
    rueckfrage: '#FF5722',
    nicht_passend: '#999',
    kontakt_erstellt: '#2e7d32',
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

// ─── EVENTS ──────────────────────────────────────────────────

export interface MockEvent_Full {
  id: string;
  titel: string;
  untertitel?: string;
  beschreibung: string;
  typ: string;
  datum: string;
  uhrzeit: string;
  ort: string;
  land: string;
  veranstalter: string;
  status: string;
  maxTeilnehmer: number;
  sprache: string;
  ziele: string[];
  teilnehmer: MockEventTeilnehmer[];
  feedback: MockEventFeedback[];
  matches: MockEventMatch[];
}

export interface MockEventTeilnehmer {
  id: string;
  firmenname: string;
  ansprechpartner: string;
  email: string;
  land: string;
  status: string;
  warteliste: boolean;
  rolle?: string;
  erschienen: boolean;
}

export interface MockEventFeedback {
  id: string;
  firmenname: string;
  bewertung: number;
  wiederTeilnehmen: boolean;
  neueKontakteGeknuepft: boolean;
  kooperationEntstanden: boolean;
  kommentar?: string;
  verbesserungsvorschlag?: string;
}

export interface MockEventMatch {
  id: string;
  firma1Name: string;
  firma2Name: string;
  vermitteltDurch?: string;
  notiz?: string;
  folgekontakt: boolean;
  kooperation: boolean;
  kooperationsArt?: string;
}

export const MOCK_EVENTS: MockEvent_Full[] = [
  {
    id: 'evt-001',
    titel: 'Pitch & Meet Flensburg',
    untertitel: 'Deutsch-dänische Unternehmen stellen sich vor',
    beschreibung: 'Das erste Pitch & Meet in der Grenzregion. Unternehmen aus Deutschland und Dänemark präsentieren ihre Kooperationssuche live vor Publikum. Danach: Connect in Car mit Mercedes-Format.',
    typ: 'pitch_and_meet',
    datum: '2025-06-15',
    uhrzeit: '15:30 – 20:00 Uhr',
    ort: 'IHK Flensburg, Heinrichstraße 28',
    land: 'deutschland',
    veranstalter: 'Easy-B2B & BVMW Schleswig-Holstein',
    status: 'veroeffentlicht',
    maxTeilnehmer: 40,
    sprache: 'bilingual',
    ziele: ['matchmaking', 'netzwerk', 'kulturverstaendnis'],
    teilnehmer: [
      { id: 'tp-001', firmenname: 'Müller Maschinenbau GmbH', ansprechpartner: 'Thomas Müller', email: 'mueller@maschinenbau-fl.de', land: 'deutschland', status: 'bestaetigt', warteliste: false, rolle: 'Pitcher', erschienen: false },
      { id: 'tp-002', firmenname: 'GreenTech Aarhus', ansprechpartner: 'Mikkel Jensen', email: 'mikkel@greentech-aarhus.dk', land: 'daenemark', status: 'bestaetigt', warteliste: false, rolle: 'Pitcher', erschienen: false },
      { id: 'tp-003', firmenname: 'Stadtwerke Lübeck', ansprechpartner: 'Dr. Peter Krause', email: 'krause@sw-luebeck.de', land: 'deutschland', status: 'bestaetigt', warteliste: false, rolle: 'Gast', erschienen: false },
      { id: 'tp-004', firmenname: 'Nordic Fish A/S', ansprechpartner: 'Lars Henriksen', email: 'lars@nordicfish.dk', land: 'daenemark', status: 'bestaetigt', warteliste: false, rolle: 'Gast', erschienen: false },
      { id: 'tp-005', firmenname: 'Kieler Brauerei', ansprechpartner: 'Hannah Schmidt', email: 'hannah@kieler-brauerei.de', land: 'deutschland', status: 'angemeldet', warteliste: false, rolle: 'Gast', erschienen: false },
      { id: 'tp-006', firmenname: 'Scandi Import ApS', ansprechpartner: 'Katrine Berg', email: 'berg@scandi-import.dk', land: 'daenemark', status: 'angemeldet', warteliste: false, rolle: 'Gast', erschienen: false },
      { id: 'tp-007', firmenname: 'Nordsee Logistik GmbH', ansprechpartner: 'Klaus Werner', email: 'werner@nordseelogistik.de', land: 'deutschland', status: 'warteliste', warteliste: true, erschienen: false },
    ],
    feedback: [],
    matches: [],
  },
  {
    id: 'evt-002',
    titel: 'Nordic No-Bullshit Breakfast',
    untertitel: 'Frühstück ohne Agenda – Netzwerken ohne Druck',
    beschreibung: 'Kein Pitch, keine Präsentationen. Einfach Frühstück, echte Gespräche und deutsch-dänische Begegnungen. Für Menschen, die Netzwerken ohne Theater mögen.',
    typ: 'breakfast_networking',
    datum: '2025-06-28',
    uhrzeit: '08:00 – 10:00 Uhr',
    ort: 'Café Nordlicht, Kolding, Dänemark',
    land: 'daenemark',
    veranstalter: 'Easy-B2B',
    status: 'geplant',
    maxTeilnehmer: 20,
    sprache: 'bilingual',
    ziele: ['netzwerk', 'kulturverstaendnis', 'inspiration'],
    teilnehmer: [
      { id: 'tp-008', firmenname: 'Dansk Design Studio ApS', ansprechpartner: 'Mette Andersen', email: 'mette@danskdesign.dk', land: 'daenemark', status: 'bestaetigt', warteliste: false, erschienen: false },
      { id: 'tp-009', firmenname: 'Nordic Living Store Hamburg', ansprechpartner: 'Anne Paulsen', email: 'paulsen@nordicliving-hh.de', land: 'deutschland', status: 'bestaetigt', warteliste: false, erschienen: false },
      { id: 'tp-010', firmenname: 'DSV Transport Kolding', ansprechpartner: 'Henrik Larsen', email: 'larsen@dsv-kolding.dk', land: 'daenemark', status: 'angemeldet', warteliste: false, erschienen: false },
    ],
    feedback: [],
    matches: [],
  },
  {
    id: 'evt-003',
    titel: 'Failure Night Schleswig',
    untertitel: 'Scheitern als Lernchance – Ehrlichkeit statt Hochglanz',
    beschreibung: 'Unternehmer aus Deutschland und Dänemark erzählen von ihren größten Fehlern im grenzüberschreitenden Geschäft. Kein Blamieren – nur ehrlicher Austausch und Lernen voneinander.',
    typ: 'failure_night',
    datum: '2025-05-08',
    uhrzeit: '18:00 – 21:00 Uhr',
    ort: 'Schleswiger Dom Gesellschaft, Schleswig',
    land: 'deutschland',
    veranstalter: 'Easy-B2B',
    status: 'durchgefuehrt',
    maxTeilnehmer: 30,
    sprache: 'bilingual',
    ziele: ['wissenstransfer', 'kulturverstaendnis', 'netzwerk'],
    teilnehmer: [
      { id: 'tp-011', firmenname: 'Schleswig Logistik GmbH', ansprechpartner: 'Jens Petersen', email: 'petersen@schleswig-logistik.de', land: 'deutschland', status: 'erschienen', warteliste: false, erschienen: true },
      { id: 'tp-012', firmenname: 'DSV Transport Kolding', ansprechpartner: 'Henrik Larsen', email: 'larsen@dsv-kolding.dk', land: 'daenemark', status: 'erschienen', warteliste: false, erschienen: true },
      { id: 'tp-013', firmenname: 'Kieler Brauerei', ansprechpartner: 'Hannah Schmidt', email: 'hannah@kieler-brauerei.de', land: 'deutschland', status: 'erschienen', warteliste: false, erschienen: true },
      { id: 'tp-014', firmenname: 'Bornholm Keramik', ansprechpartner: 'Pia Sørensen', email: 'pia@bornholm-keramik.dk', land: 'daenemark', status: 'erschienen', warteliste: false, erschienen: true },
      { id: 'tp-015', firmenname: 'GreenTech Aarhus', ansprechpartner: 'Mikkel Jensen', email: 'mikkel@greentech-aarhus.dk', land: 'daenemark', status: 'abgesagt', warteliste: false, erschienen: false },
    ],
    feedback: [
      { id: 'fb-001', firmenname: 'Schleswig Logistik GmbH', bewertung: 5, wiederTeilnehmen: true, neueKontakteGeknuepft: true, kooperationEntstanden: true, kommentar: 'Endlich mal kein Hochglanz-Event. Sehr ehrlich, sehr wertvoll. Habe Henrik kennengelernt – wir planen jetzt eine Kooperation.' },
      { id: 'fb-002', firmenname: 'DSV Transport Kolding', bewertung: 5, wiederTeilnehmen: true, neueKontakteGeknuepft: true, kooperationEntstanden: true, kommentar: 'Jens von Schleswig Logistik ist jetzt unser Partner für die Nordroute. Das Event hat das möglich gemacht.' },
      { id: 'fb-003', firmenname: 'Kieler Brauerei', bewertung: 4, wiederTeilnehmen: true, neueKontakteGeknuepft: false, kooperationEntstanden: false, kommentar: 'Gute Atmosphäre. Hätte gern mehr dänische Teilnehmer gesehen.', verbesserungsvorschlag: 'Nächstes Mal auch in Dänemark veranstalten.' },
      { id: 'fb-004', firmenname: 'Bornholm Keramik', bewertung: 4, wiederTeilnehmen: true, neueKontakteGeknuepft: true, kooperationEntstanden: false, kommentar: 'Schön zu hören, dass andere auch Fehler machen. Bin mutiger geworden.' },
    ],
    matches: [
      { id: 'em-001', firma1Name: 'Schleswig Logistik GmbH', firma2Name: 'DSV Transport Kolding', vermitteltDurch: 'Jan Thomsen', notiz: 'Beide haben beim Gespräch über Grenzlogistik sofort eine Verbindung gespürt.', folgekontakt: true, kooperation: true, kooperationsArt: 'Logistik-Partnerschaft Nordroute' },
    ],
  },
  {
    id: 'evt-004',
    titel: 'Blind Matchmaking Hamburg',
    untertitel: 'Wer passt zu wem? Ohne Namen, nur Beschreibung.',
    beschreibung: 'Unternehmen werden anonym beschrieben. Die Teilnehmer raten, wer zu wem passt. Am Ende wird aufgelöst. Ein spielerischer Einstieg ins Matchmaking.',
    typ: 'blind_matchmaking',
    datum: '2025-07-10',
    uhrzeit: '17:00 – 20:00 Uhr',
    ort: 'Handelskammer Hamburg',
    land: 'deutschland',
    veranstalter: 'Easy-B2B & Handelskammer Hamburg',
    status: 'geplant',
    maxTeilnehmer: 24,
    sprache: 'bilingual',
    ziele: ['matchmaking', 'netzwerk', 'inspiration'],
    teilnehmer: [],
    feedback: [],
    matches: [],
  },
  {
    id: 'evt-005',
    titel: 'Walk & Talk Grenzregion',
    untertitel: 'Netzwerken in Bewegung – entlang der deutsch-dänischen Grenze',
    beschreibung: 'Gemeinsames Gehen, Gespräche und Begegnungen entlang der historischen Grenzregion. Eine Mischung aus Natur, Geschichte und Business-Netzwerken.',
    typ: 'walk_and_talk',
    datum: '2025-08-02',
    uhrzeit: '10:00 – 14:00 Uhr',
    ort: 'Grenzübergang Padborg, Start Bahnhof',
    land: 'daenemark',
    veranstalter: 'Easy-B2B',
    status: 'geplant',
    maxTeilnehmer: 16,
    sprache: 'bilingual',
    ziele: ['netzwerk', 'kulturverstaendnis'],
    teilnehmer: [],
    feedback: [],
    matches: [],
  },
];

export function getEventTypLabel(typ: string): string {
  const labels: Record<string, string> = {
    pitch_and_meet: 'Pitch & Meet',
    blind_matchmaking: 'Blind Matchmaking',
    breakfast_networking: 'No-Bullshit Breakfast',
    failure_night: 'Failure Night',
    reverse_networking: 'Reverse Networking',
    problem_solving: 'Bring ein Problem',
    walk_and_talk: 'Walk & Talk',
    betriebsbesichtigung: 'Betriebsbesichtigung',
    branchentag: 'Branchentag',
    connect_in_car: 'Connect in Car',
    online_webinar: 'Online Webinar',
    sonstiges: 'Sonstiges',
  };
  return labels[typ] || typ;
}

export function getEventTypIcon(typ: string): string {
  const icons: Record<string, string> = {
    pitch_and_meet: '🎤',
    blind_matchmaking: '🎭',
    breakfast_networking: '☕',
    failure_night: '💥',
    reverse_networking: '🔄',
    problem_solving: '💡',
    walk_and_talk: '🚶',
    betriebsbesichtigung: '🏭',
    branchentag: '📅',
    connect_in_car: '🚗',
    online_webinar: '💻',
    sonstiges: '📌',
  };
  return icons[typ] || '📌';
}

export function getEventStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    geplant: 'Geplant',
    veroeffentlicht: 'Veröffentlicht',
    ausgebucht: 'Ausgebucht',
    durchgefuehrt: 'Durchgeführt',
    abgesagt: 'Abgesagt',
  };
  return labels[status] || status;
}

export function getEventStatusColor(status: string): string {
  const colors: Record<string, string> = {
    geplant: '#2196F3',
    veroeffentlicht: '#4CAF50',
    ausgebucht: '#FF9900',
    durchgefuehrt: '#9C27B0',
    abgesagt: '#f44336',
  };
  return colors[status] || '#999';
}

export function getEventZielLabel(ziel: string): string {
  const labels: Record<string, string> = {
    matchmaking: 'Matchmaking',
    wissenstransfer: 'Wissenstransfer',
    markteintritt: 'Markteintritt',
    netzwerk: 'Netzwerk',
    kulturverstaendnis: 'Kulturverständnis',
    inspiration: 'Inspiration',
  };
  return labels[ziel] || ziel;
}

export function getTeilnehmerStatusColor(status: string): string {
  const colors: Record<string, string> = {
    angemeldet: '#2196F3',
    bestaetigt: '#4CAF50',
    erschienen: '#9C27B0',
    abgesagt: '#f44336',
    warteliste: '#FF9900',
  };
  return colors[status] || '#999';
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
