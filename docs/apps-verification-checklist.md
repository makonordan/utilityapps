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

## Status (as of 2026-07-17)

**220 of 331 listings are verified and publish to production**, across all 15
categories:

| Category | Total | Published | Unverified |
| --- | --- | --- | --- |
| Invoicing & Accounting (`invoicing-accounting.ts`) | 50 | 43 | 7 |
| Project Management (`project-management.ts`) | 20 | 8 | 12 |
| Email Marketing (`email-marketing.ts`) | 20 | 17 | 3 |
| HR & Payroll (`hr-payroll.ts`) | 21 | 10 | 11 |
| Developer Tools (`dev-tools.ts`) | 20 | 18 | 2 |
| Education & Learning (`education.ts`) | 20 | 11 | 9 |
| Finance & Banking (`finance-banking.ts`) | 20 | 16 | 4 |
| Communication & Telecoms (`communication-telecoms.ts`) | 20 | 9 | 11 |
| E-commerce (`ecommerce.ts`) | 20 | 16 | 4 |
| Data & Analytics (`data-analytics.ts`) | 20 | 10 | 10 |
| AI Tools (`ai-tools.ts`) | 20 | 18 | 2 |
| CRM (`crm.ts`) | 20 | 15 | 5 |
| Customer Support (`customer-support.ts`) | 20 | 12 | 8 |
| Legal & Compliance (`legal.ts`) | 20 | 5 | 15 |
| Design & Creative (`design.ts`) | 20 | 12 | 8 |

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
  inconsistent numbers.
- **Saasu** — pricing page returned marketing copy without a clear, current
  tier breakdown.
- **Govchain Books** — the `/pricing` URL on govchain.co.za is for company
  registration, not the Books product; actual Books pricing was never
  located.
- **Moon Invoice** — official pricing page is JS-rendered; aggregator sites
  report conflicting tier prices.

### Project Management

- **monday**, **clickup**, **teamwork**, **linear** — Free/entry tier
  confirmed; higher tiers only show the "billed yearly" figure, no separate
  monthly-only rate disclosed.
- **wrike** — Free confirmed; Business+ is explicitly annual-only, but Team's
  monthly rate wasn't found.
- **basecamp** — Pro's monthly price confirmed, but no annual-discount figure
  found.
- **paymo** — monthly prices confirmed, but no annual-billing number found.
- **shortcut** — page claims an annual discount but the quoted totals equal
  monthly × 12 exactly — internally inconsistent.
- **nifty** — page returned two conflicting pricing tables for the same plan
  names.
- **smartsheet** — scraped numbers were garbled.
- **zoho-projects** — Free plan confirmed (5 users, 3 projects, 5GB, 50
  workflow executions/mo), but paid tiers render prices via JavaScript that
  couldn't be captured.
- **jira** — pricing page repeatedly returned truncated/inaccessible.

### Email Marketing

- **ActiveCampaign** — JS contact-count slider masks figures to automated
  fetch; third-party aggregators disagreed on monthly vs. annual billing.
- **Sendlane** — acquired by Privy (Jan 2026); pricing in transition, no
  reliable self-serve entry point.
- **Flodesk** — overhauled its pricing model (Dec 2025); sources disagree on
  whether a genuine free plan still exists.

### HR & Payroll

- **Rippling** — modular per-module pricing; vendor page blocked automated
  fetch.
- **ADP Run**, **Paychex**, **Paycor** — no reliable self-serve pricing
  published.
- **Workday** — enterprise, fully custom/sales-led.
- **Namely** — one plan has a cited price, the rest are custom-quote only.
- **HiBob**, **Greenhouse**, **Lever** — pages are demo-request/quote-only
  funnels, no prices shown.
- **Personio** — third-party estimates range too widely to publish as fact.
- **Breathe HR** — two conflicting sets of banded UK prices found.

### Developer Tools

- **Render** — render.com/pricing is JS-rendered; repeated fetches returned
  only nav/footer content, no tier numbers.
- **Bubble** — bubble.io/pricing is JS-rendered; third-party aggregator
  figures exist but weren't treated as vendor-verified.

### Education & Learning

- **Canvas (Instructure)**, **SAP Litmos** — pricing pages name tiers but
  disclose no dollar figures (institutional sales-led).
- **Docebo**, **Absorb LMS**, **Cornerstone OnDemand** — confirmed quote-only
  via direct fetch.
- **iSpring Learn** — pay-per-active-user model described, no dollar figures
  published.
- **Udemy Business** — pricing page returned HTTP 403 on repeated attempts.
- **Coursera for Business** — Team plan is JS-rendered, Enterprise is
  quote-only.
- **LinkedIn Learning** — pricing sits behind LinkedIn's login wall.

### Finance & Banking

- **Bluevine**, **Revolut Business**, **American Express Business
  Blueprint** — pricing/fee structure not confirmed to the standard this
  directory requires; needs a direct live-page check.

### Communication & Telecoms

- **Zoom**, **Cisco Webex**, **GoTo Meeting**, **Whereby**, **RingCentral**,
  **Grasshopper**, **Nextiva**, **Dialpad**, **Vonage Business
  Communications**, **8x8**, **Aircall** — not confirmed to the standard this
  directory requires (JS-rendered pricing calculators or region-gated pages
  were the common blocker); needs a direct live-page check per listing.

### E-commerce

- **Squarespace Commerce**, **Adobe Commerce**, **Clover**, **ShipBob** — not
  confirmed to the standard this directory requires; needs a direct
  live-page check.

### Data & Analytics

- **Tableau**, **Looker**, **Domo**, **Sisense**, **Qlik Sense**, **Zoho
  Analytics**, **Google Analytics 360**, **Twilio Segment**, **Hotjar**,
  **Mode Analytics** — enterprise BI/analytics platforms are frequently
  quote-only or JS-rendered; needs a direct live-page check per listing.

### AI Tools

- **ChatGPT**, **Midjourney** — not confirmed to the standard this directory
  requires (AI product pricing changes unusually often); needs a direct
  live-page check. Treat AI-category pricing as higher priority to re-verify
  on a recurring basis given how fast it moves.

### CRM

- **Zoho CRM**, **Agile CRM**, **Bigin** — not confirmed to the standard
  this directory requires; needs a direct live-page check.
- **Capsule CRM** — Free plan confirmed ($0/mo, 2 users, 250 contacts, 5
  custom fields, 1 pipeline). Paid Starter/Growth/Advanced tiers exist with
  an annual-vs-monthly toggle and an "up to 15% off annual" claim, but exact
  per-user dollar prices weren't extractable from the static page.

### Customer Support

- **Kayako** — shifted to an outcome-based pricing model with no published
  flat rate.
- **HappyFox** — no standing free tier for the core Help Desk product
  (limited-time promos aside).
- **Gladly**, **Kustomer** — pure demo-request/quote-only funnels, no dollar
  figures published anywhere.
- **Jira Service Management** — same truncated-fetch issue documented for
  Jira Software elsewhere in this directory.
- **Intercom** — no free tier (14-day trial only); per-seat pricing sits
  behind a JS pricing calculator. The one confirmed figure is the Fin AI
  Agent add-on at $0.99 per resolved conversation.
- **Gorgias** — pricing confirmed to scale with monthly ticket volume, but
  the exact tier breakpoints weren't captured.

### Legal & Compliance

- **Vanta**, **Drata**, **Secureframe**, **OneTrust**, **Ironclad**, **Juro**
  — vendor's own pricing page confirmed directly: fully custom/quote-gated,
  no dollar figures published anywhere.
- **Icertis** — no public pricing exists at all; enterprise sales-led, same
  situation as NetSuite/Sage Intacct elsewhere in this directory.
- **Sprinto** — no public pricing; third-party estimates range too widely
  (high four figures to tens of thousands annually) to publish as fact.
- **ContractSafe** — volume-band interactive selector; no flat dollar
  figures shown without picking a band.
- **Zoho Sign** — free plan confirmed ($0, 1 user, 5 envelopes/mo); paid
  tiers render via JavaScript and weren't extractable.
- **Dropbox Sign**, **Adobe Acrobat Sign**, **signNow**, **Clio**,
  **LawDepot** — genuine access failures (404s, DNS timeouts, bot-blocking,
  or JS-rendered pages with no extractable content across multiple attempts).

### Design & Creative

- **Canva**, **Adobe Creative Cloud**, **Adobe Premiere Pro** — vendor pages
  consistently returned HTTP 403 or timed out across 6+ retries with varied
  URLs.
- **Gamma (design)**, **Piktochart**, **CapCut**, **Filmora** — same
  403/timeout pattern; third-party aggregator figures exist but disagreed
  with each other on exact numbers (especially CapCut/Filmora), so they
  weren't used to fill in "verified" numbers.
- **Affinity** — flagged for a human look: research strongly suggests
  Affinity's pricing model changed materially after Canva's acquisition
  (was one-time-purchase, now appears free with paid AI features gated
  behind a Canva Pro subscription), but this couldn't be confirmed via
  direct fetch (403/redirect/DNS failure on every attempt). Listed as
  `pricingModel: "freemium"` rather than the old "one-time" pending
  confirmation — don't assume the old model still applies.

To unblock any of these: open the vendor's live pricing page directly in a
browser (not via automated fetch, which fails on JS-rendered pages), record
the real tiers, and fill in `pricing`, `hasFreeTier`, `freeTierReality`,
`startingPrice`, `currency`, and `pricingVerifiedDate` in the relevant data
file.

## Remaining polish (does not block publishing)

These fields aren't part of the `isPricingVerified()` gate, so verified
listings are already live without them — but are still worth filling in over
time:

- **`integrations`** — every listing across all 15 categories still has
  `["VERIFY"]`. Replace with the real, current integration list from each
  vendor's app marketplace page.
- **`logoUrl`** — resolved for all 331 listings via Google's public favicon
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
- **Crunch** — Premium tier price is the accountant-inclusive starting
  point; full accountancy-service tiers run considerably higher and need a
  fresh quote.
- **Reckon One** — Premium tier's exact price wasn't published in a
  self-serve comparison table; only Starter/Plus were confirmed directly.
- **Sage Pastel Partner** — only the Start tier's price was shown without
  login; Core/Plus require selecting options on-site.
- **sevDesk / Lexware Office** — figures are for the German (.de) market;
  Austria/Switzerland pricing may differ.
- **Exact Online** — figures are Dutch (EUR) rates; other countries see
  different pricing/currency.
- **MYOB** — plan names/prices have shifted multiple times in the past two
  years; re-confirm against the live page periodically.

### HR & Payroll

- **Gusto**, **Justworks**, **TriNet Zenefits** — vendor pricing pages
  blocked automated fetch (403); figures were cross-referenced across
  multiple independent, consistent third-party sources instead of a single
  direct fetch.
- **Sage HR** — US rate confirmed; Canada pricing differs.
- **QuickBooks Payroll** — plan renamed (Core → Workforce Payroll) effective
  2026-07-01; the listing reflects the new name.

### Developer Tools

- **DigitalOcean**, **Fly.io** — usage-based infrastructure pricing, not a
  flat SaaS tier ladder; `pricing[]` reflects the real, confirmed
  entry-point numbers (e.g. Droplet $4/mo) with the usage-based caveat
  spelled out in `freeTierReality` rather than a fabricated tier structure.
- **Airtable** — top-level tier prices confirmed, but exact per-base
  record/storage/automation caps weren't disclosed on the vendor page.
- **Okta** — the core Workforce Identity SSO/MFA suite is the primary
  listing; Auth0 (Okta's separate Customer Identity product) has very
  different, much higher starting pricing, noted in `freeTierReality`.

### E-commerce

- **Podia** appears twice, deliberately, under two different ids —
  `podia` (Education & Learning, course-creation angle) and
  `podia-ecommerce` (E-commerce, digital-product-selling angle). Same
  vendor, same pricing, two different buyer intents; this is intentional,
  not a data error.

### CRM

- Avoid re-adding **monday.com**'s CRM product or **ActiveCampaign**'s CRM
  features under a plain `monday`/`activecampaign` id — those ids are
  already taken by the Project Management and Email Marketing listings for
  the same vendors. Use a distinct id (e.g. `monday-crm`) if either is ever
  added here.

### Design & Creative

- **Descript** and **Gamma** each appear twice, deliberately — `descript`
  and `gamma` under AI Tools (their AI-powered angle: AI video/podcast
  editing, AI presentation generation), `descript-design` and
  `gamma-design` under Design & Creative (their editing/presentation-tool
  angle). Same vendors, same pricing, two different buyer intents; follow
  this `-design`/`-ecommerce`-style suffix pattern for any future vendor
  that legitimately spans two categories.

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
6. Check for `id` collisions against every other category file before
   committing — a vendor that legitimately belongs in two categories (see
   the Podia note above) needs two distinct ids, since `ALL_APPS_BY_ID` in
   `lib/apps/index.ts` keys on `id` alone across the whole directory.
7. Update the status table and "Still unverified" section above.
