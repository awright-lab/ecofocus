
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FeaturedReports() {
  const [activeTab, setActiveTab] = useState('featured');

  const featuredReports = [
    {
      id: 1,
      title: "Global Sustainability Trends 2024",
      description: "Comprehensive analysis of worldwide sustainability initiatives, regulatory changes, and market opportunities across 50+ countries.",
      price: "$4,995",
      pages: "285 pages",
      category: "Market Research",
      image: "https://readdy.ai/api/search-image?query=Professional%20sustainability%20report%20cover%20design%20with%20global%20world%20map%20showing%20environmental%20data%20points%20and%20green%20sustainability%20metrics%20with%20modern%20corporate%20layout%20and%20eco-friendly%20color%20scheme&width=300&height=400&seq=report-1&orientation=portrait",
      features: ["90,000+ data points", "50+ country analysis", "Industry benchmarks", "Regulatory updates"]
    },
    {
      id: 2,
      title: "ESG Investment Opportunities 2024",
      description: "In-depth analysis of ESG investment trends, opportunities, and risk assessments for institutional investors and fund managers.",
      price: "$3,495",
      pages: "198 pages",
      category: "Investment Research",
      image: "https://readdy.ai/api/search-image?query=ESG%20investment%20report%20cover%20with%20financial%20charts%20showing%20sustainable%20investment%20opportunities%20green%20bonds%20and%20environmental%20finance%20data%20with%20professional%20business%20document%20design&width=300&height=400&seq=report-2&orientation=portrait",
      features: ["Investment analysis", "Risk assessments", "Market forecasts", "Portfolio strategies"]
    },
    {
      id: 3,
      title: "Carbon Management Best Practices",
      description: "Practical guide to implementing effective carbon management strategies with real-world case studies and actionable frameworks.",
      price: "$2,995",
      pages: "156 pages",
      category: "Implementation Guide",
      image: "https://readdy.ai/api/search-image?query=Carbon%20management%20report%20cover%20featuring%20industrial%20carbon%20capture%20technology%20and%20emission%20reduction%20charts%20with%20green%20environmental%20graphics%20and%20professional%20corporate%20design&width=300&height=400&seq=report-3&orientation=portrait",
      features: ["Implementation guides", "Case studies", "Best practices", "Measurement tools"]
    }
  ];

  const trendingReports = [
    {
      id: 4,
      title: "Circular Economy Transformation",
      description: "Strategic insights on transitioning to circular economy models with industry-specific implementation roadmaps.",
      price: "$2,495",
      pages: "142 pages",
      category: "Strategy Guide",
      image: "https://readdy.ai/api/search-image?query=Circular%20economy%20report%20cover%20with%20recycling%20symbols%20and%20sustainable%20business%20cycle%20diagrams%20showing%20waste%20reduction%20and%20resource%20efficiency%20in%20modern%20green%20design&width=300&height=400&seq=report-4&orientation=portrait",
      features: ["Roadmaps", "Case studies", "ROI analysis", "Implementation tools"]
    },
    {
      id: 5,
      title: "Supply Chain Sustainability",
      description: "Comprehensive analysis of sustainable supply chain practices, vendor assessments, and risk management strategies.",
      price: "$3,795",
      pages: "221 pages",
      category: "Operations Research",
      image: "https://readdy.ai/api/search-image?query=Supply%20chain%20sustainability%20report%20cover%20with%20logistics%20network%20diagrams%20showing%20green%20transportation%20and%20sustainable%20distribution%20systems%20with%20professional%20business%20graphics&width=300&height=400&seq=report-5&orientation=portrait",
      features: ["Vendor assessments", "Risk management", "Cost analysis", "Best practices"]
    },
    {
      id: 6,
      title: "Renewable Energy Market Outlook",
      description: "Market analysis of renewable energy opportunities, technology trends, and investment prospects across global markets.",
      price: "$4,295",
      pages: "267 pages",
      category: "Market Analysis",
      image: "https://readdy.ai/api/search-image?query=Renewable%20energy%20market%20report%20cover%20with%20wind%20turbines%20solar%20panels%20and%20clean%20energy%20infrastructure%20showing%20market%20growth%20charts%20and%20investment%20opportunities&width=300&height=400&seq=report-6&orientation=portrait",
      features: ["Market forecasts", "Technology analysis", "Investment opportunities", "Regional insights"]
    }
  ];

  const freeReports = [
    {
      id: 7,
      title: "Sustainability Reporting Framework Guide",
      description: "Essential guide to understanding major sustainability reporting frameworks including GRI, SASB, and TCFD standards.",
      price: "Free",
      pages: "32 pages",
      category: "Educational Guide",
      image: "https://readdy.ai/api/search-image?query=Free%20sustainability%20reporting%20guide%20cover%20with%20framework%20charts%20and%20compliance%20documentation%20showing%20educational%20content%20with%20green%20corporate%20design%20and%20accessibility%20symbols&width=300&height=400&seq=free-report-1&orientation=portrait",
      features: ["Framework comparison", "Implementation tips", "Compliance checklists", "Template downloads"]
    },
    {
      id: 8,
      title: "Carbon Footprint Calculator Workbook",
      description: "Step-by-step workbook for calculating organizational carbon footprints with practical examples and calculation tools.",
      price: "Free",
      pages: "28 pages",
      category: "Practical Tool",
      image: "https://readdy.ai/api/search-image?query=Carbon%20footprint%20calculator%20workbook%20cover%20with%20measurement%20tools%20and%20environmental%20calculation%20charts%20showing%20practical%20guide%20design%20with%20green%20educational%20theme&width=300&height=400&seq=free-report-2&orientation=portrait",
      features: ["Calculation templates", "Industry examples", "Verification methods", "Reporting formats"]
    },
    {
      id: 9,
      title: "Green Finance Primer",
      description: "Introductory guide to green finance instruments, sustainable investment basics, and ESG integration strategies.",
      price: "Free",
      pages: "24 pages",
      category: "Educational Guide",
      image: "https://readdy.ai/api/search-image?query=Green%20finance%20primer%20cover%20with%20sustainable%20investment%20symbols%20and%20eco-friendly%20financial%20charts%20showing%20educational%20content%20with%20professional%20green%20finance%20design&width=300&height=400&seq=free-report-3&orientation=portrait",
      features: ["Investment basics", "ESG integration", "Risk assessment", "Market overview"]
    }
  ];

  const getCurrentReports = () => {
    switch(activeTab) {
      case 'featured':
        return featuredReports;
      case 'trending':
        return trendingReports;
      case 'free':
        return freeReports;
      default:
        return featuredReports;
    }
  };

  const currentReports = getCurrentReports();

  return (
    <section id="featured" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-sm text-emerald-700 mb-4">
              <i className="ri-star-fill text-emerald-500"></i>
              Premium Research Collection
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Reports</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Access expert insights and data-driven analysis from our comprehensive research library</p>
          </div>
          
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-gray-200">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-6 py-3 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'featured' 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                Featured Reports
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-6 py-3 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'trending' 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                Trending Reports
              </button>
              <button
                onClick={() => setActiveTab('free')}
                className={`px-6 py-3 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'free' 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                Free Reports
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentReports.map((report) => (
              <div key={report.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 border border-gray-100">
                <div className="relative">
                  <img 
                    src={report.image}
                    alt={report.title}
                    className="w-full h-64 object-cover object-top"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {report.category}
                    </span>
                  </div>
                  {report.price === "Free" && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-green-500 to-green-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        FREE
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{report.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{report.description}</p>
                  
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {report.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <i className="ri-check-line text-emerald-500 text-sm mr-2"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-gray-500">{report.pages}</span>
                    <span className={`text-2xl font-bold ${report.price === "Free" ? "text-green-600" : "text-emerald-600"}`}>
                      {report.price}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {report.price === "Free" ? (
                      <Link href={`/reports/free/${report.id}`} className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-full hover:from-green-700 hover:to-green-600 transition-all text-center font-semibold whitespace-nowrap cursor-pointer">
                        Download Free
                      </Link>
                    ) : (
                      <Link href={`/reports/${report.id}`} className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-3 px-4 rounded-full hover:from-emerald-700 hover:to-emerald-600 transition-all text-center font-semibold whitespace-nowrap cursor-pointer">
                        Buy Now
                      </Link>
                    )}
                    <Link href={`/reports/preview/${report.id}`} className="flex-1 border-2 border-emerald-500 text-emerald-600 py-3 px-4 rounded-full hover:bg-emerald-500 hover:text-white transition-all text-center font-semibold whitespace-nowrap cursor-pointer">
                      Preview
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/reports/all" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
              View All Reports
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
