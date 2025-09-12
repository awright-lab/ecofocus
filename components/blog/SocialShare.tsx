'use client'

import { useMemo, useState } from 'react'
import { Copy, Check, Twitter, Linkedin } from 'lucide-react'

export default function SocialShare({ url, title }: { url?: string; title?: string }) {
  const [copied, setCopied] = useState(false)
  const href = useMemo(() => url || (typeof window !== 'undefined' ? window.location.href : ''), [url])
  const text = title || ''

  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(href)}`
  const tw = `https://twitter.com/intent/tweet?url=${encodeURIComponent(href)}&text=${encodeURIComponent(text)}`

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-gray-500">Share:</span>
      <a
        href={li}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 ring-1 ring-gray-200 text-emerald-800 hover:bg-emerald-50"
      >
        <Linkedin className="h-4 w-4" /> LinkedIn
      </a>
      <a
        href={tw}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 ring-1 ring-gray-200 text-emerald-800 hover:bg-emerald-50"
      >
        <Twitter className="h-4 w-4" /> X
      </a>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 ring-1 ring-gray-200 text-emerald-800 hover:bg-emerald-50"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  )
}

