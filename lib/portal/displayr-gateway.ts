import { getServiceSupabase } from '@/lib/supabase/server';
import { getDisplayrGatewayOrigin, isDisplayrGatewayPilotUser } from './displayr-gateway-config';
import { DisplayrGatewayError, controlFailureCode } from './displayr-gateway-diagnostics';

function denyAuthorization(stage: string) {
  console.warn('[displayr-gateway] authorization denied', { stage });
  return null;
}

export type GatewayScope = { accessToken: string; companyId: string; dashboardSlug: string };

export async function authorizeDisplayrGateway(scope: GatewayScope) {
  if (process.env.DISPLAYR_GATEWAY_ENABLED !== 'true') return denyAuthorization('pilot_disabled');
  const admin = getServiceSupabase();
  // Decode claims only after Auth has verified this exact token.
  const { data: auth, error: authError } = await admin.auth.getUser(scope.accessToken);
  if (authError || !auth.user) return denyAuthorization('auth_user');
  const parts = scope.accessToken.split('.');
  if (parts.length !== 3) return denyAuthorization('token_format');
  const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  if (claims.sub !== auth.user.id || typeof claims.session_id !== 'string' || !Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()) return denyAuthorization('session_claims');
  const { data, error } = await admin.rpc('portal_displayr_gateway_access', {
    p_auth_user_id: auth.user.id, p_session_id: claims.session_id,
    p_company_id: scope.companyId, p_dashboard_slug: scope.dashboardSlug,
  });
  if (error) return denyAuthorization('database_rpc');
  if (!data) return denyAuthorization('database_entitlement_or_session');
  if (!isDisplayrGatewayPilotUser(data.user_id)) return denyAuthorization('pilot_user');
  // Explicitly selected isolated copy. Still requires the real source
  // dashboard entitlement above; never changes the live dashboard mapping.
  if (process.env.DISPLAYR_GATEWAY_USE_PRIVATE_TEST_COPY === 'true') {
    if (data.user_id !== 'user-arif' || scope.companyId !== 'company-ecofocus' || scope.dashboardSlug !== 'interactive-dashboard-2024') return denyAuthorization('private_copy_scope');
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
  let decision;
  try { decision = await authorizeDisplayrGateway(scope); }
  catch { throw new DisplayrGatewayError('AUTHORIZATION_UNAVAILABLE'); }
  if (!decision || decision.userId !== expectedUserId) throw new DisplayrGatewayError('AUTHORIZATION_DENIED');
  const publicOrigin = getDisplayrGatewayOrigin();
  if (!publicOrigin) throw new DisplayrGatewayError('PUBLIC_ORIGIN_INVALID');
  const secret = process.env.DISPLAYR_CONTROL_SECRET;
  if (!secret || secret.length < 32) throw new DisplayrGatewayError('CONTROL_SECRET_MISSING');
  let control;
  try { control = new URL(process.env.DISPLAYR_GATEWAY_CONTROL_ORIGIN || ''); }
  catch { throw new DisplayrGatewayError('CONTROL_ORIGIN_INVALID'); }
  const local = ['localhost', '127.0.0.1'].includes(control.hostname);
  if ((control.protocol !== 'https:' && !(local && control.protocol === 'http:')) ||
      control.username || control.password || control.pathname !== '/' || control.search || control.hash) throw new DisplayrGatewayError('CONTROL_ORIGIN_INVALID');
  const controlPath = control.origin === publicOrigin ? '/__control/launch' : '/launch';
  let response;
  try { response = await fetch(new URL(controlPath, control), {
    method: 'POST', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(10_000),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` }, body: JSON.stringify(scope),
  }); } catch { throw new DisplayrGatewayError('CONTROL_REQUEST_FAILED'); }
  if (!response.ok) throw new DisplayrGatewayError(controlFailureCode(response.status));
  let result;
  try { result = await response.json(); }
  catch { throw new DisplayrGatewayError('CONTROL_RESPONSE_INVALID'); }
  if (!result || typeof result.launchPath !== 'string' || !/^\/__gateway\/launch\?ticket=[A-Za-z0-9_-]{43}$/.test(result.launchPath)) throw new DisplayrGatewayError('CONTROL_RESPONSE_INVALID');
  return new URL(result.launchPath, publicOrigin);
}
