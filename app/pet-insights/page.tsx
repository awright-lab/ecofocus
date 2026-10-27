import type { Metadata } from 'next'
import { PawPrint, Search } from 'lucide-react'
import Hero from '@/components/Hero'
import BlogCard from '@/components/blog/BlogCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getPetNewsletters } from '@/lib/payload'
import type { Post } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pet Industry Newsletters',
  description: 'Explore EcoFocus research on pet owners, sustainability, and what builds trust in pet brands.',
  alternates: { canonical: 'https://ecofocusresearch.com/pet-insights' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Pet Industry Newsletters | EcoFocus Research',
    description: 'Consumer insights for pet brands, all in one place.',
    url: 'https://ecofocusresearch.com/pet-insights',
  },
}

export default async function PetInsightsPage({ searchParams }: {
  searchParams: Promise<{ q?: string | string[] }>
}) {
  const params = await searchParams
  const query = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() || ''
  let posts: Post[] = []
  let unavailable = false
  try {
    posts = await getPetNewsletters()
  } catch {
    unavailable = true
  }

  const filtered = posts.filter(post => !query ||
    `${post.title} ${post.excerpt || ''}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      <Header />
      <main id="main" className="min-h-screen bg-neutral-50">
        <Hero
          variant="solutions"
          size="normal"
          headline="Pet industry insights"
          videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
          posterSrc="/images/hero-6-poster.jpg"
          overlay="dense"
        >
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm text-emerald-200 backdrop-blur">
              <PawPrint aria-hidden="true" className="h-4 w-4 shrink-0" /> EcoFocus Insights
            </span>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Fresh Pet Industry Insights That Move{' '}
              <span className="animate-gradient bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent">Decisions</span>
            </h1>
            <p className="mt-4 text-lg text-gray-200/90">Bite-size reads from our consumer research on pet owners, sustainability, and what builds trust in pet brands.</p>
          </div>
        </Hero>
        <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6">
          <form action="/pet-insights" method="get" role="search" className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="relative flex-1">
              <label htmlFor="pet-search" className="sr-only">Search pet newsletters</label>
              <Search aria-hidden="true" className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input id="pet-search" name="q" type="search" defaultValue={query} placeholder="Search pet newsletters" className="w-full rounded-lg border border-gray-300 py-1.5 pl-8 pr-3 text-sm text-gray-900" />
            </div>
            <button type="submit" className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Search</button>
          </form>
        </div>
        <section aria-label="Pet industry newsletters" className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600">{unavailable ? 'Newsletters unavailable.' : `Showing ${filtered.length} of ${posts.length} result${posts.length === 1 ? '' : 's'}`}</p>
            {query && <a href="/pet-insights" className="text-sm font-medium text-emerald-700 hover:underline">Clear search</a>}
          </div>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(post => <BlogCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
              <p>{unavailable ? 'Our newsletters are temporarily unavailable. Please try again shortly.' : query ? 'No pet newsletters match your search. Try another term.' : 'Our pet industry newsletters will be available here soon.'}</p>
              {unavailable && <a href="/pet-insights" className="mt-4 inline-block font-semibold text-emerald-800 underline">Try again</a>}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
