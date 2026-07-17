import type { AppListing } from "../types";

// Scaffolded via research pass — 20 well-known AI Tools spanning AI
// writing/chat assistants, AI image/video/voice generation, AI coding
// assistants, and AI meeting/productivity tools.
//
// Every field tagged with the literal string "VERIFY" is a placeholder for
// a fact (pricing tier, price, free-tier limit, or integration list) that
// must be checked against the vendor's own live pricing page before this
// listing is published — see docs/apps-verification-checklist.md. Do not
// replace "VERIFY" with a remembered or guessed value. AI product pricing
// changes unusually often (new tiers, credit-system overhauls, model-gated
// limits) — every verified fact below was pulled from a live fetch of the
// vendor's own pricing page on 2026-07-17, or, where the vendor's page
// blocked automated fetch (HTTP 403), cross-referenced across multiple
// independent, consistent third-party sources the same way prior categories
// in this directory handle blocked vendor pages (see Gusto/Justworks in
// hr-payroll.ts). Two listings (ChatGPT, Midjourney) could not be verified
// to a standard we trust and are left VERIFY — see notes on each entry.
//
// Editorial fields (tagline, verdict, bestFor, avoidIf, pros, cons) are
// well-reasoned drafts based on each tool's general reputation and market
// positioning, marked "// DRAFT - review before publish" — apply your own
// judgement before these go live. Per project instructions, competing AI
// products (including those built on non-Claude models) are described
// evenhandedly — real, current pricing and honest tradeoffs, no editorializing
// about which underlying model is "best."
//
// The publish guard lives in lib/apps/index.ts (isPricingVerified /
// ALL_APPS): any listing still carrying a VERIFY pricing fact is excluded
// from the production directory automatically.

export const AI_TOOLS_APPS: AppListing[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    // DRAFT - review before publish
    tagline: "The best-known AI chat assistant, from the makers of GPT — writing, research, coding, and image/voice all in one app.",
    logoUrl: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    website: "https://openai.com/chatgpt",

    category: "ai-tools",
    subCategory: "ai-writing-chat",
    industries: ["freelancers", "agencies", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available in most countries; VERIFY current list of restricted/unsupported countries and any region-based pricing differences.",
    useCases: ["AI chat assistant", "writing and editing", "research and Q&A", "image generation", "code generation", "voice conversation"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Conversational AI chat with web search and memory",
      "Image generation (Sora/DALL·E family)",
      "Code generation and Codex agent access on paid tiers",
      "Voice mode for spoken conversation",
      "Custom GPTs and connectors to third-party apps",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android", "desktop"],

    // DRAFT - review before publish
    verdict:
      "The default, highest-brand-recognition AI assistant — a reasonable starting point for most people, though exact current tier pricing needs direct confirmation before this listing goes live.",
    bestFor: [
      "Anyone wanting the most widely recognized general-purpose AI assistant",
      "Users who want image generation, chat, and light coding help in one subscription",
    ],
    avoidIf: [
      "You need airtight confirmation of current tier pricing before committing budget (VERIFY before relying on this listing)",
      "You specifically need the largest context window or most generous coding-agent usage at the lowest price point — compare tiers carefully",
    ],
    pros: [
      "Largest user base and broadest third-party plugin/connector ecosystem",
      "Frequent feature releases (voice, image, agents) roll out to existing subscribers",
      "Free tier exists for casual use before paying anything",
    ],
    cons: [
      "OpenAI's official pricing page blocked automated verification (HTTP 403) and third-party aggregators gave inconsistent tier structures at the time of research — do not trust remembered pricing here",
      "Message/usage caps on lower tiers can be restrictive for heavy daily use",
      "Enterprise pricing is sales-quote-only, not self-serve",
    ],

    popularityScore: 98,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://openai.com/chatgpt/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["word-counter", "paraphrasing-tool"],
  },
  {
    id: "claude",
    name: "Claude",
    // DRAFT - review before publish
    tagline: "Anthropic's AI assistant for chat, writing, and coding — with Claude Code, Cowork, and deep Microsoft 365 integration on paid plans.",
    logoUrl: "https://www.google.com/s2/favicons?domain=claude.com&sz=128",
    website: "https://claude.com",

    category: "ai-tools",
    subCategory: "ai-writing-chat",
    industries: ["freelancers", "agencies", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available in most countries; VERIFY current list of restricted/unsupported countries.",
    useCases: ["AI chat assistant", "writing and editing", "coding assistant (Claude Code)", "research", "document analysis"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Web/iOS/Android/desktop chat, code generation, web search, memory, connectors, extended thinking — usage capped, exact message limits not published"] },
      { name: "Pro", priceMonthly: 20, priceAnnual: 17, currency: "USD", keyLimits: ["$200 billed upfront annually (~$17/mo); more usage than Free, Claude Code, Claude Cowork, Claude Design, Claude Science, unlimited projects, Research access, Microsoft 365 integration"] },
      { name: "Max 5x", priceMonthly: 100, priceAnnual: null, currency: "USD", keyLimits: ["Starting price; everything in Pro plus 5x more usage than Pro, higher output limits, priority access during high traffic"] },
      { name: "Max 20x", priceMonthly: 100, priceAnnual: null, currency: "USD", keyLimits: ["Starting price (higher-usage tier above 5x); everything in Pro plus 20x more usage than Pro, higher output limits, priority access"] },
      { name: "Team", priceMonthly: 25, priceAnnual: 20, currency: "USD", keyLimits: ["Standard seat: $25/mo billed monthly or $20/mo billed annually; Premium seat: $125/mo billed monthly or $100/mo billed annually; 2-150 people, SSO, admin controls, central billing"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan gives real access to Claude chat across web/mobile/desktop with code generation, web search, memory, and connectors, but usage volume is capped and the exact daily/weekly message limit isn't published as a fixed number — it scales dynamically with demand. Max tiers start at $100/mo and scale further; exact pricing above the 5x/20x usage multipliers wasn't fully itemized on the pricing page.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Conversational AI chat with extended thinking and web search",
      "Claude Code for agentic coding in the terminal/IDE",
      "Claude Cowork and Claude Design collaboration surfaces",
      "Large context window for long documents",
      "Microsoft 365 integration on Pro and above",
      "Enterprise: SSO, SCIM, audit logs, HIPAA-ready configuration",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android", "desktop"],

    // DRAFT - review before publish
    verdict:
      "A strong pick for users who want a capable AI assistant plus a genuinely powerful coding agent (Claude Code) bundled into the same subscription — Max tier pricing scales quickly for power users.",
    bestFor: [
      "Developers who want chat and agentic coding (Claude Code) in one subscription",
      "Teams that need SSO/admin controls and predictable per-seat Team pricing",
    ],
    avoidIf: [
      "You only need occasional light chat use — the Free tier may be enough and Pro's $20/mo may be more than you need",
      "You need the absolute lowest-cost heavy-usage plan — Max pricing starts at $100/mo",
    ],
    pros: [
      "Claude Code is bundled into Pro and above, not a separate paid product",
      "Team plan has clear, published per-seat monthly and annual pricing",
      "Enterprise-ready compliance options (HIPAA-ready, audit logs, SCIM)",
    ],
    cons: [
      "Free tier's exact usage caps aren't published as fixed numbers, making it hard to predict when you'll hit a limit",
      "Max tier's exact pricing above the base $100/mo wasn't itemized on the public pricing page",
      "Enterprise usage-based overage is billed at API rates, which can be harder to predict than flat per-seat pricing",
    ],

    popularityScore: 88,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://claude.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["word-counter", "paraphrasing-tool"],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    // DRAFT - review before publish
    tagline: "AI answer engine that cites its sources — search-first alternative to a traditional chatbot.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.perplexity.ai&sz=128",
    website: "https://www.perplexity.ai",

    category: "ai-tools",
    subCategory: "ai-writing-chat",
    industries: ["freelancers", "agencies", "consulting"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current list of restricted/unsupported countries.",
    useCases: ["AI-powered search", "research with citations", "Q&A assistant", "browser-based AI (Comet)"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Basic search and Q&A with limited daily Pro-search usage; exact daily cap not confirmed"] },
      { name: "Pro", priceMonthly: 20, priceAnnual: 16.67, currency: "USD", keyLimits: ["$200/yr billed annually (~$16.67/mo); faster, more in-depth answers, access to multiple frontier models"] },
      { name: "Max", priceMonthly: 200, priceAnnual: 166.67, currency: "USD", keyLimits: ["$2,000/yr billed annually (~$166.67/mo); unlimited Labs usage, Comet AI browser, priority access to frontier models including highest-tier third-party models"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan gives genuine access to Perplexity's AI search with source citations, but Pro-level (deeper, multi-step) searches are capped at a limited daily allowance rather than being unlimited — the exact daily number wasn't confirmed from a single authoritative source.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "AI-powered search with inline source citations",
      "Multi-model access (routes across frontier models)",
      "Comet AI-native browser (Max tier)",
      "Labs for building dashboards, spreadsheets, and simple web apps",
      "Perplexity Enterprise for team/org deployments",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android", "desktop"],

    // DRAFT - review before publish
    verdict:
      "Best for people who want cited, source-linked answers rather than a plain chatbot response — Max's $200/mo price puts it firmly in power-user territory versus Pro's more accessible $20/mo.",
    bestFor: [
      "Researchers and writers who want every answer backed by a visible source",
      "Users who want one subscription that routes across multiple frontier AI models",
    ],
    avoidIf: [
      "You mainly want long-form writing/drafting help rather than search-style Q&A",
      "$200/mo for Max is out of budget and Pro's daily deep-search cap feels limiting",
    ],
    pros: [
      "Source citations on every answer build more verifiable trust than an uncited chatbot reply",
      "Pro plan is competitively priced against other AI chat subscriptions at $20/mo",
      "Comet browser extends AI assistance across everyday browsing, not just a chat window",
    ],
    cons: [
      "Official pricing page blocked automated verification (HTTP 403); figures here are cross-referenced from multiple independent third-party sources, not a direct vendor fetch",
      "Free tier's exact deep-search daily cap isn't published as a fixed number",
      "Max tier's $200/mo price is a significant jump from Pro",
    ],

    popularityScore: 78,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.perplexity.ai/pro",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["citation-generator", "word-counter"],
  },
  {
    id: "jasper",
    name: "Jasper",
    // DRAFT - review before publish
    tagline: "AI marketing content platform built around Brand Voice consistency and no-code agents for teams.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.jasper.ai&sz=128",
    website: "https://www.jasper.ai",

    category: "ai-tools",
    subCategory: "ai-writing-chat",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY regional pricing/payment handling.",
    useCases: ["marketing copywriting", "brand-voice-consistent content", "no-code AI agents", "content campaigns"],
    pricingModel: "subscription",

    pricing: [
      { name: "Pro", priceMonthly: 69, priceAnnual: 59, currency: "USD", keyLimits: ["Per seat; 2 Brand Voices, 5 Knowledge assets, 3 Audiences; Canvas platform and core marketing agents; 1 seat included, additional users require Business"] },
      { name: "Business", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing, 12-month minimum commitment; unlimited Brand Voices/Knowledge/Audiences, no-code agent builder, Jasper Grid, API access, admin controls"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No ongoing free plan — Jasper offers a 7-day free trial of the Pro plan to evaluate before purchase, not a permanent free tier.",
    startingPrice: 69,
    currency: "USD",

    keyFeatures: [
      "Brand Voice for on-brand, consistent AI writing across a team",
      "Canvas document/campaign editor",
      "No-code marketing agent builder (Business tier)",
      "Jasper Grid for structured content generation",
      "API access on Business tier",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for marketing teams that need brand-consistent AI copy at scale and are prepared to pay a premium versus general-purpose chatbots — single-seat Pro pricing is steep for solo freelancers.",
    bestFor: [
      "Marketing teams producing high volumes of on-brand content across channels",
      "Businesses that want no-code AI agents for recurring content workflows (Business tier)",
    ],
    avoidIf: [
      "You're a solo freelancer on a tight budget — $69/mo (or $59/mo annual) for one seat is pricier than general-purpose AI chat tools",
      "You need transparent self-serve pricing for multi-seat teams — Business is quote-only with a 12-month commitment",
    ],
    pros: [
      "Brand Voice feature genuinely differentiates it from generic AI writers for marketing consistency",
      "Canvas and Grid give more structure than a plain chat interface for campaign work",
      "7-day free trial available before committing",
    ],
    cons: [
      "No permanent free tier, only a short trial",
      "Business tier requires a 12-month commitment and custom quote — not self-serve",
      "Pro tier is limited to a single seat, forcing an upgrade for any team collaboration",
    ],

    popularityScore: 62,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.jasper.ai/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["word-counter", "paraphrasing-tool"],
  },
  {
    id: "copy-ai",
    name: "Copy.ai",
    // DRAFT - review before publish
    tagline: "AI-native workflow platform for go-to-market teams, built around chat plus automated multi-step workflows.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.copy.ai&sz=128",
    website: "https://www.copy.ai",

    category: "ai-tools",
    subCategory: "ai-writing-chat",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY regional pricing/payment handling.",
    useCases: ["marketing copywriting", "sales/GTM workflow automation", "AI chat with multiple model access", "content generation"],
    pricingModel: "freemium",

    pricing: [
      { name: "Chat", priceMonthly: 29, priceAnnual: 24, currency: "USD", keyLimits: ["$288/yr billed annually (~$24/mo); 5 seats, unlimited words in chat, unlimited chat projects, access to OpenAI/Anthropic/Gemini models"] },
      { name: "Growth", priceMonthly: null, priceAnnual: 1000, currency: "USD", keyLimits: ["Annual billing only, $12,000/yr; 75 seats, unlimited words in chat, 20,000 workflow credits/month"] },
      { name: "Expansion", priceMonthly: null, priceAnnual: 2000, currency: "USD", keyLimits: ["Annual billing only, $24,000/yr; 150 seats, unlimited words in chat, 45,000 workflow credits/month"] },
      { name: "Scale", priceMonthly: null, priceAnnual: 3000, currency: "USD", keyLimits: ["Annual billing only, $36,000/yr; 200 seats, unlimited words in chat, 75,000 workflow credits/month"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; guided implementation, API access, bulk workflow runs, 20+ integrations, dedicated support team"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier was shown on the current pricing page — the entry point is the $29/mo (or $24/mo annual) Chat plan; VERIFY whether a limited free trial exists separately from the paid tiers listed.",
    startingPrice: 29,
    currency: "USD",

    keyFeatures: [
      "AI chat with access to multiple underlying models (OpenAI, Anthropic, Gemini)",
      "Automated multi-step GTM workflows with credit-based execution",
      "20+ integrations on Enterprise",
      "Bulk workflow runs for scale content production",
      "API access on higher tiers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for go-to-market teams that want automated multi-step content workflows, not just a chat window — Growth-and-up tiers are priced for real teams, not solo users, and require annual billing.",
    bestFor: [
      "Sales/marketing teams automating repeatable GTM content workflows",
      "Teams that want one subscription with access to multiple underlying AI models",
    ],
    avoidIf: [
      "You're a solo user who just wants simple chat-based writing help — Chat's 5-seat minimum framing is built for small teams",
      "You need month-to-month billing above the entry Chat tier — Growth/Expansion/Scale are annual-only",
    ],
    pros: [
      "Chat plan includes access to several major AI model providers under one subscription",
      "Workflow automation goes beyond simple prompt-and-response for repeatable GTM tasks",
      "Unlimited chat words even on the entry-level Chat plan",
    ],
    cons: [
      "No confirmed permanent free tier",
      "Growth/Expansion/Scale tiers require annual commitment with no published monthly-only price",
      "Workflow credit limits on Growth-and-up tiers require estimating usage in advance",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.copy.ai/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["word-counter", "paraphrasing-tool"],
  },
  {
    id: "writesonic",
    name: "Writesonic",
    // DRAFT - review before publish
    tagline: "AI content and AI-search-visibility platform — has expanded from article writing into prompt/answer tracking and site audits.",
    logoUrl: "https://www.google.com/s2/favicons?domain=writesonic.com&sz=128",
    website: "https://writesonic.com",

    category: "ai-tools",
    subCategory: "ai-writing-chat",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY regional pricing/payment handling.",
    useCases: ["AI article/content writing", "AI-search visibility tracking (GEO)", "SEO site audits", "agentic content workflows"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter", priceMonthly: 79, priceAnnual: 79, currency: "USD", keyLimits: ["50 prompts / 50 answers tracked daily, 15 AI articles/mo, 10 site audits (100 pages each), 10 trial runs of agentic workflows, 1 user, 1 project"] },
      { name: "Basic", priceMonthly: 199, priceAnnual: 199, currency: "USD", keyLimits: ["100 prompts / 300 answers tracked daily, 25 AI articles/mo, 20 site audits (1,200 pages each), 50 trial runs of agentic workflows, 2 users, 1 project"] },
      { name: "Growth", priceMonthly: 399, priceAnnual: 399, currency: "USD", keyLimits: ["200 prompts / 600 answers tracked daily, 50 AI articles/mo, 50 site audits (2,500 pages each), 100 trial runs of agentic workflows, 3 users, 2 projects"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; all 10 AI platforms tracked, unlimited custom features, full Action Center access"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier is shown on the current pricing page — Writesonic's product has shifted from a pure AI-article-writing tool toward an AI-search-visibility (GEO) platform, and every published plan starts at a paid $79/mo entry point; a free trial may exist separately (VERIFY) but wasn't confirmed on the pricing page itself.",
    startingPrice: 79,
    currency: "USD",

    keyFeatures: [
      "AI article/content generation",
      "AI-search answer tracking across platforms (GEO/visibility monitoring)",
      "SEO site audits",
      "Agentic workflow automation (limited trial runs per tier)",
      "Multi-project, multi-user workspace on higher tiers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Worth a close look specifically as an AI-search-visibility and site-audit tool rather than a pure AI writer — its current pricing and feature set have moved well beyond the simple article-generator it's best known for, which may surprise buyers expecting the older product.",
    bestFor: [
      "Teams that want AI-search-visibility (GEO) tracking bundled with content generation",
      "Agencies running SEO/AI-visibility audits for multiple client sites",
    ],
    avoidIf: [
      "You just want a low-cost, simple AI article writer — Writesonic's current entry price ($79/mo) and feature set are aimed at a broader visibility/audit platform",
      "You need a genuine free tier to try before paying",
    ],
    pros: [
      "Combines content generation with AI-search-visibility tracking in one subscription",
      "Site audit limits scale meaningfully across tiers (100 to 2,500 pages per audit)",
      "Multi-user, multi-project support from the Basic tier up",
    ],
    cons: [
      "No free tier — every plan starts at a real dollar amount",
      "Entry price ($79/mo) is high relative to other AI writing tools if you only want article generation",
      "Product positioning has shifted significantly from its earlier \"AI article writer\" reputation — evaluate against current needs, not past reviews",
    ],

    popularityScore: 48,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://writesonic.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["word-counter", "paraphrasing-tool"],
  },
  {
    id: "grammarly",
    name: "Grammarly",
    // DRAFT - review before publish
    tagline: "AI writing assistant for grammar, tone, and rewriting — works everywhere you type via browser extension and desktop app.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.grammarly.com&sz=128",
    website: "https://www.grammarly.com",

    category: "ai-tools",
    subCategory: "ai-writing-chat",
    industries: ["freelancers", "agencies", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY regional pricing/payment handling.",
    useCases: ["grammar and spelling correction", "tone detection and adjustment", "AI rewriting", "plagiarism/AI detection"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Spelling/grammar correction, tone detection, 100 AI prompts"] },
      { name: "Pro", priceMonthly: 12, priceAnnual: null, currency: "USD", keyLimits: ["Full-sentence rewrites, tone adjustment, unlimited personalized suggestions, plagiarism and AI detection, 2,000 AI prompts; 7-day free trial available"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; proactive AI everywhere, dedicated support, BYOK encryption, custom roles/permissions, data loss prevention, cost center visibility"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan gives real, everyday grammar/spelling correction and 100 AI prompts/month across supported apps and browsers — enough for casual use, but heavier AI rewriting and plagiarism/AI detection require Pro. No separate self-serve Business/Team tier was shown between Pro and Enterprise on the current pricing page — VERIFY whether that tier still exists.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Real-time grammar, spelling, and clarity suggestions",
      "Tone detection and adjustment",
      "AI-powered full-sentence and full-document rewriting",
      "Plagiarism and AI-content detection",
      "Works across browser, desktop, Microsoft Office, and Google Docs",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "windows", "macos", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for anyone who wants lightweight, always-on writing help embedded directly into their existing apps rather than a separate chat window — Pro's $12/mo is one of the more affordable entries in this category.",
    bestFor: [
      "Anyone writing regularly in email, docs, or browser forms who wants inline correction and rewriting",
      "Individuals or freelancers who want AI writing help without switching to a separate app",
    ],
    avoidIf: [
      "You need long-form content generation from scratch — Grammarly is built around editing/rewriting existing text, not drafting full articles",
      "You need a dedicated multi-seat team tier with admin controls short of full Enterprise pricing",
    ],
    pros: [
      "Genuinely useful free tier for everyday grammar/spelling correction",
      "Works inline across most apps people already write in, not a separate destination",
      "Pro pricing ($12/mo) is accessible relative to dedicated AI writing platforms",
    ],
    cons: [
      "Current pricing page did not show a distinct self-serve Business/Team tier between Pro and Enterprise — confirm before assuming one exists",
      "No annual pricing was shown on the current page for Pro (monthly rate only)",
      "AI prompt caps (100 free / 2,000 Pro) apply on top of the base grammar/tone features",
    ],

    popularityScore: 85,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.grammarly.com/plans",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["word-counter", "paraphrasing-tool"],
  },
  {
    id: "midjourney",
    name: "Midjourney",
    // DRAFT - review before publish
    tagline: "AI image (and video) generation known for its distinctive, highly stylized output quality, run primarily through Discord and the web.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.midjourney.com&sz=128",
    website: "https://www.midjourney.com",

    category: "ai-tools",
    subCategory: "ai-image-video",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability/payment handling.",
    useCases: ["AI image generation", "AI video generation", "concept art and illustration", "stylized creative visuals"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Distinctive, highly stylized AI image generation",
      "AI video generation on Pro/Mega plans",
      "Relax mode for unlimited (queued, non-priority) generations on Standard+",
      "Stealth mode for private generations (Pro/Mega)",
      "Community-driven prompting via Discord and the Midjourney web app",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Widely regarded as producing some of the most distinctive, artistically stylized AI image output in the category — plan pricing and current image/video generation limits need direct confirmation before this listing can publish.",
    bestFor: [
      "Designers, illustrators, and creatives who want a distinctive visual style out of the box",
      "Users comfortable with a Discord- and web-based workflow rather than a traditional SaaS dashboard",
    ],
    avoidIf: [
      "You need airtight, confirmed current pricing before committing (VERIFY before relying on this listing)",
      "You want a conventional web-app-only interface without any Discord-based workflow history",
    ],
    pros: [
      "Consistently praised for distinctive, high-quality stylized image output",
      "Relax mode gives effectively unlimited generation on mid-tier plans, just without priority speed",
      "Strong, active user community for prompt techniques and inspiration",
    ],
    cons: [
      "Official pricing/account pages required login and blocked automated verification — current tier prices could not be confirmed for this listing",
      "No free tier is currently offered (unlike most competitors in this category) — VERIFY this before publishing",
      "Company-revenue threshold requires Pro/Mega plans for commercial use above $1M/yr gross revenue",
    ],

    popularityScore: 84,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://docs.midjourney.com/docs/plans",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "runway",
    name: "Runway",
    // DRAFT - review before publish
    tagline: "AI video generation and editing platform (Gen-4 models) with credit-based pricing across image and video output.",
    logoUrl: "https://www.google.com/s2/favicons?domain=runwayml.com&sz=128",
    website: "https://runwayml.com",

    category: "ai-tools",
    subCategory: "ai-image-video",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability/payment handling.",
    useCases: ["AI video generation", "AI image generation", "video editing with AI tools", "creative production"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["125 one-time credits to explore Runway's AI tools — not a recurring monthly allowance"] },
      { name: "Standard", priceMonthly: 15, priceAnnual: 12, currency: "USD", keyLimits: ["$12/mo billed annually ($15/mo billed monthly); 625 credits/mo ≈ 52s Gen-4.5 video, 104s Gen-4 Turbo, or 78 Gen-4 images"] },
      { name: "Pro", priceMonthly: 35, priceAnnual: 28, currency: "USD", keyLimits: ["$28/mo billed annually ($35/mo billed monthly); 2,250 credits/mo (27,000/yr annual allotment) ≈ 187s Gen-4.5 video, 375s Gen-4 Turbo, or 281 Gen-4 images"] },
      { name: "Max", priceMonthly: 95, priceAnnual: 76, currency: "USD", keyLimits: ["$76/mo billed annually ($95/mo billed monthly); 9,500 credits/mo (114,000/yr annual allotment); unused credits roll over for 1 month"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom credit packages tailored to team usage needs"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan gives a one-time 125-credit allowance to explore the platform, not a recurring monthly free allotment — once those credits are used, generating more AI video/images requires a paid plan.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Gen-4.5 and Gen-4 Turbo AI video generation models",
      "Gen-4 AI image generation",
      "Credit-based usage shared across image and video generation",
      "Credit rollover on the Max plan",
      "Custom enterprise credit packages",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for creators and teams doing serious AI video production who are comfortable thinking in credits-per-second rather than a flat monthly cap — the free tier is only a one-time trial, not ongoing.",
    bestFor: [
      "Video creators and agencies producing AI-generated video content regularly",
      "Teams that want both AI image and video generation under one credit pool",
    ],
    avoidIf: [
      "You want an ongoing (not one-time) free tier to keep experimenting month to month",
      "You need simple, flat per-generation pricing rather than a credit-per-second system to reason about",
    ],
    pros: [
      "Credit system covers both image and video generation flexibly under one plan",
      "Annual billing meaningfully discounts every paid tier (roughly 20% off monthly rate)",
      "Max plan's credit rollover softens the impact of a light usage month",
    ],
    cons: [
      "Free tier is a one-time 125-credit trial, not a recurring monthly allowance",
      "Credit-to-seconds conversion varies by model, making cost-per-video harder to predict upfront",
      "Enterprise pricing is fully custom with no published starting point",
    ],

    popularityScore: 76,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://runwayml.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "synthesia",
    name: "Synthesia",
    // DRAFT - review before publish
    tagline: "AI avatar video generator for turning text scripts into presenter-led videos, no camera or crew required.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.synthesia.io&sz=128",
    website: "https://www.synthesia.io",

    category: "ai-tools",
    subCategory: "ai-image-video",
    industries: ["agencies", "consulting", "ecommerce", "healthcare"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability/payment handling.",
    useCases: ["AI avatar/presenter video generation", "training and e-learning video", "product explainer video", "AI dubbing/localization"],
    pricingModel: "freemium",

    pricing: [
      { name: "Basic (Free)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["10 minutes of video/month, 1,200 credits/mo"] },
      { name: "Starter", priceMonthly: 29, priceAnnual: 18, currency: "USD", keyLimits: ["$18/mo billed annually (120 min video or AI dubbing/yr, 14,500 credits/yr); $29/mo billed monthly (10 min/mo, 1,200 credits/mo)"] },
      { name: "Creator", priceMonthly: 89, priceAnnual: 64, currency: "USD", keyLimits: ["$64/mo billed annually (360 min video or AI dubbing/yr, 44,000 credits/yr); $89/mo billed monthly (30 min/mo, 3,600 credits/mo)"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; unlimited video minutes, custom credit allocation"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free (Basic) plan gives a real 10 minutes of AI avatar video per month at no cost — enough to test the product, but far short of regular content production needs.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "AI avatar presenters generated from text scripts",
      "AI dubbing/localization into multiple languages",
      "Custom avatar creation (higher tiers)",
      "Templates for training, explainer, and marketing video",
      "Enterprise: unlimited video minutes, custom governance",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that need to produce a steady stream of presenter-led video (training, product updates, explainers) without filming — annual billing meaningfully changes the per-minute economics versus monthly.",
    bestFor: [
      "L&D and training teams producing recurring instructional video",
      "Marketing/product teams needing quick explainer or update videos without a camera crew",
    ],
    avoidIf: [
      "You need cinematic, non-avatar AI video generation — Synthesia is built specifically around presenter-style avatar video",
      "Your usage is bursty rather than steady — monthly billing gives far less video per dollar than annual",
    ],
    pros: [
      "Real, usable free tier (10 min/mo) rather than a one-time trial",
      "AI dubbing extends the same script into multiple languages without re-recording",
      "Annual billing roughly triples the effective minutes-per-dollar versus monthly",
    ],
    cons: [
      "Monthly (non-annual) pricing gives comparatively little video for the price ($29/mo for just 10 min)",
      "Avatar-based format isn't suited to every video use case (e.g. cinematic or highly custom visuals)",
      "Enterprise pricing and limits are fully custom, no published starting point",
    ],

    popularityScore: 68,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.synthesia.io/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "heygen",
    name: "HeyGen",
    // DRAFT - review before publish
    tagline: "AI avatar and video generation platform with credit-based pricing across avatar quality tiers.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.heygen.com&sz=128",
    website: "https://www.heygen.com",

    category: "ai-tools",
    subCategory: "ai-image-video",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability/payment handling.",
    useCases: ["AI avatar video generation", "marketing and product video", "training video", "AI dubbing"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["3 videos/mo, max 1 min per video; Avatar III at 3 credits/min, Avatar IV/V at 20 credits/min"] },
      { name: "Creator", priceMonthly: 29, priceAnnual: null, currency: "USD", keyLimits: ["600 credits/mo"] },
      { name: "Pro", priceMonthly: 49, priceAnnual: null, currency: "USD", keyLimits: ["1,000 credits/mo"] },
      { name: "Business", priceMonthly: 149, priceAnnual: null, currency: "USD", keyLimits: ["1,500 credits/mo; plus $20/seat/mo for additional team members"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom/flexible credit allocation"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan allows 3 short (max 1 min) avatar videos per month — enough to evaluate quality, but far too limited for regular content production. Credit costs vary sharply by avatar quality tier (3 credits/min on Avatar III vs. 20 credits/min on Avatar IV/V), so real usable minutes per plan depend heavily on which avatar model is used.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "AI avatar video generation across multiple avatar-quality tiers",
      "AI dubbing/translation",
      "Custom avatar creation",
      "Team seats with shared credit pools on Business tier",
      "API access for programmatic video generation",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A close competitor to Synthesia in the AI avatar video space — credit costs that scale steeply with avatar quality (up to 20 credits/min on the newest avatar models) mean real usable video minutes per plan need careful math, not just the headline credit number.",
    bestFor: [
      "Marketing and product teams needing quick avatar-presenter video without production overhead",
      "Teams that want per-seat billing on top of a shared credit pool (Business tier)",
    ],
    avoidIf: [
      "You need the highest-quality avatar models (IV/V) at high volume — their 20 credits/min rate eats through monthly allowances quickly",
      "You need annual-billing discounts — none were shown on the current pricing page for self-serve tiers",
    ],
    pros: [
      "Multiple avatar-quality tiers let budget-conscious users trade quality for more usable minutes",
      "Business tier's per-seat add-on pricing is transparent ($20/seat/mo)",
      "Free tier, while limited, requires no payment to evaluate output quality",
    ],
    cons: [
      "No annual/discounted billing option was visible on the current pricing page",
      "Credit costs scale steeply with avatar quality, making real monthly video capacity hard to estimate at a glance",
      "Free tier's 1-minute-per-video cap limits it to short clips only",
    ],

    popularityScore: 66,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.heygen.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    // DRAFT - review before publish
    tagline: "AI voice generation and cloning platform — text-to-speech, voice cloning, and dubbing priced on a character-credit system.",
    logoUrl: "https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128",
    website: "https://elevenlabs.io",

    category: "ai-tools",
    subCategory: "ai-image-video",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability/payment handling.",
    useCases: ["AI text-to-speech", "voice cloning", "AI dubbing/localization", "voiceover for video/podcast production"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["10,000 credits/mo; no annual option"] },
      { name: "Starter", priceMonthly: 6, priceAnnual: 5, currency: "USD", keyLimits: ["30,000 credits/mo; annual equivalent ~$5/mo (pay for 10 months)"] },
      { name: "Creator", priceMonthly: 22, priceAnnual: 18.33, currency: "USD", keyLimits: ["121,000 credits/mo; first month 50% off at $11; annual equivalent ~$18.33/mo"] },
      { name: "Pro", priceMonthly: 99, priceAnnual: 82.5, currency: "USD", keyLimits: ["600,000 credits/mo; annual equivalent ~$82.50/mo"] },
      { name: "Scale", priceMonthly: 299, priceAnnual: 249.17, currency: "USD", keyLimits: ["1.8M credits/mo, 3 workspace seats included; annual equivalent ~$249.17/mo"] },
      { name: "Business", priceMonthly: 990, priceAnnual: 825, currency: "USD", keyLimits: ["6M credits/mo, 10 workspace seats included; annual equivalent ~$825/mo"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom number of credits and seats"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan includes a real, recurring 10,000 credits/month (enough for light text-to-speech use) with no credit card required, but there's no annual-discount option at the free tier and prices shown exclude tax.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "High-quality AI text-to-speech across many voices/languages",
      "Voice cloning from short audio samples",
      "AI dubbing for video/podcast localization",
      "Workspace seats bundled into Scale and Business tiers",
      "API access for programmatic voice generation",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Widely used as the go-to API-first AI voice platform — credit-based pricing scales cleanly from hobbyist to enterprise use, though real usable minutes per credit vary by voice quality/model, so test with your actual content before committing to a tier.",
    bestFor: [
      "Podcasters, video creators, and developers needing high-quality AI voice/dubbing",
      "Teams building voice features into their own product via API",
    ],
    avoidIf: [
      "You need workspace seats without jumping all the way to the $299/mo Scale tier (seats aren't included below it)",
      "Your usage is unpredictable and character-credit budgeting feels like extra overhead versus a flat per-user price",
    ],
    pros: [
      "Free tier gives a genuine, recurring monthly credit allowance, not just a one-time trial",
      "Annual billing gives a meaningful discount across every paid tier",
      "Credit system scales smoothly from $6/mo hobbyist use up to enterprise-scale volume",
    ],
    cons: [
      "Workspace seats aren't included until the $299/mo Scale tier",
      "Prices shown exclude tax, so effective cost is higher depending on jurisdiction",
      "Credit consumption varies by voice/model, making exact monthly capacity hard to predict from the credit number alone",
    ],

    popularityScore: 74,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://elevenlabs.io/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "descript",
    name: "Descript",
    // DRAFT - review before publish
    tagline: "Text-based video and podcast editor — edit media by editing the transcript, with AI voice cloning and filler-word removal.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.descript.com&sz=128",
    website: "https://www.descript.com",

    category: "ai-tools",
    subCategory: "ai-image-video",
    industries: ["agencies", "consulting", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability/payment handling.",
    useCases: ["podcast editing", "video editing via transcript", "AI voice cloning", "transcription", "filler-word removal"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["60 minutes of media/month, 100 AI credits (one-time)"] },
      { name: "Hobbyist", priceMonthly: 24, priceAnnual: 16, currency: "USD", keyLimits: ["$16/mo billed annually (35% savings) or $24/mo billed monthly; 600 minutes of media/month, 400 AI credits/month"] },
      { name: "Creator", priceMonthly: 35, priceAnnual: 24, currency: "USD", keyLimits: ["$24/mo billed annually (35% savings) or $35/mo billed monthly; 1,800 minutes of media/month, 800 AI credits/month"] },
      { name: "Business", priceMonthly: 65, priceAnnual: 50, currency: "USD", keyLimits: ["$50/mo billed annually (30% savings) or $65/mo billed monthly; 2,400 minutes of media/month, 1,500 AI credits/month"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom media allowance and AI credits"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan includes a real 60 minutes of media processing per month plus a one-time 100 AI credits — enough to try transcript-based editing, but the one-time (not recurring) AI credit allotment limits ongoing use of AI-specific features like Overdub/Studio Sound beyond the trial.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Edit video/audio by editing a text transcript",
      "AI voice cloning (Overdub) for corrections without re-recording",
      "Filler-word and silence removal",
      "Automatic transcription",
      "Studio Sound AI audio enhancement",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "windows", "macos"],

    // DRAFT - review before publish
    verdict:
      "Best for podcasters and video creators who want to edit by editing text rather than a traditional timeline — annual billing is meaningfully cheaper than monthly across every paid tier, so budget accordingly.",
    bestFor: [
      "Podcasters and video creators who prefer transcript-based editing over a timeline",
      "Solo creators who want AI voice correction (Overdub) without re-recording",
    ],
    avoidIf: [
      "You need frame-accurate, timeline-based professional video editing — Descript is built around a transcript-first workflow",
      "You want a recurring (not one-time) free AI credit allowance",
    ],
    pros: [
      "Transcript-based editing genuinely speeds up rough-cut editing for talk-heavy content",
      "Overdub AI voice cloning lets you fix flubbed lines by typing corrected text",
      "Annual billing offers a real, meaningful discount (30-35%) over monthly on every paid tier",
    ],
    cons: [
      "Free tier's AI credits are one-time, not a recurring monthly allowance like the media-minutes cap",
      "Monthly (non-annual) pricing is noticeably higher than the annual-equivalent rate",
      "Best suited to talk-heavy content; less advantageous for highly visual/cinematic editing",
    ],

    popularityScore: 64,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.descript.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    // DRAFT - review before publish
    tagline: "AI pair programmer built into your IDE — code completion, chat, and coding agents, from the makers of GitHub.",
    logoUrl: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
    website: "https://github.com/features/copilot",

    category: "ai-tools",
    subCategory: "ai-coding-assistant",
    industries: ["agencies", "consulting", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability/payment handling.",
    useCases: ["AI code completion", "AI coding chat/agents", "code review assistance", "CLI coding agent"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["2,000 completions/mo, limited chat and agent usage, access to Haiku 4.5 and GPT-5 mini, Copilot CLI, community support"] },
      { name: "Pro", priceMonthly: 10, priceAnnual: null, currency: "USD", keyLimits: ["Unlimited code completion and next-edit suggestions; $15/mo total usage credits; cloud agent access and code review"] },
      { name: "Pro+", priceMonthly: 39, priceAnnual: null, currency: "USD", keyLimits: ["$70/mo total usage credits; premium models including Opus; 4x+ included usage vs. Pro; audit logs"] },
      { name: "Max", priceMonthly: 100, priceAnnual: null, currency: "USD", keyLimits: ["$200/mo total usage credits; priority access to new models/features; 2.9x+ included usage vs. Pro+"] },
      { name: "Business", priceMonthly: 19, priceAnnual: null, currency: "USD", keyLimits: ["Per user/mo; 1,900 AI credits/user, broad model catalog, org-level policy management"] },
      { name: "Enterprise", priceMonthly: 39, priceAnnual: null, currency: "USD", keyLimits: ["Per user/mo; 3,900 AI credits/user (GitHub Enterprise Cloud only), priority access to new models/features"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan genuinely includes 2,000 code completions/month plus limited chat/agent usage on smaller models (Haiku 4.5, GPT-5 mini) — enough for light use, but heavier day-to-day coding assistance and access to top-tier models requires Pro and above. Business/Enterprise usage beyond the included AI-credit pool bills at $0.01/credit.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Inline code completion and next-edit suggestions",
      "AI chat for coding questions inside the IDE",
      "Cloud coding agents (Pro and above)",
      "Copilot CLI for terminal-based coding assistance",
      "Org-level policy management and audit logs (Business/Enterprise)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "windows", "macos", "linux"],

    // DRAFT - review before publish
    verdict:
      "The default AI coding assistant for teams already living in GitHub — tight IDE integration and a genuinely usable free tier make it an easy first try, though the individual tier ladder (Pro/Pro+/Max) now has real gaps in usage between each step worth understanding before upgrading.",
    bestFor: [
      "Developers and teams already using GitHub for source control who want the tightest integration",
      "Organizations that want per-seat AI coding assistance with centralized billing and policy controls",
    ],
    avoidIf: [
      "You want unlimited access to the most capable models at the lowest price — Pro's included usage credit ($15/mo) is modest, and top models require Pro+/Max",
      "You're not using GitHub for source control and don't need that specific integration",
    ],
    pros: [
      "Free tier includes real, usable monthly completions, not just a time-limited trial",
      "Deep integration with GitHub repos, pull requests, and Actions workflows",
      "Business/Enterprise per-seat pricing and included AI credits are clearly published",
    ],
    cons: [
      "Individual tier ladder (Pro $10 / Pro+ $39 / Max $100) has significant price jumps for meaningfully more usage credit, not just more features",
      "Usage-based overage beyond included credits requires monitoring to avoid surprise costs",
      "No published annual-discount pricing was shown for individual tiers",
    ],

    popularityScore: 90,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://github.com/features/copilot/plans",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "cursor",
    name: "Cursor",
    // DRAFT - review before publish
    tagline: "AI-native code editor (a VS Code fork) built around agentic coding, inline edits, and multi-file AI changes.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.cursor.com&sz=128",
    website: "https://www.cursor.com",

    category: "ai-tools",
    subCategory: "ai-coding-assistant",
    industries: ["agencies", "consulting", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability/payment handling.",
    useCases: ["AI-native code editing", "agentic multi-file code changes", "AI code review (Bugbot)", "cloud coding agents"],
    pricingModel: "freemium",

    pricing: [
      { name: "Hobby (Free)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["No credit card required; limited Agent requests and limited Tab completions"] },
      { name: "Pro (Individual)", priceMonthly: 20, priceAnnual: null, currency: "USD", keyLimits: ["Extended limits on Agent, generous limits for Grok & Composer, access to frontier models, MCPs, cloud agents, and Bugbot; higher-usage Pro+ and Ultra individual tiers also exist at undisclosed prices without selecting them directly"] },
      { name: "Teams", priceMonthly: 40, priceAnnual: null, currency: "USD", keyLimits: ["Per user/mo; centralized team billing/admin, team marketplace, agentic code reviews, shared-context cloud agents, usage analytics, SAML/OIDC SSO"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; pooled usage, invoice/PO billing, SCIM, repository/model access controls, audit logs, priority support"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Hobby plan is genuinely free with no credit card required, but Agent requests and Tab completions are limited without a published fixed number — real day-to-day AI-assisted coding requires upgrading to Pro once those limits are hit.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Agentic multi-file code editing and generation",
      "Tab-based inline AI code completion",
      "Access to multiple frontier AI models",
      "Bugbot AI code review",
      "Cloud agents for background/async coding tasks",
      "MCP (Model Context Protocol) support",
    ],
    integrations: ["VERIFY"],
    platforms: ["windows", "macos", "linux"],

    // DRAFT - review before publish
    verdict:
      "One of the most popular AI-native editors for developers who want agentic, multi-file coding assistance built into the editor itself rather than bolted on — the Individual tier's exact usage limits above the base $20/mo Pro price weren't fully disclosed without navigating deeper into the pricing flow.",
    bestFor: [
      "Developers who want an editor built from the ground up around AI agents, not just autocomplete",
      "Teams wanting centralized billing, SSO, and shared cloud-agent context (Teams/Enterprise)",
    ],
    avoidIf: [
      "You want to stay in your existing editor rather than switching to a VS Code fork",
      "You need fully transparent, self-serve usage limits before subscribing — some individual sub-tier pricing (Pro+, Ultra) wasn't clearly broken out on the pricing page",
    ],
    pros: [
      "Free Hobby tier requires no credit card to start",
      "Agentic, multi-file editing is a genuine step beyond simple autocomplete-style AI coding tools",
      "Teams plan bundles SSO, admin controls, and shared cloud-agent context",
    ],
    cons: [
      "Individual tier page references higher Pro+ and Ultra sub-tiers without clearly listing their distinct prices",
      "No annual/discounted billing option was visible on the current pricing page",
      "Requires switching your primary editor to Cursor's VS Code fork",
    ],

    popularityScore: 80,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.cursor.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "tabnine",
    name: "Tabnine",
    // DRAFT - review before publish
    tagline: "Privacy-focused AI coding assistant positioned for enterprises that need code-completion AI without sending code to third-party model providers.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.tabnine.com&sz=128",
    website: "https://www.tabnine.com",

    category: "ai-tools",
    subCategory: "ai-coding-assistant",
    industries: ["agencies", "consulting"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability/payment handling.",
    useCases: ["AI code completion", "AI coding chat", "agentic coding workflows", "private/self-hosted AI coding assistance"],
    pricingModel: "subscription",

    pricing: [
      { name: "Code Assistant Platform", priceMonthly: 39, priceAnnual: 39, currency: "USD", keyLimits: ["Per user/mo, billed annually; code completions, AI chat, IDE integration, security/compliance features"] },
      { name: "Agentic Platform", priceMonthly: 59, priceAnnual: 59, currency: "USD", keyLimits: ["Per user/mo, billed annually; everything in Code Assistant plus agentic workflows, Context Engine, CLI agent, optional Headless Agents add-on"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free or basic tier was shown on the current pricing page — both published tiers are paid, annual-subscription, per-user plans; token consumption when using Tabnine-provided LLM access is billed on top at the underlying provider's price plus a 5% handling fee.",
    startingPrice: 39,
    currency: "USD",

    keyFeatures: [
      "AI code completion and chat",
      "Privacy-focused deployment options (including self-hosted/on-prem for enterprise)",
      "Agentic coding workflows and CLI agent (Agentic Platform)",
      "Context Engine for codebase-aware suggestions",
      "Security/compliance-focused feature set",
    ],
    integrations: ["VERIFY"],
    platforms: ["windows", "macos", "linux"],

    // DRAFT - review before publish
    verdict:
      "Best for security- and privacy-conscious engineering orgs (regulated industries, air-gapped environments) that specifically need private/self-hosted deployment options rather than the lowest sticker price — there's no free tier to try before committing to an annual per-seat plan.",
    bestFor: [
      "Regulated or security-conscious engineering teams needing private/self-hosted AI coding assistance",
      "Organizations that want a predictable per-seat annual price rather than usage-credit billing",
    ],
    avoidIf: [
      "You want to try before you buy — there's no free tier",
      "You're a solo developer or small team where GitHub Copilot's or Cursor's free tiers already cover your needs",
    ],
    pros: [
      "Privacy/self-hosted deployment options are a genuine differentiator for regulated environments",
      "Flat, predictable per-seat annual pricing rather than opaque usage credits for the base tiers",
      "Agentic Platform bundles CLI-agent and codebase-context features beyond simple completion",
    ],
    cons: [
      "No free tier to evaluate before committing to an annual subscription",
      "Token consumption for Tabnine-provided LLM access is billed separately on top of the seat price",
      "Both published tiers require annual billing; no confirmed month-to-month option",
    ],

    popularityScore: 48,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.tabnine.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    // DRAFT - review before publish
    tagline: "AI features (chat, autofill, meeting notes, search) built into Notion's workspace, fully bundled from the Business plan up.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.notion.com&sz=128",
    website: "https://www.notion.com",

    category: "ai-tools",
    subCategory: "ai-productivity",
    industries: ["agencies", "consulting", "freelancers", "nonprofits"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional pricing/payment handling.",
    useCases: ["AI-assisted note-taking", "AI meeting notes/transcription", "workspace search and Q&A", "document autofill/generation"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Per member/mo; trial-level AI capabilities (generating docs, autofilling databases)"] },
      { name: "Plus", priceMonthly: 10, priceAnnual: null, currency: "USD", keyLimits: ["Per member/mo; same trial-level AI access as Free"] },
      { name: "Business", priceMonthly: 20, priceAnnual: null, currency: "USD", keyLimits: ["Per member/mo; full Notion Agent (chat, generate, autofill, translate), AI Meeting Notes, Enterprise Search bundled in"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; zero data retention for AI processing"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free and Plus plans only include limited \"trial\" AI capabilities (generating docs, autofilling databases) — full AI Agent chat, meeting notes, and workspace-wide AI search are bundled into the Business plan ($20/member/mo) rather than sold as a separate add-on for lower tiers. A separate \"Custom Agents\" usage-credit system ($10 per 1,000 monthly credits) exists on top of plan tiers.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Notion AI Agent for chat, content generation, and autofill within docs/databases",
      "AI Meeting Notes with transcription",
      "Enterprise Search across the workspace",
      "Custom Agents (usage-credit based, on top of plan tier)",
      "Full Notion workspace (docs, databases, wikis) as the underlying product",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "windows", "macos", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that already live in Notion for docs/wikis and want AI search, meeting notes, and generation built into the same workspace rather than a separate app — full AI capability requires the $20/member/mo Business plan, not the cheaper Free/Plus tiers.",
    bestFor: [
      "Teams already using Notion as their primary workspace who want AI layered directly on top",
      "Organizations that want AI meeting notes and workspace-wide search bundled with their docs tool",
    ],
    avoidIf: [
      "You want full AI features on a cheaper tier — Free and Plus only offer a limited trial of AI capabilities",
      "You don't already use (or plan to adopt) Notion as your core workspace — the AI features aren't sold standalone",
    ],
    pros: [
      "Full AI Agent, meeting notes, and search are bundled into Business pricing rather than a separate paid add-on",
      "AI features work directly inside the same docs/databases teams already use, no separate app to check",
      "Enterprise tier offers zero data retention for AI processing, a meaningful privacy commitment",
    ],
    cons: [
      "Meaningful AI capability is gated behind the $20/member/mo Business plan — Free/Plus users only get a limited trial",
      "Custom Agents draw from a separate usage-credit pool on top of the base plan price",
      "Business plan applies per-member, so costs scale linearly with team size",
    ],

    popularityScore: 82,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.notion.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "otter-ai",
    name: "Otter.ai",
    // DRAFT - review before publish
    tagline: "AI meeting assistant that joins calls to transcribe, summarize, and surface action items in real time.",
    logoUrl: "https://www.google.com/s2/favicons?domain=otter.ai&sz=128",
    website: "https://otter.ai",

    category: "ai-tools",
    subCategory: "ai-productivity",
    industries: ["agencies", "consulting", "freelancers", "nonprofits", "healthcare"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional pricing/payment handling.",
    useCases: ["meeting transcription", "AI meeting summaries", "action item tracking", "voice/audio note transcription"],
    pricingModel: "freemium",

    pricing: [
      { name: "Basic", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["300 monthly transcription minutes"] },
      { name: "Pro", priceMonthly: 16.99, priceAnnual: 8.33, currency: "USD", keyLimits: ["Per user/mo; $8.33/mo billed annually (save ~51%); 1,200 min/mo for in-app recordings, 1,200 min/mo for imported files"] },
      { name: "Business", priceMonthly: 30, priceAnnual: 19.99, currency: "USD", keyLimits: ["Per user/mo; $19.99/mo billed annually (promo: 20% off for 3+ months); unlimited meetings/in-app recordings, 6,000 min/mo for imported files"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; unlimited transcription for all types, requires a scheduled demo"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Basic plan gives a genuinely usable 300 free transcription minutes per month — enough for occasional meetings, but regular daily meeting use will exceed it quickly and require Pro or Business.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Real-time meeting transcription (Zoom, Google Meet, Teams)",
      "AI-generated meeting summaries and action items",
      "Speaker identification",
      "Searchable transcript archive",
      "Imported audio/video file transcription",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for individuals and teams who live in back-to-back meetings and want automatic transcription and summaries without manual note-taking — annual billing is dramatically cheaper than monthly on Pro (roughly half price).",
    bestFor: [
      "Professionals with frequent recurring meetings who want automatic transcripts and summaries",
      "Teams needing searchable meeting archives for later reference",
    ],
    avoidIf: [
      "Your meeting volume is light — the 300 free minutes/month may already cover your needs without upgrading",
      "You need transcription for languages/accents Otter doesn't handle well — evaluate accuracy on your own calls first",
    ],
    pros: [
      "Free tier's 300 minutes/month is genuinely usable, not just a token trial",
      "Annual billing on Pro is roughly half the monthly price, a strong incentive to commit",
      "Automatic speaker ID and action-item extraction reduce manual meeting note-taking",
    ],
    cons: [
      "Monthly (non-annual) Pro pricing at $16.99/user is noticeably higher than the annual-equivalent rate",
      "Imported-file transcription minutes are capped separately from live in-app recording minutes",
      "Enterprise plan requires a scheduled demo rather than self-serve signup",
    ],

    popularityScore: 60,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://otter.ai/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "fireflies-ai",
    name: "Fireflies.ai",
    // DRAFT - review before publish
    tagline: "AI meeting note-taker with unlimited transcription on every tier, differentiated mainly by storage and collaboration features.",
    logoUrl: "https://www.google.com/s2/favicons?domain=fireflies.ai&sz=128",
    website: "https://fireflies.ai",

    category: "ai-tools",
    subCategory: "ai-productivity",
    industries: ["agencies", "consulting", "freelancers", "nonprofits"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional pricing/payment handling.",
    useCases: ["meeting transcription", "AI meeting summaries", "conversation intelligence/analytics", "action item tracking"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Free forever; unlimited transcription, 400 minutes of storage per team"] },
      { name: "Pro", priceMonthly: 18, priceAnnual: 10, currency: "USD", keyLimits: ["Per seat/mo; $10/seat/mo billed annually; unlimited transcription, 8,000 min of storage per seat"] },
      { name: "Business", priceMonthly: 29, priceAnnual: 19, currency: "USD", keyLimits: ["Per seat/mo; $19/seat/mo billed annually; unlimited transcription and storage"] },
      { name: "Enterprise", priceMonthly: 39, priceAnnual: 39, currency: "USD", keyLimits: ["Per seat/mo, annual billing only; unlimited transcription and storage"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is genuinely free forever with unlimited transcription minutes, but storage is capped at 400 minutes shared across the whole team — older transcripts age out once that cap is hit, unlike the unlimited storage on Business and above.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Unlimited meeting transcription on every plan, including Free",
      "AI meeting summaries and action items",
      "Conversation intelligence/analytics (higher tiers)",
      "Integrations with major video-conferencing platforms",
      "Team-wide searchable transcript library",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Notable for offering unlimited transcription minutes even on the free plan, unlike most competitors that cap minutes — the real tradeoff between tiers is storage retention and collaboration features, not transcription volume.",
    bestFor: [
      "Teams that want unlimited meeting transcription without worrying about a monthly minutes cap",
      "Organizations that outgrow the Free plan's 400-minute team storage limit and need permanent transcript retention",
    ],
    avoidIf: [
      "You need more than 400 minutes of retained team storage and aren't ready to pay for Pro or above",
      "You want month-to-month billing on Enterprise — that tier is annual-only",
    ],
    pros: [
      "Unlimited transcription minutes on every plan, including the free one, is a genuine differentiator in this category",
      "Annual billing roughly halves the per-seat price versus monthly on Pro and Business",
      "Business tier's unlimited storage removes the retention tradeoff entirely",
    ],
    cons: [
      "Free plan's 400-minute team-wide storage cap (not per-user) can fill up fast for active teams",
      "Enterprise tier requires annual billing with no month-to-month option",
      "Conversation intelligence/analytics depth on lower tiers wasn't itemized in detail on the pricing page",
    ],

    popularityScore: 56,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://fireflies.ai/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "gamma",
    name: "Gamma",
    // DRAFT - review before publish
    tagline: "AI presentation, document, and webpage generator — describe what you want and Gamma builds the deck.",
    logoUrl: "https://www.google.com/s2/favicons?domain=gamma.app&sz=128",
    website: "https://gamma.app",

    category: "ai-tools",
    subCategory: "ai-productivity",
    industries: ["agencies", "consulting", "freelancers", "nonprofits"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional pricing/payment handling.",
    useCases: ["AI presentation generation", "AI document generation", "AI webpage/microsite generation", "pitch deck creation"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["400 credits at signup (cap of 2,000 credits at once per user), up to 10 cards per prompt"] },
      { name: "Plus", priceMonthly: 10, priceAnnual: 8, currency: "USD", keyLimits: ["$8/mo billed annually (~28% off) or $10/mo billed monthly; 1,000 monthly credits, up to 20 cards per prompt; unused credits roll over up to 2x plan size"] },
      { name: "Pro", priceMonthly: 20, priceAnnual: 15, currency: "USD", keyLimits: ["$15/mo billed annually (~28% off) or $20/mo billed monthly; 4,000 monthly credits, up to 60 cards per prompt"] },
      { name: "Ultra", priceMonthly: 100, priceAnnual: null, currency: "USD", keyLimits: ["Per user/mo, monthly billing only (no annual option currently); 20,000 monthly credits, up to 75 cards per prompt"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan gives 400 credits at signup and lets balances accumulate up to a 2,000-credit cap per user — a genuinely usable starting allowance for a handful of decks, though heavier or ongoing use will exhaust it and require a paid plan.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "AI-generated presentations, documents, and webpages from a text prompt",
      "Credit-based generation and regeneration system with rollover",
      "Rich media/card layouts generated automatically",
      "Templates and brand styling",
      "Export to PowerPoint/PDF",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A fast way to go from a text prompt to a polished-looking deck or one-pager — credit costs scale with output complexity (more cards = more credits), so heavy users of long decks will burn through allowances faster than the headline credit number suggests.",
    bestFor: [
      "Founders, consultants, and freelancers who need a fast, polished pitch deck or one-pager without manual design work",
      "Teams that want AI-generated webpages/microsites alongside presentations in one tool",
    ],
    avoidIf: [
      "You produce very long, complex decks regularly — the per-card credit cost adds up quickly relative to the plan's monthly allowance",
      "You need annual billing on the top Ultra tier — it's currently monthly-only",
    ],
    pros: [
      "Genuinely usable free credit allowance to try real output before paying",
      "Credit rollover (up to 2x plan size) softens the impact of a light-usage month",
      "Annual billing offers a meaningful ~28% discount on Plus and Pro",
    ],
    cons: [
      "Credit cost scales with deck length/complexity, so real capacity varies more than the flat monthly-credit number implies",
      "Ultra tier has no annual-discount option yet, unlike Plus and Pro",
      "Best suited to fast-turnaround decks rather than highly custom, pixel-precise design work",
    ],

    popularityScore: 58,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://gamma.app/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
];
