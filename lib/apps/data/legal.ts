import type { AppListing } from "../types";

// Scaffolded via Prompt 2 — 20 well-known Legal & Compliance tools spanning
// e-signature, contract management, compliance/security-audit automation,
// and legal practice/business tools.
//
// Every field tagged with the literal string "VERIFY" is a placeholder for
// a fact (pricing tier, price, free-tier limit, or integration list) that
// must be checked against the vendor's own live pricing page before this
// listing is published — see docs/apps-verification-checklist.md. Do not
// replace "VERIFY" with a remembered or guessed value.
//
// Compliance/security-audit automation vendors (Vanta, Drata, Secureframe,
// OneTrust, Sprinto) and several enterprise CLM vendors (Ironclad, Juro,
// Icertis) confirmed via their own live pricing pages that they publish NO
// dollar figures at all — pricing is 100% custom-quote, sales-led. That is
// a genuinely confirmed fact, but because this schema's `startingPrice`
// field requires a real number to count as "verified" (see
// `isPricingVerified()` in lib/apps/index.ts), a fully custom-quote vendor
// with no published number cannot pass that gate — same treatment as
// Oracle NetSuite / Sage Intacct elsewhere in this directory. These
// listings stay VERIFY/unpublished, not because the fact is unknown, but
// because there is no numeric starting price to publish.
//
// None of this is a substitute for qualified legal counsel — every verdict
// here is a software buying recommendation, not legal advice.
//
// Editorial fields (tagline, verdict, bestFor, avoidIf, pros, cons) are
// well-reasoned drafts based on each tool's general reputation and market
// positioning, marked "// DRAFT - review before publish" — apply your own
// judgement before these go live.
//
// The publish guard lives in lib/apps/index.ts (isPricingVerified /
// ALL_APPS): any listing still carrying a VERIFY pricing fact is excluded
// from the production directory automatically.

export const LEGAL_APPS: AppListing[] = [
  {
    id: "docusign",
    name: "DocuSign",
    // DRAFT - review before publish
    tagline: "The category-defining e-signature platform — the default choice most counterparties already recognize and trust.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.docusign.com&sz=128",
    website: "https://www.docusign.com",

    category: "legal",
    subCategory: "e-signature",
    industries: ["agencies", "consulting", "real-estate", "healthcare", "construction", "ecommerce"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available worldwide with region-specific compliance certifications (eIDAS in the EU, etc.) — VERIFY current country-level availability and pricing/currency variations.",
    useCases: ["send documents for e-signature", "collect legally binding signatures", "contract signing workflows", "identity-verified signing", "payment collection on signed forms"],
    pricingModel: "subscription",

    pricing: [
      { name: "Personal", priceMonthly: 11, priceAnnual: 132, currency: "USD", keyLimits: ["Billed annually; 5 envelopes/mo, reusable templates, 1,000+ integrations, secure cloud storage"] },
      { name: "Standard", priceMonthly: 30, priceAnnual: 360, currency: "USD", keyLimits: ["Per user, billed annually; 100 envelopes/user/year, team template sharing, real-time commenting, custom branding, 5 bonus SMS deliveries"] },
      { name: "Business Pro", priceMonthly: 45, priceAnnual: 540, currency: "USD", keyLimits: ["Per user, billed annually; 100 envelopes/user/year, mobile-friendly web forms, payment collection, bulk sending, eWitness"] },
      { name: "Enhanced Plans / Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — custom envelope limits, centralized org management, SSO, Salesforce integration, 24/7 support"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier and no free trial offered — DocuSign only provides a 30-day money-back guarantee on annual plans (monthly plans are cancellable anytime). The cheapest entry point, Personal at $11/mo, caps out at just 5 envelopes/month and doesn't include team features.",
    startingPrice: 11,
    currency: "USD",

    keyFeatures: [
      "Legally binding e-signature collection with full audit trail",
      "Reusable, shareable templates",
      "1,000+ third-party integrations (Salesforce, Google, Microsoft, etc.)",
      "AI-assisted contract summaries and clause analysis",
      "Bulk sending and payment collection on paid tiers",
      "Identity verification and eWitness options",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The safe default when signature-recipient familiarity matters more than price — most people and businesses already know how to use DocuSign, which reduces friction on the other side of the signature. Cheaper competitors (Dropbox Sign, SignNow) undercut it on price for teams that don't need that brand recognition.",
    bestFor: [
      "Businesses that regularly send documents to external counterparties who expect a recognizable e-signature brand",
      "Real estate, healthcare, and professional services firms needing identity verification and a strong audit trail",
    ],
    avoidIf: [
      "You're cost-sensitive and your signers don't care which e-signature tool you use — cheaper alternatives cover the same core workflow",
      "You need full contract lifecycle management, not just signing — pair with or consider a dedicated CLM tool instead",
    ],
    pros: [
      "Widest brand recognition in e-signature — recipients trust and understand it instantly",
      "Deep integration catalog across CRM, storage, and productivity tools",
      "Strong audit trail and identity-verification options for higher-stakes documents",
    ],
    cons: [
      "No free tier or trial — you're committing to a paid plan (or the very limited Personal tier) from day one",
      "Per-envelope and per-user pricing gets expensive quickly for high-volume senders",
      "Meaningfully pricier than SignNow or Dropbox Sign for equivalent core signing functionality",
    ],

    popularityScore: 92,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://ecom.docusign.com/plans-and-pricing/esignature",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["nda-generator", "freelance-contract-generator"],
  },
  {
    id: "dropbox-sign",
    name: "Dropbox Sign",
    // DRAFT - review before publish
    tagline: "Dropbox's e-signature product (formerly HelloSign) — a simpler, cheaper alternative to DocuSign for straightforward signing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.dropboxsign.com&sz=128",
    website: "https://www.dropboxsign.com",

    category: "legal",
    subCategory: "e-signature",
    industries: ["agencies", "consulting", "freelancers", "real-estate", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current country-level availability and currency support.",
    useCases: ["send documents for e-signature", "collect legally binding signatures", "embedded signing via API", "contract signing workflows"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Legally binding e-signature requests",
      "Reusable templates",
      "Embedded signing / API for developers",
      "Audit trail and document tracking",
      "Integrations with Dropbox, Google Workspace, and Slack",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for individuals and small teams who want DocuSign-equivalent core signing without DocuSign's price tag — the tradeoff is a smaller integration catalog and less brand recognition with recipients. Confirm current pricing directly before publishing this listing.",
    bestFor: [
      "Freelancers and small businesses that mainly need simple, low-volume document signing",
      "Teams already inside the Dropbox ecosystem wanting signing built into existing storage",
    ],
    avoidIf: [
      "You need the widest possible third-party integration catalog — DocuSign and PandaDoc go deeper",
      "Recipient brand recognition matters (some signers trust DocuSign specifically)",
    ],
    pros: [
      "Generally cheaper than DocuSign for equivalent core signing functionality",
      "Clean, simple interface with a lower learning curve",
      "Native Dropbox integration for teams already using Dropbox storage",
    ],
    cons: [
      "Smaller integration ecosystem than DocuSign or PandaDoc",
      "Advanced admin/security features are gated behind higher, less-transparent pricing",
      "Vendor pricing page repeatedly returned 404s / blocked automated fetch during verification — figures below are unconfirmed",
    ],

    popularityScore: 76,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.dropboxsign.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["nda-generator", "freelance-contract-generator"],
  },
  {
    id: "adobe-acrobat-sign",
    name: "Adobe Acrobat Sign",
    // DRAFT - review before publish
    tagline: "E-signature built into the Acrobat/PDF workflow most businesses already use for document handling.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.adobe.com&sz=128",
    website: "https://www.adobe.com/sign.html",

    category: "legal",
    subCategory: "e-signature",
    industries: ["agencies", "consulting", "real-estate", "healthcare", "construction"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current country-level availability and currency support.",
    useCases: ["send documents for e-signature", "PDF-based signing workflows", "contract signing", "enterprise document workflows"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "E-signature tightly integrated with Acrobat PDF tools",
      "Bulk send and reusable templates",
      "Enterprise-grade audit trail and compliance certifications",
      "Integrations with Microsoft 365, Salesforce, Workday",
      "Mobile signing apps",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for organizations already paying for Acrobat/Creative Cloud who want signing folded into the same PDF workflow — pricing structure needs direct confirmation before publishing, as Adobe's live pricing page was unreachable during verification (repeated timeouts/DNS failures).",
    bestFor: [
      "Businesses already standardized on Adobe Acrobat/PDF tools for document handling",
      "Enterprises needing deep Microsoft 365/Salesforce/Workday integration for signing",
    ],
    avoidIf: [
      "You don't use Acrobat/PDF tools elsewhere — a standalone e-signature tool may be simpler and cheaper",
      "You want fast self-serve signup without navigating Adobe's broader product/plan bundling",
    ],
    pros: [
      "Deep, native integration with the PDF tools many businesses already use",
      "Strong enterprise compliance and audit-trail credentials",
      "Backed by Adobe's broad enterprise integration catalog",
    ],
    cons: [
      "Pricing and plan structure are often bundled with other Adobe products, making cost comparison harder",
      "Historically less intuitive UX than dedicated e-signature-first competitors",
      "Adobe's pricing pages were unreachable during this verification pass — figures unconfirmed",
    ],

    popularityScore: 80,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.adobe.com/sign/pricing.html",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["nda-generator", "freelance-contract-generator"],
  },
  {
    id: "signnow",
    name: "signNow",
    // DRAFT - review before publish
    tagline: "Budget-friendly e-signature tool from the airSlate family, positioned on simplicity and price.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.signnow.com&sz=128",
    website: "https://www.signnow.com",

    category: "legal",
    subCategory: "e-signature",
    industries: ["freelancers", "agencies", "consulting", "real-estate", "construction"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current country-level availability and currency support.",
    useCases: ["send documents for e-signature", "collect legally binding signatures", "in-person signing", "contract signing workflows"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Legally binding e-signature collection",
      "In-person and remote signing",
      "Reusable templates and fillable forms",
      "Airslate ecosystem integrations (workflow/document generation)",
      "API for embedded signing",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for cost-conscious individuals and small businesses that just need reliable, no-frills signing — signNow has historically undercut DocuSign and Adobe Sign on price, though its live pricing page couldn't be reached for direct confirmation this pass.",
    bestFor: [
      "Solo professionals and small businesses on a tight software budget",
      "Real estate and field-service businesses needing quick in-person signing on mobile",
    ],
    avoidIf: [
      "You need the deepest possible enterprise integration catalog — DocuSign and Adobe Sign are more established there",
      "You want the single most recognizable e-signature brand for external signers",
    ],
    pros: [
      "Generally positioned as one of the cheaper full-featured e-signature tools",
      "Solid mobile and in-person signing support",
      "Part of the broader airSlate no-code document/workflow ecosystem",
    ],
    cons: [
      "Less brand recognition with recipients than DocuSign or Adobe Sign",
      "UI/UX is generally considered less polished than category leaders",
      "signNow's pricing page and domain were unreachable/blocked during verification — figures unconfirmed",
    ],

    popularityScore: 62,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.signnow.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["nda-generator", "freelance-contract-generator"],
  },
  {
    id: "zoho-sign",
    name: "Zoho Sign",
    // DRAFT - review before publish
    tagline: "E-signature bundled into the Zoho suite — a natural fit for teams already running Zoho CRM/Workplace.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.zoho.com&sz=128",
    website: "https://www.zoho.com/sign/",

    category: "legal",
    subCategory: "e-signature",
    industries: ["freelancers", "agencies", "consulting", "retail", "ecommerce"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Currency selector supports USD, INR, EUR, GBP, JPY, SGD, AUD — pricing varies by selected currency/region.",
    useCases: ["send documents for e-signature", "approval workflows", "bulk send/sign", "in-person signing", "payment collection on signed forms"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "Free plan is confirmed at $0/mo for a single user with 5 envelopes/month, basic signatures, audit trail, and mobile/desktop apps. Standard, Professional, and Enterprise tier dollar prices are rendered via JavaScript and were not extractable during verification — VERIFY exact per-user pricing directly before publishing as fully verified.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Legally binding e-signature with approval workflows",
      "Bulk send and bulk sign",
      "In-person signing and payment collection",
      "Deep integration with Zoho CRM/Workplace/Suite",
      "WhatsApp and SMS delivery options",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams already invested in the Zoho ecosystem who want e-signature bundled in at a low incremental cost — the genuinely free 5-envelopes/mo tier is a real starting point, but confirm current paid-tier pricing directly since it wasn't extractable from the vendor page.",
    bestFor: [
      "Small businesses already using Zoho CRM, Workplace, or other Zoho apps",
      "Teams needing WhatsApp/SMS delivery options for signature requests",
    ],
    avoidIf: [
      "You're not in the Zoho ecosystem — standalone tools like Dropbox Sign may integrate better with your existing stack",
      "You need guaranteed, transparent per-user pricing without checking a currency-dependent calculator",
    ],
    pros: [
      "Free tier is real and usable (5 envelopes/mo), not just a trial",
      "Strong value if already paying for other Zoho products",
      "Unusual delivery options (WhatsApp, SMS) beyond typical email-only signing",
    ],
    cons: [
      "Paid tier pricing is not transparently published — requires navigating a JS-rendered calculator",
      "Smaller standalone integration catalog outside the Zoho ecosystem",
      "Less brand recognition with external signers than DocuSign/Adobe Sign",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.zoho.com/sign/pricing.html",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["nda-generator", "freelance-contract-generator"],
  },
  {
    id: "pandadoc",
    name: "PandaDoc",
    // DRAFT - review before publish
    tagline: "Document workflow platform combining e-signature, proposal/quote building, and basic contract automation.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.pandadoc.com&sz=128",
    website: "https://www.pandadoc.com",

    category: "legal",
    subCategory: "e-signature",
    industries: ["agencies", "consulting", "real-estate", "ecommerce", "construction"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current country-level availability and currency support beyond USD.",
    useCases: ["send documents for e-signature", "build and send proposals/quotes", "contract creation and approval workflows", "CPQ (configure-price-quote)", "deal rooms"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["5 legally-binding eSignatures/mo, 5 documents sent/mo, unlimited storage, mobile app, audit trail"] },
      { name: "Starter", priceMonthly: 19, priceAnnual: null, currency: "USD", keyLimits: ["Per seat; unlimited document uploads and eSignatures, document editor, real-time tracking"] },
      { name: "Business", priceMonthly: 49, priceAnnual: null, currency: "USD", keyLimits: ["Per seat (most popular); adds CRM integrations, custom branding, up to 3 deal rooms, approval workflows, web forms, bulk send"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — adds CPQ, workflow automation, SSO, team workspaces, notary services, API/webhooks, HIPAA option"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan genuinely allows 5 eSignatures and 5 documents sent per month with unlimited storage and no credit card required — enough to trial the workflow, not for regular business use. Paid annual billing is advertised at up to 46% off monthly rates.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "E-signature collection with audit trail",
      "Drag-and-drop document/proposal editor",
      "CRM integrations (Salesforce, HubSpot, Pipedrive)",
      "Approval workflows and deal rooms",
      "CPQ and workflow automation (higher tiers)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for sales teams that want proposals, quotes, and signatures in one document workflow rather than stitching together separate tools — less purpose-built than a dedicated CLM for post-signature contract management at scale.",
    bestFor: [
      "Sales teams sending proposals/quotes that need built-in e-signature",
      "Small businesses wanting one tool for document creation, tracking, and signing",
    ],
    avoidIf: [
      "You only need simple e-signature and don't need proposal/quote building — a dedicated e-signature tool may be cheaper",
      "You need deep post-signature contract lifecycle management — pair with or consider a dedicated CLM",
    ],
    pros: [
      "Combines proposal building, e-signature, and basic workflow in one product",
      "Real (if limited) free tier, unlike most CLM-adjacent tools",
      "Strong CRM integration story for sales-led teams",
    ],
    cons: [
      "Free tier's 5 documents/eSignatures per month is quite limiting",
      "Per-seat pricing on Business adds up for larger sales teams",
      "Enterprise-grade CLM depth (clause libraries, obligation tracking) is thinner than dedicated CLM platforms",
    ],

    popularityScore: 79,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.pandadoc.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["nda-generator", "freelance-contract-generator"],
  },
  {
    id: "ironclad",
    name: "Ironclad",
    // DRAFT - review before publish
    tagline: "Enterprise contract lifecycle management platform built around workflow automation and an AI contracting assistant.",
    logoUrl: "https://www.google.com/s2/favicons?domain=ironcladapp.com&sz=128",
    website: "https://ironcladapp.com",

    category: "legal",
    subCategory: "contract-management",
    industries: ["consulting", "ecommerce", "healthcare", "real-estate"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options.",
    useCases: ["contract lifecycle management", "clickwrap/click-to-accept agreements", "contract workflow automation", "AI-assisted contract review", "e-signature for contracts"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier and no self-serve pricing at all — Ironclad's own pricing page confirms a fully custom, sales-led model: pick your product (CLM, AI assistant, e-signature), pick your implementation partner, then get a quote. No dollar figures are published anywhere on the site.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Contract lifecycle management (drafting through renewal)",
      "Clickwrap for click-to-accept agreements at scale",
      "AI contracting assistant (Jurist) for review and drafting",
      "Workflow automation and approval routing",
      "Native e-signature",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for mid-size and larger legal/procurement teams that have outgrown simple e-signature and need real contract workflow automation — the fully custom-quote, sales-led buying process means there's no way to gauge cost without engaging their sales team, which puts it out of reach for small teams evaluating self-serve.",
    bestFor: [
      "Legal and procurement teams managing high contract volume needing structured workflow automation",
      "Companies needing click-to-accept agreements (clickwrap) at consumer scale",
    ],
    avoidIf: [
      "You're a small team or solo practitioner — this is priced and built for mid-size/enterprise legal operations",
      "You want to see pricing before talking to sales — nothing is published self-serve",
    ],
    pros: [
      "Purpose-built CLM depth well beyond what e-signature-first tools offer",
      "AI assistant (Jurist) is a genuine differentiator for contract review speed",
      "Clickwrap product covers high-volume click-to-accept use cases most CLM tools don't",
    ],
    cons: [
      "Zero published pricing — every prospect must go through a sales quote process",
      "Overkill and likely cost-prohibitive for small businesses or solo practitioners",
      "Implementation typically requires dedicated onboarding/legal engineering support, adding time and cost",
    ],

    popularityScore: 73,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://ironcladapp.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["nda-generator"],
  },
  {
    id: "contractsafe",
    name: "ContractSafe",
    // DRAFT - review before publish
    tagline: "Simpler, lower-cost contract management focused on organizing and finding contracts rather than heavy workflow automation.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.contractsafe.com&sz=128",
    website: "https://www.contractsafe.com",

    category: "legal",
    subCategory: "contract-management",
    industries: ["consulting", "real-estate", "construction", "nonprofits", "healthcare"],
    businessSizes: ["small", "medium"],
    regions: ["global"],
    regionNotes: "Pricing page offers a currency selector (USD, EUR, CAD, AUD, NZD, GBP), suggesting availability across those markets — VERIFY exact regional coverage.",
    useCases: ["contract storage and search", "contract renewal/expiration alerts", "AI contract data extraction", "e-signature and approval workflows (higher tiers)"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier — the vendor's own pricing page confirms a free trial only, after which pricing is quoted based on contract-volume bands (100 or fewer up to 10,000+) via an interactive selector; no flat dollar figures are shown without selecting a band. All three tiers (Organize, Finalize, Maximize) include unlimited users regardless of price.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "AI-powered contract data extraction",
      "Searchable, centralized contract repository",
      "Renewal/expiration alerts",
      "E-signature and approval workflows (Finalize/Maximize tiers)",
      "Salesforce integration and API access (Maximize tier)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for small-to-mid teams whose core pain point is 'we can't find our contracts,' not full contract workflow automation — unlimited users on every tier is a genuinely good deal structurally, but exact pricing requires selecting your contract volume on their site since no flat numbers are published.",
    bestFor: [
      "Small legal/ops teams needing a searchable contract repository more than heavy workflow automation",
      "Organizations wanting unlimited user seats regardless of plan tier",
    ],
    avoidIf: [
      "You need deep workflow automation and clause-level intelligence — Ironclad or Juro go further",
      "You want to see a flat dollar price without selecting your contract volume first",
    ],
    pros: [
      "Unlimited users on every tier, unusual in this category",
      "Simpler, more approachable than full enterprise CLM platforms",
      "AI data extraction included even on the entry-level Organize tier",
    ],
    cons: [
      "No permanent free tier, only a trial",
      "Pricing requires navigating an interactive volume-based selector rather than seeing flat published rates",
      "Lighter on workflow automation than purpose-built CLM competitors",
    ],

    popularityScore: 48,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.contractsafe.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["nda-generator"],
  },
  {
    id: "concord",
    name: "Concord",
    // DRAFT - review before publish
    tagline: "Contract lifecycle management with AI Copilot, priced as a flat monthly base plus per-additional-user fees.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.concord.app&sz=128",
    website: "https://www.concord.app",

    category: "legal",
    subCategory: "contract-management",
    industries: ["consulting", "ecommerce", "real-estate", "construction"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options.",
    useCases: ["contract lifecycle management", "contract drafting and amendment tracking", "approval workflows", "AI contract extraction/Copilot", "clause library management"],
    pricingModel: "subscription",

    pricing: [
      { name: "Essentials", priceMonthly: 499, priceAnnual: null, currency: "USD", keyLimits: ["Billed annually; includes 5 users (additional users $49/mo each); AI Copilot and extraction, unlimited e-signatures/documents, amendment management"] },
      { name: "Business", priceMonthly: 899, priceAnnual: null, currency: "USD", keyLimits: ["Billed annually; includes 5 users (additional users $69/mo each); adds intake forms, approval workflows, custom roles, Salesforce/HubSpot/Slack integrations"] },
      { name: "Enterprise", priceMonthly: 1299, priceAnnual: null, currency: "USD", keyLimits: ["Billed annually; includes 5 users (additional users $89/mo each); adds clause library, subsidiary management, bulk send, open API, custom branding; volume discounts available"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — pricing starts at a flat $499/mo (billed annually) for 5 included users on Essentials, with additional users billed per-seat on top of the base fee. All tiers include unlimited e-signatures and documents, and unlimited free viewer/guest seats for counterparties.",
    startingPrice: 499,
    currency: "USD",

    keyFeatures: [
      "AI Copilot for contract drafting and extraction",
      "Amendment and version tracking",
      "Approval workflows and custom roles (Business+)",
      "Clause library (Enterprise)",
      "Unlimited free external viewer/guest access",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for small legal/ops teams (5 or fewer core users) that want CLM plus AI drafting help at a flat, published starting price — the base-fee-plus-per-seat model can get expensive quickly once you're adding users beyond the included 5.",
    bestFor: [
      "Small legal or contracts teams of around 5 people wanting AI-assisted drafting and extraction",
      "Teams that value unlimited free counterparty/guest access for signing and review",
    ],
    avoidIf: [
      "You're a solo user or very small team — the $499/mo Essentials floor is steep relative to per-seat e-signature tools",
      "You need dozens of internal seats — per-additional-user fees on top of the base plan add up fast",
    ],
    pros: [
      "Rare in this category: real, published starting prices rather than pure custom quote",
      "AI Copilot and extraction included even on the entry Essentials tier",
      "Unlimited free viewer/guest seats reduce friction for external signers",
    ],
    cons: [
      "$499/mo minimum makes it a poor fit for solo practitioners or very small teams",
      "Per-additional-user fees stack on top of an already substantial base fee",
      "No free trial or free tier to test the product before committing",
    ],

    popularityScore: 56,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.concord.app/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["nda-generator"],
  },
  {
    id: "juro",
    name: "Juro",
    // DRAFT - review before publish
    tagline: "AI-native contract management built for in-house legal and business teams to self-serve routine contracts.",
    logoUrl: "https://www.google.com/s2/favicons?domain=juro.com&sz=128",
    website: "https://juro.com",

    category: "legal",
    subCategory: "contract-management",
    industries: ["consulting", "ecommerce", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Pricing quoted in USD, GBP, or EUR depending on customer location — VERIFY exact regional availability.",
    useCases: ["contract lifecycle management", "self-serve contract creation for non-legal teams", "AI contract extraction/review/drafting", "approval workflows"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier and no published pricing — Juro's own pricing page confirms pricing is fully custom, based on monthly contract volume and which AI features (Extract, Draft, Review) and integrations are selected. Unlimited users, workflows, and templates are included regardless of plan.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Browser-native contract editor (no PDF round-tripping)",
      "AI Extract, Draft, and Review",
      "Self-serve contract creation for sales/HR/procurement teams",
      "Approval workflows and unlimited templates",
      "Native e-signature",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for legal teams that want to let non-legal colleagues self-serve routine contracts safely, inside a fast browser-native editor — like most CLM platforms at this level, you'll need a sales conversation to learn what it actually costs.",
    bestFor: [
      "In-house legal teams wanting to delegate routine contract creation to sales/HR/procurement",
      "Teams prioritizing a fast, modern browser-based editing experience over PDF workflows",
    ],
    avoidIf: [
      "You want to compare pricing without a sales call — nothing is published self-serve",
      "You're a very small team where a lighter e-signature-plus-templates tool would suffice",
    ],
    pros: [
      "Unlimited users, workflows, and templates on every custom plan",
      "Genuinely browser-native editing avoids clunky PDF-upload workflows",
      "AI features (Extract/Draft/Review) are core to the product, not bolted on",
    ],
    cons: [
      "Fully custom, volume-based pricing with nothing published — hard to budget without a sales call",
      "Deep integrations (Salesforce, HubSpot, Workday) reportedly cost extra on top of the base plan",
      "Smaller company/support footprint than category leaders like Ironclad",
    ],

    popularityScore: 52,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://juro.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["nda-generator"],
  },
  {
    id: "icertis",
    name: "Icertis",
    // DRAFT - review before publish
    tagline: "Enterprise-grade contract intelligence platform built for the largest, most complex contracting organizations.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.icertis.com&sz=128",
    website: "https://www.icertis.com",

    category: "legal",
    subCategory: "contract-management",
    industries: ["consulting", "healthcare", "ecommerce"],
    businessSizes: ["enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options — targets large multinational enterprises.",
    useCases: ["enterprise contract lifecycle management", "contract risk analytics", "regulated-industry contract compliance", "AI-driven contract intelligence"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No public pricing exists at all — like Oracle NetSuite elsewhere in this directory, Icertis has no self-serve pricing page; it's sold exclusively through an enterprise sales/discovery process based on user count, contract volume, modules selected, and deployment complexity.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Enterprise contract lifecycle management at very high contract volumes",
      "AI-driven contract intelligence and risk analytics",
      "Modular architecture (core CLM plus add-on modules)",
      "Built for regulated industries with complex compliance needs",
      "Deep ERP/CRM integrations for large enterprises",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Built for very large enterprises (multi-billion-dollar revenue organizations) managing thousands of contracts across regulated industries — not a fit for small or mid-size teams, both in complexity and in cost, which by most third-party estimates runs into six figures in year one including implementation.",
    bestFor: [
      "Large, multinational enterprises with complex, high-volume, regulated contracting needs",
      "Organizations that need deep modular customization (risk analytics, ERP integration) beyond core CLM",
    ],
    avoidIf: [
      "You're a small or mid-size business — this is priced and architected for enterprise scale",
      "You want fast, self-serve setup — Icertis implementations are typically long, consultative engagements",
    ],
    pros: [
      "Purpose-built for the most complex, high-volume enterprise contracting environments",
      "Strong modular architecture for adding risk/analytics capability over time",
      "Established track record with large regulated-industry customers",
    ],
    cons: [
      "No public pricing whatsoever — every engagement starts with a sales discovery process",
      "Third-party estimates put total first-year cost (licensing plus implementation) in the six figures",
      "Significant implementation time/complexity compared to self-serve CLM tools",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.icertis.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "vanta",
    name: "Vanta",
    // DRAFT - review before publish
    tagline: "Automated security/compliance monitoring for SOC 2, ISO 27001, and similar frameworks — the category's most recognized name.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.vanta.com&sz=128",
    website: "https://www.vanta.com",

    category: "legal",
    subCategory: "compliance-automation",
    industries: ["consulting", "healthcare", "ecommerce"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options.",
    useCases: ["SOC 2 / ISO 27001 compliance automation", "continuous security control monitoring", "vendor security questionnaire automation", "trust center / security page hosting", "audit evidence collection"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier and no published pricing — Vanta's own pricing page lists four tiers (Essentials, Plus, Professional, Enterprise) by feature set, but every one of them is gated behind 'Get personalized pricing'; no dollar figures are published anywhere on the page.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Continuous automated monitoring of security controls",
      "Audit evidence collection for SOC 2, ISO 27001, HIPAA, GDPR, and more",
      "AI-powered policy generation and questionnaire automation",
      "Vendor/third-party risk management",
      "Trust Center for sharing security posture with prospects",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "The category leader by reputation and the one most auditors and enterprise customers already recognize by name — but like the rest of this category, you cannot see a price without booking a sales call, which makes comparison shopping harder than it should be for a first SOC 2.",
    bestFor: [
      "SaaS/tech companies pursuing their first SOC 2 or ISO 27001 certification",
      "Companies that will repeatedly need to answer customer security questionnaires and want that automated",
    ],
    avoidIf: [
      "You want to compare exact pricing across compliance-automation vendors before a sales call — none of them publish it, including Vanta",
      "Your compliance need is a one-time, narrow requirement rather than ongoing continuous monitoring",
    ],
    pros: [
      "Widest name recognition in the category — auditors and enterprise security teams already know it",
      "Broad framework coverage (SOC 2, ISO 27001, HIPAA, GDPR, and more) in one platform",
      "Trust Center and questionnaire automation reduce ongoing sales-security friction",
    ],
    cons: [
      "Zero published pricing anywhere — every prospect must request a custom quote",
      "Third-party cost estimates for this category commonly run into five figures annually",
      "Doesn't replace the audit itself — you still need to engage a licensed auditor separately",
    ],

    popularityScore: 84,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.vanta.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["privacy-policy-generator"],
  },
  {
    id: "drata",
    name: "Drata",
    // DRAFT - review before publish
    tagline: "Automated compliance monitoring positioned as Vanta's closest direct competitor, with similar breadth of framework coverage.",
    logoUrl: "https://www.google.com/s2/favicons?domain=drata.com&sz=128",
    website: "https://drata.com",

    category: "legal",
    subCategory: "compliance-automation",
    industries: ["consulting", "healthcare", "ecommerce"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options.",
    useCases: ["SOC 2 / ISO 27001 compliance automation", "continuous security control monitoring", "vendor security questionnaire automation", "audit evidence collection"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier and no published pricing — Drata's own pricing/landing page shows no dollar figures or plan tiers at all, only 'Get Started' and 'Contact Sales' calls to action segmented loosely by company stage (Startup, Growth, Enterprise).",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Continuous automated compliance monitoring",
      "Audit evidence collection across multiple frameworks",
      "Risk management and vendor questionnaire automation",
      "Integrations with cloud infrastructure and HR/IT tools for automated checks",
      "Auditor collaboration workspace",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A credible, frequently-cited alternative to Vanta with a similar feature set — worth putting in the same sales-call comparison round rather than assuming either vendor is cheaper without asking, since neither publishes pricing.",
    bestFor: [
      "Companies wanting a second quote to compare against Vanta for SOC 2/ISO 27001 automation",
      "Growth-stage companies that expect to add compliance frameworks over time",
    ],
    avoidIf: [
      "You want published, comparable pricing without a sales conversation — not available here or at most competitors",
      "You've already standardized on a different platform your auditor is familiar with",
    ],
    pros: [
      "Broad framework coverage comparable to the category leader",
      "Frequently recommended alongside Vanta as a direct, credible alternative",
      "Auditor collaboration tooling built into the core workflow",
    ],
    cons: [
      "Zero published pricing — every prospect must go through a sales/demo process",
      "Doesn't replace the audit itself — a licensed auditor is still required separately",
      "Smaller market share/brand recognition than Vanta, which may matter to some auditors/customers",
    ],

    popularityScore: 75,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://drata.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["privacy-policy-generator"],
  },
  {
    id: "secureframe",
    name: "Secureframe",
    // DRAFT - review before publish
    tagline: "Compliance automation platform covering SOC 2, ISO 27001, HIPAA, and CMMC, including defense-sector compliance needs.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.secureframe.com&sz=128",
    website: "https://www.secureframe.com",

    category: "legal",
    subCategory: "compliance-automation",
    industries: ["consulting", "healthcare", "ecommerce"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options.",
    useCases: ["SOC 2 / ISO 27001 compliance automation", "HIPAA compliance monitoring", "CMMC / defense-sector compliance (SSP, POA&M)", "continuous security control monitoring"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier and no published pricing — Secureframe's own pricing page lists three plans (Fundamentals, Complete, Defense) by feature set only; every plan routes to a 'Get a quote' request, with no dollar figures published.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Continuous automated compliance monitoring",
      "Multi-framework coverage including CMMC for defense contractors",
      "Audit evidence collection and auditor collaboration",
      "Vendor risk / third-party questionnaire automation",
      "Policy templates and employee compliance training",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Worth a look specifically if CMMC/defense-sector compliance is part of your requirement (its dedicated 'Defense' plan is a genuine differentiator) — otherwise it competes directly with Vanta and Drata on the same core SOC 2/ISO 27001 use case, with the same lack of published pricing.",
    bestFor: [
      "Defense contractors and government suppliers needing CMMC (SSP, POA&M) compliance support",
      "Companies wanting a third quote alongside Vanta/Drata for standard SOC 2/ISO 27001 automation",
    ],
    avoidIf: [
      "You want published pricing without a sales call — not available here or at most direct competitors",
      "You need the single most widely recognized brand name — Vanta has broader market recognition",
    ],
    pros: [
      "Dedicated CMMC/defense-compliance plan is a real differentiator versus Vanta/Drata",
      "Broad framework coverage spanning commercial and government-adjacent requirements",
      "Includes policy templates and training, not just technical monitoring",
    ],
    cons: [
      "Zero published pricing — every prospect must request a quote",
      "Smaller brand recognition than Vanta among enterprise buyers and auditors",
      "Doesn't replace the audit itself — a licensed auditor is still required separately",
    ],

    popularityScore: 66,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.secureframe.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["privacy-policy-generator"],
  },
  {
    id: "onetrust",
    name: "OneTrust",
    // DRAFT - review before publish
    tagline: "Broad privacy, consent, and third-party risk management platform — the enterprise standard for privacy compliance operations.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.onetrust.com&sz=128",
    website: "https://www.onetrust.com",

    category: "legal",
    subCategory: "compliance-automation",
    industries: ["consulting", "healthcare", "ecommerce", "retail"],
    businessSizes: ["medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options — widely used for GDPR/CCPA-style multi-jurisdiction privacy programs.",
    useCases: ["cookie consent management", "privacy program automation (GDPR/CCPA)", "third-party/vendor risk management", "AI governance", "data subject access request handling"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier and no published pricing — OneTrust's own pricing page confirms every product line (Consent Management, Privacy Automation, Third-Party Management, AI Governance, Tech Risk & Compliance) is priced on custom usage meters (e.g. daily visitors, data subject profiles, admin users, asset inventory size), all gated behind a personalized quote request.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Cookie/consent banner management across web properties",
      "Privacy program automation (data mapping, DSAR handling, assessments)",
      "Third-party/vendor risk management",
      "AI governance and AI inventory tracking",
      "Multi-jurisdiction regulatory tracking (GDPR, CCPA, and others)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "The broadest, most enterprise-oriented platform in this category, covering privacy, consent, and third-party risk well beyond just security-audit automation — likely overkill (and priced accordingly) for a small company that just needs a basic cookie banner or a single SOC 2.",
    bestFor: [
      "Larger organizations running a formal, multi-jurisdiction privacy compliance program",
      "Companies needing third-party/vendor risk management alongside privacy/consent tooling",
    ],
    avoidIf: [
      "You just need a simple cookie consent banner — dedicated, cheaper tools cover that alone",
      "You're a small business — OneTrust's usage-metered enterprise pricing is built for larger organizations",
    ],
    pros: [
      "Broadest feature coverage in the category — privacy, consent, AI governance, and vendor risk in one platform",
      "Well-established as the enterprise standard many large customers and auditors already expect",
      "Usage-based metrics (visitors, profiles, inventory size) can scale pricing to actual program size, in principle",
    ],
    cons: [
      "Zero published pricing across every product line — always a custom quote",
      "Historically associated with a steep learning curve and lengthy implementation for smaller teams",
      "Likely disproportionately expensive for companies that only need one narrow capability (e.g. just a cookie banner)",
    ],

    popularityScore: 78,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.onetrust.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["privacy-policy-generator", "cookie-policy-generator", "gdpr-request-letter"],
  },
  {
    id: "sprinto",
    name: "Sprinto",
    // DRAFT - review before publish
    tagline: "Compliance automation positioned as a faster, more automated path to SOC 2/ISO 27001 for lean startup teams.",
    logoUrl: "https://www.google.com/s2/favicons?domain=sprinto.com&sz=128",
    website: "https://sprinto.com",

    category: "legal",
    subCategory: "compliance-automation",
    industries: ["consulting", "healthcare", "ecommerce"],
    businessSizes: ["small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options.",
    useCases: ["SOC 2 / ISO 27001 compliance automation", "continuous security control monitoring", "audit evidence collection", "vendor security questionnaire automation"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "No free tier and no published pricing — Sprinto's own pricing page names no dollar figures or public tier grid; multiple independent third-party sources consistently confirm pricing is disclosed only after a sales call, with unofficial estimates ranging roughly from the high four figures to tens of thousands of dollars annually depending on tier and company size, none of which counts as vendor-verified.",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Automated, continuous compliance monitoring",
      "Audit evidence collection with auditor-facing workspace",
      "Multi-framework support (SOC 2, ISO 27001, and others)",
      "Vendor/security questionnaire automation",
      "Positioned toward faster time-to-audit-readiness for lean teams",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Marketed specifically at startups wanting to move faster through their first SOC 2/ISO 27001 than the larger platforms — a reasonable fourth name to add to a Vanta/Drata/Secureframe comparison round, though independent pricing estimates suggest it isn't necessarily the cheapest option by default.",
    bestFor: [
      "Early-stage startups wanting a fast, guided path to their first compliance certification",
      "Teams wanting a fourth vendor to compare against Vanta/Drata/Secureframe",
    ],
    avoidIf: [
      "You want published pricing without a sales call — not available here either",
      "You're already deep into implementation with a competitor and switching cost outweighs any potential savings",
    ],
    pros: [
      "Positioned specifically around speed-to-audit-readiness for smaller, leaner teams",
      "Multi-framework support comparable to larger, better-known competitors",
      "Frequently included in shortlists alongside Vanta/Drata/Secureframe",
    ],
    cons: [
      "Zero vendor-published pricing — even directionally, only third-party estimates exist",
      "Smaller brand recognition than Vanta among enterprise customers and some auditors",
      "Doesn't replace the audit itself — a licensed auditor is still required separately",
    ],

    popularityScore: 54,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://sprinto.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["privacy-policy-generator"],
  },
  {
    id: "clio",
    name: "Clio",
    // DRAFT - review before publish
    tagline: "The most widely used legal practice management platform — billing, case management, and client intake for law firms.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.clio.com&sz=128",
    website: "https://www.clio.com",

    category: "legal",
    subCategory: "legal-practice",
    industries: ["consulting", "real-estate"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Widely used across the US, Canada, UK, and Australia — VERIFY exact regional pricing/availability, as legal practice management rules vary by jurisdiction.",
    useCases: ["law firm case/matter management", "legal time tracking and billing", "client intake and CRM", "trust accounting", "document management for law firms"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Matter/case management",
      "Time tracking, billing, and trust accounting",
      "Client intake and CRM (Clio Grow, separate add-on)",
      "Document management and templates",
      "Court-rules-based calendaring",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The default choice for most solo and small-firm lawyers moving off spreadsheets/paper — the ecosystem, integration depth, and jurisdiction-specific trust-accounting support are hard for smaller competitors to match, though the entry tier is limited and add-ons like Clio Grow cost extra. Confirm current per-user pricing directly, since Clio's own pricing page blocked automated verification.",
    bestFor: [
      "Solo and small-firm lawyers needing case management, billing, and trust accounting in one system",
      "Firms wanting the largest ecosystem of legal-specific integrations and add-ons",
    ],
    avoidIf: [
      "You're not a law firm — Clio is purpose-built for legal practice management, not general business use",
      "You want every feature in one flat price — client intake (Clio Grow) and some capabilities are separate paid add-ons",
    ],
    pros: [
      "Largest ecosystem and market share among legal practice management platforms",
      "Purpose-built trust accounting that respects bar association rules",
      "Deep integration catalog with legal-specific tools (e-signature, payments, research)",
    ],
    cons: [
      "Entry-level tier is feature-limited; meaningful functionality requires stepping up plans",
      "Client intake/CRM (Clio Grow) is a separate paid product, not bundled by default",
      "Clio's pricing page blocked automated verification (403) during this research pass — figures unconfirmed",
    ],

    popularityScore: 85,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.clio.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "rocketlawyer",
    name: "Rocket Lawyer",
    // DRAFT - review before publish
    tagline: "Consumer/small-business legal subscription bundling document templates, e-signature, and attorney consultations.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.rocketlawyer.com&sz=128",
    website: "https://www.rocketlawyer.com",

    category: "legal",
    subCategory: "legal-practice",
    industries: ["freelancers", "agencies", "consulting", "real-estate", "retail"],
    businessSizes: ["solo", "small"],
    regions: ["north-america"],
    regionNotes: "Primarily US-focused legal document templates and attorney network; VERIFY availability/coverage in other regions.",
    useCases: ["create legal documents from templates", "e-signature on generated documents", "attorney consultations", "business registration", "contract review by an attorney"],
    pricingModel: "subscription",

    pricing: [
      { name: "Standard", priceMonthly: 12.41, priceAnnual: 149, currency: "USD", keyLimits: ["Billed annually; unlimited document creation and e-signatures, unlimited legal reminders, 12 'Ask an Attorney' questions/yr, access to 3 premium legal services"] },
      { name: "Plus", priceMonthly: 20.75, priceAnnual: 249, currency: "USD", keyLimits: ["Billed annually (most popular); unlimited documents/e-signatures, 36 'Ask an Attorney' questions/yr, 12 live attorney consultations/yr, access to 6 premium legal services"] },
      { name: "Pro", priceMonthly: 29.08, priceAnnual: 349, currency: "USD", keyLimits: ["Billed annually; unlimited documents/e-signatures, unlimited 'Ask an Attorney' questions and live attorney consultations, access to 9 premium legal services"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier — all three plans offer a free 7-day trial, after which billing begins at the selected annual plan. First business registration is free on every tier; subsequent registrations cost $99 plus state fees.",
    startingPrice: 12.41,
    currency: "USD",

    keyFeatures: [
      "250+ legal document templates with AI-assisted drafting (Rocket Copilot)",
      "Unlimited e-signatures on generated documents",
      "'Ask an Attorney' questions and live attorney consultations (plan-dependent)",
      "Business registration and compliance reminders",
      "Discounted tax preparation services",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "A reasonable subscription for a solo founder or small business that wants unlimited basic legal document creation plus occasional access to a real attorney — not a substitute for dedicated counsel on anything high-stakes, and the attorney-consultation caps on the cheaper tiers are tight.",
    bestFor: [
      "Solo founders and small businesses needing routine legal documents (leases, NDAs, contracts) without per-document fees",
      "Businesses wanting occasional, affordable access to a licensed attorney for quick questions",
    ],
    avoidIf: [
      "You need dedicated, ongoing counsel for anything complex or high-stakes — this is a template-and-limited-consultation product, not a law firm relationship",
      "You're outside the US — coverage and document templates are primarily US-focused",
    ],
    pros: [
      "Unlimited document creation and e-signatures on every tier, including the cheapest",
      "Real attorney access (not just templates) built into the subscription, scaling by tier",
      "First business registration included free on every plan",
    ],
    cons: [
      "'Ask an Attorney' questions and live consultations are capped on the two cheaper tiers",
      "Not a substitute for dedicated legal counsel on complex or high-stakes matters",
      "Primarily US-market focused, limiting usefulness for international businesses",
    ],

    popularityScore: 71,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.rocketlawyer.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["nda-generator", "freelance-contract-generator", "cease-and-desist-letter", "terms-of-service-generator"],
  },
  {
    id: "legalzoom",
    name: "LegalZoom",
    // DRAFT - review before publish
    tagline: "Well-known consumer legal services brand — business formation, legal document templates, and a dedicated eSignature product.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.legalzoom.com&sz=128",
    website: "https://www.legalzoom.com",

    category: "legal",
    subCategory: "legal-practice",
    industries: ["freelancers", "agencies", "consulting", "retail", "ecommerce"],
    businessSizes: ["solo", "small"],
    regions: ["north-america"],
    regionNotes: "US-focused legal document and business-formation services; VERIFY availability outside the US.",
    useCases: ["business formation (LLC, corporation)", "create legal documents from templates", "e-signature on documents", "attorney consultations", "registered agent services"],
    pricingModel: "subscription",

    pricing: [
      { name: "Forms — Single Document", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["$59 one-time per document; access to 250+ templates, rich editor, unlimited signers, e-signature collection and tracking, cloud storage"] },
      { name: "eSign", priceMonthly: 9.99, priceAnnual: 79, currency: "USD", keyLimits: ["Auto-renewing; unlimited eSignature access for uploaded documents, unlimited signers, real-time tracking, cloud storage — no template library access"] },
      { name: "Forms & eSign — Unlimited", priceMonthly: null, priceAnnual: 99, currency: "USD", keyLimits: ["Auto-renewing annual; unlimited template-based and uploaded-document e-signatures, access to 250+ templates, advanced editor, real-time tracking"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier on the eSignature product line confirmed here (help.legalzoom.com/docs/pricing-plans): the cheapest ongoing option is eSign at $9.99/mo or $79/yr, with a one-time $59 single-document option and a $99/yr unlimited-forms-plus-eSign tier also available. LegalZoom's much larger business-formation packages and separate attorney/legal-plan subscriptions (Personal Plan, Business Advisory Plan) were not verified in this pass — treat those figures as unconfirmed until checked directly.",
    startingPrice: 9.99,
    currency: "USD",

    keyFeatures: [
      "250+ legal document templates",
      "E-signature collection with real-time tracking",
      "Business formation and registered agent services (separate product line)",
      "Attorney consultation plans (separate subscription, unverified in this listing)",
      "Cloud document storage",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A recognizable brand for basic legal document needs and business formation, though the company's pricing spans several distinct product lines (formation packages, document templates, eSignature, attorney plans) that aren't all captured in one place — this listing reflects only the confirmed eSignature/document-template pricing; verify formation and attorney-plan pricing separately before relying on it.",
    bestFor: [
      "Solo founders wanting basic legal document templates plus e-signature in one recognizable brand",
      "Businesses that occasionally need a single formal document ($59 one-time) rather than an ongoing subscription",
    ],
    avoidIf: [
      "You need dedicated ongoing legal counsel — this is a template-and-limited-consultation product, not a law firm relationship",
      "You're trying to compare LegalZoom's full pricing (formation + attorney plans) — this listing only covers the confirmed eSignature/document product line",
    ],
    pros: [
      "Strong, widely recognized consumer legal brand",
      "Flexible options: one-time single document, monthly eSign, or annual unlimited-forms bundle",
      "Cloud storage and real-time tracking included even on the cheapest ongoing plan",
    ],
    cons: [
      "Pricing is fragmented across multiple product lines (formation, templates, eSign, attorney plans) that aren't unified in one place",
      "No permanent free tier on any product line",
      "Business-formation and attorney-plan pricing were not independently verified in this listing — confirm separately",
    ],

    popularityScore: 80,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://help.legalzoom.com/docs/pricing-plans",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["nda-generator", "freelance-contract-generator", "terms-of-service-generator", "cease-and-desist-letter"],
  },
  {
    id: "lawdepot",
    name: "LawDepot",
    // DRAFT - review before publish
    tagline: "Budget legal-document template subscription — draft your own contracts, wills, and forms without hiring an attorney.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.lawdepot.com&sz=128",
    website: "https://www.lawdepot.com",

    category: "legal",
    subCategory: "legal-practice",
    industries: ["freelancers", "agencies", "retail", "real-estate", "construction"],
    businessSizes: ["solo", "small"],
    regions: ["north-america", "europe", "oceania"],
    regionNotes: "VERIFY current country-specific document libraries and pricing — LawDepot serves separate US, Canada, UK, and Australia document sets.",
    useCases: ["create legal documents from templates", "wills and estate planning documents", "rental/lease agreements", "business contract templates"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Wide library of legal document templates (contracts, wills, real estate, business)",
      "Step-by-step guided document creation",
      "Document editing and download during subscription period",
      "Free one-week trial (per third-party reports — VERIFY directly)",
      "Single-document purchase option separate from subscription",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "A budget option for straightforward, low-stakes legal documents when you don't need attorney review — this listing's pricing page was JS-rendered and returned no extractable content during verification, so confirm current subscription/trial terms directly before publishing exact figures.",
    bestFor: [
      "Individuals and small businesses needing simple, common legal documents (leases, wills, basic contracts)",
      "One-off document needs where a single-document purchase (rather than a subscription) makes sense",
    ],
    avoidIf: [
      "Your document needs are complex, high-stakes, or jurisdiction-sensitive enough to need attorney review",
      "You want a brand with live attorney consultation built in — Rocket Lawyer/LegalZoom go further there",
    ],
    pros: [
      "Positioned as one of the more affordable legal-template subscriptions in the category",
      "Covers multiple country-specific document libraries (US, Canada, UK, Australia)",
      "Single-document purchase option avoids a subscription for one-off needs",
    ],
    cons: [
      "No attorney review or consultation built into the core product",
      "Templates are inherently generic — not a substitute for jurisdiction-specific legal advice on complex matters",
      "Vendor pricing page was JS-rendered and returned no extractable content during verification — figures unconfirmed",
    ],

    popularityScore: 47,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.lawdepot.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["nda-generator", "freelance-contract-generator", "terms-of-service-generator"],
  },
];
