// components/home/EcoNuggetInsights.tsx
import { getPosts } from '@/lib/payload';
import EcoNuggetInsightsClient from './EcoNuggetInsightsClient';

type Card = {
  title: string;
  excerpt?: string;
  category?: string;
  time?: string;
  image: string;
  link: string;
};

export default async function EcoNuggetInsights({ limit = 3 }: { limit?: number } = {}) {
  let featured: Card | null = null;
  let posts: Card[] = [];

  try {
    const res = await getPosts({ limit });
    const docs = (res?.docs || []).filter(Boolean);

    if (docs.length) {
      const [first, ...rest] = docs;

      featured = {
        title: first.title,
        excerpt: first.excerpt || '',
        category: first?.categories?.[0]?.name || 'Insights',
        time: first?.readTime ? `${first.readTime} min read` : undefined,
        image: first?.coverImage?.url || '/images/placeholder/16x9.jpg',
        link: `/blog/${first.slug}`,
      };

      posts = rest.slice(0, 2).map((d: any) => ({
        title: d.title,
        category: d?.categories?.[0]?.name || 'Insights',
        time: d?.readTime ? `${d.readTime} min read` : undefined,
        image: d?.coverImage?.url || '/images/placeholder/4x3.jpg',
        link: `/blog/${d.slug}`,
      }));
    }
  } catch {
    // If fetch fails, render nothing (or swap to a small fallback if you prefer)
  }

  if (!featured) return null;
  return <EcoNuggetInsightsClient featured={featured} posts={posts} />;
}












