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
      className={`fixed top-0 w-full z-50 transition-all ${isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md'
          : 'bg-white'
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
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={link.href}
                className="relative text-gray-700 hover:text-emerald-600 transition-colors font-medium group"
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-emerald-500 transition-all group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <Link
            href="/reports"
            className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full bg-emerald-600 overflow-hidden transition-all duration-300
              before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)]
              before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10">Buy Report</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i
            className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl text-gray-800 transition-transform`}
          ></i>
        </button>
      </div>

      {/* Gradient Top Border */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500"></div>
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md shadow-md overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {/* Gradient CTA for Mobile */}
              <Link
                href="/reports"
                className="relative inline-block text-center px-6 py-3 text-sm font-semibold text-white rounded-full bg-emerald-600 overflow-hidden transition-all duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)]
                  before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative z-10">Buy Report</span>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

