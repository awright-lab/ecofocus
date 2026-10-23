export default function FreeGateButton({ fileHref }: { fileHref?: string }) {
  if (!fileHref) return <p className="text-sm text-slate-600">Download coming soon. Please contact us for availability.</p>;
  return <a href={fileHref} className="inline-flex rounded-full bg-[#EF9601] px-6 py-3 font-semibold text-slate-950 hover:bg-amber-300">Download free report</a>;
}
