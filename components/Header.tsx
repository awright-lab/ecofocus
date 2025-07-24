'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#3E7C59]">
            <span className="font-pacifico">EcoFocus</span>
            <span className="text-sm text-gray-600 ml-2 font-sans">RESEARCH</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#3E7C59] transition-colors cursor-pointer">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-[#3E7C59] transition-colors cursor-pointer">About</Link>
            <Link href="/solutions" className="text-gray-700 hover:text-[#3E7C59] transition-colors cursor-pointer">Solutions</Link>
            <Link href="/reports" className="text-gray-700 hover:text-[#3E7C59] transition-colors cursor-pointer">Reports & Store</Link>
            <Link href="/blog" className="text-gray-700 hover:text-[#3E7C59] transition-colors cursor-pointer">Blog</Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#3E7C59] transition-colors cursor-pointer">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/reports" className="bg-[#4AAE8C] text-white px-6 py-2 rounded-full hover:bg-[#3E7C59] transition-colors whitespace-nowrap cursor-pointer">
              Buy Report
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-6 h-6 flex items-center justify-center cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="/" className="text-gray-700 hover:text-[#3E7C59] transition-colors cursor-pointer">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-[#3E7C59] transition-colors cursor-pointer">About</Link>
              <Link href="/solutions" className="text-gray-700 hover:text-[#3E7C59] transition-colors cursor-pointer">Solutions</Link>
              <Link href="/reports" className="text-gray-700 hover:text-[#3E7C59] transition-colors cursor-pointer">Reports & Store</Link>
              <Link href="/blog" className="text-gray-700 hover:text-[#3E7C59] transition-colors cursor-pointer">Blog</Link>
              <Link href="/contact" className="text-gray-700 hover:text-[#3E7C59] transition-colors cursor-pointer">Contact</Link>
              <Link href="/reports" className="bg-[#4AAE8C] text-white px-6 py-3 rounded-full hover:bg-[#3E7C59] transition-colors text-center whitespace-nowrap cursor-pointer">
                Buy Report
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}