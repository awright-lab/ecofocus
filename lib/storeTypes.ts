// catalog/storeTypes.ts
export type PurchaseType = 'direct' | 'contact';
export type AccessModel = 'free-gated' | 'free-open' | 'paid-direct' | 'paid-contact';

export type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price?: number;
  img?: string;
  category: 'Bundles' | 'Reports';
  year?: number;                 // keep flexible
  tags?: string[];
  includes?: string[];
  variantNote?: string;
  badge?: string;
  purchaseType?: PurchaseType;   // legacy/for store
  contactPath?: string;
  ctaLabel?: string;

  // Drives Free vs Paid behavior across the site (reports hub pages)
  accessModel: AccessModel;
};
