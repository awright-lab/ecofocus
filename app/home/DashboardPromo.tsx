'use client';

import Link from 'next/link';

export default function DashboardPromo() {
    return (
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600 mb-6">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                Interactive Dashboard
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Explore Every <span className="text-blue-600">Insight</span>
                            </h2>

                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Get full access to every question included in the report with our interactive dashboard. Explore the data firsthand, filter insights, and dive deeper into the results at your own pace.
                            </p>

                            {/* Features */}
                            <div className="space-y-4 mb-8">
                                {[
                                    { icon: 'ri-search-line', color: 'bg-blue-100 text-blue-600', title: 'Full Question Access', text: 'Access every question in the report' },
                                    { icon: 'ri-filter-line', color: 'bg-emerald-100 text-emerald-600', title: 'Interactive Filtering', text: 'Filter insights by your criteria' },
                                    { icon: 'ri-play-circle-line', color: 'bg-cyan-100 text-cyan-600', title: 'Demo Video Available', text: 'Watch the dashboard in action' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
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

                            {/* CTA */}
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                            >
                                Explore Dashboard
                                <i className="ri-arrow-right-line"></i>
                            </Link>
                        </div>

                        {/* Image */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-2xl transform -rotate-2"></div>
                            <img
                                src="https://readdy.ai/api/search-image?query=Modern%20sleek%20sustainability%20dashboard%20interface%20with%20hexagonal%20design%20elements%20showing%20real-time%20environmental%20data&width=600&height=400"
                                alt="Sustainability Dashboard"
                                className="relative w-full h-auto rounded-2xl shadow-xl object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
