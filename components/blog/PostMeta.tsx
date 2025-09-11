'use client'

import { CalendarDays, Clock } from 'lucide-react'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import type { Author } from '@/lib/cms'

export default function PostMeta({ author, date, readTime }: { author?: Author | null; date?: string; readTime?: number }) {
  return (
    <div className="mt-3 flex items-center gap-3 text-sm text-white/90">
      {author?.name && (
        <span className="inline-flex items-center gap-2">
          {author?.avatarUrl && (
            <span className="relative h-6 w-6 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/20">
              <Image src={author.avatarUrl} alt={author.name} fill className="object-cover" />
            </span>
          )}
          {author.name}
        </span>
      )}
      {date && (
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          {formatDate(date)}
        </span>
      )}
      <span className="inline-flex items-center gap-1">
        <Clock className="h-4 w-4" />
        {readTime || 4} min read
      </span>
    </div>
  )
}

