-- Workspace-managed Displayr permissions. Browser roles have no direct access.
begin;
create table if not exists public.portal_displayr_bindings (
  company_id text not null,
  dashboard_slug text not null,
  source_url text not null,
  project_id text not null check (project_id ~ '^[1-9][0-9]{0,15}$'),
  group_ids text[] not null check (cardinality(group_ids) between 1 and 20),
  verified_by text not null,
  updated_at timestamptz not null default now(),
  primary key (company_id, dashboard_slug),
  foreign key (company_id, dashboard_slug) references public.portal_dashboard_configs(company_id, dashboard_slug) on delete cascade
);
create table if not exists public.portal_displayr_permission_sync (
  user_id text primary key,
  revision text not null,
  viewer_key text,
  status text not null check (status in ('pending','syncing','verified','needs_attention')),
  reason text,
  checked_at timestamptz,
  lease_id uuid,
  lease_until timestamptz,
  next_attempt_at timestamptz not null default now()
);
-- Keep sync rows after a portal user is deleted so the worker can remove access.
alter table public.portal_displayr_bindings enable row level security;
alter table public.portal_displayr_permission_sync enable row level security;
revoke all on public.portal_displayr_bindings, public.portal_displayr_permission_sync from public, anon, authenticated;
grant select, insert, update, delete on public.portal_displayr_bindings, public.portal_displayr_permission_sync to service_role;

create or replace function public.portal_displayr_permission_snapshot(p_user_id text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('userId', p_user_id, 'assignments', coalesce((
    select jsonb_agg(jsonb_build_object(
      'companyId', c.id, 'dashboardSlug', d.slug, 'sourceUrl', cfg.displayr_embed_url,
      'binding', case when b.project_id is null then null else jsonb_build_object(
        'sourceUrl', b.source_url, 'projectId', b.project_id, 'groupIds', b.group_ids
      ) end
    ) order by c.id, d.slug)
    from public.portal_users u
    join public.portal_companies c on u.company_id = c.id or exists (
      select 1 from public.portal_workspace_memberships m where m.user_id=u.id
        and m.workspace_company_id=c.id and m.visibility_scope='full'
    )
    join public.portal_subscriptions s on s.id=c.subscription_id and s.status in ('active','trialing')
    join public.portal_dashboard_entitlements e on e.company_id=c.id
    join public.portal_dashboards d on d.id=e.dashboard_id and d.is_hidden=false
    join public.portal_dashboard_configs cfg on cfg.company_id=c.id and cfg.dashboard_slug=d.slug
      and cfg.is_active=true and cfg.is_hidden=false
    left join public.portal_displayr_bindings b on b.company_id=c.id and b.dashboard_slug=d.slug
    where u.id=p_user_id and u.status='active'
  ), '[]'::jsonb))
$$;

-- A database lease prevents overlapping workers; changed assignments cannot steal
-- an active lease. Completion is fenced by the lease ID as well as the revision.
create or replace function public.portal_displayr_claim_permissions(p_user_id text, p_revision text, p_viewer_key text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare result uuid;
begin
  insert into public.portal_displayr_permission_sync(user_id,revision,status)
  values(p_user_id,p_revision,'pending') on conflict do nothing;
  update public.portal_displayr_permission_sync set status=case when revision=p_revision and viewer_key is not distinct from p_viewer_key and status='verified' then 'verified' else 'syncing' end, revision=p_revision, viewer_key=p_viewer_key, reason=null,
    lease_id=gen_random_uuid(), lease_until=now()+interval '5 minutes'
  where user_id=p_user_id and (lease_until is null or lease_until < now())
    and (revision<>p_revision or viewer_key is distinct from p_viewer_key or next_attempt_at<=now())
  returning lease_id into result;
  return result;
end $$;
create or replace function public.portal_displayr_finish_permissions(
  p_user_id text, p_revision text, p_lease_id uuid, p_status text, p_reason text
) returns boolean language plpgsql security definer set search_path = '' as $$
declare changed integer;
begin
  if p_status not in ('verified','needs_attention','pending') then raise exception 'Invalid status'; end if;
  update public.portal_displayr_permission_sync set status=p_status, reason=p_reason,
    checked_at=case when p_status='verified' then now() else null end,
    lease_id=null, lease_until=null,
    next_attempt_at=now()+case when p_status='verified' then interval '4 hours' else interval '2 minutes' end
  where user_id=p_user_id and revision=p_revision and lease_id=p_lease_id and lease_until>now();
  get diagnostics changed = row_count;
  return changed=1;
end $$;
revoke all on function public.portal_displayr_permission_snapshot(text), public.portal_displayr_claim_permissions(text,text,text), public.portal_displayr_finish_permissions(text,text,uuid,text,text) from public, anon, authenticated;
grant execute on function public.portal_displayr_permission_snapshot(text), public.portal_displayr_claim_permissions(text,text,text), public.portal_displayr_finish_permissions(text,text,uuid,text,text) to service_role;

-- Saving an assignment and its entitlement must be one transaction.
create or replace function public.portal_save_dashboard_assignment(
  p_company_id text, p_dashboard_slug text, p_url text, p_active boolean,
  p_hidden boolean, p_notes text, p_actor text
) returns void language plpgsql security definer set search_path = '' as $$
declare dashboard text;
begin
  select id into strict dashboard from public.portal_dashboards where slug=p_dashboard_slug;
  perform 1 from public.portal_companies where id=p_company_id;
  if not found then raise exception 'Unknown workspace'; end if;
  insert into public.portal_dashboard_configs(company_id,dashboard_slug,displayr_embed_url,is_active,is_hidden,notes)
  values(p_company_id,p_dashboard_slug,p_url,p_active,p_hidden,p_notes)
  on conflict(company_id,dashboard_slug) do update set displayr_embed_url=excluded.displayr_embed_url,
    is_active=excluded.is_active,is_hidden=excluded.is_hidden,notes=excluded.notes,updated_at=now();
  if p_active and not p_hidden then
    insert into public.portal_dashboard_entitlements(company_id,dashboard_id,assigned_by_user_id)
    values(p_company_id,dashboard,p_actor) on conflict(company_id,dashboard_id) do nothing;
  else
    delete from public.portal_dashboard_entitlements where company_id=p_company_id and dashboard_id=dashboard;
  end if;
end $$;
revoke all on function public.portal_save_dashboard_assignment(text,text,text,boolean,boolean,text,text) from public,anon,authenticated;
grant execute on function public.portal_save_dashboard_assignment(text,text,text,boolean,boolean,text,text) to service_role;

commit;
