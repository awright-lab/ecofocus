'use client'
import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, Clock, ArrowRight } from 'lucide-react'
import { cx, formatDate } from '@/lib/utils'
import type { Post } from '@/lib/cms'

export default function BlogCard({ post }: { post: Post }) {
  const excerpt = typeof post.excerpt === 'string' ? post.excerpt.trim() : ''

  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-label={`Read: ${post.title}`}
      className={cx(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600',
        post.featured && 'ring-2 ring-emerald-600 shadow-md'
      )}
    >
      <div className="relative h-52 w-full overflow-hidden">
        {post.coverImage?.url && (
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex min-h-[3rem] max-h-[3rem] flex-wrap content-start gap-2 overflow-hidden">
          {(post.categories || []).map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200"
            >
              {cat.name}
            </span>
          ))}
        </div>

        <h3 className="min-h-[3.5rem] text-lg font-semibold leading-snug text-gray-900">
          <span className="line-clamp-2 group-hover:underline decoration-emerald-500/40">
            {post.title}
          </span>
        </h3>

        <div className="mt-2 min-h-[4.5rem]">
          {excerpt ? <p className="text-sm text-gray-600 line-clamp-3">{excerpt}</p> : null}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime || 4} min
            </span>
          </div>
          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 group-hover:gap-1.5">
            Read <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
