import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';
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

export function classifyAdministratorLogin(text) {
  return {
    credentialsRejected: /(?:email\s+or\s+password\s+is\s+incorrect)|(?:invalid|incorrect|wrong)\s+(?:email|password|credentials)|(?:log\s*in|sign\s*in)\s+failed/i.test(text),
    verificationRequested: /verification\s+code|two.factor|multi.factor|verify\s+(?:your|that|you)|captcha|unusual\s+(?:traffic|activity)/i.test(text),
    rateLimited: /too\s+many\s+(?:attempts|requests)|temporarily\s+locked|try\s+again\s+later/i.test(text),
  };
}

export async function inspectDisplayrAdministrator({ chromium, email, password, executablePath }) {
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Administrator email is required');
  if (!password) throw new Error('Administrator password is required');
  let browser;
  let page;
  let loginPostStatus = null;
  let blockedWrites = 0;
  let blockedNavigations = 0;
  let stage = 'browser-start';
  try {
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const allowed = inspectionRequestGuard();
    await context.route('**/*', route => {
      const request = route.request();
      if (allowed(request)) return route.continue();
      if (!['GET', 'HEAD'].includes(request.method())) blockedWrites++;
      if (request.isNavigationRequest()) blockedNavigations++;
      return route.abort();
    });
    page = await context.newPage();
    page.on('response', response => {
      const url = new URL(response.url());
      if (url.origin === DISPLAYR && /^\/Login\/?$/i.test(url.pathname) && response.request().method() === 'POST') loginPostStatus = response.status();
    });
    page.setDefaultTimeout(15_000);
    stage = 'login-page';
    await page.goto(DISPLAYR + '/Login', { waitUntil: 'domcontentloaded' });
    stage = 'login-form';
    await page.getByRole('textbox', { name: 'Email', exact: true }).fill(email);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
    stage = 'login-submit';
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    stage = 'login-completion';
    try {
      await page.waitForURL(url => url.origin === DISPLAYR && /^\/(MyReports|Dashboard)\/?$/i.test(url.pathname), { timeout: 20_000 });
    } catch {
      // Read text only to derive booleans. Neither text nor query strings leave
      // the isolated browser. Keep unknown destinations unconfirmed.
      let signals = null;
      try { signals = classifyAdministratorLogin(await page.locator('body').innerText({ timeout: 2000 })); } catch {}
      const url = new URL(page.url());
      const safePath = url.origin === DISPLAYR && /^\/(?:[A-Za-z]{1,30}\/?){0,4}$/.test(url.pathname);
      return { signedIn: false, stage, loginPostStatus,
        landingPath: safePath ? url.pathname : '[unrecognized destination]',
        loginFormStillVisible: await page.getByRole('textbox', { name: 'Password', exact: true }).isVisible().catch(() => false),
        signals, blockedWrites, blockedNavigations, userCreationTested: false };
    }
    stage = 'account-page';
    // This read-only destination was discovered by the authenticated probe.
    const accountResponse = await page.goto(DISPLAYR + '/MyAccount', { waitUntil: 'domcontentloaded' });
    const accountUrl = new URL(page.url());
    if (accountUrl.origin !== DISPLAYR || !/^\/MyAccount\/?$/i.test(accountUrl.pathname) || (accountResponse && !accountResponse.ok())) {
      return { signedIn: true, accountPageAvailable: false, accountStatus: accountResponse?.status() ?? null, userCreationTested: false };
    }
    stage = 'management-links';
    const paths = await page.locator('a[href]').evaluateAll(links => [...new Set(links.map(link => {
      try {
        const url = new URL(link.href);
        return url.origin === 'https://app.displayr.com' && /^\/[a-zA-Z0-9/_-]{1,100}$/.test(url.pathname) && /(?:user|group|account|setting|company|organisation|organization)/i.test(url.pathname) ? url.pathname : null;
      } catch { return null; }
    }).filter(Boolean))].sort());
    // No page body, user list, query strings, cookies, tokens or screenshots.
    const controls = await page.locator('a, button, [role="tab"], input[type="submit"]').evaluateAll(elements => {
      const recognized = new Set(['users', 'user groups', 'groups', 'user management', 'manage users', 'manage groups', 'add user', 'new user', 'company settings', 'account settings']);
      return [...new Set(elements.map(element => (element.textContent || element.getAttribute('aria-label') || element.getAttribute('value') || '').trim().toLowerCase()).filter(label => recognized.has(label)))].sort();
    });
    return { signedIn: true, accountPageAvailable: true, managementPaths: paths, managementControls: controls, blockedWrites, blockedNavigations, userCreationTested: false };
  } catch {
    // Browser exceptions can contain filled values; never print the original.
    throw new Error(`Administrator inspection stopped at ${stage}. No users were created.`);
  } finally { if (browser) await browser.close().catch(() => {}); }
}

async function promptPassword(email) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('Run in an interactive terminal; the password prompt does not accept pipes.');
  // readline handles paste, backspace, cursor keys and UTF-8. Its output is
  // discarded so neither the password nor editing operations are echoed.
  const hidden = new Writable({ write(_chunk, _encoding, done) { done(); } });
  const terminal = createInterface({ input: process.stdin, output: hidden, terminal: true });
  process.stdout.write(`Displayr password for ${email} (hidden): `);
  return new Promise((resolve, reject) => {
    let settled = false;
    terminal.once('SIGINT', () => terminal.close());
    terminal.once('close', () => {
      process.stdout.write('\n');
      if (!settled) reject(new Error('Inspection cancelled.'));
    });
    terminal.question('', password => {
      settled = true;
      terminal.close();
      resolve(password);
    });
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
