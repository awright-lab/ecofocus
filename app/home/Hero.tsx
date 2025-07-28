'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
            {/* Fullscreen Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/70 via-emerald-600/60 to-blue-700/70"></div>

            <div className="relative z-10 container mx-auto px-6 py-16 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                    className="text-center lg:text-left max-w-xl"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                        Sustainability Insights That Drive <span className="text-cyan-300">Growth</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8">
                        Data-backed research to help you make confident sustainability-focused business decisions since 2010.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link
                            href="/reports"
                            className="bg-white text-emerald-700 px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-transform hover:scale-105"
                        >
                            View Reports
                        </Link>
                        <Link
                            href="/solutions"
                            className="bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold shadow hover:bg-emerald-700 transition-transform hover:scale-105"
                        >
                            Explore Solutions
                        </Link>
                    </div>
                </motion.div>

                {/* Right Visual */}
                <motion.div
                    className="relative flex justify-center lg:justify-end"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="relative w-full max-w-md">
                        <Image
                            src="images/report-cover.png"
                            alt="EcoFocus Sustainability Report"
                            width={500}
                            height={600}
                            className="rounded-xl shadow-2xl object-cover w-full"
                            priority
                        />

                        {/* Accent Shape */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full opacity-20 blur-2xl"></div>
                    </div>
                </motion.div>
            </div>

            {/* Mobile Overlay on Image */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 lg:hidden bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <h1 className="text-3xl font-bold text-white leading-tight mb-4">
                        Sustainability Insights That Drive <span className="text-emerald-400">Growth</span>
                    </h1>
                    <p className="text-base text-white/90 mb-6">
                        Data-backed research to guide your sustainability strategy.
                    </p>
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <Link
                            href="/reports"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-transform hover:scale-105"
                        >
                            View Reports
                        </Link>
                        <Link
                            href="/solutions"
                            className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold shadow hover:shadow-lg transition-transform hover:scale-105"
                        >
                            Explore Solutions
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}








