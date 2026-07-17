import type { AppListing } from "../types";

// Scaffolded via research pass — 20 well-known Education & Learning products
// spanning course-creation platforms for solo creators/coaches (Teachable,
// Kajabi, Podia, Thinkific, LearnWorlds, Systeme.io, Kartra), institutional
// / corporate LMS platforms (Canvas, Moodle, Docebo, TalentLMS, 360Learning,
// Articulate 360, Absorb LMS, iSpring Learn, Cornerstone OnDemand, SAP
// Litmos), and large skill/cohort platforms (Udemy Business, Coursera for
// Business, LinkedIn Learning).
//
// Every field tagged with the literal string "VERIFY" is a placeholder for
// a fact (pricing tier, price, free-tier limit, or integration list) that
// must be checked against the vendor's own live pricing page before this
// listing is published — see docs/apps-verification-checklist.md. Do not
// replace "VERIFY" with a remembered or guessed value.
//
// Several vendors here (Canvas/Instructure, Docebo, Absorb LMS, iSpring
// Learn, Cornerstone OnDemand, SAP Litmos, Udemy Business, Coursera for
// Business, LinkedIn Learning) publish no self-serve dollar pricing at all
// — enterprise/institutional LMS and cohort-platform sales are overwhelmingly
// quote-led in this category. Those listings are intentionally left with
// VERIFY pricing rather than a guessed number; see the research notes in the
// final report for exactly what was tried on each.
//
// Editorial fields (tagline, verdict, bestFor, avoidIf, pros, cons) are
// well-reasoned drafts based on each tool's general reputation and market
// positioning, marked "// DRAFT - review before publish" — apply your own
// judgement before these go live.
//
// The publish guard lives in lib/apps/index.ts (isPricingVerified /
// ALL_APPS): any listing still carrying a VERIFY pricing fact is excluded
// from the production directory automatically.

export const EDUCATION_APPS: AppListing[] = [
  {
    id: "teachable",
    name: "Teachable",
    // DRAFT - review before publish
    tagline: "Polished course-and-coaching platform for solo creators, now with 0% transaction fees above Starter.",
    logoUrl: "https://www.google.com/s2/favicons?domain=teachable.com&sz=128",
    website: "https://teachable.com",

    category: "education",
    subCategory: "course-creation-platform",
    industries: ["freelancers", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Global payouts and multi-currency checkout; international card processing runs a higher fee (3.9% + 30c) than US cards (2.9% + 30c).",
    useCases: ["sell online courses", "host coaching programs", "issue certificates", "build a creator storefront", "sell digital downloads"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter", priceMonthly: 39, priceAnnual: 29, currency: "USD", keyLimits: ["7.5% transaction fee, 5 products, 1 admin, 100 active students, 1TB video storage"] },
      { name: "Builder", priceMonthly: 89, priceAnnual: 69, currency: "USD", keyLimits: ["0% transaction fee, 10 products, 1 admin, 1,000 active students, affiliate program, community"] },
      { name: "Growth", priceMonthly: 189, priceAnnual: 139, currency: "USD", keyLimits: ["0% transaction fee, 50 products, 5 admins, 5,000 active students, custom branding, advanced permissions, subtitles/translations"] },
      { name: "Custom", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — dedicated success manager, priority support, migration assistance"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free plan — every tier is a paid subscription starting at $39/mo ($29/mo billed annually). New accounts get a 7-day free trial plus a 30-day money-back guarantee instead of an ongoing free tier, and Starter still carries a 7.5% per-sale transaction fee on top of card processing fees.",
    startingPrice: 29,
    currency: "USD",

    keyFeatures: [
      "Drag-and-drop course builder with quizzes and certificates",
      "Built-in payments with global payouts",
      "Coaching/community features on higher tiers",
      "AI-assisted course creation tools",
      "Native mobile app for learners",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for solo creators and coaches who want a polished, low-maintenance storefront for courses without touching code — the 7.5% Starter transaction fee means most serious sellers need to jump to Builder ($89/mo) fairly quickly.",
    bestFor: [
      "Solo creators and coaches selling a handful of premium courses or coaching programs",
      "Sellers who want built-in payments/payouts rather than wiring up Stripe themselves",
    ],
    avoidIf: [
      "You're just testing an idea and don't want to commit to a paid plan from day one — there's no free tier, only a 7-day trial",
      "You need a full corporate LMS with SCORM compliance tracking for a workforce, not a creator storefront",
    ],
    pros: [
      "Clean, learner-friendly course player and checkout experience",
      "0% transaction fees once you're on Builder or above",
      "Strong template/design quality out of the box",
    ],
    cons: [
      "No free tier — Starter's 7.5% transaction fee is steep for early-stage sellers",
      "Active-student caps force upgrades as a course grows, independent of revenue",
      "Enterprise tier pricing (Core/Pro, per-user with high annual minimums) is a very different product from the creator plans",
    ],

    popularityScore: 84,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://teachable.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["word-counter"],
  },
  {
    id: "kajabi",
    name: "Kajabi",
    // DRAFT - review before publish
    tagline: "All-in-one course, marketing, and funnel platform for creators who want to run their whole business from one tool.",
    logoUrl: "https://www.google.com/s2/favicons?domain=kajabi.com&sz=128",
    website: "https://kajabi.com",

    category: "education",
    subCategory: "course-creation-platform",
    industries: ["freelancers", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current regional payment/tax handling and any country restrictions on Kajabi Payments.",
    useCases: ["sell online courses", "run email marketing campaigns", "build sales funnels and landing pages", "host coaching/membership programs", "manage a creator CRM"],
    pricingModel: "subscription",

    pricing: [
      { name: "Basic", priceMonthly: 179, priceAnnual: 143, currency: "USD", keyLimits: ["5 products, 2,500 contacts, 2 admin users, unlimited marketing emails; 2.9%+30c payment processing (Kajabi Payments)"] },
      { name: "Growth", priceMonthly: 249, priceAnnual: 199, currency: "USD", keyLimits: ["50 products, 25,000 contacts, 11 admin users, unlimited marketing emails; lower payment processing rate"] },
      { name: "Pro", priceMonthly: 499, priceAnnual: 399, currency: "USD", keyLimits: ["Unlimited products, 100,000 contacts, 26 admin users, unlimited marketing emails; lowest payment processing rate"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No ongoing free plan — a lower entry-level \"Starter\" tier exists (1 product, 250 contacts, 2 admins) but its price wasn't clearly published on the current pricing page, so it's omitted here rather than guessed. Kajabi instead offers a 30-day free trial (no credit card required) before billing starts at Basic ($179/mo, $143/mo billed annually).",
    startingPrice: 143,
    currency: "USD",

    keyFeatures: [
      "Courses, coaching, communities, and podcasts in one product",
      "Built-in email marketing and automation",
      "Landing page and sales funnel builder",
      "Native mobile app for learners",
      "Built-in CRM and pipeline tracking",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for creators who want to consolidate courses, email marketing, funnels, and community into a single subscription instead of stitching together separate tools — that consolidation comes at a materially higher starting price than course-only platforms like Thinkific or Podia.",
    bestFor: [
      "Established creators/coaches who want courses, marketing, and funnels under one roof",
      "Businesses ready to pay a premium to avoid tool-stitching (email tool + funnel builder + course host)",
    ],
    avoidIf: [
      "You're just starting out and want the lowest possible entry price — Basic starts at $179/mo with no real free tier",
      "You only need a simple course host and don't want to pay for marketing/funnel features you won't use",
    ],
    pros: [
      "Genuinely all-in-one: courses, email marketing, funnels, and community without third-party integrations",
      "Admin-user and contact limits scale generously as you move up tiers",
      "Payment processing rate improves on higher tiers, rewarding growth",
    ],
    cons: [
      "Highest starting price among mainstream course-creation platforms in this list",
      "Entry-level Starter plan's pricing isn't clearly published — confirm before assuming it's a cheaper on-ramp",
      "Breadth of built-in marketing tools can be more than solo creators who just want to sell a course actually need",
    ],

    popularityScore: 85,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://kajabi.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["word-counter"],
  },
  {
    id: "podia",
    name: "Podia",
    // DRAFT - review before publish
    tagline: "Budget-friendly course, community, and digital-download platform with no-fee plans above the entry tier.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.podia.com&sz=128",
    website: "https://www.podia.com",

    category: "education",
    subCategory: "course-creation-platform",
    industries: ["freelancers", "consulting"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY current regional payment/tax handling.",
    useCases: ["sell online courses", "host a community", "sell digital downloads", "run coaching/webinars", "email marketing to subscribers"],
    pricingModel: "subscription",

    pricing: [
      { name: "Mover", priceMonthly: 42, priceAnnual: 504, currency: "USD", keyLimits: ["Up to 100 email subscribers, 5% Podia transaction fee, 50 products, 500 videos, 25 community spaces"] },
      { name: "Shaker", priceMonthly: 84, priceAnnual: 1008, currency: "USD", keyLimits: ["Up to 500 email subscribers, no Podia fees, 150 products, 1,000 videos, 100 spaces, 1 assistant seat, affiliate marketing"] },
      { name: "Earthquaker", priceMonthly: 150, priceAnnual: 1800, currency: "USD", keyLimits: ["Up to 1,000 email subscribers, no Podia fees, unlimited products/videos/spaces/assistants"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free plan — Podia runs a 30-day free trial with full feature access and no credit card required, after which the cheapest plan (Mover, $42/mo) still charges a 5% transaction fee on top of payment-processor fees; that fee disappears only on Shaker and above.",
    startingPrice: 42,
    currency: "USD",

    keyFeatures: [
      "Courses, digital downloads, and communities in one product",
      "Built-in email marketing to your subscriber list",
      "Live and pre-recorded webinars/coaching",
      "Affiliate marketing tools (Shaker and above)",
      "Zapier integration for connecting other tools",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for creators who want a simpler, cheaper alternative to Kajabi with courses, community, and digital downloads bundled together — the entry-tier 5% transaction fee and low subscriber caps mean growing creators outgrow Mover fast.",
    bestFor: [
      "Creators selling a mix of courses and digital downloads who want one affordable tool",
      "Solo educators building a paid community alongside their course content",
    ],
    avoidIf: [
      "You have a subscriber list over 1,000 people already — even the top plan caps at 1,000 email subscribers",
      "You want zero transaction fees from day one — Mover's 5% fee only disappears once you upgrade to Shaker",
    ],
    pros: [
      "Noticeably cheaper entry point than Kajabi for similar core functionality",
      "Combines courses, downloads, and community without extra add-ons",
      "Straightforward, uncluttered interface for non-technical creators",
    ],
    cons: [
      "Email subscriber caps (100/500/1,000) are lower than most competitors' contact limits",
      "Mover's 5% transaction fee stacks on top of standard payment processing fees",
      "No native mobile app for learners at time of review — confirm current status",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.podia.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["word-counter"],
  },
  {
    id: "thinkific",
    name: "Thinkific",
    // DRAFT - review before publish
    tagline: "Unlimited-courses platform with generous student caps and no per-course transaction fees on paid plans.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.thinkific.com&sz=128",
    website: "https://www.thinkific.com",

    category: "education",
    subCategory: "course-creation-platform",
    industries: ["freelancers", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current regional payment/tax handling.",
    useCases: ["sell online courses", "host a learning community", "sell digital downloads", "run a membership site", "corporate-style course delivery for small teams"],
    pricingModel: "subscription",

    pricing: [
      { name: "Basic", priceMonthly: 54, priceAnnual: 40, currency: "USD", keyLimits: ["10,000 current students, unlimited courses, 100 GB video bandwidth/mo, 1 community, 5 digital downloads"] },
      { name: "Start", priceMonthly: 109, priceAnnual: 82, currency: "USD", keyLimits: ["10,000 current students, unlimited courses, 200 GB video bandwidth/mo, 1 community, unlimited digital downloads"] },
      { name: "Grow", priceMonthly: 219, priceAnnual: 164, currency: "USD", keyLimits: ["10,000 current students, unlimited courses, 400 GB video bandwidth/mo, 3 communities, unlimited digital downloads"] },
      { name: "Plus", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — higher student capacity, 7,500+ GB video bandwidth/mo, unlimited communities"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free plan — Thinkific offers a 30-day free trial with full platform access instead. Every paid tier already includes unlimited courses and a 10,000-student cap, which is unusually generous versus competitors that gate course/student counts tier by tier.",
    startingPrice: 40,
    currency: "USD",

    keyFeatures: [
      "Unlimited courses on every paid plan",
      "Course, community, and membership site builder",
      "No per-transaction fee on any paid plan (payment processor fees still apply)",
      "Built-in quizzes, certificates, and drip content",
      "App marketplace for extending functionality",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for creators planning multiple courses who don't want per-course or per-transaction fees eating into revenue — the jump from Basic to Start ($54 to $109/mo) is steep if you specifically need the community feature space or higher bandwidth.",
    bestFor: [
      "Creators building a catalog of multiple courses under one price cap",
      "Sellers who want to avoid per-sale transaction fees entirely",
    ],
    avoidIf: [
      "You want the cheapest possible entry point — $40/mo (annual) is mid-pack, not the lowest in the category",
      "You need advanced marketing automation/funnels bundled in — Thinkific focuses on course delivery, not marketing",
    ],
    pros: [
      "Unlimited courses and a high 10,000-student cap even on the entry plan",
      "No transaction fees on any paid tier",
      "Native mobile apps for learners on iOS and Android",
    ],
    cons: [
      "No free tier, only a 30-day trial, unlike some direct competitors",
      "Video bandwidth caps (100/200/400 GB) can matter for video-heavy courses",
      "Marketing/funnel features are thinner than Kajabi's out of the box",
    ],

    popularityScore: 74,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.thinkific.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["word-counter"],
  },
  {
    id: "learnworlds",
    name: "LearnWorlds",
    // DRAFT - review before publish
    tagline: "Feature-dense course platform aimed at training businesses, with SCORM support and interactive AI video.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.learnworlds.com&sz=128",
    website: "https://www.learnworlds.com",

    category: "education",
    subCategory: "course-creation-platform",
    industries: ["freelancers", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VAT added for EU customers without a valid VAT number; otherwise no regional sign-up restrictions.",
    useCases: ["sell online courses", "deliver SCORM-based training", "run cohort learning programs", "build interactive video lessons", "issue certificates and manage subscriptions"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter", priceMonthly: 29, priceAnnual: 24, currency: "USD", keyLimits: ["$5 per-enrollment fee, unlimited paid courses (no free courses), 1 admin, 3-page website, 24/5 email support"] },
      { name: "Pro Trainer", priceMonthly: 99, priceAnnual: 79, currency: "USD", keyLimits: ["No transaction fees, unlimited free & paid courses, 5 admins/instructors, 20 SCORM packages, subscriptions/memberships, 24/7 email support"] },
      { name: "Learning Center", priceMonthly: 299, priceAnnual: 249, currency: "USD", keyLimits: ["Unlimited SCORM, AI-generated subtitles, interactive AI video, automations, 25 admins/collaborators, API/webhooks, 3 SSO, 24/7 priority support"] },
      { name: "High Volume & Corporate", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — custom admins, flexible invoicing, dedicated success manager"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free plan — a 30-day free trial covers all core features instead. The entry Starter plan ($29/mo, $24/mo annual) is the only tier that still charges a per-enrollment fee ($5) and doesn't allow free courses; that fee disappears on Pro Trainer and above.",
    startingPrice: 24,
    currency: "USD",

    keyFeatures: [
      "SCORM-compliant course delivery (up to unlimited on top tier)",
      "AI-generated subtitles and interactive AI video lessons",
      "Built-in subscriptions and membership billing",
      "Course-builder with 1:1 and group coaching sessions",
      "API, webhooks, and SSO on higher tiers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for training businesses and coaches who specifically need SCORM compatibility or interactive AI video that simpler platforms like Podia/Teachable don't offer — Starter's $5-per-enrollment fee and no-free-courses restriction make it a poor fit for anyone testing the platform on a lead-magnet course.",
    bestFor: [
      "Training providers needing SCORM package delivery and compliance tracking",
      "Course creators who want AI-assisted interactive video without a separate authoring tool",
    ],
    avoidIf: [
      "You want to offer a free lead-magnet course — Starter explicitly disallows free courses",
      "You're cost-sensitive and don't need SCORM/interactive-video features — simpler platforms are cheaper",
    ],
    pros: [
      "SCORM support is a genuine differentiator versus Teachable/Podia/Kajabi",
      "AI-generated subtitles and interactive video are unusual, useful features at this price point",
      "Scales cleanly from solo Starter plan up to API/SSO-enabled Learning Center",
    ],
    cons: [
      "Starter tier's $5-per-enrollment fee is unusual and can be costly for high-volume, low-price courses",
      "No free courses allowed on the entry plan, unlike most competitors",
      "Feature depth (SCORM, AI video, automations) adds a learning curve versus simpler tools",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.learnworlds.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "systeme-io",
    name: "Systeme.io",
    // DRAFT - review before publish
    tagline: "All-in-one funnel, email, and course platform with a genuinely usable free plan and 0% transaction fees.",
    logoUrl: "https://www.google.com/s2/favicons?domain=systeme.io&sz=128",
    website: "https://systeme.io",

    category: "education",
    subCategory: "course-creation-platform",
    industries: ["freelancers", "consulting", "ecommerce"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY current regional payment gateway availability.",
    useCases: ["sell online courses", "build sales funnels", "run email marketing", "manage an affiliate program", "sell digital products"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["2,000 contacts, 3 sales funnels, 1 course, unlimited email sends, no credit card required"] },
      { name: "Startup", priceMonthly: 17, priceAnnual: null, currency: "USD", keyLimits: ["5,000 contacts, unlimited sales funnels, 5 courses"] },
      { name: "Webinar", priceMonthly: 47, priceAnnual: null, currency: "USD", keyLimits: ["10,000 contacts, adds automated webinar funnels"] },
      { name: "Unlimited", priceMonthly: 97, priceAnnual: null, currency: "USD", keyLimits: ["Unlimited contacts, all features, sub-accounts, free migration service"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is genuinely usable long-term (not just a trial): 2,000 contacts, 3 funnels, and 1 course with unlimited email sends and no credit card required. All plans, including Free, carry 0% Systeme.io transaction fees — the platform's main differentiator versus per-sale-fee competitors.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Course hosting bundled with funnel and email-marketing tools",
      "0% transaction fees on every plan, including Free",
      "Built-in affiliate program management",
      "Automation workflows and blog/website builder",
      "Multiple payment gateway support (Stripe, PayPal, Razorpay, etc.)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for bootstrapped creators who want courses, email, and funnels for close to nothing while validating an idea — the free plan is real, not a bait-and-switch trial, though the visual polish trails Kajabi/Teachable.",
    bestFor: [
      "New creators testing a course idea without upfront cost",
      "Bootstrapped solopreneurs who want funnels, email, and courses in one cheap tool",
    ],
    avoidIf: [
      "You want best-in-class design/UX polish for your course storefront — Systeme.io prioritizes function over visual refinement",
      "You need more than 1 course and want to stay on the free plan",
    ],
    pros: [
      "Free plan is a real, ongoing offering rather than a time-limited trial",
      "0% transaction fees across every plan tier, including Free",
      "Genuinely all-in-one: funnels, email, affiliates, and courses without extra tools",
    ],
    cons: [
      "Design/customization options are more limited than Kajabi, Teachable, or LearnWorlds",
      "Free plan's 1-course cap means most real use cases need a paid tier quickly",
      "Smaller app ecosystem/integration catalog than more established competitors",
    ],

    popularityScore: 60,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://systeme.io/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "kartra",
    name: "Kartra",
    // DRAFT - review before publish
    tagline: "Marketing-first all-in-one platform (funnels, email, helpdesk) with course/membership hosting built in.",
    logoUrl: "https://www.google.com/s2/favicons?domain=kartra.com&sz=128",
    website: "https://kartra.com",

    category: "education",
    subCategory: "course-creation-platform",
    industries: ["freelancers", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current regional payment/tax handling.",
    useCases: ["sell online courses/memberships", "build marketing funnels", "run email marketing automation", "manage affiliates", "helpdesk/support for customers"],
    pricingModel: "subscription",

    pricing: [
      { name: "Essentials", priceMonthly: 59, priceAnnual: 52, currency: "USD", keyLimits: ["500 contacts, 10,000 emails/mo, 5 pages, 1 product, 1 custom domain, 30 Kartra AI uses"] },
      { name: "Starter", priceMonthly: 119, priceAnnual: 99, currency: "USD", keyLimits: ["2,500 contacts, unlimited emails/pages/products, video hosting, 5 team members"] },
      { name: "Growth", priceMonthly: 229, priceAnnual: 189, currency: "USD", keyLimits: ["12,500 contacts, 3 custom domains, automations, affiliate management, helpdesk, 10 team members"] },
      { name: "Professional", priceMonthly: 549, priceAnnual: 429, currency: "USD", keyLimits: ["25,000 contacts, 5 custom domains, real-time funnel analytics, helpdesk live chat"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free plan — Kartra offers a 14-day trial (pick a plan up front) backed by a 30-day money-back guarantee rather than an ongoing free tier. Courses/memberships are one module inside a broader marketing suite, so even the entry Essentials plan is priced like a marketing platform, not a course-only tool.",
    startingPrice: 52,
    currency: "USD",

    keyFeatures: [
      "Courses and membership sites with drip content",
      "Funnel builder, email automation, and CRM",
      "Built-in helpdesk/live chat on higher tiers",
      "Affiliate program management",
      "Kartra AI for content generation",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for sellers who want courses bundled inside a full marketing/funnel/helpdesk suite rather than a dedicated course-hosting tool — if course delivery is your only need, dedicated platforms like Thinkific are simpler and cheaper.",
    bestFor: [
      "Marketers who want funnels, email, helpdesk, and course hosting in a single subscription",
      "Sellers running memberships alongside broader digital-product sales",
    ],
    avoidIf: [
      "Course hosting is your only need — Kartra's price reflects a full marketing suite, not just an LMS",
      "You want a free or near-free entry point — pricing starts higher than most course-only platforms",
    ],
    pros: [
      "Combines funnels, email, helpdesk, and course hosting without third-party tools",
      "Contact limits scale generously at each tier",
      "Built-in affiliate management is a genuine time-saver for creators running their own affiliate programs",
    ],
    cons: [
      "No free tier and a comparatively high starting price for course-only use cases",
      "Essentials tier's 500-contact/1-product cap is restrictive for anything beyond a single small offer",
      "Broader feature surface (funnels, helpdesk, CRM) adds a learning curve if you only want to host a course",
    ],

    popularityScore: 50,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://kartra.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "canvas-lms",
    name: "Canvas (Instructure)",
    // DRAFT - review before publish
    tagline: "The dominant LMS in North American higher education, sold in tiers with no public self-serve pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.instructure.com&sz=128",
    website: "https://www.instructure.com/canvas",

    category: "education",
    subCategory: "institutional-lms",
    industries: ["nonprofits", "consulting"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional data-hosting options — widely deployed across North America, and used internationally by higher-ed and K-12 institutions.",
    useCases: ["run a school/university LMS", "manage courses and gradebooks", "deliver K-12 or higher-ed instruction", "track assignments and outcomes", "integrate with SIS/edtech tools via LTI"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Gradebook, assignments, and course content management",
      "Canvas Studio for video-based learning",
      "LTI-based integrations with third-party edtech tools",
      "Mobile apps for students, teachers, and parents",
      "Analytics on student engagement and outcomes",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for schools, colleges, and universities that need the LMS most instructors and students already know from other institutions — pricing is entirely sales-led and scales with institution size, so budget for a procurement process rather than a self-serve signup.",
    bestFor: [
      "Colleges, universities, and school districts standardizing on a widely-adopted LMS",
      "Institutions that value a large existing ecosystem of LTI-compatible edtech integrations",
    ],
    avoidIf: [
      "You're a solo trainer or small business — Canvas is built and priced for institutional deployments, not individual course creators",
      "You want transparent, self-serve pricing you can budget without a sales call",
    ],
    pros: [
      "Extremely widely adopted in higher education, easing student/instructor onboarding",
      "Mature, deep feature set for gradebooks, outcomes tracking, and LTI integrations",
      "Strong mobile app support for students, teachers, and parents",
    ],
    cons: [
      "No public pricing at all — every price point requires a sales conversation",
      "Overkill and likely cost-prohibitive for individual trainers or small course businesses",
      "Implementation and admin overhead is substantial versus a creator-focused course platform",
    ],

    popularityScore: 88,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.instructure.com/canvas/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["study-timer", "flashcard-maker", "gpa-calculator"],
  },
  {
    id: "moodle",
    name: "Moodle",
    // DRAFT - review before publish
    tagline: "The world's most widely used open-source LMS — free to self-host, or run as paid MoodleCloud hosting.",
    logoUrl: "https://www.google.com/s2/favicons?domain=moodle.com&sz=128",
    website: "https://moodle.com",

    category: "education",
    subCategory: "institutional-lms",
    industries: ["nonprofits", "consulting"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "MoodleCloud is billed annually in Australian Dollars (AUD) with pricing shown converted to USD/EUR/GBP/CAD/INR; self-hosted Moodle has no billing region at all since the software itself is free and open source.",
    useCases: ["run a school/university LMS", "self-host an open-source learning platform", "deliver corporate or nonprofit training", "manage courses, quizzes, and grading", "run a small paid course site via MoodleCloud"],
    pricingModel: "freemium",

    pricing: [
      { name: "Moodle LMS (self-hosted)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Free, open-source software — unlimited users/courses; you provide your own hosting, setup, and maintenance"] },
      { name: "MoodleCloud Starter", priceMonthly: null, priceAnnual: 170, currency: "USD", keyLimits: ["50 users, 1 GB storage, Premium Mobile App included, billed annually"] },
      { name: "MoodleCloud Mini", priceMonthly: null, priceAnnual: 270, currency: "USD", keyLimits: ["100 users, 2.5 GB storage"] },
      { name: "MoodleCloud Small", priceMonthly: null, priceAnnual: 490, currency: "USD", keyLimits: ["200 users, 5 GB storage, Stripe sales enabled"] },
      { name: "MoodleCloud Medium", priceMonthly: null, priceAnnual: 1190, currency: "USD", keyLimits: ["500 users, 20 GB storage, Stripe sales, custom domain available as add-on"] },
      { name: "MoodleCloud Standard", priceMonthly: null, priceAnnual: 2100, currency: "USD", keyLimits: ["750 users, 50 GB storage, custom domain included"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The core Moodle LMS software is genuinely free forever as open source — the catch is you must self-host, configure, and maintain it yourself. For anyone who wants it hosted, MoodleCloud starts at $170/year (50 users, 1 GB storage) with a 28-day free trial and no credit card required, scaling up to $2,100/year for 750 users.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Fully open-source, self-hostable LMS core",
      "Extensive plugin ecosystem for quizzes, forums, and grading",
      "MoodleCloud hosted option for those who don't want to self-manage",
      "Support for SCORM and other e-learning content standards",
      "Multi-language interface used worldwide",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for schools, nonprofits, and organizations with technical capacity (or budget for Certified Service Providers) who want full control and zero licensing cost — MoodleCloud's per-user tiers get expensive quickly if you outgrow the low user caps on lower plans.",
    bestFor: [
      "Institutions and nonprofits with IT capacity to self-host and customize an open-source LMS",
      "Small organizations wanting a low-cost hosted option (MoodleCloud) without managing servers",
    ],
    avoidIf: [
      "You have no technical resources and don't want to pay for a Certified Service Provider — self-hosted Moodle has a real setup/maintenance burden",
      "You need more than 750 users on MoodleCloud — pricing beyond Standard requires a custom quote",
    ],
    pros: [
      "Genuinely free, unlimited-user, open-source core — not a crippled free tier",
      "Enormous global install base and plugin ecosystem built over two decades",
      "MoodleCloud gives a low-cost hosted path for those who don't want to self-manage",
    ],
    cons: [
      "Self-hosted Moodle requires real technical setup, hosting costs, and ongoing maintenance to run well",
      "Interface feels dated next to modern creator-focused platforms like Kajabi or Thinkific",
      "MoodleCloud user caps (50/100/200/500/750) mean costs scale in large steps as you grow",
    ],

    popularityScore: 82,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.moodlecloud.com/standard-plans/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["study-timer", "flashcard-maker"],
  },
  {
    id: "docebo",
    name: "Docebo",
    // DRAFT - review before publish
    tagline: "AI-driven enterprise LMS (Harmony AI copilot) sold entirely through custom, quote-based contracts.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.docebo.com&sz=128",
    website: "https://www.docebo.com",

    category: "education",
    subCategory: "institutional-lms",
    industries: ["consulting", "healthcare"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional data-hosting/residency options.",
    useCases: ["enterprise employee training", "customer/partner education", "compliance and certification tracking", "AI-assisted content creation for training", "skills intelligence and talent mobility"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Harmony AI copilot for content creation and learning recommendations",
      "White-labeling and multilingual course delivery",
      "Certification tracking and compliance reporting",
      "Mobile learning and gamification",
      "365Talents skills-intelligence add-on for talent mobility",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for larger enterprises that want an AI-forward LMS with skills-intelligence features and are prepared for a multi-year, quote-based contract with a typical minimum of 250+ learners — not a fit for anyone wanting to try the platform without a sales process.",
    bestFor: [
      "Mid-size to large enterprises with 250+ learners needing AI-assisted content authoring",
      "Organizations wanting skills intelligence/talent-mobility features alongside core LMS functionality",
    ],
    avoidIf: [
      "You're a small business or solo trainer — Docebo is priced and packaged for enterprise-scale deployments",
      "You want transparent self-serve pricing without a sales quote and multi-year contract",
    ],
    pros: [
      "AI copilot (Harmony AI) is a genuine differentiator for content creation at scale",
      "Flexible active-user pricing models (MAU/YAU/RAU) can fit varied usage patterns",
      "365Talents add-on extends the platform into skills/talent mobility, not just course delivery",
    ],
    cons: [
      "Zero public pricing — every deal requires a sales quote and typically a 3-5 year contract",
      "Typical minimum of 250+ learners prices out small organizations entirely",
      "Evaluating true cost requires engaging sales rather than comparing published tiers",
    ],

    popularityScore: 65,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.docebo.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "talentlms",
    name: "TalentLMS",
    // DRAFT - review before publish
    tagline: "Approachable corporate LMS with a real free tier and transparent per-user pricing up to 500 users.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.talentlms.com&sz=128",
    website: "https://www.talentlms.com",

    category: "education",
    subCategory: "institutional-lms",
    industries: ["consulting", "healthcare", "hospitality", "nonprofits"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional data-hosting options.",
    useCases: ["employee onboarding and training", "compliance training tracking", "partner/customer training", "AI-assisted course creation (TalentCraft)", "branch-based training for multi-location businesses"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 5 users, up to 10 courses, unlimited email support, generative-AI course testing"] },
      { name: "Core", priceMonthly: 119, priceAnnual: 95, currency: "USD", keyLimits: ["1-100 users, unlimited courses, 1 branch, custom domain+SSL, API access, one-time 5,000 TalentCraft AI credits"] },
      { name: "Grow", priceMonthly: 229, priceAnnual: 183, currency: "USD", keyLimits: ["1-500 users, unlimited courses, 3 branches, 5 learning paths, 10,000 monthly TalentCraft credits, AI coaching"] },
      { name: "Pro", priceMonthly: 449, priceAnnual: 359, currency: "USD", keyLimits: ["1-500 users (+$6/user beyond 100), 15 branches, unlimited learning paths, 15,000-25,000 monthly TalentCraft credits"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — 1,000+ users (flexible from 500), unlimited branches, 80,000 monthly TalentCraft credits, dedicated account manager"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan genuinely works standalone for very small teams: up to 5 users and 10 courses with no credit card required, not just a time-limited trial. It's a real ceiling though — any team past 5 users needs Core ($119/mo, $95/mo annual) at minimum.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Branch-based multi-audience training (franchises, departments, clients)",
      "TalentCraft AI-assisted course authoring",
      "Gamification and social/collaborative learning",
      "Automations for onboarding and re-enrollment",
      "Ecommerce for selling courses externally",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small-to-mid-size companies that want a genuinely self-serve, transparently-priced corporate LMS without an enterprise sales process — the 5-user free cap and steep per-tier jumps mean fast-growing teams will move through plans quickly.",
    bestFor: [
      "Small and mid-size businesses running employee onboarding/compliance training without an LMS specialist on staff",
      "Multi-location or multi-client businesses needing branch-based training separation",
    ],
    avoidIf: [
      "You need 1,000+ users on a published, non-custom price — Enterprise requires a quote",
      "You want a free tier usable beyond a handful of team members — the cap is just 5 users",
    ],
    pros: [
      "Rare example of a corporate LMS with fully transparent, published per-tier pricing up to 500 users",
      "Free tier is a genuine standalone offering, not a disguised trial",
      "Branch feature is a practical fit for franchises, departments, or external-client training",
    ],
    cons: [
      "Per-user overage fees ($6/user past 100 on Pro) can make costs less predictable as headcount grows",
      "Free plan's 5-user cap is restrictive even for small teams",
      "TalentCraft AI credit allowances add another usage dimension to track across tiers",
    ],

    popularityScore: 62,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.talentlms.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["pomodoro-timer"],
  },
  {
    id: "360learning",
    name: "360Learning",
    // DRAFT - review before publish
    tagline: "Collaborative corporate learning platform built around peer-created content, priced per active user.",
    logoUrl: "https://www.google.com/s2/favicons?domain=360learning.com&sz=128",
    website: "https://360learning.com",

    category: "education",
    subCategory: "institutional-lms",
    industries: ["consulting", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional data-hosting options.",
    useCases: ["collaborative employee onboarding", "upskilling and internal mobility", "customer/partner training", "compliance training", "peer-authored course creation"],
    pricingModel: "subscription",

    pricing: [
      { name: "Team", priceMonthly: 8, priceAnnual: null, currency: "USD", keyLimits: ["Per user/mo, up to 100 users, monthly billing with no annual commitment required, AI-powered LMS core features"] },
      { name: "Business", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — flexible registered/monthly-active-user pricing, no minimum user commitment"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — dedicated support, advanced integrations, strategic L&D guidance"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — Team is a genuinely self-serve paid plan at $8/user/month (up to 100 users, no minimum commitment, monthly billing), backed by a free trial to evaluate before paying. Business and Enterprise both require a sales demo for custom, active-user-based pricing.",
    startingPrice: 8,
    currency: "USD",

    keyFeatures: [
      "Collaborative/peer-authored course creation",
      "AI-assisted content generation from existing documents",
      "Skills tracking and internal mobility tools",
      "Discussion-based feedback loops on courses",
      "No minimum user commitment on the Team plan",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for growing teams that want a genuinely self-serve entry point (Team, $8/user/mo, no minimum) into collaborative L&D before needing to talk to sales for Business/Enterprise scale — a rare case of a corporate LMS with real published starter pricing.",
    bestFor: [
      "Small-to-mid teams (up to 100 users) wanting collaborative, peer-created training content",
      "Organizations that value active-user (not seat-based) billing flexibility at scale",
    ],
    avoidIf: [
      "You have more than 100 users and want published pricing rather than a custom Business/Enterprise quote",
      "You want a fully self-hosted or one-time-purchase LMS rather than per-user subscription billing",
    ],
    pros: [
      "Team plan is genuinely self-serve with transparent per-user pricing and no minimum commitment",
      "Collaborative course-creation model is a real differentiator from top-down corporate LMS platforms",
      "AI-assisted content generation reduces course-building overhead",
    ],
    cons: [
      "Pricing becomes opaque the moment you outgrow the 100-user Team plan",
      "No free tier, only a trial, unlike TalentLMS's standing free plan",
      "Collaborative/peer-content model may not fit organizations wanting tightly centralized, top-down training",
    ],

    popularityScore: 54,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://360learning.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "articulate-360",
    name: "Articulate 360",
    // DRAFT - review before publish
    tagline: "The industry-standard authoring toolkit for corporate e-learning content, sold as an annual per-seat subscription.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.articulate.com&sz=128",
    website: "https://www.articulate.com",

    category: "education",
    subCategory: "institutional-lms",
    industries: ["consulting", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Sold in local currency through certified resellers in some regions; US pricing shown here.",
    useCases: ["author SCORM/xAPI e-learning courses", "build interactive training modules", "localize training content into other languages", "deliver authored courses via built-in LMS (Reach)", "collaborate on course review/feedback"],
    pricingModel: "subscription",

    pricing: [
      { name: "Personal", priceMonthly: null, priceAnnual: 1449, currency: "USD", keyLimits: ["Per user/year, single-user license for independent contractors, AI-powered authoring, exports for delivery via any LMS"] },
      { name: "Teams", priceMonthly: null, priceAnnual: 1749, currency: "USD", keyLimits: ["Per user/year, adds collaboration tools and a built-in LMS (Reach) for up to 300 active learners"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — a 30-day free trial with no credit card required is offered instead. Both Personal and Teams are billed as annual, per-user subscriptions ($1,449-$1,749/user/year); localization and higher-capacity LMS delivery (Reach Pro, from $3,600/year for 1,200 learners) are separate paid add-ons.",
    startingPrice: 1449,
    currency: "USD",

    keyFeatures: [
      "Storyline and Rise 360 authoring apps for interactive courses",
      "AI-assisted course and quiz generation",
      "Built-in review/feedback collaboration workflow",
      "Reach LMS included for delivering authored courses",
      "Content library of templates, characters, and assets",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for corporate L&D teams and instructional designers who need a serious authoring toolkit for SCORM/xAPI courses, not just a course-hosting platform — this is an authoring subscription first and an LMS (via the bundled Reach) second, priced well above the creator-platform category.",
    bestFor: [
      "Instructional designers and corporate L&D teams authoring interactive SCORM/xAPI training content",
      "Organizations that already have an LMS and just need best-in-class authoring tools that export anywhere",
    ],
    avoidIf: [
      "You just want to host and sell courses to a public audience — Articulate 360 is an authoring tool, not a creator storefront",
      "Your budget doesn't support $1,449+/user/year — it's priced well above consumer course platforms",
    ],
    pros: [
      "Widely regarded as the industry-standard authoring tool for corporate e-learning content",
      "Content exports to any LMS via SCORM/xAPI, avoiding vendor lock-in for delivery",
      "Bundled Reach LMS covers basic delivery needs (up to 300 learners) without buying a separate LMS",
    ],
    cons: [
      "Per-user annual pricing is high relative to course-hosting platforms in this category",
      "Not a course-selling storefront — no built-in payments/checkout for public course sales",
      "Localization and higher-capacity LMS delivery are separate paid add-ons on top of the base subscription",
    ],

    popularityScore: 70,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.articulate.com/360/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "absorb-lms",
    name: "Absorb LMS",
    // DRAFT - review before publish
    tagline: "Enterprise LMS for employee and customer training, priced entirely by custom quote tied to learner count.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.absorblms.com&sz=128",
    website: "https://www.absorblms.com",

    category: "education",
    subCategory: "institutional-lms",
    industries: ["consulting", "healthcare"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional data-hosting options.",
    useCases: ["employee training and onboarding", "customer/partner education", "compliance training tracking", "certification management", "e-commerce for external course sales"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "AI-powered content recommendations and search",
      "Certification and compliance tracking",
      "Built-in e-commerce for selling training externally",
      "White-labeling and custom branding",
      "Reporting and analytics dashboards",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for mid-size and larger organizations needing a full-featured, compliance-capable LMS and comfortable requesting a quote based on learner count — pricing is fully custom, so there's no way to estimate cost without contacting sales.",
    bestFor: [
      "Mid-size to large organizations needing compliance/certification tracking at scale",
      "Businesses wanting to sell training externally via built-in e-commerce",
    ],
    avoidIf: [
      "You want to compare pricing across vendors without submitting a sales inquiry to each",
      "You're a solo trainer or very small team — Absorb's pricing tiers start at 1-50 learners but the quote process itself assumes an institutional buyer",
    ],
    pros: [
      "Learner-count-based pricing tiers (1-50 up to 25,000+) suggest reasonable flexibility across company sizes",
      "Built-in e-commerce is useful for organizations monetizing training externally",
      "Established enterprise LMS with strong compliance/certification feature depth",
    ],
    cons: [
      "Zero public pricing — every quote requires submitting a sales inquiry",
      "No stated free trial or free tier on the public pricing page",
      "Hard to comparison-shop against competitors without engaging multiple sales teams",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.absorblms.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "ispring-learn",
    name: "iSpring Learn",
    // DRAFT - review before publish
    tagline: "Pay-per-active-user corporate LMS from the makers of iSpring's PowerPoint-based authoring tools.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.ispring.com&sz=128",
    website: "https://www.ispring.com",

    category: "education",
    subCategory: "institutional-lms",
    industries: ["consulting", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional data-hosting options.",
    useCases: ["employee training and onboarding", "compliance training tracking", "PowerPoint-based course authoring and delivery", "partner/customer training", "certification tracking"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Pay-per-active-user billing (only pay for users who log in)",
      "Deep integration with iSpring Suite's PowerPoint-based authoring",
      "SCORM/xAPI-compliant course delivery",
      "Built-in quizzes, certificates, and gamification",
      "Mobile app for offline learning",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for organizations already invested in iSpring's PowerPoint-based authoring tools who want tightly integrated delivery, and for teams that like the fairness of pay-per-active-user billing — exact price points weren't published clearly enough to confirm without a direct quote.",
    bestFor: [
      "Organizations using iSpring Suite for authoring who want native LMS delivery",
      "Teams that prefer only paying for users who actually log in each month",
    ],
    avoidIf: [
      "You want fully transparent published tier pricing before starting a trial",
      "You're not using or planning to use PowerPoint-based authoring workflows",
    ],
    pros: [
      "Pay-per-active-user model can be cost-efficient for organizations with large but sporadically-active rosters",
      "Tight integration with iSpring's well-known PowerPoint-based course authoring tools",
      "Enterprise-scale customization available for 100+ user organizations",
    ],
    cons: [
      "Public pricing page did not disclose clear dollar figures at time of review — confirm via trial or sales before publishing exact tiers",
      "Value proposition is strongest specifically for existing iSpring Suite users, less differentiated otherwise",
      "Less brand recognition than Docebo, Cornerstone, or Absorb in the enterprise LMS space",
    ],

    popularityScore: 48,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.ispring.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "cornerstone-ondemand",
    name: "Cornerstone OnDemand",
    // DRAFT - review before publish
    tagline: "Large enterprise HR/learning suite (talent management plus LMS) sold entirely through custom quotes.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.cornerstoneondemand.com&sz=128",
    website: "https://www.cornerstoneondemand.com",

    category: "education",
    subCategory: "institutional-lms",
    industries: ["consulting", "healthcare"],
    businessSizes: ["enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional data-hosting options.",
    useCases: ["enterprise employee training", "talent management and succession planning", "compliance training tracking", "skills and career development", "large-scale certification programs"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Learning management combined with broader talent-management suite",
      "Skills-based development and career pathing",
      "Compliance training and certification tracking",
      "AI-powered content recommendations",
      "Extensive third-party content library integrations",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for large enterprises that want learning bundled with a broader talent-management suite (performance, succession planning) rather than a standalone LMS — pricing is entirely sales-led with no public figures at any tier, so this is a multi-stakeholder procurement decision, not a self-serve signup.",
    bestFor: [
      "Large enterprises consolidating LMS and talent-management needs under one vendor",
      "Organizations with dedicated HR/L&D procurement processes and budget for enterprise software",
    ],
    avoidIf: [
      "You're a small or mid-size business — Cornerstone is built and sold for large-enterprise scale",
      "You want a standalone LMS without the broader (and pricier) talent-management suite attached",
    ],
    pros: [
      "Combines LMS with performance/succession/talent-management tools under one platform",
      "Long-established vendor with deep enterprise HR-tech integration experience",
      "Extensive third-party learning content marketplace integrations",
    ],
    cons: [
      "Zero public pricing whatsoever — the page explicitly states cost depends on org size/needs with no ballpark given",
      "No free trial or demo-free way to explore the product",
      "Likely cost-prohibitive and over-featured for smaller organizations that just need course delivery",
    ],

    popularityScore: 60,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.cornerstoneondemand.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "sap-litmos",
    name: "SAP Litmos",
    // DRAFT - review before publish
    tagline: "SAP-owned corporate LMS with a large ready-made compliance course library, sold via custom quote.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.litmos.com&sz=128",
    website: "https://www.litmos.com",

    category: "education",
    subCategory: "institutional-lms",
    industries: ["consulting", "healthcare", "hospitality"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional data-hosting options.",
    useCases: ["employee training and onboarding", "compliance training tracking", "sales/customer training", "off-the-shelf compliance course delivery", "AI-assisted content authoring"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Large built-in library of off-the-shelf compliance/soft-skills courses",
      "AI Assistant and AI content authoring (Platinum AI tier)",
      "AI/ML-based video assessments",
      "Integration with the broader SAP ecosystem (e.g. SuccessFactors)",
      "Mobile learning app",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for organizations already in the SAP ecosystem, or those that specifically want a large ready-made compliance course library rather than building content from scratch — like most enterprise LMS competitors here, pricing is entirely quote-based.",
    bestFor: [
      "Organizations already using SAP SuccessFactors or other SAP HR tools wanting tighter ecosystem integration",
      "Businesses that want a large pre-built compliance/soft-skills course library included",
    ],
    avoidIf: [
      "You're not in or planning to join the SAP ecosystem — the integration advantage disappears",
      "You want published pricing to compare before requesting a demo",
    ],
    pros: [
      "Large ready-made compliance course library reduces content-creation burden",
      "AI Assistant and AI/ML video assessment features on the Platinum AI tier are relatively advanced",
      "Backing of SAP gives it enterprise credibility and roadmap stability",
    ],
    cons: [
      "No public pricing at any tier — Foundation, Platinum, and Platinum AI are all \"contact for pricing\"",
      "Value is strongest specifically for existing SAP customers; standalone appeal is less clear",
      "No stated free trial on the public pricing page",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.litmos.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "udemy-business",
    name: "Udemy Business",
    // DRAFT - review before publish
    tagline: "Access to Udemy's massive marketplace course catalog, licensed for teams — pricing page blocked automated access.",
    logoUrl: "https://www.google.com/s2/favicons?domain=business.udemy.com&sz=128",
    website: "https://business.udemy.com",

    category: "education",
    subCategory: "skill-cohort-platform",
    industries: ["consulting"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional pricing/currency handling.",
    useCases: ["upskill employees via marketplace courses", "technical/professional skill development", "compliance training add-ons", "team learning analytics", "AI-assisted skill gap analysis"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Access to Udemy's large third-party instructor course marketplace",
      "Team learning paths and skills tracking",
      "AI-powered skill gap analysis and recommendations",
      "Admin dashboards and usage analytics",
      "Option to add Udemy's own compliance course library",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for organizations that want breadth over depth — instant access to thousands of marketplace courses across technical and soft skills rather than a curated, purpose-built curriculum — pricing wasn't accessible during this research pass and needs direct confirmation.",
    bestFor: [
      "Companies wanting broad, self-serve access to technical/professional courses without building content",
      "Teams that value course variety and frequent catalog updates over a single-author curriculum",
    ],
    avoidIf: [
      "You need a tightly curated, brand-consistent curriculum rather than a broad third-party marketplace",
      "You need compliance-specific training as the core use case — that's a separate add-on, not the core catalog",
    ],
    pros: [
      "Enormous, constantly-updated course catalog spanning technical and soft skills",
      "Marketplace model means new content appears without your team commissioning it",
      "Strong brand recognition makes adoption easier for employees",
    ],
    cons: [
      "Pricing page blocked automated access during verification (403) — could not confirm current tiers/minimums",
      "Course quality varies by instructor since it's a marketplace, not a single curated curriculum",
      "Compliance-specific training typically requires a separate add-on rather than being core to the base plan",
    ],

    popularityScore: 78,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://business.udemy.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["pomodoro-timer"],
  },
  {
    id: "coursera-for-business",
    name: "Coursera for Business",
    // DRAFT - review before publish
    tagline: "University-and-industry-partner course catalog (including full degrees/certificates) licensed for teams.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.coursera.org&sz=128",
    website: "https://www.coursera.org/business",

    category: "education",
    subCategory: "skill-cohort-platform",
    industries: ["consulting"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional pricing/currency handling.",
    useCases: ["upskill employees via university/industry-partner courses", "professional certificate programs", "leadership and technical skill development", "GenAI/data-skills training", "team learning analytics"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Courses and certificates from universities and industry partners (Google, IBM, Meta, etc.)",
      "Professional Certificates and degree-adjacent programs",
      "Skills benchmarking and gap analysis",
      "GenAI Academy content for AI upskilling",
      "Team usage analytics and admin controls",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for organizations that want credentialed, university-backed content (not just marketplace courses) for upskilling programs — the pricing page renders its dollar figures via JavaScript and the Team tier's price could not be confirmed, so treat published numbers with caution until checked live.",
    bestFor: [
      "Companies wanting credentialed content from real universities and known industry partners",
      "Teams pursuing structured certificate or degree-adjacent upskilling paths",
    ],
    avoidIf: [
      "You need the widest possible raw course-count breadth — Udemy Business's marketplace catalog is larger",
      "You're under 500 users and want a fast self-serve checkout — the Team plan exists but its live price wasn't confirmable, and 500+ users requires an Enterprise sales conversation regardless",
    ],
    pros: [
      "University and named industry-partner content lends more credibility than open marketplace platforms",
      "Structured Professional Certificate and degree-adjacent pathways support formal upskilling programs",
      "14-day money-back guarantee stated on the Team plan reduces evaluation risk",
    ],
    cons: [
      "Team plan pricing is rendered dynamically and wasn't confirmable via direct fetch during verification",
      "500+ user Enterprise tier is fully custom-quote, same as most competitors here",
      "Narrower catalog breadth than pure marketplace platforms like Udemy Business",
    ],

    popularityScore: 76,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.coursera.org/business/compare-plans",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "linkedin-learning",
    name: "LinkedIn Learning",
    // DRAFT - review before publish
    tagline: "Video course library from LinkedIn/Microsoft, sold as an individual subscription or a business license.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.linkedin.com&sz=128",
    website: "https://www.linkedin.com/learning",

    category: "education",
    subCategory: "skill-cohort-platform",
    industries: ["consulting"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional pricing/currency handling.",
    useCases: ["individual professional skill-building", "team upskilling licensed via LinkedIn Learning for business", "leadership and soft-skills training", "technical/software skill courses", "learning tied to LinkedIn profile/skill badges"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Large video course library across business, tech, and creative skills",
      "Skill badges shareable directly on a LinkedIn profile",
      "Learning paths curated by role or skill goal",
      "Admin analytics for business/enterprise licenses",
      "Integration with LinkedIn's broader professional network data",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for individuals and teams who want polished, broadly-applicable video courses with the added social proof of LinkedIn profile skill badges — pricing pages sit behind LinkedIn's login wall and weren't accessible during this research pass, so treat any remembered figure as unconfirmed.",
    bestFor: [
      "Professionals wanting broad, well-produced skill-building content tied to their LinkedIn profile",
      "Companies wanting a recognizable brand-name upskilling benefit for employees",
    ],
    avoidIf: [
      "You need deep, technical, hands-on courses (labs, certifications) rather than video-lecture-style content",
      "You're not already invested in the LinkedIn ecosystem and don't value the profile-badge integration",
    ],
    pros: [
      "Consistently high production quality across its video course library",
      "Skill badges tie directly into a user's LinkedIn profile, adding social/professional proof",
      "Strong brand recognition makes it an easy employee benefit to communicate",
    ],
    cons: [
      "Pricing pages are behind a LinkedIn login wall and could not be verified directly during this research pass",
      "Course format leans heavily video-lecture style, lighter on hands-on/interactive practice than some competitors",
      "Individual subscription value is tightly bundled with broader LinkedIn Premium tiers, which can complicate cost comparison",
    ],

    popularityScore: 80,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.linkedin.com/learning",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["pomodoro-timer"],
  },
];
