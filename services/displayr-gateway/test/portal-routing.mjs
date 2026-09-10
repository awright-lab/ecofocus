import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { middleware } = require('../../../middleware.ts');
const { POST } = require('../../../app/api/internal/displayr/authorize/route.ts');

test('portal callback reaches its own authentication handler without browser cookies', async () => {
  const req = new NextRequest('https://portal.ecofocusresearch.com/api/internal/displayr/authorize', {
    method: 'POST', headers: { host: 'portal.ecofocusresearch.com', 'content-type': 'application/json' }, body: '{}',
  });
  const result = await middleware(req);
  assert.equal(result.headers.get('x-middleware-next'), '1');
  assert.equal(result.headers.get('location'), null);
  assert.equal((await POST(req)).status, 401);
});

test('callback exception does not make nearby portal routes public', async () => {
  const req = new NextRequest('https://portal.ecofocusresearch.com/api/internal/displayr/other', {
    headers: { host: 'portal.ecofocusresearch.com' },
  });
  const result = await middleware(req);
  assert.equal(result.status, 307);
  assert.equal(new URL(result.headers.get('location')).pathname, '/login');
});
