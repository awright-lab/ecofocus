'use client';

import Link from 'next/link';

export default function SolutionsHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950 text-white">
      {/* Animated Background Accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-emerald-400/30 to-emerald-600/30 rounded-full blur-xl animate-pulse delay-100" />
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-cyan-400/30 to-cyan-600/30 rounded-full blur-2xl animate-pulse delay-200" />
        <div className="absolute bottom-20 right-40 w-28 h-28 bg-gradient-to-br from-teal-400/30 to-teal-600/30 rounded-full blur-xl animate-pulse delay-300" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/10 via-[#2C7FB8]/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 z-10 py-28">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm text-gray-200">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              Expert Consulting Services
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Tailored Solutions for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] via-[#2C7FB8] to-[#124734] animate-gradient-x bg-[length:200%_200%]">
              Sustainability Leaders
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            At EcoFocus, we provide expert guidance for businesses looking to stay ahead in a rapidly changing sustainability landscape. Whether youre exploring consumer trends or developing custom research projects, we offer strategic solutions to drive informed decision-making.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/contact" className="group bg-[#4CAF50] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
              <span className="flex items-center gap-2">
                Start Your Project
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </span>
            </Link>
            <Link href="/reports" className="group border-2 border-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:border-emerald-400 transition-all shadow-md hover:shadow-xl">
              <span className="flex items-center gap-2">
                View Our Research
                <i className="ri-eye-line group-hover:scale-110 transition-transform"></i>
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-white">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
              <div className="text-sm text-gray-300">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">90K+</div>
              <div className="text-sm text-gray-300">Data Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">100%</div>
              <div className="text-sm text-gray-300">Custom Solutions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

