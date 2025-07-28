'use client';

import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center bg-gray-50 overflow-hidden">
            {/* Video Background */}
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            {/* White Overlay */}
            <div className="absolute inset-0 bg-white/60"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-3xl mx-auto animate-fadeIn">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
                    Sustainability Insights That Drive Business Growth
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                    Data-backed research to guide your strategy since 2010.
                </p>
                <Link
                    href="/reports"
                    className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105"
                >
                    View Reports
                </Link>
            </div>
        </section>
    );
}





