// lib/catalog.ts
import type { Product } from './storeTypes';

// Reusable topical taxonomy for SIR subsections
const SUBSECTION_TOPICS = [
  {
    key: 'green-mindset',
    title: 'The Green Mindset',
    tags: ['Consumer Attitudes', 'Behaviors'],
    img: '/images/store_sr1.webp',
  },
  {
    key: 'packaging-spotlight',
    title: 'Packaging in the Spotlight',
    tags: ['Packaging', 'Preferences'],
    img: '/images/store_sr2.webp',
  },
  {
    key: 'trust-accountability',
    title: 'Trust & Accountability',
    tags: ['Corporate Responsibility', 'Retail Responsibility'],
    img: '/images/store_sr3.webp',
  },
  {
    key: 'recycling-reality',
    title: 'The Recycling Reality',
    tags: ['Recycling', 'Barriers'],
    img: '/images/store_sr4.webp',
  },
  {
    key: 'price-of-green',
    title: 'The Price of Green',
    tags: ['Value Perceptions', 'Affordability'],
    img: '/images/store_sr5.webp',
  },
  {
    key: 'knowledge-power',
    title: 'Knowledge is Power',
    tags: ['Environmental Knowledge', 'Information Sources'],
    img: '/images/store_sr6.webp',
  },
] as const;


function makeYearSubs(year: 2025 | 2024): Product[] {
  return SUBSECTION_TOPICS.map((t, i) => ({
    id: `sr-${year}-${i + 1}`,
    title: `SIR Subsection — ${t.title} (${year})`,
    subtitle: 'Focused subsection from SIR',
    price: 2000,
    img: t.img,
    category: 'Reports' as const,
    year,
    // include topical tags + the year for easy filtering
    tags: [...t.tags, String(year)],
    includes: ['Section PDF', 'Key charts pack', 'Usage license'],
  }));
}

// Tip: keep IDs stable — they’re used by cart, deep links, etc.
export const CATALOG: Product[] = [
  // ---- FEATURED / BUNDLES (hero cards) ----
  {
    id: 'buyin-2025',
    title: '2025 Syndicated Study — Buy-In',
    subtitle: 'Add your proprietary questions + receive the full study',
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
  },
  {
    id: 'enhance-2024',
    title: 'Enhance Your Data — 2024',
    subtitle: 'Blend EcoFocus 2024 data with your own',
    price: 20000,
    img: '/images/store_enhance2024.webp',
    category: 'Bundles',
    includes: [
      'Data integration workshop',
      'Crosstabs matched to your schema',
      'Dashboard access (licensed)',
    ],
    variantNote: 'Dashboard included with license',
  },
  {
    id: 'sir-2024',
    title: 'Sustainability Insights Report — 2024',
    subtitle: 'Flagship 2024 SIR deliverable',
    price: 10000,
    img: '/images/store_sir2024.webp',
    category: 'Bundles',
    includes: [
      'Full 2024 SIR (PDF + charts)',
      'Methodology & implications',
      'Read-only dashboard seats',
    ],
    variantNote: 'Dashboard read-only included',
  },

  // ---- SMALL REPORTS (SIR subsections; same topical categories across years) ----
  ...makeYearSubs(2025),
  ...makeYearSubs(2024),
];

// Handy slices & helpers (optional)
export const BUNDLES = CATALOG.filter((p) => p.category === 'Bundles');
export const SMALL_REPORTS = CATALOG.filter((p) => p.category === 'Reports');

export const getYearsAvailable = () =>
  Array.from(new Set(SMALL_REPORTS.map((r) => r.year)))
    .filter(Boolean)
    .sort((a, b) => (b as number) - (a as number)) as number[];

