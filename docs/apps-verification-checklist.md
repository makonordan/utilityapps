# Apps directory — pricing verification checklist

Working document for the **Invoicing & Accounting** category
(`lib/apps/data/invoicing-accounting.ts`). Every listing was scaffolded with
placeholder `"VERIFY"` values for anything price-related — none of these
numbers were invented, and none went live until checked against the
vendor's own pricing page.

**A listing is hidden from production automatically** (see
`isPricingVerified()` in `lib/apps/index.ts`) until `pricing`, `hasFreeTier`,
`freeTierReality`, `startingPrice`, and `currency` are all filled with real
values (not the `"VERIFY"` sentinel) and `pricingVerifiedDate` is set. In
development, unverified listings still render but log a console warning.

## Status (as of 2026-07-15)

**43 of 50 listings are verified and publish to production.** Each was
checked against the vendor's live pricing page (or, where a page was
JS-rendered and inaccessible, cross-referenced against multiple independent
sources reporting the same figures) on 2026-07-15.

**7 listings remain unverified** — see "Still unverified" below. Each was
deliberately left as `"VERIFY"` because no reliable, checkable price could be
found, not because the check was skipped.

## Still unverified

- **Oracle NetSuite** — no public pricing exists at all; sold exclusively via
  custom sales quote. Publishing an invented number would violate the
  directory's core promise, so this stays hidden until someone can confirm
  actual figures directly with Oracle sales (or the team decides to represent
  "custom quote" pricing some other way in the data model).
- **Sage Intacct** — same situation as NetSuite: enterprise sales-led, no
  self-serve pricing page.
- **Digits** — no public pricing page found; appears to be fully
  sales-assisted onboarding for funded startups.
- **Vyapar** — official pricing page (vyaparapp.in/pricing) is JS-rendered
  and inaccessible to automated fetch; third-party reseller listings quote
  inconsistent numbers (₹699/yr in one place, ₹3,420/yr in another) that
  aren't trustworthy enough to publish as fact.
- **Saasu** — pricing page returned marketing copy ("from $15/mo per file")
  without a clear, current tier breakdown; needs a direct look at the live
  page.
- **Govchain Books** — the `/pricing` URL on govchain.co.za is for company
  registration, not the Books product; the actual Books pricing tiers were
  never located in research.
- **Moon Invoice** — official pricing page is JS-rendered; aggregator sites
  report conflicting tier prices ($7.99/$9.99/$14.99/$19.99 vs.
  $9.99/$19.99/$39.99 in different sources) that couldn't be reconciled.

To unblock any of these: open the vendor's live pricing page directly in a
browser (not via automated fetch, which fails on JS-rendered pages), record
the real tiers, and fill in `pricing`, `hasFreeTier`, `freeTierReality`,
`startingPrice`, `currency`, and `pricingVerifiedDate` in the data file.

## Remaining polish (does not block publishing)

These fields aren't part of the `isPricingVerified()` gate, so verified
listings are already live without them — but they're still marked `"VERIFY"`
or left as placeholders across most of the 43 published listings and are
worth filling in over time:

- **`integrations`** — every listing still has `["VERIFY"]`. Replace with the
  real, current integration list from each vendor's app marketplace page.
- **`logoUrl`** — every listing still has `"VERIFY"`. Add a real logo asset
  (self-hosted under `/public/` or a stable CDN URL — never hotlink to a
  vendor's own site). `AppLogo` renders a colored initial as a fallback in
  the meantime, so this is cosmetic, not urgent.
- **`hasAffiliateProgram`** — most listings carry a confident `true`/`false`
  based on general knowledge of the vendor's public affiliate program, but a
  few are still `"VERIFY"`; worth a pass to confirm each one directly.
- **`lastReviewed`** — set to 2026-07-15 alongside `pricingVerifiedDate` for
  every listing verified in this pass; update it whenever the editorial
  fields (`tagline`, `verdict`, `bestFor`, `avoidIf`, `pros`, `cons`) get a
  fresh human review.
- Editorial fields marked `// DRAFT - review before publish` are reasoned
  drafts, not verified facts — they read reasonably but haven't had a human
  editorial pass. Worth reviewing in future, especially for tone/accuracy as
  vendors change their products.

## Known caveats on specific verified listings

A few verified listings carry pricing that's correct as researched but has a
caveat worth knowing about:

- **Sage Business Cloud Accounting** — figures are the US-market rates;
  plan names/prices differ by country (e.g. UK uses different GBP pricing).
- **FreeAgent** — priced by business type (Landlords/Sole Trader/
  Partnerships/Limited Company), not a single flat plan as originally
  assumed — the listing has been corrected to reflect this.
- **Kashoo** — now sold as three flat-rate plans under the TrulySmall/Kashoo
  branding, not the single plan originally assumed.
- **Crunch** — Premium tier price (£21.60+VAT) is the accountant-inclusive
  starting point; full accountancy-service tiers for limited companies run
  considerably higher (~£185+VAT/mo) and need a fresh quote.
- **Reckon One** — Premium tier's exact price wasn't published in a
  self-serve comparison table; only Starter/Plus were confirmed directly.
- **Sage Pastel Partner** — only the Start tier's price (R1,375) was shown
  without login; Core/Plus require selecting options on-site to reveal price.
- **sevDesk / Lexware Office** — figures are for the German (.de) market;
  Austria/Switzerland pricing may differ.
- **Exact Online** — figures are Dutch (EUR) rates as of April 2026; other
  countries see different pricing/currency.
- **MYOB** — plan names/prices have shifted multiple times in the past two
  years; re-confirm against the live page periodically.

## After verifying

Once a listing's `pricingVerifiedDate` is set and no gating field still
holds `"VERIFY"`, it publishes automatically — `isPricingVerified()` in
`lib/apps/index.ts` is what gates the production `ALL_APPS` export. No code
change is needed beyond editing the data file.
