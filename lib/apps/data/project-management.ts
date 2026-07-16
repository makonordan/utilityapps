import type { AppListing } from "../types";

// Scaffolded via research pass — 20 well-known Project Management tools
// (task boards, work management, portfolio/resource management).
//
// Every field tagged with the literal string "VERIFY" is a placeholder for
// a fact (pricing tier, price, free-tier limit, or integration list) that
// must be checked against the vendor's own live pricing page before this
// listing is published — see docs/apps-verification-checklist.md. Do not
// replace "VERIFY" with a remembered or guessed value.
//
// A number of vendors in this category only publish the per-month price
// under an annual commitment on their pricing page (the true month-to-month,
// no-commitment rate is often only revealed at checkout or behind a toggle
// that couldn't be captured). Where that happened, priceAnnual carries the
// confirmed number and priceMonthly is left "VERIFY" rather than assuming
// the two are equal — that assumption would itself be an unverified guess.
// A `null` price (as opposed to "VERIFY") means the vendor's page confirms
// that billing cadence isn't offered at all (e.g. an annual-only enterprise
// tier), which is a verified fact, not a gap.
//
// Editorial fields (tagline, verdict, bestFor, avoidIf, pros, cons) are
// well-reasoned drafts based on each tool's general reputation and market
// positioning, marked "// DRAFT - review before publish" — apply your own
// judgement before these go live.
//
// The publish guard lives in lib/apps/index.ts (isPricingVerified /
// ALL_APPS): any listing still carrying a VERIFY pricing fact is excluded
// from the production directory automatically.

export const PROJECT_MANAGEMENT_APPS: AppListing[] = [
  {
    id: "asana",
    name: "Asana",
    // DRAFT - review before publish
    tagline: "Polished work management for teams that want structure without a steep learning curve.",
    logoUrl: "https://www.google.com/s2/favicons?domain=asana.com&sz=128",
    website: "https://asana.com",

    category: "project-management",
    subCategory: "work-management",
    industries: ["agencies", "consulting", "nonprofits", "ecommerce", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global", "north-america", "europe", "oceania"],
    regionNotes: "Broadly available worldwide with localized language support — VERIFY current data-residency options by region.",
    useCases: ["task management", "kanban boards", "team collaboration", "goal tracking", "workload management", "project timelines"],
    pricingModel: "freemium",

    pricing: [
      { name: "Personal", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 2 users, unlimited tasks/projects, 100MB max file size"] },
      { name: "Starter", priceMonthly: 13.49, priceAnnual: 10.99, currency: "USD", keyLimits: ["Unlimited seats; Timeline/Gantt, reporting dashboards, unlimited automations, custom fields"] },
      { name: "Advanced", priceMonthly: 30.49, priceAnnual: 24.99, currency: "USD", keyLimits: ["Unlimited seats; portfolios, goals, workload management, approvals/proofing"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — SAML, SCIM provisioning, capacity planning"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Personal plan is free forever for up to 2 users with unlimited tasks and projects, but no Timeline/Gantt view or reporting dashboards — most real teams outgrow it as soon as a third person joins.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "List, board, timeline, and calendar views",
      "Workload and capacity management",
      "Goals tied to project work",
      "Forms and intake workflows",
      "100+ integrations",
      "AI Studio automation credits on paid tiers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for mid-size teams that want a work-management tool with real structure (goals, workload, timelines) without Jira-level configuration overhead — the free plan is genuinely limited, so budget for Starter once you're past two people.",
    bestFor: [
      "Marketing, ops, and cross-functional teams coordinating multi-step work",
      "Organizations that want goals and workload visibility tied to day-to-day tasks",
    ],
    avoidIf: [
      "You're a solo user or two-person team who just needs a simple list — this is more structure than you need",
      "You need deep software-engineering issue tracking (sprints, code linking) — look at Linear or Jira instead",
    ],
    pros: [
      "Clean, fast interface that most teams pick up quickly",
      "Strong workload and portfolio views once you're on Advanced",
      "Large integration ecosystem",
    ],
    cons: [
      "Free plan caps out at 2 users with no timeline/reporting views",
      "Cost climbs quickly once you add Advanced-tier seats across a larger team",
      "Less suited to engineering-style sprint/issue tracking than dedicated dev tools",
    ],

    popularityScore: 90,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://asana.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "trello",
    name: "Trello",
    // DRAFT - review before publish
    tagline: "The simplest kanban board there is — great for small teams, thin once work gets complex.",
    logoUrl: "https://www.google.com/s2/favicons?domain=trello.com&sz=128",
    website: "https://trello.com",

    category: "project-management",
    subCategory: "task-management",
    industries: ["freelancers", "agencies", "retail", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Available worldwide as part of Atlassian's product suite — VERIFY regional data-residency and payment options.",
    useCases: ["kanban boards", "task management", "personal task tracking", "simple team workflows"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 10 collaborators/Workspace, 10 boards/Workspace, 10MB file uploads"] },
      { name: "Standard", priceMonthly: 6, priceAnnual: 5, currency: "USD", keyLimits: ["Unlimited boards, 250MB file storage, 1,000 Workspace command runs/month"] },
      { name: "Premium", priceMonthly: 12.5, priceAnnual: 10, currency: "USD", keyLimits: ["Calendar/Timeline/Table/Dashboard/Map views, unlimited command runs, AI features"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: 17.5, currency: "USD", keyLimits: ["Annual billing only (~$210/user/yr); Atlassian Guard Standard, 24/7 admin support, unlimited Workspaces"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is capped at 10 collaborators and 10 boards per Workspace with only 10MB file uploads — fine for a small team's single board, tight for anything larger.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Drag-and-drop kanban boards",
      "Power-Ups (integrations/add-ons)",
      "Butler automation (rule-based)",
      "Calendar, Timeline, Table, and Map views on paid tiers",
      "Card-level checklists, due dates, attachments",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best as the simplest possible kanban board for individuals and small teams — it's not trying to be a full work-management platform, and you'll feel the ceiling once you need dependencies, real reporting, or resource views.",
    bestFor: [
      "Individuals and small teams who want a visual to-do board with near-zero setup",
      "Freelancers managing a handful of client projects on simple boards",
    ],
    avoidIf: [
      "You need task dependencies, Gantt charts, or portfolio-level reporting natively",
      "Your team has outgrown 10 boards or 10 collaborators on the free plan",
    ],
    pros: [
      "About as low a learning curve as project tools get",
      "Butler automation is genuinely useful even on the free plan",
      "Power-Ups extend it a long way for teams that don't need everything",
    ],
    cons: [
      "Free plan's 10-board cap forces an upgrade sooner than most competitors' free tiers",
      "No native Gantt/timeline view below Premium",
      "Thin for teams that need real resource or portfolio management",
    ],

    popularityScore: 88,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://trello.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "monday",
    name: "monday.com",
    // DRAFT - review before publish
    tagline: "Colorful, highly customizable work OS that scales from small teams to large orgs — priced per seat with a 3-seat minimum on paid plans.",
    logoUrl: "https://www.google.com/s2/favicons?domain=monday.com&sz=128",
    website: "https://monday.com",

    category: "project-management",
    subCategory: "work-management",
    industries: ["agencies", "construction", "retail", "real-estate", "consulting"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global", "north-america", "europe", "oceania"],
    regionNotes: "Available worldwide; VERIFY regional payment methods and data-residency options.",
    useCases: ["work management", "kanban boards", "resource planning", "team collaboration", "workflow automation"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 2 seats, 3 boards, 3 Docs, 8 column types"] },
      { name: "Basic", priceMonthly: 9, priceAnnual: 9, currency: "USD", keyLimits: ["Per seat, minimum 3 seats; unlimited items, unlimited free viewers"] },
      { name: "Standard", priceMonthly: "VERIFY", priceAnnual: 12, currency: "USD", keyLimits: ["Per seat; 250 automations/month, 250 integrations/month — monthly (no-commitment) rate not disclosed on the pricing page, only the annual-billed rate"] },
      { name: "Pro", priceMonthly: "VERIFY", priceAnnual: 19, currency: "USD", keyLimits: ["Per seat; 25,000 automation/integration actions/month — monthly (no-commitment) rate not disclosed on the pricing page, only the annual-billed rate"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote, typically 40+ seat minimum; portfolio and resource management"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is capped at 2 seats and 3 boards — a genuine trial-sized sandbox, not something a real team runs on day to day.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Highly customizable boards and column types",
      "Automations and integrations (usage-capped by plan)",
      "Multiple views: kanban, Gantt, calendar, workload",
      "Dashboards across boards",
      "monday AI features on paid tiers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want a highly visual, customizable work OS and are prepared for per-seat, 3-seat-minimum pricing that adds up fast — confirm the true month-to-month rate before budgeting, since monday's page mainly shows the annual-billed price.",
    bestFor: [
      "Teams that want a flexible, no-code-configurable board system across departments",
      "Organizations already comfortable with per-seat SaaS pricing at scale",
    ],
    avoidIf: [
      "You're under 3 people — the paid plans require a 3-seat minimum",
      "You want a flat/unlimited-user price rather than per-seat billing",
    ],
    pros: [
      "Extremely flexible board and automation system",
      "Strong visual polish and onboarding",
      "Templates cover a huge range of use cases out of the box",
    ],
    cons: [
      "Free tier is only useful for evaluating the product, not running real work",
      "Automation/integration actions are usage-capped even on paid tiers",
      "Per-seat pricing with a 3-seat minimum gets expensive for growing teams",
    ],

    popularityScore: 92,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://monday.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "clickup",
    name: "ClickUp",
    // DRAFT - review before publish
    tagline: "An almost overwhelming amount of project-management functionality in one app, at an aggressive price.",
    logoUrl: "https://www.google.com/s2/favicons?domain=clickup.com&sz=128",
    website: "https://clickup.com",

    category: "project-management",
    subCategory: "work-management",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available worldwide — VERIFY regional payment methods and data-residency options.",
    useCases: ["task management", "kanban boards", "docs and wikis", "goal tracking", "time tracking", "sprint planning"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free Forever", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["60MB storage, unlimited tasks, kanban, docs, basic sprint management"] },
      { name: "Unlimited", priceMonthly: "VERIFY", priceAnnual: 7, currency: "USD", keyLimits: ["Unlimited storage/spaces/forms/integrations, Gantt charts — monthly (no-commitment) rate not disclosed on the pricing page, only the annual-billed rate"] },
      { name: "Business", priceMonthly: "VERIFY", priceAnnual: 12, currency: "USD", keyLimits: ["Unlimited dashboards, 5,000 automations/month, mind mapping, proofing — monthly rate not disclosed"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote; 250K automations/month, SAML SSO, custom roles, audit logs"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free Forever plan is capped at 60MB total storage but otherwise includes unlimited tasks and most core views — usable for a solo user or very small team, tight on storage for anyone attaching files regularly.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Highly configurable views (list, board, Gantt, calendar, mind map)",
      "Docs and built-in wiki",
      "Custom fields and statuses",
      "Automations (usage-capped by plan)",
      "Separate ClickUp Brain AI add-on tier",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want maximum configurability and features per dollar and don't mind a steeper learning curve — confirm the true month-to-month price before committing, since ClickUp's page mainly shows the annual-billed rate.",
    bestFor: [
      "Teams that want one tool to replace several (docs, tasks, goals, time tracking)",
      "Budget-conscious teams comparing feature-per-dollar against Asana/Monday",
    ],
    avoidIf: [
      "You want a tool that's simple out of the box — ClickUp has a real configuration learning curve",
      "You just need a lightweight kanban board and nothing else",
    ],
    pros: [
      "Extremely feature-rich for the price",
      "Free plan is usable for solo users beyond just evaluation",
      "Highly customizable to fit almost any workflow",
    ],
    cons: [
      "Feature density can overwhelm new users and teams",
      "Free plan's 60MB storage cap is small",
      "AI features are sold as a separate add-on tier, adding pricing complexity",
    ],

    popularityScore: 89,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://clickup.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "wrike",
    name: "Wrike",
    // DRAFT - review before publish
    tagline: "Enterprise-grade portfolio and resource management, with heavier plans locked to annual billing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=wrike.com&sz=128",
    website: "https://www.wrike.com",

    category: "project-management",
    subCategory: "portfolio-management",
    industries: ["agencies", "consulting", "construction", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global", "north-america", "europe"],
    regionNotes: "Available worldwide — VERIFY regional payment methods and data-residency options.",
    useCases: ["portfolio management", "resource planning", "task management", "budgeting and financial tracking", "reporting"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Essential task management; web, desktop, and mobile apps; board and table views"] },
      { name: "Team", priceMonthly: null, priceAnnual: 10, currency: "USD", keyLimits: ["2-15 users; billed on an annual basis only per Wrike's pricing page"] },
      { name: "Business", priceMonthly: null, priceAnnual: 25, currency: "USD", keyLimits: ["5-200 users; Wrike states Business plans and above are annual-subscription only"] },
      { name: "Pinnacle", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote; advanced resource planning, budgeting, BI reporting"] },
      { name: "Apex", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote; unlimited Whiteboards, Wrike Integrate, bi-directional sync"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan covers essential task management with unlimited users mentioned but no seat cap disclosed in what was checked — VERIFY the exact user limit before publishing, since Wrike's own page didn't state one explicitly in this pass.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Gantt-chart and portfolio-level project views",
      "Resource and capacity planning (higher tiers)",
      "Budgeting and financial tracking (Pinnacle+)",
      "Custom workflows and approvals",
      "Advanced BI-style reporting",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for mid-size and larger teams that need real portfolio and resource management, not just task boards — plan on annual billing, since Wrike's paid tiers aren't sold month-to-month.",
    bestFor: [
      "Operations and PMO teams managing a portfolio of projects across multiple departments",
      "Organizations that need resource/capacity planning, not just task tracking",
    ],
    avoidIf: [
      "You want month-to-month billing flexibility — Business and above are annual-only",
      "You're a small team that just needs simple task boards — this is more than you need",
    ],
    pros: [
      "Strong portfolio and resource-management depth relative to Asana/Monday",
      "Scales cleanly into enterprise budgeting and BI reporting",
      "Flexible custom workflows and approval chains",
    ],
    cons: [
      "Business-tier and above require annual commitment, no month-to-month option",
      "Interface has a steeper learning curve than Trello/Asana",
      "Advanced resource/budgeting features are locked to the priciest custom tiers",
    ],

    popularityScore: 75,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.wrike.com/price/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "basecamp",
    name: "Basecamp",
    // DRAFT - review before publish
    tagline: "Flat, simple pricing and an opinionated, calm approach to project communication — not a customizable work OS.",
    logoUrl: "https://www.google.com/s2/favicons?domain=basecamp.com&sz=128",
    website: "https://basecamp.com",

    category: "project-management",
    subCategory: "work-management",
    industries: ["agencies", "consulting", "freelancers", "nonprofits"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global", "north-america"],
    regionNotes: "US company (37signals); available globally — VERIFY regional payment/support depth.",
    useCases: ["team collaboration", "task management", "message boards", "client collaboration", "scheduling"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["1 project, 1GB storage, up to 20 users"] },
      { name: "Pro", priceMonthly: 15, priceAnnual: "VERIFY", currency: "USD", keyLimits: ["Per user; unlimited projects, 500GB storage — page did not state a separate annual-billing discount, so priceAnnual is unconfirmed rather than assumed equal"] },
      { name: "Pro Unlimited", priceMonthly: null, priceAnnual: 299, currency: "USD", keyLimits: ["Flat fee, unlimited users, 5TB storage, billed annually; includes Admin Pro Pack and Timesheet upgrades"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is limited to 1 project and 1GB storage for up to 20 users — enough to trial the product, not to run an active team.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Message boards, to-dos, and card tables",
      "Built-in team chat (Campfire)",
      "Scheduling and docs/files",
      "Client/contractor access included free",
      "Flat-fee Unlimited tier avoids per-user pricing entirely",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want Basecamp's calm, opinionated approach to project communication over a highly configurable board tool — the flat-fee Unlimited plan is genuinely appealing once you have a sizeable team, since it removes per-seat pricing entirely.",
    bestFor: [
      "Small agencies and consultancies that want simple project communication, not a configurable work OS",
      "Larger teams that want to escape per-seat pricing via the flat-fee Unlimited plan",
    ],
    avoidIf: [
      "You want Gantt charts, custom workflows, or granular reporting — Basecamp deliberately doesn't offer these",
      "You need deep customization of views and fields",
    ],
    pros: [
      "Simple, calm interface with a genuinely different philosophy from feature-maximalist competitors",
      "Flat-fee Unlimited plan is a real alternative to per-seat pricing at scale",
      "Client/contractor collaboration included at no extra cost",
    ],
    cons: [
      "Deliberately limited feature set — no Gantt charts, limited custom fields",
      "Free plan's single-project cap makes it a pure trial, not a usable tier",
      "Less suited to teams that want highly configurable workflows",
    ],

    popularityScore: 72,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://basecamp.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "smartsheet",
    name: "Smartsheet",
    // DRAFT - review before publish
    tagline: "Spreadsheet-native project and portfolio management for ops-heavy teams — no free tier, only a trial.",
    logoUrl: "https://www.google.com/s2/favicons?domain=smartsheet.com&sz=128",
    website: "https://www.smartsheet.com",

    category: "project-management",
    subCategory: "portfolio-management",
    industries: ["construction", "real-estate", "consulting", "nonprofits"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and data-residency options.",
    useCases: ["portfolio management", "resource planning", "spreadsheet-style task tracking", "reporting and dashboards"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Spreadsheet-style grid as the core interface",
      "Gantt, board, and calendar views",
      "Automated workflows",
      "Portfolio-level reporting (higher tiers)",
      "Control Center for standardized project templates (Advanced Work Management)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for ops and PMO teams that think in spreadsheets and need portfolio-level rollups across many projects — the pricing figures returned by this pass were inconsistent/garbled across currencies and need a manual check before this goes live, so treat the numbers as unverified for now.",
    bestFor: [
      "Operations teams that want spreadsheet familiarity with project-management structure layered on top",
      "Organizations needing portfolio rollups across many concurrent projects",
    ],
    avoidIf: [
      "You want a free tier — Smartsheet only offers a time-limited trial",
      "You want a highly visual, board-first interface — Smartsheet leads with grids",
    ],
    pros: [
      "Spreadsheet-native interface lowers the learning curve for Excel-heavy teams",
      "Strong portfolio and template-standardization tools at the top tiers",
      "Deep automation capabilities",
    ],
    cons: [
      "No free tier, only a 30-day trial",
      "Pricing page is not straightforward to verify programmatically — confirm current tier prices manually",
      "Grid-first interface feels less modern than board-first competitors to some teams",
    ],

    popularityScore: 78,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.smartsheet.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "teamwork",
    name: "Teamwork.com",
    // DRAFT - review before publish
    tagline: "Client-services-focused project management with billing and profitability tracking baked in.",
    logoUrl: "https://www.google.com/s2/favicons?domain=teamwork.com&sz=128",
    website: "https://www.teamwork.com",

    category: "project-management",
    subCategory: "work-management",
    industries: ["agencies", "consulting", "freelancers"],
    businessSizes: ["small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and data-residency options.",
    useCases: ["client project management", "task management", "time tracking", "project profitability tracking", "billing"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Max 5 users, up to 5 projects, 100MB storage, 100 automations"] },
      { name: "Basics", priceMonthly: "VERIFY", priceAnnual: 9.99, currency: "USD", keyLimits: ["Per user; up to 300 projects, 100GB storage — monthly (no-commitment) rate not disclosed on the pricing page, only the annual-billed rate"] },
      { name: "Accelerate", priceMonthly: "VERIFY", priceAnnual: 24.99, currency: "USD", keyLimits: ["Per user; up to 600 projects, 250GB storage — monthly rate not disclosed"] },
      { name: "Optimize", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote; unlimited projects, 500GB storage"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote; dedicated infrastructure"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan caps out at 5 users and 5 projects — usable for a very small team's first project, not for an agency running multiple client engagements.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Client-facing project management built for agencies",
      "Time tracking tied to project profitability",
      "Budgets and billing/invoicing hooks",
      "Task management with dependencies",
      "Resource scheduling",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for agencies and consultancies that bill clients by project and want profitability tracking alongside task management — confirm the true month-to-month price before budgeting, since the page mainly surfaces the annual-billed rate.",
    bestFor: [
      "Agencies that need project profitability and budget tracking, not just task lists",
      "Client-services teams managing many concurrent client projects",
    ],
    avoidIf: [
      "You don't bill clients by project — the profitability/billing focus is wasted overhead",
      "You need more than 5 users and want to stay on the free plan",
    ],
    pros: [
      "Purpose-built for agency/client-services workflows",
      "Time tracking directly tied to project budgets and profitability",
      "Resource scheduling included at reasonable tiers",
    ],
    cons: [
      "Free plan is capped tightly at 5 users/5 projects",
      "Less well-known and smaller ecosystem than Asana/Monday/ClickUp",
      "True month-to-month pricing isn't clearly published",
    ],

    popularityScore: 60,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.teamwork.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "linear",
    name: "Linear",
    // DRAFT - review before publish
    tagline: "Fast, opinionated issue tracking built for software teams who find Jira too slow and heavy.",
    logoUrl: "https://www.google.com/s2/favicons?domain=linear.app&sz=128",
    website: "https://linear.app",

    category: "project-management",
    subCategory: "task-management",
    industries: ["agencies", "consulting"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and data-residency options.",
    useCases: ["issue tracking", "sprint planning", "task management", "software team workflows", "roadmapping"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["2 teams, 250 issues, 10MB file upload, unlimited members"] },
      { name: "Basic", priceMonthly: "VERIFY", priceAnnual: 10, currency: "USD", keyLimits: ["Per user; 5 teams, unlimited issues/file uploads — pricing page only shows the billed-yearly rate, no separate monthly-only figure found"] },
      { name: "Business", priceMonthly: "VERIFY", priceAnnual: 16, currency: "USD", keyLimits: ["Per user; unlimited teams, private teams, guest accounts, Triage/Code Intelligence — monthly rate not disclosed"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote, annual billing only; SAML/SCIM, advanced admin controls"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is capped at 2 teams and 250 total issues — workable for a small early-stage team, but you'll hit the issue cap as the backlog grows.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Fast, keyboard-driven issue tracking",
      "Cycles (sprints) and roadmaps",
      "Git integration and code-linked issues",
      "Triage workflows",
      "Clean, opinionated UI with minimal configuration",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for software teams that want Jira's structure without Jira's sluggishness and configuration sprawl — confirm the true month-to-month price before publishing, since only the annual-billed rate could be confirmed here.",
    bestFor: [
      "Software/product teams running sprints and tracking issues tied to code",
      "Teams that have found Jira too slow or too configurable for their taste",
    ],
    avoidIf: [
      "You're not a software/engineering team — Linear is purpose-built for that workflow",
      "You need the extreme configurability and marketplace depth of Jira",
    ],
    pros: [
      "Genuinely fast, well-designed interface",
      "Strong Git/code integration for engineering teams",
      "Opinionated defaults reduce setup time versus Jira",
    ],
    cons: [
      "Free plan's 250-issue cap is easy to hit",
      "Less suited to non-engineering teams (marketing, ops) than general PM tools",
      "Enterprise tier requires annual billing",
    ],

    popularityScore: 76,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://linear.app/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "jira",
    name: "Jira",
    // DRAFT - review before publish
    tagline: "The default issue tracker for software teams, with unmatched configurability and a real learning curve.",
    logoUrl: "https://www.google.com/s2/favicons?domain=atlassian.com&sz=128",
    website: "https://www.atlassian.com/software/jira",

    category: "project-management",
    subCategory: "task-management",
    industries: ["agencies", "consulting"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and data-residency options.",
    useCases: ["issue tracking", "sprint planning", "agile boards", "bug tracking", "software team workflows"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Scrum and Kanban boards",
      "Highly configurable workflows and issue types",
      "Backlog and sprint planning",
      "Advanced reporting (burndown, velocity)",
      "Deep Atlassian ecosystem integration (Confluence, Bitbucket)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for software teams (especially larger ones) that need serious workflow configurability and are willing to accept a steeper learning curve — Atlassian's pricing page couldn't be reliably fetched in this pass, so treat every number here as unverified until manually checked.",
    bestFor: [
      "Software engineering teams running structured Scrum/Kanban processes",
      "Organizations already invested in the Atlassian ecosystem (Confluence, Bitbucket)",
    ],
    avoidIf: [
      "You want something fast and lightweight — Jira has real setup and performance overhead",
      "You're a small non-technical team — the configurability is mostly wasted",
    ],
    pros: [
      "Unmatched configurability for complex engineering workflows",
      "Deep reporting (burndown charts, velocity, cumulative flow)",
      "Huge marketplace of plugins and integrations",
    ],
    cons: [
      "Steep learning curve and administrative overhead",
      "Interface can feel slow compared to newer tools like Linear",
      "Easy to over-configure into something confusing for new team members",
    ],

    popularityScore: 93,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.atlassian.com/software/jira/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "shortcut",
    name: "Shortcut",
    // DRAFT - review before publish
    tagline: "A simpler, developer-friendly alternative to Jira for small-to-mid software teams.",
    logoUrl: "https://www.google.com/s2/favicons?domain=shortcut.com&sz=128",
    website: "https://www.shortcut.com",

    category: "project-management",
    subCategory: "task-management",
    industries: ["agencies", "consulting"],
    businessSizes: ["small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and data-residency options.",
    useCases: ["issue tracking", "sprint planning", "software team workflows", "roadmapping"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Story/epic-based issue tracking",
      "Customizable workflows",
      "Native Git integration",
      "Iterations (sprints) and roadmaps",
      "Simpler configuration surface than Jira",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small-to-mid software teams that want Jira-style structure without Jira's complexity — this pass returned self-contradictory figures for the paid tiers (the stated annual discount didn't match the stated annual totals), so pricing needs a clean manual check before publishing.",
    bestFor: [
      "Small-to-mid software teams that find Jira overly complex",
      "Teams that want story/epic tracking with native Git integration",
    ],
    avoidIf: [
      "You're a large enterprise needing Jira-level configurability and marketplace depth",
      "You're not a software team — Shortcut is purpose-built for engineering workflows",
    ],
    pros: [
      "Simpler and faster to configure than Jira",
      "Solid native Git/PR integration",
      "Reasonable free tier for very small teams",
    ],
    cons: [
      "Much smaller ecosystem/marketplace than Jira",
      "Less brand recognition — harder to hire people already familiar with it",
      "Pricing details found in this pass were internally inconsistent and need re-verification",
    ],

    popularityScore: 45,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.shortcut.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "zoho-projects",
    name: "Zoho Projects",
    // DRAFT - review before publish
    tagline: "Budget-friendly project management with deep ties into the wider Zoho suite.",
    logoUrl: "https://www.google.com/s2/favicons?domain=zoho.com&sz=128",
    website: "https://www.zoho.com/projects/",

    category: "project-management",
    subCategory: "work-management",
    industries: ["agencies", "construction", "consulting", "retail"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global", "asia", "north-america", "europe"],
    regionNotes: "Broad multi-country availability, consistent with the wider Zoho suite — VERIFY country-specific feature parity.",
    useCases: ["task management", "resource planning", "time tracking", "workflow automation", "gantt charts"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "Free plan covers up to 5 users, 3 projects, 5GB storage, and 50 workflow executions/month — exact paid-tier pricing could not be confirmed in this pass (page renders prices via JavaScript that couldn't be captured).",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Gantt charts and task dependencies",
      "Time tracking",
      "Workflow automation (usage-capped by plan)",
      "Custom views and profiles/roles",
      "Deep integration with other Zoho apps (Books, CRM, Desk)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for price-sensitive teams already using other Zoho apps who want project management to plug directly into their existing suite — paid-tier prices need a manual check since the pricing page renders them via JavaScript.",
    bestFor: [
      "Teams already invested in the Zoho ecosystem (Books, CRM, Desk)",
      "Budget-conscious small businesses comparing cost against Asana/Monday",
    ],
    avoidIf: [
      "You want the brand recognition and ecosystem size of Asana/Monday/ClickUp",
      "You're not using (or open to using) other Zoho products",
    ],
    pros: [
      "Free tier for very small teams (up to 5 users)",
      "Tight integration with the rest of the Zoho suite",
      "Generally positioned as lower-cost than category leaders",
    ],
    cons: [
      "Smaller brand recognition and community than Asana/Monday/ClickUp",
      "Best value assumes buy-in to the wider Zoho ecosystem",
      "Interface feels less modern than newer competitors",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.zoho.com/projects/pricing.html",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "hive",
    name: "Hive",
    // DRAFT - review before publish
    tagline: "Flexible project management with a genuinely cheap entry tier for small teams.",
    logoUrl: "https://www.google.com/s2/favicons?domain=hive.com&sz=128",
    website: "https://www.hive.com",

    category: "project-management",
    subCategory: "work-management",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and data-residency options.",
    useCases: ["task management", "team collaboration", "project tracking", "time tracking"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["200MB storage, up to 10 workspace members, unlimited tasks/notes"] },
      { name: "Starter", priceMonthly: 5, priceAnnual: 3.33, currency: "USD", keyLimits: ["Up to 10 workspace members, up to 10 projects, unlimited storage; annual rate is Hive's stated $40/user/yr converted to a monthly figure"] },
      { name: "Teams", priceMonthly: 12, priceAnnual: 8, currency: "USD", keyLimits: ["Unlimited workspace members and projects; annual rate is Hive's stated $96/user/yr converted to a monthly figure"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote; enhanced security/permissions, dedicated CSM, enterprise API"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan supports up to 10 workspace members with unlimited tasks/notes but only 200MB total storage — usable for light project management, tight for file-heavy teams.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Multiple project views (kanban, Gantt, calendar, table)",
      "Native chat and email inside the app",
      "Time tracking",
      "Automations and add-ons (paid add-on marketplace)",
      "Forms for intake workflows",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small teams that want a cheap, flexible alternative to Asana/Monday with built-in chat — a reasonable \"best for light project management\" free tier per Hive's own framing, but check current add-on pricing since Hive sells several features as paid extras.",
    bestFor: [
      "Small teams wanting kanban/Gantt/calendar views plus built-in chat in one tool",
      "Budget-conscious teams comparing cost against Asana/Monday/ClickUp",
    ],
    avoidIf: [
      "You need enterprise-grade permission controls out of the box — those are Enterprise-tier only",
      "You want a tool without an add-on marketplace complicating the pricing",
    ],
    pros: [
      "Cheap entry-level paid tier relative to category leaders",
      "Built-in chat and email reduce the need for separate comms tools",
      "Multiple native views without needing paid view add-ons on higher tiers",
    ],
    cons: [
      "Smaller brand recognition and community than Asana/Monday/ClickUp",
      "Some functionality is sold as paid add-ons rather than included",
      "Free tier's 200MB storage cap is small",
    ],

    popularityScore: 48,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.hive.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "proofhub",
    name: "ProofHub",
    // DRAFT - review before publish
    tagline: "Flat-rate project management with unlimited users — no per-seat pricing at all.",
    logoUrl: "https://www.google.com/s2/favicons?domain=proofhub.com&sz=128",
    website: "https://www.proofhub.com",

    category: "project-management",
    subCategory: "work-management",
    industries: ["agencies", "construction", "consulting", "real-estate"],
    businessSizes: ["small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and data-residency options.",
    useCases: ["task management", "team collaboration", "proofing and review", "gantt charts", "time tracking"],
    pricingModel: "subscription",

    pricing: [
      { name: "Essential", priceMonthly: 50, priceAnnual: 45, currency: "USD", keyLimits: ["Flat rate, unlimited users; 40 projects, 15GB storage"] },
      { name: "Ultimate Control", priceMonthly: 150, priceAnnual: 135, currency: "USD", keyLimits: ["Flat rate, unlimited users; unlimited projects, 100GB storage, IP restrictions, activity logs"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — 14-day free trial only. Both plans are flat-rate with unlimited users, so team size doesn't drive cost the way per-seat competitors do. New customers often see a discounted introductory rate for the first few months before the standard price applies — confirm the current promo terms before quoting a price publicly.",
    startingPrice: 50,
    currency: "USD",

    keyFeatures: [
      "Flat-rate pricing with unlimited users on every plan",
      "Built-in proofing and review workflows",
      "Gantt charts and task dependencies",
      "Time tracking",
      "White-labeling on Ultimate Control",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for larger teams that want to add unlimited users without per-seat costs climbing — the flat-rate model is the whole pitch, so it's a poor fit for very small teams who'd pay more than they would per-seat elsewhere.",
    bestFor: [
      "Larger teams (15+ people) who want to add users without per-seat cost increases",
      "Agencies that want built-in proofing/review alongside task management",
    ],
    avoidIf: [
      "You're a solo user or very small team — flat-rate pricing is a bad deal at low headcounts",
      "You want a free tier to start on — ProofHub only offers a trial",
    ],
    pros: [
      "Genuinely flat pricing regardless of team size — no per-seat surprises",
      "Built-in proofing/review workflow is a differentiator versus generic task tools",
      "No contracts, cancel anytime per the vendor's own pricing page",
    ],
    cons: [
      "No free tier, only a 14-day trial",
      "Poor value for very small teams compared to per-seat competitors' free/cheap plans",
      "Smaller brand recognition and ecosystem than Asana/Monday/ClickUp",
    ],

    popularityScore: 42,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.proofhub.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "nifty",
    name: "Nifty",
    // DRAFT - review before publish
    tagline: "All-in-one project management with milestones tied directly to progress tracking.",
    logoUrl: "https://www.google.com/s2/favicons?domain=niftypm.com&sz=128",
    website: "https://niftypm.com",

    category: "project-management",
    subCategory: "work-management",
    industries: ["agencies", "consulting", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and data-residency options.",
    useCases: ["task management", "milestone tracking", "team collaboration", "docs and wikis"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Milestones that auto-calculate progress from linked tasks",
      "Docs and wikis built in",
      "Kanban, list, Gantt, and calendar views",
      "Team chat and discussions",
      "Client/guest access",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small teams that want milestones automatically tied to task progress rather than manually updated — Nifty's own pricing page returned two different, conflicting pricing structures (a flat-rate table and a separate per-member table) in this pass, so all numbers need a manual re-check before publishing.",
    bestFor: [
      "Small agencies and teams that want milestone-driven progress tracking",
      "Teams that want docs, chat, and tasks combined in one tool",
    ],
    avoidIf: [
      "You need enterprise-scale portfolio/resource management",
      "You want a well-established brand with a large integration marketplace",
    ],
    pros: [
      "Milestone auto-progress is a genuinely useful differentiator",
      "Combines docs, chat, and tasks without extra tools",
      "Free tier available for very small teams",
    ],
    cons: [
      "Smaller brand recognition than Asana/Monday/ClickUp",
      "This pass found conflicting pricing structures on the vendor's own page — needs manual verification",
      "Fewer third-party integrations than category leaders",
    ],

    popularityScore: 40,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://niftypm.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "paymo",
    name: "Paymo",
    // DRAFT - review before publish
    tagline: "Task management, time tracking, and invoicing in one tool for freelancers and small agencies.",
    logoUrl: "https://www.google.com/s2/favicons?domain=paymoapp.com&sz=128",
    website: "https://www.paymoapp.com",

    category: "project-management",
    subCategory: "resource-management",
    industries: ["freelancers", "agencies", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and tax support.",
    useCases: ["task management", "time tracking", "resource scheduling", "invoicing", "project budgeting"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["1 user, 1 client, 2 projects, 1GB storage"] },
      { name: "Solo", priceMonthly: 9.9, priceAnnual: "VERIFY", currency: "USD", keyLimits: ["1 user, 3 clients, 5 projects, 5GB storage; standard rate after an introductory discount — annual-billing rate not confirmed"] },
      { name: "Plus", priceMonthly: 15.9, priceAnnual: "VERIFY", currency: "USD", keyLimits: ["Unlimited users/clients/projects, 50GB storage; standard rate after an introductory discount — annual-billing rate not confirmed"] },
      { name: "Pro", priceMonthly: 23.9, priceAnnual: "VERIFY", currency: "USD", keyLimits: ["Unlimited users/clients/projects, 500GB storage; standard rate after an introductory discount — annual-billing rate not confirmed"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is limited to 1 user, 1 client, and 2 projects but includes unlimited time tracking and invoices — usable for a true solo freelancer with very few active clients.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Time tracking with desktop/mobile apps",
      "Task management with kanban and Gantt views",
      "Built-in invoicing tied to tracked time",
      "Resource scheduling (Plus/Pro)",
      "Project budgeting and profitability reports",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for freelancers and small agencies that want task management, time tracking, and invoicing in one place without stitching together three separate tools — confirm the annual-billing rate before publishing, since only the standard monthly price could be verified in this pass.",
    bestFor: [
      "Freelancers who bill by time and want invoicing built into their PM tool",
      "Small agencies wanting resource scheduling alongside task tracking",
    ],
    avoidIf: [
      "You need real double-entry accounting, not just time-based invoicing",
      "You're a larger team needing enterprise-grade permissions or SSO",
    ],
    pros: [
      "Combines task management, time tracking, and invoicing in one subscription",
      "Free plan is usable for a true solo freelancer",
      "Resource scheduling included at a lower price point than most competitors",
    ],
    cons: [
      "Free plan's single-client cap is very restrictive",
      "Smaller brand recognition than category leaders",
      "Introductory pricing that increases after a few months can be easy to miss when budgeting",
    ],

    popularityScore: 38,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.paymoapp.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "freedcamp",
    name: "Freedcamp",
    // DRAFT - review before publish
    tagline: "A genuinely unlimited free plan for project management, with cheap per-user upgrades.",
    logoUrl: "https://www.google.com/s2/favicons?domain=freedcamp.com&sz=128",
    website: "https://freedcamp.com",

    category: "project-management",
    subCategory: "task-management",
    industries: ["freelancers", "agencies", "nonprofits"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and data-residency options.",
    useCases: ["task management", "milestone tracking", "team collaboration", "issue tracking"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Unlimited projects, tasks, storage, and users; 10MB per-file upload limit"] },
      { name: "Pro", priceMonthly: 2.49, priceAnnual: 1.49, currency: "USD", keyLimits: ["Per user; 25MB per-file limit, premium support, cloud storage integrations"] },
      { name: "Business", priceMonthly: 8.99, priceAnnual: 7.49, currency: "USD", keyLimits: ["Per user; 100MB per-file limit; adds Issue Tracker, Wiki, Invoices+, CRM"] },
      { name: "Enterprise", priceMonthly: 19.99, priceAnnual: 16.99, currency: "USD", keyLimits: ["Per user; 250MB per-file limit; white label, SSO/SAML, private cloud"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan genuinely allows unlimited projects, tasks, storage, and users — the main restriction is a 10MB per-file upload cap and standard (not premium) support, not a user or project ceiling.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Unlimited projects/tasks/users on the free plan",
      "Milestones and time tracking",
      "Issue tracker and wiki (Business tier)",
      "Cloud storage integrations (Google Drive, OneDrive, Dropbox)",
      "White-labeling on Enterprise",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best budget pick for freelancers and small nonprofits that need genuinely unlimited free project management, not a capped trial dressed up as a free tier — don't expect the polish of Asana or ClickUp at this price.",
    bestFor: [
      "Freelancers and small nonprofits wanting unlimited free project tracking",
      "Budget-conscious small teams that don't need a large integration ecosystem",
    ],
    avoidIf: [
      "You want a modern, highly polished interface — Freedcamp feels dated next to newer competitors",
      "You need a large third-party integration marketplace",
    ],
    pros: [
      "Free plan has no user, project, or storage-total caps",
      "Very cheap per-user upgrade tiers relative to category leaders",
      "Issue tracker and CRM features add value on Business tier",
    ],
    cons: [
      "Interface and feature velocity lag well behind Asana/ClickUp/Monday",
      "Small per-file upload limit even on paid tiers",
      "Much smaller brand recognition and community",
    ],

    popularityScore: 35,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://freedcamp.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "microsoft-planner",
    name: "Microsoft Planner",
    // DRAFT - review before publish
    tagline: "Task management bundled into Microsoft 365, with paid Plan 1/Plan 3 tiers for Gantt and resource features.",
    logoUrl: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128",
    website: "https://www.microsoft.com/en-us/microsoft-365/business/task-management-software",

    category: "project-management",
    subCategory: "task-management",
    industries: ["agencies", "construction", "healthcare", "nonprofits", "real-estate"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Sold worldwide as part of Microsoft 365 — VERIFY regional pricing/currency and tax handling.",
    useCases: ["task management", "team collaboration", "gantt charts", "resource allocation", "sprint management"],
    pricingModel: "subscription",

    pricing: [
      { name: "Bundled with Microsoft 365", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Basic Planner features (task creation, boards, Teams integration) included at no extra cost within qualifying Microsoft 365 plans"] },
      { name: "Planner Plan 1", priceMonthly: null, priceAnnual: 10, currency: "USD", keyLimits: ["Per user, billed yearly; standalone add-on with premium capabilities"] },
      { name: "Planner and Project Plan 3", priceMonthly: null, priceAnnual: 30, currency: "USD", keyLimits: ["Per user, billed yearly; adds task dependencies, Gantt timelines, sprint management, resource allocation"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No standalone free tier — basic Planner functionality is included inside qualifying Microsoft 365 Business/Enterprise subscriptions you're already paying for, and the premium Plan 1/Plan 3 add-ons are separately priced, billed-yearly, per-user subscriptions.",
    startingPrice: 10,
    currency: "USD",

    keyFeatures: [
      "Grid, board, schedule, and chart views",
      "Deep Microsoft Teams integration",
      "Task dependencies and Gantt timelines (Plan 3)",
      "Sprint management and reporting (Plan 3)",
      "Resource allocation tools (Plan 3)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for organizations already paying for Microsoft 365 who want task management inside the ecosystem they already use — outside a Microsoft-centric organization, dedicated PM tools are generally a better fit.",
    bestFor: [
      "Organizations already standardized on Microsoft 365 and Teams",
      "Teams that want task boards without introducing a new vendor/login",
    ],
    avoidIf: [
      "You're not already in the Microsoft 365 ecosystem — there's little reason to adopt Planner on its own",
      "You want a modern, purpose-built PM interface — Planner is secondary to Microsoft's broader productivity suite",
    ],
    pros: [
      "Included at no extra cost within many existing Microsoft 365 plans",
      "Tight integration with Teams, Outlook, and the wider Microsoft stack",
      "Plan 3 adds real Gantt/resource features for a relatively low per-user add-on price",
    ],
    cons: [
      "Confusing product structure — bundled basic tier plus two separate paid add-on tiers",
      "Less polished and feature-rich than dedicated PM tools at a similar price",
      "Best value only applies if you're already paying for qualifying Microsoft 365 plans",
    ],

    popularityScore: 70,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.microsoft.com/en-us/microsoft-365/business/task-management-software",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "podio",
    name: "Podio",
    // DRAFT - review before publish
    tagline: "Highly customizable work apps, now sold under Progress Software after moving on from Citrix.",
    logoUrl: "https://www.google.com/s2/favicons?domain=podio.com&sz=128",
    website: "https://www.podio.com",

    category: "project-management",
    subCategory: "work-management",
    industries: ["real-estate", "agencies", "construction", "nonprofits"],
    businessSizes: ["small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and data-residency options.",
    useCases: ["custom work apps", "task management", "workflow automation", "team collaboration"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 5 users, max 100 items per organization, 1,000 API calls/hour"] },
      { name: "Plus", priceMonthly: 14, priceAnnual: 11.2, currency: "USD", keyLimits: ["Per user; unlimited items, unlimited client users, light user roles"] },
      { name: "Premium", priceMonthly: 24, priceAnnual: 19.2, currency: "USD", keyLimits: ["Per user; 25,000 automation actions/month, AI Assistant (beta), visual reports"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is capped at 5 users and just 100 items per organization — a very tight ceiling that most real teams will hit almost immediately.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Fully customizable \"apps\" (custom data structures) for any workflow",
      "Workflow automation",
      "Client/guest user roles",
      "Visual reports and dashboards",
      "API access",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams (especially real estate and field-service businesses) that want to build fully custom workflow apps rather than adapt to a fixed task/board model — the free plan's 100-item cap makes it a demo tier at best, not a real starting point.",
    bestFor: [
      "Teams that want to build custom-structured workflow apps (CRM-like, deal pipelines, etc.)",
      "Real estate and field-service businesses with non-standard workflow needs",
    ],
    avoidIf: [
      "You want a simple, ready-made kanban/task tool out of the box — Podio requires building your own structure",
      "You need more than 100 items on the free plan — you'll hit that ceiling almost immediately",
    ],
    pros: [
      "Extremely flexible custom app-building for non-standard workflows",
      "Client/guest user roles included on paid tiers",
      "Workflow automation included at the Premium tier",
    ],
    cons: [
      "Free plan's 100-item cap is unusually restrictive",
      "Requires more setup effort than fixed-template competitors",
      "Smaller, less actively marketed brand since its move to Progress Software",
    ],

    popularityScore: 33,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.progress.com/podio/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "notion",
    name: "Notion",
    // DRAFT - review before publish
    tagline: "Docs, wikis, and databases flexible enough to build your own project-management system inside.",
    logoUrl: "https://www.google.com/s2/favicons?domain=notion.com&sz=128",
    website: "https://www.notion.com",

    category: "project-management",
    subCategory: "work-management",
    industries: ["agencies", "consulting", "freelancers", "ecommerce"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment and data-residency options.",
    useCases: ["task management", "docs and wikis", "databases", "team collaboration", "knowledge management"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["5MB file uploads, 7-day page history, up to 10 external guests"] },
      { name: "Plus", priceMonthly: 10, priceAnnual: 8, currency: "USD", keyLimits: ["Per member; unlimited file uploads, 30-day page history, unlimited guests"] },
      { name: "Business", priceMonthly: 20, priceAnnual: 16, currency: "USD", keyLimits: ["Per member; 90-day page history, Notion Agents, AI Meeting Notes, premium connections"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote; zero data retention with LLM providers, advanced security, SCIM"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is workable for individuals but capped at 5MB file uploads and only 7 days of page history — most real teams move to Plus fairly quickly for the longer history and unlimited uploads.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Flexible databases that can be built into kanban boards, task lists, or trackers",
      "Docs and wikis in the same workspace as tasks",
      "Notion AI features (Business tier and above)",
      "Templates for common PM setups",
      "Deep customization of views (board, table, calendar, timeline)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want docs, wikis, and task tracking in one flexible workspace and don't mind building their own project-management structure rather than using a purpose-built template — dedicated PM tools like Asana or ClickUp will out-of-the-box beat Notion for pure task/board management.",
    bestFor: [
      "Teams that want project tracking living alongside docs and knowledge bases",
      "Users comfortable building/customizing their own database-driven task system",
    ],
    avoidIf: [
      "You want a purpose-built PM tool with native Gantt/workload views out of the box — Notion requires building these yourself",
      "You need robust native reporting/dashboards across many projects",
    ],
    pros: [
      "Extremely flexible — can model almost any workflow with databases",
      "Combines docs, wikis, and task tracking in one workspace",
      "Strong template ecosystem to shortcut setup",
    ],
    cons: [
      "Not a purpose-built PM tool — lacks native Gantt, workload, and portfolio views without add-ons/templates",
      "Free plan's 7-day page history is thin",
      "Performance can lag on very large, heavily-linked workspaces",
    ],

    popularityScore: 91,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.notion.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
];
