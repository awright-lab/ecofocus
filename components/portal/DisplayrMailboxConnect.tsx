'use client';

import { useState } from 'react';

export function DisplayrMailboxConnect({ disabled, connected }: { disabled: boolean; connected: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function connect() {
    setBusy(true);
    setError('');
    try {
      // CORS-mode fetch sends the Origin even when the current document uses
      // no-referrer. A native form POST does not, including after SPA navigation.
      const response = await fetch('/api/portal/admin/displayr/mailbox/connect', {
        method: 'POST', mode: 'cors', credentials: 'same-origin', redirect: 'error',
        cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: '{}',
      });
      const data = await response.json();
      if (!response.ok) {
        const messages: Record<string, string> = {
          'request-origin': 'The connection request could not be verified. Reference: request-origin.',
          'request-host': 'The portal address could not be verified. Reference: request-host.',
          'admin-session': 'Your administrator sign-in could not be verified. Sign in again.',
          unavailable: 'Mailbox setup is temporarily unavailable. Reference: connect-unavailable.',
        };
        setError(Object.hasOwn(messages, data.reason) ? messages[data.reason] : 'The connection could not be started. Please try again.');
        setBusy(false);
        return;
      }
      const destination = new URL(data.url);
      if (destination.origin !== 'https://accounts.google.com' || destination.pathname !== '/o/oauth2/v2/auth') throw new Error('Invalid authorization destination');
      window.location.assign(destination.href);
    } catch {
      setError('The connection could not be started. Refresh this page and check that you are still signed in.');
      setBusy(false);
    }
  }
  return <div className="space-y-3">
    <button type="button" onClick={connect} disabled={disabled || busy} className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white disabled:opacity-50">
      {busy ? 'Opening Google…' : connected ? 'Reconnect provisioning mailbox' : 'Connect provisioning mailbox'}
    </button>
    {error ? <p role="alert">{error}</p> : null}
  </div>;
}
