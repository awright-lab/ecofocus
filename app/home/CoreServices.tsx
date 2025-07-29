'use client';

import { motion } from 'framer-motion';
import FloatingOrbs from '@/components/FloatingOrbs';

export default function CoreServices() {
    const services = [
        {
            title: 'Syndicated Research',
            icon: 'ri-bar-chart-box-line',
            color: 'from-emerald-400 to-blue-400',
            text: 'Annual trend studies on sustainability.'
        },
        {
            title: 'Custom Research',
            icon: 'ri-search-line',
            color: 'from-blue-400 to-cyan-400',
            text: 'Tailored B2C & B2B research solutions.'
        },
        {
            title: 'Specialized Reports',
            icon: 'ri-file-text-line',
            color: 'from-cyan-400 to-emerald-400',
            text: 'Actionable insights for your strategy.'
        },
        {
            title: 'Consulting',
            icon: 'ri-user-settings-line',
            color: 'from-emerald-400 to-green-400',
            text: 'Expert guidance for your sustainability goals.'
        }
    ];

    return (
        <section className="relative py-20 bg-gray-50 overflow-hidden">
            {/* Subtle Accent Orbs */}
            <div className="absolute inset-0 z-0">
                <FloatingOrbs />
            </div>

            <div className="relative z-10 container mx-auto px-6 max-w-6xl text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-12">
                    Our Core Services
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, i) => (
                        <motion.div
                            key={i}
                            className="p-8 bg-white/70 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg hover:shadow-xl transition-transform hover:scale-105"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                        >
                            <div
                                className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                            >
                                <i className={`${service.icon} text-3xl text-white`}></i>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                            <p className="text-gray-600">{service.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}





