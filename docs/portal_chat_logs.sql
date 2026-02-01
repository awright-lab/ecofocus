create table if not exists portal_chat_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null,
  message text not null,
  tool_used text not null,
  variables_used jsonb,
  success boolean not null default false
);

create index if not exists portal_chat_logs_user_id_idx on portal_chat_logs (user_id);
