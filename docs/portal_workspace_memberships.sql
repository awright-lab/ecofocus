-- portal_workspace_memberships
-- Stores explicit workspace access grants separate from a user's home subscriber account.

create extension if not exists pgcrypto;

create table if not exists public.portal_workspace_memberships (
  id uuid primary key default gen_random_uuid(),
  workspace_company_id text not null references public.portal_companies(id) on delete cascade,
  user_id text not null references public.portal_users(id) on delete cascade,
  membership_role text not null check (membership_role in ('workspace_member', 'workspace_admin', 'external_collaborator', 'support_admin')),
  visibility_scope text not null default 'full' check (visibility_scope in ('full', 'limited')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_company_id, user_id)
);

create index if not exists portal_workspace_memberships_user_idx
  on public.portal_workspace_memberships (user_id, workspace_company_id);

create index if not exists portal_workspace_memberships_workspace_idx
  on public.portal_workspace_memberships (workspace_company_id, membership_role);

alter table public.portal_workspace_memberships enable row level security;

comment on table public.portal_workspace_memberships is
  'Explicit workspace access grants. Use this to allow exception-based cross-account access without changing billing ownership.';

comment on column public.portal_workspace_memberships.workspace_company_id is
  'Workspace the user can open.';

comment on column public.portal_workspace_memberships.user_id is
  'Portal user receiving workspace access.';

comment on column public.portal_workspace_memberships.membership_role is
  'Role inside the workspace context, separate from the user home account.';

comment on column public.portal_workspace_memberships.visibility_scope is
  'Reserved for future partial-access patterns such as limited client-facing collaboration.';

create or replace function public.set_portal_workspace_memberships_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portal_workspace_memberships_set_updated_at on public.portal_workspace_memberships;
create trigger portal_workspace_memberships_set_updated_at
before update on public.portal_workspace_memberships
for each row
execute function public.set_portal_workspace_memberships_updated_at();

insert into public.portal_workspace_memberships (
  workspace_company_id,
  user_id,
  membership_role,
  visibility_scope
)
values
  ('company-greenloop', 'user-maya', 'workspace_admin', 'full'),
  ('company-greenloop', 'user-elliot', 'workspace_member', 'full'),
  ('company-ecofocus', 'user-sam', 'support_admin', 'full')
on conflict (workspace_company_id, user_id) do update
set
  membership_role = excluded.membership_role,
  visibility_scope = excluded.visibility_scope,
  updated_at = now();
