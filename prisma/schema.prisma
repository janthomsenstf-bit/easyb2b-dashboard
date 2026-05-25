generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── BRANCHEN & WISSENSBASIS ─────────────────────────────────────

model Branche {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  beschreibung String?
  wissensbasis BranchenWissen[]
  anfragen    Anfrage[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BranchenWissen {
  id          String   @id @default(cuid())
  branche     Branche  @relation(fields: [brancheId], references: [id])
  brancheId   String
  frage       String
  frageTyp    FrageTyp
  pflicht     Boolean  @default(false)
  koKriterium Boolean  @default(false)
  quelle      WissensQuelle
  bestaetigt  Boolean  @default(false)
  createdAt   DateTime @default(now())
}

enum WissensQuelle {
  betreiber
  ki_vorschlag
  ki_bestaetigt
}

// ─── ANFRAGEN (ANZEIGEN) ─────────────────────────────────────────

model Anfrage {
  id              String        @id @default(cuid())
  anzeigenId      String        @unique
  richtung        Richtung
  art             AnfrageArt
  branche         Branche       @relation(fields: [brancheId], references: [id])
  brancheId       String
  gesuchteBranche String?
  firmenname      String
  standort        String
  website         String?
  sprachen        Sprache[]
  beschreibung    String
  ziel            String
  persönlicherTouch String
  mustHaves       String?
  niceToHaves     String?
  reifegrad       Reifegrad
  gueltigBis      DateTime
  sichtbarkeit    Sichtbarkeit
  status          AnfrageStatus @default(eingehend)
  kontaktTimer    DateTime?
  ansprechpartner String
  email           String
  telefon         String?
  kiAnzeigentext  String?
  kiStrukturiert  Boolean       @default(false)
  frageFormular   Frageformular?
  interessenten   Interessent[]
  reviewOk        Boolean       @default(false)
  reviewNotiz     String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum Richtung      { de_dk dk_de }
enum AnfrageArt    { lieferant kunden kooperation vertrieb }
enum Reifegrad     { idee konzept bereit sofort }
enum Sichtbarkeit  { intern anonym oeffentlich }
enum Sprache       { deutsch daenisch englisch }

enum AnfrageStatus {
  eingehend
  aktiv
  interessent_vorhanden
  mehrere_interessenten
  kontakt_laeuft
  vermittelt
  stalled
  pausiert
  archiviert
}

// ─── FRAGEFORMULARE (KI-GENERIERT) ───────────────────────────────

model Frageformular {
  id          String    @id @default(cuid())
  anfrage     Anfrage   @relation(fields: [anfrageId], references: [id])
  anfrageId   String    @unique
  fragen      Frage[]
  aktiv       Boolean   @default(true)
  version     Int       @default(1)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Frage {
  id            String        @id @default(cuid())
  formular      Frageformular @relation(fields: [formularId], references: [id])
  formularId    String
  reihenfolge   Int
  text          String
  typ           FrageTyp
  pflicht       Boolean       @default(true)
  koKriterium   Boolean       @default(false)
  koWert        String?
  optionen      String[]
  quelle        FrageQuelle
  kiVorschlag   Boolean       @default(false)
  bestaetigt    Boolean       @default(true)
  antworten     Antwort[]
  createdAt     DateTime      @default(now())
}

enum FrageTyp {
  zahl
  text_kurz
  text_lang
  ja_nein
  auswahl_single
  auswahl_multi
  skala
  datum
}

enum FrageQuelle {
  anzeige
  ki_schicht2
  betreiber
}

// ─── INTERESSENTEN ───────────────────────────────────────────────

model Interessent {
  id              String              @id @default(cuid())
  anfrage         Anfrage             @relation(fields: [anfrageId], references: [id])
  anfrageId       String
  firmenname      String
  ansprechpartner String
  email           String
  telefon         String?
  antworten       Antwort[]
  status          InteressentStatus   @default(neu)
  freigegeben     Boolean             @default(false)
  kontaktDatum    DateTime?
  matchScore      Int?
  matchBewertung  Json?
  kiBewertungDatum DateTime?
  feedbackSuchender   FeedbackStatus  @default(ausstehend)
  feedbackInteressent FeedbackStatus  @default(ausstehend)
  reminder5Gesendet   Boolean         @default(false)
  reminder10Gesendet  Boolean         @default(false)
  stalledGesetzt      Boolean         @default(false)
  notiz           String?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
}

enum InteressentStatus {
  neu
  freigegeben
  kontakt_laeuft
  feedback_ausstehend
  erfolgreich
  spam
  unqualifiziert
  stalled
  abgelehnt
}

enum FeedbackStatus {
  ausstehend
  kontakt_hergestellt
  kein_kontakt
  erfolg
  kein_match
}

// ─── FORMULAR-ANTWORTEN ──────────────────────────────────────────

model Antwort {
  id            String      @id @default(cuid())
  interessent   Interessent @relation(fields: [interessentId], references: [id])
  interessentId String
  frage         Frage       @relation(fields: [frageId], references: [id])
  frageId       String
  wert          String
  koVerletzt    Boolean     @default(false)
  createdAt     DateTime    @default(now())
}

// ─── BLACKLIST ───────────────────────────────────────────────────

model Blacklist {
  id          String   @id @default(cuid())
  email       String   @unique
  firmenname  String?
  grund       BlacklistGrund
  notiz       String?
  createdAt   DateTime @default(now())
}

enum BlacklistGrund {
  spam
  kein_kontakt
  falsche_angaben
  unernst
}

// ─── E-MAIL LOG ──────────────────────────────────────────────────

model EmailLog {
  id          String   @id @default(cuid())
  an          String
  betreff     String
  typ         EmailTyp
  anfrageId   String?
  interessentId String?
  erfolg      Boolean
  createdAt   DateTime @default(now())
}

enum EmailTyp {
  bestaetigung_interessent
  benachrichtigung_betreiber
  kontaktdaten_suchender
  kontaktdaten_interessent
  reminder_tag5
  reminder_tag10
  stalled_alarm
  ablauf_warnung
}