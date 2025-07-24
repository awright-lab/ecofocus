'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import StickyButtons from '../../../../components/StickyButtons';

interface ReportPreviewProps {
  reportId: string;
}

export default function ReportPreview({ reportId }: ReportPreviewProps) {
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
      image: 'https://readdy.ai/api/search-image?query=Professional%20business%20report%20cover%20design%20with%20carbon%20market%20charts%2C%20green%20and%20blue%20color%20scheme%2C%20modern%20minimalist%20layout%20showing%20environmental%20finance%20data%20visualization&width=400&height=500&seq=report-1&orientation=portrait',
      tableOfContents: [
        'Executive Summary',
        'Global Carbon Market Overview',
        'Regional Market Analysis',
        'Price Trends and Forecasts',
        'Regulatory Landscape',
        'Key Market Players',
        'Future Outlook'
      ],
      sampleContent: 'The global carbon markets have experienced unprecedented growth in 2024, with trading volumes reaching $850 billion worldwide. This comprehensive analysis examines the key drivers behind this expansion, including regulatory changes, corporate commitments, and technological innovations. Our research reveals that voluntary carbon markets have grown by 164% year-over-year, while compliance markets have expanded by 89%. The report provides detailed insights into regional variations, with European markets leading in volume while North American markets show the highest price premiums. Key findings include the emergence of nature-based solutions as a dominant offset category, accounting for 47% of all credits issued, and the increasing role of technology in market transparency and verification processes.',
      keyInsights: [
        'Carbon credit prices increased 78% across all major markets',
        'Technology-based solutions now represent 23% of all credits',
        'Corporate demand exceeded supply by 34% in Q4 2024',
        'New regulatory frameworks launched in 12 countries',
        'Market consolidation accelerated with 43 major acquisitions'
      ],
      methodology: 'This report is based on analysis of over 2,500 carbon credit transactions, interviews with 150 market participants, and review of regulatory developments across 45 jurisdictions. Data sources include major carbon registries, trading platforms, and proprietary market intelligence.',
      aboutAuthors: 'Our research team comprises leading experts in carbon markets, environmental finance, and regulatory policy. Dr. Sarah Chen leads our carbon markets research with over 15 years of experience in environmental economics. The team includes former regulators, market makers, and sustainability professionals from Fortune 500 companies.'
    },
    {
      id: 2,
      title: 'ESG Investment Trends in Technology Sector',
      category: 'investment-analysis',
      price: '$1,899',
      pages: 189,
      date: '2024-01-10',
      description: 'In-depth analysis of ESG investment patterns and opportunities in the technology industry.',
      image: 'https://readdy.ai/api/search-image?query=Modern%20business%20report%20cover%20with%20technology%20and%20investment%20theme%2C%20showing%20ESG%20metrics%20and%20tech%20industry%20analysis%2C%20professional%20blue%20and%20green%20design&width=400&height=500&seq=report-2&orientation=portrait',
      tableOfContents: [
        'Executive Summary',
        'Technology Sector ESG Landscape',
        'Investment Flow Analysis',
        'Top Performing ESG Tech Companies',
        'Risk Assessment Framework',
        'Future Investment Opportunities'
      ],
      sampleContent: 'ESG-focused technology investments have surged 245% year-over-year, with particular strength in clean energy tech and sustainable computing solutions. The sector has attracted $127 billion in ESG-focused funding, representing 34% of all ESG investments globally. Our analysis reveals that companies with strong ESG credentials in the technology sector outperformed traditional tech investments by an average of 18% annually. Key growth areas include renewable energy storage solutions, sustainable data centers, and circular economy technologies. The report examines 500+ technology companies across various sub-sectors, analyzing their ESG performance, investment attractiveness, and long-term sustainability prospects.',
      keyInsights: [
        'Clean tech startups received 67% more funding than previous year',
        'ESG-focused tech companies showed 23% lower volatility',
        'Sustainable computing solutions market grew 156%',
        'Energy efficiency technologies dominated with 41% market share',
        'AI applications in sustainability attracted $12.3 billion'
      ],
      methodology: 'Analysis includes quantitative assessment of 500+ technology companies, review of 1,200+ ESG-focused investment transactions, and interviews with 85 institutional investors and fund managers specializing in technology ESG investments.',
      aboutAuthors: 'Led by Dr. Michael Rodriguez, former head of ESG research at a leading investment bank, our team combines deep expertise in technology sector analysis with sustainable finance. The research team includes former venture capitalists, technology executives, and ESG specialists.'
    },
    {
      id: 3,
      title: 'Renewable Energy Market Forecast 2024-2030',
      category: 'market-research',
      price: '$3,299',
      pages: 312,
      date: '2024-01-08',
      description: 'Six-year forecast of renewable energy markets including solar, wind, and emerging technologies.',
      image: 'https://readdy.ai/api/search-image?query=Clean%20energy%20report%20cover%20design%20with%20renewable%20energy%20symbols%2C%20market%20analysis%20charts%2C%20professional%20financial%20services%20design%20theme&width=400&height=500&seq=report-3&orientation=portrait',
      tableOfContents: [
        'Executive Summary',
        'Market Size and Growth Projections',
        'Solar Energy Market Analysis',
        'Wind Energy Market Dynamics',
        'Emerging Technologies',
        'Regional Market Forecasts',
        'Investment Outlook'
      ],
      sampleContent: 'The renewable energy market is projected to reach $2.15 trillion by 2030, driven by declining costs and supportive government policies worldwide. Solar energy will maintain its position as the fastest-growing segment, with capacity additions expected to triple by 2027. Wind energy, both onshore and offshore, will see substantial growth, particularly in emerging markets. Our comprehensive analysis covers 75 countries and examines technology costs, policy frameworks, and market dynamics. Key findings include the continued competitiveness of renewables against fossil fuels, with solar and wind now the cheapest sources of electricity in most markets. The report also identifies emerging opportunities in energy storage, green hydrogen, and grid modernization technologies.',
      keyInsights: [
        'Solar installations will grow 340% by 2030',
        'Offshore wind capacity to increase 15-fold globally',
        'Energy storage market to reach $120 billion by 2028',
        'Green hydrogen market expanding at 58% CAGR',
        'Grid investment needs total $14 trillion through 2030'
      ],
      methodology: 'Bottom-up market analysis covering 75 countries, technology cost modeling, policy impact assessment, and interviews with 200+ industry stakeholders including developers, manufacturers, and policymakers.',
      aboutAuthors: 'Our renewable energy research team is led by Dr. Elena Vasquez, former IEA energy analyst, and includes engineers, economists, and policy experts with combined 50+ years of experience in renewable energy markets and forecasting.'
    },
    {
      id: 4,
      title: 'Supply Chain Sustainability Compliance Guide',
      category: 'regulatory-compliance',
      price: '$1,599',
      pages: 156,
      date: '2024-01-05',
      description: 'Complete guide to navigating supply chain sustainability regulations across major markets.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20compliance%20report%20cover%20showing%20supply%20chain%20network%20diagram%2C%20regulatory%20documentation%20theme%2C%20corporate%20blue%20and%20green%20color%20palette&width=400&height=500&seq=report-4&orientation=portrait',
      tableOfContents: [
        'Executive Summary',
        'Regulatory Framework Overview',
        'Supply Chain Mapping',
        'Compliance Strategies',
        'Risk Management',
        'Implementation Timeline'
      ],
      sampleContent: 'Supply chain sustainability regulations are becoming increasingly complex, with new requirements emerging across multiple jurisdictions. The EU Corporate Sustainability Due Diligence Directive, California SB-253, and similar regulations in 23 countries are creating unprecedented compliance challenges. Our guide provides practical frameworks for companies to navigate these requirements, including step-by-step compliance checklists, risk assessment tools, and implementation strategies. We analyze regulations affecting companies with revenues over $50 million, covering scope, timelines, and penalties. The report includes case studies from 45 companies that have successfully implemented compliance programs, highlighting best practices and common pitfalls.',
      keyInsights: [
        'New regulations affect 12,000+ companies globally',
        'Compliance costs average 0.3% of annual revenue',
        'Supply chain mapping completion time averages 18 months',
        'Third-party verification requirements increasing 400%',
        'Non-compliance penalties range from $50K to $50M'
      ],
      methodology: 'Legal analysis of 50+ regulations across 25 jurisdictions, survey of 300+ compliance professionals, and detailed case studies of compliance implementation at 45 companies across various industries.',
      aboutAuthors: 'Led by former regulatory counsel Sarah Williams, our compliance team includes attorneys, supply chain experts, and sustainability professionals with extensive experience in global regulatory frameworks and corporate compliance.'
    },
    {
      id: 5,
      title: 'Manufacturing Industry Decarbonization Strategies',
      category: 'industry-specific',
      price: '$2,199',
      pages: 198,
      date: '2024-01-03',
      description: 'Strategic roadmap for manufacturing companies to achieve net-zero carbon emissions.',
      image: 'https://readdy.ai/api/search-image?query=Industrial%20sustainability%20report%20cover%20with%20manufacturing%20facility%20and%20green%20technology%20elements%2C%20professional%20design%20with%20decarbonization%20theme&width=400&height=500&seq=report-5&orientation=portrait',
      tableOfContents: [
        'Executive Summary',
        'Current Manufacturing Emissions',
        'Decarbonization Technologies',
        'Implementation Roadmap',
        'Cost-Benefit Analysis',
        'Case Studies'
      ],
      sampleContent: 'Manufacturing accounts for 23% of global carbon emissions, but innovative decarbonization strategies can reduce this by up to 70% by 2030. Our analysis of 200+ manufacturing facilities reveals that electrification, process optimization, and renewable energy adoption are the most effective strategies. The report provides detailed implementation roadmaps for different manufacturing sectors, including automotive, chemicals, steel, and electronics. Key findings show that early adopters of decarbonization technologies achieve 15% cost savings within three years through improved efficiency and reduced energy costs. We examine emerging technologies like green hydrogen, carbon capture, and industrial heat pumps that will enable deep decarbonization.',
      keyInsights: [
        'Energy efficiency improvements can reduce emissions by 35%',
        'Electrification potential varies by sector (15-85% of processes)',
        'Renewable energy procurement doubled in manufacturing',
        'Green hydrogen adoption accelerating in heavy industry',
        'Carbon pricing affecting 67% of global manufacturing capacity'
      ],
      methodology: 'Analysis of 200+ manufacturing facilities across 15 industries, technology assessment, cost modeling, and interviews with 120 manufacturing executives and sustainability managers.',
      aboutAuthors: 'Our manufacturing team combines industrial engineering expertise with sustainability knowledge, led by Dr. James Thompson, former head of sustainability at a Fortune 100 manufacturer, with 20+ years of experience in industrial decarbonization.'
    },
    {
      id: 6,
      title: 'Green Technology Innovation Report',
      category: 'technology-trends',
      price: '$1,799',
      pages: 174,
      date: '2024-01-01',
      description: 'Latest innovations in green technology and their market potential for sustainable development.',
      image: 'https://readdy.ai/api/search-image?query=Technology%20innovation%20report%20cover%20with%20green%20tech%20elements%2C%20modern%20design%20showing%20sustainable%20technology%20trends%20and%20innovation%20concepts&width=400&height=500&seq=report-6&orientation=portrait',
      tableOfContents: [
        'Executive Summary',
        'Emerging Green Technologies',
        'Market Potential Analysis',
        'Innovation Trends',
        'Investment Landscape',
        'Future Outlook'
      ],
      sampleContent: 'Green technology innovations are accelerating rapidly, with breakthrough developments in energy storage, carbon capture, and sustainable materials. Our analysis of 1,500+ patents and 400+ startups reveals key innovation trends shaping the future of sustainability. Battery storage costs have declined 89% over five years, while new materials like perovskite solar cells and solid-state batteries promise even greater efficiency gains. The report examines 50+ emerging technologies across energy, transportation, agriculture, and manufacturing sectors. We identify the most promising innovations based on technical feasibility, market potential, and environmental impact.',
      keyInsights: [
        'Battery storage capacity increased 300% globally',
        'Carbon capture technologies received $8.2 billion in funding',
        'Sustainable materials market growing at 23% annually',
        'AI applications in green tech attracted record investment',
        'Breakthrough innovations reducing technology costs by 40%'
      ],
      methodology: 'Patent analysis of 1,500+ filings, startup ecosystem mapping, technology readiness assessment, and interviews with 80+ researchers, entrepreneurs, and investors in green technology.',
      aboutAuthors: 'Led by Dr. Lisa Chen, former CTO of a leading clean tech company, our innovation team includes engineers, scientists, and technology analysts with deep expertise in emerging green technologies and their commercialization potential.'
    }
  ];

  const report = allReports.find(r => r.id === parseInt(reportId));

  if (!report) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Report Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">The report you're looking for doesn't exist.</p>
            <Link href="/reports/all" className="bg-[#4AAE8C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#3E7C59] transition-colors whitespace-nowrap cursor-pointer">
              View All Reports
            </Link>
          </div>
        </div>
        <Footer />
        <StickyButtons />
      </div>
    );
  }

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
            <div className="mb-8">
              <Link href="/reports/all" className="inline-flex items-center text-[#4AAE8C] hover:text-[#3E7C59] mb-4">
                <i className="ri-arrow-left-line mr-2"></i>
                Back to All Reports
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Link href="/reports" className="hover:text-[#4AAE8C]">Reports</Link>
                <i className="ri-arrow-right-s-line"></i>
                <Link href="/reports/all" className="hover:text-[#4AAE8C]">All Reports</Link>
                <i className="ri-arrow-right-s-line"></i>
                <span>Preview</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#4AAE8C] to-[#3E7C59] text-white p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
                      Report Preview
                    </div>
                    <h1 className="text-3xl font-bold mb-4">{report.title}</h1>
                    <p className="text-lg opacity-90 mb-6">{report.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <i className="ri-file-text-line"></i>
                        <span>{report.pages} pages</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="ri-calendar-line"></i>
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="ri-price-tag-3-line"></i>
                        <span className="text-2xl font-bold">{report.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <img 
                      src={report.image}
                      alt={report.title}
                      className="max-w-sm h-80 object-cover object-top rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Table of Contents</h2>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <ul className="space-y-3">
                          {report.tableOfContents?.map((item: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <div className="w-8 h-8 bg-[#4AAE8C]/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                                <span className="text-[#4AAE8C] font-medium text-sm">{index + 1}</span>
                              </div>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Sample Content</h2>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {report.sampleContent}
                        </p>
                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-500 italic">
                            This is a sample excerpt from the full report. The complete report contains detailed analysis, 
                            charts, tables, and comprehensive insights across all sections.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Insights</h2>
                      <div className="bg-[#4AAE8C]/5 rounded-lg p-6">
                        <ul className="space-y-3">
                          {report.keyInsights?.map((insight: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <i className="ri-check-line text-[#4AAE8C] mr-3 mt-1 flex-shrink-0"></i>
                              <span className="text-gray-700">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Methodology</h2>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700 leading-relaxed">
                          {report.methodology}
                        </p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Authors</h2>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700 leading-relaxed">
                          {report.aboutAuthors}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="sticky top-8">
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Report Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium text-[#4AAE8C]">
                              {categories.find(cat => cat.id === report.category)?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pages:</span>
                            <span className="font-medium">{report.pages}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Published:</span>
                            <span className="font-medium">{new Date(report.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Format:</span>
                            <span className="font-medium">PDF</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Language:</span>
                            <span className="font-medium">English</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border-2 border-[#4AAE8C] rounded-lg p-6 text-center">
                        <div className="text-3xl font-bold text-[#4AAE8C] mb-2">{report.price}</div>
                        <p className="text-gray-600 mb-6">One-time purchase, lifetime access</p>
                        <button
                          onClick={() => openPurchase(report)}
                          className="w-full bg-[#4AAE8C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3E7C59] transition-colors mb-4 whitespace-nowrap cursor-pointer"
                        >
                          Buy Full Report
                        </button>
                        <Link href="/contact" className="w-full block text-center border border-[#4AAE8C] text-[#4AAE8C] px-6 py-3 rounded-lg font-semibold hover:bg-[#4AAE8C] hover:text-white transition-colors whitespace-nowrap cursor-pointer">
                          Contact Us
                        </Link>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6 mt-6">
                        <h4 className="font-bold text-gray-900 mb-3">What's Included</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center">
                            <i className="ri-check-line text-[#4AAE8C] mr-2"></i>
                            Full PDF report ({report.pages} pages)
                          </li>
                          <li className="flex items-center">
                            <i className="ri-check-line text-[#4AAE8C] mr-2"></i>
                            Executive summary
                          </li>
                          <li className="flex items-center">
                            <i className="ri-check-line text-[#4AAE8C] mr-2"></i>
                            Charts and data tables
                          </li>
                          <li className="flex items-center">
                            <i className="ri-check-line text-[#4AAE8C] mr-2"></i>
                            Methodology details
                          </li>
                          <li className="flex items-center">
                            <i className="ri-check-line text-[#4AAE8C] mr-2"></i>
                            References and sources
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Reports</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {allReports
                  .filter(r => r.id !== report.id && r.category === report.category)
                  .slice(0, 3)
                  .map((relatedReport) => (
                    <div key={relatedReport.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">{relatedReport.title}</h3>
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{relatedReport.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#4AAE8C] font-bold text-sm">{relatedReport.price}</span>
                        <Link href={`/reports/preview/${relatedReport.id}`} className="text-[#4AAE8C] hover:text-[#3E7C59] text-sm font-medium">
                          Preview →
                        </Link>
                      </div>
                    </div>
                  ))}
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