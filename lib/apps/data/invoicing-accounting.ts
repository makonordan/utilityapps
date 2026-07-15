import type { AppListing } from "../types";

// Scaffolded via Prompt 2 — 18 well-known Invoicing & Accounting tools.
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

export const INVOICING_APPS: AppListing[] = [
  {
    id: "freshbooks",
    name: "FreshBooks",
    // DRAFT - review before publish
    tagline: "Invoicing and light bookkeeping built for freelancers who bill by time or project.",
    logoUrl: "VERIFY",
    website: "https://www.freshbooks.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "agencies", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["global", "north-america"],
    regionNotes:
      "US/Canada-centric; limited localized tax support outside North America — VERIFY current international coverage.",
    useCases: ["send invoices", "track time", "track expenses", "accept online payments", "client management"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Recurring invoices",
      "Time tracking",
      "Expense tracking",
      "Client portal",
      "Online payment acceptance",
      "Double-entry accounting reports",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for solo service providers and small agencies who want invoicing and light bookkeeping to feel effortless — not for businesses that need deep inventory or multi-entity accounting.",
    bestFor: [
      "Freelancers and consultants who bill by time or project",
      "Small service agencies wanting a polished client experience",
    ],
    avoidIf: [
      "You need inventory management or multi-entity consolidation",
      "You have a large team and want per-user pricing to stay flat",
    ],
    pros: [
      "Polished, easy-to-use interface aimed at non-accountants",
      "Strong time-tracking and project billing for service businesses",
      "Good client-facing invoice and payment experience",
    ],
    cons: [
      "Per-client pricing on lower tiers can get expensive as you grow",
      "Inventory and multi-currency support lag behind QuickBooks/Xero",
      "Team members cost extra on every plan",
    ],

    popularityScore: 82,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.freshbooks.com/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator", "freelance-contract-generator"],
  },
  {
    id: "quickbooks-online",
    name: "QuickBooks Online",
    // DRAFT - review before publish
    tagline: "The category default for US small businesses — full accounting, payroll, and a huge app ecosystem.",
    logoUrl: "VERIFY",
    website: "https://quickbooks.intuit.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["retail", "construction", "consulting", "ecommerce", "healthcare", "real-estate"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global", "north-america", "europe", "oceania"],
    regionNotes:
      "US, UK, Canada, Australia and India each run separate localized QuickBooks Online products with different features/pricing — VERIFY which regional product a given user needs.",
    useCases: ["send invoices", "track expenses", "manage bills", "run payroll", "file taxes", "financial reporting"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Invoicing and payments",
      "Expense and receipt tracking",
      "Bank feed reconciliation",
      "Payroll (add-on)",
      "Inventory tracking",
      "Extensive report library and app marketplace",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The default choice for US small businesses that want their accountant to already know the software — shop the exact plan tier carefully, since it's rarely the cheapest option.",
    bestFor: [
      "US small businesses that work with an outside bookkeeper/accountant",
      "Businesses that need payroll, inventory, and invoicing in one place",
    ],
    avoidIf: [
      "You're a solo freelancer with simple needs — this is overkill and pricier than dedicated invoicing tools",
      "You're outside the US/UK/CA/AU and need strong local tax support",
    ],
    pros: [
      "Largest ecosystem of integrations, apps, and accountant familiarity",
      "Scales from solo freelancer up to multi-user small business",
      "Deep reporting and tax-prep tooling",
    ],
    cons: [
      "Pricing has crept up significantly over the past few years",
      "Interface can feel cluttered compared to newer competitors",
      "Live support quality is inconsistent",
    ],

    popularityScore: 97,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://quickbooks.intuit.com/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator", "purchase-order-generator", "tax-calculator"],
  },
  {
    id: "xero",
    name: "Xero",
    // DRAFT - review before publish
    tagline: "Full accounting with unlimited users on every plan — strong outside the US too.",
    logoUrl: "VERIFY",
    website: "https://www.xero.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["agencies", "consulting", "retail", "construction", "ecommerce"],
    businessSizes: ["small", "medium"],
    regions: ["global", "north-america", "europe", "oceania"],
    regionNotes:
      "Originated in New Zealand; strong UK, Australia and NZ tax/MTD support with a growing US presence.",
    useCases: ["send invoices", "manage bills", "track expenses", "multi-currency billing", "financial reporting", "file taxes"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Unlimited users on every plan",
      "Bank reconciliation",
      "Multi-currency accounting",
      "Inventory tracking",
      "Project tracking",
      "Extensive third-party app marketplace",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small businesses with multiple people who need to log in without per-seat fees, especially outside the US.",
    bestFor: [
      "Small teams that need multiple people in the books without per-user fees",
      "Businesses operating in multiple currencies",
    ],
    avoidIf: [
      "You're a true solo operator — the per-invoice/bill caps on the entry plan may bite",
      "You need robust built-in payroll in your country",
    ],
    pros: [
      "Unlimited users even on entry plans — unusual in this category",
      "Clean, modern interface",
      "Strong multi-currency and international support",
    ],
    cons: [
      "Entry-level plan caps invoice/bill volume",
      "Payroll support is limited or absent in some regions",
      "Fewer built-in industry-specific reports than QuickBooks",
    ],

    popularityScore: 90,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.xero.com/us/pricing-plans/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator", "purchase-order-generator", "tax-calculator"],
  },
  {
    id: "wave",
    name: "Wave",
    // DRAFT - review before publish
    tagline: "Genuinely free invoicing and accounting for US/Canada freelancers and very small businesses.",
    logoUrl: "VERIFY",
    website: "https://www.waveapps.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "consulting", "retail"],
    businessSizes: ["solo", "small"],
    regions: ["north-america"],
    regionNotes: "US and Canada only — not available or localized for other regions.",
    useCases: ["send invoices", "track expenses", "accept online payments", "basic bookkeeping"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Free unlimited invoicing and accounting",
      "Receipt scanning (paid add-on)",
      "Bank and credit card connections",
      "Double-entry accounting",
      "Payroll (paid add-on, US/Canada)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The best free option for US/Canada freelancers and very small businesses who want real accounting, not just invoicing — but you'll likely outgrow it.",
    bestFor: [
      "US/Canada solopreneurs and side-hustles wanting free bookkeeping",
      "Freelancers who don't need advanced reporting or multi-currency",
    ],
    avoidIf: [
      "You're outside the US or Canada",
      "You expect to scale past a few employees soon — migration later can be painful",
    ],
    pros: [
      "Genuinely free core accounting and invoicing, not a time-limited trial",
      "Clean, simple interface for non-accountants",
      "Good fit for very early-stage or side-hustle businesses",
    ],
    cons: [
      "Limited to US and Canada",
      "Customer support is minimal on the free plan",
      "Fewer integrations and less depth than paid competitors as you grow",
    ],

    popularityScore: 78,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.waveapps.com/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "zoho-books",
    name: "Zoho Books",
    // DRAFT - review before publish
    tagline: "Full double-entry accounting at a lower price point, with deep multi-country tax support.",
    logoUrl: "VERIFY",
    website: "https://www.zoho.com/books/",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["agencies", "consulting", "retail", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global", "asia", "north-america", "europe"],
    regionNotes:
      "Broad multi-country tax compliance including UK/EU VAT and India GST — VERIFY country-specific feature parity.",
    useCases: ["send invoices", "track expenses", "manage bills", "multi-currency billing", "file taxes", "financial reporting"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Multi-currency invoicing",
      "Client portal",
      "Inventory tracking",
      "Workflow automation",
      "Multi-country tax compliance (GST, VAT)",
      "Integrates with the wider Zoho suite",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best value full accounting suite for small businesses already in or open to the Zoho ecosystem, especially outside the US.",
    bestFor: [
      "Price-sensitive small businesses needing full double-entry accounting",
      "Businesses already using other Zoho apps (CRM, Zoho Invoice, etc.)",
    ],
    avoidIf: [
      "You want the accountant-familiarity of QuickBooks/Xero",
      "You need a single, standalone tool with no ecosystem lock-in",
    ],
    pros: [
      "Strong value at lower price points than QuickBooks/Xero",
      "Free plan available for very small revenue businesses",
      "Deep integration if you already use other Zoho apps",
    ],
    cons: [
      "Less brand recognition — fewer accountants are already familiar with it",
      "Feature depth can lag behind Xero/QuickBooks for complex needs",
      "Best experience assumes buy-in to the Zoho ecosystem",
    ],

    popularityScore: 74,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.zoho.com/us/books/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator", "purchase-order-generator", "currency-converter"],
  },
  {
    id: "invoice-ninja",
    name: "Invoice Ninja",
    // DRAFT - review before publish
    tagline: "Open-source invoicing you can self-host for free, or run hosted for a small fee.",
    logoUrl: "VERIFY",
    website: "https://invoiceninja.com",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["freelancers", "agencies", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Self-hosting removes regional restrictions entirely; the hosted plans are US-billed.",
    useCases: ["send invoices", "accept online payments", "track expenses", "client management", "send proposals"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Self-hosted (free, open-source) or hosted options",
      "Client portal",
      "Recurring invoices and subscriptions",
      "Proposal and quote builder",
      "Time tracking",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for technical freelancers and small teams who want an open-source, no-lock-in invoicing tool — either free to self-host or cheap to host.",
    bestFor: [
      "Developers and technical freelancers comfortable self-hosting",
      "Anyone who wants to avoid vendor lock-in on their invoicing data",
    ],
    avoidIf: [
      "You're not comfortable maintaining your own server for the self-hosted route",
      "You need full accounting (ledgers, reconciliation), not just invoicing",
    ],
    pros: [
      "Open-source self-hosting option means zero ongoing cost if you run it yourself",
      "Generous free tier on the hosted version for low client counts",
      "Good proposal/quote tooling alongside invoicing",
    ],
    cons: [
      "Self-hosting requires technical comfort (server setup, updates, backups)",
      "UI is less polished than FreshBooks/Bonsai",
      "Not a full double-entry accounting system",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://invoiceninja.com/pricing-plans/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator", "freelance-contract-generator"],
  },
  {
    id: "bonsai",
    name: "Bonsai",
    // DRAFT - review before publish
    tagline: "Contracts, proposals, and invoicing in one workflow for freelance consultants and creatives.",
    logoUrl: "VERIFY",
    website: "https://www.hellobonsai.com",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["freelancers", "consulting", "agencies"],
    businessSizes: ["solo", "small"],
    regions: ["north-america", "global"],
    regionNotes:
      "US-centric contract and self-employment tax tooling; usable globally for basic invoicing — VERIFY international tax support.",
    useCases: ["send invoices", "send contracts", "client management", "accept online payments", "track time", "send proposals"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Contracts and e-signatures",
      "Proposals and client CRM",
      "Invoicing tied to contracts/projects",
      "Time tracking",
      "Tax estimates for US freelancers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for solo freelancers and small creative/consulting shops who want contracts, proposals, and invoicing in one place — not a bookkeeping replacement.",
    bestFor: ["Freelance consultants, designers, and creatives who send contracts and invoices from one place"],
    avoidIf: [
      "You need actual double-entry accounting and financial reports",
      "You just need simple invoicing and don't need contracts/proposals",
    ],
    pros: [
      "Combines contracts, proposals, and invoicing in one freelancer-focused workflow",
      "Good fit for creative and consulting freelancers who bill project-to-project",
      "US self-employment tax estimate tools",
    ],
    cons: [
      "Per-user pricing model can feel steep for a solo freelancer over time",
      "Less suited to businesses needing real double-entry bookkeeping",
      "Some users report a learning curve for the full client-management workflow",
    ],

    popularityScore: 58,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.hellobonsai.com/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "freelance-contract-generator", "receipt-generator"],
  },
  {
    id: "harvest",
    name: "Harvest",
    // DRAFT - review before publish
    tagline: "Time tracking that turns straight into client invoices — built for agencies billing hourly.",
    logoUrl: "VERIFY",
    website: "https://www.getharvest.com",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["agencies", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment method and tax support.",
    useCases: ["track time", "send invoices", "project budgeting", "team reporting"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Time tracking with desktop/mobile timers",
      "Invoicing generated straight from tracked time",
      "Project budgets and forecasting",
      "Team utilization reports",
      "Integrates with many project-management tools",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for agencies and consultancies that bill by the hour and want time tracking and invoicing tightly linked — pair it with real accounting software, don't expect it to replace one.",
    bestFor: ["Agencies and consultancies billing hourly across multiple client projects"],
    avoidIf: [
      "You need a standalone accounting system, not just time-based invoicing",
      "You don't bill by time/project",
    ],
    pros: [
      "Best-in-class time tracking that turns directly into client invoices",
      "Clean reporting on project profitability and team utilization",
      "Wide integration ecosystem for agencies",
    ],
    cons: [
      "Not a general accounting tool — no bank reconciliation or ledgers",
      "Cost scales per seat, which adds up for larger teams",
      "Invoicing features are basic compared to dedicated invoicing tools",
    ],

    popularityScore: 65,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.getharvest.com/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "bill-com",
    name: "Bill.com",
    // DRAFT - review before publish
    tagline: "Accounts payable and receivable automation with approval workflows, layered on your existing books.",
    logoUrl: "VERIFY",
    website: "https://www.bill.com",

    category: "invoicing-accounting",
    subCategory: "accounts-payable",
    industries: ["agencies", "consulting", "retail", "nonprofits", "real-estate"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["north-america"],
    regionNotes:
      "US-focused; built around ACH and US banking rails, limited international payment support — VERIFY current international coverage.",
    useCases: ["manage bills", "send invoices", "approve payments", "manage vendors", "accounts payable automation"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Accounts payable and receivable automation",
      "Approval workflows",
      "ACH and check payments",
      "Vendor and bill management",
      "Syncs with QuickBooks/Xero/Sage/NetSuite",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best as an accounts-payable/receivable layer on top of QuickBooks/Xero/Sage for businesses that need approval workflows around who pays what — not a replacement for your accounting software.",
    bestFor: ["Small-to-mid businesses with multiple people approving vendor payments"],
    avoidIf: [
      "You're a solo freelancer or very small business — this is built for approval workflows you don't need yet",
      "You're outside the US and need non-ACH payment rails",
    ],
    pros: [
      "Strong approval-workflow automation for teams paying many vendors",
      "Syncs with the accounting system you already use rather than replacing it",
      "Scales into enterprise-grade AP/AR needs",
    ],
    cons: [
      "Per-user pricing gets expensive fast for small teams",
      "Overkill if you just need to send invoices, not manage vendor bill approvals",
      "US-centric payment rails (ACH/checks)",
    ],

    popularityScore: 70,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.bill.com/product/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "purchase-order-generator", "receipt-generator"],
  },
  {
    id: "sage-business-cloud",
    name: "Sage Business Cloud Accounting",
    // DRAFT - review before publish
    tagline: "Established, compliance-focused accounting with deep UK and South Africa support.",
    logoUrl: "VERIFY",
    website: "https://www.sage.com/en-us/sage-business-cloud/accounting/",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["construction", "retail", "nonprofits", "consulting"],
    businessSizes: ["small", "medium"],
    regions: ["europe", "africa", "north-america"],
    regionNotes:
      "Strong UK and South Africa presence with VAT/Making Tax Digital support; thinner ecosystem in the US — VERIFY current regional product lineup.",
    useCases: ["send invoices", "track expenses", "manage bills", "file taxes", "financial reporting"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Double-entry accounting",
      "Bank reconciliation",
      "VAT/Making Tax Digital support (UK)",
      "Multi-currency invoicing",
      "Cash flow forecasting",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for UK and South African small businesses that want an established, compliance-focused accounting vendor — less compelling in the US where the ecosystem is thinner.",
    bestFor: ["UK/South Africa small businesses needing VAT/MTD-compliant accounting"],
    avoidIf: [
      "You're US-based and want the larger app ecosystem of QuickBooks/Xero",
      "You want the most modern, polished interface in the category",
    ],
    pros: [
      "Long track record with strong UK and South Africa tax/compliance support",
      "Solid choice for construction and nonprofit-adjacent SMBs already in the Sage ecosystem",
      "Scales toward Sage's larger ERP products if you outgrow it",
    ],
    cons: [
      "Interface feels dated next to Xero/QuickBooks",
      "Fewer third-party integrations than Xero/QuickBooks",
      "Brand is less prominent in the US market",
    ],

    popularityScore: 68,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.sage.com/en-us/sage-business-cloud/accounting/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "purchase-order-generator", "receipt-generator", "tax-calculator"],
  },
  {
    id: "freeagent",
    name: "FreeAgent",
    // DRAFT - review before publish
    tagline: "One simple plan for UK sole traders and small companies handling Self Assessment and MTD.",
    logoUrl: "VERIFY",
    website: "https://www.freeagent.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "consulting", "agencies"],
    businessSizes: ["solo", "small"],
    regions: ["europe"],
    regionNotes:
      "UK-focused; built around UK Self Assessment and Making Tax Digital. Free for customers of certain UK banks (e.g. NatWest group, Mettle) — VERIFY current bank partnerships.",
    useCases: ["send invoices", "track expenses", "file taxes", "time tracking", "project tracking"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Self Assessment and Making Tax Digital tools (UK)",
      "Project time tracking",
      "Unlimited users, clients, and invoices on the one plan",
      "Bank feeds",
      "Estimates and expenses",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for UK sole traders and small limited companies who want their books and Self Assessment tax return handled in one simple plan.",
    bestFor: ["UK freelancers and small limited companies filing UK Self Assessment/MTD"],
    avoidIf: ["You're outside the UK", "You need multi-entity or multi-currency support at scale"],
    pros: [
      "Single simple plan with unlimited users/invoices, no tier-shopping",
      "Deep UK tax focus (Self Assessment, MTD) built for sole traders and small limited companies",
      "Often free if you bank with certain UK banks (e.g. NatWest group, Mettle)",
    ],
    cons: [
      "Little value outside the UK — features are built around UK tax rules",
      "Smaller app ecosystem than Xero/QuickBooks",
      "Not designed for larger, multi-entity businesses",
    ],

    popularityScore: 52,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.freeagent.com/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator", "tax-calculator"],
  },
  {
    id: "kashoo",
    name: "Kashoo",
    // DRAFT - review before publish
    tagline: "No-frills double-entry bookkeeping with one flat plan and unlimited users.",
    logoUrl: "VERIFY",
    website: "https://kashoo.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "retail", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["north-america"],
    regionNotes: "US/Canada-focused — VERIFY availability and support outside North America.",
    useCases: ["send invoices", "track expenses", "basic bookkeeping", "financial reporting"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Simple double-entry bookkeeping",
      "Unlimited users on the plan",
      "Bank connections",
      "Basic invoicing",
      "Income and expense reports",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for very small, simple businesses that want no-frills bookkeeping and don't want to pay per user — not for anyone planning to grow into more complex needs.",
    bestFor: ["Very small businesses wanting simple, no-frills bookkeeping"],
    avoidIf: [
      "You need inventory, payroll, or project tracking",
      "You want a large integration/app marketplace",
    ],
    pros: [
      "Simple flat single-plan pricing with unlimited users",
      "Straightforward bookkeeping for very small businesses that find QuickBooks/Xero overwhelming",
    ],
    cons: [
      "Feature set is thin next to Xero/QuickBooks/Zoho Books — fewer integrations, less automation",
      "Smaller company/support footprint; slower feature development",
      "Not a fit once you need payroll, inventory, or project tracking",
    ],

    popularityScore: 30,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://kashoo.com/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "invoicely",
    name: "Invoicely",
    // DRAFT - review before publish
    tagline: "Simple free-to-start invoicing for occasional invoicers running multiple small businesses.",
    logoUrl: "VERIFY",
    website: "https://invoicely.com",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["freelancers", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and tax support.",
    useCases: ["send invoices", "accept online payments", "basic expense tracking"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Multiple business unit support",
      "Recurring invoices",
      "PDF invoice generation",
      "Multi-currency invoicing",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "An acceptable free/cheap option for someone who sends a handful of invoices a month and needs nothing more — most growing businesses will outgrow it fast.",
    bestFor: ["Very occasional invoicers who just need a handful of clean invoices a month"],
    avoidIf: [
      "You send more than a few invoices monthly — check the free-tier cap before relying on it",
      "You need real bookkeeping, not just invoice PDFs",
    ],
    pros: [
      "Usable free tier for occasional invoicers",
      "Simple, no-frills invoice creation and sending",
      "Supports multiple businesses under one account",
    ],
    cons: [
      "Not a full accounting system — no bank reconciliation or ledgers",
      "Interface and feature velocity lag well behind category leaders",
      "Free plan invoice cap will force an upgrade quickly for active use",
    ],

    popularityScore: 35,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://invoicely.com/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "hiveage",
    name: "Hiveage",
    // DRAFT - review before publish
    tagline: "Budget invoicing with built-in time tracking — a smaller-name alternative to FreshBooks.",
    logoUrl: "VERIFY",
    website: "https://www.hiveage.com",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["freelancers", "agencies", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and tax support.",
    useCases: ["send invoices", "track time", "accept online payments", "estimates"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Recurring invoices and subscriptions",
      "Time and expense tracking",
      "Estimates that convert to invoices",
      "Client management",
      "Multi-currency support",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "A reasonable budget alternative to FreshBooks for freelancers who mainly need invoicing plus light time tracking, with a genuinely usable free tier at very low client counts.",
    bestFor: ["Budget-conscious freelancers who want invoicing plus time tracking"],
    avoidIf: [
      "You want the polish and integration depth of FreshBooks/Bonsai",
      "You need full accounting, not just invoicing",
    ],
    pros: [
      "Solid feature set for the price relative to bigger-name competitors",
      "Free plan usable for a handful of clients",
      "Time tracking built in alongside invoicing",
    ],
    cons: [
      "Much smaller brand/support footprint than FreshBooks or Zoho",
      "Not a double-entry accounting system",
      "Free-tier client cap means most active freelancers upgrade quickly",
    ],

    popularityScore: 32,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.hiveage.com/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "moon-invoice",
    name: "Moon Invoice",
    // DRAFT - review before publish
    tagline: "Mobile-first invoicing for tradespeople and small businesses billing from the field.",
    logoUrl: "VERIFY",
    website: "https://www.mooninvoice.com",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["freelancers", "retail", "construction"],
    businessSizes: ["solo", "small"],
    regions: ["global", "asia"],
    regionNotes:
      "Popular with small businesses and trades in Asia, the Middle East and Africa in addition to North America — VERIFY regional tax/localization depth.",
    useCases: ["send invoices", "track expenses", "estimates", "mobile invoicing"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Mobile-first invoicing app (iOS/Android)",
      "Recurring invoices",
      "Estimates and purchase orders",
      "Multi-currency support",
      "Offline invoice creation",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for tradespeople and mobile-first small businesses who create invoices and estimates from a phone on job sites, rather than at a desk doing full bookkeeping.",
    bestFor: ["Mobile/field-based small businesses (trades, services) invoicing from a phone"],
    avoidIf: [
      "You primarily work from a desktop and want the best web experience",
      "You need real double-entry accounting",
    ],
    pros: [
      "Strong mobile-app experience for on-the-go invoicing",
      "Affordable relative to full accounting suites",
      "Supports estimates and purchase orders alongside invoices",
    ],
    cons: [
      "Not a full accounting/bookkeeping system",
      "Less brand recognition and a smaller support team than category leaders",
      "Desktop/web experience is secondary to the mobile app",
    ],

    popularityScore: 40,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.mooninvoice.com/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator", "purchase-order-generator"],
  },
  {
    id: "zoho-invoice",
    name: "Zoho Invoice",
    // DRAFT - review before publish
    tagline: "Completely free invoicing, forever — not a trial, with an upgrade path into Zoho Books.",
    logoUrl: "VERIFY",
    website: "https://www.zoho.com/invoice/",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["freelancers", "consulting", "agencies"],
    businessSizes: ["solo", "small"],
    regions: ["global", "asia", "north-america", "europe"],
    regionNotes:
      "Same multi-country tax coverage as Zoho Books (UK/EU VAT, India GST) — VERIFY country-specific feature parity.",
    useCases: ["send invoices", "accept online payments", "estimates", "recurring billing"],
    pricingModel: "free",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Completely free invoicing (no paid tier)",
      "Recurring invoices",
      "Client portal",
      "Multi-currency and multi-language invoices",
      "Payment reminders",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The best pure-invoicing tool to start with at zero cost — upgrade to Zoho Books later if you need real bookkeeping, or switch entirely if you don't want Zoho branding.",
    bestFor: ["Solopreneurs and small businesses that only need to send professional invoices, for free"],
    avoidIf: [
      "You need bookkeeping/accounting, not just invoicing",
      "You don't want Zoho branding on client-facing invoices",
    ],
    pros: [
      "Genuinely free forever for invoicing, not a limited trial",
      "Polished interface backed by the wider Zoho ecosystem",
      "Good multi-currency and tax-compliant invoice templates",
    ],
    cons: [
      "Invoices may carry Zoho branding depending on plan — VERIFY current branding rules",
      "Not an accounting system — pushes you toward Zoho Books if you need bookkeeping",
      "Support is community/email-based on the free tier",
    ],

    popularityScore: 60,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.zoho.com/us/invoice/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "paypal-invoicing",
    name: "PayPal Invoicing",
    // DRAFT - review before publish
    tagline: "Send an invoice from an account your clients already trust — no subscription, pay per transaction.",
    logoUrl: "VERIFY",
    website: "https://www.paypal.com/us/business/accept-payments/invoice",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["freelancers", "retail", "ecommerce"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes:
      "Available anywhere PayPal Business operates; fees and supported payment methods vary by country — VERIFY country-specific fee schedule.",
    useCases: ["send invoices", "accept online payments", "one-off client billing"],
    pricingModel: "free",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "No monthly fee — pay only per transaction",
      "Invoices payable via PayPal, Venmo, or card",
      "Built-in payment tracking and reminders",
      "Works standalone or from a PayPal Business account",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Fine for sending the occasional one-off invoice with zero setup, but the per-transaction fees and lack of accounting features make it a poor fit as your only invoicing tool once volume grows.",
    bestFor: ["Anyone sending occasional invoices who wants zero setup and instant online payment"],
    avoidIf: [
      "You invoice regularly — the per-transaction fees add up fast versus a subscription tool",
      "You need expense tracking, reporting, or accounting features",
    ],
    pros: [
      "No subscription cost — good for occasional invoicing",
      "Customers can pay instantly via a payment method they likely already trust",
      "Zero setup — usable immediately from an existing PayPal account",
    ],
    cons: [
      "Transaction fees are higher than a dedicated invoicing tool plus a cheap payment processor",
      "No real accounting, expense tracking, or reporting depth",
      "Invoice customization and automation are limited next to dedicated tools",
    ],

    popularityScore: 75,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.paypal.com/us/business/paypal-business-fees",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator", "currency-converter"],
  },
  {
    id: "stripe-invoicing",
    name: "Stripe Invoicing",
    // DRAFT - review before publish
    tagline: "API-first invoicing for businesses already running payments through Stripe.",
    logoUrl: "VERIFY",
    website: "https://stripe.com/invoicing",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["ecommerce", "agencies", "consulting"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes:
      "Available in all Stripe-supported countries; fees and payout timing vary by region — VERIFY country-specific fee schedule.",
    useCases: ["send invoices", "accept online payments", "recurring billing", "developer-integrated billing"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Pay-as-you-go pricing (no monthly fee)",
      "Hosted invoice pages",
      "Automatic payment collection and reconciliation",
      "API-first — deeply integrates with custom software",
      "Recurring/subscription invoicing (Stripe Billing)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for businesses and developers already inside the Stripe ecosystem who want invoicing wired directly into their existing payments/API stack — not the pick for someone who just wants a simple invoice generator.",
    bestFor: [
      "Businesses already processing payments through Stripe",
      "Developers who want invoicing controllable via API",
    ],
    avoidIf: [
      "You want a simple, non-technical invoicing UI with no Stripe account required",
      "You send high invoice volume where flat subscription pricing would be cheaper",
    ],
    pros: [
      "Best fit if you already use Stripe for payments — invoicing plugs directly into existing customer/payment data",
      "Pay-per-invoice pricing means no cost when you're not invoicing",
      "API access allows fully custom invoicing workflows for developers",
    ],
    cons: [
      "Not built for people who want a polished, no-code invoicing UI first — it's developer/API-oriented",
      "No general bookkeeping, expense tracking, or reporting",
      "Per-invoice fees can exceed a flat subscription tool at high volume",
    ],

    popularityScore: 72,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://stripe.com/invoicing/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator", "currency-converter"],
  },

  // Batch 2 — 32 additional listings covering gaps in payments/AP, AI
  // bookkeeping, enterprise ERP, UK, India, Australia/NZ, South Africa,
  // freelancer/creative CRM, DACH/Benelux/Iberia, and open-source. Same
  // VERIFY-guard and DRAFT-editorial rules as above apply throughout.

  {
    id: "square-invoices",
    name: "Square Invoices",
    // DRAFT - review before publish
    tagline: "Free invoicing bundled with the Square payments ecosystem — pay only when you get paid.",
    logoUrl: "VERIFY",
    website: "https://squareup.com/us/en/invoices",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["retail", "hospitality", "consulting", "freelancers"],
    businessSizes: ["solo", "small"],
    regions: ["north-america", "global"],
    regionNotes:
      "Deepest fit for businesses already using Square POS/payments in the US, Canada, UK, Australia and Japan — VERIFY current country availability.",
    useCases: ["send invoices", "accept online payments", "recurring billing", "estimates"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Free unlimited invoices on the Free plan",
      "In-person and online card payment collection",
      "Recurring invoices and payment plans",
      "Estimates that convert to invoices",
      "Tightly integrated with Square POS/payments",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for businesses already inside the Square ecosystem (POS, card readers, online store) who want invoicing that shares customer and payment data automatically — less compelling as a standalone pick.",
    bestFor: ["Retailers and service businesses already using Square for in-person payments"],
    avoidIf: [
      "You don't use Square for payments elsewhere in your business",
      "You need double-entry bookkeeping, not just invoicing",
    ],
    pros: [
      "Free plan with no monthly fee — you only pay per-transaction processing fees",
      "Seamless with Square POS, online store, and card readers",
      "Simple, fast invoice creation",
    ],
    cons: [
      "Per-transaction processing fees apply on every paid invoice",
      "Not a full accounting system — no ledgers or bank reconciliation",
      "Most value is unlocked only if you already use other Square products",
    ],

    popularityScore: 62,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://squareup.com/us/en/invoices/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "melio",
    name: "Melio",
    // DRAFT - review before publish
    tagline: "Pay and get paid via free ACH — a bill-pay layer that sits on top of your existing accounting software.",
    logoUrl: "VERIFY",
    website: "https://meliopayments.com",

    category: "invoicing-accounting",
    subCategory: "accounts-payable",
    industries: ["construction", "consulting", "retail", "agencies"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["north-america"],
    regionNotes: "US-only; built around US bank transfers and vendor payments — VERIFY current availability.",
    useCases: ["manage bills", "send invoices", "accounts payable automation", "manage vendors"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Free ACH bank transfers for bill pay",
      "Pay vendors who only accept checks/cards via ACH",
      "Sync with QuickBooks/Xero",
      "Invoicing and payment collection",
      "Multi-user approval workflows",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small US businesses that want to pay vendor bills without a wire/check fee and sync it straight into QuickBooks or Xero — pair it with your accounting software rather than expecting it to replace one.",
    bestFor: ["US small businesses paying vendors who want free ACH transfers synced to their books"],
    avoidIf: [
      "You're outside the US",
      "You want an all-in-one accounting system instead of a bill-pay layer",
    ],
    pros: [
      "Free ACH transfers for both paying and getting paid",
      "Clean two-way sync with QuickBooks Online and Xero",
      "Approval workflows for teams paying multiple vendors",
    ],
    cons: [
      "US-only",
      "Not a bookkeeping system on its own — depends on a connected accounting tool",
      "Card and instant-transfer payments carry a fee",
    ],

    popularityScore: 54,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://meliopayments.com/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "purchase-order-generator"],
  },
  {
    id: "digits",
    name: "Digits",
    // DRAFT - review before publish
    tagline: "AI-driven real-time bookkeeping and financial insights for venture-backed startups.",
    logoUrl: "VERIFY",
    website: "https://digits.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["consulting", "agencies", "ecommerce"],
    businessSizes: ["small", "medium"],
    regions: ["north-america"],
    regionNotes:
      "US-focused, aimed at startups already on QuickBooks/Xero wanting AI insights layered on top — VERIFY, no clean public pricing page found; likely sales-assisted onboarding.",
    useCases: ["financial reporting", "track expenses", "cash flow forecasting", "AI-assisted bookkeeping"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "AI-generated real-time financial statements",
      "Anomaly detection on transactions",
      "Cash flow and burn-rate insights",
      "Syncs with QuickBooks/Xero as the underlying ledger",
      "Investor-ready reporting",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios"],

    // DRAFT - review before publish
    verdict:
      "Best for funded startups that already have a bookkeeper/accountant on QuickBooks or Xero and want AI-powered visibility on top — not a replacement for your ledger, and pricing requires talking to sales.",
    bestFor: ["Venture-backed startups wanting real-time financial dashboards on top of existing books"],
    avoidIf: [
      "You want simple, self-serve pricing you can check without a sales call",
      "You're a freelancer or very small business — this is built for funded startups",
    ],
    pros: [
      "Real-time, AI-generated financial insights instead of month-end reports",
      "Sits on top of QuickBooks/Xero rather than requiring migration",
      "Strong anomaly detection for catching bookkeeping errors early",
    ],
    cons: [
      "No public self-serve pricing — sales-assisted onboarding",
      "Overkill (and likely cost-prohibitive) for solo freelancers or very small businesses",
      "Still depends on an underlying QuickBooks/Xero subscription",
    ],

    popularityScore: 38,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://digits.com",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "tax-calculator"],
  },
  {
    id: "netsuite",
    name: "Oracle NetSuite",
    // DRAFT - review before publish
    tagline: "Full-suite cloud ERP with financials, inventory, and CRM — enterprise scale, enterprise price, quote-only.",
    logoUrl: "VERIFY",
    website: "https://www.netsuite.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["retail", "ecommerce", "construction", "healthcare"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes:
      "No public pricing page exists — NetSuite is sold exclusively through direct sales with a custom quote based on modules, users, and company size. VERIFY: this listing's pricing fields cannot be filled from a self-serve page; typical published estimates cite roughly $999+/month base plus $99-199/user/month, but these must be confirmed directly with Oracle sales before being shown as fact.",
    useCases: ["financial reporting", "manage bills", "inventory management", "multi-entity consolidation", "erp"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — custom quote only, no public pricing"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier — enterprise sales-led, typically includes a guided demo/trial rather than a self-serve trial.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Full ERP: financials, inventory, order management, CRM",
      "Multi-entity and multi-currency consolidation",
      "Deep customization via SuiteScript/SuiteFlow",
      "Real-time dashboards and reporting",
      "Scales to very large, complex organizations",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for mid-market and larger businesses that have outgrown small-business accounting software and need a true ERP — not a fit (or an affordable one) for freelancers or small businesses, and pricing only comes via a sales conversation.",
    bestFor: ["Mid-market and larger businesses needing multi-entity ERP with inventory and CRM in one system"],
    avoidIf: [
      "You're a freelancer, solo operator, or small business — this is enterprise-priced and enterprise-complex",
      "You want to see exact pricing without booking a sales call",
    ],
    pros: [
      "Extremely comprehensive — financials, inventory, CRM, and more in one platform",
      "Scales to complex multi-entity, multi-currency organizations",
      "Highly customizable for industry-specific workflows",
    ],
    cons: [
      "No public pricing at all — every quote is custom and requires a sales process",
      "Implementation is a significant project, often with a systems integrator",
      "Far more than a small business needs; steep learning curve",
    ],

    popularityScore: 66,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.netsuite.com/portal/products/erp/order-management/pricing.shtml",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "purchase-order-generator", "tax-calculator"],
  },
  {
    id: "sage-intacct",
    name: "Sage Intacct",
    // DRAFT - review before publish
    tagline: "AICPA-endorsed cloud financial management for mid-market finance teams — quote-only, no public pricing.",
    logoUrl: "VERIFY",
    website: "https://www.sage.com/en-us/sage-business-cloud/intacct/",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["nonprofits", "healthcare", "construction", "real-estate"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global", "north-america"],
    regionNotes:
      "No public pricing page — sold via direct/partner sales with a custom quote based on modules, entities, and users. VERIFY: published estimates cite roughly $12,000+/year for typical mid-market deployments, but this must be confirmed directly with Sage before being shown as fact.",
    useCases: ["financial reporting", "multi-entity consolidation", "manage bills", "grant/fund accounting"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — custom quote only, no public pricing"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier — enterprise sales-led, typically a guided demo rather than a self-serve trial.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Multi-entity, multi-currency financial consolidation",
      "Dimensional reporting (no rigid chart-of-accounts structure)",
      "Strong nonprofit/grant and fund accounting support",
      "Deep integrations with Salesforce and other enterprise tools",
      "AICPA-preferred provider for CPA firms",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for mid-market finance teams — especially nonprofits and multi-entity organizations — that need dimensional reporting beyond what QuickBooks/Xero offer, and are prepared for a sales-led buying process rather than self-serve pricing.",
    bestFor: ["Mid-market finance teams and nonprofits needing multi-entity, dimensional financial reporting"],
    avoidIf: [
      "You're a small business or freelancer — this is priced and built for finance teams, not solo operators",
      "You want transparent self-serve pricing",
    ],
    pros: [
      "Well regarded by CPA firms and finance teams for its dimensional reporting model",
      "Strong fit for nonprofit fund accounting and grant tracking",
      "Scales cleanly across multiple entities and currencies",
    ],
    cons: [
      "No public pricing — every deal is a custom sales quote",
      "Implementation typically requires a partner and a real onboarding project",
      "Overkill and cost-prohibitive below mid-market scale",
    ],

    popularityScore: 60,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.sage.com/en-us/sage-business-cloud/intacct/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "purchase-order-generator"],
  },
  {
    id: "clear-books",
    name: "Clear Books",
    // DRAFT - review before publish
    tagline: "UK small-business accounting with Making Tax Digital built in, at a lower price than Xero/QuickBooks.",
    logoUrl: "VERIFY",
    website: "https://www.clearbooks.co.uk",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["consulting", "retail", "construction", "freelancers"],
    businessSizes: ["solo", "small"],
    regions: ["europe"],
    regionNotes: "UK-only; built around UK VAT/Making Tax Digital rules — VERIFY current MTD compliance status.",
    useCases: ["send invoices", "track expenses", "file taxes", "financial reporting", "manage bills"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Making Tax Digital VAT submission",
      "Invoicing and quotes",
      "Bank feed reconciliation",
      "Multi-currency invoicing",
      "Small business and accountant-facing tiers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for UK small businesses wanting Xero-like features at a lower price point, especially those who don't need the largest third-party app ecosystem.",
    bestFor: ["UK small businesses and sole traders wanting affordable MTD-compliant accounting"],
    avoidIf: ["You're outside the UK", "You want the largest possible integration marketplace"],
    pros: [
      "Lower price point than Xero/QuickBooks for comparable core features",
      "Solid UK VAT/MTD support",
      "Simple, UK-focused interface",
    ],
    cons: [
      "UK-only — no value outside that market",
      "Smaller integration ecosystem than Xero/QuickBooks",
      "Less brand recognition among accountants than the category leaders",
    ],

    popularityScore: 34,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.clearbooks.co.uk/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator", "tax-calculator"],
  },
  {
    id: "pandle",
    name: "Pandle",
    // DRAFT - review before publish
    tagline: "Free-forever UK bookkeeping software, with a low-cost Pro tier for extra features.",
    logoUrl: "VERIFY",
    website: "https://www.pandle.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "retail", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["europe"],
    regionNotes: "UK-only; built around UK VAT/MTD rules — VERIFY current MTD compliance status.",
    useCases: ["send invoices", "track expenses", "file taxes", "basic bookkeeping"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Free core bookkeeping, forever",
      "Making Tax Digital VAT submission (Pro)",
      "Bank feed reconciliation",
      "Invoicing and quotes",
      "Live chat support",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "One of the few genuinely free full bookkeeping tools for UK micro-businesses — a strong starting point before you might outgrow it into Xero or QuickBooks.",
    bestFor: ["UK micro-businesses and sole traders wanting free bookkeeping with an optional low-cost upgrade"],
    avoidIf: ["You're outside the UK", "You expect to outgrow simple bookkeeping quickly"],
    pros: [
      "Genuinely free core plan, not a time-limited trial",
      "Low-cost Pro tier for VAT/MTD needs",
      "Simple, approachable interface for non-accountants",
    ],
    cons: [
      "UK-only",
      "Smaller feature set and integration list than Xero/QuickBooks",
      "Less suited to businesses planning to scale up quickly",
    ],

    popularityScore: 28,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.pandle.com/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "quickfile",
    name: "QuickFile",
    // DRAFT - review before publish
    tagline: "Free UK accounting for low invoice volumes, with an affordable flat fee once you scale up.",
    logoUrl: "VERIFY",
    website: "https://www.quickfile.co.uk",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "retail", "consulting", "nonprofits"],
    businessSizes: ["solo", "small"],
    regions: ["europe"],
    regionNotes: "UK-only; built around UK VAT/MTD rules — VERIFY current MTD compliance status.",
    useCases: ["send invoices", "track expenses", "file taxes", "basic bookkeeping"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Free plan for low ledger-entry volumes",
      "Flat annual fee once you exceed the free tier — no per-user pricing",
      "Making Tax Digital VAT submission",
      "Bank feed reconciliation",
      "Invoicing and recurring billing",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for UK sole traders, small nonprofits, and low-volume small businesses that want free or very cheap bookkeeping with no per-user pricing creep as they add team members.",
    bestFor: ["UK micro-businesses and nonprofits with low transaction volumes"],
    avoidIf: ["You're outside the UK", "You have high transaction volume — check the free-tier ledger-entry cap"],
    pros: [
      "Free tier for genuinely low-volume users",
      "Flat annual fee (not per-user) once you exceed the free tier",
      "Solid UK VAT/MTD support",
    ],
    cons: [
      "UK-only",
      "Interface feels dated next to Xero/QuickBooks",
      "Ledger-entry-based free tier cap requires checking carefully before relying on it",
    ],

    popularityScore: 26,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.quickfile.co.uk/home/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "crunch",
    name: "Crunch",
    // DRAFT - review before publish
    tagline: "UK online accounting bundled with real accountant access — software and a human, in one subscription.",
    logoUrl: "VERIFY",
    website: "https://www.crunch.co.uk",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "consulting", "agencies"],
    businessSizes: ["solo", "small"],
    regions: ["europe"],
    regionNotes: "UK-only; built around UK Self Assessment, VAT, and MTD rules — VERIFY current plan lineup.",
    useCases: ["send invoices", "track expenses", "file taxes", "payroll", "accountant support"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Free bookkeeping tier",
      "Paid tiers bundle a named accountant",
      "Payroll add-on",
      "Self Assessment and MTD support",
      "Invoicing and expense tracking",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for UK freelancers and contractors who want software plus a real accountant's advice bundled into one subscription, rather than software and an accountant purchased separately.",
    bestFor: ["UK freelancers, contractors, and small limited companies wanting accountant support bundled in"],
    avoidIf: ["You're outside the UK", "You already have an accountant and just want standalone software"],
    pros: [
      "Bundles named accountant access into paid plans — unusual in this category",
      "Free tier available for basic bookkeeping",
      "Strong UK tax/MTD focus",
    ],
    cons: [
      "UK-only",
      "Higher-tier pricing reflects the human accountant service, not just software",
      "Smaller third-party integration list than Xero/QuickBooks",
    ],

    popularityScore: 36,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.crunch.co.uk/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "tax-calculator", "salary-calculator"],
  },
  {
    id: "countingup",
    name: "Countingup",
    // DRAFT - review before publish
    tagline: "A UK business bank account with bookkeeping and tax tools built directly into the banking app.",
    logoUrl: "VERIFY",
    website: "https://countingup.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "retail", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["europe"],
    regionNotes: "UK-only; the accounting features are tied to holding a Countingup business current account.",
    useCases: ["send invoices", "track expenses", "file taxes", "business banking"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Business current account with built-in bookkeeping",
      "Automatic transaction categorization",
      "Invoicing directly from the banking app",
      "Real-time profit and tax estimates",
      "Receipt capture",
    ],
    integrations: ["VERIFY"],
    platforms: ["ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for UK sole traders who want their bank account and bookkeeping to be the same app, rather than syncing a separate bank feed into accounting software.",
    bestFor: ["UK sole traders wanting banking and bookkeeping combined in one mobile app"],
    avoidIf: [
      "You're outside the UK",
      "You already have a business bank account and just want standalone accounting software",
    ],
    pros: [
      "Bookkeeping is automatic since transactions originate in the same app",
      "Mobile-first, simple experience aimed at non-accountants",
      "Real-time tax and profit estimates",
    ],
    cons: [
      "Requires switching to (or opening) a Countingup business account",
      "UK-only",
      "No web/desktop app — mobile only",
    ],

    popularityScore: 30,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://countingup.com/small-businesses/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "coconut",
    name: "Coconut",
    // DRAFT - review before publish
    tagline: "Purpose-built bookkeeping and Making Tax Digital for UK sole traders.",
    logoUrl: "VERIFY",
    website: "https://www.getcoconut.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "consulting"],
    businessSizes: ["solo"],
    regions: ["europe"],
    regionNotes:
      "UK sole traders only; also sold to accountants as a client-management tool at a separate per-client price — VERIFY which pricing page applies to an individual sole-trader user vs. an accountant.",
    useCases: ["track expenses", "file taxes", "basic bookkeeping", "self assessment"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Income and expense tracking built for sole traders",
      "Making Tax Digital submission",
      "Automatic expense categorization",
      "Self Assessment tax estimates",
      "Bank connection",
    ],
    integrations: ["VERIFY"],
    platforms: ["ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for UK sole traders who want a lightweight, mobile-first alternative to FreeAgent focused purely on Self Assessment and MTD — not built for limited companies.",
    bestFor: ["UK sole traders wanting simple, mobile bookkeeping and MTD/Self Assessment support"],
    avoidIf: ["You're outside the UK", "You operate as a limited company, not a sole trader"],
    pros: [
      "Purpose-built specifically for sole trader Self Assessment and MTD",
      "Mobile-first, simple experience",
      "Free trial available before committing",
    ],
    cons: [
      "Sole traders only — not for limited companies",
      "UK-only",
      "Mobile-only — no full desktop/web experience",
    ],

    popularityScore: 27,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.getcoconut.com/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "tax-calculator"],
  },
  {
    id: "vyapar",
    name: "Vyapar",
    // DRAFT - review before publish
    tagline: "GST-compliant billing, inventory, and accounting built for Indian small businesses and retailers.",
    logoUrl: "VERIFY",
    website: "https://vyaparapp.in",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["retail", "construction", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["asia"],
    regionNotes:
      "Built for India's GST regime; also sold in Pakistan via a separate localized product (vyaparpk.com) — VERIFY which regional product/pricing applies.",
    useCases: ["send invoices", "manage bills", "inventory management", "file taxes", "mobile invoicing"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "GST-compliant invoicing and billing",
      "Inventory and stock management",
      "Offline-first mobile app",
      "Barcode-based billing",
      "Desktop and mobile editions",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for Indian retailers and small traders who need GST billing and inventory management from a phone, including offline in low-connectivity areas.",
    bestFor: ["Indian retailers and small traders needing GST billing plus inventory tracking"],
    avoidIf: ["You're outside India/Pakistan", "You need full double-entry accounting reports, not just billing"],
    pros: [
      "Strong GST compliance built specifically for the Indian market",
      "Works offline — useful for retail environments with unreliable connectivity",
      "Combines billing with inventory management",
    ],
    cons: [
      "Limited relevance outside South Asia",
      "Less full-featured as a general ledger/accounting system",
      "Higher-tier pricing requires direct vendor contact",
    ],

    popularityScore: 42,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://vyaparapp.in/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "purchase-order-generator", "receipt-generator"],
  },
  {
    id: "tallyprime",
    name: "TallyPrime",
    // DRAFT - review before publish
    tagline: "The long-standing default accounting software for Indian SMBs — perpetual license or monthly subscription.",
    logoUrl: "VERIFY",
    website: "https://tallysolutions.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["retail", "construction", "consulting"],
    businessSizes: ["small", "medium"],
    regions: ["asia"],
    regionNotes: "India-focused; deep GST compliance — VERIFY availability/localization outside India.",
    useCases: ["send invoices", "manage bills", "inventory management", "file taxes", "financial reporting"],
    pricingModel: "one-time",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "GST-compliant accounting and billing",
      "Inventory and multi-godown stock management",
      "Silver (single-user) and Gold (multi-user) editions",
      "Perpetual license or monthly subscription options",
      "Extensive Indian accountant/reseller network",
    ],
    integrations: ["VERIFY"],
    platforms: ["windows"],

    // DRAFT - review before publish
    verdict:
      "The category default for Indian SMBs whose accountant already works in Tally — less appealing if you want a modern cloud-native interface or aren't in India.",
    bestFor: ["Indian small-to-medium businesses whose accountant/bookkeeper already uses Tally"],
    avoidIf: ["You're outside India", "You want a cloud-native, browser-based interface rather than Windows desktop software"],
    pros: [
      "Extremely well established with Indian accountants — huge existing user base",
      "Deep GST and Indian compliance support",
      "One-time perpetual license option avoids ongoing subscription cost",
    ],
    cons: [
      "Windows-only desktop software — no native cloud/web experience",
      "Interface feels dated compared to modern cloud accounting tools",
      "Limited relevance outside India",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://tallysolutions.com/tally-monthly-subscription/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "purchase-order-generator"],
  },
  {
    id: "mybillbook",
    name: "myBillBook",
    // DRAFT - review before publish
    tagline: "Simple GST billing and inventory app for Indian shopkeepers and small manufacturers.",
    logoUrl: "VERIFY",
    website: "https://mybillbook.in",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["retail", "construction"],
    businessSizes: ["solo", "small"],
    regions: ["asia"],
    regionNotes: "India-only; built around GST billing — VERIFY current feature/localization scope.",
    useCases: ["send invoices", "inventory management", "mobile invoicing", "file taxes"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "GST billing and e-invoicing",
      "Inventory and stock tracking",
      "Mobile-first billing app",
      "Party (customer/vendor) ledger management",
      "Business analytics/reports",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "A budget-friendly, mobile-first billing option for small Indian shopkeepers who need GST invoices and basic inventory, without the complexity of a full accounting suite.",
    bestFor: ["Indian shopkeepers and small manufacturers needing simple GST billing from a phone"],
    avoidIf: ["You're outside India", "You need full double-entry bookkeeping, not just billing"],
    pros: [
      "Low-cost, mobile-first billing built for Indian retail/GST needs",
      "Straightforward inventory tracking alongside invoicing",
      "Free tier for very low usage",
    ],
    cons: [
      "Limited relevance outside India",
      "Not a full accounting/bookkeeping system",
      "Smaller feature depth than Vyapar or TallyPrime for larger businesses",
    ],

    popularityScore: 33,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://mybillbook.in/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "refrens",
    name: "Refrens",
    // DRAFT - review before publish
    tagline: "Invoicing, accounting, and a lightweight sales CRM in one platform, built for Indian freelancers and agencies.",
    logoUrl: "VERIFY",
    website: "https://www.refrens.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "agencies", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["asia", "global"],
    regionNotes: "India-focused GST support with usability for international freelancers too — VERIFY non-India tax coverage.",
    useCases: ["send invoices", "manage bills", "financial reporting", "client management", "file taxes"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "GST-compliant invoicing",
      "Sales CRM and lead tracking",
      "Multi-currency invoicing for export/freelance work",
      "Expense and accounting reports",
      "Free document creation up to a monthly cap",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for Indian freelancers and small agencies who want invoicing, light accounting, and a sales CRM in one tool at a low price — an appealing bundle if you don't need deep bookkeeping depth.",
    bestFor: ["Indian freelancers and small agencies wanting invoicing plus a lightweight CRM"],
    avoidIf: ["You need deep double-entry bookkeeping", "You're outside India and need strong local tax compliance"],
    pros: [
      "Combines invoicing, basic accounting, and CRM in one affordable tool",
      "Usable free tier for low document volume",
      "Multi-currency support suits freelancers billing overseas clients",
    ],
    cons: [
      "Smaller brand recognition than Zoho or QuickBooks",
      "Accounting depth is lighter than dedicated full-accounting suites",
      "Best tax-compliance support is India-specific",
    ],

    popularityScore: 31,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.refrens.com/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "purchase-order-generator"],
  },
  {
    id: "profitbooks",
    name: "ProfitBooks",
    // DRAFT - review before publish
    tagline: "Straightforward GST accounting for Indian small businesses, with a genuinely usable free plan.",
    logoUrl: "VERIFY",
    website: "https://profitbooks.net",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["retail", "consulting", "ecommerce"],
    businessSizes: ["solo", "small"],
    regions: ["asia"],
    regionNotes: "India-focused GST support, usable in other countries with applicable tax rules — VERIFY non-India coverage.",
    useCases: ["send invoices", "manage bills", "inventory management", "file taxes", "financial reporting"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "GST-compliant invoicing and accounting",
      "Free plan for a single user with capped invoices/customers",
      "Inventory tracking",
      "Bank reconciliation",
      "Financial reports (P&L, balance sheet)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A solid low-cost or free starting point for Indian small businesses that want real double-entry accounting without QuickBooks/Zoho-level pricing.",
    bestFor: ["Indian small businesses and startups wanting free or cheap GST-compliant accounting"],
    avoidIf: ["You're outside India", "You need a large integration ecosystem or advanced multi-entity features"],
    pros: [
      "Usable free plan (not just a trial) for single-user, low-volume use",
      "Real double-entry accounting, not just invoicing",
      "Affordable paid tier for GST compliance",
    ],
    cons: [
      "Limited relevance outside India",
      "Smaller integration ecosystem than Zoho Books or QuickBooks",
      "Free-tier customer/invoice caps require checking before relying on it",
    ],

    popularityScore: 25,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://profitbooks.net/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "myob",
    name: "MYOB",
    // DRAFT - review before publish
    tagline: "The long-standing Australian/NZ default for small business accounting and payroll.",
    logoUrl: "VERIFY",
    website: "https://www.myob.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["retail", "construction", "consulting", "hospitality"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["oceania"],
    regionNotes: "Australia/New Zealand-focused; deep local tax (GST, STP payroll) support — VERIFY current plan lineup, which has changed names/tiers recently.",
    useCases: ["send invoices", "run payroll", "file taxes", "financial reporting", "manage bills"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "GST/BAS and Single Touch Payroll (Australia)",
      "Invoicing and expense tracking",
      "Payroll add-on priced per employee",
      "AccountRight tiers with job costing and inventory",
      "Established accountant/bookkeeper network",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The safe, established choice for Australian and NZ small businesses whose accountant already works in MYOB — Xero and QuickBooks are worth comparing for a more modern interface at similar price points.",
    bestFor: ["Australian/NZ small businesses needing local payroll and tax compliance with an established vendor"],
    avoidIf: ["You're outside Australia/NZ", "You want the most modern interface — Xero is often preferred here"],
    pros: [
      "Deep Australian/NZ tax and payroll compliance",
      "Long track record and wide accountant familiarity",
      "AccountRight tiers scale into job costing and inventory",
    ],
    cons: [
      "Pricing and plan names have shifted multiple times in recent years, causing confusion",
      "Interface feels less modern than Xero",
      "Payroll is often a paid per-employee add-on",
    ],

    popularityScore: 64,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.myob.com/au/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "salary-calculator", "tax-calculator"],
  },
  {
    id: "reckon-one",
    name: "Reckon One",
    // DRAFT - review before publish
    tagline: "Modular Australian accounting — pay only for the modules (invoicing, payroll, GST) you actually need.",
    logoUrl: "VERIFY",
    website: "https://www.reckon.com/au/accounting-software/",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["retail", "consulting", "construction"],
    businessSizes: ["solo", "small"],
    regions: ["oceania"],
    regionNotes: "Australia-focused; GST/BAS and STP payroll support — VERIFY current modular pricing structure.",
    useCases: ["send invoices", "run payroll", "file taxes", "manage bills"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Modular pricing — add invoicing, payroll, GST/BAS as separate modules",
      "Unlimited users on all plans",
      "GST/BAS reporting",
      "Single Touch Payroll",
      "Bank feeds",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for Australian small businesses that want to pay only for the specific modules they need rather than a bundled all-in-one plan — worth comparing carefully against MYOB/Xero's flat tiers.",
    bestFor: ["Cost-conscious Australian small businesses wanting modular, pay-for-what-you-use pricing"],
    avoidIf: ["You're outside Australia", "You'd rather have one flat plan than assemble modules"],
    pros: [
      "Modular pricing can be cheaper than flat-tier competitors for simple needs",
      "Unlimited users at every tier",
      "Solid Australian GST/BAS and STP payroll support",
    ],
    cons: [
      "Modular pricing requires more upfront thought about which add-ons you need",
      "Smaller brand recognition than MYOB or Xero",
      "Smaller integration ecosystem than Xero",
    ],

    popularityScore: 29,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.reckon.com/au/accounting-software/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "salary-calculator"],
  },
  {
    id: "saasu",
    name: "Saasu",
    // DRAFT - review before publish
    tagline: "Australian-made online accounting with bank feeds, inventory, and cash flow forecasting.",
    logoUrl: "VERIFY",
    website: "https://www.saasu.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["retail", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["oceania"],
    regionNotes: "Australia-focused; GST/BAS and Single Touch Payroll support — VERIFY current plan lineup.",
    useCases: ["send invoices", "manage bills", "inventory management", "cash flow forecasting", "file taxes"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Per-file (per legal entity) pricing",
      "Cash flow forecasting",
      "Inventory tracking",
      "GST/BAS and Single Touch Payroll",
      "Bank feed reconciliation",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "A solid, lesser-known Australian alternative to MYOB/Xero worth a look for its cash flow forecasting — most Australian small businesses will still land on the bigger two, but Saasu is worth comparing.",
    bestFor: ["Australian small businesses wanting built-in cash flow forecasting alongside standard accounting"],
    avoidIf: ["You're outside Australia", "You want the largest possible integration ecosystem"],
    pros: [
      "Strong cash flow forecasting built into the core product",
      "Straightforward per-entity pricing",
      "30-day free trial across all plans",
    ],
    cons: [
      "Much smaller brand recognition than Xero/MYOB",
      "Smaller integration/app marketplace",
      "Fewer accountants are already familiar with it",
    ],

    popularityScore: 22,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.saasu.com/pricing/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "purchase-order-generator"],
  },
  {
    id: "sage-pastel-partner",
    name: "Sage Pastel Partner",
    // DRAFT - review before publish
    tagline: "Established South African desktop/cloud-hybrid accounting for small and medium businesses.",
    logoUrl: "VERIFY",
    website: "https://shop.sage.co.za",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["retail", "construction", "consulting"],
    businessSizes: ["small", "medium"],
    regions: ["africa"],
    regionNotes: "South Africa-focused; VAT compliance built for SARS rules — VERIFY current edition/pricing lineup, which is sold through Sage's SA shop and partner resellers.",
    useCases: ["send invoices", "manage bills", "inventory management", "file taxes", "financial reporting"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier identified — VERIFY trial availability.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Multi-user, multi-company licensing",
      "Direct bank feeds",
      "Inventory and job costing",
      "South African VAT compliance",
      "Desktop application with cloud connectivity",
    ],
    integrations: ["VERIFY"],
    platforms: ["windows"],

    // DRAFT - review before publish
    verdict:
      "Best for South African SMBs already inside the Sage ecosystem wanting established, VAT-compliant desktop accounting with multi-user support — evaluate Sage Business Cloud Accounting too if you want a purely cloud-native product.",
    bestFor: ["South African small-to-medium businesses needing multi-user desktop accounting with VAT compliance"],
    avoidIf: ["You're outside South Africa", "You want a fully cloud-native (not desktop-installed) product"],
    pros: [
      "Long track record and strong South African accountant familiarity",
      "Multi-user and multi-company support built in",
      "Deep local VAT/SARS compliance",
    ],
    cons: [
      "Desktop-installed software with a dated interface",
      "Pricing and licensing structure can be confusing across editions",
      "Less modern than fully cloud-native competitors",
    ],

    popularityScore: 33,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://shop.sage.co.za/product/sage-50-cloud-pastel-partner/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "purchase-order-generator"],
  },
  {
    id: "govchain-books",
    name: "Govchain Books",
    // DRAFT - review before publish
    tagline: "South African bookkeeping bundled with SARS tax filing — compliance-first, built for small businesses.",
    logoUrl: "VERIFY",
    website: "https://www.govchain.co.za/books",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["retail", "consulting", "freelancers"],
    businessSizes: ["solo", "small"],
    regions: ["africa"],
    regionNotes:
      "South Africa-only; positioned around SARS tax compliance filing bundled with bookkeeping — VERIFY exact plan pricing (not published in initial research; confirm directly on the Books product page).",
    useCases: ["send invoices", "file taxes", "basic bookkeeping", "sars compliance"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Bookkeeping and transaction reconciliation",
      "SARS tax return submission",
      "Invoicing and payment tracking",
      "Free compliance-tracking tier",
      "Plans that scale with headcount/turnover",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for South African small businesses that want bookkeeping and SARS tax filing handled in one place without hiring a separate accountant for basic compliance — a newer, less-established name than Sage.",
    bestFor: ["South African small businesses wanting bookkeeping bundled with SARS tax filing"],
    avoidIf: ["You're outside South Africa", "You want an established, long-track-record vendor like Sage"],
    pros: [
      "Bundles SARS tax filing directly with bookkeeping",
      "Free tier for basic compliance tracking",
      "Plans scale with business size rather than one-size-fits-all",
    ],
    cons: [
      "Newer, less-established vendor than Sage or established competitors",
      "South Africa-only",
      "Pricing details are less transparently published than more established competitors",
    ],

    popularityScore: 18,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.govchain.co.za/books",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "tax-calculator"],
  },
  {
    id: "honeybook",
    name: "HoneyBook",
    // DRAFT - review before publish
    tagline: "Client management, contracts, and invoicing in one flow, built for creative and service-based freelancers.",
    logoUrl: "VERIFY",
    website: "https://www.honeybook.com",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["freelancers", "consulting", "hospitality"],
    businessSizes: ["solo", "small"],
    regions: ["north-america", "global"],
    regionNotes: "US-centric payments/tax tooling; usable globally for client management and invoicing — VERIFY international payment support.",
    useCases: ["send invoices", "send contracts", "client management", "send proposals", "accept online payments"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Client CRM with pipeline/workflow automation",
      "Contracts and e-signatures",
      "Invoicing and online payments",
      "Proposals and scheduling",
      "Unlimited clients/projects on every plan",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for creative and service-based freelancers (photographers, planners, designers) who want the full client journey — inquiry to contract to invoice — in one branded flow, rather than stitching together separate tools.",
    bestFor: ["Photographers, event planners, and creative freelancers managing the full client journey"],
    avoidIf: ["You need real bookkeeping/accounting, not client workflow tools", "You just need simple invoicing without a CRM"],
    pros: [
      "Strong end-to-end client workflow: inquiry, proposal, contract, invoice, payment",
      "Unlimited clients and projects regardless of plan",
      "Popular in creative/event industries with an active community",
    ],
    cons: [
      "Pricing has risen significantly in recent years — VERIFY current tiers before comparing",
      "Not an accounting system — no ledgers or bank reconciliation",
      "Best value assumes you actually use the CRM/workflow features, not just invoicing",
    ],

    popularityScore: 56,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.honeybook.com/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "freelance-contract-generator", "email-signature-generator"],
  },
  {
    id: "dubsado",
    name: "Dubsado",
    // DRAFT - review before publish
    tagline: "Highly customizable client-management and invoicing workflows for creative entrepreneurs.",
    logoUrl: "VERIFY",
    website: "https://www.dubsado.com",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["freelancers", "consulting", "hospitality"],
    businessSizes: ["solo", "small"],
    regions: ["north-america", "global"],
    regionNotes: "US-centric; usable globally for client workflows and invoicing — VERIFY international payment support.",
    useCases: ["send invoices", "send contracts", "client management", "send proposals", "workflow automation"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Highly customizable workflow automation",
      "Contracts, forms, and scheduling",
      "Invoicing and payment plans",
      "Client portal",
      "Lifetime free trial (limited clients) before upgrading",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for creative entrepreneurs who want to deeply customize their own client workflow (forms, automations, branding) — more flexible but more setup work than HoneyBook's more guided experience.",
    bestFor: ["Creative freelancers and small studios wanting fully customizable client workflows"],
    avoidIf: ["You want a more guided, less DIY setup experience — HoneyBook may fit better", "You need real bookkeeping, not client workflow tools"],
    pros: [
      "Extremely customizable forms, workflows, and automations",
      "Lifetime free trial lets you test at low client volume before paying",
      "Strong fit for businesses with a defined, repeatable client process",
    ],
    cons: [
      "More setup effort required than more guided competitors like HoneyBook",
      "Extra brands and higher user counts cost more on top of the base plan",
      "Not an accounting system — no bookkeeping or bank reconciliation",
    ],

    popularityScore: 47,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.dubsado.com/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "freelance-contract-generator"],
  },
  {
    id: "17hats",
    name: "17hats",
    // DRAFT - review before publish
    tagline: "One flat-fee plan bundling CRM, contracts, invoicing, and scheduling for small service businesses.",
    logoUrl: "VERIFY",
    website: "https://17hats.com",

    category: "invoicing-accounting",
    subCategory: "invoicing",
    industries: ["freelancers", "consulting", "hospitality"],
    businessSizes: ["solo", "small"],
    regions: ["north-america", "global"],
    regionNotes: "US-centric; usable globally for client workflows and invoicing — VERIFY international payment support.",
    useCases: ["send invoices", "send contracts", "client management", "send proposals", "scheduling"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier — 7-day free trial only, single all-inclusive paid plan.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Single all-inclusive plan — same features regardless of billing cycle",
      "Contracts, invoicing, and online payments",
      "Client CRM and lead capture",
      "Scheduling and questionnaires",
      "Add-ons for time tracking, bank feeds, and extra users",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "A simpler pricing story than HoneyBook/Dubsado — one plan, one price — for small service businesses that want CRM, contracts, and invoicing bundled without tier-shopping, though the flat fee is worth comparing against usage-based competitors at low volume.",
    bestFor: ["Small service businesses (photographers, coaches, consultants) wanting one flat-fee all-in-one tool"],
    avoidIf: ["You're a very low-volume freelancer for whom the flat monthly fee is disproportionate", "You need bookkeeping, not client workflow tools"],
    pros: [
      "Single flat-fee plan — no tier comparison needed",
      "All core features (CRM, contracts, invoicing, scheduling) included from day one",
      "30-day money-back guarantee",
    ],
    cons: [
      "No lower-cost tier for very light users — one price regardless of volume",
      "Time tracking, bank feeds, and extra users/brands cost extra on top",
      "Not an accounting system — no bookkeeping or bank reconciliation",
    ],

    popularityScore: 34,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://17hats.com/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "freelance-contract-generator"],
  },
  {
    id: "sevdesk",
    name: "sevDesk",
    // DRAFT - review before publish
    tagline: "German-market cloud accounting with invoicing, bookkeeping, and DATEV export for the DACH region.",
    logoUrl: "VERIFY",
    website: "https://www.sevdesk.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "consulting", "retail"],
    businessSizes: ["solo", "small"],
    regions: ["europe"],
    regionNotes: "Germany/Austria/Switzerland (DACH) focused; VERIFY pricing and VAT rules for the specific target country — figures found were for the German (.de) market.",
    useCases: ["send invoices", "track expenses", "file taxes", "financial reporting"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Invoicing and recurring billing",
      "Bookkeeping with DATEV export for tax advisors",
      "Bank feed reconciliation",
      "VAT (Umsatzsteuer) reporting",
      "Contract-length options (1/12/24 months)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for freelancers and small businesses in Germany, Austria, or Switzerland who want cloud accounting that plays well with a local tax advisor via DATEV export.",
    bestFor: ["DACH-region freelancers and small businesses wanting cloud accounting with tax-advisor compatibility"],
    avoidIf: ["You're outside the DACH region", "You want the largest international integration marketplace"],
    pros: [
      "DATEV export makes handoff to a German tax advisor straightforward",
      "Free 14-day trial across all plans",
      "Multiple contract lengths let you trade flexibility for a lower price",
    ],
    cons: [
      "Limited relevance outside German-speaking Europe",
      "Longer contract lengths lock in a lower price but require 14-day notice to cancel",
      "Smaller international brand recognition than Xero/QuickBooks",
    ],

    popularityScore: 38,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://sevdesk.de/preise/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "lexware-office",
    name: "Lexware Office",
    // DRAFT - review before publish
    tagline: "Established German invoicing and accounting software (formerly lexoffice), with tiered feature packages.",
    logoUrl: "VERIFY",
    website: "https://www.lexware.de",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "consulting", "retail"],
    businessSizes: ["solo", "small"],
    regions: ["europe"],
    regionNotes: "Germany-focused; VAT (Umsatzsteuer) rules built in — VERIFY availability/localization for Austria/Switzerland.",
    useCases: ["send invoices", "track expenses", "file taxes", "payroll", "financial reporting"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Tiered packages (S/M/L/XL) by feature depth",
      "Invoicing and quotes",
      "VAT (Umsatzsteuer) reporting",
      "Optional payroll module priced by employee count",
      "No minimum contract — cancel monthly",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "A well-established German-market alternative to sevDesk, with a long brand history from the Lexware product line and flexible monthly billing.",
    bestFor: ["German freelancers and small businesses wanting flexible, no-lock-in monthly invoicing/accounting"],
    avoidIf: ["You're outside Germany", "You want the largest possible integration/app marketplace"],
    pros: [
      "No minimum contract period — cancel any month",
      "Long-established brand (part of the Lexware/Haufe group)",
      "Clear tiered packages by feature need",
    ],
    cons: [
      "Germany-focused — limited value elsewhere",
      "Payroll is a separate priced add-on",
      "Smaller international integration ecosystem than Xero/QuickBooks",
    ],

    popularityScore: 34,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.lexware.de/preise/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator", "salary-calculator"],
  },
  {
    id: "moneybird",
    name: "Moneybird",
    // DRAFT - review before publish
    tagline: "Simple Dutch cloud accounting priced by monthly bank-transaction volume.",
    logoUrl: "VERIFY",
    website: "https://www.moneybird.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "consulting", "retail"],
    businessSizes: ["solo", "small"],
    regions: ["europe"],
    regionNotes: "Netherlands/Benelux-focused; VERIFY VAT/tax rules for the specific target country.",
    useCases: ["send invoices", "track expenses", "file taxes", "financial reporting"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Pricing tiered by monthly bank-transaction volume",
      "Invoicing and quotes",
      "VAT reporting",
      "No long-term contracts — cancel anytime",
      "Recurring invoices and payment reminders",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for Dutch freelancers and small businesses with modest transaction volume who want simple, no-lock-in accounting priced around actual usage rather than a flat per-user fee.",
    bestFor: ["Dutch/Benelux freelancers and small businesses with low-to-moderate monthly transactions"],
    avoidIf: ["You're outside the Netherlands/Benelux", "You have high transaction volume where the top tier's cost adds up"],
    pros: [
      "No long-term contract — cancel anytime",
      "Transaction-based pricing can be cheaper than flat competitors for light users",
      "Clean, well-regarded Dutch-market interface",
    ],
    cons: [
      "Primarily relevant to the Netherlands/Benelux market",
      "Pricing scales with transaction volume, which needs monitoring as you grow",
      "Smaller international brand recognition",
    ],

    popularityScore: 30,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.moneybird.nl/prijzen/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "exact-online",
    name: "Exact Online",
    // DRAFT - review before publish
    tagline: "Dutch-rooted cloud ERP-lite covering accounting, CRM, and project management for growing businesses.",
    logoUrl: "VERIFY",
    website: "https://www.exact.com/us/software/exact-online",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["retail", "construction", "consulting"],
    businessSizes: ["small", "medium"],
    regions: ["europe", "global"],
    regionNotes: "Strong presence in the Netherlands and broader EU; pricing and currency shown vary significantly by country — VERIFY the correct regional pricing page and currency before quoting a figure.",
    useCases: ["financial reporting", "manage bills", "project management", "file taxes", "erp"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Full accounting with CRM and project management modules",
      "Multi-entity and multi-currency support",
      "Industry-specific editions (manufacturing, wholesale, professional services)",
      "Bank reconciliation and VAT reporting",
      "Free trial available",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for growing European small-to-medium businesses that want accounting bundled with CRM/project management in one ERP-lite platform — priced above pure invoicing/accounting tools, so worth comparing against Xero/QuickBooks first if you only need bookkeeping.",
    bestFor: ["Growing European SMBs wanting accounting plus CRM/project management in one platform"],
    avoidIf: ["You only need simple invoicing/bookkeeping — this is priced for a broader ERP-lite feature set", "You're outside Exact's core European markets"],
    pros: [
      "Bundles accounting with CRM and project management, reducing tool sprawl",
      "Industry-specific editions for manufacturing/wholesale/professional services",
      "Established, long-running Dutch vendor with strong EU presence",
    ],
    cons: [
      "Priced higher than pure invoicing/accounting competitors",
      "Regional pricing/currency varies significantly — must confirm the correct page for your market",
      "Less brand recognition outside Europe",
    ],

    popularityScore: 40,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.exact.com/us/software/exact-online/prices",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "purchase-order-generator", "tax-calculator"],
  },
  {
    id: "holded",
    name: "Holded",
    // DRAFT - review before publish
    tagline: "Spanish all-in-one management software — accounting, invoicing, inventory, HR, and POS in modular tiers.",
    logoUrl: "VERIFY",
    website: "https://www.holded.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["retail", "consulting", "hospitality"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["europe"],
    regionNotes: "Spain-focused, with growing presence across Europe; VAT and SII (Spanish real-time VAT reporting) support — VERIFY current localization for non-Spain markets.",
    useCases: ["send invoices", "manage bills", "inventory management", "financial reporting", "run payroll"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier identified — 14-day free trial, no card required.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Accounting, invoicing, and inventory in tiered plans",
      "Optional HR, POS, and SII add-on modules",
      "Multi-user support (extra users cost more)",
      "Spanish SII real-time VAT reporting",
      "Project and time tracking",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for Spanish small-to-medium businesses that want accounting, invoicing, and inventory (and optionally HR/POS) in one modular platform rather than stitching several tools together.",
    bestFor: ["Spanish/European small-to-medium businesses wanting accounting plus inventory/HR/POS add-ons in one tool"],
    avoidIf: ["You're outside Spain/Europe and don't need SII compliance", "You only need simple invoicing — the add-on modules add cost you may not need"],
    pros: [
      "Modular add-ons (HR, POS, SII) let it scale beyond pure accounting",
      "Strong Spanish tax-compliance support (SII real-time VAT)",
      "14-day free trial, no card required",
    ],
    cons: [
      "Add-on modules and extra users increase cost quickly",
      "Primarily relevant to the Spanish/European market",
      "Smaller international brand recognition than Xero/QuickBooks",
    ],

    popularityScore: 32,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.holded.com/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "purchase-order-generator"],
  },
  {
    id: "gnucash",
    name: "GnuCash",
    // DRAFT - review before publish
    tagline: "100% free, open-source double-entry accounting for individuals and very small businesses.",
    logoUrl: "VERIFY",
    website: "https://gnucash.org",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "nonprofits"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "No regional restrictions — self-hosted desktop software usable anywhere; no localized tax filing built in.",
    useCases: ["basic bookkeeping", "financial reporting", "personal finance", "small business accounting"],
    pricingModel: "free",

    pricing: [{ name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["No feature limits — fully free and open-source"] }],
    hasFreeTier: true,
    freeTierReality: "Entirely free — no paid tier exists at all; 100% of features are available at no cost, forever.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Double-entry bookkeeping",
      "Invoicing and bill tracking",
      "Investment and loan tracking",
      "Financial reports (P&L, balance sheet)",
      "Runs on Windows, macOS, and Linux",
    ],
    integrations: ["VERIFY"],
    platforms: ["windows", "mac", "linux"],

    // DRAFT - review before publish
    verdict:
      "Best for technically comfortable freelancers, small nonprofits, and personal-finance users who want real double-entry accounting with zero ongoing cost and don't need cloud collaboration or automatic bank feeds.",
    bestFor: ["Budget-conscious freelancers and small nonprofits comfortable with desktop software"],
    avoidIf: ["You want automatic bank feeds and a polished modern cloud interface", "You need multi-user cloud collaboration"],
    pros: [
      "Completely free forever — genuinely no locked features or paid tier",
      "Real double-entry accounting, not just basic expense tracking",
      "Cross-platform desktop app with a long-standing open-source community",
    ],
    cons: [
      "No cloud sync or multi-user collaboration by default",
      "Interface looks and feels dated compared to modern cloud tools",
      "No automatic bank feeds or built-in tax filing",
    ],

    popularityScore: 35,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "2026-07-15",
    pricingSourceUrl: "https://gnucash.org/",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
  {
    id: "manager-io",
    name: "Manager.io",
    // DRAFT - review before publish
    tagline: "Free desktop accounting, or a flat-fee cloud edition that doesn't charge per user or per business.",
    logoUrl: "VERIFY",
    website: "https://www.manager.io",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "consulting", "retail"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "No regional restrictions; no built-in localized tax filing — VERIFY country-specific tax report templates available.",
    useCases: ["basic bookkeeping", "send invoices", "financial reporting", "multi-business accounting"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Free Desktop Edition with no locked features",
      "Cloud Edition at one flat monthly fee regardless of user/business count",
      "Self-hosted Server Edition option",
      "Double-entry accounting and invoicing",
      "Popular with bookkeepers managing many client businesses",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "windows", "mac", "linux"],

    // DRAFT - review before publish
    verdict:
      "Best for bookkeepers and accountants managing many client businesses who want one flat fee regardless of business count, or budget-conscious users happy with the free desktop edition.",
    bestFor: ["Bookkeepers/accountants managing multiple client businesses under one flat fee"],
    avoidIf: ["You want a large third-party integration marketplace", "You need automatic bank feeds without extra setup"],
    pros: [
      "Free Desktop Edition with genuinely no locked premium features",
      "Cloud Edition doesn't charge per user or per business — unusual and valuable for bookkeepers",
      "Self-hosted Server Edition option for full data control",
    ],
    cons: [
      "Smaller brand recognition and integration ecosystem than Xero/QuickBooks",
      "Desktop Edition requires manual installation/updates",
      "Less polished, less modern interface than newer cloud-native tools",
    ],

    popularityScore: 36,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www2.manager.io/cloud/pricing",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "purchase-order-generator"],
  },
  {
    id: "akaunting",
    name: "Akaunting",
    // DRAFT - review before publish
    tagline: "Open-source accounting you can self-host for free, or run as a managed cloud service.",
    logoUrl: "VERIFY",
    website: "https://akaunting.com",

    category: "invoicing-accounting",
    subCategory: "full-accounting",
    industries: ["freelancers", "agencies", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "No regional restrictions; self-hosting removes limits entirely — VERIFY current license terms (Business Source License, converting to GPLv3 after 4 years per version).",
    useCases: ["send invoices", "track expenses", "basic bookkeeping", "financial reporting"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality:
      "Self-hosted Standard edition is free, but production use is limited to 2 users, 1 company, and 1,000 invoices — VERIFY current limits before relying on this.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Self-hosted (source-available) or managed cloud hosting",
      "Invoicing, bills, and double-entry accounting",
      "Multi-company support (paid tiers)",
      "App marketplace for extensions",
      "REST API",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for developers and technical freelancers who want an open-source, self-hostable accounting system with no per-user SaaS fees — the free self-hosted tier's user/company/invoice caps mean check the limits before committing.",
    bestFor: ["Developers and technical small businesses wanting self-hosted, source-available accounting"],
    avoidIf: ["You're not comfortable self-hosting and want a fully managed experience by default", "You need more than 1 company or 1,000 invoices on the free tier"],
    pros: [
      "Self-hosted option avoids ongoing SaaS fees entirely",
      "Source-available codebase (Business Source License, converting to GPLv3 over time)",
      "Managed cloud option available if you'd rather not self-host",
    ],
    cons: [
      "Free self-hosted tier has real limits (users, companies, invoice count)",
      "Self-hosting requires server maintenance and update responsibility",
      "Smaller ecosystem/support than commercial competitors",
    ],

    popularityScore: 33,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://akaunting.com/open-source-accounting-software",
    lastReviewed: "",

    relatedUtilityAppsTools: ["invoice-generator", "receipt-generator"],
  },
];
