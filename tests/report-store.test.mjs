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
function checkout({ report = { id: '42', price: 10 }, fail = false, production = false, promotions = [] } = {}) {
  const calls = [];
  const route = load('app/api/checkout/route.ts', {
    'next/server': { NextResponse: { json: (data, options) => Response.json(data, options) } },
    '@/lib/report-site': load('lib/report-site.ts', {}, { process: { env: { NODE_ENV: production ? 'production' : 'test' } } }),
    '@/lib/reports-repo': { getReportByPriceId: async () => report },
    '@/lib/stripe': { getStripeServer: () => ({ promotionCodes: { list: async () => ({ data: promotions }) }, checkout: { sessions: { create: async args => { calls.push(args); if (fail) throw Error('Stripe failed'); return { url: 'https://checkout.stripe.com/test' }; } } } }) },
  });
  return { calls, post: (body, origin = 'https://ecofocusresearch.com') => route.POST(new Request(`${origin}/api/checkout`, { method: 'POST', body: JSON.stringify(body) })) };
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
  const response = await route.post({ items: [{ price: 'price_test', quantity: 1, amount: 1 }], successUrl: 'https://evil.example', metadata: { report_ids: '["other"]' }, discounts: [{ coupon: 'client_coupon' }], automatic_tax: { enabled: false }, billing_address_collection: 'auto', custom_fields: [] });
  assert.equal(response.status, 200);
  assert.equal(route.calls[0].metadata.report_ids, '["42"]');
  assert.equal(route.calls[0].success_url, 'https://ecofocusresearch.com/checkout/success?session_id={CHECKOUT_SESSION_ID}');
  assert.equal(route.calls[0].line_items[0].amount, undefined);
  assert.equal(route.calls[0].allow_promotion_codes, true);
  assert.equal(route.calls[0].discounts, undefined);
  assert.equal(route.calls[0].automatic_tax.enabled, true);
  assert.equal(route.calls[0].billing_address_collection, 'required');
  assert.deepEqual(JSON.parse(JSON.stringify(route.calls[0].custom_fields)), [{ key: 'companyName', label: { type: 'custom', custom: 'Company name' }, type: 'text', optional: false, text: { minimum_length: 1, maximum_length: 200 } }]);

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
  assert.equal(requests[0].searchParams.get('where'), null);
  assert.equal(requests[0].searchParams.get('where[and][0][_status][equals]'), 'published');
  assert.equal(requests[0].searchParams.get('where[and][1][access][equals]'), 'Premium');
});

test('CMS failures never replace production products with demo products', async () => {
  const repo = load('lib/reports-repo.ts', { 'server-only': {} }, {
    process: { env: { PAYLOAD_BASE_URL: 'https://cms.example', NODE_ENV: 'production' } },
    fetch: async () => ({ ok: false, status: 503, text: async () => 'Unavailable' }),
  });
  await assert.rejects(repo.listReports({}), /Payload list error/);
});


test('checkout rejects totals below the USD minimum before calling Stripe', async () => {
  const route = checkout({ report: { id: '42', price: 0.01 } });
  const response = await route.post({ items: [{ price: 'price_test', quantity: 1 }] });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).code, 'minimum_order_amount');
  assert.equal(route.calls.length, 0);
});

test('checkout accepts the minimum and calculates totals using quantities', async () => {
  for (const [price, quantity] of [[0.50, 1], [0.01, 50], [10, 1]]) {
    const route = checkout({ report: { id: '42', price } });
    assert.equal((await route.post({ items: [{ price: 'price_test', quantity }] })).status, 200);
    assert.equal(route.calls.length, 1);
  }
});


test('checkout initiated from a hosting alias returns customers to the primary site', async () => {
  const route = checkout({ production: true });
  assert.equal((await route.post({ items: [{ price: 'price_test', quantity: 1 }] }, 'https://main--ecofocusresearch.netlify.app')).status, 200);
  assert.equal(route.calls[0].success_url, 'https://ecofocusresearch.com/checkout/success?session_id={CHECKOUT_SESSION_ID}');
  assert.equal(route.calls[0].cancel_url, 'https://ecofocusresearch.com/reports');
});


test('authenticated catalog never exposes draft records even if the CMS returns them', async () => {
  const repo = load('lib/reports-repo.ts', { 'server-only': {} }, {
    process: { env: { PAYLOAD_BASE_URL: 'https://cms.example', REPORTS_API_KEY: 'fixture', NODE_ENV: 'production' } },
    fetch: async () => ({ ok: true, json: async () => ({ docs: [{ id: 1, slug: 'test-report', _status: 'draft' }, { id: 2, slug: 'real-report', _status: 'published' }], totalDocs: 2 }) }),
  });
  assert.deepEqual(JSON.parse(JSON.stringify((await repo.listReports({})).items.map(x => x.slug))), ['real-report']);
});

test('slug and checkout price lookups use REST filters and reject mismatched or draft records', async () => {
  const requests = []; let doc;
  const repo = load('lib/reports-repo.ts', { 'server-only': {} }, {
    process: { env: { PAYLOAD_BASE_URL: 'https://cms.example', REPORTS_API_KEY: 'fixture', NODE_ENV: 'production' } },
    fetch: async url => { requests.push(new URL(url)); return { ok: true, json: async () => ({ docs: doc ? [doc] : [] }) }; },
  });
  doc = { id: 1, slug: 'test-report', _status: 'draft', access: 'Premium', priceId: 'price_old' };
  assert.equal(await repo.getReportBySlug('test-report'), null);
  assert.equal(await repo.getReportByPriceId('price_old'), null);
  assert.equal(requests[0].searchParams.get('where[and][0][slug][equals]'), 'test-report');
  assert.equal(requests[1].searchParams.get('where[and][0][priceId][equals]'), 'price_old');
  doc = { ...doc, _status: 'published', slug: 'other-report', priceId: 'price_other' };
  assert.equal(await repo.getReportBySlug('test-report'), null);
  assert.equal(await repo.getReportByPriceId('price_old'), null);
  doc = { ...doc, slug: 'real-report', priceId: 'price_real' };
  assert.equal((await repo.getReportBySlug('real-report')).id, '1');
  assert.equal((await repo.getReportByPriceId('price_real')).id, '1');
});

test('cart promo codes are resolved by Stripe and preapplied without trusting caller discount IDs', async () => {
 const h = checkout({ promotions: [{ id: 'promo_verified' }] });
 assert.equal((await h.post({ items: [{ price: 'price_test', quantity: 1 }], promotionCode: ' WORKFORCE100 ', discounts: [{ coupon: 'untrusted' }] })).status, 200);
 assert.deepEqual(JSON.parse(JSON.stringify(h.calls[0].discounts)), [{ promotion_code: 'promo_verified' }]);
 assert.equal(h.calls[0].allow_promotion_codes, undefined);
 const missing = checkout();
 assert.equal((await missing.post({ items: [{ price: 'price_test', quantity: 1 }], promotionCode: 'MISSING' })).status, 400);
 assert.equal(missing.calls.length, 0);
 for (const promotionCode of [123, {}, 'invalid code', 'a'.repeat(201)]) assert.equal((await missing.post({ items: [{ price: 'price_test', quantity: 1 }], promotionCode })).status, 400);
});
