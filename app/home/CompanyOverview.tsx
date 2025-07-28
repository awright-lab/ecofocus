'use client';

export default function CompanyOverview() {
    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Heading */}
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
                            We believe that robust data and solid insights should underpin every step of a strategic and planning process. Our syndicated research offers the clarity needed to align sustainability strategies with consumer expectations.
                        </p>
                    </div>

                    {/* Bullet Points & Image */}
                    <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
                        <div className="space-y-4">
                            {[
                                'Insights into what resonates with consumers attitudes and behaviors.',
                                'Who they trust and where they get their information.',
                                'What certifications will influence sales.',
                                'Gaining and retaining talent across cohorts like Gen Z and Millennials.',
                                'Protect business asset value with a robust sustainability strategy.',
                                'And more.'
                            ].map((point, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <i className="ri-check-line text-white text-sm"></i>
                                    </div>
                                    <p className="text-gray-700">{point}</p>
                                </div>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-2xl transform -rotate-1"></div>
                            <img
                                src="https://readdy.ai/api/search-image?query=Modern%20professional%20sustainability%20research%20team%20working%20in%20a%20contemporary%20office%20environment%20with%20large%20windows&width=600&height=500"
                                alt="EcoFocus Research Team"
                                className="relative w-full h-auto rounded-2xl shadow-xl object-cover object-top"
                            />
                        </div>
                    </div>

                    {/* EcoFocus Difference */}
                    <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-3xl p-8 md:p-12 mb-16">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                The EcoFocus Difference
                            </h3>
                            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                                Since 2010, EcoFocus Research has led the way in understanding sustainability trends and consumer behavior. Our syndicated studies offer unmatched insights and competitive advantage.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: 'ri-settings-3-line', color: 'from-blue-500 to-blue-600', title: 'Proprietary Customization', text: 'Add tailored questions to meet your specific sustainability goals.' },
                                { icon: 'ri-bar-chart-2-line', color: 'from-emerald-500 to-emerald-600', title: 'Advanced Analytics', text: 'Perform crosstabs with our syndicated data for deeper, actionable insights.' },
                                { icon: 'ri-shuffle-line', color: 'from-cyan-500 to-cyan-600', title: 'Seamless Integration', text: 'Combine EcoFocus data with yours for a multidimensional view.' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                                        <i className={`${item.icon} text-white text-xl`}></i>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                                    <p className="text-gray-600">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Why Choose */}
                    <div className="text-center">
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Why Choose EcoFocus Worldwide?
                        </h3>
                        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                            Unlike other research firms, we focus exclusively on sustainability, empowering companies to align with consumer expectations and thrive in a green economy.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
