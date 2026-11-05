"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";

function Magnifier() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" /><path d="m16 16 5 5M8 10.5h5m-2.5-2.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

export default function CoverZoom({ src, title }: { src: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const headingId = useId();

  useEffect(() => { setReady(true); }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  function show() {
    setZoomed(false);
    dialog.current?.showModal();
    setOpen(true);
  }
  function toggleZoom() {
    setZoomed(value => !value);
    if (viewport.current) viewport.current.scrollTo(0, 0);
  }
  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!zoomed || event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, top: event.currentTarget.scrollTop };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    event.currentTarget.scrollLeft = drag.current.left + drag.current.x - event.clientX;
    event.currentTarget.scrollTop = drag.current.top + drag.current.y - event.clientY;
  }

  const image = (expanded = false) => <Image src={src} alt={`${title} cover`} width={1319} height={1864}
    sizes={expanded ? "1100px" : "(min-width: 1024px) 360px, (min-width: 768px) 280px, 260px"}
    className={expanded ? zoomed ? "h-auto w-[1100px] max-w-none select-none" : "mx-auto h-auto max-h-[68dvh] w-auto max-w-full" : "h-auto max-h-[510px] w-[260px] rounded-lg border border-slate-200 object-contain shadow-lg md:w-full md:max-w-[360px]"}
    draggable={false} priority={!expanded} />;

  return <>
    <button type="button" disabled={!ready} onClick={show} aria-label={`Zoom cover of ${title}`} aria-haspopup="dialog"
      className="group relative block cursor-zoom-in rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
      {image()}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-black/10 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
        <span className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow-lg"><Magnifier />Zoom cover</span>
      </span>
    </button>
    <dialog ref={dialog} aria-labelledby={headingId} onClose={() => { setOpen(false); setZoomed(false); drag.current = null; }}
      onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}
      className="fixed inset-0 m-auto max-h-[94dvh] w-[calc(100%_-_1rem)] max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/75">
      {open && <>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6">
          <h2 id={headingId} className="min-w-0 flex-1 text-sm font-semibold">{title}</h2>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={toggleZoom} aria-pressed={zoomed} className="rounded-full border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">{zoomed ? "Zoom out" : "Zoom in"}</button>
            <button type="button" onClick={() => dialog.current?.close()} autoFocus className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Close</button>
          </div>
        </div>
        <p className="px-4 py-2 text-xs text-slate-600 sm:px-6" role="status">{zoomed ? "Drag, scroll, or swipe to explore the cover." : "Select the cover or Zoom in to read the small print."}</p>
        <div ref={viewport} role="region" aria-label="Enlarged report cover" tabIndex={0} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}
          className={`max-h-[70dvh] overflow-auto overscroll-contain bg-slate-100 p-3 sm:p-5 ${zoomed ? "cursor-grab active:cursor-grabbing" : ""}`}>
          {zoomed ? image(true) : <button type="button" onClick={toggleZoom} aria-label="Zoom in on report cover" className="mx-auto block cursor-zoom-in">{image(true)}</button>}
        </div>
      </>}
    </dialog>
  </>;
}
