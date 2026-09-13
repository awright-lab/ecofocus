import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { NextRequest } from 'next/server.js';
import { MAILBOX_CALLBACK, MAILBOX_COOKIE, MAILBOX_EMAIL, MAILBOX_SCOPE, randomOAuthValue, hashOAuthValue, encryptMailboxSecret, decryptMailboxSecret } from '../lib/portal/displayr-mailbox-crypto.ts';

test('callback binds admin, cookie and database state before exchanging credentials', async () => {
  // Bundle the actual route with only its external auth/database/Google adapters replaced.
  const dir = await mkdtemp(join(tmpdir(), 'mailbox-route-'));
  const key = Buffer.alloc(32, 7);
  const state = randomOAuthValue();
  let attempt, saved, calls = 0;
  const fixture = globalThis.__mailboxTest = {
    admin: { authId: 'admin', sessionId: 'session' },
    config: { clientId: 'client', clientSecret: 'secret', key },
    email: MAILBOX_EMAIL,
    async google(url) { calls++; return url.includes('/token') ? { access_token: 'access', refresh_token: 'refresh', scope: MAILBOX_SCOPE } : { emailAddress: fixture.email }; },
    db: { from(table) {
      const filters = {};
      const query = {
        delete() { return query; }, eq(k, v) { filters[k] = v; return query; }, gt(k, v) { filters[k] = v; return query; }, select() { return query; },
        async maybeSingle() {
          if (!attempt || attempt.auth_user_id !== filters.auth_user_id || attempt.portal_session_id !== filters.portal_session_id || attempt.state_hash !== filters.state_hash || attempt.expires_at <= filters.expires_at) return { data: null };
          const data = attempt; attempt = null; return { data };
        },
        async upsert(value) { assert.equal(table, 'portal_displayr_mailbox_connection'); saved = value; return {}; },
      }; return query;
    } },
  };
  const fresh = () => { attempt = { auth_user_id: 'admin', portal_session_id: 'session', state_hash: hashOAuthValue(state), expires_at: new Date(Date.now() + 600000).toISOString(), verifier_ciphertext: encryptMailboxSecret('verifier', key, 'verifier') }; saved = undefined; calls = 0; };
  try {
    await build({ entryPoints: ['app/api/portal/admin/displayr/mailbox/callback/route.ts'], outfile: join(dir, 'callback.mjs'), bundle: true, platform: 'node', format: 'esm', plugins: [{ name: 'test-adapters', setup(b) {
      b.onResolve({ filter: /^next\/server$/ }, () => ({ path: import.meta.resolve('next/server.js').replace('file://', ''), external: true }));
      b.onResolve({ filter: /^@\/lib\/(supabase\/server|portal\/displayr-mailbox)$/ }, args => ({ path: args.path, namespace: 'fixture' }));
      b.onLoad({ filter: /.*/, namespace: 'fixture' }, args => ({ contents: args.path.includes('supabase') ? 'export const getServiceSupabase = () => globalThis.__mailboxTest.db;' : 'export const mailboxAdministrator = async () => globalThis.__mailboxTest.admin; export const mailboxConfig = () => globalThis.__mailboxTest.config; export const googleJSON = (...args) => globalThis.__mailboxTest.google(...args);' }));
    } }] });
    const { GET } = await import(pathToFileURL(join(dir, 'callback.mjs')));
    const request = (cookie = state) => new NextRequest(MAILBOX_CALLBACK + '?state=' + state + '&code=example', { headers: { cookie: MAILBOX_COOKIE + '=' + cookie } });
    const result = async req => new URL((await GET(req)).headers.get('location')).searchParams.get('result');
    fresh(); fixture.admin = null;
    assert.equal(await result(request()), 'denied'); assert.equal(calls, 0);
    fixture.admin = { authId: 'admin', sessionId: 'session' };
    assert.equal(await result(request('wrong')), 'denied'); assert.equal(calls, 0);
    fixture.admin.sessionId = 'other';
    assert.equal(await result(request()), 'denied'); assert.equal(calls, 0);
    fixture.admin.sessionId = 'session';
    assert.equal(await result(request()), 'connected'); assert.equal(calls, 2);
    assert.equal(decryptMailboxSecret(saved.refresh_token_ciphertext, key, 'refresh'), 'refresh');
    assert.equal(await result(request()), 'denied'); assert.equal(calls, 2);
    fresh(); fixture.email = 'other@example.com';
    assert.equal(await result(request()), 'wrong-mailbox'); assert.equal(saved, undefined);
    fresh(); attempt.expires_at = new Date(0).toISOString();
    assert.equal(await result(request()), 'denied'); assert.equal(calls, 0);
  } finally { delete globalThis.__mailboxTest; await rm(dir, { recursive: true, force: true }); }
});
