import HeroContent from './HeroContent';

export interface HeroData {
  headline: string;
  subheadline: string;
  highlightedWord?: string;
  description: string;
  backgroundImage?: { url: string } | null;
  backgroundVideo?: { url: string } | null;
  ctaButtons?: { id: string; label: string; url: string }[];
}

async function fetchMediaById(id: string | number): Promise<{ url: string } | null> {
  try {
    const mediaUrl = `${process.env.NEXT_PUBLIC_CMS_URL}/api/media/${id}`;
    console.log(`[Hero] Fetching media for ID ${id}: ${mediaUrl}`);

    const res = await fetch(mediaUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`[Hero] Failed to fetch media for ID ${id}. Status: ${res.status}`);
      return null;
    }

    const media = await res.json();
    console.log('[Hero] Media response:', media);

    return media?.url ? { url: media.url } : null;
  } catch (err) {
    console.error('[Hero] Error fetching media:', err);
    return null;
  }
}

async function getHeroData(): Promise<HeroData | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/hero-section?limit=1&depth=2&overrideAccess=true`;
    console.log('[Hero] Fetching Hero data from:', url);

    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      console.error(`[Hero] Failed to fetch Hero data. Status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    console.log('[Hero] Raw API response:', JSON.stringify(data, null, 2));

    if (!data?.docs?.length) return null;

    const doc = data.docs[0];

    // Normalize media fields with fallback fetch
    let backgroundVideo = null;
    if (doc.backgroundVideo && typeof doc.backgroundVideo === 'object' && doc.backgroundVideo.url) {
      backgroundVideo = { url: doc.backgroundVideo.url };
    } else if (typeof doc.backgroundVideo === 'string' || typeof doc.backgroundVideo === 'number') {
      backgroundVideo = await fetchMediaById(doc.backgroundVideo);
    }

    let backgroundImage = null;
    if (doc.backgroundImage && typeof doc.backgroundImage === 'object' && doc.backgroundImage.url) {
      backgroundImage = { url: doc.backgroundImage.url };
    } else if (typeof doc.backgroundImage === 'string' || typeof doc.backgroundImage === 'number') {
      backgroundImage = await fetchMediaById(doc.backgroundImage);
    }

    const heroData: HeroData = {
      headline: doc.headline,
      subheadline: doc.subheadline,
      highlightedWord: doc.highlightedWord,
      description: doc.description,
      backgroundImage,
      backgroundVideo,
      ctaButtons: doc.ctaButtons || [],
    };

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







































