import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { MAILBOX_EMAIL, MAILBOX_SCOPE, MAILBOX_CALLBACK, mailboxKey, encryptMailboxSecret, decryptMailboxSecret, mailboxAuthorizationUrl, hashOAuthValue, randomOAuthValue, validateMailboxGrant } from '../lib/portal/displayr-mailbox-crypto.ts';

test('stored credentials authenticate ciphertext, key and purpose', () => {
  const key = randomBytes(32), secret = 'test-refresh-token';
  const encrypted = encryptMailboxSecret(secret, key, 'refresh');
  assert.equal(decryptMailboxSecret(encrypted, key, 'refresh'), secret);
  assert.notEqual(encryptMailboxSecret(secret, key, 'refresh'), encrypted);
  assert.ok(!encrypted.includes(secret));
  assert.throws(() => decryptMailboxSecret(encrypted, randomBytes(32), 'refresh'));
  assert.throws(() => decryptMailboxSecret(encrypted, key, 'verifier'));
  const parts = encrypted.split('.');
  const data = Buffer.from(parts[3], 'base64url'); data[0] ^= 1;
  parts[3] = data.toString('base64url');
  assert.throws(() => decryptMailboxSecret(parts.join('.'), key, 'refresh'));
  assert.throws(() => mailboxKey('short'));
  assert.deepEqual(mailboxKey(key.toString('hex')), key);
});

test('authorization is pinned to mailbox, callback and read-only scope with PKCE', () => {
  const state = randomOAuthValue(), verifier = randomOAuthValue();
  assert.match(state, /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(state, verifier);
  const url = mailboxAuthorizationUrl('client.apps.googleusercontent.com', state, verifier);
  assert.equal(url.origin, 'https://accounts.google.com');
  for (const [name, expected] of Object.entries({ redirect_uri: MAILBOX_CALLBACK, scope: MAILBOX_SCOPE, login_hint: MAILBOX_EMAIL, state, access_type: 'offline', code_challenge: hashOAuthValue(verifier), code_challenge_method: 'S256' })) assert.equal(url.searchParams.get(name), expected);
  assert.ok(!url.href.includes(verifier));
});

test('grant validation rejects other mailboxes, missing refresh tokens and missing scope', () => {
  const tokens = { access_token: 'access', refresh_token: 'refresh', scope: MAILBOX_SCOPE };
  assert.doesNotThrow(() => validateMailboxGrant(tokens, { emailAddress: MAILBOX_EMAIL }));
  assert.throws(() => validateMailboxGrant(tokens, { emailAddress: 'another@example.com' }));
  assert.throws(() => validateMailboxGrant({ ...tokens, refresh_token: undefined }, { emailAddress: MAILBOX_EMAIL }));
  assert.throws(() => validateMailboxGrant({ ...tokens, scope: 'openid' }, { emailAddress: MAILBOX_EMAIL }));
});
