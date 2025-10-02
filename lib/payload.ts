// payload.ts
import type { Paginated, Post, Category as Topic, Author } from './cms'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, '')
const CMS_API_TOKEN = process.env.CMS_API_TOKEN

type GetPostsParams = {
  page?: number
  limit?: number
  q?: string
  topicSlug?: string
  draftToken?: string
}

/* ------------------------------ fetch helpers ------------------------------ */

function withHeaders(init?: RequestInit): RequestInit {
  const headers: HeadersInit = {
    ...(init?.headers || {}),
  }
  if (CMS_API_TOKEN) {
    ;(headers as any).Authorization = `Bearer ${CMS_API_TOKEN}`
  }
  return { ...init, headers }
}

/** Never cache (good for interactive filters) */
function noStore(init?: RequestInit): RequestInit {
  return withHeaders({ ...init, cache: 'no-store', next: { revalidate: 0 } as any })
}

/** Light caching (ok for taxonomies / topics) */
function maybeRevalidate(init?: RequestInit): RequestInit {
  return withHeaders({ ...init, next: { revalidate: 60 } as any })
}

/* --------------------------------- mappers --------------------------------- */

function mapImage(node: any): { url: string; alt?: string } | null {
  if (!node) return null
  if (typeof node === 'string') return { url: node }
  const url =
    node?.url ||
    node?.src ||
    node?.sizes?.[0]?.url ||
    node?.large?.url ||
    node?.filename ||
    node?.secure_url
  if (!url) return null
  return { url, alt: node?.alt || node?.caption }
}

function isRich(v: any) {
  return v && typeof v === 'object' && ('root' in v || Array.isArray(v))
}

function richToText(v: any): string {
  try {
    const walk = (node: any): string => {
      if (!node) return ''
      if (Array.isArray(node)) return node.map(walk).join('')
      if (node.type === 'text') return node.text || ''
      if (node.children) return node.children.map(walk).join('')
      if (node.root) return walk(node.root)
      return ''
    }
    return walk(v)
  } catch {
    return ''
  }
}

function mapAuthor(a: any): Author | null {
  if (!a) return null
  const nm = a.name || [a.firstName, a.lastName].filter(Boolean).join(' ')
  return {
    id: String(a.id ?? a._id ?? a.slug ?? a.email ?? 'author'),
    name: isRich(nm) ? richToText(nm) : nm || 'Author',
    role: a.role || a.title,
    avatarUrl: a.avatar?.url || a.image?.url || a.photo?.url,
  }
}

function mapTopics(arr: any[]): Topic[] {
  if (!Array.isArray(arr)) return []
  return arr.map((t) => ({
    id: String(t.id ?? t._id ?? t.slug ?? t.name),
    slug: typeof t.slug === 'string' ? t.slug : String(t.id ?? t._id ?? ''),
    name:
      typeof t.name === 'string'
        ? t.name
        : isRich(t.name)
        ? richToText(t.name)
        : t.title || t.slug || 'Topic',
    color: t.color,
  }))
}

function mapPost(p: any): Post {
  const titleVal = p.title
  const dekVal = p.dek ?? p.excerpt ?? p.description
  return {
    id: String(p.id ?? p._id ?? p.slug),
    title: isRich(titleVal) ? richToText(titleVal) : titleVal,
    slug: p.slug,
    excerpt: isRich(dekVal) ? richToText(dekVal) : dekVal,
    coverImage: mapImage(p.hero || p.heroImage || p.cover || p.image || p.featuredImage),
    html: p.html, // optional; project prefers blocks via `body`
    publishedAt: p.publishedAt || p._publishedAt || p.createdAt || p.updatedAt,
    updatedAt: p.updatedAt,
    categories: mapTopics(p.topics || p.categories || []),
    tags: Array.isArray(p.tags)
      ? p.tags.map((t: any) => ({
          id: String(t.id ?? t._id ?? t.slug),
          slug: typeof t.slug === 'string' ? t.slug : String(t.id ?? ''),
          name:
            typeof t.name === 'string'
              ? t.name
              : isRich(t.name)
              ? richToText(t.name)
              : t.title || t.slug,
        }))
      : undefined,
    author: mapAuthor(p.author),
    readTime: p.readTime,
    featured: !!p.featured,
  }
}

/* ------------------------------- public APIs ------------------------------- */

export async function getTopics(): Promise<Topic[]> {
  if (!CMS_URL) return []
  const url = `${CMS_URL}/api/topics?depth=0&limit=100`
  const res = await fetch(url, maybeRevalidate())
  if (!res.ok) return []
  const data = await res.json()
  const docs = Array.isArray(data?.docs) ? data.docs : Array.isArray(data) ? data : []
  return mapTopics(docs)
}

/** Resolve a topic ID by slug (robust way to filter relationships in Payload) */
async function getTopicIdBySlug(slug?: string, init?: RequestInit): Promise<string | undefined> {
  if (!CMS_URL || !slug) return
  const url = new URL(`${CMS_URL}/api/topics`)
  url.searchParams.set('limit', '1')
  url.searchParams.set('where[slug][equals]', slug)

  const res = await fetch(url.toString(), withHeaders(init))
  if (!res.ok) return
  const data = await res.json()
  const doc = data?.docs?.[0]
  const id = doc?.id ?? doc?._id
  return id ? String(id) : undefined
}

export async function getPosts(params: GetPostsParams = {}): Promise<Paginated<Post>> {
  const { page = 1, limit = 12, q, topicSlug, draftToken } = params
  if (!CMS_URL) {
    return { docs: [], totalDocs: 0, page: 1, totalPages: 1, limit }
  }

  // Resolve topic ID first — filtering relationship fields by slug is unreliable
  const topicId = await getTopicIdBySlug(topicSlug, noStore())

  const url = new URL(`${CMS_URL}/api/posts`)
  url.searchParams.set('depth', '2')
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('sort', '-publishedAt')

  // Build Payload "where" object
  const clauses: any[] = []
  if (q) {
    clauses.push({
      or: [
        { title: { like: q } },
        { dek: { like: q } },
        { excerpt: { like: q } },
      ],
    })
  }
  if (topicId) {
    // Relationship field filter: topics[in]=[topicId]
    clauses.push({ topics: { in: [topicId] } })
  }
  if (clauses.length === 1) {
    url.searchParams.set('where', JSON.stringify(clauses[0]))
  } else if (clauses.length > 1) {
    url.searchParams.set('where', JSON.stringify({ and: clauses }))
  }

  if (draftToken) {
    url.searchParams.set('draft', 'true')
    url.searchParams.set('previewToken', draftToken)
  }

  // ❗ Use noStore so UI filters reflect immediately on each querystring change
  const init = noStore()
  const res = await fetch(url.toString(), init)
  if (!res.ok) {
    return { docs: [], totalDocs: 0, page: 1, totalPages: 1, limit }
  }

  const data = await res.json()
  const docs = (data?.docs ?? []).map(mapPost)
  return {
    docs,
    totalDocs: data?.totalDocs ?? docs.length,
    page: data?.page ?? page,
    totalPages: data?.totalPages ?? 1,
    limit: data?.limit ?? limit,
  }
}

export async function getPostBySlug(slug: string, draftToken?: string): Promise<any | null> {
  if (!CMS_URL) return null
  const url = new URL(`${CMS_URL}/api/posts`)
  url.searchParams.set('depth', '2')
  url.searchParams.set('limit', '1')
  // Bracketed where is reliable for single-field lookup
  url.searchParams.set('where[slug][equals]', slug)

  const init = draftToken ? noStore() : maybeRevalidate()
  const res = await fetch(url.toString(), init)
  if (!res.ok) return null

  const data = await res.json()
  const doc = data?.docs?.[0]
  if (!doc) return null

  const post = mapPost(doc) as any
  post.body = doc.body || []

  // Prefer blocks over legacy HTML when present
  if (Array.isArray(post.body) ? post.body.length > 0 : !!post.body) {
    post.html = undefined
  }

  return post
}


