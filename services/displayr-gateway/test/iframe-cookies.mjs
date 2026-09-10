// Opt-in real Chromium regression; requires openssl, no live credentials.
import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { createGateway } from '../../../experiments/displayr-gateway/gateway.mjs';
const listen = server => new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
const close = server => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); });
const dir = await mkdtemp(join(tmpdir(), 'ecofocus-cookie-test-'));
let browser, gateway, ingress, upstream;
try {
  execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', join(dir, 'key.pem'), '-out', join(dir, 'cert.pem'), '-days', '1', '-subj', '/CN=gateway.test'], { stdio: 'ignore' });
  const exportBytes = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0xff, 0x80]);
  upstream = http.createServer((req, res) => {
    if (req.url === '/viewer.js') {
      res.setHeader('Content-Type', 'text/javascript');
      // Preserve the observed Displayr handler shape so the browser exercises
      // the real gateway rewrite, including a programmatic download click.
      res.end(`// /Dashboard/DownloadExport/{0}/{1}
        document.querySelector('button').onclick=()=>{let a='/Dashboard/DownloadExport/101/test/result.xlsx',c='result.xlsx',p=document.createElement('a');p.style.display='none',p.href=a,p.download=c,document.body.appendChild(p),p.onclick=l=>l.stopPropagation(),p.click()}`);
      return;
    }
    if (req.url.startsWith('/Dashboard/DownloadExport/')) {
      res.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Disposition': 'attachment; filename="result.xlsx"' });
      res.end(exportBytes);
      return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Private pilot report</h1><button>Export Excel</button><script src="/viewer.js"></script>');
  });
  const upstreamPort = await listen(upstream);
  ingress = https.createServer({ key: await readFile(join(dir, 'key.pem')), cert: await readFile(join(dir, 'cert.pem')) }, (req, res) => {
    const url = new URL(req.url, `https://${req.headers.host}`);
    if (url.hostname === 'gateway.test') gateway.server.emit('request', req, res);
    else {
      const src = url.searchParams.get('launch') || `https://gateway.test:${port}/Dashboard?project_id=101`;
      res.setHeader('Content-Type', 'text/html');
      res.end(`<iframe src="${src}"></iframe>`);
    }
  });
  const port = await listen(ingress);
  const portalOrigin = `https://portal.test:${port}`;
  const gatewayOrigin = `https://gateway.test:${port}`;
  gateway = createGateway({ upstreamOrigin: `http://127.0.0.1:${upstreamPort}`, gatewayOrigin, portalOrigin, authorize: async () => true, resolveDashboard: () => '/Dashboard?project_id=101' });
  browser = await chromium.launch({ headless: true, args: ['--no-proxy-server', '--host-resolver-rules=MAP portal.test 127.0.0.1, MAP gateway.test 127.0.0.1, MAP other.test 127.0.0.1'], ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}) });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const ticket = gateway.issueLaunch({ userId: 'test-viewer', dashboardId: '101' });
  await page.goto(portalOrigin + '/?launch=' + encodeURIComponent(gatewayOrigin + '/__gateway/launch?ticket=' + ticket));
  await page.frameLocator('iframe').getByRole('heading', { name: 'Private pilot report' }).waitFor();
  const cookie = (await context.cookies()).find(value => value.name === 'ef_gateway_session');
  assert.ok(cookie);
  assert.equal(cookie.httpOnly, true);
  assert.equal(cookie.secure, true);
  assert.equal(cookie.sameSite, 'None');
  assert.ok(cookie.partitionKey);
  await page.goto(portalOrigin);
  await page.frameLocator('iframe').getByRole('heading', { name: 'Private pilot report' }).waitFor();
  const downloadEvent = page.waitForEvent('download');
  await page.frameLocator('iframe').getByRole('button', { name: 'Export Excel' }).click();
  const download = await downloadEvent;
  assert.equal(await download.failure(), null);
  assert.equal(download.suggestedFilename(), 'result.xlsx');
  assert.deepEqual(await readFile(await download.path()), exportBytes);
  await page.frameLocator('iframe').getByRole('heading', { name: 'Private pilot report' }).waitFor();
  const anonymous = await context.newPage();
  assert.equal((await anonymous.goto(gatewayOrigin + '/Dashboard/DownloadExport/101/test/result.xlsx')).status(), 401);
  await anonymous.close();
  const denied = page.waitForResponse(r => r.url().startsWith(gatewayOrigin + '/Dashboard'));
  await page.goto(`https://other.test:${port}`);
  assert.equal((await denied).status(), 401);
  console.log('PASS: iframe launch, reload and exact-byte export work; anonymous exports and other embedding sites remain denied.');
} finally {
  await browser?.close();
  await gateway?.close();
  if (ingress) await close(ingress);
  if (upstream) await close(upstream);
  await rm(dir, { recursive: true, force: true });
}
