
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import StickyButtons from '../../../components/StickyButtons';

export default function AllReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [purchaseReport, setPurchaseReport] = useState<any>(null);

  const categories = [
    { id: 'all', name: 'All Reports', count: 500 },
    { id: 'market-research', name: 'Market Research', count: 125 },
    { id: 'esg-reporting', name: 'ESG Reporting', count: 89 },
    { id: 'carbon-management', name: 'Carbon Management', count: 67 },
    { id: 'regulatory-compliance', name: 'Regulatory Compliance', count: 78 },
    { id: 'investment-analysis', name: 'Investment Analysis', count: 56 },
    { id: 'technology-trends', name: 'Technology Trends', count: 45 },
    { id: 'industry-specific', name: 'Industry Specific', count: 94 }
  ];

  const allReports = [
    {
      id: 1,
      title: 'Global Carbon Markets Report 2024',
      category: 'carbon-management',
      price: '$2,499',
      pages: 245,
      date: '2024-01-15',
      description: 'Comprehensive analysis of global carbon trading markets, pricing trends, and regulatory developments.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20business%20report%20cover%20design%20with%20carbon%20market%20charts%2C%20green%20and%20blue%20color%20scheme%2C%20modern%20minimalist%20layout%20showing%20environmental%20finance%20data%20visualization&width=300&height=400&seq=report-1&orientation=portrait'
    },
    {
      id: 2,
      title: 'ESG Investment Trends in Technology Sector',
      category: 'investment-analysis',
      price: '$1,899',
      pages: 189,
      date: '2024-01-10',
      description: 'In-depth analysis of ESG investment patterns and opportunities in the technology industry.',
      image: 'https://readdy.ai/api/search-image?query=Modern%20business%20report%20cover%20with%20technology%20and%20investment%20theme%2C%20showing%20ESG%20metrics%20and%20tech%20industry%20analysis%2C%20professional%20blue%20and%20green%20design&width=300&height=400&seq=report-2&orientation=portrait'
    },
    {
      id: 3,
      title: 'Renewable Energy Market Forecast 2024-2030',
      category: 'market-research',
      price: '$3,299',
      pages: 312,
      date: '2024-01-08',
      description: 'Six-year forecast of renewable energy markets including solar, wind, and emerging technologies.',
      image: 'https://readdy.ai/api/search-image?query=Clean%20energy%20report%20cover%20design%20with%20renewable%20energy%20symbols%2C%20market%20analysis%20charts%2C%20professional%20financial%20services%20design%20theme&width=300&height=400&seq=report-3&orientation=portrait'
    },
    {
      id: 4,
      title: 'Supply Chain Sustainability Compliance Guide',
      category: 'regulatory-compliance',
      price: '$1,599',
      pages: 156,
      date: '2024-01-05',
      description: 'Complete guide to navigating supply chain sustainability regulations across major markets.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20compliance%20report%20cover%20showing%20supply%20chain%20network%20diagram%2C%20regulatory%20documentation%20theme%2C%20corporate%20blue%20and%20green%20color%20palette&width=300&height=400&seq=report-4&orientation=portrait'
    },
    {
      id: 5,
      title: 'Manufacturing Industry Decarbonization Strategies',
      category: 'industry-specific',
      price: '$2,199',
      pages: 198,
      date: '2024-01-03',
      description: 'Strategic roadmap for manufacturing companies to achieve net-zero carbon emissions.',
      image: 'https://readdy.ai/api/search-image?query=Industrial%20sustainability%20report%20cover%20with%20manufacturing%20facility%20and%20green%20technology%20elements%2C%20professional%20design%20with%20decarbonization%20theme&width=300&height=400&seq=report-5&orientation=portrait'
    },
    {
      id: 6,
      title: 'Green Technology Innovation Report',
      category: 'technology-trends',
      price: '$1,799',
      pages: 174,
      date: '2024-01-01',
      description: 'Latest innovations in green technology and their market potential for sustainable development.',
      image: 'https://readdy.ai/api/search-image?query=Technology%20innovation%20report%20cover%20with%20green%20tech%20elements%2C%20modern%20design%20showing%20sustainable%20technology%20trends%20and%20innovation%20concepts&width=300&height=400&seq=report-6&orientation=portrait'
    },
    {
      id: 7,
      title: 'Corporate ESG Reporting Standards 2024',
      category: 'esg-reporting',
      price: '$1,399',
      pages: 134,
      date: '2023-12-28',
      description: 'Updated guide to ESG reporting standards and best practices for corporate sustainability.',
      image: 'https://readdy.ai/api/search-image?query=Corporate%20ESG%20report%20cover%20with%20professional%20business%20design%2C%20sustainability%20metrics%20and%20reporting%20standards%20theme%2C%20clean%20modern%20layout&width=300&height=400&seq=report-7&orientation=portrait'
    },
    {
      id: 8,
      title: 'Sustainable Finance Market Analysis',
      category: 'market-research',
      price: '$2,899',
      pages: 267,
      date: '2023-12-25',
      description: 'Comprehensive analysis of sustainable finance markets, green bonds, and impact investing.',
      image: 'https://readdy.ai/api/search-image?query=Financial%20sustainability%20report%20cover%20with%20green%20finance%20elements%2C%20market%20analysis%20charts%2C%20professional%20financial%20services%20design%20theme&width=300&height=400&seq=report-8&orientation=portrait'
    },
    {
      id: 9,
      title: 'Climate Risk Assessment for Financial Institutions',
      category: 'investment-analysis',
      price: '$2,699',
      pages: 223,
      date: '2023-12-22',
      description: 'Framework for financial institutions to assess and manage climate-related risks.',
      image: 'https://readdy.ai/api/search-image?query=Climate%20risk%20assessment%20report%20cover%20for%20financial%20sector%2C%20showing%20risk%20management%20and%20climate%20analysis%20themes%20with%20professional%20banking%20design&width=300&height=400&seq=report-9&orientation=portrait'
    },
    {
      id: 10,
      title: 'Circular Economy Implementation Guide',
      category: 'regulatory-compliance',
      price: '$1,999',
      pages: 187,
      date: '2023-12-20',
      description: 'Practical guide for implementing circular economy principles in business operations.',
      image: 'https://readdy.ai/api/search-image?query=Circular%20economy%20report%20cover%20with%20recycling%20and%20sustainability%20symbols%2C%20showing%20circular%20business%20model%20concepts%20with%20modern%20green%20design&width=300&height=400&seq=report-10&orientation=portrait'
    },
    {
      id: 11,
      title: 'Energy Transition Roadmap for Utilities',
      category: 'industry-specific',
      price: '$3,499',
      pages: 298,
      date: '2023-12-18',
      description: 'Strategic roadmap for utility companies transitioning to renewable energy sources.',
      image: 'https://readdy.ai/api/search-image?query=Energy%20transition%20report%20cover%20for%20utilities%20showing%20power%20grid%20transformation%20and%20renewable%20energy%20infrastructure%20with%20professional%20utility%20sector%20design&width=300&height=400&seq=report-11&orientation=portrait'
    },
    {
      id: 12,
      title: 'AI in Environmental Monitoring',
      category: 'technology-trends',
      price: '$2,299',
      pages: 156,
      date: '2023-12-15',
      description: 'How artificial intelligence is transforming environmental monitoring and sustainability tracking.',
      image: 'https://readdy.ai/api/search-image?query=AI%20environmental%20monitoring%20report%20cover%20with%20technology%20and%20environmental%20data%20visualization%2C%20showing%20artificial%20intelligence%20in%20sustainability%20applications&width=300&height=400&seq=report-12&orientation=portrait'
    }
  ];

  const filteredReports = allReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'price-low':
        return parseInt(a.price.replace('$', '').replace(',', '')) - parseInt(b.price.replace('$', '').replace(',', ''));
      case 'price-high':
        return parseInt(b.price.replace('$', '').replace(',', '')) - parseInt(a.price.replace('$', '').replace(',', ''));
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const openPurchase = (report: any) => {
    setPurchaseReport(report);
  };

  const closePurchase = () => {
    setPurchaseReport(null);
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Purchase successful! You will receive download instructions via email.');
    closePurchase();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">All Reports</h1>
              <p className="text-xl text-gray-600">
                Browse our complete collection of {allReports.length} sustainability research reports
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AAE8C] focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AAE8C] focus:border-transparent text-sm pr-8"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AAE8C] focus:border-transparent text-sm pr-8"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Showing {sortedReports.length} of {allReports.length} reports
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedReports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img 
                    src={report.image}
                    alt={report.title}
                    className="w-full h-64 object-cover object-top"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#4AAE8C] bg-[#4AAE8C]/10 px-3 py-1 rounded-full">
                        {categories.find(cat => cat.id === report.category)?.name}
                      </span>
                      <span className="text-lg font-bold text-[#4AAE8C]">{report.price}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                      {report.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {report.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{report.pages} pages</span>
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openPurchase(report)}
                        className="flex-1 bg-[#4AAE8C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3E7C59] transition-colors text-sm whitespace-nowrap cursor-pointer"
                      >
                        Buy Now
                      </button>
                      <Link 
                        href={`/reports/preview/${report.id}`}
                        className="px-4 py-2 border border-[#4AAE8C] text-[#4AAE8C] rounded-lg font-semibold hover:bg-[#4AAE8C] hover:text-white transition-colors text-sm whitespace-nowrap cursor-pointer text-center"
                      >
                        Preview
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedReports.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            )}

            <div className="mt-12 text-center">
              <div className="bg-[#4AAE8C]/5 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Our research team can create custom reports tailored to your specific needs
                </p>
                <Link href="/contact" className="bg-[#4AAE8C] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#3E7C59] transition-colors whitespace-nowrap cursor-pointer">
                  Request Custom Research
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Modal */}
      {purchaseReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Purchase Report</h2>
              <button
                onClick={closePurchase}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={purchaseReport.image}
                    alt={purchaseReport.title}
                    className="w-20 h-28 object-cover object-top rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{purchaseReport.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{purchaseReport.pages} pages</p>
                    <div className="text-2xl font-bold text-[#4AAE8C]">{purchaseReport.price}</div>
                  </div>
                </div>
              </div>

              <form id="purchase-form" onSubmit={handlePurchaseSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AAE8C] focus:border-transparent text-sm"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AAE8C] focus:border-transparent text-sm"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AAE8C] focus:border-transparent text-sm"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AAE8C] focus:border-transparent text-sm"
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AAE8C] focus:border-transparent text-sm"
                      placeholder="Enter your job title"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AAE8C] focus:border-transparent text-sm"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AAE8C] focus:border-transparent text-sm pr-8"
                      >
                        <option value="">Select your country</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Australia">Australia</option>
                        <option value="Japan">Japan</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How will you use this report?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="usage"
                          value="Internal Research"
                          className="mr-3 text-[#4AAE8C] focus:ring-[#4AAE8C]"
                        />
                        <span className="text-sm text-gray-700">Internal Research & Analysis</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="usage"
                          value="Strategy Planning"
                          className="mr-3 text-[#4AAE8C] focus:ring-[#4AAE8C]"
                        />
                        <span className="text-sm text-gray-700">Strategy Planning & Decision Making</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="usage"
                          value="Investment Analysis"
                          className="mr-3 text-[#4AAE8C] focus:ring-[#4AAE8C]"
                        />
                        <span className="text-sm text-gray-700">Investment Analysis & Due Diligence</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="usage"
                          value="Client Services"
                          className="mr-3 text-[#4AAE8C] focus:ring-[#4AAE8C]"
                        />
                        <span className="text-sm text-gray-700">Client Services & Consulting</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Report Price:</span>
                      <span className="font-semibold">{purchaseReport.price}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-semibold">$0.00</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total:</span>
                        <span className="text-lg font-bold text-[#4AAE8C]">{purchaseReport.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      required
                      className="mt-1 text-[#4AAE8C] focus:ring-[#4AAE8C]"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the <a href="#" className="text-[#4AAE8C] hover:underline">Terms of Service</a> and <a href="#" className="text-[#4AAE8C] hover:underline">Privacy Policy</a>
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      className="mt-1 text-[#4AAE8C] focus:ring-[#4AAE8C]"
                    />
                    <label htmlFor="newsletter" className="text-sm text-gray-600">
                      Subscribe to our newsletter for updates on new research and sustainability insights
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={closePurchase}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#4AAE8C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3E7C59] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Complete Purchase
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <StickyButtons />
    </div>
  );
}
