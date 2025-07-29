'use client';

const partners = [
    '/images/partners/logo1.png',
    '/images/partners/logo2.png',
    '/images/partners/logo3.png',
    '/images/partners/logo4.png'
]; // Replace with actual logos

export default function PartnersSection() {
    return (
        <section className="p-6">
            <h2 className="text-xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <div className="flex space-x-6 overflow-x-auto no-scrollbar">
                {partners.map((logo, i) => (
                    <img key={i} src={logo} alt={`Partner ${i + 1}`} className="h-10 object-contain" />
                ))}
            </div>
        </section>
    );
}
