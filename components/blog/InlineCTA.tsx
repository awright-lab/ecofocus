'use client';
import Link from 'next/link';
import { ArrowRight, FileBarChart, ShoppingCart, MonitorPlay } from 'lucide-react';


export type InlineCTAProps = {
variant: 'demo' | 'sample' | 'report';
title?: string; sub?: string; href?: string;
};


const MAP = {
demo: { icon: MonitorPlay, label: 'Request a Demo', defaultHref: '/contact?type=demo' },
sample: { icon: FileBarChart, label: 'Download Sample', defaultHref: '/reports/sustainability-insights' },
report: { icon: ShoppingCart, label: 'Buy the Report', defaultHref: '/reports' },
};


export default function InlineCTA({ variant, title, sub, href }: InlineCTAProps) {
const C = MAP[variant];
const Icon = C.icon;
return (
<aside className="my-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
<div className="flex items-start gap-4">
<div className="rounded-xl bg-white p-3 ring-1 ring-emerald-200 shadow-sm"><Icon className="h-6 w-6 text-emerald-700"/></div>
<div className="flex-1">
<h4 className="font-semibold text-gray-900">{title || C.label}</h4>
{sub && <p className="text-sm text-gray-600 mt-1">{sub}</p>}
<Link href={href || C.defaultHref} className="mt-3 inline-flex items-center gap-1 text-emerald-700 font-medium">
{C.label} <ArrowRight className="h-4 w-4"/>
</Link>
</div>
</div>
</aside>
);
}