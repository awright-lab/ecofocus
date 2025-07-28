'use client';

import Link from 'next/link';

export default function FeaturedProduct() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Heading */}
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

                    {/* Report Card */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-3xl transform rotate-1"></div>
                        <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                {/* Left Column */}
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

                                    {/* Features */}
                                    <div className="grid grid-cols-1 gap-4 mb-8">
                                        {[
                                            { icon: 'ri-shopping-cart-line', color: 'bg-emerald-100 text-emerald-600', title: 'Future Purchasing Behavior', text: 'Explore the role of packaging, affordability, and eco-education' },
                                            { icon: 'ri-award-line', color: 'bg-blue-100 text-blue-600', title: 'Environmental Certifications', text: 'Discover which certifications consumers recognize and trust' },
                                            { icon: 'ri-bar-chart-line', color: 'bg-cyan-100 text-cyan-600', title: 'Product Category Impact', text: 'Discover where sustainability has the biggest impact' },
                                            { icon: 'ri-group-line', color: 'bg-purple-100 text-purple-600', title: 'Generational & Regional Demands', text: 'Understand consumer demands across generations and regions' },
                                            { icon: 'ri-graduation-cap-line', color: 'bg-indigo-100 text-indigo-600', title: 'Education Level Influence', text: 'How education level influences environmental purchasing decisions' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                                                    <i className={`${item.icon} text-lg`}></i>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{item.title}</div>
                                                    <div className="text-sm text-gray-600">{item.text}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-center">
                                        <Link href="/reports" className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                                            Click to learn more
                                        </Link>
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-2xl transform rotate-3"></div>
                                    <img
                                        src="https://static.readdy.ai/image/92f654f6e9fffe99d924ae6db44f629b/587c49601efc1af424d1a3e2c4e4dd08.png"
                                        alt="Available Now: Sustainability Insights Report"
                                        className="relative w-full h-auto rounded-2xl shadow-xl object-cover object-top"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
