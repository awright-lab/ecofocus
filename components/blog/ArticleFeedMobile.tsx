'use client'

import { useEffect, useRef, useState } from 'react'
import BlogCardCompact from '@/components/blog/BlogCardCompact'
import type { Post } from '@/lib/cms'

type Paged = {
  docs: Post[]
  page: number
  totalPages: number
  totalDocs: number
}

type Props = {
  initial: Paged
  q?: string
  category?: string
  sort?: 'new' | 'popular'
  limit?: number
}

export default function ArticleFeedMobile({
  initial,
  q,
  category,
  sort = 'new',
  limit = 12,
}: Props) {
  const [items, setItems] = useState<Post[]>(initial.docs)
  const [page, setPage] = useState<number>(initial.page ?? 1)
  const [totalPages] = useState<number>(initial.totalPages)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(page >= totalPages)

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const cmsBase = process.env.NEXT_PUBLIC_CMS_URL // e.g. https://ecofocus-cms.onrender.com

  // Build a Payload URL for page N (public posts)
  const buildUrl = (n: number) => {
    if (!cmsBase) return null
    const url = new URL(`${cmsBase.replace(/\/$/, '')}/api/posts`)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('page', String(n))
    url.searchParams.set('depth', '2')
    // naive filters; adjust to your schema if needed
    if (q) url.searchParams.set('where[title][like]', q)
    if (category) url.searchParams.set('where[topics.slug][equals]', category)
    if (sort === 'popular') url.searchParams.set('sort', '-views') // example; swap for your field
    else url.searchParams.set('sort', '-publishedAt')
    return url.toString()
  }

  async function loadNext() {
    if (loading || done) return
    if (!cmsBase) {
      // No public CMS base configured; stop at initial
      setDone(true)
      return
    }

    const nextPage = page + 1
    if (nextPage > totalPages) {
      setDone(true)
      return
    }

    setLoading(true)
    try {
      const url = buildUrl(nextPage)
      if (!url) return
      const res = await fetch(url, { next: { revalidate: 0 }, cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load more posts')
      const data: Paged = await res.json()
      setItems((prev) => prev.concat(data.docs ?? []))
      setPage(data.page ?? nextPage)
      if ((data.page ?? nextPage) >= (data.totalPages ?? totalPages)) setDone(true)
    } catch {
      // fail closed—user can try manual button again
    } finally {
      setLoading(false)
    }
  }

  // Auto-load when sentinel enters viewport
  useEffect(() => {
    if (!sentinelRef.current || done) return
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) loadNext()
      },
      { rootMargin: '600px 0px' } // prefetch early
    )
    io.observe(sentinelRef.current)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentinelRef.current, done, page, q, category, sort])

  return (
    <div className="md:hidden">
      <div className="grid grid-cols-1 gap-3">
        {items.map((p) => (
          <BlogCardCompact key={p.id} post={p} />
        ))}
      </div>

      {/* Load more actions */}
      {!done && (
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={loadNext}
            disabled={loading}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      {/* Auto-load sentinel */}
      {!done && <div ref={sentinelRef} className="h-6" />}

      {/* End marker */}
      {done && (
        <p className="mt-6 text-center text-xs text-gray-500">
          You’ve reached the end.
        </p>
      )}
    </div>
  )
}
