import assert from 'node:assert/strict';
import test from 'node:test';
import http from 'node:http';
import { once } from 'node:events';
import { createPilotService } from '../service.mjs';

async function listen(server) {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return `http://127.0.0.1:${server.address().port}`;
}
async function fixture(t) {
  let decision = { userId: 'alice', expiresAt: Date.now() + 60_000, dashboardPath: '/Dashboard?project_id=123', documentIds: ['123'] };
  let logins = 0;
  const upstream = http.createServer((req, res) => { res.setHeader('Content-Type', 'text/plain'); res.end(req.headers.cookie || 'missing'); });
  const upstreamOrigin = await listen(upstream);
  const secret = 'test-control-secret-of-at-least-32-characters';
  const service = createPilotService({ gatewayOrigin: 'http://127.0.0.1:0', portalOrigin: 'http://127.0.0.1:4300', upstreamOrigin, controlSecret: secret,
    broker: { getCookies: async id => { logins++; return [{ name: 'viewer', value: id, path: '/' }]; }, clear() {} },
    authorizeScope: async scope => scope.accessToken === 'verified-test-token' ? decision : null,
  });
  const control = await listen(service.control);
  const gateway = await listen(service.gateway.server);
  t.after(async () => { await service.close(); upstream.closeAllConnections(); await new Promise(resolve => upstream.close(resolve)); });
  const launch = (overrides = {}, headers = {}) => fetch(`${control}/launch`, { method: 'POST', headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ accessToken: 'verified-test-token', companyId: 'company', dashboardSlug: 'report', ...overrides }) });
  return { gateway, launch, setDecision: value => { decision = value; }, getLogins: () => logins };
}

test('private launch requires server secret, rejects browser requests and unverified identity', async t => {
  const f = await fixture(t);
  assert.equal((await f.launch({}, { Authorization: 'Bearer wrong' })).status, 401);
  assert.equal((await f.launch({}, { Origin: 'http://127.0.0.1:4300' })).status, 401);
  assert.equal((await f.launch({ userId: 'admin' })).status, 400);
  assert.equal((await f.launch({ accessToken: 'invalid' })).status, 403);
  assert.equal(f.getLogins(), 0);
});

test('opaque launch opens authorized session, burns ticket and stops after revocation', async t => {
  const f = await fixture(t);
  const response = await f.launch();
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok(!JSON.stringify(body).includes('verified-test-token'));
  const launched = await fetch(f.gateway + body.launchPath, { redirect: 'manual' });
  assert.equal(launched.status, 303);
  const cookie = launched.headers.get('set-cookie').split(';')[0];
  assert.ok(!cookie.includes('alice'));
  const page = await fetch(f.gateway + '/Dashboard?project_id=123', { headers: { Cookie: cookie } });
  assert.equal(page.status, 200);
  assert.equal(await page.text(), 'viewer=alice');
  assert.notEqual((await fetch(f.gateway + body.launchPath, { redirect: 'manual' })).status, 303);
  f.setDecision(null);
  assert.equal((await fetch(f.gateway + '/Dashboard?project_id=123', { headers: { Cookie: cookie } })).status, 403);
});

test('expired and external dashboard decisions fail closed', async t => {
  const f = await fixture(t);
  f.setDecision({ userId: 'alice', expiresAt: 0, dashboardPath: '/Dashboard?project_id=123', documentIds: [] });
  assert.equal((await f.launch()).status, 403);
  f.setDecision({ userId: 'alice', expiresAt: Date.now() + 60_000, dashboardPath: 'https://example.org/Dashboard?project_id=123', documentIds: [] });
  assert.equal((await f.launch()).status, 403);
  assert.equal(f.getLogins(), 0);
});
