'use client';

import Link from 'next/link';

export default function StickyButtons() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 md:hidden">
      <Link href="/reports" className="bg-[#4AAE8C] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#3E7C59] transition-colors text-center whitespace-nowrap cursor-pointer">
        Buy Report
      </Link>
      <Link href="/contact" className="bg-[#3E7C59] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#4AAE8C] transition-colors text-center whitespace-nowrap cursor-pointer">
        Subscribe
      </Link>
    </div>
  );
}