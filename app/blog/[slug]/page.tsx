// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { fetchPostBySlug } from '@/lib/cms'
import { formatDate, estReadTimeFromHTML } from '@/lib/utils'
import InlineCTA from '@/components/blog/InlineCTA'
import RelatedReportsCTA from '@/components/blog/RelatedReportsCTA'
import SubscribeStrip from '@/components/blog/SubscribeStrip'

export const dynamicParams = true

// NOTE: Promise-based params to match your project typing
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPostBySlug(slug)
  return {
    title: post ? `${post.title} | EcoFocus Blog` : 'EcoFocus Blog',
    description: post?.excerpt || 'EcoFocus insights on sustainability and growth.',
    openGraph: post
      ? {
          title: post.title,
          description: post.excerpt || '',
          images: post.coverImage?.url ? [{ url: post.coverImage.url }] : undefined,
        }
      : undefined,
  }
}

// Promise-based params here too
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetchPostBySlug(slug)

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <h1 className="text-2xl font-semibold">Article not found</h1>
        <p className="mt-2 text-gray-600">
          Try browsing the{' '}
          <Link href="/blog" className="text-emerald-700 underline">
            blog
          </Link>
          .
        </p>
      </main>
    )
  }

  const readTime = post.readTime || estReadTimeFromHTML(post.html)

  return (
    <main className="bg-neutral-50">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-500" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-10 text-white">
          <p className="text-emerald-200 text-xs font-medium tracking-wide uppercase">EcoFocus Insights</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold leading-tight max-w-4xl">{post.title}</h1>
          <div className="mt-3 text-sm text-white/90 flex flex-wrap items-center gap-3">
            {post.author?.name && <span>{post.author.name}</span>}
            {post.publishedAt && <span>• {formatDate(post.publishedAt)}</span>}
            <span>• {readTime} min read</span>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-50 to-transparent" />
      </section>

      {/* COVER */}
      {post.coverImage?.url && (
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 -mt-12">
          <div className="relative h-[320px] w-full overflow-hidden rounded-2xl shadow ring-1 ring-black/5">
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* BODY */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <InlineCTA
          variant="demo"
          sub="See how teams use our dashboard for roadmap, pricing, and packaging decisions."
        />

        {post.html ? (
          <div
            className="prose prose-emerald max-w-none prose-headings:scroll-mt-24 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        ) : (
          <div className="prose prose-emerald max-w-none">
            <p>Article body coming soon.</p>
          </div>
        )}

        <InlineCTA variant="sample" sub="Grab a sample of the 2025 Sustainability Insights Report." />

        <RelatedReportsCTA />

        <div className="mt-12">
          <SubscribeStrip />
        </div>
      </article>
    </main>
  )
}

