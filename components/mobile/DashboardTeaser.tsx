'use client';

import React from 'react';

export function DashboardTeaser() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br from-teal-200 to-cyan-200" />
        <div>
          <h3 className="text-base font-semibold">Interactive Dashboard</h3>
          <p className="mt-1 text-sm text-slate-600">
            Explore 90k+ data points with instant crosstabs and filters.
          </p>
        </div>
      </div>
      <div className="mt-3 h-28 w-full rounded-lg bg-slate-100" />
      <a
        href="https://demo.ecofocusworldwide.com/Dashboard-Demo"
        className="mt-3 inline-block rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
      >
        View Dashboard Demo
      </a>
    </div>
  );
}