'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);
  const reduceMotion = useReducedMotion();
  const year = new Date().getFullYear();

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to your email provider (HubSpot, Mailchimp, etc.)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMsg('Please enter a valid email.');
      return;
    }
    setMsg('Thanks! You’re subscribed.');
    setEmail('');
    setTimeout(() => setMsg(null), 3500);
  }

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
        <motion.section
          aria-label="About EcoFocus"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
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
            Trusted by leading brands worldwide.
          </p>

          {/* Social */}
          <div className="mt-6 flex space-x-4">
            <a
              href="https://www.linkedin.com/" // swap to your real page
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full bg-gray-800 transition hover:bg-gradient-to-r hover:from-emerald-500 hover:to-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="LinkedIn"
            >
              <i className="ri-linkedin-fill text-lg text-white" aria-hidden="true" />
            </a>
          </div>
        </motion.section>

        {/* Quick Links (Solutions + Reports removed) */}
        <motion.nav
          aria-label="Quick links"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
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
        </motion.nav>

        {/* Newsletter */}
        <motion.section
          aria-label="Newsletter signup"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="mb-4 text-lg font-semibold">Stay Updated</h3>
          <p className="mb-4 text-sm text-gray-400">
            Get the latest sustainability insights delivered to your inbox.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="space-y-3" noValidate>
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
              required
              aria-describedby={msg ? 'footer-msg' : undefined}
            />
            <button
              type="submit"
              className="relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition
                         before:absolute before:inset-0 before:rounded-lg before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)]
                         before:z-0 before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span className="relative z-10">Subscribe</span>
            </button>

            {msg && (
              <p id="footer-msg" className="text-xs text-gray-300">
                {msg}
              </p>
            )}
          </form>
        </motion.section>
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



