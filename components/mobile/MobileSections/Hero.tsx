'use client';

export default function Hero() {
    return (
        <section
            className="h-[450px] bg-cover bg-center flex flex-col justify-center px-6 text-white"
            style={{ backgroundImage: "url('/images/desktop-hero.jpg')" }} // Replace with actual path
        >
            <h2 className="text-3xl font-bold mb-3 max-w-[90%]">
                Sustainability Insights That Drive Growth
            </h2>
            <p className="mb-6 text-sm max-w-[85%]">
                Data-backed research to guide sustainability decisions since 2010.
            </p>
            <button className="bg-green-600 px-6 py-3 rounded-full font-semibold">
                Explore Reports
            </button>
        </section>
    );
}







  