import { createHash } from 'node:crypto';

const MAILBOX = 'displayr-provisioning@ecofocusworldwide.com';
const GMAIL = 'https://gmail.googleapis.com/gmail/v1/users/me';
const READ_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';

type MailboxReadFailure = 'reconnect' | 'unavailable' | 'wrong-mailbox' | 'invalid-request';
export class MailboxReadError extends Error {
  readonly reason: MailboxReadFailure;
  constructor(reason: MailboxReadFailure) {
    super(reason);
    this.reason = reason;
    this.name = 'MailboxReadError';
  }
}

// Stable per-user aliases, independent of company membership or email changes.
export function displayrViewerAlias(userId: string) {
  if (!userId || userId.length > 256) throw new MailboxReadError('invalid-request');
  return `displayr-provisioning+${createHash('sha256').update(userId).digest('hex').slice(0, 32)}@ecofocusworldwide.com`;
}

type GoogleResponse = { access_token?: string; expires_in?: number; scope?: string; error?: string; emailAddress?: string; messages?: { id: string }[]; nextPageToken?: string; id?: string; internalDate?: string; payload?: { headers?: { name: string; value: string }[] } };
export function createProvisioningMailboxReader(config: { clientId: string; clientSecret: string; refreshToken: string; fetchImpl?: typeof fetch }) {
  const send = config.fetchImpl || fetch;
  let accessToken = '';
  let expiresAt = 0;
  let refreshInFlight: Promise<void> | undefined;
  async function refresh() {
    if (refreshInFlight) return refreshInFlight;
    refreshInFlight = (async () => {
      try {
        const response = await send('https://oauth2.googleapis.com/token', {
          method: 'POST', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15_000),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, refresh_token: config.refreshToken, grant_type: 'refresh_token' }),
        });
        const data = await response.json() as GoogleResponse;
        if (!response.ok) throw new MailboxReadError(data.error === 'invalid_grant' ? 'reconnect' : 'unavailable');
        if (!data.access_token || typeof data.access_token !== 'string' || !Number.isFinite(data.expires_in) || data.expires_in! <= 60 || (data.scope && !data.scope.split(' ').includes(READ_SCOPE))) throw new MailboxReadError('reconnect');
        accessToken = data.access_token;
        expiresAt = Date.now() + (data.expires_in! - 60) * 1000;
      } catch (error) { throw error instanceof MailboxReadError ? error : new MailboxReadError('unavailable'); }
    })();
    try { await refreshInFlight; } finally { refreshInFlight = undefined; }
  }
  async function get(path: string, params = new URLSearchParams()): Promise<GoogleResponse> {
    if (!accessToken || Date.now() >= expiresAt) await refresh();
    for (let attempt = 0; attempt < 2; attempt++) {
      let response: Response;
      try { response = await send(`${GMAIL}/${path}?${params}`, { method: 'GET', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15_000), headers: { Authorization: `Bearer ${accessToken}` } }); }
      catch { throw new MailboxReadError('unavailable'); }
      if (response.status === 401 && attempt === 0) { await refresh(); continue; }
      if (!response.ok) throw new MailboxReadError([401, 403].includes(response.status) ? 'reconnect' : 'unavailable');
      try { return await response.json() as GoogleResponse; } catch { throw new MailboxReadError('unavailable'); }
    }
    throw new MailboxReadError('reconnect');
  }
  async function verifyIdentity() {
    const profile = await get('profile');
    if (profile.emailAddress?.toLowerCase() !== MAILBOX) throw new MailboxReadError('wrong-mailbox');
  }
  return {
    async checkAccess() {
      await verifyIdentity();
      // Proves messages.list access without fetching bodies or returning message IDs.
      await get('messages', new URLSearchParams({ q: 'from:support@displayr.com', maxResults: '1', includeSpamTrash: 'false' }));
      return { readable: true as const, checkedAt: new Date().toISOString() };
    },
    async findInvitationCandidates(userId: string, requestedAt: Date) {
      const alias = displayrViewerAlias(userId);
      if (!Number.isFinite(requestedAt.getTime()) || requestedAt.getTime() > Date.now()) throw new MailboxReadError('invalid-request');
      await verifyIdentity();
      const candidates: { messageId: string; receivedAt: string }[] = [];
      let pageToken = '';
      for (let page = 0; page < 3; page++) {
        const params = new URLSearchParams({ q: `from:support@displayr.com to:${alias} after:${Math.floor(requestedAt.getTime() / 1000)}`, maxResults: '25', includeSpamTrash: 'false' });
        if (pageToken) params.set('pageToken', pageToken);
        const list = await get('messages', params);
        for (const item of list.messages || []) {
          if (!/^[a-zA-Z0-9_-]+$/.test(item.id)) continue;
          const fields = new URLSearchParams({ format: 'metadata' });
          for (const name of ['From', 'To', 'Subject']) fields.append('metadataHeaders', name);
          const message = await get(`messages/${encodeURIComponent(item.id)}`, fields);
          const header = (name: string) => message.payload?.headers?.filter(h => h.name.toLowerCase() === name.toLowerCase()).map(h => h.value).join(' ') || '';
          const addresses = (value: string): string[] => value.toLowerCase().match(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+/g) || [];
          const from = addresses(header('From'));
          const received = Number(message.internalDate);
          if (from.length !== 1 || from[0] !== 'support@displayr.com' || !addresses(header('To')).includes(alias) || !/invit/i.test(header('Subject')) || !Number.isFinite(received) || received < requestedAt.getTime() || received > Date.now()) continue;
          candidates.push({ messageId: item.id, receivedAt: new Date(received).toISOString() });
        }
        pageToken = list.nextPageToken || '';
        if (!pageToken) return { candidates, complete: true as const };
      }
      return { candidates, complete: false as const };
    },
  };
}
