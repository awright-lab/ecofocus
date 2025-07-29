'use client';

export default function QuickStatsSection() {
    const stats = [
        { value: '14+', label: 'Years of Research' },
        { value: '4,000+', label: 'Respondents Annually' },
        { value: '90,000+', label: 'Data Points' }
    ];

    return (
        <section className="flex justify-around py-6 bg-gray-50">
            {stats.map((stat, index) => (
                <div key={index} className="text-center">
                    <p className="text-green-600 font-bold text-xl">{stat.value}</p>
                    <p className="text-sm text-gray-700">{stat.label}</p>
                </div>
            ))}
        </section>
    );
}
