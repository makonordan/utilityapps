-- UtilityApps Supabase schema
-- Run this in the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- 1. tool_usage -------------------------------------------------------------
create table if not exists public.tool_usage (
  id            bigint generated always as identity primary key,
  tool_id       text not null,
  user_session  text,
  created_at    timestamptz not null default now(),
  country       text,
  device        text
);

create index if not exists tool_usage_tool_id_idx     on public.tool_usage (tool_id);
create index if not exists tool_usage_created_at_idx  on public.tool_usage (created_at desc);
create index if not exists tool_usage_tool_recent_idx on public.tool_usage (tool_id, created_at desc);

-- 2. bookmarks --------------------------------------------------------------
create table if not exists public.bookmarks (
  id          bigint generated always as identity primary key,
  user_id     text not null,
  tool_id     text not null,
  created_at  timestamptz not null default now(),
  unique (user_id, tool_id)
);

create index if not exists bookmarks_user_id_idx on public.bookmarks (user_id);
create index if not exists bookmarks_tool_id_idx on public.bookmarks (tool_id);

-- 3. newsletter_subscribers -------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id          bigint generated always as identity primary key,
  email       text not null unique,
  created_at  timestamptz not null default now(),
  confirmed   boolean not null default false,
  source      text
);

create index if not exists newsletter_subscribers_confirmed_idx
  on public.newsletter_subscribers (confirmed);

-- 4. tool_ratings -----------------------------------------------------------
create table if not exists public.tool_ratings (
  id            bigint generated always as identity primary key,
  tool_id       text not null,
  rating        smallint not null check (rating between 1 and 5),
  created_at    timestamptz not null default now(),
  user_session  text
);

create index if not exists tool_ratings_tool_id_idx on public.tool_ratings (tool_id);
create unique index if not exists tool_ratings_unique_per_session
  on public.tool_ratings (tool_id, user_session)
  where user_session is not null;

-- 5. blog_views -------------------------------------------------------------
create table if not exists public.blog_views (
  id          bigint generated always as identity primary key,
  slug        text not null unique,
  views       integer not null default 0,
  updated_at  timestamptz not null default now()
);

create index if not exists blog_views_views_idx on public.blog_views (views desc);

-- 7. products_clicks --------------------------------------------------------
-- Affiliate-link click tracking. Each row is one click; aggregate at read
-- time. Stores the destination URL captured at click time so we can detect
-- broken/changed affiliate links from telemetry.
create table if not exists public.products_clicks (
  id           bigint generated always as identity primary key,
  product_id   text not null,
  url          text not null,
  source       text,
  user_session text,
  country      text,
  device       text,
  created_at   timestamptz not null default now()
);

create index if not exists products_clicks_product_idx
  on public.products_clicks (product_id, created_at desc);
create index if not exists products_clicks_recent_idx
  on public.products_clicks (created_at desc);

alter table public.products_clicks enable row level security;
create policy if not exists products_clicks_insert on public.products_clicks
  for insert to anon, authenticated with check (true);
create policy if not exists products_clicks_select on public.products_clicks
  for select to anon, authenticated using (true);

-- 6. search_queries ---------------------------------------------------------
create table if not exists public.search_queries (
  id             bigint generated always as identity primary key,
  query          text not null,
  results_count  integer not null default 0,
  clicked_tool   text,
  created_at     timestamptz not null default now()
);

create index if not exists search_queries_created_at_idx on public.search_queries (created_at desc);
create index if not exists search_queries_query_idx       on public.search_queries (lower(query));

-- 8. contact_messages -------------------------------------------------------
-- Contact-form submissions. Holds PII (name, email, message text), so RLS
-- allows INSERT with the anon key but has NO select policy — reads happen
-- server-side with the service-role key only.
create table if not exists public.contact_messages (
  id          bigint generated always as identity primary key,
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;
-- CREATE POLICY has no IF NOT EXISTS form, so drop-then-create for idempotency.
drop policy if exists contact_messages_insert on public.contact_messages;
create policy contact_messages_insert on public.contact_messages
  for insert to anon, authenticated with check (true);
-- Intentionally no select policy: the anon key must not be able to read
-- contact submissions. The admin dashboard reads with the service-role key.

-- Aggregate helpers ---------------------------------------------------------

create or replace function public.get_trending_tools(
  window_days  integer default 7,
  max_results  integer default 10
)
returns table (tool_id text, usage_count bigint)
language sql
stable
as $$
  select tool_id, count(*)::bigint as usage_count
  from public.tool_usage
  where created_at >= now() - (window_days || ' days')::interval
  group by tool_id
  order by usage_count desc, tool_id asc
  limit max_results;
$$;

create or replace function public.get_trending_searches(
  window_days  integer default 7,
  max_results  integer default 10
)
returns table (query text, search_count bigint)
language sql
stable
as $$
  select lower(trim(query)) as query, count(*)::bigint as search_count
  from public.search_queries
  where created_at >= now() - (window_days || ' days')::interval
    and length(trim(query)) > 0
  group by lower(trim(query))
  order by search_count desc, query asc
  limit max_results;
$$;

create or replace function public.increment_blog_view(p_slug text)
returns integer
language plpgsql
as $$
declare
  new_views integer;
begin
  insert into public.blog_views (slug, views, updated_at)
  values (p_slug, 1, now())
  on conflict (slug) do update
    set views = public.blog_views.views + 1,
        updated_at = now()
  returning views into new_views;
  return new_views;
end;
$$;

-- Row-Level Security --------------------------------------------------------
-- Anonymous-only product: enable RLS and allow the anon key to insert/select
-- through narrowly-scoped policies. Mutations on bookmarks are scoped per
-- user_id so a session can only manage its own rows.

alter table public.tool_usage             enable row level security;
alter table public.bookmarks              enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.tool_ratings           enable row level security;
alter table public.blog_views             enable row level security;
alter table public.search_queries         enable row level security;

-- tool_usage: anyone can record usage and read aggregate counts.
create policy if not exists tool_usage_insert on public.tool_usage
  for insert to anon, authenticated with check (true);
create policy if not exists tool_usage_select on public.tool_usage
  for select to anon, authenticated using (true);

-- bookmarks: anyone can insert; reads/deletes scoped to matching user_id
-- supplied via the `x-user-id` request header (set client-side).
create policy if not exists bookmarks_insert on public.bookmarks
  for insert to anon, authenticated with check (true);
create policy if not exists bookmarks_select on public.bookmarks
  for select to anon, authenticated
  using (user_id = coalesce(current_setting('request.headers', true)::json->>'x-user-id', user_id));
create policy if not exists bookmarks_delete on public.bookmarks
  for delete to anon, authenticated
  using (user_id = coalesce(current_setting('request.headers', true)::json->>'x-user-id', ''));

-- newsletter_subscribers: anyone can subscribe; reads restricted to service role.
create policy if not exists newsletter_insert on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);

-- tool_ratings: anyone can rate and read aggregates.
create policy if not exists tool_ratings_insert on public.tool_ratings
  for insert to anon, authenticated with check (true);
create policy if not exists tool_ratings_select on public.tool_ratings
  for select to anon, authenticated using (true);

-- blog_views: write goes through the increment_blog_view RPC; allow reads.
create policy if not exists blog_views_select on public.blog_views
  for select to anon, authenticated using (true);

-- search_queries: anyone can log a search and read trending aggregates.
create policy if not exists search_queries_insert on public.search_queries
  for insert to anon, authenticated with check (true);
create policy if not exists search_queries_select on public.search_queries
  for select to anon, authenticated using (true);

-- 9. orders -----------------------------------------------------------------
-- Digital-product orders sold directly via Korapay. Holds a customer email and
-- the source-of-truth payment state. RLS is ON with NO policies at all, so the
-- anon key cannot read or write it — the checkout and webhook routes use the
-- service-role key exclusively (see lib/orders.ts).
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  reference   text not null unique,
  product_id  text not null,
  email       text not null,
  amount      numeric(10,2) not null,
  currency    text not null default 'USD',
  status      text not null default 'pending'
    check (status in ('pending', 'paid', 'fulfilled', 'failed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists orders_reference_idx  on public.orders (reference);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx     on public.orders (status);

-- RLS on, no policies: the anon key is fully denied. Server routes use the
-- service-role key, which bypasses RLS.
alter table public.orders enable row level security;
