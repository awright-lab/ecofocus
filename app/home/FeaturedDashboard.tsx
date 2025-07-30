'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedDashboard() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="mb-4">
                        <span className="uppercase text-xs tracking-wide bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full border border-emerald-200">
                            Dashboard Highlight
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Explore the EcoFocus Interactive Dashboard
                    </h2>

                    <p className="text-lg text-gray-600 mb-8">
                        Instantly access over <strong>90,000 sustainability data points</strong>. Segment by demographics, compare trends, and build custom insights in real time — all in one place.
                    </p>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-bold shadow-md">
                                ✓
                            </span>
                            <span className="text-gray-700">Real-time filtering by demographics & behaviors</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-bold shadow-md">
                                ✓
                            </span>
                            <span className="text-gray-700">Custom crosstabs & chart generation</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-bold shadow-md">
                                ✓
                            </span>
                            <span className="text-gray-700">Export-ready insights & visualizations</span>
                        </li>
                    </ul>

                    <Link
                        href="/dashboard"
                        className="relative overflow-hidden rounded-full px-6 py-3 text-sm md:text-base font-semibold text-white bg-emerald-600 transition-all duration-300 before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)] before:scale-0 before:transition-transform before:duration-500 hover:before:scale-100 before:z-0"
                    >
                        <span className="relative z-10">View Dashboard Demo</span>
                    </Link>
                </motion.div>

                {/* Right Image */}
                <motion.div
                    className="relative flex justify-center"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Glow Behind Image */}
                    <div className="absolute w-[300px] h-[300px] bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"></div>

                    <Image
                        src="/images/dashboard.png"
                        alt="EcoFocus Interactive Dashboard Preview"
                        width={500}
                        height={350}
                        className="rounded-xl shadow-2xl relative z-10"
                        priority
                    />
                </motion.div>
            </div>
        </section>
    );
}

