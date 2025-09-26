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
            "linear-gradient(100deg, transparent 35%, rgba(56,189,248,0.28) 50%, transparent 65%)",
          backgroundSize: "220% 100%",
          animation: "heroSheen 18s linear infinite",
        }}
      />

      {/* Sparkles */}
      <SparkleOverlay
        containerRef={heroRef}
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
/**
 * Changes made for your request:
 * - Slightly higher base density (DENSITY_BASE).
 * - Particles continuously respawn (no "stop appearing").
 * - Fade out as they approach center, then recycle.
 * - Mildly stronger attraction to the center for a smooth flow.
 */
function SparkleOverlay({
  className = "",
  containerRef,
  focusSelector,
}: {
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
  focusSelector?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    function assertPresent<T>(
      v: T | null | undefined,
      name: string
    ): asserts v is T {
      if (v == null) throw new Error(`${name} not available`);
    }
    function assert2D(
      c: CanvasRenderingContext2D | null
    ): asserts c is CanvasRenderingContext2D {
      if (!c) throw new Error("2D context unavailable");
    }

    const hostMaybe = containerRef.current;
    const canvasMaybe = canvasRef.current;
    if (!hostMaybe || !canvasMaybe) return;

    assertPresent<HTMLElement>(hostMaybe, "host");
    assertPresent<HTMLCanvasElement>(canvasMaybe, "canvas");
    const host = hostMaybe;
    const canvas = canvasMaybe;

    const ctxMaybe = canvas.getContext("2d", { alpha: true }) as
      | CanvasRenderingContext2D
      | null;
    assert2D(ctxMaybe);
    const ctx = ctxMaybe;

    const hasResizeObserver = typeof ResizeObserver !== "undefined";
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 1,
      height = 1;
    let dpr =
      typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    let rafId = 0,
      rafFocusId = 0;
    let t0 = typeof performance !== "undefined" ? performance.now() : 0;

    let focusX = 0.7,
      focusY = 0.7;

    type Layer = 0 | 1;
    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      hue: number;
      phase: number;
      life: number; // 1..0
      speed: number;
      layer: Layer;
    };
    const particles: P[] = [];

    /* ---- Knobs ---- */
    const DENSITY_BASE = 140; // was 110; "a few more" sparkles
    const DENSITY_CAP = 220;
    const BASE_ALPHA = 0.22;
    const RADIUS_MULT = 8.5;
    const HUE_MIN = 165,
      HUE_MAX = 205;

    // Attraction strength toward center (slightly stronger than before)
    const ATTRACT_X = 0.00085;
    const ATTRACT_Y = 0.00070;

    // Distance from center where fadeout begins (fraction of diagonal)
    let fadeRadius = 120; // will be updated in resize()

    const rnd = (a: number, b: number) => Math.random() * (b - a) + a;

    // Spawn near edges so they drift inward
    function makeParticle(): P {
      const fromEdge = Math.random();
      let sx = 0,
        sy = 0;

      if (fromEdge < 0.25) {
        sx = rnd(0, width);
        sy = -12;
      } else if (fromEdge < 0.5) {
        sx = rnd(0, width);
        sy = height + 12;
      } else if (fromEdge < 0.75) {
        sx = -12;
        sy = rnd(0, height);
      } else {
        sx = width + 12;
        sy = rnd(0, height);
      }

      const layer: Layer = Math.random() < 0.65 ? 0 : 1;
      return {
        x: sx,
        y: sy,
        vx: rnd(-0.06, 0.08),
        vy: rnd(-0.04, 0.06),
        r: rnd(0.8, layer === 0 ? 1.8 : 2.4),
        hue: rnd(HUE_MIN, HUE_MAX),
        phase: rnd(0, Math.PI * 2),
        life: 1, // start full life
        speed: rnd(0.65, layer === 0 ? 1.25 : 0.95),
        layer,
      };
    }

    function resize(): void {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr =
        typeof window !== "undefined"
          ? Math.min(window.devicePixelRatio || 1, 2)
          : 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // fade radius ~ 12% of diagonal
      fadeRadius = Math.hypot(width, height) * 0.12;

      // baseline density scaled by area
      const areaK = (width * height) / (1440 * 800);
      const target = Math.min(Math.round(DENSITY_BASE * areaK), DENSITY_CAP);
      while (particles.length < target) particles.push(makeParticle());
      while (particles.length > target) particles.pop();
    }

    function recycle(i: number): void {
      particles[i] = makeParticle();
    }

    function draw(now: number): void {
      const dt = Math.min((now - t0) / 1000, 0.033);
      t0 = now;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const fx = focusX * width;
      const fy = focusY * height;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move with small inherent velocity
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;

        // Gentle attraction to the focus point
        p.x += (fx - p.x) * ATTRACT_X;
        p.y += (fy - p.y) * ATTRACT_Y;

        // Twinkle
        p.phase += dt * 1.15;
        const tw = 0.55 + 0.45 * Math.sin(p.phase);

        // Distance-based fade as they approach center
        const dx = fx - p.x;
        const dy = fy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const near = Math.max(0, Math.min(1, dist / fadeRadius)); // 1 far, 0 at center

        // Alpha & life decay: fade faster when near center
        const a =
          (p.layer === 0 ? BASE_ALPHA : BASE_ALPHA * 0.5) *
          p.life *
          tw *
          near;

        p.life -= dt * (0.08 + (1 - near) * 0.85); // faster decay near center

        // Recycle when fully faded or extremely close to center
        if (p.life <= 0 || near < 0.06) {
          recycle(i);
          continue;
        }

        // Soft wrap so nothing gets stuck off-screen (safety)
        if (p.x < -24) p.x = width + 24;
        else if (p.x > width + 24) p.x = -24;
        if (p.y < -24) p.y = height + 24;
        else if (p.y > height + 24) p.y = -24;

        const rad = p.r * (p.layer === 0 ? RADIUS_MULT : RADIUS_MULT * 1.6);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        g.addColorStop(0, `hsla(${p.hue},95%,65%,${a})`);
        g.addColorStop(1, `hsla(${p.hue + 8},95%,55%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      rafId = requestAnimationFrame(draw);
    }

    function updateFocus(): void {
      if (!focusSelector) return;
      const el = host.querySelector(focusSelector) as HTMLElement | null;
      if (!el) return;
      const a = host.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const cx = (b.left + b.right) / 2 - a.left;
      const cy = (b.top + b.bottom) / 2 - a.top;
      if (width > 0) focusX = Math.min(Math.max(cx / width, 0), 1);
      if (height > 0) focusY = Math.min(Math.max(cy / height, 0), 1);
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
    rafFocusId = requestAnimationFrame(updateFocus);
    if (!prefersReducedMotion) rafId = requestAnimationFrame(draw);

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
      if (rafFocusId) cancelAnimationFrame(rafFocusId);
    };
  }, [containerRef, focusSelector]);

  return <canvas ref={canvasRef} data-sparkles className={className} />;
}























