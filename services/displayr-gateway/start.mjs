import { chromium } from 'playwright';
import { createBrowserAuthenticator, readViewerSecrets, parseViewerSecrets } from './login.mjs';
import { createSessionBroker } from './session-broker.mjs';
import { createPilotService } from './service.mjs';
import { createIngress } from './ingress.mjs';

function origin(name) {
  const url = new URL(process.env[name]);
  const local = ['localhost', '127.0.0.1'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:')) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error(`Invalid ${name}`);
  return url.origin;
}
const gatewayOrigin = origin('DISPLAYR_GATEWAY_PUBLIC_ORIGIN');
const portalOrigin = origin('DISPLAYR_PORTAL_ORIGIN');
if (gatewayOrigin === portalOrigin) throw new Error('A separate gateway origin is required');
const callback = new URL(process.env.DISPLAYR_AUTHORIZATION_URL);
if (callback.origin !== portalOrigin || callback.username || callback.password || callback.search || callback.hash) throw new Error('Authorization endpoint must belong to the portal');
const callbackSecret = process.env.DISPLAYR_AUTHORIZATION_SECRET;
if (!callbackSecret || callbackSecret.length < 32) throw new Error('Strong authorization secret required');
if (process.env.DISPLAYR_VIEWER_SECRETS_JSON && process.env.DISPLAYR_VIEWER_SECRET_FILE) throw new Error('Choose one viewer secret source');
const viewers = process.env.DISPLAYR_VIEWER_SECRETS_JSON
  ? parseViewerSecrets(process.env.DISPLAYR_VIEWER_SECRETS_JSON)
  : await readViewerSecrets(process.env.DISPLAYR_VIEWER_SECRET_FILE);
delete process.env.DISPLAYR_VIEWER_SECRETS_JSON;
if (!viewers.size) throw new Error('At least one viewer mapping required');
const broker = createSessionBroker({ authenticate: createBrowserAuthenticator({ chromium, viewers, executablePath: process.env.DISPLAYR_CHROMIUM_PATH }) });
const service = createPilotService({
  gatewayOrigin, portalOrigin, controlSecret: process.env.DISPLAYR_CONTROL_SECRET, broker,
  assetOrigins: ['https://static-assets.prod.displayr.com', 'https://displayrcors.displayr.com', 'https://displayr-app-image.displayr.com', 'https://widget-cdn.displayr.com'],
  authorizeScope: async scope => {
    let response;
    try { response = await fetch(callback, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(5000),
      headers: {
        'Content-Type': 'application/json',
        'X-Ecofocus-Gateway-Authorization': `Bearer ${callbackSecret}`,
        Authorization: `Bearer ${callbackSecret}`,
      },
      body: JSON.stringify({ ...scope, callbackSecret }),
    }); } catch {
      console.error('[displayr-gateway] portal callback request failed');
      return null;
    }
    if (!response.ok) {
      const reportedReason = response.headers.get('x-ecofocus-callback-error');
      const knownReasons = ['CALLBACK_ORIGIN_PRESENT', 'CALLBACK_SECRET_MISSING', 'CALLBACK_SECRET_TOO_SHORT', 'CALLBACK_AUTHORIZATION_MISSING', 'CALLBACK_CREDENTIAL_MISMATCH'];
      const reason = knownReasons.includes(reportedReason) ? reportedReason : 'CALLBACK_REASON_UNAVAILABLE';
      console.warn('[displayr-gateway] portal callback rejected', { status: response.status, reason });
      return null;
    }
    const decision = await response.json();
    if (!viewers.has(decision?.userId)) {
      console.warn('[displayr-gateway] viewer mapping missing');
      return null;
    }
    return decision;
  },
});
const gatewayPort = Number(process.env.DISPLAYR_GATEWAY_PORT || 4351);
const controlPort = Number(process.env.DISPLAYR_CONTROL_PORT || 4352);
const ingressPort = process.env.PORT ? Number(process.env.PORT) : null;
const ports = [gatewayPort, controlPort, ...(ingressPort === null ? [] : [ingressPort])];
if (!ports.every(port => Number.isInteger(port) && port > 1024 && port < 65536) || new Set(ports).size !== ports.length) throw new Error('Distinct unprivileged ports required');
const ingress = ingressPort === null ? null : createIngress({ service, gatewayOrigin });
const listen = (server, port, host = '127.0.0.1') => new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, host, resolve); });
async function close() {
  if (ingress?.listening) { ingress.closeAllConnections(); await new Promise(resolve => ingress.close(resolve)); }
  await service.close();
}
try {
  await listen(service.control, controlPort);
  await listen(service.gateway.server, gatewayPort);
  if (ingress) await listen(ingress, ingressPort, '0.0.0.0');
  console.log('Displayr pilot ready. Portal authorization is required.');
} catch {
  await close();
  throw new Error('Pilot listeners could not start');
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await close(); process.exit(0); });
