import type { AppListing } from "../types";

// Scaffolded via a research pass — 20 well-known Customer Support tools
// spanning helpdesk/ticketing (Zendesk, Freshdesk, Help Scout, Front,
// Kayako, LiveAgent, HappyFox, Zoho Desk, Gladly, Kustomer, Helply/Groove,
// Jira Service Management, Gorgias) and live chat/conversational support
// (Intercom, Tidio, Crisp, Re:amaze, Olark, Chatwoot, LiveChat). CRM tools
// are deliberately excluded — that's a separate category covered elsewhere.
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

export const CUSTOMER_SUPPORT_APPS: AppListing[] = [
  {
    id: "zendesk",
    name: "Zendesk",
    // DRAFT - review before publish
    tagline: "The category-defining helpdesk — ticketing, messaging, and AI agents in one suite most support teams already know.",
    logoUrl: "https://www.google.com/s2/favicons?domain=zendesk.com&sz=128",
    website: "https://www.zendesk.com",

    category: "customer-support",
    subCategory: "helpdesk-ticketing",
    industries: ["agencies", "consulting", "ecommerce", "retail", "healthcare", "hospitality"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Global service with data center options in multiple regions for Enterprise customers — VERIFY current regional data residency list.",
    useCases: ["email and ticket support", "omnichannel customer service", "live chat and messaging", "AI-assisted ticket resolution", "help center / knowledge base"],
    pricingModel: "subscription",

    pricing: [
      { name: "Support Team", priceMonthly: null, priceAnnual: 19, currency: "USD", keyLimits: ["Per agent, billed annually — no separate month-to-month rate was published on the live pricing page; email/ticketing, ticket routing, prebuilt analytics, pre-written responses"] },
      { name: "Suite Team", priceMonthly: null, priceAnnual: 55, currency: "USD", keyLimits: ["Per agent, billed annually; adds AI Agents, Knowledge Base, Action Builder, omnichannel routing, messaging/live chat, telephony"] },
      { name: "Suite Professional", priceMonthly: null, priceAnnual: 115, currency: "USD", keyLimits: ["Per agent, billed annually; marked \"Most Popular\"; adds Admin Copilot, App Builder, Writing Tools, skills-based routing, IVR phone tree"] },
      { name: "Suite Enterprise + Copilot", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — Intelligent Triage, Auto Assist, generative AI for voice, approval workflows, sandbox environment, custom agent roles"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — Zendesk offers only a 14-day free trial (with access to Suite Professional-level features), no credit card required, after which a paid plan is required. All per-agent prices above are the annual-billed (\"paid yearly\") rate; the live pricing page did not surface a separate month-to-month rate to automated fetch despite retrying. Copilot, the Workforce Engagement bundle, and Contact Center are separate paid add-ons on top of seat price.",
    startingPrice: 19,
    currency: "USD",

    keyFeatures: [
      "Ticketing with automations, triggers, and SLA management",
      "Omnichannel support (email, chat, voice, social, messaging)",
      "AI Agents for automated ticket resolution",
      "Built-in knowledge base / help center",
      "Prebuilt analytics and reporting dashboards",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The default choice for teams that want the deepest feature set and largest ecosystem in helpdesk software — the price climbs fast once you need Suite Professional or higher, and there's no free tier to test-drive on your own schedule.",
    bestFor: [
      "Mid-size and enterprise support teams that need omnichannel routing, AI agents, and deep customization",
      "Teams that value the largest talent pool of agents/admins already fluent in the tool",
    ],
    avoidIf: [
      "You're a very small team or solo founder — there's no free tier and entry pricing is higher than many competitors",
      "You want simple, predictable pricing — add-ons (Copilot, Workforce Engagement, Contact Center) stack quickly on top of seat cost",
    ],
    pros: [
      "Extremely mature product with the deepest feature set in the category",
      "Large marketplace of integrations and a huge base of experienced admins/agents",
      "AI Agents and Copilot are genuinely capable, not bolted-on afterthoughts",
    ],
    cons: [
      "No free tier — only a 14-day trial before you must commit to a paid seat",
      "Real feature parity with competitors requires Suite Professional ($115/agent/mo) or higher",
      "Add-on pricing (Copilot, Contact Center, Workforce Engagement) is not included in base seat price",
    ],

    popularityScore: 93,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.zendesk.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "freshdesk",
    name: "Freshdesk",
    // DRAFT - review before publish
    tagline: "Freshworks' helpdesk — a cheaper, simpler Zendesk alternative with a genuinely usable trial and Freddy AI built in.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.freshworks.com&sz=128",
    website: "https://www.freshworks.com/freshdesk/",

    category: "customer-support",
    subCategory: "helpdesk-ticketing",
    industries: ["agencies", "consulting", "ecommerce", "retail", "hospitality"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data center/residency options across regions.",
    useCases: ["email and ticket support", "customer portal / self-service", "knowledge base", "SLA management", "AI-assisted support (Freddy AI)"],
    pricingModel: "subscription",

    pricing: [
      { name: "Growth", priceMonthly: null, priceAnnual: 19, currency: "USD", keyLimits: ["Per agent, billed annually — no separate month-to-month rate was published; ticketing, shared inbox, threads & tasks, customer portal, knowledge base, basic analytics"] },
      { name: "Pro", priceMonthly: null, priceAnnual: 55, currency: "USD", keyLimits: ["Per agent, billed annually; marked \"Most Popular\"; adds multilingual helpdesk, custom dashboards, intelligent routing, multiple SLA policies, external collaborators"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: 89, currency: "USD", keyLimits: ["Per agent, billed annually; adds Freddy AI Insights, skill-based routing, sandbox, agent shift management, audit logs, security controls"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanently free plan — every signup gets a 14-day free trial with full Enterprise-tier access, then must choose a paid plan. Prices above are the annual-billed per-agent rate; Freshworks' live pricing page did not surface a separate month-to-month figure to automated fetch. Freddy AI Agent is billed separately at $49 per 100 sessions on top of seat cost.",
    startingPrice: 19,
    currency: "USD",

    keyFeatures: [
      "Shared team inbox with ticketing and threads",
      "Customer self-service portal and knowledge base",
      "Freddy AI Agent for automated resolution (metered add-on)",
      "Multilingual helpdesk and custom dashboards (Pro+)",
      "Multiple SLA policies and skill-based routing (higher tiers)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want most of Zendesk's core ticketing functionality at a lower entry price and a genuinely generous trial — Freddy AI's per-session billing is worth budgeting for separately before committing.",
    bestFor: [
      "Small-to-mid support teams wanting Zendesk-like ticketing at a lower starting price",
      "Teams that want to trial the full Enterprise feature set before deciding what tier they actually need",
    ],
    avoidIf: [
      "You want AI resolution included in the base price rather than billed per-session as an add-on",
      "You need the very deepest omnichannel/enterprise feature set (Zendesk still leads there)",
    ],
    pros: [
      "Lower entry price than Zendesk for comparable core ticketing functionality",
      "14-day trial gives full Enterprise-tier access, not a crippled preview",
      "Part of the broader Freshworks suite (Freshsales, Freshchat) for teams wanting one vendor",
    ],
    cons: [
      "Freddy AI Agent is a metered add-on ($49/100 sessions), not included in seat price",
      "Only the annual-billed rate is published — true month-to-month pricing wasn't confirmed",
      "Enterprise-tier features (sandbox, audit logs) require the top $89/agent/mo plan",
    ],

    popularityScore: 87,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.freshworks.com/freshdesk/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "help-scout",
    name: "Help Scout",
    // DRAFT - review before publish
    tagline: "Email-first helpdesk that feels like a shared inbox, not a ticketing system — popular with small teams that dislike \"case number\" support.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.helpscout.com&sz=128",
    website: "https://www.helpscout.com",

    category: "customer-support",
    subCategory: "helpdesk-ticketing",
    industries: ["agencies", "consulting", "ecommerce", "nonprofits", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options for HIPAA/Pro-tier customers.",
    useCases: ["shared team inbox", "email support", "live chat", "help center / docs", "SLA and workflow automation"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["5 users, 1 inbox, 1 Docs site — enough to evaluate, not to run a real support team"] },
      { name: "Standard", priceMonthly: 25, priceAnnual: 21, currency: "USD", keyLimits: ["Up to 25 users, 2 inboxes, 1 basic SLA policy, 150 basic workflows; live chat, Instagram & Messenger, AI Inbox assistant"] },
      { name: "Plus", priceMonthly: 45, priceAnnual: 37.8, currency: "USD", keyLimits: ["Up to 50 users, 5 inboxes, 2 advanced SLA policies, 500 advanced workflows, 25 light users included; round robin routing, Salesforce/Jira/HubSpot integration"] },
      { name: "Pro", priceMonthly: 75, priceAnnual: 63, currency: "USD", keyLimits: ["Unlimited users (10 minimum), 10 inboxes, unlimited workflows/SLA policies, 50 light users; SSO/SAML, HIPAA compliance, dedicated onboarding"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan genuinely caps at 5 users, 1 inbox, and 1 Docs site — usable for a very small team's actual support, not just a trial shell. Paid plans additionally offer a 15-day trial with no credit card required. AI Answers is a separate add-on billed at $0.75 per resolution, with a 3-month free trial included.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Shared inbox that reads like email, not a ticket queue",
      "Live chat, Instagram, and Messenger channels",
      "Docs knowledge base with a public help site",
      "Workflow automation and SLA policies",
      "AI Inbox assistant and AI Answers add-on",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small teams and startups that want support to feel personal and email-like rather than ticket-number impersonal — it gets expensive fast per-user once a team grows past the free plan's 5-user cap.",
    bestFor: [
      "Small teams and startups that want a shared-inbox feel over formal ticketing",
      "Solo founders and freelancers who can run entirely on the free 5-user plan",
    ],
    avoidIf: [
      "You need deep omnichannel routing or enterprise-scale automation (Zendesk/Freshdesk go deeper)",
      "Your team will quickly outgrow 5 users — Standard's $25/user/mo adds up fast for larger teams",
    ],
    pros: [
      "Genuinely usable free tier, not just a crippled trial",
      "Clean, email-like UX that's easy to onboard non-technical teams onto",
      "Docs (knowledge base) and workflows are included from Standard, not gated to top tier",
    ],
    cons: [
      "Per-user pricing gets expensive for larger support teams versus flat/ticket-based competitors",
      "Less omnichannel depth (no native voice) than full-suite helpdesks",
      "AI Answers is billed per resolution on top of the seat price",
    ],

    popularityScore: 78,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.helpscout.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "front",
    name: "Front",
    // DRAFT - review before publish
    tagline: "Collaborative shared inbox that treats support (and sales/ops) email like a team sport, with strong automation rules.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.front.com&sz=128",
    website: "https://www.front.com",

    category: "customer-support",
    subCategory: "helpdesk-ticketing",
    industries: ["agencies", "consulting", "ecommerce", "retail"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options for Enterprise customers.",
    useCases: ["shared team inbox", "email support", "omnichannel support", "workflow automation rules", "internal collaboration on customer messages"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter", priceMonthly: 25, priceAnnual: 19, currency: "USD", keyLimits: ["Up to 10 seats; single-channel support, shared inbox, ticketing, up to 10 automation rules, basic analytics, public knowledge base"] },
      { name: "Professional", priceMonthly: 65, priceAnnual: 49.4, currency: "USD", keyLimits: ["Up to 50 seats; omnichannel support, up to 20 automation rules, advanced analytics, multiple workspaces, SSO/SCIM"] },
      { name: "Enterprise", priceMonthly: 105, priceAnnual: 79.8, currency: "USD", keyLimits: ["Unlimited seats; smart rules, unlimited rules/macros, multi-language knowledge base, custom roles, AI Copilot/QA/CSAT included"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — Front offers a 14-day free trial (Professional-plan features, no credit card required), then requires a paid seat. Annual prices reflect Front's stated ~24% annual-billing discount off the monthly rate. AI add-ons (Autopilot, Copilot, Smart QA, Smart CSAT) are priced and billed separately from seat cost on Starter/Professional; only Enterprise bundles Copilot/QA/CSAT in.",
    startingPrice: 25,
    currency: "USD",

    keyFeatures: [
      "Shared inbox built for team collaboration on email/messages",
      "Automation rules and smart routing",
      "Omnichannel support (Professional+)",
      "Multiple workspaces and custom roles (higher tiers)",
      "AI Copilot, Smart QA, and Smart CSAT add-ons",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want a shared inbox with strong internal-collaboration features (comments, assignments, @mentions) rather than a formal ticketing queue — AI features are priced as add-ons except on the pricier Enterprise tier.",
    bestFor: [
      "Teams that want email/message collaboration features (internal comments, @mentions) alongside customer support",
      "Growing teams that want automation rules without jumping straight to enterprise-tier software",
    ],
    avoidIf: [
      "You want AI QA/CSAT/Copilot bundled into a lower tier rather than billed as separate add-ons",
      "You need the deepest ticketing-specific workflow features (SLA escalation trees, etc.) that dedicated helpdesks offer",
    ],
    pros: [
      "Strong internal collaboration tools (comments, assignments) layered on top of customer messages",
      "Clean, fast UI that many teams find more pleasant than traditional ticket queues",
      "Automation rules scale meaningfully from Starter through Enterprise",
    ],
    cons: [
      "No free tier — only a 14-day trial before requiring payment",
      "AI features (Copilot, Smart QA, Smart CSAT) cost extra except on the priciest Enterprise plan",
      "Seat cap of 10 on Starter forces an upgrade quickly for growing teams",
    ],

    popularityScore: 74,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.front.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "kayako",
    name: "Kayako",
    // DRAFT - review before publish
    tagline: "Once a Zendesk alternative, now repositioned around outcome-based AI ticket resolution rather than seat-based helpdesk plans.",
    logoUrl: "https://www.google.com/s2/favicons?domain=kayako.com&sz=128",
    website: "https://kayako.com",

    category: "customer-support",
    subCategory: "helpdesk-ticketing",
    industries: ["agencies", "consulting", "ecommerce", "retail"],
    businessSizes: ["small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current data center/region availability.",
    useCases: ["email and ticket support", "AI-driven ticket resolution", "live chat widget", "knowledge base", "unified inbox"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier found. Kayako has shifted to an outcome-based pricing model: its \"Kay AI\" agent bills $1 per resolved ticket with no seat or setup fees, while the full \"Kayako One\" platform (unified inbox, ticketing, knowledge base, live chat, automation) is sold via custom quote only. No published flat monthly starting price or per-seat number exists to record with confidence.",
    startingPrice: "VERIFY",
    currency: "USD",

    keyFeatures: [
      "Kay AI agent for end-to-end ticket resolution (refunds, account changes, etc.)",
      "Unified inbox across channels",
      "Ticketing with automation rules",
      "Live chat widget",
      "Knowledge base",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "An interesting bet for teams comfortable paying purely for resolved outcomes rather than seats, but the lack of any published flat starting price makes it hard to budget for without a sales conversation.",
    bestFor: [
      "Teams intrigued by pay-per-resolution AI pricing instead of per-agent seat costs",
      "Support orgs willing to go through a custom quote process for the full platform",
    ],
    avoidIf: [
      "You want transparent, self-serve pricing you can compare without contacting sales",
      "You prefer predictable flat/per-seat billing over variable per-resolution costs",
    ],
    pros: [
      "Pay-per-resolution model removes seat-count as a cost lever",
      "No setup fees mentioned for the Kay AI product",
      "Broad integration list claimed (Slack, Stripe, Shopify, Zendesk, Salesforce, Twilio, HubSpot)",
    ],
    cons: [
      "No self-serve starting price for the full helpdesk platform — requires a sales quote",
      "Per-resolution billing is harder to forecast than flat monthly plans",
      "Smaller market presence than Zendesk/Freshdesk, historically has changed pricing models more than once",
    ],

    popularityScore: 48,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://kayako.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "liveagent",
    name: "LiveAgent",
    // DRAFT - review before publish
    tagline: "All-in-one helpdesk bundling ticketing, live chat, and call center — priced lower than Zendesk/Freshdesk at comparable tiers.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.liveagent.com&sz=128",
    website: "https://www.liveagent.com",

    category: "customer-support",
    subCategory: "helpdesk-ticketing",
    industries: ["agencies", "consulting", "ecommerce", "retail"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current data center/region availability.",
    useCases: ["email and ticket support", "live chat", "call center / IVR", "social media support channels", "knowledge base"],
    pricingModel: "subscription",

    pricing: [
      { name: "Small Business", priceMonthly: 19, priceAnnual: 15, currency: "USD", keyLimits: ["Base per-agent rate; ticketing, live chat, knowledge base, AI tools"] },
      { name: "Medium Business", priceMonthly: 35, priceAnnual: 29, currency: "USD", keyLimits: ["Adds call center and IVR capabilities"] },
      { name: "Large Business", priceMonthly: 59, priceAnnual: 49, currency: "USD", keyLimits: ["Marked \"Most Popular\"; adds social media channels (Facebook, Instagram, X, WhatsApp, Telegram, Viber)"] },
      { name: "Enterprise", priceMonthly: 85, priceAnnual: 69, currency: "USD", keyLimits: ["Adds dedicated account manager, priority support, custom billing arrangements"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier — LiveAgent offers a 30-day free trial with no credit card required, after which a paid plan is required. Figures above are LiveAgent's stated base per-agent rates; at verification time the site was also running a time-limited \"Summer 2026\" promotion advertising roughly 33% off (e.g. Small Business at $13/mo instead of $19), which will not reflect the standard list price once that promotion ends.",
    startingPrice: 19,
    currency: "USD",

    keyFeatures: [
      "Ticketing with a universal inbox",
      "Live chat widget with proactive chat invitations",
      "Built-in call center and IVR (Medium+)",
      "Social media channel support (Large+)",
      "Knowledge base and AI-assisted tools",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for cost-conscious small businesses that want ticketing, chat, and call center bundled together without paying Zendesk-level per-agent prices — the UI is more utilitarian than category leaders.",
    bestFor: [
      "Small businesses wanting phone/call-center support bundled with ticketing and chat in one price",
      "Teams price-sensitive to per-agent cost who don't need the polish of Zendesk/Intercom",
    ],
    avoidIf: [
      "You want the most modern, polished agent UI — LiveAgent's interface is functional but dated compared to newer entrants",
      "You need deep native AI resolution comparable to Freddy AI or Fin",
    ],
    pros: [
      "Genuinely lower per-agent pricing than Zendesk or Freshdesk at comparable feature levels",
      "Call center/IVR bundled in from the Medium tier, not a pricey add-on",
      "30-day free trial is longer than most competitors' 14-day standard",
    ],
    cons: [
      "Interface feels dated next to Intercom, Front, or Help Scout",
      "Live chat and multi-channel features are locked behind the higher Large/Enterprise tiers",
      "Pricing page currently shows a time-limited promotional discount that inflates apparent value versus list price",
    ],

    popularityScore: 63,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.liveagent.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "happyfox",
    name: "HappyFox",
    // DRAFT - review before publish
    tagline: "Agent-priced (not per-agent) helpdesk aimed at teams wanting a flat-fee alternative to per-seat billing at scale.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.happyfox.com&sz=128",
    website: "https://www.happyfox.com",

    category: "customer-support",
    subCategory: "helpdesk-ticketing",
    industries: ["agencies", "consulting", "ecommerce", "retail"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data center/region availability.",
    useCases: ["email and ticket support", "customer portal / self-service", "knowledge base", "workflow automation", "AI contact center (separate product)"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "No standing free tier for the core Help Desk product — HappyFox does advertise a limited-time \"free for startups\" promotional program (unlimited users, 50,000 AI credits, for a full year, for qualifying startups) plus a 14-day free trial on all paid plans, but exact ongoing plan prices could not be retrieved: the pricing table renders via JavaScript, and three separate automated fetch attempts (main pricing page, /help-desk-price/, and a guessed /pricing/help-desk/ path) each returned only marketing copy or a 404, never dollar figures.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Ticketing with SLA and workflow automation",
      "Customer self-service portal and knowledge base",
      "Flat-fee unlimited-agent plan option (per vendor's own description)",
      "Separate AI Contact Center / Autopilot / Chatbot products",
      "Non-profit and education discounts",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Positioned as a flat-fee alternative to per-agent helpdesk pricing for larger teams, but the live pricing page is fully JavaScript-rendered and its actual dollar figures couldn't be confirmed — worth a manual look before trusting any third-party quoted number.",
    bestFor: [
      "Larger support teams (20+ agents) who want to explore flat annual fee plans instead of per-seat billing",
      "Startups that may qualify for HappyFox's free-for-a-year startup program",
    ],
    avoidIf: [
      "You want to compare exact pricing without visiting the site directly in a browser",
      "You need a well-known brand with a large public integration marketplace",
    ],
    pros: [
      "Offers an unusual flat-fee, unlimited-agent pricing option not common among helpdesk competitors",
      "14-day free trial requires no credit card",
      "Dedicated free program for qualifying startups",
    ],
    cons: [
      "Pricing table is not accessible to automated verification — figures require a manual site visit",
      "Smaller brand recognition and ecosystem than Zendesk/Freshdesk",
      "Separate pricing for Chatbot, AI Contact Center, and Autopilot adds complexity to total cost of ownership",
    ],

    popularityScore: 52,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.happyfox.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "zoho-desk",
    name: "Zoho Desk",
    // DRAFT - review before publish
    tagline: "Budget-friendly helpdesk from the Zoho ecosystem, with the deepest tier ladder in the category and strong Zoho-suite integration.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.zoho.com&sz=128",
    website: "https://www.zoho.com/desk/",

    category: "customer-support",
    subCategory: "helpdesk-ticketing",
    industries: ["agencies", "consulting", "ecommerce", "retail", "real-estate"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global", "asia"],
    regionNotes: "Pricing displayed to automated fetch was consistently in Indian Rupees (INR) rather than USD, even when requesting US-specific URL paths — likely region-detection behavior on Zoho's pricing infrastructure; other regions/currencies may see different figures.",
    useCases: ["email and ticket support", "live chat (via Zoho SalesIQ)", "customer portal / self-service", "multi-department support", "Zoho ecosystem integration"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free Edition", priceMonthly: 0, priceAnnual: 0, currency: "INR", keyLimits: ["3 user licenses; email ticketing essentials only"] },
      { name: "Express", priceMonthly: null, priceAnnual: 420, currency: "INR", keyLimits: ["Per user, billed annually (₹420/user/mo); email, social media, web forms, AI agents, workflows, contact management"] },
      { name: "Standard", priceMonthly: null, priceAnnual: 800, currency: "INR", keyLimits: ["Per user, billed annually (₹800/user/mo); adds business/instant messaging, answer bot, community forum, knowledge base, custom reports"] },
      { name: "Professional", priceMonthly: null, priceAnnual: 1400, currency: "INR", keyLimits: ["Per user, billed annually (₹1,400/user/mo); marked \"Most Popular\"; adds telephony, Zia AI, blueprints, multi-department support, multilingual help center"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: 2400, currency: "INR", keyLimits: ["Per user, billed annually (₹2,400/user/mo); adds live chat via Zoho SalesIQ, skill-based assignment, multi-level IVR, multi-brand help center, sandbox"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free Edition covers up to 3 user licenses with email-ticketing essentials only — enough for a very small team, not a full-featured plan. All paid-tier prices are quoted in Indian Rupees on Zoho's live pricing page; repeated automated fetches (including a US-region URL path) could not get the page to display USD pricing, and only the annual-billed per-user rate is shown, with no separate month-to-month figure. A 15-day free trial is available on all paid plans, with up to 34% savings advertised for annual vs. monthly billing.",
    startingPrice: 0,
    currency: "INR",

    keyFeatures: [
      "Multi-channel ticketing (email, social, web forms)",
      "Zia AI assistant and answer bot",
      "Live chat via Zoho SalesIQ integration (Enterprise)",
      "Blueprints for structured support workflows",
      "Deep integration with the wider Zoho One suite (CRM, SalesIQ, etc.)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams already invested in the Zoho ecosystem, or budget-conscious teams in markets where Zoho's INR-denominated pricing translates to real savings — international USD pricing wasn't confirmed, so verify local currency and rate before committing.",
    bestFor: [
      "Existing Zoho One / Zoho CRM customers wanting native helpdesk integration",
      "Budget-conscious teams comfortable confirming their own regional pricing directly with Zoho",
    ],
    avoidIf: [
      "You need confirmed USD (or your local currency) pricing before evaluating — this listing's figures are INR as shown to automated fetch",
      "You're not in the Zoho ecosystem and don't need its cross-product integration benefits",
    ],
    pros: [
      "Deepest tier ladder in the category, from a real free plan up through Enterprise",
      "Strong native integration with Zoho CRM, SalesIQ, and the wider Zoho One suite",
      "Zia AI and answer bot included without a separate metered add-on fee",
    ],
    cons: [
      "Pricing page shown to automated verification was INR-only — confirm your actual regional currency/rate directly before trusting a USD conversion",
      "Only the annual-billed per-user rate is published; true month-to-month pricing wasn't confirmed",
      "Live chat requires the separate Zoho SalesIQ product, only bundled at Enterprise",
    ],

    popularityScore: 76,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.zoho.com/desk/pricing.html",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "gladly",
    name: "Gladly",
    // DRAFT - review before publish
    tagline: "Person-centric, agent-focused support platform built around a single lifelong customer conversation rather than per-ticket cases.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.gladly.ai&sz=128",
    website: "https://www.gladly.ai",

    category: "customer-support",
    subCategory: "helpdesk-ticketing",
    industries: ["ecommerce", "retail", "hospitality"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability and data residency options.",
    useCases: ["omnichannel customer service", "person-centric conversation history", "AI-assisted agent support", "voice/phone support", "retail and ecommerce support"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier, trial, or dollar figures of any kind are published on Gladly's pricing page; it is purely a demo-request funnel (\"Get a demo\", \"Try it yourself\", \"Schedule a live tour\") with case-study and cost-savings messaging but no self-serve pricing table — consistent with a fully sales-led enterprise pricing model (comparable to Oracle NetSuite or Workday elsewhere in this directory).",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Single customer-centric conversation timeline (not per-ticket)",
      "Omnichannel support (voice, chat, email, SMS)",
      "AI-assisted agent tools",
      "Built for high-volume retail/ecommerce support",
      "Agent-experience-focused UI",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A premium, enterprise-oriented platform popular with larger retail/ecommerce brands that want a person-centric support model — there's no self-serve pricing at all, so budget expectations require a sales conversation from day one.",
    bestFor: [
      "Mid-market and enterprise retail/ecommerce brands with high support volume",
      "Teams that specifically want a person-centric (not ticket-centric) support model",
    ],
    avoidIf: [
      "You want to compare self-serve pricing without booking a sales call",
      "You're a small team or solo operator — Gladly is positioned and priced for larger support orgs",
    ],
    pros: [
      "Distinctive person-centric conversation model that many agents and customers prefer over ticket numbers",
      "Strong reputation among retail/ecommerce brands for agent experience",
      "Omnichannel (voice, chat, email, SMS) in one unified timeline",
    ],
    cons: [
      "Zero public pricing — every evaluation starts with a sales demo, no self-serve comparison possible",
      "Positioned and likely priced for mid-market/enterprise budgets, not small teams",
      "Harder to quickly compare cost against self-serve competitors like Zendesk or Freshdesk",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.gladly.ai/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "kustomer",
    name: "Kustomer",
    // DRAFT - review before publish
    tagline: "CRM-flavored customer service platform (now part of Meta) built around unified customer profiles and heavy automation.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.kustomer.com&sz=128",
    website: "https://www.kustomer.com",

    category: "customer-support",
    subCategory: "helpdesk-ticketing",
    industries: ["ecommerce", "retail", "hospitality"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability and data residency options.",
    useCases: ["omnichannel customer service", "unified customer profiles", "AI-assisted support (Concierge, Envoy)", "workflow automation", "high-volume ecommerce support"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No dollar figures, plan names, or free-tier/trial details are published. Kustomer's pricing page describes feature tiers and hard usage limits (e.g. 100M custom objects, 2,000 RPM API rate limit, 300 brands, 10 queues/team) but shows no prices anywhere and funnels every visitor to \"Schedule Demo\" — consistent with a fully sales-led enterprise pricing model.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Unified customer profile across channels and history",
      "AI Concierge and Envoy for automated resolution",
      "Custom objects and deep data modeling",
      "Omnichannel: chat, email, text, voice, WhatsApp, Instagram, Facebook",
      "Extensive workflow/business-rule automation",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A CRM-like, data-rich support platform (owned by Meta/Facebook) best suited to larger ecommerce and retail brands that need deep customer data modeling — like Gladly, there's no public pricing to compare against self-serve competitors.",
    bestFor: [
      "Larger ecommerce/retail brands wanting a CRM-like unified customer profile inside their support tool",
      "Teams needing heavy channel coverage (WhatsApp, Instagram, Facebook) and custom data objects",
    ],
    avoidIf: [
      "You want to compare pricing without a sales conversation",
      "You're a small team — Kustomer's feature depth and likely pricing are aimed at larger organizations",
    ],
    pros: [
      "Rich customer data model (custom objects) beyond typical ticket fields",
      "Strong omnichannel coverage including WhatsApp and Instagram out of the box",
      "AI-assisted resolution (Concierge/Envoy) built into the core product",
    ],
    cons: [
      "Zero public pricing — no way to self-serve compare cost against competitors",
      "Likely priced for mid-market/enterprise budgets given its feature depth",
      "Being owned by Meta may be a consideration for some data-privacy-sensitive buyers — VERIFY current ownership/data-handling terms",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.kustomer.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "helply",
    name: "Helply (formerly Groove)",
    // DRAFT - review before publish
    tagline: "Pay-per-resolved-ticket helpdesk with an AI teammate baked into every conversation — the rebrand of the long-running Groove/GrooveHQ helpdesk.",
    logoUrl: "https://www.google.com/s2/favicons?domain=helply.com&sz=128",
    website: "https://helply.com",

    category: "customer-support",
    subCategory: "helpdesk-ticketing",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability.",
    useCases: ["email and ticket support", "AI-driven ticket resolution", "churn/upsell detection", "workflow automation"],
    pricingModel: "subscription",

    pricing: [
      { name: "Pay-per-ticket", priceMonthly: null, priceAnnual: 250, currency: "USD", keyLimits: ["$1 per resolved ticket, unlimited seats, no per-agent fee; 250-ticket/month minimum commitment billed annually (~$3,000/yr, ≈$250/mo equivalent)"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier or free trial disclosed on the live pricing page. groovehq.com now permanently redirects (308) to helply.com, indicating the long-running Groove/GrooveHQ helpdesk has been rebranded/relaunched as Helply with an entirely new outcome-based pricing model — $1 per resolved ticket with unlimited seats and no per-agent fee — replacing Groove's old flat per-user plans. There is a 250-ticket/month minimum, billed annually at roughly $3,000/year.",
    startingPrice: 250,
    currency: "USD",

    keyFeatures: [
      "AI teammate embedded in every ticket",
      "Unlimited agent seats at no extra seat cost",
      "Churn detection and upsell identification",
      "Workflow automation and smart escalations",
      "Knowledge base and analytics",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "An interesting bet for small teams with unpredictable headcount (unlimited seats, pay only per resolved ticket) but the rebrand from Groove means longtime Groove customers and reviews may not reflect the current product or pricing model — verify recent reviews specifically for Helply, not old Groove ones.",
    bestFor: [
      "Small teams with fluctuating agent headcount who'd rather pay per resolved ticket than per seat",
      "Former Groove customers evaluating whether the rebrand and new pricing model still fit",
    ],
    avoidIf: [
      "You have high ticket volume where per-ticket billing would exceed flat per-seat pricing elsewhere",
      "You want a long, well-reviewed track record under the current brand name — Helply is a recent rebrand",
    ],
    pros: [
      "Unlimited seats removes the per-agent cost penalty of hiring more support staff",
      "Simple, transparent single pricing model — no tier ladder to compare",
      "AI teammate included in every ticket rather than a separate metered add-on",
    ],
    cons: [
      "Recent rebrand from Groove to Helply means historical reviews/reputation may not reflect the current product",
      "250-ticket/month minimum and annual billing commitment reduce flexibility for very low-volume teams",
      "No free tier or trial disclosed, unlike most competitors in this category",
    ],

    popularityScore: 44,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://helply.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "jira-service-management",
    name: "Jira Service Management",
    // DRAFT - review before publish
    tagline: "Atlassian's IT/customer service desk built on the Jira engine — strong for teams already living in Jira/Confluence.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.atlassian.com&sz=128",
    website: "https://www.atlassian.com/software/jira/service-management",

    category: "customer-support",
    subCategory: "helpdesk-ticketing",
    industries: ["agencies", "consulting"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options for Enterprise/Data Residency customers.",
    useCases: ["IT and customer service ticketing", "SLA management", "knowledge base", "asset/configuration management", "workflow automation"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY — Atlassian is widely known to offer a free tier and paid Standard/Premium/Enterprise plans for Jira Service Management, but the live pricing page content returned to automated fetch was consistently truncated before reaching the pricing table across multiple attempts (the same issue documented for plain Jira Software pricing elsewhere in this directory) — no dollar figures or exact free-tier limits could be confirmed directly.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Ticketing built on the Jira issue-tracking engine",
      "SLA management and reporting",
      "Knowledge base (via Confluence integration)",
      "Asset and configuration management (higher tiers)",
      "Deep integration with Jira Software and Confluence",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for organizations already running Jira/Confluence for engineering who want their IT or customer service desk on the same platform — the live pricing page repeatedly failed to load for automated verification, so confirm current tiers directly before trusting any cited figure.",
    bestFor: [
      "Teams already using Jira Software/Confluence who want a unified Atlassian toolchain",
      "IT service management use cases as much as pure customer support",
    ],
    avoidIf: [
      "You're not already in the Atlassian ecosystem — the UI and data model are optimized for Jira-native teams",
      "You want a support-tool-first product rather than an IT-ticketing tool adapted for customer service",
    ],
    pros: [
      "Seamless integration with Jira Software and Confluence for teams already using them",
      "Strong ITSM feature set (asset management, change management) beyond typical customer-support helpdesks",
      "Backed by Atlassian's scale and long product track record",
    ],
    cons: [
      "Pricing page was inaccessible to automated verification — confirm current tiers directly before trusting third-party figures",
      "Can feel IT-ops-oriented rather than purpose-built for customer-facing support teams",
      "Jira's broader UI complexity can be a learning curve for non-technical support agents",
    ],

    popularityScore: 79,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.atlassian.com/software/jira/service-management/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "intercom",
    name: "Intercom",
    // DRAFT - review before publish
    tagline: "Messenger-first conversational support platform, now built around Fin — Intercom's per-resolution AI agent.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.intercom.com&sz=128",
    website: "https://www.intercom.com",

    category: "customer-support",
    subCategory: "live-chat",
    industries: ["agencies", "consulting", "ecommerce", "retail"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options (US vs EU hosting).",
    useCases: ["live chat / messenger support", "AI-driven ticket resolution (Fin)", "help center", "proactive/in-app messaging", "omnichannel ticketing"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier — a 14-day free trial is offered with no credit card required. Per-seat pricing for the three published plans (Essential/Advanced/Expert) is hidden behind an interactive pricing calculator that renders via JavaScript; automated fetch returned only placeholder digits, not real seat prices. The one figure confirmed directly on the page is the Fin AI Agent add-on: $0.99 per resolved conversation (\"outcome\"), billed on top of seat cost and also purchasable standalone for teams on other helpdesks.",
    startingPrice: "VERIFY",
    currency: "USD",

    keyFeatures: [
      "Messenger widget for live chat and in-app messaging",
      "Fin AI Agent for automated resolution (pay-per-outcome)",
      "Shared inbox and ticketing",
      "Proactive/targeted messaging and product tours",
      "Multilingual, multibrand help center (higher tiers)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best known for its polished messenger widget and Fin AI resolution, but current seat pricing is hidden behind an interactive calculator that couldn't be verified — the only hard number available is Fin's $0.99-per-resolved-conversation add-on price.",
    bestFor: [
      "Teams that want a best-in-class chat/messenger widget with proactive, in-app messaging",
      "Support orgs willing to adopt Fin's pay-per-resolution AI pricing alongside seat costs",
    ],
    avoidIf: [
      "You need to compare exact seat pricing without going through Intercom's sales/calculator flow",
      "You're budget-sensitive to AI costs — Fin's $0.99/outcome can add up fast at high ticket volume",
    ],
    pros: [
      "Widely regarded as the most polished messenger/chat widget in the category",
      "Fin AI Agent is well-reviewed for genuine resolution quality, not just chatbot theater",
      "Strong proactive messaging and in-app product tour capabilities beyond pure support",
    ],
    cons: [
      "Seat pricing isn't published as static numbers — requires the interactive calculator or a sales conversation",
      "Fin's per-outcome billing ($0.99/resolution) is a real additional cost on top of seat price",
      "Historically positioned at a premium price point versus Zendesk/Freshdesk for comparable seat counts",
    ],

    popularityScore: 89,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.intercom.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "gorgias",
    name: "Gorgias",
    // DRAFT - review before publish
    tagline: "Ecommerce-focused helpdesk that ties tickets directly to Shopify orders, with AI Agent billed per resolution.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.gorgias.com&sz=128",
    website: "https://www.gorgias.com",

    category: "customer-support",
    subCategory: "helpdesk-ticketing",
    industries: ["ecommerce", "retail"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options.",
    useCases: ["ecommerce order-linked support", "email and ticket support", "AI-driven ticket resolution", "live chat widget", "SMS/voice support (add-on)"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY — Gorgias's page confirms pricing scales with monthly ticket volume (stated to range \"from 50 to 5,000 tickets a month\") rather than per-agent seats, with its AI Agent billed separately per resolved conversation, but the actual pricing table (plan names, ticket-volume breakpoints, and dollar amounts) renders dynamically and did not appear in two separate automated fetch attempts. A free signup is mentioned but it's unclear whether that means a genuine free plan or simply a no-cost start to a trial.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Tickets linked directly to Shopify/ecommerce order data",
      "AI Agent for automated resolution (pay-per-resolution)",
      "Live chat widget",
      "Voice and SMS support (metered add-ons)",
      "Revenue-attribution reporting for support-driven sales",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The go-to helpdesk for Shopify/ecommerce brands that want support tickets tied directly to order data — pricing scales with ticket volume rather than seats, but exact breakpoints and dollar figures weren't retrievable from the live page.",
    bestFor: [
      "Shopify and other ecommerce brands wanting order data inside every support ticket",
      "Teams that want AI resolution billed per outcome rather than a flat add-on fee",
    ],
    avoidIf: [
      "You're not an ecommerce business — Gorgias's core value proposition is order-linked support",
      "You need to compare exact ticket-volume pricing breakpoints without visiting the live site directly",
    ],
    pros: [
      "Deep, purpose-built ecommerce integrations (Shopify, order data, revenue attribution)",
      "Ticket-volume-based pricing (not per-agent) can favor teams with many agents but moderate ticket counts",
      "AI Agent pay-per-resolution avoids a flat AI tax for low-AI-usage teams",
    ],
    cons: [
      "Live pricing table could not be confirmed via automated fetch across two attempts — figures require a manual site visit",
      "Less useful for non-ecommerce support teams than general-purpose helpdesks",
      "Voice/SMS add-ons introduce additional variable costs beyond the base plan",
    ],

    popularityScore: 71,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.gorgias.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "tidio",
    name: "Tidio",
    // DRAFT - review before publish
    tagline: "Live chat and helpdesk combo aimed at small ecommerce sites, built around the Lyro AI chatbot.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.tidio.com&sz=128",
    website: "https://www.tidio.com",

    category: "customer-support",
    subCategory: "live-chat",
    industries: ["ecommerce", "retail", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options.",
    useCases: ["live chat widget", "AI chatbot support (Lyro)", "email ticketing", "automated flows / triggers", "small ecommerce support"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["50 billable conversations/mo, 50 Lyro AI conversations (lifetime), basic live chat & ticketing, 100 Flows visitor reach"] },
      { name: "Starter", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["Quoted figures conflicted between monthly and annual-equivalent pricing across repeated live-page fetches — not recorded with confidence"] },
      { name: "Growth", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] },
      { name: "Plus", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["Base fee reported around $300/mo plus variable usage-based fees — exact current figure not confirmed"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is confirmed at 50 billable conversations/month plus 50 lifetime Lyro AI conversations — genuinely free, not just a time-limited trial. However, paid-tier (Starter/Growth/Plus) dollar figures returned inconsistently across repeated fetches of the same live pricing page: one pass reported $24.17/mo as the plain monthly rate, a second pass reported the identical $24.17 as the annual-billed monthly-equivalent — so which billing mode that number actually reflects couldn't be confirmed with confidence.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Live chat widget with visitor tracking",
      "Lyro AI chatbot for automated responses",
      "Email ticketing alongside chat",
      "Automated Flows (visitor-triggered messages)",
      "Mobile SDK (higher tiers)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "A reasonable low-cost entry point for small ecommerce sites wanting live chat plus a basic AI chatbot on a real free plan — the paid-tier pricing on the live site was inconsistent between fetch attempts, so confirm current numbers directly before quoting them.",
    bestFor: [
      "Small ecommerce sites and solo operators wanting free/cheap live chat with basic AI chatbot coverage",
      "Teams comfortable starting on the genuinely free 50-conversation plan before evaluating paid tiers",
    ],
    avoidIf: [
      "You need confirmed paid-tier pricing today — the live page returned conflicting monthly/annual figures across attempts",
      "You need deep ticketing/omnichannel depth — Tidio is chat/chatbot-first, not a full helpdesk replacement",
    ],
    pros: [
      "Free plan is real and usable for very light support volume, not just a trial",
      "Lyro AI chatbot is a relatively low-cost way to add basic automated responses",
      "Purpose-built for small ecommerce sites rather than enterprise support orgs",
    ],
    cons: [
      "Paid-tier pricing shown by the live site was internally inconsistent between two separate checks",
      "Less depth than dedicated helpdesks for complex multi-channel ticketing workflows",
      "Plus tier's usage-based fees on top of a ~$300/mo base add pricing complexity at scale",
    ],

    popularityScore: 66,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.tidio.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "crisp",
    name: "Crisp",
    // DRAFT - review before publish
    tagline: "European live-chat-and-inbox platform with a genuinely free forever plan and an AI-first paid tier.",
    logoUrl: "https://www.google.com/s2/favicons?domain=crisp.chat&sz=128",
    website: "https://crisp.chat",

    category: "customer-support",
    subCategory: "live-chat",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global", "europe"],
    regionNotes: "France-based (Nantes) with a genuinely global customer base; VAT applied based on business status and location for EU customers.",
    useCases: ["live chat widget", "shared email inbox", "omnichannel messaging (WhatsApp, Instagram, SMS)", "AI-assisted responses", "knowledge base"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["2 agent seats, 100 customer profiles; website chat widget, shared inbox, mobile/desktop apps, e-commerce integrations"] },
      { name: "Mini", priceMonthly: 45, priceAnnual: null, currency: "USD", keyLimits: ["4 agent seats included ($10/mo per additional seat), 5,000 customer profiles, ~$5 AI credits (~90 automated conversations); shared email inbox, custom email domain, unlimited data retention"] },
      { name: "Essentials", priceMonthly: 95, priceAnnual: null, currency: "USD", keyLimits: ["10 agent seats, 50,000 customer profiles, ~$25 AI credits (~450 conversations); omnichannel inbox (WhatsApp, Instagram, SMS, Line, Viber), workflow automation, knowledge base"] },
      { name: "Plus", priceMonthly: 295, priceAnnual: null, currency: "USD", keyLimits: ["20+ agent seats, 200,000 customer profiles, ~$75 AI credits (~1,350 conversations); marked \"Best value\"; unlimited task automations, ticketing, 100+ integrations, white labelling"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; dedicated onboarding, personalized SLA, custom features, team training"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan genuinely includes 2 agent seats and 100 customer profiles at $0/mo forever, with the live chat widget and shared inbox — a real usable starting point, not a stripped trial. Paid plans (Mini/Essentials/Plus) show only monthly pricing on the live page; Crisp confirms yearly billing is available as an in-app toggle after signup but does not publish the discounted annual rate on the pricing page itself. VAT is not included and is applied based on business status/location.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Live chat widget with unlimited data retention on paid plans",
      "Shared email inbox alongside chat",
      "Omnichannel messaging (WhatsApp, Instagram, SMS, Line, Viber)",
      "AI credits for automated conversation handling",
      "Ticketing and workflow automation (Essentials+)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small teams and agencies that want a genuinely free, forever-usable chat/inbox plan with room to grow into omnichannel messaging — the AI credit system adds a metered cost layer worth understanding before scaling usage.",
    bestFor: [
      "Small teams and agencies wanting free live chat with a real (not trial) free tier",
      "European businesses wanting a vendor based in the EU for data-residency comfort",
    ],
    avoidIf: [
      "You need a published annual-billing discount rate before signing up — Crisp only reveals it after you subscribe monthly",
      "Your team exceeds ~20 agents and needs seat pricing without an Enterprise custom quote",
    ],
    pros: [
      "Free plan is genuinely usable, not a crippled trial",
      "Omnichannel messaging (WhatsApp, Instagram, SMS) included from the mid Essentials tier",
      "AI credit model lets light users pay less than a flat per-seat AI tax",
    ],
    cons: [
      "Annual billing discount isn't published — only available after subscribing and toggling in-app",
      "AI credits are a metered cost on top of the base plan that scales with usage",
      "Smaller brand recognition in North America compared to Intercom or Zendesk",
    ],

    popularityScore: 64,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://crisp.chat/en/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "reamaze",
    name: "Re:amaze",
    // DRAFT - review before publish
    tagline: "Ecommerce-friendly helpdesk and live chat combo with built-in AI resolutions and a flat-rate entry plan.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.reamaze.com&sz=128",
    website: "https://www.reamaze.com",

    category: "customer-support",
    subCategory: "live-chat",
    industries: ["ecommerce", "retail", "agencies"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options.",
    useCases: ["live chat widget", "email and ticket support", "social media support channels", "SMS/voice support", "AI-driven ticket resolution"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter (flat rate)", priceMonthly: 59, priceAnnual: null, currency: "USD", keyLimits: ["Flat rate, unlimited team members; limited to 500 responded conversations/month; includes Basic-plan features"] },
      { name: "Basic", priceMonthly: 29, priceAnnual: 26.1, currency: "USD", keyLimits: ["Per team member; unlimited email inboxes, live chat, social media channels, FAQ, workflow automation, chatbots; 5 AI resolutions/mo included, $0.85 each additional"] },
      { name: "Pro", priceMonthly: 49, priceAnnual: 44.1, currency: "USD", keyLimits: ["Per team member; adds multiple brands, live visitor view, advanced reporting, SMS/voice channels, custom domain; 10 AI resolutions/mo included"] },
      { name: "Plus", priceMonthly: 69, priceAnnual: 62.1, currency: "USD", keyLimits: ["Per team member; marked \"most popular\"; adds live screensharing, departments, staff performance reporting, shift/vacation management, in-chat video calls; 20 AI resolutions/mo included"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — a 14-day free trial gives full Plus-plan features, no credit card required. All prices are in USD; annual billing saves 10% off the monthly per-seat rate on Basic/Pro/Plus. AI resolutions beyond each plan's included monthly allowance are billed at $0.85 each. A separate flat-rate Starter plan ($59/mo, unlimited team members, capped at 500 responded conversations/month) suits very small teams better than per-seat pricing.",
    startingPrice: 29,
    currency: "USD",

    keyFeatures: [
      "Unified live chat and email ticketing",
      "Social media support channels",
      "SMS and voice channels (Pro+)",
      "Built-in AI resolution with a metered overage rate",
      "Live visitor view and screensharing (higher tiers)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "A solid, moderately priced helpdesk-plus-chat combo for small ecommerce and agency teams, with an unusual flat-rate option for very small teams — AI resolution overages are worth budgeting for once usage grows past the included monthly allowance.",
    bestFor: [
      "Small ecommerce brands and agencies wanting chat, email, and social support in one tool",
      "Very small teams that fit the flat-rate Starter plan's 500-conversation/month cap",
    ],
    avoidIf: [
      "You need SMS/voice from the entry tier — that requires upgrading to Pro or higher",
      "Your AI resolution volume will regularly exceed each plan's small included allowance (5-20/mo)",
    ],
    pros: [
      "Unusual flat-rate Starter plan is a good fit for very small teams with unlimited seats",
      "Clear per-seat pricing with a straightforward 10% annual discount",
      "Social media and SMS/voice channels bundled in without needing a separate product",
    ],
    cons: [
      "Included AI resolution allowances (5-20/mo) are modest — overages add up at $0.85 each",
      "Less brand recognition than Zendesk, Freshdesk, or Intercom",
      "SMS/voice channels require the Pro tier or above",
    ],

    popularityScore: 47,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.reamaze.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "olark",
    name: "Olark",
    // DRAFT - review before publish
    tagline: "Simple, no-frills live chat widget with a genuinely free (if very limited) tier for the lightest use cases.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.olark.com&sz=128",
    website: "https://www.olark.com",

    category: "customer-support",
    subCategory: "live-chat",
    industries: ["agencies", "consulting", "freelancers", "ecommerce"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options.",
    useCases: ["live chat widget", "targeted/proactive chat", "chat reporting and analytics", "basic chatbot automation (Pro)"],
    pricingModel: "freemium",

    pricing: [
      { name: "Standard", priceMonthly: 29, priceAnnual: null, currency: "USD", keyLimits: ["Per seat; customizable chatbox, advanced reporting, agent groups, targeted chat, basic integrations, WCAG 2.1 AA accessibility certification"] },
      { name: "Pro", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Pricing not published — requires contacting sales; adds chatbots/AI automation, dedicated account manager, live training, custom chat routing, priority support"] },
    ],
    hasFreeTier: true,
    freeTierReality: "After the 14-day free trial, accounts can drop to a genuinely free tier limited to 1 agent and a maximum of 20 chats/month — enough only for very light use, not a real support operation. Standard plan pricing ($29/mo/seat) is published; Pro plan pricing is not disclosed on the live page and requires a sales conversation. Optional \"PowerUps\" (chat automation add-ons) are priced separately from $29-$99/month regardless of plan tier or team size.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Customizable live chat widget",
      "Targeted/proactive chat triggers",
      "Advanced reporting and agent groups",
      "WCAG 2.1 AA accessibility-certified chatbox",
      "Optional PowerUps for chatbots/AI and automation",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A straightforward, no-frills live chat widget best suited to solo operators and small teams with light chat volume — the free tier's 20-chat/month cap and Pro tier's hidden pricing limit how far it scales without a sales conversation.",
    bestFor: [
      "Solo operators and small teams wanting a simple, accessible chat widget without a full helpdesk suite",
      "Teams that can operate within the 20-chat/month free tier or the single published $29/seat Standard plan",
    ],
    avoidIf: [
      "You need AI chatbot automation without going through a sales conversation for Pro pricing",
      "You want a modern all-in-one platform combining ticketing, chat, and email in one price",
    ],
    pros: [
      "Genuinely free tier exists (not just a trial), even if limited to 20 chats/month",
      "WCAG 2.1 AA accessibility certification is a differentiator few competitors advertise",
      "Simple, transparent Standard-tier pricing without a complex feature ladder",
    ],
    cons: [
      "Pro tier (chatbots/AI) pricing isn't published and requires contacting sales",
      "Free tier's 20-chat/month cap is quite restrictive for anything beyond the lightest use",
      "PowerUps (automation add-ons) are billed separately from the base plan",
    ],

    popularityScore: 49,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.olark.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "chatwoot",
    name: "Chatwoot",
    // DRAFT - review before publish
    tagline: "Open-source Intercom alternative — free self-hosted option plus a cloud-hosted plan with a real free tier.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.chatwoot.com&sz=128",
    website: "https://www.chatwoot.com",

    category: "customer-support",
    subCategory: "live-chat",
    industries: ["agencies", "consulting", "ecommerce", "freelancers", "nonprofits"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Cloud-hosted plans available globally; self-hosted open-source edition can be deployed in any region an organization chooses.",
    useCases: ["live chat widget", "omnichannel messaging (email, WhatsApp, Instagram, SMS, Telegram)", "self-hosted/open-source deployment", "AI-assisted responses (Captain)", "help center"],
    pricingModel: "freemium",

    pricing: [
      { name: "Hacker (Free)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 2 agents, 500 conversations/month, 30-day data retention; live chat channel only, private notes, @mentions, labels; 15-day trial of paid features included"] },
      { name: "Startups", priceMonthly: null, priceAnnual: 19, currency: "USD", keyLimits: ["Per agent, billed annually; unlimited conversations (fair-use policy), 1-year data retention; all channels (email, Facebook, Instagram, TikTok, WhatsApp, SMS, Telegram, Line), help center, 300 Captain AI credits/mo"] },
      { name: "Business", priceMonthly: null, priceAnnual: 39, currency: "USD", keyLimits: ["Per agent, billed annually; marked \"Most popular\"; 2-year data retention; adds voice channel, teams, automation rules, custom attributes, campaigns, 500 Captain AI credits/mo"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: 99, currency: "USD", keyLimits: ["Per agent, billed annually; 3-year data retention; adds SSO/SAML, audit logs, agent capacity management, 800 Captain AI credits/mo, dedicated account manager for 20+ agents"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Hacker plan is free forever for up to 2 agents with 500 conversations/month and 30-day data retention — real limits, not just a trial. Paid tiers (Startups/Business/Enterprise) show only the annual-billed per-agent rate on the live pricing page; no separate month-to-month price was found. Captain AI credits beyond each plan's included allotment cost $20 per 1,000 credits. Chatwoot is also open-source and offers a self-hosted Community Edition with different (fully free) economics not captured by this cloud-hosted pricing.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Live chat widget plus omnichannel inbox (WhatsApp, Instagram, SMS, Telegram)",
      "Open-source, self-hostable Community Edition",
      "Captain AI for automated response suggestions",
      "Automation rules and custom attributes",
      "Voice channel support (Business+)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams wanting an open-source alternative to Intercom — either genuinely free via self-hosting, or a real (not trial-limited) free cloud tier — the tradeoff is a smaller polish level and ecosystem than the incumbents it's positioned against.",
    bestFor: [
      "Cost-conscious teams and open-source-friendly organizations wanting an Intercom-style tool",
      "Teams that want the option to self-host for full data control at zero license cost",
    ],
    avoidIf: [
      "You need the most polished, enterprise-proven UI — Chatwoot is capable but younger than Intercom/Zendesk",
      "You want a fully managed vendor with a large third-party integration marketplace",
    ],
    pros: [
      "Free forever cloud tier with real limits (2 agents, 500 conversations/month), not a trial",
      "Open-source self-hosted option gives full data control and zero license cost for technical teams",
      "Omnichannel messaging (WhatsApp, Instagram, SMS, Telegram) included from the entry paid tier",
    ],
    cons: [
      "Only the annual-billed per-agent rate is published for paid cloud tiers — no confirmed month-to-month price",
      "Self-hosting requires real engineering effort to deploy and maintain",
      "Smaller integration marketplace and market presence than Intercom or Zendesk",
    ],

    popularityScore: 61,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.chatwoot.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "livechat",
    name: "LiveChat",
    // DRAFT - review before publish
    tagline: "Long-running, dedicated live chat platform (by Text) with clear per-agent pricing and strong visitor-tracking analytics.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.livechat.com&sz=128",
    website: "https://www.livechat.com",

    category: "customer-support",
    subCategory: "live-chat",
    industries: ["agencies", "consulting", "ecommerce", "retail"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options for Enterprise customers.",
    useCases: ["live chat widget", "visitor tracking and targeting", "staffing prediction / scheduling", "SMS and Apple Messages for Business channels", "chat reporting and analytics"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter", priceMonthly: 25, priceAnnual: 19, currency: "USD", keyLimits: ["1 user; track up to 100 visitors, 1 recurring campaign, 60-day chat history"] },
      { name: "Team", priceMonthly: 59, priceAnnual: 49, currency: "USD", keyLimits: ["Unlimited users; track up to 400 visitors, unlimited campaigns, unlimited chat history, basic reporting"] },
      { name: "Business", priceMonthly: 89, priceAnnual: 79, currency: "USD", keyLimits: ["Unlimited users; track up to 1,000 visitors; work scheduler, staffing prediction, advanced reporting, SMS, Apple Messages for Business"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; white label widget, dedicated onboarding, SSO, HIPAA compliance, SLAs, professional services"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — a 14-day free trial with AI-driven features is offered, no credit card required, after which a paid plan is required. Prices are per person/month; annual billing runs roughly 24% cheaper than month-to-month across all three published tiers. ChatBot is a separate add-on product starting at $52/month billed annually, not included in any LiveChat tier.",
    startingPrice: 25,
    currency: "USD",

    keyFeatures: [
      "Live chat widget with visitor tracking and targeting",
      "Work scheduler and staffing prediction (Business+)",
      "SMS and Apple Messages for Business channels",
      "Chat history retention and reporting",
      "White-label widget option (Enterprise)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "A mature, reliable dedicated live chat product with clearly published per-agent pricing on both monthly and annual billing — a solid choice for teams that specifically want chat rather than a full helpdesk suite.",
    bestFor: [
      "Teams wanting a dedicated, well-established live chat tool rather than a bundled helpdesk suite",
      "Support operations that need staffing prediction and work-scheduling features (Business tier)",
    ],
    avoidIf: [
      "You want ticketing/email support bundled into the same product without adding a separate helpdesk",
      "You need AI chatbot automation included in the base price — ChatBot is a separate paid add-on",
    ],
    pros: [
      "Both monthly and annual pricing are clearly published for every tier, unlike several competitors",
      "Staffing prediction and work scheduler are genuinely useful operational features at Business tier",
      "Long track record and mature product (formerly LiveChat Inc./Text)",
    ],
    cons: [
      "No free tier — only a 14-day trial before requiring payment",
      "AI chatbot capability is a separate paid product (ChatBot), not bundled in",
      "Visitor-tracking caps (100/400/1,000) mean busier sites need to jump tiers to keep full tracking",
    ],

    popularityScore: 69,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.livechat.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
];
