'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-emerald-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
            <i className="ri-rocket-line text-white"></i>
            Get Started Today
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Transform Your Sustainability Reporting?
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Experience the power of interactive data visualization with our comprehensive dashboard. Request a personalized demo today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/contact" className="group bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
              <span className="flex items-center gap-2">
                Request Demo Access
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </span>
            </Link>
            <Link href="/reports" className="group bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
              <span className="flex items-center gap-2">
                View Sample Reports
                <i className="ri-file-text-line group-hover:scale-110 transition-transform"></i>
              </span>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-user-line text-white text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Personalized Demo</h3>
              <p className="text-sm text-blue-100">Tailored to your specific needs</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-phone-line text-white text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Expert Support</h3>
              <p className="text-sm text-blue-100">Dedicated onboarding assistance</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-time-line text-white text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Quick Setup</h3>
              <p className="text-sm text-blue-100">Get started in minutes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}