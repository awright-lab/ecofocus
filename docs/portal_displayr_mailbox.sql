begin;
create table if not exists public.portal_displayr_mailbox_oauth_states (
  auth_user_id uuid primary key,
  state_hash text not null unique,
  portal_session_id uuid not null,
  verifier_ciphertext text not null,
  expires_at timestamptz not null
);
create table if not exists public.portal_displayr_mailbox_connection (
  mailbox text primary key check (mailbox = 'displayr-provisioning@ecofocusworldwide.com'),
  refresh_token_ciphertext text not null,
  connected_by uuid not null,
  connected_at timestamptz not null,
  scope text not null check (scope = 'https://www.googleapis.com/auth/gmail.readonly')
);
alter table public.portal_displayr_mailbox_oauth_states enable row level security;
alter table public.portal_displayr_mailbox_connection enable row level security;
revoke all on public.portal_displayr_mailbox_oauth_states, public.portal_displayr_mailbox_connection from public, anon, authenticated;
grant select, insert, update, delete on public.portal_displayr_mailbox_oauth_states, public.portal_displayr_mailbox_connection to service_role;
commit;
