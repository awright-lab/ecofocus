'use client';
import { useState } from 'react';

export function DisplayrMailboxCheck({ disabled }: { disabled: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function check() {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/portal/admin/displayr/mailbox/check', {
        method: 'POST', mode: 'cors', credentials: 'same-origin', redirect: 'error', cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }, body: '{}',
      });
      const result = await response.json();
      if (response.ok && result.readable === true) setMessage('Mailbox access verified. The service can refresh its connection and read Displayr mail.');
      else if (result.reason === 'reconnect' || result.reason === 'wrong-mailbox') setMessage('Please reconnect the provisioning mailbox, then check access again.');
      else if (result.reason === 'admin-session') setMessage('Sign in to the portal as an administrator and try again.');
      else setMessage('Mailbox access could not be verified. Please try again shortly.');
    } catch { setMessage('The check could not finish. Refresh the page and try again.'); }
    finally { setBusy(false); }
  }
  return <div className="space-y-3">
    <button type="button" disabled={disabled || busy} onClick={check} className="rounded-xl border border-emerald-700 px-5 py-3 font-semibold text-emerald-800 disabled:opacity-50">{busy ? 'Checking mailbox…' : 'Check mailbox access'}</button>
    {message ? <p role="status">{message}</p> : null}
  </div>;
}
