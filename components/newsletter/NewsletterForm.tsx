'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
let turnstileScriptPromise: Promise<void> | null = null;

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      remove?: (widgetId: string) => void;
      getResponse?: (widgetId: string) => string;
    };
  }
}

function ensureTurnstileScript() {
  if (window.turnstile) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-ef-turnstile="1"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Turnstile.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.dataset.efTurnstile = '1';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile.'));
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

function getHutk() {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

type Theme = 'light' | 'dark';

export default function NewsletterForm({
  className = '',
  theme = 'light',
}: {
  className?: string;
  theme?: Theme;
}) {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');

  const startRef = useRef<number>(Date.now());
  const turnstileElRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  const hutk = useMemo(() => getHutk(), []);
  const pageUri = typeof window !== 'undefined' ? window.location.href : '';
  const pageName = typeof document !== 'undefined' ? document.title : '';
  const utm = useMemo(() => {
    if (typeof window === 'undefined') return {};
    const p = new URLSearchParams(window.location.search);
    return {
      source: p.get('utm_source') || '',
      medium: p.get('utm_medium') || '',
      campaign: p.get('utm_campaign') || '',
    };
  }, []);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileElRef.current) return;

    let cancelled = false;
    ensureTurnstileScript()
      .then(() => {
        if (cancelled || !turnstileElRef.current || !window.turnstile || turnstileWidgetIdRef.current) return;
        turnstileElRef.current.innerHTML = '';
        turnstileWidgetIdRef.current = window.turnstile.render(turnstileElRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          size: 'flexible',
          callback: (token: string) => setTurnstileToken(token || ''),
          'expired-callback': () => setTurnstileToken(''),
          'error-callback': () => setTurnstileToken(''),
        });
      })
      .catch(() => {
        setError('Verification failed to load. Please refresh and try again.');
      });

    return () => {
      cancelled = true;
      const widgetId = turnstileWidgetIdRef.current;
      if (widgetId && window.turnstile?.remove) {
        window.turnstile.remove(widgetId);
      }
      turnstileWidgetIdRef.current = null;
    };
  }, []);

  async function handleSubmit() {
    if (submitting) return; // safety
    setSubmitting(true);
    setError(null);

    const elapsedMs = Date.now() - startRef.current;

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setSubmitting(false);
      setError('Please verify that you are human.');
      return;
    }

    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      setSubmitting(false);
      setError('Please enter your email.');
      return;
    }
    if (!consent) {
      setSubmitting(false);
      setError('Please agree to receive EcoNuggets.');
      return;
    }

    try {
      const res = await fetch('/api/hubspot/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          firstname: (firstname || '').trim(),
          lastname: (lastname || '').trim(),
          consent,
          hutk,
          pageUri,
          pageName,
          utm,
          hp,
          elapsedMs,
          turnstileToken,
          // Optional: override default HubSpot “tags” multiple-checkbox values
          // tags: ['newsletter','econuggets'],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Submission failed');
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const isDark = theme === 'dark';
  const labelCls = isDark ? 'block text-sm text-gray-300' : 'block text-sm text-gray-700';
  const inputCls = isDark
    ? 'mt-1 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500'
    : 'mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500';
  const checkboxLabelCls = isDark ? 'flex items-start gap-2 text-sm text-gray-300' : 'flex items-start gap-2 text-sm text-gray-700';

  if (done) {
    return (
      <div className={className}>
        <div
          className={
            isDark
              ? 'rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-emerald-200'
              : 'rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900'
          }
        >
          <p className="font-semibold">You’re subscribed!</p>
          <p className="text-sm">Thanks for joining EcoNuggets.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        id="EcoFocus_Newsletter_Signup"
        data-hs-ignore="true"         // prevent Non-HubSpot (Collected) Forms from logging it
        className={className}
        role="form"
        aria-label="EcoFocus Newsletter Signup"
        data-form-name="EcoFocus Newsletter Signup"
      >
        {/* HubSpot collected-forms ignore hint (prevents Non-HubSpot capture) */}
        <label htmlFor="amex" style={{ display: 'none' }}>AMEX</label>
        <input type="hidden" name="amex" id="amex" value="" />

        {/* Honeypot */}
        <div style={{ position: 'absolute', left: '-10000px', height: 0, width: 0, overflow: 'hidden' }} aria-hidden="true">
          <label>
            If you are human, leave this field empty:
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className={labelCls}>First Name</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className={inputCls}
              autoComplete="given-name"
            />
          </div>

          <div>
            <label className={labelCls}>Last Name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className={inputCls}
              autoComplete="family-name"
            />
          </div>

          <div>
            <label className={labelCls}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              // light client-side format nudge (server still does real validation & blocklist)
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
            />
          </div>

          <label className={checkboxLabelCls}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              required
            />
            <span>
              I agree to receive EcoNuggets newsletter. See our{' '}
              <a href="/privacy" className={isDark ? 'underline text-emerald-300' : 'underline text-emerald-700'}>
                Privacy Policy
              </a>.
            </span>
          </label>

          {/* Optional Turnstile */}
          {TURNSTILE_SITE_KEY && (
            <div ref={turnstileElRef} className="min-h-[65px]" />
          )}

          {error && <p className={isDark ? 'text-sm text-red-400' : 'text-sm text-red-600'}>{error}</p>}

          <button
            type="button"              // disable native form submit; we call handleSubmit instead
            disabled={submitting}
            className="mt-1 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            onClick={handleSubmit}
          >
            {submitting ? 'Submitting…' : 'Subscribe'}
          </button>
        </div>
      </div>
    </>
  );
}

