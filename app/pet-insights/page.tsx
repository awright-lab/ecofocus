import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, PawPrint } from 'lucide-react'
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

export default async function PetInsightsPage() {
  let posts: Post[] = []
  let unavailable = false
  try {
    posts = await getPetNewsletters()
  } catch {
    unavailable = true
  }

  return (
    <>
      <Header />
      <main id="main" className="min-h-screen bg-slate-50 pt-20">
        <section className="bg-[#0F1A22] text-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-200">
              <PawPrint aria-hidden="true" className="h-4 w-4" /> EcoFocus Insights
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Big insights. For the world of pets.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">Explore our pet industry newsletters for research on pet owners, sustainability, and what builds trust in pet brands.</p>
            <a href="#newsletters" className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-300 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300">Explore the newsletters <ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
          </div>
        </section>
        <section id="newsletters" aria-labelledby="newsletters-title" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20">
          <h2 id="newsletters-title" className="text-3xl font-semibold text-slate-900">Pet industry newsletters</h2>
          <p className="mt-3 text-slate-600">Fresh perspectives, grounded in consumer research.</p>
          {posts.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
                  {post.coverImage?.url && <div className="relative aspect-[16/10]"><Image src={post.coverImage.url} alt={post.coverImage.alt || ''} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" /></div>}
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Pet Industry</span>
                    <h3 className="mt-3 text-xl font-semibold leading-snug text-slate-900 group-hover:underline">{post.title}</h3>
                    {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>}
                    <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-emerald-800">Read newsletter <ArrowRight aria-hidden="true" className="h-4 w-4" /></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
              <p>{unavailable ? 'Our newsletters are temporarily unavailable. Please try again shortly.' : 'Our pet industry newsletters will be available here soon.'}</p>
              {unavailable && <a href="/pet-insights" className="mt-4 inline-block font-semibold text-emerald-800 underline">Try again</a>}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
