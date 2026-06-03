import { NextRequest, NextResponse } from 'next/server';
import { sendeEmail, baueIntroMailSuchender, baueIntroMailInteressent } from '@/lib/email';

// POST /api/email/intro
// Sendet Intro-Mails an beide Parteien wenn Operator einen Match freigibt.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      // Suchender (Anfrage-Firma)
      suchendeEmail,
      suchenderName,
      anfrageFirma,
      anfrageAnzeigenId,
      anfrageTelefon,

      // Interessent
      interessentEmail,
      interessentName,
      interessentFirma,
      interessentTelefon,

      // Optional
      operatorNotiz,
    } = body;

    if (!suchendeEmail || !interessentEmail || !anfrageFirma || !interessentFirma) {
      return NextResponse.json(
        { error: 'suchendeEmail, interessentEmail, anfrageFirma und interessentFirma sind erforderlich' },
        { status: 400 }
      );
    }

    const htmlSuchender = baueIntroMailSuchender({
      suchenderName: suchenderName || 'Ansprechpartner',
      anfrageFirma,
      anfrageId: anfrageAnzeigenId || 'Easy-B2B Anfrage',
      interessentFirma,
      interessentName: interessentName || 'Ansprechpartner',
      interessentEmail,
      interessentTelefon: interessentTelefon || '',
      operatorNotiz,
    });

    const htmlInteressent = baueIntroMailInteressent({
      interessentName: interessentName || 'Ansprechpartner',
      interessentFirma,
      anfrageId: anfrageAnzeigenId || 'Easy-B2B Anfrage',
      anfrageFirma,
      anfrageName: suchenderName || 'Ansprechpartner',
      anfrageEmail: suchendeEmail,
      anfrageTelefon: anfrageTelefon || '',
      operatorNotiz,
    });

    const [r1, r2] = await Promise.all([
      sendeEmail(
        suchendeEmail,
        `🤝 Easy-B2B Kontakt: ${interessentFirma} hat Interesse (${anfrageAnzeigenId})`,
        htmlSuchender,
        'intro_suchender'
      ),
      sendeEmail(
        interessentEmail,
        `🤝 Easy-B2B: Kontakt zu ${anfrageFirma} freigegeben (${anfrageAnzeigenId})`,
        htmlInteressent,
        'intro_interessent'
      ),
    ]);

    return NextResponse.json({
      success: true,
      gesendetAn: {
        suchender: { email: suchendeEmail, erfolg: r1.success },
        interessent: { email: interessentEmail, erfolg: r2.success },
      },
    });
  } catch (error) {
    console.error('[API/email/intro] Fehler:', error);
    return NextResponse.json({ error: 'Interner Fehler beim Senden der Intro-Mails' }, { status: 500 });
  }
}
