'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import FloatingOrbs from '@/components/FloatingOrbs'; // Reusable accent orbs

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
                <source src="/videos/hero-3.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-400/15 to-blue-500/20"></div>

            {/* Floating Orbs */}
            <FloatingOrbs />

            {/* Angled Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500 to-blue-500 transform -skew-y-6 opacity-30"></div>

            {/* Glass Container */}
            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <motion.div
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 flex flex-col lg:flex-row items-center justify-between gap-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Left Text */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
                            <span className="block">Your Sustainability Data.</span>
                            <span className="block">
                                On{' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
                                    Demand.
                                </span>
                            </span>
                        </h1>
                        <p className="text-lg text-gray-200 mb-8">
                            Unlock 90,000+ data points on consumer sustainability attitudes—accessible 24/7 through our interactive dashboard.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link
                                    href="/reports"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-transform"
                                >
                                    Explore Dashboard Demo
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link
                                    href="/solutions"
                                    className="bg-white text-gray-900 border border-gray-300 hover:border-emerald-500 px-8 py-4 rounded-full font-semibold shadow hover:shadow-lg transition-transform"
                                >
                                    Add Our Data to Your Lake
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <motion.div
                        className="relative w-full lg:w-1/2 flex justify-center"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="relative bg-transparent rounded-xl shadow-2xl p-4">
                            <Image
                                src="/images/dashboard.png"
                                alt="EcoFocus Sustainability Report"
                                width={500}
                                height={350}
                                className="rounded-xl object-cover"
                                priority
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}


















