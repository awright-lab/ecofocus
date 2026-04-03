-- portal_dashboards
-- Stores the shared dashboard catalog so support admins can create, categorize,
-- and retire dashboards without redeploying the portal.

create extension if not exists pgcrypto;

create table if not exists public.portal_dashboards (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null,
  access_tag text not null,
  embed_access text not null default 'public_link' check (embed_access in ('public_link', 'displayr_login_required')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portal_dashboards_name_idx
  on public.portal_dashboards (name);

create index if not exists portal_dashboards_access_tag_idx
  on public.portal_dashboards (access_tag);

alter table public.portal_dashboards enable row level security;

comment on table public.portal_dashboards is
  'Shared dashboard catalog used by the EcoFocus portal for company assignment and admin library views.';

comment on column public.portal_dashboards.slug is
  'Stable route slug used in portal URLs and company dashboard config records.';

comment on column public.portal_dashboards.access_tag is
  'Admin-managed dashboard category label shown throughout the portal UI.';

create or replace function public.set_portal_dashboards_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portal_dashboards_set_updated_at on public.portal_dashboards;
create trigger portal_dashboards_set_updated_at
before update on public.portal_dashboards
for each row
execute function public.set_portal_dashboards_updated_at();

insert into public.portal_dashboards (
  id,
  slug,
  name,
  description,
  access_tag,
  embed_access
)
values
  (
    'dashboard-eco-iq',
    'eco-iq-overview',
    'EcoReputation™ Overview',
    'Topline sustainability perception trends, brand positioning, and audience shifts.',
    'Included',
    'public_link'
  ),
  (
    'dashboard-category',
    'category-performance',
    'Category Performance',
    'Track category-level movement, segment filters, and quarterly benchmark changes.',
    'Licensed',
    'displayr_login_required'
  ),
  (
    'dashboard-2024-interactive',
    'interactive-dashboard-2024',
    '2024 Interactive Dashboard',
    'Interactive Displayr dashboard for the 2024 study with page-level navigation, segment analysis, and export-ready views.',
    '2024 Study',
    'public_link'
  ),
  (
    'dashboard-export',
    'export-readiness',
    'Export Readiness',
    'Download-oriented dashboard shell for chart and table extraction workflows.',
    'Advanced',
    'displayr_login_required'
  ),
  (
    'dashboard-custom',
    'custom-client-study',
    'Custom Client Study',
    'Reserved for project-specific Displayr embeds and custom stakeholder views.',
    'Project',
    'displayr_login_required'
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  access_tag = excluded.access_tag,
  embed_access = excluded.embed_access,
  updated_at = now();
