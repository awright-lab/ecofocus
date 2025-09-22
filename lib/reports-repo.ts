// lib/reports-repo.ts
import "server-only";

/* =========================
   Types
   ========================= */

export type Access = "All" | "Free" | "Premium";
export type Sort = "Newest" | "AtoZ";

export type ListReportsInput = {
  q?: string;
  year?: string;     // "All" or "2025"
  topic?: string;    // slug or "All"
  type?: string;     // slug or "All"
  access?: Access;   // "All" | "Free" | "Premium"
  sort?: Sort;       // "Newest" | "AtoZ"
  limit?: number;    // default 12
  cursor?: string | null; // opaque index for paging
};

export type ReportListItem = {
  id: string;
  slug: string;
  title: string;
  year: number;
  price: number;              // 0 for free
  access: "Free" | "Premium";
  tags?: string[];
  description?: string;
  thumbnail?: string | null;
  // optional extras (ignored by list UI if absent)
  priceId?: string;
  freeHref?: string;
  sampleHref?: string;
  wave?: string;
  topic?: string;
  pages?: number;
  format?: string;
};

export type ListReportsResult = {
  items: ReportListItem[];
  nextCursor?: string | null;
  total?: number;
};

export type ReportDetail = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  year: number;
  topic?: string;
  wave?: string;         // e.g., "2025 H1"
  pages?: number;        // e.g., 42
  format?: string;       // "PDF", "Slides", ...
  access: "Free" | "Premium";
  price?: number;
  priceDisplay?: string; // "$149"
  priceId?: string;      // Stripe price id
  freeHref?: string;     // for free gate
  sampleHref?: string;   // optional
  description?: string;
  body?: string;
  thumbnail?: string | null;
};

/* =========================
   Backend toggle
   ========================= */

const BACKEND = (process.env.REPORTS_BACKEND || "mock").toLowerCase(); // "payload" | "mock"

/* =========================
   MOCK BACKEND (dev/default)
   ========================= */

// Seed data for list
const MOCK_BASE_LIST: ReportListItem[] = [
  {
    id: "1",
    slug: "gen-z-brand-purpose-2025-h1",
    title: "Gen Z & Brand Purpose: Signals that Move Behavior (2025 H1)",
    year: 2025,
    price: 149,
    access: "Premium",
    tags: ["Gen Z", "Packaging & Claims", "Global"],
    description: "Defendable stats, trend context, and white-label visuals from the EcoFocus syndicated study.",
    thumbnail: null,
    priceId: "price_123",
    wave: "2025 H1",
    topic: "Packaging & Claims",
    pages: 48,
    format: "PDF",
  },
  {
    id: "2",
    slug: "packaging-claims-that-convert-2025",
    title: "Packaging Claims that Convert (2025)",
    year: 2025,
    price: 0,
    access: "Free",
    tags: ["Packaging & Claims", "US"],
    description: "Top packaging messages driving purchase intent and trust—benchmarks and examples.",
    thumbnail: null,
    freeHref: "/files/packaging-claims-2025.pdf",
    sampleHref: "/files/packaging-claims-2025-sample.pdf",
    wave: "2025",
    topic: "Packaging & Claims",
    pages: 22,
    format: "PDF",
  },
  {
    id: "3",
    slug: "sustainability-sentiment-index-2024",
    title: "Sustainability Sentiment Index (2024)",
    year: 2024,
    price: 499,
    access: "Premium",
    tags: ["Sustainability", "US", "Retail"],
    description: "Longitudinal read on attitudes and behaviors, with breakouts by generation and income.",
    thumbnail: null,
    priceId: "price_456",
    wave: "2024 Annual",
    topic: "Sustainability",
    pages: 72,
    format: "Slides",
  },
  {
    id: "4",
    slug: "functional-beverage-trends-2025",
    title: "Functional Beverage Trends (2025)",
    year: 2025,
    price: 0,
    access: "Free",
    tags: ["Beverage", "Global"],
    description: "Where function meets flavor: growth territories and consumer language that resonates.",
    thumbnail: null,
    freeHref: "/files/functional-beverage-2025.pdf",
    wave: "2025",
    topic: "Beverage",
    pages: 28,
    format: "PDF",
  },
];

function cloneList(base: ReportListItem[], n: number): ReportListItem[] {
  const out: ReportListItem[] = [];
  for (let i = 0; i < n; i++) {
    const b = base[i % base.length];
    out.push({
      ...b,
      id: `${b.id}-${i}`,
      slug: `${b.slug}-${i}`,
      year: b.year - (i % 4 === 0 ? 1 : 0),
    });
  }
  return out;
}

const MOCK_LIST_DATA: ReportListItem[] = cloneList(MOCK_BASE_LIST, 120);

// Separate mock detail dataset so we can look up by id/slug without calling listReports
const MOCK_BASE_DETAIL: ReportDetail[] = MOCK_BASE_LIST.map((r) => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  subtitle: "A focused EcoFocus analysis with segmentable reads and agency-ready outputs.",
  year: r.year,
  topic: r.topic || r.tags?.[0],
  wave: r.wave,
  pages: r.pages,
  format: r.format || "PDF",
  access: r.access,
  price: r.price,
  priceDisplay: r.price ? `$${Number(r.price).toLocaleString()}` : "$0",
  priceId: r.priceId,
  freeHref: r.freeHref,
  sampleHref: r.sampleHref,
  description: r.description,
  thumbnail: r.thumbnail,
}));

function cloneDetail(base: ReportDetail[], n: number): ReportDetail[] {
  const out: ReportDetail[] = [];
  for (let i = 0; i < n; i++) {
    const b = base[i % base.length];
    out.push({
      ...b,
      id: `${b.id}-${i}`,
      slug: `${b.slug}-${i}`,
      year: b.year - (i % 4 === 0 ? 1 : 0),
    });
  }
  return out;
}
const MOCK_DETAIL_DATA: ReportDetail[] = cloneDetail(MOCK_BASE_DETAIL, 120);

function filterListByInput(data: ReportListItem[], input: ListReportsInput): ReportListItem[] {
  let filtered = data.slice();

  // Access
  if (input.access === "Free" || input.access === "Premium") {
    filtered = filtered.filter((r) => r.access === input.access);
  }

  // Year
  if (input.year && input.year !== "All") {
    const y = parseInt(input.year, 10);
    if (!Number.isNaN(y)) filtered = filtered.filter((r) => r.year === y);
  }

  // Topic (slug) — try loose match against tags or topic field
  if (input.topic && input.topic !== "All") {
    const norm = input.topic.replace(/-/g, " ").toLowerCase();
    filtered = filtered.filter((r) => {
      const tags = (r.tags || []).map((t) => t.toLowerCase());
      const tfield = (r.topic || "").toLowerCase();
      return tags.some((t) => t.includes(norm)) || tfield.includes(norm);
    });
  }

  // Type (slug) — no-op in mock unless you store it; included for parity
  if (input.type && input.type !== "All") {
    // If you later add r.type, filter here. For now, ignore in mock.
  }

  // q search
  if (input.q) {
    const q = input.q.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q) ||
        (r.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }

  // sort
  if (input.sort === "AtoZ") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filtered.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  }

  return filtered;
}

async function listReportsMock(input: ListReportsInput): Promise<ListReportsResult> {
  const limit = Math.max(1, Math.min(60, input.limit || 12));
  const filtered = filterListByInput(MOCK_LIST_DATA, input);
  const start = input.cursor ? parseInt(input.cursor, 10) || 0 : 0;
  const slice = filtered.slice(start, start + limit);
  const next = start + limit < filtered.length ? String(start + limit) : null;

  return {
    items: slice,
    nextCursor: next,
    total: filtered.length,
  };
}

async function getMockDetailBy(key: "id" | "slug", val: string): Promise<ReportDetail | null> {
  const found = MOCK_DETAIL_DATA.find((r) => String(r[key]) === String(val));
  return found ?? null;
}

/* =========================
   PAYLOAD BACKEND (prod)
   =========================
   Env:
     REPORTS_BACKEND=payload
     PAYLOAD_BASE_URL=https://your-payload-host
     PAYLOAD_API_TOKEN=<optional JWT if required>
*/

function payloadWhereFromInput(input: ListReportsInput) {
  const where: any = { and: [] as any[] };

  if (input.access === "Free" || input.access === "Premium") {
    where.and.push({ access: { equals: input.access } });
  }
  if (input.year && input.year !== "All") {
    const y = parseInt(input.year, 10);
    if (!Number.isNaN(y)) where.and.push({ year: { equals: y } });
  }
  if (input.topic && input.topic !== "All") {
    // prefer a topics (slug) field if you have it; otherwise tags contains
    where.and.push({
      or: [
        { topics: { contains: input.topic } },
        { tags: { contains: input.topic.replace(/-/g, " ") } },
        { topic: { like: input.topic.replace(/-/g, " ") } },
      ],
    });
  }
  if (input.type && input.type !== "All") {
    // if your schema has a "type" field (slug)
    where.and.push({ type: { equals: input.type } });
  }
  if (input.q) {
    const q = input.q;
    where.and.push({
      or: [
        { title: { like: q } },
        { description: { like: q } },
        { tags: { contains: q } },
      ],
    });
  }
  if (where.and.length === 0) delete where.and;
  return where;
}

function payloadSortFromInput(sort?: Sort) {
  return sort === "AtoZ" ? "title" : "-year, title"; // newest first then A–Z
}

function mapPayloadListDoc(d: any): ReportListItem {
  return {
    id: String(d.id),
    slug: d.slug,
    title: d.title,
    year: Number(d.year),
    price: Number(d.price || 0),
    access: (d.access === "Free" ? "Free" : "Premium") as "Free" | "Premium",
    tags: d.tags || d.topics || [],
    description: typeof d.description === "string" ? d.description : d.description?.plainText ?? "",
    thumbnail: d.thumbnail?.url ?? null,
    priceId: d.priceId ?? undefined,
    freeHref: d.freeHref ?? undefined,
    sampleHref: d.sampleHref ?? undefined,
    wave: d.wave ?? undefined,
    topic: d.topic ?? (Array.isArray(d.topics) ? d.topics[0] : undefined),
    pages: d.pages ? Number(d.pages) : undefined,
    format: d.format ?? undefined,
  };
}

function normalizePayloadDetail(d: any): ReportDetail {
  return {
    id: String(d.id),
    slug: d.slug,
    title: d.title,
    subtitle: d.subtitle ?? "",
    year: Number(d.year),
    topic: d.topic ?? (Array.isArray(d.topics) ? d.topics[0] : undefined),
    wave: d.wave ?? "",
    pages: d.pages ? Number(d.pages) : undefined,
    format: d.format ?? "PDF",
    access: (d.access === "Free" ? "Free" : "Premium") as "Free" | "Premium",
    price: d.price ? Number(d.price) : undefined,
    priceDisplay: d.priceDisplay ?? (d.price ? `$${Number(d.price).toLocaleString()}` : ""),
    priceId: d.priceId ?? undefined,
    freeHref: d.freeHref ?? undefined,
    sampleHref: d.sampleHref ?? undefined,
    description: typeof d.description === "string" ? d.description : d.description?.plainText ?? "",
    body: typeof d.body === "string" ? d.body : d.body?.plainText ?? "",
    thumbnail: d.thumbnail?.url ?? null,
  };
}

async function listReportsPayload(input: ListReportsInput): Promise<ListReportsResult> {
  const base = process.env.PAYLOAD_BASE_URL!;
  const token = process.env.PAYLOAD_API_TOKEN;
  const limit = Math.max(1, Math.min(60, input.limit || 12));
  const sort = payloadSortFromInput(input.sort);
  const where = payloadWhereFromInput(input);

  // cursor maps to an index; Payload is page/limit
  const start = input.cursor ? parseInt(input.cursor, 10) || 0 : 0;
  const page = Math.floor(start / limit) + 1;

  const url = new URL(`${base}/api/reports`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", sort);
  if (where) url.searchParams.set("where", JSON.stringify(where));

  const res = await fetch(url.toString(), {
    headers: token ? { Authorization: `JWT ${token}` } : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("Payload list error", await res.text());
    return { items: [], nextCursor: null, total: 0 };
  }

  const data = await res.json();
  const docs = (data.docs ?? []) as any[];
  const items = docs.map(mapPayloadListDoc);
  const total = Number(data.totalDocs ?? items.length);
  const hasNext = Boolean(data.hasNextPage);
  const nextCursor = hasNext ? String(page * limit) : null;

  return { items, nextCursor, total };
}

async function getPayloadDetailById(id: string): Promise<ReportDetail | null> {
  const base = process.env.PAYLOAD_BASE_URL!;
  const token = process.env.PAYLOAD_API_TOKEN;
  const res = await fetch(`${base}/api/reports/${id}`, {
    headers: token ? { Authorization: `JWT ${token}` } : undefined,
    cache: "no-store",
  });
  if (!res.ok) return null;
  const doc = await res.json();
  return normalizePayloadDetail(doc);
}

async function getPayloadDetailBySlug(slug: string): Promise<ReportDetail | null> {
  const base = process.env.PAYLOAD_BASE_URL!;
  const token = process.env.PAYLOAD_API_TOKEN;
  const url = new URL(`${base}/api/reports`);
  url.searchParams.set("where", JSON.stringify({ slug: { equals: slug } }));
  const res = await fetch(url.toString(), {
    headers: token ? { Authorization: `JWT ${token}` } : undefined,
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  const doc = data?.docs?.[0];
  return doc ? normalizePayloadDetail(doc) : null;
}

/* =========================
   Public API
   ========================= */

export async function listReports(input: ListReportsInput): Promise<ListReportsResult> {
  if (BACKEND === "payload") {
    return listReportsPayload(input);
  }
  return listReportsMock(input);
}

export async function getReportById(id: string): Promise<ReportDetail | null> {
  if (BACKEND === "payload") {
    return getPayloadDetailById(id);
  }
  return getMockDetailBy("id", id);
}

export async function getReportBySlug(slug: string): Promise<ReportDetail | null> {
  if (BACKEND === "payload") {
    return getPayloadDetailBySlug(slug);
  }
  return getMockDetailBy("slug", slug);
}

  
  




  