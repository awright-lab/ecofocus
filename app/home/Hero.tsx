import HeroContent from './HeroContent';

export interface HeroData {
  headline: string;
  subheadline: string;
  highlightedWord?: string;
  description: string;
  backgroundImage?: { url: string };
  backgroundVideo?: { url: string };
  ctaButtons?: { id: string; label: string; url: string }[];
}

async function getHeroData(): Promise<HeroData | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/hero-section?limit=1`;

    const res = await fetch(url, {
      cache: 'no-store', // Always fetch fresh data (SSR)
    });

    if (!res.ok) {
      console.error(`Failed to fetch Hero data. Status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.docs?.[0] || null;
  } catch (err) {
    console.error('Error fetching Hero data:', err);
    return null;
  }
}

export default async function Hero() {
  const heroData = await getHeroData();
  return <HeroContent heroData={heroData} />;
}

































