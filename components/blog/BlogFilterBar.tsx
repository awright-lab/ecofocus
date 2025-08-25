'use client'
import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import type { Category } from '@/lib/cms'

export default function BlogFilterBar({ categories }: { categories: Category[] }) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 flex items-center gap-4">
      {/* Search field */}
      <div className="flex-1">
        <label htmlFor="search" className="sr-only">Search</label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            id="search"
            placeholder="Search articles"
            className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-1.5 text-sm"
          />
        </div>
      </div>

      {/* Toggle filters */}
      <button
        type="button"
        onClick={() => setShowFilters((p) => !p)}
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <SlidersHorizontal className="h-4 w-4 text-gray-500" />
        Filters
      </button>

      {/* Example filter panel */}
      {showFilters && (
        <div className="absolute right-4 top-20 w-64 rounded-xl border bg-white p-4 shadow-lg">
          <h4 className="font-semibold text-sm mb-2">Categories</h4>
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.id}>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" name="categories" value={cat.slug} />
                  {cat.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
