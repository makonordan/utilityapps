# Apps directory — pricing verification checklist

Working document for publishing the **Invoicing & Accounting** category
(`lib/apps/data/invoicing-accounting.ts`). Every listing was scaffolded with
placeholder `"VERIFY"` values for anything price-related — none of these
numbers were invented, and none should go live until checked against the
vendor's own pricing page below.

**A listing is hidden from production automatically** (see
`isPricingVerified()` in `lib/apps/index.ts`) until every one of its
`VERIFY` fields has been replaced and `pricingVerifiedDate` is set to the
date you checked. In development, unverified listings still render but log
a console warning so you can preview them while working through this list.

## How to verify each app

For each listing below, open the pricing source URL and fill in:

1. **`pricing`** — replace the single placeholder tier with the real list of
   plans. For each tier: `name`, `priceMonthly`, `priceAnnual` (or `null` if
   annual isn't offered separately), `currency`, and `keyLimits` (e.g. "up to
   5 clients", "1 user included").
2. **`hasFreeTier`** — confirm this is still accurate (already set as a
   best-effort structural guess; flip if wrong).
3. **`freeTierReality`** — one honest sentence on what the free tier (if any)
   actually allows, or "No free tier — N-day trial only" if there isn't one.
4. **`startingPrice`** + **`currency`** — the cheapest paid plan's monthly
   price (or the free tier's $0 if `hasFreeTier` is the entry point), in the
   currency actually shown on the pricing page for your target market.
5. **`integrations`** — replace with the real, current list of notable
   integrations from the vendor's app marketplace / integrations page.
6. **`logoUrl`** — add a real logo asset (self-hosted under `/public/` or a
   stable CDN URL — do not hotlink to a vendor's own site).
7. **`hasAffiliateProgram`** — confirm whether a public affiliate/partner
   program currently exists (some were pre-marked `true` with high
   confidence; check the rest).
8. **`pricingVerifiedDate`** — set to today's date (ISO `YYYY-MM-DD`) once
   1–7 are done. This is what flips the listing into the published set.
9. **`lastReviewed`** — set once you've also sanity-checked the editorial
   fields below.

Also review the editorial fields marked `// DRAFT - review before publish`
in the data file (`tagline`, `verdict`, `bestFor`, `avoidIf`, `pros`, `cons`)
— these are reasoned drafts, not verified facts, and need your own judgement
before publishing.

## Checklist

- [ ] **FreshBooks** — https://www.freshbooks.com/pricing
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality (FreshBooks has no free plan — confirm trial length)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **QuickBooks Online** — https://quickbooks.intuit.com/pricing/
  - [ ] Confirm which regional product (US/UK/CA/AU/IN) this listing represents
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality (no permanent free plan — confirm trial length)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Xero** — https://www.xero.com/us/pricing-plans/
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality (no free plan — confirm trial length)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Wave** — https://www.waveapps.com/pricing
  - [ ] Pricing tiers, prices, currency (Starter free / Pro paid + add-ons)
  - [ ] Free tier reality — exact scope of the free Starter plan
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Zoho Books** — https://www.zoho.com/us/books/pricing/
  - [ ] Pricing tiers, prices, currency (5 paid tiers + free plan)
  - [ ] Free tier reality — confirm revenue cap and feature limits
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Invoice Ninja** — https://invoiceninja.com/pricing-plans/
  - [ ] Pricing tiers, prices, currency (self-hosted vs. hosted — note both)
  - [ ] Free tier reality — client cap on hosted free plan
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Bonsai** — https://www.hellobonsai.com/pricing
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality (no free plan — confirm trial length)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Harvest** — https://www.getharvest.com/pricing
  - [ ] Pricing tiers, prices, currency (Free / Teams / Enterprise, Flex vs Unlimited)
  - [ ] Free tier reality — seat/project cap on the free plan
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Bill.com** — https://www.bill.com/product/pricing
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality (no free plan for core AP/AR — confirm)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Sage Business Cloud Accounting** — https://www.sage.com/en-us/sage-business-cloud/accounting/pricing/
  - [ ] **Confirm this is the correct current pricing URL** — Sage's product
        naming/URLs shift by region (search turned up both a US "Sage 50"
        page and a Nigeria "Sage Business Cloud Accounting" page); find the
        page for your target region before trusting anything else here
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **FreeAgent** — https://www.freeagent.com/pricing/
  - [ ] Pricing tiers, prices, currency (single plan — confirm current price)
  - [ ] Free tier reality — confirm current bank partnerships that grant free access
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Kashoo** — https://kashoo.com/pricing/
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality (no free plan — confirm trial length)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Invoicely** — https://invoicely.com/pricing
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality — exact monthly invoice cap
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Hiveage** — https://www.hiveage.com/pricing/
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality — exact client cap
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Moon Invoice** — https://www.mooninvoice.com/pricing
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Zoho Invoice** — https://www.zoho.com/us/invoice/pricing/
  - [ ] Confirm it is still entirely free (no paid tier) and note any usage caps
  - [ ] Free tier reality — user/project/invoice-per-year limits and branding rules
  - [ ] Starting price (should be 0)
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **PayPal Invoicing** — https://www.paypal.com/us/business/paypal-business-fees
  - [ ] Confirm no monthly/setup fee and current per-transaction fee schedule
  - [ ] Free tier reality — clarify "free to send, fee on payment" framing
  - [ ] Starting price / currency (transaction-fee based — document clearly)
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Stripe Invoicing** — https://stripe.com/invoicing/pricing
  - [ ] Confirm current Starter/Plus per-invoice fee percentages
  - [ ] Free tier reality — clarify "no monthly fee, pay per paid invoice" framing
  - [ ] Starting price / currency (usage-based — document clearly)
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

## Batch 2 — 32 additional listings

Same rules as above. A few of these need special attention beyond the usual
pricing check — flagged inline.

- [ ] **Square Invoices** — https://squareup.com/us/en/invoices/pricing
  - [ ] Pricing tiers, prices, currency (Free / Plus / Premium + per-transaction rates)
  - [ ] Free tier reality
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Melio** — https://meliopayments.com/pricing/
  - [ ] Pricing tiers, prices, currency (Go/Core/Boost/Unlimited)
  - [ ] Free tier reality — confirm free ACH scope
  - [ ] Starting price
  - [ ] Integrations list (QuickBooks/Xero sync)
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Digits** — https://digits.com
  - [ ] **No public pricing page found in research** — confirm whether one
        exists now, or whether pricing is genuinely sales-assisted only
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality (likely none — confirm)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Oracle NetSuite** — https://www.netsuite.com/portal/products/erp/order-management/pricing.shtml
  - [ ] **No public pricing exists — custom quote only.** Decide how (or
        whether) to represent a starting price on the public listing page;
        do not publish a specific number without direct confirmation from
        Oracle sales
  - [ ] Free tier reality (confirm: sales-led demo, not self-serve trial)
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Sage Intacct** — https://www.sage.com/en-us/sage-business-cloud/intacct/pricing/
  - [ ] **No public pricing exists — custom quote only.** Same handling
        question as NetSuite above
  - [ ] Free tier reality
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Clear Books** — https://www.clearbooks.co.uk/pricing/
  - [ ] Pricing tiers, prices, currency (Small/Medium/Large, £6-£32.80 range with intro discounts — confirm current discount status)
  - [ ] Free tier reality
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Pandle** — https://www.pandle.com/pricing/
  - [ ] Pricing tiers, prices, currency (free forever core + Pandle Pro ~£5-6.64/mo)
  - [ ] Free tier reality — exact scope of the free plan
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **QuickFile** — https://www.quickfile.co.uk/home/pricing
  - [ ] Pricing tiers, prices, currency (free by ledger-entry volume, £60/yr Large/Extra Large)
  - [ ] Free tier reality — exact ledger-entry cap
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Crunch** — https://www.crunch.co.uk/pricing
  - [ ] Pricing tiers, prices, currency (Free / Pro ~£10+VAT / Premium ~£21.60+VAT — confirm current figures)
  - [ ] Free tier reality
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Countingup** — https://countingup.com/small-businesses/pricing/
  - [ ] Pricing tiers, prices, currency (tiered by monthly deposit volume: ~£3/£9/£18)
  - [ ] Free tier reality (none — confirm intro free-period length)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Coconut** — https://www.getcoconut.com/pricing
  - [ ] **Confirm which pricing applies** — research surfaced accountant/practice
        pricing (£5.50/client/mo), not a clear consumer sole-trader plan; find
        the correct end-user pricing page
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Vyapar** — https://vyaparapp.in/pricing
  - [ ] **Confirm region** — Vyapar also runs a separate Pakistan product
        (vyaparpk.com) with its own pricing; make sure this listing matches
        the India-market page
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **TallyPrime** — https://tallysolutions.com/tally-monthly-subscription/
  - [ ] Pricing tiers, prices, currency (Silver/Gold; perpetual license ~₹18,000/₹54,000 vs. monthly subscription — pick one model and document both if relevant)
  - [ ] Free tier reality (none — confirm trial availability)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **myBillBook** — https://mybillbook.in/pricing
  - [ ] Pricing tiers, prices, currency (basic from ~Rs.399/yr)
  - [ ] Free tier reality
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Refrens** — https://www.refrens.com/pricing
  - [ ] Pricing tiers, prices, currency (free 15 docs + ~$135/yr premium)
  - [ ] Free tier reality — exact document/feature cap
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **ProfitBooks** — https://profitbooks.net/pricing/
  - [ ] Pricing tiers, prices, currency (free single-user plan + ~Rs.749/mo or Rs.7,499/yr)
  - [ ] Free tier reality — exact invoice/customer/product caps
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **MYOB** — https://www.myob.com/au/pricing
  - [ ] **Confirm current plan names** — MYOB's Australian plan lineup/pricing
        has changed multiple times recently (Solo/Business Lite/Pro/AccountRight
        Plus/Premier); verify against the live page, not this note
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality (none — confirm trial length)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Reckon One** — https://www.reckon.com/au/accounting-software/
  - [ ] **Find the exact modular-pricing page** — search results were
        inconsistent (~$10-$46/mo across sources); confirm current structure
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Saasu** — https://www.saasu.com/pricing/
  - [ ] Pricing tiers, prices, currency (per-file, from ~$15/mo)
  - [ ] Free tier reality (30-day free trial, no permanent free plan — confirm)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Sage Pastel Partner** — https://shop.sage.co.za/product/sage-50-cloud-pastel-partner/
  - [ ] **Confirm current edition/pricing lineup** — sold through Sage's SA
        shop and partner resellers, with per-annum pricing and separate
        monthly "Flex" options; figures were unclear in initial research
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Govchain Books** — https://www.govchain.co.za/books
  - [ ] **No specific pricing figures found in research** — the /pricing URL
        on this domain is for company registration, not Books; find the
        correct Books-specific pricing page/section
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **HoneyBook** — https://www.honeybook.com/pricing
  - [ ] Pricing tiers, prices, currency (Starter/Essentials/Premium — note recent price increases)
  - [ ] Free tier reality (none — confirm trial length, currently 30 days per research)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Dubsado** — https://www.dubsado.com/pricing
  - [ ] Pricing tiers, prices, currency (Starter $20/mo, Premier $40/mo — confirm current figures and add-on user/brand fees)
  - [ ] Free tier reality (lifetime free trial at low client volume — confirm exact cap)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **17hats** — https://17hats.com/pricing
  - [ ] Pricing tiers, prices, currency (single plan, currently ~$60/mo list price with promo pricing — confirm)
  - [ ] Free tier reality (none — 7-day trial only)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **sevDesk** — https://sevdesk.de/preise/
  - [ ] **Confirm target market** — figures found were for the German (.de)
        site; check whether Austria/Switzerland pricing differs
  - [ ] Pricing tiers, prices, currency (Free/Invoices/Accounting/Accounting Pro, 1/12/24-month contract options)
  - [ ] Free tier reality
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Lexware Office** — https://www.lexware.de/preise/
  - [ ] Pricing tiers, prices, currency (S/M/L/XL packages, €3.45-€19.90/mo range — note promo vs. regular pricing)
  - [ ] Free tier reality (none — confirm trial availability)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Moneybird** — https://www.moneybird.nl/prijzen/
  - [ ] Pricing tiers, prices, currency (Free/Starter €15/Growth €28/Professional €39, tiered by bank-transaction volume)
  - [ ] Free tier reality — exact transaction-count cap
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Exact Online** — https://www.exact.com/us/software/exact-online/prices
  - [ ] **Confirm correct regional pricing page and currency** — the page
        found showed USD figures ($158-$422/mo) for a Dutch-rooted product;
        find the pricing page for your actual target market
  - [ ] Pricing tiers, prices, currency
  - [ ] Free tier reality
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Holded** — https://www.holded.com/pricing
  - [ ] Pricing tiers, prices, currency (Plus €7.5 / Basic €14.5 / Standard €29.5 / Premium €99.5, plus HR/Inventory/POS/SII add-ons)
  - [ ] Free tier reality (none — 14-day trial, no card required)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [x] **GnuCash** — https://gnucash.org/
  - [x] Pricing tiers, prices, currency — genuinely $0, no paid tier exists (open-source, GPL-licensed)
  - [x] Free tier reality — 100% free forever, no locked features
  - [x] Starting price — $0
  - [ ] Integrations list (still VERIFY — not pricing-gating, but fill in before full publish polish)
  - [ ] Logo asset
  - [x] Affiliate program confirmation — no vendor, no affiliate program (false)
  - [x] pricingVerifiedDate set — 2026-07-15 (this listing publishes automatically; confirm the editorial fields still read correctly before considering it fully polished)

- [ ] **Manager.io** — https://www2.manager.io/cloud/pricing
  - [ ] Pricing tiers, prices, currency (free Desktop Edition + Cloud Edition ~$59/mo flat + self-hosted Server Edition)
  - [ ] Free tier reality — confirm Desktop Edition has no feature limits
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

- [ ] **Akaunting** — https://akaunting.com/open-source-accounting-software
  - [ ] Pricing tiers, prices, currency (self-hosted free with 2 user/1 company/1,000 invoice cap, or Cloud from ~$8-12/mo)
  - [ ] Free tier reality — confirm current self-hosted production-use limits and license terms (Business Source License)
  - [ ] Starting price
  - [ ] Integrations list
  - [ ] Logo asset
  - [ ] Affiliate program confirmation
  - [ ] pricingVerifiedDate set

## After verifying

Once a listing's `pricingVerifiedDate` is set and no field still holds
`"VERIFY"`, it publishes automatically — `isPricingVerified()` in
`lib/apps/index.ts` is what gates the production `ALL_APPS` export. No code
change is needed beyond editing the data file.
