'use client';

export default function WhyChoose() {
    const points = [
        'Established sustainability research since 2010',
        '90K+ data points analyzed annually',
        'Dedicated team of industry experts'
    ];

    return (
        <section className="py-16 bg-gray-50 text-center">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose EcoFocus?</h2>
                <p className="text-gray-600 mb-8">
                    We deliver actionable insights backed by years of expertise and robust data.
                </p>
                <ul className="space-y-4 text-left sm:text-center">
                    {points.map((p, i) => (
                        <li key={i} className="text-gray-700 text-lg">
                            ✅ {p}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

