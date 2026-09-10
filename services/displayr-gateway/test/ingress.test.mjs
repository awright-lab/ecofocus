import assert from 'node:assert/strict';
import test from 'node:test';
import http from 'node:http';
import { once } from 'node:events';
import { createIngress } from '../ingress.mjs';
import { createPilotService } from '../service.mjs';
import { parseViewerSecrets } from '../login.mjs';

const listen = async server => { server.listen(0, '127.0.0.1'); await once(server, 'listening'); return `http://127.0.0.1:${server.address().port}`; };
// Use raw HTTP so the test can preserve a public Host header while connecting
// to loopback, as Railway's TLS proxy does.
const fetch = (url, options = {}) => new Promise((resolve, reject) => {
  const req = http.request(url, { method: options.method || 'GET', headers: options.headers }, res => {
    const chunks = [];
    res.on('data', chunk => chunks.push(chunk));
    res.on('end', () => resolve({ status: res.statusCode, headers: { get: name => { const value = res.headers[name]; return Array.isArray(value) ? value[0] : value; } }, json: async () => JSON.parse(Buffer.concat(chunks).toString()) }));
  });
  req.on('error', reject); req.end(options.body);
});
test('Railway ingress exposes health and authenticated launch while preserving gateway access checks', async t => {
  const secret = 'fixture-control-secret-at-least-32-characters';
  const upstream = http.createServer((_req, res) => { res.setHeader('Content-Type', 'text/plain'); res.end('private report'); });
  const upstreamOrigin = await listen(upstream);
  const service = createPilotService({ gatewayOrigin: 'http://gateway.example', portalOrigin: 'http://portal.example', upstreamOrigin,
    controlSecret: secret, broker: { getCookies: async () => [], clear() {} },
    authorizeScope: async scope => scope.accessToken === 'verified' ? { userId: 'pilot', expiresAt: Date.now() + 60_000, dashboardPath: '/Dashboard?project_id=123', documentIds: ['123'] } : null,
  });
  const ingress = createIngress({ service, gatewayOrigin: 'http://gateway.example' });
  const url = await listen(ingress);
  t.after(async () => { ingress.closeAllConnections(); await new Promise(resolve => ingress.close(resolve)); await service.close(); upstream.closeAllConnections(); await new Promise(resolve => upstream.close(resolve)); });
  assert.equal((await fetch(url + '/healthz')).status, 503);
  await listen(service.control); await listen(service.gateway.server);
  assert.equal((await fetch(url + '/healthz')).status, 200);
  assert.equal((await fetch(url + '/Dashboard?project_id=123')).status, 400);
  const headers = { Host: 'gateway.example', 'Content-Type': 'application/json' };
  assert.equal((await fetch(url + '/Dashboard?project_id=123', { headers })).status, 401);
  assert.equal((await fetch(url + '/__gateway/status', { headers })).status, 404);
  const request = { method: 'POST', headers, body: JSON.stringify({ accessToken: 'verified', companyId: 'company', dashboardSlug: 'report' }) };
  assert.equal((await fetch(url + '/__control/launch', request)).status, 401);
  request.headers = { ...headers, Authorization: `Bearer ${secret}`, Origin: 'http://portal.example' };
  assert.equal((await fetch(url + '/__control/launch', request)).status, 401);
  delete request.headers.Origin;
  const launch = await fetch(url + '/__control/launch', request);
  assert.equal(launch.status, 200);
  const { launchPath } = await launch.json();
  const redeemed = await fetch(url + launchPath, { headers, redirect: 'manual' });
  assert.equal(redeemed.status, 303);
  const cookie = redeemed.headers.get('set-cookie').split(';')[0];
  assert.equal((await fetch(url + '/Dashboard?project_id=123', { headers: { ...headers, Cookie: cookie } })).status, 200);
});

test('Railway secret parsing rejects shared viewers and redacts malformed JSON', () => {
  const viewers = parseViewerSecrets(JSON.stringify({ viewers: { pilot: { email: 'viewer@example.org', password: 'fixture-only' } } }));
  assert.equal(viewers.get('pilot').email, 'viewer@example.org');
  assert.throws(() => parseViewerSecrets('private malformed value'), { message: 'Invalid viewer configuration' });
  assert.throws(() => parseViewerSecrets(JSON.stringify({ viewers: { a: { email: 'same@example.org', password: 'fixture' }, b: { email: 'SAME@example.org', password: 'fixture' } } })), /distinct Displayr viewer/);
});
