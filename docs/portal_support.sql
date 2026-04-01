-- portal_support
-- Stores support tickets and message threads for the EcoFocus portal.
-- Supports client-facing requests, support-admin replies, and internal notes.

create extension if not exists pgcrypto;

create table if not exists public.portal_tickets (
  id text primary key,
  company_id text not null references public.portal_companies(id) on delete cascade,
  subject text not null,
  dashboard_name text not null,
  issue_type text not null,
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'waiting_on_client', 'archived')),
  requester_id text not null references public.portal_users(id) on delete restrict,
  owner_id text references public.portal_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id text not null references public.portal_tickets(id) on delete cascade,
  author_id text not null references public.portal_users(id) on delete restrict,
  body text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists portal_tickets_company_updated_idx
  on public.portal_tickets (company_id, updated_at desc);

create index if not exists portal_tickets_requester_updated_idx
  on public.portal_tickets (requester_id, updated_at desc);

create index if not exists portal_tickets_owner_updated_idx
  on public.portal_tickets (owner_id, updated_at desc);

create index if not exists portal_ticket_messages_ticket_created_idx
  on public.portal_ticket_messages (ticket_id, created_at asc);

alter table public.portal_tickets enable row level security;
alter table public.portal_ticket_messages enable row level security;

comment on table public.portal_tickets is
  'Private EcoFocus portal support tickets.';

comment on table public.portal_ticket_messages is
  'Private EcoFocus portal support ticket messages and internal notes.';

create or replace function public.set_portal_tickets_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portal_tickets_set_updated_at on public.portal_tickets;
create trigger portal_tickets_set_updated_at
before update on public.portal_tickets
for each row
execute function public.set_portal_tickets_updated_at();

create or replace function public.bump_portal_ticket_updated_at()
returns trigger
language plpgsql
as $$
begin
  update public.portal_tickets
  set updated_at = now()
  where id = new.ticket_id;
  return new;
end;
$$;

drop trigger if exists portal_ticket_messages_bump_ticket on public.portal_ticket_messages;
create trigger portal_ticket_messages_bump_ticket
after insert on public.portal_ticket_messages
for each row
execute function public.bump_portal_ticket_updated_at();

insert into public.portal_tickets (
  id,
  company_id,
  subject,
  dashboard_name,
  issue_type,
  priority,
  status,
  requester_id,
  owner_id,
  created_at,
  updated_at
)
values
  ('TCK-1042', 'company-greenloop', 'Exported chart labels are truncating in PNG output', 'Category Performance', 'Chart Export', 'high', 'in_progress', 'user-maya', 'user-sam', '2026-03-04T14:22:00Z', '2026-03-09T18:40:00Z'),
  ('TCK-1038', 'company-greenloop', 'Need segment filter guidance for leadership review', 'Eco IQ Overview', 'Training Request', 'medium', 'waiting_on_client', 'user-maya', 'user-sam', '2026-02-27T10:18:00Z', '2026-03-08T16:05:00Z'),
  ('TCK-1031', 'company-greenloop', 'Can’t access project dashboard after seat reassignment', 'Custom Client Study', 'Login / Access', 'urgent', 'open', 'user-elliot', null, '2026-03-09T08:50:00Z', '2026-03-09T08:50:00Z')
on conflict (id) do update
set
  company_id = excluded.company_id,
  subject = excluded.subject,
  dashboard_name = excluded.dashboard_name,
  issue_type = excluded.issue_type,
  priority = excluded.priority,
  status = excluded.status,
  requester_id = excluded.requester_id,
  owner_id = excluded.owner_id,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.portal_ticket_messages (
  id,
  ticket_id,
  author_id,
  body,
  is_internal,
  created_at
)
values
  ('00000000-0000-0000-0000-000000000001', 'TCK-1042', 'user-maya', 'The export looks correct in the dashboard preview, but the downloaded PNG cuts off long axis labels.', false, '2026-03-04T14:22:00Z'),
  ('00000000-0000-0000-0000-000000000002', 'TCK-1042', 'user-sam', 'We reproduced this with narrow viewport exports and are reviewing the chart container sizing.', false, '2026-03-05T09:10:00Z'),
  ('00000000-0000-0000-0000-000000000003', 'TCK-1042', 'user-sam', 'Internal note: likely needs a Displayr export preset tied to the category dashboard theme.', true, '2026-03-05T09:22:00Z'),
  ('00000000-0000-0000-0000-000000000004', 'TCK-1038', 'user-maya', 'We want to understand which segment filters to apply before exporting a leadership-ready story deck.', false, '2026-02-27T10:18:00Z'),
  ('00000000-0000-0000-0000-000000000005', 'TCK-1038', 'user-sam', 'A short walkthrough and recommended filter order will be added to the reply thread after we review your export use case.', false, '2026-03-08T16:05:00Z')
on conflict (id) do update
set
  ticket_id = excluded.ticket_id,
  author_id = excluded.author_id,
  body = excluded.body,
  is_internal = excluded.is_internal,
  created_at = excluded.created_at;
