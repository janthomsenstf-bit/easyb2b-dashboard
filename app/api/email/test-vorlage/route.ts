import { NextRequest, NextResponse } from 'next/server';
import { sendeEmail } from '@/lib/email';

// POST /api/email/test-vorlage
// Sendet eine Test-E-Mail einer Matchmaking-Vorlage an die Operator-Adresse.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      betreff,
      vorlageName,
      vorlageTyp,
      einleitung,
      hauptinhalt,
      hinweis,
      buttons,
      fusszeile,
    } = body;

    if (!betreff || !vorlageName) {
      return NextResponse.json(
        { error: 'Betreff und Vorlagenname sind erforderlich' },
        { status: 400 },
      );
    }

    // Buttons als HTML rendern
    const buttonHtml = (buttons || []).map((btn: { label: string; farbe: string; aktion: string }) =>
      `<div style="display:inline-block;padding:12px 24px;background-color:${btn.farbe};color:${btn.farbe === '#f5f5f5' ? '#333' : 'white'};border-radius:8px;font-size:14px;font-weight:bold;margin:4px;text-decoration:none;">${btn.label}</div>`
    ).join(' ');

    // Hauptinhalt als HTML-Zeilen
    const inhaltZeilen = (hauptinhalt || '').split('\n').map((line: string) => {
      if (line.startsWith('•') || line.startsWith('- ')) {
        return `<div style="display:flex;gap:8px;font-size:13px;color:#333;padding:3px 0;"><span style="color:#4CAF50;flex-shrink:0;">✓</span><span>${line.replace(/^[•\-]\s*/, '')}</span></div>`;
      }
      if (line.includes(':') && !line.startsWith('Warum') && line.split(':')[0].length < 30) {
        const [key, ...val] = line.split(':');
        return `<div style="font-size:13px;padding:3px 0;"><span style="color:#555;">${key}:</span> <strong>${val.join(':').trim()}</strong></div>`;
      }
      if (!line.trim()) return '<div style="height:8px;"></div>';
      return `<div style="font-size:14px;color:#333;padding:2px 0;line-height:1.6;">${line}</div>`;
    }).join('');

    // Hinweis-HTML
    const hinweisHtml = hinweis
      ? `<div style="background:#fff8e1;padding:14px 16px;border-radius:8px;margin:16px 0;font-size:13px;color:#5d4037;">${
          hinweis.split('\n').map((l: string) => `<p style="margin:0 0 4px 0;">${l}</p>`).join('')
        }</div>`
      : '';

    // Komplette E-Mail zusammenbauen
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <div style="background:#003366;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:18px;">🧪 TEST: ${vorlageName}</h1>
          <p style="color:#a8c4e0;margin:4px 0 0 0;font-size:12px;">
            Vorlage: ${vorlageTyp} · Dies ist eine Test-E-Mail
          </p>
        </div>
        <div style="padding:24px;background:white;">
          <div style="background:#fff3e0;padding:10px 14px;border-radius:6px;margin-bottom:16px;font-size:12px;color:#e65100;font-weight:bold;">
            ⚠️ DIES IST EINE TEST-E-MAIL — Platzhalter sind mit Beispieldaten gefüllt.
          </div>

          ${einleitung ? einleitung.split('\n').map((l: string) => `<p style="font-size:14px;line-height:1.6;margin:0 0 8px 0;">${l}</p>`).join('') : ''}

          <div style="margin:20px 0;padding:20px;background:#f0f4ff;border:2px solid #2196F3;border-radius:8px;">
            ${inhaltZeilen}
          </div>

          ${hinweisHtml}

          ${buttonHtml ? `<div style="margin:20px 0;text-align:center;">${buttonHtml}</div>` : ''}

          ${fusszeile ? `<p style="font-size:11px;color:#888;line-height:1.5;margin-top:20px;">${fusszeile}</p>` : ''}
        </div>
        <div style="padding:12px 24px;font-size:11px;color:#999;text-align:center;border-top:1px solid #f0f0f0;">
          Easy-B2B · Deutsch-Dänisches Matchmaking-Netzwerk · Test-Versand
        </div>
      </div>
    `;

    // Resend Free-Tier: nur an verifizierte E-Mail
    const testEmail = 'jan.thomsen.stf@gmail.com';
    const result = await sendeEmail(testEmail, betreff, html, `test-vorlage:${vorlageTyp}`);

    if (result.success) {
      return NextResponse.json({ success: true, an: testEmail });
    } else {
      return NextResponse.json({ success: false, error: result.error || 'Sendefehler' }, { status: 500 });
    }
  } catch (err) {
    console.error('[Test-Vorlage] Error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
