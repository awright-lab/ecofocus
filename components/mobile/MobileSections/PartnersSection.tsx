'use client';

import Image from 'next/image';

const partners = [
    '/images/logos/Avery Logo_Light Backgrounds.png',
    '/images/logos/CGLR-Icon.png',
    '/images/logos/clean_label.png',
    '/images/logos/duraflame-logo.png',
    '/images/logos/Site_GPI Logo 2_0.png',
    '/images/logos/thinkPARALLAX_Logos_RBW-01-bug.png'
]; // Replace with actual logos

export default function PartnersSection() {
    return (
        <section className="p-6">
            <h2 className="text-xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <div className="flex space-x-6 overflow-x-auto no-scrollbar">
                {partners.map((logo, i) => (
                    <Image key={i} src={logo} alt={`Partner ${i + 1}`} width={160} height={40} className="h-10 w-auto object-contain" />
                ))}
            </div>
        </section>
    );
}
