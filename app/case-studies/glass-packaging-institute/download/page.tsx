import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = { title: 'Download the GPI Case Study', robots: { index: false, follow: false } };

export default async function DownloadGpi({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <><Header /><main id="main" className="mx-auto max-w-2xl px-6 pb-20 pt-32">
    <p className="text-sm font-semibold text-emerald-700">Glass Packaging Institute · Case Study 2026</p>
    <h1 className="mt-4 text-4xl font-bold text-slate-900">Download the GPI case study</h1>
    <p className="mt-4 text-slate-600">Enter your name and email to download the six-page PDF. You can also <Link className="underline" href="/case-studies/glass-packaging-institute#case-study">read it online without a form</Link>.</p>
    {error && <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-red-800">{error === 'invalid' ? 'Please enter your first name, last name, and a valid email address.' : 'We couldn’t prepare your download. Please try again, or contact us for a copy.'}</p>}
    <form action="/api/case-studies/gpi/download" method="post" className="mt-8 grid gap-5">
      <label className="grid gap-2 font-medium">First name<input name="firstname" autoComplete="given-name" required maxLength={80} className="rounded-lg border border-slate-300 p-3" /></label>
      <label className="grid gap-2 font-medium">Last name<input name="lastname" autoComplete="family-name" required maxLength={80} className="rounded-lg border border-slate-300 p-3" /></label>
      <label className="grid gap-2 font-medium">Email<input name="email" type="email" autoComplete="email" required maxLength={254} className="rounded-lg border border-slate-300 p-3" /></label>
      <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p className="text-sm text-slate-600">EcoFocus will store your details and this download request in a private download log. This does not subscribe you to marketing emails. See our <Link href="/legal" className="underline">privacy policy</Link>.</p>
      <button className="btn-primary-emerald justify-center" type="submit">Download PDF</button>
    </form>
  </main><Footer /></>;
}
