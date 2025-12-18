"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function DashboardDemo() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isLoaded, setLoaded] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  };

  return (
    <section
      id="demo"
      className="relative bg-gradient-to-b from-[#071226] via-[#050d1b] to-[#02060c]"
      aria-labelledby="dash-demo"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        {/* Centered heading + badge */}
        <div className="mb-6 text-center text-white">
          <motion.h2
            id="dash-demo"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold leading-tight text-white text-[clamp(1.6rem,5.2vw,2.2rem)]"
          >
            Inside the Interactive Dashboard
          </motion.h2>
          <div className="mt-2 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/80">
            Demo Video
          </div>
        </div>

        {/* Video frame */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative"
        >
          {/* Gradient frame */}
          <div className="rounded-3xl bg-gradient-to-tr from-emerald-300/50 via-teal-300/45 to-sky-300/50 p-[1.5px] shadow-2xl ring-1 ring-white/10">
            <div className="relative overflow-hidden rounded-[22px] bg-black/40">
              {/* Loading shimmer */}
              {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-[linear-gradient(100deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.12)_40%,rgba(255,255,255,0.06)_80%)] bg-[length:200%_100%]" />
              )}

              {/* Responsive 16:9 container */}
              <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  onCanPlay={() => setLoaded(true)}
                  poster="/images/thumbnail.png"  // replace with your poster
                  src="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/demo.mp4"            // replace with your asset
                >
                  {/* <track default kind="captions" src="/videos/dashboard-demo.vtt" srcLang="en" label="English" /> */}
                </video>

                {/* Play overlay (hidden once playing) */}
                {!isPlaying && (
                  <button
                    type="button"
                    aria-label="Play demo"
                    onClick={handlePlay}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handlePlay()}
                    className="group absolute inset-0 grid place-items-center focus:outline-none"
                  >
                    <span className="relative inline-flex items-center justify-center rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-emerald-900 shadow-lg ring-1 ring-emerald-200 transition group-hover:scale-[1.03]">
                      <svg className="-ml-1 mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M6 4l10 6-10 6V4z" />
                      </svg>
                      Play Demo
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Centered transcript toggle */}
        <div className="mx-auto mt-6 max-w-4xl">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowTranscript((v) => !v)}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/20 hover:bg-white/20"
            >
              <i className="ri-article-line text-base" />
              {showTranscript ? "Hide Quick Transcript" : "View Quick Transcript"}
            </button>
          </div>

          {showTranscript && (
            <div className="mt-3 rounded-xl bg-white/10 p-4 text-xs text-white/90 ring-1 ring-white/20">
              <ul className="list-disc space-y-1 pl-5">
                <li><strong>0:00–0:20</strong> – What the dashboard covers (audiences, trendlines since 2010).</li>
                <li><strong>0:21–1:15</strong> – Explore tab: filters, segment builder, compare to total.</li>
                <li><strong>1:16–2:10</strong> – Crosstabs & significance; small-base flags; MoE guidance.</li>
                <li><strong>2:11–2:50</strong> – Trends & Say–Do views; annotations when wording changes.</li>
                <li><strong>2:51–3:20</strong> – Exports: white-label PNGs & CSVs; saved views for reuse.</li>
              </ul>
              <p className="mt-3 text-white/75">Feature availability may vary by license and modules.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


