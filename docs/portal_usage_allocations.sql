-- portal_usage_allocations
-- Stores per-user hour allocations so client admins can assign usage limits.

create extension if not exists pgcrypto;

create table if not exists public.portal_usage_allocations (
  company_id text not null references public.portal_companies(id) on delete cascade,
  user_id text not null references public.portal_users(id) on delete cascade,
  allocated_hours integer not null default 0 check (allocated_hours >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (company_id, user_id)
);

create index if not exists portal_usage_allocations_user_idx
  on public.portal_usage_allocations (user_id);

alter table public.portal_usage_allocations enable row level security;

comment on table public.portal_usage_allocations is
  'Per-user dashboard hour allocations for client-admin managed usage limits.';

comment on column public.portal_usage_allocations.allocated_hours is
  'Assigned hours for a specific user within the workspace allowance window.';

create or replace function public.set_portal_usage_allocations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portal_usage_allocations_set_updated_at on public.portal_usage_allocations;
create trigger portal_usage_allocations_set_updated_at
before update on public.portal_usage_allocations
for each row
execute function public.set_portal_usage_allocations_updated_at();
