'use client';

import { motion } from 'framer-motion';
import FloatingOrbs from '@/components/FloatingOrbs';
import Link from 'next/link';

export default function CoreServices() {
    const services = [
        {
            title: 'Syndicated Research',
            icon: 'ri-bar-chart-box-line',
            color: 'from-emerald-400 via-blue-400 to-emerald-500',
            text: 'Annual trend studies on sustainability.'
        },
        {
            title: 'Custom Research',
            icon: 'ri-search-line',
            color: 'from-blue-400 via-cyan-400 to-emerald-400',
            text: 'Tailored B2C & B2B research solutions.'
        },
        {
            title: 'Specialized Reports',
            icon: 'ri-file-text-line',
            color: 'from-emerald-400 via-blue-400 to-cyan-400',
            text: 'Actionable insights for your strategy.'
        },
        {
            title: 'Consulting',
            icon: 'ri-user-settings-line',
            color: 'from-emerald-400 via-green-400 to-blue-400',
            text: 'Expert guidance for your sustainability goals.'
        }
    ];

    return (
        <section className="relative py-20 bg-gray-50 overflow-hidden">
            {/* Floating Orbs */}
            <div className="absolute inset-0 z-0">
                <FloatingOrbs />
            </div>

            {/* Accent Bar */}
            <div className="absolute top-[-100px] right-[-50%] w-[300%] h-40 bg-gradient-to-l from-emerald-500 to-blue-500 opacity-30 rounded-full rotate-[-20deg] origin-right"></div>

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Category Tag */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="uppercase text-[10px] tracking-wide bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full border border-emerald-200">
                        Solutions
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h2
                    className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Solutions to Drive{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
                        Sustainability Success
                    </span>
                </motion.h2>

                {/* Subtitle */}
                <p className="text-lg text-gray-600 mb-12 max-w-2xl">
                    Explore our range of research and consulting services designed to help your business lead with purpose.
                </p>

                {/* Service Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, i) => (
                        <motion.div
                            key={i}
                            className="group flex flex-col justify-between h-full p-8 bg-white rounded-xl border border-gray-100 shadow-md relative overflow-hidden"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05 }} // ✅ Add Framer Motion hover scaling
                            viewport={{ once: true }}
                            transition={{ duration: 0.3 }}
                        >                    
                            <div>
                                <div
                                    className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center mb-4`}
                                >
                                    <i className={`${service.icon} text-2xl text-white`}></i>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                                <p className="text-gray-600 mb-6">{service.text}</p>
                            </div>

                            {/* Explore Button */}
                            <Link
                                href={`/solutions#${service.title.replace(/\s+/g, '-').toLowerCase()}`}
                                className="relative overflow-hidden inline-block rounded-full px-4 py-2 text-sm font-semibold text-white bg-emerald-600 transition-all duration-300
                                before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)]
                                before:scale-0 before:transition-transform before:duration-500 group-hover:before:scale-110 before:z-0"
                            >
                                <span className="relative z-10">Explore</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}









