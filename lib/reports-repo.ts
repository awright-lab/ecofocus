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
  access?: Access | string; // accept either case from URL
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

  // optional extras used by UI
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

// convenient alias for components that import { Report }
export type Report = ReportDetail;

/* =========================
   Helpers / toggles
   ========================= */
function normalizeAccess(val?: string | null): "All" | "Free" | "Premium" {
  if (!val) return "All";
  const x = String(val).trim().toLowerCase();
  if (x === "free") return "Free";
  if (x === "premium") return "Premium";
  return "All";
}

const RAW_BACKEND = (process.env.REPORTS_BACKEND || "mock").toLowerCase(); // "payload" | "mock"
const PAYLOAD_BASE_URL = process.env.PAYLOAD_BASE_URL || "";
const PAYLOAD_TOKEN = process.env.PAYLOAD_API_TOKEN || "";
const WANT_PAYLOAD = RAW_BACKEND === "payload" && !!PAYLOAD_BASE_URL;
const DISABLE_FALLBACK = process.env.REPORTS_DISABLE_FALLBACK === "1";

/* =========================
   MOCK BACKEND
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

// clone out to make ~120 items for paging demos
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

// derive detail dataset directly from list dataset
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

function filterListByInput(
  data: ReportListItem[],
  input: ListReportsInput
): ReportListItem[] {
  let filtered = data.slice();

  // Access (case-insensitive)
  const acc = normalizeAccess(input.access as any);
  if (acc === "Free" || acc === "Premium") {
    filtered = filtered.filter(
      (r) => normalizeAccess(r.access as any) === acc
    );
  }

  // Year
  if (input.year && input.year !== "All") {
    const y = parseInt(input.year, 10);
    if (!Number.isNaN(y)) filtered = filtered.filter((r) => r.year === y);
  }

  // Topic (slug-ish)
  if (input.topic && input.topic !== "All") {
    const norm = input.topic.replace(/-/g, " ").toLowerCase();
    filtered = filtered.filter((r) => {
      const tags = (r.tags || []).map((t) => t.toLowerCase());
      const tfield = (r.topic || "").toLowerCase();
      return tags.some((t) => t.includes(norm)) || tfield.includes(norm);
    });
  }

  // Type (no-op in mock unless you add a field)

  // q
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

async function listReportsMock(
  input: ListReportsInput
): Promise<ListReportsResult> {
  const limit = Math.max(1, Math.min(60, input.limit || 12));
  const filtered = filterListByInput(MOCK_LIST_DATA, input);
  const start = input.cursor ? parseInt(input.cursor, 10) || 0 : 0;
  const slice = filtered.slice(start, start + limit);
  const next = start + limit < filtered.length ? String(start + limit) : null;

  return { items: slice, nextCursor: next, total: filtered.length };
}

async function getMockDetailBy(
  key: "id" | "slug",
  val: string
): Promise<ReportDetail | null> {
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
    where.and.push({
      or: [
        { access: { equals: acc } },
        { access: { equals: acc.toLowerCase() } },
      ],
    });
  }

  if (input.year && input.year !== "All") {
    const y = parseInt(input.year, 10);
    if (!Number.isNaN(y)) where.and.push({ year: { equals: y } });
  }

  if (input.topic && input.topic !== "All") {
    const t = input.topic.replace(/-/g, " ");
    where.and.push({
      or: [
        { topics: { contains: input.topic } },
        { tags: { contains: t } },
        { topic: { like: t } },
      ],
    });
  }

  if (input.type && input.type !== "All") {
    where.and.push({ type: { equals: input.type } });
  }

  if (input.q) {
    const q = input.q;
    where.and.push({
      or: [{ title: { like: q } }, { description: { like: q } }, { tags: { contains: q } }],
    });
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
    access: normalizeAccess(d.access) as "Free" | "Premium",
    tags: d.tags || d.topics || [],
    description:
      typeof d.description === "string"
        ? d.description
        : d.description?.plainText ?? "",
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
    access: normalizeAccess(d.access) as "Free" | "Premium",
    price: d.price ? Number(d.price) : undefined,
    priceDisplay:
      d.priceDisplay ?? (d.price ? `$${Number(d.price).toLocaleString()}` : ""),
    priceId: d.priceId ?? undefined,
    freeHref: d.freeHref ?? undefined,
    sampleHref: d.sampleHref ?? undefined,
    description:
      typeof d.description === "string"
        ? d.description
        : d.description?.plainText ?? "",
    body: typeof d.body === "string" ? d.body : d.body?.plainText ?? "",
    thumbnail: d.thumbnail?.url ?? null,
  };
}

async function listReportsPayload(
  input: ListReportsInput
): Promise<ListReportsResult> {
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
  if (!res.ok) {
    console.error("[reports] Payload detail (id) error", res.status);
    throw new Error(`Payload detail error: ${res.status}`);
  }
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
  if (!res.ok) {
    console.error("[reports] Payload detail (slug) error", res.status);
    throw new Error(`Payload detail error: ${res.status}`);
  }
  const data = await res.json();
  const doc = data?.docs?.[0];
  return doc ? normalizePayloadDetail(doc) : null;
}

/* =========================
   Public API (with fallback)
   ========================= */
export async function listReports(input: ListReportsInput): Promise<ListReportsResult> {
  const withNorm: ListReportsInput = { ...input, access: normalizeAccess(input.access as any) };

  if (WANT_PAYLOAD) {
    try {
      const res = await listReportsPayload(withNorm);
      if (DISABLE_FALLBACK || res.items.length > 0) return res;
      console.warn("[reports] Payload returned 0 items; falling back to mock.");
    } catch (e) {
      console.warn("[reports] Payload error; falling back to mock.", e);
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
      console.warn("[reports] Payload detail (id) missing; falling back to mock.");
    } catch (e) {
      console.warn("[reports] Payload detail (id) error; falling back to mock.", e);
      if (DISABLE_FALLBACK) throw e;
    }
  }
  return getMockDetailBy("id", id);
}

export async function getReportBySlug(slug: string): Promise<ReportDetail | null> {
  if (WANT_PAYLOAD) {
    try {
      const d = await getPayloadDetailBySlug(slug);
      if (DISABLE_FALLBACK || d) return d;
      console.warn("[reports] Payload detail (slug) missing; falling back to mock.");
    } catch (e) {
      console.warn("[reports] Payload detail (slug) error; falling back to mock.", e);
      if (DISABLE_FALLBACK) throw e;
    }
  }
  return getMockDetailBy("slug", slug);
}


  
  




  