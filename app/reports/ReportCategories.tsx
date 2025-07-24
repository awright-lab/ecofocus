
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReportCategories() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    {
      id: 'all',
      name: 'All Reports',
      count: 500,
      icon: 'ri-file-list-3-line'
    },
    {
      id: 'market-research',
      name: 'Market Research',
      count: 125,
      icon: 'ri-bar-chart-line'
    },
    {
      id: 'esg-reporting',
      name: 'ESG Reporting',
      count: 89,
      icon: 'ri-file-chart-line'
    },
    {
      id: 'carbon-management',
      name: 'Carbon Management',
      count: 67,
      icon: 'ri-leaf-line'
    },
    {
      id: 'regulatory-compliance',
      name: 'Regulatory Compliance',
      count: 78,
      icon: 'ri-government-line'
    },
    {
      id: 'investment-analysis',
      name: 'Investment Analysis',
      count: 56,
      icon: 'ri-line-chart-line'
    },
    {
      id: 'technology-trends',
      name: 'Technology Trends',
      count: 45,
      icon: 'ri-rocket-line'
    },
    {
      id: 'industry-specific',
      name: 'Industry Specific',
      count: 94,
      icon: 'ri-building-line'
    }
  ];

  const industryReports = [
    {
      name: 'Manufacturing',
      count: 45,
      image: 'https://readdy.ai/api/search-image?query=Modern%20sustainable%20manufacturing%20facility%20with%20green%20technology%20and%20environmental%20monitoring%20systems%20showing%20industrial%20sustainability%20practices&width=300&height=200&seq=industry-1&orientation=landscape'
    },
    {
      name: 'Energy & Utilities',
      count: 38,
      image: 'https://readdy.ai/api/search-image?query=Renewable%20energy%20power%20plant%20with%20wind%20turbines%20and%20solar%20panels%20showing%20clean%20energy%20infrastructure%20and%20sustainable%20utilities&width=300&height=200&seq=industry-2&orientation=landscape'
    },
    {
      name: 'Financial Services',
      count: 29,
      image: 'https://readdy.ai/api/search-image?query=Modern%20financial%20district%20with%20sustainable%20banking%20buildings%20and%20green%20finance%20concepts%20showing%20ESG%20investment%20and%20sustainable%20finance&width=300&height=200&seq=industry-3&orientation=landscape'
    },
    {
      name: 'Healthcare',
      count: 24,
      image: 'https://readdy.ai/api/search-image?query=Sustainable%20healthcare%20facility%20with%20eco-friendly%20medical%20equipment%20and%20green%20healthcare%20technology%20showing%20environmental%20health%20practices&width=300&height=200&seq=industry-4&orientation=landscape'
    },
    {
      name: 'Technology',
      count: 33,
      image: 'https://readdy.ai/api/search-image?query=Green%20technology%20data%20center%20with%20sustainable%20IT%20infrastructure%20and%20environmental%20monitoring%20systems%20showing%20eco-friendly%20technology%20solutions&width=300&height=200&seq=industry-5&orientation=landscape'
    },
    {
      name: 'Retail & Consumer',
      count: 27,
      image: 'https://readdy.ai/api/search-image?query=Sustainable%20retail%20store%20with%20eco-friendly%20products%20and%20green%20consumer%20goods%20showing%20sustainable%20retail%20practices%20and%20environmental%20responsibility&width=300&height=200&seq=industry-6&orientation=landscape'
    }
  ];

  return (
    <section id="categories" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-700 mb-4">
              <i className="ri-folder-line text-blue-500"></i>
              Research Categories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Find reports tailored to your specific industry needs and sustainability goals</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.id === 'all' ? '/reports/all' : `/reports/category/${category.id}`}
                className={`group p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedCategory === category.id
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg'
                    : 'border-gray-200 hover:border-emerald-300 hover:shadow-lg bg-white/80 backdrop-blur-sm'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                  }`}>
                    <i className={`${category.icon} text-xl`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} reports</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Industry-Specific Reports</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Specialized research tailored to your industry's unique sustainability challenges and opportunities</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industryReports.map((industry, index) => (
                <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 border border-gray-100">
                  <div className="relative">
                    <img
                      src={industry.image}
                      alt={industry.name}
                      className="w-full h-48 object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-lg font-semibold mb-1">{industry.name}</h4>
                      <p className="text-sm text-gray-200">{industry.count} reports available</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <Link href={`/reports/industry/${industry.name.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors cursor-pointer">
                      View Reports
                      <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-600 mb-6">
                <i className="ri-settings-3-line text-emerald-500"></i>
                Custom Research Available
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Need Custom Research?</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our expert research team can create custom reports tailored to your specific sustainability goals and industry requirements. Get personalized insights that drive real business impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                  Request Custom Research
                  <i className="ri-arrow-right-line"></i>
                </Link>
                <Link href="/solutions" className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:border-emerald-300 transition-all shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                  Learn More
                  <i className="ri-information-line"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
