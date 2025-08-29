// lib/productUtils.ts
import type { Product } from '@/lib/storeTypes';
import type { ReportCardModel, Badge, PurchaseType } from '@/types/reportModels';

export function isSmallReport(p: Product) { return p.category === 'Reports'; }
export function isSirBundle(p: Product) { return p.category === 'Bundles' && p.id.startsWith('sir-'); }

export function isFree(p: Product) {
  return p.accessModel === 'free-gated' || p.accessModel === 'free-open';
}
export function isPaid(p: Product) {
  return p.accessModel === 'paid-direct' || p.accessModel === 'paid-contact';
}

export function toReportCardModel(p: Product): ReportCardModel {
  const badge: Badge = isFree(p) ? 'Free' : 'Paid';
  const purchaseType = (p.purchaseType as PurchaseType | undefined) ??
    (p.accessModel === 'paid-contact' ? 'contact' :
     p.accessModel === 'paid-direct'  ? 'direct'  : undefined);

  const href =
    p.accessModel === 'paid-direct' ? `/store/${p.id}` :
    p.accessModel === 'paid-contact' && p.contactPath ? p.contactPath :
    undefined;

  return {
    id: p.id,
    title: p.title,
    excerpt: p.subtitle ?? '',
    cover: p.img ?? '/images/report-cover-fallback.jpg',
    badge,
    year: (p.year as 2024 | 2025) ?? 2025,
    // optional: map tags -> topic/category if you like:
    topic: p.tags?.[0],
    category: isSmallReport(p) ? (p.tags?.[1] ?? 'Small Report') : (isSirBundle(p) ? 'Flagship' : p.category),
    href,
    price: p.price,
    purchaseType,
  };
}

