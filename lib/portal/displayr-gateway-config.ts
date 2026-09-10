// Edge-safe configuration; never import server credentials into middleware.
export function isDisplayrGatewayPilotUser(userId: string) {
  return Boolean(userId) && process.env.DISPLAYR_GATEWAY_ENABLED === 'true' &&
    (process.env.DISPLAYR_GATEWAY_PILOT_USER_IDS || '').split(',').map(value => value.trim()).includes(userId);
}

export function getDisplayrGatewayOrigin() {
  try {
    const url = new URL(process.env.DISPLAYR_GATEWAY_PUBLIC_ORIGIN || '');
    const local = process.env.NODE_ENV !== 'production' && ['127.0.0.1', 'localhost'].includes(url.hostname);
    if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:')) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) return null;
    return url.origin;
  } catch { return null; }
}
