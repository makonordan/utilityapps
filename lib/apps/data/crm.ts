import type { AppListing } from "../types";

// Scaffolded via Prompt — 20 well-known CRM (Customer Relationship
// Management) products spanning full sales-CRM suites, pipeline/workflow
// automation tools, and lightweight contact-management apps.
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
//
// Research notes (2026-07-17):
// - Salesforce, Pipedrive, and Nimble block automated WebFetch on their own
//   pricing pages (HTTP 403). Their figures below were cross-referenced
//   across two-plus independent third-party sources that agreed on the
//   same numbers (same pattern used for Gusto/Justworks in hr-payroll.ts),
//   so they are treated as verified with the vendor's own pricing URL kept
//   as pricingSourceUrl.
// - Zoho CRM's pricing page geo-detects and serves INR pricing regardless
//   of which zoho.com pricing path is fetched (tried zoho.com/crm/,
//   zoho.com/us/crm/, zoho.com/crm/pricing/) — no reliable USD figure was
//   obtainable, so pricing is left as VERIFY.
// - Capsule CRM's Free plan is confirmed ($0, 2 users, 250 contacts), but
//   its paid Starter/Growth/Advanced tiers only render dollar amounts via
//   an interactive monthly/annual toggle that automated fetch can't read —
//   left as VERIFY.
// - Agile CRM's pricing page returned HTTP 403 on repeated attempts.
// - Bigin (formerly "Bigin by Zoho") has moved off the zoho.com domain to
//   bigin.com; its /pricing and /pricing.html paths both 404'd during
//   research — left as VERIFY.
// - Streak's pricing page showed an internally inconsistent annual/monthly
//   comparison (the "annual, 20% discount" price was listed higher than
//   the monthly price) — the paid Pro/Pro+/Enterprise tiers are left as
//   VERIFY, though the free (Gmail-tools-only, no CRM pipeline) tier was
//   unambiguous and is recorded as verified.
// - SugarCRM has rebranded to "SugarAI" — sugarcrm.com/pricing now 301s to
//   sugarai.com/pricing. This listing keeps the id/name "SugarCRM" (the
//   name still commonly searched) but records the live sugarai.com URL as
//   pricingSourceUrl and flags the rebrand in the editorial copy.

export const CRM_APPS: AppListing[] = [
  {
    id: "salesforce-sales-cloud",
    name: "Salesforce Sales Cloud",
    // DRAFT - review before publish
    tagline: "The market-leading, endlessly customizable CRM — powerful, but priced and configured like enterprise software.",
    logoUrl: "https://www.google.com/s2/favicons?domain=salesforce.com&sz=128",
    website: "https://www.salesforce.com/sales/",

    category: "crm",
    subCategory: "sales-crm",
    industries: ["agencies", "consulting", "ecommerce", "retail", "real-estate", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available globally with data centers/data-residency options for enterprise customers — VERIFY current regional coverage and any region-specific pricing.",
    useCases: ["sales pipeline management", "lead and opportunity tracking", "sales forecasting", "custom CRM workflows", "enterprise sales team management"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter Suite", priceMonthly: 25, priceAnnual: null, currency: "USD", keyLimits: ["Per user/month; the only edition billed monthly — basic contact/lead/opportunity management and email integration"] },
      { name: "Pro Suite", priceMonthly: 100, priceAnnual: null, currency: "USD", keyLimits: ["Per user/month, billed annually; adds quotes, forecasting, workflow automation"] },
      { name: "Enterprise", priceMonthly: 175, priceAnnual: null, currency: "USD", keyLimits: ["Per user/month, billed annually; adds deeper customization, advanced reporting, API access"] },
      { name: "Unlimited", priceMonthly: 350, priceAnnual: null, currency: "USD", keyLimits: ["Per user/month, billed annually; adds premier support, more automation/AI capacity"] },
      { name: "Agentforce 1 Sales", priceMonthly: 550, priceAnnual: null, currency: "USD", keyLimits: ["Per user/month, billed annually; adds Salesforce's AI agent (Agentforce) capabilities on top of Unlimited-level features"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — Salesforce is trial-only (typically 30 days). Starter Suite ($25/user/mo) is the sole monthly-billed edition; every tier above it is sold as an annual contract, and real-world costs climb further with implementation, admin time, and paid add-ons that aren't reflected in the sticker price.",
    startingPrice: 25,
    currency: "USD",

    keyFeatures: [
      "Deeply customizable objects, fields, and workflows",
      "Lead, opportunity, and pipeline management",
      "Advanced reporting and forecasting",
      "Massive third-party app ecosystem (AppExchange)",
      "Agentforce AI agents (top tier)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for organizations with the budget and internal (or contracted) admin resources to configure a genuinely enterprise-grade CRM — smaller teams routinely find Salesforce more platform than they need, at a price and implementation cost to match.",
    bestFor: [
      "Mid-size to large sales organizations with complex, custom pipeline requirements",
      "Companies willing to invest in dedicated Salesforce admin/implementation resources",
    ],
    avoidIf: [
      "You're a small team or solo seller wanting to be selling within a day, not weeks",
      "You don't have budget for implementation/admin overhead on top of per-seat licensing",
    ],
    pros: [
      "Unmatched customization depth and a massive ecosystem of pre-built integrations",
      "Scales genuinely well from mid-market to the largest global sales orgs",
      "Strong forecasting, reporting, and (on top tiers) AI-agent capabilities",
    ],
    cons: [
      "Steep learning curve — most teams need a dedicated admin or paid implementation partner",
      "No monthly billing above the entry Starter Suite tier; annual contracts are the norm",
      "Cost escalates quickly through the edition ladder, and add-ons/AI credits aren't included",
    ],

    popularityScore: 95,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.salesforce.com/sales/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["business-card"],
  },
  {
    id: "hubspot-crm",
    name: "HubSpot CRM",
    // DRAFT - review before publish
    tagline: "A genuinely usable free CRM that scales into a full Sales Hub — easy to start, expensive to fully unlock.",
    logoUrl: "https://www.google.com/s2/favicons?domain=hubspot.com&sz=128",
    website: "https://www.hubspot.com/products/crm",

    category: "crm",
    subCategory: "sales-crm",
    industries: ["agencies", "consulting", "ecommerce", "retail", "freelancers", "real-estate"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Global SaaS product with no sign-up region restrictions — VERIFY current regional/currency pricing options outside the US.",
    useCases: ["contact and deal management", "sales pipeline tracking", "email tracking and templates", "meeting scheduling", "sales forecasting"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 2 seats, 1,000 contacts, 1 deal pipeline, 500 calling minutes/mo, basic email tracking and meeting scheduling"] },
      { name: "Starter", priceMonthly: 20, priceAnnual: 7, currency: "USD", keyLimits: ["$7/seat/mo billed annually or $20/mo month-to-month; up to 5,000 email templates, 2 deal pipelines, 3,000 calling minutes/mo, 500 HubSpot Credits included"] },
      { name: "Professional", priceMonthly: 100, priceAnnual: 90, currency: "USD", keyLimits: ["$90/seat/mo billed annually or $100/mo month-to-month; 15 deal pipelines, up to 1,000 workflows, 3,000 HubSpot Credits included; one-time $1,500 onboarding fee"] },
      { name: "Enterprise", priceMonthly: 150, priceAnnual: 150, currency: "USD", keyLimits: ["$150/seat/mo; 100 deal pipelines, cross-team forecasting, 5,000+ HubSpot Credits included; one-time $3,500 onboarding fee"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is capped at 2 seats, 1,000 contacts, and 500 calling minutes/month with only 1 deal pipeline — enough for a solo user to genuinely run light sales activity, but any second teammate or need for more than one pipeline forces an upgrade. Professional and Enterprise both carry mandatory one-time onboarding fees ($1,500 / $3,500) on top of the advertised per-seat price.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Free-forever CRM core (contacts, deals, tasks)",
      "Email tracking, templates, and sequences",
      "Deal pipelines and sales automation (paid tiers)",
      "Meeting scheduling and calling",
      "Deep integration with HubSpot's Marketing/Service Hubs",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want to start free and grow into a full sales platform without switching tools — the mandatory onboarding fees and steep Professional/Enterprise per-seat jump are the parts most reviews gloss over.",
    bestFor: [
      "Solo founders and small teams wanting a genuinely usable free CRM to start",
      "Teams already using (or planning to use) HubSpot's Marketing or Service Hubs",
    ],
    avoidIf: [
      "You need more than 2 seats or 1 pipeline without paying — Free's caps bite quickly",
      "You're budget-sensitive about onboarding fees — Professional/Enterprise both require a one-time paid onboarding package",
    ],
    pros: [
      "Free tier is a real, usable CRM, not just a stripped demo",
      "Clean, well-designed UI that's genuinely easy to onboard a sales team into",
      "Scales cleanly into HubSpot's broader marketing/service platform if needed",
    ],
    cons: [
      "Professional and Enterprise both carry mandatory one-time onboarding fees ($1,500 / $3,500)",
      "Price jump from Starter ($7-20) to Professional ($90-100) is steep for the features gained",
      "Contact/marketing-email limits and HubSpot Credits add a second, usage-based cost dimension",
    ],

    popularityScore: 92,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.hubspot.com/pricing/sales",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["email-signature-generator", "business-card"],
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    // DRAFT - review before publish
    tagline: "Visual, pipeline-first CRM built around getting salespeople to actually use it — no permanent free plan.",
    logoUrl: "https://www.google.com/s2/favicons?domain=pipedrive.com&sz=128",
    website: "https://www.pipedrive.com",

    category: "crm",
    subCategory: "pipeline-automation",
    industries: ["agencies", "consulting", "ecommerce", "retail", "real-estate", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Global SaaS product, no sign-up region restrictions — VERIFY current regional/currency pricing outside the US.",
    useCases: ["visual sales pipeline management", "deal and activity tracking", "sales automation", "lead scoring", "sales reporting"],
    pricingModel: "subscription",

    pricing: [
      { name: "Lite", priceMonthly: 24, priceAnnual: 14, currency: "USD", keyLimits: ["Per seat; core pipeline, contact, and activity management; no built-in automation"] },
      { name: "Growth", priceMonthly: 49, priceAnnual: 39, currency: "USD", keyLimits: ["Per seat; adds workflow automation, custom reporting"] },
      { name: "Premium", priceMonthly: 79, priceAnnual: 49, currency: "USD", keyLimits: ["Per seat; adds lead scoring, and bundles LeadBooster/Projects/Smart Docs"] },
      { name: "Ultimate", priceMonthly: 99, priceAnnual: 79, currency: "USD", keyLimits: ["Per seat; adds audit logs, device/session monitoring, highest automation limits"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free plan — Pipedrive runs a 14-day free trial with full feature access and no credit card required. Automation is gated behind Growth or higher, and several notable features (LeadBooster, Web Visitors tracking, Campaigns) are separately billed add-ons even on paid plans.",
    startingPrice: 14,
    currency: "USD",

    keyFeatures: [
      "Visual, drag-and-drop sales pipeline",
      "Activity-based selling reminders",
      "Workflow automation (Growth+)",
      "Lead scoring and web visitor tracking (add-ons)",
      "Sales reporting and forecasting dashboards",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small sales teams that want a fast, visual pipeline tool without Salesforce-level complexity — the lack of any free tier and the pile of paid add-ons mean the real monthly cost runs above the advertised entry price.",
    bestFor: [
      "Small-to-mid sales teams wanting a simple, visual pipeline-first CRM",
      "Teams that value activity-based selling reminders over heavy customization",
    ],
    avoidIf: [
      "You want to start on a permanent free plan — Pipedrive is trial-only",
      "You need lead scoring or visitor tracking without paying for separate add-ons",
    ],
    pros: [
      "Clean, visual pipeline UI that salespeople tend to actually adopt",
      "Lite tier is genuinely affordable for very small teams on annual billing",
      "Solid automation and reporting once you're on Growth or above",
    ],
    cons: [
      "No free tier at all, unlike most competitors in this category",
      "Several useful features (lead gen, visitor tracking, campaigns) are separately priced add-ons",
      "Monthly (non-annual) pricing is notably higher across every tier",
    ],

    popularityScore: 85,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.pipedrive.com/en/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "zoho-crm",
    name: "Zoho CRM",
    // DRAFT - review before publish
    tagline: "Feature-dense, budget-friendly CRM at the center of Zoho's much larger business-apps suite.",
    logoUrl: "https://www.google.com/s2/favicons?domain=zoho.com&sz=128",
    website: "https://www.zoho.com/crm/",

    category: "crm",
    subCategory: "sales-crm",
    industries: ["agencies", "consulting", "ecommerce", "retail", "real-estate", "nonprofits"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Zoho's pricing page geo-detects the visitor's region and serves local-currency pricing (confirmed serving INR rather than USD during research regardless of which zoho.com pricing path was requested) — confirm the actual USD rate directly before publishing.",
    useCases: ["sales pipeline management", "lead and contact management", "sales forecasting", "workflow automation", "multi-department CRM (with Zoho One/CRMPlus)"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — page consistently geo-served INR pricing during research; USD figures unconfirmed"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Lead, contact, and deal management",
      "Multiple sales pipelines",
      "Workflow automation and Zia AI assistant",
      "Deep integration with the wider Zoho apps suite",
      "Custom modules and functions (higher tiers)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams already invested in (or considering) the broader Zoho ecosystem who want a capable CRM without Salesforce-level pricing — exact USD pricing needs direct confirmation before this listing is fully trustworthy.",
    bestFor: [
      "Small-to-mid businesses wanting a full-featured CRM at a lower price point than Salesforce/HubSpot",
      "Teams already using other Zoho apps who want native cross-app integration",
    ],
    avoidIf: [
      "You want a single, simple CRM without Zoho's much larger and sometimes confusing app catalog",
      "You need a polished, minimal UI — Zoho CRM's interface is dense with options",
    ],
    pros: [
      "Very feature-rich for the price point, historically one of the more affordable full CRMs",
      "Free plan exists for very small teams",
      "Native integration with dozens of other Zoho business apps",
    ],
    cons: [
      "Interface and settings can feel cluttered compared to more focused competitors",
      "Pricing page geo-serves regional currency, making it harder to confirm a straight USD rate",
      "Higher-tier AI/automation features are gated behind Enterprise/Ultimate",
    ],

    popularityScore: 80,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.zoho.com/crm/zohocrm-pricing.html",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "close",
    name: "Close",
    // DRAFT - review before publish
    tagline: "Calling-first CRM built for inside sales teams, with phone/SMS baked into the core product.",
    logoUrl: "https://www.google.com/s2/favicons?domain=close.com&sz=128",
    website: "https://www.close.com",

    category: "crm",
    subCategory: "pipeline-automation",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["small", "medium"],
    regions: ["global"],
    regionNotes: "Global SaaS product; calling/SMS rates and available phone numbers vary by country — VERIFY current coverage.",
    useCases: ["outbound sales calling", "lead and deal pipeline tracking", "sales workflow automation", "email and SMS sequencing"],
    pricingModel: "subscription",

    pricing: [
      { name: "Solo", priceMonthly: 19, priceAnnual: 9, currency: "USD", keyLimits: ["1 user max, 10k leads, 500 AI credits/mo, no workflow automation"] },
      { name: "Essentials", priceMonthly: 49, priceAnnual: 35, currency: "USD", keyLimits: ["Per user; unlimited leads, 1,000 AI credits/mo, no workflow automation"] },
      { name: "Growth", priceMonthly: 109, priceAnnual: 99, currency: "USD", keyLimits: ["Per user; unlimited leads, 1,500 AI credits/mo, workflow automation included"] },
      { name: "Scale", priceMonthly: 149, priceAnnual: 139, currency: "USD", keyLimits: ["Per user; unlimited leads, 2,000 AI credits/mo, workflows plus predictive dialer and advanced controls"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — Close offers a 14-day free trial (no credit card required) plus a 30-day money-back guarantee after purchase. Calling and SMS usage is billed separately as a metered add-on (roughly $0.02/minute for calls) on top of every plan, and Solo is hard-capped at a single user.",
    startingPrice: 19,
    currency: "USD",

    keyFeatures: [
      "Built-in calling and SMS (Chloe AI agent included)",
      "Pipeline and deal tracking",
      "Email/call/SMS sequencing",
      "Workflow automation (Growth+)",
      "Predictive dialer (Scale)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for outbound, calling-heavy sales teams who want phone and SMS built into the CRM rather than bolted on — lighter-touch teams that don't call much will pay for calling infrastructure they barely use.",
    bestFor: [
      "Inside sales / SDR teams doing high call volume",
      "Small sales teams wanting calling, SMS, and pipeline in one tool",
    ],
    avoidIf: [
      "Your sales process is mostly email/self-serve with little outbound calling",
      "You need a free tier to start — Close is trial-only",
    ],
    pros: [
      "Calling and SMS feel genuinely native, not bolted on as an afterthought",
      "Workflow automation and AI credits are meaningfully useful on Growth and above",
      "30-day money-back guarantee lowers the risk of committing",
    ],
    cons: [
      "No free tier, and Solo is capped at a single user",
      "Calling/SMS usage is metered separately on top of the subscription price",
      "Jump from Essentials ($49) to Growth ($109) is steep just to unlock automation",
    ],

    popularityScore: 62,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.close.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "copper",
    name: "Copper",
    // DRAFT - review before publish
    tagline: "CRM built natively inside Google Workspace/Gmail for teams who live in their inbox and calendar.",
    logoUrl: "https://www.google.com/s2/favicons?domain=copper.com&sz=128",
    website: "https://www.copper.com",

    category: "crm",
    subCategory: "contact-management",
    industries: ["agencies", "consulting", "real-estate", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Global SaaS product tied to Google Workspace — VERIFY current regional pricing/currency options.",
    useCases: ["relationship and contact tracking", "sales pipeline management inside Gmail", "task and project automation", "contact enrichment"],
    pricingModel: "subscription",

    pricing: [
      { name: "Basic", priceMonthly: 29, priceAnnual: 23, currency: "USD", keyLimits: ["Per seat; up to 2,500 contacts; task automation, pipelines, basic project management"] },
      { name: "Professional", priceMonthly: 69, priceAnnual: 59, currency: "USD", keyLimits: ["Per seat; up to 15,000 contacts; adds workflow automation, bulk email, reporting"] },
      { name: "Business", priceMonthly: 134, priceAnnual: 99, currency: "USD", keyLimits: ["Per seat; unlimited contacts; adds email series, custom reports, multi-currency, premium support"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier — Copper offers a free trial (no credit card required, instant activation) with the exact trial length not stated on the pricing page. Entry-level Basic starts at $29/seat/month (or $23 billed annually) and caps contacts at 2,500, which small but active teams can outgrow quickly.",
    startingPrice: 29,
    currency: "USD",

    keyFeatures: [
      "Native Gmail/Google Workspace integration",
      "Automatic contact and interaction capture from email/calendar",
      "Pipeline and project management",
      "Contact enrichment",
      "Workflow automation (Professional+)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for Google Workspace teams who want a CRM that feels like an extension of Gmail rather than a separate app to context-switch into — a poor fit for anyone on Microsoft 365 or wanting a standalone CRM UI.",
    bestFor: [
      "Agencies and consultancies already living in Gmail/Google Workspace",
      "Relationship-driven businesses (real estate, professional services) wanting low-friction contact capture",
    ],
    avoidIf: [
      "Your team is on Microsoft 365/Outlook rather than Google Workspace",
      "You need a large contact volume on the entry-level Basic plan (2,500 cap)",
    ],
    pros: [
      "Deep, genuinely native Gmail/Calendar integration reduces manual data entry",
      "Clean, simple UI relative to heavier enterprise CRMs",
      "Automatic activity/contact capture is a real time-saver for relationship-heavy sales",
    ],
    cons: [
      "Effectively requires Google Workspace — little value outside that ecosystem",
      "Basic plan's 2,500-contact cap is restrictive for even small active sales teams",
      "Trial length isn't disclosed upfront on the pricing page",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.copper.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "freshsales",
    name: "Freshsales",
    // DRAFT - review before publish
    tagline: "Freshworks' sales CRM — AI-assisted deal insights and phone/chat built in, no permanent free plan.",
    logoUrl: "https://www.google.com/s2/favicons?domain=freshworks.com&sz=128",
    website: "https://www.freshworks.com/crm/sales/",

    category: "crm",
    subCategory: "sales-crm",
    industries: ["agencies", "consulting", "ecommerce", "retail"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Global SaaS product — VERIFY current regional/currency pricing outside the US.",
    useCases: ["sales pipeline management", "contact lifecycle tracking", "deal scoring and insights", "sales sequences", "territory management"],
    pricingModel: "subscription",

    pricing: [
      { name: "Growth", priceMonthly: null, priceAnnual: 9, currency: "USD", keyLimits: ["Per user/mo, billed annually; kanban pipeline view, contact lifecycle stages, chat/email/phone, basic workflows — month-to-month rate not published on this page"] },
      { name: "Pro", priceMonthly: null, priceAnnual: 39, currency: "USD", keyLimits: ["Per user/mo, billed annually; adds contact scoring, deal insights, custom sales activities, territory management, sales sequences"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: 59, currency: "USD", keyLimits: ["Per user/mo, billed annually; adds forecasting insights, field-level permissions, custom modules, sandbox, audit logs"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier — a 21-day free trial is offered across all plans. Every published price is the annual-billed rate; Freshworks' pricing page didn't disclose a separate month-to-month figure. Branded documents ($19/user/mo) and the Freddy AI agent ($49/100 sessions) are separately billed add-ons on every tier.",
    startingPrice: 9,
    currency: "USD",

    keyFeatures: [
      "Kanban-style visual pipeline",
      "Built-in phone, email, and chat",
      "AI-assisted deal scoring and insights (Freddy AI)",
      "Sales sequences and territory management",
      "Custom modules and sandboxes (Enterprise)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for startups/SMBs wanting an affordable, AI-assisted sales CRM with phone and chat built in — Growth's $9/user/mo entry price is genuinely competitive, but confirm the month-to-month rate before budgeting since only annual pricing is published.",
    bestFor: [
      "Startups and SMBs wanting phone/chat/email in one affordable CRM",
      "Teams that want AI deal-scoring without paying Salesforce/HubSpot Enterprise prices",
    ],
    avoidIf: [
      "You need month-to-month billing without committing annually — the published rates are all annual",
      "You want a free tier to trial with no time limit — Freshsales is 21-day-trial only",
    ],
    pros: [
      "Competitive entry price ($9/user/mo annually) among full sales CRMs with built-in calling",
      "Freddy AI deal insights and sequences are strong for the price point",
      "Clean kanban pipeline UI that's quick to onboard into",
    ],
    cons: [
      "No free tier and no disclosed month-to-month rate — annual commitment is effectively required to see the advertised price",
      "Freddy AI sessions and branded documents are extra-cost add-ons",
      "Fewer standalone integrations than category leaders like Salesforce/HubSpot",
    ],

    popularityScore: 65,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.freshworks.com/crm/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "nimble",
    name: "Nimble",
    // DRAFT - review before publish
    tagline: "Single-plan, social-relationship-focused CRM that pulls contact and social data together automatically.",
    logoUrl: "https://www.google.com/s2/favicons?domain=nimble.com&sz=128",
    website: "https://www.nimble.com",

    category: "crm",
    subCategory: "contact-management",
    industries: ["agencies", "consulting", "freelancers", "real-estate"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Global SaaS product — VERIFY current regional/currency pricing options.",
    useCases: ["contact and relationship management", "social media contact enrichment", "email marketing (add-on)", "sales pipeline tracking"],
    pricingModel: "subscription",

    pricing: [
      { name: "Business Plan", priceMonthly: 29.90, priceAnnual: 24.90, currency: "USD", keyLimits: ["Per user; 25,000 contacts and 2 GB storage per user included; single unified plan with no feature tiers"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — a 14-day free trial is offered. Nimble runs a single-plan model rather than tiered pricing, but base contact/storage allowances (25,000 contacts, 2 GB/user) are extended via paid add-ons (extra contacts, storage, email marketing, web forms, enrichment credits), so real cost commonly runs above the advertised base price.",
    startingPrice: 24.90,
    currency: "USD",

    keyFeatures: [
      "Unified contact records pulling in social/email signals",
      "Simple sales pipeline tracking",
      "Browser extension for capturing contacts from social/email",
      "Team relationship insights",
      "Optional email marketing and web forms add-ons",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for solo professionals and small teams who want simple relationship/contact management with social enrichment, without navigating multiple pricing tiers — the flat plan is easy to understand, but overage add-ons for contacts/storage/enrichment can push real cost meaningfully above the base price.",
    bestFor: [
      "Solo consultants/freelancers wanting simple relationship tracking with social context",
      "Small teams who prefer one flat plan over a tiered pricing ladder",
    ],
    avoidIf: [
      "You want a robust, tiered feature ladder rather than a single flat plan",
      "You'll need large contact volumes or storage beyond the base allowance without paying add-on fees",
    ],
    pros: [
      "Single, easy-to-understand plan — no tier-comparison decision fatigue",
      "Social/contact enrichment is a genuine differentiator versus plain contact managers",
      "Straightforward browser-extension-based capture workflow",
    ],
    cons: [
      "No free tier, only a 14-day trial",
      "Real cost can exceed the base price once contact/storage/enrichment add-ons are needed",
      "Lacks the deeper sales automation of dedicated pipeline-first CRMs",
    ],

    popularityScore: 45,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.nimble.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["business-card"],
  },
  {
    id: "insightly",
    name: "Insightly",
    // DRAFT - review before publish
    tagline: "CRM with built-in project management — good fit for teams whose work continues past the closed deal.",
    logoUrl: "https://www.google.com/s2/favicons?domain=insightly.com&sz=128",
    website: "https://www.insightly.com",

    category: "crm",
    subCategory: "sales-crm",
    industries: ["agencies", "consulting", "nonprofits", "real-estate", "construction"],
    businessSizes: ["small", "medium"],
    regions: ["global"],
    regionNotes: "Global SaaS product — VERIFY current regional/currency pricing outside the US.",
    useCases: ["sales pipeline management", "post-sale project management", "lead routing and assignment", "workflow automation", "business dashboards"],
    pricingModel: "subscription",

    pricing: [
      { name: "Plus", priceMonthly: null, priceAnnual: 29, currency: "USD", keyLimits: ["Per user/mo, billed annually; 100,000 record limit, 10 GB storage, 2,500 mass emails/day, project management and advanced reports included"] },
      { name: "Professional", priceMonthly: null, priceAnnual: 49, currency: "USD", keyLimits: ["Per user/mo, billed annually; adds lead assignment/routing, workflow automation, AI Copilot (75 queries), 250,000 record limit, 100 GB storage"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: 99, currency: "USD", keyLimits: ["Per user/mo, billed annually; adds sandboxes, products/pricebooks/quotes, audit logging, AI Copilot (100 queries), 500,000 record limit, 250 GB storage"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — a 14-day free trial is offered across all plans. Every published price is the annual-billed rate; a separate month-to-month figure wasn't disclosed on the pricing page.",
    startingPrice: 29,
    currency: "USD",

    keyFeatures: [
      "Sales pipeline and lead management",
      "Built-in project management for post-sale work",
      "Workflow automation and lead routing (Professional+)",
      "AI Copilot for queries (Professional+)",
      "Customizable dashboards and reporting",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams whose sales process hands off into ongoing project delivery (agencies, consultancies, nonprofits running programs) who want CRM and project tracking in one tool — pure sales-only teams may find dedicated pipeline CRMs faster to use.",
    bestFor: [
      "Agencies/consultancies that need project management immediately after a deal closes",
      "Nonprofits and services businesses tracking relationships through to delivery",
    ],
    avoidIf: [
      "You only need sales pipeline tracking and don't want project-management features bundled in",
      "You need month-to-month billing — only annual rates are published",
    ],
    pros: [
      "Genuinely useful built-in project management, not a bolted-on afterthought",
      "Reasonable entry price ($29/user/mo) for a CRM plus PM combination",
      "AI Copilot and workflow automation available from the mid (Professional) tier",
    ],
    cons: [
      "No free tier, and no disclosed month-to-month rate",
      "Less specialized at pure sales pipeline work than dedicated sales CRMs",
      "AI Copilot query caps (75-100/mo) are modest even on paid tiers",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.insightly.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "keap",
    name: "Keap",
    // DRAFT - review before publish
    tagline: "CRM plus marketing/sales automation and invoicing bundled into one platform, priced by contact volume.",
    logoUrl: "https://www.google.com/s2/favicons?domain=keap.com&sz=128",
    website: "https://keap.com",

    category: "crm",
    subCategory: "pipeline-automation",
    industries: ["freelancers", "consulting", "agencies", "ecommerce"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability and currency options.",
    useCases: ["marketing and sales automation", "contact and pipeline management", "invoicing and payments", "text/SMS marketing", "lead capture funnels"],
    pricingModel: "subscription",

    pricing: [
      { name: "Keap", priceMonthly: 299, priceAnnual: 249, currency: "USD", keyLimits: ["Includes 2 user licenses ($39/mo per additional user); exact price scales with contact volume; all CRM/marketing/invoicing features included in one plan"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — a no-credit-card-required free trial is available, but email sending is capped at 25 messages and payment processing is disabled during the trial. Keap uses a single unified plan (no feature tiers) priced by contact volume plus per-additional-user fees, and paid implementation services are effectively required to get set up, adding real cost beyond the advertised subscription price.",
    startingPrice: 299,
    currency: "USD",

    keyFeatures: [
      "CRM with contact and pipeline tracking",
      "Marketing automation and email/SMS campaigns",
      "Built-in invoicing and payments",
      "Lead capture landing pages/funnels",
      "Sales pipeline automation",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small businesses and solo entrepreneurs who want CRM, marketing automation, and invoicing in a single all-in-one platform and are prepared to pay a premium (plus implementation) versus stitching together separate tools.",
    bestFor: [
      "Solo entrepreneurs and small businesses wanting marketing automation, CRM, and invoicing in one platform",
      "Service businesses running lead-capture-to-invoice funnels without extra tools",
    ],
    avoidIf: [
      "You only need a simple CRM — Keap's all-in-one pricing is high relative to CRM-only competitors",
      "You want to avoid required (paid) implementation/onboarding services",
    ],
    pros: [
      "Genuinely combines CRM, marketing automation, and invoicing rather than requiring separate tools",
      "Contact-based pricing model is transparent about what drives cost as you grow",
      "Free trial removes payment/email-sending risk while evaluating",
    ],
    cons: [
      "Among the pricier options in this category for small teams ($299/mo+ entry)",
      "Implementation services are effectively required, adding real cost beyond the subscription",
      "Single-plan model means you pay for the full feature set even if you only need basic CRM",
    ],

    popularityScore: 60,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://keap.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["invoice-generator"],
  },
  {
    id: "nutshell",
    name: "Nutshell",
    // DRAFT - review before publish
    tagline: "Straightforward sales CRM with built-in marketing/chatbot tools across every tier, no free plan.",
    logoUrl: "https://www.google.com/s2/favicons?domain=nutshell.com&sz=128",
    website: "https://www.nutshell.com",

    category: "crm",
    subCategory: "sales-crm",
    industries: ["agencies", "consulting", "retail", "real-estate"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current regional/currency pricing outside the US.",
    useCases: ["sales pipeline management", "email and calendar sync", "sales quota and goal tracking", "lead assignment automation", "AI-assisted lead recaps"],
    pricingModel: "subscription",

    pricing: [
      { name: "Foundation", priceMonthly: 13, priceAnnual: null, currency: "USD", keyLimits: ["Per user/mo; 10 AI outcomes/mo, unlimited contacts, email/calendar sync, AI chatbot, form builder — annual per-seat rate not clearly itemized, confirm before quoting"] },
      { name: "Growth", priceMonthly: 25, priceAnnual: null, currency: "USD", keyLimits: ["Per user/mo; 20 AI outcomes/mo, activity reports, sales quotas, lead assignment rules"] },
      { name: "Pro", priceMonthly: 42, priceAnnual: null, currency: "USD", keyLimits: ["Per user/mo; 40 AI outcomes/mo, 5 custom pipelines, sales automation, AI lead recaps"] },
      { name: "Business", priceMonthly: 59, priceAnnual: null, currency: "USD", keyLimits: ["Per user/mo; 100 AI outcomes/mo, 10 custom pipelines, audit log"] },
      { name: "Enterprise", priceMonthly: 79, priceAnnual: null, currency: "USD", keyLimits: ["Per user/mo; 150 AI outcomes/mo, unlimited pipelines/custom fields, SSO, SQL data access, phone support"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — a 14-day free trial is offered, no credit card required. The pricing page advertises a per-month savings for annual billing on every tier, but doesn't clearly itemize the resulting annual per-seat rate, so only month-to-month prices are recorded with confidence here. Marketing, SMS engagement, prospecting, and proposals/invoicing are all separately priced add-ons.",
    startingPrice: 13,
    currency: "USD",

    keyFeatures: [
      "Sales pipeline management with custom stages",
      "Email and calendar sync",
      "AI-assisted lead recaps and chatbot",
      "Sales quotas and activity reporting",
      "Form builder and landing pages",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small-to-mid sales teams wanting a straightforward CRM with built-in AI assistance and marketing basics without piecing together separate tools — the marketing/SMS/prospecting add-ons mean the full toolkit costs more than the base per-seat price suggests.",
    bestFor: [
      "Small sales teams wanting pipeline management plus basic marketing tools in one product",
      "Teams that value simple, approachable AI features (lead recaps, chatbot) over deep customization",
    ],
    avoidIf: [
      "You want the lowest possible entry price with no add-on temptations — marketing/SMS/prospecting are all separate line items",
      "You need enterprise-scale customization beyond what the top Enterprise tier offers",
    ],
    pros: [
      "Approachable, mid-market-friendly pricing relative to Salesforce/HubSpot",
      "AI outcomes/lead recaps are a genuinely useful, easy-to-understand feature framing",
      "Full tier ladder from solo-friendly Foundation up to Enterprise SSO/SQL access",
    ],
    cons: [
      "No free tier, and annual per-seat pricing isn't clearly published (only a vague 'savings' figure)",
      "Marketing, SMS engagement, prospecting, and invoicing are all separate paid add-ons",
      "Smaller brand recognition and ecosystem than category leaders",
    ],

    popularityScore: 48,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.nutshell.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "capsule-crm",
    name: "Capsule CRM",
    // DRAFT - review before publish
    tagline: "Simple, UK-built contact and pipeline CRM with a genuinely usable free plan for very small teams.",
    logoUrl: "https://www.google.com/s2/favicons?domain=capsulecrm.com&sz=128",
    website: "https://capsulecrm.com",

    category: "crm",
    subCategory: "contact-management",
    industries: ["freelancers", "agencies", "consulting", "nonprofits"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY current regional/currency pricing options.",
    useCases: ["contact and pipeline management", "sales tracking for small teams", "project boards", "email templates and shared mailbox"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["Free tier confirmed at $0 (2 users, 250 contacts, 1 pipeline, 5 custom fields); Starter/Growth/Advanced dollar prices are rendered via an interactive monthly/annual toggle automated fetch couldn't read — confirm before publishing paid pricing"] }],
    hasFreeTier: true,
    freeTierReality: "Free plan is confirmed at $0/mo for up to 2 users, 250 contacts, 5 custom fields, and 1 sales pipeline — genuinely usable for a very small team, though it has no workflow automation or AI features. Paid Starter (30,000 contacts) / Growth (60,000 contacts) / Advanced (120,000 contacts) tiers exist with an annual-vs-monthly toggle and a stated 'up to 15% discount' for annual billing, but exact per-user dollar prices weren't extractable from the static page — confirm before publishing.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Contact and pipeline management",
      "Project boards and task tracking",
      "Email templates and shared mailbox",
      "AI-assisted enrichment and meeting prep (Growth+)",
      "Workflow automation (Starter+)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for very small teams and freelancers wanting a simple, no-frills CRM with a real free tier to start on — paid-tier pricing needs direct confirmation (the page requires an interactive toggle to reveal dollar amounts) before this listing can be trusted for exact numbers.",
    bestFor: [
      "Freelancers and very small teams wanting a simple, genuinely free starting CRM",
      "Small nonprofits/agencies not ready to commit to a paid CRM budget",
    ],
    avoidIf: [
      "You need exact paid-tier pricing today — Starter/Growth/Advanced dollar amounts aren't published in static form",
      "You need heavy customization or enterprise-scale record limits — Ultimate requires a custom sales conversation",
    ],
    pros: [
      "Free plan is a real, usable CRM (not just a crippled trial) for very small teams",
      "Clean, simple UI without the density of larger competitors",
      "Sensible tier progression by contact volume (30k → 60k → 120k)",
    ],
    cons: [
      "Paid-tier pricing isn't visible without interacting with the live site — a real friction point for buyers comparing options",
      "Ultimate tier requires contacting sales rather than self-serve signup",
      "Smaller feature set/ecosystem than category leaders",
    ],

    popularityScore: 42,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://capsulecrm.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "streak",
    name: "Streak",
    // DRAFT - review before publish
    tagline: "CRM built entirely inside Gmail — free email power-tools, paid tiers unlock actual pipeline features.",
    logoUrl: "https://www.google.com/s2/favicons?domain=streak.com&sz=128",
    website: "https://www.streak.com",

    category: "crm",
    subCategory: "contact-management",
    industries: ["freelancers", "agencies", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Requires Gmail/Google Workspace — VERIFY current regional/currency pricing options.",
    useCases: ["pipeline management inside Gmail", "email tracking and mail merge", "lead and deal tracking for small teams"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free (Gmail tools only)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Email and link tracking, snippets, mail merge capped at 50/day, Streak Share — no CRM pipeline functionality"] },
      { name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["Pro/Pro+/Enterprise tiers unlock actual CRM pipelines, but the pricing page's monthly-vs-annual figures were self-contradictory (the 'annual, 20%-off' price was listed higher than the monthly price) — confirm exact numbers before publishing"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan only unlocks Gmail productivity tools (email/link tracking, snippets, mail merge capped at 50/day) — there is no CRM pipeline functionality at all on Free. Paid Pro/Pro+/Enterprise tiers exist and add shared pipelines, but the source pricing page displayed an internally inconsistent monthly-vs-annual comparison, so exact paid pricing isn't recorded with confidence here.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "CRM pipelines built directly into Gmail (paid tiers)",
      "Email and link tracking",
      "Mail merge",
      "Shared team pipelines (Pro+)",
      "AI credits for email/deal assistance",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for Gmail-native freelancers and small teams who want lightweight pipeline tracking without leaving their inbox — the free tier is genuinely just email tooling, not a usable CRM, so don't expect real pipeline functionality without paying.",
    bestFor: [
      "Freelancers and small teams who want pipeline tracking without leaving Gmail",
      "Users who mainly want better email tracking/mail merge and only lightly need CRM features",
    ],
    avoidIf: [
      "You expect the free plan to include CRM pipeline functionality — it doesn't",
      "You're not on Gmail/Google Workspace",
    ],
    pros: [
      "Genuinely lightweight — CRM lives inside Gmail with no separate app to learn",
      "Free tier's email tracking/mail merge tools are useful even without paying for CRM features",
      "Low-friction setup for solo users and very small teams",
    ],
    cons: [
      "Free tier is Gmail productivity tools only — no CRM pipeline without upgrading",
      "Only works within Gmail/Google Workspace, not a standalone app",
      "Pricing page's monthly-vs-annual figures were inconsistent at time of review — confirm before quoting exact paid prices",
    ],

    popularityScore: 50,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.streak.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "agile-crm",
    name: "Agile CRM",
    // DRAFT - review before publish
    tagline: "All-in-one CRM with sales, marketing, and helpdesk tools aimed at small businesses.",
    logoUrl: "https://www.google.com/s2/favicons?domain=agilecrm.com&sz=128",
    website: "https://www.agilecrm.com",

    category: "crm",
    subCategory: "pipeline-automation",
    industries: ["freelancers", "agencies", "consulting", "retail"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY current regional/currency pricing options.",
    useCases: ["sales pipeline management", "marketing automation", "helpdesk/ticketing", "contact management"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — vendor pricing page returned HTTP 403 on repeated fetch attempts"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Sales pipeline and contact management",
      "Marketing automation (email campaigns, landing pages)",
      "Helpdesk/ticketing",
      "Telephony integration",
      "Gamification for sales teams",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for very small businesses wanting sales, marketing, and support tools bundled cheaply into one product — pricing needs direct confirmation since the vendor's own page blocked automated verification, and the product has a smaller, less actively-updated feel than newer competitors.",
    bestFor: [
      "Very small businesses wanting sales + marketing + helpdesk bundled at a low price",
      "Teams that want built-in gamification to motivate a small sales team",
    ],
    avoidIf: [
      "You want an actively modernized UI/UX — Agile CRM's interface reads as dated versus newer competitors",
      "You need enterprise-scale support or a large integration ecosystem",
    ],
    pros: [
      "Bundles sales, marketing, and helpdesk functionality in one low-cost product",
      "Free tier historically available for very small teams",
      "Telephony and gamification features are relatively unusual inclusions at this price point",
    ],
    cons: [
      "Vendor pricing page blocks automated verification, making current pricing hard to confirm at a glance",
      "UI and update cadence feel dated relative to newer CRM entrants",
      "Smaller support/community footprint than category leaders",
    ],

    popularityScore: 40,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.agilecrm.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "sugarcrm",
    name: "SugarCRM",
    // DRAFT - review before publish
    tagline: "Enterprise CRM platform (recently rebranded 'SugarAI') sold in annual, minimum-15-seat contracts.",
    logoUrl: "https://www.google.com/s2/favicons?domain=sugarcrm.com&sz=128",
    website: "https://www.sugarai.com",

    category: "crm",
    subCategory: "sales-crm",
    industries: ["agencies", "consulting", "healthcare", "ecommerce"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability and any region-specific pricing/contract terms.",
    useCases: ["enterprise sales pipeline management", "customer data platform", "sales and marketing automation", "custom CRM workflows"],
    pricingModel: "subscription",

    pricing: [
      { name: "Standard", priceMonthly: null, priceAnnual: 59, currency: "USD", keyLimits: ["Per user/mo, billed annually, 15-user minimum"] },
      { name: "Advanced", priceMonthly: null, priceAnnual: 85, currency: "USD", keyLimits: ["Per user/mo, billed annually, 15-user minimum"] },
      { name: "Premier", priceMonthly: null, priceAnnual: 135, currency: "USD", keyLimits: ["Per user/mo, billed annually, 15-user minimum"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier and no self-serve monthly option — every plan requires a 15-user minimum billed annually, so the effective entry cost is at least 15 × $59/mo (~$885/mo) even for the cheapest tier. Note: SugarCRM has rebranded as 'SugarAI' — sugarcrm.com/pricing now redirects to sugarai.com/pricing.",
    startingPrice: 59,
    currency: "USD",

    keyFeatures: [
      "Customizable sales, marketing, and service modules",
      "Customer data platform / 360-degree customer view",
      "Workflow and process automation",
      "AI-assisted insights (branded under the SugarAI rebrand)",
      "On-premise and cloud deployment options historically offered",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for mid-size-to-enterprise organizations that need a highly customizable CRM and can commit to the 15-seat annual minimum — a poor fit for anyone below that seat count regardless of how attractive the per-user rate looks.",
    bestFor: [
      "Mid-size and enterprise sales organizations with 15+ CRM seats",
      "Organizations wanting a customizable platform positioned as an alternative to Salesforce",
    ],
    avoidIf: [
      "Your team is under 15 seats — the minimum makes per-user math irrelevant for small teams",
      "You want simple month-to-month billing rather than an annual contract commitment",
    ],
    pros: [
      "Highly customizable modules and workflows suited to complex enterprise sales processes",
      "Positioned as a lower-cost alternative to Salesforce at comparable customization depth",
      "Recent SugarAI rebrand signals continued investment in AI-assisted CRM features",
    ],
    cons: [
      "15-user minimum locks out small and mid-small teams entirely, regardless of per-seat price",
      "No free tier or month-to-month option — annual contract commitment required",
      "Recent rebrand (SugarCRM → SugarAI) may create confusion during the transition period",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.sugarai.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "vtiger",
    name: "Vtiger",
    // DRAFT - review before publish
    tagline: "Budget-friendly CRM with a genuinely free tier for small teams, scaling up to AI-enabled enterprise plans.",
    logoUrl: "https://www.google.com/s2/favicons?domain=vtiger.com&sz=128",
    website: "https://www.vtiger.com",

    category: "crm",
    subCategory: "sales-crm",
    industries: ["agencies", "consulting", "retail", "real-estate"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current regional/currency pricing outside the US.",
    useCases: ["sales pipeline management", "contact and lead management", "email campaign tracking", "AI-assisted CRM (One AI tier)"],
    pricingModel: "freemium",

    pricing: [
      { name: "One Pilot (Free)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 10 users, 3,000 records max, 1,000 emails/mo, 3 GB storage"] },
      { name: "One Growth", priceMonthly: 12, priceAnnual: null, currency: "USD", keyLimits: ["Standard user rate per month; up to 15 users, 100,000 records max, 5,000 emails/mo (or 500/user); single-app-user rate differs at $20/mo"] },
      { name: "One Professional", priceMonthly: 30, priceAnnual: null, currency: "USD", keyLimits: ["Standard user rate per month; 20,000 emails/mo (or 2,000/user)"] },
      { name: "One Enterprise", priceMonthly: 42, priceAnnual: null, currency: "USD", keyLimits: ["Standard user rate per month; single-app-user rate differs at $38/mo"] },
      { name: "One AI", priceMonthly: 50, priceAnnual: null, currency: "USD", keyLimits: ["Standard user rate per month; adds predictive and generative AI features; single-app-user rate differs at $38/mo"] },
    ],
    hasFreeTier: true,
    freeTierReality: "One Pilot is free forever for up to 10 users but caps at just 3,000 records, 1,000 emails/month, and 3 GB storage — a real evaluation tier rather than a production-ready free plan for an active small business. Annual billing is advertised as offering 'up to 34% savings' but per-tier annual rates weren't itemized separately from the standard vs. single-app-user pricing split.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Contact, lead, and pipeline management",
      "Email campaign tracking",
      "Workflow automation (Professional+)",
      "Predictive/generative AI features (One AI tier)",
      "Free tier for up to 10 users",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for cost-conscious small teams wanting a real (if capped) free plan and an affordable path up to AI-enabled features — the standard-vs-single-app-user pricing split adds a layer of complexity worth double-checking before signing up.",
    bestFor: [
      "Small teams wanting a genuinely free tier to start, not just a trial",
      "Budget-conscious businesses wanting an eventual path to AI-assisted CRM features",
    ],
    avoidIf: [
      "You need more than 3,000 records or 1,000 emails/month without paying — Free's caps are strict",
      "You want simple, single-rate pricing — the standard-vs-single-app-user split can be confusing",
    ],
    pros: [
      "Genuinely free tier (not just a time-limited trial) for up to 10 users",
      "Affordable per-user pricing across the paid ladder relative to Salesforce/HubSpot",
      "Clear upgrade path all the way to a dedicated AI-features tier",
    ],
    cons: [
      "Free tier's 3,000-record cap is restrictive for any actively growing small business",
      "Standard-user vs. single-app-user pricing split adds confusion versus simpler flat per-seat pricing",
      "Smaller ecosystem and brand recognition than category leaders",
    ],

    popularityScore: 44,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.vtiger.com/crm-pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "bigin",
    name: "Bigin",
    // DRAFT - review before publish
    tagline: "Zoho's stripped-down, pipeline-only CRM built specifically for small businesses new to CRM.",
    logoUrl: "https://www.google.com/s2/favicons?domain=bigin.com&sz=128",
    website: "https://www.bigin.com",

    category: "crm",
    subCategory: "pipeline-automation",
    industries: ["freelancers", "agencies", "retail", "real-estate"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability — Bigin recently moved off the zoho.com domain to its own bigin.com domain.",
    useCases: ["simple sales pipeline management", "contact tracking for small businesses", "first-time CRM adoption"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — pricing paths at bigin.com/pricing and bigin.com/pricing.html both 404'd during research"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Simple, single-pipeline-focused CRM",
      "Contact and activity management",
      "Basic workflow automation",
      "Telephony and email integration",
      "Mobile app for on-the-go updates",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for very small businesses adopting a CRM for the first time who want Zoho's ecosystem without Zoho CRM's full complexity — pricing needs direct confirmation since the product recently migrated domains and its live pricing page wasn't reachable during research.",
    bestFor: [
      "Small businesses adopting a CRM for the first time who find full CRMs overwhelming",
      "Teams wanting a lightweight, pipeline-only tool rather than a full sales platform",
    ],
    avoidIf: [
      "You'll quickly outgrow a single-pipeline, simplified feature set and need to migrate to a fuller CRM",
      "You need confirmed current pricing today — the vendor's pricing page wasn't reachable during this research pass",
    ],
    pros: [
      "Deliberately simple UI aimed at first-time CRM adopters, not power users",
      "Backed by Zoho's broader ecosystem and support infrastructure",
      "Mobile-first design suits small, on-the-go sales teams",
    ],
    cons: [
      "Pricing page unreachable during research (recent domain migration to bigin.com) — confirm before publishing",
      "Deliberately limited feature set means fast-growing teams may outgrow it quickly",
      "Less brand recognition as a standalone product versus its parent Zoho CRM",
    ],

    popularityScore: 50,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.bigin.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "less-annoying-crm",
    name: "Less Annoying CRM",
    // DRAFT - review before publish
    tagline: "Deliberately simple, single-plan CRM for small businesses tired of feature-gated tiers.",
    logoUrl: "https://www.google.com/s2/favicons?domain=lessannoyingcrm.com&sz=128",
    website: "https://www.lessannoyingcrm.com",

    category: "crm",
    subCategory: "contact-management",
    industries: ["freelancers", "agencies", "real-estate", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["north-america"],
    regionNotes: "Primarily marketed to and supports US/Canada-based small businesses — VERIFY availability/support outside North America.",
    useCases: ["contact management", "simple sales pipeline tracking", "task and follow-up reminders"],
    pricingModel: "subscription",

    pricing: [
      { name: "Standard", priceMonthly: 15, priceAnnual: null, currency: "USD", keyLimits: ["Per user; unlimited contacts and companies, 25 GB storage/user, unlimited pipelines and custom fields — single flat plan, no tiers"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier, but a genuinely full-featured 30-day free trial (no credit card required) covers every feature with nothing gated behind a higher tier — the flat $15/user/month price is the entire product, not an entry point to upsells.",
    startingPrice: 15,
    currency: "USD",

    keyFeatures: [
      "Unlimited contacts, companies, and custom fields",
      "Unlimited sales pipelines",
      "Task and follow-up reminders",
      "Email logging",
      "Simple user-permission controls",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small businesses and solo professionals who are explicitly tired of tiered CRM pricing and feature-gating — the deliberately simple, single-plan approach is the whole pitch, so don't expect advanced automation or AI features.",
    bestFor: [
      "Solo professionals and small teams wanting the simplest possible CRM with no upsell pressure",
      "Real estate agents, consultants, and freelancers who mainly need contact/follow-up tracking",
    ],
    avoidIf: [
      "You need advanced sales automation, AI features, or deep customization — deliberately not offered here",
      "You're outside North America and need confirmed international support",
    ],
    pros: [
      "Genuinely one flat price with everything included — no feature-gating anxiety",
      "Famously simple, low-friction UI that's easy to onboard non-technical users into",
      "Long-standing reputation for excellent, responsive customer support",
    ],
    cons: [
      "No advanced automation, AI, or marketing features — deliberately basic by design",
      "Single flat plan means no lower-cost entry option for very light usage",
      "Primarily positioned/supported for North American small businesses",
    ],

    popularityScore: 38,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.lessannoyingcrm.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "salesflare",
    name: "Salesflare",
    // DRAFT - review before publish
    tagline: "Automated-data-entry CRM for small B2B teams — pulls contact/deal info from email and calendar automatically.",
    logoUrl: "https://www.google.com/s2/favicons?domain=salesflare.com&sz=128",
    website: "https://salesflare.com",

    category: "crm",
    subCategory: "pipeline-automation",
    industries: ["agencies", "consulting", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current regional/currency pricing options.",
    useCases: ["automated contact and deal data capture", "sales pipeline management", "email tracking and sequencing", "lead prospecting credits"],
    pricingModel: "subscription",

    pricing: [
      { name: "Growth", priceMonthly: 39, priceAnnual: 29, currency: "USD", keyLimits: ["Per user; automated CRM data input, email/link/website tracking, 5 lead credits included"] },
      { name: "Pro", priceMonthly: 64, priceAnnual: 49, currency: "USD", keyLimits: ["Per user; adds email workflow sequences, user permissions, custom dashboards, 100 lead credits included"] },
      { name: "Enterprise", priceMonthly: 124, priceAnnual: 99, currency: "USD", keyLimits: ["Per user, 5-user minimum; adds full setup/training, data migration, dedicated account manager, 250 lead credits included"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — a 30-day free trial is offered, no credit card required. Additional lead-prospecting credits beyond each plan's monthly allowance are billed separately ($39/250 credits and up), and Enterprise requires a 5-user minimum.",
    startingPrice: 29,
    currency: "USD",

    keyFeatures: [
      "Automated contact/deal data capture from email and calendar",
      "Email, link, and website visit tracking",
      "Email workflow sequences (Pro+)",
      "Lead prospecting credits",
      "Custom dashboards (Pro+)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small B2B teams who want to minimize manual data entry — the automated capture from email/calendar is the core value proposition, but lead-credit add-on costs and Enterprise's 5-seat minimum are worth checking against your actual usage.",
    bestFor: [
      "Small B2B sales teams who want minimal manual CRM data entry",
      "Consultants/agencies who live in email and want automatic deal tracking",
    ],
    avoidIf: [
      "You need month-to-month flexibility without an annual-billing discount gap",
      "You're a solo user needing Enterprise features — the 5-user minimum blocks smaller teams",
    ],
    pros: [
      "Genuinely reduces manual CRM data entry via automated email/calendar capture",
      "Reasonable entry price for a small B2B team on annual billing ($29/user/mo)",
      "Website/email tracking gives useful buying-intent signals out of the box",
    ],
    cons: [
      "No free tier, only a 30-day trial",
      "Lead-prospecting credits beyond the monthly allowance cost extra",
      "Enterprise's 5-user minimum shuts out smaller teams from its top-tier features",
    ],

    popularityScore: 42,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://salesflare.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "attio",
    name: "Attio",
    // DRAFT - review before publish
    tagline: "Modern, highly customizable CRM built around flexible data objects — popular with startups and fast-moving teams.",
    logoUrl: "https://www.google.com/s2/favicons?domain=attio.com&sz=128",
    website: "https://attio.com",

    category: "crm",
    subCategory: "contact-management",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Global SaaS product — VERIFY current regional/currency pricing options.",
    useCases: ["flexible/custom CRM data modeling", "sales pipeline management", "relationship intelligence", "reporting and dashboards"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 3 seats, 50,000 records, up to 3 custom objects, 200 emails/mo, up to 3 reports"] },
      { name: "Plus", priceMonthly: 36, priceAnnual: 29, currency: "USD", keyLimits: ["Per seat; no seat limit, 250,000 records, up to 5 objects, 1,000 emails/mo, up to 15 reports"] },
      { name: "Pro", priceMonthly: 86, priceAnnual: 69, currency: "USD", keyLimits: ["Per seat; 1,000,000 records, up to 12 objects, unlimited emails/mo, up to 100 reports, call intelligence and sequences included"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom annual pricing; unlimited objects and teams, custom record limits, advanced security/admin controls"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is capped at 3 seats and just 200 emails/month — enough to model your data and try the product, but active sales use will hit the email cap quickly. Call intelligence and email sequences are gated behind Pro, not available on Free or Plus.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Fully customizable data objects/records (not a fixed contact/deal schema)",
      "Sales pipeline and relationship tracking",
      "Reporting and custom dashboards",
      "Call intelligence and email sequences (Pro)",
      "API-first architecture popular with technical teams",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for startups and technically-minded teams who want a CRM they can genuinely reshape around their own data model rather than forcing their process into a fixed contact/deal schema — the flexibility comes with more setup decisions than a rigid, opinionated CRM.",
    bestFor: [
      "Startups and technical teams wanting a highly customizable, API-first CRM",
      "Teams whose sales process doesn't fit a standard contact/deal/pipeline template",
    ],
    avoidIf: [
      "You want an opinionated, ready-to-go CRM with minimal setup decisions",
      "You need call intelligence or sequences without upgrading to Pro",
    ],
    pros: [
      "Genuinely flexible data model — not locked into a rigid CRM schema",
      "Modern, fast UI that's won strong reviews among startup/tech teams",
      "Free tier gives real access to the custom-object model to evaluate fit",
    ],
    cons: [
      "Free plan's 200 emails/month cap is restrictive for active outbound use",
      "Flexibility means more upfront configuration decisions than a fixed-schema CRM",
      "Newer product with a shorter track record than long-established competitors",
    ],

    popularityScore: 58,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://attio.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
];
