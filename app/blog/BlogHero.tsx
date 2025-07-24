
'use client';

import { useState } from 'react';

export default function BlogHero() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchTerm);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-lg transform rotate-12 blur-sm"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-lg transform -rotate-12 blur-sm"></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 rounded-lg transform rotate-45 blur-sm"></div>
          <div className="absolute bottom-20 right-40 w-28 h-28 bg-gradient-to-br from-teal-400/20 to-teal-600/20 rounded-lg transform -rotate-45 blur-sm"></div>
        </div>

        {/* Hexagonal Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <defs>
              <pattern id="hexPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <polygon points="30,2 50,15 50,35 30,48 10,35 10,15" fill="none" stroke="#3E7C59" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexPattern)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600 mb-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Expert sustainability insights and research
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-900 via-emerald-800 to-blue-900 bg-clip-text text-transparent">
            Sustainability 
            <br />
            <span className="text-emerald-600">Research Hub</span>
          </h1>

          <p className="text-xl md:text-2xl mb-10 text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Expert insights, research findings, and industry trends to guide your sustainability journey
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles, topics, or keywords..."
                className="w-full px-6 py-4 pl-12 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg backdrop-blur-sm bg-white/90 border border-gray-200"
              />
              <button
                type="submit"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer"
              >
                <i className="ri-search-line text-gray-400 text-xl"></i>
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-4 text-sm mb-12">
            <span className="text-gray-600">Popular topics:</span>
            <button className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer">
              ESG Reporting
            </button>
            <button className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer">
              Carbon Footprint
            </button>
            <button className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-cyan-50 hover:border-cyan-300 transition-all cursor-pointer">
              Renewable Energy
            </button>
            <button className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-teal-50 hover:border-teal-300 transition-all cursor-pointer">
              Supply Chain
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">156</div>
              <div className="text-sm text-gray-600">Expert Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">25K+</div>
              <div className="text-sm text-gray-600">Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600 mb-2">12</div>
              <div className="text-sm text-gray-600">Research Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">5+</div>
              <div className="text-sm text-gray-600">Years Publishing</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
