'use client';

import React from 'react';

export function ConsultSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-50 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      {/* sheet */}
      <div
        className={`absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 shadow-2xl transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-200" />
        <h3 className="mt-3 text-base font-semibold">Request a Consultation</h3>
        <form className="mt-3 grid gap-3">
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Name" />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Email" type="email" />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Company" />
          <textarea className="min-h-[88px] rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="What are you trying to accomplish?" />
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="w-1/2 rounded-lg border border-slate-300 py-2 text-sm font-medium">Cancel</button>
            <button type="submit" className="w-1/2 rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}