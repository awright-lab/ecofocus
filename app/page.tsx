
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StickyButtons from '../components/StickyButtons';

export default function Home() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hexagonal Background Pattern */}
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
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600 mb-6">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Trusted by 500+ sustainability leaders worldwide
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-900 via-emerald-800 to-blue-900 bg-clip-text text-transparent">
              Transform Data Into
              <br />
              <span className="text-emerald-600">Sustainable Impact</span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Harness the power of 90,000+ sustainability data points to drive meaningful change and stay ahead in the evolving ESG landscape
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/reports" className="group bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                <span className="flex items-center gap-2">
                  Explore Reports
                  <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                </span>
              </Link>
              <Link href="/contact" className="group bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:border-emerald-300 transition-all shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                <span className="flex items-center gap-2">
                  Book Discovery Call
                  <i className="ri-calendar-line group-hover:scale-110 transition-transform"></i>
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">90K+</div>
                <div className="text-sm text-gray-600">Data Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Global Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600 mb-2">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2025 Study Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-700 mb-4">
                <i className="ri-calendar-line text-blue-500"></i>
                2025 Study Now In Development
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Comprehensive Insights for 2025
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                EcoFocus Research is proud to announce its 13th annual syndicated study for 2025. This study provides unparalleled insights into consumer behavior and sustainability trends across various sectors, empowering businesses to stay ahead in a rapidly evolving market.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <div className="space-y-8">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <i className="ri-settings-3-line text-white text-xl"></i>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Customized to Your Brand's Needs</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      This year's study offers brands the unique opportunity to incorporate proprietary questions tailored to their industry and sustainability goals. By customizing the research, you can gain actionable insights that align with your organization's specific objectives.
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <i className="ri-bar-chart-2-line text-white text-xl"></i>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Enhanced Data Analysis</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Participants will receive access to an extensive dataset, including a curated selection of crosstabs. This deeper level of analysis enables a more nuanced understanding of the data, allowing brands to uncover critical trends and patterns.
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <i className="ri-rocket-line text-white text-xl"></i>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Driving Sustainable Success</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      With these insights, businesses can make informed decisions to enhance sustainability efforts, refine marketing strategies, improve training, and propel their brands toward long-term success. The 2025 study is your key to achieving sustainability and sales goals simultaneously.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-2xl transform rotate-2"></div>
                <img
                  src="https://static.readdy.ai/image/92f654f6e9fffe99d924ae6db44f629b/16de2908446965f50373ea78e0adadbb.png"
                  alt="2025 Study Development Team"
                  className="relative w-full h-auto rounded-2xl shadow-xl object-cover"
                />
              </div>
            </div>

            {/* 2024 Syndicated Research Section */}
            <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-3xl p-8 md:p-12 mb-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold mb-6">
                    <i className="ri-database-2-line"></i>
                    2024 Syndicated Research
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Data Now Available
                  </h3>
                  <h4 className="text-xl font-semibold text-gray-800 mb-6">
                    Gain Insights to Relevant and Actionable Data
                  </h4>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Our 2024 study is now complete and ready to share with you. An EcoFocus Research Expert is available to help you access the right questions to help you get actionable insights into your target consumers. Contact us today for a no obligation review.
                  </p>

                  <div className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                      <h5 className="text-lg font-bold text-gray-900 mb-3">Consumer Attitudes and Behaviors are Changing</h5>
                      <p className="text-gray-600 leading-relaxed">
                        With the ever evolving landscape of sustainable human behavior, policy changes, residual impact of Covid and new advancements in technology it's even more important to stay in touch with current consumer attitudes and behaviors relative to key pillars of sustainability including but not limited to: Climate Change, Sustainable and Healthy Packaging, Pollution, Landfills, Recycling, Regenerative Farming, Use of Plastic, Plastic Waste, Bio-Diversity, Composting and more.
                      </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                      <h5 className="text-lg font-bold text-gray-900 mb-3">Benefits</h5>
                      <p className="text-gray-600 leading-relaxed">
                        By working with EcoFocus you will gain access to consumer insights into areas including: Consumer Packaged Goods including Products and Packaging, Building Materials, Household Products, Health and Safety, Labeling and Education and more. Additionally, subscribers will have options to drill down into the data and look at results by age groups, gender, regional and political persuasion, and many more custom crosstabs
                      </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                      <h5 className="text-lg font-bold text-gray-900 mb-3">Trends and Deep Dives</h5>
                      <p className="text-gray-600 leading-relaxed">
                        EcoFocus has been in the market conducting its sustainability trend study since 2010. EcoFocus has gathered a large amount of historical data that can confirm ongoing and identify new trends.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link href="/contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                      Contact for Review
                      <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-2xl transform -rotate-2"></div>
                  <img
                    src="https://static.readdy.ai/image/92f654f6e9fffe99d924ae6db44f629b/e696f5376fe916972cd505d9f0a5cd36.png"
                    alt="2024 Syndicated Research Data Visualization"
                    className="relative w-full h-auto rounded-2xl shadow-xl object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* Free Brand Inclusion */}
            <div className="bg-gradient-to-br from-emerald-100 to-blue-100 rounded-3xl p-8 md:p-12 mb-16">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-semibold mb-4">
                  <i className="ri-gift-line"></i>
                  Limited Space Available - No Cost
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Free Brand Inclusion in Our 2025 Study
                </h3>
                <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  We have space for a limited number of brands to be included in our study. There is no cost to you for inclusion. At the conclusion of the study, we will set up a brief meeting to provide you with a report that will tell you:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                    <p className="text-gray-700">How many people are aware of your brand</p>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                    <p className="text-gray-700">Of those that are aware have they purchased your product and purchasing frequency</p>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                    <p className="text-gray-700">If they haven't purchased, do they plan to purchase</p>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                    <p className="text-gray-700">Do they perceive your brand or company as Eco-Friendly</p>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">How it Works</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Submit Your Brand</div>
                        <div className="text-sm text-gray-600">Fill out the form with your brand details</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Confirmation</div>
                        <div className="text-sm text-gray-600">We'll review your submission and confirm space availability</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        3
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Report</div>
                        <div className="text-sm text-gray-600">We will advise you when the study is complete</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                  Submit Your Brand for Inclusion
                  <i className="ri-arrow-right-line"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-700 mb-4">
                <i className="ri-building-line text-blue-500"></i>
                About EcoFocus Research
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Looking Beneath the Surface
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                Taking a Deeper Dive into the Data to Empower Your Sustainability Journey with Actionable Insights
              </p>
              <p className="text-lg text-gray-600 max-w-5xl mx-auto leading-relaxed">
                We believe that robust data and solid insights should underpin every step of a strategic and planning process. Solid strategies and plans should reference supporting evidence with formal, informal, qualitative and quantitative data whenever possible. No matter what field you are in, from Packaged Goods to Human Resources to Private Equity Groups, data is an essential resource. Our data—alone or integrated with your existing data and insights—will help to pinpoint opportunities aligned with your goals:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
              <div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                    <p className="text-gray-700">Insights into what resonates with consumers attitudes and behaviors.</p>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                    <p className="text-gray-700">Who they trust and where they get their information.</p>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                    <p className="text-gray-700">What certifications will influence sales.</p>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                    <p className="text-gray-700">Gaining and retaining talent across cohorts like Gen Z and Millennials</p>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                    <p className="text-gray-700">Protect business asset value with a robust sustainability strategy</p>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                    <p className="text-gray-700">And more.</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-2xl transform -rotate-1"></div>
                <img
                  src="https://readdy.ai/api/search-image?query=Modern%20professional%20sustainability%20research%20team%20working%20in%20a%20contemporary%20office%20environment%20with%20large%20windows%2C%20team%20members%20analyzing%20environmental%20data%20on%20multiple%20screens%2C%20charts%2C%20graphs%2C%20and%20sustainability%20reports%2C%20diverse%20group%20of%20researchers%20in%20business%20casual%20attire%20collaborating%20around%20a%20sleek%20conference%20table%20with%20laptops%20and%20sustainability%20reports%2C%20bright%20natural%20lighting%20with%20plants%20and%20eco-friendly%20office%20design%20elements&width=600&height=500&seq=company-overview&orientation=portrait"
                  alt="EcoFocus Research Team"
                  className="relative w-full h-auto rounded-2xl shadow-xl object-cover object-top"
                />
              </div>
            </div>

            {/* The EcoFocus Difference */}
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-3xl p-8 md:p-12 mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  The EcoFocus Difference
                </h3>
                <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Since 2010, EcoFocus Research has led the way in understanding sustainability trends and consumer behavior. In 2025, we will launch our 14th annual syndicated study, offering unmatched insights across sectors. What sets us apart?
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <i className="ri-settings-3-line text-white text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Proprietary Customization</h4>
                  <p className="text-gray-600">Add tailored questions to meet your specific sustainability goals.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <i className="ri-bar-chart-2-line text-white text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h4>
                  <p className="text-gray-600">Perform crosstabs with our syndicated data for deeper, actionable insights.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                    <i className="ri-shuffle-line text-white text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Seamless Integration</h4>
                  <p className="text-gray-600">Combine EcoFocus data with yours for a multidimensional view of consumer sustainability behaviors.</p>
                </div>
              </div>
            </div>

            {/* Why Choose EcoFocus */}
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose EcoFocus Worldwide?
              </h3>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Unlike other research firms, we focus exclusively on sustainability, with a team deeply rooted in the field. From climate change to packaging innovation, EcoFocus empowers companies to align with consumer expectations, fostering success in a sustainability-driven world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-sm text-emerald-700 mb-4">
                <i className="ri-star-fill text-emerald-500"></i>
                Featured Report
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Available Now: Sustainability Insights Report
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The most comprehensive sustainability research report with actionable insights for forward-thinking businesses
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-3xl transform rotate-1"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <i className="ri-file-text-line text-white text-xl"></i>
                      </div>
                      <div>
                        <div className="text-sm text-emerald-600 font-semibold">2024 Edition</div>
                        <div className="text-lg font-bold text-gray-900">Sustainability Insights Report</div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                      Data-backed analysis of how environmental attitudes are transforming consumer behavior, brand trust, and long-term ROI.
                    </p>

                    <div className="grid grid-cols-1 gap-4 mb-8">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <i className="ri-shopping-cart-line text-emerald-600 text-lg"></i>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Future Purchasing Behavior</div>
                          <div className="text-sm text-gray-600">Explore the role of packaging, affordability, and eco-education</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <i className="ri-award-line text-blue-600 text-lg"></i>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Environmental Certifications</div>
                          <div className="text-sm text-gray-600">Discover which certifications consumers recognize and trust</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <i className="ri-bar-chart-line text-cyan-600 text-lg"></i>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Product Category Impact</div>
                          <div className="text-sm text-gray-600">Discover where sustainability has the biggest impact</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <i className="ri-group-line text-purple-600 text-lg"></i>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Generational & Regional Demands</div>
                          <div className="text-sm text-gray-600">Understand consumer demands across generations and regions</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <i className="ri-graduation-cap-line text-indigo-600 text-lg"></i>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Education Level Influence</div>
                          <div className="text-sm text-gray-600">How education level influences environmental purchasing decisions</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <Link href="/reports" className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                        Click to learn more
                      </Link>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-2xl transform rotate-3"></div>
                    <img
                      src="https://static.readdy.ai/image/92f654f6e9fffe99d924ae6db44f629b/587c49601efc1af424d1a3e2c4e4dd08.png"
                      alt="Available Now: Sustainability Insights Report"
                      className="relative w-full h-auto rounded-2xl shadow-xl object-cover object-top"
                      key="sustainability-report-new"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-700 mb-4">
                <i className="ri-service-line text-blue-500"></i>
                Our Services
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Comprehensive Sustainability Solutions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From data analytics to strategic consulting, we provide end-to-end sustainability solutions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="group p-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-lightbulb-line text-white text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Insights</h3>
                <p className="text-gray-600 leading-relaxed">
                  Armed with more than a decade of consumer data, EcoFocus is uniquely positioned to provide valuable research based insights and trends on the evolving world of consumer attitudes and behaviors toward sustainability.
                </p>
              </div>

              <div className="group p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-line-chart-line text-white text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Trends</h3>
                <p className="text-gray-600 leading-relaxed">
                  Only EcoFocus has multiple years of data available at our fingertips to be able to see what changes may be occurring and what areas need more work. Armed with more than a decade of historical data, we can spot both upward and downward attitude and behavioral shifts.
                </p>
              </div>

              <div className="group p-8 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-search-line text-white text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Custom Research - B2C & B2B</h3>
                <p className="text-gray-600 leading-relaxed">
                  We offer customized research solutions for B2C and B2B designed to address your unique business challenges and questions. Because our team is highly experienced in both sustainability and research, we are available to dive right in and design custom research to answer your specific research questions. We recommend the right approach for you whether a custom study or poll, among B2B or B2C audiences, to augment our large trend study or create a stand-alone project for you.
                </p>
              </div>

              <div className="group p-8 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-user-settings-line text-white text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Consulting</h3>
                <p className="text-gray-600 leading-relaxed">
                  The EcoFocus team of experts are available to help you with your research project, large or small. Everything from one day strategy and brain storming sessions to multi week projects. Contact us for a confidential, no cost, no obligation, discovery call to see if EcoFocus is the right choice for you.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link href="/solutions" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                Explore All Solutions
                <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Friends Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-sm text-emerald-700 mb-4">
                <i className="ri-heart-line text-emerald-500"></i>
                Trusted Partners
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Friends
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're proud to work alongside these industry leaders who share our commitment to sustainability
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center group hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  tP
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">thinkParallax</h3>
                <p className="text-sm text-gray-600">Innovation Partner</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-xl text-center group hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  CG
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Council of the Great Lakes Region</h3>
                <p className="text-sm text-gray-600">Regional Partner</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-8 rounded-xl text-center group hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  df
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">duraflame</h3>
                <p className="text-sm text-gray-600">Manufacturing Partner</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl text-center group hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  CL
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Clean Label Project</h3>
                <p className="text-sm text-gray-600">Quality Partner</p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-xl text-center group hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  GI
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Glass Packaging Institute</h3>
                <p className="text-sm text-gray-600">Industry Partner</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl text-center group hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  AV
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Avery</h3>
                <p className="text-sm text-gray-600">Solutions Partner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Promo */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600 mb-6">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Interactive Dashboard
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Explore Every
                  <span className="text-blue-600"> Insight</span>
                </h2>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Get full access to every question included in the report with our interactive dashboard. Explore the data firsthand, filter insights, and dive deeper into the results at your own pace. To see the dashboard in action, watch the demo video.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-search-line text-blue-600 text-lg"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Full Question Access</div>
                      <div className="text-sm text-gray-600">Access every question in the report</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <i className="ri-filter-line text-emerald-600 text-lg"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Interactive Filtering</div>
                      <div className="text-sm text-gray-600">Filter insights by your criteria</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <i className="ri-play-circle-line text-cyan-600 text-lg"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Demo Video Available</div>
                      <div className="text-sm text-gray-600">Watch the dashboard in action</div>
                    </div>
                  </div>
                </div>

                <Link href="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                  Explore Dashboard
                  <i className="ri-arrow-right-line"></i>
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-2xl transform -rotate-2"></div>
                <img
                  src="https://readdy.ai/api/search-image?query=Modern%20sleek%20sustainability%20dashboard%20interface%20with%20hexagonal%20design%20elements%20showing%20real-time%20environmental%20data%2C%20charts%2C%20graphs%2C%20and%20ESG%20metrics%20in%20blue%20and%20green%20color%20scheme%2C%20displaying%20carbon%20footprint%20tracking%2C%20renewable%20energy%20statistics%2C%20and%20environmental%20KPIs%20in%20a%20clean%20professional%20web%20application%20with%20geometric%20patterns%20and%20contemporary%20design%20elements&width=600&height=400&seq=sustainability-dashboard&orientation=landscape"
                  alt="Sustainability Dashboard"
                  className="relative w-full h-auto rounded-2xl shadow-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Success Stories */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-sm text-emerald-700 mb-4">
                <i className="ri-heart-line text-emerald-500"></i>
                Client Success Stories
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how companies across industries are achieving their sustainability goals with our solutions
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    GT
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">GreenTech Industries</div>
                    <div className="text-sm text-gray-600">Manufacturing</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "EcoFocus Research helped us reduce our carbon footprint by 35% in just 18 months. Their data-driven approach and expert guidance were invaluable."
                </blockquote>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <i className="ri-arrow-down-line text-emerald-500"></i>
                    <span>35% Carbon Reduction</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-money-dollar-circle-line text-blue-500"></i>
                    <span>$2M+ Savings</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    EC
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">EcoCorpration</div>
                    <div className="text-sm text-gray-600">Financial Services</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "The ESG reporting tools transformed our compliance process. We now have real-time visibility into our sustainability metrics."
                </blockquote>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <i className="ri-time-line text-emerald-500"></i>
                    <span>80% Time Savings</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-shield-check-line text-blue-500"></i>
                    <span>100% Compliance</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-8 rounded-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    SF
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Sustainable Foods Ltd</div>
                    <div className="text-sm text-gray-600">Food & Beverage</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "Their market research gave us the competitive edge we needed. We're now leading our industry in sustainability innovation."
                </blockquote>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <i className="ri-trophy-line text-emerald-500"></i>
                    <span>Industry Leader</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-arrow-up-line text-blue-500"></i>
                    <span>150% Growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 to-emerald-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
              <i className="ri-mail-line text-white"></i>
              Weekly Newsletter
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Stay Ahead of Sustainability Trends
            </h2>
            <p className="text-xl mb-10 text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Get weekly insights, research updates, and industry trends delivered directly to your inbox
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg backdrop-blur-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <StickyButtons />
    </div>
  );
}
