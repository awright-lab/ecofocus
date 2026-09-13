"use client";

import { useEffect, useRef, useState } from "react";

// A separate iframe exchanges an opaque, one-use ticket using the same cookie
// partition as the viewer. The report iframe and its unsaved state stay intact.
export function DisplayrSessionRenewal({ origin, dashboardSlug, ready }: {
  origin: string; dashboardSlug: string; ready: boolean;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [url, setUrl] = useState<string>();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!ready) return;
    let stopped = false;
    let busy = false;
    let lastSuccess = 0;
    let timer: ReturnType<typeof setTimeout>;
    let timeout: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    const schedule = (delay: number) => { clearTimeout(timer); timer = setTimeout(renew, delay); };
    const fail = () => {
      if (stopped) return;
      busy = false;
      setFailed(true);
      schedule(60_000);
    };
    async function renew() {
      if (stopped || busy) return;
      busy = true;
      try {
        const response = await fetch('/api/portal/displayr/renew', {
          method: 'POST', credentials: 'same-origin', cache: 'no-store', redirect: 'error',
          headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dashboardSlug }),
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]),
        });
        if (!response.ok) throw new Error('Renewal unavailable');
        const result = await response.json();
        const next = new URL(result.renewalUrl);
        if (next.origin !== origin || !/^\/__gateway\/renew\?ticket=[A-Za-z0-9_-]{43}$/.test(next.pathname + next.search) || next.hash) throw new Error('Invalid renewal response');
        if (stopped) return;
        timeout = setTimeout(fail, 15_000);
        setUrl(next.toString());
      } catch { fail(); }
    }
    const received = (event: MessageEvent) => {
      if (!busy || event.origin !== origin || event.source !== frame.current?.contentWindow || event.data?.type !== 'ecofocus-dashboard-renewed') return;
      clearTimeout(timeout);
      busy = false;
      lastSuccess = Date.now();
      setFailed(false);
      schedule(3 * 60_000);
    };
    const resumed = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastSuccess > 60_000) void renew();
    };
    window.addEventListener('message', received);
    document.addEventListener('visibilitychange', resumed);
    window.addEventListener('online', resumed);
    schedule(1000);
    return () => {
      stopped = true;
      controller.abort();
      clearTimeout(timer); clearTimeout(timeout);
      window.removeEventListener('message', received);
      document.removeEventListener('visibilitychange', resumed);
      window.removeEventListener('online', resumed);
    };
  }, [origin, dashboardSlug, ready]);
  return <>
    {failed ? <p role="status" className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">We couldn’t renew dashboard access. If the dashboard stops responding, reload this page to reconnect.</p> : null}
    <iframe ref={frame} src={url} title="Dashboard session renewal" hidden referrerPolicy="no-referrer" />
  </>;
}
