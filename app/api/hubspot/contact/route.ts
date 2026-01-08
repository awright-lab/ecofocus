// app/api/hubspot/contact/route.ts
import { NextResponse } from 'next/server';

type RateEntry = { count: number; resetAt: number };

// ---- Config -----------------------------------------------------------------
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 20;                   // max submissions / IP / window

// Comma-separated list of allowed origins; if unset, allow all (no blocking).
const ALLOWED_ORIGINS: string[] = (process.env.CONTACT_ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim().replace(/\/+$/, '')) // strip trailing slash
  .filter(Boolean);

function originAllowed(origin?: string | null) {
  if (!origin) return true;
  if (!ALLOWED_ORIGINS.length) return true; // no allowlist configured → allow all
  const normalized = origin.replace(/\/+$/, '');
  return ALLOWED_ORIGINS.includes(normalized);
}

// HubSpot property names (create these in HubSpot; override via env if different)
const FORM_SOURCE_PROPERTY =
  process.env.HUBSPOT_FORM_SOURCE_PROPERTY || 'ef_form_source';

// Regexes / validators
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const DISPOSABLE_RE =
  /(mailinator|guerrillamail|tempmail|10minutemail|yopmail|sharklasers|getnada|trashmail|throwawaymail|moakt|fakeinbox|mintemail|maildrop|dispostable|spambog|temp\-?mail)\./i;
const NAME_OK = (s?: string) => !!s && /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/.test(s);
const TEXT_CLEAN = (s?: string) =>
  (s || '')
    .replace(/<\/?[^>]+(>|$)/g, '')        // strip HTML tags
    .replace(/\u0000/g, '')                // strip nulls
    .trim()
    .slice(0, 4000);                       // cap length to a safe size

// In-memory naive rate limiter
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
type ContactBody = {
  email?: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  role?: string;                // FE sends "role"; mapped to jobtitle by default
  message?: string;
  consent?: boolean;
  hutk?: string;
  pageUri?: string;
  pageName?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
  hp?: string;
  elapsedMs?: number;
  turnstileToken?: string;
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

    // Origin guard (optional but recommended)
    const origin = req.headers.get('origin');
    if (!originAllowed(origin)) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const body = (await req.json()) as ContactBody;

    // Destructure & normalize (const to satisfy prefer-const)
    const {
      email: rawEmail,
      firstname: rawFirst,
      lastname: rawLast,
      company: rawCompany,
      role: rawRole,
      message: rawMessage,
      consent,
      hutk,
      pageUri,
      pageName,
      utm,
      hp,
      elapsedMs,
      turnstileToken,
    } = body || {};

    const email = (rawEmail || '').trim().toLowerCase();
    const firstname = (rawFirst || '').trim();
    const lastname  = (rawLast || '').trim();
    const company   = (rawCompany || '').trim();
    const role      = (rawRole || '').trim();
    const message   = TEXT_CLEAN(rawMessage);

    // Honeypot / time trap
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

    // Required + spam checks
    if (!email || !firstname || !lastname || !company || !role || !consent) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email) || DISPOSABLE_RE.test(email)) {
      return NextResponse.json({ ok: true });
    }
    if (!NAME_OK(firstname) || !NAME_OK(lastname)) {
      return NextResponse.json({ ok: true });
    }

    const portalId = process.env.HUBSPOT_PORTAL_ID;
    const formId = process.env.HUBSPOT_CONTACT_FORM_ID; // set to your HubSpot *Contact* form GUID
    if (!portalId || !formId) {
      return NextResponse.json({ ok: false, error: 'Missing HubSpot env vars' }, { status: 500 });
    }

    // Map to HubSpot properties.
    // If your internal property is actually "role" (custom), change 'jobtitle' → 'role' below.
    const fields: Array<{ name: string; value: string }> = [
      { name: 'email', value: email },
      { name: 'firstname', value: firstname },
      { name: 'lastname', value: lastname },
      { name: 'company', value: company },
      { name: 'jobtitle', value: role },                 // ← change to 'role' if that’s your internal name
      ...(message ? [{ name: 'message', value: message }] : []), // ensure "message" property exists (text/long text)
      { name: 'inquiry_consent', value: consent ? 'true' : 'false' }, // optional custom checkbox/text
      // UTMs (create text props if desired)
      ...(utm?.source   ? [{ name: 'utm_source',   value: String(utm.source)   }] : []),
      ...(utm?.medium   ? [{ name: 'utm_medium',   value: String(utm.medium)   }] : []),
      ...(utm?.campaign ? [{ name: 'utm_campaign', value: String(utm.campaign) }] : []),
      // Helpful context tags
      { name: 'signup_channel', value: 'contact' },
      { name: 'source', value: 'Website' },
      { name: FORM_SOURCE_PROPERTY, value: 'Contact Form' }, // custom dropdown/text property
    ];

    // Context (include hutk only if present to avoid INVALID_HUTK)
    const context: Record<string, string> = {};
    if (pageUri)  context.pageUri = String(pageUri);
    if (pageName) context.pageName = String(pageName);
    if (typeof hutk === 'string' && hutk.trim()) context.hutk = hutk.trim();

    // Payload — deliberately NO marketing subscription/communications block
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

