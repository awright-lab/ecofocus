'use client';

export default function Newsletter() {
    return (
        <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <h3 className="text-2xl font-bold mb-4">Stay Ahead of Sustainability Trends</h3>
                <p className="text-gray-600 mb-6">Get research updates and insights delivered weekly.</p>
                <form className="flex flex-col sm:flex-row gap-4 justify-center">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="px-6 py-4 rounded-full text-gray-900 flex-1 focus:outline-none"
                    />
                    <button className="bg-emerald-600 text-white px-6 py-4 rounded-full font-semibold hover:bg-emerald-700">
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
}

