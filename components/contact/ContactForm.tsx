'use client';

import { useMemo, useRef, useState } from 'react';
import Script from 'next/script';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
const REASON_OPTIONS = [
  'Agency support',
  'Custom study',
  'Newsletter / Podcast',
  'Trending Data',
  'Upcoming Study',
  'Consultative Services',
  'Partnership',
  'Press',
  'Other',
] as const;

function getHutk() {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

export default function ContactForm({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');      // If your HubSpot property is `jobtitle`, we’ll map it in the API
  const [reason, setReason] = useState<(typeof REASON_OPTIONS)[number] | ''>('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false); // “Okay to contact me about this inquiry” (not marketing)
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

  async function onSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const elapsedMs = Date.now() - startRef.current;

    // Optional Turnstile token
    let turnstileToken = '';
    if (TURNSTILE_SITE_KEY) {
      const input = document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null;
      turnstileToken = input?.value || '';
    }

    // Client-side validation
    if (!firstname.trim()) return bail('Please enter your first name.');
    if (!lastname.trim()) return bail('Please enter your last name.');
    if (!email.trim()) return bail('Please enter your email.');
    if (!message.trim()) return bail('Please share a quick note about what you need.');
    if (!consent) return bail('Please agree to be contacted.');

    try {
      const res = await fetch('/api/hubspot/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstname,
          lastname,
          company,
          role,
          reason,
          message,
          consent,
          hutk,
          pageUri,
          pageName,
          utm,
          hp,
          elapsedMs,
          turnstileToken,
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

    function bail(msg: string) {
      setSubmitting(false);
      setError(msg);
    }
  }

  if (done) {
    return (
      <div className={className}>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <p className="font-semibold">Thanks — we’ve got your message.</p>
          <p className="text-sm">A member of the team will reply soon.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        id="EcoFocus_Contact_Form"
        data-form-name="EcoFocus Contact Form"
        data-hs-ignore="true"
        className={className}
        role="form"
        aria-label="EcoFocus Contact Form"
      >
        {/* HubSpot collected-forms ignore hint (prevents Non-HubSpot capture) */}
        <label htmlFor="amex" style={{ display: 'none' }}>AMEX</label>
        <input type="hidden" name="amex" id="amex" value="" />

        {/* Honeypot */}
        <div
          style={{ position: 'absolute', left: '-10000px', height: 0, width: 0, overflow: 'hidden' }}
          aria-hidden="true"
        >
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700">
                First Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoComplete="given-name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">
                Last Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
                  <label className="block text-sm text-gray-700">
                Company <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoComplete="organization"
              />
            </div>
            <div>
                  <label className="block text-sm text-gray-700">
                Role / Title <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoComplete="organization-title"
              />
            </div>
          </div>

          <div>
            <p className="block text-sm text-gray-700">Reason for reaching out <span className="text-gray-400">(Optional)</span></p>
            <div className="mt-2 flex flex-wrap gap-2">
              {REASON_OPTIONS.map((option) => {
                const selected = reason === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setReason(selected ? '' : option)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      selected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-emerald-400'
                    }`}
                    aria-pressed={selected}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700">
              Message <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="How can we help? Goals, audience, timing…"
              maxLength={4000}
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              required
            />
            <span>
              I agree to be contacted about my inquiry. See our{' '}
              <a href="/privacy" className="underline">Privacy Policy</a>.
              <span className="text-red-600"> *</span>
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-500">
            We’ll only use your info to respond to your inquiry. See our{' '}
            <a href="/legal#privacy" className="underline">Privacy Policy</a>.
          </p>

          {/* Optional Turnstile */}
          {TURNSTILE_SITE_KEY && (
            <>
              <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
              <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-size="flexible" />
            </>
          )}

          {error && (
            <p className="text-sm text-red-600" role="status" aria-live="polite">
              {error}
            </p>
          )}

          <button
            type="button" // disable native form submit; call onSubmit manually
            disabled={submitting}
            className="mt-1 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            onClick={onSubmit}
          >
            {submitting ? 'Sending…' : 'Send message'}
          </button>

          <p className="text-xs text-gray-500">Typical reply: within 1 business day.</p>
          <p className="mt-2 text-xs text-gray-500">Fields marked with <span className="text-red-600">*</span> are required.</p>
        </div>
      </div>
    </>
  );
}
