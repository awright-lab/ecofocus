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

      <main className="bg-neutral-50">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-500" />
          <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-10 text-white">
            <p className="text-emerald-200 text-xs font-medium tracking-wide uppercase">EcoFocus Insights</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold leading-tight max-w-4xl">{post.title}</h1>
            <PostMeta author={post.author} date={post.publishedAt} readTime={readTime} />
          </div>
          <div className="absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-t from-neutral-50 to-transparent" />
        </section>

        {/* COVER */}
        {post.coverImage?.url && (
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 mt-4">
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

        {/* BREADCRUMBS */}
        <Breadcrumbs
          maxWidth="max-w-5xl"
          items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]}
        />

        {/* BODY + SIDEBAR */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_320px]">
            <article>
              <div className="mb-6">
                <SocialShare url={canonical} title={post.title} />
              </div>

              <div id="article-body" className="prose prose-neutral max-w-none">
                {post?.html ? (
                  // 1) Legacy HTML path
                  <div dangerouslySetInnerHTML={{ __html: post.html }} />
                ) : isLexical(post?.body) ? (
                  // 2) Lexical JSON path
                  <RichTextRenderer
                    content={post.body}
                    baseURL={process.env.NEXT_PUBLIC_CMS_URL}
                    debug={process.env.NODE_ENV !== 'production'}
                  />
                ) : isBlocks(post?.body) ? (
                  // 3) Blocks layout path (uses your existing renderer)
                  <PostBody blocks={post.body} html={undefined} />
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




