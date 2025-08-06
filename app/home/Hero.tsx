import HeroContent from './HeroContent';

export interface HeroData {
  headline: string;
  subheadline: string;
  highlightedWord?: string;
  description: string;
  backgroundImage?: {
    id: string;
    url: string;
  } | null;
  backgroundVideo?: {
    id: string;
    url: string;
  } | null;
  ctaButtons?: {
    id: string;
    label: string;
    url: string;
  }[];
}

async function getHeroData(): Promise<HeroData | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/hero-section?limit=1&depth=1`;

    console.log('[Hero] Fetching Hero data from:', url);

    const res = await fetch(url, {
      cache: 'no-store', // SSR: always fresh
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`[Hero] Failed to fetch Hero data. Status: ${res.status}`);
      return null;
    }

    const data = await res.json();

    if (!data?.docs?.length) {
      console.warn('[Hero] No hero data found.');
      return null;
    }

    const heroData: HeroData = data.docs[0];
    console.log('[Hero] Hero data loaded:', heroData);

    return heroData;
  } catch (err) {
    console.error('[Hero] Error fetching Hero data:', err);
    return null;
  }
}

export default async function Hero() {
  const heroData = await getHeroData();

  if (!heroData) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-gray-900 text-white">
        <p>Loading hero section...</p>
      </section>
    );
  }

  return <HeroContent heroData={heroData} />;
}

































