import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const origin = 'https://ecofocusresearch.com';
function setup({ configured = true, accepted = true, missing = false } = {}) {
  const calls = [];
  const code = ts.transpileModule(fs.readFileSync('app/api/case-studies/gpi/download/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => ({ 'node:fs/promises': { readFile: async () => { if (missing) throw Error(); return Buffer.from('%PDF-test'); } }, 'node:path': { join: (...parts) => parts.join('/') } })[name], Request, Response, URL, URLSearchParams, Uint8Array, AbortSignal, process: { cwd: () => '/app', env: configured ? { PAYLOAD_BASE_URL: 'https://cms.example.com', CASE_STUDY_DOWNLOADS_API_KEY: 'server-test-key' } : {} }, fetch: async (url, options) => { calls.push({ url, headers: options.headers, data: JSON.parse(options.body) }); return { ok: accepted }; } });
  const post = (fields = {}, requestOrigin = origin) => exports.POST(new Request(`${origin}/api/case-studies/gpi/download`, { method: 'POST', headers: { origin: requestOrigin }, body: new URLSearchParams({ firstname: 'Jane', lastname: 'Doe', email: 'jane@example.com', ...fields }) }));
  return { post, calls, get: exports.GET };
}
test('PDF requires valid identity and a same-origin form submission', async () => {
  const r = setup();
  assert.equal((await r.post({}, 'https://other.example')).status, 403);
  for (const fields of [{ firstname: '' }, { lastname: '' }, { email: 'bad' }, { website: 'spam' }]) assert.equal((await r.post(fields)).status, 303);
  assert.equal(r.calls.length, 0);
});
test('Payload receives the identity and fixed GPI context before the private PDF is released', async () => {
  const r = setup(); const response = await r.post();
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '%PDF-test');
  assert.match(response.headers.get('content-disposition'), /attachment/);
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.equal(r.calls[0].data.email, 'jane@example.com');
  assert.equal(r.calls[0].data.caseStudy, 'glass-packaging-institute-2026');
  assert.equal(r.calls[0].url, 'https://cms.example.com/api/case-study-downloads');
  assert.equal(r.calls[0].headers['x-case-study-download-key'], 'server-test-key');
  assert.equal(r.calls[0].data.marketingConsent, undefined);
});
test('configuration, missing file, and Payload failure never release a PDF', async () => {
  for (const options of [{ configured: false }, { accepted: false }, { missing: true }]) {
    const r = setup(options); const response = await r.post();
    assert.equal(response.status, 303);
    assert.match(response.headers.get('location'), /error=unavailable/);
  }
});
test('PDF is private and all reader PDF links lead to the form', () => {
  assert.equal(fs.existsSync('public/EcoFocus_GPI_Case_Study.pdf'), false);
  assert.ok(fs.existsSync('private/case-studies/EcoFocus_GPI_Case_Study.pdf'));
  const html = fs.readFileSync('public/gpi-reader/index.html', 'utf8');
  assert.doesNotMatch(html, /href="[^"]*\.pdf"/);
  assert.match(html, /href="\/case-studies\/glass-packaging-institute\/download"/);
});
