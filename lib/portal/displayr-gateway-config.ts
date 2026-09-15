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

// Separate opt-in for the isolated private copy; ordinary entitlements still apply.
export function isDisplayrPrivateTestUser(userId: string) {
  const ids = process.env.DISPLAYR_GATEWAY_PRIVATE_TEST_USER_IDS ?? 'user-arif';
  return isDisplayrGatewayPilotUser(userId) && ids.split(',').map(value => value.trim()).includes(userId);
}

export function isDisplayrPrivateTestScope(userId: string, companyId: string, dashboardSlug: string) {
  if (!isDisplayrPrivateTestUser(userId)) return false;
  if (userId === 'user-arif' && companyId === 'company-ecofocus' && dashboardSlug === 'interactive-dashboard-2024') return true;
  try {
    const scopes: unknown = JSON.parse(process.env.DISPLAYR_GATEWAY_PRIVATE_TEST_SCOPES_JSON || '[]');
    return Array.isArray(scopes) && scopes.some(scope => scope &&
      scope.userId === userId && scope.companyId === companyId && scope.dashboardSlug === dashboardSlug);
  } catch { return false; }
}
