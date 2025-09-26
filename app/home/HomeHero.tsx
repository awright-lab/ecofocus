"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HomeHero() {
  const BG =
    "/images/hero-bg.png"; // <-- put your image here (the one you attached)

  return (
    <section className="relative w-full overflow-hidden" aria-labelledby="home-hero-title">
      {/* Still background image */}
      <div
        className="absolute inset-0 -z-10 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${BG})`,
          // bias the focus to the right where the leaf is
          backgroundPosition: "75% 45%",
        }}
      />

      {/* Soft bottom vignette to blend into the next section (no harsh band) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,rgba(5,9,11,0.85),rgba(5,9,11,0)_90%)]" />

      {/* Animated sheen (very subtle, slow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-15 will-change-transform"
        style={{
          background:
            "linear-gradient(100deg, transparent 35%, rgba(56,189,248,0.18) 50%, transparent 65%)",
          backgroundSize: "220% 100%",
          animation: "heroSheen 22s linear infinite",
        }}
      />

      {/* Sparkle overlay (canvas) */}
      <SparkleOverlay className="absolute inset-0 pointer-events-none mix-blend-screen opacity-80" />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[68vh] md:min-h-[62vh] items-center py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1
              id="home-hero-title"
              className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white"
            >
              Decoding the Purpose-Driven{" "}
              <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                Generation
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg sm:text-xl text-white/90">
              Reliable Sustainability Data to Support Your Next Big Marketing Decision
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/benefits"
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-3 font-semibold text-white transition"
              >
                Explore Benefits
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-white hover:bg-white/15 transition"
              >
                Request Details
              </Link>
            </div>
          </div>
          <div className="hidden lg:block flex-1" />
        </div>
      </div>

      {/* Animations + reduced-motion guard */}
      <style jsx>{`
        @keyframes heroSheen {
          0% { transform: translate3d(0,0,0); background-position: 220% 0; }
          100% { transform: translate3d(0,0,0); background-position: -220% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(canvas[data-sparkles]), div[style*="heroSheen"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------- Sparkle Overlay (Canvas) ---------- */
function SparkleOverlay({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let t0 = performance.now();

    type P = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; // radius
      hue: number; // 170–200 teal/cyan band
      phase: number; // for twinkle
      life: number; // 0..1 cycles
      speed: number;
    };

    const particles: P[] = [];
    const MAX_BASE = 70; // base count on 1440x800; scales with area
    const colorBand = [170, 210]; // cyan/teal degrees

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // scale particle count with area, cap for perf
      const areaK = (width * height) / (1440 * 800);
      const target = Math.min(Math.round(MAX_BASE * areaK), 120);
      while (particles.length < target) particles.push(makeParticle());
      while (particles.length > target) particles.pop();
    }

    function rnd(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function makeParticle(): P {
      // favor right/center where the leaf is (x start around 45–90%)
      const startX = rnd(width * 0.45, width * 0.92);
      const startY = rnd(height * 0.12, height * 0.88);
      return {
        x: startX,
        y: startY,
        vx: rnd(-0.08, 0.08),
        vy: rnd(-0.04, 0.04),
        r: rnd(0.7, 1.8),
        hue: rnd(colorBand[0], colorBand[1]),
        phase: rnd(0, Math.PI * 2),
        life: rnd(0.4, 1),
        speed: rnd(0.5, 1.2),
      };
    }

    function draw(now: number) {
      const dt = Math.min((now - t0) / 1000, 0.033); // clamp for tab switches
      t0 = now;

      ctx.clearRect(0, 0, width, height);

      // additive-like blend
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // gentle drift
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;

        // slight pull towards image focus (bias towards right/middle)
        p.x += (width * 0.62 - p.x) * 0.0005;
        p.y += (height * 0.48 - p.y) * 0.0003;

        // twinkle
        p.phase += dt * rnd(0.9, 1.3);
        const twinkle = 0.55 + 0.45 * Math.sin(p.phase);
        const alpha = 0.12 * p.life * twinkle;

        // wrap edges softly
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // draw
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        const c1 = `hsla(${p.hue}, 90%, 65%, ${alpha})`;
        const c2 = `hsla(${p.hue + 10}, 90%, 55%, 0)`;
        grad.addColorStop(0, c1);
        grad.addColorStop(1, c2);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // reset blend for next frame
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);

    if (!mql.matches) {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} data-sparkles className={className} />;
}










