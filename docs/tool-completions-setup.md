# Tool completion tracking — setup

Adds a second analytics signal alongside `tool_usage`: a `tool_completions`
event fired only when a tool **actually succeeds** at its primary output
(file downloaded, link created, document generated). Completion rate =
completions ÷ visits per tool, surfaced as a new column in the admin
**Tools** tab.

## One manual step — run this SQL in Supabase

In **Supabase → SQL Editor → New query**, paste and **Run**:

```sql
-- 11. tool_completions ------------------------------------------------------
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

alter table public.tool_completions enable row level security;
drop policy if exists tool_completions_insert on public.tool_completions;
create policy tool_completions_insert on public.tool_completions
  for insert to anon, authenticated with check (true);
drop policy if exists tool_completions_select on public.tool_completions;
create policy tool_completions_select on public.tool_completions
  for select to anon, authenticated using (true);
```

Expect "Success. No rows returned."

Without this, `/api/tools/complete` quietly fails on every call and the
admin Tools tab shows `—` for every completion rate. The tracking calls
don't break the user's experience — they're fire-and-forget — but you
won't get any data until the table exists.

## What's instrumented today (16 tools)

These tools fire a completion event after a successful action:

| Category | Tools |
|---|---|
| Share | `share` (file / text / URL create) |
| PDF Tools | `merge-pdf` (download success) |
| Legal Tools | All 8 — via `LegalDocumentBuilder` toolId prop |
| PDF Tools (Office) | All 6 — via `OfficeConverter` toolId prop |

Other tools display `—` in the completion column on the admin dashboard
until they're instrumented.

## How to instrument a new tool

Inside the tool component, after the primary action succeeds (the
download triggers, the share saves, the conversion finishes), call:

```ts
import("@/lib/track").then(({ trackToolCompletionClient }) =>
  trackToolCompletionClient("the-tool-id")
);
```

Fire-and-forget — do not `await` it inside a click handler or you'll add
network latency to the UX.

Then add the tool ID to `INSTRUMENTED_TOOL_IDS` in `lib/admin.ts` so the
admin dashboard shows it as instrumented (otherwise the column displays
`—` even if events are arriving).

## Rate limiting

The client-side helper rate-limits to **one completion per tool per 5
minutes per browser** so an impatient user re-clicking Download three
times doesn't inflate the count. Same approach as the visit tracker
(which rate-limits to one per hour).
