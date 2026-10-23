import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(path, modules, globals = {}) {
  const source = fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => { if (!(name in modules)) throw new Error(name); return modules[name]; }, Request, Response, URL, console: { error() {} }, process: { env: {} }, ...globals });
  return exports;
}
function checkout({ report = { id: '42' }, fail = false } = {}) {
  const calls = [];
  const route = load('app/api/checkout/route.ts', {
    'next/server': { NextResponse: { json: (data, options) => Response.json(data, options) } },
    '@/lib/reports-repo': { getReportByPriceId: async () => report },
    '@/lib/stripe': { getStripeServer: () => ({ checkout: { sessions: { create: async args => { calls.push(args); if (fail) throw Error('Stripe failed'); return { url: 'https://checkout.stripe.com/test' }; } } } }) },
  });
  return { calls, post: body => route.POST(new Request('https://ecofocusresearch.com/api/checkout', { method: 'POST', body: JSON.stringify(body) })) };
}
test('checkout rejects malformed bodies, empty carts, invalid prices and quantities', async () => {
  const route = checkout();
  for (const body of [null, {}, { items: [] }, { items: [null] }, { items: [{ price: 'price_test', quantity: 0 }] }, { items: [{ price: 'price_test', quantity: 1.5 }] }, { items: [{ price: 'bad', quantity: 1 }] }]) assert.equal((await route.post(body)).status, 400);
  assert.equal(route.calls.length, 0);
});
test('unpublished or outdated catalog prices cannot be checked out', async () => {
  const route = checkout({ report: null });
  assert.equal((await route.post({ items: [{ price: 'price_test', quantity: 1 }] })).status, 400);
  assert.equal(route.calls.length, 0);
});
test('checkout sets trusted order metadata and return URLs on the server', async () => {
  const route = checkout();
  const response = await route.post({ items: [{ price: 'price_test', quantity: 1, amount: 1 }], successUrl: 'https://evil.example', metadata: { report_ids: '["other"]' } });
  assert.equal(response.status, 200);
  assert.equal(route.calls[0].metadata.report_ids, '["42"]');
  assert.equal(route.calls[0].success_url, 'https://ecofocusresearch.com/checkout/success?session_id={CHECKOUT_SESSION_ID}');
  assert.equal(route.calls[0].line_items[0].amount, undefined);
});
test('Stripe errors produce a recoverable checkout response', async () => {
  const route = checkout({ fail: true });
  assert.equal((await route.post({ items: [{ price: 'price_test', quantity: 1 }] })).status, 503);
});
test('only completed, paid report-store sessions unlock downloads', async () => {
  let session;
  const { getPaidReportOrder } = load('lib/report-orders.ts', { 'server-only': {}, '@/lib/stripe': { getStripeServer: () => ({ checkout: { sessions: { retrieve: async () => session } } }) } });
  for (const value of [
    { status: 'open', payment_status: 'unpaid' },
    { status: 'complete', payment_status: 'unpaid' },
    { status: 'complete', payment_status: 'paid', metadata: { source: 'other' } },
    { status: 'complete', payment_status: 'paid', metadata: { source: 'report-store', report_ids: '[123]' } },
  ]) { session = value; await assert.rejects(getPaidReportOrder('cs_test_abc123')); }
  session = { status: 'complete', payment_status: 'paid', metadata: { source: 'report-store', report_ids: '["42"]' } };
  assert.equal(JSON.stringify(await getPaidReportOrder('cs_test_abc123')), '["42"]');
});
test('download route denies reports outside the paid order before requesting a file', async () => {
  const { GET } = load('app/api/reports/download/route.ts', {
    'next/server': { NextResponse: { json: (data, options) => Response.json(data, options) } },
    '@/lib/report-orders': { getPaidReportOrder: async () => ['42'], getPurchasedReport: () => assert.fail('Must not fetch a file') },
  });
  assert.equal((await GET(new Request('https://ecofocusresearch.com/api/reports/download?session_id=cs_test_a&report_id=other'))).status, 403);
});


test('production catalog uses published Payload records and canonical access enums', async () => {
  const requests = [];
  const repo = load('lib/reports-repo.ts', { 'server-only': {} }, {
    process: { env: { PAYLOAD_BASE_URL: 'https://cms.example', NODE_ENV: 'production' } },
    fetch: async url => { requests.push(new URL(url)); return { ok: true, json: async () => ({ docs: [], totalDocs: 0, hasNextPage: false }) }; },
  });
  const result = await repo.listReports({ access: 'premium' });
  assert.equal(result.items.length, 0);
  const where = JSON.parse(requests[0].searchParams.get('where'));
  assert.equal(JSON.stringify(where), JSON.stringify({ and: [{ _status: { equals: 'published' } }, { access: { equals: 'Premium' } }] }));
});

test('CMS failures never replace production products with demo products', async () => {
  const repo = load('lib/reports-repo.ts', { 'server-only': {} }, {
    process: { env: { PAYLOAD_BASE_URL: 'https://cms.example', NODE_ENV: 'production' } },
    fetch: async () => ({ ok: false, status: 503, text: async () => 'Unavailable' }),
  });
  await assert.rejects(repo.listReports({}), /Payload list error/);
});
