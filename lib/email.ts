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
