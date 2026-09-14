import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const DISPLAYR = 'https://app.displayr.com';

export function inspectionRequestGuard() {
  let loginSubmitted = false;
  return request => {
    const url = new URL(request.url());
    if (url.protocol !== 'https:') return false;
    if (request.method() === 'POST' && url.origin === DISPLAYR && /^\/Login\/?$/i.test(url.pathname) && !loginSubmitted) {
      loginSubmitted = true;
      return true;
    }
    if (!['GET', 'HEAD'].includes(request.method())) return false;
    return !request.isNavigationRequest() || url.origin === DISPLAYR;
  };
}

export async function inspectDisplayrAdministrator({ chromium, email, password, executablePath }) {
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Administrator email is required');
  if (!password) throw new Error('Administrator password is required');
  let browser;
  let stage = 'browser-start';
  try {
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const allowed = inspectionRequestGuard();
    await context.route('**/*', route => allowed(route.request()) ? route.continue() : route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(15_000);
    stage = 'login-page';
    await page.goto(DISPLAYR + '/Login', { waitUntil: 'domcontentloaded' });
    stage = 'login-form';
    await page.getByRole('textbox', { name: 'Email', exact: true }).fill(email);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
    stage = 'login-submit';
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    stage = 'login-completion';
    await page.waitForURL(url => url.origin === DISPLAYR && /^\/(MyReports|Dashboard)\/?$/i.test(url.pathname), { timeout: 20_000 });
    stage = 'management-links';
    const paths = await page.locator('a[href]').evaluateAll(links => [...new Set(links.map(link => {
      try {
        const url = new URL(link.href);
        return url.origin === 'https://app.displayr.com' && /^\/[a-zA-Z0-9/_-]{1,100}$/.test(url.pathname) && /(?:user|group|account|setting)/i.test(url.pathname) ? url.pathname : null;
      } catch { return null; }
    }).filter(Boolean))].sort());
    // No page body, user list, query strings, cookies, tokens or screenshots.
    return { signedIn: true, managementPaths: paths, userCreationTested: false };
  } catch {
    // Browser exceptions can contain filled values; never print the original.
    throw new Error(`Administrator inspection stopped at ${stage}. No users were created.`);
  } finally { if (browser) await browser.close().catch(() => {}); }
}

async function promptPassword(email) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('Run in an interactive terminal; the password prompt does not accept pipes.');
  process.stdout.write(`Displayr password for ${email} (hidden): `);
  const wasRaw = process.stdin.isRaw;
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve, reject) => {
    let password = '';
    const finish = cancelled => {
      process.stdin.off('data', onData);
      process.stdin.setRawMode(Boolean(wasRaw));
      process.stdin.pause();
      process.stdout.write('\n');
      if (cancelled) reject(new Error('Inspection cancelled.')); else resolve(password);
      password = '';
    };
    const onData = chunk => {
      for (const char of chunk.toString('utf8')) {
        if (char === '\u0003' || char === '\u0004') { finish(true); return; }
        if (char === '\r' || char === '\n') { finish(false); return; }
        if (char === '\u007f' || char === '\b') password = password.slice(0, -1);
        else if (char >= ' ') password += char;
      }
    };
    process.stdin.on('data', onData);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const require = createRequire(new URL('../services/displayr-gateway/package.json', import.meta.url));
    const { chromium } = require('playwright');
    const email = process.env.DISPLAYR_INSPECTION_EMAIL;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Administrator email is required');
    const password = await promptPassword(email);
    console.log(JSON.stringify(await inspectDisplayrAdministrator({ chromium, email, password, executablePath: process.env.DISPLAYR_INSPECTION_CHROME_PATH }), null, 2));
  } catch (error) {
    // Only this tool's sanitized errors are printed; dependency errors stay generic.
    const safe = error instanceof Error && /^(Administrator inspection stopped at|Inspection cancelled\.|Run in an interactive terminal|Administrator (?:password|email) is required)/.test(error.message);
    console.error(safe ? error.message : 'Inspection could not start. Check the Playwright browser installation.');
    process.exitCode = 1;
  }
}
