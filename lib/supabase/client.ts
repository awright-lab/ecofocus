import { createBrowserClient, type CookieOptions } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

function readCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const value = document.cookie
    ?.split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
  return value ? decodeURIComponent(value) : undefined;
}

function writeCookie(name: string, value: string, options: CookieOptions = {}) {
  if (typeof document === 'undefined') return;
  const encoded = encodeURIComponent(value);
  const parts = [`${name}=${encoded}`];

  parts.push(`Path=${options.path ?? '/'}`);
  if (options.domain) parts.push(`Domain=${options.domain}`);
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push('Secure');

  document.cookie = parts.join('; ');
}

function removeCookie(name: string, options: CookieOptions = {}) {
  writeCookie(name, '', { ...options, maxAge: 0, expires: new Date(0) });
}

export function getBrowserSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase client env vars (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).');
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get: (name: string) => readCookie(name),
      set: (name: string, value: string, options: CookieOptions) => writeCookie(name, value, options),
      remove: (name: string, options: CookieOptions) => removeCookie(name, options),
    },
  });
}
