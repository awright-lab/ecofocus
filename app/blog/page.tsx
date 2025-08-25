// app/blog/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchPosts, fetchCategories } from '@/lib/cms'
import BlogCard from '@/components/blog/BlogCard'
import BlogFilterBar from '@/components/blog/BlogFilterBar'
import SubscribeStrip from '@/components/blog/SubscribeStrip'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'EcoNuggets – Insights Blog | EcoFocus Research',
  description:
    'Short, actionable “EcoNuggets” on sustainability, consumer behavior, and data-driven strategy.',
}

const pickFirst = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default async function BlogIndex({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[]>>
}) {
  const sp = (await searchParams) || {}

  const q = pickFirst(sp.q)
  const category = pickFirst(sp.category)
  const sort = (pickFirst(sp.sort) as 'new' | 'popular' | undefined) || 'new'
  const page = Number(pickFirst(sp.page) || 1)

  const [cats, paged] = await Promise.all([
    fetchCategories(),
    fetchPosts({ q, category, sort, page, limit: 12 }),
  ])

  const { docs, totalDocs, totalPages } = paged

  return (
    <main className="bg-neutral-50">
      {/* HERO — mirrors homepage gradient + EcoNuggets label */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-500" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-14 text-white">
          <p className="text-emerald-200 text-xs font-semibold tracking-wide uppercase">EcoNuggets</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Fresh sustainability insights that move decisions
          </h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Bite‑size reads from our syndicated research and dashboard workflows—built to convert learnings into action.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/reports"
              className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/30 hover:bg-white/20"
            >
              Explore Reports
            </Link>
            <Link
              href="/contact?type=demo"
              className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              View Dashboard Demo
            </Link>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-neutral-50 to-transparent" />
      </section>

      {/* FILTERS */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-10 relative z-10">
        <BlogFilterBar categories={cats} />
      </div>

      {/* GRID + META */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {totalDocs === 0
              ? 'No results.'
              : `Showing ${docs.length} of ${totalDocs} result${totalDocs === 1 ? '' : 's'}`}
          </p>
          {(q || category) && (
            <Link
              href="/blog"
              className="text-sm font-medium text-emerald-700 hover:underline decoration-emerald-500/40"
            >
              Clear filters
            </Link>
          )}
        </div>

        {docs.length === 0 ? (
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-8 text-center text-gray-600">
            <p>No articles match your filters.</p>
            <div className="mt-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900"
              >
                Reset filters
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1
              const isActive = n === page
              const spOut = new URLSearchParams()
              if (q) spOut.set('q', q)
              if (category) spOut.set('category', category)
              if (sort) spOut.set('sort', sort)
              spOut.set('page', String(n))
              return (
                <Link
                  key={n}
                  href={`/blog?${spOut.toString()}`}
                  className={
                    isActive
                      ? 'rounded-full bg-emerald-600 text-white px-3 py-1 text-sm'
                      : 'rounded-full bg-white ring-1 ring-gray-200 px-3 py-1 text-sm text-gray-700'
                  }
                >
                  {n}
                </Link>
              )
            })}
          </div>
        )}

        {/* Subscribe (HubSpot) */}
        <div className="mt-12">
          <SubscribeStrip />
        </div>
      </section>
    </main>
  )
}

