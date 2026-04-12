-- portal_password_setup_tokens
-- Stores hashed, single-use password setup tokens for portal account activation.
-- The raw token is only sent in the setup URL and is never stored.

create extension if not exists pgcrypto;

create table if not exists public.portal_password_setup_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.portal_users(id) on delete cascade,
  email text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_by_user_id text references public.portal_users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists portal_password_setup_tokens_email_idx
  on public.portal_password_setup_tokens (lower(email), created_at desc);

create index if not exists portal_password_setup_tokens_user_idx
  on public.portal_password_setup_tokens (user_id, created_at desc);

create index if not exists portal_password_setup_tokens_active_idx
  on public.portal_password_setup_tokens (token_hash, expires_at)
  where consumed_at is null;

alter table public.portal_password_setup_tokens enable row level security;

comment on table public.portal_password_setup_tokens is
  'Hashed single-use portal password setup tokens for client-admin and team invite activation.';

comment on column public.portal_password_setup_tokens.token_hash is
  'SHA-256 hash of the raw setup token. The raw token is only delivered in the setup URL.';

comment on column public.portal_password_setup_tokens.consumed_at is
  'Set when a setup token is used or superseded by a newer setup token for the same user.';
