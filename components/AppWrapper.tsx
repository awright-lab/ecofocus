// app/AppWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import useIsMobile from '@/app/hooks/useIsMobile';
import MobileHome from '@/components/mobile/MobileHome';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  // Don’t render until we know (prevents SSR hydration mismatch/flash)
  if (isMobile === null) return <>{children}</>;

  if (isMobile && pathname === '/') {
    return <MobileHome />;
  }
  return <>{children}</>;
}

