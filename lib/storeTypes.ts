// storeTypes.ts
export type PurchaseType = 'direct' | 'contact';

export type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price?: number;                 // keep optional so contact-first items don't need a price
  img: string;
  category: 'Reports' | 'Bundles';
  year?: number;
  tags?: string[];
  includes?: string[];
  badge?: string;
  variantNote?: string;

  // NEW (optional)
  purchaseType?: PurchaseType;    // 'direct' (default) or 'contact'
  contactPath?: string;           // where to send users for discovery
  ctaLabel?: string;              // optional override for contact CTA text
};
