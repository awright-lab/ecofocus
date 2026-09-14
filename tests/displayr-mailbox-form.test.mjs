import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { NextRequest } from 'next/server.js';
import { chromium } from '../services/displayr-gateway/node_modules/playwright/index.mjs';

test('mailbox form keeps its Origin while OAuth navigation hides its referrer', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'mailbox-form-'));
  let browser, server, external;
  try {
    await build({ entryPoints: ['middleware.ts'], outfile: join(dir, 'middleware.mjs'), bundle: true, platform: 'node', format: 'esm', define: { 'process.env.SUPABASE_URL': '"https://example.supabase.co"', 'process.env.SUPABASE_ANON_KEY': '"test"' }, plugins: [{ name: 'auth-fixture', setup(b) {
      b.onResolve({ filter: /^next\/server$/ }, () => ({ path: import.meta.resolve('next/server.js').replace('file://', ''), external: true }));
      b.onResolve({ filter: /^@supabase\/ssr$/ }, () => ({ path: 'auth', namespace: 'fixture' }));
      b.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: 'export const createServerClient = () => ({auth:{getUser:async()=>({data:{user:{id:"test"}}})}});' }));
    } }] });
    const { middleware } = await import(pathToFileURL(join(dir, 'middleware.mjs')));
    const policy = async path => (await middleware(new NextRequest('https://portal.ecofocusresearch.com' + path, { headers: { host: 'portal.ecofocusresearch.com' } }))).headers.get('referrer-policy');
    const mailboxPolicy = await policy('/admin/displayr');
    assert.equal(mailboxPolicy, 'same-origin');
    assert.equal(await policy('/home'), 'no-referrer');
    assert.equal(await policy('/api/portal/admin/displayr/mailbox/callback'), 'no-referrer');
    const listen = s => new Promise(resolve => s.listen(0, '127.0.0.1', resolve));
    let posted, outside;
    external = createServer((req, res) => { if (req.url === '/') outside = req.headers; res.end('External destination'); });
    await listen(external);
    const externalUrl = 'http://127.0.0.1:' + external.address().port;
    server = createServer((req, res) => {
      if (req.method === 'POST') { posted = req.headers; res.end('Submitted'); return; }
      res.setHeader('Referrer-Policy', req.url === '/before' ? 'no-referrer' : mailboxPolicy);
      res.setHeader('Content-Type', 'text/html');
      res.end('<form method="post" action="/collect"><button>Connect</button></form><a href="' + externalUrl + '">External</a>');
    });
    await listen(server);
    const origin = 'http://127.0.0.1:' + server.address().port;
    browser = await chromium.launch({ headless: true, executablePath: process.env.TEST_CHROME_PATH, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(origin + '/before');
    await Promise.all([page.waitForURL('**/collect'), page.getByRole('button').click()]);
    assert.equal(posted.origin, 'null');
    await page.goto(origin + '/after');
    await Promise.all([page.waitForURL('**/collect'), page.getByRole('button').click()]);
    assert.equal(posted.origin, origin);
    await page.goto(origin + '/after');
    await Promise.all([page.waitForURL(externalUrl + '/'), page.getByRole('link').click()]);
    assert.equal(outside.referer, undefined);
  } finally {
    await browser?.close();
    await Promise.all([server, external].filter(Boolean).map(s => new Promise(resolve => s.close(resolve))));
    await rm(dir, { recursive: true, force: true });
  }
});
