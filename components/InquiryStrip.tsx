// components/InquiryStrip.tsx
'use client';

import * as React from 'react';
import { useState } from 'react';

type InquiryType =
  | 'Syndicated Study Buy-In'
  | 'Enhance Your Data'
  | 'Custom Research'
  | 'Dashboard Access'
  | 'General';

export default function InquiryStrip({
  defaultType = 'General',
  context,
}: {
  defaultType?: InquiryType;
  context?: string; // e.g., 'solutions/syndicated-buy-in'
}) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot
    if ((data.get('website') as string) ?? '') {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data,
      });

      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setMessage('Thanks! We’ll be in touch shortly.');
      form.reset();
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please email hello@ecofocus.com.');
    } finally {
      // reset after a bit
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section className="bg-gray-50 border-t border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] tracking-wide mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-black/60">Start the conversation</span>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
              Tell us what you’re exploring
            </h3>
            <p className="mt-1 text-gray-600">
              Share a few details and we’ll follow up with next steps, timelines, and options.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="w-full lg:max-w-3xl bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm"
            aria-labelledby="inquiry-title"
          >
            <input type="hidden" name="context" value={context ?? ''} />
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="inquiryType" className="text-sm text-gray-700 mb-1">
                  Inquiry type
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  defaultValue={defaultType}
                  className="h-11 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                >
                  {[
                    'Syndicated Study Buy-In',
                    'Enhance Your Data',
                    'Custom Research',
                    'Dashboard Access',
                    'General',
                  ].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm text-gray-700 mb-1">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="h-11 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm text-gray-700 mb-1">
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  required
                  className="h-11 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="company" className="text-sm text-gray-700 mb-1">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="h-11 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="md:col-span-2 flex flex-col">
                <label htmlFor="notes" className="text-sm text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="What decision are you making? Timeline? Audiences?"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-white text-sm font-semibold shadow hover:bg-emerald-700 disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : 'Send Inquiry'}
              </button>
              {status !== 'idle' && (
                <p
                  className={`text-sm ${
                    status === 'success'
                      ? 'text-emerald-700'
                      : status === 'error'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                  role="status"
                >
                  {message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
