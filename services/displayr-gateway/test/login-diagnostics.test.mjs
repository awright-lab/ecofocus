import assert from 'node:assert/strict';
import test from 'node:test';
import { createBrowserAuthenticator, classifyLoginPage } from '../login.mjs';

const viewers = new Map([['test-viewer', { email: 'viewer@example.com', password: 'test-password-never-log' }]]);

test('browser startup errors are redacted and identify the failed stage', async t => {
  const log = t.mock.method(console, 'error', () => {});
  const authenticate = createBrowserAuthenticator({ viewers, chromium: {
    launch: async () => { throw new Error('test-password-never-log'); },
  } });
  await assert.rejects(authenticate('test-viewer'), { message: 'Displayr viewer sign-in could not be completed' });
  assert.deepEqual(log.mock.calls[0].arguments, ['[displayr-gateway] viewer sign-in failed', { stage: 'browser_start', timeout: false }]);
});

test('login navigation timeout is reported without raw exception content and closes the browser', async t => {
  const log = t.mock.method(console, 'error', () => {});
  let closed = false;
  const page = { on() {}, setDefaultTimeout() {}, async goto() {
    const error = new Error('test-password-never-log');
    error.name = 'TimeoutError';
    throw error;
  } };
  const authenticate = createBrowserAuthenticator({ viewers, chromium: { async launch() {
    return { async newContext() { return { async newPage() { return page; } }; }, async close() { closed = true; } };
  } } });
  await assert.rejects(authenticate('test-viewer'), { message: 'Displayr viewer sign-in could not be completed' });
  assert.equal(closed, true);
  assert.deepEqual(log.mock.calls[0].arguments, ['[displayr-gateway] viewer sign-in failed', { stage: 'login_page', timeout: true }]);
});

test('page diagnostics emit only flags, never page text or credentials', () => {
  const rejected = classifyLoginPage('Log in failed. Check your email address and password. viewer@example.com test-password-never-log');
  assert.deepEqual(rejected, { credentialsRejected: true, verificationRequested: false, rateLimited: false });
  assert.equal(classifyLoginPage('Verify you are human').verificationRequested, true);
  assert.equal(classifyLoginPage('Too many attempts').rateLimited, true);
  assert.deepEqual(classifyLoginPage('Email Password Log in Forgot your password?'), { credentialsRejected: false, verificationRequested: false, rateLimited: false });
});
