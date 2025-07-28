'use client';

export default function CoreServices() {
    const services = [
        { title: 'Syndicated Research', icon: 'ri-bar-chart-box-line', text: 'Annual sustainability trend studies.' },
        { title: 'Custom Research', icon: 'ri-search-line', text: 'Tailored B2C & B2B research solutions.' },
        { title: 'Specialized Reports', icon: 'ri-file-text-line', text: 'Actionable reports for business growth.' },
        { title: 'Consulting', icon: 'ri-user-settings-line', text: 'Expert strategy guidance for your brand.' }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-6xl text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-12">Our Services</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((s, i) => (
                        <div key={i} className="p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                            <i className={`${s.icon} text-emerald-600 text-4xl mb-4`}></i>
                            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                            <p className="text-gray-600">{s.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}



