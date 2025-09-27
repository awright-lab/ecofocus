// app/components/IntroSection.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';

export default function IntroSection() {
  return (
    <section aria-labelledby="intro-heading" className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div
          className="
            grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10
            items-stretch
          "
          /* Match the visual height of the image stack so the left side can center to it */
          style={
            {
              // Image stack is ~26rem tall on md+, so center against that height.
              ['--stack-h' as any]: '26rem',
            } as React.CSSProperties
          }
        >
          {/* Left: eyebrow + title (vertically centered on md+) */}
          <div
            className="
              md:col-span-5
              flex flex-col justify-center
              md:min-h-[var(--stack-h)]
            "
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] tracking-wide self-start">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
              <span className="text-emerald-700 font-medium">About EcoFocus</span>
            </div>

            <h2
              id="intro-heading"
              className="font-bold leading-tight text-slate-900 text-[clamp(1.8rem,4vw,2.6rem)]"
            >
              Trusted Insights for Purpose-Driven Growth
            </h2>
          </div>

          {/* Right: layered cards (back image + foreground intro card) */}
          <div className="md:col-span-7 relative md:min-h-[var(--stack-h)]">
            {/* Back card: image */}
            <div className="relative h-72 md:h-[var(--stack-h)] w-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/intro-bg.png" // <-- replace with your chosen image
                alt="EcoFocus sustainability research"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Foreground card: intro text (overlapping the image) */}
            <div className="absolute bottom-0 left-0 md:-left-12 translate-y-1/3 md:translate-y-1/4 w-[90%] md:w-[70%]">
              <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 p-6 md:p-8">
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">
                  For over 13 years, EcoFocus has tracked how sustainability shapes consumer
                  decisions. We help brands and agencies turn credible consumer data into
                  strategies that resonate, perform, and prove ROI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


