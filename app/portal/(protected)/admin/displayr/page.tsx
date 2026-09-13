import { redirect } from 'next/navigation';
import { mailboxAdministrator, mailboxStatus } from '@/lib/portal/displayr-mailbox';
import { MAILBOX_EMAIL } from '@/lib/portal/displayr-mailbox-crypto';

export const dynamic = 'force-dynamic';
export default async function DisplayrMailboxPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  if (!(await mailboxAdministrator())) redirect('/portal/home');
  const status = await mailboxStatus();
  const { result } = await searchParams;
  const messages: Record<string, string> = {
    connected: 'The provisioning mailbox is connected.',
    'wrong-mailbox': `That Google account was not connected. Choose ${MAILBOX_EMAIL} and try again.`,
    cancelled: 'Google authorization was cancelled. You can try again when ready.',
    denied: 'The connection attempt expired or did not match your portal session. Please start again.',
    failed: 'The mailbox could not be connected. Please start again.',
    unavailable: 'Mailbox setup is not ready. Check the server configuration and connection storage.',
  };
  return <section className="mx-auto max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
    <h1 className="text-2xl font-semibold">Displayr provisioning mailbox</h1>
    <p>Connect {MAILBOX_EMAIL} so the provisioning service can read Displayr invitations. This grants read-only access to that mailbox; it cannot send or delete email.</p>
    {result && messages[result] ? <p role="status" className="rounded-xl bg-slate-100 p-4">{messages[result]}</p> : null}
    <p>{status.connectedAt ? 'A mailbox connection is saved.' : 'No mailbox connection is saved yet.'}</p>
    {!status.configured ? <p>The Google client ID, client secret, and mailbox encryption key must be configured on the portal server.</p> : null}
    {!status.storageReady ? <p>Mailbox connection storage needs to be initialized.</p> : null}
    <form action="/api/portal/admin/displayr/mailbox/connect" method="post">
      <button disabled={!status.configured || !status.storageReady} className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white disabled:opacity-50">{status.connectedAt ? 'Reconnect provisioning mailbox' : 'Connect provisioning mailbox'}</button>
    </form>
    <p className="text-sm text-slate-600">This connects the mailbox only. Automatic Displayr account creation and activation are not enabled yet.</p>
  </section>;
}
