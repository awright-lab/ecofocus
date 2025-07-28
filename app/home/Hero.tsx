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

            {/* White Overlay */}
            <div className="absolute inset-0 bg-white/40"></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-400/15 to-blue-500/20"></div>

            {/* Angled Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500 to-blue-500 transform -skew-y-6 opacity-30"></div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
                {/* Left Text Content */}
                <motion.div
                    className="text-center lg:text-left max-w-lg lg:pl-4"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                        Sustainability Insights That Drive <span className="text-emerald-600">Growth</span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-700 mb-8">
                        Data-backed research to guide sustainability decisions since 2010.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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

                {/* Right Image - Larger */}
                <motion.div
                    className="relative flex justify-center lg:justify-end"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="relative w-full max-w-xl">
                        <Image
                            src="/images/report-cover.png"
                            alt="EcoFocus Sustainability Report"
                            width={700}
                            height={500}
                            className="rounded-xl shadow-2xl object-cover"
                            priority
                        />
                        {/* Accent Shape */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full opacity-20 blur-2xl"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}









