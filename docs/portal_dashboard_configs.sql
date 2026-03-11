-- portal_dashboard_configs
-- Stores private company-scoped dashboard embed configuration.
-- Use this instead of per-client environment variables so client onboarding
-- can happen at runtime without a redeploy.

create extension if not exists pgcrypto;

create table if not exists public.portal_dashboard_configs (
  id uuid primary key default gen_random_uuid(),
  company_id text not null,
  dashboard_slug text not null,
  displayr_embed_url text not null,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, dashboard_slug)
);

create index if not exists portal_dashboard_configs_company_slug_idx
  on public.portal_dashboard_configs (company_id, dashboard_slug);

create index if not exists portal_dashboard_configs_active_idx
  on public.portal_dashboard_configs (company_id, is_active);

alter table public.portal_dashboard_configs enable row level security;

-- No direct authenticated client access yet. Reads and writes should happen
-- through server-side portal provisioning and dashboard-rendering code.

comment on table public.portal_dashboard_configs is
  'Private company-scoped dashboard embed configuration for the EcoFocus portal.';

comment on column public.portal_dashboard_configs.company_id is
  'Portal company/account identifier. One company can have multiple dashboard slugs configured.';

comment on column public.portal_dashboard_configs.dashboard_slug is
  'Portal dashboard slug, e.g. interactive-dashboard-2024.';

comment on column public.portal_dashboard_configs.displayr_embed_url is
  'Private published dashboard URL stored server-side and never exposed as public app config.';

comment on column public.portal_dashboard_configs.is_active is
  'Inactive configs are retained for audit/history but should not be rendered to portal users.';

create or replace function public.set_portal_dashboard_configs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portal_dashboard_configs_set_updated_at
  on public.portal_dashboard_configs;

create trigger portal_dashboard_configs_set_updated_at
before update on public.portal_dashboard_configs
for each row
execute function public.set_portal_dashboard_configs_updated_at();

insert into public.portal_dashboard_configs (
  company_id,
  dashboard_slug,
  displayr_embed_url,
  is_active,
  notes
)
values (
  'company-greenloop',
  'interactive-dashboard-2024',
  'https://app.displayr.com/Dashboard?id=30c7a295-fba4-4245-8e79-9474a78687bb#page=9ab3c9b1-4fdf-4037-8124-5c09fc5e8099',
  true,
  'Seeded GreenLoop Foods 2024 interactive dashboard URL.'
)
on conflict (company_id, dashboard_slug)
do update
set
  displayr_embed_url = excluded.displayr_embed_url,
  is_active = excluded.is_active,
  notes = excluded.notes,
  updated_at = now();
