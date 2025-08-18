// app/checkout/success/page.tsx
export default function Success() {
    return (
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-2xl md:text-3xl font-bold">Thank you!</h1>
        <p className="mt-2 text-gray-700">
          Your order was successful. A receipt was sent to your email.
        </p>
      </section>
    );
  }