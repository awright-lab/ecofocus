
'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-emerald-600 to-blue-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
            <i className="ri-rocket-line text-white"></i>
            Transform Your Impact
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Sustainability Strategy?
          </h2>
          <p className="text-xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Partner with EcoFocus to unlock the power of sustainability data and drive meaningful environmental impact for your organization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
              Schedule a Consultation
            </Link>
            <Link href="/reports" className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-emerald-600 transition-all shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
              Browse Our Reports
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
