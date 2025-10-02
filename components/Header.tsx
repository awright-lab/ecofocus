// app/components/Header.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Event countdown date
const EVENT_DATE = new Date('2025-10-13T09:00:00-07:00'); // SB'25 start date
const SHOW_EVENT_BANNER = true; // toggle if needed

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [showBanner, setShowBanner] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);
  const [bannerH, setBannerH] = useState(0); // ← dynamic banner height

  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const bannerRef = useRef<HTMLDivElement | null>(null);

  const isHome = pathname === '/';
  const isContactPage =
    pathname === '/contact' || pathname.startsWith('/contact/');

  // Scroll listener for header style
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open + close on Esc
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

  // Countdown timer with seconds
  useEffect(() => {
    if (!SHOW_EVENT_BANNER || !isHome) return;

    function updateCountdown() {
      const now = new Date();
      const diff = EVENT_DATE.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('Live now!');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
    }

    updateCountdown();
    const t = setInterval(updateCountdown, 1000); // update every second
    return () => clearInterval(t);
  }, [isHome]);

  // Observe hero visibility (logo hides only while hero is visible)
  useEffect(() => {
    if (!isHome) return;
    const sentinel = document.querySelector('#hero-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => setHeroVisible(entries[0].isIntersecting),
      { threshold: 0.2 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isHome]);

  // Measure banner height so the header can sit below it (prevents overlap on mobile)
  useEffect(() => {
    if (!bannerRef.current) {
      setBannerH(0);
      return;
    }

    const el = bannerRef.current;

    const measure = () => setBannerH(el.offsetHeight || 0);

    // Measure on mount, on resize, and when fonts/layout settle
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    window.addEventListener('resize', measure, { passive: true });

    // If countdown text changes (seconds), layout could shift; measure occasionally
    const interval = setInterval(() => measure(), 1000);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      clearInterval(interval);
    };
  }, [showBanner, isHome]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'EcoNugget Insights', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const bannerVisible = SHOW_EVENT_BANNER && isHome && showBanner;

  return (
    <>
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only fixed left-2 top-2 z-[100] rounded bg-emerald-600 px-3 py-2 text-white"
      >
        Skip to content
      </a>

      {/* Event Banner — only on homepage */}
      {bannerVisible && (
        <div
          ref={bannerRef}
          className="fixed top-0 inset-x-0 z-[95] bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-sm px-3 sm:px-4 py-2"
        >
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-2">
            {/* Left: countdown + Learn More */}
            <div className="min-w-0 flex items-center gap-2 sm:gap-3">
              <span className="truncate font-semibold">
                SB&apos;25 San Diego — Starts in {timeLeft}
              </span>
              <Link
                href="/event"
                className="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium hover:bg-white/30 transition"
              >
                Learn More
              </Link>
            </div>

            {/* Right: dismiss */}
            <button
              onClick={() => setShowBanner(false)}
              className="shrink-0 ml-2 text-white/80 hover:text-white"
              aria-label="Dismiss banner"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Sticky header – sits exactly below the banner height */}
      <header
        data-home={isHome ? 'true' : 'false'}
        data-scrolled={isScrolled ? 'true' : 'false'}
        style={{ top: bannerVisible ? bannerH : 0, position: 'fixed', left: 0, right: 0 }}
        className={`z-[90] transition-colors ${
          isScrolled
            ? 'bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur-md shadow-sm'
            : 'bg-white'
        }`}
        aria-label="Primary"
      >
        <div className="mx-auto max-w-7xl h-14 md:h-20 px-4 sm:px-6">
          <div className="flex h-full items-center justify-between">
            {/* Logo (hides only while hero is visible on homepage) */}
            <div className="flex items-center w-[140px] sm:w-[150px] lg:w-[160px] xl:w-[180px]">
              <Link
                href="/"
                aria-label="EcoFocus Home"
                className={`flex items-center transition-opacity duration-300 ${
                  isHome && heroVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <Image
                  src="/images/ef-logo.png"
                  alt="EcoFocus"
                  width={160}
                  height={50}
                  sizes="(min-width:1280px) 180px, (min-width:1024px) 160px, (min-width:640px) 150px, 140px"
                  className="site-logo h-6 md:h-7 w-auto object-contain"
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

            {/* Desktop CTA container */}
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

        {/* Decorative underline */}
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










