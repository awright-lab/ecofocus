'use client';

export default function QuickStats() {
    const stats = [
        { label: 'Since', value: '2010', icon: 'ri-calendar-line' },
        { label: 'Data Points Analyzed', value: '90K+', icon: 'ri-bar-chart-line' },
        { label: 'Years of Expertise', value: '15+', icon: 'ri-award-line' }
    ];

    return (
        <section className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                {stats.map((stat, i) => (
                    <div key={i} className="animate-fadeInUp">
                        <i className={`${stat.icon} text-emerald-600 text-3xl mb-3`}></i>
                        <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-gray-600">{stat.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
