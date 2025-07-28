'use client';

export default function TrustedBy() {
    return (
        <section className="py-12 bg-white">
            <div className="text-center max-w-6xl mx-auto px-6">
                <h3 className="text-gray-700 mb-6 font-semibold">Trusted By Industry Leaders</h3>
                <div className="flex justify-center gap-6 flex-wrap">
                    {/* Placeholder logos */}
                    <img src="/logo1.png" alt="Client Logo" className="h-10" />
                    <img src="/logo2.png" alt="Client Logo" className="h-10" />
                    <img src="/logo3.png" alt="Client Logo" className="h-10" />
                </div>
            </div>
        </section>
    );
}
