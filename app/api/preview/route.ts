import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = (searchParams.get('slug') || '').replace(/^\/+/, '')
  const token = searchParams.get('token') || searchParams.get('preview') || ''
  if (!slug || !token) {
    return NextResponse.json({ message: 'Missing slug or token' }, { status: 400 })
  }
  if (process.env.PAYLOAD_PREVIEW_SECRET && token !== process.env.PAYLOAD_PREVIEW_SECRET) {
    // Allow direct token passthrough if you prefer not to enforce equality
    // Here we require it to match when provided
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
  const target = new URL(`/blog/${slug}?preview=${encodeURIComponent(token)}`, req.nextUrl.origin)
  return NextResponse.redirect(target)
}

