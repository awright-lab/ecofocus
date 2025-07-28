'use client';

import Link from 'next/link';

export default function ServicesOverview() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Heading */}
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

                    {/* Service Cards */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {[
                            {
                                title: 'Insights',
                                icon: 'ri-lightbulb-line',
                                color: 'from-emerald-500 to-emerald-600',
                                bg: 'from-emerald-50 to-emerald-100',
                                text: 'EcoFocus provides research-based insights and trends to help brands navigate evolving consumer attitudes toward sustainability.'
                            },
                            {
                                title: 'Trends',
                                icon: 'ri-line-chart-line',
                                color: 'from-blue-500 to-blue-600',
                                bg: 'from-blue-50 to-blue-100',
                                text: 'We track multi-year sustainability data to identify both emerging and ongoing consumer trends.'
                            },
                            {
                                title: 'Custom Research - B2C & B2B',
                                icon: 'ri-search-line',
                                color: 'from-cyan-500 to-cyan-600',
                                bg: 'from-cyan-50 to-cyan-100',
                                text: 'We design custom research to answer your specific business questions and challenges.'
                            },
                            {
                                title: 'Consulting',
                                icon: 'ri-user-settings-line',
                                color: 'from-teal-500 to-teal-600',
                                bg: 'from-teal-50 to-teal-100',
                                text: 'Our experts assist in strategy, planning, and actionable steps for your sustainability goals.'
                            }
                        ].map((service, i) => (
                            <div
                                key={i}
                                className={`group p-8 bg-gradient-to-br ${service.bg} rounded-xl hover:shadow-lg transition-all`}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                                    <i className={`${service.icon} text-white text-xl`}></i>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{service.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Button */}
                    <div className="text-center">
                        <Link
                            href="/solutions"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                        >
                            Explore All Solutions
                            <i className="ri-arrow-right-line"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

