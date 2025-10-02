import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPostBySlug, getPosts } from '@/lib/payload'
import { estReadTimeFromHTML } from '@/lib/utils'
import PostMeta from '@/components/blog/PostMeta'
import PostBody from '@/components/blog/PostBody'
import NewsletterBox from '@/components/blog/NewsletterBox'
import Breadcrumbs from '@/components/Breadcrumbs'
import SocialShare from '@/components/blog/SocialShare'
import TableOfContents from '@/components/blog/TableOfContents'
import RichTextRenderer from '@/components/RichText'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const dynamicParams = true

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<Record<string, string | string[]>>
}): Promise<Metadata> {
  const { slug } = await params
  const sp = (await searchParams) || {}
  const preview = Array.isArray(sp.preview) ? sp.preview[0] : (sp.preview as string | undefined)
  const post = await getPostBySlug(slug, preview)
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

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<Record<string, string | string[]>>
}) {
  const { slug } = await params
  const sp = (await searchParams) || {}
  const preview = Array.isArray(sp.preview) ? sp.preview[0] : (sp.preview as string | undefined)

  const post: any = await getPostBySlug(slug, preview)

  if (!post) {
    return (
      <>
        <Header />
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
        <Footer />
      </>
    )
  }

  const readTime = post.readTime || estReadTimeFromHTML(post.html || '')
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || ''
  const canonical = base ? `${base}/blog/${slug}` : `/blog/${slug}`

  const isLexical = (v: unknown) => v && typeof v === 'object' && 'root' in (v as any) && (v as any).root
  const isBlocks = (v: unknown) => Array.isArray(v)

  return (
    <>
      <Header />

      {/* PAGE BACKGROUND with subtle visual interest */}
      <main
        className="
          relative
          bg-neutral-50
          /* subtle grid pattern */
          [background-image:linear-gradient(to_right,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)]
          [background-size:28px_28px]
          [background-position:0_0,0_0]
        "
      >
        {/* soft radial washes (top-left + bottom-right) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(40rem 30rem at 8% 12%, rgba(16,185,129,0.08), rgba(0,0,0,0) 60%), radial-gradient(36rem 24rem at 92% 88%, rgba(59,130,246,0.07), rgba(0,0,0,0) 60%)',
          }}
        />

        {/* HERO */}
        <section className="relative isolate overflow-hidden min-h-[50svh] md:min-h-[56svh]">
          {/* Background image or brand gradient */}
          <div className="absolute inset-0 -z-10">
            {post.coverImage?.url ? (
              <Image
                src={post.coverImage.url}
                alt=""
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-500" />
            )}
          </div>

          {/* Readability scrim */}
          <div className="pointer-events-none absolute inset-0 -z-0">
            <div className="h-full w-full bg-gradient-to-br from-black/55 via-emerald-950/35 to-blue-950/45" />
          </div>

          {/* Content: more vertical centering + bigger title */}
          <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
            <div
              className="
                flex flex-col justify-center
                min-h-[50svh] md:min-h-[56svh]
                pt-24 sm:pt-28 pb-16
                text-white
              "
            >
              <p className="text-emerald-200 text-xs font-medium tracking-wide uppercase">
                EcoNugget Insights
              </p>
              <h1
                id="article-title"
                className="mt-2 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] max-w-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              >
                {post.title}
              </h1>
              <div className="mt-4">
                <PostMeta author={post.author} date={post.publishedAt} readTime={readTime} />
              </div>
            </div>
          </div>

          {/* Brand gradient border at bottom (replaces white fade) */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />
        </section>

        {/* BREADCRUMBS */}
        <Breadcrumbs
          maxWidth="max-w-5xl"
          items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]}
        />

        {/* BODY + SIDEBAR */}
        <section className="relative mx-auto max-w-5xl px-4 sm:px-6 py-10">
          {/* subtle highlight under article column to add depth */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent" />

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_320px]">
            <article>
              <div className="mb-6">
                <SocialShare url={canonical} title={post.title} />
              </div>

              <div
                id="article-body"
                className="
                  prose prose-neutral max-w-none
                  prose-headings:scroll-mt-28
                  /* optional: slightly higher contrast for body text on patterned bg */
                  prose-p:text-slate-800
                "
              >
                {post?.html ? (
                  <div className="rounded-2xl bg-white/90 backdrop-blur-[1px] ring-1 ring-black/5 shadow-sm px-6 sm:px-8 py-6">
                    <div dangerouslySetInnerHTML={{ __html: post.html }} />
                  </div>
                ) : isLexical(post?.body) ? (
                  <div className="rounded-2xl bg-white/90 backdrop-blur-[1px] ring-1 ring-black/5 shadow-sm px-6 sm:px-8 py-6">
                    <RichTextRenderer
                      content={post.body}
                      baseURL={process.env.NEXT_PUBLIC_CMS_URL}
                      debug={process.env.NODE_ENV !== 'production'}
                    />
                  </div>
                ) : isBlocks(post?.body) ? (
                  <div className="rounded-2xl bg-white/90 backdrop-blur-[1px] ring-1 ring-black/5 shadow-sm px-6 sm:px-8 py-6">
                    <PostBody blocks={post.body} html={undefined} />
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No content available.</p>
                )}
              </div>
            </article>

            <aside className="md:pt-2 space-y-6">
              <TableOfContents containerId="article-body" />
              <NewsletterBox />
              {/* Related Articles */}
              <RelatedList currentSlug={slug} topicSlug={post?.categories?.[0]?.slug} />
              <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900">Explore Our Reports</h3>
                <p className="mt-2 text-sm text-gray-600">Dive deeper into our latest research and insights.</p>
                <Link
                  href="/reports"
                  className="mt-3 inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Browse reports
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* JSON-LD Article schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.excerpt || '',
              image: post.coverImage?.url ? [post.coverImage.url] : undefined,
              datePublished: post.publishedAt,
              dateModified: post.updatedAt || post.publishedAt,
              author: [{ '@type': 'Organization', name: 'EcoFocus Team' }],
              publisher: { '@type': 'Organization', name: 'EcoFocus Research' },
              mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
            }),
          }}
        />
      </main>

      <Footer />
    </>
  )
}

async function RelatedList({ currentSlug, topicSlug }: { currentSlug?: string; topicSlug?: string }) {
  if (!topicSlug) {
    return (
      <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Related Articles</h3>
        <p className="mt-3 text-sm text-gray-500">More posts coming soon.</p>
      </div>
    )
  }
  try {
    const res = await getPosts({ topicSlug, limit: 4 })
    const related = (res.docs || []).filter((p) => p.slug !== currentSlug).slice(0, 3)
    return (
      <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Related Articles</h3>
        <div className="mt-3 space-y-3">
          {related.length === 0 ? (
            <p className="text-sm text-gray-500">More posts coming soon.</p>
          ) : (
            related.map((p) => (
              <div key={p.id}>
                <Link href={`/blog/${p.slug}`} className="text-sm font-medium text-emerald-800 hover:underline">
                  {p.title}
                </Link>
                {p.publishedAt && (
                  <p className="text-xs text-gray-500">
                    {new Date(p.publishedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    )
  } catch {
    return null
  }
}







