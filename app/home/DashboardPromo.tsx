'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPromo() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#124734] to-[#1D3557] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm text-white mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            Interactive Dashboard
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Explore Every <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#2C7FB8]">Insight</span>
          </h2>

          <p className="text-lg text-white/90 mb-10 max-w-xl">
            Get full access to every question included in the report with our interactive dashboard. Explore the data firsthand, filter insights, and dive deeper into the results at your own pace.
          </p>

          {/* Features */}
          <div className="grid sm:grid-cols-1 gap-4 mb-10">
            {[
              { icon: 'ri-search-line', color: 'bg-emerald-100 text-emerald-600', title: 'Full Question Access', text: 'Access every question in the report' },
              { icon: 'ri-filter-line', color: 'bg-blue-100 text-blue-600', title: 'Interactive Filtering', text: 'Filter insights by your criteria' },
              { icon: 'ri-play-circle-line', color: 'bg-cyan-100 text-cyan-600', title: 'Demo Video Available', text: 'Watch the dashboard in action' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                  <i className={`${item.icon} text-lg`} />
                </div>
                <div>
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="text-sm text-white/80">{item.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/dashboard"
            className="relative inline-block px-6 py-3 text-sm font-semibold text-white rounded-full bg-emerald-600 overflow-hidden transition-all duration-300
              before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#4CAF50,_#2C7FB8)]
              before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Dashboard <i className="ri-arrow-right-line" />
            </span>
          </Link>
        </div>

        {/* Image */}
        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-emerald-400/10 rounded-2xl transform -rotate-2" />
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/dashboard-preview.png"
              alt="EcoFocus Sustainability Dashboard Preview"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


