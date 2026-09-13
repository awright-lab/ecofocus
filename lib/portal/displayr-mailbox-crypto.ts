import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

export const MAILBOX_EMAIL = 'displayr-provisioning@ecofocusworldwide.com';
export const MAILBOX_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';
export const MAILBOX_CALLBACK = 'https://portal.ecofocusresearch.com/api/portal/admin/displayr/mailbox/callback';
export const MAILBOX_ADMIN_URL = 'https://portal.ecofocusresearch.com/admin/displayr';
export const MAILBOX_COOKIE = '__Host-ef_mailbox_oauth';
export const randomOAuthValue = () => randomBytes(32).toString('base64url');
export const hashOAuthValue = (value: string) => createHash('sha256').update(value).digest('base64url');

export function mailboxKey(raw: string | undefined) {
  if (!raw || !/^[a-f0-9]{64}$/i.test(raw)) throw new Error('Mailbox encryption is not configured');
  return Buffer.from(raw, 'hex');
}
export function encryptMailboxSecret(value: string, key: Buffer, purpose: 'refresh' | 'verifier') {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(`${MAILBOX_EMAIL}:${purpose}:v1`));
  const data = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return ['v1', iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), data.toString('base64url')].join('.');
}
export function decryptMailboxSecret(value: string, key: Buffer, purpose: 'refresh' | 'verifier') {
  const [version, iv, tag, data, extra] = value.split('.');
  if (version !== 'v1' || !iv || !tag || !data || extra) throw new Error('Invalid encrypted credential');
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64url'));
  decipher.setAAD(Buffer.from(`${MAILBOX_EMAIL}:${purpose}:v1`));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64url')), decipher.final()]).toString('utf8');
}
export function mailboxAuthorizationUrl(clientId: string, state: string, verifier: string) {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search = new URLSearchParams({ client_id: clientId, redirect_uri: MAILBOX_CALLBACK,
    response_type: 'code', scope: MAILBOX_SCOPE, access_type: 'offline', prompt: 'consent select_account',
    login_hint: MAILBOX_EMAIL, state, code_challenge: hashOAuthValue(verifier), code_challenge_method: 'S256',
    include_granted_scopes: 'false' }).toString();
  return url;
}
export function validateMailboxGrant(tokens: { access_token?: unknown; refresh_token?: unknown; scope?: unknown }, profile: { emailAddress?: unknown }) {
  if (typeof tokens.access_token !== 'string' || !tokens.access_token || typeof tokens.refresh_token !== 'string' || !tokens.refresh_token ||
      typeof tokens.scope !== 'string' || !tokens.scope.split(' ').includes(MAILBOX_SCOPE)) throw new Error('Incomplete mailbox authorization');
  if (typeof profile.emailAddress !== 'string' || profile.emailAddress.toLowerCase() !== MAILBOX_EMAIL) throw new Error('Wrong mailbox');
}
