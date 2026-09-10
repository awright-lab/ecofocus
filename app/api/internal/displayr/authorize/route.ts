import { NextRequest, NextResponse } from 'next/server';
import { authorizeDisplayrGateway } from '@/lib/portal/displayr-gateway';
import { callbackAuthenticationFailure } from '@/lib/portal/displayr-callback-auth';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', 'Referrer-Policy': 'no-referrer' };
const denied = (status: number) => NextResponse.json({ error: 'Gateway access unavailable' }, { status, headers });

export async function POST(req: NextRequest) {
  const reason = callbackAuthenticationFailure(req.headers, process.env.DISPLAYR_AUTHORIZATION_SECRET);
  if (reason) {
    console.warn('[displayr-gateway] callback authentication rejected', { reason });
    const response = denied(401);
    response.headers.set('X-Ecofocus-Callback-Error', reason);
    return response;
  }
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
    const scope = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!scope || !['accessToken', 'companyId', 'dashboardSlug'].every(key => typeof scope[key] === 'string' && scope[key].length > 0) || Object.keys(scope).some(key => !['accessToken', 'companyId', 'dashboardSlug'].includes(key))) return denied(400);
    const decision = await authorizeDisplayrGateway(scope);
    return decision ? NextResponse.json(decision, { headers }) : denied(403);
  } catch {
    console.error('[displayr-gateway] callback authorization unavailable');
    return denied(503);
  }
}
