// lib/catalog.ts
import type { Product } from './storeTypes';

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
    badge: 'NEW • 2025',
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

  // ---- SMALL REPORTS (SIR subsections; 6 categories per year) ----
  // 2025 set
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `sr-2025-${i + 1}`,
    title: `SIR Subsection — Category ${i + 1} (2025)`,
    subtitle: 'Focused subsection from SIR',
    price: 2000,
    img: `/images/store_sr${(i % 6) + 1}.webp`,
    category: 'Reports' as const,
    year: 2025 as const,
    tags: [`category-${i + 1}`, '2025'],
    includes: ['Section PDF', 'Key charts pack', 'Usage license'],
  })),

  // 2024 set
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `sr-2024-${i + 1}`,
    title: `SIR Subsection — Category ${i + 1} (2024)`,
    subtitle: 'Focused subsection from SIR',
    price: 2000,
    img: `/images/store_sr${(i % 6) + 1}.webp`,
    category: 'Reports' as const,
    year: 2024 as const,
    tags: [`category-${i + 1}`, '2024'],
    includes: ['Section PDF', 'Key charts pack', 'Usage license'],
  })),
];

// Handy slices & helpers (optional)
export const BUNDLES = CATALOG.filter(p => p.category === 'Bundles');
export const SMALL_REPORTS = CATALOG.filter(p => p.category === 'Reports');

export const getYearsAvailable = () =>
  Array.from(new Set(SMALL_REPORTS.map(r => r.year)))
    .filter(Boolean)
    .sort((a, b) => (b as number) - (a as number)) as number[];
