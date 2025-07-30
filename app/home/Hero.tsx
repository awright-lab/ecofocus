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
            <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 md:p-10 w-full"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        <span className="block">Turn Sustainability Insights</span>
                        <span className="block">
                            Into{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 bg-[length:200%_auto] animate-[gradientMove_6s_linear_infinite]">
                                Action.
                            </span>
                        </span>
                    </h1>

                    <p className="text-lg text-gray-200 mb-8 max-w-xl">
                        Empower your strategy with data that drives meaningful change. Explore trends, uncover opportunities, and move faster with insights at your fingertips.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/dashboard"
                            className="relative overflow-hidden rounded-full px-6 py-3 text-sm md:text-base font-semibold text-white bg-emerald-600 transition-all duration-300 before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)] before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                        >
                            <span className="relative z-10">Explore Dashboard Demo</span>
                        </Link>
                        <Link
                            href="/solutions"
                            className="relative overflow-hidden rounded-full px-6 py-3 text-sm md:text-base font-semibold text-gray-900 bg-white border border-gray-300 hover:border-transparent transition-all duration-300 hover:text-white before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_center,_#10b981,_#3b82f6)] before:scale-0 before:transition-transform before:duration-500 hover:before:scale-110 before:z-0"
                        >
                            <span className="relative z-10">How We Can Help</span>
                        </Link>
                    </div>
                </motion.div>

                {/* Optional Right Column (empty or visual later) */}
                <div></div>
            </div>
        </section>
    );
}


























