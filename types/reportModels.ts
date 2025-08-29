// types/reportModels.ts
export type Badge = 'Free' | 'Paid';
export type PurchaseType = 'direct' | 'contact';

export type ReportCardModel = {
  id: string;
  title: string;
  excerpt: string;
  cover?: string;
  badge: Badge;
  year: 2024 | 2025;
  topic?: string;
  category?: string;
  href?: string;          // where to buy (direct)
  price?: number;
  purchaseType?: PurchaseType; // for paid items
};
