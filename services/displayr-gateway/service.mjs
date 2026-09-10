import http from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { createGateway } from '../../experiments/displayr-gateway/gateway.mjs';

const opaque = () => randomBytes(32).toString('base64url');
const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
  res.end(JSON.stringify(body));
};
function matchesSecret(header, secret) {
  const actual = Buffer.from(header || '');
  const expected = Buffer.from(`Bearer ${secret}`);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
function validDecision(value) {
  if (!value || typeof value.userId !== 'string' || !value.userId || !Number.isFinite(value.expiresAt)) return false;
  try {
    const url = new URL(value.dashboardPath, 'https://app.displayr.com');
    return url.origin === 'https://app.displayr.com' && url.pathname === '/Dashboard' && !url.hash &&
      typeof value.dashboardPath === 'string' && value.dashboardPath.startsWith('/Dashboard?') &&
      [...url.searchParams.keys()].length === 1 && ['project_id', 'id'].some(key => !!url.searchParams.get(key)) &&
      Array.isArray(value.documentIds) && value.documentIds.length <= 10 && value.documentIds.every(id => typeof id === 'string' && /^[\w-]{1,100}$/.test(id));
  } catch { return false; }
}

// authorizeScope is a trusted server adapter, never browser input. It must
// validate the live portal session, workspace, subscription and entitlement.
export function createPilotService({ gatewayOrigin, portalOrigin, controlSecret, broker, authorizeScope, now = Date.now, upstreamOrigin = 'https://app.displayr.com', assetOrigins = [] }) {
  if (typeof controlSecret !== 'string' || controlSecret.length < 32) throw new Error('Strong control secret required');
  const leases = new Map();
  const reap = () => { for (const [id, lease] of leases) if (lease.expiresAt <= now()) leases.delete(id); };
  async function check({ userId, dashboardId }) {
    reap();
    const lease = leases.get(dashboardId);
    if (!lease || lease.userId !== userId) return false;
    try {
      const decision = await authorizeScope(lease.scope);
      if (!validDecision(decision) || decision.userId !== lease.userId || decision.expiresAt <= now() ||
          decision.dashboardPath !== lease.dashboardPath || JSON.stringify(decision.documentIds) !== JSON.stringify(lease.documentIds)) {
        leases.delete(dashboardId);
        return false;
      }
      lease.expiresAt = Math.min(lease.expiresAt, decision.expiresAt);
      return lease.expiresAt > now();
    } catch { leases.delete(dashboardId); return false; }
  }
  const gateway = createGateway({
    upstreamOrigin, gatewayOrigin, portalOrigin, assetOrigins, now,
    authorize: check,
    resolveDashboard: ({ dashboardId }) => leases.get(dashboardId)?.dashboardPath,
    resolveDocumentIds: ({ dashboardId }) => leases.get(dashboardId)?.documentIds || [],
    getInitialCookies: ({ userId }) => broker.getCookies(userId),
  });
  const control = http.createServer(async (req, res) => {
    // This listener belongs on loopback/private networking, separate from the
    // public gateway listener. No CORS and no browser-origin control requests.
    if (req.headers.origin || !matchesSecret(req.headers.authorization, controlSecret)) return send(res, 401, { error: 'Unauthorized' });
    if (req.method !== 'POST' || req.url !== '/launch') return send(res, 404, { error: 'Not found' });
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return send(res, 415, { error: 'JSON required' });
    try {
      const chunks = []; let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 16_384) return send(res, 413, { error: 'Request too large' });
        chunks.push(chunk);
      }
      const scope = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      if (!scope || !['accessToken', 'companyId', 'dashboardSlug'].every(key => typeof scope[key] === 'string' && scope[key].length > 0) || Object.keys(scope).some(key => !['accessToken', 'companyId', 'dashboardSlug'].includes(key))) return send(res, 400, { error: 'Invalid scope' });
      reap();
      if (leases.size >= 1000) return send(res, 503, { error: 'Pilot capacity reached' });
      const decision = await authorizeScope(scope);
      if (!validDecision(decision) || decision.expiresAt <= now()) return send(res, 403, { error: 'Access denied' });
      // Identity and upstream route come solely from the verified decision.
      const leaseId = opaque();
      const lease = { ...decision, scope, expiresAt: Math.min(decision.expiresAt, now() + 15 * 60_000) };
      leases.set(leaseId, lease);
      try {
        const ticket = await gateway.issueLaunch({ userId: decision.userId, dashboardId: leaseId });
        return send(res, 200, { launchPath: `/__gateway/launch?ticket=${encodeURIComponent(ticket)}`, expiresAt: lease.expiresAt });
      } catch { leases.delete(leaseId); throw new Error('Launch unavailable'); }
    } catch { return send(res, 503, { error: 'Launch unavailable' }); }
  });
  control.requestTimeout = 15_000;
  control.headersTimeout = 10_000;
  return { gateway, control, async close() {
    leases.clear(); broker.clear();
    control.closeAllConnections();
    await new Promise(resolve => control.close(resolve));
    await gateway.close();
  } };
}
