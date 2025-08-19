// lib/storeTypes.ts
export type ProductCategory = 'Bundles' | 'Reports';

export type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  img: string;
  category: ProductCategory;
  year?: number;         // keep optional for bundles
  tags?: string[];
  includes?: string[];
  badge?: string;
  variantNote?: string;
};

// Narrow type for small reports (helpful for detail pages)
export type SmallReport = Product & {
  category: 'Reports';
  year: number;
};
