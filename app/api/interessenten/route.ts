// Dashboard API — liest echte Interessenten aus Neon-DB
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT
          i.id,
          i."anfrageId",
          i.firmenname,
          i.ansprechpartner,
          i.email,
          i.telefon,
          i.status::text,
          i."matchScore",
          i."createdAt",
          i.notiz,
          i.freigegeben,
          a."anzeigenId",
          a.firmenname AS anfrage_firma
        FROM "Interessent" i
        LEFT JOIN "Anfrage" a ON a.id = i."anfrageId"
        ORDER BY i."createdAt" DESC
      `);

      const interessenten = result.rows.map(row => ({
        id: row.id,
        anfrageId: row.anfrageId,
        anfrageFirma: row.anfrage_firma || '',
        anzeigenId: row.anzeigenid || '',
        firmenname: row.firmenname,
        ansprechpartner: row.ansprechpartner,
        email: row.email,
        telefon: row.telefon || undefined,
        status: mapInteressentStatus(row.status, row.freigegeben),
        matchScore: row.matchScore || undefined,
        createdAt: row.createdat ? new Date(row.createdat).toISOString().split('T')[0] : '',
        notiz: row.notiz || undefined,
        // Felder die aus DB nicht verfügbar sind — Defaults
        sprachen: [] as string[],
        matchGruende: [] as string[],
        matchRisiken: [] as string[],
        ersteindruck: 'neutral' as const,
        passung: 'mittel' as const,
        seriositaet: 'ungeprueft' as const,
      }));

      return NextResponse.json(interessenten);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[Dashboard API /interessenten]', error);
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 });
  }
}

// Status einer Interessenten-Anfrage aktualisieren
export async function PATCH(request: Request) {
  try {
    const { id, status, freigegeben } = await request.json();
    if (!id) return NextResponse.json({ error: 'id erforderlich' }, { status: 400 });

    const client = await pool.connect();
    try {
      const dbStatus = mapStatusToDb(status);
      await client.query(
        `UPDATE "Interessent" SET status = $1::\"InteressentStatus\", freigegeben = $2, "updatedAt" = NOW() WHERE id = $3`,
        [dbStatus, freigegeben ?? false, id]
      );
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[Dashboard API PATCH /interessenten]', error);
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 });
  }
}

function mapInteressentStatus(dbStatus: string, freigegeben: boolean): string {
  if (freigegeben && dbStatus === 'neu') return 'freigegeben';
  const map: Record<string, string> = {
    neu: 'neu',
    freigegeben: 'freigegeben',
    kontakt_laeuft: 'kontakt_laeuft',
    feedback_ausstehend: 'feedback_ausstehend',
    erfolgreich: 'erfolgreich',
    spam: 'spam',
    unqualifiziert: 'abgelehnt',
    stalled: 'abgelehnt',
    abgelehnt: 'abgelehnt',
  };
  return map[dbStatus] || 'neu';
}

function mapStatusToDb(status: string): string {
  const map: Record<string, string> = {
    neu: 'neu',
    freigegeben: 'freigegeben',
    kontakt_laeuft: 'kontakt_laeuft',
    feedback_ausstehend: 'feedback_ausstehend',
    erfolgreich: 'erfolgreich',
    spam: 'spam',
    abgelehnt: 'abgelehnt',
  };
  return map[status] || 'neu';
}
