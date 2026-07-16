# Apps directory — pricing verification checklist

Working document for the Apps directory (`lib/apps/data/*.ts`). Every listing
is scaffolded with placeholder `"VERIFY"` values for anything price-related —
none of these numbers were invented, and none go live until checked against
the vendor's own pricing page (directly, or cross-referenced against multiple
independent sources when the live page was JS-rendered/geo-priced/blocked to
automated fetch).

**A listing is hidden from production automatically** (see
`isPricingVerified()` in `lib/apps/index.ts`) until `pricing`, `hasFreeTier`,
`freeTierReality`, `startingPrice`, and `currency` are all filled with real
values (not the `"VERIFY"` sentinel) and `pricingVerifiedDate` is set. In
development, unverified listings still render but log a console warning.

## Status (as of 2026-07-16)

**78 of 111 listings are verified and publish to production**, across four
categories:

| Category | Total | Published | Unverified |
| --- | --- | --- | --- |
| Invoicing & Accounting (`invoicing-accounting.ts`) | 50 | 43 | 7 |
| Project Management (`project-management.ts`) | 20 | 8 | 12 |
| Email Marketing (`email-marketing.ts`) | 20 | 17 | 3 |
| HR & Payroll (`hr-payroll.ts`) | 21 | 10 | 11 |

## Still unverified

### Invoicing & Accounting

- **Oracle NetSuite** — no public pricing exists at all; sold exclusively via
  custom sales quote.
- **Sage Intacct** — same situation as NetSuite: enterprise sales-led, no
  self-serve pricing page.
- **Digits** — no public pricing page found; appears to be fully
  sales-assisted onboarding for funded startups.
- **Vyapar** — official pricing page (vyaparapp.in/pricing) is JS-rendered
  and inaccessible to automated fetch; third-party reseller listings quote
  inconsistent numbers (₹699/yr in one place, ₹3,420/yr in another).
- **Saasu** — pricing page returned marketing copy ("from $15/mo per file")
  without a clear, current tier breakdown.
- **Govchain Books** — the `/pricing` URL on govchain.co.za is for company
  registration, not the Books product; actual Books pricing was never
  located.
- **Moon Invoice** — official pricing page is JS-rendered; aggregator sites
  report conflicting tier prices ($7.99/$9.99/$14.99/$19.99 vs.
  $9.99/$19.99/$39.99 in different sources).

### Project Management

Several of these are pages that only publish the annual-billed rate — the
true month-to-month price wasn't confirmed, and it's not assumed equal:

- **monday**, **clickup**, **teamwork**, **linear** — Free/entry tier
  confirmed; higher tiers only show the "billed yearly" figure, no separate
  monthly-only rate disclosed.
- **wrike** — Free confirmed; Business+ is explicitly annual-only
  (`priceAnnual` uses `null` correctly there), but Team's monthly rate wasn't
  found.
- **basecamp** — Pro's monthly price ($15) confirmed, but no annual-discount
  figure found.
- **paymo** — monthly prices confirmed (with an "increases after 3 months"
  promo caveat), but no annual-billing number found.
- **shortcut** — page claims "up to 25% off annual" but the quoted annual
  totals equal monthly × 12 exactly — internally inconsistent.
- **nifty** — page returned two conflicting pricing tables (flat-rate vs.
  per-member) for the same plan names.
- **smartsheet** — scraped numbers were garbled (e.g. a price mixed with a
  list of regional currencies).
- **zoho-projects** — pricing page is JS-rendered; repeated fetches returned
  plan names/features but zero dollar figures.
- **jira** — atlassian.com/software/jira/pricing repeatedly returned
  truncated/inaccessible.

### Email Marketing

- **ActiveCampaign** — official pricing page uses a JS contact-count slider
  that returns masked figures to automated fetch; third-party aggregators
  disagreed on whether cited numbers were monthly or annual-billed.
- **Sendlane** — acquired by Privy (January 2026); pricing appears to be in
  transition (sources cite ~$600/mo vs. ~$625/mo), no reliable self-serve
  entry point.
- **Flodesk** — overhauled its pricing model (2025-12-02, flat-rate unlimited
  → subscriber-tiered); sources disagree on whether a genuine free plan still
  exists for new customers.

### HR & Payroll

- **Rippling** — modular per-module pricing; vendor page blocked automated
  fetch, third-party figures explicitly hedge as non-final.
- **ADP Run** — no official pricing published; only unreliable third-party
  estimates exist.
- **Paychex** — only the entry tier has an unofficial cited rate; the rest is
  quote-only.
- **Paycor** — confirmed via direct fetch: no pricing published anywhere.
- **Workday** — enterprise, fully custom/sales-led (expected to stay
  unverified — same category as NetSuite/Sage Intacct).
- **Namely** — one plan has a cited price, the other three are custom-quote
  only.
- **HiBob** — confirmed via direct fetch: page is a demo-request form, no
  pricing shown.
- **Personio** — third-party estimates range $3–$15/employee/mo, too wide a
  spread to publish as fact.
- **Breathe HR** — two conflicting sets of banded UK prices found,
  unreconcilable.
- **Greenhouse** — confirmed via direct fetch: "pricing is customized," no
  public tiers.
- **Lever** — confirmed via direct fetch: pricing "available upon request"
  only.

To unblock any of these: open the vendor's live pricing page directly in a
browser (not via automated fetch, which fails on JS-rendered pages), record
the real tiers, and fill in `pricing`, `hasFreeTier`, `freeTierReality`,
`startingPrice`, `currency`, and `pricingVerifiedDate` in the relevant data
file.

## Remaining polish (does not block publishing)

These fields aren't part of the `isPricingVerified()` gate, so verified
listings are already live without them — but are still worth filling in over
time:

- **`integrations`** — every listing across all four categories still has
  `["VERIFY"]`. Replace with the real, current integration list from each
  vendor's app marketplace page.
- **`logoUrl`** — resolved for all 111 listings via Google's public favicon
  endpoint (`https://www.google.com/s2/favicons?domain=<domain>&sz=128`),
  keyed off each app's own `website` domain. This was chosen after
  confirming Clearbit's logo API — the more commonly recommended option — no
  longer resolves at all (DNS failure, effectively dead as of 2026-07).
  Favicon-grade image quality, not a curated brand-logo pack; `AppLogo`
  renders a colored initial as a fallback for the handful of listings where
  it's ever missing.
- **`hasAffiliateProgram`** — most listings carry a confident `true`/`false`
  based on general knowledge of the vendor's public affiliate program, but a
  number are still `"VERIFY"`; worth a pass to confirm each one directly.
- **`lastReviewed`** — set alongside `pricingVerifiedDate` for every listing
  verified in its category's research pass; update it whenever the editorial
  fields (`tagline`, `verdict`, `bestFor`, `avoidIf`, `pros`, `cons`) get a
  fresh human review.
- Editorial fields marked `// DRAFT - review before publish` are reasoned
  drafts, not verified facts — worth a human editorial pass, especially for
  tone/accuracy as vendors change their products.

## Known caveats on specific verified listings

### Invoicing & Accounting

- **Sage Business Cloud Accounting** — figures are the US-market rates;
  plan names/prices differ by country (e.g. UK uses different GBP pricing).
- **FreeAgent** — priced by business type (Landlords/Sole Trader/
  Partnerships/Limited Company), not a single flat plan.
- **Kashoo** — now sold as three flat-rate plans under the TrulySmall/Kashoo
  branding, not a single plan.
- **Crunch** — Premium tier price (£21.60+VAT) is the accountant-inclusive
  starting point; full accountancy-service tiers run considerably higher
  (~£185+VAT/mo) and need a fresh quote.
- **Reckon One** — Premium tier's exact price wasn't published in a
  self-serve comparison table; only Starter/Plus were confirmed directly.
- **Sage Pastel Partner** — only the Start tier's price (R1,375) was shown
  without login; Core/Plus require selecting options on-site.
- **sevDesk / Lexware Office** — figures are for the German (.de) market;
  Austria/Switzerland pricing may differ.
- **Exact Online** — figures are Dutch (EUR) rates as of April 2026; other
  countries see different pricing/currency.
- **MYOB** — plan names/prices have shifted multiple times in the past two
  years; re-confirm against the live page periodically.

### HR & Payroll

- **Gusto**, **Justworks**, **TriNet Zenefits** — vendor pricing pages
  blocked automated fetch (403); figures were cross-referenced across
  multiple independent, consistent third-party sources instead of a single
  direct fetch.
- **Sage HR** — US rate confirmed; Canada pricing differs and the
  sage.com/ca pricing path 404'd during research.
- **QuickBooks Payroll** — plan is being renamed (Core → Workforce Payroll)
  effective 2026-07-01; the listing reflects the new name.

## After verifying

Once a listing's `pricingVerifiedDate` is set and no gating field still
holds `"VERIFY"`, it publishes automatically — `isPricingVerified()` in
`lib/apps/index.ts` is what gates the production `ALL_APPS` export. No code
change is needed beyond editing the data file.

## Adding a new category

1. Create `lib/apps/data/<category-id>.ts` following the exact structure of
   an existing file (header comment, `AppListing[]` shape, `// DRAFT` markers
   on unverified editorial fields).
2. Add the category to `APP_CATEGORIES` in `lib/apps/types.ts`.
3. Import and spread the new array into `RAW_APPS` in `lib/apps/index.ts`.
4. Only use the fixed enum values already defined in `types.ts`
   (`Region`, `BusinessSize`, `PricingModel`, `INDUSTRIES`) — the filter UI
   hardcodes these lists, so an invented value will typecheck but silently
   never appear as a filter option.
5. Set `logoUrl` to `https://www.google.com/s2/favicons?domain=<domain>&sz=128`
   for every listing, verified or not (doesn't gate publishing).
6. Update the status table and "Still unverified" section above.
