// lib/storeTypes.ts

export type BuyerProfile = 'Brand / Other' | 'Agency' | 'Enterprise';
export type ProductCategory = 'Bundles' | 'Reports';

export type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  img: string;                // public path under /public/images/...
  category: ProductCategory;
  year?: number;              // required for small reports, omitted for bundles
  tags?: string[];
  includes?: string[];
  badge?: string;             // e.g. "NEW • 2025"
  variantNote?: string;       // e.g. dashboard seat note
};

export type CartItem = {
  id: string;                 // must match a Product.id
  qty: number;
  buyer: BuyerProfile;
};
