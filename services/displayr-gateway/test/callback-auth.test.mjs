import assert from 'node:assert/strict';
import test from 'node:test';
import { callbackAuthenticationFailure } from '../../../lib/portal/displayr-callback-auth.ts';

const secret = 'test-only-callback-credential-00000000';
const headers = () => new Headers({ Authorization: `Bearer ${secret}` });

test('dedicated callback header authenticates when Authorization is removed in transit', () => {
  const forwarded = new Headers({ 'X-Ecofocus-Gateway-Authorization': `Bearer ${secret}` });
  assert.equal(forwarded.has('Authorization'), false);
  assert.equal(callbackAuthenticationFailure(forwarded, secret), null);
  forwarded.set('Origin', 'https://example.com');
  assert.equal(callbackAuthenticationFailure(forwarded, secret), 'CALLBACK_ORIGIN_PRESENT');
});

test('an invalid dedicated credential cannot fall back to a valid legacy credential', () => {
  const both = headers();
  both.set('X-Ecofocus-Gateway-Authorization', 'Bearer invalid');
  assert.equal(callbackAuthenticationFailure(both, secret), 'CALLBACK_CREDENTIAL_MISMATCH');
  both.set('X-Ecofocus-Gateway-Authorization', '');
  assert.equal(callbackAuthenticationFailure(both, secret), 'CALLBACK_AUTHORIZATION_MISSING');
});

test('callback accepts only an exact valid server credential', () => {
  assert.equal(callbackAuthenticationFailure(headers(), secret), null);
  assert.equal(callbackAuthenticationFailure(headers(), secret + 'x'), 'CALLBACK_CREDENTIAL_MISMATCH');
  assert.equal(callbackAuthenticationFailure(headers(), secret.replace('00000000', '11111111')), 'CALLBACK_CREDENTIAL_MISMATCH');
  assert.equal(callbackAuthenticationFailure(headers(), `"${secret}"`), 'CALLBACK_CREDENTIAL_MISMATCH');
});

test('callback separates runtime configuration, missing headers, and browser origin rejection', () => {
  assert.equal(callbackAuthenticationFailure(headers(), undefined), 'CALLBACK_SECRET_MISSING');
  assert.equal(callbackAuthenticationFailure(headers(), ''), 'CALLBACK_SECRET_MISSING');
  assert.equal(callbackAuthenticationFailure(headers(), 'short'), 'CALLBACK_SECRET_TOO_SHORT');
  assert.equal(callbackAuthenticationFailure(new Headers(), secret), 'CALLBACK_AUTHORIZATION_MISSING');
  const browserHeaders = headers();
  browserHeaders.set('Origin', 'https://example.com');
  assert.equal(callbackAuthenticationFailure(browserHeaders, secret), 'CALLBACK_ORIGIN_PRESENT');
});
