'use client';

export default function Newsletter() {
    return (
        <section className="py-12 bg-gray-100 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Ahead of Sustainability Trends</h3>
            <p className="text-gray-600 mb-6">Subscribe for research updates and insights.</p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-6 py-4 rounded-full flex-1 focus:outline-none"
                />
                <button className="bg-emerald-600 text-white px-6 py-4 rounded-full font-semibold hover:bg-emerald-700">
                    Subscribe
                </button>
            </form>
        </section>
    );
}


