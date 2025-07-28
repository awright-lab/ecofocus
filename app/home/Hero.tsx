'use client';

import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/70 to-blue-500/70"></div>
            <div className="absolute inset-0 bg-white/20"></div>

            <div className="container mx-auto px-4 z-10 max-w-4xl">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg px-6 py-10 sm:px-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
                        Sustainability Insights That Drive Business Growth
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-gray-800">
                        Delivering actionable sustainability research since 2010.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Link href="/reports" className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-lg">
                            View Reports
                        </Link>
                        <Link href="/solutions" className="bg-white/80 text-gray-900 px-6 py-3 rounded-full text-lg font-semibold hover:bg-white transition-all shadow-lg">
                            Explore Solutions
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}




