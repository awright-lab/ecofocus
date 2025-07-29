'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative min-h-[65vh] flex items-center overflow-hidden">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-bottom brightness-150"
            >
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-400/15 to-blue-500/20"></div>

            {/* Angled Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500 to-blue-500 transform -skew-y-6 opacity-30"></div>

            {/* Glass Container */}
            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <motion.div
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 flex flex-col lg:flex-row lg:items-center lg:text-left text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="w-full">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                            <span className="block">Sustainability Insights</span>
                            <span className="block">
                                That Drive{' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
                                    Growth
                                </span>
                            </span>
                        </h1>
                        <p className="text-lg text-gray-200 mb-8">
                            Data-backed research to guide sustainability decisions since 2010.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-start">
                            <Link
                                href="/reports"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-transform hover:scale-105"
                            >
                                View Reports
                            </Link>
                            <Link
                                href="/solutions"
                                className="bg-white text-gray-900 border border-gray-300 hover:border-emerald-500 px-8 py-4 rounded-full font-semibold shadow hover:shadow-lg transition-transform hover:scale-105"
                            >
                                Explore Solutions
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}













