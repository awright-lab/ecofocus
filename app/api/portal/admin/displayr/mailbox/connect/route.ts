import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/server';
import { mailboxAdministrator, mailboxConfig } from '@/lib/portal/displayr-mailbox';
import { MAILBOX_CALLBACK, MAILBOX_COOKIE, encryptMailboxSecret, hashOAuthValue, mailboxAuthorizationUrl, randomOAuthValue } from '@/lib/portal/displayr-mailbox-crypto';

function denied(reason: string, status: number) {
  console.warn('[displayr-mailbox] connect denied', { reason });
  return NextResponse.json({ reason }, { status, headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
}

export async function POST(req: NextRequest) {
  const origin = new URL(MAILBOX_CALLBACK).origin;
  if (req.nextUrl.origin !== origin) return denied('request-host', 403);
  if (req.headers.get('origin') !== origin) return denied('request-origin', 403);
  if (!/^application\/json(?:;|$)/i.test(req.headers.get('content-type') || '')) return denied('request-format', 415);
  try {
    const admin = await mailboxAdministrator();
    if (!admin) return denied('admin-session', 403);
    const { clientId, key } = mailboxConfig();
    const state = randomOAuthValue(), verifier = randomOAuthValue();
    const db = getServiceSupabase();
    // Remove expired attempts and replace this administrator's previous attempt.
    const cleanup = await db.from('portal_displayr_mailbox_oauth_states').delete().lt('expires_at', new Date().toISOString());
    if (cleanup.error) throw new Error('State storage unavailable');
    const { error } = await db.from('portal_displayr_mailbox_oauth_states').upsert({
      auth_user_id: admin.authId, state_hash: hashOAuthValue(state), portal_session_id: admin.sessionId,
      verifier_ciphertext: encryptMailboxSecret(verifier, key, 'verifier'), expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
    }, { onConflict: 'auth_user_id' });
    if (error) throw new Error('State storage unavailable');
    const response = NextResponse.json({ url: mailboxAuthorizationUrl(clientId, state, verifier).href });
    response.headers.set('Cache-Control', 'no-store'); response.headers.set('Referrer-Policy', 'no-referrer');
    response.cookies.set(MAILBOX_COOKIE, state, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 600 });
    return response;
  } catch {
    return denied('unavailable', 503);
  }
}
