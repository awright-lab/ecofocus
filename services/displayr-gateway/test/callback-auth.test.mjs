import assert from 'node:assert/strict';
import test from 'node:test';
import { callbackAuthenticationFailure } from '../../../lib/portal/displayr-callback-auth.ts';

const secret = 'test-only-callback-credential-00000000';
const headers = () => new Headers({ Authorization: `Bearer ${secret}` });

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
