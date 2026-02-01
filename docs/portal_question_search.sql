create extension if not exists pg_trgm;

create table if not exists responses_2025_question_aliases (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  db_column text,
  question_code text,
  created_at timestamptz not null default now()
);

create index if not exists responses_2025_question_aliases_keyword_idx
  on responses_2025_question_aliases using gin (keyword gin_trgm_ops);
create index if not exists responses_2025_question_aliases_db_column_idx
  on responses_2025_question_aliases (db_column);
create index if not exists responses_2025_question_aliases_question_code_idx
  on responses_2025_question_aliases (question_code);

create or replace function search_question_similarity(q text, limit_count int default 10)
returns table (
  db_column text,
  question_code text,
  question_text text,
  source_header text,
  topic text,
  data_type_guess text,
  similarity_score real
)
language sql
stable
as $$
  select
    db_column,
    question_code,
    question_text,
    source_header,
    topic,
    data_type_guess,
    greatest(similarity(question_text, q), similarity(coalesce(topic, ''), q)) as similarity_score
  from responses_2025_question_lookup
  where similarity(question_text, q) > 0.1
     or similarity(coalesce(topic, ''), q) > 0.1
  order by similarity_score desc
  limit limit_count;
$$;

insert into responses_2025_question_aliases (keyword, question_code, db_column)
values
  ('climate change', 'QCLIMATE_HIDDEN', 'qclimate_hidden'),
  ('global warming', 'QCLIMATE_HIDDEN', 'qclimate_hidden')
on conflict do nothing;
