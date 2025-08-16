// lib/catalog.ts
import type { Product } from './storeTypes';

// Reusable topical taxonomy for SIR subsections
const SUBSECTION_TOPICS = [
  {
    key: 'recycling-packaging',
    title: 'Recycling & Packaging',
    tags: ['Recycling', 'Packaging'],
    img: '/images/store_sr1.webp',
  },
  {
    key: 'pet-household',
    title: 'Pet Supplies & Household Goods',
    tags: ['Pet Supplies', 'Household Goods'],
    img: '/images/store_sr2.webp',
  },
  {
    key: 'consumer-attitudes',
    title: 'Consumer Attitudes & Behaviors',
    tags: ['Consumer Attitudes', 'Behaviors'],
    img: '/images/store_sr3.webp',
  },
  {
    key: 'generational-trends',
    title: 'Generational & Demographic Trends',
    tags: ['Generational Trends', 'Demographics'],
    img: '/images/store_sr4.webp',
  },
  {
    key: 'corporate-trust',
    title: 'Corporate Sustainability & Brand Trust',
    tags: ['Corporate Sustainability', 'Brand Trust'],
    img: '/images/store_sr5.webp',
  },
  {
    key: 'policy-financial',
    title: 'Policy & Financial Barriers',
    tags: ['Policy', 'Financial Barriers'],
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

