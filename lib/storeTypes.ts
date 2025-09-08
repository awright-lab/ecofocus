// catalog/storeTypes.ts

export type PurchaseType = 'direct' | 'contact';
export type AccessModel = 'free-gated' | 'free-open' | 'paid-direct' | 'paid-contact';

/**
 * Fields shared by all products. Intentionally keeps some props optional at the base,
 * but specific product kinds (Reports/Bundles) can tighten requirements.
 */
export type BaseProduct = {
  id: string;
  title: string;
  subtitle?: string;
  price?: number;
  img?: string; // optional at the base; made required per kind below
  category: 'Bundles' | 'Reports';
  year?: number; // optional at the base; required for Reports
  tags?: string[];
  includes?: string[];
  variantNote?: string;
  badge?: string;
  purchaseType?: PurchaseType;
  contactPath?: string;
  ctaLabel?: string;

  /** Drives Free vs Paid behavior across the site (reports hub pages) */
  accessModel: AccessModel;
};

/**
 * Reports MUST have an image and a year.
 * This guarantees downstream UIs (carousels, cards) always receive a string image.
 */
export type ReportProduct = Omit<BaseProduct, 'category' | 'img' | 'year'> & {
  category: 'Reports';
  img: string;
  year: number;
};

/**
 * Bundles: recommend requiring an image as well (keeps visuals consistent).
 * If you truly need imageless bundles, change `img: string` back to `img?: string`.
 */
export type BundleProduct = Omit<BaseProduct, 'category'> & {
  category: 'Bundles';
  img: string;
};

export type Product = ReportProduct | BundleProduct;

/* ---------- Type guards for safe narrowing ---------- */

export const isReportProduct = (p: Product): p is ReportProduct =>
  p.category === 'Reports';

export const isBundleProduct = (p: Product): p is BundleProduct =>
  p.category === 'Bundles';
