// app/demo/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * ================================
 *  CONFIG — your video is set here
 * ================================
 */
const SITE_URL = "https://ecofocusresearch.netlify.app";
const PAGE_PATH = "/demo";

const PAGE_TITLE = "EcoFocus Demo";
const PAGE_DESCRIPTION =
  "Watch a quick walkthrough of our interactive dashboard and how teams can turn sustainability intent into action.";

// Your R2-hosted MP4
const VIDEO_MP4 =
  "https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/EcoFocus%20video%20V4.mp4";

// (Optional) Add these later if you have them:
const VIDEO_WEBM = "";    // e.g., alternative .webm stream
const VIDEO_POSTER = "";  // e.g., "/images/og/demo-poster.jpg"
const VTT_CAPTIONS = "";  // e.g., "/captions/demo-en.vtt"

// Leave YouTube empty since we're using a direct MP4
const YOUTUBE_ID = "";

/* -------------------- SEO -------------------- */
export const metadata: Metadata = {
  title: {
    default: PAGE_TITLE,
    template: "%s | EcoFocus Research",
  },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: SITE_URL + PAGE_PATH,
    type: "video.other",
    images: [
      {
        url:
          VIDEO_POSTER ||
          `${SITE_URL}/images/og/ecofocus-og.jpg`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [
      VIDEO_POSTER || `${SITE_URL}/images/og/ecofocus-og.jpg`,
    ],
  },
};

/* JSON-LD: VideoObject */
const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  thumbnailUrl: [
    VIDEO_POSTER ? SITE_URL + VIDEO_POSTER : `${SITE_URL}/images/og/ecofocus-og.jpg`,
  ],
  uploadDate: "2025-10-06", // update if needed
  contentUrl: VIDEO_MP4 || undefined,
  embedUrl: YOUTUBE_ID ? `https://www.youtube.com/embed/${YOUTUBE_ID}` : undefined,
};

function VideoBlock() {
  if (YOUTUBE_ID) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-[0_14px_48px_-18px_rgba(2,12,27,.22)] bg-black">
        <div className="aspect-video">
          <iframe
            title="EcoFocus Demo Video"
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1`}
            className="h-full w-full"
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-[0_14px_48px_-18px_rgba(2,12,27,.22)] bg-black">
      <div className="aspect-video">
        <video
          className="h-full w-full"
          preload="metadata"
          controls
          playsInline
          poster={VIDEO_POSTER || undefined}
          // uncomment if you want to prevent download UI in some browsers (not guaranteed):
          // controlsList="nodownload noplaybackrate"
        >
          {VIDEO_WEBM ? <source src={VIDEO_WEBM} type="video/webm" /> : null}
          <source src={VIDEO_MP4} type="video/mp4" />
          {VTT_CAPTIONS ? (
            <track
              kind="captions"
              srcLang="en"
              src={VTT_CAPTIONS}
              label="English"
              default
            />
          ) : null}
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <>
      <Script
        id="jsonld-video"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />

      <Header />

      <main
        className="
          relative
          bg-white
          before:pointer-events-none before:absolute before:inset-0
          before:bg-[radial-gradient(60rem_40rem_at_10%_-10%,rgba(16,185,129,0.06),transparent_60%),radial-gradient(48rem_32rem_at_120%_-20%,rgba(59,130,246,0.05),transparent_60%)]
        "
      >
        <section className="relative isolate">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-[50rem] -translate-x-1/2 rounded-full
                       bg-gradient-to-r from-emerald-500/15 via-teal-400/10 to-amber-400/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto mb-8 max-w-3xl text-center">
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 ring-1 ring-emerald-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                EcoFocus Demo
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                See EcoFocus in Action
              </h1>
              <p className="mt-3 text-base leading-7 text-slate-600">
                A quick walkthrough of our  interactive dashboard and how teams can turn sustainability intent into action.
              </p>
            </div>

            <div className="mx-auto max-w-5xl">
              <VideoBlock />
            </div>

            <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-slate-500">
              Need a copy to share internally? Ask us for a branded download link.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
