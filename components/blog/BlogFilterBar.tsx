'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { Category } from '@/lib/cms';
import { cx } from '@/lib/utils';
import { Search, SlidersHorizontal } from 'lucide-react';


export default function BlogFilterBar({ categories }: { categories: Category[] }) {
const router = useRouter();
const pathname = usePathname();
const params = useSearchParams();


const [q, setQ] = useState(params.get('q') || '');
const activeCategory = params.get('category') || '';
const sort = params.get('sort') || 'new';


const apply = (next: Record<string, string | null>) => {
const sp = new URLSearchParams(Array.from(params.entries()));
Object.entries(next).forEach(([k, v]) => v === null ? sp.delete(k) : sp.set(k, v));
router.push(`${pathname}?${sp.toString()}`);
};


return (
<div className="rounded-2xl bg-white/80 backdrop-blur p-4 ring-1 ring-black/5 shadow-sm">
<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
{/* Search */}
<div className="relative w-full md:max-w-md">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
<input
value={q}
onChange={(e) => setQ(e.target.value)}
placeholder="Search articles…"
className="w-full rounded-full border border-gray-200 pl-9 pr-24 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
onKeyDown={(e) => { if (e.key === 'Enter') apply({ q: q || null }); }}
/>
<button onClick={() => apply({ q: q || null })} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-emerald-600 px-3 py-1.5 text-white text-xs font-semibold">Search</button>
</div>


{/* Sort */}
<div className="flex items-center gap-2">
<span className="text-xs text-gray-500">Sort:</span>
{['new','popular'].map((key) => (
<button key={key} onClick={() => apply({ sort: key })}
className={cx(
'rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition',
sort === key ? 'bg-emerald-600 text-white ring-emerald-600' : 'bg-white text-gray-700 ring-gray-200 hover:bg-gray-50'
)}>{key === 'new' ? 'Newest' : 'Popular'}</button>
))}
</div>
</div>


{/* Categories */}
<div className="mt-4 flex flex-wrap gap-2">
<button onClick={() => apply({ category: null })}
className={cx('rounded-full px-3 py-1.5 text-xs font-medium ring-1',
!activeCategory ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-white text-gray-700 ring-gray-200')}>All</button>
{categories.map((c) => (
<button key={c.id} onClick={() => apply({ category: c.slug })}
className={cx('rounded-full px-3 py-1.5 text-xs font-medium ring-1',
activeCategory === c.slug ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-white text-gray-700 ring-gray-200')}>{c.name}</button>
))}
</div>
</div>
);
}