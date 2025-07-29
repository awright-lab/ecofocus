'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import FloatingOrbs from '@/components/FloatingOrbs';

export default function Hero() {
    return (
        <section className="relative min-h-[65vh] flex items-center overflow-hidden">
            {/* Background Video */}
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover object-bottom brightness-150">
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Floating Accent Orbs */}
            <FloatingOrbs />

            {/* Hero Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-8">
                {/* Glass Text Container */}
                <div className="w-full lg:w-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 relative z-10">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                        Sustainability Insights<br />That Drive{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
                            Growth
                        </span>
                    </h1>
                    <p className="text-lg text-gray-200 mb-8">Data-backed research to guide sustainability decisions since 2010.</p>
                    <div className="flex gap-4">
                        <motion.a
                            href="/reports"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg"
                            whileHover={{ scale: 1.05 }}
                        >
                            View Reports
                        </motion.a>
                        <motion.a
                            href="/solutions"
                            className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold shadow-lg"
                            whileHover={{ scale: 1.05 }}
                        >
                            Explore Solutions
                        </motion.a>
                    </div>
                </div>

                {/* Image */}
                <motion.div
                    className="w-full lg:w-1/2 flex justify-center relative z-10"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <Image
                        src="/images/hero-cover.png"
                        alt="EcoFocus Report"
                        width={500}
                        height={350}
                        className="rounded-xl shadow-2xl"
                    />
                </motion.div>
            </div>
        </section>
    );
}

















