import { timingSafeEqual } from 'node:crypto';
import { getServiceSupabase } from '@/lib/supabase/server';
import { getDisplayrGatewayOrigin, isDisplayrGatewayPilotUser } from './displayr-gateway-config';

export function hasDisplayrAuthorizationSecret(header: string | null) {
  const secret = process.env.DISPLAYR_AUTHORIZATION_SECRET;
  if (!secret || secret.length < 32 || !header) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export type GatewayScope = { accessToken: string; companyId: string; dashboardSlug: string };

export async function authorizeDisplayrGateway(scope: GatewayScope) {
  if (process.env.DISPLAYR_GATEWAY_ENABLED !== 'true') return null;
  const admin = getServiceSupabase();
  // Decode claims only after Auth has verified this exact token.
  const { data: auth, error: authError } = await admin.auth.getUser(scope.accessToken);
  if (authError || !auth.user) return null;
  const parts = scope.accessToken.split('.');
  if (parts.length !== 3) return null;
  const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  if (claims.sub !== auth.user.id || typeof claims.session_id !== 'string' || !Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()) return null;
  const { data, error } = await admin.rpc('portal_displayr_gateway_access', {
    p_auth_user_id: auth.user.id, p_session_id: claims.session_id,
    p_company_id: scope.companyId, p_dashboard_slug: scope.dashboardSlug,
  });
  if (error || !data || !isDisplayrGatewayPilotUser(data.user_id)) return null;
  // Explicitly selected isolated copy. Still requires the real source
  // dashboard entitlement above; never changes the live dashboard mapping.
  if (process.env.DISPLAYR_GATEWAY_USE_PRIVATE_TEST_COPY === 'true') {
    if (data.user_id !== 'user-arif' || scope.companyId !== 'company-ecofocus' || scope.dashboardSlug !== 'interactive-dashboard-2024') return null;
    return { userId: data.user_id, expiresAt: claims.exp * 1000,
      dashboardPath: '/Dashboard?project_id=1208434', documentIds: ['1208434'] };
  }
  const url = new URL(data.displayr_embed_url);
  url.hash = '';
  if (url.origin !== 'https://app.displayr.com' || url.pathname !== '/Dashboard' || url.username || url.password || [...url.searchParams.keys()].length !== 1) return null;
  const selector = url.searchParams.get('project_id') || url.searchParams.get('id');
  if (!selector || !/^[\w-]{1,100}$/.test(selector)) return null;
  // Aliases are bound to an exact published UUID verified from the report.
  // Other UUID reports need their own reviewed mapping before this pilot.
  const aliases: Record<string, string[]> = { '2e65a2ac-7e32-418f-83c1-1c3b541985ae': ['1189662'] };
  if (url.searchParams.has('id') && !aliases[selector]) return null;
  return { userId: data.user_id, expiresAt: claims.exp * 1000,
    dashboardPath: url.pathname + url.search, documentIds: aliases[selector] || [selector] };
}

export async function launchDisplayrGateway(scope: GatewayScope, expectedUserId: string) {
  const decision = await authorizeDisplayrGateway(scope);
  if (!decision || decision.userId !== expectedUserId) throw new Error('Gateway access denied');
  const publicOrigin = getDisplayrGatewayOrigin();
  const secret = process.env.DISPLAYR_CONTROL_SECRET;
  const control = new URL(process.env.DISPLAYR_GATEWAY_CONTROL_ORIGIN || '');
  const local = ['localhost', '127.0.0.1'].includes(control.hostname);
  if (!publicOrigin || !secret || secret.length < 32 ||
      (control.protocol !== 'https:' && !(local && control.protocol === 'http:')) ||
      control.username || control.password || control.pathname !== '/' || control.search || control.hash) throw new Error('Gateway configuration unavailable');
  const controlPath = control.origin === publicOrigin ? '/__control/launch' : '/launch';
  const response = await fetch(new URL(controlPath, control), {
    method: 'POST', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(10_000),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` }, body: JSON.stringify(scope),
  });
  if (!response.ok) throw new Error('Gateway launch unavailable');
  const result = await response.json();
  if (typeof result.launchPath !== 'string' || !/^\/__gateway\/launch\?ticket=[A-Za-z0-9_-]{43}$/.test(result.launchPath)) throw new Error('Invalid gateway launch');
  return new URL(result.launchPath, publicOrigin);
}
