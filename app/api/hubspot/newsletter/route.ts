// app/api/hubspot/newsletter/route.ts
import { NextResponse } from 'next/server';

type RateEntry = { count: number; resetAt: number };

// ---- Config -----------------------------------------------------------------
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 20;                   // max submissions / IP / window

// Comma-separated list of allowed origins in env; falls back to your Netlify URL.
const ALLOWED_ORIGINS: string[] = (
  process.env.NEWSLETTER_ALLOWED_ORIGINS ||
  'https://ecofocusresearch.netlify.app,https://www.ecofocusresearch.netlify.app'
)
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// HubSpot property names (create these in HubSpot; override via env if different)
const FORM_SOURCE_PROPERTY =
  process.env.HUBSPOT_FORM_SOURCE_PROPERTY || 'ef_form_source';
const NEWSLETTER_SUBSCRIPTION_PROPERTY =
  process.env.HUBSPOT_NEWSLETTER_SUBSCRIPTION_PROPERTY || 'ef_subscription_type';

// Regexes
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const DISPOSABLE_RE =
  /(mailinator|guerrillamail|tempmail|10minutemail|yopmail|sharklasers|getnada|trashmail|throwawaymail|moakt|fakeinbox|mintemail|maildrop|dispostable|spambog|temp\-?mail)\./i;
const NAME_OK = (s?: string) => !!s && /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/.test(s);

// In-memory naive rate limiter (OK for serverless edge/cold starts; not shared across instances)
const ipHits = new Map<string, RateEntry>();
function rateOk(ip: string): boolean {
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

// ---- Types ------------------------------------------------------------------
type NewsletterBody = {
  email?: string;
  firstname?: string;
  lastname?: string;
  consent?: boolean;
  hutk?: string;
  pageUri?: string;
  pageName?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
  hp?: string;                // honeypot
  elapsedMs?: number;         // time-to-submit
  turnstileToken?: string;
  tags?: string[];            // optional: multiple checkbox internal values
};

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
      return NextResponse.json({ ok: true });
    }

    const origin = req.headers.get('origin') || '';
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      // Unknown origin → drop quietly
      return NextResponse.json({ ok: true });
    }

    const body = (await req.json()) as NewsletterBody;

    // Destructure as const to satisfy prefer-const & avoid 'any'
    const {
      email: rawEmail,
      firstname: rawFirst,
      lastname: rawLast,
      consent,
      hutk,
      pageUri,
      pageName,
      utm,
      hp,
      elapsedMs,
      turnstileToken,
      tags,
    } = body || {};

    // Normalize
    const email = (rawEmail || '').trim().toLowerCase();
    const firstname = (rawFirst || '').trim();
    const lastname = (rawLast || '').trim();

    // Honeypot / time-trap
    if (hp && hp.trim().length > 0) return NextResponse.json({ ok: true });
    if (typeof elapsedMs === 'number' && elapsedMs < 1200) return NextResponse.json({ ok: true });

    // Turnstile verify (optional)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!turnstileToken) return NextResponse.json({ ok: true });
      const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken, remoteip: ip }),
      });
      const v = (await verify.json()) as { success?: boolean };
      if (!v.success) return NextResponse.json({ ok: true });
    }

    // Required & spam checks
    if (!email || !consent) {
      return NextResponse.json({ ok: false, error: 'Missing email or consent' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email) || DISPOSABLE_RE.test(email)) return NextResponse.json({ ok: true });
    if ((firstname && !NAME_OK(firstname)) || (lastname && !NAME_OK(lastname))) {
      return NextResponse.json({ ok: true });
    }

    const portalId = process.env.HUBSPOT_PORTAL_ID;
    const formId = process.env.HUBSPOT_NEWSLETTER_FORM_ID; // e.g. fa67e7c1-10e9-4d8a-a397-d124d9277c0a
    if (!portalId || !formId) {
      return NextResponse.json({ ok: false, error: 'Missing HubSpot env vars' }, { status: 500 });
    }

    // Tags (multiple checkboxes → semicolon-separated internal values)
    const defaultsFromEnv = (process.env.HUBSPOT_TAG_INTERNALS || '')
      .split(';')
      .map(s => s.trim())
      .filter(Boolean);
    const fallbackTags = defaultsFromEnv.length ? defaultsFromEnv : ['newsletter'];
    const tagValues = Array.isArray(tags) && tags.length
      ? tags.map(t => String(t).trim()).filter(Boolean)
      : fallbackTags;

    // Map to HubSpot properties (ensure these exist)
    const fields: Array<{ name: string; value: string }> = [
      { name: 'email', value: email },
      ...(firstname ? [{ name: 'firstname', value: firstname }] : []),
      ...(lastname  ? [{ name: 'lastname',  value: lastname  }] : []),
      { name: 'newsletter_consent', value: consent ? 'true' : 'false' },
      { name: 'tags', value: tagValues.join(';') },
      { name: 'signup_channel', value: 'newsletter' },
      ...(utm?.source   ? [{ name: 'utm_source',   value: String(utm.source)   }] : []),
      ...(utm?.medium   ? [{ name: 'utm_medium',   value: String(utm.medium)   }] : []),
      ...(utm?.campaign ? [{ name: 'utm_campaign', value: String(utm.campaign) }] : []),
      { name: 'source', value: 'Website' },
      { name: FORM_SOURCE_PROPERTY, value: 'Newsletter Signup' }, // custom dropdown/text property
      { name: NEWSLETTER_SUBSCRIPTION_PROPERTY, value: 'EcoNuggets Newsletter' }, // subscription tag
    ];

    // Context (include hutk only if present to avoid INVALID_HUTK)
    const context: Record<string, string> = {};
    if (pageUri)  context.pageUri = String(pageUri);
    if (pageName) context.pageName = String(pageName);
    if (typeof hutk === 'string' && hutk.trim()) context.hutk = hutk.trim();

    const payload: { fields: Array<{ name: string; value: string }>; context?: Record<string, string> } = { fields };
    if (Object.keys(context).length) payload.context = context;

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
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}




