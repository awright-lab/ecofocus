'use client';

import { motion } from 'framer-motion';

export default function WhyChoose() {
    const reasons = [
        {
            title: 'Deep Expertise',
            desc: 'Over a decade of sustainability research experience since 2010.',
            icon: 'ri-award-line'
        },
        {
            title: 'Data You Can Trust',
            desc: 'Robust, actionable insights backed by thousands of data points.',
            icon: 'ri-bar-chart-grouped-line'
        },
        {
            title: 'Custom Solutions',
            desc: 'Tailored research and consulting services to fit your goals.',
            icon: 'ri-settings-3-line'
        },
        {
            title: 'Future-Ready',
            desc: 'Stay ahead with predictive insights and forward-thinking strategies.',
            icon: 'ri-rocket-line'
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Why Choose EcoFocus?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
                    We combine research, innovation, and strategy to help businesses meet their sustainability goals with confidence.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {reasons.map((reason, i) => (
                        <motion.div
                            key={i}
                            className="p-8 bg-white/70 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className={`${reason.icon} text-white text-2xl`}></i>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                            <p className="text-gray-600">{reason.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}



