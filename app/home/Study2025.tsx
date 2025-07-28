'use client';

import Link from 'next/link';

export default function Study2025() {
    return (
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
                                {[
                                    {
                                        icon: 'ri-settings-3-line',
                                        bg: 'from-blue-500 to-blue-600',
                                        title: "Customized to Your Brand's Needs",
                                        text: "This year's study offers brands the unique opportunity to incorporate proprietary questions tailored to their industry and sustainability goals."
                                    },
                                    {
                                        icon: 'ri-bar-chart-2-line',
                                        bg: 'from-emerald-500 to-emerald-600',
                                        title: "Enhanced Data Analysis",
                                        text: "Participants will receive access to an extensive dataset, including a curated selection of crosstabs for deeper insights."
                                    },
                                    {
                                        icon: 'ri-rocket-line',
                                        bg: 'from-cyan-500 to-cyan-600',
                                        title: "Driving Sustainable Success",
                                        text: "These insights help businesses make informed decisions, refine strategies, and achieve sustainability goals."
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${item.bg} rounded-lg flex items-center justify-center`}>
                                                <i className={`${item.icon} text-white text-xl`}></i>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
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

                    <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-3xl p-8 md:p-12 mb-16">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold mb-6">
                                    <i className="ri-database-2-line"></i>
                                    2024 Syndicated Research
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Data Now Available</h3>
                                <h4 className="text-xl font-semibold text-gray-800 mb-6">Gain Insights to Relevant and Actionable Data</h4>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    Our 2024 study is now complete and ready to share with you. Contact us today for a no obligation review.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        {
                                            title: 'Consumer Attitudes and Behaviors are Changing',
                                            text: 'Stay updated on shifts in attitudes related to climate change, packaging, pollution, and more.'
                                        },
                                        {
                                            title: 'Benefits',
                                            text: 'Gain insights into products, packaging, and sustainability perceptions across demographics.'
                                        },
                                        {
                                            title: 'Trends and Deep Dives',
                                            text: 'Our historical data allows you to track sustainability trends over time.'
                                        }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                                            <h5 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h5>
                                            <p className="text-gray-600 leading-relaxed">{item.text}</p>
                                        </div>
                                    ))}
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
                </div>
            </div>
        </section>
    );
}
