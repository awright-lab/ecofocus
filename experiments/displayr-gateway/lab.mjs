import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { createGateway } from './gateway.mjs';

// Local feasibility lab. Deliberately has no production route, account mutation,
// or real portal login. The identity selector below is a TEST adapter only.
const { values } = parseArgs({ options: {
  target: { type: 'string' },
  'cookie-file': { type: 'string' },
  'project-id': { type: 'string' },
  port: { type: 'string', default: '4310' },
  'gateway-port': { type: 'string', default: '4311' },
} });
const port = Number(values.port);
const gatewayPort = Number(values['gateway-port']);
if (![port, gatewayPort].every(p => Number.isInteger(p) && p > 1024 && p < 65536) || port === gatewayPort) {
  throw new Error('Choose two distinct local ports between 1025 and 65535.');
}
const portalOrigin = `http://127.0.0.1:${port}`;
const gatewayOrigin = `http://127.0.0.1:${gatewayPort}`;
const users = new Map(['alice', 'bob'].map(id => [id, { active: true }]));
const browserSessions = new Map();
const saved = new Map();
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const cookieValue = (req, name) => (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(`${name}=`))?.slice(name.length + 1);
const send = (res, code, body, type = 'text/html; charset=utf-8') => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(body);
};

// Private mock origin: allows us to prove cookie isolation and byte-preserving
// downloads without confusing a successful fixture test with Displayr parity.
const fixture = http.createServer(async (req, res) => {
  const user = cookieValue(req, 'fixture_viewer');
  if (!users.has(user)) return send(res, 401, 'Fixture requires its own viewer session.');
  const url = new URL(req.url, 'http://fixture.invalid');
  if (url.pathname === '/fixture/save' && req.method === 'POST') {
    saved.set(user, `Saved analysis for ${user}`);
    return send(res, 200, JSON.stringify({ saved: saved.get(user) }), 'application/json');
  }
  if (url.pathname === '/fixture/export') {
    res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="gateway-fixture.csv"', 'Cache-Control': 'no-store' });
    return res.end(`viewer,answer\r\n${user},42\r\n`);
  }
  if (url.pathname === '/fixture/state') return send(res, 200, JSON.stringify({ viewer: user, saved: saved.get(user) || null }), 'application/json');
  if (url.pathname !== '/Dashboard') return send(res, 404, 'Not found');
  return send(res, 200, `<!doctype html><html><head><title>Gateway test fixture</title></head><body style="font:16px system-ui;padding:28px;background:#f8fafc;color:#172c2b">
    <p>LOCAL FIXTURE · NOT DISPLAYR</p><h1>Viewer: ${escapeHtml(user)}</h1>
    <p>This private test origin checks session isolation, interaction and file delivery.</p>
    <button id="save">Save test analysis</button> <a href="/fixture/export">Download test CSV</a>
    <p id="result">${escapeHtml(saved.get(user) || 'No saved test analysis')}</p>
    <script>document.getElementById('save').onclick=async()=>{const r=await fetch('/fixture/save',{method:'POST'});document.getElementById('result').textContent=r.ok?(await r.json()).saved:'Access stopped ('+r.status+')';};</script>
  </body></html>`);
});
let target;
if (values.target) {
  target = new URL(values.target);
  if (target.origin !== 'https://app.displayr.com' || target.pathname.toLowerCase() !== '/dashboard' || target.username || target.password) {
    throw new Error('--target must be an https://app.displayr.com/Dashboard URL.');
  }
  if (!target.searchParams.has('id') && !target.searchParams.has('project_id')) throw new Error('Dashboard URL requires id or project_id.');
} else {
  await new Promise(resolve => fixture.listen(0, '127.0.0.1', resolve));
  target = new URL(`http://127.0.0.1:${fixture.address().port}/Dashboard?project_id=fixture`);
}

let initialCookies = {};
if (values['cookie-file']) {
  const info = await stat(values['cookie-file']);
  if (!info.isFile() || (info.mode & 0o077)) throw new Error('Cookie file must be a regular private file (chmod 600).');
  initialCookies = JSON.parse(await readFile(values['cookie-file'], 'utf8'));
  if (!initialCookies || typeof initialCookies !== 'object' || Array.isArray(initialCookies)) throw new Error('Cookie file must map alice/bob to individual cookie arrays.');
  for (const [id, cookies] of Object.entries(initialCookies)) {
    if (!users.has(id) || !Array.isArray(cookies)) throw new Error('Cookie file may only contain alice and bob cookie arrays.');
  }
}

const gateway = createGateway({
  upstreamOrigin: target.origin,
  gatewayOrigin,
  portalOrigin,
  // Dependencies observed in the public viewer. Each stays behind the gateway
  // and receives no application-session cookies.
  assetOrigins: values.target ? [
    'https://static-assets.prod.displayr.com',
    'https://displayrcors.displayr.com',
    'https://displayr-app-image.displayr.com',
    'https://widget-cdn.displayr.com',
  ] : [],
  authorize: async ({ userId, dashboardId }) => users.get(userId)?.active === true && dashboardId === 'test-dashboard',
  resolveDashboard: () => target.pathname + target.search,
  // A published UUID can identify the same document as a different numeric API
  // ID. Only a trusted operator may configure that alias, never the browser.
  resolveDocumentIds: () => values['project-id'] ? [values['project-id']] : [],
  getInitialCookies: async ({ userId }) => values.target ? (initialCookies[userId] || []) : [{ name: 'fixture_viewer', value: userId, path: '/' }],
});

const lab = http.createServer(async (req, res) => {
  try {
    if (req.headers.host !== new URL(portalOrigin).host) return send(res, 403, 'Unexpected host');
    const url = new URL(req.url, portalOrigin);
    const session = browserSessions.get(cookieValue(req, 'ef_gateway_lab'));
    if (req.method === 'POST') {
      if (req.headers.origin !== portalOrigin) return send(res, 403, 'Origin rejected');
      let body = '';
      for await (const chunk of req) { body += chunk; if (body.length > 1024) return send(res, 413, 'Too large'); }
      const data = new URLSearchParams(body);
      if (url.pathname === '/lab/login') {
        const userId = data.get('user');
        if (!users.has(userId)) return send(res, 400, 'Unknown test user');
        const id = randomBytes(24).toString('hex');
        browserSessions.set(id, { userId, csrf: randomBytes(24).toString('hex') });
        res.setHeader('Set-Cookie', `ef_gateway_lab=${id}; Path=/; HttpOnly; SameSite=Strict`);
      } else {
        if (!session || data.get('csrf') !== session.csrf) return send(res, 403, 'Invalid test session');
        if (url.pathname === '/lab/revoke') users.get(session.userId).active = false;
        else if (url.pathname === '/lab/restore') users.get(session.userId).active = true;
        else if (url.pathname === '/lab/logout') {
          // The lab revoke button models a production entitlement callback. No
          // real Supabase session or logout lifecycle is wired into this spike.
          users.get(session.userId).active = false;
          browserSessions.delete(cookieValue(req, 'ef_gateway_lab'));
          res.setHeader('Set-Cookie', 'ef_gateway_lab=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
        } else return send(res, 404, 'Not found');
      }
      res.writeHead(303, { Location: '/', 'Cache-Control': 'no-store' });
      return res.end();
    }
    if (url.pathname !== '/' || req.method !== 'GET') return send(res, 404, 'Not found');
    const active = session && users.get(session.userId).active;
    const ticket = active ? gateway.issueLaunch({ userId: session.userId, dashboardId: 'test-dashboard' }) : null;
    const controls = session ? `<p>Test user: <strong>${escapeHtml(session.userId)}</strong> · ${active ? 'Access enabled' : 'Access revoked'}</p>
      <form method="post" action="/lab/${active ? 'revoke' : 'restore'}"><input type="hidden" name="csrf" value="${session.csrf}"><button>${active ? 'Revoke test access' : 'Restore test access'}</button></form>
      <form method="post" action="/lab/logout"><input type="hidden" name="csrf" value="${session.csrf}"><button>End test session</button></form>` : '';
    res.setHeader('Content-Security-Policy', `default-src 'none'; style-src 'unsafe-inline'; frame-src ${gatewayOrigin}; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`);
    // Same-origin native form POSTs need an Origin for the lab's CSRF check.
    // The iframe itself suppresses its launch-ticket referrer separately.
    res.setHeader('Referrer-Policy', 'same-origin');
    return send(res, 200, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EcoFocus gateway lab</title><style>
      *{box-sizing:border-box}body{margin:0;background:#f2f5f3;color:#16372e;font:15px/1.5 system-ui}header{background:#103f32;color:white;padding:22px 32px}h1{font-size:24px;margin:0}main{padding:24px;max-width:1500px;margin:auto}.note{background:#fff4d6;border:1px solid #e5cb84;padding:12px 16px;border-radius:10px;margin-bottom:20px}.layout{display:grid;grid-template-columns:250px 1fr;gap:20px}aside,.viewer{background:white;border:1px solid #d4dfda;border-radius:12px;padding:18px}button{padding:9px 12px;border:1px solid #bccfc5;border-radius:7px;background:#f0f7f3;color:#123d2b;cursor:pointer}form{display:inline-block;margin:5px 4px 5px 0}iframe{width:100%;height:720px;border:0;background:#f8fafc}small{color:#5b7068}h2{font-size:17px}code{overflow-wrap:anywhere}@media(max-width:750px){.layout{grid-template-columns:1fr}main{padding:12px}iframe{height:600px}}
      </style></head><body><header><h1>EcoFocus · dashboard gateway lab</h1><div>Local feasibility experiment</div></header><main>
      <div class="note">${values.target ? 'Live Displayr compatibility test. Private authentication is not automated in this prototype.' : 'Offline test fixture. Passing these checks does not establish Displayr compatibility.'} This is a test identity selector, not the production portal login.</div>
      <div class="layout"><aside><h2>Test identity</h2><form method="post" action="/lab/login"><button name="user" value="alice">Use Alice</button><button name="user" value="bob">Use Bob</button></form>${controls}
      <hr><h2>Support stays alongside</h2><p>The existing EcoFocus support system is unchanged. This panel marks its place beside the dashboard.</p><small>No support tickets are sent from this lab.</small></aside>
      <section class="viewer"><h2>${values.target ? 'Displayr viewer through EcoFocus gateway' : 'Private fixture through EcoFocus gateway'}</h2>
      ${ticket ? `<iframe title="Gateway dashboard" referrerpolicy="no-referrer" src="${gatewayOrigin}/__gateway/launch?ticket=${encodeURIComponent(ticket)}" allow="fullscreen" allowfullscreen></iframe>` : '<p>Select an enabled test identity to open the dashboard.</p>'}
      </section></div></main></body></html>`);
  } catch { return send(res, 500, 'Gateway lab could not complete the request.'); }
});

await new Promise(resolve => gateway.server.listen(gatewayPort, '127.0.0.1', resolve));
await new Promise(resolve => lab.listen(port, '127.0.0.1', resolve));
console.log(`Local gateway lab: ${portalOrigin}`);
console.log(`Mode: ${values.target ? 'Displayr compatibility (authentication adapter not implemented)' : 'offline private fixture'}`);
console.log('Bound to loopback only. This lab must not be published as a customer portal.');
async function close() {
  lab.closeAllConnections();
  lab.close();
  fixture.closeAllConnections();
  fixture.close();
  await gateway.close();
}
process.on('SIGINT', () => void close());
process.on('SIGTERM', () => void close());
