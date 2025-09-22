// lib/reports-repo.ts
export type Access = "Free" | "Premium";

export type Report = {
  id: string;
  title: string;
  cover: string;
  date: string;        // ISO string
  year: string;        // "2025"
  type: "Full Report" | "Brief/One-Pager" | "Infographic";
  topic: string;       // e.g., "Gen Z"
  wave?: string;       // "2025 H1"
  pages?: number;
  format?: string;     // "PDF"
  sampleHref?: string;
  detailHref: string;

  // NEW
  access: Access;
  freeHref?: string;        // direct download for free items
  priceCents?: number;      // premium pricing (optional)
  priceDisplay?: string;    // human-readable label (e.g., "$149")
};

export type ListQuery = {
  q?: string;
  year?: string;
  topic?: string;
  type?: string;
  access?: "All" | Access;
  sort?: "Newest" | "A–Z";
  limit?: number;
  cursor?: string;
};

const SEED: Report[] = [
  {
    id: "2025-genz-brand-purpose",
    title: "Gen Z & Brand Purpose: Signals that move behavior (2025 H1)",
    cover: "/images/reports/cover-genz-purpose-2025.jpg",
    date: "2025-06-15",
    year: "2025",
    type: "Full Report",
    topic: "Gen Z",
    wave: "2025 H1",
    pages: 54,
    format: "PDF",
    sampleHref: "/files/reports/2025-genz-purpose-sample.pdf",
    detailHref: "/reports/2025-genz-brand-purpose",
    access: "Premium",
    priceCents: 14900,
    priceDisplay: "$149",
  },
  {
    id: "2024-claims-packaging",
    title: "Sustainability Claims & Packaging Language (Cross-Gen)",
    cover: "/images/reports/cover-claims-packaging-2024.jpg",
    date: "2024-10-02",
    year: "2024",
    type: "Full Report",
    topic: "Packaging & Claims",
    wave: "2024 H2",
    pages: 46,
    format: "PDF",
    sampleHref: "/files/reports/2024-claims-packaging-sample.pdf",
    detailHref: "/reports/2024-claims-packaging",
    access: "Premium",
    priceCents: 12900,
    priceDisplay: "$129",
  },
  {
    id: "2025-foodbev-values",
    title: "Category Focus: Food & Beverage Values Map (2025)",
    cover: "/images/reports/cover-foodbev-2025.jpg",
    date: "2025-04-01",
    year: "2025",
    type: "Brief/One-Pager",
    topic: "Category: Food & Bev",
    wave: "2025 H1",
    pages: 8,
    format: "PDF",
    sampleHref: "/files/reports/2025-foodbev-brief-sample.pdf",
    detailHref: "/reports/2025-foodbev-values",
    access: "Free",
    freeHref: "/files/reports/2025-foodbev-brief.pdf",
  },
  {
    id: "2023-sustainability-attitudes",
    title: "Sustainability Attitudes: Say–Do Gap Watchlist",
    cover: "/images/reports/cover-attitudes-2023.jpg",
    date: "2023-09-09",
    year: "2023",
    type: "Infographic",
    topic: "Sustainability Attitudes",
    wave: "2023 H2",
    pages: 2,
    format: "PDF",
    sampleHref: "/files/reports/2023-attitudes-infographic.pdf",
    detailHref: "/reports/2023-say-do-gap",
    access: "Free",
    freeHref: "/files/reports/2023-attitudes-infographic.pdf",
  },
];

function applyFilters(
  list: Report[],
  q?: string,
  year?: string,
  topic?: string,
  type?: string,
  access?: "All" | Access
) {
  const qq = (q || "").trim().toLowerCase();
  return list.filter((r) => {
    const matchQ = !qq || r.title.toLowerCase().includes(qq) || r.topic.toLowerCase().includes(qq);
    const matchYear =
      !year || year === "All" || r.year === year || (year === "2019–2022" && ["2019","2020","2021","2022"].includes(r.year));
    const matchTopic = !topic || topic === "All" || r.topic === topic;
    const matchType = !type || type === "All" || r.type === type;
    const matchAccess = !access || access === "All" || r.access === access;
    return matchQ && matchYear && matchTopic && matchType && matchAccess;
  });
}

function applySort(list: Report[], sort?: "Newest" | "A–Z") {
  if (sort === "A–Z") return list.toSorted((a, b) => a.title.localeCompare(b.title));
  return list.toSorted((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function listReports(query: ListQuery) {
  const { q, year, topic, type, access = "All", sort = "Newest", limit = 24, cursor } = query;

  const filtered = applySort(applyFilters(SEED, q, year, topic, type, access), sort);
  const start = cursor ? Number(cursor) || 0 : 0;
  const end = Math.min(start + limit, filtered.length);
  const items = filtered.slice(start, end);
  const nextCursor = end < filtered.length ? String(end) : undefined;

  return { items, nextCursor, total: filtered.length };
}

  