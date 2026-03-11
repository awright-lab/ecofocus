-- portal_usage_logs
-- Stores account-level dashboard usage events for allowance review,
-- support investigations, and future usage-based enforcement.

create extension if not exists pgcrypto;

create table if not exists public.portal_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  company_id text not null,
  dashboard_id text not null,
  dashboard_name text not null,
  event_type text not null check (
    event_type in (
      'viewer_opened',
      'allowance_exhausted',
      'allowance_override',
      'support_review_requested'
    )
  ),
  event_at timestamptz not null default now(),
  minutes_tracked integer not null default 0 check (minutes_tracked >= 0),
  source text not null default 'portal_runtime' check (
    source in ('mock', 'portal_runtime')
  ),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists portal_usage_logs_user_event_at_idx
  on public.portal_usage_logs (user_id, event_at desc);

create index if not exists portal_usage_logs_company_event_at_idx
  on public.portal_usage_logs (company_id, event_at desc);

create index if not exists portal_usage_logs_dashboard_event_at_idx
  on public.portal_usage_logs (dashboard_id, event_at desc);

create index if not exists portal_usage_logs_event_type_event_at_idx
  on public.portal_usage_logs (event_type, event_at desc);

alter table public.portal_usage_logs enable row level security;

-- No authenticated client policies yet. Writes are intended to happen
-- through the server-side service role path in /api/portal/usage.
-- Add user/company-scoped read policies later if portal users should
-- query these logs directly from Supabase.

comment on table public.portal_usage_logs is
  'Portal dashboard usage events for allowance tracking, support reviews, and audit history.';

comment on column public.portal_usage_logs.user_id is
  'Portal user identifier. Currently stored as text to support both Supabase auth IDs and mock/dev user IDs.';

comment on column public.portal_usage_logs.company_id is
  'Portal company/account identifier used for account-level support review.';

comment on column public.portal_usage_logs.metadata is
  'Reserved JSON payload for future fields like request_id, session_id, user_agent, or browser context.';
