// E-Mail-Service für Easy-B2B Dashboard (Resend)
// Wird für Intro-Mails (Kontaktherstellung) verwendet.
// Fehlschläge werden geloggt aber nicht weitergegeben.

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.RESEND_FROM_EMAIL || 'Easy-B2B <noreply@easyb2b.de>';

export async function sendeEmail(to: string, subject: string, html: string, typ: string) {
  if (!resend) {
    console.warn(`[Email] RESEND_API_KEY nicht gesetzt – E-Mail "${typ}" NICHT gesendet an ${to}`);
    return { success: false, error: 'kein_api_key' };
  }
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) {
      console.error(`[Email] Fehler (${typ}):`, error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error(`[Email] Exception (${typ}):`, err);
    return { success: false, error: String(err) };
  }
}

// ─── DSGVO-CONSENT: Freigabe-Mail an Suchenden ─────────────────

export function baueFreigabeMailSuchender(data: {
  suchenderName: string;
  anfrageFirma: string;
  anfrageId: string;
  interessentFirma: string;
  interessentBranche?: string;
  interessentRegion?: string;
  interessentSprachen?: string[];
  matchGruende: string[];
  matchScore: number;
}): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:#003366;padding:20px 24px;border-radius:8px 8px 0 0">
        <h1 style="color:white;margin:0;font-size:20px">🎯 Easy-B2B hat einen passenden Kontakt gefunden</h1>
        <p style="color:#a8c4e0;margin:4px 0 0 0;font-size:13px">Match-Vorschlag · ${new Date().toLocaleDateString('de-DE')}</p>
      </div>
      <div style="background:white;padding:24px;border:1px solid #e0e0e0;border-top:none">
        <p style="font-size:15px">Hallo ${data.suchenderName},</p>
        <p style="line-height:1.6">wir haben einen Interessenten für Ihre Anfrage <strong>${data.anfrageId}</strong> geprüft und halten ihn für passend.</p>

        <div style="margin:20px 0;padding:20px;background:#f0f4ff;border:2px solid #2196F3;border-radius:8px">
          <div style="font-size:11px;font-weight:bold;color:#1565C0;letter-spacing:0.5px;margin-bottom:12px">MATCH-VORSCHLAG · ${data.matchScore}% PASSUNG</div>
          <div style="font-size:18px;font-weight:bold;color:#003366;margin-bottom:14px">${data.interessentFirma}</div>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            ${data.interessentBranche ? `<tr><td style="padding:5px 0;color:#555;width:140px">Branche</td><td style="padding:5px 0;font-weight:600">${data.interessentBranche}</td></tr>` : ''}
            ${data.interessentRegion ? `<tr><td style="padding:5px 0;color:#555">Region</td><td style="padding:5px 0;font-weight:600">${data.interessentRegion}</td></tr>` : ''}
            ${data.interessentSprachen?.length ? `<tr><td style="padding:5px 0;color:#555">Sprachen</td><td style="padding:5px 0;font-weight:600">${data.interessentSprachen.join(', ')}</td></tr>` : ''}
          </table>
        </div>

        <div style="margin:16px 0;padding:14px 16px;background:#e8f5e9;border-radius:8px">
          <div style="font-size:12px;font-weight:bold;color:#1b5e20;margin-bottom:8px">Warum wir glauben, dass dieser Kontakt passt:</div>
          ${data.matchGruende.map(g => `<div style="display:flex;gap:8px;font-size:13px;color:#333;padding:3px 0"><span style="color:#4CAF50;flex-shrink:0">✓</span><span>${g}</span></div>`).join('')}
        </div>

        <div style="background:#fff8e1;padding:14px 16px;border-radius:8px;margin:16px 0;font-size:13px;color:#5d4037">
          <strong>Hinweis:</strong> Kontaktdaten werden erst nach Ihrer ausdrücklichen Zustimmung ausgetauscht. Der Interessent wird ebenfalls um Zustimmung gebeten.
        </div>

        <div style="margin:20px 0;text-align:center">
          <p style="font-size:13px;color:#555;margin-bottom:12px">Möchten Sie, dass Ihre Kontaktdaten an diesen Interessenten weitergegeben werden?</p>
          <p style="font-size:12px;color:#888;font-style:italic;margin-bottom:16px">Mit Ihrer Zustimmung dürfen wir Ihre Kontaktdaten an den Interessenten weitergeben.</p>
          <div style="display:inline-block;padding:12px 28px;background:#4CAF50;color:white;border-radius:8px;font-size:14px;font-weight:700;margin-right:8px">✅ Kontaktdaten freigeben</div>
          <div style="display:inline-block;padding:12px 28px;background:#f5f5f5;color:#666;border-radius:8px;font-size:14px;font-weight:600;border:1px solid #ddd">❌ Kein Interesse</div>
        </div>

        <p style="font-size:11px;color:#888;line-height:1.5;margin-top:20px">
          Diese E-Mail wurde im Rahmen des Easy-B2B Matchmaking-Prozesses versendet. Ihre Zustimmung wird DSGVO-konform dokumentiert (Zeitpunkt, Person, Unternehmen). Ohne Ihre aktive Freigabe werden keine Kontaktdaten weitergegeben.
        </p>
      </div>
      <div style="padding:12px 24px;font-size:11px;color:#999;text-align:center">Easy-B2B · Deutsch-Dänisches Matchmaking-Netzwerk</div>
    </div>`;
}

// ─── DSGVO-CONSENT: Freigabe-Mail an Interessenten ──────────────

export function baueFreigabeMailInteressent(data: {
  interessentName: string;
  interessentFirma: string;
  anfrageId: string;
  anfrageFirma: string;
  anfrageBranche: string;
  anfrageRegion: string;
  anfrageSprachen?: string[];
  matchGruende: string[];
  matchScore: number;
}): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:#003366;padding:20px 24px;border-radius:8px 8px 0 0">
        <h1 style="color:white;margin:0;font-size:20px">🎯 Easy-B2B möchte Sie einem Unternehmen vorstellen</h1>
        <p style="color:#a8c4e0;margin:4px 0 0 0;font-size:13px">Match-Vorschlag · ${new Date().toLocaleDateString('de-DE')}</p>
      </div>
      <div style="background:white;padding:24px;border:1px solid #e0e0e0;border-top:none">
        <p style="font-size:15px">Hallo ${data.interessentName},</p>
        <p style="line-height:1.6">wir glauben, dass das Projekt <strong>${data.anfrageId}</strong> sehr gut zu Ihrem Profil passt.</p>

        <div style="margin:20px 0;padding:20px;background:#f0f4ff;border:2px solid #2196F3;border-radius:8px">
          <div style="font-size:11px;font-weight:bold;color:#1565C0;letter-spacing:0.5px;margin-bottom:12px">PROJEKT-VORSTELLUNG · ${data.matchScore}% PASSUNG</div>
          <div style="font-size:18px;font-weight:bold;color:#003366;margin-bottom:14px">${data.anfrageFirma}</div>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:5px 0;color:#555;width:140px">Branche</td><td style="padding:5px 0;font-weight:600">${data.anfrageBranche}</td></tr>
            <tr><td style="padding:5px 0;color:#555">Region</td><td style="padding:5px 0;font-weight:600">${data.anfrageRegion}</td></tr>
            ${data.anfrageSprachen?.length ? `<tr><td style="padding:5px 0;color:#555">Sprachen</td><td style="padding:5px 0;font-weight:600">${data.anfrageSprachen.join(', ')}</td></tr>` : ''}
          </table>
        </div>

        <div style="margin:16px 0;padding:14px 16px;background:#e8f5e9;border-radius:8px">
          <div style="font-size:12px;font-weight:bold;color:#1b5e20;margin-bottom:8px">Warum wir glauben, dass dieses Projekt für Sie interessant ist:</div>
          ${data.matchGruende.map(g => `<div style="display:flex;gap:8px;font-size:13px;color:#333;padding:3px 0"><span style="color:#4CAF50;flex-shrink:0">✓</span><span>${g}</span></div>`).join('')}
        </div>

        <div style="background:#fff8e1;padding:14px 16px;border-radius:8px;margin:16px 0;font-size:13px;color:#5d4037">
          <strong>Hinweis:</strong> Kontaktdaten werden erst nach Ihrer ausdrücklichen Zustimmung ausgetauscht. Das suchende Unternehmen wird ebenfalls um Zustimmung gebeten.
        </div>

        <div style="margin:20px 0;text-align:center">
          <p style="font-size:13px;color:#555;margin-bottom:12px">Möchten Sie, dass Ihre Kontaktdaten an dieses Unternehmen weitergegeben werden?</p>
          <p style="font-size:12px;color:#888;font-style:italic;margin-bottom:16px">Mit Ihrer Zustimmung dürfen wir Ihre Kontaktdaten an das suchende Unternehmen weitergeben.</p>
          <div style="display:inline-block;padding:12px 28px;background:#4CAF50;color:white;border-radius:8px;font-size:14px;font-weight:700;margin-right:8px">✅ Kontaktdaten freigeben</div>
          <div style="display:inline-block;padding:12px 28px;background:#f5f5f5;color:#666;border-radius:8px;font-size:14px;font-weight:600;border:1px solid #ddd">❌ Kein Interesse</div>
        </div>

        <p style="font-size:11px;color:#888;line-height:1.5;margin-top:20px">
          Diese E-Mail wurde im Rahmen des Easy-B2B Matchmaking-Prozesses versendet. Ihre Zustimmung wird DSGVO-konform dokumentiert (Zeitpunkt, Person, Unternehmen). Ohne Ihre aktive Freigabe werden keine Kontaktdaten weitergegeben.
        </p>
      </div>
      <div style="padding:12px 24px;font-size:11px;color:#999;text-align:center">Easy-B2B · Deutsch-Dänisches Matchmaking-Netzwerk</div>
    </div>`;
}

// ─── MATCH-PAKET: Kontaktdaten nach beidseitiger Zustimmung ─────

export function baueMatchPaketMail(data: {
  empfaengerName: string;
  empfaengerFirma: string;
  partnerFirma: string;
  partnerName: string;
  partnerEmail: string;
  partnerTelefon?: string;
  partnerWebsite?: string;
  partnerLinkedin?: string;
  partnerSprachen?: string[];
  empfohlenerErstkontakt: 'suchender' | 'interessent';
  empfohleneSprache: string;
  projektziel: string;
  hinweise: string[];
}): string {
  const istErstkontakt = (data.empfohlenerErstkontakt === 'suchender' && data.empfaengerFirma !== data.partnerFirma)
    || (data.empfohlenerErstkontakt === 'interessent' && data.empfaengerFirma === data.partnerFirma);
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:#003366;padding:20px 24px;border-radius:8px 8px 0 0">
        <h1 style="color:white;margin:0;font-size:20px">📦 Ihr Match-Paket von Easy-B2B</h1>
        <p style="color:#a8c4e0;margin:4px 0 0 0;font-size:13px">Beide Seiten haben zugestimmt · ${new Date().toLocaleDateString('de-DE')}</p>
      </div>
      <div style="background:white;padding:24px;border:1px solid #e0e0e0;border-top:none">
        <p style="font-size:15px">Hallo ${data.empfaengerName},</p>
        <p style="line-height:1.6">beide Seiten haben der Kontaktfreigabe zugestimmt. Hier sind die Kontaktdaten Ihres Match-Partners:</p>

        <div style="margin:20px 0;padding:20px;background:#e8f5e9;border:2px solid #4CAF50;border-radius:8px">
          <div style="font-size:11px;font-weight:bold;color:#2e7d32;letter-spacing:0.5px;margin-bottom:12px">✅ MATCH BESTÄTIGT — KONTAKTDATEN</div>
          <div style="font-size:18px;font-weight:bold;color:#1b5e20;margin-bottom:10px">${data.partnerFirma}</div>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:5px 0;color:#555;width:140px">Ansprechpartner</td><td style="padding:5px 0;font-weight:bold">${data.partnerName}</td></tr>
            <tr><td style="padding:5px 0;color:#555">E-Mail</td><td style="padding:5px 0"><a href="mailto:${data.partnerEmail}" style="color:#003366;font-weight:bold">${data.partnerEmail}</a></td></tr>
            ${data.partnerTelefon ? `<tr><td style="padding:5px 0;color:#555">Telefon</td><td style="padding:5px 0;font-weight:bold">${data.partnerTelefon}</td></tr>` : ''}
            ${data.partnerWebsite ? `<tr><td style="padding:5px 0;color:#555">Website</td><td style="padding:5px 0"><a href="${data.partnerWebsite}" style="color:#003366">${data.partnerWebsite}</a></td></tr>` : ''}
            ${data.partnerLinkedin ? `<tr><td style="padding:5px 0;color:#555">LinkedIn</td><td style="padding:5px 0">${data.partnerLinkedin}</td></tr>` : ''}
            ${data.partnerSprachen?.length ? `<tr><td style="padding:5px 0;color:#555">Sprachen</td><td style="padding:5px 0">${data.partnerSprachen.join(', ')}</td></tr>` : ''}
          </table>
        </div>

        <div style="margin:16px 0;padding:14px 16px;background:#f0f4ff;border-radius:8px">
          <div style="font-size:12px;font-weight:bold;color:#003366;margin-bottom:10px">Hinweise zum Erstkontakt</div>
          <div style="font-size:13px;color:#333;margin-bottom:6px">
            ${istErstkontakt ? '👆 <strong>Sie sind gebeten, den Erstkontakt herzustellen.</strong>' : '⏳ <strong>Ihr Match-Partner wird den Erstkontakt herstellen.</strong>'}
          </div>
          <div style="font-size:13px;color:#333;margin-bottom:6px">🗣 <strong>Empfohlene Sprache:</strong> ${data.empfohleneSprache}</div>
          <div style="font-size:13px;color:#333;margin-bottom:8px">🎯 <strong>Projektziel:</strong> ${data.projektziel}</div>
          ${data.hinweise.map(h => `<div style="display:flex;gap:8px;font-size:13px;color:#555;padding:2px 0"><span>💡</span><span>${h}</span></div>`).join('')}
        </div>

        <div style="margin-top:16px;padding:12px;background:#f5f5f5;border-radius:6px;font-size:12px;color:#666">
          💡 <strong>Tipp:</strong> Nennen Sie Easy-B2B als gemeinsamen Kontext — das schafft sofort Vertrauen. Wir freuen uns über Feedback nach dem ersten Gespräch.
        </div>
      </div>
      <div style="padding:12px 24px;font-size:11px;color:#999;text-align:center">Easy-B2B · Deutsch-Dänisches Matchmaking-Netzwerk</div>
    </div>`;
}

// ─── BISHERIGE INTRO-MAILS (Legacy) ─────────────────────────────

export function baueIntroMailSuchender(data: {
  suchenderName: string;
  anfrageFirma: string;
  anfrageId: string;
  interessentFirma: string;
  interessentName: string;
  interessentEmail: string;
  interessentTelefon?: string;
  operatorNotiz?: string;
}): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:#003366;padding:20px 24px;border-radius:8px 8px 0 0">
        <h1 style="color:white;margin:0;font-size:20px">🤝 Easy-B2B stellt vor</h1>
        <p style="color:#a8c4e0;margin:4px 0 0 0;font-size:13px">Kontaktherstellung · ${new Date().toLocaleDateString('de-DE')}</p>
      </div>
      <div style="background:white;padding:24px;border:1px solid #e0e0e0;border-top:none">
        <p style="font-size:15px">Hallo ${data.suchenderName},</p>
        <p style="line-height:1.6">wir haben einen Interessenten für Ihre Anfrage <strong>${data.anfrageId}</strong> geprüft und freigegeben.</p>
        <div style="margin:20px 0;padding:20px;background:#e8f5e9;border:2px solid #4CAF50;border-radius:8px">
          <div style="font-size:11px;font-weight:bold;color:#2e7d32;letter-spacing:0.5px;margin-bottom:12px">✅ FREIGEGEBENER INTERESSENT</div>
          <div style="font-size:18px;font-weight:bold;color:#1b5e20;margin-bottom:10px">${data.interessentFirma}</div>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:5px 0;color:#555;width:130px">Ansprechpartner</td><td style="padding:5px 0;font-weight:bold">${data.interessentName}</td></tr>
            <tr><td style="padding:5px 0;color:#555">E-Mail</td><td style="padding:5px 0"><a href="mailto:${data.interessentEmail}" style="color:#003366;font-weight:bold">${data.interessentEmail}</a></td></tr>
            ${data.interessentTelefon ? `<tr><td style="padding:5px 0;color:#555">Telefon</td><td style="padding:5px 0;font-weight:bold">${data.interessentTelefon}</td></tr>` : ''}
          </table>
        </div>
        ${data.operatorNotiz ? `<div style="padding:12px 16px;background:#fff8e1;border-radius:6px;font-size:13px;color:#8a6d00;margin-bottom:16px"><strong>Hinweis von Easy-B2B:</strong> ${data.operatorNotiz}</div>` : ''}
        <p style="font-size:13px;line-height:1.6;color:#555">Wir empfehlen, innerhalb von <strong>3–5 Werktagen</strong> Kontakt aufzunehmen. Der Interessent wurde ebenfalls über die Kontaktherstellung informiert.</p>
        <div style="margin-top:16px;padding:12px;background:#f5f5f5;border-radius:6px;font-size:12px;color:#666">💡 <strong>Tipp:</strong> Nennen Sie Easy-B2B als gemeinsamen Kontext – das schafft sofort Vertrauen.</div>
      </div>
      <div style="padding:12px 24px;font-size:11px;color:#999;text-align:center">Easy-B2B · Deutsch-Dänisches Matchmaking-Netzwerk</div>
    </div>`;
}

export function baueIntroMailInteressent(data: {
  interessentName: string;
  interessentFirma: string;
  anfrageId: string;
  anfrageFirma: string;
  anfrageName: string;
  anfrageEmail: string;
  anfrageTelefon?: string;
  operatorNotiz?: string;
}): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:#003366;padding:20px 24px;border-radius:8px 8px 0 0">
        <h1 style="color:white;margin:0;font-size:20px">🤝 Ihr Interesse wurde freigegeben</h1>
        <p style="color:#a8c4e0;margin:4px 0 0 0;font-size:13px">Kontaktherstellung · ${new Date().toLocaleDateString('de-DE')}</p>
      </div>
      <div style="background:white;padding:24px;border:1px solid #e0e0e0;border-top:none">
        <p style="font-size:15px">Hallo ${data.interessentName},</p>
        <p style="line-height:1.6">gute Nachricht! Ihr Interesse an der Anfrage <strong>${data.anfrageId}</strong> wurde geprüft und freigegeben.</p>
        <div style="margin:20px 0;padding:20px;background:#e8f5e9;border:2px solid #4CAF50;border-radius:8px">
          <div style="font-size:11px;font-weight:bold;color:#2e7d32;letter-spacing:0.5px;margin-bottom:12px">✅ SUCHENDE FIRMA (Ihre Kontaktperson)</div>
          <div style="font-size:18px;font-weight:bold;color:#1b5e20;margin-bottom:10px">${data.anfrageFirma}</div>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:5px 0;color:#555;width:130px">Ansprechpartner</td><td style="padding:5px 0;font-weight:bold">${data.anfrageName}</td></tr>
            <tr><td style="padding:5px 0;color:#555">E-Mail</td><td style="padding:5px 0"><a href="mailto:${data.anfrageEmail}" style="color:#003366;font-weight:bold">${data.anfrageEmail}</a></td></tr>
            ${data.anfrageTelefon ? `<tr><td style="padding:5px 0;color:#555">Telefon</td><td style="padding:5px 0;font-weight:bold">${data.anfrageTelefon}</td></tr>` : ''}
          </table>
        </div>
        ${data.operatorNotiz ? `<div style="padding:12px 16px;background:#fff8e1;border-radius:6px;font-size:13px;color:#8a6d00;margin-bottom:16px"><strong>Hinweis von Easy-B2B:</strong> ${data.operatorNotiz}</div>` : ''}
        <p style="font-size:13px;line-height:1.6;color:#555">Nennen Sie Easy-B2B als gemeinsamen Kontext – das schafft sofort Vertrauen. Wir freuen uns über Feedback nach dem ersten Gespräch.</p>
      </div>
      <div style="padding:12px 24px;font-size:11px;color:#999;text-align:center">Easy-B2B · Deutsch-Dänisches Matchmaking-Netzwerk</div>
    </div>`;
}
