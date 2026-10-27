import Image from 'next/image';
import { PSC_URL, pscLogo } from '@/lib/psc';

export default function PscMembership({ variant = 'footer' }: { variant?: 'footer' | 'about' }) {
  const isFooter = variant === 'footer';

  return (
    <a
      href={PSC_URL}
      className={`mt-6 inline-flex max-w-full flex-col items-start gap-3 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
        isFooter ? 'text-gray-300 hover:text-white' : 'text-slate-700 hover:text-emerald-700'
      }`}
    >
      <span className="inline-flex rounded bg-white p-2">
        <Image
          src={pscLogo.src}
          alt={pscLogo.alt}
          width={pscLogo.width}
          height={pscLogo.height}
          className="h-auto w-[140px]"
        />
      </span>
      <span className="max-w-[17rem] text-sm leading-relaxed">
        {isFooter ? 'Proud Member of the Pet Sustainability Coalition' : 'Learn more about the Pet Sustainability Coalition'}
      </span>
    </a>
  );
}
