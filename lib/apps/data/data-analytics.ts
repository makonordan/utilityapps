import type { AppListing } from "../types";

// Scaffolded via research pass — 20 well-known Data & Analytics products
// spanning business intelligence/dashboards, product & web analytics, and
// modern data notebook tools.
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

export const DATA_ANALYTICS_APPS: AppListing[] = [
  {
    id: "tableau",
    name: "Tableau",
    // DRAFT - review before publish
    tagline: "The category-defining drag-and-drop BI tool for building rich, interactive data visualizations.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.tableau.com&sz=128",
    website: "https://www.tableau.com",

    category: "data-analytics",
    subCategory: "business-intelligence",
    industries: ["agencies", "consulting", "ecommerce", "healthcare", "retail"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available as Tableau Cloud (SaaS) globally or self-managed Tableau Server for organizations with data residency needs — VERIFY current Cloud data-center regions.",
    useCases: ["build interactive dashboards", "self-service data exploration", "enterprise reporting", "embed analytics in apps", "ad hoc visual analysis"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Drag-and-drop visual analytics builder",
      "Huge library of native data connectors",
      "AI-assisted analysis (Tableau Agent / Ask Data)",
      "Extensive chart/visualization type library",
      "Tableau Public community for sharing public visualizations",
      "Row-level security and enterprise governance controls",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "windows", "macos"],

    // DRAFT - review before publish
    verdict:
      "Best for organizations that want the deepest, most flexible visual analytics tool on the market and are prepared to pay enterprise per-seat prices — smaller teams on a budget will find Power BI or Metabase considerably cheaper for similar core functionality.",
    bestFor: [
      "Analytics teams that need maximum visualization flexibility and polish",
      "Enterprises with dedicated BI/analytics staff who can invest in Tableau's learning curve",
    ],
    avoidIf: [
      "You're a small team on a tight budget — per-seat Creator licenses are among the priciest in the category",
      "You want a simple, low-maintenance dashboard tool rather than a full self-service BI platform",
    ],
    pros: [
      "Best-in-class flexibility and polish for building custom visualizations",
      "Huge, mature user community and extensive learning resources",
      "Deep enterprise governance and row-level security controls",
    ],
    cons: [
      "Per-seat pricing gets expensive quickly for teams that need many Creator licenses",
      "Steeper learning curve than most competing BI tools",
      "Vendor's pricing page blocked automated verification during this research pass — confirm current tier prices directly before publishing",
    ],

    popularityScore: 90,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.tableau.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["csv-to-json"],
  },
  {
    id: "power-bi",
    name: "Microsoft Power BI",
    // DRAFT - review before publish
    tagline: "Microsoft's BI platform — deeply integrated with Excel and the Microsoft 365 ecosystem, with a genuinely free single-player tier.",
    logoUrl: "https://www.google.com/s2/favicons?domain=powerbi.microsoft.com&sz=128",
    website: "https://powerbi.microsoft.com",

    category: "data-analytics",
    subCategory: "business-intelligence",
    industries: ["agencies", "consulting", "ecommerce", "retail", "healthcare"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available globally via Microsoft's cloud regions; data residency options depend on the underlying Azure/Fabric tenant region — VERIFY specifics for regulated industries.",
    useCases: ["build interactive dashboards", "enterprise reporting", "self-service data exploration", "embed branded analytics in apps", "integrate with Excel/Microsoft 365"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Individual use only — cannot publish or share reports without upgrading; included in the free Microsoft Fabric account"] },
      { name: "Pro", priceMonthly: 14, priceAnnual: null, currency: "USD", keyLimits: ["Per user/month, billed annually; included in Microsoft 365 E5; 1 GB model memory, 8 refreshes/day, 10 GB storage/license"] },
      { name: "Premium Per User", priceMonthly: 24, priceAnnual: null, currency: "USD", keyLimits: ["Per user/month, billed annually; 100 GB model memory, 48 refreshes/day, 100 TB storage, enterprise-scale capabilities"] },
      { name: "Embedded", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom/capacity-based pricing — for embedding branded, customer-facing analytics; contact sales"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The Free tier lets you build and explore interactive reports, but you genuinely cannot publish or share a report with anyone else without upgrading to Pro ($14/user/mo) or Premium Per User ($24/user/mo) — it's a real single-player sandbox, not a collaboration tier.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Deep native integration with Excel and Microsoft 365",
      "DAX formula language for custom calculations",
      "Power Query for data transformation/ETL",
      "Copilot AI-assisted report building (higher tiers)",
      "Row-level security and enterprise governance",
      "Embed analytics into custom apps (Embedded)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "windows", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for organizations already invested in the Microsoft ecosystem who want strong BI at a lower per-seat price than Tableau — the free tier is honestly single-player, so real team use starts at Pro.",
    bestFor: [
      "Teams already on Microsoft 365/Excel who want BI that fits their existing stack",
      "Cost-conscious teams that want enterprise-grade BI without Tableau's price tag",
    ],
    avoidIf: [
      "You're not on Windows/Microsoft tooling and want a platform-agnostic authoring experience",
      "You need the single most flexible/polished visualization engine (Tableau is generally considered stronger here)",
    ],
    pros: [
      "Meaningfully cheaper per-seat than Tableau for comparable core BI functionality",
      "Excellent Excel/Microsoft 365 integration for teams already in that ecosystem",
      "Free tier is real (not just a trial) for individual report building",
    ],
    cons: [
      "Report authoring (Power BI Desktop) is Windows-only",
      "Free tier's inability to share/publish makes it unsuitable for any team collaboration",
      "DAX has a real learning curve for advanced calculations",
    ],

    popularityScore: 92,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.microsoft.com/en-us/power-platform/products/power-bi/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["csv-to-json"],
  },
  {
    id: "looker",
    name: "Looker",
    // DRAFT - review before publish
    tagline: "Google Cloud's enterprise BI platform built around a governed semantic layer (LookML) — fully custom-quote pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=cloud.google.com&sz=128",
    website: "https://cloud.google.com/looker",

    category: "data-analytics",
    subCategory: "business-intelligence",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Runs on Google Cloud infrastructure globally — VERIFY current region availability for specific compliance/residency requirements.",
    useCases: ["governed enterprise BI", "embedded/white-label analytics", "self-service exploration on a shared semantic layer", "conversational/AI-assisted analytics"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "LookML semantic/modeling layer for governed metrics",
      "Standard, Enterprise, and Embed platform editions",
      "Conversational Analytics (natural-language querying)",
      "Extensive API for embedding and automation",
      "Granular Developer/Standard/Viewer user roles",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for larger organizations that want a governed, single-source-of-truth semantic layer across many dashboards and embedded use cases — there is no self-serve pricing at all, so budget-constrained teams should expect a real sales cycle before they see a number.",
    bestFor: [
      "Enterprises standardizing metric definitions across many teams via a shared semantic model",
      "Companies embedding analytics into customer-facing products at scale",
    ],
    avoidIf: [
      "You want to see pricing and self-serve sign up without a sales call",
      "You're a small team that just needs simple dashboards, not a governed semantic layer",
    ],
    pros: [
      "LookML's centralized semantic layer keeps metric definitions consistent across dashboards",
      "Strong embedded-analytics story via the Embed edition and API",
      "Deep Google Cloud/BigQuery integration",
    ],
    cons: [
      "Every platform edition (Standard, Enterprise, Embed) is 100% custom-quote — no public numbers anywhere",
      "LookML has a real learning curve for the developer/modeling side",
      "Not a fit for teams wanting to self-serve sign up without a sales conversation",
    ],

    popularityScore: 75,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://cloud.google.com/looker/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["sql-formatter"],
  },
  {
    id: "domo",
    name: "Domo",
    // DRAFT - review before publish
    tagline: "All-in-one cloud BI platform with a consumption/credit-based pricing model and no published rate card.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.domo.com&sz=128",
    website: "https://www.domo.com",

    category: "data-analytics",
    subCategory: "business-intelligence",
    industries: ["consulting", "retail", "ecommerce"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data-center/region availability.",
    useCases: ["executive dashboards", "cross-functional data consolidation", "mobile BI", "workflow/app building on top of data"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Consumption/credit-based platform pricing",
      "Hundreds of pre-built data connectors",
      "Mobile-first dashboard experience",
      "Low-code app/workflow building (Domo Apps)",
      "AI-assisted insights (Domo.AI)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for larger organizations that want one consolidated, mobile-friendly BI platform and are comfortable with consumption-based billing negotiated directly with sales — Domo does not publish pricing anywhere, so budgeting requires a real sales conversation.",
    bestFor: [
      "Mid-market to enterprise teams wanting a mobile-first, all-in-one BI platform",
      "Organizations that want to consolidate many data sources into one executive view",
    ],
    avoidIf: [
      "You want transparent, self-serve pricing you can evaluate without talking to sales",
      "You're a small team or solo user — Domo is priced and positioned for larger deployments",
    ],
    pros: [
      "Strong mobile dashboard experience relative to most BI competitors",
      "Very broad pre-built connector library",
      "Consolidates data + dashboards + light app-building in one platform",
    ],
    cons: [
      "No public pricing whatsoever — every deployment requires a sales-negotiated quote",
      "Consumption/credit billing can be hard to predict and budget for",
      "Reported real-world contract values run well into five and six figures annually",
    ],

    popularityScore: 60,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.domo.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["csv-to-json"],
  },
  {
    id: "sisense",
    name: "Sisense",
    // DRAFT - review before publish
    tagline: "Embeddable analytics platform built for product teams shipping white-labeled dashboards inside their own apps.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.sisense.com&sz=128",
    website: "https://www.sisense.com",

    category: "data-analytics",
    subCategory: "business-intelligence",
    industries: ["consulting", "ecommerce", "healthcare"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Deployable as SaaS, dedicated cloud (AWS/Azure/GCP), or on-premises — VERIFY specific region/data-residency options per plan.",
    useCases: ["embed analytics into a product", "white-labeled customer-facing dashboards", "natural-language/AI-assisted analytics", "multi-tenant BI"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Embed via iframe or Compose SDK into any tech stack",
      "Multi-tenant architecture with column-level security",
      "Built-in AI: natural-language queries and auto-narratives",
      "Flexible deployment: SaaS, dedicated cloud, or on-premises",
      "HIPAA-ready compliance option for regulated industries",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for product teams that need to embed white-labeled analytics directly into their own SaaS product rather than run an internal-only BI tool — only a free trial is offered, not an ongoing free tier, and both the self-serve and Enterprise plans require contacting sales for an actual price.",
    bestFor: [
      "SaaS product teams building customer-facing embedded dashboards",
      "Organizations needing flexible deployment (on-prem, dedicated cloud, or SaaS) for compliance reasons",
    ],
    avoidIf: [
      "You just need internal dashboards, not embedded/white-labeled analytics for your own product",
      "You want to see a price before starting a trial or talking to sales",
    ],
    pros: [
      "Strong, mature embedded-analytics/white-labeling story via iframe and SDK",
      "Flexible deployment models for regulated or compliance-sensitive industries",
      "Built-in natural-language query and narrative generation",
    ],
    cons: [
      "No published pricing for either the self-serve or Enterprise plan — a number requires signing up or contacting sales",
      "Only a free trial exists, not an ongoing free tier",
      "Enterprise-oriented positioning likely prices out very small teams",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.sisense.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "qlik-sense",
    name: "Qlik Sense",
    // DRAFT - review before publish
    tagline: "Associative-engine BI platform now transitioning from per-user to capacity-based cloud pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.qlik.com&sz=128",
    website: "https://www.qlik.com/us/products/qlik-sense",

    category: "data-analytics",
    subCategory: "business-intelligence",
    industries: ["consulting", "retail", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available as Qlik Cloud (SaaS) globally or on-premises Qlik Sense Enterprise — VERIFY current region availability.",
    useCases: ["associative data exploration", "self-service dashboards", "embedded analytics", "enterprise reporting"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Associative engine for exploring data without pre-set query paths",
      "AI-assisted insight generation",
      "On-premises or Qlik Cloud SaaS deployment",
      "Embedded analytics via APIs",
      "Data integration/pipeline tools (separate product line)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "windows"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that value the associative exploration model over query-based BI — Qlik shifted from per-user to capacity-based cloud pricing in 2025, and the live pricing page didn't render usable tier figures during this research pass, so treat any cited numbers as unconfirmed until checked directly.",
    bestFor: [
      "Analysts who prefer associative, non-linear data exploration over strict query paths",
      "Organizations migrating from on-premises Qlik Sense Enterprise who want a cloud path",
    ],
    avoidIf: [
      "You want simple, transparent per-user pricing rather than capacity-based billing",
      "Your team isn't already familiar with Qlik's associative model — the learning curve differs from typical BI tools",
    ],
    pros: [
      "Associative engine is a genuinely different (and for some analysts, more intuitive) exploration model",
      "Mature product with a long enterprise BI track record",
      "Flexible on-prem or cloud deployment",
    ],
    cons: [
      "Recent shift to capacity-based pricing makes cost comparisons to per-seat competitors harder",
      "Official pricing page is JS-rendered and didn't surface reliable tier figures during verification",
      "Smaller ecosystem/community than Tableau or Power BI",
    ],

    popularityScore: 65,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.qlik.com/us/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["csv-to-json"],
  },
  {
    id: "metabase",
    name: "Metabase",
    // DRAFT - review before publish
    tagline: "Open-source-first BI tool — genuinely free to self-host, with a hosted Cloud option for teams who'd rather not run it themselves.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.metabase.com&sz=128",
    website: "https://www.metabase.com",

    category: "data-analytics",
    subCategory: "business-intelligence",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Self-hosted deployments run anywhere you choose; Metabase Cloud is a global SaaS offering — VERIFY current Cloud region options.",
    useCases: ["self-service dashboards", "ask-a-question SQL/GUI query builder", "embedded analytics", "internal BI for small-to-mid teams"],
    pricingModel: "freemium",

    pricing: [
      { name: "Open Source", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Self-hosted; unlimited questions, dashboards, and users; 20+ data source connectors; full SQL editor"] },
      { name: "Starter (Cloud)", priceMonthly: 100, priceAnnual: 90, currency: "USD", keyLimits: ["Hosted by Metabase; includes 5 users, then $6/user/mo ($65/user/yr); 3-day email/Slack support"] },
      { name: "Pro (Cloud)", priceMonthly: 575, priceAnnual: 517.5, currency: "USD", keyLimits: ["Includes 10 users, then $12/user/mo ($130/user/yr); row/column-level permissions, SSO, embedded analytics, whitelabeling"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing, starting around $20,000/year — dedicated success engineer, 1-day support SLA, air-gapped deployment option"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The self-hosted Open Source edition is a genuinely free, full-featured product — unlimited users, questions, and dashboards, with no artificial caps — you just run and maintain the server yourself. The hosted Metabase Cloud plans (Starter/Pro) have no free tier of their own; they're flat monthly fees plus per-seat overage once you exceed the included user count.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Point-and-click question builder plus a full SQL editor",
      "AI-assisted question building and SQL generation",
      "Self-hostable and fully open source",
      "Row and column-level permissions (Pro/Enterprise)",
      "Embedded analytics with whitelabeling (Pro/Enterprise)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want real BI capability without a per-seat enterprise price tag — self-hosting the open-source edition is free and full-featured, though you take on the ops burden that Metabase Cloud would otherwise handle.",
    bestFor: [
      "Small-to-mid teams and freelancers who want free, self-hosted BI with no artificial feature caps",
      "Teams that want a lighter-weight alternative to Tableau/Power BI/Looker",
    ],
    avoidIf: [
      "You don't want to manage your own server/hosting and aren't ready to pay for Metabase Cloud",
      "You need the deepest enterprise governance and embedding features found in Looker or Sisense",
    ],
    pros: [
      "Genuinely free, full-featured self-hosted edition — not a crippled trial",
      "Simple, fast setup relative to enterprise BI platforms",
      "Both a GUI question builder and a full SQL editor for power users",
    ],
    cons: [
      "Self-hosting means you own uptime, upgrades, and infrastructure costs",
      "Cloud Pro's jump to $575/mo is steep relative to the Starter tier",
      "Fewer enterprise governance/embedding features than Looker or Sisense",
    ],

    popularityScore: 72,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.metabase.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["sql-formatter", "csv-to-json"],
  },
  {
    id: "zoho-analytics",
    name: "Zoho Analytics",
    // DRAFT - review before publish
    tagline: "Affordable, broad BI tool from the Zoho suite with a real free plan and deep ties to other Zoho apps.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.zoho.com&sz=128",
    website: "https://www.zoho.com/analytics/",

    category: "data-analytics",
    subCategory: "business-intelligence",
    industries: ["agencies", "consulting", "retail", "ecommerce", "nonprofits"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional data-center options (Zoho operates multiple regional data centers, e.g. US/EU/India).",
    useCases: ["self-service dashboards", "cross-app reporting within the Zoho ecosystem", "AI-assisted analytics (Ask Zia)", "embedded/white-labeled analytics"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Ask Zia AI agent for natural-language queries",
      "80+ built-in visualization types",
      "50+ pre-built connectors to business apps",
      "Advanced data preparation/ETL",
      "Tight integration with other Zoho apps (Zoho Books, CRM, etc.)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small-to-mid businesses already using other Zoho products who want an affordable BI tool without leaving the ecosystem — a real free plan exists (confirmed: 2 users, 10K rows), but exact paid-tier dollar amounts weren't confirmed during this research pass and need direct verification.",
    bestFor: [
      "Small businesses and teams already using Zoho Books, CRM, or other Zoho apps",
      "Cost-conscious teams wanting a broad BI feature set without Tableau/Power BI-level spend",
    ],
    avoidIf: [
      "You're not in the Zoho ecosystem and want a tool with a larger third-party integration marketplace",
      "You need enterprise-grade governance/embedding features comparable to Looker or Sisense",
    ],
    pros: [
      "Free plan is real and confirmed (2 users, 10K rows, 5 workspaces, unlimited reports/dashboards)",
      "Broad visualization and connector library for the price point",
      "Deep integration with the wider Zoho product suite",
    ],
    cons: [
      "Paid-tier dollar pricing is hidden behind a JS-rendered pricing calculator — not confirmable via direct fetch",
      "Smaller third-party integration/community ecosystem than Tableau or Power BI",
      "Row limits scale with plan, which can surprise teams with larger datasets",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.zoho.com/analytics/pricing.html",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["csv-to-json"],
  },
  {
    id: "klipfolio",
    name: "Klipfolio",
    // DRAFT - review before publish
    tagline: "Dashboard-building tool focused on pulling metrics from many sources into a small number of live, shareable dashboards.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.klipfolio.com&sz=128",
    website: "https://www.klipfolio.com",

    category: "data-analytics",
    subCategory: "business-intelligence",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current data-center/region options.",
    useCases: ["build live metric dashboards", "marketing/sales reporting", "client-facing agency reporting", "combine data from many SaaS tools"],
    pricingModel: "subscription",

    pricing: [
      { name: "Base", priceMonthly: 120, priceAnnual: null, currency: "USD", keyLimits: ["3 dashboards, unlimited users, 4-hour data refresh, 130+ data integrations, PDF/scheduled reports included"] },
      { name: "Grow", priceMonthly: 190, priceAnnual: null, currency: "USD", keyLimits: ["10 dashboards, unlimited users, 1-hour data refresh, adds data modeling on top of Base"] },
      { name: "Team", priceMonthly: 310, priceAnnual: null, currency: "USD", keyLimits: ["20 dashboards, unlimited users, 15-minute data refresh, adds Single Sign-On (SSO)"] },
      { name: "Team+", priceMonthly: 600, priceAnnual: null, currency: "USD", keyLimits: ["40 dashboards, unlimited users, up-to-the-minute refresh, custom onboarding, priority support"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free plan — only a 14-day free trial with almost-unlimited feature access and no credit card required, after which pricing starts at $120/mo for 3 dashboards. Annual billing reduces effective annual cost, but Klipfolio's own pricing page didn't clearly itemize a separate annual per-month rate.",
    startingPrice: 120,
    currency: "USD",

    keyFeatures: [
      "130+ pre-built data source integrations",
      "Live, auto-refreshing dashboards (down to real-time on top tier)",
      "PDF and scheduled report delivery",
      "Data modeling/transformation layer",
      "Published/shareable dashboard links",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for agencies and marketing/ops teams that need a handful of always-current metric dashboards pulled from many disparate tools — the dashboard-count-based pricing (not per-user) can be generous for large teams but expensive if you need many separate dashboards.",
    bestFor: [
      "Agencies building client-facing reporting dashboards from many data sources",
      "Marketing/ops teams that want unlimited viewers but only need a handful of dashboards",
    ],
    avoidIf: [
      "You need dozens of distinct dashboards — pricing scales by dashboard count, not seats",
      "You want a genuine free tier to evaluate long-term, not just a 14-day trial",
    ],
    pros: [
      "Unlimited users on every plan, unusual for the category",
      "Very broad data source integration library",
      "Refresh frequency scales meaningfully with plan tier, down to real-time",
    ],
    cons: [
      "No ongoing free plan, only a time-limited trial",
      "Dashboard-count caps (starting at just 3 on Base) can feel restrictive quickly",
      "Less full-featured self-service BI (ad hoc exploration) than Tableau/Power BI/Metabase",
    ],

    popularityScore: 45,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.klipfolio.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "databox",
    name: "Databox",
    // DRAFT - review before publish
    tagline: "KPI dashboard tool built around a real free plan and mobile-first metric tracking for small teams.",
    logoUrl: "https://www.google.com/s2/favicons?domain=databox.com&sz=128",
    website: "https://databox.com",

    category: "data-analytics",
    subCategory: "business-intelligence",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current data-center/region options.",
    useCases: ["track marketing/sales KPIs", "build client-facing reports", "mobile dashboard monitoring", "goal tracking and scorecards"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["1 user, 3 data sources, 1 dashboard/report, 50 AI credits/mo, 10 custom metrics"] },
      { name: "Analyst", priceMonthly: 64, priceAnnual: null, currency: "USD", keyLimits: ["1 user, 5 data sources, 500 AI credits/mo, unlimited dashboards/reports, all integrations"] },
      { name: "Pro", priceMonthly: 159, priceAnnual: null, currency: "USD", keyLimits: ["Unlimited users, 3 data sources included ($5.60/mo per additional), 1,500 AI credits/mo, hourly sync"] },
      { name: "Growth", priceMonthly: 399, priceAnnual: null, currency: "USD", keyLimits: ["Unlimited users, 4,000 AI credits/mo, 15-minute sync, forecasting and datasets, dedicated CSM"] },
      { name: "Custom", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing — white-labeling, SSO, advanced security, priority support"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is real but narrow: 1 user, 3 data sources, and just 1 dashboard/report — enough to evaluate the product, not to run a team's ongoing reporting. Every paid plan advertises roughly 20% off with annual billing, and a 14-day free trial (no card required) is available on paid tiers.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "70+ pre-built data source integrations",
      "Mobile app for on-the-go KPI monitoring",
      "AI-generated insights (credit-metered)",
      "Goal tracking and scorecards",
      "Client-facing/white-labeled reporting (higher tiers)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small teams and solo operators who want a genuinely free way to track a handful of KPIs on mobile before committing to a paid BI tool — the free plan's single-dashboard cap means it's really an evaluation tier, not a long-term free option for real work.",
    bestFor: [
      "Solo marketers/consultants monitoring a small set of KPIs on the go",
      "Small agencies building simple client-facing metric dashboards",
    ],
    avoidIf: [
      "You need more than one dashboard or multiple data sources without upgrading past Free",
      "You want deep ad hoc data exploration rather than pre-built KPI scorecards",
    ],
    pros: [
      "Genuine (if narrow) free plan, not just a trial",
      "Strong mobile app experience relative to most BI competitors",
      "Simple setup for common marketing/sales KPI tracking",
    ],
    cons: [
      "Free plan's 1-dashboard cap is quite restrictive for real use",
      "AI-credit metering adds another usage dimension to track on paid plans",
      "Less suited to complex ad hoc analysis than a full BI tool like Metabase or Power BI",
    ],

    popularityScore: 50,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://databox.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "mixpanel",
    name: "Mixpanel",
    // DRAFT - review before publish
    tagline: "Event-based product analytics for understanding user behavior and funnels, with a genuinely usable free tier.",
    logoUrl: "https://www.google.com/s2/favicons?domain=mixpanel.com&sz=128",
    website: "https://mixpanel.com",

    category: "data-analytics",
    subCategory: "product-web-analytics",
    industries: ["ecommerce", "agencies", "consulting"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options for Enterprise customers.",
    useCases: ["product usage/funnel analytics", "user behavior tracking", "cohort/retention analysis", "session replay", "A/B experiment reporting"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 1M monthly events, up to 5 saved reports, 10K monthly session replays, no credit card required"] },
      { name: "Growth", priceMonthly: 0, priceAnnual: null, currency: "USD", keyLimits: ["First 1M events/mo free, then roughly $0.28 per 1,000 events with volume discounts; unlimited reports, 20K free monthly session replays, behavioral cohorts"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing — unlimited events, HIPAA compliance tooling, SAML SSO/SCIM, dedicated account manager"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan includes a genuinely usable 1M events/month with no credit card required, but caps you at just 5 saved reports. Growth removes the report cap and layers in metered per-event pricing (~$0.28 per 1,000 events) once you exceed 1M events, so real monthly cost scales directly with product usage. A startup program offers the first year free to companies under 5 years old with ≤$8M in funding.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Event-based funnel and retention analysis",
      "Behavioral cohorts and segmentation",
      "Session replay",
      "Anomaly detection and alerting (add-on)",
      "Warehouse-native data connection options",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for product teams that want deep, self-serve funnel and retention analysis and are comfortable with usage-based pricing once they outgrow the 1M-event free tier — the free tier's 5-report cap is the first real limit teams hit.",
    bestFor: [
      "Product managers and growth teams analyzing user funnels and retention",
      "Early-stage startups that can use the free tier or startup program to defer cost",
    ],
    avoidIf: [
      "Your event volume is large and unpredictable — per-event overage pricing can get expensive fast",
      "You need full-stack customer data platform features (identity resolution, warehouse sync) rather than analytics alone",
    ],
    pros: [
      "Free tier's 1M events/month is genuinely usable, not just a token trial",
      "Strong, fast funnel/retention/cohort analysis UX",
      "Startup program can make the first year free for qualifying companies",
    ],
    cons: [
      "Per-event overage pricing on Growth can be hard to budget for at scale",
      "Free plan's 5-report cap forces an upgrade quickly for active teams",
      "Enterprise pricing is fully custom — no public numbers for larger deployments",
    ],

    popularityScore: 85,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://mixpanel.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["json-formatter"],
  },
  {
    id: "amplitude",
    name: "Amplitude",
    // DRAFT - review before publish
    tagline: "Digital analytics platform for product teams — permanent 2M-event free tier plus experimentation and session replay in one product.",
    logoUrl: "https://www.google.com/s2/favicons?domain=amplitude.com&sz=128",
    website: "https://amplitude.com",

    category: "data-analytics",
    subCategory: "product-web-analytics",
    industries: ["ecommerce", "agencies", "consulting"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options.",
    useCases: ["product usage/funnel analytics", "behavioral cohort analysis", "session replay", "A/B experimentation", "in-product guides/surveys"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["2M events/month (permanent), 10K monthly session replays, limited experiments/guides/surveys, no credit card required"] },
      { name: "Plus", priceMonthly: 0, priceAnnual: null, currency: "USD", keyLimits: ["Starts at $0 and scales with usage up to 70M events/mo; 20 behavioral cohorts, 2-year data retention, custom events/alerts, heatmaps"] },
      { name: "Growth", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom event-based pricing — 20K monthly session replays, advanced behavioral exploration, currency conversion, SSO"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom event-based pricing — 50K monthly session replays, unlimited monitoring/alerts, advanced RBAC and data access controls"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The Free plan's 2M events/month is a permanent allowance (not a time-limited trial) with no credit card required — one of the more generous free tiers in product analytics. Plus scales with usage past that point on rates that weren't publicly itemized, and both Growth and Enterprise require a sales conversation for an exact quote.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Product usage funnels, retention, and behavioral cohorts",
      "Built-in session replay",
      "A/B experimentation and feature flagging",
      "In-product guides and surveys",
      "AI-assisted analysis (\"AI Agents\")",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for product teams wanting analytics, experimentation, and session replay bundled into a single platform without paying for three separate tools — the 2M-event free tier is genuinely generous, but real pricing above it is entirely custom and not published.",
    bestFor: [
      "Product teams wanting analytics, replay, and experimentation in one bundled platform",
      "Growth-stage companies that can operate within the 2M-events/month free allowance for a while",
    ],
    avoidIf: [
      "You want fully transparent, published pricing once you outgrow the free tier",
      "You only need lightweight web analytics — Amplitude's full platform is more than most small sites need",
    ],
    pros: [
      "Free tier's 2M events/month is permanent and genuinely generous for the category",
      "Bundles analytics, experimentation, and session replay rather than requiring separate tools",
      "Strong behavioral cohort and retention analysis tooling",
    ],
    cons: [
      "Pricing above the free/Plus tiers is entirely custom — no public rate card for Growth or Enterprise",
      "Can be more platform than small teams need if they only want basic web analytics",
      "Plus tier's exact scaling rates weren't disclosed on the public pricing page",
    ],

    popularityScore: 80,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://amplitude.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["json-formatter"],
  },
  {
    id: "google-analytics-360",
    name: "Google Analytics 360",
    // DRAFT - review before publish
    tagline: "The paid enterprise tier of Google Analytics — higher limits and SLAs on top of the free GA4 product, sold entirely through sales.",
    logoUrl: "https://www.google.com/s2/favicons?domain=marketingplatform.google.com&sz=128",
    website: "https://marketingplatform.google.com/about/analytics-360/",

    category: "data-analytics",
    subCategory: "product-web-analytics",
    industries: ["ecommerce", "retail", "agencies", "consulting"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Sold via Google sales reps or authorized resellers globally — VERIFY availability/terms in specific regions.",
    useCases: ["enterprise web/app analytics", "higher-volume GA4 data collection", "BigQuery data export at scale", "guaranteed data-processing SLAs"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Higher hit/event volume limits than free Google Analytics (GA4)",
      "Guaranteed data-processing SLAs",
      "Unsampled reporting at scale",
      "Dedicated technical account support",
      "Deeper BigQuery export integration",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for very high-traffic enterprises that have genuinely outgrown free GA4's processing limits and need contractual SLAs and support — Google has never published a price for this product; every deployment is a custom sales quote through Google or an authorized reseller.",
    bestFor: [
      "High-volume enterprise sites/apps that exceed free GA4's practical processing limits",
      "Organizations needing contractual SLAs and dedicated support for their analytics stack",
    ],
    avoidIf: [
      "You want to see a price without a sales conversation — this product has never had public pricing",
      "Your traffic fits comfortably within free GA4's limits — the free product covers the vast majority of businesses",
    ],
    pros: [
      "Backed by Google Cloud's infrastructure and a dedicated support relationship",
      "Removes/raises the sampling and processing limits that constrain free GA4 at high volume",
      "Deep native BigQuery export for large-scale data warehousing",
    ],
    cons: [
      "No public pricing exists anywhere — confirmed directly, the vendor page only offers 'Talk to Sales'",
      "Industry estimates place typical contracts well into five and six figures annually, but these are third-party estimates, not vendor-confirmed",
      "Only relevant to a small slice of very high-traffic organizations; most businesses never need it",
    ],

    popularityScore: 78,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://marketingplatform.google.com/about/analytics-360/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "segment",
    name: "Twilio Segment",
    // DRAFT - review before publish
    tagline: "Customer data platform for collecting and routing first-party event data to hundreds of downstream tools.",
    logoUrl: "https://www.google.com/s2/favicons?domain=segment.com&sz=128",
    website: "https://segment.com",

    category: "data-analytics",
    subCategory: "product-web-analytics",
    industries: ["ecommerce", "agencies", "consulting"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options.",
    useCases: ["collect and route first-party event data", "customer data platform / identity resolution", "audience building for marketing tools", "reverse ETL to the warehouse"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "700+ pre-built source/destination integrations",
      "Identity resolution and unified customer profiles (Unify)",
      "AI-powered audience building (Engage)",
      "Functions for custom data transformation",
      "Reverse ETL to send warehouse data back to tools",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for organizations that need a single, well-governed pipe for first-party event data feeding dozens of downstream marketing/analytics tools — current pricing is entirely custom-quote with only a 14-day trial to evaluate, so budgeting requires a sales conversation before committing.",
    bestFor: [
      "Organizations centralizing event data across many downstream analytics and marketing tools",
      "Teams that need identity resolution/unified profiles as part of their data infrastructure",
    ],
    avoidIf: [
      "You want transparent self-serve pricing without a sales call",
      "You only send data to one or two destinations — a direct integration may be simpler and cheaper",
    ],
    pros: [
      "Very large catalog of pre-built destination integrations",
      "Strong identity resolution and unified profile tooling (Unify/Engage)",
      "Reduces one-off point-to-point integration work across the data stack",
    ],
    cons: [
      "No public numeric pricing at all — both tiers ('Customer Data Pipeline' and full CDP) are sales-quote only",
      "Monthly Tracked Users (MTU) pricing model can scale unpredictably with growth",
      "Overkill for teams that only need basic web/product analytics, not full CDP infrastructure",
    ],

    popularityScore: 74,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.twilio.com/en-us/pricing/customer-data",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["json-formatter"],
  },
  {
    id: "hotjar",
    name: "Hotjar",
    // DRAFT - review before publish
    tagline: "Session recordings, heatmaps, and on-site surveys for understanding how visitors actually use a website — now part of Contentsquare.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.hotjar.com&sz=128",
    website: "https://www.hotjar.com",

    category: "data-analytics",
    subCategory: "product-web-analytics",
    industries: ["ecommerce", "agencies", "retail", "hospitality"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options, especially post-Contentsquare acquisition.",
    useCases: ["session recordings", "heatmaps", "on-site surveys and feedback widgets", "UX research for conversion optimization"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Session recordings of real visitor behavior",
      "Click/scroll/move heatmaps",
      "On-site surveys and feedback widgets",
      "Funnel and form analysis",
      "Daily-session-based pricing model",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want qualitative insight into visitor behavior (recordings, heatmaps, surveys) alongside quantitative analytics — Hotjar's pricing page now redirects into Contentsquare's JS-rendered pricing hub following the 2025 acquisition, so current tier prices need direct, in-browser confirmation before publishing.",
    bestFor: [
      "UX researchers and CRO teams who want to watch real user sessions, not just aggregate metrics",
      "Marketing/product teams running on-site surveys alongside quantitative analytics",
    ],
    avoidIf: [
      "You need enterprise-grade quantitative product analytics — Hotjar is qualitative-first, not a replacement for Amplitude/Mixpanel",
      "You want a pricing page that doesn't require sign-up or a demo to see current numbers post-acquisition",
    ],
    pros: [
      "Strong, purpose-built qualitative UX research tooling (recordings, heatmaps, surveys)",
      "Historically well-known for a genuinely usable free tier",
      "Easy to run alongside a separate quantitative analytics tool",
    ],
    cons: [
      "Pricing page now redirects into Contentsquare's broader, JS-rendered pricing hub, making current numbers hard to verify automatically",
      "Session-based pricing (not event-based) measures differently than most analytics competitors, complicating comparisons",
      "Product roadmap/branding is in flux following the Contentsquare acquisition",
    ],

    popularityScore: 76,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.hotjar.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "heap",
    name: "Heap",
    // DRAFT - review before publish
    tagline: "Auto-capture product analytics — instruments every user interaction retroactively, priced on session volume.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.heap.io&sz=128",
    website: "https://www.heap.io",

    category: "data-analytics",
    subCategory: "product-web-analytics",
    industries: ["ecommerce", "agencies", "consulting"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Region-specific storage available on the top Premier tier — VERIFY specific regions offered.",
    useCases: ["auto-captured product usage tracking", "retroactive event analysis", "funnel and engagement analysis", "session replay (add-on)"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 10,000 monthly sessions, core analytics charts, unlimited auto-captured event enrichment, 6-month data history, community support only"] },
      { name: "Growth", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom session-based pricing — unlimited users/reports, Sense AI, CSV exports, chart customization, 12-month data history"] },
      { name: "Pro", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom session-based pricing — account analytics, engagement matrix, report alerts, session replay add-on, 3 environments"] },
      { name: "Premier", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom session-based pricing — data warehouse integration, behavioral targeting, unlimited projects, dedicated CSM, region-specific storage"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan genuinely works up to 10,000 monthly sessions with 6 months of data history, though support is community-only. Every paid tier above Free (Growth, Pro, Premier) is priced on an undisclosed, session-volume-based custom quote — Heap's own pricing page has no published per-session rate, only a 'install the free snippet to get an estimate' flow.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Auto-capture of every user interaction (no manual event tracking required)",
      "Retroactive analysis — define new events on historical data",
      "Sense AI for automated insight surfacing",
      "Engagement matrix and account-level analytics",
      "Session replay (add-on on Pro+)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for product teams that want to skip manual event-tracking instrumentation and analyze historical interactions retroactively — the free tier's 10,000 sessions is genuinely usable for evaluation, but every paid tier is a session-volume quote with no published rate.",
    bestFor: [
      "Product teams that don't want to hand-instrument every trackable event upfront",
      "Teams doing account-based analytics (B2B SaaS) that value the engagement matrix",
    ],
    avoidIf: [
      "You want transparent, published per-session or per-event pricing before signing up",
      "Your traffic volume is large — auto-capture plus growing session counts can get costly at scale",
    ],
    pros: [
      "Auto-capture removes the upfront engineering cost of manual event tracking",
      "Retroactive analysis is a genuine differentiator versus event-only competitors",
      "Free tier's 10K monthly sessions is real, not a short trial",
    ],
    cons: [
      "No published pricing for any paid tier — everything above Free requires a custom, session-based quote",
      "Auto-capture can generate noisy data that needs cleanup/governance",
      "Smaller ecosystem/community than Mixpanel or Amplitude",
    ],

    popularityScore: 62,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.heap.io/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["json-formatter"],
  },
  {
    id: "hex",
    name: "Hex",
    // DRAFT - review before publish
    tagline: "Collaborative data notebook that blends SQL, Python, and no-code cells for building analyses and interactive apps together.",
    logoUrl: "https://www.google.com/s2/favicons?domain=hex.tech&sz=128",
    website: "https://hex.tech",

    category: "data-analytics",
    subCategory: "data-notebooks",
    industries: ["agencies", "consulting", "freelancers"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options for Enterprise's single-tenant offering.",
    useCases: ["collaborative SQL/Python notebooks", "build internal data apps from notebooks", "ad hoc data science exploration", "scheduled analytics workflows"],
    pricingModel: "freemium",

    pricing: [
      { name: "Community", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 5 notebooks, up to 5 published apps, small compute, notebook AI agent trial"] },
      { name: "Professional", priceMonthly: 36, priceAnnual: null, currency: "USD", keyLimits: ["Per Editor/month; unlimited notebooks, up to 5 published apps, medium compute, 30-day version history, full notebook agent"] },
      { name: "Team", priceMonthly: 75, priceAnnual: null, currency: "USD", keyLimits: ["Per Editor/month; unlimited published apps, medium compute, scheduled runs/alerts, shared components, 14-day free trial available"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing — audit logs, OIDC SSO, single-tenant option, HIPAA add-on, embedded analytics, dedicated support"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Community is free forever but capped at just 5 notebooks and 5 published apps with small compute only — enough to try Hex, not to run a team's ongoing analytics workflows. Paid plans bill per Editor (viewers typically aren't charged) and include monthly credit grants for AI features.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Notebook cells mixing SQL, Python, and no-code",
      "Publish notebooks as interactive, shareable data apps",
      "AI notebook agent for building/debugging analyses",
      "Scheduled runs and alerting",
      "Shared components/collections for reuse across notebooks",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for data teams that want a modern, collaborative notebook workflow bridging SQL/Python analysis and shareable interactive apps — the free Community tier's 5-notebook cap makes it primarily a trial rather than an ongoing solo option.",
    bestFor: [
      "Data analysts/scientists who want to collaborate on notebooks the way engineers collaborate on code",
      "Teams that want to turn ad hoc analyses into shareable internal apps without a separate BI tool",
    ],
    avoidIf: [
      "You want a traditional drag-and-drop BI tool rather than a code-first notebook interface",
      "You need more than 5 notebooks and aren't ready to pay — Community's cap is restrictive",
    ],
    pros: [
      "Genuinely novel blend of notebook analysis and publishable, interactive apps",
      "Per-Editor (not per-viewer) pricing keeps sharing outputs cheap",
      "AI notebook agent is a real productivity aid for SQL/Python work",
    ],
    cons: [
      "Free tier's 5-notebook cap limits it to evaluation rather than ongoing solo use",
      "Requires SQL/Python comfort — not a no-code tool for non-technical users",
      "Enterprise pricing is fully custom with no public figures",
    ],

    popularityScore: 68,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://hex.tech/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["sql-formatter", "csv-to-json"],
  },
  {
    id: "mode-analytics",
    name: "Mode Analytics",
    // DRAFT - review before publish
    tagline: "SQL-first analytics notebook for data teams, now part of ThoughtSpot's AI analytics stack.",
    logoUrl: "https://www.google.com/s2/favicons?domain=mode.com&sz=128",
    website: "https://mode.com",

    category: "data-analytics",
    subCategory: "data-notebooks",
    industries: ["agencies", "consulting"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options.",
    useCases: ["SQL-first data analysis notebooks", "collaborative report/dashboard building", "ad hoc analytics for data teams", "embedding analyses into other tools"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "SQL editor combined with Python/R notebook cells",
      "Collaborative report and dashboard building",
      "Visual exploration on top of query results",
      "Scheduling and alerting on reports",
      "Now integrated with ThoughtSpot's AI analytics capabilities",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for SQL-fluent data teams that want a notebook-style analysis tool with strong reporting/dashboard output — Mode's public pricing page currently shows only 'Try for free' and 'Request demo' calls to action with no visible tiers, so current pricing needs direct, in-browser confirmation.",
    bestFor: [
      "Data analysts who live in SQL and want notebook-style collaborative analysis",
      "Teams that want to layer visual reporting on top of raw SQL queries",
    ],
    avoidIf: [
      "You want a self-serve pricing page you can evaluate without requesting a demo",
      "Your team isn't SQL-fluent — Mode is built around a SQL-first workflow",
    ],
    pros: [
      "Strong SQL-first analysis and reporting workflow for data teams",
      "Notebook format supports both quick queries and deeper Python/R analysis",
      "Now backed by ThoughtSpot's broader AI analytics investment",
    ],
    cons: [
      "Current public pricing page displays no tier names or figures — needs direct verification",
      "Less well-known/actively marketed as a standalone brand since the ThoughtSpot acquisition",
      "Not a fit for non-technical users who need a no-code BI experience",
    ],

    popularityScore: 50,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://mode.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["sql-formatter"],
  },
  {
    id: "preset",
    name: "Preset",
    // DRAFT - review before publish
    tagline: "Managed, hosted version of open-source Apache Superset — a genuinely free tier backed by a real open-source project.",
    logoUrl: "https://www.google.com/s2/favicons?domain=preset.io&sz=128",
    website: "https://preset.io",

    category: "data-analytics",
    subCategory: "data-notebooks",
    industries: ["agencies", "consulting", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Multi-region support on Professional/Enterprise plans — VERIFY specific regions offered.",
    useCases: ["self-service dashboards on Apache Superset", "collaborative SQL exploration", "embedded dashboards", "AI-assisted chart building"],
    pricingModel: "freemium",

    pricing: [
      { name: "Starter", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 5 users, unlimited dashboards/charts, 40+ visualization types, 1 workspace"] },
      { name: "Professional", priceMonthly: 25, priceAnnual: 20, currency: "USD", keyLimits: ["Per user/month (annual billing $20/user/mo); unlimited users, 3 workspaces, RBAC, scheduled reports/alerts, Slack integration"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing — dbt integration, Managed Private Cloud deployment, SSO/SCIM, audit logs, enterprise SLA"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Starter is free forever with real functionality — unlimited dashboards and charts across 40+ chart types — but caps out at 5 users and a single workspace, so a growing team quickly needs Professional at $25/user/mo ($20/user/mo billed annually).",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Built on open-source Apache Superset",
      "40+ visualization types and a no-code chart builder",
      "Collaborative SQL editor with a semantic layer",
      "AI chatbot for chart/analysis assistance",
      "Embedded dashboards (volume discounts available)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want the open-source Apache Superset experience without running their own infrastructure — the free Starter tier is genuinely capable for small teams, and pricing scales predictably by seat rather than usage.",
    bestFor: [
      "Small teams and freelancers wanting a free, capable BI tool without self-hosting Superset",
      "Organizations already using or evaluating open-source Apache Superset",
    ],
    avoidIf: [
      "You need the deepest enterprise governance/embedding features found in Looker or Sisense",
      "You'd rather self-host Superset directly for full control at zero license cost",
    ],
    pros: [
      "Starter plan is genuinely free with real functionality, not a crippled trial",
      "Straightforward per-seat pricing rather than opaque usage-based billing",
      "Backed by the actively developed, well-regarded open-source Superset project",
    ],
    cons: [
      "Smaller ecosystem/brand recognition than Tableau, Power BI, or Metabase",
      "Enterprise tier pricing is fully custom with no public figures",
      "Starter's 5-user/1-workspace cap means real team collaboration requires upgrading",
    ],

    popularityScore: 48,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://preset.io/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["sql-formatter"],
  },
  {
    id: "grafana",
    name: "Grafana Cloud",
    // DRAFT - review before publish
    tagline: "Open-source-rooted dashboarding and observability platform — visualize metrics, logs, and traces from virtually any data source.",
    logoUrl: "https://www.google.com/s2/favicons?domain=grafana.com&sz=128",
    website: "https://grafana.com",

    category: "data-analytics",
    subCategory: "business-intelligence",
    industries: ["agencies", "consulting"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Public Cloud, Federal Cloud, and Bring-Your-Own-Cloud deployment options available on Enterprise — VERIFY specific regions per option.",
    useCases: ["metrics/logs/traces dashboards", "infrastructure and application observability", "alerting on operational data", "combine data from many time-series sources"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["All Grafana Cloud services with limited usage; 14-day retention for metrics/logs/traces/profiles; community support"] },
      { name: "Pro", priceMonthly: 19, priceAnnual: null, currency: "USD", keyLimits: ["Starting platform fee, then usage-based across products (e.g. metrics from $6.50/1k series, logs $0.05/GB processed); 13-month metrics retention, 8x5 email support"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Minimum $25,000/year commitment — premium support, custom retention, Public Cloud/Federal Cloud/Bring-Your-Own-Cloud deployment"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free tier includes every Grafana Cloud service (dashboards, metrics, logs, traces, profiling) but with tight limited-usage allowances and only 14-day data retention — fine for small personal projects, not production-scale observability. Pro replaces flat limits with a $19/mo platform fee plus metered usage per product, so real monthly cost depends heavily on data volume rather than a single flat number.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Unified dashboards across metrics, logs, and traces",
      "Huge library of data source plugins (Prometheus, cloud providers, databases, etc.)",
      "Built on the open-source Grafana project (also self-hostable for free)",
      "Alerting across all connected data sources",
      "Synthetic monitoring and load testing (k6) add-ons",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for engineering and ops teams that need unified dashboards across metrics/logs/traces from many sources — squarely an observability-flavored BI tool rather than a business-metrics dashboard product, and real cost is usage-driven rather than a flat per-seat number.",
    bestFor: [
      "Engineering/DevOps teams building unified observability dashboards",
      "Teams already using the open-source Grafana/Prometheus stack who want a managed cloud option",
    ],
    avoidIf: [
      "You want simple, predictable flat pricing rather than metered usage across multiple products",
      "You need business-user-friendly BI (revenue, marketing, sales dashboards) rather than technical/infrastructure metrics",
    ],
    pros: [
      "Extremely broad data source plugin ecosystem, especially for infrastructure/technical metrics",
      "Free, fully-featured self-hosted open-source option exists outside Grafana Cloud entirely",
      "Unifies metrics, logs, and traces in one dashboarding layer",
    ],
    cons: [
      "Usage-based pricing across many separately metered products makes total cost hard to predict upfront",
      "Free tier's 14-day retention is too short for meaningful historical analysis",
      "Enterprise's $25,000/year minimum commitment prices out smaller teams",
    ],

    popularityScore: 82,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://grafana.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["yaml-to-json"],
  },
];
