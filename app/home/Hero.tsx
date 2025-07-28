'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative min-h-[65vh] flex items-center overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover brightness-150"
            >
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            {/* White Overlay for Brightness */}
            <div className="absolute inset-0 bg-white/40"></div>

            {/* Gradient Overlay for Brand Colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-400/15 to-blue-500/20"></div>

            {/* Angled Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500 to-blue-500 transform -skew-y-6 opacity-30"></div>

            {/* Main Content - Aligned to Container */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 items-center">
                {/* Left Text */}
                <motion.div
                    className="justify-self-start max-w-xl"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
                        Sustainability Insights That Drive <span className="text-emerald-600">Growth</span>
                    </h1>
                    <p className="text-lg text-gray-700 mb-8">
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

                {/* Right Image */}
                <motion.div
                    className="justify-self-end"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="relative w-full max-w-xl">
                        <Image
                            src="/images/report-cover.png"
                            alt="EcoFocus Sustainability Report"
                            width={650}
                            height={450}
                            className="rounded-xl shadow-2xl object-cover"
                            priority
                        />
                        {/* Decorative Accent Shape */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full opacity-20 blur-2xl"></div>
                    </div>
                </motion.div>
            </div>

            {/* Mobile Overlay Mode */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 lg:hidden bg-gradient-to-t from-black/50 via-black/20 to-transparent">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <h1 className="text-2xl font-bold text-white leading-tight mb-3">
                        Sustainability Insights That Drive <span className="text-emerald-300">Growth</span>
                    </h1>
                    <p className="text-sm text-white/90 mb-4">
                        Data-backed research to guide your strategy.
                    </p>
                    <div className="flex flex-col gap-2 w-full max-w-xs">
                        <Link
                            href="/reports"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-full font-semibold shadow-lg transition-transform hover:scale-105"
                        >
                            View Reports
                        </Link>
                        <Link
                            href="/solutions"
                            className="bg-white text-gray-900 px-5 py-3 rounded-full font-semibold shadow hover:shadow-lg transition-transform hover:scale-105"
                        >
                            Explore Solutions
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}










