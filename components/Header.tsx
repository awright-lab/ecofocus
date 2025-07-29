'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Reports & Store', href: '/reports' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-white'
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/ef-logo.png"
            alt="EcoFocus Research Logo"
            width={160}
            height={50}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="relative text-gray-700 hover:text-emerald-600 transition-colors font-medium group"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-emerald-500 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <Link
            href="/reports"
            className="bg-gradient-to-r from-emerald-600 to-blue-500 text-white px-6 py-2 rounded-full shadow hover:opacity-90 transition-transform hover:scale-105"
          >
            Buy Report
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl text-gray-800`}></i>
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-lg shadow-md overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-700 hover:text-emerald-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/reports"
                className="bg-gradient-to-r from-emerald-600 to-blue-500 text-white px-6 py-3 rounded-full shadow hover:opacity-90 transition-transform hover:scale-105 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Buy Report
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
