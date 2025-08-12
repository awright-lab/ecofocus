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

  // Scroll style
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
  }, [pathname]);

  // Body scroll lock + ESC to close
  useEffect(() => {
    if (isMenuOpen) {
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
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Reports & Store', href: '/reports' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only fixed left-2 top-2 z-[100] rounded bg-emerald-600 px-3 py-2 text-white"
      >
        Skip to content
      </a>

      <header
        className={[
          'fixed inset-x-0 top-0 z-50 transition-all',
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white',
        ].join(' ')}
        aria-label="Primary"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="EcoFocus Home">
            <Image
              src="/images/ef-logo.png"
              alt=""
              width={160}
              height={50}
              sizes="(min-width: 768px) 160px, 140px"
              className="h-auto w-[140px] md:w-[160px] object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center space-x-8 md:flex" aria-label="Primary">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <motion.div key={link.href} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'relative font-medium transition-colors',
                      active ? 'text-emerald-700' : 'text-gray-700 hover:text-emerald-600',
                      'group',
                    ].join(' ')}
                  >
                    {link.name}
                    <span
                      className={[
                        'absolute left-0 -bottom-1 h-[2px] bg-emerald-500 transition-all',
                        active ? 'w-full' : 'w-0 group-hover:w-full',
                      ].join(' ')}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center md:flex">
            <Link
              href="/reports"
              className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                         before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)]
                         before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
            >
              <span className="relative z-10">Buy Report</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            ref={menuBtnRef}
            type="button"
            className="grid h-9 w-9 place-items-center rounded md:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
            <i
              className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl text-gray-800 transition-transform`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Gradient bottom border */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />

        {/* Mobile nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              id="mobile-nav"
              key="mobile-nav"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md shadow-md"
              aria-label="Mobile"
            >
              <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={[
                        'font-medium transition-colors',
                        active ? 'text-emerald-700' : 'text-gray-700 hover:text-emerald-600',
                      ].join(' ')}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <Link
                  href="/reports"
                  className="relative mt-2 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300
                             before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)]
                             before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                >
                  <span className="relative z-10">Buy Report</span>
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

