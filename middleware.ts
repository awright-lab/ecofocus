// middleware.ts (project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MOBILE_UA = /iphone|ipod|ipad|android|windows phone|blackberry|bb10/i;

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const ua = req.headers.get('user-agent') || '';

  // Only redirect from the homepage
  if (pathname === '/' && MOBILE_UA.test(ua)) {
    const url = req.nextUrl.clone();
    url.pathname = '/mobile';
    url.search = search; // keep query params
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/mobile'],
};
