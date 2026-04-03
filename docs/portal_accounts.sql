-- portal_accounts
-- Stores private runtime portal accounts, subscriptions, and user membership.
-- This supports client-admin provisioning after purchase without a redeploy.

create extension if not exists pgcrypto;

create table if not exists public.portal_subscriptions (
  id text primary key,
  plan_name text not null,
  seats_purchased integer not null default 1 check (seats_purchased >= 0),
  seats_used integer not null default 0 check (seats_used >= 0),
  renewal_date date not null,
  status text not null check (status in ('active', 'trialing', 'past_due')),
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_companies (
  id text primary key,
  name text not null,
  subscription_id text not null references public.portal_subscriptions(id) on delete restrict,
  subscriber_type text not null default 'brand' check (subscriber_type in ('brand', 'agency', 'internal')),
  logo_url text,
  billing_contact_name text,
  billing_email text,
  stripe_customer_id text,
  allow_external_collaborators boolean not null default false,
  external_access_policy text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_users (
  id text primary key,
  name text not null,
  email text not null unique,
  company_id text not null references public.portal_companies(id) on delete cascade,
  home_company_id text not null references public.portal_companies(id) on delete cascade,
  role text not null check (role in ('client_user', 'client_admin', 'agency_user', 'agency_admin', 'external_collaborator', 'support_admin')),
  status text not null default 'active' check (status in ('active', 'invited', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portal_companies
  add column if not exists subscriber_type text not null default 'brand',
  add column if not exists logo_url text,
  add column if not exists billing_contact_name text,
  add column if not exists billing_email text,
  add column if not exists stripe_customer_id text,
  add column if not exists allow_external_collaborators boolean not null default false,
  add column if not exists external_access_policy text;

alter table public.portal_subscriptions
  add column if not exists stripe_subscription_id text;

alter table public.portal_users
  add column if not exists home_company_id text references public.portal_companies(id) on delete cascade;

update public.portal_users
set home_company_id = company_id
where home_company_id is null;

alter table public.portal_users
  alter column home_company_id set not null;

create index if not exists portal_users_email_idx
  on public.portal_users (lower(email));

create index if not exists portal_users_company_idx
  on public.portal_users (company_id, status);

alter table public.portal_subscriptions enable row level security;
alter table public.portal_companies enable row level security;
alter table public.portal_users enable row level security;

comment on table public.portal_subscriptions is
  'Private EcoFocus portal subscription records used for seat and renewal management.';

comment on table public.portal_companies is
  'Private EcoFocus portal subscriber accounts and workspace owners.';

comment on table public.portal_users is
  'Private EcoFocus portal users. company_id remains the default workspace, while home_company_id owns seats and usage.';

create or replace function public.set_portal_accounts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portal_subscriptions_set_updated_at on public.portal_subscriptions;
create trigger portal_subscriptions_set_updated_at
before update on public.portal_subscriptions
for each row
execute function public.set_portal_accounts_updated_at();

drop trigger if exists portal_companies_set_updated_at on public.portal_companies;
create trigger portal_companies_set_updated_at
before update on public.portal_companies
for each row
execute function public.set_portal_accounts_updated_at();

drop trigger if exists portal_users_set_updated_at on public.portal_users;
create trigger portal_users_set_updated_at
before update on public.portal_users
for each row
execute function public.set_portal_accounts_updated_at();

insert into public.portal_subscriptions (
  id,
  plan_name,
  seats_purchased,
  seats_used,
  renewal_date,
  status,
  stripe_subscription_id
)
values
  ('sub-greenloop', 'Enterprise Insight Suite', 12, 8, '2026-08-15', 'active', null),
  ('sub-ecofocus', 'Internal Support Workspace', 20, 9, '2026-12-31', 'active', null)
on conflict (id) do update
set
  plan_name = excluded.plan_name,
  seats_purchased = excluded.seats_purchased,
  seats_used = excluded.seats_used,
  renewal_date = excluded.renewal_date,
  status = excluded.status,
  stripe_subscription_id = excluded.stripe_subscription_id,
  updated_at = now();

insert into public.portal_companies (
  id,
  name,
  subscription_id,
  subscriber_type,
  logo_url,
  billing_contact_name,
  billing_email,
  stripe_customer_id,
  allow_external_collaborators,
  external_access_policy
)
values
  ('company-greenloop', 'GreenLoop Foods', 'sub-greenloop', 'brand', null, 'Maya Hernandez', 'maya@greenloopfoods.com', null, false, null),
  ('company-ecofocus', 'EcoFocus Research', 'sub-ecofocus', 'internal', null, 'Sam Patel', 'sam@ecofocusresearch.com', null, true, 'support_admin_only')
on conflict (id) do update
set
  name = excluded.name,
  subscription_id = excluded.subscription_id,
  subscriber_type = excluded.subscriber_type,
  logo_url = excluded.logo_url,
  billing_contact_name = excluded.billing_contact_name,
  billing_email = excluded.billing_email,
  stripe_customer_id = excluded.stripe_customer_id,
  allow_external_collaborators = excluded.allow_external_collaborators,
  external_access_policy = excluded.external_access_policy,
  updated_at = now();

insert into public.portal_users (
  id,
  name,
  email,
  company_id,
  home_company_id,
  role,
  status
)
values
  ('user-maya', 'Maya Hernandez', 'maya@greenloopfoods.com', 'company-greenloop', 'company-greenloop', 'client_admin', 'active'),
  ('user-elliot', 'Elliot Park', 'elliot@greenloopfoods.com', 'company-greenloop', 'company-greenloop', 'client_user', 'active'),
  ('user-sam', 'Sam Patel', 'sam@ecofocusresearch.com', 'company-ecofocus', 'company-ecofocus', 'support_admin', 'active')
on conflict (id) do update
set
  name = excluded.name,
  email = excluded.email,
  company_id = excluded.company_id,
  home_company_id = excluded.home_company_id,
  role = excluded.role,
  status = excluded.status,
  updated_at = now();
