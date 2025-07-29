'use client';

import { motion } from 'framer-motion';

export default function QuickStats() {
    const stats = [
        { label: 'Since', value: '2010', icon: 'ri-calendar-line' },
        { label: 'Data Points Analyzed', value: '90K+', icon: 'ri-bar-chart-line' },
        { label: 'Years of Expertise', value: '15+', icon: 'ri-award-line' }
    ];

    return (
        <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 py-16">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-transform hover:scale-105"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                    >
                        <i className={`${stat.icon} text-emerald-600 text-4xl mb-3`}></i>
                        <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-gray-600">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}



