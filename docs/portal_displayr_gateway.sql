-- Optional pilot setup. Not applied automatically; feature stays disabled.
-- Only the server service role may call this function. It receives claims
-- from a token already verified by Supabase Auth, never browser claims.
begin;
create schema if not exists displayr_private;
revoke all on schema displayr_private from public, anon, authenticated;
grant usage on schema displayr_private to service_role;
create or replace function displayr_private.gateway_access(
  p_auth_user_id uuid, p_session_id uuid, p_company_id text, p_dashboard_slug text
) returns jsonb
language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object('user_id', u.id, 'displayr_embed_url', cfg.displayr_embed_url)
  from auth.users a
  join auth.sessions sess on sess.user_id = a.id and sess.id = p_session_id
  join public.portal_users u on lower(u.email) = lower(a.email) and u.status = 'active'
  join public.portal_companies c on c.id = p_company_id
  join public.portal_subscriptions sub on sub.id = c.subscription_id and sub.status in ('active', 'trialing')
  join public.portal_dashboard_entitlements ent on ent.company_id = c.id
  join public.portal_dashboards d on d.id = ent.dashboard_id and d.slug = p_dashboard_slug and d.is_hidden = false
  join public.portal_dashboard_configs cfg on cfg.company_id = c.id and cfg.dashboard_slug = d.slug and cfg.is_active = true and cfg.is_hidden = false
  where a.id = p_auth_user_id and a.deleted_at is null
    and (a.banned_until is null or a.banned_until <= now())
    and (sess.not_after is null or sess.not_after > now())
    and (u.company_id = c.id or exists (
      select 1 from public.portal_workspace_memberships m
      where m.user_id = u.id and m.workspace_company_id = c.id and m.visibility_scope = 'full'
    ))
$$;
revoke all on function displayr_private.gateway_access(uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function displayr_private.gateway_access(uuid, uuid, text, text) to service_role;
create or replace function public.portal_displayr_gateway_access(
  p_auth_user_id uuid, p_session_id uuid, p_company_id text, p_dashboard_slug text
) returns jsonb language sql stable security invoker set search_path = ''
as $$ select displayr_private.gateway_access(p_auth_user_id, p_session_id, p_company_id, p_dashboard_slug) $$;
revoke all on function public.portal_displayr_gateway_access(uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function public.portal_displayr_gateway_access(uuid, uuid, text, text) to service_role;
commit;
