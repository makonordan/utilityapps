# UtilityApps Store — Setup Guide

The store now sells **owned digital products** directly: buyer enters their
email → pays on Korapay → a confirmed payment triggers an automatic email with
a time-limited download link.

Three products are in the catalog — the AI prompt pack, the budget
spreadsheet and the resume pack. The downloadable file for each was generated
for you (see step 4).

Nothing is purchasable until the five steps below are done.

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

The three files were generated for you and are in the local `product-files/`
folder. Upload each into the `product-files` bucket with the **exact** object
name below:

| Product | Object name in bucket |
| --- | --- |
| AI Prompt Pack — 60 Pro Prompts | `ai-prompt-pack.pdf` |
| Simple Monthly Budget Spreadsheet | `budget-spreadsheet.xlsx` |
| ATS-Friendly Resume Template Pack | `resume-pack.docx` |

Regenerate any file at any time with `node scripts/build-<name>.mjs`.

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

## Adding more products later

To add another product, append an entry to the `PRODUCTS` array in
[`lib/products.ts`](lib/products.ts) with `kind: "owned"` and a `file:` set to
its object name in the `product-files` bucket, then upload the file. A product
with no `file:` shows as "Coming soon" and cannot be bought.

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
