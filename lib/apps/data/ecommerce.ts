import type { AppListing } from "../types";

// Scaffolded via Prompt 2 — 20 well-known E-commerce apps spanning storefront
// platforms, point of sale, inventory/fulfillment, and digital-product
// selling.
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
// Verification notes for this pass (2026-07-17): Shopify, WooCommerce,
// Ecwid, and Lightspeed Retail were confirmed via direct fetch of the
// vendor's own pricing page. BigCommerce, Wix, Square Point of Sale, Toast,
// and Cin7/ShipStation/Shippo/Zoho Inventory/Gumroad/Sellfy/Podia/Payhip
// were confirmed either via direct fetch or by cross-referencing multiple
// independent, mutually-consistent third-party sources after the vendor's
// own page returned a 403/404/JS-rendered response to automated fetch (the
// same pattern already used for Gusto/Justworks in hr-payroll.ts). Adobe
// Commerce, Clover, Squarespace Commerce, and ShipBob remain "VERIFY" — see
// each listing's freeTierReality note for the specific reason (no public
// self-serve pricing, or third-party sources disagreeing on numbers).

export const ECOMMERCE_APPS: AppListing[] = [
  {
    id: "shopify",
    name: "Shopify",
    // DRAFT - review before publish
    tagline: "The default storefront platform for online sellers — unlimited products, fast checkout, sells everywhere.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.shopify.com&sz=128",
    website: "https://www.shopify.com",

    category: "ecommerce",
    subCategory: "storefront-platform",
    industries: ["ecommerce", "retail", "agencies", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available globally with localized payments/checkout in most major markets — no sign-up region restrictions.",
    useCases: ["build an online store", "sell on social/marketplaces", "in-person + online POS", "manage inventory", "multi-channel selling"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter", priceMonthly: 5, priceAnnual: null, currency: "USD", keyLimits: ["One-page/link-in-bio store for casual/social selling, not a full storefront"] },
      { name: "Basic", priceMonthly: 27, priceAnnual: 19, currency: "USD", keyLimits: ["2% fee on sales made with third-party (non-Shopify) payment providers; no additional staff accounts"] },
      { name: "Grow", priceMonthly: 72, priceAnnual: 54, currency: "USD", keyLimits: ["1% third-party payment fee; up to 5 staff accounts"] },
      { name: "Advanced", priceMonthly: 399, priceAnnual: 299, currency: "USD", keyLimits: ["0.6% third-party payment fee; up to 15 staff accounts, 10 inventory locations"] },
      { name: "Plus", priceMonthly: 2300, priceAnnual: null, currency: "USD", keyLimits: ["Custom-negotiated above this starting point; 0.2% third-party payment fee, unlimited staff, 200 inventory locations, 9 free expansion stores"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier — a 3-day free trial (no card required) is followed by a $1/mo promotional rate for 3 months before regular pricing kicks in. Every plan includes unlimited products and unlimited hosting; the real cost differentiator across tiers is the third-party payment processing fee (2% down to 0.2%), which disappears entirely if you use Shopify Payments instead of an external gateway.",
    startingPrice: 27,
    currency: "USD",

    keyFeatures: [
      "Unlimited products and unlimited web hosting on every plan",
      "Built-in checkout with high conversion rate",
      "Sell on social platforms and marketplaces from one dashboard",
      "Shopify POS for in-person + online unified inventory",
      "Large app/theme marketplace",
      "AI assistant (Sidekick) and agentic-commerce tooling",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The safest default choice for most online sellers — huge app ecosystem, reliable checkout, and support for every sales channel — but third-party payment fees and add-on app costs mean the sticker price understates real monthly spend for many stores.",
    bestFor: [
      "New and growing D2C brands that want the largest app/theme ecosystem and least platform risk",
      "Merchants who plan to sell across web, social, marketplaces, and in-person from one system",
    ],
    avoidIf: [
      "You want to avoid third-party payment fees without switching to Shopify Payments (not available in every country)",
      "You need a fully custom checkout flow — Shopify's checkout is locked down on non-Plus plans",
    ],
    pros: [
      "Extremely large app and theme marketplace covering nearly any store need",
      "Best-in-class, high-converting native checkout",
      "One dashboard for online store, social selling, marketplaces, and POS",
    ],
    cons: [
      "Third-party payment processing fees stack on top of the subscription unless you use Shopify Payments",
      "Real monthly cost often climbs well past the base plan price once apps/themes are added",
      "Checkout customization is restricted below the enterprise-priced Plus tier",
    ],

    popularityScore: 95,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.shopify.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["barcode-generator"],
  },
  {
    id: "bigcommerce",
    name: "BigCommerce",
    // DRAFT - review before publish
    tagline: "Storefront platform with 0% built-in transaction fees and headless/enterprise options at every tier.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.bigcommerce.com&sz=128",
    website: "https://www.bigcommerce.com",

    category: "ecommerce",
    subCategory: "storefront-platform",
    industries: ["ecommerce", "retail", "agencies"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available globally; multi-currency and multi-storefront features are more commonly used by North American and European merchants.",
    useCases: ["build an online store", "headless/API commerce", "B2B storefronts", "multi-storefront management"],
    pricingModel: "subscription",

    pricing: [
      { name: "Standard", priceMonthly: 39, priceAnnual: 29, currency: "USD", keyLimits: ["Soft cap of ~$50,000/yr in online sales before BigCommerce prompts an upgrade; 0% BigCommerce transaction fees"] },
      { name: "Plus", priceMonthly: 105, priceAnnual: 79, currency: "USD", keyLimits: ["Soft cap of ~$180,000/yr in online sales; adds abandoned-cart recovery, customer segmentation"] },
      { name: "Pro", priceMonthly: 399, priceAnnual: 299, currency: "USD", keyLimits: ["Soft cap of ~$400,000/yr in online sales; adds custom SSL, Google Reviews integration, advanced faceted search"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing, commonly cited starting around $1,000+/mo; unlimited sales volume, dedicated account team"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — a 15-day free trial precedes Standard at $39/mo billed monthly ($29/mo billed annually). BigCommerce charges 0% of its own transaction fees on every plan (you only pay your payment gateway's processing fees), which is its main differentiator from Shopify's non-Shopify-Payments surcharge. Each tier's sales-volume figure is a soft cap — exceeding it prompts an upgrade conversation rather than cutting off checkout.",
    startingPrice: 39,
    currency: "USD",

    keyFeatures: [
      "0% platform transaction fees on every plan",
      "Native B2B and headless/API commerce support",
      "Multi-storefront management from one back end",
      "Built-in SEO and faceted search tools",
      "Multi-currency selling",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for growing and mid-market merchants who want to avoid platform transaction fees and may need headless/B2B commerce down the line — the sales-volume-based tier structure means high-growth stores should plan for upgrade conversations.",
    bestFor: [
      "Merchants who want 0% built-in transaction fees regardless of payment gateway",
      "Mid-market and B2B sellers who anticipate needing headless commerce or multi-storefront features",
    ],
    avoidIf: [
      "You're a very early-stage seller wanting the cheapest possible entry price — Shopify's Basic and Starter tiers undercut BigCommerce Standard",
      "You want a single flat sales-volume-independent price with no tier-upgrade conversations as you grow",
    ],
    pros: [
      "No BigCommerce-branded transaction fee on any plan or payment gateway",
      "Strong native B2B and headless commerce features without needing Plus/Enterprise-only add-ons",
      "Multi-storefront support built into the core platform",
    ],
    cons: [
      "Tiers are gated by annual sales volume, not just feature sets, forcing upgrade conversations as you grow",
      "Smaller app marketplace and theme selection than Shopify",
      "Enterprise pricing is fully custom and not published",
    ],

    popularityScore: 75,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.bigcommerce.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["barcode-generator"],
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    // DRAFT - review before publish
    tagline: "Free, open-source WordPress plugin that turns any WordPress site into a fully customizable store.",
    logoUrl: "https://www.google.com/s2/favicons?domain=woocommerce.com&sz=128",
    website: "https://woocommerce.com",

    category: "ecommerce",
    subCategory: "storefront-platform",
    industries: ["ecommerce", "retail", "agencies", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Self-hosted and available worldwide — actual cost/availability of hosting and payment gateways varies by country.",
    useCases: ["build an online store on WordPress", "fully customizable storefront", "content + commerce on one site", "subscriptions and bookings"],
    pricingModel: "freemium",

    pricing: [
      { name: "WooCommerce Core (self-hosted)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Free, open-source plugin; 0% revenue share on your own store; requires your own WordPress hosting"] },
      { name: "Hosting (typical range, not sold by WooCommerce)", priceMonthly: 25, priceAnnual: null, currency: "USD", keyLimits: ["$25-$350+/mo depending on host and traffic — WooCommerce doesn't sell hosting; you choose a WordPress host separately"] },
      { name: "Premium extensions (typical range)", priceMonthly: null, priceAnnual: 29, currency: "USD", keyLimits: ["$29-$299/yr per extension (Subscriptions, Bookings, advanced shipping, etc.)"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The core plugin is genuinely free forever with 0% revenue share and no feature paywall — but it isn't a hosted SaaS: you must supply your own WordPress hosting ($25-$350+/mo depending on provider and traffic) and most real stores add one or more paid extensions ($29-$299/yr each) for subscriptions, bookings, or advanced shipping. Payment processing via the built-in WooPayments runs roughly 2.5-2.9% + $0.30/transaction.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Fully open-source and self-hosted — complete code-level customization",
      "Deep WordPress content/commerce integration",
      "Huge extension marketplace for subscriptions, bookings, memberships",
      "No revenue share or platform transaction fee",
      "Choose your own hosting and payment processor",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for merchants and developers who already know WordPress and want full code-level control with no platform fees — the tradeoff is you own the hosting, security, and maintenance burden that a hosted platform like Shopify would otherwise handle.",
    bestFor: [
      "Existing WordPress sites that want to add a store without switching platforms",
      "Developers and agencies who want full customization and no vendor lock-in",
    ],
    avoidIf: [
      "You want a fully managed, zero-maintenance hosted platform — WooCommerce puts hosting/security/updates on you",
      "You're not comfortable choosing and managing your own WordPress host and security stack",
    ],
    pros: [
      "Genuinely free core plugin with zero revenue share",
      "Unmatched customization via WordPress's plugin/theme ecosystem",
      "No platform lock-in — you own your store's code and data",
    ],
    cons: [
      "Total cost is unpredictable upfront — hosting and extensions add up differently for every store",
      "You're responsible for security, backups, and updates unless you pay for managed WordPress hosting",
      "Steeper technical learning curve than a fully hosted platform for non-technical sellers",
    ],

    popularityScore: 85,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://woocommerce.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["barcode-generator", "invoice-generator"],
  },
  {
    id: "wix-ecommerce",
    name: "Wix eCommerce",
    // DRAFT - review before publish
    tagline: "Drag-and-drop website builder with a full ecommerce layer — easiest on-ramp for small sellers.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.wix.com&sz=128",
    website: "https://www.wix.com",

    category: "ecommerce",
    subCategory: "storefront-platform",
    industries: ["ecommerce", "retail", "freelancers", "agencies"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Available globally with localized payment options in most major markets.",
    useCases: ["build a small online store", "drag-and-drop website + store", "sell services and products together", "booking + ecommerce combined"],
    pricingModel: "subscription",

    pricing: [
      { name: "Core", priceMonthly: 36, priceAnnual: 29, currency: "USD", keyLimits: ["Billed annually at $29/mo, or $36/mo month-to-month; entry ecommerce tier for smaller stores and online booking"] },
      { name: "Business", priceMonthly: 46, priceAnnual: 39, currency: "USD", keyLimits: ["Billed annually at $39/mo, or $46/mo month-to-month; adds advanced shipping rules and automated sales tax"] },
      { name: "Business Elite", priceMonthly: 172, priceAnnual: 159, currency: "USD", keyLimits: ["Billed annually at $159/mo, or $172/mo month-to-month; unlimited storage, priority support, loyalty program, unlimited dropshipping products"] },
    ],
    hasFreeTier: false,
    freeTierReality: "Wix's general free website plan does not support ecommerce checkout — selling anything requires at least the Core plan ($29/mo billed annually, $36/mo month-to-month). There's no ongoing free ecommerce tier, only a general free site builder for non-commerce use.",
    startingPrice: 36,
    currency: "USD",

    keyFeatures: [
      "Drag-and-drop visual site builder with commerce built in",
      "Combined booking + product selling on one site",
      "Built-in abandoned cart recovery and marketing tools",
      "App marketplace for extending store functionality",
      "AI-assisted site design",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small sellers and service businesses who want the easiest possible drag-and-drop setup and are combining products with bookings/services on the same site — less scalable than dedicated commerce platforms as catalog size and complexity grow.",
    bestFor: [
      "Small businesses and freelancers building their first store without hiring a developer",
      "Sellers who need booking/appointments and product sales on the same site",
    ],
    avoidIf: [
      "You expect to scale into a large, high-SKU catalog or need deep commerce customization",
      "You want the largest possible commerce-specific app ecosystem — Shopify's is considerably larger",
    ],
    pros: [
      "Genuinely easy drag-and-drop setup for non-technical users",
      "Combines general website building, booking, and ecommerce in one product",
      "Reasonable entry price for small catalogs",
    ],
    cons: [
      "No ecommerce-capable free tier — Core is required to sell anything",
      "Commerce-specific app/integration ecosystem is smaller than dedicated platforms like Shopify or BigCommerce",
      "Business Elite's jump to $159-172/mo is steep versus Core/Business",
    ],

    popularityScore: 78,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.wix.com/pricing/plans",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "squarespace-commerce",
    name: "Squarespace Commerce",
    // DRAFT - review before publish
    tagline: "Design-forward website builder with an integrated store — popular with creatives and small brands.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.squarespace.com&sz=128",
    website: "https://www.squarespace.com",

    category: "ecommerce",
    subCategory: "storefront-platform",
    industries: ["ecommerce", "retail", "freelancers", "agencies"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY current regional payment processor availability.",
    useCases: ["build a design-forward online store", "sell products alongside a portfolio/blog", "memberships and digital content sales"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Design-forward templates with strong visual polish out of the box",
      "Commerce integrated with content/portfolio pages",
      "Tiered payment processing rates that improve on higher plans",
      "Built-in email marketing and AI content tools",
      "Digital content and membership sales support",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for design-conscious small brands and creatives who want a highly polished storefront without a developer — pricing figures need direct confirmation before publishing since independent third-party sources disagreed on exact month-to-month prices.",
    bestFor: [
      "Creatives, artists, and small brands who prioritize visual design quality",
      "Sellers combining a portfolio/blog with a modest product catalog",
    ],
    avoidIf: [
      "You need the largest possible app/integration ecosystem — Squarespace's is smaller than Shopify's",
      "You're scaling into a large, high-SKU catalog with complex inventory needs",
    ],
    pros: [
      "Among the most visually polished templates in the website-builder category",
      "Transaction fees drop to 0% on mid-tier plans and above",
      "Combines content publishing and commerce well for creator-style brands",
    ],
    cons: [
      "Commerce-specific feature depth (multi-location inventory, B2B, headless) trails dedicated platforms",
      "Squarespace's own pricing page did not render exact monthly figures reliably during verification, and third-party sources disagreed on some month-to-month numbers — confirm current prices directly before trusting them",
      "Smaller app marketplace than Shopify or BigCommerce",
    ],

    popularityScore: 76,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.squarespace.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "ecwid",
    name: "Ecwid",
    // DRAFT - review before publish
    tagline: "Add a store to any existing website or social page — by Lightspeed, priced with 0% transaction fees.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.ecwid.com&sz=128",
    website: "https://www.ecwid.com",

    category: "ecommerce",
    subCategory: "storefront-platform",
    industries: ["ecommerce", "retail", "freelancers"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Prices shown in multiple currencies (USD, GBP, EUR, AUD, INR, MXN); available worldwide.",
    useCases: ["add a store widget to an existing site", "sell on social media and marketplaces", "lightweight ecommerce without a full site rebuild"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter", priceMonthly: 5, priceAnnual: 5, currency: "USD", keyLimits: ["Up to 10 products; 0% Ecwid transaction fees; unlimited bandwidth/storage"] },
      { name: "Venture", priceMonthly: 35, priceAnnual: 29, currency: "USD", keyLimits: ["Up to 100 products; 0% Ecwid transaction fees"] },
      { name: "Business", priceMonthly: 65, priceAnnual: 49, currency: "USD", keyLimits: ["Up to 2,500 products; 0% Ecwid transaction fees"] },
      { name: "Unlimited", priceMonthly: 149, priceAnnual: 119, currency: "USD", keyLimits: ["Unlimited products; 0% Ecwid transaction fees"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — Starter begins at $5/mo (product-count capped at 10). Every paid tier charges 0% of its own transaction fees on top of your payment processor's standard rate, and all plans include unlimited bandwidth and storage regardless of price.",
    startingPrice: 5,
    currency: "USD",

    keyFeatures: [
      "Embeddable store widget for any existing website",
      "Sell across social media and marketplaces from one catalog",
      "0% platform transaction fees on every paid tier",
      "Unlimited bandwidth and storage on all plans",
      "Multi-currency, multi-language storefronts",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for adding commerce to an existing website or social presence without rebuilding the whole site — product-count caps on lower tiers make it a poor fit for large catalogs.",
    bestFor: [
      "Small sellers who want to add a store to an existing site without a full rebuild",
      "Sellers focused on social/marketplace selling more than a standalone storefront",
    ],
    avoidIf: [
      "You need a large, high-SKU catalog — the entry tiers cap products fairly low",
      "You want the largest possible app/theme ecosystem — Ecwid's is smaller than Shopify's",
    ],
    pros: [
      "Genuinely 0% platform transaction fees on every paid plan",
      "Easy to bolt onto an existing website rather than replacing it",
      "Unlimited bandwidth/storage regardless of plan tier",
    ],
    cons: [
      "No free tier — cheapest plan still costs $5/mo for just 10 products",
      "Product-count caps on Starter/Venture/Business force upgrades as catalogs grow",
      "Smaller ecosystem and brand recognition than Shopify/BigCommerce",
    ],

    popularityScore: 60,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.ecwid.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["barcode-generator"],
  },
  {
    id: "adobe-commerce",
    name: "Adobe Commerce",
    // DRAFT - review before publish
    tagline: "Enterprise-grade commerce platform (formerly Magento) for large, highly customized storefronts.",
    logoUrl: "https://www.google.com/s2/favicons?domain=business.adobe.com&sz=128",
    website: "https://business.adobe.com/products/magento/magento-commerce.html",

    category: "ecommerce",
    subCategory: "storefront-platform",
    industries: ["ecommerce", "retail", "agencies"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional data hosting/residency options for enterprise customers.",
    useCases: ["large-catalog custom storefronts", "B2B commerce", "headless/composable commerce", "multi-brand/multi-region storefronts"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Highly customizable, open-architecture commerce engine",
      "Native B2B commerce capabilities",
      "Headless/composable (API-first) commerce support",
      "Multi-site, multi-brand, multi-region storefront management",
      "Large developer/agency ecosystem (Magento heritage)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for large or complex merchants who need deep customization, B2B, or multi-brand commerce and have budget for a dedicated implementation team — pricing is entirely custom-quote and was not published on the vendor's own site, so cost expectations require a direct sales conversation.",
    bestFor: [
      "Large or enterprise merchants needing deep platform customization",
      "B2B sellers and multi-brand retailers with complex catalog/pricing rules",
    ],
    avoidIf: [
      "You're a small or early-stage seller — the implementation cost and complexity far exceed what a hosted platform like Shopify requires",
      "You want transparent, self-serve published pricing before talking to sales",
    ],
    pros: [
      "Deep, open-architecture customization for complex commerce needs",
      "Mature B2B and multi-storefront capabilities",
      "Large, experienced agency/developer ecosystem from its Magento heritage",
    ],
    cons: [
      "No public self-serve pricing — every quote is custom and sales-led, similar to NetSuite or Sage Intacct",
      "Requires substantially more implementation investment (time, budget, technical resources) than hosted SaaS platforms",
      "Total cost of ownership includes hosting/infrastructure separate from license fees",
    ],

    popularityScore: 68,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://business.adobe.com/products/magento/pricing.html",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "square-pos",
    name: "Square Point of Sale",
    // DRAFT - review before publish
    tagline: "Free-to-start POS software with hardware and processing bundled — the default choice for small retail and food businesses.",
    logoUrl: "https://www.google.com/s2/favicons?domain=squareup.com&sz=128",
    website: "https://squareup.com",

    category: "ecommerce",
    subCategory: "point-of-sale",
    industries: ["retail", "hospitality", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["north-america", "europe", "oceania", "asia"],
    regionNotes: "Available in a limited set of countries (US, Canada, UK, Ireland, Australia, Japan, France, Spain) — not a truly global product; confirm current country list before assuming availability.",
    useCases: ["in-person retail checkout", "restaurant/food service POS", "combined online + in-person selling", "invoicing and payments"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: null, currency: "USD", keyLimits: ["$0/mo; processing ~2.6% + 15¢ in-person, ~2.9% + 30¢ online; POS app, online store builder, item library, invoicing"] },
      { name: "Plus", priceMonthly: 49, priceAnnual: null, currency: "USD", keyLimits: ["Per location; lower in-person processing rate (~2.5% + 15¢); adds staff management, loyalty rewards, expanded site customization"] },
      { name: "Premium", priceMonthly: 149, priceAnnual: null, currency: "USD", keyLimits: ["Per location; lower in-person processing rate (~2.4% + 15¢); adds advanced reporting, no gift-card load fees, 24/7 phone support"] },
      { name: "Square Pro (custom)", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["For businesses processing $250,000+/yr — negotiated processing rates, hardware discounts, dedicated onboarding"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The Free plan genuinely carries no monthly software fee and includes the core POS app, a basic online store, item library, and invoicing — the tradeoff is the highest per-transaction processing rate (~2.6%+15¢ in-person). Paid Plus/Premium tiers trade a $49-149/mo/location fee for modestly lower processing rates plus staff, loyalty, and reporting features. Figures were cross-referenced across multiple independent 2026 sources after Square's own pricing pages returned templated/JS-rendered content to automated fetch; percentages are approximate and worth a final direct confirmation before publishing.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Free POS software tier with no monthly fee",
      "Integrated hardware, software, and payment processing from one vendor",
      "Combined online store + in-person checkout with shared inventory",
      "Built-in invoicing, loyalty, and staff management (paid tiers)",
      "Same-day/instant deposit options",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small retail and food businesses that want hardware, software, and payment processing from a single vendor with no upfront software cost — country availability is more limited than global storefront platforms, so confirm it's offered where you operate.",
    bestFor: [
      "Small retailers and food businesses wanting an all-in-one POS + payments + hardware bundle",
      "Sellers who want to start with zero monthly software cost and pay only per-transaction",
    ],
    avoidIf: [
      "You operate outside Square's supported countries",
      "Your transaction volume is high enough that a negotiated processing rate elsewhere would clearly beat Square's published percentages",
    ],
    pros: [
      "Genuinely free software tier, not just a trial",
      "Single vendor for hardware, software, and payment processing simplifies setup",
      "Shared inventory between in-person and online sales",
    ],
    cons: [
      "Only available in a limited set of countries",
      "Free tier's processing rate is the highest offered — savings on Plus/Premium require paying a monthly fee first",
      "Per-location monthly fees on Plus/Premium add up quickly for multi-location businesses",
    ],

    popularityScore: 90,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://squareup.com/us/en/point-of-sale/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["receipt-generator", "barcode-generator"],
  },
  {
    id: "lightspeed-retail",
    name: "Lightspeed Retail",
    // DRAFT - review before publish
    tagline: "Retail-focused POS with integrated ecommerce and inventory management, priced per register.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.lightspeedhq.com&sz=128",
    website: "https://www.lightspeedhq.com",

    category: "ecommerce",
    subCategory: "point-of-sale",
    industries: ["retail", "hospitality"],
    businessSizes: ["small", "medium"],
    regions: ["north-america", "europe", "oceania"],
    regionNotes: "Canadian company (Lightspeed Commerce) serving retailers across North America, Europe, and Oceania.",
    useCases: ["retail POS checkout", "integrated inventory management", "combined in-store + online selling", "multi-location retail management"],
    pricingModel: "subscription",

    pricing: [
      { name: "Basic", priceMonthly: 89, priceAnnual: null, currency: "USD", keyLimits: ["1 register included; core POS, integrated payments, inventory management, and ecommerce; card-present processing at 1.5%"] },
      { name: "Core", priceMonthly: 149, priceAnnual: null, currency: "USD", keyLimits: ["1 register included; adds growth-focused management tools; card-present processing at 1.5%"] },
      { name: "Plus", priceMonthly: 289, priceAnnual: null, currency: "USD", keyLimits: ["1 register included; adds advanced customization and scalability features; card-present processing at 1.5%"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — Basic starts at $89/mo for one register, with additional registers and locations billed separately at additional cost. An annual-billing discount (cited up to ~18% savings) is available but the exact discounted monthly-equivalent wasn't published in a clear table; confirm before quoting a specific annual figure.",
    startingPrice: 89,
    currency: "USD",

    keyFeatures: [
      "Retail-focused POS with integrated inventory management",
      "Built-in ecommerce storefront synced with in-store inventory",
      "Multi-location and multi-register support",
      "Integrated payment processing",
      "Reporting and analytics for retail operations",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for independent and growing retailers that want POS, inventory, and ecommerce genuinely unified in one system — the $89+/mo per-register starting price is higher than Square's free entry point, reflecting its retail-management depth over Square's broader small-business focus.",
    bestFor: [
      "Independent retailers wanting deep inventory management tied directly to POS",
      "Multi-location retail businesses that need consistent stock visibility across stores",
    ],
    avoidIf: [
      "You want the lowest possible entry cost — Square's free tier undercuts Lightspeed's $89/mo starting price",
      "You're a food-service business — Lightspeed's retail product isn't restaurant-focused (see Lightspeed Restaurant separately)",
    ],
    pros: [
      "Inventory management is genuinely deep and tightly integrated with POS, not bolted on",
      "Flat 1.5% card-present processing rate across all tiers",
      "Ecommerce and in-store inventory stay synced automatically",
    ],
    cons: [
      "No free tier — entry price is notably higher than Square's",
      "Additional registers/locations add cost on top of the base per-register price",
      "Annual-billing discount percentage wasn't clearly published — confirm the exact figure before quoting",
    ],

    popularityScore: 70,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.lightspeedhq.com/pricing/retail/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["barcode-generator", "receipt-generator"],
  },
  {
    id: "clover",
    name: "Clover",
    // DRAFT - review before publish
    tagline: "Hardware-first POS system sold through payment processors, with business-type-specific plans.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.clover.com&sz=128",
    website: "https://www.clover.com",

    category: "ecommerce",
    subCategory: "point-of-sale",
    industries: ["retail", "hospitality"],
    businessSizes: ["small", "medium"],
    regions: ["north-america", "europe"],
    regionNotes: "VERIFY current country availability — primarily sold through North American payment processors/ISOs, with some European availability via partner banks.",
    useCases: ["retail POS checkout", "restaurant/quick-service POS", "salon and services POS", "payment processing with owned hardware"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Business-type-specific software plans (retail, restaurant, services)",
      "Proprietary Clover hardware (terminals, kiosks, handhelds)",
      "App marketplace for add-on functionality",
      "Integrated payment processing",
      "Sold and supported through a network of payment processors/ISOs",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for businesses that want proprietary, purpose-built POS hardware and are comfortable working through a payment processor/ISO rather than a direct self-serve signup — pricing is genuinely inconsistent across sources (plan names, per-location vs. per-device billing, and specific dollar figures all varied), so treat any third-party-quoted Clover price with caution until confirmed directly with a Clover reseller.",
    bestFor: [
      "Retailers and restaurants that want dedicated, purpose-built POS hardware",
      "Businesses already working with a payment processor that resells Clover",
    ],
    avoidIf: [
      "You want fully transparent, self-serve published pricing without contacting a reseller",
      "You want software-only POS without committing to Clover's proprietary hardware",
    ],
    pros: [
      "Purpose-built hardware options across retail, restaurant, and services use cases",
      "Wide network of payment processors/ISOs sell and support Clover",
      "App marketplace extends functionality per business type",
    ],
    cons: [
      "Pricing isn't published cleanly on Clover's own site and varies by reseller/ISO — third-party sources disagree on plan names and exact prices",
      "Sold through payment processors rather than pure self-serve signup, adding a sales step",
      "Multi-device businesses may pay per-device subscription fees that add up quickly",
    ],

    popularityScore: 65,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.clover.com/pricing/retail",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["receipt-generator"],
  },
  {
    id: "toast",
    name: "Toast",
    // DRAFT - review before publish
    tagline: "Restaurant-specific POS with a $0/mo software tier offset by higher processing rates.",
    logoUrl: "https://www.google.com/s2/favicons?domain=pos.toasttab.com&sz=128",
    website: "https://pos.toasttab.com",

    category: "ecommerce",
    subCategory: "point-of-sale",
    industries: ["hospitality"],
    businessSizes: ["small", "medium"],
    regions: ["north-america", "europe"],
    regionNotes: "Primarily US and Canada, with UK and Ireland availability — VERIFY current full country list.",
    useCases: ["restaurant POS", "online ordering for restaurants", "kitchen display systems", "restaurant payroll and team management"],
    pricingModel: "freemium",

    pricing: [
      { name: "Starter Kit", priceMonthly: 0, priceAnnual: null, currency: "USD", keyLimits: ["$0/mo software fee; processing at ~3.09% + 15¢ in-person, ~3.50% + 15¢ online; hardware and onboarding billed separately"] },
      { name: "Point of Sale / Build Your Own (custom quote)", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Quoted per terminal — a monthly software subscription in exchange for lower processing rates than the Starter Kit; exact figures require a sales quote"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The Starter Kit plan carries no monthly software fee, but that's offset by the highest processing rates Toast offers (~3.09%+15¢ in-person, ~3.50%+15¢ online). Most established restaurants instead choose a custom-quoted subscription plan with lower processing rates, and Toast requires purchasing or financing terminal hardware regardless of which plan you pick — hardware/onboarding costs are never included in the '$0/mo' figure.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Restaurant-specific POS with kitchen display system integration",
      "Built-in online ordering and delivery integration",
      "Restaurant-focused payroll and team management add-ons",
      "$0/mo software option with higher processing rates",
      "Purpose-built restaurant hardware (terminals, handhelds, kiosks)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for restaurants that want deep, purpose-built restaurant features (KDS, online ordering, payroll) rather than a generic retail POS adapted for food service — the '$0/mo' framing hides real hardware and processing costs that dominate the actual monthly bill.",
    bestFor: [
      "Full-service and quick-service restaurants needing kitchen display and online ordering built in",
      "Restaurant groups wanting payroll/team management bundled with POS",
    ],
    avoidIf: [
      "You're not a food-service business — Toast is purpose-built for restaurants, not general retail",
      "You want to avoid financing/purchasing proprietary hardware",
    ],
    pros: [
      "Deep restaurant-specific features (KDS, online ordering, delivery integrations) beyond generic POS",
      "$0/mo software option removes the upfront subscription barrier",
      "Restaurant-focused payroll/team tools reduce need for separate HR software",
    ],
    cons: [
      "Higher processing rates on the free software tier can cost more than a paid plan at real volume",
      "Hardware and onboarding costs are billed separately and not reflected in the '$0/mo' headline",
      "Full pricing for anything beyond the Starter Kit requires a sales quote, not self-serve",
    ],

    popularityScore: 80,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://pos.toasttab.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["receipt-generator", "qr-code-generator"],
  },
  {
    id: "cin7-core",
    name: "Cin7 Core",
    // DRAFT - review before publish
    tagline: "Inventory and order management for growing wholesale/retail brands, priced by order volume.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.cin7.com&sz=128",
    website: "https://www.cin7.com",

    category: "ecommerce",
    subCategory: "inventory-fulfillment",
    industries: ["retail", "ecommerce"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available globally; pricing shown in USD, other currencies VERIFY.",
    useCases: ["multi-channel inventory management", "wholesale order management", "manufacturing/light assembly tracking", "warehouse management"],
    pricingModel: "subscription",

    pricing: [
      { name: "Standard", priceMonthly: 349, priceAnnual: null, currency: "USD", keyLimits: ["5 users, 6,000 orders/year, 2 integrations"] },
      { name: "Pro", priceMonthly: 599, priceAnnual: null, currency: "USD", keyLimits: ["10 users, 24,000 orders/year, 4 integrations — marked 'most popular'"] },
      { name: "Advanced", priceMonthly: 999, priceAnnual: null, currency: "USD", keyLimits: ["15 users, 120,000 orders/year, 6 integrations"] },
      { name: "Cin7 Omni (custom)", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["8 users, flexible order volume, 5 integrations — custom quote"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — Standard starts at $349/mo for 5 users and 6,000 orders/year. Annual-billing pricing is not displayed on the public pricing page; all published figures are month-to-month. Prices exclude local taxes.",
    startingPrice: 349,
    currency: "USD",

    keyFeatures: [
      "Multi-channel inventory sync (retail + wholesale + online)",
      "Order management with volume-based plan tiers",
      "Light manufacturing/assembly (bill of materials) tracking",
      "B2B wholesale portal",
      "Integrations with major storefront and accounting platforms",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for wholesale and multi-channel brands that have outgrown their storefront platform's native inventory tools and need dedicated order-volume-based inventory management — the $349+/mo entry price puts it well above lighter tools like Zoho Inventory.",
    bestFor: [
      "Wholesale and multi-channel brands needing dedicated inventory/order management",
      "Businesses doing light manufacturing or kitting/assembly alongside retail sales",
    ],
    avoidIf: [
      "You're a small single-channel seller — Zoho Inventory or Shippo cost far less for basic needs",
      "You need annual-billing discount pricing published upfront — Cin7's page shows monthly-only figures",
    ],
    pros: [
      "Strong multi-channel and wholesale inventory sync in one system",
      "Order-volume-based tiers scale with business growth rather than flat feature gates",
      "Light manufacturing/BOM support beyond pure inventory tracking",
    ],
    cons: [
      "Entry price ($349/mo) is high relative to lighter inventory tools",
      "Annual-billing discount, if any, isn't published on the pricing page",
      "Order-volume caps mean high-growth sellers will need to plan for tier upgrades",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.cin7.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["barcode-generator", "purchase-order-generator"],
  },
  {
    id: "shipstation",
    name: "ShipStation",
    // DRAFT - review before publish
    tagline: "Multi-carrier shipping label and order management software, priced by monthly shipment volume.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.shipstation.com&sz=128",
    website: "https://www.shipstation.com",

    category: "ecommerce",
    subCategory: "inventory-fulfillment",
    industries: ["ecommerce", "retail"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["north-america", "europe", "oceania"],
    regionNotes: "Strongest carrier coverage in the US; supports international carriers but core discounted-rate benefits are most relevant to US-based shippers.",
    useCases: ["print shipping labels", "multi-carrier rate comparison", "order management across sales channels", "automated shipping rules"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter", priceMonthly: 14.99, priceAnnual: 11.99, currency: "USD", keyLimits: ["Named-tier pricing scales with monthly shipment volume (50/100/500/1,000/2,000/5,000+); entry rate shown covers the lowest volume band, 3 users included"] },
      { name: "Standard", priceMonthly: 29.99, priceAnnual: 23.99, currency: "USD", keyLimits: ["Most popular; scales with shipment volume same as Starter; 10 users included"] },
      { name: "Premium", priceMonthly: 349.99, priceAnnual: 279.99, currency: "USD", keyLimits: ["Scales with shipment volume same as Starter/Standard; 15 users included"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier — a 30-day free trial with no credit card required precedes the paid plans. Each named tier (Starter/Standard/Premium) is actually a family of volume-based price points that scale up with monthly shipment count; the figures shown are the entry-volume rate for each tier. There are no fees for connecting additional sales channels or carrier accounts, but postage and insurance are billed separately from the subscription.",
    startingPrice: 14.99,
    currency: "USD",

    keyFeatures: [
      "Multi-carrier label printing with negotiated discounted rates",
      "Order management synced across sales channels",
      "Automated shipping rules and branded tracking pages",
      "Batch label printing and packing slips",
      "Returns management",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for multi-channel sellers who want one place to compare carrier rates and print labels at volume — the volume-based pricing matrix means the actual monthly cost depends heavily on shipment count, not just the plan name.",
    bestFor: [
      "Multi-channel sellers shipping across several marketplaces/storefronts from one queue",
      "Sellers who want negotiated multi-carrier rates without individual carrier contracts",
    ],
    avoidIf: [
      "You ship a very low volume and a marketplace's built-in label tool (e.g. eBay/Etsy shipping) would suffice",
      "You want one flat number regardless of shipment volume — ShipStation's pricing scales with volume within each named tier",
    ],
    pros: [
      "Broad multi-carrier support with negotiated discounted rates",
      "No extra fees for connecting more sales channels or carrier accounts",
      "30-day free trial with no card required to evaluate",
    ],
    cons: [
      "Volume-based sub-tiers within each plan name make the true monthly cost harder to predict from the plan name alone",
      "Postage and insurance costs are separate from the subscription fee",
      "Best carrier-rate benefits are most relevant to US-based shippers",
    ],

    popularityScore: 68,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.shipstation.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["barcode-generator"],
  },
  {
    id: "shippo",
    name: "Shippo",
    // DRAFT - review before publish
    tagline: "Developer-friendly multi-carrier shipping API and app with a genuine free tier for low-volume shippers.",
    logoUrl: "https://www.google.com/s2/favicons?domain=goshippo.com&sz=128",
    website: "https://goshippo.com",

    category: "ecommerce",
    subCategory: "inventory-fulfillment",
    industries: ["ecommerce", "retail"],
    businessSizes: ["solo", "small"],
    regions: ["north-america"],
    regionNotes: "Strongest carrier coverage in the US; international shipping supported but VERIFY carrier coverage outside North America.",
    useCases: ["print shipping labels", "shipping rate API for developers", "multi-carrier rate comparison", "address validation"],
    pricingModel: "freemium",

    pricing: [
      { name: "Starter (Free)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 30 labels/mo; $0.08/label beyond the limit, $0.05/label when using your own carrier accounts"] },
      { name: "Pro", priceMonthly: 17, priceAnnual: 17.08, currency: "USD", keyLimits: ["Volume-based sub-tiers up to 10,000 labels/mo (1-200, 201-500, 501-1,000, 1,001-2,500, 2,501-5,000, 5,001-10,000); $205/yr billed annually (~10% savings vs. monthly); $0.08/label beyond 10,000/mo, free with your own carrier accounts"] },
      { name: "Premier (custom)", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Unlimited shipments; custom quote; free labels with your own carrier accounts"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The Starter plan is genuinely free forever for up to 30 labels/month, with a modest $0.08/label overage fee beyond that (or $0.05/label if you bring your own carrier accounts) — a real usable free tier for very low-volume sellers, not just a trial. Non-US address validation carries a small per-validation fee that also varies by plan ($0.06-$0.09).",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Multi-carrier shipping label API and web app",
      "Genuine free tier for low-volume shipping",
      "Address validation",
      "Batch label printing",
      "Developer-first API for custom shipping workflows",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for low-volume sellers and developers who want a genuinely free entry point and a clean API rather than a fully-featured order-management suite — ShipStation and Cin7 offer deeper order-management features for sellers who've outgrown pure label printing.",
    bestFor: [
      "Low-volume sellers who want free label printing without committing to a paid plan",
      "Developers building custom shipping workflows on top of an API",
    ],
    avoidIf: [
      "You need deep order-management features across many sales channels — ShipStation is more full-featured there",
      "You ship primarily outside North America — carrier coverage is strongest domestically",
    ],
    pros: [
      "Free tier is genuinely usable, not just a trial, for up to 30 labels/month",
      "Clean, developer-friendly API alongside the web app",
      "Overage pricing beyond free/paid limits is transparent and low",
    ],
    cons: [
      "Less full-featured order management than dedicated platforms like ShipStation or Cin7",
      "Carrier coverage and rate benefits are strongest for US-based shippers",
      "Premier tier's unlimited pricing is custom-quote only, not published",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://goshippo.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["barcode-generator"],
  },
  {
    id: "zoho-inventory",
    name: "Zoho Inventory",
    // DRAFT - review before publish
    tagline: "Order and stock management for multi-channel sellers, part of the broader Zoho suite with a real free tier.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.zoho.com&sz=128",
    website: "https://www.zoho.com/inventory/",

    category: "ecommerce",
    subCategory: "inventory-fulfillment",
    industries: ["ecommerce", "retail"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Available globally with multiple currency options (EUR, GBP, AUD, CAD, INR, AED, MXN, and others); prices exclude local taxes.",
    useCases: ["multi-channel inventory tracking", "order management", "dropshipping and backordering", "composite/bundled item management"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["50 orders/mo, 1 user, 2 locations; composite items, dropshipment, backordering included"] },
      { name: "Standard", priceMonthly: 29, priceAnnual: null, currency: "USD", keyLimits: ["Billed annually; 500 orders/mo, 2 users, 2 locations"] },
      { name: "Professional", priceMonthly: 79, priceAnnual: null, currency: "USD", keyLimits: ["Billed annually; 3,000 orders/mo, 2 users, 4 locations"] },
      { name: "Premium", priceMonthly: 129, priceAnnual: null, currency: "USD", keyLimits: ["Billed annually; 7,500 orders/mo, 2 users, 6 locations, 2,000 bins/location"] },
      { name: "Enterprise", priceMonthly: 249, priceAnnual: null, currency: "USD", keyLimits: ["Billed annually; 15,000 orders/mo, 7 users, 10 locations, 5,000 bins/location"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The Free plan genuinely supports real inventory workflows (composite items, dropshipping, backordering) for 1 user, 2 locations, and up to 50 orders/month — a usable starting point for a very small operation, not just a trial. All paid-tier prices shown are the annual-billed monthly-equivalent rate; a separate (higher) month-to-month rate may apply and wasn't confirmed.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Multi-channel order and inventory sync",
      "Composite/bundled item management",
      "Dropshipping and backorder support",
      "Multi-location and bin-level tracking on higher tiers",
      "Deep integration with the broader Zoho suite (Books, CRM, etc.)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small multi-channel sellers, especially those already using other Zoho products, who want real inventory functionality on a genuine free tier before paying anything — bin-level and higher-volume features require climbing to the pricier Premium/Enterprise tiers.",
    bestFor: [
      "Small sellers already in the Zoho ecosystem (Books, CRM) wanting inventory to slot in natively",
      "Low-volume multi-channel sellers who want to start on a real free plan",
    ],
    avoidIf: [
      "You need bin-level, high-location-count warehouse management from day one — that requires Premium or Enterprise",
      "You're not using or planning to use other Zoho products — standalone inventory tools may integrate better with your existing stack",
    ],
    pros: [
      "Free tier includes real functionality (composite items, dropshipping, backordering), not just a demo",
      "Scales cleanly from solo seller through multi-location Enterprise tier",
      "Native integration with the rest of the Zoho suite",
    ],
    cons: [
      "Published prices are annual-billed rates; the separate month-to-month rate wasn't confirmed",
      "Bin-level tracking and higher location counts are gated behind the pricier tiers",
      "Best value is for sellers already committed to the Zoho ecosystem",
    ],

    popularityScore: 60,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.zoho.com/inventory/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["barcode-generator", "purchase-order-generator"],
  },
  {
    id: "shipbob",
    name: "ShipBob",
    // DRAFT - review before publish
    tagline: "Outsourced order fulfillment network (pick, pack, ship, warehousing) with fully custom, quote-based pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.shipbob.com&sz=128",
    website: "https://www.shipbob.com",

    category: "ecommerce",
    subCategory: "inventory-fulfillment",
    industries: ["ecommerce", "retail"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["north-america", "europe"],
    regionNotes: "Fulfillment center network concentrated in the US, with additional centers in Canada, the UK, and the EU.",
    useCases: ["outsourced pick/pack/ship fulfillment", "multi-warehouse inventory distribution", "B2B/wholesale fulfillment", "kitting and returns management"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Outsourced multi-warehouse pick, pack, and ship fulfillment",
      "Free software/dashboard access (fulfillment is what's billed)",
      "Kitting, B2B/wholesale order fulfillment, and returns management as add-ons",
      "Inventory distributed across a fulfillment center network to cut shipping zones",
      "Integrations with major storefront platforms for automatic order sync",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for growing DTC brands that want to outsource warehousing and fulfillment entirely rather than doing it in-house — ShipBob does not publish self-serve pricing at all, so every cost estimate requires a sales quote and isn't comparable across vendors without one.",
    bestFor: [
      "DTC brands ready to outsource warehousing and order fulfillment rather than shipping in-house",
      "Sellers who want inventory distributed across multiple fulfillment centers to reduce shipping zones/costs",
    ],
    avoidIf: [
      "You want transparent, published self-serve pricing to compare against competitors before a sales call",
      "Your order volume is too low to justify outsourced fulfillment overhead versus shipping in-house",
    ],
    pros: [
      "Multi-warehouse network can meaningfully cut shipping zones and transit time",
      "Software/dashboard access is free — you only pay for fulfillment activity",
      "Add-on support for B2B/wholesale orders and kitting beyond basic DTC fulfillment",
    ],
    cons: [
      "No public pricing whatsoever — every cost figure requires a custom sales quote",
      "Total cost depends on many variables (receiving, storage, pick/pack, shipping) that are hard to estimate without a quote",
      "Committing to outsourced fulfillment is a bigger operational change than adding shipping software to an in-house process",
    ],

    popularityScore: 62,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.shipbob.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "gumroad",
    name: "Gumroad",
    // DRAFT - review before publish
    tagline: "Sell digital products directly to fans with zero monthly fees — pure transaction-based pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=gumroad.com&sz=128",
    website: "https://gumroad.com",

    category: "ecommerce",
    subCategory: "digital-products",
    industries: ["freelancers", "ecommerce"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Gumroad acts as merchant of record globally, handling tax collection/remittance for creators worldwide.",
    useCases: ["sell digital downloads/ebooks/courses", "sell memberships", "creator direct-to-fan sales", "one-off digital product launches"],
    pricingModel: "free",

    pricing: [
      { name: "Standard (profile/direct-link sales)", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["10% + $0.50 per transaction; no monthly or annual fee"] },
      { name: "Discover marketplace sales", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["30% per transaction when new customers discover and buy via Gumroad's own marketplace; no monthly or annual fee"] },
    ],
    hasFreeTier: true,
    freeTierReality: "There is no monthly subscription at all — Gumroad is entirely transaction-fee-based, so creators only ever pay when they make a sale (10% + $0.50 for direct/profile sales, 30% for marketplace-discovered sales). Gumroad acts as merchant of record and handles all tax collection/remittance globally at no extra charge.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "No monthly fee — pure per-transaction pricing",
      "Merchant-of-record tax handling included globally",
      "Discover marketplace for organic new-customer discovery",
      "Memberships and recurring/subscription digital products",
      "Simple product page setup with no coding required",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for creators who want to start selling digital products with zero upfront cost and don't mind a relatively high per-transaction fee in exchange for merchant-of-record tax handling — high-volume sellers will eventually find flat-fee platforms like Podia or Payhip cheaper per sale.",
    bestFor: [
      "Creators and solo sellers who want to launch a digital product with zero setup cost",
      "Sellers who value having tax collection/remittance handled automatically worldwide",
    ],
    avoidIf: [
      "You have high, predictable sales volume where a flat monthly fee would beat a 10% transaction cut",
      "You want your own branded marketing site rather than a Gumroad-hosted product page",
    ],
    pros: [
      "Genuinely zero-cost to start — no monthly fee ever, only pay on actual sales",
      "Merchant-of-record tax handling removes a real compliance burden",
      "Discover marketplace can bring organic new-customer sales",
    ],
    cons: [
      "10%+ per-transaction fee is high compared to flat-fee competitors at real sales volume",
      "30% marketplace fee on Discover-driven sales is a steep cut",
      "Less control over storefront branding/design than a dedicated site-builder platform",
    ],

    popularityScore: 72,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://gumroad.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["invoice-generator"],
  },
  {
    id: "sellfy",
    name: "Sellfy",
    // DRAFT - review before publish
    tagline: "Flat-fee digital and print-on-demand storefront with 0% Sellfy transaction fees and annual revenue caps.",
    logoUrl: "https://www.google.com/s2/favicons?domain=sellfy.com&sz=128",
    website: "https://sellfy.com",

    category: "ecommerce",
    subCategory: "digital-products",
    industries: ["freelancers", "ecommerce"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Available globally; payment processing via PayPal/Stripe standard rates apply regardless of region.",
    useCases: ["sell digital downloads", "sell print-on-demand merchandise", "sell subscriptions to digital content", "embed a store on an existing site"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter", priceMonthly: 29, priceAnnual: 22, currency: "USD", keyLimits: ["Up to $10,000/yr in revenue; 0% Sellfy transaction fee (standard PayPal/Stripe processing fees still apply)"] },
      { name: "Business", priceMonthly: 79, priceAnnual: 59, currency: "USD", keyLimits: ["Up to $50,000/yr in revenue; 0% Sellfy transaction fee"] },
      { name: "Premium", priceMonthly: 159, priceAnnual: 119, currency: "USD", keyLimits: ["Up to $200,000/yr in revenue; 0% Sellfy transaction fee"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — a 14-day free trial precedes Starter at $29/mo ($22/mo billed annually, a 25% discount). Sellfy charges 0% of its own transaction fee, but standard PayPal/Stripe processing fees (typically 2.9% + 30¢) still apply. Exceeding your plan's annual revenue cap triggers either a required upgrade or a 2% overage fee on the excess.",
    startingPrice: 29,
    currency: "USD",

    keyFeatures: [
      "Sell digital downloads, subscriptions, and print-on-demand merchandise",
      "0% Sellfy platform transaction fee on every plan",
      "Embeddable storefront widget for existing sites",
      "Built-in email marketing tools",
      "Print-on-demand fulfillment integration",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for creators selling digital products and print-on-demand merch who want 0% platform transaction fees and are comfortable with a revenue-cap-based tier structure — Gumroad's zero-monthly-fee model is cheaper for very low-volume or unpredictable sellers.",
    bestFor: [
      "Creators combining digital downloads with print-on-demand merchandise",
      "Sellers with predictable revenue who want 0% platform transaction fees at a flat monthly cost",
    ],
    avoidIf: [
      "Your sales are low-volume or unpredictable — Gumroad's zero-monthly-fee model carries less risk",
      "You'd rather pay per-transaction than commit to a monthly subscription with a revenue cap",
    ],
    pros: [
      "Genuinely 0% Sellfy-branded transaction fees on every tier",
      "Combines digital products and print-on-demand merch in one platform",
      "Annual billing offers a real 25% discount over monthly",
    ],
    cons: [
      "No free tier — cheapest plan is $29/mo (or $22/mo annual)",
      "Revenue caps per tier mean fast-growing sellers face overage fees or forced upgrades",
      "Smaller feature set and ecosystem than dedicated course/community platforms like Podia",
    ],

    popularityScore: 50,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://sellfy.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["invoice-generator"],
  },
  {
    id: "podia-ecommerce",
    name: "Podia",
    // DRAFT - review before publish
    tagline: "All-in-one platform for selling courses, digital downloads, and communities — no free plan, but a full-featured trial.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.podia.com&sz=128",
    website: "https://www.podia.com",

    category: "ecommerce",
    subCategory: "digital-products",
    industries: ["freelancers", "ecommerce"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Available globally; payment processing via Stripe/PayPal standard rates apply regardless of region.",
    useCases: ["sell online courses", "sell digital downloads", "run a paid community/membership", "email marketing to a customer list"],
    pricingModel: "subscription",

    pricing: [
      { name: "Mover", priceMonthly: 42, priceAnnual: 42, currency: "USD", keyLimits: ["$504/yr billed annually; 5% Podia transaction fee; 100 email subscribers, 50 products, 500 videos, 25 community spaces"] },
      { name: "Shaker", priceMonthly: 84, priceAnnual: 84, currency: "USD", keyLimits: ["$1,008/yr billed annually; 0% Podia transaction fee; 500 email subscribers, 150 products, 1,000 videos, 100 spaces, 1 assistant seat, affiliate marketing, Zapier"] },
      { name: "Earthquaker", priceMonthly: 150, priceAnnual: 150, currency: "USD", keyLimits: ["$1,800/yr billed annually; 0% Podia transaction fee; 1,000 email subscribers, unlimited products/videos/spaces, unlimited assistant seats"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier — a 30-day free trial gives full access to all features before you must choose a paid plan. The entry Mover plan still charges a 5% Podia transaction fee on top of standard Stripe/PayPal processing; that fee only disappears on Shaker and above. Prices shown are the flat annual-billed rate (Podia doesn't publish a separate, higher month-to-month rate on its pricing page).",
    startingPrice: 42,
    currency: "USD",

    keyFeatures: [
      "Sell courses, digital downloads, and memberships from one platform",
      "Built-in paid community/spaces feature",
      "Email marketing included at every paid tier",
      "Affiliate marketing program tools (Shaker and above)",
      "Upsells and Zapier integration on higher tiers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for course creators and community builders who want courses, downloads, community, and email marketing genuinely unified in one product — the entry Mover tier's 5% transaction fee is a real cost that only goes away by upgrading to Shaker.",
    bestFor: [
      "Course creators who want courses, community, and email marketing in one subscription",
      "Creators who value predictable flat pricing over Gumroad-style per-transaction fees at real volume",
    ],
    avoidIf: [
      "Your sales volume is low/unpredictable — Gumroad's zero-monthly-fee model carries less financial risk",
      "You only need simple digital downloads — Payhip or Sellfy may be cheaper for that narrower use case",
    ],
    pros: [
      "Genuinely all-in-one: courses, downloads, community, and email marketing without stitching tools together",
      "0% transaction fee on Shaker and Earthquaker tiers",
      "30-day full-featured free trial to evaluate before paying",
    ],
    cons: [
      "No permanent free tier — must commit to a paid plan after the trial",
      "Entry Mover tier still carries a 5% transaction fee on top of processor fees",
      "Subscriber/product caps on Mover and Shaker force upgrades as a creator's audience grows",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.podia.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "payhip",
    name: "Payhip",
    // DRAFT - review before publish
    tagline: "Simple digital product storefront with a genuine free-forever plan and unlimited products/revenue at every tier.",
    logoUrl: "https://www.google.com/s2/favicons?domain=payhip.com&sz=128",
    website: "https://payhip.com",

    category: "ecommerce",
    subCategory: "digital-products",
    industries: ["freelancers", "ecommerce"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Available globally; payment processing via PayPal/Stripe standard rates apply regardless of region.",
    useCases: ["sell digital downloads", "sell online courses", "sell memberships", "print-on-demand merchandise"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free Forever", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["5% Payhip transaction fee; all features, unlimited products, unlimited revenue"] },
      { name: "Plus", priceMonthly: 29, priceAnnual: null, currency: "USD", keyLimits: ["2% Payhip transaction fee; all features, unlimited products, unlimited revenue"] },
      { name: "Pro", priceMonthly: 99, priceAnnual: null, currency: "USD", keyLimits: ["0% Payhip transaction fee; all features, unlimited products, unlimited revenue"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The Free Forever plan genuinely includes every feature with unlimited products and unlimited revenue — the only difference between tiers is the Payhip transaction fee (5% free, 2% Plus, 0% Pro), not feature access. Standard PayPal/Stripe processing fees apply on top of the Payhip fee at every tier. No credit card is required to start on Free.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Every feature available on every tier, including Free",
      "Unlimited products and unlimited revenue at every tier",
      "Sell digital downloads, courses, memberships, and print-on-demand",
      "Transaction fee is the only lever between plan tiers",
      "No credit card required to start",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for creators who want to start completely free with zero feature restrictions and only start paying to reduce the transaction fee as sales grow — the unusually clean 'same features, different fee' model makes cost tradeoffs easy to reason about.",
    bestFor: [
      "New creators who want every feature available from day one with no paywall",
      "Sellers who prefer a simple 'pay to lower the transaction fee' model over feature-gated tiers",
    ],
    avoidIf: [
      "You have high sales volume and want 0% transaction fees without waiting to justify the $99/mo Pro tier",
      "You need deep community/membership features — Podia is more full-featured there",
    ],
    pros: [
      "Genuinely free forever with zero feature restrictions, not a limited trial",
      "Unlimited products and revenue at every tier, including Free",
      "Simple, easy-to-reason-about pricing lever (transaction fee only, not features)",
    ],
    cons: [
      "5% transaction fee on Free adds up quickly at real sales volume",
      "Smaller ecosystem and brand recognition than Gumroad or Podia",
      "Fewer community/membership-specific features than Podia",
    ],

    popularityScore: 48,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://payhip.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["invoice-generator"],
  },
];
