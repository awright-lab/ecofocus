'use client';
import { useState } from 'react';
import { Mail } from 'lucide-react';


export default function SubscribeStrip() {
const [ok, setOk] = useState(false);
return (
<section className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white p-6 shadow-md">
<div className="relative z-10 max-w-3xl">
<h3 className="text-xl font-semibold">Get EcoFocus insights in your inbox</h3>
<p className="text-white/90 text-sm mt-1">Short, actionable articles that help teams ship sustainable growth.</p>
{!ok ? (
<form name="blog-subscribe" data-netlify="true" method="POST" className="mt-4 flex gap-2" onSubmit={() => setOk(true)}>
<input type="hidden" name="form-name" value="blog-subscribe" />
<input name="email" required type="email" placeholder="you@company.com"
className="w-full rounded-full px-4 py-2.5 text-gray-900 placeholder:text-gray-500 focus:outline-none"/>
<button className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-white ring-1 ring-white/30 hover:bg-white/20">
<Mail className="h-4 w-4"/> Subscribe
</button>
</form>
) : (
<p className="mt-3 text-sm">Thanks! Please check your inbox.</p>
)}
</div>
<div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.5),_transparent_60%)]"/>
</section>
);
}