'use client';

export default function WhyChoose() {
    const stats = [
        { metric: 'Since 2010', text: 'Trusted experience in sustainability research.' },
        { metric: '90K+', text: 'Data points analyzed annually for precision.' },
        { metric: 'Expert Team', text: 'Dedicated sustainability researchers & strategists.' }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose EcoFocus?</h2>
                <p className="text-lg text-gray-600 mb-12">
                    We combine over a decade of experience with deep sustainability expertise to deliver actionable, data-driven insights.
                </p>
                <div className="grid sm:grid-cols-3 gap-8">
                    {stats.map((item, i) => (
                        <div
                            key={i}
                            className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-all"
                        >
                            <div className="text-emerald-600 text-2xl font-bold mb-2">{item.metric}</div>
                            <p className="text-gray-600">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
