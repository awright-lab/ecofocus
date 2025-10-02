// app/components/Header.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const isHome = pathname === '/';
  const isContactPage = pathname === '/contact' || pathname.startsWith('/contact/');

  // TEMP NAV
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'EcoNugget Insights', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only fixed left-2 top-2 z-[100] rounded bg-emerald-600 px-3 py-2 text-white"
      >
        Skip to content
      </a>

      {/* Sticky header */}
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
        <div className="mx-auto max-w-7xl h-14 md:h-20 px-4 sm:px-6">
          <div className="flex h-full items-center justify-between">
            {/* Logo (keeps space; invisible on home) */}
            <div className="flex items-center w-[140px] sm:w-[150px] lg:w-[160px] xl:w-[180px]">
              <Link
                href="/"
                aria-label="EcoFocus Home"
                aria-hidden={isHome ? 'true' : undefined}
                tabIndex={isHome ? -1 : 0}
                className={`flex items-center ${isHome ? 'opacity-0 pointer-events-none' : ''}`}
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

            {/* Desktop CTA container (keeps space; invisible on contact page) */}
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

        {/* Decorative gradient underline (doesn't add height) */}
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

        {/* Homepage-only navbar logo behavior */}
        <style jsx global>{`
          html[data-hero-logo-visible='true']
            header[data-home='true'][data-scrolled='false']
            .site-logo {
            opacity: 0.06;
            filter: saturate(0.6) brightness(0.92);
            transition: opacity 220ms ease, filter 220ms ease;
          }
          html[data-hero-logo-visible='true']
            header[data-home='true'][data-scrolled='true']
            .site-logo {
            opacity: 0.18;
            filter: saturate(0.6) brightness(0.92);
            transition: opacity 220ms ease, filter 220ms ease;
          }
        `}</style>
      </header>
    </>
  );
}






