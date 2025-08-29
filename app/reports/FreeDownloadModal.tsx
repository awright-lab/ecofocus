// components/reports/FreeDownloadModal.tsx
'use client';

import * as React from 'react';

export default function FreeDownloadModal({
  open, onClose, report,
}:{
  open: boolean;
  onClose: ()=>void;
  report?: { id:string; title:string; fileUrl?:string };
}) {
  const [status, setStatus] = React.useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [msg, setMsg] = React.useState('');

  if (!open || !report) return null;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting'); setMsg('');

    const fd = new FormData(e.currentTarget);
    fd.set('reportId', report.id);

    try {
      const res = await fetch('/api/report-download', { method:'POST', body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStatus('success');
      setMsg('Thanks! Your download will begin shortly.');
      if (data?.url) {
        setTimeout(()=>{ window.location.href = data.url; }, 400);
      }
    } catch {
      setStatus('error');
      setMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Get “{report.title}”</h3>
          <p className="mt-1 text-sm text-gray-600">Enter your work email to receive the download.</p>
        </div>

        <form onSubmit={submit} className="p-6">
          {/* honeypot */}
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
          <div className="grid gap-3">
            <input name="name" required placeholder="Your name" className="h-11 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-emerald-600"/>
            <input name="email" required type="email" placeholder="Work email" className="h-11 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-emerald-600"/>
            <input name="company" placeholder="Company (optional)" className="h-11 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-emerald-600"/>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={status==='submitting'}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-white text-sm font-semibold shadow hover:bg-emerald-700 disabled:opacity-60"
            >
              {status==='submitting' ? 'Sending…' : 'Download'}
            </button>
            <button type="button" onClick={onClose} className="text-sm text-gray-600 hover:text-gray-900">Cancel</button>
            {msg && <p className={`text-sm ml-auto ${status==='success'?'text-emerald-700': status==='error'?'text-red-600':'text-gray-700'}`}>{msg}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
