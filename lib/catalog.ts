// lib/catalog.ts
import type { Product, ReportProduct, BundleProduct } from './storeTypes';
import { isReportProduct, isBundleProduct } from './storeTypes';

// Friendly, brandable topics (stable across years)
const SUBSECTION_TOPICS = [
  { key: 'green-mindset',        title: 'The Green Mindset',          tags: ['Consumer Attitudes', 'Behaviors'],                  img: '/images/store_sr1.webp' },
  { key: 'packaging-spotlight',  title: 'Packaging in the Spotlight',  tags: ['Packaging', 'Preferences'],                         img: '/images/store_sr2.webp' },
  { key: 'trust-accountability', title: 'Trust & Accountability',      tags: ['Corporate Responsibility', 'Retail Responsibility'], img: '/images/store_sr3.webp' },
  { key: 'recycling-reality',    title: 'The Recycling Reality',       tags: ['Recycling', 'Barriers'],                            img: '/images/store_sr4.webp' },
  { key: 'price-of-green',       title: 'The Price of Green',          tags: ['Value Perceptions', 'Affordability'],               img: '/images/store_sr5.webp' },
  { key: 'knowledge-power',      title: 'Knowledge is Power',          tags: ['Environmental Knowledge', 'Information Sources'],   img: '/images/store_sr6.webp' },
] as const;

/** Small topical reports by year — strongly typed as ReportProduct[] */
function makeYearSubs(year: 2025 | 2024): ReportProduct[] {
  const isPaid = year >= 2025;
  return SUBSECTION_TOPICS.map((t, i) => ({
    id: `sr-${year}-${i + 1}`,
    title: `Focused Insight — ${t.title} (${year})`,
    subtitle: 'A concentrated, slide-ready insight to accelerate decisions.',
    price: isPaid ? 2000 : 0,
    img: t.img,                     // required (string)
    category: 'Reports',
    year,                           // required (number)
    tags: [...t.tags, String(year)],
    includes: ['Section PDF', 'Key charts pack', 'Usage license'],
    purchaseType: isPaid ? 'direct' : undefined,     // optional
    accessModel: isPaid ? 'paid-direct' : 'free-gated',
  }));
}

// ---- MASTER CATALOG ----
export const CATALOG: Product[] = [
  // Core offerings (contact-first) — Bundles
  {
    id: 'buyin-2025',
    title: '2025 Syndicated Study — Buy-In',
    subtitle: 'Add your proprietary questions + receive the full study.',
    price: 30000,
    img: '/images/store_2025_buyin.webp',
    category: 'Bundles',
    badge: 'Now in Development • 2025',
    includes: [
      'Custom questions in 2025 study',
      'Full study deliverables',
      'Custom crosstabs',
      'Dashboard access (seats scale)',
    ],
    variantNote: 'Dashboard included — seats scale by org size',
    purchaseType: 'contact',
    contactPath: '/contact?topic=syndicated-2025',
    ctaLabel: 'Schedule discovery',
    accessModel: 'paid-contact',
  },
  {
    id: 'enhance-2024',
    title: 'Enhance Your Data — 2024',
    subtitle: 'Blend EcoFocus 2024 data with your own datasets.',
    price: 20000,
    img: '/images/store_enhance2024.webp',
    category: 'Bundles',
    includes: [
      'Data integration workshop',
      'Crosstabs matched to your schema',
      'Dashboard access (licensed)',
    ],
    variantNote: 'Dashboard included with license',
    purchaseType: 'contact',
    contactPath: '/contact?topic=data-enrichment',
    ctaLabel: 'Talk to an expert',
    accessModel: 'paid-contact',
  },

  // 2024 SIR — free (gated). Keep as a Bundle (or convert to Report if you prefer).
  {
    id: 'sir-2024',
    title: 'Sustainability Insights Report — 2024',
    subtitle: 'Flagship 2024 SIR deliverable.',
    price: 0,
    img: '/images/store_sir2024.webp',
    category: 'Bundles',
    includes: [
      'Full 2024 SIR (PDF + charts)',
      'Methodology & implications',
      'Read-only dashboard seats',
    ],
    variantNote: 'Dashboard read-only included',
    accessModel: 'free-gated',
  },

  // Small topical reports by year (typed)
  ...makeYearSubs(2025),
  ...makeYearSubs(2024),
];

// Handy slices & helpers (now strongly typed with guards)
export const BUNDLES: BundleProduct[] = CATALOG.filter(isBundleProduct);
export const SMALL_REPORTS: ReportProduct[] = CATALOG.filter(isReportProduct);

export const getYearsAvailable = (): number[] =>
  Array.from(new Set(SMALL_REPORTS.map((r) => r.year))).sort((a, b) => b - a);

export const getProductById = (id: string): Product | undefined =>
  CATALOG.find((p) => p.id === id);




