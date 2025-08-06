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

async function getHeroData(): Promise<HeroData | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/hero-section?limit=1&depth=2`;
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

    // ✅ Handle both ID and object
    const normalizeMedia = (media: any) => {
      if (media && typeof media === 'object' && media.url) {
        return { url: media.url };
      }
      return null;
    };

    const heroData: HeroData = {
      headline: doc.headline,
      subheadline: doc.subheadline,
      highlightedWord: doc.highlightedWord,
      description: doc.description,
      backgroundImage: normalizeMedia(doc.backgroundImage),
      backgroundVideo: normalizeMedia(doc.backgroundVideo),
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






































