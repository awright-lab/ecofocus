'use client';

import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
                {/* Gradients */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-lg transform rotate-12 blur-sm"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-lg transform -rotate-12 blur-sm"></div>
                    <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 rounded-lg transform rotate-45 blur-sm"></div>
                    <div className="absolute bottom-20 right-40 w-28 h-28 bg-gradient-to-br from-teal-400/20 to-teal-600/20 rounded-lg transform -rotate-45 blur-sm"></div>
                </div>
                {/* Hex Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                        <defs>
                            <pattern id="hexPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                                <polygon points="30,2 50,15 50,35 30,48 10,35 10,15" fill="none" stroke="#3E7C59" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hexPattern)" />
                    </svg>
                </div>
            </div>

            <div className="container mx-auto px-4 z-10 text-center max-w-5xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600 mb-6">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    Trusted by 500+ sustainability leaders worldwide
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-900 via-emerald-800 to-blue-900 bg-clip-text text-transparent">
                    Transform Data Into
                    <br />
                    <span className="text-emerald-600">Sustainable Impact</span>
                </h1>

                <p className="text-xl md:text-2xl mb-10 text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Harness the power of 90,000+ sustainability data points to drive meaningful change and stay ahead in the evolving ESG landscape
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Link href="/reports" className="group bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                        Explore Reports <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                    <Link href="/contact" className="group bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:border-emerald-300 transition-all shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">
                        Book Discovery Call <i className="ri-calendar-line group-hover:scale-110 transition-transform"></i>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600 mb-2">90K+</div>
                        <div className="text-sm text-gray-600">Data Points</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                        <div className="text-sm text-gray-600">Global Clients</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-cyan-600 mb-2">15+</div>
                        <div className="text-sm text-gray-600">Years Experience</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-teal-600 mb-2">24/7</div>
                        <div className="text-sm text-gray-600">Expert Support</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
