import { NextResponse } from 'next/server';

type RateEntry = { count: number; resetAt: number };

const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 20;                   // max submissions / IP / window
const ipHits = new Map<string, RateEntry>(); // naive in-memory rate store

function rateOk(ip: string) {
  const now = Date.now();
  const hit = ipHits.get(ip);
  if (!hit || now > hit.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (hit.count >= RATE_MAX) return false;
  hit.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip =
      (req.headers.get('x-forwarded-for') || '')
        .split(',')[0]
        .trim() ||
      req.headers.get('x-real-ip') ||
      '0.0.0.0';

    // Soft throttle
    if (!rateOk(String(ip))) {
      return NextResponse.json({ ok: true });
    }

    const body = await req.json();
    const {
      email,
      firstname,
      lastname,
      company,
      role,            // FE sends "role"; map below to your HubSpot property
      message,
      consent,
      hutk,
      pageUri,
      pageName,
      utm,
      hp,
      elapsedMs,
      turnstileToken,
    } = body || {};

    // Honeypot
    if (hp && String(hp).trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    // Time trap
    if (typeof elapsedMs === 'number' && elapsedMs < 1200) {
      return NextResponse.json({ ok: true });
    }

    // Optional Turnstile verify
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!turnstileToken) return NextResponse.json({ ok: true });
      const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken, remoteip: ip }),
      });
      const v = (await verify.json()) as any;
      if (!v.success) return NextResponse.json({ ok: true });
    }

    // Basic validation
    if (!email || !firstname || !lastname || !company || !role || !consent) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const portalId = process.env.HUBSPOT_PORTAL_ID!;
    const formId = process.env.HUBSPOT_CONTACT_FORM_ID!; // <-- set this env to your real HubSpot *Contact* form GUID
    if (!portalId || !formId) {
      return NextResponse.json({ ok: false, error: 'Missing HubSpot env vars' }, { status: 500 });
    }

    // Map to HubSpot properties.
    // NOTE: If your internal property is "jobtitle" (HubSpot default), we map role -> jobtitle.
    // If you actually created a custom "role" property, change "jobtitle" to "role".
    const fields = [
      { name: 'email', value: String(email) },
      { name: 'firstname', value: String(firstname) },
      { name: 'lastname', value: String(lastname) },
      { name: 'company', value: String(company) },
      { name: 'jobtitle', value: String(role) },          // change to 'role' if that’s your internal name
      message ? { name: 'message', value: String(message) } : null, // ensure a "message" text property exists
      { name: 'inquiry_consent', value: consent ? 'true' : 'false' }, // optional custom property for audit
      // UTMs (create text props if desired)
      utm?.source   ? { name: 'utm_source',   value: String(utm.source)   } : null,
      utm?.medium   ? { name: 'utm_medium',   value: String(utm.medium)   } : null,
      utm?.campaign ? { name: 'utm_campaign', value: String(utm.campaign) } : null,
      { name: 'signup_channel', value: 'contact' },                     // optional text property for dashboards
      { name: 'source', value: 'Website' },                             // optional text property
    ].filter(Boolean) as { name: string; value: string }[];

    const context: Record<string, any> = {};
    if (pageUri) context.pageUri = String(pageUri);
    if (pageName) context.pageName = String(pageName);
    if (typeof hutk === 'string' && hutk.trim().length > 0) {
      context.hutk = hutk.trim();
    }

    // Payload — we deliberately DO NOT include a marketing subscription/communications consent block here.
    // This prevents auto-marketing unless your HubSpot form’s own setting forces it (turn that off).
    const payload: any = { fields };
    if (Object.keys(context).length > 0) payload.context = context;

    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
    const hsRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!hsRes.ok) {
      const errText = await hsRes.text().catch(() => '');
      return NextResponse.json({ ok: false, error: errText || 'HubSpot error' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
