'use client';
import { useState } from 'react';

export function DisplayrTestInvitation({ disabled }: { disabled: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function check() {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/portal/admin/displayr/mailbox/test-invitation', {
        method: 'POST', mode: 'cors', credentials: 'same-origin', redirect: 'error', cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }, body: '{}',
      });
      const result = await response.json();
      if (response.ok && result.complete === false) setMessage('The search was incomplete. Do not activate an account yet.');
      else if (response.ok && result.complete === true && result.count === 1) setMessage('One matching test invitation was found. The account has not been activated.');
      else if (response.ok && result.complete === true && result.count > 1) setMessage('Multiple matching invitations were found. Review them before continuing.');
      else if (response.ok && result.complete === true && result.count === 0) setMessage('No matching test invitation found. Allow a few minutes for delivery and try again.');
      else if (result.reason === 'reconnect' || result.reason === 'wrong-mailbox') setMessage('Please reconnect the provisioning mailbox, then check access again.');
      else if (result.reason === 'admin-session') setMessage('Sign in to the portal as an administrator and try again.');
      else setMessage('The invitation search could not finish. Please try again shortly.');
    } catch { setMessage('The check could not finish. Refresh the page and try again.'); }
    finally { setBusy(false); }
  }
  return <div className="space-y-3">
    <button type="button" disabled={disabled || busy} onClick={check} className="rounded-xl border border-emerald-700 px-5 py-3 font-semibold text-emerald-800 disabled:opacity-50">{busy ? 'Searching…' : 'Find test invitation'}</button>
    {message ? <p role="status">{message}</p> : null}
  </div>;
}
