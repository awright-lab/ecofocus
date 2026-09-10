import assert from 'node:assert/strict';
import test from 'node:test';
import { createSessionBroker } from '../session-broker.mjs';

test('concurrent requests share authentication but get independent cookie copies', async () => {
  let calls = 0;
  const broker = createSessionBroker({ authenticate: async id => { calls++; return [{ name: 'viewer', value: id }]; } });
  const [a, b] = await Promise.all([broker.getCookies('alice'), broker.getCookies('alice')]);
  a[0].value = 'changed';
  assert.equal(b[0].value, 'alice');
  assert.equal((await broker.getCookies('alice'))[0].value, 'alice');
  assert.equal(calls, 1);
  assert.equal((await broker.getCookies('bob'))[0].value, 'bob');
  assert.equal(calls, 2);
});

test('cache expiry and invalidation require fresh authentication', async () => {
  let time = 0, calls = 0;
  const broker = createSessionBroker({ now: () => time, ttlMs: 10, authenticate: async () => [{ name: 'viewer', value: String(++calls) }] });
  assert.equal((await broker.getCookies('alice'))[0].value, '1');
  time = 10;
  assert.equal((await broker.getCookies('alice'))[0].value, '2');
  broker.invalidate('alice');
  assert.equal((await broker.getCookies('alice'))[0].value, '3');
});

test('synchronous sign-in errors are redacted, cooled down and retried later', async () => {
  let time = 0, calls = 0;
  const broker = createSessionBroker({ now: () => time, cooldownMs: 10, authenticate: () => { calls++; throw new Error('private upstream detail'); } });
  await assert.rejects(broker.getCookies('alice'), { message: 'Viewer authentication unavailable' });
  await assert.rejects(broker.getCookies('alice'), { message: 'Viewer authentication temporarily unavailable' });
  assert.equal(calls, 1);
  time = 11;
  await assert.rejects(broker.getCookies('alice'), { message: 'Viewer authentication unavailable' });
  assert.equal(calls, 2);
});

test('invalidation during sign-in cannot repopulate the cookie cache', async () => {
  let complete;
  const broker = createSessionBroker({ authenticate: () => new Promise(resolve => { complete = resolve; }) });
  const pending = broker.getCookies('alice');
  await Promise.resolve();
  broker.invalidate('alice');
  complete([{ name: 'viewer', value: 'alice' }]);
  await assert.rejects(pending, { message: 'Viewer authentication unavailable' });
});
