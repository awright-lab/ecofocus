import HeroContent from './HeroContent';

export interface HeroData {
  id: number | string;
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
  } | number | null; // Allow number if depth is not applied
  ctaButtons?: {
    id: string;
    label: string;
    url: string;
  }[];
}

async function getHeroData(): Promise<HeroData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_CMS_URL;
    const url = `${baseUrl}/api/hero-section?limit=1&depth=1`;

    console.log('==========================');
    console.log('[Hero] Fetching Hero data...');
    console.log('[Hero] Using CMS URL:', baseUrl);
    console.log('[Hero] Full request URL:', url);

    const res = await fetch(url, {
      cache: 'no-store', // Always fresh
      headers: {
        Accept: 'application/json',
      },
    });

    console.log('[Hero] Fetch status:', res.status);

    if (!res.ok) {
      console.error(`[Hero] Failed to fetch Hero data. Status: ${res.status}`);
      return null;
    }

    const data = await res.json();

    console.log('[Hero] Raw API response:', JSON.stringify(data, null, 2));

    if (!data?.docs?.length) {
      console.warn('[Hero] No hero data found in response.');
      return null;
    }

    const heroData: HeroData = data.docs[0];

    console.log('[Hero] Parsed HeroData object:', JSON.stringify(heroData, null, 2));

    return heroData;
  } catch (err) {
    console.error('[Hero] Error fetching Hero data:', err);
    return null;
  }
}

export default async function Hero() {
  const heroData = await getHeroData();

  if (!heroData) {
    console.warn('[Hero] Hero data is null, rendering fallback section.');
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-gray-900 text-white">
        <p>Loading hero section...</p>
      </section>
    );
  }

  console.log('[Hero] Passing HeroData to HeroContent:', JSON.stringify(heroData, null, 2));

  return <HeroContent heroData={heroData} />;
}


































