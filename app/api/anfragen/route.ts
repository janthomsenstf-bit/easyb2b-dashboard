// Dashboard API — liest Anfragen direkt aus Neon-DB
// Mappt DB-Felder auf das Dashboard MockAnfrage-Format

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

function mapStatus(dbStatus: string): string {
  const map: Record<string, string> = {
    eingehend: 'eingehend',
    aktiv: 'aktiv',
    interessent_vorhanden: 'interessent_vorhanden',
    mehrere_interessenten: 'interessent_vorhanden',
    kontakt_laeuft: 'aktiv',
    vermittelt: 'vermittelt',
    stalled: 'pausiert',
    pausiert: 'pausiert',
    archiviert: 'archiviert',
  };
  return map[dbStatus] || dbStatus;
}

function mapMarktplatzStatus(dbStatus: string): string {
  if (dbStatus === 'aktiv' || dbStatus === 'interessent_vorhanden' || dbStatus === 'mehrere_interessenten' || dbStatus === 'kontakt_laeuft') return 'veroeffentlicht';
  if (dbStatus === 'eingehend') return 'intern';
  if (dbStatus === 'pausiert' || dbStatus === 'stalled') return 'pausiert';
  if (dbStatus === 'vermittelt') return 'archiviert';
  if (dbStatus === 'archiviert') return 'archiviert';
  return 'intern';
}

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT
          a.id,
          a."anzeigenId",
          a.firmenname,
          a.standort,
          a.richtung::text,
          a.art::text,
          a.beschreibung,
          a.ziel,
          a.status::text,
          a.sichtbarkeit::text,
          a.ansprechpartner,
          a.email,
          a.telefon,
          a."createdAt",
          a."gueltigBis",
          a.reifegrad::text,
          a."persönlicherTouch",
          a."mustHaves",
          a."niceToHaves",
          b.name AS branche_name,
          COUNT(i.id)::int AS interessenten_count
        FROM "Anfrage" a
        LEFT JOIN "Branche" b ON b.id = a."brancheId"
        LEFT JOIN "Interessent" i ON i."anfrageId" = a.id
        GROUP BY a.id, b.name
        ORDER BY a."createdAt" DESC
      `);

      const anfragen = result.rows.map(row => ({
        id: row.id,
        anzeigenId: row.anzeigenid,
        firmenname: row.firmenname,
        standort: row.standort,
        richtung: row.richtung as 'de_dk' | 'dk_de',
        art: row.art,
        branche: row.branche_name || 'Sonstige',
        beschreibung: row.beschreibung,
        ziel: row.ziel,
        status: mapStatus(row.status),
        sichtbarkeit: row.sichtbarkeit,
        sprachen: [] as string[],
        ansprechpartner: row.ansprechpartner,
        email: row.email,
        telefon: row.telefon || undefined,
        interessentenCount: row.interessenten_count || 0,
        createdAt: row.createdat ? new Date(row.createdat).toISOString().split('T')[0] : '',
        marktplatzStatus: mapMarktplatzStatus(row.status),
        // Zusatzfelder aus DB
        gueltigBis: row.gueltigbis ? new Date(row.gueltigbis).toISOString().split('T')[0] : undefined,
        persönlicherTouch: row['persönlicherTouch'] || undefined,
        mustHaves: row.mustHaves || undefined,
        niceToHaves: row.niceToHaves || undefined,
        // Marktplatz-Daten aus DB-Feldern ableiten
        marktplatzDaten: mapStatus(row.status) === 'aktiv' || row.status === 'interessent_vorhanden' ? {
          titel: row.ziel,
          kurzbeschreibung: row.beschreibung?.slice(0, 250) || '',
          branche: row.branche_name || '',
          richtung: row.richtung as 'de_dk' | 'dk_de',
          region: row.standort,
          wasSuche: row.ziel,
          warumGesucht: row.beschreibung || '',
          anforderungen: row.musthaves || undefined,
          persoenlicheNote: row['persönlicherTouch'] || undefined,
          sichtbarkeit: row.sichtbarkeit as 'oeffentlich' | 'anonym',
          funFactFreigegeben: false,
          laufzeitMonate: 3,
        } : undefined,
        veroeffentlichtAm: mapMarktplatzStatus(row.status) === 'veroeffentlicht'
          ? (row.createdat ? new Date(row.createdat).toISOString().split('T')[0] : undefined)
          : undefined,
        ablaufDatum: row.gueltigbis
          ? new Date(row.gueltigbis).toISOString().split('T')[0]
          : undefined,
      }));

      return NextResponse.json(anfragen);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[Dashboard API /anfragen]', error);
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 });
  }
}

// Status einer Anfrage im Dashboard aktualisieren
export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: 'id und status erforderlich' }, { status: 400 });

    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE "Anfrage" SET status = $1::\"AnfrageStatus\", "updatedAt" = NOW() WHERE id = $2`,
        [status, id]
      );
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[Dashboard API PATCH /anfragen]', error);
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 });
  }
}
