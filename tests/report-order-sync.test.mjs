import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function harness({ configured = true, cmsOk = true, sessions = [] } = {}) {
  const requests = [], lookups = [], exports = {};
  const code = ts.transpileModule(fs.readFileSync(new URL('../lib/report-order-sync.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, AbortSignal, process: { env: configured ? { PAYLOAD_BASE_URL: 'https://cms.example/', REPORTS_API_KEY: 'fixture-key' } : {} }, require: name => name === 'server-only' ? {} : { getStripeServer: () => ({ checkout: { sessions: { list: async args => { lookups.push(args); return { data: sessions, has_more: false }; } } } }) }, fetch: async (url, options) => { requests.push({ url, options }); return { ok: cmsOk, status: cmsOk ? 200 : 503, json: async () => ({ recorded: true }) }; } });
  return { ...exports, requests, lookups };
}
test('order sync sends only a checkout ID to the authenticated CMS verification endpoint', async () => {
  const h = harness(); await h.recordReportOrder('cs_live_fixture');
  assert.equal(h.requests[0].url, 'https://cms.example/api/report-orders/sync');
  assert.equal(h.requests[0].options.headers.Authorization, 'users API-Key fixture-key');
  assert.deepEqual(JSON.parse(h.requests[0].options.body), { sessionId: 'cs_live_fixture' });
  assert.equal(h.requests[0].options.cache, 'no-store');
});
test('configuration and CMS failures propagate so Stripe can retry delivery', async () => {
  await assert.rejects(harness({ configured: false }).recordReportOrder('cs_live_fixture'), /not configured/);
  await assert.rejects(harness({ cmsOk: false }).recordReportOrder('cs_live_fixture'), /503/);
});
test('refund sync resolves the payment intent and refreshes only paid report orders', async () => {
  const h = harness({ sessions: [{ id: 'cs_live_report', payment_status: 'paid', metadata: { source: 'report-store' } }, { id: 'cs_live_pending', payment_status: 'unpaid', metadata: { source: 'report-store' } }, { id: 'cs_live_portal', payment_status: 'paid', metadata: { source: 'portal' } }] });
  await h.recordReportRefund('pi_fixture');
  assert.equal(h.lookups[0].payment_intent, 'pi_fixture');
  assert.equal(h.requests.length, 1);
  assert.equal(JSON.parse(h.requests[0].options.body).sessionId, 'cs_live_report');
});
