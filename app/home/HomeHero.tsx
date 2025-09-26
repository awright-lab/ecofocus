// app/home/HomeHero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { useEffect, useRef } from "react";

export default function HomeHero() {
  const heroRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden"
      aria-labelledby="home-hero-title"
    >
      {/* Base support gradient */}
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#070B0F_0%,#0A1015_55%,#0B1116_100%)]" />

      {/* BG 1: main backdrop image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/hero-bg1.png"
          alt=""
          aria-hidden
          priority
          fill
          className="object-cover"
        />
      </div>

      {/* BG 2: overlay art with feathered mask + blend */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none select-none"
        style={{
          WebkitMaskImage:
            "radial-gradient(130% 120% at 85% 50%, #000 62%, rgba(0,0,0,0) 86%)",
          maskImage:
            "radial-gradient(130% 120% at 85% 50%, #000 62%, rgba(0,0,0,0) 86%)",
          mixBlendMode: "overlay", // try 'soft-light' or 'screen'
          filter: "saturate(1.04) brightness(1.02)",
        }}
      >
        <Image
          src="/images/hero-bg2.png"
          alt=""
          aria-hidden
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to left, rgba(7,11,15,0.00) 25%, rgba(7,11,15,0.14) 85%)",
          }}
        />
      </div>

      {/* Bottom fade for legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,rgba(7,11,15,0.9),rgba(7,11,15,0)_85%)]" />

      {/* Sheen sweep */}
      <div
        data-sheen
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-25 will-change-transform"
        style={{
          background:
            "linear-gradient(100deg, transparent 35%, rgba(56,189,248,0.28) 50%, transparent 85%)",
          backgroundSize: "220% 100%",
          animation: "heroSheen 22s linear infinite",
        }}
      />

      {/* Invisible anchors: SOURCE = leaf, TARGET = headline block */}
      {/* Place/size this box where the leaf is so sparkles originate from it */}
      <div
        data-source
        aria-hidden
        className="absolute pointer-events-none -z-[1]"
        style={{
          right: "13%",   // tweak these 4 values to sit over the glowing leaf
          bottom: "16%",
          width: "22%",
          height: "24%",
        }}
      />
      {/* The target is the headline wrapper below via data-focus */}

      {/* Sparkles */}
      <SparkleOverlay
        containerRef={heroRef}
        sourceSelector="[data-source]"
        focusSelector="[data-focus]"
        className="absolute inset-0 pointer-events-none mix-blend-screen"
      />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[68vh] md:min-h-[62vh] items-center py-16 sm:py-24">
          <div className="max-w-3xl" data-focus>
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
              Reliable Sustainability Data to Support Your Next Big Marketing
              Decision
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

      <style jsx>{`
        @keyframes heroSheen {
          0% {
            background-position: 220% 0;
          }
          100% {
            background-position: -220% 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(canvas[data-sparkles]) {
            animation: none !important;
          }
          [data-sheen] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
/* ---------- Sparkle Overlay (Canvas) ---------- */
function SparkleOverlay({
  className = "",
  containerRef,
  sourceSelector,
  focusSelector,
}: {
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
  sourceSelector?: string; // origin (leaf)
  focusSelector?: string;  // target (headline)
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    function assertPresent<T>(v: T | null | undefined, name: string): asserts v is T {
      if (v == null) throw new Error(`${name} not available`);
    }
    function assert2D(c: CanvasRenderingContext2D | null): asserts c is CanvasRenderingContext2D {
      if (!c) throw new Error("2D context unavailable");
    }

    const hostMaybe = containerRef.current;
    const canvasMaybe = canvasRef.current;
    if (!hostMaybe || !canvasMaybe) return;

    assertPresent<HTMLElement>(hostMaybe, "host");
    assertPresent<HTMLCanvasElement>(canvasMaybe, "canvas");
    const host = hostMaybe;
    const canvas = canvasMaybe;

    const ctxMaybe = canvas.getContext("2d", { alpha: true }) as CanvasRenderingContext2D | null;
    assert2D(ctxMaybe);
    const ctx = ctxMaybe;

    const hasResizeObserver = typeof ResizeObserver !== "undefined";
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 1, height = 1;
    let dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    let rafId = 0, rafAnchorId = 0;
    let t0 = typeof performance !== "undefined" ? performance.now() : 0;

    // Anchors
    let sourceX = 0.83, sourceY = 0.66; // leaf
    let focusX = 0.32,  focusY = 0.30;  // headline

    type Layer = 0 | 1;
    type P = {
      x: number; y: number; vx: number; vy: number; r: number;
      hue: number; phase: number; life: number; speed: number; layer: Layer;
    };
    const particles: P[] = [];

    /* ======== TUNING (slower, less clustered) ======== */
    const DENSITY_BASE = 120;          // fewer overall
    const DENSITY_CAP  = 200;
    const BASE_ALPHA   = 0.36;         // keep bright
    const RADIUS_MULT  = 10.5;

    const HUE_MIN = 165, HUE_MAX = 195; // emerald/teal bias

    // Slower pull and base movement
    const ATTRACT_X = 0.0005;
    const ATTRACT_Y = 0.0004;

    // Wider spawn cloud over the leaf (less clustering)
    let spawnSigmaX = 100, spawnSigmaY = 90;

    // Fade begins a bit farther from headline (so they live longer while moving slower)
    let fadeRadius = 150;

    const rnd = (a: number, b: number) => Math.random() * (b - a) + a;
    const gauss = (mu: number, sigma: number) => {
      // Box–Muller
      const u = 1 - Math.random();
      const v = 1 - Math.random();
      const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      return mu + z * sigma;
    };

    function updateAnchors(): void {
      if (sourceSelector) {
        const el = host.querySelector(sourceSelector) as HTMLElement | null;
        if (el) {
          const a = host.getBoundingClientRect(), b = el.getBoundingClientRect();
          const cx = (b.left + b.right) / 2 - a.left;
          const cy = (b.top + b.bottom) / 2 - a.top;
          if (width > 0)  sourceX = Math.min(Math.max(cx / width, 0), 1);
          if (height > 0) sourceY = Math.min(Math.max(cy / height, 0), 1);
        }
      }
      if (focusSelector) {
        const el = host.querySelector(focusSelector) as HTMLElement | null;
        if (el) {
          const a = host.getBoundingClientRect(), b = el.getBoundingClientRect();
          const cx = (b.left + b.right) / 2 - a.left;
          const cy = (b.top + b.bottom) / 2 - a.top;
          if (width > 0)  focusX = Math.min(Math.max(cx / width, 0), 1);
          if (height > 0) focusY = Math.min(Math.max(cy / height, 0), 1);
        }
      }
    }

    // Spawn around the leaf with a wider Gaussian (less cluster), gentle initial push to headline
    function makeParticle(): P {
      const sx = gauss(sourceX * width,  spawnSigmaX);
      const sy = gauss(sourceY * height, spawnSigmaY);

      const dx = focusX * width - sx;
      const dy = focusY * height - sy;
      const len = Math.max(1, Math.hypot(dx, dy));
      const dirX = dx / len, dirY = dy / len;

      const layer: Layer = Math.random() < 0.65 ? 0 : 1;

      // Much slower base speed + lower jitter
      const baseSpeed = rnd(0.35, layer === 0 ? 0.75 : 0.6);
      const jitter    = 0.10;

      return {
        x: sx, y: sy,
        vx: dirX * baseSpeed + rnd(-jitter, jitter),
        vy: dirY * baseSpeed + rnd(-jitter, jitter),
        r: rnd(0.9, layer === 0 ? 2.0 : 2.6),
        hue: rnd(HUE_MIN, HUE_MAX),
        phase: rnd(0, Math.PI * 2),
        life: 1,
        speed: 1,
        layer,
      };
    }

    function resize(): void {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Wider spawn cloud over the leaf
      spawnSigmaX = Math.max(60, width  * 0.11);
      spawnSigmaY = Math.max(50, height * 0.09);

      // Fade radius a bit larger for slower motion
      fadeRadius = Math.hypot(width, height) * 0.18;

      const areaK = (width * height) / (1440 * 800);
      const target = Math.min(Math.round(DENSITY_BASE * areaK), DENSITY_CAP);
      while (particles.length < target) particles.push(makeParticle());
      while (particles.length > target) particles.pop();

      updateAnchors();
    }

    function recycle(i: number): void {
      particles[i] = makeParticle();
    }

    function draw(now: number): void {
      const dt = Math.min((now - t0) / 1000, 0.033);
      t0 = now;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const fx = focusX * width, fy = focusY * height;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Slower movement
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;

        // Gentle attraction (slowed)
        p.x += (fx - p.x) * ATTRACT_X;
        p.y += (fy - p.y) * ATTRACT_Y;

        // Twinkle
        p.phase += dt * 1.0; // slightly slower twinkle
        const tw = 0.5 + 0.5 * Math.sin(p.phase);

        // Fade toward headline
        const dx = fx - p.x, dy = fy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const near = Math.max(0, Math.min(1, dist / fadeRadius)); // 1 far, 0 at center

        const a =
          (p.layer === 0 ? BASE_ALPHA : BASE_ALPHA * 0.6) *
          p.life * tw * Math.max(0.15, near);

        // Slower life decay overall (so they don't vanish too quickly)
        p.life -= dt * (0.02 + (1 - near) * 0.35);

        if (p.life <= 0 || near < 0.06 || p.x < -60 || p.x > width + 60 || p.y < -60 || p.y > height + 60) {
          recycle(i);
          continue;
        }

        const rad = p.r * (p.layer === 0 ? RADIUS_MULT : RADIUS_MULT * 1.6);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        g.addColorStop(0, `hsla(${p.hue},98%,72%,${a})`);
        g.addColorStop(1, `hsla(${p.hue + 8},98%,55%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      rafId = requestAnimationFrame(draw);
    }

    let ro: ResizeObserver | null = null;
    if (hasResizeObserver) {
      ro = new ResizeObserver(() => resize());
      ro.observe(host);
    } else {
      window.addEventListener("resize", resize);
    }

    // start
    resize();
    rafAnchorId = requestAnimationFrame(() => updateAnchors());
    if (!prefersReducedMotion) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
      if (rafAnchorId) cancelAnimationFrame(rafAnchorId);
    };
  }, [containerRef, sourceSelector, focusSelector]);

  return <canvas ref={canvasRef} data-sparkles className={className} />;
}


























