# UtilityApps Store — Setup Guide

The store now sells **owned digital products** directly: buyer enters their
email → pays on Korapay → a confirmed payment triggers an automatic email with
a time-limited download link.

Six products are live in the catalog. Three are ready for files I generated
(prompt pack, budget spreadsheet, resume pack); three are "Coming soon" until
you create and upload their files (Canva templates, Lightroom presets, Notion
template).

Nothing is purchasable until the four steps below are done.

---

## 1. Environment variables

Add these in **Vercel → Project → Settings → Environment Variables** (and to
`.env.local` for local work):

| Variable | What it is |
| --- | --- |
| `KORAPAY_SECRET_KEY` | Korapay **secret** key (`sk_live_…` or `sk_test_…`). Server-only — never `NEXT_PUBLIC_`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key — Settings → API. Used to write orders and sign download links. |
| `RESEND_API_KEY` | Resend API key — sends the download email. (May already be set for the contact form.) |
| `RESEND_FROM` | From-address for emails, e.g. `noreply@utilityapps.site`. (Optional — defaults to that.) |

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are already used
by the site and must remain set.

> The checkout returns "temporarily unavailable" until `KORAPAY_SECRET_KEY` is
> set — so it is safe to deploy before configuring it.

## 2. Supabase — orders table

Run the `orders` table block at the bottom of [`lib/db/schema.sql`](lib/db/schema.sql)
in the Supabase SQL editor. It has RLS on with **no policies**, so it is
reachable only with the service-role key.

## 3. Supabase — Storage bucket

Create a **private** Storage bucket named exactly **`product-files`**:

Supabase → Storage → New bucket → name `product-files` → **uncheck "Public
bucket"** → Create.

Download links are minted as short-lived signed URLs, so the files are never
publicly accessible.

## 4. Upload the product files

Upload each file into the `product-files` bucket with the **exact** object name
the catalog expects (see the `file:` field in [`lib/products.ts`](lib/products.ts)):

| Product | Object name in bucket | Status |
| --- | --- | --- |
| AI Prompt Power Pack | `ai-prompt-pack.pdf` | Generated for you |
| Simple Monthly Budget Spreadsheet | `budget-spreadsheet.xlsx` | Generated for you |
| ATS-Friendly Resume Pack | `resume-pack.docx` | Generated for you |
| Canva Social Media Template Pack | _set later_ | You create |
| Lightroom Mobile Preset Pack | _set later_ | You create |
| Notion Life & Productivity Dashboard | _set later_ | You create |

A product is only purchasable once its file exists in the bucket — the checkout
verifies the file is there **before** charging, so a buyer can never be charged
for a missing file.

## 5. Korapay webhook

In the **Korapay dashboard → Settings → API & Webhooks**, set the webhook URL to:

```
https://utilityapps.site/api/webhooks/korapay
```

Korapay signs every webhook; the handler rejects any request whose signature
does not verify against your secret key.

---

## Going live with the three "Coming soon" products

When you have created the Canva pack, Lightroom presets and Notion template:

1. **File-based products (e.g. a preset `.zip`):** upload to the `product-files`
   bucket, then set `file:` on that product in `lib/products.ts` to the object
   name (and `fileFormat` to e.g. `"ZIP"`).
2. **Link-based products (Canva / Notion templates):** these are delivered as a
   share link, not a file. Put the share link in a tiny `.txt` or `.pdf`,
   upload that to the bucket, and set `file:` to it — the buyer receives the
   link to duplicate the template. (Or tell me and I'll wire a link-delivery
   path that emails the URL directly.)

Removing the `file:` field again turns a product back into "Coming soon".

## How the flow works

1. Buyer clicks **Buy now** → modal collects their email.
2. `POST /api/checkout` — looks up the product price server-side, records a
   `pending` order, asks Korapay for a checkout session, returns the URL.
3. Buyer is redirected to Korapay and pays.
4. Korapay calls `POST /api/webhooks/korapay`. The handler verifies the
   signature, re-checks the amount, marks the order `paid`, mints a 14-day
   signed download URL, and emails it via Resend. Order becomes `fulfilled`.
5. Buyer lands on `/checkout/success` — "check your email".

Webhook delivery is idempotent and retried by Korapay until it succeeds, so a
momentary email/storage hiccup self-heals.

## Testing

Use Korapay **test keys** first. Test cards are in the Korapay docs. Watch the
`orders` table move `pending → paid → fulfilled`, and confirm the email lands.
Switch to live keys when satisfied.
