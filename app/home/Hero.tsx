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

    console.log('Fetching Hero data from:', url); // Debug: URL
    console.log('Using API token (first 6 chars):', process.env.CMS_API_TOKEN?.slice(0, 6)); // Debug: partial token

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
      },
      cache: 'no-store', // Always fresh for SSR
    });

    if (!res.ok) {
      console.error(`Failed to fetch Hero data. Status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const heroData = data.docs?.[0] || null;

    console.log('HeroData from CMS:', JSON.stringify(heroData, null, 2)); // Debug: log actual response

    return heroData;
  } catch (err) {
    console.error('Error fetching Hero data:', err);
    return null;
  }
}

export default async function Hero() {
  const heroData = await getHeroData();
  return <HeroContent heroData={heroData} />;
}
































