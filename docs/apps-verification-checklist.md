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

## After verifying

Once a listing's `pricingVerifiedDate` is set and no field still holds
`"VERIFY"`, it publishes automatically — `isPricingVerified()` in
`lib/apps/index.ts` is what gates the production `ALL_APPS` export. No code
change is needed beyond editing the data file.
