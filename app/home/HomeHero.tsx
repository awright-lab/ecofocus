// app/(site)/_components/HomeHero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function HomeHero() {
  const IMG_SRC = "/images/leaf-circuit-hero.jpg";
  const BLUR = "/images/leaf-circuit-hero-blur.jpg";

  return (
    <section className="relative w-full overflow-hidden" aria-labelledby="home-hero-title">
      {/* 0) Dark base */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_bottom,#061012_0%,#081417_55%,#0a1114_100%)]" />

      {/* 1) Optimized leaf image — bottom-right, responsive width (no multiline classes) */}
      <div className="pointer-events-none select-none absolute -z-10 bottom-0 right-0 translate-x-[6%] translate-y-[6%] sm:translate-x-[4%] sm:translate-y-[4%] md:translate-x-[6%] md:translate-y-[6%]">
        <div className="relative w-[58vw] max-w-[980px] sm:w-[64vw] md:w-[58vw] aspect-[16/10]" style={{ filter: "saturate(1.06) brightness(1.02)" }}>
          <Image
            src={IMG_SRC}
            alt=""
            fill
            priority
            placeholder="blur"
            blurDataURL={BLUR}
            sizes="(max-width: 640px) 64vw, (max-width: 1024px) 58vw, 58vw"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {/* 2) Soft bottom vignette */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,rgba(4,7,9,0.92),rgba(4,7,9,0)_85%)]" />

      {/* 3) Subtle animated sheen (brighter) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-25 will-change-transform"
        style={{ background: "linear-gradient(100deg, transparent 35%, rgba(56,189,248,0.28) 50%, transparent 65%)", backgroundSize: "220% 100%", animation: "heroSheen 18s linear infinite" }}
      />

      {/* 4) Sparkle overlay (brightened) */}
      <SparkleOverlay className="absolute inset-0 pointer-events-none mix-blend-screen opacity-95" />

      {/* CONTENT (left side) */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[68vh] md:min-h-[62vh] items-center py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1 id="home-hero-title" className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white">
              Decoding the Purpose-Driven{" "}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">Generation</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg sm:text-xl text-white/90">Reliable Sustainability Data to Support Your Next Big Marketing Decision</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/benefits" className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-3 font-semibold text-white transition">Explore Benefits</Link>
              <Link href="/contact" className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-white hover:bg-white/15 transition">Request Details</Link>
            </div>
          </div>
          <div className="hidden lg:block flex-1" />
        </div>
      </div>

      {/* Animations + reduced motion guard */}
      <style jsx>{`
        @keyframes heroSheen {
          0% { background-position: 220% 0; }
          100% { background-position: -220% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(canvas[data-sparkles]) { animation: none !important; }
          /* Stop sheen animation */
          :global(section[aria-labelledby="home-hero-title"] > div[aria-hidden="true"].mix-blend-screen) { animation: none !important; }
        }
        /* Responsive nudge for the image wrapper (pure CSS; no multiline class strings) */
        @media (max-width: 1024px) {
          section[aria-labelledby="home-hero-title"] > div.absolute.-z-10.bottom-0.right-0 { transform: translate(4%, 4%); }
        }
        @media (max-width: 640px) {
          section[aria-labelledby="home-hero-title"] > div.absolute.-z-10.bottom-0.right-0 { transform: translate(3%, 3%); }
        }
      `}</style>
    </section>
  );
}

/* ---------- Sparkle Overlay (Canvas, brighter) ---------- */
function SparkleOverlay({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let t0 = performance.now();

    type P = { x:number; y:number; vx:number; vy:number; r:number; hue:number; phase:number; life:number; speed:number; };
    const particles: P[] = [];
    const MAX_BASE = 90;
    const colorBand: [number, number] = [165, 205];
    const BASE_ALPHA = 0.20;
    const RADIUS_MULT = 7.5;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const areaK = (width * height) / (1440 * 800);
      const target = Math.min(Math.round(MAX_BASE * areaK), 140);
      while (particles.length < target) particles.push(makeParticle());
      while (particles.length > target) particles.pop();
    }

    const rnd = (a:number,b:number)=>Math.random()*(b-a)+a;

    function makeParticle(): P {
      return {
        x: rnd(width * 0.42, width * 0.95),
        y: rnd(height * 0.15, height * 0.92),
        vx: rnd(-0.08, 0.10),
        vy: rnd(-0.05, 0.06),
        r: rnd(0.8, 1.9),
        hue: rnd(colorBand[0], colorBand[1]),
        phase: rnd(0, Math.PI * 2),
        life: rnd(0.6, 1),
        speed: rnd(0.65, 1.35),
      };
    }

    function draw(now: number) {
      const dt = Math.min((now - t0) / 1000, 0.033);
      t0 = now;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;

        // gentle pull toward lower-right focal area
        p.x += (width * 0.72 - p.x) * 0.0006;
        p.y += (height * 0.70 - p.y) * 0.0005;

        p.phase += dt * 1.15;
        const twinkle = 0.55 + 0.45 * Math.sin(p.phase);
        const alpha = BASE_ALPHA * p.life * twinkle;

        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;
        if (p.y < -12) p.y = height + 12;
        if (p.y > height + 12) p.y = -12;

        const rad = p.r * RADIUS_MULT;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        grad.addColorStop(0, `hsla(${p.hue}, 95%, 65%, ${alpha})`);
        grad.addColorStop(1, `hsla(${p.hue + 8}, 95%, 55%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    }

    function handleResize() { resize(); }
    resize();
    window.addEventListener("resize", handleResize);
    if (!mql.matches) raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} data-sparkles className={className} />;
}













