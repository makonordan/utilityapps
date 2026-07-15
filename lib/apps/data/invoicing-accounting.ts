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
];
