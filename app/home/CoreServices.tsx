'use client';

export default function CoreServices() {
    const services = [
        { title: 'Syndicated Research', icon: 'ri-bar-chart-box-line', color: 'bg-emerald-100', text: 'Annual trend studies on sustainability.' },
        { title: 'Custom Research', icon: 'ri-search-line', color: 'bg-blue-100', text: 'Tailored B2C & B2B research solutions.' },
        { title: 'Specialized Reports', icon: 'ri-file-text-line', color: 'bg-cyan-100', text: 'Actionable insights for your strategy.' },
        { title: 'Consulting', icon: 'ri-user-settings-line', color: 'bg-emerald-100', text: 'Expert guidance for your sustainability goals.' }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 max-w-6xl text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-12">Our Services</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((s, i) => (
                        <div key={i} className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-transform hover:scale-105">
                            <div className={`w-16 h-16 ${s.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <i className={`${s.icon} text-3xl text-emerald-600`}></i>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                            <p className="text-gray-600">{s.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}




