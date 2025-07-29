'use client';

export default function HeroSection() {
    return (
        <div className="relative h-[480px] w-full overflow-hidden">
            {/* Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                src="/videos/hero.mp4"
                autoPlay
                muted
                loop
                playsInline
            />

            {/* Dark Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-black/70" />

            {/* Text Overlay */}
            <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
                <h2 className="text-3xl font-bold mb-3 max-w-[90%]">
                    Sustainability Insights That Drive Growth
                </h2>
                <p className="mb-6 text-sm max-w-[85%]">
                    Data-backed research to guide sustainability decisions since 2010.
                </p>
                <button className="bg-green-600 px-6 py-3 rounded-full font-semibold shadow-md">
                    Explore Reports
                </button>
            </div>
        </div>
    );
}








  