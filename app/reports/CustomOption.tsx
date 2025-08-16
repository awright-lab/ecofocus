import Link from "next/link";

export default function CustomOption() {
  return (
    <section className="py-16 bg-emerald-700 text-white text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold mb-2">Need Something Custom?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Don’t see what you’re looking for? In need of something custom? Let’s
          talk through your goals and build the right solution together.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/custom"
            className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Read More
          </Link>
          <Link
            href="/contact"
            className="bg-emerald-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800"
          >
            Schedule Discovery Call
          </Link>
        </div>
      </div>
    </section>
  );
}
