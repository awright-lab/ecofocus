import { timingSafeEqual } from 'node:crypto';

// Fixed reasons only; never return credentials, lengths, hashes, or headers.
export function callbackAuthenticationFailure(headers: Headers, secret: string | undefined) {
  if (headers.has('origin')) return 'CALLBACK_ORIGIN_PRESENT';
  if (!secret) return 'CALLBACK_SECRET_MISSING';
  if (secret.length < 32) return 'CALLBACK_SECRET_TOO_SHORT';
  // Hosting intermediaries can consume Authorization. Prefer a dedicated
  // server-to-server header; retain the old header during rolling deployment.
  const header = headers.get('x-ecofocus-gateway-authorization') ?? headers.get('authorization');
  if (!header) return 'CALLBACK_AUTHORIZATION_MISSING';
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return 'CALLBACK_CREDENTIAL_MISMATCH';
  return null;
}
