import { NextRequest, NextResponse } from 'next/server';
import { getInviteSupabase } from '@/lib/supabase/server';
import { getPortalOrigin } from '@/lib/portal/host';
const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' };
export async function POST(req: NextRequest) {
  let email: string;
  try {
    const body = await req.json();
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error();
  } catch { return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400, headers }); }
  try {
    const { error } = await getInviteSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: new URL('/reset-password', getPortalOrigin()).href,
    });
    if (error) {
      console.warn('[portal/password-reset] recovery delivery failed', { status: error.status, code: error.code });
      return NextResponse.json({ error: 'We could not send the reset email. Please wait a few minutes and try again.' }, { status: 503, headers });
    }
    return NextResponse.json({ ok: true }, { headers });
  } catch { return NextResponse.json({ error: 'Password reset is temporarily unavailable. Please try again shortly.' }, { status: 503, headers }); }
}
