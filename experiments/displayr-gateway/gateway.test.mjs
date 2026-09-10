import assert from 'node:assert/strict';
import { createServer, request as httpRequest } from 'node:http';
import { once } from 'node:events';
import { setImmediate } from 'node:timers/promises';
import test from 'node:test';
import { createGateway } from './gateway.mjs';

const EXPORT_BYTES = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0xff, 0x80, 0x0d, 0x0a]);

async function listen(server) {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return `http://127.0.0.1:${server.address().port}`;
}

async function closeServer(server) {
  server.closeAllConnections();
  if (server.listening) await new Promise((resolve) => server.close(resolve));
}

async function fixture(t, overrides = {}) {
  const requests = [];
  let currentTime = Date.now();
  let permitted = true;
  let upstreamOrigin;
  const upstream = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString();
    const request = { url: req.url, method: req.method, headers: req.headers, body };
    requests.push(request);
    const url = new URL(req.url, upstreamOrigin);
    if (overrides.respond && await overrides.respond({ req, res, url, request, upstreamOrigin })) return;
    if (url.pathname === '/api/export') {
      res.writeHead(200, {
        'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'content-disposition': 'attachment; filename="analysis.xlsx"',
        'set-cookie': 'export_secret=server-only; HttpOnly; Path=/',
      });
      res.end(EXPORT_BYTES);
      return;
    }
    if (url.pathname.startsWith('/api/redirect-')) {
      const targets = {
        '/api/redirect-internal': `${upstreamOrigin}/Dashboard?project_id=101`,
        '/api/redirect-other-project': `${upstreamOrigin}/Dashboard?project_id=202`,
        '/api/redirect-external': 'https://untrusted.example/collect',
        '/api/redirect-login': `${upstreamOrigin}/Account/Login`,
      };
      res.writeHead(302, { location: targets[url.pathname] });
      res.end();
      return;
    }
    if (url.pathname === '/api/unauthorized') {
      res.writeHead(401, { 'www-authenticate': 'Basic realm="private dashboard"' });
      res.end('Upstream credentials required');
      return;
    }
    if (url.pathname === '/api/login-html') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end('<html><form action="/Account/Login"><input type="password" name="Password"><button>Log in</button></form></html>');
      return;
    }
    if (url.pathname === '/Dashboard') {
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
        'content-security-policy': `default-src ${upstreamOrigin}`,
        'set-cookie': 'upstream_session=private; HttpOnly; Path=/',
      });
      res.end(`<html><script src="${upstreamOrigin}/assets/app.js"></script><a href="${upstreamOrigin}/api/export">Export</a></html>`);
      return;
    }
    if (url.pathname === '/assets/app.js') {
      res.writeHead(200, { 'content-type': 'application/javascript' });
      res.end(`const absolute = "${upstreamOrigin}/api/query"; const escaped = "${upstreamOrigin.replaceAll('/', '\\/')}/api/query";`);
      return;
    }
    if (url.pathname === '/api/set-state') {
      res.setHeader('set-cookie', `upstream_state=${url.searchParams.get('value')}; HttpOnly; Path=/`);
    }
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(request));
  });
  upstreamOrigin = await listen(upstream);
  const gateway = createGateway({
    upstreamOrigin,
    gatewayOrigin: 'http://127.0.0.1:0',
    portalOrigin: 'http://portal.example',
    authorize: async (identity) => {
      const decision = permitted;
      overrides.onAuthorize?.(identity, decision);
      return decision;
    },
    resolveDashboard: ({ dashboardId }) => `/Dashboard?project_id=${dashboardId}`,
    getInitialCookies: async ({ userId }) => [{
      name: 'displayr_identity', value: userId, path: '/', domain: '127.0.0.1', secure: false,
    }],
    sessionTtlMs: 10_000,
    ticketTtlMs: 1_000,
    now: () => currentTime,
    ...overrides.gatewayOptions,
  });
  const origin = await listen(gateway.server);
  t.after(async () => {
    await gateway.close();
    await closeServer(gateway.server);
    await closeServer(upstream);
  });
  async function launch(userId = 'alice', dashboardId = '101') {
    const ticket = await gateway.issueLaunch({ userId, dashboardId });
    const response = await fetch(`${origin}/__gateway/launch?ticket=${encodeURIComponent(ticket)}`, { redirect: 'manual' });
    const sessionCookie = response.headers.getSetCookie().find((value) => value.startsWith('ef_gateway_session='));
    return { ticket, response, cookie: sessionCookie?.split(';')[0] };
  }
  function get(path, cookie, options = {}) {
    return fetch(`${origin}${path}`, {
      ...options,
      redirect: 'manual',
      headers: { ...(cookie ? { cookie } : {}), ...options.headers },
    });
  }
  return {
    gateway, origin, upstreamOrigin, requests, launch, get,
    advance: (ms) => { currentTime += ms; },
    revoke: () => { permitted = false; },
    restoreAccess: () => { permitted = true; },
  };
}

test('unauthenticated dashboard and forged session never reach upstream', async (t) => {
  const f = await fixture(t);
  for (const cookie of [undefined, 'ef_gateway_session=forged']) {
    const response = await f.get('/Dashboard?project_id=101', cookie);
    assert.equal(response.status, 401);
  }
  assert.equal(f.requests.length, 0);
});

test('launch issues an HttpOnly session, redirects to its dashboard, and consumes its ticket', async (t) => {
  const f = await fixture(t);
  const { response, ticket, cookie } = await f.launch();
  assert.equal(response.status, 303);
  assert.equal(new URL(response.headers.get('location'), f.origin).pathname, '/Dashboard');
  assert.equal(new URL(response.headers.get('location'), f.origin).searchParams.get('project_id'), '101');
  assert.ok(cookie);
  assert.match(response.headers.get('set-cookie'), /HttpOnly/i);
  assert.match(response.headers.get('set-cookie'), /SameSite=/i);
  assert.equal((await f.get(`/__gateway/launch?ticket=${ticket}`)).status, 401);
  assert.equal((await f.get('/Dashboard?project_id=101', cookie)).status, 200);
});

test('expired and invalid launch tickets fail before contacting upstream', async (t) => {
  const f = await fixture(t);
  const ticket = await f.gateway.issueLaunch({ userId: 'alice', dashboardId: '101' });
  f.advance(1_001);
  assert.equal((await f.get(`/__gateway/launch?ticket=${ticket}`)).status, 401);
  assert.equal((await f.get('/__gateway/launch?ticket=not-a-valid-ticket')).status, 401);
  assert.equal(f.requests.length, 0);
});

test('concurrent redemption of one launch ticket creates only one session', async (t) => {
  const f = await fixture(t);
  const ticket = await f.gateway.issueLaunch({ userId: 'alice', dashboardId: '101' });
  const responses = await Promise.all(Array.from({ length: 3 }, () => f.get(`/__gateway/launch?ticket=${ticket}`)));
  assert.deepEqual(responses.map((response) => response.status).sort(), [303, 401, 401]);
  assert.equal(responses.filter((response) => response.headers.has('set-cookie')).length, 1);
});

test('authorization is enforced at launch and on every subsequent request', async (t) => {
  const f = await fixture(t);
  const { cookie } = await f.launch();
  assert.equal((await f.get('/api/query', cookie)).status, 200);
  f.revoke();
  assert.equal((await f.get('/api/query', cookie)).status, 403);
  // A revoked session may be retained as denied or removed as unauthenticated.
  assert.ok([401, 403].includes((await f.get('/api/export', cookie)).status));
  assert.equal((await f.launch('bob')).response.status, 403);
  assert.equal(f.requests.length, 1);
});

test('expired sessions cannot continue querying the dashboard', async (t) => {
  const f = await fixture(t);
  const { cookie } = await f.launch();
  f.advance(10_001);
  assert.equal((await f.get('/api/query', cookie)).status, 401);
  assert.equal(f.requests.length, 0);
});

test('restoring authorization requires a fresh launch and never revives a revoked session', async (t) => {
  const f = await fixture(t);
  const original = await f.launch();
  assert.equal((await f.get('/api/query', original.cookie)).status, 200);
  f.revoke();
  assert.equal((await f.get('/api/query', original.cookie)).status, 403);
  f.restoreAccess();
  assert.ok([401, 403].includes((await f.get('/api/query', original.cookie)).status));
  assert.ok([401, 403].includes((await f.get('/api/export', original.cookie)).status));
  assert.equal(f.requests.length, 1);
  const fresh = await f.launch();
  assert.equal(fresh.response.status, 303);
  assert.notEqual(fresh.cookie, original.cookie);
  assert.equal((await f.get('/api/query', fresh.cookie)).status, 200);
  assert.equal(f.requests.length, 2);
});

test('revocation while awaiting upstream prevents the pending response from being delivered', async (t) => {
  let f;
  f = await fixture(t, {
    respond: async ({ url, res }) => {
      if (url.pathname !== '/api/revoke-during-query') return false;
      f.revoke();
      res.setHeader('content-type', 'application/json');
      res.end('{"confidential":"must not be delivered"}');
      return true;
    },
  });
  const { cookie } = await f.launch();
  const response = await f.get('/api/revoke-during-query', cookie);
  assert.equal(response.status, 403);
  assert.doesNotMatch(await response.text(), /confidential|must not be delivered/);
});

test('Displayr identities and cookies remain isolated between users and stay off the browser', async (t) => {
  const f = await fixture(t);
  const alice = await f.launch('alice');
  const bob = await f.launch('bob');
  assert.notEqual(alice.cookie, bob.cookie);
  const setState = await f.get('/api/set-state?value=alice-only', alice.cookie);
  assert.equal(setState.status, 200);
  assert.equal(setState.headers.get('set-cookie'), null);
  const aliceEcho = await (await f.get('/api/cookies', alice.cookie)).json();
  const bobEcho = await (await f.get('/api/cookies', bob.cookie)).json();
  assert.match(aliceEcho.headers.cookie, /displayr_identity=alice/);
  assert.match(aliceEcho.headers.cookie, /upstream_state=alice-only/);
  assert.match(bobEcho.headers.cookie, /displayr_identity=bob/);
  assert.doesNotMatch(bobEcho.headers.cookie, /alice|upstream_state/);
});

test('browser cookies and Authorization headers are never forwarded upstream', async (t) => {
  const f = await fixture(t);
  const { cookie } = await f.launch();
  const response = await f.get('/api/cookies', `${cookie}; portal_secret=private; displayr_identity=attacker`, {
    headers: { authorization: 'Bearer browser-secret' },
  });
  assert.equal(response.status, 200);
  const echo = await response.json();
  assert.equal(echo.headers.authorization, undefined);
  assert.doesNotMatch(echo.headers.cookie, /ef_gateway_session|portal_secret|attacker|browser-secret/);
  assert.match(echo.headers.cookie, /displayr_identity=alice/);
});

test('the application preserves only the exact XMLHttpRequest transport marker supplied by the browser', async (t) => {
  const f = await fixture(t);
  const { cookie } = await f.launch();
  for (const marker of ['XMLHttpRequest', 'arbitrary-browser-value', undefined]) {
    const response = await f.get('/api/query', cookie, {
      headers: marker ? { 'x-requested-with': marker } : {},
    });
    assert.equal(response.status, 200);
    const echo = await response.json();
    assert.equal(echo.headers['x-requested-with'], marker === 'XMLHttpRequest' ? marker : undefined);
  }
});

test('mutating requests require the gateway origin and preserve legitimate request bodies', async (t) => {
  const f = await fixture(t);
  const { cookie } = await f.launch();
  for (const origin of [undefined, 'https://untrusted.example']) {
    const response = await f.get('/api/query', cookie, {
      method: 'POST', headers: origin ? { origin } : {}, body: 'question=Q3',
    });
    assert.equal(response.status, 403);
  }
  assert.equal(f.requests.length, 0);
  const response = await f.get('/api/query', cookie, {
    method: 'POST', headers: { origin: f.origin, 'content-type': 'application/json' },
    body: JSON.stringify({ project_id: '101', question: 'Q3', filters: ['age:18-34'] }),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse((await response.json()).body), {
    project_id: '101', question: 'Q3', filters: ['age:18-34'],
  });
});

test('dashboard binding rejects another project in navigation and query requests', async (t) => {
  const f = await fixture(t);
  const { cookie } = await f.launch();
  for (const path of ['/Dashboard?project_id=202', '/api/query?project_id=202']) {
    const response = await f.get(path, cookie);
    assert.ok(response.status >= 400 && response.status < 500, `${path}: ${response.status}`);
  }
  assert.equal(f.requests.length, 0);
});

test('dashboard binding rejects another project in a JSON mutation', async (t) => {
  const f = await fixture(t);
  const { cookie } = await f.launch();
  const response = await f.get('/api/query', cookie, {
    method: 'POST', headers: { origin: f.origin, 'content-type': 'application/json' },
    body: JSON.stringify({ project_id: '202', question: 'Q3' }),
  });
  assert.ok(response.status >= 400 && response.status < 500, `unexpected status ${response.status}`);
  assert.equal(f.requests.length, 0);
});

test('trusted document aliases permit the published dashboard API while navigation stays bound to its original URL', async (t) => {
  const resolutions = [];
  const f = await fixture(t, {
    gatewayOptions: {
      resolveDashboard: ({ dashboardId }) => `/Dashboard?id=${dashboardId}`,
      resolveDocumentIds: async ({ dashboardId }) => {
        resolutions.push(dashboardId);
        return dashboardId === 'published-uuid' ? [441160] : [];
      },
    },
  });
  const { cookie, response } = await f.launch('alice', 'published-uuid');
  assert.equal(response.status, 303);
  assert.deepEqual(resolutions, ['published-uuid']);
  assert.equal((await f.get('/api/query?project_id=441160', cookie)).status, 200);
  const mutation = (projectId) => f.get('/api/query', cookie, {
    method: 'POST', headers: { origin: f.origin, 'content-type': 'application/json' },
    body: JSON.stringify({ analysis: { project_id: projectId, question: 'Q3' } }),
  });
  assert.equal((await mutation(441160)).status, 200);
  assert.equal((await f.get('/api/query?project_id=999999', cookie)).status, 403);
  assert.equal((await mutation(999999)).status, 403);
  for (const path of ['/Dashboard?id=441160', '/Dashboard?project_id=441160', '/Dashboard?id=another-published-uuid']) {
    assert.equal((await f.get(path, cookie)).status, 403, path);
  }
  assert.equal(f.requests.length, 2);
  assert.equal((await f.get('/Dashboard?id=published-uuid', cookie)).status, 200);
  assert.equal(f.requests.length, 3);
});

test('browser launch and API parameters cannot add a trusted document alias', async (t) => {
  const f = await fixture(t, { gatewayOptions: { resolveDocumentIds: () => ['441160'] } });
  const ticket = await f.gateway.issueLaunch({ userId: 'alice', dashboardId: '101' });
  const launch = await f.get(`/__gateway/launch?ticket=${ticket}&documentIds=999999&project_id=999999`);
  assert.equal(launch.status, 303);
  const cookie = launch.headers.getSetCookie().find(value => value.startsWith('ef_gateway_session=')).split(';')[0];
  assert.equal((await f.get('/api/query?project_id=101&documentIds=999999', cookie)).status, 200);
  assert.equal((await f.get('/api/query?project_id=999999', cookie)).status, 403);
  const mutation = await f.get('/api/query', cookie, {
    method: 'POST', headers: { origin: f.origin, 'content-type': 'application/json' },
    body: JSON.stringify({ documentIds: ['999999'], project_id: '999999' }),
  });
  assert.equal(mutation.status, 403);
  assert.equal(f.requests.length, 1);
});

test('internal redirects stay on the gateway while external redirects are refused', async (t) => {
  const f = await fixture(t);
  const { cookie } = await f.launch();
  const internal = await f.get('/api/redirect-internal', cookie);
  assert.equal(internal.status, 302);
  const location = new URL(internal.headers.get('location'), f.origin);
  assert.equal(location.origin, f.origin);
  assert.equal(location.searchParams.get('project_id'), '101');
  const external = await f.get('/api/redirect-external', cookie);
  assert.equal(external.status, 502);
  assert.equal(external.headers.get('location'), null);
});

test('exports preserve exact binary bytes and download metadata without exposing upstream cookies', async (t) => {
  const f = await fixture(t);
  const { cookie } = await f.launch();
  const response = await f.get('/api/export', cookie);
  assert.equal(response.status, 200);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), EXPORT_BYTES);
  assert.equal(response.headers.get('content-disposition'), 'attachment; filename="analysis.xlsx"');
  assert.equal(response.headers.get('set-cookie'), null);
  assert.equal(response.headers.get('referrer-policy'), 'same-origin');
  assert.match(response.headers.get('cache-control'), /no-store/);
});

test('text and JSON attachments preserve non-UTF8 bytes and upstream URL strings without rewriting', async (t) => {
  let expected;
  const f = await fixture(t, {
    respond: async ({ url, res, upstreamOrigin }) => {
      if (!url.pathname.startsWith('/api/text-attachment/')) return false;
      const type = url.pathname.endsWith('/json') ? 'application/json' : 'text/plain; charset=utf-8';
      expected = Buffer.concat([
        Buffer.from(`{"download":"${upstreamOrigin}/api/export","raw":"`),
        Buffer.from([0xff, 0x80, 0xc0, 0x00]),
        Buffer.from('"}\r\n'),
      ]);
      res.writeHead(200, {
        'content-type': type,
        'content-disposition': 'attachment; filename="analysis-data.txt"',
        'set-cookie': 'export_only=never-for-browser; HttpOnly; Path=/',
      });
      res.end(expected);
      return true;
    },
  });
  const { cookie } = await f.launch();
  for (const format of ['text', 'json']) {
    const response = await f.get(`/api/text-attachment/${format}`, cookie);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-disposition'), 'attachment; filename="analysis-data.txt"');
    assert.equal(response.headers.get('set-cookie'), null);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected, `${format} attachment must preserve every byte`);
  }
});

async function bufferedResponseFixture(t) {
  let upstreamResponse;
  let checks = 0;
  let reachedResponseCheck;
  const responseAuthorized = new Promise(resolve => { reachedResponseCheck = resolve; });
  const f = await fixture(t, {
    onAuthorize: () => {
      // Launch checks twice, then the request checks before and after fetching
      // headers. Stop at the fourth check while the text body is incomplete.
      checks += 1;
      if (checks === 4) reachedResponseCheck();
    },
    respond: async ({ url, res }) => {
      if (url.pathname !== '/api/streamed-text') return false;
      upstreamResponse = res;
      res.writeHead(200, { 'content-type': 'application/json' });
      res.write('{"confidential":"');
      return true;
    },
  });
  t.after(() => upstreamResponse?.end());
  const { cookie } = await f.launch();
  const response = f.get('/api/streamed-text', cookie);
  await responseAuthorized;
  // Let the successful header check continue into body buffering before the
  // caller revokes access or advances time; the remaining body is still held.
  await setImmediate();
  return { f, response, finish: () => upstreamResponse.end('must not be delivered"}') };
}

test('revocation during streamed text buffering prevents buffered content from reaching the browser', { timeout: 5_000 }, async (t) => {
  const { f, response, finish } = await bufferedResponseFixture(t);
  f.revoke();
  finish();
  const result = await response;
  assert.equal(result.status, 403);
  assert.doesNotMatch(await result.text(), /confidential|must not be delivered/);
});

test('session expiry during streamed text buffering prevents buffered content from reaching the browser', { timeout: 5_000 }, async (t) => {
  const { f, response, finish } = await bufferedResponseFixture(t);
  f.advance(10_001);
  finish();
  const result = await response;
  assert.equal(result.status, 403);
  assert.doesNotMatch(await result.text(), /confidential|must not be delivered/);
});

test('HTML and scripts rewrite upstream URLs and CSP prevents direct upstream connections', async (t) => {
  const f = await fixture(t);
  const { cookie } = await f.launch();
  const response = await f.get('/Dashboard?project_id=101', cookie);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(!html.includes(f.upstreamOrigin));
  assert.match(html, new RegExp(f.origin.replaceAll('.', '\\.')));
  const csp = response.headers.get('content-security-policy');
  assert.ok(csp);
  assert.ok(!csp.includes(f.upstreamOrigin));
  assert.match(csp, /connect-src/);
  assert.match(csp, /frame-ancestors[^;]*http:\/\/portal\.example/);
  assert.equal(response.headers.get('set-cookie'), null);
  const script = await (await f.get('/assets/app.js', cookie)).text();
  assert.ok(!script.includes(f.upstreamOrigin));
  assert.ok(!script.includes(f.upstreamOrigin.replaceAll('/', '\\/')));
});

test('login redirects, login HTML, and upstream authentication challenges fail closed', async (t) => {
  const f = await fixture(t);
  const { cookie } = await f.launch();
  for (const path of ['/Account/Login', '/api/redirect-login', '/api/login-html', '/api/unauthorized']) {
    const response = await f.get(path, cookie);
    assert.ok(response.status >= 400 && response.status < 600, `${path}: ${response.status}`);
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('www-authenticate'), null);
    assert.doesNotMatch(await response.text(), /<input[^>]*type="password"/i);
  }
});

test('upstream frame restrictions are preserved and reported as an embedding constraint', async (t) => {
  const f = await fixture(t, {
    respond: async ({ url, res }) => {
      if (url.pathname !== '/api/restricted-frame') return false;
      res.writeHead(200, {
        'content-type': 'text/html',
        'content-security-policy': "frame-ancestors 'none'",
        'x-frame-options': 'DENY',
      });
      res.end('<html>Embedding is disabled by upstream</html>');
      return true;
    },
  });
  const { cookie } = await f.launch();
  const response = await f.get('/api/restricted-frame', cookie);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
});

test('allowlisted asset requests require a session and cannot exchange viewer credentials', async (t) => {
  const assetRequests = [];
  const assetServer = createServer((req, res) => {
    assetRequests.push({ headers: req.headers, url: req.url });
    res.writeHead(200, {
      'content-type': 'application/json',
      'set-cookie': 'third_party_secret=must-not-enter-viewer-jar; Path=/',
    });
    res.end(JSON.stringify({ headers: req.headers, url: req.url }));
  });
  const assetOrigin = await listen(assetServer);
  t.after(() => closeServer(assetServer));
  const f = await fixture(t, { gatewayOptions: { assetOrigins: [assetOrigin] } });
  const path = '/__gateway/assets/0/library.js';
  assert.equal((await f.get(path)).status, 401);
  assert.equal(assetRequests.length, 0);
  const { cookie } = await f.launch();
  const response = await f.get(path, `${cookie}; portal_secret=browser-secret`, {
    headers: { authorization: 'Bearer browser-secret', 'x-requested-with': 'XMLHttpRequest' },
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('set-cookie'), null);
  const echo = await response.json();
  assert.equal(echo.headers.cookie, undefined);
  assert.equal(echo.headers.authorization, undefined);
  assert.equal(echo.headers['x-requested-with'], undefined);
  assert.equal(echo.url, '/library.js');
  const upstreamEcho = await (await f.get('/api/cookies', cookie)).json();
  assert.doesNotMatch(upstreamEcho.headers.cookie, /third_party_secret/);
  assert.equal((await f.get(path, cookie, {
    method: 'POST', headers: { origin: f.origin }, body: 'mutation',
  })).status, 405);
  assert.equal((await f.get('/__gateway/assets/99/library.js', cookie)).status, 404);
  assert.equal(assetRequests.length, 1);
});

test('allowlisted asset URLs and redirects remain within their fixed gateway route', async (t) => {
  const assetServer = createServer((req, res) => {
    res.writeHead(302, {
      location: req.url === '/external' ? 'https://untrusted.example/library.js' : '/library-v2.js',
    });
    res.end();
  });
  const assetOrigin = await listen(assetServer);
  t.after(() => closeServer(assetServer));
  const f = await fixture(t, {
    gatewayOptions: { assetOrigins: [assetOrigin] },
    respond: async ({ url, res }) => {
      if (url.pathname !== '/api/asset-page') return false;
      res.setHeader('content-type', 'text/html');
      res.end(`<html><script src="${assetOrigin}/library.js"></script></html>`);
      return true;
    },
  });
  const { cookie } = await f.launch();
  const html = await (await f.get('/api/asset-page', cookie)).text();
  assert.ok(!html.includes(assetOrigin));
  assert.ok(html.includes(`${f.origin}/__gateway/assets/0/library.js`));
  const internal = await f.get('/__gateway/assets/0/internal', cookie);
  assert.equal(internal.status, 302);
  assert.equal(new URL(internal.headers.get('location'), f.origin).href, `${f.origin}/__gateway/assets/0/library-v2.js`);
  const external = await f.get('/__gateway/assets/0/external', cookie);
  assert.equal(external.status, 502);
  assert.equal(external.headers.get('location'), null);
});

test('asset module root-relative imports and CSS resources keep their CDN route while fetch stays document-relative', async (t) => {
  const moduleSource = [
    'import{a}from"/chunks/one.js";',
    'import"/chunks/side-effect.js";',
    'export{a}from"/chunks/re-export.js";',
    "import('/chunks/lazy.js');",
    "const resource=new URL('/fonts/icon.woff2',import.meta.url);",
    "fetch('/api/query');",
    'import{b}from"/relative.js";',
    'import{c}from"./sibling.js";',
    'import{d}from"/__gateway/assets/0/already.js";',
  ].join('');
  const cssSource = '@font-face{src:url(\'/fonts/body.woff2\')}@import"/styles/base.css";.icon{background:url(/images/icon.png)}';
  const assetServer = createServer((req, res) => {
    const isCss = req.url === '/styles/app.css';
    res.setHeader('content-type', isCss ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8');
    res.end(isCss ? cssSource : moduleSource);
  });
  const assetOrigin = await listen(assetServer);
  t.after(() => closeServer(assetServer));
  const f = await fixture(t, {
    gatewayOptions: { assetOrigins: [assetOrigin] },
    respond: async ({ url, res }) => {
      if (url.pathname !== '/api/document-module.js') return false;
      res.setHeader('content-type', 'application/javascript');
      res.end(moduleSource);
      return true;
    },
  });
  const { cookie } = await f.launch();
  const moduleResponse = await f.get('/__gateway/assets/0/entry.js', cookie);
  assert.equal(moduleResponse.status, 200);
  const moduleText = await moduleResponse.text();
  for (const fragment of [
    'from"/__gateway/assets/0/chunks/one.js"',
    'import"/__gateway/assets/0/chunks/side-effect.js"',
    'export{a}from"/__gateway/assets/0/chunks/re-export.js"',
    "import('/__gateway/assets/0/chunks/lazy.js')",
    "new URL('/__gateway/assets/0/fonts/icon.woff2',import.meta.url)",
    "fetch('/api/query')",
    'from"./sibling.js"',
    'from"/__gateway/assets/0/already.js"',
  ]) assert.ok(moduleText.includes(fragment), `missing ${fragment}`);
  assert.ok(!moduleText.includes('/__gateway/assets/0/__gateway/assets/'));
  const cssResponse = await f.get('/__gateway/assets/0/styles/app.css', cookie);
  assert.equal(cssResponse.status, 200);
  const cssText = await cssResponse.text();
  assert.ok(cssText.includes("url('/__gateway/assets/0/fonts/body.woff2')"));
  assert.ok(cssText.includes('@import"/__gateway/assets/0/styles/base.css"'));
  assert.ok(cssText.includes('url(/__gateway/assets/0/images/icon.png)'));
  const documentModule = await (await f.get('/api/document-module.js', cookie)).text();
  assert.equal(documentModule, moduleSource, 'document-origin imports must not be moved onto the asset origin');
});

function rawRequest(origin, path, headers = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    const request = httpRequest(origin, { path, method, headers }, (res) => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });
    request.on('error', reject);
    request.end();
  });
}

test('absolute-form URLs, protocol-relative targets, spoofed Host, and unsupported methods cannot proxy', async (t) => {
  const f = await fixture(t);
  const { cookie } = await f.launch();
  for (const [path, headers, method] of [
    ['http://untrusted.example/Dashboard?project_id=101', { cookie }, 'GET'],
    ['//untrusted.example/Dashboard?project_id=101', { cookie }, 'GET'],
    ['/Dashboard?project_id=101', { cookie, host: 'untrusted.example' }, 'GET'],
    ['/Dashboard?project_id=101', { cookie }, 'TRACE'],
  ]) {
    const status = await rawRequest(f.origin, path, headers, method);
    assert.ok(status >= 400 && status < 500, `${method} ${path}: ${status}`);
  }
  assert.equal(f.requests.length, 0);
});
