'use client';

import { useState } from 'react';

export default function VideoDemo() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-700 mb-4">
              <i className="ri-play-circle-line text-blue-500"></i>
              Video Demo
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              See the Dashboard in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Watch this comprehensive demo to understand how our interactive dashboard can transform your sustainability reporting and decision-making process
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-3xl transform rotate-1"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl relative overflow-hidden">
                {!isPlaying ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <button
                        onClick={handlePlayClick}
                        className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-110 shadow-lg hover:shadow-xl mb-4 cursor-pointer"
                      >
                        <i className="ri-play-fill text-2xl ml-1"></i>
                      </button>
                      <div className="text-white text-xl font-semibold mb-2">Dashboard Demo Video</div>
                      <div className="text-gray-300 text-sm">Click to play the interactive demo</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-emerald-600/20"></div>
                    <img
                      src="https://readdy.ai/api/search-image?query=Modern%20professional%20sustainability%20dashboard%20interface%20screenshot%20showing%20interactive%20charts%2C%20graphs%2C%20environmental%20data%20visualization%2C%20ESG%20metrics%2C%20carbon%20footprint%20tracking%2C%20renewable%20energy%20statistics%2C%20and%20environmental%20KPIs%20in%20a%20sleek%20web%20application%20with%20blue%20and%20green%20color%20scheme%2C%20clean%20modern%20design%20with%20hexagonal%20patterns%20and%20contemporary%20UI%20elements&width=800&height=450&seq=dashboard-video-preview&orientation=landscape"
                      alt="Dashboard Preview"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                      <div className="text-lg font-semibold">Loading Demo Video...</div>
                      <div className="text-sm text-gray-300 mt-2">Please wait while we prepare the demo</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i className="ri-dashboard-line text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Interactive Interface</h3>
                  <p className="text-sm text-gray-600">Explore real-time data with intuitive controls</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i className="ri-filter-line text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Advanced Filtering</h3>
                  <p className="text-sm text-gray-600">Filter by date, region, category, and more</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i className="ri-download-line text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Export Options</h3>
                  <p className="text-sm text-gray-600">Download reports in multiple formats</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}