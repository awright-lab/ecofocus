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
    const res = await fetch(mediaUrl, { cache: 'no-store' });
    if (!res.ok) return null;

    const media = await res.json();
    return media?.url ? { url: media.url } : null;
  } catch (err) {
    console.error('[Hero] Error fetching media:', err);
    return null;
  }
}

async function getHeroData(): Promise<HeroData | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/hero-section?limit=1&depth=2&overrideAccess=true`;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.docs?.length) return null;

    const doc = data.docs[0];

    const backgroundVideo =
      doc.backgroundVideo && typeof doc.backgroundVideo === 'object' && doc.backgroundVideo.url
        ? { url: doc.backgroundVideo.url }
        : typeof doc.backgroundVideo === 'string' || typeof doc.backgroundVideo === 'number'
        ? await fetchMediaById(doc.backgroundVideo)
        : null;

    const backgroundImage =
      doc.backgroundImage && typeof doc.backgroundImage === 'object' && doc.backgroundImage.url
        ? { url: doc.backgroundImage.url }
        : typeof doc.backgroundImage === 'string' || typeof doc.backgroundImage === 'number'
        ? await fetchMediaById(doc.backgroundImage)
        : null;

    return {
      headline: doc.headline,
      subheadline: doc.subheadline,
      highlightedWord: doc.highlightedWord,
      description: doc.description,
      backgroundImage,
      backgroundVideo,
      ctaButtons: doc.ctaButtons || [],
    };
  } catch (err) {
    console.error('[Hero] Error fetching Hero data:', err);
    return null;
  }
}

export default async function Hero() {
  const heroData = await getHeroData();

  return (
    <section>
      {!heroData ? (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-900 text-white">
          <p>Loading hero section...</p>
        </div>
      ) : (
        <HeroContent heroData={heroData} />
      )}
    </section>
  );
}








































