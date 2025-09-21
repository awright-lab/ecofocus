// Server-safe seed. Replace with your real data source later.

export type Report = {
    id: string;
    title: string;
    subtitle?: string;
    cover: string;
    preview: string[];
    date: string;          // "2025-06-15"
    year: string;          // "2025"
    topic: string;         // e.g., "Gen Z"
    type: "Full Report" | "Brief/One-Pager" | "Infographic";
    wave?: string;
    pages?: number;
    format?: string;
    length?: string;
    sampleHref?: string;
    purchaseHref?: string;
    abstract: string;
    bullets?: string[];
  };
  
  export const REPORTS: Record<string, Report> = {
    "2025-genz-brand-purpose": {
      id: "2025-genz-brand-purpose",
      title: "Gen Z & Brand Purpose: Signals that move behavior",
      subtitle: "Key claims, values, and moments that actually shift spend in 2025 H1.",
      cover: "/images/reports/cover-genz-purpose-2025.jpg",
      preview: [
        "/images/reports/previews/2025-genz-purpose-p1.jpg",
        "/images/reports/previews/2025-genz-purpose-p2.jpg",
        "/images/reports/previews/2025-genz-purpose-p3.jpg",
        "/images/reports/previews/2025-genz-purpose-p4.jpg",
      ],
      date: "2025-06-15",
      year: "2025",
      topic: "Gen Z",
      type: "Full Report",
      wave: "2025 H1",
      pages: 54,
      format: "PDF",
      length: "54 pages",
      sampleHref: "/files/reports/2025-genz-purpose-sample.pdf",
      // purchaseHref: "/checkout/2025-genz-brand-purpose",
      abstract:
        "Defendable reads on what Gen Z believes, buys, and boycotts—and how sustainability language can unlock real behavior, not just survey intent.",
      bullets: [
        "Claim language: which words signal credibility vs. greenwash risk",
        "Say–do gap watchlist by sub-segment (e.g., students vs. early-career)",
        "Category cuts: food & bev, apparel/beauty, household",
        "Price & access guardrails that reduce backlash",
        "White-label charts for decks + POVs (exports included)",
      ],
    },
  };
  