-- portal_dashboard_entitlements
-- Stores workspace-level dashboard assignment independently from private embed
-- configuration so companies can be provisioned before each dashboard URL is live.

create extension if not exists pgcrypto;

create table if not exists public.portal_dashboard_entitlements (
  id uuid primary key default gen_random_uuid(),
  company_id text not null references public.portal_companies(id) on delete cascade,
  dashboard_id text not null references public.portal_dashboards(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  assigned_by_user_id text references public.portal_users(id) on delete set null,
  notes text,
  unique (company_id, dashboard_id)
);

create index if not exists portal_dashboard_entitlements_company_idx
  on public.portal_dashboard_entitlements (company_id, assigned_at desc);

create index if not exists portal_dashboard_entitlements_dashboard_idx
  on public.portal_dashboard_entitlements (dashboard_id, assigned_at desc);

alter table public.portal_dashboard_entitlements enable row level security;

comment on table public.portal_dashboard_entitlements is
  'Private workspace-level dashboard assignments for the EcoFocus portal.';

comment on column public.portal_dashboard_entitlements.company_id is
  'Workspace that should see the dashboard in the portal.';

comment on column public.portal_dashboard_entitlements.dashboard_id is
  'Shared dashboard catalog entry assigned to the workspace.';

insert into public.portal_dashboard_entitlements (
  company_id,
  dashboard_id,
  assigned_by_user_id,
  notes
)
values
  ('company-greenloop', 'dashboard-eco-iq', 'user-sam', 'Seeded entitlement for GreenLoop Foods.'),
  ('company-greenloop', 'dashboard-category', 'user-sam', 'Seeded entitlement for GreenLoop Foods.'),
  ('company-greenloop', 'dashboard-2024-interactive', 'user-sam', 'Seeded entitlement for GreenLoop Foods.'),
  ('company-ecofocus', 'dashboard-eco-iq', 'user-sam', 'Seeded internal entitlement.'),
  ('company-ecofocus', 'dashboard-category', 'user-sam', 'Seeded internal entitlement.'),
  ('company-ecofocus', 'dashboard-2024-interactive', 'user-sam', 'Seeded internal entitlement.'),
  ('company-ecofocus', 'dashboard-export', 'user-sam', 'Seeded internal entitlement.'),
  ('company-ecofocus', 'dashboard-custom', 'user-sam', 'Seeded internal entitlement.')
on conflict (company_id, dashboard_id) do update
set
  assigned_by_user_id = excluded.assigned_by_user_id,
  notes = excluded.notes;
