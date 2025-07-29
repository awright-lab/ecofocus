'use client';

const services = [
    {
        title: 'Syndicated Study',
        desc: 'Comprehensive annual research on sustainability attitudes and behaviors across the U.S. market.'
    },
    {
        title: 'Custom Research',
        desc: 'Tailored studies to answer your unique sustainability and business questions.'
    },
    {
        title: 'Interactive Dashboard',
        desc: 'On-demand access to data, insights, and advanced analytics tools.'
    }
];

export default function Services() {
    return (
        <section className="p-6">
            <h2 className="text-xl font-bold mb-4">Our Solutions</h2>
            <div className="space-y-4">
                {services.map((s, i) => (
                    <div key={i} className="bg-gray-100 rounded-lg p-4 shadow">
                        <h3 className="font-semibold text-green-600 mb-1">{s.title}</h3>
                        <p className="text-sm">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}



  