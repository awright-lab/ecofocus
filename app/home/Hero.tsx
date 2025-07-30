'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import FloatingOrbs from '@/components/FloatingOrbs';

export default function Hero() {
    return (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-bottom brightness-150"
            >
                <source src="/videos/hero-4.mp4" type="video/mp4" />
            </video>

            {/* Overlays */}
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-400/15 to-blue-500/20"></div>
            <FloatingOrbs />

            {/* Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500 to-blue-500 transform -skew-y-6 opacity-30"></div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 md:p-10 max-w-3xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                        <span className="block">Your Sustainability Data.</span>
                        <span className="block">
                            On{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
                                Demand.
                            </span>
                        </span>
                    </h1>

                    <p className="text-lg text-gray-200 mb-8 max-w-2xl">
                        Unlock 90,000+ data points on consumer sustainability attitudes—accessible 24/7 through our interactive dashboard.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link
                                href="/dashboard"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full text-sm md:text-base font-semibold shadow-lg transition-transform whitespace-nowrap"
                            >
                                Explore Dashboard Demo
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link
                                href="/solutions"
                                className="bg-white text-gray-900 border border-gray-300 hover:border-emerald-500 px-6 py-3 rounded-full text-sm md:text-base font-semibold shadow hover:shadow-lg transition-transform whitespace-nowrap"
                            >
                                Add Our Data to Your Lake
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}





















