// app/blog/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchPosts, fetchCategories } from '@/lib/cms'
import BlogCard from '@/components/blog/BlogCard'
import BlogFilterBar from '@/components/blog/BlogFilterBar'
import SubscribeStrip from '@/components/blog/SubscribeStrip'
import BlogHero from '@/components/blog/BlogHero'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArticleFeedMobile from '@/components/blog/ArticleFeedMobile'

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
    <>
      <Header />

      <main className="bg-neutral-50">
        <BlogHero />

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
            {(q || category) && (
              <Link
                href="/blog"
                className="text-sm font-medium text-emerald-700 hover:underline decoration-emerald-500/40"
              >
                Clear filters
              </Link>
            )}
          </div>

          {/* Mobile: compact, infinite-friendly list */}
          <ArticleFeedMobile
            initial={{
              docs,
              page,
              totalPages,
              totalDocs,
            }}
            q={q}
            category={category}
            sort={sort}
          />

          {/* Desktop / tablet: grid with pagination */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="hidden md:flex mt-8 items-center justify-center gap-2">
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

          <div className="mt-12">
            <SubscribeStrip />
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}



