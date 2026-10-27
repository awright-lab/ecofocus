import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(path, modules) {
  const code = ts.transpileModule(fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => modules[name], process: { env: {} }, console });
  return exports;
}
const host = load('lib/portal/host.ts', {});
const { middleware } = load('middleware.ts', {
  'next/server': { NextResponse: {
    next: () => ({ kind: 'next', headers: new Headers() }),
    redirect: url => ({ kind: 'redirect', url: url.toString() }),
    rewrite: url => ({ kind: 'rewrite', url: url.toString() }),
  } },
  '@supabase/ssr': { createServerClient: () => { throw Error('Unexpected browser auth lookup'); } },
  '@/lib/portal/host': host,
  '@/lib/portal/displayr-gateway-config': { getDisplayrGatewayOrigin: () => null },
});
function request(hostname, pathname) {
  const makeUrl = () => Object.assign(new URL(`https://${hostname}${pathname}`), { clone: makeUrl });
  return { nextUrl: makeUrl(), headers: new Headers({ host: hostname }), cookies: { get: () => undefined } };
}
test('Stripe webhook reaches its signature-verifying handler without portal login on both domains', async () => {
  for (const hostname of ['portal.ecofocusresearch.com', 'ecofocusresearch.com']) {
    assert.equal((await middleware(request(hostname, '/api/stripe/webhook'))).kind, 'next');
  }
});
test('portal pages and neighboring API paths still require browser login', async () => {
  for (const path of ['/home', '/api/portal/companies', '/api/stripe/webhook/other']) {
    const response = await middleware(request('portal.ecofocusresearch.com', path));
    assert.equal(response.kind, 'redirect');
    assert.equal(new URL(response.url).pathname, '/login');
  }
});
