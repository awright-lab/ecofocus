/**
 * Local feasibility spike, NOT a production Displayr authentication integration.
 * Cookies supplied here must belong to separately authorized test viewers.
 * This cannot establish SAML sessions or prove authorization of document IDs
 * inside opaque application API payloads. Keep it isolated from production.
 */
import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const COOKIE_NAME = 'ef_gateway_session';
const MAX_SESSIONS = 1000;
const MAX_BODY_BYTES = 2 * 1024 * 1024;
// The public Displayr viewer currently ships a 17,337,844-byte JS module.
const MAX_TEXT_BYTES = 24 * 1024 * 1024;
const MAX_BINARY_BYTES = 128 * 1024 * 1024;
const TIMEOUT_MS = 30_000;
const AUTH_PATH = /(?:^|\/)(?:log-?in|log-?out|sign-?in|sign-?out|myaccount|account|accounts|register|password|resetpassword|admin|edit)(?:\/|$|\.)/i;
const DOCUMENT_KEYS = new Set(['documentid', 'document_id', 'dashboardid', 'dashboard_id', 'projectid', 'project_id']);
const HOP_HEADERS = new Set(['connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailer', 'transfer-encoding', 'upgrade']);
const TEXT_TYPES = /^(?:text\/(?:html|css|javascript|plain)|application\/(?:javascript|x-javascript|json|manifest\+json|xml)|image\/svg\+xml)(?:;|$)/i;

function originOnly(value, label) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new TypeError(`${label} must be an http(s) origin`);
  }
  return url;
}

function opaque() { return randomBytes(32).toString('base64url'); }

function normalizePath(path) {
  try {
    let decoded = path;
    for (let index = 0; index < 3; index++) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
    return decoded.replaceAll('\\', '/');
  } catch { return null; }
}

function parseRequestCookies(header) {
  const result = new Map();
  for (const item of String(header || '').split(';')) {
    const equal = item.indexOf('=');
    if (equal > 0) result.set(item.slice(0, equal).trim(), item.slice(equal + 1).trim());
  }
  return result;
}

function defaultCookiePath(path) {
  const end = path.lastIndexOf('/');
  return end <= 0 ? '/' : path.slice(0, end);
}

function cookieMatches(cookie, url, time) {
  if (cookie.expires !== undefined && cookie.expires <= time) return false;
  if (cookie.secure && url.protocol !== 'https:') return false;
  if (cookie.hostOnly ? url.hostname !== cookie.domain : !(url.hostname === cookie.domain || url.hostname.endsWith(`.${cookie.domain}`))) return false;
  return url.pathname === cookie.path || (url.pathname.startsWith(cookie.path) && (cookie.path.endsWith('/') || url.pathname[cookie.path.length] === '/'));
}

function storeCookie(jar, candidate, upstream) {
  if (!candidate || !/^[!#$%&'*+.^_`|~\w-]+$/.test(candidate.name) || typeof candidate.value !== 'string' || /[\x00-\x20\x7f;,]/.test(candidate.value)) return;
  const domain = String(candidate.domain || upstream.hostname).replace(/^\./, '').toLowerCase();
  // Parent-domain cookies (e.g. .displayr.com) are needed by some sessions.
  // The jar is used only for this exact configured upstream; asset requests
  // never consult it and external redirects are blocked.
  if (domain !== upstream.hostname && !(domain.includes('.') && upstream.hostname.endsWith(`.${domain}`))) return;
  const path = typeof candidate.path === 'string' && candidate.path.startsWith('/') ? candidate.path : '/';
  const cookie = { name: candidate.name, value: candidate.value, domain, path, secure: !!candidate.secure, hostOnly: candidate.hostOnly ?? !candidate.domain };
  if (candidate.expires !== undefined && candidate.expires !== null) {
    const expires = candidate.expires instanceof Date ? candidate.expires.getTime() : typeof candidate.expires === 'number' ? candidate.expires : Date.parse(candidate.expires);
    if (Number.isFinite(expires)) cookie.expires = expires;
  }
  const key = `${cookie.name}\n${cookie.domain}\n${cookie.path}`;
  if (jar.size < 200 || jar.has(key)) jar.set(key, cookie);
}

function receiveCookie(jar, header, url, time) {
  const [pair, ...attributes] = header.split(';');
  const equal = pair.indexOf('=');
  if (equal < 1) return;
  const cookie = { name: pair.slice(0, equal).trim(), value: pair.slice(equal + 1).trim(), path: defaultCookiePath(url.pathname), hostOnly: true };
  let maxAge;
  for (const item of attributes) {
    const separator = item.indexOf('=');
    const name = (separator < 0 ? item : item.slice(0, separator)).trim().toLowerCase();
    const value = separator < 0 ? '' : item.slice(separator + 1).trim();
    if (name === 'domain') { cookie.domain = value; cookie.hostOnly = false; }
    if (name === 'path' && value.startsWith('/')) cookie.path = value;
    if (name === 'secure') cookie.secure = true;
    if (name === 'expires') cookie.expires = value;
    if (name === 'max-age' && /^-?\d+$/.test(value)) maxAge = Number(value);
  }
  if (maxAge !== undefined) cookie.expires = time + maxAge * 1000;
  storeCookie(jar, cookie, url);
}

function cookieHeader(jar, url, time) {
  const cookies = [];
  for (const [key, cookie] of jar) {
    if (cookie.expires !== undefined && cookie.expires <= time) { jar.delete(key); continue; }
    if (cookieMatches(cookie, url, time)) cookies.push(cookie);
  }
  return cookies.sort((left, right) => right.path.length - left.path.length).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
}

async function readLimited(stream, limit) {
  const chunks = [];
  let length = 0;
  for await (const chunk of stream) {
    length += chunk.length;
    if (length > limit) throw Object.assign(new Error('Body exceeds prototype size limit'), { status: 413 });
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function rewriteText(text, upstream, gateway, assetOrigins = []) {
  // Literal rewriting is intentionally narrow. Cross-origin dependencies and
  // generated URLs are left to fail under CSP and must be investigated.
  for (const [index, asset] of assetOrigins.entries()) {
    const destination = `${gateway.origin}/__gateway/assets/${index}`;
    for (const [from, to] of [
      [asset.origin, destination],
      [asset.origin.replaceAll('/', '\\/'), destination.replaceAll('/', '\\/')],
      [encodeURIComponent(asset.origin), encodeURIComponent(destination)],
      [`//${asset.host}`, `//${gateway.host}/__gateway/assets/${index}`],
      [`\\/\\/${asset.host}`, `\\/\\/${gateway.host}\\/__gateway\\/assets\\/${index}`],
    ]) text = text.split(from).join(to);
  }
  const variants = [
    [upstream.origin, gateway.origin],
    [upstream.origin.replaceAll('/', '\\/'), gateway.origin.replaceAll('/', '\\/')],
    [encodeURIComponent(upstream.origin), encodeURIComponent(gateway.origin)],
    [`//${upstream.host}`, `//${gateway.host}`],
    [`\\/\\/${upstream.host}`, `\\/\\/${gateway.host}`],
  ];
  for (const [from, to] of variants) text = text.split(from).join(to);
  return text;
}

function rewriteAssetReferences(text, contentType, index) {
  // Module specifiers resolve against the module's CDN origin; ordinary fetch
  // calls resolve against the document and must not be changed. Rehome only
  // explicit root-relative module imports and CSS resource references.
  const rehome = path => path.startsWith('/__gateway/assets/') ? path : `/__gateway/assets/${index}${path}`;
  if (/^(?:text|application)\/(?:javascript|x-javascript)(?:;|$)/i.test(contentType)) {
    text = text.replace(/(\b(?:from|import)\s*["'])(\/(?!\/)[^"'\r\n]*)(["'])/g, (_, prefix, path, suffix) => prefix + rehome(path) + suffix);
    text = text.replace(/(\bimport\s*\(\s*["'])(\/(?!\/)[^"'\r\n]*)(["'])/g, (_, prefix, path, suffix) => prefix + rehome(path) + suffix);
    text = text.replace(/(\bnew\s+URL\s*\(\s*["'])(\/(?!\/)[^"'\r\n]*)(["']\s*,\s*import\.meta\.url\s*\))/g, (_, prefix, path, suffix) => prefix + rehome(path) + suffix);
  }
  if (/^text\/css(?:;|$)/i.test(contentType)) {
    text = text.replace(/(\burl\(\s*["']?)(\/(?!\/)[^"'\s)]*)(["']?\s*\))/g, (_, prefix, path, suffix) => prefix + rehome(path) + suffix);
    text = text.replace(/(@import\s*["'])(\/(?!\/)[^"'\r\n]*)(["'])/g, (_, prefix, path, suffix) => prefix + rehome(path) + suffix);
  }
  return text;
}

function contentPolicy(upstreamPolicy, portalOrigin, upstream, gateway, assets) {
  // Browsers enforce every comma-separated policy independently. Preserve the
  // upstream policy (including nonces, strict-dynamic, and frame restrictions),
  // then intersect it with our own origin restriction. Thus a nonce cannot
  // authorize loading a third-party script past the gateway's source list.
  const inherited = String(upstreamPolicy || '').split(',').map(policy =>
    policy.split(';').filter(part => !/^\s*(?:report-uri|report-to)(?:\s|$)/i.test(part)).join(';')
  ).join(',');
  const constraint = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${upstreamPolicy ? " 'unsafe-eval' 'wasm-unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "connect-src 'self'", "frame-src 'self'", "child-src 'self'",
    "form-action 'self'", "base-uri 'self'", "manifest-src 'self'",
    "worker-src 'none'", "object-src 'none'", "img-src 'self' data: blob:",
    "font-src 'self' data:", "media-src 'self' blob:",
    `frame-ancestors 'self' ${portalOrigin}`,
  ].join('; ');
  return inherited.trim() ? `${rewriteText(inherited, upstream, gateway, assets)}, ${constraint}` : constraint;
}

/** Create an isolated HTTP server. Binding and trusted launch issuance are the caller's responsibility. */
export function createGateway({ upstreamOrigin, gatewayOrigin, portalOrigin, assetOrigins = [], authorize, resolveDashboard, resolveDocumentIds = () => [], getInitialCookies = async () => [], sessionTtlMs = 15 * 60_000, ticketTtlMs = 30_000, now = Date.now }) {
  const upstream = originOnly(upstreamOrigin, 'upstreamOrigin');
  const configuredGateway = originOnly(gatewayOrigin, 'gatewayOrigin');
  const portal = originOnly(portalOrigin, 'portalOrigin');
  const assets = assetOrigins.map(value => originOnly(value, 'assetOrigin'));
  if (typeof authorize !== 'function' || typeof resolveDashboard !== 'function') throw new TypeError('authorize and resolveDashboard callbacks are required');
  if (typeof resolveDocumentIds !== 'function') throw new TypeError('resolveDocumentIds must be a server-side callback');
  if (!(sessionTtlMs > 0) || !(ticketTtlMs > 0)) throw new TypeError('Session and ticket TTLs must be positive');
  const tickets = new Map();
  const sessions = new Map();
  const counts = { launches: 0, requests: 0, denied: 0, upstreamRequests: 0, upstreamErrors: 0, blockedRedirects: 0, websocketAttempts: 0 };
  const paths = new Map();
  const pending = new Set();

  function gatewayUrl() {
    const url = new URL(configuredGateway);
    if (url.port === '0') {
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('Gateway must be listening');
      url.port = String(address.port);
    }
    return url;
  }

  function sweep() {
    const time = now();
    for (const [key, ticket] of tickets) if (ticket.expires <= time) tickets.delete(key);
    for (const [key, session] of sessions) if (session.expires <= time) { session.jar.clear(); sessions.delete(key); }
  }

  function send(res, status, message) {
    if (res.headersSent) { res.destroy(); return; }
    if (status === 403) {
      const reason = new Map([
        ['Gateway origin required', 'ORIGIN_REQUIRED'],
        ['Dashboard access denied', 'LAUNCH_AUTHORIZATION_DENIED'],
        ['Dashboard access revoked', 'SESSION_AUTHORIZATION_DENIED'],
        ['Dashboard target is not permitted', 'TARGET_DENIED'],
        ['Dashboard request body is not permitted', 'BODY_DENIED'],
        ['Upstream dashboard redirect is not permitted', 'REDIRECT_DENIED'],
        ['Service workers are disabled for this prototype', 'SERVICE_WORKER_DENIED'],
      ]).get(message) || 'REQUEST_DENIED';
      res.setHeader('x-ecofocus-gateway-error', reason);
      console.error('[displayr-gateway] request denied', { reason });
    }
    res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer' });
    res.end(message);
  }

  async function allowed(session) {
    if (session.revoked) return false;
    try { return (await authorize({ userId: session.userId, dashboardId: session.dashboardId })) === true; }
    catch { return false; }
  }

  function dashboardUrl(dashboardId) {
    const path = resolveDashboard({ dashboardId });
    if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) throw new Error('Dashboard resolver must return an absolute path');
    const url = new URL(path, upstream);
    if (url.origin !== upstream.origin || url.username || url.password || url.hash || AUTH_PATH.test(normalizePath(url.pathname) || '')) throw new Error('Invalid dashboard mapping');
    return url;
  }

  function permittedTarget(target, session) {
    const normalized = normalizePath(target.pathname);
    if (!normalized || normalized.includes('\0') || normalized.split('/').includes('..')) return 400;
    if (AUTH_PATH.test(normalized)) return 409;
    const selected = new URL(session.path, upstream);
    // A Dashboard navigation must retain the server-selected dashboard ID.
    // Arbitrary API bodies are not parsed: this is not document-level security.
    if (/^\/dashboard\/?$/i.test(normalized) || normalized === normalizePath(selected.pathname)) {
      for (const key of ['id', ...DOCUMENT_KEYS]) {
        const expected = [...selected.searchParams].filter(([name]) => name.toLowerCase() === key).map(([, value]) => value);
        const actual = [...target.searchParams].filter(([name]) => name.toLowerCase() === key).map(([, value]) => value);
        if ((expected.length || actual.length) && (expected.length !== 1 || actual.length !== 1 || expected[0] !== actual[0])) return 403;
      }
    }
    for (const [key, value] of target.searchParams) {
      if (DOCUMENT_KEYS.has(key.toLowerCase()) && !session.documentIds.has(value)) return 403;
      if (/^(?:url|target|origin|upstream|host|redirect|redirect_uri|returnurl)$/i.test(key) && /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) {
        try { if (new URL(value, upstream).origin !== upstream.origin) return 403; } catch { return 400; }
      }
    }
    return 0;
  }

  function permittedBody(body, contentType, session) {
    if (!body?.length) return true;
    // Only known document selectors can be screened. This is not a substitute
    // for verifying every Displayr API, especially multipart or opaque bodies.
    let entries = [];
    if (/^application\/(?:[\w.+-]*\+)?json(?:;|$)/i.test(contentType || '')) {
      let data;
      try { data = JSON.parse(body.toString('utf8')); } catch { return false; }
      const visit = (value, depth = 0) => {
        if (depth > 30) throw new Error('JSON nesting exceeds prototype limit');
        if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) {
          if (DOCUMENT_KEYS.has(key.toLowerCase())) entries.push([key, String(item)]);
          if (item && typeof item === 'object') visit(item, depth + 1);
        }
      };
      try { visit(data); } catch { return false; }
    } else if (/^application\/x-www-form-urlencoded(?:;|$)/i.test(contentType || '')) {
      entries = [...new URLSearchParams(body.toString('utf8'))];
    }
    return entries.every(([key, value]) => !DOCUMENT_KEYS.has(key.toLowerCase()) || session.documentIds.has(value));
  }

  const server = http.createServer(async (req, res) => {
    counts.requests++;
    sweep();
    let controller;
    let timeout;
    let stage = 'request_validation';
    try {
      const gateway = gatewayUrl();
      if (req.headers.host !== gateway.host) { counts.denied++; send(res, 400, 'Invalid gateway host'); return; }
      if (!req.url?.startsWith('/') || req.url.startsWith('//')) { send(res, 400, 'Origin-form request target required'); return; }
      const requestUrl = new URL(req.url || '/', gateway);
      if (requestUrl.origin !== gateway.origin || requestUrl.username || requestUrl.password) { send(res, 400, 'Invalid request target'); return; }
      if (!['GET', 'HEAD', 'POST'].includes(req.method)) { res.setHeader('allow', 'GET, HEAD, POST'); send(res, 405, 'Unsupported prototype method'); return; }
      if (req.method === 'POST' && req.headers.origin !== gateway.origin) { counts.denied++; send(res, 403, 'Gateway origin required'); return; }
      if (requestUrl.pathname === '/__gateway/launch') {
        if (req.method !== 'GET') { send(res, 405, 'Launch requires GET'); return; }
        const token = requestUrl.searchParams.get('ticket');
        const ticket = tickets.get(token);
        tickets.delete(token); // Burn before any async work: concurrent replay fails.
        if (!ticket || ticket.expires <= now()) { counts.denied++; send(res, 401, 'Launch ticket is invalid or expired'); return; }
        if (!(await allowed(ticket))) { counts.denied++; send(res, 403, 'Dashboard access denied'); return; }
        const selected = dashboardUrl(ticket.dashboardId);
        // A published UUID and internal numeric project ID can identify the
        // same document. Only trusted server configuration may supply aliases;
        // never infer permissions from browser requests or fetched HTML.
        const aliases = await resolveDocumentIds({ dashboardId: ticket.dashboardId });
        if (!Array.isArray(aliases) || aliases.length > 100 || aliases.some(id => !(typeof id === 'string' && id.length > 0 && id.length <= 200) && !(typeof id === 'number' && Number.isSafeInteger(id)))) throw new Error('Document aliases must be a bounded array of IDs');
        const documentIds = new Set([
          ...[...selected.searchParams].filter(([key]) => key.toLowerCase() === 'id' || DOCUMENT_KEYS.has(key.toLowerCase())).map(([, value]) => value),
          ...aliases.map(String),
        ]);
        const jar = new Map();
        stage = 'viewer_session';
        const initial = await getInitialCookies({ userId: ticket.userId, dashboardId: ticket.dashboardId });
        stage = 'session_setup';
        if (!Array.isArray(initial)) throw new Error('Initial cookies must be an array');
        for (const cookie of initial) storeCookie(jar, cookie, upstream);
        if (!(await allowed(ticket))) { counts.denied++; send(res, 403, 'Dashboard access denied'); return; }
        if (sessions.size >= MAX_SESSIONS) { send(res, 503, 'Prototype session capacity reached'); return; }
        const sessionToken = opaque();
        sessions.set(sessionToken, { userId: ticket.userId, dashboardId: ticket.dashboardId, path: selected.pathname + selected.search, expires: now() + sessionTtlMs, documentIds, jar });
        counts.launches++;
        // The portal embeds the HTTPS gateway on a different site. Partition
        // its cookie by the top-level site so it works inside that iframe
        // without sharing the browser session with other embedding sites.
        const cookiePolicy = gateway.protocol === 'https:' ? 'SameSite=None; Secure; Partitioned' : 'SameSite=Lax';
        res.writeHead(303, { location: selected.pathname + selected.search, 'set-cookie': `${COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; ${cookiePolicy}; Max-Age=${Math.floor(sessionTtlMs / 1000)}`, 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' });
        res.end();
        return;
      }
      const token = parseRequestCookies(req.headers.cookie).get(COOKIE_NAME);
      const session = sessions.get(token);
      if (!session || session.expires <= now()) { counts.denied++; send(res, 401, 'EcoFocus gateway session required'); return; }
      if (!(await allowed(session))) {
        counts.denied++;
        session.jar.clear();
        session.revoked = true;
        send(res, 403, 'Dashboard access revoked');
        return;
      }
      if (requestUrl.pathname === '/__gateway/status') {
        res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
        res.end(JSON.stringify({ prototype: true, counts, paths: [...paths].map(([path, count]) => ({ path, count })) }));
        return;
      }
      const assetMatch = /^\/__gateway\/assets\/(\d+)(\/.*)$/.exec(requestUrl.pathname);
      const assetOrigin = assetMatch ? assets[Number(assetMatch[1])] : undefined;
      if (requestUrl.pathname.startsWith('/__gateway/') && !assetOrigin) { send(res, 404, 'Unknown gateway endpoint'); return; }
      if (assetOrigin && req.method !== 'GET' && req.method !== 'HEAD') { send(res, 405, 'Asset requests require GET or HEAD'); return; }
      // Service workers must never gain persistent control over this origin.
      if (req.headers['service-worker'] === 'script' || req.headers['sec-fetch-dest'] === 'serviceworker') { send(res, 403, 'Service workers are disabled for this prototype'); return; }
      const target = assetOrigin ? new URL(assetMatch[2] + requestUrl.search, assetOrigin) : new URL(requestUrl.pathname + requestUrl.search, upstream);
      if (target.origin !== (assetOrigin || upstream).origin) { send(res, 400, 'Invalid upstream target'); return; }
      const blocked = assetOrigin ? 0 : permittedTarget(target, session);
      if (blocked) { counts.denied++; send(res, blocked, blocked === 409 ? 'Displayr authentication or account navigation is required; this prototype cannot establish that session' : 'Dashboard target is not permitted'); return; }
      if (paths.size < 100 || paths.has(target.pathname)) paths.set(target.pathname, (paths.get(target.pathname) || 0) + 1);
      const headers = new Headers();
      for (const name of ['accept', 'accept-language', 'content-type', 'range', 'if-range']) {
        if (typeof req.headers[name] === 'string') headers.set(name, req.headers[name]);
      }
      // Preserve the viewer's actual Ajax marker without synthesizing requests
      // or forwarding arbitrary custom headers. POST Origin checks still apply.
      if (!assetOrigin && req.headers['x-requested-with'] === 'XMLHttpRequest') headers.set('x-requested-with', 'XMLHttpRequest');
      headers.set('accept-encoding', 'identity');
      headers.set('user-agent', 'EcoFocus-Displayr-Gateway-Feasibility/0.1');
      const cookies = assetOrigin ? '' : cookieHeader(session.jar, target, now());
      if (cookies) headers.set('cookie', cookies);
      // Forward the real browser origin on mutation. Do not pretend this request
      // originated at Displayr or bypass its CSRF checks. Rejection is a finding.
      if (req.method === 'POST') headers.set('origin', gateway.origin);
      controller = new AbortController();
      pending.add(controller);
      timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
      timeout.unref();
      res.on('close', () => { if (!res.writableEnded) controller.abort(); });
      const body = req.method === 'POST' ? await readLimited(req, MAX_BODY_BYTES) : undefined;
      if (!permittedBody(body, req.headers['content-type'], session)) { counts.denied++; send(res, 403, 'Dashboard request body is not permitted'); return; }
      counts.upstreamRequests++;
      stage = 'upstream_request';
      const response = await fetch(target, { method: req.method, headers, body, redirect: 'manual', signal: controller.signal });
      stage = 'upstream_response';
      if (!assetOrigin) for (const cookie of response.headers.getSetCookie()) receiveCookie(session.jar, cookie, target, now());
      if (!(await allowed(session)) || session.expires <= now()) {
        await response.body?.cancel();
        counts.denied++;
        session.jar.clear();
        session.revoked = true;
        send(res, 403, 'Dashboard access revoked');
        return;
      }
      if (response.status === 403) {
        res.setHeader('x-ecofocus-gateway-error', 'UPSTREAM_DENIED');
        console.error('[displayr-gateway] upstream request denied', { status: 403 });
      }
      const location = response.headers.get('location');
      if (location && response.status >= 300 && response.status < 400) {
        const destination = new URL(location, target);
        await response.body?.cancel();
        if (destination.origin !== (assetOrigin || upstream).origin || destination.username || destination.password) { counts.blockedRedirects++; send(res, 502, 'Displayr redirected outside the configured origin; authentication or another dependency needs investigation'); return; }
        const denied = assetOrigin ? 0 : permittedTarget(destination, session);
        if (denied) { counts.blockedRedirects++; send(res, denied, denied === 409 ? 'Displayr authentication is required; the gateway cannot silently establish it' : 'Upstream dashboard redirect is not permitted'); return; }
        res.writeHead(response.status, { location: `${assetOrigin ? `/__gateway/assets/${assetMatch[1]}` : ''}${destination.pathname}${destination.search}${destination.hash}`, 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' });
        res.end();
        return;
      }
      const responseHeaders = {};
      // Allow a small explicit set; no upstream cookies, CORS grants, refresh,
      // reporting endpoints, service-worker scope, or hop-by-hop headers escape.
      for (const name of ['content-type', 'content-disposition', 'content-range', 'accept-ranges', 'x-frame-options', 'cross-origin-resource-policy', 'cross-origin-opener-policy', 'cross-origin-embedder-policy']) {
        const value = response.headers.get(name);
        if (value && !HOP_HEADERS.has(name)) responseHeaders[name] = value;
      }
      responseHeaders['cache-control'] = 'no-store, private';
      responseHeaders['pragma'] = 'no-cache';
      // Native export forms need a non-opaque Origin for our CSRF check.
      // Cross-origin navigation still receives no referrer with this policy.
      responseHeaders['referrer-policy'] = 'same-origin';
      responseHeaders['x-content-type-options'] = 'nosniff';
      responseHeaders['content-security-policy'] = contentPolicy(response.headers.get('content-security-policy'), portal.origin, upstream, gateway, assets);
      if (req.method === 'HEAD' || [204, 205, 304].includes(response.status)) {
        await response.body?.cancel();
        res.writeHead(response.status, responseHeaders);
        res.end();
        return;
      }
      const type = response.headers.get('content-type') || '';
      // Export files are data, including JSON/XML/plain-text downloads. Never
      // decode or rewrite their bytes just because their MIME type is textual.
      const attachment = /^\s*attachment(?:\s*;|\s*$)/i.test(response.headers.get('content-disposition') || '');
      if (TEXT_TYPES.test(type) && !attachment) {
        const bytes = response.body ? await readLimited(Readable.fromWeb(response.body), MAX_TEXT_BYTES) : Buffer.alloc(0);
        // Text is buffered before delivery; check again so access revoked while
        // fetching a large bundle/page does not release that buffered response.
        if (!(await allowed(session)) || session.expires <= now()) {
          counts.denied++;
          session.jar.clear();
          session.revoked = true;
          send(res, 403, 'Dashboard access revoked');
          return;
        }
        const original = bytes.toString('utf8');
        if (/^text\/html/i.test(type) && /<input\b[^>]*\btype\s*=\s*(?:["']password["']|password(?:\s|>))/i.test(original)) { send(res, 409, 'Displayr returned a login form; this prototype cannot silently establish that session'); return; }
        let text = rewriteText(original, upstream, gateway, assets);
        if (assetOrigin) text = rewriteAssetReferences(text, type, assetMatch[1]);
        // Displayr's native download attribute leaves Chromium's partitioned
        // iframe session behind. Navigate this specific export anchor in-place;
        // upstream Content-Disposition still supplies the filename and download.
        // Keep this pinned to the observed viewer handler, not arbitrary links.
        if (/javascript/i.test(type) && text.includes('/Dashboard/DownloadExport/{0}/{1}')) {
          text = text.replace('p.href=a,p.download=c,document.body.appendChild(p)',
            'p.href=a,p.target="_self",document.body.appendChild(p)');
        }
        res.writeHead(response.status, responseHeaders);
        res.end(text);
      } else {
        const declaredSize = Number(response.headers.get('content-length'));
        if (declaredSize > MAX_BINARY_BYTES) { await response.body?.cancel(); send(res, 413, 'Download exceeds prototype size limit'); return; }
        res.writeHead(response.status, responseHeaders);
        if (!response.body) { res.end(); return; }
        let bytes = 0;
        const limit = new Transform({ transform(chunk, encoding, callback) {
          bytes += chunk.length;
          if (bytes > MAX_BINARY_BYTES) callback(new Error('Download exceeds prototype size limit'));
          else callback(null, chunk);
        } });
        await pipeline(Readable.fromWeb(response.body), limit, res);
      }
    } catch (error) {
      counts.upstreamErrors++;
      console.error('[displayr-gateway] request failed', { stage });
      send(res, error.status === 413 ? 413 : 502, error.status === 413 ? 'Request or response exceeds prototype size limit' : `Gateway request failed (${stage}). Please retry or contact support.`);
    } finally {
      clearTimeout(timeout);
      if (controller) { pending.delete(controller); controller.abort(); }
    }
  });
  server.requestTimeout = TIMEOUT_MS;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
  server.on('upgrade', (_req, socket) => {
    counts.websocketAttempts++;
    socket.end('HTTP/1.1 501 Not Implemented\r\nConnection: close\r\nContent-Length: 42\r\n\r\nWebSocket forwarding is not implemented yet');
  });

  return {
    server,
    issueLaunch({ userId, dashboardId }) {
      if (typeof userId !== 'string' || !userId || typeof dashboardId !== 'string' || !dashboardId) throw new TypeError('userId and dashboardId are required');
      sweep();
      if (tickets.size >= MAX_SESSIONS) throw new Error('Prototype ticket capacity reached');
      dashboardUrl(dashboardId);
      const token = opaque();
      tickets.set(token, { userId, dashboardId, expires: now() + ticketTtlMs });
      return token;
    },
    async close() {
      for (const controller of pending) controller.abort();
      for (const session of sessions.values()) session.jar.clear();
      sessions.clear();
      tickets.clear();
      if (!server.listening) return;
      await new Promise((resolve, reject) => {
        server.close(error => error ? reject(error) : resolve());
        server.closeAllConnections();
      });
    },
  };
}
