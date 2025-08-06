import HeroContent from './HeroContent';

export interface HeroData {
  id: number;
  headline: string;
  subheadline: string;
  highlightedWord?: string;
  description: string;
  backgroundImage?: {
    id: number | string;
    url: string;
  } | null;
  backgroundVideo?: {
    id: number | string;
    url: string;
  } | null;
  ctaButtons?: {
    id: string;
    label: string;
    url: string;
  }[];
}

async function fetchMediaItem(id: number | string) {
  try {
    const mediaRes = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_URL}/api/media/${id}`,
      { cache: 'no-store', headers: { Accept: 'application/json' } }
    );
    if (!mediaRes.ok) return null;
    const mediaData = await mediaRes.json();
    return mediaData || null;
  } catch (err) {
    console.error('[Hero] Error fetching media item:', err);
    return null;
  }
}

async function getHeroData(): Promise<HeroData | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/hero-section?limit=1&depth=2`;

    console.log('[Hero] Fetching Hero data...');
    console.log('[Hero] Using CMS URL:', process.env.NEXT_PUBLIC_CMS_URL);
    console.log('[Hero] Full request URL:', url);

    const res = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    console.log('[Hero] Fetch status:', res.status);

    if (!res.ok) {
      console.error('[Hero] Failed to fetch Hero data.');
      return null;
    }

    const data = await res.json();
    console.log('[Hero] Raw API response:', JSON.stringify(data, null, 2));

    if (!data?.docs?.length) return null;

    const heroData: HeroData = data.docs[0];

    // ✅ Normalize backgroundVideo and backgroundImage
    if (typeof heroData.backgroundVideo === 'number') {
      const videoObj = await fetchMediaItem(heroData.backgroundVideo);
      if (videoObj?.url) {
        heroData.backgroundVideo = {
          id: videoObj.id,
          url: videoObj.url,
        };
      }
    }

    if (typeof heroData.backgroundImage === 'number') {
      const imageObj = await fetchMediaItem(heroData.backgroundImage);
      if (imageObj?.url) {
        heroData.backgroundImage = {
          id: imageObj.id,
          url: imageObj.url,
        };
      }
    }

    console.log('[Hero] Normalized HeroData:', heroData);
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



































