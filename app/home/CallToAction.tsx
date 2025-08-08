'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CallToAction() {
    return (
        <section className="relative py-20 bg-white overflow-hidden">
            {/* Subtle floating accents */}
            <div className="absolute top-[-80px] left-[-100px] w-[200px] h-[200px] bg-emerald-100 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-[-100px] right-[-120px] w-[220px] h-[220px] bg-blue-100 rounded-full blur-3xl opacity-30"></div>

            <motion.div
                className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                {/* Left Column: Heading + Subheading */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-snug">
                        Ready to Elevate Your Sustainability Strategy?
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-xl">
                        Book a consultation with our experts today and start turning data into actionable impact.
                    </p>
                </motion.div>

                {/* Right Column: CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row md:justify-end gap-4 mt-6 md:mt-0"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    {/* Primary Button */}
                    <Link
                        href="/contact"
                        className="relative inline-block px-5 py-2 text-sm font-semibold text-white rounded-full bg-[#124734] overflow-hidden transition-all duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#2F5D3A,_#1B6C7A)]
                  before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                    >
                        <span className="relative z-10">Request a Consultation</span>
                    </Link>

                    {/* Secondary Button */}
                    <Link
                        href="/solutions"
                        className="relative inline-block px-5 py-2 text-sm font-semibold text-black rounded-full bg-[#FFC107] overflow-hidden transition-all duration-300
                                        before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#FFD54F,_#FFA000)]
                                        before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                    >
                        <span className="relative z-10">Explore Solutions</span>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}




