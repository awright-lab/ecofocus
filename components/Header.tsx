// app/components/Header.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const EVENT_NAME = "SB’25 San Diego";
const EVENT_URL = "https://sustainablebrands.com/events/sb25";
const TARGET_ISO = "2025-10-13T00:00:00-07:00"; // adjust if needed
const SHOW_EVENT_BANNER = true; // toggle on/off

function useCountdown(targetIso: string) {
  const target = new Date(targetIso).getTime();
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { diff, days, hours, minutes, seconds, happening: diff === 0 };
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroInView, setHeroInView] = useState(false); // 👈 observe hero
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  // Observe hero sentinel (bottom of hero). Logo is hidden only while in view.
  useEffect(() => {
    const el = document.getElementById('hero-sentinel');
    if (!el) { setHeroInView(false); return; }
    const io = new IntersectionObserver(
      (entries) => setHeroInView(entries[0]?.isIntersecting ?? false),
      { rootMargin: '0px 0px 0px 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const isHome = pathname === '/';
  const isContactPage = pathname === '/contact' || pathname.startsWith('/contact/');
  const { days, hours, minutes, seconds, happening } = useCountdown(TARGET_ISO);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'EcoNugget Insights', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  // Hide logo only on home while hero is visible
  const hideLogo = isHome && heroInView;

  return (
    <>
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only fixed left-2 top-2 z-[100] rounded bg-emerald-600 px-3 py-2 text-white"
      >
        Skip to content
      </a>

      {/* One unified header (banner is inside it) */}
      <header
        data-home={isHome ? 'true' : 'false'}
        data-scrolled={isScrolled ? 'true' : 'false'}
        className={`fixed inset-x-0 top-0 z-[90] transition-colors ${
          isScrolled
            ? 'bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur-md shadow-sm'
            : 'bg-white'
        }`}
        aria-label="Primary"
      >
        {/* Countdown strip (slim, integrated) */}
        {SHOW_EVENT_BANNER && (
          <div className="h-10 bg-neutral-900/95 text-white supports-[backdrop-filter]:bg-neutral-900/80">
            <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
                {happening ? (
                  <span className="font-semibold">{EVENT_NAME} is happening now — join us in San Diego.</span>
                ) : (
                  <>
                    <span className="text-white/90">Countdown to {EVENT_NAME}:</span>
                    <span className="font-semibold tabular-nums">
                      {String(days).padStart(2,'0')}d : {String(hours).padStart(2,'0')}h : {String(minutes).padStart(2,'0')}m : {String(seconds).padStart(2,'0')}s
                    </span>
                  </>
                )}
              </div>
              <a
                href={EVENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold text-white/95 hover:bg-white/10"
                aria-label="Learn more about SB’25"
              >
                Learn more
              </a>
            </div>
          </div>
        )}

        {/* Main bar */}
        <div className="mx-auto max-w-7xl h-14 md:h-20 px-4 sm:px-6">
          <div className="flex h-full items-center justify-between">
            {/* Logo: keeps space; invisible only while hero in view on home */}
            <div className="flex items-center w-[140px] sm:w-[150px] lg:w-[160px] xl:w-[180px]">
              <Link
                href="/"
                aria-label="EcoFocus Home"
                aria-hidden={hideLogo ? 'true' : undefined}
                tabIndex={hideLogo ? -1 : 0}
                className={`flex items-center ${hideLogo ? 'opacity-0 pointer-events-none' : ''}`}
              >
                <Image
                  src="/images/ef-logo.png"
                  alt="EcoFocus"
                  width={160}
                  height={50}
                  sizes="(min-width:1280px) 180px, (min-width:1024px) 160px, (min-width:640px) 150px, 140px"
                  className="site-logo h-6 md:h-7 w-auto object-contain transition-opacity"
                  priority
                />
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-8" aria-label="Primary">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <motion.div key={link.href} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative font-medium transition-colors group ${
                        active ? 'text-emerald-700' : 'text-gray-700 hover:text-emerald-600'
                      } text-[15px]`}
                    >
                      {link.name}
                      <span
                        className={`absolute left-0 -bottom-1 h-[2px] bg-emerald-500 transition-all ${
                          active ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Desktop CTA — space preserved; invisible on contact page */}
            <div className="hidden lg:flex items-center w-[128px] xl:w-[190px] justify-end">
              <Link
                href="/contact"
                aria-label="Contact us"
                aria-hidden={isContactPage ? 'true' : undefined}
                tabIndex={isContactPage ? -1 : 0}
                className={`relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)]
                  before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0 xl:hidden
                  ${isContactPage ? 'opacity-0 pointer-events-none' : ''}`}
              >
                <span className="relative z-10">Contact</span>
              </Link>
              <Link
                href="/contact"
                aria-label="Contact us"
                aria-hidden={isContactPage ? 'true' : undefined}
                tabIndex={isContactPage ? -1 : 0}
                className={`relative ml-3 hidden xl:inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)]
                  before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0
                  ${isContactPage ? 'opacity-0 pointer-events-none' : ''}`}
              >
                <span className="relative z-10">Contact Us</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              ref={menuBtnRef}
              type="button"
              className="grid h-10 w-10 place-items-center rounded lg:hidden"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl text-gray-800`} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Keep only the normal underline under the nav (no extra divider under banner) */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 animate-gradient" />

        {/* Mobile nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              id="mobile-nav"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-md shadow-md"
              aria-label="Mobile"
            >
              <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`font-medium transition-colors ${
                        active ? 'text-emerald-700' : 'text-gray-700 hover:text-emerald-600'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}







