
'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-emerald-600 to-emerald-500 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
            <i className="ri-phone-line text-white"></i>
            Ready to Get Started?
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Sustainability Strategy?
          </h2>
          <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Contact us for a confidential, no-cost, no-obligation discovery call to see if EcoFocus is the right choice for your sustainability research needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-emerald-100">Years of Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-emerald-100">Companies Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">90K+</div>
              <div className="text-emerald-100">Data Points Analyzed</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
              <span className="flex items-center gap-2">
                Schedule Discovery Call
                <i className="ri-calendar-line"></i>
              </span>
            </Link>
            <Link href="/reports" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-emerald-600 transition-all shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
              <span className="flex items-center gap-2">
                View Research Examples
                <i className="ri-eye-line"></i>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
