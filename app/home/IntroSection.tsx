// app/components/IntroSection.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';

/* =========================================================
 * SparkleMarquee — left→right wave motion (brand colors)
 * TS-safe: early guard + non-null locals inside useEffect
 * =======================================================*/
function SparkleMarquee({
  className = '',
  density = 150,   // base particle count at ~1440x800
  speed = 0.9,     // horizontal px/frame @ 60fps baseline (~54px/s)
  size = 1.0,      // global size multiplier
  freq = 1.15,     // wave cycles across width
  ampMin = 12,     // min amplitude (px)
  ampMax = 28,     // max amplitude (px)
}: {
  className?: string;
  density?: number;
  speed?: number;
  size?: number;
  freq?: number;
  ampMin?: number;
  ampMax?: number;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const hostRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // 1) Early guard
    if (!canvasRef.current || !hostRef.current) return;

    // 2) Non-null locals for the rest of the scope (TS-safe)
    const canvas: HTMLCanvasElement = canvasRef.current;
    const host: HTMLDivElement = hostRef.current;

    const ctxMaybe = canvas.getContext('2d', { alpha: true }) as CanvasRenderingContext2D | null;
    if (!ctxMaybe) return;
    const ctx: CanvasRenderingContext2D = ctxMaybe; // <- non-null, typed local from here down

    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 1, height = 1, dpr = 1;
    let raf = 0;
    let tLast = typeof performance !== 'undefined' ? performance.now() : 0;
    let tAccum = 0;

    const TAU = Math.PI * 2;

    // Brand palette: marigold, teal, emerald
    const COLORS = [
      { h: 35,  s: 96, l: 58 }, // marigold ≈ #EF9601
      { h: 174, s: 72, l: 55 }, // teal
      { h: 152, s: 72, l: 45 }, // emerald
    ];

    type P = {
      x: number;
      baseY: number;
      amp: number;
      phase: number;
      vx: number;
      r: number;
      hue: number; sat: number; light: number;
      tw: number; twSpeed: number;
      life: number;
    };

    const particles: P[] = [];
    const rnd = (a: number, b: number) => Math.random() * (b - a) + a;

    const countForArea = () => {
      const areaK = (width * height) / (1440 * 800);
      return Math.round(Math.max(40, Math.min(density * areaK, 260)));
    };

    function makeParticle(fromLeft = true): P {
      const c = COLORS[(Math.random() * COLORS.length) | 0];
      const margin = Math.max(20, width * 0.02);
      const startX = fromLeft ? rnd(-margin * 1.6, -margin * 0.6)
                              : rnd(width + margin * 0.6, width + margin * 1.6);
      const baseY = rnd(height * 0.10, height * 0.90);
      const amplitude = rnd(ampMin, ampMax);
      const phase = rnd(0, TAU);
      const k = rnd(0.85, 1.25);
      const vx = speed * k; // px/frame @ 60fps feel
      const r = size * rnd(0.7, 1.6);
      const twSpeed = rnd(0.7, 1.15);
      return {
        x: startX,
        baseY,
        amp: amplitude,
        phase,
        vx,
        r,
        hue: c.h, sat: c.s, light: c.l,
        tw: rnd(0, TAU),
        twSpeed,
        life: 1,
      };
    }

    function resize() {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = countForArea();
      while (particles.length < target) particles.push(makeParticle(true));
      while (particles.length > target) particles.pop();
    }

    function draw(now: number) {
      const dt = Math.min((now - tLast) / 1000, 0.033);
      tLast = now;
      tAccum += dt;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const margin = Math.max(20, width * 0.02);
      const waveFreq = freq;         // cycles across width
      const waveTime = tAccum * 0.6; // slow global phase drift
      const fadeY = height * 0.08;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // advance horizontally (normalize to 60fps feel)
        p.x += p.vx * (dt * 60);
        p.tw += dt * p.twSpeed;

        // wave path across the screen
        const y =
          p.baseY +
          p.amp * Math.sin(TAU * waveFreq * (p.x / Math.max(1, width)) + p.phase + waveTime);

        // wrap right -> left
        if (p.x > width + margin) {
          particles[i] = makeParticle(true);
          continue;
        }

        // soft fade near top/bottom
        const edge = y < fadeY ? Math.max(0, y / fadeY)
          : y > height - fadeY ? Math.max(0, (height - y) / fadeY)
          : 1;

        // twinkle & glow
        const twinkle = 0.5 + 0.5 * Math.sin(p.tw);
        const alpha = 0.42 * twinkle * edge * p.life;
        const rad = p.r * 12;

        const g = ctx.createRadialGradient(p.x, y, 0, p.x, y, rad);
        g.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${p.light + 8}%, ${alpha})`);
        g.addColorStop(1, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, y, rad, 0, TAU);
        ctx.fill();

        // slow life cycling to keep flow continuous
        p.life -= dt * 0.035;
        if (p.life <= 0.05) {
          particles[i] = makeParticle(true);
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(draw);
    }

    // Observe size; fallback to window resize if needed
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(host);
    else window.addEventListener('resize', resize);

    resize();

    if (!prefersReduced) {
      tLast = performance.now();
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [density, speed, size, freq, ampMin, ampMax]);

  return (
    <div ref={hostRef} className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 ${className}`}
        style={{ mixBlendMode: 'screen' }}
        aria-hidden
        data-sparkles
      />
    </div>
  );
}

/* =========================================================
 * Intro Section — layered image + foreground card + wave sparkles
 * =======================================================*/
export default function IntroSection() {
  return (
    <section aria-labelledby="intro-heading" className="relative bg-white overflow-hidden">
      {/* Decorative wave sparkles behind content */}
      <SparkleMarquee className="opacity-45" density={150} speed={0.9} size={1.0} freq={1.15} ampMin={12} ampMax={28} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-stretch"
          style={
            {
              ['--stack-h' as any]: '26rem',
            } as React.CSSProperties
          }
        >
          {/* Left: eyebrow + title (vertically centered to image stack) */}
          <div className="md:col-span-5 flex flex-col justify-center md:min-h-[var(--stack-h)]">
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

          {/* Right: layered cards (back image + foreground intro text) */}
          <div className="md:col-span-7 relative md:min-h-[var(--stack-h)]">
            {/* Back card: image */}
            <div className="relative h-72 md:h-[var(--stack-h)] w-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/intro-bg.jpg" // replace with your asset
                alt="EcoFocus sustainability research"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Foreground card: intro text */}
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

        {/* Optional divider for polish */}
        <div className="mt-10 md:mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
}




