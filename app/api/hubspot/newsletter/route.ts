import { NextResponse } from 'next/server';

type RateEntry = { count: number; resetAt: number };
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10m
const RATE_MAX = 20;                   // max submissions / IP / window
const ipHits = new Map<string, RateEntry>(); // naive in-memory (OK for most sites)

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

    // soft throttle: silently accept but drop if exceeded
    if (!rateOk(String(ip))) {
      return NextResponse.json({ ok: true }); // blackhole
    }

    const {
      email,
      firstname,
      lastname,
      consent,
      hutk,
      pageUri,
      pageName,
      utm,
      hp,           // honeypot value
      elapsedMs,    // time-to-submit
      turnstileToken,
    } = await req.json();

    // Honeypot: any value => drop silently
    if (hp && String(hp).trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    // Time-trap: too fast => drop silently
    if (typeof elapsedMs === 'number' && elapsedMs < 1200) {
      return NextResponse.json({ ok: true });
    }

    // Optional Turnstile verify
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!turnstileToken) return NextResponse.json({ ok: true }); // treat as bot
      const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken, remoteip: ip }),
      });
      const v = (await verify.json()) as any;
      if (!v.success) return NextResponse.json({ ok: true }); // silently drop
    }

    // Basic validation
    if (!email || !consent) {
      return NextResponse.json({ ok: false, error: 'Missing email or consent' }, { status: 400 });
    }

    const portalId = process.env.HUBSPOT_PORTAL_ID!;
    const formId = process.env.HUBSPOT_NEWSLETTER_FORM_ID!;
    if (!portalId || !formId) {
      return NextResponse.json({ ok: false, error: 'Missing HubSpot env vars' }, { status: 500 });
    }

    // Map to HubSpot properties (ensure these exist in HubSpot)
    const fields = [
      { name: 'email', value: email },
      firstname ? { name: 'firstname', value: firstname } : null,
      lastname ? { name: 'lastname', value: lastname } : null,
      { name: 'newsletter_consent', value: consent ? 'true' : 'false' }, // your custom checkbox
      utm?.source ? { name: 'utm_source', value: utm.source } : null,
      utm?.medium ? { name: 'utm_medium', value: utm.medium } : null,
      utm?.campaign ? { name: 'utm_campaign', value: utm.campaign } : null,
      { name: 'source', value: 'Website' }, // optional text property
    ].filter(Boolean) as { name: string; value: string }[];

    const context = {
      hutk,
      pageUri,
      pageName,
    };

    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
    const hsRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields, context }),
    });

    if (!hsRes.ok) {
      const err = await hsRes.text();
      return NextResponse.json({ ok: false, error: err || 'HubSpot error' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
