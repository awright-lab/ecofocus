
'use client';

import { useState } from 'react';

export default function BlogCategories() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', count: 156, icon: 'ri-file-list-line' },
    { name: 'ESG Reporting', count: 42, icon: 'ri-file-chart-line' },
    { name: 'Carbon Management', count: 38, icon: 'ri-leaf-line' },
    { name: 'Renewable Energy', count: 29, icon: 'ri-sun-line' },
    { name: 'Supply Chain', count: 24, icon: 'ri-truck-line' },
    { name: 'Circular Economy', count: 23, icon: 'ri-recycle-line' }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-sm text-emerald-700 mb-4">
              <i className="ri-folder-line text-emerald-500"></i>
              Article Categories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Find articles tailored to your specific interests and needs</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`p-6 rounded-xl text-center transition-all hover:shadow-lg cursor-pointer ${
                  activeCategory === category.name
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg transform scale-105'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  activeCategory === category.name
                    ? 'bg-white/20 text-white'
                    : 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600'
                }`}>
                  <i className={`${category.icon} text-xl`}></i>
                </div>
                <h3 className="font-semibold text-sm mb-2">{category.name}</h3>
                <p className={`text-xs ${
                  activeCategory === category.name ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {category.count} articles
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
