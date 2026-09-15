// Runs before hydration/analytics. URL fragments never reach middleware.
export const recoveryRedirectScript = `(() => {
  const hash = new URLSearchParams(window.location.hash.slice(1));
  if (hash.get('type') !== 'recovery') return;
  window.__portalRecovery = true;
  const hosts = ['ecofocusresearch.com', 'www.ecofocusresearch.com', 'portal.ecofocusresearch.com'];
  if (!hosts.includes(window.location.hostname)) return;
  if (window.location.hostname === 'portal.ecofocusresearch.com' && window.location.pathname === '/reset-password') return;
  const destination = new URL('https://portal.ecofocusresearch.com/reset-password');
  destination.hash = window.location.hash;
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  window.location.replace(destination.href);
})();`;
