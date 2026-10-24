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
      <main id="main" className="min-h-screen bg-white pt-14 md:pt-20">
        <section className="relative overflow-hidden text-white bg-[linear-gradient(180deg,#0F1A22_0%,#11222C_55%,#142A35_100%)]">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-28 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-32 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
          <figure className="absolute inset-y-6 right-0 hidden md:block">
            <div className="relative h-full w-[50vw] lg:w-[52vw] xl:w-[54vw]">
              <div className="absolute inset-0 overflow-hidden rounded-l-3xl bg-black/10 ring-1 ring-white/5 shadow-[0_30px_60px_rgba(0,0,0,.45)]">
                <Image src="/images/newsletter-bg.png" alt="Macro tech-leaf texture representing sustainable innovation" fill priority sizes="54vw" className="select-none object-cover object-[60%_50%]" />
                <div aria-hidden="true" className="absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-[#0F1A22]/80 via-[#0F1A22]/35 to-transparent lg:w-48" />
              </div>
            </div>
          </figure>
          <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-16 sm:px-6 md:mr-[50vw] md:min-h-[78vh] lg:mr-[52vw] lg:py-24 xl:mr-[54vw]">
            <div className="w-full max-w-xl md:ml-auto md:translate-x-[1vw] lg:translate-x-[1.5vw]">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200 ring-1 ring-white/15">
                <PawPrint aria-hidden="true" className="h-4 w-4 shrink-0" /> EcoFocus Insights
              </span>
              <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
                Big insights.{' '}
                <span className="animate-gradient bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent">For the world of pets.</span>
              </h1>
              <p className="mt-4 text-lg text-white/85">Explore our pet industry newsletters for research on pet owners, sustainability, and what builds trust in pet brands.</p>
              <a href="#newsletters" className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-300 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300">Explore the newsletters <ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
            </div>
          </div>
          <figure className="mt-8 md:hidden">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
              <Image src="/images/newsletter-bg.png" alt="Macro tech-leaf texture representing sustainable innovation" fill sizes="100vw" className="object-cover object-center" />
            </div>
          </figure>
          <div aria-hidden="true" className="absolute bottom-0 left-0 h-1 w-full animate-gradient bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />
        </section>
        <section id="newsletters" aria-labelledby="newsletters-title" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16">
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
