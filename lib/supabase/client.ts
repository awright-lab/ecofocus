import { createBrowserClient, type CookieOptions } from '@supabase/ssr';
import { PORTAL_REMEMBER_COOKIE, PORTAL_REMEMBER_MAX_AGE, getPortalCookieDomain } from '@/lib/portal/session';

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
  const shouldRemember =
    name === PORTAL_REMEMBER_COOKIE || readCookie(PORTAL_REMEMBER_COOKIE) === '1';
  const rememberedOptions =
    shouldRemember && options.maxAge === undefined
      ? {
          ...options,
          maxAge: PORTAL_REMEMBER_MAX_AGE,
          domain: options.domain ?? getPortalCookieDomain(window.location.host),
        }
      : {
          ...options,
          domain: options.domain ?? getPortalCookieDomain(window.location.host),
        };
  const encoded = encodeURIComponent(value);
  const parts = [`${name}=${encoded}`];

  parts.push(`Path=${rememberedOptions.path ?? '/'}`);
  if (rememberedOptions.domain) parts.push(`Domain=${rememberedOptions.domain}`);
  if (rememberedOptions.maxAge !== undefined) parts.push(`Max-Age=${rememberedOptions.maxAge}`);
  if (rememberedOptions.expires) parts.push(`Expires=${rememberedOptions.expires.toUTCString()}`);
  if (rememberedOptions.sameSite) parts.push(`SameSite=${rememberedOptions.sameSite}`);
  if (rememberedOptions.secure) parts.push('Secure');

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

export function setPortalRememberPreference(remember: boolean) {
  if (remember) {
    writeCookie(PORTAL_REMEMBER_COOKIE, '1', {
      path: '/',
      maxAge: PORTAL_REMEMBER_MAX_AGE,
      sameSite: 'lax',
      secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : true,
    });
    return;
  }

  removeCookie(PORTAL_REMEMBER_COOKIE, {
    path: '/',
    domain: typeof window !== 'undefined' ? getPortalCookieDomain(window.location.host) : undefined,
  });
}
