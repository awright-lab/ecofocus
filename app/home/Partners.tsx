'use client';

export default function Partners() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Heading */}
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

                    {/* Partner Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        {[
                            { initials: 'tP', name: 'thinkParallax', role: 'Innovation Partner', bg: 'from-blue-50 to-blue-100', color: 'from-blue-500 to-blue-600' },
                            { initials: 'CG', name: 'Council of the Great Lakes Region', role: 'Regional Partner', bg: 'from-emerald-50 to-emerald-100', color: 'from-emerald-500 to-emerald-600' },
                            { initials: 'df', name: 'duraflame', role: 'Manufacturing Partner', bg: 'from-cyan-50 to-cyan-100', color: 'from-cyan-500 to-cyan-600' },
                            { initials: 'CL', name: 'Clean Label Project', role: 'Quality Partner', bg: 'from-purple-50 to-purple-100', color: 'from-purple-500 to-purple-600' },
                            { initials: 'GI', name: 'Glass Packaging Institute', role: 'Industry Partner', bg: 'from-teal-50 to-teal-100', color: 'from-teal-500 to-teal-600' },
                            { initials: 'AV', name: 'Avery', role: 'Solutions Partner', bg: 'from-orange-50 to-orange-100', color: 'from-orange-500 to-orange-600' }
                        ].map((partner, i) => (
                            <div
                                key={i}
                                className={`bg-gradient-to-br ${partner.bg} p-8 rounded-xl text-center group hover:shadow-lg transition-all`}
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${partner.color} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}>
                                    {partner.initials}
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{partner.name}</h3>
                                <p className="text-sm text-gray-600">{partner.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
