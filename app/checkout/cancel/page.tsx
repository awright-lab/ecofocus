// app/checkout/cancel/page.tsx
export default function Cancel() {
    return (
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-2xl md:text-3xl font-bold">Checkout canceled</h1>
        <p className="mt-2 text-gray-700">No charges were made. You can try again anytime.</p>
      </section>
    );
  }