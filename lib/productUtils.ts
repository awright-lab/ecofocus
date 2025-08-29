// lib/productUtils.ts
import type { Product } from '@/lib/storeTypes';
import type { ReportCardModel, Badge, PurchaseType } from '@/types/reportModels';

export function inferYear(p: Product): 2024 | 2025 | undefined {
  const m = p.id.match(/(?:^|[-_])(20(24|25))(?:$|[-_])/);
  if (m) return Number(m[1]) as 2024 | 2025;
  return (p as any).year;
}

export function isSmallReport(p: Product) {
  return p.category === 'Reports';
}

export function isSirBundle(p: Product) {
  return p.category === 'Bundles' && p.id.startsWith('sir-');
}

export function isFreeOnHub(p: Product): boolean {
  const year = inferYear(p);
  return year === 2024 && (isSmallReport(p) || isSirBundle(p));
}

export function toReportCardModel(p: Product): ReportCardModel {
  const year = (inferYear(p) ?? 2025) as 2024 | 2025;
  const free = isFreeOnHub(p);
  const badge: Badge = free ? 'Free' : 'Paid';     // ← literal union, not string
  const cover = ((p as any).img ?? '/images/report-cover-fallback.jpg') as string;

  const purchaseType = (p as any).purchaseType as PurchaseType | undefined;
  const href =
    !free && purchaseType === 'direct'
      ? `/store/${p.id}`
      : undefined;

  return {
    id: p.id,
    title: p.title,
    excerpt: p.subtitle ?? '',
    cover,
    badge,
    year,
    topic: undefined,
    category: isSmallReport(p) ? 'Small Report' : isSirBundle(p) ? 'Flagship' : p.category,
    href,
    price: p.price,
    purchaseType,
  };
}

