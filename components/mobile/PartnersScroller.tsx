'use client';

import Image from 'next/image';
import React from 'react';

export function PartnersScroller({ logos }: { logos: { src: string; alt: string }[] }) {
  return (
    <div className="overflow-hidden">
      <div className="flex animate-[scroll_25s_linear_infinite] gap-8">
        {[...logos, ...logos].map((l, i) => (
          <Image
            key={i}
            src={l.src}
            alt={l.alt}
            width={160}
            height={40}
            className="h-10 w-auto opacity-80 grayscale hover:opacity-100 hover:grayscale-0"
          />
        ))}
      </div>
      {/* marquee animation keyframes */}
      <style jsx>{`
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}
