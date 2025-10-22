'use client';

import { useMemo, useRef, useState } from 'react';
import Script from 'next/script';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

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

  const startRef = useRef<number>(Date.now());

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const elapsedMs = Date.now() - startRef.current;

    // Optional Turnstile token
    let turnstileToken = '';
    if (TURNSTILE_SITE_KEY) {
      const input = document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null;
      turnstileToken = input?.value || '';
    }

    if (!email) {
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
          email,
          firstname,
          lastname,
          consent,
          hutk,
          pageUri,
          pageName,
          utm,
          hp,
          elapsedMs,
          turnstileToken,
          // Optional: pass custom tags to HubSpot “tags” (multiple checkboxes) property
          // If omitted, backend will fall back to env default or ["newsletter"]
          // tags: ['newsletter', 'econuggets'],
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
      {/* JS fallback that tells HubSpot tracking to ignore THIS form selector */}
      <Script id="hs-ignore-newsletter" strategy="afterInteractive">
        {`
          window._hsq = window._hsq || [];
          window._hsq.push(['addIgnoredSelectors', 'form#EcoFocus_Newsletter_Signup']);
        `}
      </Script>

      <form
        id="EcoFocus_Newsletter_Signup"
        name="EcoFocus Newsletter Signup"
        data-hs-ignore="true"        // ✅ Prevents Non-HubSpot (Collected) Forms from creating “Unidentified Form…”
        onSubmit={onSubmit}
        className={className}
        noValidate
      >
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
              </a>
              .
            </span>
          </label>

          {/* Optional Turnstile */}
          {TURNSTILE_SITE_KEY && (
            <>
              <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
              <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-size="flexible" />
            </>
          )}

          {error && <p className={isDark ? 'text-sm text-red-400' : 'text-sm text-red-600'}>{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Subscribe'}
          </button>
        </div>
      </form>
    </>
  );
}



