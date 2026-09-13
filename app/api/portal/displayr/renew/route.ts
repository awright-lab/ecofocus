import { NextRequest, NextResponse } from 'next/server';
import { getPortalAccessContext } from '@/lib/portal/auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { isDisplayrGatewayPilotUser } from '@/lib/portal/displayr-gateway-config';
import { launchDisplayrGateway } from '@/lib/portal/displayr-gateway';

const headers = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' };
export async function POST(req: NextRequest) {
  if (req.headers.get('origin') !== req.nextUrl.origin || !/^application\/json(?:;|$)/i.test(req.headers.get('content-type') || '')) {
    return NextResponse.json({ error: 'Request denied' }, { status: 403, headers });
  }
  try {
    const reader = req.body?.getReader();
    if (!reader) return NextResponse.json({ error: 'Invalid request' }, { status: 400, headers });
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 2048) { await reader.cancel(); return NextResponse.json({ error: 'Invalid request' }, { status: 413, headers }); }
      chunks.push(value);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!body || Object.keys(body).length !== 1 || typeof body.dashboardSlug !== 'string' || !/^[a-z0-9-]{1,100}$/.test(body.dashboardSlug)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400, headers });
    }
    const access = await getPortalAccessContext();
    if (!access?.session || access.isPreviewMode || !isDisplayrGatewayPilotUser(access.user.id)) {
      return NextResponse.json({ error: 'Session unavailable' }, { status: 403, headers });
    }
    const supabase = await getServerSupabase();
    let { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return NextResponse.json({ error: 'Session unavailable' }, { status: 401, headers });
    // Persist refreshed cookies in this route handler before the old token expires.
    if ((session.expires_at || 0) * 1000 < Date.now() + 5 * 60_000) {
      const refreshed = await supabase.auth.refreshSession();
      session = refreshed.data.session;
      error = refreshed.error;
    }
    if (error || !session) return NextResponse.json({ error: 'Session unavailable' }, { status: 401, headers });
    // getSession supplies a token, never an authorization decision. The helper
    // verifies it with Auth and checks the live session and workspace entitlement.
    const url = await launchDisplayrGateway({ accessToken: session.access_token, companyId: access.company.id, dashboardSlug: body.dashboardSlug }, access.user.id, true);
    return NextResponse.json({ renewalUrl: url.toString() }, { headers });
  } catch {
    return NextResponse.json({ error: 'Session renewal unavailable' }, { status: 503, headers });
  }
}
