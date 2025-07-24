'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="text-2xl font-bold text-[#4AAE8C] mb-4">
              <span className="font-pacifico">EcoFocus</span>
              <div className="text-sm text-gray-400 font-sans">RESEARCH</div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Turn sustainability data into actionable insights with our comprehensive research solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-[#4AAE8C] rounded-full hover:bg-[#3E7C59] transition-colors cursor-pointer">
                <i className="ri-linkedin-fill text-white"></i>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-[#4AAE8C] rounded-full hover:bg-[#3E7C59] transition-colors cursor-pointer">
                <i className="ri-twitter-x-fill text-white"></i>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-[#4AAE8C] rounded-full hover:bg-[#3E7C59] transition-colors cursor-pointer">
                <i className="ri-facebook-fill text-white"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors cursor-pointer">About Us</Link></li>
              <li><Link href="/solutions" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Solutions</Link></li>
              <li><Link href="/reports" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Reports & Store</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Sustainability Research</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Data Analytics</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">ESG Reporting</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Carbon Footprint Analysis</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Consulting Services</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">Get the latest sustainability insights delivered to your inbox.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#4AAE8C] text-sm"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#4AAE8C] text-white py-2 px-4 rounded-lg hover:bg-[#3E7C59] transition-colors text-sm whitespace-nowrap cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 EcoFocus Research. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}