import type { AppListing } from "../types";

// Scaffolded via research pass — 20 well-known Email Marketing tools
// (newsletters, campaign sending, and marketing automation).
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
// Category-specific note: most email marketing tools price by contact/
// subscriber count rather than a single flat monthly fee. Where a vendor's
// pricing scales with list size, the `pricing[].priceMonthly` figure below
// is the *entry-level* rate at the lowest published contact tier (usually
// 500-1,000 contacts) — `keyLimits` calls out that it scales, and
// `freeTierReality` spells out the mechanic in plain language. Three
// listings (ActiveCampaign, Sendlane, Flodesk) were left fully VERIFY
// because their live pricing pages are gated behind an interactive
// contact-count slider that returns no dollar figures to an automated
// fetch, and third-party sources disagreed on whether quoted figures were
// monthly or annual-billed rates — see the report accompanying this file.

export const EMAIL_MARKETING_APPS: AppListing[] = [
  {
    id: "mailchimp",
    name: "Mailchimp",
    // DRAFT - review before publish
    tagline: "The default email platform for small businesses — a huge feature set, but pricing climbs fast once the intro discount ends.",
    logoUrl: "https://www.google.com/s2/favicons?domain=mailchimp.com&sz=128",
    website: "https://mailchimp.com",

    category: "email-marketing",
    subCategory: "email-marketing",
    industries: ["retail", "ecommerce", "agencies", "nonprofits", "hospitality"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global", "north-america"],
    regionNotes: "Available worldwide with localized templates; deepest integration/support ecosystem is US-centric — VERIFY current regional pricing and currency options.",
    useCases: ["send newsletters", "email automation", "audience segmentation", "landing pages", "signup forms", "A/B testing"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 250 contacts", "500 sends/month (250/day cap)", "1 seat, 1 audience"] },
      { name: "Essentials", priceMonthly: 13, priceAnnual: null, currency: "USD", keyLimits: ["Up to 2,500 contacts, 10x contacts in monthly sends", "3 seats, 3 audiences", "Price includes an introductory 50% discount for the first 12 months — confirm standard renewal rate"] },
      { name: "Standard", priceMonthly: 20, priceAnnual: null, currency: "USD", keyLimits: ["Marketing automation (up to 200 journeys), 12x contacts in monthly sends", "5 seats, 5 audiences", "Introductory 50% discount for 12 months — confirm renewal rate"] },
      { name: "Premium", priceMonthly: 350, priceAnnual: null, currency: "USD", keyLimits: ["Unlimited seats and audiences, advanced segmentation, phone support", "15x contacts in monthly sends", "Custom pricing above ~200,000 contacts"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan caps out at 250 contacts and 500 sends/month (250/day) with Mailchimp branding. All paid tiers carry a 50%-off introductory discount for the first 12 months — confirm the standard renewal price before relying on the list price long-term, and expect cost to climb further as your contact list grows.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Drag-and-drop email builder",
      "Marketing automation journeys",
      "Audience segmentation and tagging",
      "Landing pages and signup forms",
      "A/B and multivariate testing",
      "Built-in light CRM/customer journey tools",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The safe default for small businesses that want one platform for email, light CRM, and landing pages — budget for the price roughly doubling once the first-year discount ends and your list grows.",
    bestFor: [
      "Small businesses wanting one all-in-one marketing tool, not just email",
      "Retailers, agencies, and nonprofits already inside the Mailchimp ecosystem",
    ],
    avoidIf: [
      "You're ecommerce-first and want Klaviyo/Omnisend-grade purchase-triggered flows",
      "You're price-sensitive about the renewal rate once the first-year discount expires",
    ],
    pros: [
      "Huge template and integration library",
      "Reasonably capable free tier to start with",
      "All-in-one: email, landing pages, light CRM, forms",
    ],
    cons: [
      "Pricing has risen substantially and the free tier keeps shrinking",
      "Introductory discounts make the real long-term cost easy to underestimate",
      "Automation depth lags dedicated ecommerce tools like Klaviyo",
    ],

    popularityScore: 92,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://mailchimp.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "klaviyo",
    name: "Klaviyo",
    // DRAFT - review before publish
    tagline: "Ecommerce's default email/SMS platform — deep Shopify integration and purchase-triggered flows, priced on active profiles that climbs fast.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.klaviyo.com&sz=128",
    website: "https://www.klaviyo.com",

    category: "email-marketing",
    subCategory: "marketing-automation",
    industries: ["ecommerce", "retail"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global", "north-america", "europe"],
    regionNotes: "Built around Shopify/BigCommerce/WooCommerce worldwide; SMS features are strongest in the US/Canada — VERIFY current SMS coverage outside North America.",
    useCases: ["ecommerce email flows", "abandoned cart emails", "SMS marketing", "audience segmentation", "A/B testing", "email automation"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 250 active profiles", "500 emails/month", "$5/month credit toward SMS or mobile push", "Email support only for the first 60 days"] },
      { name: "Email", priceMonthly: 20, priceAnnual: null, currency: "USD", keyLimits: ["From $20/mo at 500 active profiles, rising with list size (~$30/mo at 1,000, ~$100/mo at 5,000)", "Unlimited email sends, full flow automation and segmentation", "SMS billed separately on top"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is capped at 250 active profiles and 500 emails/month, with a $5/month credit toward SMS or mobile push. Paid plans price by active profile count, not a flat fee — expect roughly $20/mo at 500 profiles, ~$30/mo at 1,000, and rising steeply beyond that; SMS is a separate add-on cost.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Deep Shopify/BigCommerce/WooCommerce integration",
      "Pre-built ecommerce automation flows (abandoned cart, browse abandonment, post-purchase)",
      "SMS and mobile push alongside email",
      "Predictive analytics (CLV, churn risk)",
      "Advanced segmentation on purchase behavior",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The category leader for ecommerce brands that want email, SMS, and purchase-behavior automation in one place — expensive at scale, and overkill if you're not selling products online.",
    bestFor: [
      "Ecommerce brands, especially on Shopify, wanting flows tied to purchase behavior",
      "Stores ready to combine email and SMS in one platform",
    ],
    avoidIf: [
      "You're not an ecommerce business — the flow library and pricing model are built around orders and carts",
      "You're extremely price-sensitive; active-profile pricing climbs quickly as you grow",
    ],
    pros: [
      "Best-in-class ecommerce automation flows out of the box",
      "Tight native integration with major ecommerce platforms",
      "Strong reporting tied directly to revenue attribution",
    ],
    cons: [
      "Price scales aggressively with active profile count, not just contacts you actually email",
      "SMS is a separate cost layered on top of the email plan",
      "Steeper learning curve than simpler newsletter tools",
    ],

    popularityScore: 90,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.klaviyo.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "kit",
    name: "Kit (formerly ConvertKit)",
    // DRAFT - review before publish
    tagline: "Newsletter and automation tooling built for solo creators monetizing an audience — not for teams running ecommerce campaigns.",
    logoUrl: "https://www.google.com/s2/favicons?domain=kit.com&sz=128",
    website: "https://kit.com",

    category: "email-marketing",
    subCategory: "newsletter",
    industries: ["freelancers"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Pricing and payouts are USD-denominated; digital product and paid-subscription sales run through Kit Commerce — VERIFY current international payout support.",
    useCases: ["send newsletters", "monetize newsletter", "email automation", "landing pages", "paid subscriptions", "digital product sales"],
    pricingModel: "freemium",

    pricing: [
      { name: "Newsletter (Free)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 10,000 subscribers", "1 basic visual automation", "Unlimited landing pages, forms, and broadcasts", "Digital product/subscription sales enabled"] },
      { name: "Creator", priceMonthly: 33, priceAnnual: 32.5, currency: "USD", keyLimits: ["At 1,000 subscribers; scales up with list size", "Unlimited visual automations and sequences, A/B testing, SMS marketing"] },
      { name: "Pro", priceMonthly: 66, priceAnnual: 65.83, currency: "USD", keyLimits: ["At 1,000 subscribers; scales up with list size", "Adds Subscriber Signals, engagement analytics, unlimited users, deliverability reporting"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Newsletter (free) plan covers up to 10,000 subscribers with unlimited broadcasts, forms, and landing pages, plus one basic automation — genuinely generous for a free tier. Creator/Pro pricing shown is for the first 1,000 subscribers and scales up as your list grows; a 14-day free trial applies to paid plans.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Free tier scales to 10,000 subscribers",
      "Visual automation builder (paid tiers)",
      "Landing pages, forms, and paid newsletter subscriptions",
      "Digital product and course selling (Kit Commerce)",
      "Creator-focused audience monetization tools",
      "Built-in creator recommendation/referral network",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for individual creators and writers monetizing a newsletter directly — not built for multi-person marketing teams running ecommerce campaigns.",
    bestFor: [
      "Solo creators, writers, and coaches monetizing an email list directly",
      "Anyone who wants a genuinely generous free tier up to 10,000 subscribers",
    ],
    avoidIf: [
      "You're a multi-person marketing team needing granular roles/permissions",
      "You need deep ecommerce order-triggered automation (Klaviyo/Omnisend fit better)",
    ],
    pros: [
      "Free plan scales impressively far (10,000 subscribers) before you must pay",
      "Strong built-in tools for selling digital products and subscriptions",
      "Creator-friendly editor and audience-growth features",
    ],
    cons: [
      "Fewer ecommerce-specific integrations and flows than Klaviyo or Omnisend",
      "Automation builder is simpler than enterprise marketing-automation tools",
      "Price scales with subscriber count like most of the category",
    ],

    popularityScore: 65,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://kit.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "activecampaign",
    name: "ActiveCampaign",
    // DRAFT - review before publish
    tagline: "Marketing automation with a built-in light CRM and a genuinely powerful workflow builder — pricing is hidden behind an interactive slider.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.activecampaign.com&sz=128",
    website: "https://www.activecampaign.com",

    category: "email-marketing",
    subCategory: "marketing-automation",
    industries: ["agencies", "consulting", "ecommerce", "retail"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global", "north-america", "europe"],
    regionNotes: "VERIFY current regional payment/currency options outside the US.",
    useCases: ["email automation", "audience segmentation", "sales CRM", "ecommerce email flows", "A/B testing", "lead scoring"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Visual automation workflow builder",
      "Built-in light CRM and sales pipelines",
      "Predictive sending and lead/contact scoring",
      "Site and event tracking",
      "Deep segmentation across email, SMS, and CRM data",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small-to-mid businesses that want automation and a lightweight CRM in one tool — the automation builder is genuinely powerful, but expect to shop the contact-count slider carefully since list price rises steeply.",
    bestFor: [
      "Agencies and consultancies that want automation tied to a sales pipeline",
      "Ecommerce and service businesses outgrowing a basic newsletter tool",
    ],
    avoidIf: [
      "You just need simple newsletter sends — this is overkill for basic broadcast email",
      "You want transparent, published pricing without configuring a contact-count slider",
    ],
    pros: [
      "One of the most capable automation/workflow builders in the category",
      "Combines email marketing with a genuinely usable light CRM",
      "Strong segmentation and behavior-based triggers",
    ],
    cons: [
      "No self-serve published price list — every figure requires the interactive contact-count tool",
      "Cost rises quickly as contact count and add-ons (CRM seats, SMS) increase",
      "Steeper learning curve than simpler email tools",
    ],

    popularityScore: 80,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.activecampaign.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "constant-contact",
    name: "Constant Contact",
    // DRAFT - review before publish
    tagline: "Approachable email marketing built for small local businesses and nonprofits — no permanent free tier, and price scales with list size.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.constantcontact.com&sz=128",
    website: "https://www.constantcontact.com",

    category: "email-marketing",
    subCategory: "email-marketing",
    industries: ["nonprofits", "retail", "hospitality", "real-estate"],
    businessSizes: ["solo", "small"],
    regions: ["north-america"],
    regionNotes: "Primarily US/Canada-focused; VERIFY current availability and localization outside North America.",
    useCases: ["send newsletters", "audience segmentation", "event marketing", "signup forms", "A/B testing"],
    pricingModel: "subscription",

    pricing: [
      { name: "Lite", priceMonthly: 12, priceAnnual: null, currency: "USD", keyLimits: ["At 500 contacts; email sends capped at ~10x contact count/month", "Basic templates and reporting"] },
      { name: "Standard", priceMonthly: 35, priceAnnual: null, currency: "USD", keyLimits: ["At 500 contacts; sends capped at ~12x contact count/month", "Automation, A/B testing, resend to non-openers"] },
      { name: "Premium", priceMonthly: 80, priceAnnual: null, currency: "USD", keyLimits: ["At 500 contacts; sends capped at ~24x contact count/month", "Advanced automation, dynamic content"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier — free trial only. The $12/$35/$80 starting prices apply at 500 contacts and scale up steeply as your list grows (e.g. Standard reaches roughly $110/mo and Premium roughly $200/mo around 5,000 contacts). Annual billing saves up to 15%; nonprofits get a discount.",
    startingPrice: 12,
    currency: "USD",

    keyFeatures: [
      "Event marketing and RSVP tools",
      "Social media posting alongside email",
      "Signup forms and landing pages",
      "Automated resend-to-non-openers",
      "Nonprofit discount program",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "A dependable, easy-to-learn choice for small local businesses and nonprofits that want straightforward email marketing — not the cheapest or most automation-rich option as your list grows.",
    bestFor: [
      "Small local businesses and nonprofits new to email marketing",
      "Organizations that value phone support and event/RSVP tools",
    ],
    avoidIf: [
      "You want a genuinely free tier to start on, not just a trial",
      "You need ecommerce-grade automation flows",
    ],
    pros: [
      "Simple, approachable interface for non-marketers",
      "Strong event marketing and nonprofit-friendly features",
      "Good live support reputation relative to category peers",
    ],
    cons: [
      "No free tier — only a time-limited trial",
      "Pricing scales aggressively and non-linearly with list size",
      "Automation and segmentation are less advanced than ActiveCampaign/Klaviyo",
    ],

    popularityScore: 70,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.constantcontact.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "brevo",
    name: "Brevo",
    // DRAFT - review before publish
    tagline: "Formerly Sendinblue — a genuinely useful free plan and email-volume-based pricing rather than contact-count pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.brevo.com&sz=128",
    website: "https://www.brevo.com",

    category: "email-marketing",
    subCategory: "email-marketing",
    industries: ["ecommerce", "retail", "agencies", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global", "europe"],
    regionNotes: "French-founded (formerly Sendinblue); strong EU presence with GDPR-forward positioning, also widely used in the US — VERIFY current regional payment options.",
    useCases: ["send newsletters", "email automation", "SMS marketing", "transactional email", "signup forms", "CRM"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 300 emails/day", "Contacts stored unlimited (up to ~100,000 in practice)", "Brevo branding, 1 user, automation limited to 2,000 contacts"] },
      { name: "Starter", priceMonthly: 9, priceAnnual: null, currency: "USD", keyLimits: ["From $9/mo at 5,000 emails/month, rising with volume (e.g. ~$29/mo at 20,000, ~$69/mo at 100,000)", "Removes daily send cap; keeps Brevo branding; no automation/A-B testing/landing pages"] },
      { name: "Standard", priceMonthly: 18, priceAnnual: null, currency: "USD", keyLimits: ["From $18/mo at 5,000 emails/month, rising with volume similarly to Starter", "Removes branding, adds automation, A/B testing, landing pages"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — cited from roughly $499/mo for high-volume senders needing dedicated support/SLAs"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan caps sends at 300 emails/day (not a monthly contact cap) and keeps Brevo branding; automation is limited to 2,000 contacts. Paid tiers are priced by monthly email volume rather than contact count, and Brevo retired its old \"Business\" plan name in late 2025 in favor of Starter/Standard/Enterprise.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Free plan with unlimited contact storage (send-volume capped, not contact capped)",
      "Combined email, SMS, and transactional email in one platform",
      "Built-in light CRM and WhatsApp campaigns",
      "Marketing automation workflows",
      "Landing page builder",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "One of the best genuinely-free starting points in the category, especially if you have a large contact list but send infrequently — automation and branding removal require moving up to Standard.",
    bestFor: [
      "Budget-conscious small businesses with large contact lists but modest send volume",
      "Teams that want email, SMS, and transactional email under one bill",
    ],
    avoidIf: [
      "You need automation or A/B testing on the entry-level Starter plan — you'll need Standard",
      "You want the most polished, US-market-first brand experience",
    ],
    pros: [
      "Free plan stores unlimited contacts (only sends are capped)",
      "Volume-based pricing can be cheaper than contact-based pricing for large, low-frequency lists",
      "SMS, WhatsApp, and transactional email bundled into the same platform",
    ],
    cons: [
      "Entry-level Starter plan lacks automation, A/B testing, and landing pages",
      "Recent plan renaming (Business → Standard/Enterprise) makes older reviews/comparisons outdated",
      "Deliverability reputation is mixed compared to Klaviyo/Mailchimp in some user reports",
    ],

    popularityScore: 75,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.brevo.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "getresponse",
    name: "GetResponse",
    // DRAFT - review before publish
    tagline: "Email marketing bundled with webinars, a course creator, and ecommerce tools — a free plan plus solid mid-market automation.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.getresponse.com&sz=128",
    website: "https://www.getresponse.com",

    category: "email-marketing",
    subCategory: "marketing-automation",
    industries: ["ecommerce", "consulting", "agencies"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global", "europe"],
    regionNotes: "Polish-founded, strong European user base alongside global reach — VERIFY current regional currency/payment options.",
    useCases: ["send newsletters", "email automation", "webinars", "landing pages", "ecommerce email flows", "online courses"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 500 contacts", "Up to 2,500 newsletter sends/month", "1 landing page, limited automation"] },
      { name: "Starter", priceMonthly: 19, priceAnnual: 15.58, currency: "USD", keyLimits: ["At 1,000 contacts, scales with list size (e.g. ~$79/mo at 10,000 contacts)", "Unlimited sends, 1 automation workflow, limited AI tools"] },
      { name: "Marketer", priceMonthly: 59, priceAnnual: 48.38, currency: "USD", keyLimits: ["At 1,000 contacts, scales with list size", "Unlimited automation workflows, ecommerce tools, advanced segmentation"] },
      { name: "Creator", priceMonthly: 69, priceAnnual: 56.58, currency: "USD", keyLimits: ["At 1,000 contacts, scales with list size", "Adds course creator (up to 500 students), webinars, website builder"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — SMS, mobile push, dedicated support, SSO, unlimited users"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan covers up to 500 contacts and 2,500 newsletter sends/month with limited automation and one landing page — a real free tier, not just a trial. Paid tiers are priced at the 1,000-contact level and scale up with list size; annual billing saves roughly 18%.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Marketing automation builder",
      "Built-in webinar hosting",
      "Online course/community creator tools",
      "Ecommerce integrations and abandoned cart emails",
      "Landing pages and website builder",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Good value for solo creators and small businesses that want webinars or a course platform bundled with email marketing — the free tier is a real starting point, not just bait.",
    bestFor: [
      "Creators and coaches who want webinars/courses alongside email in one subscription",
      "Small ecommerce businesses wanting automation without ActiveCampaign-level pricing",
    ],
    avoidIf: [
      "You only need simple newsletter sends and don't want to pay for webinar/course features you won't use",
      "You need best-in-class ecommerce flow depth (Klaviyo/Omnisend are stronger here)",
    ],
    pros: [
      "Real free tier with 500 contacts, not just a time-limited trial",
      "Webinars and course creation bundled in rather than a separate purchase",
      "Competitive pricing relative to ActiveCampaign/HubSpot at the low end",
    ],
    cons: [
      "Interface feels less modern than Kit or MailerLite",
      "Ecommerce automation depth trails Klaviyo/Omnisend",
      "Higher tiers needed to unlock full automation and ecommerce tools",
    ],

    popularityScore: 60,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.getresponse.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "mailerlite",
    name: "MailerLite",
    // DRAFT - review before publish
    tagline: "Clean, affordable email marketing with a genuinely usable free plan — a favorite for solo creators and small businesses on a budget.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.mailerlite.com&sz=128",
    website: "https://www.mailerlite.com",

    category: "email-marketing",
    subCategory: "email-marketing",
    industries: ["freelancers", "agencies", "ecommerce", "nonprofits"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY current regional payment and localization support.",
    useCases: ["send newsletters", "email automation", "landing pages", "signup forms", "ecommerce email flows"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 250 active subscribers", "2,500 emails/month", "2 user seats, 1 website/landing page"] },
      { name: "Comfort", priceMonthly: 12, priceAnnual: null, currency: "USD", keyLimits: ["At entry subscriber tier; monthly email allowance is 10x the subscriber ceiling", "3 user seats, unlimited templates, AI writing assistant"] },
      { name: "Power", priceMonthly: 25, priceAnnual: null, currency: "USD", keyLimits: ["At entry subscriber tier", "Unlimited monthly emails (fair use policy), unlimited seats, 24/7 live chat"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote for 200,000+ subscribers — dedicated success manager, deliverability support"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is capped at 250 active subscribers and 2,500 emails/month but includes automation, a basic website/landing page, and 2 user seats — a real starting point. Paid tiers scale their monthly email allowance and price with subscriber count; annual billing saves roughly 10%.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Clean drag-and-drop email builder",
      "Marketing automation workflows",
      "Website and landing page builder included",
      "AI writing assistant",
      "Digital product/subscription selling",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "One of the best value picks in the category for solo creators and small teams — a real free tier, clean interface, and prices that stay reasonable well past the free plan.",
    bestFor: [
      "Solo creators and small businesses wanting a simple, affordable email tool",
      "Nonprofits and agencies that want automation without enterprise-tier pricing",
    ],
    avoidIf: [
      "You need deep ecommerce-specific flows or advanced CRM features",
      "You need enterprise-grade deliverability support at high volume without a custom quote",
    ],
    pros: [
      "Free plan is genuinely usable, not just a teaser",
      "Clean, modern interface that's easy to learn",
      "Strong price-to-feature ratio compared to Mailchimp/Constant Contact",
    ],
    cons: [
      "Fewer advanced ecommerce integrations than Klaviyo/Omnisend",
      "Support responsiveness on lower tiers can lag behind premium competitors",
      "Smaller third-party app ecosystem than Mailchimp",
    ],

    popularityScore: 72,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.mailerlite.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "hubspot-marketing-hub",
    name: "HubSpot Marketing Hub",
    // DRAFT - review before publish
    tagline: "Enterprise-grade marketing automation tied to HubSpot's CRM — powerful, but Professional/Enterprise pricing is a big jump from the entry tiers.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.hubspot.com&sz=128",
    website: "https://www.hubspot.com",

    category: "email-marketing",
    subCategory: "marketing-automation",
    industries: ["agencies", "consulting", "ecommerce", "retail", "healthcare", "real-estate"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global", "north-america", "europe"],
    regionNotes: "Global product with broad localization; VERIFY current regional pricing/currency.",
    useCases: ["email automation", "audience segmentation", "landing pages", "lead scoring", "A/B testing", "CRM-linked marketing"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free tools", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["2,000 email sends/calendar month with HubSpot branding", "Up to 50 active CRM list segments"] },
      { name: "Starter", priceMonthly: 20, priceAnnual: 15, currency: "USD", keyLimits: ["Priced per seat; 1,000 marketing contacts included", "Removes branding, adds basic email automation — confirm current promotional vs. standard rate"] },
      { name: "Professional", priceMonthly: 800, priceAnnual: null, currency: "USD", keyLimits: ["2,000 marketing contacts, 3 core seats included (additional seats ~$45/mo)", "Unlimited email automation, advanced segmentation; separate ~$3,000 onboarding fee"] },
      { name: "Enterprise", priceMonthly: 3600, priceAnnual: null, currency: "USD", keyLimits: ["10,000 marketing contacts, 5 core seats included (additional seats ~$75/mo)", "Advanced personalization; separate ~$7,000 onboarding fee"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free marketing tools cap at 2,000 email sends/calendar month with HubSpot branding. Starter is priced per seat with sources disagreeing on the exact standard vs. promotional monthly rate ($9-$20/seat/mo depending on billing cycle and current promo) — confirm the live rate before publishing. Professional and Enterprise both carry separate one-time onboarding fees on top of the monthly subscription.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Marketing automation tied directly to HubSpot CRM data",
      "Lead scoring and advanced list segmentation",
      "Landing pages, forms, and A/B testing",
      "Multi-channel campaigns (email, social, ads) from one tool",
      "Deep reporting and attribution",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for mid-market and larger businesses that want marketing automation tightly integrated with a full CRM/sales stack — the jump from Starter to Professional pricing is steep, so confirm the real cost before committing.",
    bestFor: [
      "Businesses already using (or planning to use) HubSpot's CRM/Sales Hub",
      "Marketing teams that need lead scoring and multi-channel campaigns in one system",
    ],
    avoidIf: [
      "You just need newsletter sends — this is a large, expensive tool for that alone",
      "You're a solo creator or very small business; the per-seat and per-contact pricing adds up fast",
    ],
    pros: [
      "Deepest CRM-to-marketing integration in the category",
      "Free tools tier is a genuine (if limited) way to start",
      "Scales into enterprise-grade automation and reporting",
    ],
    cons: [
      "Professional and Enterprise pricing (plus onboarding fees) is a major jump from Starter",
      "Per-seat and per-contact pricing compounds quickly for growing teams",
      "Steep learning curve relative to dedicated email tools",
    ],

    popularityScore: 85,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.hubspot.com/pricing/marketing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "moosend",
    name: "Moosend",
    // DRAFT - review before publish
    tagline: "Budget-friendly email automation with unlimited sends on every paid plan — no permanent free tier, just a 30-day trial.",
    logoUrl: "https://www.google.com/s2/favicons?domain=moosend.com&sz=128",
    website: "https://moosend.com",

    category: "email-marketing",
    subCategory: "email-marketing",
    industries: ["ecommerce", "retail", "agencies"],
    businessSizes: ["solo", "small"],
    regions: ["global", "europe"],
    regionNotes: "Greek-founded, part of Sitecore; VERIFY current regional payment/localization support.",
    useCases: ["send newsletters", "email automation", "landing pages", "ecommerce email flows", "transactional email"],
    pricingModel: "subscription",

    pricing: [
      { name: "Pro", priceMonthly: 9, priceAnnual: 7.65, currency: "USD", keyLimits: ["At 500 subscribers, scales with list size up to 1,000,000+", "Unlimited campaigns/sends, automation, landing pages, forms"] },
      { name: "Moosend+", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — Pro features plus selectable add-ons (dedicated IP, SSO, transactional email)"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote for 250,000+ contacts — dedicated account manager, deliverability optimization"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free plan — a 30-day free trial (no credit card required) covers up to 1,000 contacts with unlimited sends. The Pro plan starts at $9/month at 500 subscribers with a 20% discount for annual billing, and pay-as-you-go email credit packs are available separately.",
    startingPrice: 9,
    currency: "USD",

    keyFeatures: [
      "Unlimited email sends on every paid plan",
      "Marketing automation workflows",
      "Landing pages and subscription forms",
      "AI writing assistant",
      "Transactional email via SMTP (add-on)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A solid budget pick if unlimited sends matter more to you than a permanent free tier — less brand recognition than Mailchimp/MailerLite, but competitively priced at low subscriber counts.",
    bestFor: [
      "Price-sensitive small businesses that send frequently and want unlimited emails included",
      "Agencies managing several small client lists on a budget",
    ],
    avoidIf: [
      "You want a genuine free-forever tier, not just a 30-day trial",
      "You need a large third-party integration marketplace",
    ],
    pros: [
      "Unlimited sends included on the entry paid plan",
      "Competitive entry price relative to Mailchimp/Constant Contact",
      "Pay-as-you-go credits available for occasional senders",
    ],
    cons: [
      "No permanent free plan — only a time-limited trial",
      "Smaller brand recognition and integration ecosystem than category leaders",
      "Advanced features increasingly pushed into custom-quote add-ons",
    ],

    popularityScore: 40,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://moosend.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "omnisend",
    name: "Omnisend",
    // DRAFT - review before publish
    tagline: "Ecommerce email and SMS built for Shopify sellers — a real free tier, and pricing that stays approachable at small list sizes.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.omnisend.com&sz=128",
    website: "https://www.omnisend.com",

    category: "email-marketing",
    subCategory: "marketing-automation",
    industries: ["ecommerce", "retail"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current regional payment/localization support; SMS coverage varies by country.",
    useCases: ["ecommerce email flows", "abandoned cart emails", "SMS marketing", "web push notifications", "audience segmentation"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 250 contacts", "500 emails/month", "All features available, sending capacity limited"] },
      { name: "Standard", priceMonthly: 16, priceAnnual: null, currency: "USD", keyLimits: ["At 500 contacts, 6,000 emails/month; scales with list size", "Unlimited web push notifications, forms"] },
      { name: "Pro", priceMonthly: 59, priceAnnual: null, currency: "USD", keyLimits: ["At 2,500 contacts, unlimited emails/month; scales with list size", "AI personalization, advanced reporting; SMS billed separately from ~$0.007/message"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is capped at 250 contacts and 500 emails/month but includes every feature (automation, forms, segmentation) at that scale. Standard and Pro prices shown are list price at the lowest published contact tier and rise as your list grows; time-limited promotional discounts (e.g. 30% off) may lower the displayed price further. A custom plan exists above roughly 150,000 contacts.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Ecommerce-specific automation flows (cart recovery, welcome, win-back)",
      "SMS and web push notifications alongside email",
      "Product recommendation blocks in emails",
      "Native integrations with Shopify, BigCommerce, WooCommerce",
      "Segmentation based on purchase and browsing behavior",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "A strong, more affordable alternative to Klaviyo for small-to-mid ecommerce sellers who want flows, SMS, and web push without Klaviyo's steeper pricing curve.",
    bestFor: [
      "Small-to-mid ecommerce stores wanting Klaviyo-style flows at a lower entry price",
      "Shopify/BigCommerce sellers wanting SMS and web push bundled with email",
    ],
    avoidIf: [
      "You're not selling products online — the feature set is built entirely around ecommerce",
      "You need Klaviyo's depth of predictive analytics and enterprise-scale reporting",
    ],
    pros: [
      "Free tier includes full feature access, not a stripped-down version",
      "Generally cheaper than Klaviyo at comparable contact counts",
      "SMS and web push included in the same automation flows",
    ],
    cons: [
      "Feature depth and reporting sophistication trail Klaviyo at the high end",
      "Displayed prices often include time-limited promotional discounts — confirm renewal rate",
      "SMS costs add up separately on top of the email plan",
    ],

    popularityScore: 68,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.omnisend.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "drip",
    name: "Drip",
    // DRAFT - review before publish
    tagline: "Ecommerce-focused marketing automation with unlimited sends on every plan — no free tier, priced by contact count.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.drip.com&sz=128",
    website: "https://www.drip.com",

    category: "email-marketing",
    subCategory: "marketing-automation",
    industries: ["ecommerce", "retail"],
    businessSizes: ["small", "medium"],
    regions: ["global", "north-america"],
    regionNotes: "VERIFY current regional payment/localization support.",
    useCases: ["ecommerce email flows", "abandoned cart emails", "audience segmentation", "email automation", "A/B testing"],
    pricingModel: "subscription",

    pricing: [
      { name: "Core", priceMonthly: 39, priceAnnual: null, currency: "USD", keyLimits: ["Up to 2,500 subscribers, unlimited email sends", "Full automation workflows, segmentation, and API access included"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — a 14-day free trial requiring no credit card. Pricing is a single scaling tier starting at $39/month for up to 2,500 subscribers, rising with list size; annual billing typically saves 15-25%.",
    startingPrice: 39,
    currency: "USD",

    keyFeatures: [
      "Visual automation workflow builder",
      "Ecommerce revenue attribution reporting",
      "Onsite popups and forms",
      "Behavior- and purchase-based segmentation",
      "Free migration and workflow setup assistance",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A capable Klaviyo alternative for ecommerce brands that want unlimited sends baked into one flat scaling tier rather than shopping across multiple plan names.",
    bestFor: [
      "Ecommerce brands wanting straightforward, single-tier pricing with unlimited sends",
      "Stores that outgrew a generic newsletter tool but don't need Klaviyo's full breadth",
    ],
    avoidIf: [
      "You want a free tier to start on before committing to a paid plan",
      "You need SMS as a first-class channel — VERIFY current SMS support",
    ],
    pros: [
      "Simple single-tier pricing structure rather than multiple named plans",
      "Unlimited email sends included at every contact tier",
      "Solid ecommerce-specific automation and attribution reporting",
    ],
    cons: [
      "No free plan — trial only",
      "Smaller brand recognition and integration marketplace than Klaviyo/Mailchimp",
      "Fewer bundled channels (no native web push, limited SMS) compared to Omnisend",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.drip.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "aweber",
    name: "AWeber",
    // DRAFT - review before publish
    tagline: "One of the oldest names in email marketing — a genuine free-forever plan for small lists, though the interface feels dated.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.aweber.com&sz=128",
    website: "https://www.aweber.com",

    category: "email-marketing",
    subCategory: "email-marketing",
    industries: ["freelancers", "consulting", "agencies"],
    businessSizes: ["solo", "small"],
    regions: ["north-america", "global"],
    regionNotes: "US-founded; usable globally but VERIFY current regional payment/localization support.",
    useCases: ["send newsletters", "email automation", "landing pages", "signup forms", "AI subject line writing"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 500 subscribers", "3,000 emails/month", "AWeber branding on emails/landing pages"] },
      { name: "Lite", priceMonthly: 15, priceAnnual: 12.49, currency: "USD", keyLimits: ["At 500 subscribers, ~10x subscriber count in monthly sends", "1 email list, 3 landing pages, 3 automations, 3 users"] },
      { name: "Plus", priceMonthly: 30, priceAnnual: 19.99, currency: "USD", keyLimits: ["At 500 subscribers, ~12x subscriber count in monthly sends", "Unlimited lists, landing pages, automations, and users"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is genuinely free forever (no trial timer, no card required) for up to 500 subscribers and 3,000 emails/month, including automation and the AI subject-line tool — though it carries AWeber branding. Paid tiers are priced at the 500-subscriber level and rise with list size; AWeber recommends contacting sales above 100,000 subscribers.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Free-forever plan with a full feature set, not a stripped demo",
      "AI subject line writer",
      "Landing pages and signup forms",
      "Automation workflows (Plus and above)",
      "24/7 phone/email/chat support, even on the free plan",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "A solid pick for freelancers and small businesses that want a genuinely free, full-featured entry point and don't mind a less modern interface than newer competitors.",
    bestFor: [
      "Freelancers and consultants who want a real free plan with support included",
      "Small businesses that value long-standing deliverability and support reputation over flashy design",
    ],
    avoidIf: [
      "You want the most modern, design-forward editor (Flodesk/Kit look more polished)",
      "You need advanced ecommerce automation flows",
    ],
    pros: [
      "Free plan is genuinely free forever with real support access",
      "Long track record and generally solid deliverability reputation",
      "Unlimited lists, automations, and users on the Plus tier",
    ],
    cons: [
      "Interface and template library feel dated next to Kit/Flodesk/MailerLite",
      "Ecommerce-specific automation is thinner than Klaviyo/Omnisend/Drip",
      "Free and Lite plans carry AWeber branding",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.aweber.com/pricing.htm",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "campaign-monitor",
    name: "Campaign Monitor",
    // DRAFT - review before publish
    tagline: "Design-forward email marketing now under Marigold — prices rose significantly after a 2025 rebrand, so shop carefully.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.campaignmonitor.com&sz=128",
    website: "https://www.campaignmonitor.com",

    category: "email-marketing",
    subCategory: "email-marketing",
    industries: ["agencies", "retail", "nonprofits", "hospitality"],
    businessSizes: ["small", "medium"],
    regions: ["global", "north-america", "oceania"],
    regionNotes: "Originally Australian-founded, now part of Marigold (US); VERIFY current regional pricing/currency.",
    useCases: ["send newsletters", "email automation", "audience segmentation", "signup forms", "A/B testing"],
    pricingModel: "subscription",

    pricing: [
      { name: "Lite", priceMonthly: 13, priceAnnual: null, currency: "USD", keyLimits: ["At 500 contacts; send cap around 5x contact count/month", "Basic templates, signup forms"] },
      { name: "Essentials", priceMonthly: 31, priceAnnual: null, currency: "USD", keyLimits: ["At 500 contacts; unlimited sends", "Unlimited automated workflows, inbox/spam preview testing, multi-user access"] },
      { name: "Premier", priceMonthly: 171, priceAnnual: null, currency: "USD", keyLimits: ["At 500 contacts; unlimited sends", "Advanced behavior-based segmentation, send-time optimization, website builder"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free plan — only a 30-day trial capped at 500 contacts and 500 sends. Campaign Monitor rebranded its plans and raised prices significantly in 2025 after being acquired by Marigold; the figures above reflect the current post-rebrand pricing at the 500-contact tier.",
    startingPrice: 13,
    currency: "USD",

    keyFeatures: [
      "Polished, design-focused email builder",
      "Automated customer journeys",
      "Inbox and spam preview testing",
      "Behavior-based segmentation (Premier)",
      "Website builder included on Premier",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Still a solid choice for design-conscious teams, but the 2025 price increases make it a harder sell against MailerLite or Brevo at the same contact counts — compare current pricing carefully before choosing.",
    bestFor: [
      "Agencies and brands that prioritize polished, on-brand email design",
      "Teams already invested in Marigold's broader marketing platform",
    ],
    avoidIf: [
      "You're price-sensitive — recent increases make this pricier than MailerLite/Brevo/Omnisend at similar contact counts",
      "You want a genuine free tier, not just a 30-day trial",
    ],
    pros: [
      "Strong template design quality and inbox-preview testing",
      "Unlimited sends from the Essentials tier up",
      "Established deliverability reputation",
    ],
    cons: [
      "2025 price increases pushed it well above comparable competitors",
      "No permanent free plan",
      "Automation depth trails dedicated marketing-automation tools",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.campaignmonitor.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "sendlane",
    name: "Sendlane",
    // DRAFT - review before publish
    tagline: "Ecommerce email/SMS platform with a hands-on support reputation — now part of Privy, and pricing is in flux post-acquisition.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.sendlane.com&sz=128",
    website: "https://www.sendlane.com",

    category: "email-marketing",
    subCategory: "marketing-automation",
    industries: ["ecommerce", "retail"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global", "north-america"],
    regionNotes: "US-founded; VERIFY current regional availability, especially given the January 2026 acquisition by Privy.",
    useCases: ["ecommerce email flows", "SMS marketing", "abandoned cart emails", "audience segmentation"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — Sendlane was acquired by Privy in January 2026 and published pricing appears to be in transition"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Ecommerce automation flows (cart recovery, post-purchase, win-back)",
      "SMS marketing alongside email",
      "Unlimited contact storage, priced on send volume",
      "Advanced segmentation and multivariate testing",
      "Hands-on onboarding and support",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Historically a service-heavy alternative to Klaviyo for mid-market ecommerce brands, but the January 2026 acquisition by Privy makes current pricing and product direction uncertain — confirm both before recommending it.",
    bestFor: [
      "Established ecommerce brands wanting high-touch onboarding and support",
      "Teams already evaluating Privy's broader ecommerce marketing suite",
    ],
    avoidIf: [
      "You want a low-cost entry point — Sendlane has historically targeted mid-to-large senders, not small lists",
      "You want pricing/product stability — the platform is mid-acquisition as of this writing",
    ],
    pros: [
      "Reputation for hands-on, high-touch customer support",
      "Unlimited contact storage with volume-based pricing",
      "Solid ecommerce-specific flow library",
    ],
    cons: [
      "Recent acquisition by Privy (January 2026) creates real uncertainty around pricing and roadmap",
      "Historically a higher price floor than Klaviyo/Omnisend, less suited to small lists",
      "Smaller market share and brand recognition than category leaders",
    ],

    popularityScore: 35,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.sendlane.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "beehiiv",
    name: "beehiiv",
    // DRAFT - review before publish
    tagline: "Fast-growing newsletter platform built by ex-Morning Brew engineers — a real free tier and a 0% cut on paid subscriptions.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.beehiiv.com&sz=128",
    website: "https://www.beehiiv.com",

    category: "email-marketing",
    subCategory: "newsletter",
    industries: ["freelancers", "agencies"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global", "north-america"],
    regionNotes: "VERIFY current international payout/localization support.",
    useCases: ["send newsletters", "monetize newsletter", "paid subscriptions", "audience growth", "podcasts", "email automation"],
    pricingModel: "freemium",

    pricing: [
      { name: "Launch (Free)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 2,500 subscribers", "Unlimited email sends, custom domains, read-only API access"] },
      { name: "Scale", priceMonthly: 43, priceAnnual: 43.08, currency: "USD", keyLimits: ["Up to 100,000 subscribers", "Ad Network access, paid recommendations, 0% take rate on paid subscriptions, up to 3 team seats"] },
      { name: "Max", priceMonthly: 96, priceAnnual: 95.92, currency: "USD", keyLimits: ["Up to 100,000 subscribers", "Removes beehiiv branding, audio newsletters, up to 10 publications, unlimited seats"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote for 100,000+ subscribers — dedicated account manager, SSO, Send API"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Launch (free) plan covers up to 2,500 subscribers with unlimited sends, a custom domain, and read-only API access — a genuine starting point, not a stripped trial. Paid tiers take 0% commission on paid subscriber revenue (only standard payment processor fees apply), unlike Substack's percentage cut.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "0% platform take-rate on paid subscription revenue",
      "Built-in ad network for monetizing free subscribers",
      "Cross-newsletter paid recommendations/growth network",
      "Podcast and (Max tier) audio newsletter support",
      "Website builder included",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A strong alternative to Substack for writers who want to own their monetization without a percentage cut, at the cost of a flat monthly subscription instead — best once you're past a few hundred dollars a month in reader revenue.",
    bestFor: [
      "Newsletter writers who want 0% platform commission on paid subscriptions",
      "Creators who want an ad network and cross-promotion tools built in",
    ],
    avoidIf: [
      "You're pre-revenue or very early — Substack's percentage cut may cost less than a flat monthly fee at low volume",
      "You want a mobile app dedicated to writing/managing your newsletter",
    ],
    pros: [
      "Genuine free tier up to 2,500 subscribers",
      "0% take rate on paid subscriptions once you're on a paid plan",
      "Built-in monetization tools (ad network, recommendations) beyond just subscriptions",
    ],
    cons: [
      "Free plan carries beehiiv branding; removing it requires the higher Max tier",
      "Smaller third-party integration ecosystem than established ESPs",
      "No dedicated mobile app for writers as of this review",
    ],

    popularityScore: 62,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.beehiiv.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "substack",
    name: "Substack",
    // DRAFT - review before publish
    tagline: "Free to publish, no monthly fee — Substack takes a 10% cut of paid subscription revenue instead.",
    logoUrl: "https://www.google.com/s2/favicons?domain=substack.com&sz=128",
    website: "https://substack.com",

    category: "email-marketing",
    subCategory: "newsletter",
    industries: ["freelancers"],
    businessSizes: ["solo"],
    regions: ["global", "north-america"],
    regionNotes: "Payouts run through Stripe; VERIFY current country/currency payout support outside major markets.",
    useCases: ["send newsletters", "monetize newsletter", "paid subscriptions", "podcasts", "audience growth"],
    pricingModel: "free",

    pricing: [
      { name: "Free to publish", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["No subscription fee to use the platform", "Substack takes a 10% cut of paid-subscription revenue", "Stripe processing fees (~2.9% + $0.30, plus a 0.7% recurring-billing fee) apply on top"] },
    ],
    hasFreeTier: true,
    freeTierReality: "There's no monthly platform fee at all — writers keep publishing for free and Substack only takes a cut (10%) when a reader pays for a subscription, on top of standard Stripe processing fees. Net take-home is roughly 87-88% of gross subscription revenue after both cuts. This revenue-share model tends to cost less than a flat-fee competitor (beehiiv, Kit) below a few hundred dollars a month in reader revenue, and more above that threshold.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Zero platform fee — pay only as a percentage of what you actually earn",
      "Built-in reader discovery and recommendation network",
      "Podcast and video publishing alongside newsletters",
      "Reader/writer mobile apps",
      "Simple, minimal publishing interface",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The lowest-risk way to start a paid newsletter — no upfront cost, but the 10% revenue cut becomes more expensive than a flat-fee platform once you're earning a meaningful amount, so revisit the math as you grow.",
    bestFor: [
      "Writers just starting out who don't want to commit to a monthly subscription before earning revenue",
      "Creators who value Substack's built-in discovery/recommendation network for growth",
    ],
    avoidIf: [
      "You already earn several hundred dollars a month or more from subscriptions — a flat-fee platform likely costs less",
      "You want deep email-marketing features (automation flows, segmentation, A/B testing) beyond newsletter publishing",
    ],
    pros: [
      "Zero cost to start — no subscription fee at any list size",
      "Strong built-in discovery network for growing a paid audience",
      "Simple, distraction-free writing and publishing experience",
    ],
    cons: [
      "10% revenue cut becomes expensive relative to flat-fee competitors once revenue grows",
      "Much thinner marketing-automation feature set than dedicated email tools",
      "Limited control over list portability/export compared to standalone ESPs",
    ],

    popularityScore: 70,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://on.substack.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "emailoctopus",
    name: "EmailOctopus",
    // DRAFT - review before publish
    tagline: "No-frills, budget email marketing built on Amazon SES — a generous free tier for straightforward newsletter sending.",
    logoUrl: "https://www.google.com/s2/favicons?domain=emailoctopus.com&sz=128",
    website: "https://emailoctopus.com",

    category: "email-marketing",
    subCategory: "email-marketing",
    industries: ["freelancers", "agencies", "nonprofits"],
    businessSizes: ["solo", "small"],
    regions: ["global", "europe"],
    regionNotes: "UK-founded; VERIFY current regional payment/localization support.",
    useCases: ["send newsletters", "email automation", "signup forms", "landing pages"],
    pricingModel: "freemium",

    pricing: [
      { name: "Starter (Free)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 2,500 subscribers", "10,000 emails/month", "EmailOctopus branding, 1 landing page/form, 30-day report history, single user"] },
      { name: "Pro", priceMonthly: 9, priceAnnual: null, currency: "USD", keyLimits: ["From $9/mo (billed yearly) at the entry subscriber tier, scaling up automatically as your list grows", "Removes branding, unlimited reports/landing pages/forms/users"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free (Starter) plan covers up to 2,500 subscribers and 10,000 emails/month, but carries EmailOctopus branding and limits reports to a 30-day history. Pro starts at $9/month billed yearly at the lowest tier and scales automatically as your subscriber count grows; nonprofits get a 20% lifetime discount, and custom pricing applies above 500,000 subscribers.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Built on Amazon SES for strong deliverability infrastructure",
      "Simple drag-and-drop email builder",
      "Basic automation workflows",
      "Landing pages and signup forms",
      "Nonprofit discount program",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A good fit for budget-conscious senders who want straightforward newsletter tooling without paying for features they won't use — not for teams wanting advanced ecommerce automation.",
    bestFor: [
      "Freelancers and small nonprofits wanting simple, affordable newsletter sending",
      "Technical users comfortable with an SES-based, no-frills platform",
    ],
    avoidIf: [
      "You need advanced automation, ecommerce flows, or SMS",
      "You want a large template library and polished onboarding experience",
    ],
    pros: [
      "Free tier covers a meaningful 2,500 subscribers and 10,000 sends/month",
      "Straightforward, low-cost pricing that scales predictably",
      "Nonprofit discount available",
    ],
    cons: [
      "Feature set is intentionally basic compared to Mailchimp/MailerLite",
      "Free plan report history is limited to 30 days",
      "Smaller integration ecosystem and community than larger competitors",
    ],

    popularityScore: 45,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://emailoctopus.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "flodesk",
    name: "Flodesk",
    // DRAFT - review before publish
    tagline: "Beautifully designed email marketing popular with creative small businesses — pricing shifted from flat-rate to subscriber-tiered in late 2025.",
    logoUrl: "https://www.google.com/s2/favicons?domain=flodesk.com&sz=128",
    website: "https://flodesk.com",

    category: "email-marketing",
    subCategory: "email-marketing",
    industries: ["freelancers", "hospitality", "retail"],
    businessSizes: ["solo", "small"],
    regions: ["north-america", "global"],
    regionNotes: "VERIFY current regional payment/localization support.",
    useCases: ["send newsletters", "email automation", "landing pages", "signup forms", "paid subscriptions"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY — Flodesk overhauled its pricing on 2025-12-02, moving from a flat unlimited-subscriber rate to subscriber-tiered plans; sources disagree on whether a genuine free plan currently exists"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Design-forward email templates aimed at creative/visual brands",
      "Workflow automations",
      "Checkout/sales pages and payment plans (Everything tier)",
      "Landing pages and signup forms",
      "Legacy flat-rate unlimited plan grandfathered for pre-December-2025 subscribers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Long popular with wedding, beauty, and creative small businesses for its design quality — the December 2025 shift away from flat-rate unlimited pricing changes the value proposition, so confirm current plan structure before recommending it.",
    bestFor: [
      "Creative and visual-first small businesses (photographers, boutiques, coaches) that prioritize design",
      "Existing subscribers grandfathered onto the legacy flat-rate unlimited plan",
    ],
    avoidIf: [
      "You were choosing Flodesk specifically for flat-rate pricing regardless of list size — that's no longer offered to new customers",
      "You need deep ecommerce automation or CRM features",
    ],
    pros: [
      "Widely regarded as one of the best-looking email builders in the category",
      "Checkout pages and payment plans built in for creators selling directly",
      "Simple, intuitive editor with a low learning curve",
    ],
    cons: [
      "December 2025 pricing overhaul removed the flat-rate unlimited plan for new customers, making costs less predictable at scale",
      "Automation and segmentation are lighter than dedicated marketing-automation tools",
      "Current pricing details are inconsistent across sources following the recent change",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://flodesk.com/pricing",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
  {
    id: "mailjet",
    name: "Mailjet",
    // DRAFT - review before publish
    tagline: "Email marketing plus transactional email/SMTP from one European provider, now part of Sinch.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.mailjet.com&sz=128",
    website: "https://www.mailjet.com",

    category: "email-marketing",
    subCategory: "email-marketing",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["small", "medium"],
    regions: ["global", "europe"],
    regionNotes: "French-founded, now part of Sinch (Swedish); strong EU presence with GDPR-forward positioning.",
    useCases: ["send newsletters", "transactional email", "SMTP relay", "signup forms", "email automation"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["6,000 emails/month", "200 emails/day cap", "Up to 1,000 contacts", "APIs, SMTP relay, basic statistics"] },
      { name: "Essential", priceMonthly: 17, priceAnnual: null, currency: "USD", keyLimits: ["15,000 emails/month, no daily cap", "Unlimited contacts", "Segmentation, AI-assisted content, 500 email validations included"] },
      { name: "Premium", priceMonthly: 27, priceAnnual: null, currency: "USD", keyLimits: ["15,000 emails/month, no daily cap", "Unlimited contacts", "Advanced statistics, automations, landing pages, team management"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan allows 6,000 emails/month with a 200/day cap and up to 1,000 contacts — enough for light senders and developers testing SMTP/API integration. Paid tiers raise the volume cap and remove the daily limit; annual billing saves 10%, and custom enterprise plans exist for high-volume senders.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Combined marketing and transactional email (SMTP/API) on one platform",
      "Developer-friendly API and SMTP relay",
      "Email validation tooling",
      "Marketing automation workflows (Premium)",
      "Landing pages (Premium)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A strong fit for teams that want marketing email and transactional/API email from a single European provider — less design-forward than Flodesk/Kit, and its marketing-automation features are lighter than dedicated tools.",
    bestFor: [
      "Developers and agencies wanting SMTP/API transactional email alongside newsletters",
      "EU-based businesses wanting a GDPR-forward provider",
    ],
    avoidIf: [
      "You want the richest marketing-automation feature set — Essential lacks automation entirely",
      "You need a large ecosystem of pre-built ecommerce flows",
    ],
    pros: [
      "Genuinely useful free tier for developers/light senders",
      "Combines transactional and marketing email under one account",
      "Competitive entry pricing relative to Mailchimp/Constant Contact",
    ],
    cons: [
      "Automation workflows are locked behind the Premium tier",
      "Design/template quality trails more consumer-focused tools like Flodesk or Kit",
      "Smaller ecommerce-specific integration library than Klaviyo/Omnisend",
    ],

    popularityScore: 50,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-16",
    pricingSourceUrl: "https://www.mailjet.com/pricing/",
    lastReviewed: "2026-07-16",

    relatedUtilityAppsTools: [],
  },
];
