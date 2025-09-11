import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-secret') || req.headers.get('x-revalidate-secret')
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  let slug = ''
  try {
    const body = await req.json().catch(() => null)
    if (body?.slug) slug = String(body.slug).replace(/^\/+/, '')
  } catch {}

  revalidatePath('/blog')
  if (slug) revalidatePath(`/blog/${slug}`)
  return NextResponse.json({ revalidated: true, slug: slug || null })
}

