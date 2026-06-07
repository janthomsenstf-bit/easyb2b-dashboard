import { NextRequest, NextResponse } from 'next/server';
import {
  sendeEmail,
  baueFreigabeMailSuchender,
  baueFreigabeMailInteressent,
  baueMatchPaketMail,
} from '@/lib/email';

// POST /api/email/match-consent
// Sendet DSGVO-konforme Freigabe-Anfragen an beide Parteien.
// Typ: 'freigabe_anfragen' | 'match_paket'
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { typ } = body;

    // ── Freigabe-Anfrage an beide Parteien ──────────────────────
    if (typ === 'freigabe_anfragen') {
      const {
        // Suchender
        suchendeEmail, suchenderName, anfrageFirma, anfrageAnzeigenId,
        anfrageBranche, anfrageRegion, anfrageSprachen,
        // Interessent
        interessentEmail, interessentName, interessentFirma,
        interessentBranche, interessentRegion, interessentSprachen,
        // Match
        matchGruende, matchScore,
      } = body;

      if (!suchendeEmail || !interessentEmail) {
        return NextResponse.json({ error: 'E-Mail-Adressen fehlen' }, { status: 400 });
      }

      const htmlSuchender = baueFreigabeMailSuchender({
        suchenderName: suchenderName || 'Ansprechpartner',
        anfrageFirma,
        anfrageId: anfrageAnzeigenId || '',
        interessentFirma,
        interessentBranche,
        interessentRegion,
        interessentSprachen,
        matchGruende: matchGruende || [],
        matchScore: matchScore || 0,
      });

      const htmlInteressent = baueFreigabeMailInteressent({
        interessentName: interessentName || 'Ansprechpartner',
        interessentFirma,
        anfrageId: anfrageAnzeigenId || '',
        anfrageFirma,
        anfrageBranche: anfrageBranche || '',
        anfrageRegion: anfrageRegion || '',
        anfrageSprachen,
        matchGruende: matchGruende || [],
        matchScore: matchScore || 0,
      });

      const [r1, r2] = await Promise.all([
        sendeEmail(
          suchendeEmail,
          `🎯 Easy-B2B: Passender Kontakt gefunden (${anfrageAnzeigenId})`,
          htmlSuchender,
          'match_freigabe_suchender'
        ),
        sendeEmail(
          interessentEmail,
          `🎯 Easy-B2B möchte Sie einem Unternehmen vorstellen`,
          htmlInteressent,
          'match_freigabe_interessent'
        ),
      ]);

      return NextResponse.json({
        success: true,
        gesendetAn: {
          suchender: { email: suchendeEmail, erfolg: r1.success },
          interessent: { email: interessentEmail, erfolg: r2.success },
        },
      });
    }

    // ── Match-Paket (nach beidseitiger Zustimmung) ──────────────
    if (typ === 'match_paket') {
      const {
        // Suchender-Daten
        suchendeEmail, suchenderName, anfrageFirma,
        anfrageTelefon, anfrageWebsite, anfrageLinkedin, anfrageSprachen,
        // Interessent-Daten
        interessentEmail, interessentName, interessentFirma,
        interessentTelefon, interessentWebsite, interessentLinkedin, interessentSprachen,
        // Match-Paket-Details
        empfohlenerErstkontakt, empfohleneSprache, projektziel, hinweise,
      } = body;

      if (!suchendeEmail || !interessentEmail) {
        return NextResponse.json({ error: 'E-Mail-Adressen fehlen' }, { status: 400 });
      }

      // Mail an Suchenden (mit Kontaktdaten des Interessenten)
      const htmlAnSuchenden = baueMatchPaketMail({
        empfaengerName: suchenderName || 'Ansprechpartner',
        empfaengerFirma: anfrageFirma,
        partnerFirma: interessentFirma,
        partnerName: interessentName || 'Ansprechpartner',
        partnerEmail: interessentEmail,
        partnerTelefon: interessentTelefon,
        partnerWebsite: interessentWebsite,
        partnerLinkedin: interessentLinkedin,
        partnerSprachen: interessentSprachen,
        empfohlenerErstkontakt: empfohlenerErstkontakt || 'suchender',
        empfohleneSprache: empfohleneSprache || 'Deutsch',
        projektziel: projektziel || '',
        hinweise: hinweise || [],
      });

      // Mail an Interessenten (mit Kontaktdaten des Suchenden)
      const htmlAnInteressenten = baueMatchPaketMail({
        empfaengerName: interessentName || 'Ansprechpartner',
        empfaengerFirma: interessentFirma,
        partnerFirma: anfrageFirma,
        partnerName: suchenderName || 'Ansprechpartner',
        partnerEmail: suchendeEmail,
        partnerTelefon: anfrageTelefon,
        partnerWebsite: anfrageWebsite,
        partnerLinkedin: anfrageLinkedin,
        partnerSprachen: anfrageSprachen,
        empfohlenerErstkontakt: empfohlenerErstkontakt || 'suchender',
        empfohleneSprache: empfohleneSprache || 'Deutsch',
        projektziel: projektziel || '',
        hinweise: hinweise || [],
      });

      const [r1, r2] = await Promise.all([
        sendeEmail(
          suchendeEmail,
          `📦 Easy-B2B Match-Paket: Kontaktdaten ${interessentFirma}`,
          htmlAnSuchenden,
          'match_paket_suchender'
        ),
        sendeEmail(
          interessentEmail,
          `📦 Easy-B2B Match-Paket: Kontaktdaten ${anfrageFirma}`,
          htmlAnInteressenten,
          'match_paket_interessent'
        ),
      ]);

      return NextResponse.json({
        success: true,
        gesendetAn: {
          suchender: { email: suchendeEmail, erfolg: r1.success },
          interessent: { email: interessentEmail, erfolg: r2.success },
        },
      });
    }

    return NextResponse.json({ error: `Unbekannter Typ: ${typ}` }, { status: 400 });
  } catch (error) {
    console.error('[API/email/match-consent] Fehler:', error);
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}
