import { NextRequest, NextResponse } from 'next/server';
import { authorizeDisplayrGateway } from '@/lib/portal/displayr-gateway';
import { callbackAuthenticationFailure } from '@/lib/portal/displayr-callback-auth';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', 'Referrer-Policy': 'no-referrer' };
const denied = (status: number) => NextResponse.json({ error: 'Gateway access unavailable' }, { status, headers });
function authenticationDenied(reason: string) {
  console.warn('[displayr-gateway] callback authentication rejected', { reason });
  const response = denied(401);
  response.headers.set('X-Ecofocus-Callback-Error', reason);
  return response;
}

export async function POST(req: NextRequest) {
  if (req.headers.has('origin')) return authenticationDenied('CALLBACK_ORIGIN_PRESENT');
  if (!/^application\/json(?:;|$)/i.test(req.headers.get('content-type') || '')) return denied(415);
  try {
    const reader = req.body?.getReader();
    if (!reader) return denied(400);
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16_384) { await reader.cancel(); return denied(413); }
      chunks.push(value);
    }
    let envelope;
    try { envelope = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
    catch { return denied(400); }
    if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) return denied(400);
    // Authenticate before any Auth/database work. Never log the request body
    // or pass the callback credential into the dashboard authorization scope.
    const { callbackSecret, ...scope } = envelope;
    const reason = callbackAuthenticationFailure(req.headers, process.env.DISPLAYR_AUTHORIZATION_SECRET, callbackSecret);
    if (reason) return authenticationDenied(reason);
    if (!scope || !['accessToken', 'companyId', 'dashboardSlug'].every(key => typeof scope[key] === 'string' && scope[key].length > 0) || Object.keys(scope).some(key => !['accessToken', 'companyId', 'dashboardSlug'].includes(key))) return denied(400);
    const decision = await authorizeDisplayrGateway(scope);
    return decision ? NextResponse.json(decision, { headers }) : denied(403);
  } catch {
    console.error('[displayr-gateway] callback authorization unavailable');
    return denied(503);
  }
}
