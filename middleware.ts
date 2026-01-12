import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const LOGIN_PATH = '/login';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

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

  const { data: sessionData } = supabase ? await supabase.auth.getSession() : { data: null };
  const session = sessionData?.session;

  const pathname = req.nextUrl.pathname;
  const isPortal = pathname.startsWith('/portal');
  const isPortalApi = pathname.startsWith('/api/portal');

  if ((isPortal || isPortalApi) && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = LOGIN_PATH;
    redirectUrl.searchParams.set('redirect', pathname + req.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  if (isPortal || isPortalApi) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  }

  return res;
}

export const config = {
  matcher: ['/portal/:path*', '/api/portal/:path*'],
};
