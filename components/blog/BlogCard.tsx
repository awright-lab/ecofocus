'use client'
import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, Clock, ArrowRight } from 'lucide-react'
import { cx, formatDate } from '@/lib/utils'
import type { Post } from '@/lib/cms'

export default function BlogCard({ post }: { post: Post }) {
  return (
    <article
      className={cx(
        'group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 hover:shadow-lg transition-shadow',
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

      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {(post.categories || []).map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200"
            >
              {cat.name}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:underline decoration-emerald-500/40"
          >
            {post.title}
          </Link>
        </h3>

        {typeof post.excerpt === 'string' && post.excerpt && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
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
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-emerald-700 font-medium group-hover:gap-1.5"
          >
            Read <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
