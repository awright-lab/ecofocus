// In-memory per-viewer sessions. Passwords come from a server secret provider;
// neither credentials nor upstream cookies are returned to portal browsers.
export function createSessionBroker({ authenticate, ttlMs = 10 * 60_000, cooldownMs = 60_000, now = Date.now }) {
  const sessions = new Map();
  const pending = new Map();
  const generations = new Map();
  const failures = new Map();
  const copy = cookies => cookies.map(cookie => ({ ...cookie }));
  return {
    async getCookies(userId) {
      if (typeof userId !== 'string' || !userId) throw new Error('Viewer identity required');
      const existing = sessions.get(userId);
      if (existing?.expires > now()) return copy(existing.cookies);
      if ((failures.get(userId) || 0) > now()) throw new Error('Viewer authentication temporarily unavailable');
      if (!pending.has(userId)) {
        const generation = generations.get(userId) || 0;
        const task = Promise.resolve().then(async () => {
          try {
            const cookies = await authenticate(userId);
            if (!Array.isArray(cookies) || !cookies.length) throw new Error('Viewer session unavailable');
            if ((generations.get(userId) || 0) !== generation) throw new Error('Viewer session invalidated');
            sessions.set(userId, { cookies: copy(cookies), expires: now() + ttlMs });
            failures.delete(userId);
            return cookies;
          } catch {
            failures.set(userId, now() + cooldownMs);
            throw new Error('Viewer authentication unavailable');
          } finally { pending.delete(userId); }
        });
        pending.set(userId, task);
      }
      return copy(await pending.get(userId));
    },
    invalidate(userId) {
      sessions.delete(userId);
      generations.set(userId, (generations.get(userId) || 0) + 1);
    },
    clear() {
      for (const userId of new Set([...sessions.keys(), ...pending.keys()])) this.invalidate(userId);
      failures.clear();
    },
  };
}
