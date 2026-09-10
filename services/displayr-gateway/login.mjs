import { lstat, readFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repository = fileURLToPath(new URL('../../', import.meta.url));

export async function readViewerSecrets(filename) {
  if (!filename || !path.isAbsolute(filename)) throw new Error('Absolute viewer secret path required');
  const info = await lstat(filename);
  const resolved = await realpath(filename);
  const relative = path.relative(repository, resolved);
  if (!info.isFile() || (info.mode & 0o077) || (!relative.startsWith(`..${path.sep}`) && relative !== '..')) {
    throw new Error('Viewer secrets require a private regular file outside the repository');
  }
  return parseViewerSecrets(await readFile(resolved, 'utf8'));
}

export function parseViewerSecrets(raw) {
  let config;
  try { config = JSON.parse(raw); } catch { throw new Error('Invalid viewer configuration'); }
  if (!config?.viewers || typeof config.viewers !== 'object' || Array.isArray(config.viewers)) throw new Error('Invalid viewer configuration');
  const emails = new Set();
  const viewers = new Map();
  for (const [userId, viewer] of Object.entries(config.viewers)) {
    if (!userId || typeof viewer?.email !== 'string' || typeof viewer?.password !== 'string' || !viewer.password) throw new Error('Invalid viewer configuration');
    const email = viewer.email.trim().toLowerCase();
    if (!email.includes('@') || emails.has(email)) throw new Error('Each portal user requires a distinct Displayr viewer');
    emails.add(email);
    viewers.set(userId, { email, password: viewer.password });
  }
  return viewers;
}

export function createBrowserAuthenticator({ chromium, viewers, executablePath }) {
  return async userId => {
    const credentials = viewers.get(userId);
    if (!credentials) throw new Error('No Displayr viewer mapped');
    // A new browser/context prevents credentials, storage and saved work from
    // leaking across different viewer identities. No screenshots/tracing/state.
    const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    try {
      const context = await browser.newContext();
      const page = await context.newPage();
      page.setDefaultTimeout(15_000);
      await page.goto('https://app.displayr.com/Login', { waitUntil: 'domcontentloaded' });
      if (new URL(page.url()).origin !== 'https://app.displayr.com') throw new Error('Unexpected identity provider');
      await page.getByRole('textbox', { name: 'Email', exact: true }).fill(credentials.email);
      await page.getByRole('textbox', { name: 'Password', exact: true }).fill(credentials.password);
      await page.getByRole('button', { name: 'Log in', exact: true }).click();
      await page.waitForURL(url => url.origin === 'https://app.displayr.com' && !/^\/Login\/?$/i.test(url.pathname), { timeout: 20_000 });
      // Login must finish at the ordinary report library, not a challenge,
      // invitation, password-reset or account-management screen.
      if (!/^\/(?:MyReports|Dashboard)\/?$/i.test(new URL(page.url()).pathname)) throw new Error('Interactive authentication required');
      return (await context.cookies('https://app.displayr.com/')).map(cookie => ({
        name: cookie.name, value: cookie.value, domain: cookie.domain, path: cookie.path, secure: cookie.secure,
        ...(cookie.expires > 0 ? { expires: cookie.expires * 1000 } : {}),
      }));
    } catch { throw new Error('Displayr viewer sign-in could not be completed'); }
    finally { await browser.close(); }
  };
}
