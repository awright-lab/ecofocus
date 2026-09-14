import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:https';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { NextRequest } from 'next/server.js';
import { chromium } from '../services/displayr-gateway/node_modules/playwright/index.mjs';
import { MAILBOX_COOKIE, MAILBOX_EMAIL, MAILBOX_SCOPE } from '../lib/portal/displayr-mailbox-crypto.ts';

test('real Connect component and routes preserve origin and cookie through Google return under no-referrer', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'mailbox-browser-'));
  let server, browser, attempt, saved, postedOrigin, origin;
  const canonical = 'https://portal.ecofocusresearch.com';
  globalThis.__mailboxBrowser = {
    admin: { authId: 'admin', sessionId: 'session' },
    config: { clientId: 'test.apps.googleusercontent.com', clientSecret: 'test', key: Buffer.alloc(32, 9) },
    google: async url => url.includes('/token') ? { access_token: 'test', refresh_token: 'refresh', scope: MAILBOX_SCOPE } : { emailAddress: MAILBOX_EMAIL },
    db: { from(table) {
      const filters = {};
      const q = { delete() { return q; }, lt() { return Promise.resolve({}); }, eq(k,v) { filters[k]=v; return q; }, gt(k,v) { filters[k]=v; return q; }, select() { return q; },
        async upsert(row) { if (table.endsWith('oauth_states')) attempt = row; else saved = row; return {}; },
        async maybeSingle() { const valid = attempt && attempt.auth_user_id === filters.auth_user_id && attempt.portal_session_id === filters.portal_session_id && attempt.state_hash === filters.state_hash && attempt.expires_at > filters.expires_at; const data = valid ? attempt : null; if (valid) attempt = null; return { data }; },
      }; return q;
    } },
  };
  try {
    for (const name of ['connect', 'callback']) await build({ entryPoints: ['app/api/portal/admin/displayr/mailbox/' + name + '/route.ts'], outfile: join(dir, name + '.mjs'), bundle: true, platform: 'node', format: 'esm', plugins: [{ name: 'external-adapters', setup(b) {
      b.onResolve({ filter: /^next\/server$/ }, () => ({ path: import.meta.resolve('next/server.js').replace('file://', ''), external: true }));
      b.onResolve({ filter: /^@\/lib\/(supabase\/server|portal\/displayr-mailbox)$/ }, args => ({ path: args.path, namespace: 'fixture' }));
      b.onLoad({ filter: /.*/, namespace: 'fixture' }, args => ({ contents: args.path.includes('supabase') ? 'export const getServiceSupabase=()=>globalThis.__mailboxBrowser.db;' : 'export const mailboxAdministrator=async()=>globalThis.__mailboxBrowser.admin; export const mailboxConfig=()=>globalThis.__mailboxBrowser.config; export const googleJSON=(...args)=>globalThis.__mailboxBrowser.google(...args);' }));
    } }] });
    const { POST } = await import(pathToFileURL(join(dir, 'connect.mjs')));
    const { GET } = await import(pathToFileURL(join(dir, 'callback.mjs')));
    // The actual endpoint must still reject cross-site, null-origin and native-form requests.
    for (const headers of [{ origin: 'https://attacker.example', 'content-type': 'application/json' }, { origin: 'null', 'content-type': 'application/json' }, { origin: canonical, 'content-type': 'application/x-www-form-urlencoded' }]) {
      assert.ok((await POST(new NextRequest(canonical + '/api/portal/admin/displayr/mailbox/connect', { method: 'POST', headers: { host: 'portal.ecofocusresearch.com', ...headers } }))).status >= 400);
      assert.equal(attempt, undefined);
    }
    const wrongHost = await POST(new NextRequest(canonical + '/api/portal/admin/displayr/mailbox/connect', { method:'POST', headers:{host:'portal.ecofocusresearch.com','x-forwarded-host':'attacker.example',origin:canonical,'content-type':'application/json'} }));
    assert.equal((await wrongHost.json()).reason, 'request-host');
    assert.equal(attempt, undefined);
    await build({ stdin: { contents: 'import React from "react"; import {createRoot} from "react-dom/client"; import {DisplayrMailboxConnect} from "./components/portal/DisplayrMailboxConnect"; createRoot(document.getElementById("root")).render(<DisplayrMailboxConnect disabled={false} connected={false}/>);', resolveDir: process.cwd(), loader: 'tsx' }, outfile: join(dir, 'client.js'), bundle: true, platform: 'browser', jsx: 'automatic' });
    const js = await readFile(join(dir, 'client.js'));
    execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', join(dir,'key.pem'), '-out', join(dir,'cert.pem'), '-days', '1', '-subj', '/CN=127.0.0.1', '-addext', 'subjectAltName=IP:127.0.0.1'], { stdio:'ignore' });
    server = createServer({ key:await readFile(join(dir,'key.pem')), cert:await readFile(join(dir,'cert.pem')) }, async (req, res) => {
      try {
        if (req.url === '/client.js') { res.setHeader('Content-Type','application/javascript'); res.end(js); return; }
        if (req.url.startsWith('/api/')) {
          const headers = new Headers(); for (const [k,v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k,v);
          if (req.method === 'POST') { postedOrigin = headers.get('origin'); if (postedOrigin === origin) headers.set('origin',canonical); }
          // Reproduce the hosting adapter: internal URL, public forwarded host.
          headers.set('x-forwarded-host', 'portal.ecofocusresearch.com');
          const request = new NextRequest('http://internal.netlify:3000' + req.url, { method:req.method, headers });
          const response = req.method === 'POST' ? await POST(request) : await GET(request);
          res.statusCode = response.status;
          response.headers.forEach((v,k) => { if (k !== 'set-cookie') res.setHeader(k,k === 'location' ? v.replace(canonical,origin) : v); });
          const cookies = response.headers.getSetCookie(); if(cookies.length) res.setHeader('Set-Cookie',cookies);
          res.end(await response.text()); return;
        }
        res.setHeader('Referrer-Policy','no-referrer'); res.setHeader('Content-Type','text/html');
        res.end('<div id="root"></div><script src="/client.js"></script>');
      } catch { res.statusCode=500; res.end('Fixture failed'); }
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    origin='https://127.0.0.1:'+server.address().port;
    browser=await chromium.launch({ headless:true, executablePath:process.env.TEST_CHROME_PATH, args:['--no-sandbox'] });
    const page=await browser.newPage({ ignoreHTTPSErrors:true });
    await page.route('https://accounts.google.com/**', route=> {
      const state=new URL(route.request().url()).searchParams.get('state');
      return route.fulfill({ contentType:'text/html', body:'<a href="'+origin+'/api/portal/admin/displayr/mailbox/callback?code=test&state='+state+'">Approve test mailbox</a>' });
    });
    await page.goto(origin+'/home');
    await page.evaluate(()=>history.pushState({},'', '/admin/displayr'));
    await Promise.all([page.waitForURL('https://accounts.google.com/**'),page.getByRole('button').click()]);
    assert.equal(postedOrigin,origin);
    const cookie=(await page.context().cookies(origin)).find(c=>c.name===MAILBOX_COOKIE);
    assert.ok(cookie); assert.equal(cookie.httpOnly,true); assert.equal(cookie.secure,true); assert.equal(cookie.sameSite,'Lax');
    await Promise.all([page.waitForURL('**/admin/displayr?result=connected'),page.getByRole('link').click()]);
    assert.equal(saved.mailbox,MAILBOX_EMAIL); assert.ok(saved.refresh_token_ciphertext); assert.equal(attempt,null);
  } finally { await browser?.close(); if(server) await new Promise(resolve=>server.close(resolve)); delete globalThis.__mailboxBrowser; await rm(dir,{recursive:true,force:true}); }
});
