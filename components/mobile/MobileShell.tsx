'use client';

import React, { ReactNode, useState } from 'react';
import { BottomNav } from '@/components/mobile/BottomNav';
import { Plus } from 'lucide-react';
import { ConsultSheet } from '@/components/mobile/ConsultSheet';

export function MobileShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-white">
      {/* Scroll container with snap */}
      <main className="h-full snap-y snap-mandatory overflow-y-auto">
        {children}
      </main>

      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Request a consultation"
        className="fixed bottom-20 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-white shadow-xl"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Bottom Navigation */}
      <BottomNav items={[
        { href: '#hero', label: 'Home', icon: 'home' },
        { href: '#solutions', label: 'Solutions', icon: 'layers' },
        { href: '#report', label: 'Reports', icon: 'book' },
        { href: '#insights', label: 'Insights', icon: 'sparkles' },
        { href: '/contact', label: 'Contact', icon: 'phone' },
      ]} />

      <ConsultSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}