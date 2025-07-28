'use client';

import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/videos/hero.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/70 via-emerald-300/60 to-blue-500/70"></div>

            {/* White Brightness Tint */}
            <div className="absolute inset-0 bg-white/20"></div>

            {/* Optional Hexagonal Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                    <defs>
                        <pattern id="hexPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                            <polygon
                                points="30,2 50,15 50,35 30,48 10,35 10,15"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="0.5"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hexPattern)" />
                </svg>
            </div>

            {/* Hero Content with Glass Effect */}
            <div className="container mx-auto px-4 z-10 max-w-4xl">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg px-8 py-10 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full text-sm text-gray-700 mb-6">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        Trusted by 500+ sustainability leaders worldwide
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
                        Transform Data Into{' '}
                        <span className="text-emerald-600">Sustainable Impact</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg md:text-xl mb-8 text-gray-800 leading-relaxed">
                        Harness the power of 90,000+ sustainability data points to drive
                        meaningful change and stay ahead in the evolving ESG landscape.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Link
                            href="/reports"
                            className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Explore Reports →
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-white/80 text-gray-900 px-6 py-3 rounded-full text-lg font-semibold hover:bg-white transition-all shadow-lg hover:shadow-xl"
                        >
                            Book Discovery Call
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-900">
                        <div>
                            <div className="text-2xl font-bold">90K+</div>
                            <div className="text-sm">Data Points</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">500+</div>
                            <div className="text-sm">Global Clients</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">15+</div>
                            <div className="text-sm">Years Experience</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">24/7</div>
                            <div className="text-sm">Expert Support</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}



