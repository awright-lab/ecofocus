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

    // Soft throttle: silently accept but drop if exceeded
    if (!rateOk(String(ip))) {
      return NextResponse.json({ ok: true }); // blackhole to avoid tipping off bots
    }

    const body = await req.json();
    const {
      email,
      firstname,
      lastname,
      consent,
      hutk,
      pageUri,
      pageName,
      utm,
      hp,            // honeypot value
      elapsedMs,     // time-to-submit
      turnstileToken,
      tags,          // optional: array of tag internal values; backend has defaults
    } = body || {};

    // Honeypot: any value => silently drop
    if (hp && String(hp).trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    // Time-trap: too fast => silently drop
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
    if (!email || !consent) {
      return NextResponse.json({ ok: false, error: 'Missing email or consent' }, { status: 400 });
    }

    const portalId = process.env.HUBSPOT_PORTAL_ID!;
    const formId = process.env.HUBSPOT_NEWSLETTER_FORM_ID!; // e.g., fa67e7c1-10e9-4d8a-a397-d124d9277c0a
    if (!portalId || !formId) {
      return NextResponse.json({ ok: false, error: 'Missing HubSpot env vars' }, { status: 500 });
    }

    // ---- Tags (Multiple checkboxes) ----
    // HubSpot expects semicolon-separated INTERNAL values, e.g. "newsletter;econuggets"
    // You can set defaults via env HUBSPOT_TAG_INTERNALS="newsletter;econuggets"
    const defaultsFromEnv = (process.env.HUBSPOT_TAG_INTERNALS || '')
      .split(';')
      .map(s => s.trim())
      .filter(Boolean);
    const fallbackTags = defaultsFromEnv.length ? defaultsFromEnv : ['newsletter'];

    const tagValues: string[] = Array.isArray(tags) && tags.length
      ? tags.map((t) => String(t).trim()).filter(Boolean)
      : fallbackTags;

    // TEMP/DEBUG: Log what we're sending (won't appear in some prod logs)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[newsletter] sending tags:', tagValues);
    }

    // Map to HubSpot properties (ensure these exist in HubSpot with correct internal names)
    const fields = [
      { name: 'email', value: String(email) },
      firstname ? { name: 'firstname', value: String(firstname) } : null,
      lastname  ? { name: 'lastname',  value: String(lastname)  } : null,
      { name: 'newsletter_consent', value: consent ? 'true' : 'false' },  // custom single checkbox (or boolean text)
      { name: 'tags', value: tagValues.join(';') },                        // ✅ multiple checkboxes
      // Safety net for quick visibility in CRM:
      { name: 'signup_channel', value: 'newsletter' },                     // optional custom text property
      // UTM params (create text properties if you want these)
      utm?.source   ? { name: 'utm_source',   value: String(utm.source)   } : null,
      utm?.medium   ? { name: 'utm_medium',   value: String(utm.medium)   } : null,
      utm?.campaign ? { name: 'utm_campaign', value: String(utm.campaign) } : null,
      // Optional "source" tag (create a text property named "source" if desired)
      { name: 'source', value: 'Website' },
    ].filter(Boolean) as { name: string; value: string }[];

    // Build context safely: include hutk ONLY if present (prevents INVALID_HUTK)
    const context: Record<string, any> = {};
    if (pageUri)  context.pageUri  = String(pageUri);
    if (pageName) context.pageName = String(pageName);
    if (typeof hutk === 'string' && hutk.trim().length > 0) {
      context.hutk = hutk.trim();
    }

    // Build payload; attach context only if we have something to send
    const payload: any = { fields };
    if (Object.keys(context).length > 0) {
      payload.context = context;
    }

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




