import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isPortalHost, toExternalPortalPath, toInternalPortalPath } from '@/lib/portal/host';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const PORTAL_DEV_COOKIE = 'ecofocus_portal_dev_user';
const PORTAL_DEV_BYPASS = process.env.PORTAL_DEV_BYPASS === 'true';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const portalHost = isPortalHost(req.headers.get('host'));
  const internalPathname = portalHost ? toInternalPortalPath(pathname) : pathname;
  const isPortal = internalPathname.startsWith('/portal');
  const isPortalApi = pathname.startsWith('/api/portal');
  const isPublicPortalApi =
    pathname === '/api/portal/password-reset/request' ||
    pathname === '/api/portal/password-reset/confirm';
  const isPortalLogin = internalPathname === '/portal/login';
  const isPortalForgotPassword = internalPathname === '/portal/forgot-password';
  const isPortalPasswordSetup = internalPathname === '/portal/set-password';
  const isPortalResetPassword = internalPathname === '/portal/reset-password';
  const isPortalDevUtilityPath =
    pathname === '/portal/dev-login' ||
    pathname === '/portal/dev-logout' ||
    pathname === '/portal/dev-usage';
  const isAllowedPortalHostPath =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/set-password' ||
    isPortal ||
    pathname.startsWith('/api/') ||
    pathname === '/auth/confirm' ||
    pathname === '/robots.txt' ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js';
  const hasDevPortalSession = PORTAL_DEV_BYPASS && Boolean(req.cookies.get(PORTAL_DEV_COOKIE)?.value);
  const res = NextResponse.next();

  if (isPortal || isPortalApi || portalHost) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Referrer-Policy', 'no-referrer');
    res.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    );
    res.headers.set(
      'Content-Security-Policy',
      "frame-src 'self' https://app.displayr.com; child-src 'self' https://app.displayr.com; frame-ancestors 'self';",
    );
  }

  if (portalHost && pathname === '/login') {
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = '/portal/login';
    return NextResponse.rewrite(rewriteUrl, { headers: res.headers });
  }

  if (portalHost && pathname === '/forgot-password') {
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = '/portal/forgot-password';
    return NextResponse.rewrite(rewriteUrl, { headers: res.headers });
  }

  if (portalHost && pathname === '/reset-password') {
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = '/portal/reset-password';
    return NextResponse.rewrite(rewriteUrl, { headers: res.headers });
  }

  if (portalHost && pathname === '/set-password') {
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = '/portal/set-password';
    return NextResponse.rewrite(rewriteUrl, { headers: res.headers });
  }

  if (portalHost && pathname === '/portal') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.search = req.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
  }

  if (portalHost && pathname.startsWith('/portal/') && !isPortalDevUtilityPath) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = toExternalPortalPath(pathname);
    redirectUrl.search = req.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
  }

  if (
    isPortalLogin ||
    isPortalForgotPassword ||
    isPortalPasswordSetup ||
    isPortalResetPassword ||
    isPortalDevUtilityPath
  ) {
    return res;
  }

  if ((isPortal || isPortalApi || portalHost) && hasDevPortalSession) {
    if (portalHost && !isAllowedPortalHostPath) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/home';
      redirectUrl.search = '';
      return NextResponse.redirect(redirectUrl);
    }

    if (portalHost && pathname === '/') {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/home';
      return NextResponse.redirect(redirectUrl);
    }

    if (portalHost && !pathname.startsWith('/api/') && pathname !== '/auth/confirm') {
      const rewriteUrl = req.nextUrl.clone();
      rewriteUrl.pathname = internalPathname;
      return NextResponse.rewrite(rewriteUrl, { headers: res.headers });
    }

    return res;
  }

  const safeEnv = SUPABASE_URL && SUPABASE_ANON_KEY;
  const supabase = safeEnv
    ? createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
          get(name) {
            return req.cookies.get(name)?.value;
          },
          set(name, value, options) {
            res.cookies.set({ name, value, ...options });
          },
          remove(name, options) {
            res.cookies.delete({ name, ...options });
          },
        },
      })
    : null;

  let session = null;
  if (supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      session = data.session;
    } catch (error) {
      console.warn('[middleware] Supabase session lookup failed; treating request as unauthenticated.', {
        pathname,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const portalDefaultPath = session ? '/home' : '/login';

  if (portalHost && pathname === '/') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = portalDefaultPath;
    return NextResponse.redirect(redirectUrl);
  }

  if (portalHost && !isAllowedPortalHostPath) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = portalDefaultPath;
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  if (
    (isPortal || isPortalApi) &&
    !isPublicPortalApi &&
    !isPortalLogin &&
    !isPortalForgotPassword &&
    !isPortalPasswordSetup &&
    !isPortalResetPassword &&
    !session
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = portalHost ? '/login' : '/portal/login';
    redirectUrl.searchParams.set('redirect', portalHost ? pathname + req.nextUrl.search : pathname + req.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  if (portalHost && !pathname.startsWith('/api/') && pathname !== '/auth/confirm') {
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = internalPathname;
    return NextResponse.rewrite(rewriteUrl, { headers: res.headers });
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images/|fonts/|favicon.ico).*)'],
};
