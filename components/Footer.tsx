// app/components/Footer.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import NewsletterForm from '@/components/newsletter/NewsletterForm'; // ← import it

export default function Footer() {
  const [showTop, setShowTop] = useState(false);
  const reduceMotion = useReducedMotion();
  const year = new Date().getFullYear();

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-gray-950 text-white">
      {/* Gradient Top Border */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 md:gap-12 md:py-16 relative z-10">
        {/* Brand / About */}
        <section aria-label="About EcoFocus">
          <Image
            src="/images/ef-logo-2.png"
            alt="EcoFocus Research"
            width={180}
            height={60}
            sizes="180px"
            className="mb-6 h-auto w-[180px]"
            priority
          />
          <p className="text-sm leading-relaxed text-gray-400">
            Turning sustainability data into actionable strategies for over a decade.
          </p>

          {/* Social */}
          <div className="mt-6 flex space-x-4">
            <a
              href="https://www.linkedin.com/company/ecofocus-worldwide-llc/"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full bg-gray-800 transition hover:bg-gradient-to-r hover:from-emerald-500 hover:to-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="LinkedIn"
            >
              <i className="ri-linkedin-fill text-lg text-white" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* Quick Links */}
        <nav aria-label="Quick links">
          <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Blog', href: '/blog' },
              { label: 'Contact', href: '/contact' },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-gray-400 transition hover:text-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Newsletter — now using shared component */}
        <section aria-label="Newsletter signup">
          <h3 className="mb-4 text-lg font-semibold">Stay Updated</h3>
          <p className="mb-4 text-sm text-gray-400">
            Get the latest sustainability insights delivered to your inbox.
          </p>

          <NewsletterForm theme="dark" className="space-y-3" />
        </section>
      </div>

      {/* Bottom bar */}
      <div className="mt-4 border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row">
          <p className="text-sm text-gray-400">© {year} EcoFocus Research. All rights reserved.</p>
          <nav aria-label="Legal" className="flex gap-6">
            <Link href="/legal#privacy-policy" className="text-sm text-gray-400 transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/legal#terms-of-service" className="text-sm text-gray-400 transition hover:text-white">
              Terms
            </Link>
            <Link href="/legal#cookies" className="text-sm text-gray-400 transition hover:text-white">
              Cookies
            </Link>
          </nav>
        </div>
      </div>

      {/* Back to Top */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label="Back to top"
        >
          <i className="ri-arrow-up-line text-xl" aria-hidden="true" />
        </button>
      )}
    </footer>
  );
}



