// lib/reports-repo.ts
import "server-only";

/* =========================
   Types
   ========================= */
export type Access = "All" | "Free" | "Premium";
export type Sort = "Newest" | "AtoZ";

export type ListReportsInput = {
  q?: string;
  year?: string;
  topic?: string;
  type?: string;
  access?: Access | string;
  sort?: Sort;
  limit?: number;
  cursor?: string | null;
};

export type ReportListItem = {
  id: string;
  slug: string;
  title: string;
  year: number;
  price: number; // 0 => free
  access: "Free" | "Premium";
  tags?: string[];
  description?: string;
  thumbnail?: string | null;
  // extras
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
  wave?: string;
  pages?: number;
  format?: string;
  access: "Free" | "Premium";
  price?: number;
  priceDisplay?: string;
  priceId?: string;
  freeHref?: string;
  sampleHref?: string;
  description?: string;
  body?: string;
  thumbnail?: string | null;
};

export type Report = ReportDetail;

/* =========================
   Config & helpers
   ========================= */
function normalizeAccess(val?: string | null): "All" | "Free" | "Premium" {
  if (!val) return "All";
  const x = String(val).trim().toLowerCase();
  if (x === "free") return "Free";
  if (x === "premium") return "Premium";
  if (x === "all") return "All";
  return "All";
}

function normText(s: string) {
  // remove punctuation/whitespace differences so "packaging-claims" matches "Packaging & Claims"
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const RAW_BACKEND = (process.env.REPORTS_BACKEND || "mock").toLowerCase(); // "payload" | "mock"
const PAYLOAD_BASE_URL = process.env.PAYLOAD_BASE_URL || "";
const PAYLOAD_TOKEN = process.env.PAYLOAD_API_TOKEN || "";
const WANT_PAYLOAD = RAW_BACKEND === "payload" && !!PAYLOAD_BASE_URL;
const DISABLE_FALLBACK = process.env.REPORTS_DISABLE_FALLBACK === "1";

/* =========================
   MOCK DATA
   ========================= */

const MOCK_BASE_LIST: ReportListItem[] = [
  {
    id: "1",
    slug: "gen-z-brand-purpose-2025-h1",
    title: "Gen Z & Brand Purpose: Signals that Move Behavior (2025 H1)",
    year: 2025,
    price: 149,
    access: "Premium",
    tags: ["Gen Z", "Packaging & Claims", "Global"],
    description:
      "Defendable stats, trend context, and white-label visuals from the EcoFocus syndicated study.",
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
    description:
      "Top packaging messages driving purchase intent and trust—benchmarks and examples.",
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
    description:
      "Longitudinal read on attitudes and behaviors, with breakouts by generation and income.",
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
    description:
      "Where function meets flavor: growth territories and consumer language that resonates.",
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
const MOCK_DETAIL_DATA: ReportDetail[] = MOCK_LIST_DATA.map((r) => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  subtitle:
    "A focused EcoFocus analysis with segmentable reads and agency-ready outputs.",
  year: r.year,
  topic: r.topic || r.tags?.[0],
  wave: r.wave,
  pages: r.pages,
  format: r.format || "PDF",
  access: r.access,
  price: r.price,
  priceDisplay:
    typeof r.price === "number" ? `$${Number(r.price).toLocaleString()}` : "",
  priceId: r.priceId,
  freeHref: r.freeHref,
  sampleHref: r.sampleHref,
  description: r.description,
  thumbnail: r.thumbnail,
}));

/* =========================
   Filtering (reused for both backends)
   ========================= */
function applyPostFilter(data: ReportListItem[], input: ListReportsInput) {
  let filtered = data.slice();

  // Access
  const acc = normalizeAccess(input.access as any);
  if (acc === "Free" || acc === "Premium") {
    filtered = filtered.filter(
      (r) => normalizeAccess(r.access) === acc || (acc === "Free" && Number(r.price) === 0)
    );
  }

  // Year
  if (input.year && input.year !== "All") {
    const y = parseInt(input.year, 10);
    if (!Number.isNaN(y)) filtered = filtered.filter((r) => r.year === y);
  }

  // Topic (robust match)
  if (input.topic && input.topic !== "All") {
    const want = normText(input.topic.replace(/-/g, " "));
    filtered = filtered.filter((r) => {
      const tags = (r.tags || []).map((t) => normText(t));
      const tfield = normText(r.topic || "");
      return tags.some((t) => t.includes(want)) || tfield.includes(want);
    });
  }

  // Type (no-op here unless you add a 'type' field)

  // q
  if (input.q) {
    const q = normText(input.q);
    filtered = filtered.filter(
      (r) =>
        normText(r.title).includes(q) ||
        normText(r.description || "").includes(q) ||
        (r.tags || []).some((t) => normText(t).includes(q))
    );
  }

  // Sort
  if (input.sort === "AtoZ") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filtered.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  }

  return filtered;
}

/* =========================
   MOCK BACKEND
   ========================= */
async function listReportsMock(input: ListReportsInput): Promise<ListReportsResult> {
  const limit = Math.max(1, Math.min(60, input.limit || 12));
  const filtered = applyPostFilter(MOCK_LIST_DATA, input);
  const start = input.cursor ? parseInt(input.cursor, 10) || 0 : 0;
  const slice = filtered.slice(start, start + limit);
  const next = start + limit < filtered.length ? String(start + limit) : null;
  return { items: slice, nextCursor: next, total: filtered.length };
}

async function getMockDetailBy(key: "id" | "slug", val: string) {
  const found = MOCK_DETAIL_DATA.find((r) => String(r[key]) === String(val));
  return found ?? null;
}

/* =========================
   PAYLOAD BACKEND
   ========================= */
function payloadWhereFromInput(input: ListReportsInput) {
  const where: any = { and: [] as any[] };
  const acc = normalizeAccess(input.access as any);
  if (acc === "Free" || acc === "Premium") {
    where.and.push({ or: [{ access: { equals: acc } }, { access: { equals: acc.toLowerCase() } }] });
  }
  if (input.year && input.year !== "All") {
    const y = parseInt(input.year, 10);
    if (!Number.isNaN(y)) where.and.push({ year: { equals: y } });
  }
  if (input.topic && input.topic !== "All") {
    const t = input.topic.replace(/-/g, " ");
    where.and.push({
      or: [{ topics: { contains: input.topic } }, { tags: { contains: t } }, { topic: { like: t } }],
    });
  }
  if (input.type && input.type !== "All") {
    where.and.push({ type: { equals: input.type } });
  }
  if (input.q) {
    const q = input.q;
    where.and.push({ or: [{ title: { like: q } }, { description: { like: q } }, { tags: { contains: q } }] });
  }
  if (where.and.length === 0) delete where.and;
  return where;
}

function payloadSortFromInput(sort?: Sort) {
  return sort === "AtoZ" ? "title" : "-year, title";
}

function mapPayloadListDoc(d: any): ReportListItem {
  return {
    id: String(d.id),
    slug: d.slug,
    title: d.title,
    year: Number(d.year),
    price: Number(d.price || 0),
    access: (normalizeAccess(d.access) as "Free" | "Premium") || "Premium",
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
    access: (normalizeAccess(d.access) as "Free" | "Premium") || "Premium",
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
  const limit = Math.max(1, Math.min(60, input.limit || 12));
  const sort = payloadSortFromInput(input.sort);
  const where = payloadWhereFromInput(input);
  const start = input.cursor ? parseInt(input.cursor, 10) || 0 : 0;
  const page = Math.floor(start / limit) + 1;

  const url = new URL(`${PAYLOAD_BASE_URL}/api/reports`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", sort);
  if (where) url.searchParams.set("where", JSON.stringify(where));

  const res = await fetch(url.toString(), {
    headers: PAYLOAD_TOKEN ? { Authorization: `JWT ${PAYLOAD_TOKEN}` } : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[reports] Payload list error", res.status, body);
    throw new Error(`Payload list error: ${res.status}`);
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
  const res = await fetch(`${PAYLOAD_BASE_URL}/api/reports/${id}`, {
    headers: PAYLOAD_TOKEN ? { Authorization: `JWT ${PAYLOAD_TOKEN}` } : undefined,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Payload detail error: ${res.status}`);
  const doc = await res.json();
  return normalizePayloadDetail(doc);
}

async function getPayloadDetailBySlug(slug: string): Promise<ReportDetail | null> {
  const url = new URL(`${PAYLOAD_BASE_URL}/api/reports`);
  url.searchParams.set("where", JSON.stringify({ slug: { equals: slug } }));
  const res = await fetch(url.toString(), {
    headers: PAYLOAD_TOKEN ? { Authorization: `JWT ${PAYLOAD_TOKEN}` } : undefined,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Payload detail error: ${res.status}`);
  const data = await res.json();
  const doc = data?.docs?.[0];
  return doc ? normalizePayloadDetail(doc) : null;
}

/* =========================
   Public API with post-filter & fallback
   ========================= */
export async function listReports(input: ListReportsInput): Promise<ListReportsResult> {
  const withNorm: ListReportsInput = { ...input, access: normalizeAccess(input.access as any) };

  if (WANT_PAYLOAD) {
    try {
      const res = await listReportsPayload(withNorm);
      const cleaned = applyPostFilter(res.items, withNorm);

      // If CMS returns empty/mismatched, fall back to mock (unless explicitly disabled)
      if (DISABLE_FALLBACK || cleaned.length > 0) {
        const pageSize = Math.max(1, Math.min(60, withNorm.limit || 12));
        return {
          items: cleaned,
          nextCursor: cleaned.length >= pageSize ? res.nextCursor ?? null : null,
          total: res.total ?? cleaned.length,
        };
      }
      console.warn("[reports] CMS returned empty after post-filter — falling back to mock.");
    } catch (e) {
      console.warn("[reports] CMS error — falling back to mock.", e);
      if (DISABLE_FALLBACK) throw e;
    }
  }

  return listReportsMock(withNorm);
}

export async function getReportById(id: string): Promise<ReportDetail | null> {
  if (WANT_PAYLOAD) {
    try {
      const d = await getPayloadDetailById(id);
      if (DISABLE_FALLBACK || d) return d;
    } catch {}
  }
  return getMockDetailBy("id", id);
}

export async function getReportBySlug(slug: string): Promise<ReportDetail | null> {
  if (WANT_PAYLOAD) {
    try {
      const d = await getPayloadDetailBySlug(slug);
      if (DISABLE_FALLBACK || d) return d;
    } catch {}
  }
  return getMockDetailBy("slug", slug);
}



  
  




  