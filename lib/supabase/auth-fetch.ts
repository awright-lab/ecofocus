// Share only a retry deadline between tabs, never tokens or response bodies.
export function createAuthFetch({ origin, send = fetch, now = Date.now, storage }: {
  origin: string; send?: typeof fetch; now?: () => number;
  storage?: Pick<Storage, 'getItem' | 'setItem'>;
}): typeof fetch {
  const key = `ecofocus-auth-cooldown:${origin}`;
  let deadline = 0;
  return async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
    const method = init?.method || (input instanceof Request ? input.method : 'GET');
    const limited = url.origin === origin && url.pathname === '/auth/v1/token' && method.toUpperCase() === 'POST';
    if (!limited) return send(input, init);
    try {
      const stored = Number(storage?.getItem(key));
      if (Number.isFinite(stored) && stored <= now() + 3_600_000) deadline = Math.max(deadline, stored);
    } catch { /* Storage can be unavailable; retain the in-memory cooldown. */ }
    if (deadline > now()) return new Response(JSON.stringify({ code: 'over_request_rate_limit', msg: 'Too many sign-in attempts. Close other portal tabs and try again shortly.' }), {
      status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(Math.ceil((deadline - now()) / 1000)) },
    });
    const response = await send(input, init);
    if (response.status === 429) {
      const retry = response.headers.get('retry-after');
      const seconds = retry && /^\d+$/.test(retry) ? Number(retry) : retry ? (Date.parse(retry) - now()) / 1000 : 60;
      deadline = now() + Math.min(3600, Math.max(60, Number.isFinite(seconds) ? seconds : 60)) * 1000;
      try { storage?.setItem(key, String(deadline)); } catch { /* Memory fallback. */ }
    }
    return response;
  };
}
