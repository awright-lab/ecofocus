import HeroContent from './HeroContent';

export interface HeroData {
  id: number;
  headline: string;
  subheadline: string;
  highlightedWord?: string;
  description: string;
  backgroundImage?: {
    id: string | number;
    url: string;
  } | null;
  backgroundVideo?: {
    id: string | number;
    url: string;
  } | null;
  ctaButtons?: {
    id: string;
    label: string;
    url: string;
  }[];
}

async function fetchMedia(id: number | string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/media/${id}`);
    if (!res.ok) {
      console.error(`[Hero] Failed to fetch media for ID ${id}. Status: ${res.status}`);
      return null;
    }
    const media = await res.json();
    console.log(`[Hero] Loaded media for ID ${id}:`, media.url || '(no url)');
    return media;
  } catch (err) {
    console.error(`[Hero] Error fetching media for ID ${id}:`, err);
    return null;
  }
}

async function getHeroData(): Promise<HeroData | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/hero-section?limit=1&depth=2`;

    console.log('[Hero] Fetching Hero data from:', url);

    const res = await fetch(url, {
      cache: 'no-store',
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

    let heroData: HeroData = data.docs[0];
    console.log('[Hero] Initial HeroData from API:', heroData);

    // ✅ Normalize backgroundVideo
    if (heroData.backgroundVideo && typeof heroData.backgroundVideo === 'number') {
      const videoData = await fetchMedia(heroData.backgroundVideo);
      if (videoData?.url) {
        heroData = { ...heroData, backgroundVideo: videoData };
      }
    }

    // ✅ Normalize backgroundImage
    if (heroData.backgroundImage && typeof heroData.backgroundImage === 'number') {
      const imageData = await fetchMedia(heroData.backgroundImage);
      if (imageData?.url) {
        heroData = { ...heroData, backgroundImage: imageData };
      }
    }

    console.log('[Hero] Final normalized HeroData:', heroData);

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




































