'use client';

import { usePathname } from 'next/navigation';
import useIsMobile from '@/app/hooks/useIsMobile';
import MobileHome from '@/components/mobile/MobileHome';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile();
    const pathname = usePathname();

    if (isMobile && pathname === '/') {
        return <MobileHome />;
    }

    return <>{children}</>;
}
