// app/blog/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchPosts, fetchCategories } from '@/lib/cms'
import BlogCard from '@/components/blog/BlogCard'
import BlogFilterBar from '@/components/blog/BlogFilterBar'
import SubscribeStrip from '@/components/blog/SubscribeStrip'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Insights Blog | EcoFocus Research',
  description:
    'Short, actionable articles on sustainability, consumer behavior, and data-driven strategy.',
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams?: Record<string, string | string[]>
}) {
  // Accept string or first element of an array
  const q =
    Array.isArray(searchParams?.q) ? searchParams?.q[0] : (searchParams?.q as string | undefined)
  const category = Array.isArray(searchParams?.category)
    ? searchParams?.category[0]
    : (searchParams?.category as string | undefined)
  const sort = (Array.isArray(searchParams?.sort)
    ? searchParams?.sort[0]
    : searchParams?.sort) as 'new' | 'popular' | undefined
  const page = Number(Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page || 1)

  const [cats, paged] = await Promise.all([
    fetchCategories(),
    fetchPosts({ q, category, sort: sort || 'new', page, limit: 12 }),
  ])

  const { docs, totalDocs, totalPages } = paged

  return (
    <main className="bg-neutral-50">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-500" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 text-white">
          <p className="text-emerald-200 text-sm font-medium tracking-wide uppercase">EcoFocus Insights</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Data-backed ideas that move decisions
          </h1>
          <p className="mt-3 max-w-2xl text-white/90">
            We turn 90,000+ data points into practical guidance for product, brand, and sustainability teams. Read,
            apply, repeat.
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-50 to-transparent" />
      </section>

      {/* FILTERS */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-10 relative z-10">
        <BlogFilterBar categories={cats} />
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        {/* Results meta */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {totalDocs === 0
              ? 'No results.'
              : `Showing ${docs.length} of ${totalDocs} result${totalDocs === 1 ? '' : 's'}`}
          </p>
          {/* Optional: quick clear when filters/search active */}
          {(q || category) && (
            <Link
              href="/blog"
              className="text-sm font-medium text-emerald-700 hover:underline decoration-emerald-500/40"
            >
              Clear filters
            </Link>
          )}
        </div>

        {/* GRID / Empty */}
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
              const sp = new URLSearchParams()
              if (q) sp.set('q', q)
              if (category) sp.set('category', category)
              if (sort) sp.set('sort', sort)
              sp.set('page', String(n))
              return (
                <Link
                  key={n}
                  href={`/blog?${sp.toString()}`}
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

        {/* Subscribe + Cross-sell */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <SubscribeStrip />
          </div>
          <div className="md:col-span-1">
            <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">New here?</h3>
              <p className="text-sm text-gray-600 mt-1">
                See the Sustainability Insights Report and Dashboard seat licensing options.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/reports"
                  className="rounded-full bg-emerald-600 text-white text-sm px-4 py-2 font-semibold text-center"
                >
                  Explore Reports
                </Link>
                <Link
                  href="/contact?type=demo"
                  className="rounded-full border border-gray-300 text-gray-900 text-sm px-4 py-2 font-semibold text-center"
                >
                  Request a Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
