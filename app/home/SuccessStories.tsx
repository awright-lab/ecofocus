'use client';

export default function SuccessStories() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Heading */}
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

                    {/* Cards */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                initials: 'GT',
                                name: 'GreenTech Industries',
                                industry: 'Manufacturing',
                                quote: 'EcoFocus Research helped us reduce our carbon footprint by 35% in just 18 months. Their data-driven approach and expert guidance were invaluable.',
                                stats: [
                                    { icon: 'ri-arrow-down-line', color: 'text-emerald-500', text: '35% Carbon Reduction' },
                                    { icon: 'ri-money-dollar-circle-line', color: 'text-blue-500', text: '$2M+ Savings' }
                                ],
                                bg: 'from-blue-50 to-blue-100',
                                color: 'from-blue-500 to-blue-600'
                            },
                            {
                                initials: 'EC',
                                name: 'EcoCorporation',
                                industry: 'Financial Services',
                                quote: 'The ESG reporting tools transformed our compliance process. We now have real-time visibility into our sustainability metrics.',
                                stats: [
                                    { icon: 'ri-time-line', color: 'text-emerald-500', text: '80% Time Savings' },
                                    { icon: 'ri-shield-check-line', color: 'text-blue-500', text: '100% Compliance' }
                                ],
                                bg: 'from-emerald-50 to-emerald-100',
                                color: 'from-emerald-500 to-emerald-600'
                            },
                            {
                                initials: 'SF',
                                name: 'Sustainable Foods Ltd',
                                industry: 'Food & Beverage',
                                quote: 'Their market research gave us the competitive edge we needed. We\'re now leading our industry in sustainability innovation.',
                                stats: [
                                    { icon: 'ri-trophy-line', color: 'text-emerald-500', text: 'Industry Leader' },
                                    { icon: 'ri-arrow-up-line', color: 'text-blue-500', text: '150% Growth' }
                                ],
                                bg: 'from-cyan-50 to-cyan-100',
                                color: 'from-cyan-500 to-cyan-600'
                            }
                        ].map((story, i) => (
                            <div
                                key={i}
                                className={`bg-gradient-to-br ${story.bg} p-8 rounded-xl`}
                            >
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${story.color} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                                        {story.initials}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{story.name}</div>
                                        <div className="text-sm text-gray-600">{story.industry}</div>
                                    </div>
                                </div>

                                {/* Quote */}
                                <blockquote className="text-gray-700 mb-6 italic">"{story.quote}"</blockquote>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                                    {story.stats.map((stat, j) => (
                                        <div key={j} className="flex items-center gap-1">
                                            <i className={`${stat.icon} ${stat.color}`}></i>
                                            <span>{stat.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
