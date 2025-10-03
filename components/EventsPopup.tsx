'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type PopupProps = {
  delayMs?: number;         // when to show (ms), default 7000
  logoSrc?: string;         // optional right-side EcoFocus icon
  logoAlt?: string;
};

export default function EventsPopup({
  delayMs = 7000,
  logoSrc,
  logoAlt = 'EcoFocus',
}: PopupProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Show only on homepage, after delay
  useEffect(() => {
    if (!isHome) return;
    const t = window.setTimeout(() => setOpen(true), delayMs); // const for eslint prefer-const
    return () => clearTimeout(t);
  }, [isHome, delayMs]);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  if (!isHome) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 sm:p-6"
          onMouseDown={onBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden={!open}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Sustainable Brands 2025"
            className="w-[92vw] max-w-[820px] rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden relative"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
          >
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />

            <div className="grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr]">
              {/* Left: content */}
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">
                  We’re heading to SB’25
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold leading-tight text-gray-900">
                  Going to <span className="text-emerald-700">SB’25 San Diego</span>?
                  <br />
                  <span className="text-emerald-600">Let’s meet up.</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                  We’ll be in San Diego October 13–16. If you’re attending, let’s connect to talk
                  purpose-driven growth and sustainability insights.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                    before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)]
                    before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                    onClick={() => setOpen(false)}
                  >
                    <span className="relative z-10">Let’s Connect</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Maybe later
                  </button>
                </div>
              </div>

              {/* Right: brand icon area (kept slimmer) */}
              <div className="relative hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50" />
                <div className="relative h-full w-full grid place-items-center p-8">
                  {logoSrc ? (
                    <Image
                      src={logoSrc}
                      alt={logoAlt}
                      width={220}
                      height={220}
                      className="h-auto w-auto max-w-[240px] max-h-[180px] object-contain"
                      priority
                    />
                  ) : (
                    <div
                      className="h-36 w-36 rounded-full ring-1 ring-emerald-200 bg-white grid place-items-center"
                      aria-hidden
                    >
                      <span className="text-xs text-emerald-600">EcoFocus Icon</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Close (top-right) */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 inline-grid h-9 w-9 place-items-center rounded-full bg-white/90 text-gray-700 shadow ring-1 ring-black/10 hover:bg-white"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



