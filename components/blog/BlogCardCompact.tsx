'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, Clock } from 'lucide-react'
import type { Post } from '@/lib/cms'
import { formatDate } from '@/lib/utils'

export default function BlogCardCompact({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-label={`Read: ${post.title}`}
      className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
    >
      {post.coverImage?.url ? (
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 35vw, 200px"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-20 w-28 shrink-0 rounded-lg bg-emerald-50 ring-1 ring-emerald-200" />
      )}

      <div className="min-w-0">
        {/* chips (first 2) */}
        {!!post.categories?.length && (
          <div className="mb-1 flex flex-wrap gap-1">
            {post.categories.slice(0, 2).map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-200"
              >
                {c.name}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {post.title}
        </h3>

        {typeof post.excerpt === 'string' && post.excerpt && (
          <p className="mt-1 text-xs text-gray-600 line-clamp-2">{post.excerpt}</p>
        )}

        <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500">
          {post.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(post.publishedAt)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime || 4} min
          </span>
        </div>
      </div>
    </Link>
  )
}
