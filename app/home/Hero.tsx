// app/components/Hero/index.tsx (server component)
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

// If you want no caching at all:
export const revalidate = 0;            // or: export const dynamic = 'force-dynamic';

const CMS_BASE =
  (process.env.NEXT_PUBLIC_CMS_URL || '').replace(/\/$/, ''); // strip trailing slash

function resolveUrl(u?: string | null): string | null {
  if (!u) return null;
  // If CMS returns relative paths, prepend base
  return /^https?:\/\//i.test(u) ? u : `${CMS_BASE}${u.startsWith('/') ? '' : '/'}${u}`;
}

async function fetchMediaById(id: string | number): Promise<{ url: string } | null> {
  try {
    if (!CMS_BASE) return null;
    const res = await fetch(`${CMS_BASE}/api/media/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const media = await res.json();
    const url = resolveUrl(media?.url);
    return url ? { url } : null;
  } catch (err) {
    console.error('[Hero] Error fetching media by id:', err);
    return null;
  }
}

async function getHeroData(): Promise<HeroData | null> {
  try {
    if (!CMS_BASE) return null;
    const res = await fetch(
      `${CMS_BASE}/api/hero-section?limit=1&depth=2&overrideAccess=true`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const doc = data?.docs?.[0];
    if (!doc) return null;

    // Derive raw URLs/IDs from doc for both media
    const rawVideo =
      doc.backgroundVideo && typeof doc.backgroundVideo === 'object' && doc.backgroundVideo.url
        ? resolveUrl(doc.backgroundVideo.url)
        : null;

    const rawVideoId =
      !rawVideo && (typeof doc.backgroundVideo === 'string' || typeof doc.backgroundVideo === 'number')
        ? (doc.backgroundVideo as string | number)
        : null;

    const rawImage =
      doc.backgroundImage && typeof doc.backgroundImage === 'object' && doc.backgroundImage.url
        ? resolveUrl(doc.backgroundImage.url)
        : null;

    const rawImageId =
      !rawImage && (typeof doc.backgroundImage === 'string' || typeof doc.backgroundImage === 'number')
        ? (doc.backgroundImage as string | number)
        : null;

    // Fetch both in parallel (IDs only)
    const [videoFromId, imageFromId] = await Promise.all([
      rawVideo ? Promise.resolve(null) : rawVideoId ? fetchMediaById(rawVideoId) : Promise.resolve(null),
      rawImage ? Promise.resolve(null) : rawImageId ? fetchMediaById(rawImageId) : Promise.resolve(null),
    ]);

    const backgroundVideo = (rawVideo || videoFromId?.url) ? { url: (rawVideo || videoFromId?.url)! } : null;
    const backgroundImage = (rawImage || imageFromId?.url) ? { url: (rawImage || imageFromId?.url)! } : null;

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
        <div className="min-h-[60svh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center bg-gray-900 text-white">
          <p>Loading hero section...</p>
        </div>
      ) : (
        // HeroContent already handles responsive text, overlay, buttons
        // It will also use backgroundImage as a poster fallback if you add poster there.
        <HeroContent heroData={heroData} />
      )}
    </section>
  );
}








































