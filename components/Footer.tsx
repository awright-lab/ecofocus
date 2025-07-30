'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 text-white relative overflow-hidden">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Logo & About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/images/ef-logo-2.png" // Replace with your logo path
            alt="EcoFocus Research"
            width={180}
            height={60}
            className="mb-6"
            priority
          />
          <p className="text-gray-400 text-sm leading-relaxed">
            Turning sustainability data into actionable strategies for over a decade.
            Trusted by leading brands worldwide.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 mt-6">
            {['linkedin-fill', 'twitter-x-fill', 'facebook-fill'].map((icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gradient-to-r from-emerald-500 to-blue-500 transition"
              >
                <i className={`ri-${icon} text-lg text-white`}></i>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {['About', 'Solutions', 'Reports & Store', 'Blog', 'Contact'].map((item, i) => (
              <li key={i}>
                <Link
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-400 hover:text-emerald-400 transition"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-6">Services</h3>
          <ul className="space-y-3 text-sm">
            {[
              'Syndicated Research',
              'Custom Research',
              'Specialized Reports',
              'Consulting Services'
            ].map((service, i) => (
              <li key={i}>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition">
                  {service}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
          <p className="text-gray-400 text-sm mb-4">
            Get the latest sustainability insights delivered to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-emerald-500 text-sm"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg font-semibold shadow hover:opacity-90 transition"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-12 py-6 flex flex-col md:flex-row justify-between items-center px-6">
        <p className="text-gray-400 text-sm">
          © 2025 EcoFocus Research. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="text-gray-400 hover:text-white text-sm transition">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-white text-sm transition">Terms</a>
          <a href="#" className="text-gray-400 hover:text-white text-sm transition">Cookies</a>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
          aria-label="Back to Top"
        >
          <i className="ri-arrow-up-line text-white text-xl"></i>
        </button>
      </div>
    </footer>
  );
}
