# Share Tool — Phase 2 Setup (file uploads)

Phase 2 adds file sharing (≤25 MB) on top of the Phase-1 URL shortener and
text snippet tools. The code is deployed but **two manual setup steps must
happen in Supabase** before the file tab will work.

If you skip these, file uploads will fail with `Couldn't prepare the upload`
or `Upload network error`. The URL and text tabs keep working without
either step.

---

## 1. Create the `share-files` Storage bucket

In **Supabase → Storage → New bucket**:

- **Name:** `share-files` (exactly — the server hardcodes this)
- **Public bucket:** **OFF**. We use signed URLs for both upload and
  download, so the bucket must be private. A public bucket would let
  anyone enumerate slugs by guessing.
- **File size limit:** `26214400` bytes (25 MB)
- **Allowed MIME types:** leave empty (we enforce types server-side; the
  bucket-level filter is a backup belt that we don't need to wear)

Click **Create**.

## 2. Add the storage policies

By default a private bucket lets only the service-role key in. The signed
upload URLs we issue from `/api/share/file/init` work via the service role,
so no `anon` policies are strictly required for uploads. **However**, the
signed *download* URLs we issue from `/api/share/[slug]/access` are
fetched directly from the browser — and Supabase will reject them
without at least a read policy that matches the signed URL flow.

The easiest path is the **SQL Editor** — Supabase also has a per-bucket
"New policy" wizard but it splits the SQL across fields and is easy to
fill out wrong. Use SQL Editor.

Go to **SQL Editor → New query** (left sidebar, NOT under Storage), paste:

```sql
-- Allow reads via signed URLs only. Without this policy, even valid
-- signed-URL reads return 400 because the bucket has no policy at all
-- and `service_role` is not the role the browser uses to fetch the file.
create policy if not exists "share_files_signed_read"
on storage.objects for select to anon, authenticated
using (bucket_id = 'share-files');
```

Click **Run**. Expect "Success. No rows returned."

> **Note:** Signed-URL requests don't hit the row-level policy in
> practice — they're authorised by the signature itself. But Supabase's
> Storage RLS requires *some* SELECT policy to exist for the bucket, or
> all reads fail. The policy above is the minimal one.

<details>
<summary>If you prefer the Storage → Policies wizard</summary>

The wizard wants the SQL broken into three pieces — DON'T paste the
full `create policy …` statement into the "Policy definition" box; it
only accepts the boolean expression that goes inside `using (…)`. Fill
it out like this:

- **Allowed operation:** check **SELECT**
- **Target roles:** leave blank (defaults to `public` which covers
  `anon` and `authenticated`)
- **Policy definition:** `bucket_id = 'share-files'`

Click Review → Save.

</details>

## 3. (Optional) CORS for direct uploads

The Supabase default CORS config allows uploads from any origin, which is
fine because each upload URL is signed and one-shot. **Only restrict if
abuse becomes a real problem.** When you do, add `https://utilityapps.site`
under **Storage → Configuration → CORS → Allowed origins**.

## 4. Verify

After steps 1–2, go to `utilityapps.site/tools/share` and:

1. Pick the **Share File** tab.
2. Drop in a small file (any image under 1 MB).
3. Click **Create Share Link**.
4. You should see the progress bar fill, the success view appear, and a
   working `/s/<slug>` link.

If you see "Couldn't prepare the upload" → step 1 is missing (bucket
doesn't exist or wrong name). If you see "Upload network error" or the
progress bar stalls at 0% → step 1 is wrong (wrong size limit) or the
CORS config rejects browser uploads. If you see the success view but the
recipient page is blank → step 2 is missing (no SELECT policy on the
bucket).

## What this gives you

- File uploads up to 25 MB go **direct to Supabase Storage**, bypassing
  Vercel's 4.5 MB body limit on the Hobby plan.
- Files are downloaded via 1-hour signed URLs — never exposed publicly.
- Image and PDF shares preview inline on the recipient page; other file
  types show a download card.
- File-share creation is rate-limited to **5 per hour per IP** (vs
  20/hour for text and URLs).
- All other Phase-1 features (password, custom slug, view limit,
  expiration, QR codes, auto-delete on report) work identically for
  files.

## What's still deferred (Phase 3)

- Upstash Redis for rate limiting (currently in-database)
- Vercel cron for periodic Storage + DB cleanup of expired shares
- Admin dashboard at `/admin/shares`
- Per-IP storage quota across all shares
