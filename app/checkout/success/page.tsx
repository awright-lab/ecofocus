import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Success() {
  return (
    <>
      <Header />
      <main id="main" className="pt-14 md:pt-20">
        <section className="container mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold md:text-3xl">Thank you!</h1>
          <p className="mt-2 text-gray-700">Your order was successful. A receipt was sent to your email.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
