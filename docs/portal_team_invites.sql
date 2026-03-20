-- portal_team_invites
-- Stores invite activity for portal team provisioning, delivery review, and resend actions.

create extension if not exists pgcrypto;

create table if not exists public.portal_team_invites (
  id uuid primary key default gen_random_uuid(),
  company_id text not null references public.portal_companies(id) on delete cascade,
  invited_user_id text references public.portal_users(id) on delete set null,
  invited_name text not null,
  invited_email text not null,
  invited_role text not null check (invited_role in ('client_user', 'client_admin')),
  invited_by_user_id text not null references public.portal_users(id) on delete restrict,
  invite_url text not null,
  delivery_status text not null check (delivery_status in ('sent', 'manual_only', 'failed')),
  delivery_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_sent_at timestamptz
);

create index if not exists portal_team_invites_company_created_idx
  on public.portal_team_invites (company_id, created_at desc);

create index if not exists portal_team_invites_email_created_idx
  on public.portal_team_invites (lower(invited_email), created_at desc);

alter table public.portal_team_invites enable row level security;

comment on table public.portal_team_invites is
  'Invite activity log for EcoFocus portal team provisioning and email delivery review.';

create or replace function public.set_portal_team_invites_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portal_team_invites_set_updated_at on public.portal_team_invites;
create trigger portal_team_invites_set_updated_at
before update on public.portal_team_invites
for each row
execute function public.set_portal_team_invites_updated_at();
