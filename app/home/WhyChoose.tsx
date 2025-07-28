'use client';

export default function WhyChoose() {
    const points = [
        'Established sustainability research since 2010',
        '90K+ data points analyzed annually',
        'Dedicated team of industry experts'
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-emerald-600 to-blue-600 text-white text-center">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose EcoFocus?</h2>
                <ul className="space-y-4 text-lg">
                    {points.map((p, i) => (
                        <li key={i}>✅ {p}</li>
                    ))}
                </ul>
            </div>
        </section>
    );
}


