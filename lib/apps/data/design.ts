import type { AppListing } from "../types";

// Scaffolded via Prompt 2 — 20 well-known Design & Creative products spanning
// graphic design, UI/prototyping, video editing, and presentation/infographic
// tools.
//
// Every field tagged with the literal string "VERIFY" is a placeholder for
// a fact (pricing tier, price, free-tier limit, or integration list) that
// must be checked against the vendor's own live pricing page before this
// listing is published — see docs/apps-verification-checklist.md. Do not
// replace "VERIFY" with a remembered or guessed value.
//
// Several vendor pricing pages in this category (Canva, Adobe, Gamma,
// Piktochart, CapCut, Filmora) returned HTTP 403/timeouts across many retries
// during research and could not be confirmed via a live WebFetch of the
// vendor's own page — their pricing facts are intentionally left as VERIFY
// rather than filled from secondary/aggregator sources, which is why they
// won't appear in the production directory until someone checks them
// directly and fills in real numbers.
//
// Editorial fields (tagline, verdict, bestFor, avoidIf, pros, cons) are
// well-reasoned drafts based on each tool's general reputation and market
// positioning, marked "// DRAFT - review before publish" — apply your own
// judgement before these go live.
//
// The publish guard lives in lib/apps/index.ts (isPricingVerified /
// ALL_APPS): any listing still carrying a VERIFY pricing fact is excluded
// from the production directory automatically.

export const DESIGN_APPS: AppListing[] = [
  {
    id: "canva",
    name: "Canva",
    // DRAFT - review before publish
    tagline: "The default drag-and-drop design tool for everything from social posts to presentations — no design skill required.",
    logoUrl: "https://www.google.com/s2/favicons?domain=canva.com&sz=128",
    website: "https://www.canva.com",

    category: "design",
    subCategory: "graphic-design",
    industries: ["freelancers", "agencies", "retail", "ecommerce", "nonprofits", "real-estate"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available globally with localized versions in many languages — no known sign-up region restrictions.",
    useCases: ["create social media graphics", "design presentations", "edit photos", "build simple marketing materials", "generate short videos"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Drag-and-drop editor with thousands of templates",
      "Built-in stock photos, icons, and video clips",
      "Brand Kit for consistent colors/fonts/logos",
      "AI-assisted design tools (Magic Studio)",
      "One-click resize across formats",
      "Real-time team collaboration",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for non-designers and small teams who need decent-looking visuals fast without learning a professional design tool — power users doing precise, pixel-level work will eventually hit its limits.",
    bestFor: [
      "Small business owners and marketers producing their own social/marketing graphics",
      "Non-technical teams that need a shared, on-brand design library",
    ],
    avoidIf: [
      "You need pixel-precise vector or photo editing control (Figma/Adobe/Affinity fit better)",
      "Your team is large and cost-sensitive — per-seat pricing on the Teams tier adds up quickly, VERIFY current rates",
    ],
    pros: [
      "Extremely low learning curve — most people are productive in minutes",
      "Huge, constantly refreshed template and asset library",
      "Genuinely useful free tier for occasional/light use",
    ],
    cons: [
      "Not a substitute for professional vector/photo tools when precision matters",
      "AI and premium asset usage is metered on paid plans in ways that can be confusing",
      "Pricing page was unreachable during verification (repeated 403s) — confirm current tiers before publishing",
    ],

    popularityScore: 93,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.canva.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["photo-editor", "business-card", "meme-generator", "font-pairing"],
  },
  {
    id: "adobe-creative-cloud",
    name: "Adobe Creative Cloud",
    // DRAFT - review before publish
    tagline: "The industry-standard creative suite — Photoshop, Illustrator, Premiere Pro, and more under one subscription.",
    logoUrl: "https://www.google.com/s2/favicons?domain=adobe.com&sz=128",
    website: "https://www.adobe.com/creativecloud.html",

    category: "design",
    subCategory: "graphic-design",
    industries: ["agencies", "freelancers", "consulting", "ecommerce", "retail"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available globally; pricing and available apps can vary by country — VERIFY regional pricing before publishing.",
    useCases: ["professional photo editing", "vector illustration", "video editing", "page layout / print design", "generative AI image editing"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Photoshop, Illustrator, Premiere Pro, InDesign, After Effects, and more in one plan",
      "Firefly generative AI credits bundled into subscriptions",
      "Cloud document sync and version history",
      "Adobe Fonts library included",
      "Cross-app libraries for shared assets/brand styles",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for professionals and agencies whose work genuinely requires industry-standard tools (Photoshop/Illustrator/Premiere file compatibility) — casual users will find it expensive and overkill.",
    bestFor: [
      "Design/video professionals whose clients expect Adobe-native files",
      "Agencies that need the full breadth of the Adobe app ecosystem in one plan",
    ],
    avoidIf: [
      "You only need one or two occasional design tasks — Canva or a single-app plan is cheaper",
      "You want a simple, predictable one-time cost rather than an ongoing subscription",
    ],
    pros: [
      "Unmatched depth and industry-standard file compatibility across creative disciplines",
      "Single subscription covers a very wide range of creative workflows",
      "Frequent feature updates, including generative AI tooling",
    ],
    cons: [
      "Subscription-only — no meaningful permanent free tier for the full suite",
      "Pricing structure and plan names have changed repeatedly in recent years, making cost comparison harder",
      "Pricing page timed out repeatedly during verification — confirm current plan names/prices directly before publishing",
    ],

    popularityScore: 91,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.adobe.com/creativecloud/plans.html",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["color-converter", "font-pairing", "photo-editor"],
  },
  {
    id: "affinity",
    name: "Affinity",
    // DRAFT - review before publish
    tagline: "Adobe-alternative design suite (vector, photo, and layout) — historically a one-time purchase, now under Canva.",
    logoUrl: "https://www.google.com/s2/favicons?domain=affinity.studio&sz=128",
    website: "https://www.affinity.studio",

    category: "design",
    subCategory: "graphic-design",
    industries: ["freelancers", "agencies", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Available globally as a desktop app download — VERIFY current regional pricing/availability.",
    useCases: ["vector illustration", "photo editing", "page layout / print design", "brand identity design"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Vector, raster/photo, and page-layout tools in one app",
      "No-subscription desktop app (historically a one-time purchase)",
      "PSD/AI/PDF file compatibility",
      "Non-destructive editing across all three studios",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "IMPORTANT: Affinity's business model appears to have changed materially since Canva's acquisition — multiple recent secondary sources describe the app as now free, which would be a significant departure from its historical one-time-purchase positioning. We could not confirm this directly via WebFetch on the vendor's own pricing page (repeated 403/redirect failures), so pricingModel and every number here are VERIFY. Do not publish this listing, and do not assume the old one-time-purchase pricing still applies, without checking affinity.studio directly first.",
    bestFor: [
      "Freelancers and small studios wanting professional vector/photo/layout tools without an ongoing Adobe-style subscription (historically)",
      "Users who want their design software fully owned rather than rented — VERIFY this is still accurate given the reported pricing model change",
    ],
    avoidIf: [
      "You need the deepest possible plugin/template ecosystem (Adobe's is larger)",
      "You rely on real-time multi-user collaboration in the same document",
    ],
    pros: [
      "Historically strong value as a one-time purchase versus subscription competitors",
      "Covers vector, raster, and layout work in one connected app",
      "Frequently cited as the most credible Adobe alternative for professional work",
    ],
    cons: [
      "Pricing model reportedly changed significantly and recently — this entire listing needs a fresh verification pass before publishing",
      "Vendor pricing pages (affinity.serif.com, affinity.studio) were unreachable during verification",
      "Smaller plugin/template ecosystem than Adobe's",
    ],

    popularityScore: 60,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.affinity.studio/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["photo-editor", "color-converter"],
  },
  {
    id: "snappa",
    name: "Snappa",
    // DRAFT - review before publish
    tagline: "Simple template-based graphic design tool for marketers who want quick social/ad graphics without a learning curve.",
    logoUrl: "https://www.google.com/s2/favicons?domain=snappa.com&sz=128",
    website: "https://snappa.com",

    category: "design",
    subCategory: "graphic-design",
    industries: ["freelancers", "agencies", "retail", "ecommerce"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Web-based, available globally — no known sign-up region restrictions.",
    useCases: ["create social media graphics", "design ad banners", "resize graphics for multiple platforms", "quick photo touch-ups"],
    pricingModel: "freemium",

    pricing: [
      { name: "Starter (Free)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["1 user, 6,000+ templates, 5,000,000+ stock photos/graphics, only 3 downloads/month"] },
      { name: "Pro", priceMonthly: 15, priceAnnual: 10, currency: "USD", keyLimits: ["1 user; $10/mo billed yearly; unlimited downloads, Buffer/social integrations, custom fonts, background removal"] },
      { name: "Team", priceMonthly: 30, priceAnnual: 20, currency: "USD", keyLimits: ["5 users; $20/mo billed yearly; everything in Pro plus team collaboration; contact sales for more than 5 users"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Starter is free forever but caps you at just 3 downloads per month — enough to try the editor, not to produce regular marketing graphics without upgrading to Pro.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Template library for social, ads, and blog graphics",
      "One-click resize across platform dimensions",
      "Built-in stock photo and graphic library",
      "Basic photo editing (background removal, filters)",
      "Direct social scheduling via Buffer integration",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for solo marketers and small teams who want a lighter, cheaper alternative to Canva for straightforward social/ad graphics — it doesn't try to compete on breadth of features.",
    bestFor: [
      "Solo marketers making a steady stream of simple social graphics",
      "Small teams wanting a cheaper Canva alternative without needing every extra feature",
    ],
    avoidIf: [
      "You need presentations, video, or advanced brand-kit/collaboration tooling (Canva or Visme fit better)",
      "You need more than 5 team seats — VERIFY enterprise pricing directly",
    ],
    pros: [
      "Straightforward, low-friction editor with a large template/stock library",
      "Meaningfully cheaper than Canva Pro at the individual tier",
      "One-click platform-size resizing saves real time",
    ],
    cons: [
      "Free plan's 3-downloads/month cap is quite restrictive",
      "Feature set is narrower than Canva's (no presentations, video, or docs)",
      "Smaller template/asset library than Canva's",
    ],

    popularityScore: 48,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://snappa.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["photo-editor", "font-pairing"],
  },
  {
    id: "figma",
    name: "Figma",
    // DRAFT - review before publish
    tagline: "The default collaborative interface design and prototyping tool — real-time multiplayer editing in the browser.",
    logoUrl: "https://www.google.com/s2/favicons?domain=figma.com&sz=128",
    website: "https://www.figma.com",

    category: "design",
    subCategory: "ui-prototyping",
    industries: ["agencies", "freelancers", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Browser-based and available globally — no known sign-up region restrictions.",
    useCases: ["UI/UX design", "interactive prototyping", "design systems", "developer handoff (Dev Mode)", "whiteboarding (FigJam)"],
    pricingModel: "freemium",

    pricing: [
      { name: "Starter (Free)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Unlimited drafts, 150 AI credits/day (up to 500/month), access to UI kits and templates"] },
      { name: "Professional", priceMonthly: 16, priceAnnual: null, currency: "USD", keyLimits: ["Full seat $16/mo billed annually incl. 3,000 AI credits/mo; Dev seat $12/mo incl. 500 credits; Collab seat $3/mo incl. 500 credits; unlimited files/projects, team libraries"] },
      { name: "Organization", priceMonthly: 55, priceAnnual: null, currency: "USD", keyLimits: ["Full seat $55/mo billed annually incl. 3,500 AI credits/mo; Dev seat $25/mo; Collab seat $5/mo; unlimited teams, shared libraries, admin tools"] },
      { name: "Enterprise", priceMonthly: 90, priceAnnual: null, currency: "USD", keyLimits: ["Full seat $90/mo billed annually incl. 4,250 AI credits/mo; Dev seat $35/mo; Collab seat $5/mo; custom workspaces, design system APIs, SCIM"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Starter is free forever with unlimited drafts and a real (if capped) daily AI credit allowance — but it's meant for individual/small use; real team file/project organization and shared libraries require a paid Professional seat and up.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Real-time multiplayer design editing",
      "Interactive prototyping with variants and animations",
      "Dev Mode for design-to-code handoff",
      "Team libraries and design systems",
      "FigJam whiteboarding built in",
      "AI-assisted design generation",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for product design teams who want browser-based, real-time collaboration and a shared design system — the per-seat cost across Full/Dev/Collab roles needs deliberate planning for larger teams.",
    bestFor: [
      "Product and UX teams collaborating on the same files in real time",
      "Teams that need clean, structured design-to-developer handoff",
    ],
    avoidIf: [
      "You need offline-first, fully local editing (Sketch's Mac license fits better)",
      "Your team is large and needs to carefully budget across Full/Dev/Collab seat pricing",
    ],
    pros: [
      "Best-in-class real-time collaborative editing",
      "Strong prototyping and Dev Mode handoff workflow",
      "Free Starter tier is genuinely usable, not just a trial",
    ],
    cons: [
      "Multi-tier seat pricing (Full/Dev/Collab) adds real complexity to team budgeting",
      "Fully browser/cloud-dependent — no true offline-first workflow",
      "AI credit allowances add another variable to track alongside seat costs",
    ],

    popularityScore: 92,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.figma.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["color-converter", "contrast-checker", "css-shadow-builder", "font-pairing"],
  },
  {
    id: "sketch",
    name: "Sketch",
    // DRAFT - review before publish
    tagline: "Mac-native UI design tool, available as a cloud subscription or a one-time offline license.",
    logoUrl: "https://www.google.com/s2/favicons?domain=sketch.com&sz=128",
    website: "https://www.sketch.com",

    category: "design",
    subCategory: "ui-prototyping",
    industries: ["agencies", "freelancers", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Mac-only desktop app plus a web-based collaboration layer — available globally.",
    useCases: ["UI/UX design", "prototyping", "design systems", "developer handoff"],
    pricingModel: "subscription",

    pricing: [
      { name: "Standard", priceMonthly: 12, priceAnnual: 144, currency: "USD", keyLimits: ["Per editor, billed yearly; 30-day free trial, no card required; real-time collaboration, unlimited documents, unlimited free viewers, version history, developer handoff"] },
      { name: "Professional", priceMonthly: 24, priceAnnual: 288, currency: "USD", keyLimits: ["Per editor, billed yearly; adds SSO, project archiving, permission groups"] },
      { name: "Enterprise", priceMonthly: 44, priceAnnual: 528, currency: "USD", keyLimits: ["Per editor, billed yearly; adds SCIM provisioning, BYOK encryption, dedicated support, custom terms"] },
      { name: "Private Cloud", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Contact for pricing — private cloud environment with choice of hosting location, unlimited workspaces"] },
      { name: "Mac-only License (one-time)", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["$120 per seat one-time, includes 1 year of updates; offline-only, no collaboration features, no free trial"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier — the cloud plans offer a 30-day free trial (no credit card required), after which pricing starts at $12/editor/mo (billed yearly) for Standard. The one-time Mac-only License ($120/seat) is a separate offline-only purchase with no trial.",
    startingPrice: 12,
    currency: "USD",

    keyFeatures: [
      "Native Mac vector design tools",
      "Cloud-based real-time collaboration layer",
      "Prototyping with interactive links and overlays",
      "Reusable symbols and design libraries",
      "Choice of subscription or one-time offline license",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for Mac-focused design teams who want either flexible cloud collaboration or a one-time offline license — Windows/Linux users are out of luck since it's Mac-only.",
    bestFor: [
      "Mac-based design teams wanting native performance plus optional cloud collaboration",
      "Individuals who prefer a one-time license over an ongoing subscription and don't need collaboration features",
    ],
    avoidIf: [
      "You're on Windows or Linux — Sketch has no native app for either",
      "You need Figma-style real-time multiplayer editing within the same document",
    ],
    pros: [
      "Fast, native Mac performance",
      "Rare option to buy a one-time offline license instead of subscribing",
      "Long-established, mature symbol/library system",
    ],
    cons: [
      "Mac-only — a hard blocker for mixed-OS teams",
      "Real-time same-document collaboration is less fluid than Figma's",
      "Two separate purchasing paths (cloud subscription vs. Mac license) can be confusing to compare",
    ],

    popularityScore: 66,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.sketch.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["color-converter", "contrast-checker", "font-pairing"],
  },
  {
    id: "framer",
    name: "Framer",
    // DRAFT - review before publish
    tagline: "Design-to-publish website builder with real design tooling — build and ship a live site from the same canvas.",
    logoUrl: "https://www.google.com/s2/favicons?domain=framer.com&sz=128",
    website: "https://www.framer.com",

    category: "design",
    subCategory: "ui-prototyping",
    industries: ["agencies", "freelancers", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Browser-based, available globally — no known sign-up region restrictions.",
    useCases: ["design and publish marketing websites", "interactive prototyping", "landing page building", "no-code CMS-driven sites"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["500 credits to try, free Framer subdomain, 1 GB bandwidth, 30 days analytics history, 10 CMS collections, up to 3 editors"] },
      { name: "Basic", priceMonthly: 10, priceAnnual: null, currency: "USD", keyLimits: ["Custom domain, 2 CMS collections, 50 GB bandwidth, built-in SEO, 90 days analytics history"] },
      { name: "Pro", priceMonthly: 30, priceAnnual: null, currency: "USD", keyLimits: ["Custom domain, 10 CMS collections, 100 GB bandwidth, redirects, staging environment, branching, unlimited analytics history"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom credits with volume discounts, unlimited editors, SSO/SCIM, uptime guarantee"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is gated by a one-time '500 credits to try' allowance rather than a stable monthly limit, plus a free Framer subdomain and just 1 GB bandwidth — fine for evaluating the tool, not for running a real production site long-term.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Visual, no-code website builder with real design controls",
      "Built-in CMS for blogs/collections",
      "Interactive animations and prototyping",
      "One-click publish with custom domains",
      "Staging environments and branching (Pro)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for designers who want to go straight from design to a published, real website without handing off to a developer — less suited to complex, code-heavy web apps.",
    bestFor: [
      "Freelancers and agencies building marketing sites and landing pages for clients",
      "Designers who want visual control over a real, live website rather than static mockups",
    ],
    avoidIf: [
      "You're building a complex web application rather than a marketing/content site",
      "Credit-based free-tier limits and bandwidth caps make usage hard to predict for higher-traffic sites",
    ],
    pros: [
      "Genuinely publishes a real, fast website — not just a prototype",
      "Built-in CMS removes the need for a separate headless CMS on simple sites",
      "Strong animation/interaction tooling for a no-code builder",
    ],
    cons: [
      "Free tier's one-time credit allowance is less predictable than a flat monthly limit",
      "Not designed for complex application logic — stays in marketing-site/landing-page territory",
      "Additional editor seats cost extra on top of plan pricing",
    ],

    popularityScore: 74,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.framer.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["css-shadow-builder", "gradient-generator", "font-pairing"],
  },
  {
    id: "zeplin",
    name: "Zeplin",
    // DRAFT - review before publish
    tagline: "Design-to-developer handoff tool — turns design files into specs, styleguides, and assets engineers can implement.",
    logoUrl: "https://www.google.com/s2/favicons?domain=zeplin.io&sz=128",
    website: "https://zeplin.io",

    category: "design",
    subCategory: "ui-prototyping",
    industries: ["agencies", "freelancers", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Browser-based, available globally — no known sign-up region restrictions.",
    useCases: ["design-to-developer handoff", "generate style guides from designs", "share specs/assets with engineers", "AI-assisted design review"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["1 project, 100 screens, 3 AI screen reviews/week, 3 organization runs/week, personal workspace, 2 roles"] },
      { name: "Basic", priceMonthly: 13.75, priceAnnual: null, currency: "USD", keyLimits: ["Priced by project count (1 to 12 projects, $13.75–$118.25/mo); 1,000 screens/project, unlimited users per project, 20 AI screen reviews/week, 1-year version history"] },
      { name: "Advanced", priceMonthly: 12, priceAnnual: null, currency: "USD", keyLimits: ["Per seat/mo (2 months free billed annually); 50 projects, unlimited screens, team workspace, 4 roles, forever version history"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Unlimited projects/screens, SSO, MFA, invoiced billing, activity logs, 24-hour support SLA"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan caps you at 1 project and 100 screens with only a few AI reviews per week — enough to test the handoff workflow on a small project, not to run an ongoing multi-project design-to-dev pipeline.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Auto-generated specs (spacing, colors, fonts) from design files",
      "Style guide generation",
      "Asset export for developers",
      "AI-assisted screen/design review",
      "Integrates with Figma and Sketch as a source",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want a dedicated, structured handoff layer between designers and engineers — smaller teams may find Figma's built-in Dev Mode covers the same need without a second tool.",
    bestFor: [
      "Agencies handing off finished designs to separate development teams or clients",
      "Teams wanting auto-generated style guides and specs rather than manual documentation",
    ],
    avoidIf: [
      "You already rely on Figma's built-in Dev Mode and don't need a separate handoff tool",
      "Your project count will exceed Basic's per-project pricing quickly — Advanced's flat per-seat model may be cheaper",
    ],
    pros: [
      "Purpose-built for the specific design-to-dev handoff problem",
      "Auto-generated specs save real back-and-forth with engineers",
      "Flexible pricing (per-project or per-seat) depending on team shape",
    ],
    cons: [
      "Free tier's 1-project cap is very limiting for real handoff work",
      "Another tool to maintain alongside your actual design tool (Figma/Sketch)",
      "Basic plan's per-project pricing structure takes some effort to compare against Advanced's per-seat model",
    ],

    popularityScore: 52,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://zeplin.io/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["color-converter", "css-shadow-builder"],
  },
  {
    id: "balsamiq",
    name: "Balsamiq",
    // DRAFT - review before publish
    tagline: "Deliberately low-fidelity wireframing tool — keeps early product discussions focused on structure, not visuals.",
    logoUrl: "https://www.google.com/s2/favicons?domain=balsamiq.com&sz=128",
    website: "https://balsamiq.com",

    category: "design",
    subCategory: "ui-prototyping",
    industries: ["agencies", "freelancers", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Cloud-based, available globally — no known sign-up region restrictions.",
    useCases: ["low-fidelity wireframing", "early-stage product/UX sketching", "stakeholder review of layout ideas", "rapid mockup iteration"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter", priceMonthly: 16, priceAnnual: 192, currency: "USD", keyLimits: ["Per editor; up to 10 projects, 500 AI credits/mo per editor, unlimited free reviewers"] },
      { name: "Teams", priceMonthly: 24, priceAnnual: 288, currency: "USD", keyLimits: ["Per editor; up to 100 projects, 1,000 AI credits/mo per editor, priority support"] },
      { name: "Enterprise", priceMonthly: 35, priceAnnual: 420, currency: "USD", keyLimits: ["Per editor; up to 400 projects, 2,500 AI credits/mo per editor, premium support, SSO/SAML, data residency options"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier — Balsamiq offers a 14-day free trial with no credit card required. Ongoing use requires a paid per-editor plan starting at Starter ($16/editor/mo); viewers/reviewers are free on every plan.",
    startingPrice: 16,
    currency: "USD",

    keyFeatures: [
      "Deliberately sketch-styled, low-fidelity UI components",
      "Drag-and-drop wireframe builder",
      "Unlimited free reviewer/commenter access",
      "PDF/image export for stakeholder review",
      "Project-based organization",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want early product/UX conversations to stay about structure and flow rather than visual polish — not a fit once you're ready to move into high-fidelity design.",
    bestFor: [
      "Product teams running quick, low-stakes wireframing sessions before committing to visual design",
      "Consultants who need client-friendly, unlimited-reviewer sharing of early concepts",
    ],
    avoidIf: [
      "You need high-fidelity, pixel-precise design (Figma/Sketch are built for that stage)",
      "You want a free tier for ongoing use — Balsamiq's trial is time-limited",
    ],
    pros: [
      "Low-fidelity style keeps stakeholder feedback focused on layout, not color/fonts",
      "Unlimited free reviewers/commenters on every paid plan",
      "Fast to learn and use for quick wireframe iterations",
    ],
    cons: [
      "No permanent free tier, only a 14-day trial",
      "Deliberately limited fidelity means you'll need a second tool for final designs",
      "Per-editor pricing scales up for larger teams",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://balsamiq.com/wireframes/cloud/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "capcut",
    name: "CapCut",
    // DRAFT - review before publish
    tagline: "Free-to-start, mobile-first video editor built for short-form social content — TikTok/Reels-friendly by design.",
    logoUrl: "https://www.google.com/s2/favicons?domain=capcut.com&sz=128",
    website: "https://www.capcut.com",

    category: "design",
    subCategory: "video-editing",
    industries: ["freelancers", "agencies", "retail", "ecommerce"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Available globally on mobile, desktop, and web — VERIFY any regional pricing/availability differences and platform-specific (iOS/Android/web) pricing.",
    useCases: ["short-form social video editing", "TikTok/Reels/Shorts content creation", "auto-captioning", "AI video effects and templates"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Mobile, desktop, and web video editor",
      "AI auto-captioning and translation",
      "Trending template and effects library",
      "Green screen and AI background tools",
      "Direct export optimized for TikTok/Reels/Shorts",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for creators and small brands producing high volumes of short-form social video who want fast, template-driven editing — not built for long-form or broadcast-grade production work.",
    bestFor: [
      "Social media creators and small brands editing short-form vertical video",
      "Teams needing fast turnaround using trending templates and effects",
    ],
    avoidIf: [
      "You need professional color grading, multi-cam, or broadcast-grade export controls (DaVinci Resolve/Premiere Pro fit better)",
      "You need firm pricing certainty — reported pricing has changed materially and varies by platform, VERIFY before relying on any number",
    ],
    pros: [
      "Very low barrier to entry for short-form video editing",
      "Strong template and trending-effects library tuned for social platforms",
      "Cross-platform (mobile/desktop/web) with cloud project sync",
    ],
    cons: [
      "Not intended for long-form or professional broadcast editing workflows",
      "Reported pricing structure has shifted multiple times recently and varies by platform (web vs. iOS/Android) — confirm current tiers directly",
      "Vendor pricing page was unreachable during verification",
    ],

    popularityScore: 86,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.capcut.com/pricing-plan",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["watermark-image"],
  },
  {
    id: "descript-design",
    name: "Descript",
    // DRAFT - review before publish
    tagline: "Edit video and podcasts by editing a text transcript — genuinely different workflow from timeline-based editors.",
    logoUrl: "https://www.google.com/s2/favicons?domain=descript.com&sz=128",
    website: "https://www.descript.com",

    category: "design",
    subCategory: "video-editing",
    industries: ["freelancers", "agencies", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Available globally as a desktop/web app — no known sign-up region restrictions.",
    useCases: ["podcast editing", "video editing via transcript", "auto-transcription/captions", "AI voice cloning and overdub", "screen recording"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["60 minutes of media/mo, 100 AI credits (one-time, not renewing), 720p export, 5 GB cloud storage"] },
      { name: "Hobbyist", priceMonthly: 24, priceAnnual: 16, currency: "USD", keyLimits: ["$16/mo billed annually (save up to 35%); 10 media hours/mo, 400 AI credits/mo, 1080p watermark-free export, 100 GB storage, 1 person"] },
      { name: "Creator", priceMonthly: 35, priceAnnual: 24, currency: "USD", keyLimits: ["$24/mo billed annually; 30 media hours/mo, 800 AI credits/mo, 4K watermark-free export, 1 TB storage, scales to a team of 3"] },
      { name: "Business", priceMonthly: 65, priceAnnual: 50, currency: "USD", keyLimits: ["$50/mo billed annually; 40 media hours/mo, 1,500 AI credits/mo, 4K export with Brand Studio, 2 TB storage, scales to a team of 5"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom media minutes and AI credits, advanced security, SSO/SCIM, flexible licensing"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan caps you at 60 minutes of media per month and only 720p export, and its 100 AI credits are a one-time allotment rather than a recurring monthly amount — enough to try transcript-based editing once, not for ongoing production.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Edit audio/video by editing a text transcript",
      "AI Overdub voice cloning for corrections",
      "Automatic transcription and captioning",
      "Screen recording",
      "AI-generated show notes/summaries",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for podcasters and video creators who'd rather edit by cutting text than scrubbing a timeline — traditional timeline-based editors still win for frame-precise, effects-heavy work.",
    bestFor: [
      "Podcasters and interview/talking-head video creators wanting fast transcript-based edits",
      "Teams that want automatic transcription/captioning built into the editing workflow itself",
    ],
    avoidIf: [
      "You need frame-precise timeline editing with heavy effects/compositing (DaVinci Resolve/Premiere Pro fit better)",
      "Your monthly media volume regularly exceeds a plan's hour allowance — overage costs add up",
    ],
    pros: [
      "Transcript-based editing is genuinely faster for talk-heavy content",
      "Strong built-in AI transcription, captioning, and voice tools",
      "Free plan is enough to properly evaluate the core editing workflow",
    ],
    cons: [
      "Monthly media-hour caps on every tier require watching usage closely",
      "Free plan's AI credits are one-time, not recurring — easy to exhaust quickly",
      "Not designed for complex multi-layer visual effects work",
    ],

    popularityScore: 76,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.descript.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "adobe-premiere-pro",
    name: "Adobe Premiere Pro",
    // DRAFT - review before publish
    tagline: "Industry-standard timeline-based video editor for professional and broadcast-grade production.",
    logoUrl: "https://www.google.com/s2/favicons?domain=adobe.com&sz=128",
    website: "https://www.adobe.com/products/premiere.html",

    category: "design",
    subCategory: "video-editing",
    industries: ["agencies", "freelancers", "consulting"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available globally; pricing can vary by country — VERIFY regional pricing before publishing.",
    useCases: ["professional video editing", "multi-cam editing", "color grading and finishing", "broadcast/film post-production"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Timeline-based multi-track video editing",
      "Multi-cam editing and advanced color tools",
      "Deep integration with After Effects and other Adobe apps",
      "AI-assisted editing features (Firefly)",
      "Broadcast/film-grade export and codec support",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for professional video editors and post-production teams who need industry-standard tooling and Adobe ecosystem integration — casual creators are better served by cheaper, simpler editors.",
    bestFor: [
      "Professional video editors working in agencies, film, or broadcast",
      "Teams already standardized on the Adobe Creative Cloud ecosystem",
    ],
    avoidIf: [
      "You're editing short-form social content and don't need professional-grade tooling (CapCut/Descript are lighter and cheaper)",
      "You want a one-time purchase rather than an ongoing subscription (DaVinci Resolve is the free/one-time alternative)",
    ],
    pros: [
      "Industry-standard tool with the widest professional adoption",
      "Deep interoperability with After Effects, Audition, and the rest of Adobe's suite",
      "Extensive third-party plugin and template ecosystem",
    ],
    cons: [
      "Subscription-only — no meaningful permanent free tier",
      "Steeper learning curve than consumer-focused editors",
      "Pricing page timed out repeatedly during verification — confirm current plan pricing directly before publishing",
    ],

    popularityScore: 87,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.adobe.com/products/premiere/plans.html",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["watermark-image"],
  },
  {
    id: "davinci-resolve",
    name: "DaVinci Resolve",
    // DRAFT - review before publish
    tagline: "Genuinely full-featured free video editor, color grader, and VFX/audio suite — with an optional one-time Studio upgrade.",
    logoUrl: "https://www.google.com/s2/favicons?domain=blackmagicdesign.com&sz=128",
    website: "https://www.blackmagicdesign.com/products/davinciresolve",

    category: "design",
    subCategory: "video-editing",
    industries: ["freelancers", "agencies", "consulting"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Downloadable desktop app available globally — no known sign-up region restrictions.",
    useCases: ["professional video editing", "color grading", "VFX/compositing (Fusion)", "audio post-production (Fairlight)"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["8-bit color, up to Ultra HD 4K at 60fps, multi-user collaboration, HDR grading — no watermark, not a time-limited trial"] },
      { name: "Studio (one-time)", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["$295 one-time purchase; adds DaVinci AI Neural Engine, expanded Resolve FX library, temporal/AI noise reduction, text-based editing, magic mask, 10-bit color up to 120fps, resolutions beyond 4K"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The free version is a genuinely full, unwatermarked NLE covering editing, color grading, VFX, and audio — not a stripped trial — capped at 8-bit color and Ultra HD 4K/60fps. The $295 one-time Studio upgrade adds AI tools, extra effects, noise reduction, and support beyond 4K/10-bit/120fps.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Professional-grade color grading tools",
      "Fusion VFX/compositing built in",
      "Fairlight audio post-production built in",
      "Multi-user collaborative project editing",
      "One-time Studio upgrade instead of a subscription",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for video professionals and serious hobbyists who want genuinely professional editing/color/VFX/audio tools without a subscription — the interface has a steeper learning curve than consumer editors.",
    bestFor: [
      "Video editors and colorists who want professional tools without recurring subscription costs",
      "Studios wanting one integrated app for editing, color, VFX, and audio instead of separate tools",
    ],
    avoidIf: [
      "You want the simplest possible editing experience for short-form social content (CapCut is easier to pick up)",
      "You need cloud-native, browser-based collaboration rather than a downloaded desktop app",
    ],
    pros: [
      "Free version is genuinely professional-grade, not a crippled trial",
      "One-time $295 Studio upgrade instead of an ongoing subscription",
      "Combines editing, color, VFX, and audio in a single application",
    ],
    cons: [
      "Steeper learning curve than consumer-oriented editors",
      "Heavier hardware requirements than lightweight web/mobile editors",
      "Some advanced features are locked behind the paid Studio upgrade",
    ],

    popularityScore: 80,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.blackmagicdesign.com/products/davinciresolve/price",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["watermark-image"],
  },
  {
    id: "filmora",
    name: "Filmora",
    // DRAFT - review before publish
    tagline: "Consumer-friendly video editor positioned between simple mobile apps and professional NLEs like Premiere Pro.",
    logoUrl: "https://www.google.com/s2/favicons?domain=filmora.wondershare.com&sz=128",
    website: "https://filmora.wondershare.com",

    category: "design",
    subCategory: "video-editing",
    industries: ["freelancers", "agencies", "retail"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Downloadable desktop app plus mobile/web versions, available globally — VERIFY current regional pricing.",
    useCases: ["consumer/prosumer video editing", "YouTube content creation", "AI-assisted video effects", "simple color grading and titles"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Timeline-based editing with drag-and-drop effects",
      "AI-assisted tools (auto-captioning, background removal, voice tools)",
      "Large built-in effects/title/template library",
      "Screen recording",
      "Choice of subscription or perpetual license historically offered",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for YouTubers and prosumer creators who want more editing depth than a mobile app but don't need Premiere Pro/DaVinci Resolve-level complexity — pricing needs direct confirmation since secondary sources disagree significantly on current numbers.",
    bestFor: [
      "YouTube creators and small content teams wanting an approachable, effects-rich editor",
      "Users who outgrew mobile editing apps but find Premiere Pro/Resolve intimidating",
    ],
    avoidIf: [
      "You need professional-grade color science or VFX compositing (DaVinci Resolve fits better, and is free)",
      "You need pricing certainty right now — reported prices vary widely across sources and appear to have changed recently",
    ],
    pros: [
      "Gentler learning curve than professional NLEs",
      "Large, frequently updated effects and AI-tool library",
      "Historically offered both subscription and one-time/perpetual purchase options",
    ],
    cons: [
      "Free version reportedly exports with a watermark — confirm current free-tier restrictions directly",
      "Secondary sources show inconsistent, recently-changed pricing — none confirmed via the vendor's own page during verification",
      "Not aimed at professional-grade color/VFX work",
    ],

    popularityScore: 68,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.wondershare.com/filmora/pricing.html",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["watermark-image"],
  },
  {
    id: "kapwing",
    name: "Kapwing",
    // DRAFT - review before publish
    tagline: "Browser-based video editor built around AI tools — subtitling, dubbing, and quick social-ready edits, no install required.",
    logoUrl: "https://www.google.com/s2/favicons?domain=kapwing.com&sz=128",
    website: "https://www.kapwing.com",

    category: "design",
    subCategory: "video-editing",
    industries: ["freelancers", "agencies", "retail", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Fully browser-based, available globally — no known sign-up region restrictions.",
    useCases: ["browser-based video editing", "auto-subtitling and dubbing", "short-form social video creation", "team video collaboration"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["10 credits; unlimited exports but watermarked, videos up to 1 minute, 720p quality, auto-subtitling up to 10 mins, text-to-speech up to 2 mins"] },
      { name: "Pro", priceMonthly: 24, priceAnnual: 16, currency: "USD", keyLimits: ["$16/mo billed at $192/year; 1,000 credits/mo, no watermark, 6 GB uploads, 4K quality, unlimited projects, 2-hour exports, 100 GB storage, auto-subtitling up to 1,000 mins/mo, dubbing up to 50 mins/mo"] },
      { name: "Business", priceMonthly: 64, priceAnnual: 50, currency: "USD", keyLimits: ["$50/mo billed at $600/year; 4,000 credits/mo, custom voice clones, lip sync, 500 GB storage, auto-subtitling up to 4,000 mins/mo, dubbing up to 200 mins/mo"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom credits, custom billing, dedicated account manager, SAML SSO, custom cloud storage"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan allows unlimited exports but every export carries a watermark, videos are capped at 1 minute and 720p, and only 10 credits are included — enough to test AI features like subtitling once, not for repeated production use.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Fully browser-based, no install required",
      "AI auto-subtitling and dubbing/translation",
      "Team workspace and shared projects",
      "Meme/GIF/social clip creation tools",
      "Text-to-speech generation",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want a quick, browser-only video editor for short social clips with strong AI subtitling/dubbing — credit-based limits on paid tiers require watching usage as production volume grows.",
    bestFor: [
      "Marketing and social teams needing fast subtitled/dubbed clips without installing software",
      "Distributed teams wanting shared browser-based video projects",
    ],
    avoidIf: [
      "You need professional-grade editing depth (color, VFX, multi-track audio mixing)",
      "You want export without a watermark on the free plan — it's watermarked by default",
    ],
    pros: [
      "No installation — works entirely in the browser",
      "Strong, genuinely useful AI subtitling/dubbing feature set",
      "Team collaboration built in from the Pro tier",
    ],
    cons: [
      "Free plan exports are watermarked and capped at 1 minute/720p",
      "Credit-based system on paid plans adds a layer of usage tracking beyond flat feature limits",
      "Not aimed at professional color grading or complex multi-track editing",
    ],

    popularityScore: 60,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.kapwing.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["watermark-image", "meme-generator"],
  },
  {
    id: "visme",
    name: "Visme",
    // DRAFT - review before publish
    tagline: "All-in-one visual content tool — presentations, infographics, documents, and video in one editor with brand controls.",
    logoUrl: "https://www.google.com/s2/favicons?domain=visme.co&sz=128",
    website: "https://www.visme.co",

    category: "design",
    subCategory: "presentation-infographic",
    industries: ["freelancers", "agencies", "consulting", "nonprofits", "real-estate"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Web-based, available globally — no known sign-up region restrictions.",
    useCases: ["create presentations", "design infographics", "build interactive documents/reports", "brand kit management", "basic video/animation creation"],
    pricingModel: "freemium",

    pricing: [
      { name: "Basic (Free)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["500 MB storage, 50 slides/pages per project, limited templates and assets, no premium downloads"] },
      { name: "Starter", priceMonthly: 12.25, priceAnnual: 147, currency: "USD", keyLimits: ["Per person, billed annually ($147/year); 1 GB storage, unlimited projects, JPG/PNG/PDF downloads only"] },
      { name: "Pro", priceMonthly: 24.75, priceAnnual: 297, currency: "USD", keyLimits: ["Per person, billed annually ($297/year); 10 GB storage, unlimited slides/pages, PPTX/HTML5/video/GIF downloads, brand kit included"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing, minimum 10 users; 25 GB storage per user, all download formats, SSO/2FA, dedicated success manager"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Basic plan is free forever but caps storage at 500 MB and projects at 50 slides/pages with limited templates and no premium downloads — enough for one simple project, not for ongoing brand-consistent design work.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Presentation, infographic, and document builder in one tool",
      "Brand kit for consistent colors/fonts/logos across content",
      "Data visualization and chart tools",
      "Basic animation and video creation",
      "Analytics on published/shared content",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for marketers and consultants who want one tool covering presentations, infographics, and documents with shared brand controls — dedicated tools (PowerPoint, Canva) may still edge it out for single-format depth.",
    bestFor: [
      "Marketing and ops teams producing a mix of presentations, reports, and infographics",
      "Consultants/agencies wanting brand-consistent client deliverables across formats",
    ],
    avoidIf: [
      "You only need one format (e.g. just presentations) and want a tool specialized for that",
      "Your projects need more than 500 MB storage or 50 slides regularly — you'll need a paid plan quickly",
    ],
    pros: [
      "Genuinely covers presentations, infographics, and documents in one editor",
      "Brand kit keeps output consistent across content types",
      "Built-in data visualization tools beyond basic charts",
    ],
    cons: [
      "Free plan's storage and slide caps are restrictive for regular use",
      "Per-person annual pricing on Starter/Pro can add up for small teams",
      "Not as deep as single-purpose tools in any one format",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.visme.co/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["font-pairing", "photo-editor"],
  },
  {
    id: "piktochart",
    name: "Piktochart",
    // DRAFT - review before publish
    tagline: "Template-driven infographic and report builder aimed at marketers and educators without design backgrounds.",
    logoUrl: "https://www.google.com/s2/favicons?domain=piktochart.com&sz=128",
    website: "https://piktochart.com",

    category: "design",
    subCategory: "presentation-infographic",
    industries: ["freelancers", "agencies", "nonprofits", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Web-based, available globally — VERIFY any regional pricing differences.",
    useCases: ["design infographics", "create reports and one-pagers", "build simple presentations", "education/classroom visual content"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Infographic and report templates",
      "Chart/data visualization builder",
      "Brand kit for colors/fonts/logos",
      "Team collaboration on higher tiers",
      "Education and nonprofit discount plans",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for marketers, educators, and nonprofits who specifically need infographic/report templates rather than a general-purpose design tool — pricing figures from secondary sources disagreed with each other significantly, so confirm directly before trusting any number.",
    bestFor: [
      "Marketers and educators producing infographics and data-driven one-pagers",
      "Nonprofits and small teams wanting discounted access to infographic templates",
    ],
    avoidIf: [
      "You need broader general-purpose design capability (Canva/Visme cover more formats)",
      "You need pricing certainty right now — reported free-tier and paid pricing varied noticeably across sources during research",
    ],
    pros: [
      "Focused specifically on infographic/data-storytelling templates",
      "Discounted education and nonprofit plans reported to exist",
      "Simple, low-learning-curve editor",
    ],
    cons: [
      "Narrower format focus than Canva or Visme",
      "Secondary sources gave inconsistent free-tier and pricing details — none confirmed via a direct vendor-page WebFetch",
      "Smaller template/asset library than larger competitors",
    ],

    popularityScore: 42,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://piktochart.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["font-pairing", "color-converter"],
  },
  {
    id: "venngage",
    name: "Venngage",
    // DRAFT - review before publish
    tagline: "Infographic, report, and chart-builder tool aimed at marketing and internal-communications teams.",
    logoUrl: "https://www.google.com/s2/favicons?domain=venngage.com&sz=128",
    website: "https://venngage.com",

    category: "design",
    subCategory: "presentation-infographic",
    industries: ["freelancers", "agencies", "nonprofits", "consulting"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Web-based, available globally — no known sign-up region restrictions.",
    useCases: ["design infographics", "build reports and case studies", "create charts/data visualizations", "internal communications visuals"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["5 designs total, 6 image uploads, public sharing only, free AI trial, basic icons"] },
      { name: "Premium", priceMonthly: 19, priceAnnual: 10, currency: "USD", keyLimits: ["$10/mo billed annually (51% savings); unlimited designs, 50 image uploads, private sharing, PNG/Hi-Res PNG export, email & chat support"] },
      { name: "Business", priceMonthly: 49, priceAnnual: 24, currency: "USD", keyLimits: ["Per user; $24/user/mo billed annually; unlimited designs, 1,000 image uploads, PDF/PowerPoint export, brand kits, team sharing, password protection, priority support"] },
      { name: "Enterprise", priceMonthly: 499, priceAnnual: null, currency: "USD", keyLimits: ["Starting price, minimum 10 team members; dedicated account manager, multi-factor authentication, live onboarding, custom integrations"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan caps you at just 5 designs total (not per month) and 6 image uploads, with public-only sharing and no PDF/PPT export — enough to try the editor once, not to build an ongoing design library.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Infographic and report templates",
      "Chart and data visualization tools",
      "Brand kit on Business tier",
      "Team sharing and password-protected designs",
      "AI design assistance (trial on Free)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams producing recurring infographics and data-driven reports who want brand-consistent output at the Business tier — the free plan's 5-design cap makes it more of a demo than a usable free tier.",
    bestFor: [
      "Marketing and comms teams regularly producing infographics/reports",
      "Agencies wanting private sharing and brand kits for client deliverables",
    ],
    avoidIf: [
      "You expect real ongoing use from the free plan — its 5-design lifetime cap is very restrictive",
      "You need a broader general design tool beyond infographics/reports/charts",
    ],
    pros: [
      "Strong focus on data visualization and infographic templates",
      "Business tier adds real team features (brand kits, password protection)",
      "Significant annual-billing discount (~51%) versus monthly",
    ],
    cons: [
      "Free plan's 5-design total cap (not monthly) is unusually restrictive",
      "Per-user pricing on Business scales up for larger teams",
      "Enterprise has a steep $499/mo starting price with a 10-person minimum",
    ],

    popularityScore: 50,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://venngage.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["font-pairing", "color-converter"],
  },
  {
    id: "gamma-design",
    name: "Gamma",
    // DRAFT - review before publish
    tagline: "AI-generated presentations, documents, and webpages from a prompt or outline — credit-based, not slide-by-slide.",
    logoUrl: "https://www.google.com/s2/favicons?domain=gamma.app&sz=128",
    website: "https://gamma.app",

    category: "design",
    subCategory: "presentation-infographic",
    industries: ["freelancers", "agencies", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Web-based, available globally — VERIFY any regional pricing differences.",
    useCases: ["AI-generated presentations", "AI-generated documents/one-pagers", "quick webpage/microsite generation", "pitch deck creation"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "AI-generated presentations/documents from a prompt or outline",
      "AI-generated webpages/microsites",
      "Credit-based AI generation system",
      "Custom branding and fonts on paid tiers",
      "Analytics on shared content",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for people who want a fast first draft of a deck/doc from a prompt rather than building slide-by-slide — heavier design customization still requires manual editing after generation, and pricing needs direct confirmation before publishing.",
    bestFor: [
      "Founders and consultants who want a fast, presentable first-draft deck from a prompt",
      "Teams prototyping pitch decks or one-pagers before manual polish",
    ],
    avoidIf: [
      "You need precise, manual slide-by-slide layout control (PowerPoint/Keynote/Beautiful.ai fit better)",
      "You need pricing certainty right now — vendor pricing page could not be confirmed via WebFetch during research",
    ],
    pros: [
      "Genuinely fast first-draft generation from a prompt or outline",
      "Can generate webpages/microsites, not just slide decks",
      "Modern, clean default visual style out of the box",
    ],
    cons: [
      "Credit-based generation system adds a usage variable beyond flat plan limits",
      "AI-generated output still needs manual refinement for anything client-facing",
      "Vendor pricing page returned 403 across multiple attempts during verification — confirm current tiers directly",
    ],

    popularityScore: 70,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://gamma.app/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["font-pairing"],
  },
  {
    id: "beautiful-ai",
    name: "Beautiful.ai",
    // DRAFT - review before publish
    tagline: "Presentation tool with smart templates that auto-adjust layout as you edit — designed to keep slides looking clean by default.",
    logoUrl: "https://www.google.com/s2/favicons?domain=beautiful.ai&sz=128",
    website: "https://www.beautiful.ai",

    category: "design",
    subCategory: "presentation-infographic",
    industries: ["freelancers", "agencies", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Web-based, available globally — no known sign-up region restrictions.",
    useCases: ["build presentations", "pitch deck creation", "team slide template standardization", "one-off single-presentation projects"],
    pricingModel: "subscription",

    pricing: [
      { name: "Pro (Individual)", priceMonthly: 12, priceAnnual: 144, currency: "USD", keyLimits: ["Billed annually; 14-day free trial requiring a credit card; 1 user"] },
      { name: "Team", priceMonthly: 50, priceAnnual: 40, currency: "USD", keyLimits: ["Per user; $40/user/mo billed annually ($480/user/year), $50/user/mo billed monthly; 2-20 seats per workspace"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; unlimited users, demo available on request"] },
      { name: "Single Presentation (one-time)", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["$45 one-time; includes everything in the monthly Pro plan for that one presentation"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier — Beautiful.ai offers a 14-day free trial that requires a credit card and gives full, unlimited-slide access to Pro features, converting automatically to a paid Pro subscription ($12/mo billed annually) unless canceled first.",
    startingPrice: 12,
    currency: "USD",

    keyFeatures: [
      "Smart templates that auto-adjust layout/spacing as you edit",
      "Team-wide slide template library",
      "One-off single-presentation purchase option",
      "Presentation analytics on Team/Enterprise",
      "Real-time collaboration",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for people who consistently produce clean-looking slides without much design effort — the auto-layout approach trades some manual control for speed and consistency, and there's no free tier to test drive without a credit card.",
    bestFor: [
      "Individuals and consultants who want polished slides without manual layout work",
      "Teams wanting a standardized, on-brand slide template library",
    ],
    avoidIf: [
      "You want full manual control over slide layout (PowerPoint/Keynote/Gamma give more freedom)",
      "You want to try it without giving a credit card — the trial requires one and auto-converts to paid",
    ],
    pros: [
      "Auto-adjusting layouts genuinely reduce time spent on slide formatting",
      "One-off single-presentation purchase option is unusual and useful for occasional users",
      "Team template library helps keep decks visually consistent across an org",
    ],
    cons: [
      "No free tier — the trial requires a credit card and auto-converts to a paid subscription",
      "Auto-layout approach means less granular manual control than traditional slide tools",
      "Team plan's per-user pricing has a fairly high 2-20 seat structure to navigate",
    ],

    popularityScore: 48,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.beautiful.ai/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["font-pairing"],
  },
];
