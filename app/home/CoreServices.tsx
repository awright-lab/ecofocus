'use client';

export default function CoreServices() {
    const services = [
        {
            icon: 'ri-bar-chart-box-line',
            title: 'Syndicated Research',
            text: 'Annual trend studies on sustainability.'
        },
        {
            icon: 'ri-search-line',
            title: 'Custom Research',
            text: 'Tailored B2C & B2B research solutions.'
        },
        {
            icon: 'ri-file-text-line',
            title: 'Specialized Reports',
            text: 'Actionable insights for your strategy.'
        },
        {
            icon: 'ri-user-settings-line',
            title: 'Consulting',
            text: 'Expert guidance to achieve sustainability goals.'
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Our Services</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all text-center"
                        >
                            <div className="text-emerald-600 text-4xl mb-4">
                                <i className={service.icon}></i>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                            <p className="text-gray-600">{service.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


