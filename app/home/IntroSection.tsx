// app/components/IntroSection.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';

/* =========================================================
 * SparkleMarquee — visible on white: solid core + soft halo
 * =======================================================*/
function SparkleMarquee({
  className = '',
  density = 160,   // particle count baseline
  speed = 0.95,    // horizontal px/frame @ ~60fps
  size = 1.0,      // size multiplier
  freq = 1.1,      // wave cycles across width
  ampMin = 12,
  ampMax = 28,
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
    if (!canvasRef.current || !hostRef.current) return;

    const canvas: HTMLCanvasElement = canvasRef.current;
    const host: HTMLDivElement = hostRef.current;

    const ctxMaybe = canvas.getContext('2d', { alpha: true }) as CanvasRenderingContext2D | null;
    if (!ctxMaybe) return;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 1, height = 1, dpr = 1;
    let raf = 0;
    let tLast = typeof performance !== 'undefined' ? performance.now() : 0;
    let tAccum = 0;

    const TAU = Math.PI * 2;

    // HSL palette tuned to read on white (slightly deeper lightness)
    const COLORS = [
      { h: 35,  s: 96, l: 52 }, // marigold
      { h: 174, s: 70, l: 40 }, // teal
      { h: 152, s: 72, l: 34 }, // emerald
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
      return Math.round(Math.max(60, Math.min(density * areaK, 280)));
    };

    function makeParticle(fromLeft = true): P {
      const c = COLORS[(Math.random() * COLORS.length) | 0];
      const margin = Math.max(20, width * 0.02);
      const startX = fromLeft ? rnd(-margin * 1.6, -margin * 0.6)
                              : rnd(width + margin * 0.6, width + margin * 1.6);
      const baseY = rnd(height * 0.12, height * 0.88);
      const amplitude = rnd(ampMin, ampMax);
      const phase = rnd(0, TAU);
      const k = rnd(0.9, 1.15);
      const vx = speed * k;
      const r = size * rnd(0.9, 1.8);
      const twSpeed = rnd(0.8, 1.2);
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

    function ensureParticles() {
      const target = countForArea();
      while (particles.length < target) particles.push(makeParticle(true));
      while (particles.length > target) particles.pop();
    }

    function resize() {
      const rect = host.getBoundingClientRect();
      width  = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ensureParticles();
    }

    function draw(now: number) {
      const dt = Math.min((now - tLast) / 1000, 0.033);
      tLast = now;
      tAccum += dt;

      // IMPORTANT: normal compositing so color shows on white
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      const margin = Math.max(20, width * 0.02);
      const waveFreq = freq;
      const waveTime = tAccum * 0.6;
      const fadeY = height * 0.10;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx * (dt * 60);
        p.tw += dt * p.twSpeed;

        // wave y
        const y =
          p.baseY +
          p.amp * Math.sin(TAU * waveFreq * (p.x / Math.max(1, width)) + p.phase + waveTime);

        // wrap
        if (p.x > width + margin) {
          particles[i] = makeParticle(true);
          continue;
        }

        // soft vertical fade
        const edge = y < fadeY ? Math.max(0, y / fadeY)
          : y > height - fadeY ? Math.max(0, (height - y) / fadeY)
          : 1;

        // Twinkle
        const twinkle = 0.6 + 0.4 * Math.sin(p.tw);

        // 1) Soft halo (radial gradient)
        const haloAlpha = 0.28 * twinkle * edge * p.life; // visible on white
        const haloR = p.r * 16;
        const g = ctx.createRadialGradient(p.x, y, 0, p.x, y, haloR);
        g.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${p.light + 10}%, ${haloAlpha})`);
        g.addColorStop(1, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, y, haloR, 0, TAU);
        ctx.fill();

        // 2) Solid core dot (ensures visibility on white)
        const coreAlpha = 0.85 * edge * p.life;
        const coreR = Math.max(1.5, p.r * 2.0);
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${p.hue}, ${p.sat}%, ${p.light + 12}%, ${0.35 * twinkle * edge})`;
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light + 6}%, ${coreAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, y, coreR, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;

        // life cycle
        p.life -= dt * 0.03;
        if (p.life <= 0.05) {
          particles[i] = makeParticle(true);
        }
      }

      raf = requestAnimationFrame(draw);
    }

    // observe + start
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(host);
    else window.addEventListener('resize', resize);

    resize();
    // kick once more in case layout settles next frame
    setTimeout(resize, 0);

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
        /* NOTE: no blend mode — we draw visible color ourselves */
        aria-hidden
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
      {/* Sparkles above content so they’re not obscured by white panels */}
      <SparkleMarquee className="z-20 opacity-70" density={170} speed={0.95} size={1.0} freq={1.1} ampMin={12} ampMax={28} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16 z-10">
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
                src="/images/intro-bg.png" // replace with your asset
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






