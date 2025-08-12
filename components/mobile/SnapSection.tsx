'use client';

import React, { ReactNode } from 'react';

export function SnapSection({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="snap-start h-[100dvh] w-full">
      {children}
    </section>
  );
}