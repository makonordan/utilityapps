import type { AppListing } from "../types";

// Scaffolded via Prompt 2 — 20 well-known Finance & Banking products spanning
// business banking accounts, expense/corporate cards, and payments/payouts
// platforms. Deliberately excludes invoicing/accounting software and payroll
// software — those are separate categories covered elsewhere in this
// directory.
//
// Every field tagged with the literal string "VERIFY" is a placeholder for
// a fact (pricing tier, price, free-tier limit, or integration list) that
// must be checked against the vendor's own live pricing page before this
// listing is published — see docs/apps-verification-checklist.md. Do not
// replace "VERIFY" with a remembered or guessed value.
//
// Three listings (Bluevine, Revolut Business, American Express Business
// Blueprint) could not be verified during this research pass — their pricing
// pages consistently returned HTTP 403 / connection resets to automated
// fetch across multiple URL variants. They're left with VERIFY pricing
// fields rather than guessed numbers, and stay hidden from production until
// someone confirms the figures via a real browser.
//
// One note from research: northone.com now 301-redirects its entire site
// (homepage and pricing page) to relayfi.com, indicating NorthOne no longer
// operates as an independent product — it was dropped from this list rather
// than listed as a live, separately-priced product.
//
// Editorial fields (tagline, verdict, bestFor, avoidIf, pros, cons) are
// well-reasoned drafts based on each product's general reputation and market
// positioning, marked "// DRAFT - review before publish" — apply your own
// judgement before these go live. Every listing partners with a chartered
// bank for FDIC insurance rather than being a bank itself (standard fintech
// "banking-as-a-service" structure) — called out explicitly where relevant
// since it's the kind of nuance easy to gloss over.
//
// The publish guard lives in lib/apps/index.ts (isPricingVerified /
// ALL_APPS): any listing still carrying a VERIFY pricing fact is excluded
// from the production directory automatically.

export const FINANCE_BANKING_APPS: AppListing[] = [
  {
    id: "mercury",
    name: "Mercury",
    // DRAFT - review before publish
    tagline: "Startup-favorite business banking with a genuinely free core account and clean, developer-friendly UX.",
    logoUrl: "https://www.google.com/s2/favicons?domain=mercury.com&sz=128",
    website: "https://mercury.com",

    category: "finance-banking",
    subCategory: "business-banking",
    industries: ["freelancers", "agencies", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["north-america"],
    regionNotes: "US-only (and US-incorporated companies) at account opening; not available to businesses without a US entity. Mercury is a fintech, not a bank — accounts are FDIC-insured through partner banks Choice Financial Group and Column N.A.",
    useCases: ["open a business checking account", "manage startup runway/treasury", "send/receive ACH and wires", "invoice clients", "reimburse team expenses"],
    pricingModel: "freemium",

    pricing: [
      { name: "Mercury", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Free checking & savings, unlimited bill pay, free USD debit/credit card transactions, basic invoicing, expense reimbursements for up to 5 users/month"] },
      { name: "Mercury Plus", priceMonthly: 29.9, priceAnnual: 23.95, currency: "USD", keyLimits: ["15% discount when billed annually ($23.95/mo effective); ACH-debit invoicing at $1/transaction, recurring invoices, Invoicing API (500/mo), reimbursements up to 20 users/mo"] },
      { name: "Mercury Pro", priceMonthly: 299, priceAnnual: 239.9, currency: "USD", keyLimits: ["15% discount when billed annually; dedicated relationship manager, free ACH-debit invoicing, unlimited Invoicing API calls, reimbursements up to 250 users/mo"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The base Mercury account is free forever with no minimum balance — real checking, savings, debit/credit cards, and bill pay, not a stripped trial. Plus ($29.90/mo, or $23.95/mo billed annually) and Pro ($299/mo, or $239.90/mo billed annually) exist to add ACH-debit invoicing volume, API limits, and support for larger reimbursement headcounts.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Free business checking and savings accounts",
      "Virtual and physical debit/credit cards",
      "Built-in invoicing and bill pay",
      "Treasury/yield accounts for idle cash",
      "Team expense reimbursements",
      "API access for banking automation",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for US-incorporated startups and small teams that want clean, free banking with genuinely useful software on top — not a fit for businesses without a US entity, or anyone who needs in-person branch banking.",
    bestFor: [
      "US startups and small businesses wanting free checking with modern software",
      "Teams that want banking, bill pay, and reimbursements in one dashboard",
    ],
    avoidIf: [
      "Your business isn't US-incorporated — Mercury requires a US entity to open an account",
      "You need in-person branch banking or cash deposit services",
    ],
    pros: [
      "Free tier is a real, full-featured checking account, not a stripped demo",
      "Clean, fast, developer-friendly interface and API",
      "Built-in invoicing and reimbursements reduce the need for extra tools",
    ],
    cons: [
      "US-only — no path for businesses without a US entity",
      "As a fintech (not a bank), FDIC coverage runs through partner banks, which has occasionally been a source of customer confusion during past industry-wide bank-partner disruptions",
      "No physical branches or cash deposit support",
    ],

    popularityScore: 90,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://mercury.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["currency-converter"],
  },
  {
    id: "novo",
    name: "Novo",
    // DRAFT - review before publish
    tagline: "Completely free business checking with no monthly fees, no minimums, and no transaction limits.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.novo.co&sz=128",
    website: "https://www.novo.co",

    category: "finance-banking",
    subCategory: "business-banking",
    industries: ["freelancers", "agencies", "consulting", "ecommerce", "retail"],
    businessSizes: ["solo", "small"],
    regions: ["north-america"],
    regionNotes: "US-only. Novo is a fintech, not a bank — deposits are FDIC-insured (up to $250,000) through partner bank Middlesex Federal Savings, F.A.",
    useCases: ["open a free business checking account", "reimburse third-party ATM fees", "invoice clients", "connect to accounting/payment tools"],
    pricingModel: "free",

    pricing: [
      { name: "Novo Checking", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["No monthly fees, no minimum balance, unlimited transactions; up to $7/mo reimbursed in third-party ATM fees domestically and internationally; free incoming wires"] },
    ],
    hasFreeTier: true,
    freeTierReality: "There is no paid tier at all — Novo's single checking account is free with no monthly fee, no minimum balance, and no stated transaction limits. Revenue comes from interchange and partner referrals rather than account fees, so the \"free tier\" is simply the whole product.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "No monthly fees, no minimum balance",
      "Third-party ATM fee reimbursement (up to $7/mo)",
      "Free incoming wires",
      "Up to 20 savings \"Reserves\" buckets within checking",
      "40+ integrations (Stripe, QuickBooks, Square, etc.)",
      "Built-in invoicing",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for solo founders and very small businesses that want genuinely free checking with no tiers to navigate — there's no premium tier to grow into, so fast-scaling teams may outgrow Novo's simplicity.",
    bestFor: [
      "Freelancers and solo founders who want zero-fee checking with no minimums",
      "Small businesses that don't need multi-user approval workflows or high-yield treasury tools",
    ],
    avoidIf: [
      "You need multiple team members with granular card/approval controls (see Relay or Ramp instead)",
      "Your business isn't US-incorporated",
    ],
    pros: [
      "Genuinely free with no tiers, no minimum balance, and no transaction caps",
      "ATM fee reimbursement is a real, practical perk for a no-fee account",
      "Simple, fast account opening aimed at solo/small businesses",
    ],
    cons: [
      "No paid tier for teams that outgrow single-user, single-workflow banking",
      "As a fintech (not a bank), it relies on a single partner bank (Middlesex Federal Savings) for FDIC coverage",
      "No cash deposit support and limited branch/in-person options",
    ],

    popularityScore: 75,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.novo.co/business-checking",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "bluevine",
    name: "Bluevine",
    // DRAFT - review before publish
    tagline: "Business checking with a high-yield interest option, aimed at small businesses wanting their idle cash to earn something.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.bluevine.com&sz=128",
    website: "https://www.bluevine.com",

    category: "finance-banking",
    subCategory: "business-banking",
    industries: ["freelancers", "agencies", "retail", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["north-america"],
    regionNotes: "US-only. Bluevine is a fintech, not a bank — banking services and FDIC insurance are provided through partner banks.",
    useCases: ["open a business checking account", "earn yield on checking balances", "access a business line of credit", "manage sub-accounts"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: "VERIFY" as unknown as boolean,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Business checking with tiered APY on balances",
      "Sub-accounts for budgeting/savings",
      "Business line of credit (separate lending product)",
      "Mobile check deposit",
      "Accounting software integrations",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small businesses wanting a fee-free checking account that pays interest on balances — pricing/tier details need direct confirmation before publishing since the vendor's pricing pages consistently blocked automated verification.",
    bestFor: [
      "Small businesses that keep a working-capital cushion and want it to earn yield",
      "Businesses that may also want to access Bluevine's line-of-credit lending product from the same provider",
    ],
    avoidIf: [
      "Your business isn't US-incorporated",
      "You need a global multi-currency account rather than a USD-only domestic account",
    ],
    pros: [
      "Interest-bearing checking is a genuine differentiator versus most free-checking fintech competitors",
      "Line-of-credit lending available from the same provider for businesses that need it",
      "Sub-accounts help with basic budgeting without a separate tool",
    ],
    cons: [
      "Pricing page blocked automated verification during this research pass — confirm current fee/tier structure directly before trusting published numbers",
      "US-only, no path for international businesses",
      "As a fintech (not a bank), FDIC coverage runs through a partner bank rather than Bluevine itself",
    ],

    popularityScore: 68,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.bluevine.com/business-checking",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "relay",
    name: "Relay",
    // DRAFT - review before publish
    tagline: "Multi-account business banking built for teams — up to 20+ checking accounts, per-card spend controls, and bookkeeping automation.",
    logoUrl: "https://www.google.com/s2/favicons?domain=relayfi.com&sz=128",
    website: "https://relayfi.com",

    category: "finance-banking",
    subCategory: "business-banking",
    industries: ["agencies", "consulting", "retail", "construction", "nonprofits"],
    businessSizes: ["small", "medium"],
    regions: ["north-america"],
    regionNotes: "US-only. Relay is a fintech, not a bank — banking services and FDIC insurance are provided through partner banks. Note: as of this research pass, northone.com fully redirects to relayfi.com, suggesting NorthOne has been folded into Relay.",
    useCases: ["run multiple checking accounts for budgeting", "issue team debit/credit cards with spend controls", "automate bookkeeping categorization", "batch vendor payments"],
    pricingModel: "freemium",

    pricing: [
      { name: "Starter", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 20 checking accounts, virtual/plastic debit cards (up to 50/cardholder/account), up to 5 credit cards/cardholder, 1.11% APY on savings, 1% cash back on credit cards, QuickBooks/Xero integrations"] },
      { name: "Grow", priceMonthly: 30, priceAnnual: null, currency: "USD", keyLimits: ["Up to 20 checking accounts, 1.75% APY on savings, 1.25% cash back, recurring invoices with auto-charge, batch vendor payments, bookkeeping automation, spend approval requests"] },
      { name: "Scale", priceMonthly: 90, priceAnnual: null, currency: "USD", keyLimits: ["Reduced from $120/mo; up to 50 checking accounts, 3.00% APY on savings, 1.5% cash back, 10 free same-day ACH transfers/mo, bill payment automation, cash flow forecasting, priority support"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The free Starter plan is a genuinely usable multi-account setup (up to 20 checking accounts, team debit/credit cards, basic bookkeeping tools) rather than a single-account trial — but higher savings APY, batch vendor payments, and cash flow forecasting are reserved for the $30/mo Grow and $90/mo Scale tiers.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Up to 20-50 sub-checking accounts for envelope-style budgeting",
      "Per-cardholder debit/credit card spend controls",
      "Bookkeeping automation and QuickBooks/Xero sync",
      "Batch vendor/bill payments",
      "Cash flow forecasting (Scale tier)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small teams that want to manage cash across many sub-accounts (payroll, taxes, vendors) without spreadsheets — the free tier alone covers most solo/small-team budgeting needs before Grow or Scale become worth paying for.",
    bestFor: [
      "Small businesses wanting envelope-style budgeting across many sub-accounts",
      "Teams that need per-employee card spend controls without a separate expense platform",
    ],
    avoidIf: [
      "You want a single simple checking account rather than a multi-account budgeting system",
      "Your business isn't US-incorporated",
    ],
    pros: [
      "Free tier supports up to 20 checking accounts — genuinely useful for envelope budgeting at no cost",
      "Per-cardholder spend controls without needing a separate corporate-card platform",
      "Native bookkeeping automation and accounting-software sync",
    ],
    cons: [
      "US-only, no international multi-currency support",
      "Savings APY on the free tier (1.11%) is notably lower than the paid tiers",
      "As a fintech (not a bank), FDIC coverage runs through partner banks",
    ],

    popularityScore: 72,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://relayfi.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "found",
    name: "Found",
    // DRAFT - review before publish
    tagline: "Business banking built specifically for self-employed people and sole proprietors, with built-in real-time tax estimates.",
    logoUrl: "https://www.google.com/s2/favicons?domain=found.com&sz=128",
    website: "https://found.com",

    category: "finance-banking",
    subCategory: "business-banking",
    industries: ["freelancers", "consulting"],
    businessSizes: ["solo"],
    regions: ["north-america"],
    regionNotes: "US-only, aimed specifically at sole proprietors and single-member LLCs. Found is a fintech, not a bank — FDIC insurance is provided through a partner bank.",
    useCases: ["separate business and personal finances as a freelancer", "estimate quarterly taxes automatically", "pay contractors and e-file 1099s", "send free invoices"],
    pricingModel: "freemium",

    pricing: [
      { name: "Found", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Business checking with debit card, up to 10 sub-accounts (\"Pockets\"), expense categorization and receipt scanning, real-time tax estimates, contractor payments + 1099 e-filing, unlimited free invoicing, 1 custom rule/tag"] },
      { name: "Found Plus", priceMonthly: 35, priceAnnual: 26.25, currency: "USD", keyLimits: ["$315/yr billed annually (25% discount); 1.50% APY on balances up to $20,000, import transactions from external accounts, unlimited auto-categorization rules and custom tags, priority phone support, 30-day free trial"] },
      { name: "Found Pro", priceMonthly: 80, priceAnnual: 60, currency: "USD", keyLimits: ["$720/yr billed annually (25% discount); 2.50% APY on all balances (no cap), 1% cash back on card purchases, dedicated account manager, premium metal debit card, free check sending, discounted $10 wires (vs $15)"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The free Found plan includes real-time tax-liability estimates and 1099 contractor payments alongside standard checking — a genuinely useful free tier for solo freelancers, not just a stripped trial. Plus ($35/mo, $315/yr annually) and Pro ($80/mo, $720/yr annually) add interest-bearing balances, unlimited categorization automation, and (on Pro) uncapped high-yield APY.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Real-time estimated quarterly tax calculations",
      "Automatic expense categorization and receipt capture",
      "Contractor payments with 1099 e-filing",
      "Unlimited free invoicing",
      "Up to 10 budgeting sub-accounts (\"Pockets\")",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for solo freelancers and single-member LLCs who want tax estimation and bookkeeping baked directly into their bank account — overkill (and too solo-focused) for businesses with employees or multiple owners.",
    bestFor: [
      "Freelancers and sole proprietors who currently guess at quarterly tax payments",
      "Solo business owners who want invoicing, contractor 1099s, and banking in one app",
    ],
    avoidIf: [
      "You have business partners or W-2 employees — Found is built around single-owner businesses",
      "Your business isn't US-incorporated or you're not a US taxpayer",
    ],
    pros: [
      "Real-time tax estimates are a genuine differentiator most business bank accounts don't offer",
      "Free tier includes contractor payments and 1099 e-filing, not just basic checking",
      "Purpose-built UX for freelancers rather than a generic small-business account",
    ],
    cons: [
      "Narrow target market (sole proprietors/single-member LLCs) — doesn't fit multi-owner businesses well",
      "Higher-yield APY (2.50%, uncapped) requires the $80/mo Pro tier",
      "As a fintech (not a bank), FDIC coverage runs through a partner bank",
    ],

    popularityScore: 58,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://found.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["tax-calculator"],
  },
  {
    id: "lili",
    name: "Lili",
    // DRAFT - review before publish
    tagline: "Freelancer-focused business banking with tiered add-ons for expense tracking, tax prep, and full accounting/invoicing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=lili.co&sz=128",
    website: "https://lili.co",

    category: "finance-banking",
    subCategory: "business-banking",
    industries: ["freelancers", "consulting"],
    businessSizes: ["solo"],
    regions: ["north-america"],
    regionNotes: "US-only. Lili is a fintech, not a bank — accounts are FDIC-insured up to $3M through partner bank Sunrise Banks.",
    useCases: ["open free business checking as a freelancer", "auto-categorize expenses for taxes", "track income/expenses with basic accounting tools", "send invoices"],
    pricingModel: "freemium",

    pricing: [
      { name: "Lili Core", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Business checking with Visa debit card, no monthly fees, no minimum balances, savings up to 4.00% APY, FDIC insurance up to $3M"] },
      { name: "Lili Pro", priceMonthly: 15, priceAnnual: null, currency: "USD", keyLimits: ["Introductory $9/mo for first 3 months; adds expense/tax categorization, receipt attachment, quarterly/annual expense reports, automatic tax-fund allocation"] },
      { name: "Lili Smart", priceMonthly: 35, priceAnnual: null, currency: "USD", keyLimits: ["Introductory $21/mo for first 3 months; adds full accounting software, AI-powered categorization, P&L/cash flow reports, unlimited invoicing with payment acceptance, bill management, external account sync"] },
      { name: "Lili Premium", priceMonthly: 55, priceAnnual: null, currency: "USD", keyLimits: ["Introductory $33/mo for first 3 months; adds priority 7-day support with a dedicated specialist and a metal Visa debit card"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Lili Core is free with no monthly fees or minimum balance and includes up to 4.00% APY savings — a real account, not a limited trial. The Pro/Smart/Premium tiers layer on tax categorization, full accounting/invoicing software, and priority support respectively, each with a discounted introductory rate for the first 3 months before reverting to the listed price.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Free business checking with no minimums",
      "Automatic expense/tax categorization",
      "Real quarterly/annual tax reports",
      "Built-in accounting and invoicing (Smart/Premium tiers)",
      "Up to 4.00% APY savings",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for solo freelancers who want banking plus a tax/bookkeeping on-ramp without buying separate accounting software — the four-tier ladder (Core/Pro/Smart/Premium) takes some comparison shopping to pick the right level.",
    bestFor: [
      "Freelancers who currently do zero tax-expense tracking and want it bundled with their bank account",
      "Solo business owners wanting invoicing and basic accounting without a separate subscription",
    ],
    avoidIf: [
      "You have employees or need multi-user access — Lili is built around a single freelancer/owner",
      "Your business isn't US-incorporated or you're not a US taxpayer",
    ],
    pros: [
      "Free Core tier is a genuinely full-featured no-fee checking account",
      "Tax/expense categorization and reporting are unusually deep for a bank account",
      "Smart/Premium tiers can replace a separate invoicing/accounting subscription",
    ],
    cons: [
      "Higher tiers' pricing reverts up after a 3-month introductory discount, which can surprise users",
      "Four overlapping paid tiers require careful comparison to avoid over/under-buying",
      "As a fintech (not a bank), FDIC coverage runs through a single partner bank (Sunrise Banks)",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://lili.co/plans",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["tax-calculator"],
  },
  {
    id: "rho",
    name: "Rho",
    // DRAFT - review before publish
    tagline: "No-subscription-fee business banking bundled with corporate cards, bill pay, and treasury management for funded companies.",
    logoUrl: "https://www.google.com/s2/favicons?domain=rho.co&sz=128",
    website: "https://rho.co",

    category: "finance-banking",
    subCategory: "business-banking",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["small", "medium"],
    regions: ["north-america"],
    regionNotes: "US-only. Rho is a fintech, not a bank — banking services are provided through partner banks.",
    useCases: ["run business checking with no subscription fees", "manage corporate cards and expenses", "automate bill pay/AP", "invest idle cash via treasury management"],
    pricingModel: "free",

    pricing: [
      { name: "Rho", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["$0 subscription fee, $0 per-user fee, $0 checking minimums; free Same-Day ACH, wires, and checks; foreign currency transfers cost 1%, optional SWIFT fee $15; Treasury (investment) product charges 0.15%-0.6% annual management fee based on deposit size"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Core banking (checking, corporate cards, expense management, bill pay, invoicing) carries no subscription or per-user fees at all — the whole banking/spend platform is free, with revenue coming from interchange, wire fees, and the separate Treasury investment-advisory product (0.15%-0.6% annual fee based on deposit size). No published transaction-volume caps were found on the pricing page.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Zero-fee business checking",
      "Corporate cards with spend controls",
      "Automated bill pay / accounts payable",
      "Treasury/cash management for idle funds",
      "Built-in invoicing",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for venture-backed or cash-flush small/mid companies that want banking, corporate cards, and treasury management under one no-subscription-fee roof — less suited to bootstrapped businesses that don't need treasury/yield tools.",
    bestFor: [
      "Startups and mid-size companies wanting banking, cards, AP, and treasury in one platform",
      "Teams that want to earn yield on idle cash without a separate investment account",
    ],
    avoidIf: [
      "You're a very small or solo business — Rho's feature set (treasury, AP automation) is built for teams with more cash and complexity",
      "Your business isn't US-incorporated",
    ],
    pros: [
      "No subscription or per-user fees for the core banking/card/AP platform",
      "Treasury management is a genuine differentiator versus pure checking-account fintechs",
      "Combines banking, corporate cards, and bill pay in one product",
    ],
    cons: [
      "Pricing page doesn't publish transaction-volume limits or account minimums — worth confirming directly for your use case",
      "Treasury investment product carries a real annual fee (0.15%-0.6%) despite the \"no subscription fee\" banking positioning",
      "As a fintech (not a bank), FDIC coverage runs through partner banks",
    ],

    popularityScore: 48,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://rho.co/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "wise-business",
    name: "Wise Business",
    // DRAFT - review before publish
    tagline: "Multi-currency business account with mid-market exchange rates and no monthly subscription — built for cross-border businesses.",
    logoUrl: "https://www.google.com/s2/favicons?domain=wise.com&sz=128",
    website: "https://wise.com/business",

    category: "finance-banking",
    subCategory: "payments-payouts",
    industries: ["freelancers", "agencies", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Available in most countries globally, though feature availability (e.g. local receiving account details, card issuance) varies by country of incorporation — confirm coverage for your specific country before signing up.",
    useCases: ["hold and convert 40+ currencies", "pay international contractors/vendors", "receive payments via local account details in multiple countries", "spend abroad with a multi-currency card"],
    pricingModel: "one-time",

    pricing: [
      { name: "Wise Business", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["One-time account setup fee of $31 (no recurring monthly/subscription fee); currency conversion and transfers from ~0.57% depending on currency pair, using the mid-market rate with no markup; volume discounts available above 20,000 GBP/mo equivalent"] },
    ],
    hasFreeTier: false,
    freeTierReality: "There's no monthly subscription and no free-forever tier in the traditional sense — Wise Business charges a single one-time setup/account fee (about $31 USD) instead of a recurring fee, then charges a small percentage (from 0.57%) on each currency conversion or transfer. Card spending in a currency you already hold is free; ATM withdrawals are free up to $250/month, then $1.95 + 1.95% per withdrawal.",
    startingPrice: 31,
    currency: "USD",

    keyFeatures: [
      "Hold and convert 40+ currencies at the mid-market rate",
      "Local receiving account details in multiple countries/currencies",
      "Multi-currency debit card",
      "Batch international payments",
      "Accounting software integrations",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for businesses that regularly pay or get paid in multiple currencies and want transparent, near-mid-market FX rates instead of a traditional bank's hidden spread — not a substitute for a full domestic checking account with cash deposit and check-writing support.",
    bestFor: [
      "Freelancers and agencies billing international clients in their clients' local currency",
      "Ecommerce and remote-first businesses paying overseas vendors/contractors regularly",
    ],
    avoidIf: [
      "You mainly need domestic checking with cash deposits and physical branch access",
      "Your transfer volume is low enough that a one-time setup fee plus per-transfer percentage costs more than a flat-fee alternative",
    ],
    pros: [
      "Transparent mid-market FX rates with a clearly disclosed percentage fee, not a hidden spread",
      "No recurring monthly subscription fee — pay per transaction instead",
      "Genuinely global reach with local receiving details in many currencies",
    ],
    cons: [
      "Not a full banking replacement — limited domestic banking features like cash deposits or checks",
      "Per-transfer percentage fees can add up for very high transaction volumes without negotiating volume discounts",
      "Card ATM withdrawals beyond the free $250/mo allowance carry a real fee (1.95% + $1.95)",
    ],

    popularityScore: 74,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://wise.com/us/pricing/business",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["currency-converter"],
  },
  {
    id: "revolut-business",
    name: "Revolut Business",
    // DRAFT - review before publish
    tagline: "Multi-currency business account and card platform from the Revolut fintech group, with tiered plans for growing teams.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.revolut.com&sz=128",
    website: "https://www.revolut.com/business",

    category: "finance-banking",
    subCategory: "business-banking",
    industries: ["freelancers", "agencies", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["europe"],
    regionNotes: "Strongest in Europe/UK where Revolut holds banking licenses; availability and account structure (e-money vs. bank account) varies significantly by country — VERIFY current regional coverage and license status for your country before signing up.",
    useCases: ["hold and exchange multiple currencies", "issue employee debit/expense cards", "manage international payments", "access business analytics/accounting integrations"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: "VERIFY" as unknown as boolean,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Multi-currency business account",
      "Employee debit/expense cards",
      "International payments and FX",
      "Expense management and accounting integrations",
      "Business analytics dashboard",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for European businesses that transact across multiple currencies and want a Revolut-ecosystem account alongside employee cards — plan/pricing details need direct confirmation before publishing since the vendor's pricing pages consistently blocked automated verification.",
    bestFor: [
      "European/UK businesses with regular multi-currency transactions",
      "Teams already using personal Revolut who want a matching business account",
    ],
    avoidIf: [
      "You're outside Revolut Business's strongest coverage regions (Europe/UK) — confirm your country's exact account structure and protections first",
      "You need US-specific banking features like check writing",
    ],
    pros: [
      "Deep multi-currency support well-suited to European cross-border business",
      "Employee card issuance and expense tools built into the same account",
      "Backed by a large, well-known fintech with broad brand recognition",
    ],
    cons: [
      "Pricing page blocked automated verification during this research pass — confirm current tier structure directly before trusting published numbers",
      "Account/regulatory structure (e-money account vs. licensed bank account) varies by country and needs to be understood per-market — it's not a bank account everywhere it operates",
      "Weaker fit for businesses primarily operating in the US",
    ],

    popularityScore: 71,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.revolut.com/business/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["currency-converter"],
  },
  {
    id: "chase-business-complete-banking",
    name: "Chase Business Complete Banking",
    // DRAFT - review before publish
    tagline: "Traditional big-bank business checking with a large branch/ATM network and a waivable monthly fee.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.chase.com&sz=128",
    website: "https://www.chase.com/business/checking/business-complete",

    category: "finance-banking",
    subCategory: "business-banking",
    industries: ["retail", "construction", "hospitality", "real-estate", "consulting"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["north-america"],
    regionNotes: "US-only, requires in-person or online account opening with a US business entity. Chase is an FDIC-insured national bank, not a fintech partner arrangement.",
    useCases: ["open a traditional business checking account", "deposit cash in person", "access built-in invoicing via Chase QuickAccept", "get in-branch banker support"],
    pricingModel: "subscription",

    pricing: [
      { name: "Business Complete Banking", priceMonthly: 15, priceAnnual: null, currency: "USD", keyLimits: ["Fee waived with $2,000 minimum daily balance, Chase QuickAccept deposits, or qualifying credit card purchases; up to 20 checks/deposits per statement period, $5,000 in-branch cash deposits included"] },
      { name: "Performance Business Checking", priceMonthly: 40, priceAnnual: null, currency: "USD", keyLimits: ["Fee waived with $35,000 combined average beginning-day balance; up to 250 debits/deposits, $20,000 cash deposits included"] },
      { name: "Platinum Business Checking", priceMonthly: 95, priceAnnual: null, currency: "USD", keyLimits: ["Fee waived with $100,000 average beginning-day balance (or $50,000 linked to Chase Private Client); up to 500 debits/deposits, $25,000 cash deposits included"] },
    ],
    hasFreeTier: false,
    freeTierReality: "There's no permanent free tier — all three tiers carry a monthly service fee ($15/$40/$95) that is waived only by meeting a minimum balance or activity requirement (e.g. $2,000 daily balance for Business Complete Banking). Businesses that can't consistently hit the waiver threshold will pay the fee every month.",
    startingPrice: 15,
    currency: "USD",

    keyFeatures: [
      "Nationwide branch and ATM network (14,000+ ATMs, 5,000+ branches)",
      "Built-in invoicing and payment acceptance via Chase QuickAccept",
      "In-branch cash deposit allowances",
      "Fee waivers tied to balance or activity",
      "Access to Chase's broader business lending/credit card ecosystem",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for cash-heavy or in-person businesses (retail, hospitality, construction) that need real branches and cash deposit capacity that fintech challengers don't offer — the monthly fee is a real cost unless you can reliably hit the waiver threshold.",
    bestFor: [
      "Businesses that regularly deposit cash and need physical branch access",
      "Companies wanting a single big bank relationship for checking, lending, and credit cards",
    ],
    avoidIf: [
      "You can't reliably maintain the minimum balance/activity needed to waive the monthly fee",
      "You want a fee-free, fully digital-first account — most fintech competitors in this category charge $0",
    ],
    pros: [
      "Genuine nationwide branch and ATM network most fintech competitors can't match",
      "As a chartered national bank, deposits are FDIC-insured directly (not via a partner-bank arrangement)",
      "Built-in QuickAccept payment acceptance and access to Chase's wider lending/credit products",
    ],
    cons: [
      "Monthly fee ($15-$95) applies in full unless balance/activity waiver requirements are met every statement period",
      "Cash deposit allowances are capped, with per-$100 fees once exceeded",
      "Generally less modern/streamlined software experience than fintech-first competitors",
    ],

    popularityScore: 80,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.chase.com/business/checking/business-complete",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "amex-business-blueprint",
    name: "American Express Business Blueprint",
    // DRAFT - review before publish
    tagline: "American Express's business financing and cash-flow platform (formerly Kabbage) — lines of credit and invoice/receivables tools.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.americanexpress.com&sz=128",
    website: "https://www.americanexpress.com/en-us/business/blueprint",

    category: "finance-banking",
    subCategory: "business-banking",
    industries: ["retail", "construction", "ecommerce", "consulting"],
    businessSizes: ["small", "medium"],
    regions: ["north-america"],
    regionNotes: "US-only; underwritten and issued through American Express National Bank / its lending subsidiaries.",
    useCases: ["access a business line of credit", "smooth out cash flow gaps", "finance receivables/invoices", "get working capital financing"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: "VERIFY" as unknown as boolean,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Business line of credit",
      "Cash flow / working capital financing",
      "Invoice and receivables-based financing",
      "Integration with American Express business card ecosystem",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for established US small businesses already in the Amex ecosystem who want financing/credit-line products alongside their existing card relationship — fee/rate structure needs direct confirmation since the vendor's pricing pages repeatedly timed out or reset during automated verification.",
    bestFor: [
      "US small businesses seeking short-term working capital or a revolving credit line",
      "Businesses already using American Express cards who want financing from the same provider",
    ],
    avoidIf: [
      "You're looking for a checking/deposit account rather than credit/financing products",
      "Your business isn't US-based or doesn't have an existing Amex relationship",
    ],
    pros: [
      "Backed by American Express's scale and existing business-card relationships",
      "Financing products (line of credit, receivables financing) fill a gap most pure-checking fintech competitors don't offer",
      "Familiar, established brand for businesses already using Amex cards",
    ],
    cons: [
      "Pricing/fee structure could not be confirmed during this research pass — vendor pages repeatedly failed to load for automated verification",
      "As a lending/financing product, real cost depends heavily on individual underwriting and credit profile, not a flat published rate",
      "US-only, tied to the broader American Express business ecosystem",
    ],

    popularityScore: 52,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.americanexpress.com/en-us/business/blueprint/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["loan-calculator"],
  },
  {
    id: "brex",
    name: "Brex",
    // DRAFT - review before publish
    tagline: "Corporate card and spend management platform built for venture-backed startups, with a genuinely free entry tier.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.brex.com&sz=128",
    website: "https://www.brex.com",

    category: "finance-banking",
    subCategory: "expense-cards",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Cards accepted in 210+ countries; local-currency card issuance available in 50+ countries on higher tiers — company incorporation/underwriting requirements still apply, mostly US/international-startup-focused.",
    useCases: ["issue unlimited corporate cards", "automate expense reporting", "manage multi-entity spend", "book business travel"],
    pricingModel: "freemium",

    pricing: [
      { name: "Essentials", priceMonthly: 0, priceAnnual: null, currency: "USD", keyLimits: ["$0/user/mo; global card acceptance, AI-powered expense rules, up to two entities, accounting integrations, real-time reporting, API access"] },
      { name: "Premium", priceMonthly: 12, priceAnnual: null, currency: "USD", keyLimits: ["$12/user/mo; multiple customizable expense policies, dynamic approval chains, multi-entity support (US and international), HRIS integrations, live budgets"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; unlimited entities, local card issuance, named account manager, admin center, custom implementation"] },
      { name: "Smart Card", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; procurement-focused, global + local-currency card issuance in 50+ countries"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Essentials is free at $0/user/month with unlimited corporate cards, expense management, and API access — not a stripped trial, but a real working product aimed at startups and growing companies. Multi-entity support beyond two entities, dynamic approval chains, and HRIS integrations require the $12/user/mo Premium tier or custom Enterprise/Smart Card pricing.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Unlimited corporate cards accepted in 210+ countries",
      "AI-powered expense categorization and policy rules",
      "Automated bill pay",
      "Travel booking",
      "Cash management accounts",
      "SOC 2 Type II compliance",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for venture-backed startups and growing companies that want corporate cards plus real spend-management automation without paying for it on the entry tier — the free Essentials plan is genuinely competitive, with Premium/Enterprise there for multi-entity complexity.",
    bestFor: [
      "Startups wanting unlimited corporate cards with no per-user fee at the entry level",
      "Growing companies needing multi-entity spend management and approval workflows",
    ],
    avoidIf: [
      "You're a very early-stage or unfunded solo business — Brex's underwriting and target market skew toward funded/scaling companies",
      "You just need a simple debit card, not a full spend-management platform",
    ],
    pros: [
      "Free Essentials tier includes unlimited cards and real expense automation, not just a card number",
      "Strong multi-entity and international support on paid tiers",
      "Deep accounting/HRIS integrations reduce manual reconciliation work",
    ],
    cons: [
      "Historically skews toward venture-backed/higher-revenue companies in underwriting — may not fit every small business profile",
      "Enterprise and Smart Card pricing is custom/opaque, requiring a sales conversation",
      "Premium's per-user fee can add up for larger teams versus flat-fee competitors",
    ],

    popularityScore: 85,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.brex.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "ramp",
    name: "Ramp",
    // DRAFT - review before publish
    tagline: "Corporate cards and spend management with a free entry tier and a heavy emphasis on AI-driven expense automation.",
    logoUrl: "https://www.google.com/s2/favicons?domain=ramp.com&sz=128",
    website: "https://ramp.com",

    category: "finance-banking",
    subCategory: "expense-cards",
    industries: ["agencies", "consulting", "ecommerce", "retail"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Primarily US-underwritten; local-currency card issuing available in 30+ countries on the Enterprise tier.",
    useCases: ["issue unlimited corporate cards", "automate expense/receipt matching", "manage accounts payable", "track real-time budgets"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: null, currency: "USD", keyLimits: ["$0/mo/user; unlimited corporate cards, travel & expense management (SMS/Slack expense completion), automated invoice OCR extraction, basic accounting rules, QuickBooks Online/Xero integrations, custom AI reports"] },
      { name: "Plus", priceMonthly: 15, priceAnnual: null, currency: "USD", keyLimits: ["$15/user/mo plus a platform fee based on team size; 20% discount with annual billing; adds AI-powered expense reviews/policy insights, auto-coded AP line items, AI approval recommendations, advanced NetSuite/Sage Intacct integrations, real-time budget tracking, custom roles/audit logs"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing, annual billing required; Workday/Oracle Fusion Cloud integrations, local-currency card issuing in 30+ countries, dedicated account manager, 24/7 priority support"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The Free plan includes unlimited corporate cards and real expense/AP automation (OCR invoice extraction, accounting rules, Slack/SMS receipt matching) at $0/user/mo — genuinely usable for smaller teams, not a stripped demo. Plus adds a per-user fee plus a team-size-based platform fee for deeper AI automation and ERP integrations (NetSuite/Sage Intacct); Enterprise is custom, annual-only pricing.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Unlimited corporate cards",
      "AI-powered receipt matching and expense review",
      "Automated invoice OCR and accounts payable",
      "Real-time budget tracking",
      "Deep ERP integrations (NetSuite, Sage Intacct, Workday) on paid tiers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for smaller teams that want unlimited corporate cards and genuine AI-driven expense automation for free, with a clear path to deeper ERP integrations on Plus/Enterprise as finance operations mature.",
    bestFor: [
      "Smaller teams wanting unlimited cards and expense automation without a per-user fee",
      "Growing companies needing deep NetSuite/Sage Intacct/Workday integrations as they scale",
    ],
    avoidIf: [
      "You need local-currency card issuance outside the 30+ countries Enterprise supports",
      "You want simple, predictable flat pricing rather than a per-user-plus-platform-fee structure on Plus",
    ],
    pros: [
      "Free tier includes unlimited cards and real automation, not just a trial",
      "Strong reputation for AI-driven expense/receipt-matching accuracy",
      "Deep ERP integrations available for finance teams that need them",
    ],
    cons: [
      "Plus tier's \"per user plus platform fee\" structure makes total cost less predictable than a flat per-seat price",
      "Enterprise requires annual billing and custom sales negotiation",
      "Local-currency card issuance limited to Enterprise tier only",
    ],

    popularityScore: 83,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://ramp.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "bill-spend-expense",
    name: "BILL Spend & Expense",
    // DRAFT - review before publish
    tagline: "Free corporate card and expense management platform from BILL (formerly Divvy), monetized via card interchange rather than subscription fees.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.bill.com&sz=128",
    website: "https://www.bill.com/product/spend-expense",

    category: "finance-banking",
    subCategory: "expense-cards",
    industries: ["agencies", "consulting", "retail", "construction", "nonprofits"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["north-america"],
    regionNotes: "US-only for card issuance and underwriting.",
    useCases: ["issue physical/virtual corporate cards", "set proactive budget/spend controls", "capture receipts and match expenses automatically", "reimburse employee out-of-pocket spend"],
    pricingModel: "free",

    pricing: [
      { name: "BILL Spend & Expense", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["No subscription or per-user software fees; unlimited physical/virtual cards, budget-based spend controls, AI-powered expense management and receipt capture, employee reimbursements, business credit lines from $1,000-$5M (not guaranteed, subject to approval)"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The Spend & Expense product is genuinely free software with no subscription or per-user fee — BILL monetizes through card interchange revenue rather than charging for the platform itself. This is distinct from BILL's separate AP & AR (accounts payable/receivable) products, which do carry per-user subscription fees ($49-$89/mo).",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Unlimited physical and virtual corporate cards",
      "Proactive budget-based spend controls",
      "AI-powered expense management and receipt capture",
      "Employee reimbursements",
      "Optional business credit line ($1,000-$5M, subject to approval)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for businesses wanting free corporate cards and expense management with no software subscription at all — worth pairing with (or comparing against) BILL's separate paid AP/AR products if you also need invoice-based bill pay.",
    bestFor: [
      "Businesses wanting genuinely free corporate cards and spend controls",
      "Companies already using or considering BILL's broader AP/AR suite who want a matching card product",
    ],
    avoidIf: [
      "You specifically need BILL's invoice/bill-pay (AP & AR) features bundled in — those are separate, paid products",
      "Your business isn't US-based",
    ],
    pros: [
      "Genuinely free software with no subscription or per-user fee",
      "Proactive (pre-spend) budget controls rather than after-the-fact expense policing",
      "Access to a business credit line from the same provider, if approved",
    ],
    cons: [
      "Credit line amounts and approval are not guaranteed — advertised range is illustrative, not a commitment",
      "Full BILL AP/AR bill-pay functionality is a separate paid product, not included here",
      "Card-only free model means BILL's incentives lean toward driving card spend volume",
    ],

    popularityScore: 65,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.bill.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "airwallex",
    name: "Airwallex",
    // DRAFT - review before publish
    tagline: "Global business account, payments, and spend management platform built for companies operating across borders.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.airwallex.com&sz=128",
    website: "https://www.airwallex.com",

    category: "finance-banking",
    subCategory: "payments-payouts",
    industries: ["ecommerce", "agencies", "consulting"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Operates across 180+ countries with local entity/licensing requirements that vary by region — confirm exact product availability for your country of incorporation.",
    useCases: ["hold and convert multiple currencies", "accept global payments", "issue corporate/spend cards", "pay international vendors and payroll"],
    pricingModel: "freemium",

    pricing: [
      { name: "Explore", priceMonthly: 0, priceAnnual: null, currency: "USD", keyLimits: ["$0/user/mo; up to 10 free spend-management users, global business account, up to 3.15% yield on USD balances, domestic card processing at 2.80% + $0.30, local transfers to 120+ countries free"] },
      { name: "Grow", priceMonthly: 12, priceAnnual: null, currency: "USD", keyLimits: ["$12/user/mo plus a platform fee based on team size; up to 250 spend-management users, up to 3.30% yield on USD, advanced automations/integrations"] },
      { name: "Accelerate", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; up to 3.42% yield on USD, supports up to 3 entities for centralized management"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Explore is free at $0/user/month and includes a real global business account, card processing, and spend management for up to 10 users — not a trial. Payment processing fees apply across all tiers regardless of plan (2.80% + $0.30 domestic, 4.30% + $0.30 international cards), and FX conversion runs 0.5%-1% above interbank rates depending on currency, so \"free\" refers to the software/account tier, not to transaction costs.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Multi-currency global business account",
      "Global payment acceptance (cards, local payment methods)",
      "Corporate/spend cards with controls",
      "Cross-border payouts to 120+ countries",
      "FX at 0.5%-1% above interbank rates",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for companies operating across multiple countries that need one platform for global collections, payouts, and spend management — transaction-level fees (card processing, FX, SWIFT) matter more to real cost here than the free/paid account tier does.",
    bestFor: [
      "Ecommerce and agencies collecting and paying out across multiple currencies/countries",
      "Companies wanting corporate cards and a global business account in one platform",
    ],
    avoidIf: [
      "You only operate domestically and don't need multi-currency/cross-border functionality",
      "You want a single flat fee — Airwallex's real cost is a mix of platform fee, card processing rate, and FX spread",
    ],
    pros: [
      "Free Explore tier includes a real multi-currency business account and spend management for small teams",
      "Broad global reach (180+ countries) with free local transfers to 120+ of them",
      "Corporate cards and global payments in one platform rather than stitching together separate tools",
    ],
    cons: [
      "Real transaction costs (card processing 2.80-4.30%, FX 0.5-1%, SWIFT $15-25) sit on top of the free/paid account tier and can add up",
      "Regional licensing/entity requirements mean feature availability varies by country",
      "Grow's \"per user plus platform fee\" pricing is less predictable than a flat per-seat rate",
    ],

    popularityScore: 66,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.airwallex.com/us/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["currency-converter"],
  },
  {
    id: "payoneer",
    name: "Payoneer",
    // DRAFT - review before publish
    tagline: "Cross-border payment collection and payout platform built for freelancers, marketplace sellers, and global vendors.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.payoneer.com&sz=128",
    website: "https://www.payoneer.com",

    category: "finance-banking",
    subCategory: "payments-payouts",
    industries: ["freelancers", "ecommerce", "agencies"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Available in 190+ countries, though receiving-account currencies and withdrawal methods vary by country of residence.",
    useCases: ["receive payments from international marketplaces/clients", "hold multiple currency balances", "withdraw funds to a local bank account", "pay international contractors/vendors"],
    pricingModel: "freemium",

    pricing: [
      { name: "Standard Account", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["No monthly subscription; $29.95/year account fee applies only if the account receives less than $6,000 USD-equivalent in any 12-month period (waived otherwise); receiving in local currency free, non-local-currency receiving 1% (min $1 USD), credit-card receiving up to 3.99% + $0.49"] },
    ],
    hasFreeTier: true,
    freeTierReality: "There's no separate paid subscription tier — Payoneer is free to open and use, with the only recurring charge being a $29.95/year inactivity-style fee that applies solely to accounts receiving under $6,000 USD-equivalent in any 12-month period (waived once you clear that threshold). Real costs come from per-transaction withdrawal fees (1.2%-4% with conversion, or a flat $1.50 for same-country same-currency withdrawals) and receiving fees on non-local-currency or card payments.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Multi-currency receiving accounts",
      "Local bank withdrawal in many countries",
      "Marketplace payout integrations (Amazon, Upwork, Fiverr, etc.)",
      "Business-to-business mass payouts",
      "Prepaid Mastercard for direct spending",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for freelancers and marketplace sellers who get paid by international platforms and need an easy way to collect and withdraw those funds locally — real cost lives in withdrawal/conversion fees, not a subscription, so high-volume international earners should model those percentages carefully.",
    bestFor: [
      "Freelancers and agencies paid by international marketplaces (Upwork, Fiverr, Amazon, etc.)",
      "Small businesses needing to send mass payouts to overseas contractors/vendors",
    ],
    avoidIf: [
      "You only transact domestically and don't need cross-border receiving",
      "You process very high non-local-currency volume, where the 1%+ receiving/conversion fees could exceed cheaper dedicated cross-border tools",
    ],
    pros: [
      "No subscription fee for active accounts — genuinely free to open and hold funds",
      "Deep integrations with major freelance marketplaces and ecommerce platforms",
      "Broad country/currency coverage for both receiving and local withdrawal",
    ],
    cons: [
      "The $29.95/year fee on low-activity accounts (under $6,000/yr) can catch infrequent users off guard",
      "Currency conversion and non-local receiving fees (1%+) add up for high-volume cross-border earners",
      "Card-based receiving carries a notably higher fee (up to 3.99% + $0.49) than bank-based receiving",
    ],

    popularityScore: 70,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.payoneer.com/fees/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["currency-converter"],
  },
  {
    id: "adyen",
    name: "Adyen",
    // DRAFT - review before publish
    tagline: "Enterprise-grade global payments infrastructure with transparent interchange-plus pricing and no monthly fees.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.adyen.com&sz=128",
    website: "https://www.adyen.com",

    category: "finance-banking",
    subCategory: "payments-payouts",
    industries: ["ecommerce", "retail", "hospitality"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Operates globally across 200+ payment methods; best suited to companies with enough volume to work through underwriting/onboarding, which is more involved than self-serve platforms like Stripe/Square.",
    useCases: ["accept global online and in-person payments", "manage multi-currency settlement", "unify online/in-store payment data", "reduce cross-border payment costs at scale"],
    pricingModel: "subscription",

    pricing: [
      { name: "Pay-per-transaction", priceMonthly: 0, priceAnnual: null, currency: "USD", keyLimits: ["No monthly, setup, integration, or closure fees; $0.13 fixed processing fee per transaction plus a variable percentage (roughly 0.60%-12%+) depending on payment method, geography, and industry; a minimum invoice may apply depending on business model"] },
    ],
    hasFreeTier: false,
    freeTierReality: "Adyen has no free tier and no flat published \"starting price\" — every transaction incurs at least the $0.13 fixed fee plus a variable, payment-method-specific percentage, and some merchants are subject to a minimum monthly invoice. There are no recurring monthly, setup, integration, or account-closure fees, but pricing is not fully self-serve/transparent the way Stripe's or Square's flat published rates are — final rates are often negotiated or method/volume-specific.",
    startingPrice: "VERIFY",
    currency: "USD",

    keyFeatures: [
      "Unified global payments platform (online + in-person)",
      "200+ local payment methods supported",
      "Multi-currency settlement and reporting",
      "RevenueProtect fraud/risk management",
      "Single view of transactions across channels",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for larger ecommerce/retail/hospitality businesses with enough payment volume to justify Adyen's more enterprise-oriented onboarding and negotiated rates — smaller or self-serve-first businesses will generally find Stripe or Square simpler to start with.",
    bestFor: [
      "Larger ecommerce and omnichannel retailers processing significant payment volume",
      "Businesses wanting unified online + in-person payment data in one platform",
    ],
    avoidIf: [
      "You're a small business wanting instant self-serve signup — Adyen's onboarding is more involved than Stripe/Square",
      "You need one simple, universally published flat rate rather than method/volume-dependent pricing",
    ],
    pros: [
      "No recurring monthly/setup/integration/closure fees — pure pay-per-transaction model",
      "Extremely broad global payment-method coverage (200+ methods)",
      "Strong reputation among large enterprise merchants for unified omnichannel payments",
    ],
    cons: [
      "No single published \"starting price\" — real rates vary by payment method, geography, and negotiated minimums",
      "Possible minimum monthly invoice depending on business model, which can be a poor fit for very low-volume merchants",
      "Onboarding/underwriting is more enterprise-oriented than instant self-serve competitors",
    ],

    popularityScore: 72,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.adyen.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "stripe",
    name: "Stripe",
    // DRAFT - review before publish
    tagline: "The default developer-first online payments platform — pay-as-you-go pricing with no setup or monthly fees.",
    logoUrl: "https://www.google.com/s2/favicons?domain=stripe.com&sz=128",
    website: "https://stripe.com",

    category: "finance-banking",
    subCategory: "payments-payouts",
    industries: ["ecommerce", "agencies", "consulting", "retail"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available in 45+ countries for full account access, with broader currency/payment-method support for cross-border transactions — confirm availability for your specific country of incorporation.",
    useCases: ["accept online card payments", "run subscription/recurring billing", "process marketplace/platform payments", "handle invoicing and checkout"],
    pricingModel: "subscription",

    pricing: [
      { name: "Standard (pay-as-you-go)", priceMonthly: 0, priceAnnual: null, currency: "USD", keyLimits: ["No setup, monthly, or hidden fees; 2.9% + $0.30 per successful domestic card transaction; +1.5% for international cards; +1% for currency conversion when required; +0.5% for manually-entered/keyed-in cards"] },
      { name: "Custom", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["For high-volume businesses; interchange-plus (IC+) pricing, volume discounts, and country-specific negotiated rates"] },
    ],
    hasFreeTier: true,
    freeTierReality: "There's no monthly subscription fee on the Standard plan — it's genuinely pay-as-you-go with no setup or hidden fees, just a per-transaction rate (2.9% + $0.30 domestic). \"Free\" here means no fixed cost to start, not free processing; every successful transaction is charged, and add-on products (Billing, Radar, Connect, etc.) carry their own separate fees beyond the base card-processing rate.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Online card payment processing",
      "Subscription/recurring billing (Stripe Billing)",
      "Marketplace/platform payouts (Stripe Connect)",
      "Hosted checkout and invoicing",
      "Extensive developer API and documentation",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for developers and businesses of any size wanting the most flexible, well-documented online payments API with no upfront cost — high-volume merchants should still evaluate whether negotiated Custom pricing beats the standard published rate.",
    bestFor: [
      "Developers and technical teams wanting maximum flexibility and API control",
      "Businesses of any size starting out with online payments with zero setup cost",
    ],
    avoidIf: [
      "You need in-person/card-present payment hardware as your primary use case (see Square instead)",
      "You process very high volume and haven't checked whether negotiated Custom pricing beats the standard rate",
    ],
    pros: [
      "No setup or monthly fee — genuinely pay only when you get paid",
      "Best-in-class developer experience, documentation, and API flexibility",
      "Broad global reach and deep ecosystem of add-on products (Billing, Connect, Radar, etc.)",
    ],
    cons: [
      "Standard per-transaction rate (2.9% + $0.30) is not the cheapest available if you qualify for negotiated Custom pricing at scale",
      "International card and currency-conversion surcharges (+1.5%/+1%) add up for global businesses",
      "Add-on products (Billing, Radar, Connect, etc.) carry separate fees on top of base processing",
    ],

    popularityScore: 93,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://stripe.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "square",
    name: "Square",
    // DRAFT - review before publish
    tagline: "Point-of-sale and payments platform for in-person and online sellers, with free and paid subscription tiers that lower processing rates.",
    logoUrl: "https://www.google.com/s2/favicons?domain=squareup.com&sz=128",
    website: "https://squareup.com",

    category: "finance-banking",
    subCategory: "payments-payouts",
    industries: ["retail", "hospitality", "ecommerce", "construction"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["north-america"],
    regionNotes: "Primarily US, Canada, UK, Australia, Japan, Ireland, France, and Spain — full feature/hardware availability varies significantly by country.",
    useCases: ["accept in-person card payments", "run a point-of-sale system", "sell online with hosted checkout", "send invoices with ACH payment"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: null, currency: "USD", keyLimits: ["Card-present (tap/dip/swipe): 2.6% + 15¢; online: 3.3% + 30¢; manually-entered/card-on-file: 3.5% + 15¢; invoices (ACH): 1%, $1 minimum"] },
      { name: "Plus", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Card-present: 2.5% + 15¢; online: 2.9% + 30¢; manually-entered: 3.5% + 15¢; invoices (ACH): 1%, $1 min, capped at $10; subscription price varies by product line — VERIFY exact monthly fee"] },
      { name: "Premium", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Card-present: 2.4% + 15¢; online: 2.9% + 30¢; manually-entered: 3.5% + 15¢; invoices (ACH): 1%, $1 min, capped at $10; subscription price varies by product line — VERIFY exact monthly fee"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The Free plan has no monthly software fee — you only pay per-transaction processing rates (e.g. 2.6% + 15¢ card-present). Plus and Premium add a monthly software subscription (exact price varies by which Square product — POS, Retail, Restaurants, Appointments — and wasn't pinned down to one universal number during this pass) in exchange for lower processing rates and more advanced features, so higher-volume sellers can save more on processing than they pay in subscription fees. Cash and check payments are free on every plan; card-not-present/manually-entered rates (3.5% + 15¢) don't improve between tiers.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Free point-of-sale software and hardware options",
      "In-person, online, and invoice payment acceptance",
      "Tiered processing rates that improve with paid subscriptions",
      "Team management and payroll add-ons",
      "Inventory and catalog management",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for in-person and hybrid retail/hospitality sellers who want free POS software to start, with a clear cost-benefit path to a paid tier once transaction volume makes the lower processing rate worth the subscription — exact Plus/Premium monthly fees vary by product line and need direct confirmation for your specific business type.",
    bestFor: [
      "Retail, hospitality, and service businesses needing in-person point-of-sale hardware and software",
      "Sellers who want free software to start and can evaluate upgrading once volume justifies lower processing rates",
    ],
    avoidIf: [
      "You're a purely online/API-first business without in-person sales — Stripe is generally simpler for that use case",
      "You process a lot of manually-entered/card-not-present transactions — that rate (3.5% + 15¢) doesn't improve with paid tiers",
    ],
    pros: [
      "Genuinely free tier with no monthly software fee, just per-transaction rates",
      "Processing rates improve on paid tiers, rewarding higher-volume sellers",
      "Combines POS hardware, software, and payments in one integrated system",
    ],
    cons: [
      "Plus/Premium exact monthly subscription price varies by specific Square product line and wasn't confirmed as one universal number — verify for your product line before publishing final pricing",
      "Manually-entered/card-not-present rate doesn't improve between tiers, unlike card-present and online rates",
      "Primarily strong in a handful of countries — not a truly global payments solution like Stripe or Adyen",
    ],

    popularityScore: 82,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://squareup.com/us/en/payments/our-fees",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "ofx",
    name: "OFX",
    // DRAFT - review before publish
    tagline: "International business payments platform with a free core plan and a paid Full Suite tier for multi-user teams.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.ofx.com&sz=128",
    website: "https://www.ofx.com/en-us/business",

    category: "finance-banking",
    subCategory: "payments-payouts",
    industries: ["ecommerce", "agencies", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Operates across multiple countries with a global business account supporting 30+ currencies; specific licensing and feature availability vary by country of incorporation.",
    useCases: ["send/receive international business payments", "hold and receive funds in 30+ currencies", "issue corporate cards", "manage FX exposure for cross-border trade"],
    pricingModel: "freemium",

    pricing: [
      { name: "Standard", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Free; global business account, multi-currency holding/receiving in 30+ currencies, international payments, corporate cards, 24/7 support; cross-border SWIFT transfers $20/transaction; 1.5% FX margin on international card payments"] },
      { name: "Full Suite", priceMonthly: 75, priceAnnual: null, currency: "USD", keyLimits: ["$75/mo includes 5 users, then $10/user/mo thereafter; 30-day trial available; adds expanded multi-user account management on top of Standard features"] },
      { name: "Custom", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Volume-based, tailored FX pricing for larger businesses"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The Standard plan is free with no monthly fee and includes a real multi-currency global business account, international payments, and corporate cards — not just a trial. Per-transaction costs still apply on every plan (e.g. $20 per SWIFT transfer, 1.5% FX margin on card payments), and the paid Full Suite tier ($75/mo for 5 users, then $10/user/mo) exists purely to add multi-user account management, not to unlock core payment functionality.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Multi-currency global business account (30+ currencies)",
      "International SWIFT and local payment transfers",
      "Corporate cards with cashback",
      "Multi-user account management (Full Suite)",
      "24/7 customer support",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for businesses making regular international payments who want a free multi-currency account without a software subscription — the $20 SWIFT fee and 1.5% card FX margin mean per-transaction costs deserve as much attention as the plan price.",
    bestFor: [
      "Small businesses and agencies paying overseas vendors or contractors regularly",
      "Teams that need multi-user account access via the paid Full Suite tier",
    ],
    avoidIf: [
      "Your transfer volume is low enough that the $20 flat SWIFT fee costs more than a percentage-based competitor",
      "You need a full domestic banking account rather than a cross-border payments account",
    ],
    pros: [
      "Free Standard plan includes a genuine multi-currency business account and corporate cards, not a limited trial",
      "Flat, disclosed SWIFT transfer fee ($20) makes cost predictable per transaction",
      "Full Suite's multi-user pricing ($75/mo for 5 users) is clearly published rather than custom-quote-only",
    ],
    cons: [
      "$20 flat SWIFT fee can be expensive relative to percentage-based competitors for small transfers",
      "1.5% FX margin on card payments is on the higher side compared to some multi-currency competitors",
      "Less well-known brand recognition than Wise or Airwallex in this category",
    ],

    popularityScore: 42,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.ofx.com/en-us/business/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["currency-converter"],
  },
];
