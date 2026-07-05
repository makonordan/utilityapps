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
-- `drop ... if exists` + `create` keeps each policy idempotent without
-- needing CREATE POLICY IF NOT EXISTS — that syntax only exists in
-- PostgreSQL 17, and Supabase free-tier projects are on 15/16.
drop policy if exists products_clicks_insert on public.products_clicks;
create policy products_clicks_insert on public.products_clicks
  for insert to anon, authenticated with check (true);
drop policy if exists products_clicks_select on public.products_clicks;
create policy products_clicks_select on public.products_clicks
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

-- NOTE: every `create policy` below is paired with a `drop policy if
-- exists` so the schema is idempotent (re-runnable). We deliberately
-- don't use CREATE POLICY IF NOT EXISTS — that syntax landed in
-- PostgreSQL 17, and Supabase free-tier projects are still on 15/16.

-- tool_usage: anyone can record usage and read aggregate counts.
drop policy if exists tool_usage_insert on public.tool_usage;
create policy tool_usage_insert on public.tool_usage
  for insert to anon, authenticated with check (true);
drop policy if exists tool_usage_select on public.tool_usage;
create policy tool_usage_select on public.tool_usage
  for select to anon, authenticated using (true);

-- bookmarks: anyone can insert; reads/deletes scoped to matching user_id
-- supplied via the `x-user-id` request header (set client-side).
drop policy if exists bookmarks_insert on public.bookmarks;
create policy bookmarks_insert on public.bookmarks
  for insert to anon, authenticated with check (true);
drop policy if exists bookmarks_select on public.bookmarks;
create policy bookmarks_select on public.bookmarks
  for select to anon, authenticated
  using (user_id = coalesce(current_setting('request.headers', true)::json->>'x-user-id', user_id));
drop policy if exists bookmarks_delete on public.bookmarks;
create policy bookmarks_delete on public.bookmarks
  for delete to anon, authenticated
  using (user_id = coalesce(current_setting('request.headers', true)::json->>'x-user-id', ''));

-- newsletter_subscribers: anyone can subscribe; reads restricted to service role.
drop policy if exists newsletter_insert on public.newsletter_subscribers;
create policy newsletter_insert on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);

-- tool_ratings: anyone can rate and read aggregates.
drop policy if exists tool_ratings_insert on public.tool_ratings;
create policy tool_ratings_insert on public.tool_ratings
  for insert to anon, authenticated with check (true);
drop policy if exists tool_ratings_select on public.tool_ratings;
create policy tool_ratings_select on public.tool_ratings
  for select to anon, authenticated using (true);

-- blog_views: write goes through the increment_blog_view RPC; allow reads.
drop policy if exists blog_views_select on public.blog_views;
create policy blog_views_select on public.blog_views
  for select to anon, authenticated using (true);

-- search_queries: anyone can log a search and read trending aggregates.
drop policy if exists search_queries_insert on public.search_queries;
create policy search_queries_insert on public.search_queries
  for insert to anon, authenticated with check (true);
drop policy if exists search_queries_select on public.search_queries;
create policy search_queries_select on public.search_queries
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

-- 10. shares -----------------------------------------------------------------
-- Anonymous URL shortener + text-snippet share (file shares come in Phase 2).
-- Like `orders`, RLS is ON with NO policies — the anon key has zero access.
-- All reads and writes go through the service-role client in lib/db/shares.ts.
-- Storing creator_ip + a hashed password (when set) is sensitive; keeping it
-- server-only and excluded from the anon API surface is the simplest defense.
create table if not exists public.shares (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  type            text not null check (type in ('file', 'text', 'url')),
  -- File-specific (Phase 2 only, columns kept nullable so Phase 1 can ship)
  file_path       text,
  file_name       text,
  file_size       bigint,
  file_mimetype   text,
  -- Content for text and url shares
  text_content    text,
  text_language   text, -- optional prismjs language hint for syntax highlight
  original_url    text,
  -- Access controls
  password_hash   text,
  custom_slug     boolean not null default false,
  view_limit      integer,
  view_count      integer not null default 0,
  expires_at      timestamptz not null,
  created_at      timestamptz not null default now(),
  -- Abuse tracking
  creator_ip      text,
  reported        boolean not null default false,
  reported_at     timestamptz
);

create index if not exists shares_slug_idx          on public.shares (slug);
create index if not exists shares_expires_at_idx    on public.shares (expires_at);
create index if not exists shares_creator_ip_idx
  on public.shares (creator_ip, created_at desc);
create index if not exists shares_reported_idx
  on public.shares (reported)
  where reported = true;

-- RLS on, no policies: server-only via service-role.
alter table public.shares enable row level security;

-- 11. tool_completions ------------------------------------------------------
-- Parallel to `tool_usage` but only written when a tool successfully delivers
-- its primary output (a download / a copy / a generated link / a saved file).
-- Lets the admin compute a *completion rate* — uses ÷ visits — to distinguish
-- "people clicked the tool" from "the tool actually worked for them".
--
-- Single-table design (not a `completed` column on tool_usage) so existing
-- queries don't need conditional WHERE clauses and so the table can be
-- aggregated independently for the dashboard.
create table if not exists public.tool_completions (
  id           bigint generated always as identity primary key,
  tool_id      text not null,
  user_session text,
  created_at   timestamptz not null default now()
);

create index if not exists tool_completions_tool_id_idx
  on public.tool_completions (tool_id);
create index if not exists tool_completions_created_at_idx
  on public.tool_completions (created_at desc);

-- Same anon-INSERT / anon-SELECT policy shape as tool_usage so the dashboard
-- can aggregate without the service-role round-trip. No PII in this table.
alter table public.tool_completions enable row level security;
drop policy if exists tool_completions_insert on public.tool_completions;
create policy tool_completions_insert on public.tool_completions
  for insert to anon, authenticated with check (true);
drop policy if exists tool_completions_select on public.tool_completions;
create policy tool_completions_select on public.tool_completions
  for select to anon, authenticated using (true);

-- 12. api_waitlist ----------------------------------------------------------
-- Demand-validation waitlist for the public API. Email is PII; same posture
-- as `newsletter_subscribers` — anon-INSERT only, no anon-SELECT. The admin
-- dashboard reads via service-role.
create table if not exists public.api_waitlist (
  id         bigint generated always as identity primary key,
  email      text not null unique,
  use_case   text,                    -- optional: "what would you build?"
  source     text,                    -- optional: where they signed up from
  created_at timestamptz not null default now()
);

create index if not exists api_waitlist_created_at_idx
  on public.api_waitlist (created_at desc);

alter table public.api_waitlist enable row level security;
drop policy if exists api_waitlist_insert on public.api_waitlist;
create policy api_waitlist_insert on public.api_waitlist
  for insert to anon, authenticated with check (true);

-- 13. extension_waitlist ----------------------------------------------------
-- Demand-validation waitlist for a possible Chrome extension. Same posture
-- as api_waitlist — anon-INSERT only, no anon-SELECT (email is PII; admin
-- reads via service-role). Kept as its own table so the two waitlists'
-- counts never mix.
create table if not exists public.extension_waitlist (
  id         bigint generated always as identity primary key,
  email      text not null unique,
  source     text,
  created_at timestamptz not null default now()
);

create index if not exists extension_waitlist_created_at_idx
  on public.extension_waitlist (created_at desc);

alter table public.extension_waitlist enable row level security;
drop policy if exists extension_waitlist_insert on public.extension_waitlist;
create policy extension_waitlist_insert on public.extension_waitlist
  for insert to anon, authenticated with check (true);

-- 14. supporters + supporter_payments ---------------------------------------
-- Recurring & one-time financial supporters of UtilityApps. Feeds the
-- /support wall and the supporter badge logic. Writes happen ONLY through
-- payment-provider webhooks running with the service-role key — anon must
-- not insert (would let anyone forge supporter status).
--
-- Anon-SELECT is allowed but only on a deliberately narrow surface (a view
-- below) so the public supporter wall can render without exposing emails /
-- subscription IDs / amounts.

do $$ begin
  create type public.supporter_tier as enum (
    'supporter', 'power', 'patron', 'one_time'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.supporter_provider as enum (
    'bmac', 'stripe', 'paystack', 'manual'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.supporter_status as enum (
    'active', 'cancelled', 'pending'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.supporter_cycle as enum (
    'monthly', 'annual', 'one_time'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.supporters (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique,
  name              text not null,
  display_name      text,
  tier              public.supporter_tier not null,
  payment_provider  public.supporter_provider not null,
  subscription_id   text,
  amount_monthly    numeric(10, 2) not null default 0,
  currency          text not null default 'USD',
  billing_cycle     public.supporter_cycle not null,
  status            public.supporter_status not null default 'pending',
  show_publicly     boolean not null default true,
  joined_at         timestamptz not null default now(),
  last_payment_at   timestamptz,
  next_payment_at   timestamptz,
  total_contributed numeric(10, 2) not null default 0
);

create index if not exists supporters_status_tier_idx
  on public.supporters (status, tier, joined_at desc);
create index if not exists supporters_public_wall_idx
  on public.supporters (show_publicly, status, joined_at desc)
  where show_publicly = true and status = 'active';

alter table public.supporters enable row level security;
-- No anon-SELECT / -INSERT / -UPDATE — the email + amount columns are PII
-- and the row drives badge state. Writes only via service-role from
-- webhooks; reads for the public wall go through the view below.
drop policy if exists supporters_no_anon on public.supporters;
create policy supporters_no_anon on public.supporters
  for all to anon using (false) with check (false);

-- Public-safe projection for the supporter wall. Anon can SELECT this
-- view; it surfaces only display_name + tier + joined_at for active +
-- show_publicly rows, nothing else.
create or replace view public.supporters_public as
select
  coalesce(display_name, name) as display_name,
  tier,
  joined_at
from public.supporters
where status = 'active' and show_publicly = true;

-- Views inherit RLS from base tables — granting select on the view alone
-- isn't enough because the underlying `supporters` policy denies anon. We
-- mark the view as security_invoker = off (default), then grant select.
grant select on public.supporters_public to anon, authenticated;

create table if not exists public.supporter_payments (
  id              uuid primary key default gen_random_uuid(),
  supporter_id    uuid not null references public.supporters(id) on delete cascade,
  amount          numeric(10, 2) not null,
  currency        text not null,
  payment_method  text not null,
  transaction_id  text not null,
  paid_at         timestamptz not null default now(),
  unique (supporter_id, transaction_id)
);

create index if not exists supporter_payments_supporter_idx
  on public.supporter_payments (supporter_id, paid_at desc);
create index if not exists supporter_payments_paid_at_idx
  on public.supporter_payments (paid_at desc);

alter table public.supporter_payments enable row level security;
drop policy if exists supporter_payments_no_anon on public.supporter_payments;
create policy supporter_payments_no_anon on public.supporter_payments
  for all to anon using (false) with check (false);

-- 15. studio_inquiries ------------------------------------------------------
-- Discovery-call inquiries from the /studio services page. Anon-INSERT
-- only (the form posts directly); anon must NOT read this table —
-- it holds names, emails, project descriptions, and budget signals.
-- Admin reads via service-role (same posture as contact_messages).

do $$ begin
  create type public.studio_company_size as enum ('solo', 'small', 'medium', 'large');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.studio_timeline as enum (
    'asap', 'within_month', 'within_quarter', 'exploring'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.studio_budget as enum (
    'under_5k', '5k_15k', '15k_50k', 'over_50k', 'open'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.studio_contact_pref as enum ('email', 'video_call', 'whatsapp');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.studio_status as enum (
    'new', 'contacted', 'qualified', 'proposal_sent', 'closed_won', 'closed_lost'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.studio_inquiries (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  email               text not null,
  company             text not null,
  company_size        public.studio_company_size not null,
  industry            text not null,
  project_type        text not null,
  project_description text not null check (char_length(project_description) <= 2000),
  timeline            public.studio_timeline not null,
  budget_range        public.studio_budget not null,
  referral_source     text,
  preferred_contact   public.studio_contact_pref not null,
  whatsapp_number     text,
  status              public.studio_status not null default 'new',
  notes               text,
  created_at          timestamptz not null default now()
);

create index if not exists studio_inquiries_created_at_idx
  on public.studio_inquiries (created_at desc);
create index if not exists studio_inquiries_status_idx
  on public.studio_inquiries (status, created_at desc);

alter table public.studio_inquiries enable row level security;

-- Anon can INSERT (the marketing form is unauthenticated) but cannot
-- SELECT / UPDATE / DELETE. Service-role bypasses RLS for admin reads.
drop policy if exists studio_inquiries_insert on public.studio_inquiries;
create policy studio_inquiries_insert on public.studio_inquiries
  for insert to anon, authenticated with check (true);

drop policy if exists studio_inquiries_no_anon_read on public.studio_inquiries;
create policy studio_inquiries_no_anon_read on public.studio_inquiries
  for select to anon using (false);

-- 16. business cards (bc_*) -------------------------------------------------
-- Multi-card digital business card system with public share pages,
-- vCard downloads, and QR codes. Uses Supabase Auth (auth.uid()) for
-- ownership — no NextAuth bridge needed. Public pages read via a
-- carefully scoped SELECT policy that exposes only the fields shown
-- on the public-facing card (no emails/phones leak to strangers unless
-- the card owner explicitly enables them on that card).

do $$ begin
  create type public.bc_plan as enum ('free', 'pro', 'business');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.bc_card_type as enum ('personal', 'business', 'company_department');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.bc_theme as enum ('minimal', 'gradient', 'dark', 'professional', 'creative');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.bc_bg_style as enum ('gradient', 'solid', 'pattern');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.bc_scan_type as enum (
    'qr_scan', 'link_visit', 'master_selector', 'vcf_download',
    'social_click', 'phone_tap', 'email_tap', 'website_tap'
  );
exception when duplicate_object then null; end $$;

-- Users -- 1:1 with auth.users via auth_id (the Supabase Auth uid).
create table if not exists public.bc_users (
  id          uuid primary key default gen_random_uuid(),
  auth_id     uuid not null unique,
  email       text not null,
  name        text not null,
  username    text not null unique
    check (
      username = lower(username)
      and username ~ '^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$'
      and username !~ '--'
    ),
  avatar_url  text,
  plan        public.bc_plan not null default 'free',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists bc_users_auth_id_idx on public.bc_users (auth_id);
create index if not exists bc_users_username_idx on public.bc_users (username);

alter table public.bc_users enable row level security;

-- Owners read/write their own row; anon reads limited to public
-- profile fields via a view below.
drop policy if exists bc_users_self_all on public.bc_users;
create policy bc_users_self_all on public.bc_users
  for all to authenticated using (auth_id = auth.uid()) with check (auth_id = auth.uid());

-- Cards -----------------------------------------------------------------
create table if not exists public.bc_cards (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.bc_users(id) on delete cascade,
  slug                  text not null
    check (slug = lower(slug) and slug ~ '^[a-z0-9](?:[a-z0-9-]{0,58}[a-z0-9])?$'),
  card_type             public.bc_card_type not null default 'personal',
  is_active             boolean not null default true,
  is_master_visible     boolean not null default true,
  display_order         integer not null default 0,

  -- Identity
  full_name             text not null,
  job_title             text,
  company_name          text,
  department            text,
  pronouns              text,
  tagline               text check (tagline is null or char_length(tagline) <= 120),
  bio                   text check (bio is null or char_length(bio) <= 500),

  -- Contact
  email                 text,
  phone_primary         text,
  phone_secondary       text,
  website               text,
  address_street        text,
  address_city          text,
  address_state         text,
  address_country       text,
  address_postal        text,

  -- Social
  social_links          jsonb not null default '[]'::jsonb,

  -- Branding
  avatar_url            text,
  brand_color_primary   text not null default '#3B82F6',
  brand_color_secondary text not null default '#1E40AF',
  card_theme            public.bc_theme not null default 'minimal',
  logo_url              text,

  -- vCard metadata
  vcf_include_photo     boolean not null default true,
  vcf_include_address   boolean not null default false,
  vcf_notes             text check (vcf_notes is null or char_length(vcf_notes) <= 200),

  -- Analytics counters (best-effort; source of truth is bc_scans)
  scan_count            integer not null default 0,
  view_count            integer not null default 0,
  save_count            integer not null default 0,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  unique (user_id, slug)
);

create index if not exists bc_cards_user_id_idx on public.bc_cards (user_id);
create index if not exists bc_cards_user_active_idx
  on public.bc_cards (user_id, is_active);

alter table public.bc_cards enable row level security;

-- Owners can do everything with their own cards.
drop policy if exists bc_cards_owner_all on public.bc_cards;
create policy bc_cards_owner_all on public.bc_cards
  for all to authenticated
  using (user_id in (select id from public.bc_users where auth_id = auth.uid()))
  with check (user_id in (select id from public.bc_users where auth_id = auth.uid()));

-- Anon can read active cards (for public pages). Sensitive contact
-- fields ARE included on the public card by design — that's the
-- product. Users control what they share via `is_active` and by
-- leaving fields empty. Address is gated by vcf_include_address at
-- the API layer to keep it out of the public JSON entirely.
drop policy if exists bc_cards_public_active_read on public.bc_cards;
create policy bc_cards_public_active_read on public.bc_cards
  for select to anon using (is_active = true);

-- Scans (analytics) -----------------------------------------------------
create table if not exists public.bc_scans (
  id          uuid primary key default gen_random_uuid(),
  card_id     uuid not null references public.bc_cards(id) on delete cascade,
  scan_type   public.bc_scan_type not null,
  device_type text,
  country     text,
  referrer    text,
  -- Never IP or fingerprint. Country from x-vercel-ip-country only.
  scanned_at  timestamptz not null default now()
);

create index if not exists bc_scans_card_time_idx
  on public.bc_scans (card_id, scanned_at desc);

alter table public.bc_scans enable row level security;

-- Anon can insert scan events (that's how public pages track).
-- Reading is limited to the card's owner.
drop policy if exists bc_scans_public_insert on public.bc_scans;
create policy bc_scans_public_insert on public.bc_scans
  for insert to anon, authenticated with check (true);

drop policy if exists bc_scans_owner_read on public.bc_scans;
create policy bc_scans_owner_read on public.bc_scans
  for select to authenticated
  using (
    card_id in (
      select c.id from public.bc_cards c
      join public.bc_users u on u.id = c.user_id
      where u.auth_id = auth.uid()
    )
  );

-- Master page settings (one row per user) -------------------------------
create table if not exists public.bc_master_settings (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null unique references public.bc_users(id) on delete cascade,
  page_title        text,
  page_bio          text check (page_bio is null or char_length(page_bio) <= 300),
  background_style  public.bc_bg_style not null default 'gradient',
  background_color  text not null default '#0F172A',
  show_avatar       boolean not null default true,
  master_avatar_url text,
  custom_domain     text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.bc_master_settings enable row level security;

drop policy if exists bc_master_settings_owner_all on public.bc_master_settings;
create policy bc_master_settings_owner_all on public.bc_master_settings
  for all to authenticated
  using (user_id in (select id from public.bc_users where auth_id = auth.uid()))
  with check (user_id in (select id from public.bc_users where auth_id = auth.uid()));

drop policy if exists bc_master_settings_public_read on public.bc_master_settings;
create policy bc_master_settings_public_read on public.bc_master_settings
  for select to anon using (true);

-- updated_at auto-refresh triggers --------------------------------------
create or replace function public.bc_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

do $$ begin
  create trigger bc_users_updated_at before update on public.bc_users
    for each row execute function public.bc_set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger bc_cards_updated_at before update on public.bc_cards
    for each row execute function public.bc_set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger bc_master_settings_updated_at before update on public.bc_master_settings
    for each row execute function public.bc_set_updated_at();
exception when duplicate_object then null; end $$;

-- 17. bc-avatars storage bucket --------------------------------------------
-- Public bucket that holds user-uploaded card avatars and company logos.
-- Uploads go through /api/business-card/upload (service-role), so we
-- don't need per-user INSERT/UPDATE RLS policies on storage.objects —
-- clients can never write to the bucket directly. Public SELECT is
-- required so the CDN can serve the images to anyone rendering a
-- public /bc/ page.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bc-avatars',
  'bc-avatars',
  true,
  2 * 1024 * 1024, -- 2 MB hard cap; client compresses to ~200 KB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$ begin
  create policy "bc_avatars_public_read"
    on storage.objects for select
    using (bucket_id = 'bc-avatars');
exception when duplicate_object then null; end $$;


-- 18. instant-poll -----------------------------------------------------------
-- Public write model: anyone can create polls and vote without auth. All
-- abuse prevention lives in the API routes (per-IP rate limits, wordlist
-- check, device-hash dedupe, per-request creator_token). RLS on this section
-- keeps individual votes private while letting everyone read poll metadata
-- and aggregate counts via poll_results.

create table if not exists public.polls (
  id             uuid primary key default gen_random_uuid(),
  -- Short URL-safe code used in /tools/instant-poll/[public_id]. Generated
  -- by lib/pollUtils generatePublicId() from an unambiguous 55-char alphabet
  -- (no 0/O/1/l/I). 8 chars → ~1.4e13 combinations, collision-negligible.
  public_id      text unique not null,
  question       text not null check (char_length(question) <= 200 and char_length(question) > 0),
  -- [{ id: string, text: string }, ...]. Between 2 and 10 options; the API
  -- route validates the array shape before insert.
  options        jsonb not null,
  poll_type      text not null default 'single'
                   check (poll_type in ('single', 'multiple')),
  created_at     timestamptz not null default now(),
  -- Auto-expiry: default 30 days from creation. Votes rejected after this;
  -- results still readable. A scheduled function can purge expired polls
  -- for storage hygiene but isn't required for correctness.
  expires_at     timestamptz not null default (now() + interval '30 days'),
  is_closed      boolean not null default false,
  total_votes    integer not null default 0,
  -- Random secret stored ONLY in the creator's browser localStorage. Server
  -- checks equality on close/delete requests. Never returned in the public
  -- poll payload — the API route strips it from selects that fan out to
  -- viewers.
  creator_token  text not null,
  -- Small object of per-poll toggles. Extend as needed; jsonb keeps schema
  -- migrations cheap.
  settings       jsonb not null default
                   '{"showResultsBeforeVote": false, "allowMultiplePerDevice": false}'::jsonb
);

create unique index if not exists polls_public_id_idx on public.polls (public_id);
create index if not exists polls_expires_at_idx on public.polls (expires_at);

create table if not exists public.poll_votes (
  id           uuid primary key default gen_random_uuid(),
  poll_id      uuid not null references public.polls(id) on delete cascade,
  -- Array of option ids the voter picked. Always an array — single-choice
  -- polls just have length 1 — so the aggregate view treats both modes
  -- uniformly.
  option_ids   jsonb not null,
  -- Hash of (poll_id, device_token, user_agent) computed by
  -- lib/pollUtils computeVoterHash. Prevents trivial double-voting without
  -- storing anything personally identifying. NOT an IP hash.
  voter_hash   text not null,
  voted_at     timestamptz not null default now()
);

create index if not exists poll_votes_poll_id_idx on public.poll_votes (poll_id);
-- Composite index makes the duplicate-vote check
-- (SELECT 1 FROM poll_votes WHERE poll_id=? AND voter_hash=?) instant.
create index if not exists poll_votes_dedupe_idx on public.poll_votes (poll_id, voter_hash);

-- Aggregate view: one row per poll with { option_id -> count } + total.
-- Consumers hit this view (or the API) for the results panel because the
-- underlying poll_votes table has no public SELECT policy — individual
-- votes stay private, only aggregates leak.
create or replace view public.poll_results as
select
  poll_id,
  jsonb_object_agg(option_id, cnt) as counts,
  sum(cnt)::int as total
from (
  select
    v.poll_id,
    o.value as option_id,
    count(*)::int as cnt
  from public.poll_votes v
  cross join lateral jsonb_array_elements_text(v.option_ids) o(value)
  group by v.poll_id, o.value
) t
group by poll_id;

alter table public.polls      enable row level security;
alter table public.poll_votes enable row level security;

-- Anyone reads polls — needed for public poll pages. The API route
-- strips creator_token before returning to viewers.
do $$ begin
  create policy polls_public_read on public.polls
    for select using (true);
exception when duplicate_object then null; end $$;

-- Anyone creates polls. Validation + creator_token injection happens in
-- the API route; the raw client never picks the token itself.
do $$ begin
  create policy polls_public_insert on public.polls
    for insert with check (true);
exception when duplicate_object then null; end $$;

-- Anon client cannot update/delete polls directly. Close + delete flows
-- go through the API route using the service-role client (which bypasses
-- RLS entirely). "using (false)" is a hard block; the service-role
-- bypass makes it a route-only capability.
do $$ begin
  create policy polls_no_client_update on public.polls
    for update using (false);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy polls_no_client_delete on public.polls
    for delete using (false);
exception when duplicate_object then null; end $$;

-- Anyone can INSERT votes — the vote endpoint is public. Duplicate
-- prevention runs before the insert in the API route.
do $$ begin
  create policy poll_votes_public_insert on public.poll_votes
    for insert with check (true);
exception when duplicate_object then null; end $$;

-- No public SELECT on poll_votes — the aggregate view is how consumers
-- read counts. Individual votes stay private even to the poll creator.
do $$ begin
  create policy poll_votes_no_public_select on public.poll_votes
    for select using (false);
exception when duplicate_object then null; end $$;
