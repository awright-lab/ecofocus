-- portal_usage_allowances
-- Stores company-level dashboard hour allowances and current usage totals.

create extension if not exists pgcrypto;

create table if not exists public.portal_usage_allowances (
  company_id text primary key references public.portal_companies(id) on delete cascade,
  annual_hours_limit integer not null check (annual_hours_limit >= 0),
  hours_used integer not null default 0 check (hours_used >= 0),
  period_start date,
  period_end date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portal_usage_allowances_period_idx
  on public.portal_usage_allowances (period_end);

alter table public.portal_usage_allowances enable row level security;

alter table public.portal_usage_allowances
  alter column period_start drop not null,
  alter column period_end drop not null;

comment on table public.portal_usage_allowances is
  'Subscriber-account dashboard hour allowances for the EcoFocus portal. These are the billing-side allowances, not shared workspace totals.';

create or replace function public.set_portal_usage_allowances_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portal_usage_allowances_set_updated_at on public.portal_usage_allowances;
create trigger portal_usage_allowances_set_updated_at
before update on public.portal_usage_allowances
for each row
execute function public.set_portal_usage_allowances_updated_at();

insert into public.portal_usage_allowances (
  company_id,
  annual_hours_limit,
  hours_used,
  period_start,
  period_end
)
values
  ('company-greenloop', 120, 92, '2026-01-01', '2026-12-31')
on conflict (company_id) do update
set
  annual_hours_limit = excluded.annual_hours_limit,
  hours_used = excluded.hours_used,
  period_start = excluded.period_start,
  period_end = excluded.period_end,
  updated_at = now();
