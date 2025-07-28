'use client';

import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
                <source src="/hero.mp4" type="video/mp4" />
            </video>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/70 via-teal-500/60 to-blue-600/70"></div>

            {/* Accent Shape */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-emerald-500 to-blue-500 transform -skew-y-6 opacity-40"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                    Sustainability Insights That Drive <span className="text-cyan-200">Growth</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8">
                    Data-backed research to guide your strategy since 2010.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/reports"
                        className="bg-white text-emerald-700 px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-transform hover:scale-105"
                    >
                        View Reports
                    </Link>
                    <Link
                        href="/solutions"
                        className="bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-700 transition-transform hover:scale-105"
                    >
                        Explore Solutions
                    </Link>
                </div>
            </div>
        </section>
    );
}






