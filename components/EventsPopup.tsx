// components/EventPopup.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function EventPopup() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Show after a short delay
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Click backdrop to close (but not when clicking inside the panel)
  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onMouseDown={onBackdrop}
      aria-modal="true"
      role="dialog"
      aria-labelledby="sb25-title"
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-ef-pop"
      >
        {/* Brand stripe top */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />

        {/* Close */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:gap-8 md:p-8">
          {/* Left: message */}
          <div>
            <p className="text-[13px] font-semibold tracking-wide text-emerald-700 uppercase">
              Event
            </p>
            <h2
              id="sb25-title"
              className="mt-1 text-2xl font-extrabold leading-snug text-gray-900 sm:text-3xl"
            >
              I’m going to <span className="text-emerald-600">SB’25 San Diego</span>
            </h2>
            <p className="mt-1 text-lg font-semibold text-emerald-600">
              See you there?
            </p>

            <div className="mt-3 space-y-1">
              <div className="text-xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                  SB 2025
                </span>{' '}
                San Diego
              </div>
              <p className="text-sm text-gray-600">
                October 13–16 · Town &amp; Country Resort
              </p>
            </div>

            <Link
              href="https://sustainablebrands.com/events/sb25"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
            >
              Register Now
            </Link>

            <p className="mt-2 text-xs text-gray-500">
              External site (Sustainable Brands)
            </p>
          </div>

          {/* Right: simple branded badge area */}
          <div className="relative hidden md:block">
            <div className="h-full w-40 rounded-xl bg-gradient-to-br from-emerald-50 via-blue-50 to-white ring-1 ring-gray-200 shadow-sm" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 opacity-20 blur-lg" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px] font-semibold text-emerald-700">
              EcoFocus®
            </div>
          </div>
        </div>

        {/* Brand stripe bottom */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />
      </div>

      <style jsx global>{`
        @keyframes ef-pop {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-ef-pop {
          animation: ef-pop 260ms ease-out both;
        }
      `}</style>
    </div>
  );
}
