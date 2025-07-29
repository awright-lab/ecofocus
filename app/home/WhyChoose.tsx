'use client';

import { motion } from 'framer-motion';

export default function WhyChoose() {
    const reasons = [
        'Over a decade of sustainability research experience since 2010.',
        'Robust, actionable insights backed by thousands of data points.',
        'Tailored research and consulting services to fit your goals.',
        'Predictive insights and forward-thinking strategies for a sustainable future.'
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                {/* Category Tag */}
                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="uppercase text-xs tracking-wide bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full border border-emerald-200">
                        Why Choose Us
                    </span>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Why Choose EcoFocus?
                        </h2>
                        <p className="text-lg text-gray-600">
                            We’ve been helping businesses navigate sustainability challenges for over a decade.
                            Our approach is data-driven, actionable, and tailored to your success.
                        </p>
                    </motion.div>

                    {/* Right Column - Bullet Points */}
                    <motion.ul
                        className="space-y-6"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {reasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                                    <i className="ri-check-line text-white text-xl"></i>
                                </div>
                                <p className="text-gray-700 text-lg">{reason}</p>
                            </li>
                        ))}
                    </motion.ul>
                </div>
            </div>
        </section>
    );
}




