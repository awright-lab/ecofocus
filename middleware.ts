import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;
  const isPortal = pathname.startsWith('/portal');
  const isPortalApi = pathname.startsWith('/api/portal');
  const isPortalLogin = pathname === '/portal/login';

  if (isPortal || isPortalApi) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  }

  if (isPortalLogin) {
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

  if ((isPortal || isPortalApi) && !isPortalLogin && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/portal/login';
    redirectUrl.searchParams.set('redirect', pathname + req.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/portal/:path*', '/api/portal/:path*'],
};
