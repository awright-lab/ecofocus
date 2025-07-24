
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CTASection() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-600 to-emerald-500 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
            <i className="ri-rocket-line text-white"></i>
            Ready to Get Started?
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Transform Your Sustainability Strategy Today
          </h2>
          <p className="text-xl mb-10 text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Join 500+ organizations using EcoFocus reports to drive sustainable growth and competitive advantage in today's evolving market
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="#featured" className="group bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
              <span className="flex items-center gap-2">
                Browse Reports
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </span>
            </Link>
            <Link href="/contact" className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
              <span className="flex items-center gap-2">
                Book Consultation
                <i className="ri-calendar-line group-hover:scale-110 transition-transform"></i>
              </span>
            </Link>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
              <i className="ri-mail-line text-white"></i>
              Weekly Newsletter
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated with Latest Research</h3>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get weekly insights, new report releases, and sustainability trends delivered directly to your inbox
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg backdrop-blur-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-shield-check-line text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold mb-2">Trusted Research</h4>
              <p className="text-emerald-100 text-sm">Rigorously vetted data from 90,000+ global sources</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-refresh-line text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold mb-2">Regular Updates</h4>
              <p className="text-emerald-100 text-sm">New reports and insights published weekly</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-customer-service-2-line text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold mb-2">Expert Support</h4>
              <p className="text-emerald-100 text-sm">Dedicated research team available 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
