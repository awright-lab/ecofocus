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

// US/EU host helper – uses HUBSPOT_FORMS_HOST if set, otherwise falls back to region name
function getFormsHost() {
  const host = process.env.HUBSPOT_FORMS_HOST?.trim();
  if (host) return host;
  const region = (process.env.NEXT_PUBLIC_HUBSPOT_REGION || '').toLowerCase();
  return region === 'eu' || region === 'eu1' ? 'eu1.hsforms.com' : 'api.hsforms.com';
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
      company,
      role,            // Job title
      message,
      consent,
      hutk,
      pageUri,
      pageName,
      utm,
      hp,              // honeypot value
      elapsedMs,       // time-to-submit
      turnstileToken,
      tags,            // optional: array of tag internal values
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
    if (!email || !message || !consent) {
      return NextResponse.json(
        { ok: false, error: 'Missing email, message, or consent' },
        { status: 400 }
      );
    }

    const portalId = process.env.HUBSPOT_PORTAL_ID!;
    const formId = process.env.HUBSPOT_CONTACT_FORM_ID!;
    if (!portalId || !formId) {
      return NextResponse.json(
        { ok: false, error: 'Missing HubSpot env vars' },
        { status: 500 }
      );
    }

    // ---- Tags (Multiple checkboxes) ----
    // HubSpot expects semicolon-separated INTERNAL values, e.g. "contact;website"
    // You can override defaults with HUBSPOT_TAG_INTERNALS_CONTACT
    const defaultsFromEnv = (
      process.env.HUBSPOT_TAG_INTERNALS_CONTACT ||
      process.env.HUBSPOT_TAG_INTERNALS ||
      ''
    )
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    const fallbackTags = defaultsFromEnv.length ? defaultsFromEnv : ['contact'];

    const tagValues: string[] =
      Array.isArray(tags) && tags.length
        ? tags.map((t) => String(t).trim()).filter(Boolean)
        : fallbackTags;

    if (process.env.NODE_ENV !== 'production') {
      console.log('[contact] sending tags:', tagValues);
    }

    // Map to HubSpot properties (ensure these exist in your HubSpot contact schema)
    const fields = [
      { name: 'email', value: String(email) },
      firstname ? { name: 'firstname', value: String(firstname) } : null,
      lastname ? { name: 'lastname', value: String(lastname) } : null,
      company ? { name: 'company', value: String(company) } : null,
      role ? { name: 'jobtitle', value: String(role) } : null,
      { name: 'message', value: String(message) }, // textarea property on your form
      { name: 'contact_consent', value: consent ? 'true' : 'false' }, // optional custom checkbox
      { name: 'tags', value: tagValues.join(';') },                    // ✅ multiple checkboxes
      { name: 'signup_channel', value: 'contact' },                    // optional text property for quick filtering
      // UTMs (create text properties if you want these)
      utm?.source ? { name: 'utm_source', value: String(utm.source) } : null,
      utm?.medium ? { name: 'utm_medium', value: String(utm.medium) } : null,
      utm?.campaign ? { name: 'utm_campaign', value: String(utm.campaign) } : null,
      // Optional generic source
      { name: 'source', value: 'Website' },
    ].filter(Boolean) as { name: string; value: string }[];

    // Build context safely: include hutk ONLY if present (prevents INVALID_HUTK)
    const context: Record<string, any> = {};
    if (pageUri) context.pageUri = String(pageUri);
    if (pageName) context.pageName = String(pageName);
    if (typeof hutk === 'string' && hutk.trim().length > 0) {
      context.hutk = hutk.trim();
    }

    // Build payload
    const payload: any = { fields };
    if (Object.keys(context).length > 0) payload.context = context;

    // Optional GDPR/consent recording to a specific subscription type
    if (
      process.env.HUBSPOT_GDPR_ENABLED === 'true' &&
      process.env.HUBSPOT_CONTACT_SUBSCRIPTION_ID
    ) {
      payload.legalConsentOptions = {
        consent: {
          consentToProcess: true,
          text: 'I agree to be contacted about my inquiry.',
          communications: [
            {
              value: true,
              subscriptionTypeId: Number(process.env.HUBSPOT_CONTACT_SUBSCRIPTION_ID),
              text: 'Inquiry follow-up',
            },
          ],
        },
      };
    }

    const host = getFormsHost();
    const url = `https://${host}/submissions/v3/integration/submit/${portalId}/${formId}`;
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
