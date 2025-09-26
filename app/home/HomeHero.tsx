// app/(site)/_components/HomeHero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { useEffect, useRef } from "react";

export default function HomeHero() {
  const IMG_SRC = "/images/hero-bg.png";
  const BLUR = "/images/leaf-circuit-hero-blur.jpg";
  const heroRef = useRef<HTMLElement | null>(null);

  return (
    <section ref={heroRef} className="relative w-full overflow-hidden" aria-labelledby="home-hero-title">
      {/* Base wash */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#05070A_0%,#070C11_55%,#0A0F14_100%),
                 radial-gradient(120%_80%_at_92%_8%,rgba(60,120,200,0.22)_0%,rgba(0,0,0,0)_60%),
                 radial-gradient(85%_75%_at_6%_96%,rgba(130,60,180,0.18)_0%,rgba(0,0,0,0)_62%)]" />

      {/* Optimized leaf image — bottom-right, smaller for headline space */}
      <div
        data-leaf
        className="pointer-events-none select-none absolute -z-10 bottom-0 right-0 translate-x-[6%] translate-y-[6%] sm:translate-x-[4%] sm:translate-y-[4%] md:translate-x-[6%] md:translate-y-[6%]"
      >
        <div
          className="relative w-[52vw] max-w-[900px] sm:w-[58vw] md:w-[52vw] aspect-[16/10]"
          style={{ filter: "saturate(1.06) brightness(1.02)" }}
        >
          <Image
            src={IMG_SRC}
            alt=""
            fill
            priority
            placeholder="blur"
            blurDataURL={BLUR}
            sizes="(max-width: 640px) 58vw, (max-width: 1024px) 52vw, 52vw"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {/* Bottom vignette */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,rgba(4,7,9,0.92),rgba(4,7,9,0)_85%)]" />

      {/* Sheen */}
      <div
        data-sheen
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-25 will-change-transform"
        style={{
          background: "linear-gradient(100deg, transparent 35%, rgba(56,189,248,0.28) 50%, transparent 65%)",
          backgroundSize: "220% 100%",
          animation: "heroSheen 18s linear infinite",
        }}
      />

      {/* Sparkles covering full hero, biased toward the image */}
      <SparkleOverlay
        containerRef={heroRef}
        focusSelector="[data-leaf]"
        className="absolute inset-0 pointer-events-none mix-blend-screen"
      />

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
  focusSelector,
}: {
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
  focusSelector?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Type guard that permanently narrows within this effect.
    function assertPresent<T>(v: T | null | undefined, name: string): asserts v is T {
      if (v == null) throw new Error(`${name} not available`);
    }

    const hostMaybe = containerRef.current;
    const canvasMaybe = canvasRef.current;
    if (!hostMaybe || !canvasMaybe) return; // nothing to draw yet

    // Narrow to non-null and bind to locals used by all closures.
    assertPresent<HTMLElement>(hostMaybe, "host");
    assertPresent<HTMLCanvasElement>(canvasMaybe, "canvas");
    const host = hostMaybe;
    const canvas = canvasMaybe;

    const ctxMaybe = canvas.getContext("2d", { alpha: true });
    if (!ctxMaybe) return;
    const ctx = ctxMaybe; // non-null

    // Environment feature checks
    const hasResizeObserver = typeof ResizeObserver !== "undefined";
    const prefersReducedMotion =
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    // Local state
    let width = 1;
    let height = 1;
    let dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    let rafId = 0;
    let rafFocusId = 0;
    let t0 = typeof performance !== "undefined" ? performance.now() : 0;

    // Focus (normalized, defaults near lower-right)
    let focusX = 0.7;
    let focusY = 0.7;

    type Layer = 0 | 1;
    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      hue: number;
      phase: number;
      life: number;
      speed: number;
      layer: Layer;
    };
    const particles: P[] = [];

    // Tunables
    const MAX_BASE = 110;
    const BASE_ALPHA = 0.22;
    const RADIUS_MULT = 8.5;
    const HUE_MIN = 165;
    const HUE_MAX = 205;

    const rnd = (a: number, b: number) => Math.random() * (b - a) + a;

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

    function makeParticle(): P {
      const near = Math.random() < 0.75; // 75% near image, 25% anywhere
      const fx = focusX * width;
      const fy = focusY * height;
      const sx = near ? rnd(fx - width * 0.25, fx + width * 0.25) : rnd(0, width);
      const sy = near ? rnd(fy - height * 0.25, fy + height * 0.25) : rnd(0, height);
      const layer: Layer = Math.random() < 0.65 ? 0 : 1;

      return {
        x: sx,
        y: sy,
        vx: rnd(-0.08, 0.1),
        vy: rnd(-0.05, 0.06),
        r: rnd(0.8, layer === 0 ? 1.8 : 2.4),
        hue: rnd(HUE_MIN, HUE_MAX),
        phase: rnd(0, Math.PI * 2),
        life: rnd(0.6, 1),
        speed: rnd(0.6, layer === 0 ? 1.25 : 0.9),
        layer,
      };
    }

    function resize(): void {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const areaK = (width * height) / (1440 * 800);
      const target = Math.min(Math.round(MAX_BASE * areaK), 180);

      while (particles.length < target) particles.push(makeParticle());
      while (particles.length > target) particles.pop();

      updateFocus();
    }

    function draw(now: number): void {
      const dt = Math.min((now - t0) / 1000, 0.033);
      t0 = now;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const fx = focusX * width;
      const fy = focusY * height;

      for (const p of particles) {
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;

        // gentle attraction to keep tied to image
        p.x += (fx - p.x) * 0.00055;
        p.y += (fy - p.y) * 0.00045;

        p.phase += dt * 1.15;
        const tw = 0.55 + 0.45 * Math.sin(p.phase);
        const a = (p.layer === 0 ? BASE_ALPHA : BASE_ALPHA * 0.5) * p.life * tw;

        // wrap
        if (p.x < -16) p.x = width + 16;
        else if (p.x > width + 16) p.x = -16;
        if (p.y < -16) p.y = height + 16;
        else if (p.y > height + 16) p.y = -16;

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

    // Observe host for size changes
    let ro: ResizeObserver | null = null;
    if (hasResizeObserver) {
      ro = new ResizeObserver(() => resize());
      ro.observe(host);
    } else {
      window.addEventListener("resize", resize);
    }

    // Initial layout & kick-off
    resize();
    rafFocusId = requestAnimationFrame(updateFocus);
    if (!prefersReducedMotion) rafId = requestAnimationFrame(draw);

    // Cleanup
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
      if (rafFocusId) cancelAnimationFrame(rafFocusId);
    };
  }, [containerRef, focusSelector]);

  return <canvas ref={canvasRef} data-sparkles className={className} />;
}


















