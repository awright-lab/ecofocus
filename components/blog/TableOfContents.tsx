'use client'

import { useEffect, useMemo, useState } from 'react'

type Item = { id: string; text: string; level: number }

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

export default function TableOfContents({ containerId }: { containerId: string }) {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const root = document.getElementById(containerId)
    if (!root) return
    const hs = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[]
    const entries: Item[] = hs.map((el) => {
      let id = el.id
      if (!id) {
        id = slugify(el.textContent || '')
        if (id) el.id = id
      }
      const level = el.tagName === 'H3' ? 3 : 2
      return { id, text: el.textContent || '', level }
    }).filter((e) => e.id && e.text)
    setItems(entries)
  }, [containerId])

  if (items.length === 0) return null

  return (
    <nav className="rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">On this page</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? 'pl-3' : ''}>
            <a href={`#${it.id}`} className="text-emerald-800 hover:underline">
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

