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
                className="absolute inset-0 w-full h-full object-cover brightness-150"
            >
                <source src="/videos/hero-2.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-400/15 to-blue-500/20"></div>

            {/* Angled Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500 to-blue-500 transform -skew-y-6 opacity-30"></div>

            {/* Glass Container for Text */}
            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <motion.div
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 max-w-2xl"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                        Sustainability Insights That Drive <span className="text-emerald-400">Growth</span>
                    </h1>
                    <p className="text-lg text-gray-200 mb-8">
                        Data-backed research to guide sustainability decisions since 2010.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
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
                </motion.div>
            </div>
        </section>
    );
}












