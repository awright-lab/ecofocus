import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/server';
import { mailboxAdministrator, mailboxConfig, googleJSON } from '@/lib/portal/displayr-mailbox';
import { MAILBOX_ADMIN_URL, MAILBOX_CALLBACK, MAILBOX_COOKIE, MAILBOX_EMAIL, MAILBOX_SCOPE, decryptMailboxSecret, encryptMailboxSecret, hashOAuthValue, validateMailboxGrant } from '@/lib/portal/displayr-mailbox-crypto';

function finish(result: string) {
  const response = NextResponse.redirect(MAILBOX_ADMIN_URL + '?result=' + result, 303);
  response.headers.set('Cache-Control', 'no-store'); response.headers.set('Referrer-Policy', 'no-referrer');
  response.cookies.set(MAILBOX_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return response;
}
export async function GET(req: NextRequest) {
  if (req.nextUrl.origin !== new URL(MAILBOX_CALLBACK).origin) return finish('denied');
  try {
    const admin = await mailboxAdministrator();
    if (!admin) return finish('denied');
    const state = req.nextUrl.searchParams.get('state') || '';
    if (!/^[A-Za-z0-9_-]{43}$/.test(state) || state !== req.cookies.get(MAILBOX_COOKIE)?.value) return finish('denied');
    const db = getServiceSupabase();
    // DELETE RETURNING consumes the attempt atomically before exchanging a code.
    const { data: attempt, error } = await db.from('portal_displayr_mailbox_oauth_states').delete()
      .eq('auth_user_id', admin.authId).eq('portal_session_id', admin.sessionId)
      .eq('state_hash', hashOAuthValue(state)).gt('expires_at', new Date().toISOString())
      .select('verifier_ciphertext').maybeSingle();
    if (error || !attempt) return finish('denied');
    if (req.nextUrl.searchParams.has('error')) return finish('cancelled');
    const code = req.nextUrl.searchParams.get('code');
    if (!code || code.length > 4096) return finish('denied');
    const { clientId, clientSecret, key } = mailboxConfig();
    const tokens = await googleJSON('https://oauth2.googleapis.com/token', { method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({
        client_id: clientId, client_secret: clientSecret, code, grant_type: 'authorization_code', redirect_uri: MAILBOX_CALLBACK,
        code_verifier: decryptMailboxSecret(attempt.verifier_ciphertext, key, 'verifier'),
      }) });
    if (typeof tokens.access_token !== 'string' || !tokens.access_token) return finish('failed');
    const profile = await googleJSON('https://gmail.googleapis.com/gmail/v1/users/me/profile', { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    if (profile.emailAddress?.toLowerCase() !== MAILBOX_EMAIL) return finish('wrong-mailbox');
    validateMailboxGrant(tokens, profile);
    const stored = await db.from('portal_displayr_mailbox_connection').upsert({ mailbox: MAILBOX_EMAIL,
      refresh_token_ciphertext: encryptMailboxSecret(tokens.refresh_token, key, 'refresh'),
      connected_by: admin.authId, connected_at: new Date().toISOString(), scope: MAILBOX_SCOPE,
    }, { onConflict: 'mailbox' });
    if (stored.error) return finish('failed');
    return finish('connected');
  } catch { return finish('failed'); }
}
