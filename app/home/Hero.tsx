'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative min-h-[65vh] flex items-center overflow-hidden">
            {/* Video Background with Brightness Filter */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover brightness-300 opacity-70"
            >
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            {/* White Overlay */}
            <div className="absolute inset-0 bg-white/50"></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/70 via-emerald-400/60 to-blue-500/70"></div>

            {/* Angled Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500 to-blue-500 transform -skew-y-6 opacity-30"></div>

            <div className="relative z-10 container mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <motion.div
                    className="text-center lg:text-left max-w-xl"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                        Sustainability Insights That Drive <span className="text-cyan-200">Growth</span>
                    </h1>
                    <p className="text-base md:text-lg text-white/90 mb-6">
                        Data-backed research to guide sustainability decisions since 2010.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                        <Link
                            href="/reports"
                            className="bg-white text-emerald-700 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-transform hover:scale-105"
                        >
                            View Reports
                        </Link>
                        <Link
                            href="/solutions"
                            className="bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-emerald-700 transition-transform hover:scale-105"
                        >
                            Explore Solutions
                        </Link>
                    </div>
                </motion.div>

                {/* Right Visual */}
                <motion.div
                    className="relative flex justify-center lg:justify-end"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="relative w-full max-w-sm">
                        <Image
                            src="/images/report-cover.png"
                            alt="EcoFocus Sustainability Report"
                            width={450}
                            height={550}
                            className="rounded-xl shadow-2xl object-cover"
                            priority
                        />
                        {/* Accent Shape */}
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full opacity-20 blur-2xl"></div>
                    </div>
                </motion.div>
            </div>

            {/* Mobile Overlay */}
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








