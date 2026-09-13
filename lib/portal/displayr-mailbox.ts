import { getPortalAccessContext } from './auth';
import { getServiceSupabase, getSession } from '@/lib/supabase/server';
import { MAILBOX_EMAIL, mailboxKey } from './displayr-mailbox-crypto';

export function mailboxConfig() {
  const clientId = process.env.DISPLAYR_MAILBOX_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.DISPLAYR_MAILBOX_GOOGLE_CLIENT_SECRET;
  const key = mailboxKey(process.env.DISPLAYR_MAILBOX_ENCRYPTION_KEY);
  if (!clientId?.endsWith('.apps.googleusercontent.com') || !clientSecret) throw new Error('Mailbox OAuth is not configured');
  return { clientId, clientSecret, key };
}
export async function mailboxAdministrator() {
  const access = await getPortalAccessContext();
  if (!access?.session || access.user.role !== 'support_admin' || access.isPreviewMode) return null;
  const session = await getSession();
  if (!session || session.user.id !== access.session.id) return null;
  // Access context has verified the Auth user; use the token only to bind this
  // flow to that login session, never to grant an administrator role.
  const claims = JSON.parse(Buffer.from(session.access_token.split('.')[1], 'base64url').toString());
  if (claims.sub !== access.session.id || typeof claims.session_id !== 'string' || claims.exp * 1000 <= Date.now()) return null;
  return { access, authId: access.session.id, sessionId: claims.session_id };
}
export async function mailboxStatus() {
  let configured = true;
  try { mailboxConfig(); } catch { configured = false; }
  const { data, error } = await getServiceSupabase().from('portal_displayr_mailbox_connection').select('mailbox,connected_at').eq('mailbox', MAILBOX_EMAIL).maybeSingle();
  return { configured, storageReady: !error, connectedAt: data?.connected_at as string | undefined };
}
export async function googleJSON(url: string, init: RequestInit) {
  const response = await fetch(url, { ...init, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error('Google request failed');
  return response.json();
}
