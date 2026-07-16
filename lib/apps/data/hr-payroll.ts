import type { AppListing } from "../types";

// Scaffolded — 21 well-known HR & Payroll tools, spanning payroll, HRIS/HR
// management, and recruiting/ATS.
//
// Every field tagged with the literal string "VERIFY" is a placeholder for
// a fact (pricing tier, price, free-tier limit, or integration list) that
// must be checked against the vendor's own live pricing page before this
// listing is published — see docs/apps-verification-checklist.md. Do not
// replace "VERIFY" with a remembered or guessed value.
//
// Editorial fields (tagline, verdict, bestFor, avoidIf, pros, cons) are
// well-reasoned drafts based on each tool's general reputation and market
// positioning, marked "// DRAFT - review before publish" — apply your own
// judgement before these go live.
//
// The publish guard lives in lib/apps/index.ts (isPricingVerified /
// ALL_APPS): any listing still carrying a VERIFY pricing fact is excluded
// from the production directory automatically.

export const HR_PAYROLL_APPS: AppListing[] = [
  {
    id: "gusto",
    name: "Gusto",
    // DRAFT - review before publish
    tagline: "Approachable full-service payroll, benefits, and light HR for US small businesses.",
    logoUrl: "https://www.google.com/s2/favicons?domain=gusto.com&sz=128",
    website: "https://gusto.com",

    category: "hr-payroll",
    subCategory: "payroll",
    industries: ["agencies", "consulting", "retail", "construction", "hospitality"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["north-america"],
    regionNotes:
      "US-only for payroll and benefits (all 50 states). Contractor payments can go to international contractors, but there is no non-US payroll or benefits administration — VERIFY current international contractor coverage.",
    useCases: ["run payroll", "file payroll taxes", "manage benefits", "track PTO", "onboard employees", "time tracking"],
    pricingModel: "subscription",

    pricing: [
      { name: "Simple", priceMonthly: 49, priceAnnual: null, currency: "USD", keyLimits: ["$49/mo base + $6/employee/mo; single-state payroll"] },
      { name: "Plus", priceMonthly: 80, priceAnnual: null, currency: "USD", keyLimits: ["$80/mo base + $12/employee/mo; multi-state payroll, time tracking"] },
      { name: "Premium", priceMonthly: 180, priceAnnual: null, currency: "USD", keyLimits: ["$180/mo base + $22/employee/mo; dedicated advisor, certified HR experts"] },
      { name: "Contractor Only", priceMonthly: 35, priceAnnual: null, currency: "USD", keyLimits: ["$35/mo base + $6/contractor/mo; for businesses with no W-2 employees"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier. A Contractor Only plan exists for businesses with no W-2 employees at $35/mo + $6/contractor/mo. Pricing is base fee plus per-person fee on every plan.",
    startingPrice: 35,
    currency: "USD",

    keyFeatures: [
      "Full-service payroll with automatic federal/state/local tax filing",
      "Employee self-service portal",
      "Benefits administration (health insurance, 401(k))",
      "PTO tracking and holiday pay",
      "Time tracking (Plus/Premium)",
      "Certified HR experts (Premium)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for US-only small businesses that want payroll, benefits, and light HR bundled into one approachable product — not an option at all if you need to pay or employ people outside the US.",
    bestFor: [
      "US small businesses running payroll in one or a few states",
      "Solo founders needing simple W-2 or 1099 payroll",
    ],
    avoidIf: [
      "You need to employ or pay people outside the US",
      "You're a larger company needing deep HRIS/ATS functionality beyond payroll and light HR",
    ],
    pros: [
      "Easy setup and approachable interface for non-HR specialists",
      "Transparent, predictable base + per-person pricing across all tiers",
      "Strong benefits and 401(k) integration for US employees",
    ],
    cons: [
      "US-only — no international payroll or employment",
      "Per-person fees add up quickly as headcount grows",
      "Deeper HR support (certified experts) only on the top Premium tier",
    ],

    popularityScore: 90,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://gusto.com/product/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: ["salary-calculator", "tax-calculator"],
  },
  {
    id: "rippling",
    name: "Rippling",
    // DRAFT - review before publish
    tagline: "Unified HR, IT, and finance platform with modular, per-employee-per-module pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.rippling.com&sz=128",
    website: "https://www.rippling.com",

    category: "hr-payroll",
    subCategory: "hr-management",
    industries: ["agencies", "consulting", "retail", "ecommerce", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global", "north-america", "europe"],
    regionNotes:
      "Global payroll/EOR modules cover many countries — VERIFY current country coverage and which modules are self-serve vs. sales-assisted.",
    useCases: ["run payroll", "manage benefits", "device/IT management", "hire international employees", "workflow automation", "onboard employees"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — modular base + per-module PEPM pricing, exact current rates need direct confirmation"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Unified HR, IT, and finance platform",
      "Global payroll and EOR across many countries (module)",
      "Device and app management (IT module)",
      "Custom workflow automation ('Rippling Unity')",
      "Modular pricing by feature",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for companies that want one platform spanning HR, IT, and finance and are prepared to work through a sales-driven, modular quote rather than shop a public price list.",
    bestFor: [
      "Mid-size and growing companies wanting HR, IT, and finance unified in one system",
      "Companies with global or multi-country headcount",
    ],
    avoidIf: [
      "You want to see an exact price without a sales call",
      "You're a very small team that doesn't need IT/device management alongside HR",
    ],
    pros: [
      "Extremely broad module set (HR, IT, finance, global payroll) under one login",
      "Strong automation and third-party integrations",
      "Scales from small teams to global enterprises",
    ],
    cons: [
      "No public pricing — every quote is custom and modular",
      "Cost can climb quickly as modules are added",
      "Overkill for a small business that just needs payroll",
    ],

    popularityScore: 88,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.rippling.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "bamboohr",
    name: "BambooHR",
    // DRAFT - review before publish
    tagline: "Clean, all-in-one HRIS with published per-employee pricing — rare in this category.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.bamboohr.com&sz=128",
    website: "https://www.bamboohr.com",

    category: "hr-payroll",
    subCategory: "hr-management",
    industries: ["agencies", "consulting", "retail", "healthcare", "nonprofits"],
    businessSizes: ["small", "medium"],
    regions: ["global", "north-america"],
    regionNotes:
      "US-headquartered; used internationally as an HRIS, but payroll and benefits add-ons are US-only — VERIFY current international payroll coverage.",
    useCases: ["hr records management", "track PTO", "run payroll", "manage benefits", "recruiting", "performance management"],
    pricingModel: "subscription",

    pricing: [
      { name: "Core", priceMonthly: 10, priceAnnual: null, currency: "USD", keyLimits: ["$10/employee/mo for 25+ employees; flat rate starting at $250/mo for 25 or fewer employees"] },
      { name: "Pro", priceMonthly: 17, priceAnnual: null, currency: "USD", keyLimits: ["$17/employee/mo for 25+ employees; flat rate for 25 or fewer (not separately published)"] },
      { name: "Elite", priceMonthly: 25, priceAnnual: null, currency: "USD", keyLimits: ["$25/employee/mo for 25+ employees; flat rate for 25 or fewer (not separately published)"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier. Companies with 25 or fewer employees are billed a flat monthly rate (Core starts at $250/mo) rather than per-employee. Volume and nonprofit (15%) discounts apply automatically; a 15% bundle discount applies when combining Payroll and Benefits Administration (US only).",
    startingPrice: 10,
    currency: "USD",

    keyFeatures: [
      "Core HRIS and employee records",
      "Time-off tracking",
      "Hiring/ATS (add-on)",
      "Payroll (US add-on)",
      "Benefits administration (add-on)",
      "Reporting and analytics",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small-to-midsize US-headquartered companies wanting a clean, all-in-one HRIS that scales from a lean 25-person team upward — most of the highest-value modules (payroll, benefits) are US-only add-ons.",
    bestFor: [
      "Small-to-midsize businesses wanting a single system of record for HR",
      "Companies that want ATS and HRIS in one product",
    ],
    avoidIf: [
      "You need built-in international payroll",
      "You're under 25 employees and want the lowest possible per-head cost — the flat rate can be pricier per employee at very small sizes",
    ],
    pros: [
      "Clean, well-reviewed interface",
      "Public per-employee pricing — unusual transparency for this category",
      "Broad add-on ecosystem (payroll, benefits, performance)",
    ],
    cons: [
      "Payroll and benefits add-ons are US-only",
      "Pricing climbs quickly moving up tiers",
      "Some advanced features gated behind Elite or paid add-ons",
    ],

    popularityScore: 87,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.bamboohr.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: ["salary-calculator"],
  },
  {
    id: "adp-run",
    name: "ADP Run",
    // DRAFT - review before publish
    tagline: "The best-known payroll brand for small business — no public pricing, quote-only.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.adp.com&sz=128",
    website: "https://www.adp.com",

    category: "hr-payroll",
    subCategory: "payroll",
    industries: ["agencies", "retail", "construction", "hospitality", "healthcare"],
    businessSizes: ["small", "medium"],
    regions: ["north-america"],
    regionNotes: "US-focused (RUN is ADP's 1-49 employee product; Canada and larger companies use separate ADP products) — VERIFY exact current regional product lineup.",
    useCases: ["run payroll", "file payroll taxes", "manage benefits", "time tracking", "background checks"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — custom quote only; no official public pricing, only unreliable third-party estimates"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Full-service payroll with tax filing",
      "HR support and compliance tools",
      "Time tracking (add-on)",
      "Benefits administration (add-on)",
      "Background checks and hiring tools",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small businesses that want the reassurance of the largest, most established payroll brand and are comfortable getting pricing through a sales call rather than a public price list.",
    bestFor: [
      "Small businesses wanting an established, big-name payroll provider",
      "Businesses that want easy access to ADP's broader HR/PEO ecosystem as they grow",
    ],
    avoidIf: [
      "You want to compare exact pricing online before talking to sales",
      "You're price-sensitive — third-party estimates suggest costs often rise once add-ons are factored in",
    ],
    pros: [
      "Long track record and broad payroll compliance expertise",
      "Scales into larger ADP products (Workforce Now, TotalSource PEO) as you grow",
      "Wide network of accountant/bookkeeper familiarity",
    ],
    cons: [
      "No public pricing — quotes vary widely and require a sales call",
      "Reported extra fees (implementation, add-ons) beyond the quoted base",
      "Contract and cancellation terms have drawn user complaints",
    ],

    popularityScore: 85,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.adp.com/what-we-offer/payroll/payroll-for-1-49-employees/payroll-packages.aspx",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "paychex",
    name: "Paychex",
    // DRAFT - review before publish
    tagline: "Established payroll and PEO provider for small-to-midsize businesses — quote-only pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.paychex.com&sz=128",
    website: "https://www.paychex.com",

    category: "hr-payroll",
    subCategory: "payroll",
    industries: ["agencies", "retail", "construction", "hospitality", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["north-america"],
    regionNotes: "US-focused, with some Canada and PEO reach — VERIFY exact current regional coverage.",
    useCases: ["run payroll", "file payroll taxes", "manage benefits", "retirement/401(k) administration", "PEO/co-employment"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — only the entry Essentials tier has a widely-cited (unofficial) starting rate; higher tiers are quote-only"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Full-service payroll and tax filing",
      "HR support and compliance",
      "PEO option (Paychex PEO)",
      "Time and attendance (add-on)",
      "Retirement/401(k) services",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small-to-midsize businesses that want an established payroll-plus-PEO provider with a large support network — you'll need a sales call to get real pricing.",
    bestFor: [
      "Businesses that may want to graduate into a full PEO (co-employment) relationship",
      "Companies wanting bundled retirement/401(k) services alongside payroll",
    ],
    avoidIf: [
      "You want transparent, self-serve pricing",
      "You're a solo freelancer or very small team — this is built for more complex payroll needs",
    ],
    pros: [
      "Established provider with deep compliance and PEO expertise",
      "Wide range of bundled HR, retirement, and insurance services",
      "Scales into larger enterprise offerings",
    ],
    cons: [
      "No public pricing beyond commonly-cited, unofficial third-party estimates",
      "Higher tiers (Select, Pro, Enterprise) are quote-only with no cited starting rate at all",
      "Reports of add-on costs accumulating beyond the quoted base",
    ],

    popularityScore: 83,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.paychex.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "justworks",
    name: "Justworks",
    // DRAFT - review before publish
    tagline: "PEO-grade benefits and compliance for US small businesses, with unusually transparent per-employee pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.justworks.com&sz=128",
    website: "https://www.justworks.com",

    category: "hr-payroll",
    subCategory: "benefits-admin",
    industries: ["agencies", "consulting", "freelancers", "ecommerce"],
    businessSizes: ["small", "medium"],
    regions: ["north-america"],
    regionNotes: "US-only PEO and payroll — VERIFY current state coverage exceptions, if any.",
    useCases: ["run payroll", "manage benefits", "PEO/co-employment", "compliance support", "hsa/fsa administration"],
    pricingModel: "subscription",

    pricing: [
      { name: "Payroll", priceMonthly: 50, priceAnnual: null, currency: "USD", keyLimits: ["$50/mo base + $8/employee/mo — payroll only, not a PEO"] },
      { name: "PEO Basic", priceMonthly: 79, priceAnnual: null, currency: "USD", keyLimits: ["$79/employee/mo, no separate base fee — payroll, compliance, HR tools, 401(k) access"] },
      { name: "PEO Plus", priceMonthly: 109, priceAnnual: null, currency: "USD", keyLimits: ["$109/employee/mo — adds health insurance admin, HSA/FSA, mental health and family benefits"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier. PEO plans are priced per employee with no separate base fee; health insurance premiums, employer retirement contributions, and workers' comp are separate pass-through costs on top of the platform fee.",
    startingPrice: 50,
    currency: "USD",

    keyFeatures: [
      "PEO co-employment (compliance, benefits, payroll bundled)",
      "Standalone payroll-only plan",
      "Health insurance and HSA/FSA administration",
      "24/7 support",
      "401(k) access",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for US small businesses that want PEO-grade benefits access and compliance cover without ADP/Paychex-style enterprise complexity — weigh the per-employee PEO pricing against a standalone payroll-plus-benefits stack as headcount grows.",
    bestFor: [
      "US small businesses wanting big-company benefits access via a PEO",
      "Teams that want compliance and HR support bundled in, not just payroll",
    ],
    avoidIf: [
      "You're outside the US",
      "You just need basic payroll and don't want PEO co-employment",
    ],
    pros: [
      "Transparent, published per-employee pricing — unusual for a PEO",
      "Strong benefits access (health, HSA/FSA, retirement) for small teams",
      "24/7 support with a strong customer satisfaction reputation",
    ],
    cons: [
      "US-only",
      "PEO co-employment model isn't the right fit for everyone — it shifts some employer-of-record responsibilities",
      "Per-employee PEO cost is higher than basic payroll-only tools",
    ],

    popularityScore: 78,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.justworks.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: ["salary-calculator"],
  },
  {
    id: "deel",
    name: "Deel",
    // DRAFT - review before publish
    tagline: "Hire and pay contractors or employees in 130+ countries from one platform — priced per worker, per product.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.deel.com&sz=128",
    website: "https://www.deel.com",

    category: "hr-payroll",
    subCategory: "hr-management",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Employs and pays people in 130+ countries via EOR, contractor management, or US PEO — a strong fit specifically for distributed/international teams.",
    useCases: ["hire international employees", "pay contractors", "run payroll", "manage benefits", "recruiting", "equity management"],
    pricingModel: "subscription",

    pricing: [
      { name: "Find Talent (ATS)", priceMonthly: 14, priceAnnual: null, currency: "USD", keyLimits: ["Starting at $14/worker/mo for the recruiting/ATS module"] },
      { name: "Hire Contractors", priceMonthly: 49, priceAnnual: null, currency: "USD", keyLimits: ["$49/contractor/mo — standard contractor payments and compliance"] },
      { name: "Contractor of Record", priceMonthly: 325, priceAnnual: null, currency: "USD", keyLimits: ["$325/contractor/mo — added misclassification protection"] },
      { name: "US PEO", priceMonthly: 125, priceAnnual: null, currency: "USD", keyLimits: ["$125/employee/mo — US-based PEO"] },
      { name: "EOR (130+ countries)", priceMonthly: 599, priceAnnual: null, currency: "USD", keyLimits: ["$599/employee/mo — employer of record, no local entity needed"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — free demo/consultation only. Pricing is modular by product (contractor payments, EOR, PEO, ATS); most businesses combine several of these per-worker fees rather than paying one flat rate.",
    startingPrice: 14,
    currency: "USD",

    keyFeatures: [
      "Employer of Record in 130+ countries",
      "Global contractor payments and compliance",
      "US PEO",
      "Multi-currency payroll (120+ currencies)",
      "Built-in ATS/recruiting module",
      "Equity and benefits administration",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for companies hiring across multiple countries who want one platform for contractors, EOR employees, and payroll — costly if you're only hiring domestically, where dedicated single-country tools are cheaper.",
    bestFor: [
      "Companies hiring contractors or employees across multiple countries",
      "Startups scaling international teams without setting up local entities",
    ],
    avoidIf: [
      "You only hire in one country — dedicated local payroll tools will be cheaper",
      "You need the lowest possible per-worker cost at high volume",
    ],
    pros: [
      "Broad global coverage (130+ countries) for EOR and contractor payments",
      "Modular pricing lets you pay only for the products you use",
      "Strong compliance and misclassification-protection tooling",
    ],
    cons: [
      "EOR/PEO per-employee fees are among the higher end of the category",
      "Modular pricing can be confusing to estimate total cost upfront",
      "Overkill for domestic-only hiring",
    ],

    popularityScore: 84,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.deel.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: ["freelance-contract-generator", "nda-generator"],
  },
  {
    id: "remote",
    name: "Remote",
    // DRAFT - review before publish
    tagline: "Global employment platform with no setup fees on most products — a cheaper EOR alternative for owned entities.",
    logoUrl: "https://www.google.com/s2/favicons?domain=remote.com&sz=128",
    website: "https://remote.com",

    category: "hr-payroll",
    subCategory: "hr-management",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Supports employment/payroll across many countries via EOR and Global Payroll; the PEO option is US-only and requires a US bank account.",
    useCases: ["hire international employees", "run payroll", "pay contractors", "manage benefits", "equity management"],
    pricingModel: "subscription",

    pricing: [
      { name: "Global Payroll", priceMonthly: 29, priceAnnual: null, currency: "USD", keyLimits: ["$29/employee/mo + implementation fee — for entities you already own"] },
      { name: "Contractor Management", priceMonthly: 29, priceAnnual: null, currency: "USD", keyLimits: ["$29/contractor/mo"] },
      { name: "Contractor Management Plus", priceMonthly: 99, priceAnnual: null, currency: "USD", keyLimits: ["$99/contractor/mo — adds extra compliance/benefits features"] },
      { name: "PEO", priceMonthly: 99, priceAnnual: null, currency: "USD", keyLimits: ["From $99/employee/mo — US only, requires a US bank account"] },
      { name: "Employer of Record (EOR)", priceMonthly: 699, priceAnnual: null, currency: "USD", keyLimits: ["$699/employee/mo — many countries, no local entity needed"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier. No platform, onboarding, or setup fees on most products (Global Payroll has an implementation fee). Startups and social-purpose organizations get 15% off core services.",
    startingPrice: 29,
    currency: "USD",

    keyFeatures: [
      "Employer of Record across many countries",
      "Global payroll for owned entities",
      "Contractor management and payments",
      "US PEO",
      "Equity management add-on",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "A strong Deel alternative for international hiring, with a notably cheaper Global Payroll product if you already have local entities — the EOR product itself is priced similarly to Deel's at the high end.",
    bestFor: [
      "Companies hiring internationally that already have (or plan to set up) local entities and just need payroll run",
      "Teams wanting EOR coverage across many countries",
    ],
    avoidIf: [
      "You only hire domestically",
      "You want the very cheapest EOR option — this is priced at the premium end",
    ],
    pros: [
      "No setup/platform fees on most products",
      "Competitive Global Payroll pricing for companies with existing entities",
      "Broad country coverage for EOR",
    ],
    cons: [
      "EOR pricing is expensive at $699/employee/mo",
      "PEO option requires a US bank account, limiting it to US-based companies",
      "Modular pricing requires piecing together true total cost",
    ],

    popularityScore: 80,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://remote.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: ["freelance-contract-generator", "nda-generator"],
  },
  {
    id: "onpay",
    name: "OnPay",
    // DRAFT - review before publish
    tagline: "One simple, transparent payroll plan for US small businesses — no tier-shopping required.",
    logoUrl: "https://www.google.com/s2/favicons?domain=onpay.com&sz=128",
    website: "https://onpay.com",

    category: "hr-payroll",
    subCategory: "payroll",
    industries: ["agencies", "retail", "construction", "hospitality", "nonprofits"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["north-america"],
    regionNotes: "US-only, but supports payroll in all 50 states including niche industries (farm, clergy, restaurant) — VERIFY current state/industry coverage nuances.",
    useCases: ["run payroll", "file payroll taxes", "onboard employees", "track PTO policies"],
    pricingModel: "subscription",

    pricing: [
      { name: "OnPay Payroll", priceMonthly: 49, priceAnnual: null, currency: "USD", keyLimits: ["$49/mo base + $6/employee/mo — full-service payroll, all 50 states"] },
      { name: "HR add-on", priceMonthly: 15, priceAnnual: null, currency: "USD", keyLimits: ["$15/mo base + $2/employee/mo — added HR tools on top of payroll"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier, but the first month is offered free as a standing promotional offer. Single flat-rate plan (no tiers to shop) covers all payroll features including W-2s/1099s and multi-state filing; HR features are a separate add-on.",
    startingPrice: 49,
    currency: "USD",

    keyFeatures: [
      "Full-service payroll, all 50 states",
      "W-2/1099 and year-end filings included",
      "Unlimited pay runs",
      "HR add-on (onboarding, PTO policies, org chart)",
      "No implementation fees",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for US small businesses that want simple, transparent, single-plan payroll pricing without shopping between tiers — a strong Gusto alternative, especially for niche industries like farm and clergy payroll.",
    bestFor: [
      "US small businesses wanting one simple, transparent payroll plan",
      "Niche industries (nonprofits, farms, restaurants) needing specialized payroll handling",
    ],
    avoidIf: [
      "You need built-in benefits administration or PEO-level services",
      "You're outside the US",
    ],
    pros: [
      "Single transparent plan — no confusing tier-shopping",
      "Strong support reputation for a budget-friendly price point",
      "All-50-states filing included in the base price",
    ],
    cons: [
      "US-only",
      "Fewer built-in benefits/PEO options than Justworks or Gusto Premium",
      "Smaller brand recognition than Gusto or ADP",
    ],

    popularityScore: 65,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://onpay.com/payroll/software/costs-pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: ["salary-calculator"],
  },
  {
    id: "paycor",
    name: "Paycor",
    // DRAFT - review before publish
    tagline: "All-in-one HCM suite for growing US businesses — payroll, HR, and recruiting, quote-only.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.paycor.com&sz=128",
    website: "https://www.paycor.com",

    category: "hr-payroll",
    subCategory: "hr-management",
    industries: ["agencies", "retail", "construction", "hospitality", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["north-america"],
    regionNotes: "US-focused HCM — VERIFY current regional coverage.",
    useCases: ["run payroll", "recruiting", "workforce analytics", "time and attendance", "talent management"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — confirmed via vendor pricing page that no pricing is published; custom quote only"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Payroll and tax filing",
      "HR and talent management",
      "Recruiting/ATS module",
      "Time and attendance",
      "Workforce analytics",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small-to-midsize US businesses wanting an all-in-one HCM suite from an established vendor — plan on a sales call, since no pricing is published anywhere.",
    bestFor: [
      "Growing US businesses wanting payroll, HR, and recruiting in one platform",
      "Companies that value analytics/reporting depth",
    ],
    avoidIf: [
      "You want to compare pricing without contacting sales",
      "You're a very small or solo operation",
    ],
    pros: [
      "Broad, unified HCM feature set (payroll, HR, talent, time)",
      "Strong analytics and reporting reputation",
      "Serves 40,000+ businesses — established track record",
    ],
    cons: [
      "No public pricing at all — everything is quote-only",
      "US-focused, limited international support",
      "Can be more than very small businesses need",
    ],

    popularityScore: 74,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.paycor.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "trinet-zenefits",
    name: "TriNet Zenefits",
    // DRAFT - review before publish
    tagline: "Published per-employee HR and benefits pricing, with a 5-employee minimum on every plan.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.trinet.com&sz=128",
    website: "https://www.trinet.com",

    category: "hr-payroll",
    subCategory: "hr-management",
    industries: ["agencies", "consulting", "retail", "ecommerce"],
    businessSizes: ["small", "medium"],
    regions: ["north-america"],
    regionNotes: "US-only. All plans and add-ons require a minimum of 5 employees — smaller headcounts are billed as if they had 5.",
    useCases: ["hr records management", "manage benefits", "run payroll", "compliance support", "time and attendance"],
    pricingModel: "subscription",

    pricing: [
      { name: "Essentials", priceMonthly: 8, priceAnnual: 96, currency: "USD", keyLimits: ["$8/employee/mo billed annually ($10/employee/mo month-to-month); minimum 5 employees"] },
      { name: "Growth", priceMonthly: 16, priceAnnual: 192, currency: "USD", keyLimits: ["$16/employee/mo billed annually ($20/employee/mo month-to-month)"] },
      { name: "Zen", priceMonthly: 27, priceAnnual: 324, currency: "USD", keyLimits: ["$27/employee/mo billed annually ($33/employee/mo month-to-month); includes payroll"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier. Payroll is a $6/employee/mo add-on on Essentials/Growth (included in Zen). All plans and add-ons bill a 5-employee minimum regardless of actual headcount.",
    startingPrice: 8,
    currency: "USD",

    keyFeatures: [
      "Core HR and employee records",
      "Benefits administration and broker services",
      "Payroll (add-on, or included on Zen)",
      "Time and attendance",
      "Compliance support",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small US businesses (5+ employees) wanting bundled HR and benefits-broker services from an established, TriNet-backed platform — the 5-employee minimum makes it a poor fit for very small teams.",
    bestFor: [
      "Small US businesses with 5+ employees wanting bundled HR and benefits broker services",
      "Companies wanting a lower-cost Zenefits-style alternative to a full PEO",
    ],
    avoidIf: [
      "You have fewer than 5 employees — you'll pay the 5-employee minimum regardless",
      "You're outside the US",
    ],
    pros: [
      "Published per-employee pricing, both annual and monthly rates listed",
      "Backed by TriNet's broader HR/PEO expertise",
      "Payroll bundled into the top Zen tier",
    ],
    cons: [
      "5-employee minimum billing regardless of actual headcount",
      "Payroll costs extra unless you're on the top Zen tier",
      "US-only",
    ],

    popularityScore: 68,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.trinet.com/plans",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "workday",
    name: "Workday",
    // DRAFT - review before publish
    tagline: "Enterprise-grade global HCM and financial management — fully custom, sales-led pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.workday.com&sz=128",
    website: "https://www.workday.com",

    category: "hr-payroll",
    subCategory: "hr-management",
    industries: ["healthcare", "retail", "construction", "nonprofits"],
    businessSizes: ["enterprise"],
    regions: ["global"],
    regionNotes:
      "No public pricing page exists — Workday is sold exclusively through direct sales with a custom quote based on modules, employee count, and company complexity.",
    useCases: ["workforce planning", "run payroll", "talent management", "financial reporting", "hr analytics"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — custom quote only, no public pricing"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier — enterprise sales-led, typically a guided demo rather than a self-serve trial.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Global HCM and workforce planning",
      "Payroll (select countries)",
      "Talent and performance management",
      "Financial management/ERP modules",
      "Advanced analytics and AI-driven insights",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for large, complex, global enterprises that need HCM tightly integrated with financial/ERP systems — far too much (and too expensive) for small or mid-size businesses, and pricing only comes via a sales process.",
    bestFor: ["Large multinational enterprises needing integrated HCM and financial/ERP systems"],
    avoidIf: [
      "You're a small or mid-size business — this is enterprise-scale complexity and cost",
      "You want to see pricing without a sales engagement",
    ],
    pros: [
      "Extremely comprehensive, deeply configurable HCM/ERP suite",
      "Strong analytics and workforce planning tools",
      "Trusted by many Fortune 500 companies",
    ],
    cons: [
      "No public pricing at all — fully custom, sales-led",
      "Long, complex implementation projects, often with consultants",
      "Massive overkill for small/mid-size businesses",
    ],

    popularityScore: 82,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.workday.com/en-us/pricing.html",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "namely",
    name: "Namely",
    // DRAFT - review before publish
    tagline: "Unified HRIS, payroll, and benefits built for the US mid-market — pricing only via sales.",
    logoUrl: "https://www.google.com/s2/favicons?domain=namely.com&sz=128",
    website: "https://namely.com",

    category: "hr-payroll",
    subCategory: "hr-management",
    industries: ["agencies", "consulting", "retail", "nonprofits"],
    businessSizes: ["small", "medium"],
    regions: ["north-america"],
    regionNotes: "US-focused HR platform typically targeting roughly 50-1000 employee companies — VERIFY current regional coverage.",
    useCases: ["hr records management", "run payroll", "manage benefits", "time and attendance", "talent management"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — third-party sources cite a low entry price for one plan but conflict on the other three plans, which are custom quote only"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Core HRIS and employee records",
      "Payroll (US)",
      "Benefits administration",
      "Time and attendance",
      "Talent management",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for US mid-market companies (roughly 50-1000 employees) wanting an all-in-one HR platform — pricing is only available via a sales conversation for most plans, and reported starting figures aren't reliable enough to publish as fact.",
    bestFor: ["US mid-market companies wanting a unified HRIS, payroll, and benefits platform"],
    avoidIf: [
      "You're a very small team — Namely targets larger mid-market companies",
      "You want transparent self-serve pricing",
    ],
    pros: [
      "Purpose-built for the mid-market HR buyer, not enterprise or micro-business",
      "Combines HRIS, payroll, and benefits in one platform",
      "Established player with a long product history",
    ],
    cons: [
      "No reliable public pricing — third-party estimates conflict",
      "US-only",
      "Best-served market (50-1000 employees) excludes very small or very large businesses",
    ],

    popularityScore: 60,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://namely.com/lp/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "hibob",
    name: "HiBob",
    // DRAFT - review before publish
    tagline: "Modern, employee-experience-focused HRIS ('Bob') for mid-size companies — demo required for pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.hibob.com&sz=128",
    website: "https://www.hibob.com",

    category: "hr-payroll",
    subCategory: "hr-management",
    industries: ["agencies", "consulting", "ecommerce", "retail"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Popular with tech/mid-market companies in the US, UK, and Europe — VERIFY current country payroll coverage per module.",
    useCases: ["hr records management", "performance management", "compensation management", "run payroll", "time and attendance"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — confirmed via vendor site that pricing requires a demo request; no public pricing page"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Core HRIS ('Bob') with a modern, social-style interface",
      "Performance management",
      "Compensation management",
      "Payroll Hub (regional add-on)",
      "Time and attendance",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for mid-size, culture-conscious companies wanting a modern-feeling HRIS — pricing requires a demo/sales conversation, so budget accordingly before falling for the polished UI.",
    bestFor: ["Mid-size companies (roughly 100-3000 employees) wanting a modern, employee-experience-focused HRIS"],
    avoidIf: [
      "You want to see pricing without booking a demo",
      "You're a small team where a lighter, cheaper HRIS would suffice",
    ],
    pros: [
      "Modern, well-reviewed interface aimed at improving employee engagement",
      "Strong compensation and performance management modules",
      "Growing global payroll hub coverage",
    ],
    cons: [
      "No public pricing — requires a demo/quote",
      "Historically positioned toward mid-size/larger companies rather than very small teams",
      "Full payroll coverage varies significantly by country",
    ],

    popularityScore: 70,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.hibob.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "personio",
    name: "Personio",
    // DRAFT - review before publish
    tagline: "HR, payroll, and recruiting for European (especially DACH) small-to-midsize companies — custom quote only.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.personio.com&sz=128",
    website: "https://www.personio.com",

    category: "hr-payroll",
    subCategory: "hr-management",
    industries: ["agencies", "consulting", "retail", "ecommerce"],
    businessSizes: ["small", "medium"],
    regions: ["europe"],
    regionNotes: "Strong presence in Germany/DACH and broader Europe — VERIFY current coverage/support outside Europe.",
    useCases: ["hr records management", "recruiting", "run payroll", "time and attendance", "performance management"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — vendor confirms custom quotes only; third-party per-employee estimates range from roughly $3 to $15/employee/mo depending on source, too inconsistent to publish as fact"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Core HRIS and employee records",
      "Recruiting/ATS module",
      "Payroll (select European countries)",
      "Time and attendance",
      "Performance management",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small-to-midsize European companies, especially in the DACH region, wanting a single HR platform — pricing is quote-only and third-party estimates vary too widely to publish as fact.",
    bestFor: ["Small-to-midsize European companies, especially Germany/DACH, wanting unified HR and recruiting"],
    avoidIf: [
      "You're outside Europe — coverage and support are strongest in DACH/EU",
      "You want transparent self-serve pricing",
    ],
    pros: [
      "Strong European (especially German) compliance and payroll depth",
      "Combines HRIS, ATS, and performance management in one product",
      "Well-regarded in the DACH SMB market",
    ],
    cons: [
      "No public pricing — every quote is custom",
      "Third-party pricing estimates conflict too much to trust",
      "Less relevant outside Europe",
    ],

    popularityScore: 66,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.personio.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "breathe-hr",
    name: "Breathe HR",
    // DRAFT - review before publish
    tagline: "UK HR admin and leave management priced by headcount band rather than per-seat.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.breathehr.com&sz=128",
    website: "https://www.breathehr.com",

    category: "hr-payroll",
    subCategory: "hr-management",
    industries: ["agencies", "consulting", "retail", "nonprofits", "hospitality"],
    businessSizes: ["small", "medium"],
    regions: ["europe"],
    regionNotes: "UK-focused HR software for SMEs, priced by total employee band rather than per-seat — VERIFY exact current tier bands and prices.",
    useCases: ["hr records management", "track PTO", "performance management", "time and attendance"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — independent sources report two materially different sets of banded prices (e.g. Micro £22 vs. £24/mo); needs a direct look at the live page to reconcile"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Leave/absence management",
      "Employee records and self-service",
      "Performance and 1:1 tools",
      "Rota/time & attendance (add-on)",
      "Recruitment (add-on)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for UK small-to-midsize businesses (roughly up to 200 employees) wanting simple, banded HR pricing rather than per-seat billing — confirm exact current tier prices directly, as third-party sources disagree.",
    bestFor: ["UK SMEs (up to roughly 200 employees) wanting simple HR admin and leave management"],
    avoidIf: [
      "You're outside the UK",
      "You need payroll built in — Breathe is HR admin, not payroll",
    ],
    pros: [
      "Pricing banded by total headcount rather than per-seat, which can simplify budgeting",
      "Well-regarded UK SME focus and support",
      "Modular add-ons (rota, recruitment, learning) rather than forced bundling",
    ],
    cons: [
      "Not a payroll product — HR admin only",
      "UK-focused, little relevance outside the UK",
      "Published third-party pricing figures conflict, so exact current rates need direct confirmation",
    ],

    popularityScore: 45,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.breathehr.com/en-gb/hr-software/hr-software-prices",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "sage-hr",
    name: "Sage HR",
    // DRAFT - review before publish
    tagline: "Modular core HR software — pay only for leave management, performance, scheduling, or timesheets as needed.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.sage.com&sz=128",
    website: "https://www.sage.com/en-us/sage-business-cloud/hr/",

    category: "hr-payroll",
    subCategory: "hr-management",
    industries: ["agencies", "consulting", "retail", "construction", "nonprofits"],
    businessSizes: ["small", "medium"],
    regions: ["global", "europe", "north-america", "africa"],
    regionNotes: "Pricing shown is the US-market rate; other regions (e.g. Canada) show different per-employee pricing — VERIFY the correct regional page for your market.",
    useCases: ["hr records management", "track PTO", "performance management", "shift scheduling", "timesheets"],
    pricingModel: "subscription",

    pricing: [
      { name: "Core HR + Leave Management", priceMonthly: 5.5, priceAnnual: null, currency: "USD", keyLimits: ["$5.50/employee/mo (US rate); for companies up to 250 employees"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — 30-day free trial with full feature access, no card required. Modular add-ons cost extra: Performance Management +$2/employee/mo, Shift Scheduling +$3/employee/mo, Timesheets +$3/employee/mo.",
    startingPrice: 5.5,
    currency: "USD",

    keyFeatures: [
      "Core HR and leave management",
      "Modular add-ons (performance, scheduling, timesheets)",
      "Employee self-service and mobile app",
      "Reporting",
      "Onboarding workflows",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small-to-midsize businesses wanting an affordable, modular HRIS where you only pay for the pieces (performance, scheduling, timesheets) you actually need — not a payroll product, and pricing varies by region.",
    bestFor: [
      "Small-to-midsize businesses wanting low-cost, modular core HR software",
      "Companies already in the Sage ecosystem (accounting, HRMS)",
    ],
    avoidIf: [
      "You need payroll built into the same product",
      "You're outside the US and need to confirm your region's specific pricing",
    ],
    pros: [
      "Low published starting price relative to the category",
      "Genuinely modular — add only the features you need",
      "30-day free trial with no card required",
    ],
    cons: [
      "Not a payroll product — HR admin/leave management is the core, payroll isn't included",
      "Add-on costs add up if you need performance + scheduling + timesheets",
      "Regional pricing varies (US figure won't match Canada/UK/other markets)",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.sage.com/en-us/sage-business-cloud/hr/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    // DRAFT - review before publish
    tagline: "Structured, bias-reducing hiring workflows for teams serious about recruiting process — quote-only pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.greenhouse.com&sz=128",
    website: "https://www.greenhouse.com",

    category: "hr-payroll",
    subCategory: "recruiting-ats",
    industries: ["agencies", "consulting", "retail", "healthcare", "ecommerce"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional coverage and localization depth.",
    useCases: ["recruiting", "structured interviews", "candidate sourcing", "hiring analytics", "onboarding"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — confirmed via vendor pricing page that Core/Plus/Pro tiers exist but no prices are published; custom quote based on hiring volume and complexity"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Structured hiring and interview kits",
      "Sourcing and candidate CRM",
      "AI-powered automation (Plus/Pro tiers)",
      "Advanced reporting and analytics",
      "Enterprise security and audit logs (Pro)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for companies serious about structured, bias-reducing hiring processes and willing to go through a sales conversation for pricing — not a fit if you want to see a price list before talking to anyone.",
    bestFor: ["Companies wanting structured, data-driven hiring processes at meaningful hiring volume"],
    avoidIf: [
      "You want transparent self-serve pricing",
      "Your hiring volume is very low — the sales-led onboarding is overkill",
    ],
    pros: [
      "Widely regarded as a leader in structured, bias-reducing hiring workflows",
      "Strong reporting and analytics on hiring pipelines",
      "Core features included across all three tiers (Core/Plus/Pro)",
    ],
    cons: [
      "No public pricing — cost depends on hiring volume and org complexity",
      "Requires a sales conversation to get any number at all",
      "Can be more process than very small teams need",
    ],

    popularityScore: 76,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.greenhouse.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "lever",
    name: "Lever",
    // DRAFT - review before publish
    tagline: "ATS plus recruiting CRM in one tool for proactive sourcing — pricing available on request only.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.lever.co&sz=128",
    website: "https://www.lever.co",

    category: "hr-payroll",
    subCategory: "recruiting-ats",
    industries: ["agencies", "consulting", "retail", "ecommerce", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional coverage and localization depth.",
    useCases: ["recruiting", "candidate sourcing", "interview scheduling", "hiring analytics"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — confirmed via vendor pricing page that pricing is 'available upon request' only, tailored to org size and hiring needs"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "ATS and recruiting CRM in one product",
      "AI-assisted screening",
      "Interview transcripts and fraud prevention tools",
      "Reporting and analytics",
      "Onboarding add-on",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for companies that want recruiting CRM (proactive sourcing and relationship-building) combined with an ATS in one tool — like Greenhouse, real pricing only comes from a sales conversation.",
    bestFor: ["Companies that want combined ATS + recruiting CRM for proactive sourcing"],
    avoidIf: [
      "You want transparent self-serve pricing",
      "You just need a simple job-posting/applicant tracker, not a full CRM",
    ],
    pros: [
      "Combines ATS and CRM for proactive candidate relationship-building",
      "AI screening and interview-fraud-prevention tools built in",
      "Scales from growing companies to larger enterprises",
    ],
    cons: [
      "No public pricing — fully custom quotes",
      "Requires a sales call/demo to get any pricing signal",
      "More CRM-heavy than teams that just need basic applicant tracking may want",
    ],

    popularityScore: 62,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.lever.co/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "homebase",
    name: "Homebase",
    // DRAFT - review before publish
    tagline: "Free scheduling and time tracking for single-location hourly teams, with payroll as an affordable add-on.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.joinhomebase.com&sz=128",
    website: "https://www.joinhomebase.com",

    category: "hr-payroll",
    subCategory: "payroll",
    industries: ["retail", "hospitality", "construction", "healthcare"],
    businessSizes: ["solo", "small"],
    regions: ["north-america"],
    regionNotes: "US-only; built for hourly/shift-based teams (retail, restaurants, etc.) rather than salaried knowledge workers.",
    useCases: ["employee scheduling", "time tracking", "run payroll", "team messaging", "hiring"],
    pricingModel: "freemium",

    pricing: [
      { name: "Basic", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Free for 1 location, up to 10 employees — scheduling, time clock, messaging"] },
      { name: "Essentials", priceMonthly: 30, priceAnnual: 24, currency: "USD", keyLimits: ["Per location; $24/mo billed annually"] },
      { name: "Plus", priceMonthly: 70, priceAnnual: 56, currency: "USD", keyLimits: ["Per location; $56/mo billed annually"] },
      { name: "All-in-One", priceMonthly: 120, priceAnnual: 96, currency: "USD", keyLimits: ["Per location; $96/mo billed annually"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Basic plan is free forever for 1 location with up to 10 employees (scheduling, time clock, team messaging) — not a trial. Payroll is a separate add-on at $39/mo + $6/employee/mo on any plan. A 14-day free trial of All-in-One is also available, reverting to Basic if no plan is chosen.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Employee scheduling",
      "Time clock / time tracking",
      "Team messaging",
      "Hiring tools and job posts",
      "Payroll (add-on)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for hourly, shift-based small businesses (retail, restaurants, cafes) that want scheduling and time tracking free at a single location, with payroll as an add-on when needed — not built for salaried/office teams.",
    bestFor: [
      "Single-location hourly/shift-based small businesses (retail, food service)",
      "Businesses that mainly need scheduling and time tracking, with payroll optional",
    ],
    avoidIf: [
      "You run a salaried/knowledge-work team rather than hourly shift workers",
      "You need multi-location features without paying per location",
    ],
    pros: [
      "Genuinely free tier for single-location small teams, not just a trial",
      "Payroll add-on price is transparent and affordable",
      "Strong fit for the specific hourly/shift-work use case",
    ],
    cons: [
      "US-only",
      "Pricing is per-location, which adds up for multi-location businesses",
      "Payroll is an add-on, not included even on the paid HR plans",
    ],

    popularityScore: 72,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.joinhomebase.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: ["salary-calculator"],
  },
  {
    id: "quickbooks-payroll",
    name: "QuickBooks Payroll",
    // DRAFT - review before publish
    tagline: "US payroll that lives inside QuickBooks Online — best value if you're already an Intuit customer.",
    logoUrl: "https://www.google.com/s2/favicons?domain=quickbooks.intuit.com&sz=128",
    website: "https://quickbooks.intuit.com/payroll/",

    category: "hr-payroll",
    subCategory: "payroll",
    industries: ["retail", "construction", "consulting", "ecommerce", "healthcare"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["north-america"],
    regionNotes: "US-only payroll; can run standalone or bundled with QuickBooks Online accounting — VERIFY current bundling/discount rules.",
    useCases: ["run payroll", "file payroll taxes", "workers comp administration", "hr support"],
    pricingModel: "subscription",

    pricing: [
      { name: "Workforce Payroll (Core)", priceMonthly: 50, priceAnnual: null, currency: "USD", keyLimits: ["$50/mo + $6/employee/mo — full-service payroll, next-day deposit"] },
      { name: "Workforce Premium", priceMonthly: 85, priceAnnual: null, currency: "USD", keyLimits: ["$85/mo + $9/employee/mo — adds same-day deposit, HR support, workers' comp admin"] },
      { name: "Workforce Elite", priceMonthly: 130, priceAnnual: null, currency: "USD", keyLimits: ["$130/mo + $11/employee/mo — adds tax penalty protection, personal HR advisor"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier. New pricing and naming (Workforce Payroll/Premium/Elite, replacing the former Core/Premium/Elite names) took effect July 1, 2026. Many customers get an introductory discount (e.g. 50% off) for the first few months.",
    startingPrice: 50,
    currency: "USD",

    keyFeatures: [
      "Full-service payroll with automatic tax filing",
      "Same-day/next-day direct deposit (plan-dependent)",
      "Integrates directly with QuickBooks Online accounting",
      "HR support and workers' comp administration (higher tiers)",
      "Tax penalty protection (Elite)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for existing QuickBooks Online users who want payroll in the same system rather than integrating a separate tool — less compelling as a standalone choice if you don't already use QuickBooks for accounting.",
    bestFor: [
      "Existing QuickBooks Online users wanting payroll in the same login",
      "US small businesses wanting tax-filing accuracy backed by Intuit",
    ],
    avoidIf: [
      "You don't use QuickBooks Online and don't want to",
      "You're outside the US",
    ],
    pros: [
      "Deep integration with QuickBooks Online accounting",
      "Tax penalty protection on the top tier",
      "Well-established, Intuit-backed reliability",
    ],
    cons: [
      "US-only",
      "Plan names and pricing changed recently (renamed Workforce Payroll/Premium/Elite as of July 2026) — worth double-checking current terms",
      "Standalone value is weaker if you don't already use QuickBooks accounting",
    ],

    popularityScore: 79,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://quickbooks.intuit.com/payroll/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: ["salary-calculator", "tax-calculator"],
  },
];
