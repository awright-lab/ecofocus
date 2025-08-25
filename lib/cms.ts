export type Category = { id: string; slug: string; name: string; color?: string };
export type Tag = { id: string; slug: string; name: string };
export type Author = { id: string; name: string; role?: string; avatarUrl?: string };


export type Post = {
id: string;
title: string;
slug: string;
excerpt?: string;
coverImage?: { url: string; alt?: string } | null;
html?: string; // rendered content (MDX or HTML)
publishedAt?: string; // ISO
updatedAt?: string; // ISO
categories?: Category[];
tags?: Tag[];
author?: Author | null;
readTime?: number; // minutes
featured?: boolean
};


export type Paginated<T> = {
docs: T[];
totalDocs: number;
page: number;
totalPages: number;
limit: number;
};


const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL; // e.g. https://cms.example.com
const PAYLOAD_TOKEN = process.env.PAYLOAD_TOKEN; // optional if public


// --- MOCK DATA (safe to deploy now) -------------------------------------
const MOCK_CATEGORIES: Category[] = [
{ id: 'c1', slug: 'strategy', name: 'Strategy', color: '#00767a' },
{ id: 'c2', slug: 'data', name: 'Data', color: '#2C7FB8' },
{ id: 'c3', slug: 'sustainability', name: 'Sustainability', color: '#dd9e37' },
];


const MOCK_POSTS: Post[] = [
{
id: 'p1',
title: 'How Sustainability Drives Real Purchase Behavior in 2025',
slug: 'sustainability-drives-purchase-2025',
excerpt:
'What the newest wave of EcoFocus data shows about pricing, packaging, and the three levers leaders can pull now.',
coverImage: { url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop', alt: 'EcoFocus cover' },
html:
'<h2>Key Takeaways</h2><p>Consumers balance price with purpose. Our 4,000-person study reveals…</p>',
publishedAt: '2025-07-10T12:00:00.000Z',
categories: [MOCK_CATEGORIES[2], MOCK_CATEGORIES[1]],
tags: [{ id: 't1', slug: 'packaging', name: 'Packaging' }],
author: { id: 'a1', name: 'Elinor Gaida', role: 'VP, Research & Strategy' },
readTime: 6,
},
{
id: 'p2',
title: 'Dashboard Deep Dive: Finding Growth Signals in 90,000+ Data Points',
slug: 'dashboard-deep-dive-growth-signals',
excerpt:
'A practical walkthrough of how our interactive dashboard surfaces lead indicators—and how teams use it in sprint planning.',
coverImage: { url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1600&auto=format&fit=crop', alt: 'Dashboard' },
html: '<p>With crosstabs and cohort filters, you can…</p>',
publishedAt: '2025-06-28T12:00:00.000Z',
categories: [MOCK_CATEGORIES[1]],
tags: [{ id: 't2', slug: 'crosstabs', name: 'Crosstabs' }],
author: { id: 'a2', name: 'Allison Duncan', role: 'Director, Research & Insights' },
readTime: 5,
},
{
    id: 'p3',
    title: 'Messaging That Converts: “Sustainability as an Ingredient”',
    slug: 'sustainability-as-ingredient',
    excerpt:
    'Lead with the value, then layer the sustainability advantage. Why this framing lands with modern buyers.',
    coverImage: { url: 'https://images.unsplash.com/photo-1529336953121-a0ce66f6768f?q=80&w=1600&auto=format&fit=crop', alt: 'Ingredient message' },
    html: '<p>Like sugar in an apple—you can\'t see it, but…</p>',
    publishedAt: '2025-07-22T12:00:00.000Z',
    categories: [MOCK_CATEGORIES[0], MOCK_CATEGORIES[2]],
    tags: [{ id: 't3', slug: 'positioning', name: 'Positioning' }],
    author: { id: 'a3', name: 'Michael Croft', role: 'VP, Business Development' },
    readTime: 4,
    },
    ];
    
    
    // --- FETCHERS (Payload-ready; fall back to mock) ------------------------
    export async function fetchCategories(): Promise<Category[]> {
    try {
    if (!PAYLOAD_URL) return MOCK_CATEGORIES;
    const res = await fetch(`${PAYLOAD_URL}/api/categories?limit=100`, {
    headers: PAYLOAD_TOKEN ? { Authorization: `Bearer ${PAYLOAD_TOKEN}` } : undefined,
    // Revalidate occasionally but don’t block dev
    next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed categories');
    const json = await res.json();
    return (json?.docs || json) as Category[];
    } catch {
    return MOCK_CATEGORIES;
    }
    }
    
    
    export async function fetchPosts(params?: {
    page?: number; limit?: number; q?: string; category?: string; tag?: string; sort?: 'new'|'popular';
    }): Promise<Paginated<Post>> {
    const { page = 1, limit = 12, q, category, tag, sort = 'new' } = params || {};
    try {
    if (!PAYLOAD_URL) {
    // simple client-side filter on mock
    const filtered = MOCK_POSTS.filter(p =>
    (!q || p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt?.toLowerCase().includes(q.toLowerCase())) &&
    (!category || p.categories?.some(c => c.slug === category)) &&
    (!tag || p.tags?.some(t => t.slug === tag))
    ).sort((a,b) => new Date(b.publishedAt||'').getTime() - new Date(a.publishedAt||'').getTime());
    const start = (page-1)*limit; const docs = filtered.slice(start, start+limit);
    return { docs, totalDocs: filtered.length, page, totalPages: Math.ceil(filtered.length/limit), limit };
    }
    const paramsObj: Record<string, string> = { page: String(page), limit: String(limit) };
    if (q) paramsObj.where = JSON.stringify({ or: [
    { title: { like: q } }, { excerpt: { like: q } }
    ]});
    if (category) paramsObj.category = category; // align to your API field if needed
    if (tag) paramsObj.tag = tag;
    if (sort === 'new') paramsObj.sort = '-publishedAt';
    const qs = new URLSearchParams(paramsObj).toString();
    const res = await fetch(`${PAYLOAD_URL}/api/posts?${qs}`, {
        headers: PAYLOAD_TOKEN ? { Authorization: `Bearer ${PAYLOAD_TOKEN}` } : undefined,
        next: { revalidate: 60 },
        });
        if (!res.ok) throw new Error('Failed posts');
        const json = await res.json();
        return json as Paginated<Post>;
        } catch {
        // graceful fallback
        return { docs: MOCK_POSTS, totalDocs: MOCK_POSTS.length, page: 1, totalPages: 1, limit };
        }
        }
        
        
        export async function fetchPostBySlug(slug: string): Promise<Post | null> {
        try {
        if (!PAYLOAD_URL) return MOCK_POSTS.find(p => p.slug === slug) || null;
        const res = await fetch(`${PAYLOAD_URL}/api/posts?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`, {
        headers: PAYLOAD_TOKEN ? { Authorization: `Bearer ${PAYLOAD_TOKEN}` } : undefined,
        next: { revalidate: 60 },
        });
        if (!res.ok) throw new Error('Failed post');
        const json = await res.json();
        const doc = (json?.docs && json.docs[0]) || null;
        return doc as Post | null;
        } catch {
        return MOCK_POSTS.find(p => p.slug === slug) || null;
        }
        }