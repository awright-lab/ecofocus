import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { inspectDisplayrInvitationLink } from '../lib/portal/displayr-invitation-link.ts';

export async function inspectActivationForm({ chromium, link, companyId, executablePath }) {
  inspectDisplayrInvitationLink(link, companyId);
  let browser;
  let blockedRequests = 0;
  try {
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    const context = await browser.newContext({ javaScriptEnabled: false, serviceWorkers: 'block' });
    await context.route('**/*', route => {
      const request = route.request();
      const url = new URL(request.url());
      const allowed = ['GET', 'HEAD'].includes(request.method()) && url.origin === 'https://app.displayr.com' &&
        (!request.isNavigationRequest() || url.pathname === '/SignUp/ConfirmEmail');
      if (!allowed) { blockedRequests++; return route.abort(); }
      return route.continue({ headers: { ...request.headers(), referer: '' } });
    });
    const page = await context.newPage();
    const response = await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (!response?.ok()) return { formAvailable: false, status: response?.status() ?? null, blockedRequests, submitted: false };
    const forms = await page.locator('form').evaluateAll(elements => elements.map(form => {
      const action = new URL(form.action);
      const safeName = name => typeof name === 'string' && /^[a-zA-Z_][a-zA-Z0-9_:-]{0,79}$/.test(name) ? name : null;
      return {
        method: form.method.toUpperCase(),
        actionPath: action.origin === 'https://app.displayr.com' && /^\/[a-zA-Z/]{1,100}$/.test(action.pathname) ? action.pathname : '[unrecognized]',
        actionParameterNames: [...action.searchParams.keys()].map(safeName),
        fields: [...form.querySelectorAll('input,button,select,textarea')].map(field => ({
          tag: field.tagName.toLowerCase(), type: field.type, name: safeName(field.name), id: safeName(field.id),
        })),
      };
    }));
    return { formAvailable: forms.some(form => form.fields.some(field => field.type === 'password')), forms, blockedRequests, submitted: false };
  } catch {
    throw new Error('Activation form inspection could not finish. No password was submitted.');
  } finally { await browser?.close().catch(() => {}); }
}

export function promptHidden(label) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('Interactive terminal required');
  return new Promise((resolve, reject) => {
    const output = new Writable({ write(_chunk, _encoding, done) { done(); } });
    const terminal = createInterface({ input: process.stdin, output, terminal: true });
    let settled = false;
    process.stdout.write(label);
    terminal.on('SIGINT', () => terminal.close());
    terminal.once('close', () => { process.stdout.write('\n'); if (!settled) reject(new Error('Cancelled')); });
    terminal.question('', answer => { settled = true; terminal.close(); resolve(answer); });
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const require = createRequire(new URL('../services/displayr-gateway/package.json', import.meta.url));
    const { chromium } = require('playwright');
    const link = (await promptHidden('Paste the invitation link (hidden), then press Enter: ')).trim();
    const result = await inspectActivationForm({ chromium, link, companyId: process.env.DISPLAYR_INSPECTION_COMPANY_ID,
      executablePath: process.env.DISPLAYR_INSPECTION_CHROME_PATH });
    console.log(JSON.stringify(result, null, 2));
  } catch {
    console.error('Inspection stopped. Check the link, company ID and browser installation. No password was submitted.');
    process.exitCode = 1;
  }
}
