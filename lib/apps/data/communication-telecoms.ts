import type { AppListing } from "../types";

// Scaffolded via Prompt — 20 well-known Communication & Telecoms tools
// spanning team chat, video conferencing, and business phone/VoIP systems.
// Deliberately excludes customer-support helpdesk/live-chat and CRM tools —
// those are separate categories covered elsewhere.
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
// Verification notes for this pass (2026-07-17):
// - Slack, Microsoft Teams, Discord (Nitro), Google Workspace (Meet), Quo
//   (formerly OpenPhone), JustCall, CloudTalk, Google Voice, and Ooma Office
//   were confirmed via direct WebFetch of the vendor's own pricing page.
// - Zoom, Cisco Webex, GoTo Meeting, RingCentral, Grasshopper, Nextiva,
//   Dialpad, Vonage Business, 8x8, Aircall, and Whereby could not be
//   confirmed this pass — vendor pricing pages returned 403/404/429, were
//   JS-rendered with dynamic (non-static) prices, were region-blocked, or
//   returned internally inconsistent monthly/annual figures. These carry
//   the VERIFY sentinel rather than a guessed number; see per-listing notes
//   in freeTierReality and the task report for specifics.
// - Google Workspace (Meet) and CloudTalk pricing were fetched directly
//   from the vendor but resolved to EUR/EU-market rates rather than USD —
//   disclosed via regionNotes/freeTierReality rather than converted/guessed.

export const COMMUNICATION_TELECOMS_APPS: AppListing[] = [
  {
    id: "slack",
    name: "Slack",
    // DRAFT - review before publish
    tagline: "The team chat platform that made channels, threads, and app integrations the default way teams talk.",
    logoUrl: "https://www.google.com/s2/favicons?domain=slack.com&sz=128",
    website: "https://slack.com",

    category: "communication-telecoms",
    subCategory: "team-chat",
    industries: ["agencies", "consulting", "ecommerce", "freelancers", "nonprofits"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Global service with no sign-up region restrictions; data residency/region options exist on Enterprise — VERIFY current coverage.",
    useCases: ["team messaging", "channel-based collaboration", "app/workflow integrations", "huddles (audio/video calls)", "external partner collaboration (Slack Connect)"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["90 days of message history, up to 10 app integrations, 1:1 huddles/messages only (no group meetings)"] },
      { name: "Pro", priceMonthly: 8.75, priceAnnual: 7.25, currency: "USD", keyLimits: ["Per user; unlimited message history and app integrations; group huddles/meetings unlocked"] },
      { name: "Business+", priceMonthly: 18, priceAnnual: 15, currency: "USD", keyLimits: ["Per user; adds SAML SSO, compliance exports, 99.99% uptime SLA"] },
      { name: "Enterprise+", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote; unlimited workspaces, HIPAA support, advanced admin/compliance controls"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan caps message history at 90 days and restricts calling to 1:1 huddles only — no group voice/video meetings. App integrations are capped at 10. Pro removes both caps but is still 1:1-meeting-limited-free; Business+ is the first tier with compliance features. Slack's own pricing page also showed a limited-time 50% introductory discount on Pro/Business+ at time of check — the figures recorded here are the standard (non-promo) list prices.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Channel-based team messaging with threads",
      "Huddles (audio/video calls) built into channels and DMs",
      "Deep third-party app/workflow integrations",
      "Slack Connect for cross-company channels",
      "Searchable message history",
      "Workflow Builder for no-code automations",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The default choice for team chat for most small-to-mid teams — the free tier is genuinely usable for very small teams, and the ecosystem of integrations is unmatched, but per-seat costs add up fast for larger headcounts.",
    bestFor: [
      "Teams already living in a messaging-first workflow who want the deepest app-integration ecosystem",
      "Small teams that can operate within the 90-day history cap on Free",
    ],
    avoidIf: [
      "You want video conferencing as a primary feature rather than an add-on — huddles are lighter-weight than Zoom/Meet",
      "You're cost-sensitive at scale — per-seat pricing on Pro/Business+ adds up quickly for larger teams",
    ],
    pros: [
      "Best-in-class app/integration ecosystem for a chat tool",
      "Threads and channels scale well for larger, noisier teams",
      "Slack Connect makes cross-company collaboration straightforward",
    ],
    cons: [
      "Free tier's 90-day message history cap is a real limitation, not just a soft nudge to upgrade",
      "Per-seat pricing gets expensive for large teams compared to bundled suites like Microsoft 365/Google Workspace",
      "Huddles are not a full video-conferencing replacement for larger scheduled meetings",
    ],

    popularityScore: 90,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://slack.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    // DRAFT - review before publish
    tagline: "Chat, video meetings, and calling bundled into Microsoft 365 — the default for organizations already on Office.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.microsoft.com&sz=128",
    website: "https://www.microsoft.com/en-us/microsoft-teams/group-chat-software",

    category: "communication-telecoms",
    subCategory: "team-chat",
    industries: ["agencies", "consulting", "ecommerce", "nonprofits", "healthcare", "construction"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Global service; data residency options available on higher tiers — VERIFY current regional coverage.",
    useCases: ["team messaging", "video meetings/webinars", "business phone calling (Teams Phone add-on)", "file collaboration via Microsoft 365", "meeting rooms (Teams Rooms)"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Unlimited 1:1 calls up to 30 hours, group meetings capped at 60 minutes, up to 100 participants per meeting, 5 GB cloud storage/user"] },
      { name: "Microsoft Teams Essentials", priceMonthly: 4, priceAnnual: 4, currency: "USD", keyLimits: ["Per user, billed yearly; up to 300 users, 10 GB storage/user, 30-hour meeting duration, 300 participants"] },
      { name: "Microsoft 365 Business Basic", priceMonthly: 7, priceAnnual: 7, currency: "USD", keyLimits: ["Per user, billed yearly; up to 300 users, 1 TB storage/user, adds web/mobile Office apps and Exchange email"] },
      { name: "Microsoft 365 Business Standard (with Copilot)", priceMonthly: 23.5, priceAnnual: 23.5, currency: "USD", keyLimits: ["Per user, billed yearly; up to 300 users, 1 TB storage/user, desktop Office apps plus Copilot AI features"] },
    ],
    hasFreeTier: true,
    freeTierReality: "The standalone free Teams plan is genuinely usable — unlimited 1:1 calls (up to 30 hours), group meetings up to 100 participants, though group calls are capped at 60 minutes and storage at 5 GB/user. Real business phone calling requires a separate Teams Phone add-on ($10-34/user/mo depending on calling plan) on top of a paid Teams/Microsoft 365 tier — it is not included in any tier listed here.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Channel-based team messaging and 1:1/group chat",
      "Video meetings up to 300 (paid) or 1,000+ (Enterprise) participants",
      "Deep Microsoft 365 app integration (Outlook, SharePoint, OneDrive)",
      "Teams Phone add-on for PSTN calling",
      "Teams Rooms for meeting-room hardware",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for organizations already on Microsoft 365 who want chat, meetings, and calling under one bundled subscription rather than stitching together separate tools — the free tier's 60-minute group-meeting cap makes it less useful standalone than Zoom's free plan for ad hoc video calls.",
    bestFor: [
      "Organizations already standardized on Microsoft 365/Office apps",
      "Enterprises wanting one vendor for chat, meetings, files, and calling",
    ],
    avoidIf: [
      "You're not on Microsoft 365 and just want a lightweight standalone chat or video tool",
      "You need PSTN business calling out of the box — Teams Phone is a separate paid add-on",
    ],
    pros: [
      "Deep, native integration with Outlook, SharePoint, and the rest of Microsoft 365",
      "Free tier's 30-hour 1:1 calling and 100-participant meetings are genuinely generous",
      "Scales cleanly from free individual use up to enterprise-grade Teams Rooms hardware",
    ],
    cons: [
      "Business phone calling is a separate paid add-on layered on top of a paid Teams tier, not included",
      "Free tier's 60-minute cap on group meetings is more restrictive than Zoom's 40-minute-but-larger-focus free tier for ad hoc calls",
      "Full value requires buying into the broader Microsoft 365 ecosystem",
    ],

    popularityScore: 89,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.microsoft.com/en-us/microsoft-teams/compare-microsoft-teams-options",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "discord",
    name: "Discord",
    // DRAFT - review before publish
    tagline: "Voice-channel-first chat platform born for gaming communities, increasingly used by small teams and creator businesses.",
    logoUrl: "https://www.google.com/s2/favicons?domain=discord.com&sz=128",
    website: "https://discord.com",

    category: "communication-telecoms",
    subCategory: "team-chat",
    industries: ["freelancers", "agencies"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "Nitro pricing is localized by country per Discord's own FAQ — figures here are the standard USD list price.",
    useCases: ["community/team text chat", "always-on voice channels", "screen sharing", "small business/creator community management"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Unlimited servers, channels, and members; standard upload/streaming quality"] },
      { name: "Nitro Basic", priceMonthly: 2.99, priceAnnual: null, currency: "USD", keyLimits: ["Custom emoji anywhere, 50 MB file uploads, custom app icons"] },
      { name: "Nitro", priceMonthly: 9.99, priceAnnual: null, currency: "USD", keyLimits: ["Everything in Basic plus 500 MB uploads, HD video streaming, custom profiles"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Discord's core chat/voice functionality — unlimited servers, channels, text/voice chat — is free with no seat-based paywall, which is unusual for this category. Nitro is a personal cosmetic/utility upgrade (bigger uploads, HD streaming), not a per-seat business plan; there is no distinct 'Discord for business' product or pricing tier as of this check. Annual Nitro pricing was not shown on the page checked.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Always-on voice channels (drop-in/drop-out audio)",
      "Text channels with threads and forum-style channels",
      "Screen sharing and video calls",
      "Bots and extensive API for automation",
      "Community/server management tools (roles, permissions)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small, informal teams or creator businesses that want always-on voice channels and zero per-seat cost — not built for formal business administration, compliance, or enterprise-grade access controls the way Slack or Teams are.",
    bestFor: [
      "Small, informal teams and creator/community-driven businesses already comfortable with Discord's culture",
      "Teams that want free, unlimited members with no per-seat pricing pressure",
    ],
    avoidIf: [
      "You need enterprise admin controls, SSO, or compliance features — Discord has no equivalent business tier",
      "Your team expects a more traditional, formal business-software interface",
    ],
    pros: [
      "Core chat and voice features are entirely free with no seat limits",
      "Always-on voice channels are a genuinely different (often faster) collaboration pattern than scheduled meetings",
      "Large existing user base among younger/creator-economy teams needs no onboarding",
    ],
    cons: [
      "No dedicated business/enterprise tier, admin controls, or compliance features",
      "Not designed for formal business use — perception and culture may not fit every organization",
      "No official calling/PSTN phone integration for business lines",
    ],

    popularityScore: 60,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://discord.com/nitro",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "zoom",
    name: "Zoom",
    // DRAFT - review before publish
    tagline: "The video conferencing platform that became the generic verb for meeting online.",
    logoUrl: "https://www.google.com/s2/favicons?domain=zoom.us&sz=128",
    website: "https://zoom.us",

    category: "communication-telecoms",
    subCategory: "video-conferencing",
    industries: ["agencies", "consulting", "ecommerce", "nonprofits", "healthcare", "real-estate"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data center regions and any region-based pricing differences.",
    useCases: ["video meetings", "webinars", "screen sharing", "meeting recording/transcription", "large-scale virtual events"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "HD video and audio meetings",
      "Screen sharing and virtual whiteboards",
      "AI Companion meeting summaries",
      "Webinar and large-event hosting (paid add-ons)",
      "Cloud recording and transcription",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want the most widely recognized, easiest-to-join video meeting experience — the free plan's 40-minute group-meeting cap is the single most common reason small teams upgrade, but exact current paid pricing needs direct confirmation before publishing.",
    bestFor: [
      "Teams and solo professionals who want the most universally recognized meeting link to send external clients",
      "Organizations needing webinar/large-event hosting beyond basic team meetings",
    ],
    avoidIf: [
      "Your team already lives in Microsoft 365 or Google Workspace and doesn't need a dedicated best-of-breed video tool",
      "You run frequent longer group calls and don't want to hit the 40-minute free-tier cap",
    ],
    pros: [
      "Free plan is genuinely usable for 1:1 calls of any length and short group meetings",
      "Broadest name recognition and cross-organization familiarity for external meetings",
      "Mature webinar and large-scale event hosting options beyond basic meetings",
    ],
    cons: [
      "Free tier's 40-minute cap on group meetings (3+ participants) forces an upgrade quickly for team use",
      "Paid tier pricing did not render reliably during verification — confirm current Pro/Business numbers before trusting them",
      "Webinar/large-event hosting is priced as a separate add-on, not included in base plans",
    ],

    popularityScore: 92,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.zoom.com/en/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "cisco-webex",
    name: "Cisco Webex",
    // DRAFT - review before publish
    tagline: "Enterprise-grade video conferencing and calling from Cisco, with a strong security/compliance pedigree.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.webex.com&sz=128",
    website: "https://www.webex.com",

    category: "communication-telecoms",
    subCategory: "video-conferencing",
    industries: ["consulting", "healthcare", "construction", "nonprofits"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options; Webex markets FedRAMP authorization for US government/regulated customers on higher tiers.",
    useCases: ["video meetings", "webinars", "enterprise calling", "meeting rooms/hardware integration", "regulated-industry video conferencing"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "HD video meetings with AI-powered noise removal",
      "Cloud and local meeting recording",
      "Enterprise calling integration",
      "FedRAMP-authorized security options",
      "Meeting room hardware/device integration",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for regulated or security-conscious organizations that want Cisco's enterprise networking pedigree behind their video platform — the free plan (0/user, 40-minute cap, 100 attendees) was confirmed, but mid-tier pricing needs direct confirmation before publishing.",
    bestFor: [
      "Regulated industries (government, healthcare, finance) wanting FedRAMP-grade security options",
      "Organizations already invested in Cisco networking/collaboration hardware",
    ],
    avoidIf: [
      "You want the simplest, most universally recognized meeting link for external clients (Zoom has broader name recognition)",
      "You're a small team without the compliance needs that justify Webex's enterprise positioning",
    ],
    pros: [
      "Strong security/compliance credentials, including FedRAMP authorization on relevant tiers",
      "Free tier confirmed genuinely free with no card required, 100 attendees per meeting",
      "Deep integration with Cisco meeting-room hardware and enterprise networking",
    ],
    cons: [
      "Mid-tier (Suite) pricing did not render reliably during verification — confirm before trusting any published number",
      "Less mainstream brand recognition among non-enterprise users than Zoom or Google Meet",
      "Enterprise tier is fully custom-quote, offering no self-serve price transparency",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://pricing.webex.com/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "goto-meeting",
    name: "GoTo Meeting",
    // DRAFT - review before publish
    tagline: "Established business video conferencing from the makers of GoToWebinar and GoToMyPC, aimed at mid-market teams.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.goto.com&sz=128",
    website: "https://www.goto.com/meeting",

    category: "communication-telecoms",
    subCategory: "video-conferencing",
    industries: ["consulting", "agencies", "real-estate", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability and any region-based pricing differences.",
    useCases: ["video meetings", "screen sharing", "meeting transcription", "webinars (via GoTo Webinar add-on)"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "HD video meetings with screen sharing",
      "AI-generated meeting transcripts and summaries",
      "Meeting recording with cloud storage",
      "Integration with GoTo Connect (phone) and GoTo Webinar",
      "Mobile meeting apps",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for mid-market teams that want a business-focused meeting tool bundled into the broader GoTo product family (webinars, phone) — vendor pricing pages were blocked to automated verification this pass, so exact current numbers need direct confirmation before publishing.",
    bestFor: [
      "Teams already using other GoTo products (GoTo Connect, GoTo Webinar) wanting one vendor relationship",
      "Mid-market organizations wanting a business-grade alternative to Zoom",
    ],
    avoidIf: [
      "You want the largest possible free tier — GoTo Meeting has no confirmed permanent free plan",
      "You want the most widely recognized external-meeting brand (Zoom/Meet have broader recognition)",
    ],
    pros: [
      "Bundles cleanly with GoTo's wider phone and webinar product line",
      "AI transcription/summary features built into standard meetings",
      "Established, mature product with long track record in business video conferencing",
    ],
    cons: [
      "Official pricing page blocked automated verification (403) this pass — current tier prices unconfirmed",
      "Less mainstream brand recognition among external meeting participants than Zoom",
      "Webinar functionality is a separate GoTo Webinar product/price, not bundled in",
    ],

    popularityScore: 45,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.goto.com/meeting/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "google-meet",
    name: "Google Meet",
    // DRAFT - review before publish
    tagline: "Video meetings bundled into Google Workspace — the default for teams already on Gmail, Docs, and Calendar.",
    logoUrl: "https://www.google.com/s2/favicons?domain=workspace.google.com&sz=128",
    website: "https://workspace.google.com/products/meet/",

    category: "communication-telecoms",
    subCategory: "video-conferencing",
    industries: ["agencies", "consulting", "ecommerce", "nonprofits", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Pricing verified from the vendor's EU-market page and is shown in EUR — US/other-region list pricing may differ; confirm local currency before publishing region-specific figures.",
    useCases: ["video meetings", "screen sharing", "meeting transcription/notes", "webinars (Enterprise tiers)"],
    pricingModel: "subscription",

    pricing: [
      { name: "Business Starter", priceMonthly: 6.8, priceAnnual: 6.12, currency: "EUR", keyLimits: ["Per user; 30 GB pooled storage, up to 100 Meet participants, max 300 users per org; annual rate is an introductory 10%-off rate for 12 months, then reverts to the monthly rate"] },
      { name: "Business Standard", priceMonthly: 13.6, priceAnnual: 12.24, currency: "EUR", keyLimits: ["Per user; 2 TB storage, up to 150 Meet participants, max 300 users per org"] },
      { name: "Business Plus", priceMonthly: 21.1, priceAnnual: null, currency: "EUR", keyLimits: ["Per user; 5 TB storage, up to 500 Meet participants, max 300 users per org"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "EUR", keyLimits: ["Custom quote; up to 5 TB+ storage, up to 1,000 Meet participants, unlimited users"] },
    ],
    hasFreeTier: false,
    freeTierReality: "There is no standalone permanent free Google Meet business tier — a Google account gets basic Meet access, but the business-grade features (larger participant caps, recording, admin controls) require a paid Google Workspace plan. Google offers a 14-day free trial rather than an ongoing free tier. All plans include unlimited meeting duration. Figures recorded here came from Google's EU-market pricing page (EUR) at time of verification — US and other-region list prices are typically similar in headline structure but a different currency/number; confirm local pricing before publishing a region-specific figure.",
    startingPrice: 6.8,
    currency: "EUR",

    keyFeatures: [
      "HD video meetings with unlimited duration on paid plans",
      "Meeting recording and AI-generated notes (higher tiers)",
      "Native integration with Gmail, Calendar, and Docs",
      "Noise cancellation and live captions",
      "Breakout rooms and polling",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams already on Google Workspace who want video meetings integrated directly into Gmail and Calendar rather than a separate standalone tool — there's no genuine free business tier, so evaluate against Zoom's free plan if budget is the primary driver.",
    bestFor: [
      "Teams already using Gmail, Google Calendar, and Docs day-to-day",
      "Organizations wanting one bundled subscription for email, storage, and video meetings",
    ],
    avoidIf: [
      "You want a genuine no-cost tier for occasional use — Meet's real capabilities require a paid Workspace plan",
      "You're not on Google Workspace and don't want to migrate email/calendar just for video meetings",
    ],
    pros: [
      "Seamless scheduling and joining directly from Gmail/Calendar",
      "Unlimited meeting duration on every paid tier, unlike some competitors' entry tiers",
      "Bundled with productivity apps (Docs, Sheets, Drive) rather than sold as a standalone line item",
    ],
    cons: [
      "No standalone permanent free tier with real business features — only a 14-day trial",
      "Pricing verified here is EUR/EU-market; US-dollar list pricing needs separate confirmation",
      "Full value requires buying into the broader Google Workspace suite, not just video calling",
    ],

    popularityScore: 84,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://workspace.google.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "whereby",
    name: "Whereby",
    // DRAFT - review before publish
    tagline: "Browser-based video meetings with no app download required — built for lightweight, embeddable meeting rooms.",
    logoUrl: "https://www.google.com/s2/favicons?domain=whereby.com&sz=128",
    website: "https://whereby.com",

    category: "communication-telecoms",
    subCategory: "video-conferencing",
    industries: ["freelancers", "consulting", "agencies", "healthcare"],
    businessSizes: ["solo", "small"],
    regions: ["global"],
    regionNotes: "VERIFY current regional availability and any region-based pricing differences.",
    useCases: ["no-download client video calls", "embeddable video rooms (via Whereby Embedded/API)", "one-off external meetings", "lightweight team video calls"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "No-download, browser-based meeting rooms",
      "Custom persistent meeting room links",
      "Embeddable video via Whereby Embedded API",
      "Screen sharing and recording",
      "Simple, low-friction join experience for external guests",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for solo professionals and small teams who want the lowest-friction way to send an external client a meeting link with no app install — pricing page failed to load during verification, so current tiers and free-tier limits need direct confirmation before publishing.",
    bestFor: [
      "Freelancers and consultants who send meeting links to non-technical external clients",
      "Teams wanting an embeddable video room inside their own product via the API",
    ],
    avoidIf: [
      "You need large-scale webinar or enterprise meeting features — Whereby is built for small, lightweight rooms",
      "You want the broadest possible name recognition for external meeting invites (Zoom/Meet are more universally known)",
    ],
    pros: [
      "Genuinely no-download, one-click join experience for guests",
      "Custom persistent room links are a nice touch for recurring external meetings",
      "Embeddable API option is distinctive versus most video-conferencing competitors",
    ],
    cons: [
      "Pricing page did not load during verification — confirm current plan names and prices before publishing",
      "Smaller participant caps than enterprise-focused competitors by reputation — confirm current limits",
      "Less brand recognition than Zoom/Meet for external invitees unfamiliar with the tool",
    ],

    popularityScore: 35,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://whereby.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "ringcentral",
    name: "RingCentral",
    // DRAFT - review before publish
    tagline: "Cloud business phone system (RingEX) bundling calling, team messaging, and video meetings into one platform.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.ringcentral.com&sz=128",
    website: "https://www.ringcentral.com",

    category: "communication-telecoms",
    subCategory: "business-phone-voip",
    industries: ["consulting", "healthcare", "real-estate", "construction", "retail"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current per-country calling coverage and international minute allowances.",
    useCases: ["cloud business phone system", "call queues/auto-attendant", "team messaging", "video meetings", "toll-free numbers"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Cloud PBX with auto-attendant and call queues",
      "Unlimited domestic calling on all plans (per vendor marketing)",
      "Team messaging and video meetings bundled in",
      "CRM integrations (HubSpot, Salesforce, Zendesk) on higher tiers",
      "AI-powered call summaries and receptionist add-ons",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for growing businesses that want phone, messaging, and video bundled under one vendor rather than stitching together separate tools — RingCentral's own pricing page returned only a usage calculator during verification (no static per-plan numbers), so exact current pricing needs direct confirmation before publishing.",
    bestFor: [
      "Growing businesses wanting a single vendor for calling, messaging, and video",
      "Teams needing CRM-integrated calling (HubSpot/Salesforce/Zendesk) without a separate dialer tool",
    ],
    avoidIf: [
      "You only need simple calling and don't want to pay for bundled messaging/video features you won't use",
      "You want fully transparent, self-serve pricing without an interactive calculator standing between you and the number",
    ],
    pros: [
      "One platform covering phone, team chat, and video rather than three separate subscriptions",
      "14-day free trial confirmed, supporting up to 20 phone lines to evaluate before buying",
      "Strong CRM-integration story on higher tiers",
    ],
    cons: [
      "Official pricing page requires an interactive calculator rather than showing static per-plan numbers — automated verification could not confirm exact current prices",
      "Add-on pricing (AI Receptionist, Conversational Intelligence, SMS boosters) is layered on top of base plans, complicating total cost",
      "Historically known for a somewhat complex, sales-driven quoting process versus simpler self-serve VoIP competitors",
    ],

    popularityScore: 70,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.ringcentral.com/office/plansandpricing.html",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "grasshopper",
    name: "Grasshopper",
    // DRAFT - review before publish
    tagline: "Lightweight virtual phone system for solo entrepreneurs and small teams — add a business line without new hardware.",
    logoUrl: "https://www.google.com/s2/favicons?domain=grasshopper.com&sz=128",
    website: "https://grasshopper.com",

    category: "communication-telecoms",
    subCategory: "business-phone-voip",
    industries: ["freelancers", "consulting", "real-estate", "construction"],
    businessSizes: ["solo", "small"],
    regions: ["north-america"],
    regionNotes: "Vendor's own pricing page states the service is only available in the USA and Canada; the page actively blocks access from other regions.",
    useCases: ["virtual business phone number", "call forwarding to personal phones", "voicemail transcription", "solo/small-team professional phone presence"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Virtual business phone number(s) that ring through to existing devices",
      "Custom greetings and auto-attendant",
      "Voicemail transcription",
      "Business texting",
      "No new hardware required — works over existing mobile/landline",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for solo entrepreneurs and very small teams who want a professional business number without new hardware — the vendor's pricing page geo-blocks access outside the US/Canada, so exact current tier pricing needs direct confirmation (a partial glimpse showed 'starting at $14/month') before publishing.",
    bestFor: [
      "Solo entrepreneurs wanting a separate business line on their existing personal phone",
      "Very small teams needing basic call routing without a full cloud-PBX system",
    ],
    avoidIf: [
      "You're outside the US/Canada — the service itself is region-restricted",
      "You need advanced call-center features like queues, CRM integration, or video meetings",
    ],
    pros: [
      "Simple, no-hardware setup for adding a business line",
      "Purpose-built for solo/small-business use rather than enterprise call centers",
      "Long-established brand specifically known for this use case",
    ],
    cons: [
      "Service and pricing page are both restricted to the US/Canada, confirmed directly by the vendor's own region-block message",
      "Exact current tier pricing could not be confirmed this pass beyond a partial 'starting at $14/month' glimpse",
      "Lacks video meetings and team-chat features bundled into more full-featured competitors",
    ],

    popularityScore: 42,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://grasshopper.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "openphone",
    name: "Quo (formerly OpenPhone)",
    // DRAFT - review before publish
    tagline: "Modern, app-based business phone system built for small teams — rebranded from OpenPhone to Quo in 2026.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.quo.com&sz=128",
    website: "https://www.quo.com",

    category: "communication-telecoms",
    subCategory: "business-phone-voip",
    industries: ["freelancers", "agencies", "consulting", "real-estate", "retail"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["north-america"],
    regionNotes: "Unlimited calling/messaging covers US and Canadian numbers; international destinations are billed separately per-minute/per-message.",
    useCases: ["business phone numbers per user", "shared team phone lines", "AI call summaries", "business texting", "CRM-integrated calling"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter", priceMonthly: 19, priceAnnual: 15, currency: "USD", keyLimits: ["Per user; one new/ported local or toll-free number per user, unlimited US/Canada calling and messaging, voicemail transcripts, 1,000 automation credits"] },
      { name: "Business", priceMonthly: 33, priceAnnual: 23, currency: "USD", keyLimits: ["Per user; adds AI call summaries, group calling, call transfers, HubSpot/Salesforce integrations, auto call recording"] },
      { name: "Scale", priceMonthly: 47, priceAnnual: 35, currency: "USD", keyLimits: ["Per user; adds AI call tags, dedicated onboarding, priority and inbound phone support"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier — a 7-day free trial is offered instead. Calling/messaging to US and Canadian numbers is unlimited on every paid plan (subject to a fair-use policy); international calling/messaging is billed separately per-minute/per-message. Additional phone numbers cost $5/month each beyond the one included per user.",
    startingPrice: 19,
    currency: "USD",

    keyFeatures: [
      "Dedicated business phone numbers per user or shared team lines",
      "AI-generated call summaries and transcripts",
      "Business texting (SMS/MMS)",
      "Native HubSpot/Salesforce integrations",
      "Shared inbox for team phone numbers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small, modern teams that want a phone system that feels like a messaging app rather than a legacy PBX — the brand rebrand to Quo mid-2026 means older reviews/guides still reference 'OpenPhone,' worth noting to avoid confusing readers.",
    bestFor: [
      "Small teams and solo professionals wanting a modern, app-first business phone number",
      "Sales/support teams wanting native HubSpot or Salesforce call logging without extra middleware",
    ],
    avoidIf: [
      "You need a large-scale call center with advanced routing/IVR beyond small-team needs",
      "You're confused by or want to avoid the recent OpenPhone-to-Quo rebrand — confirm current product name in your market",
    ],
    pros: [
      "Genuinely modern, easy-to-use interface compared to legacy business phone systems",
      "Unlimited US/Canada calling and messaging included on every paid tier",
      "Native CRM integrations included starting on the Business tier, not gated to Enterprise",
    ],
    cons: [
      "No permanent free tier — only a 7-day trial",
      "Mid-2026 rebrand from OpenPhone to Quo may confuse users following older reviews/links",
      "International calling is priced separately per-minute rather than bundled",
    ],

    popularityScore: 66,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.quo.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "nextiva",
    name: "Nextiva",
    // DRAFT - review before publish
    tagline: "Unified business communications — voice, video, SMS, and digital channels — aimed at growing small-to-mid businesses.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.nextiva.com&sz=128",
    website: "https://www.nextiva.com",

    category: "communication-telecoms",
    subCategory: "business-phone-voip",
    industries: ["consulting", "retail", "healthcare", "real-estate"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["north-america"],
    regionNotes: "VERIFY current international calling coverage and per-country rates.",
    useCases: ["business phone system", "video meetings", "business SMS", "contact center (higher tiers)", "unified communications"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Cloud business phone with unified voice/video/SMS",
      "Team chat built into the same platform",
      "Inbound contact-center features on higher tiers",
      "AI-powered call transcription and reporting",
      "Toll-free numbers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for growing businesses wanting voice, video, and SMS unified under one platform with a path up into contact-center features — the vendor's own pricing page showed monthly and annual figures in a way that was internally inconsistent (the plan framed as '35% savings' displayed a higher number than the other), so exact current prices need direct human confirmation before publishing.",
    bestFor: [
      "Growing small-to-mid businesses wanting unified voice/video/SMS without separate point tools",
      "Teams that expect to need inbound contact-center features as they scale",
    ],
    avoidIf: [
      "You just need simple calling and don't want to pay for bundled contact-center-adjacent features",
      "You want fully transparent, unambiguous pricing without needing a sales call to clarify billing terms",
    ],
    pros: [
      "Unifies voice, video, SMS, and team chat under one platform rather than separate subscriptions",
      "Clear growth path from small-business Core plan up to full contact-center tiers",
      "No-credit-card-required demo path for evaluation",
    ],
    cons: [
      "Vendor's pricing page presented monthly vs. annual figures in a confusing, seemingly self-contradictory way during verification — treat any third-party-quoted number with caution until reconfirmed directly",
      "Higher/contact-center tiers are quote-only with no self-serve pricing transparency",
      "Toll-free minute allowances vary by plan and need to be checked against actual usage needs",
    ],

    popularityScore: 55,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.nextiva.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "dialpad",
    name: "Dialpad",
    // DRAFT - review before publish
    tagline: "AI-forward business phone and calling platform with built-in real-time transcription and call coaching.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.dialpad.com&sz=128",
    website: "https://www.dialpad.com",

    category: "communication-telecoms",
    subCategory: "business-phone-voip",
    industries: ["consulting", "agencies", "retail"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current international calling coverage and per-country rates.",
    useCases: ["business phone system", "AI call transcription", "sales/support call coaching", "video meetings", "business SMS"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "AI-powered real-time call transcription",
      "Business phone, video meetings, and messaging in one app",
      "Call/sentiment coaching for sales and support teams",
      "Voice Intelligence (Vi) automated note-taking",
      "Integrations with major CRMs on higher tiers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for sales and support teams that want AI transcription and coaching baked directly into every call rather than bolted on separately — the vendor's pricing page blocked automated verification this pass, so exact current per-user pricing needs direct confirmation before publishing.",
    bestFor: [
      "Sales and support teams wanting built-in AI call transcription and coaching",
      "Teams wanting phone, video, and messaging in a single AI-native app",
    ],
    avoidIf: [
      "You don't need AI transcription/coaching and just want the lowest-cost basic calling line",
      "You want simple, single-number flat pricing without a minimum-seat requirement on higher tiers",
    ],
    pros: [
      "AI transcription and call coaching are core, built-in features rather than a pricey add-on",
      "Combines phone, video, and messaging in one modern app",
      "Well regarded for sales-team-specific coaching/analytics use cases",
    ],
    cons: [
      "Official pricing page returned a 403 during automated verification — current tier prices unconfirmed",
      "Some tiers reportedly carry minimum seat counts and separate per-user regulatory/admin fees — confirm before budgeting",
      "AI features that are the product's main differentiator may be gated to higher tiers",
    ],

    popularityScore: 58,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.dialpad.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "vonage-business",
    name: "Vonage Business Communications",
    // DRAFT - review before publish
    tagline: "Cloud business phone system from the long-established Vonage brand, with unified messaging and video add-ons.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.vonage.com&sz=128",
    website: "https://www.vonage.com/business/",

    category: "communication-telecoms",
    subCategory: "business-phone-voip",
    industries: ["consulting", "retail", "healthcare", "real-estate"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current international calling coverage and per-country rates.",
    useCases: ["business phone system", "team messaging", "video meetings (add-on)", "call center features (higher tiers)"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Cloud PBX business phone lines",
      "Team messaging",
      "Video meetings (via add-on/bundle)",
      "Call recording and analytics on higher tiers",
      "APIs for programmable voice/SMS (via Vonage's separate API platform)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for businesses wanting a long-established telecoms brand behind their phone system, especially those who might also want Vonage's programmable communications APIs down the line — the pricing page blocked automated verification on every attempt this pass, so exact current numbers need direct confirmation before publishing.",
    bestFor: [
      "Businesses wanting an established, long-running telecoms provider rather than a newer VoIP startup",
      "Organizations that may also want Vonage's separate programmable Voice/SMS API platform",
    ],
    avoidIf: [
      "You want the simplest possible self-serve sign-up without needing to work around blocked pricing pages",
      "You need the most modern, app-first user experience — Vonage's UI is generally considered more dated than newer competitors",
    ],
    pros: [
      "Long-established brand with deep telecoms infrastructure experience",
      "Bundles cleanly with Vonage's separate communications API platform for businesses that need both",
      "Broad feature set spanning basic calling up to call-center functionality",
    ],
    cons: [
      "Pricing page returned a 403 on every automated verification attempt this pass — current numbers entirely unconfirmed",
      "User interface and onboarding experience are generally seen as less modern than newer VoIP entrants",
      "Video meetings are reportedly a separate add-on/bundle rather than included outright — confirm before assuming parity with competitors",
    ],

    popularityScore: 50,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.vonage.com/business/plans-pricing/unified-communications/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "8x8",
    name: "8x8",
    // DRAFT - review before publish
    tagline: "Unified voice, video, chat, and contact center platform aimed at mid-market and enterprise business communications.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.8x8.com&sz=128",
    website: "https://www.8x8.com",

    category: "communication-telecoms",
    subCategory: "business-phone-voip",
    industries: ["consulting", "healthcare", "retail", "construction"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "8x8 markets unlimited calling to a large number of countries on its higher tiers — VERIFY the current country list before publishing as fact.",
    useCases: ["business phone system", "video meetings", "team chat", "contact center", "international calling"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Unified voice, video, and team chat platform",
      "International calling to a large list of countries on higher tiers",
      "Contact center capabilities (separate product line)",
      "Analytics and call-quality monitoring",
      "Compliance features for regulated industries",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for mid-market and international businesses wanting broad unlimited-calling coverage across many countries bundled with video and chat — the vendor's pricing page was rate-limited on every attempt this pass, so exact current tier pricing needs direct confirmation before publishing.",
    bestFor: [
      "Businesses with international offices wanting broad unlimited-calling country coverage",
      "Mid-market organizations wanting voice, video, chat, and contact center from one vendor",
    ],
    avoidIf: [
      "You're a very small team that doesn't need international calling breadth or contact-center features",
      "You want the lowest possible entry price — 8x8 is generally positioned as mid-market/enterprise",
    ],
    pros: [
      "Reputation for genuinely broad unlimited international calling coverage on higher tiers",
      "Single platform spans phone, video, chat, and contact center rather than separate products",
      "Established enterprise/compliance track record",
    ],
    cons: [
      "Pricing page was rate-limited (429) on every automated verification attempt this pass — current numbers entirely unconfirmed",
      "Positioned more toward mid-market/enterprise than solo/small-business budgets by reputation",
      "Full contact-center capability is a separate, presumably more expensive product line",
    ],

    popularityScore: 52,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://www.8x8.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "ooma-office",
    name: "Ooma Office",
    // DRAFT - review before publish
    tagline: "Small-business VoIP phone system with no long-term contracts and simple flat per-user pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.ooma.com&sz=128",
    website: "https://www.ooma.com",

    category: "communication-telecoms",
    subCategory: "business-phone-voip",
    industries: ["retail", "construction", "real-estate", "hospitality", "consulting"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["north-america"],
    regionNotes: "Unlimited calling covers the US, Canada, Mexico, and Puerto Rico; other international destinations are billed separately.",
    useCases: ["small-business phone system", "virtual receptionist", "business texting", "basic video conferencing (Pro Plus)", "digital fax"],
    pricingModel: "subscription",

    pricing: [
      { name: "Essentials", priceMonthly: 19.95, priceAnnual: null, currency: "USD", keyLimits: ["Per user, month-to-month, no annual pricing offered; virtual receptionist, digital fax, unlimited US/Canada/Mexico/Puerto Rico calling, free toll-free number"] },
      { name: "Pro", priceMonthly: 24.95, priceAnnual: null, currency: "USD", keyLimits: ["Per user; adds desktop app, 250 texts/mo, video conferencing for up to 25 participants"] },
      { name: "Pro Plus", priceMonthly: 29.95, priceAnnual: null, currency: "USD", keyLimits: ["Per user; adds AI transcriptions, AI insights, CRM integration, team chat"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — Ooma Office is paid from the first line, with no long-term contract required on any tier. All plans include unlimited calling within the US, Canada, Mexico, and Puerto Rico plus a free toll-free number; a free number-transfer offer is available when switching from another provider.",
    startingPrice: 19.95,
    currency: "USD",

    keyFeatures: [
      "Virtual receptionist / auto-attendant",
      "Unlimited calling across US, Canada, Mexico, and Puerto Rico",
      "Digital fax included on every tier",
      "Basic video conferencing on Pro/Pro Plus (up to 25 participants)",
      "No long-term contract requirement",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small businesses wanting straightforward, contract-free VoIP phone service without needing an enterprise-grade unified-comms platform — video conferencing tops out at 25 participants, so it's not a Zoom/Meet replacement for larger meetings.",
    bestFor: [
      "Small businesses wanting simple, contract-free VoIP with predictable flat per-user pricing",
      "Teams that want digital fax included without a separate line item",
    ],
    avoidIf: [
      "You need video meetings beyond 25 participants — that's a hard cap even on the top tier",
      "You need broad international calling — coverage is limited to the US/Canada/Mexico/Puerto Rico by default",
    ],
    pros: [
      "No long-term contract on any tier, unusual for business phone systems",
      "Flat, transparent per-user pricing with no annual-commitment pricing games",
      "Digital fax and a free toll-free number included even on the entry tier",
    ],
    cons: [
      "No annual/discounted billing option was found — pricing is month-to-month only across all tiers",
      "Video conferencing caps at 25 participants even on the top tier, well below dedicated video tools",
      "International calling beyond North America is not included and billed separately",
    ],

    popularityScore: 44,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.ooma.com/business/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "aircall",
    name: "Aircall",
    // DRAFT - review before publish
    tagline: "Cloud call center and business phone system built to plug directly into CRMs and helpdesk tools.",
    logoUrl: "https://www.google.com/s2/favicons?domain=aircall.io&sz=128",
    website: "https://aircall.io",

    category: "communication-telecoms",
    subCategory: "business-phone-voip",
    industries: ["consulting", "agencies", "retail", "real-estate"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current international number availability and per-country calling rates.",
    useCases: ["sales dialer / call center", "CRM-integrated calling", "support call routing", "call recording and analytics", "AI voice agent (add-on)"],
    pricingModel: "subscription",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: false,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Cloud call center with CRM/helpdesk integrations (Salesforce, HubSpot, Zendesk, etc.)",
      "Call recording, monitoring, and analytics",
      "AI Voice Agent add-on with monthly minute allowances",
      "Team and queue-based call routing",
      "Click-to-dial from integrated apps",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for sales and support teams whose main requirement is deep CRM/helpdesk integration around calling — the vendor's pricing page renders exact tier prices dynamically via JavaScript, so no static per-user number could be confirmed this pass; both confirmed tiers require a 3-seat minimum.",
    bestFor: [
      "Sales and support teams wanting calling deeply integrated with an existing CRM or helpdesk",
      "Teams evaluating AI voice agent add-ons alongside human-staffed calling",
    ],
    avoidIf: [
      "You're a solo user or very small team — both named tiers carry a 3-license minimum",
      "You want simple, single-user pricing without a per-account seat minimum",
    ],
    pros: [
      "Strong reputation for CRM/helpdesk integration depth around the calling workflow",
      "AI Voice Agent minutes included by default (50/mo) with paid top-ups available",
      "Clear tier structure (Essentials/Professional/Custom) even though exact prices weren't statically confirmable",
    ],
    cons: [
      "Pricing is rendered dynamically by JavaScript and could not be confirmed as static numbers this pass",
      "Both named tiers require a minimum of 3 user licenses, ruling out true solo use",
      "Higher-volume/enterprise tier is fully custom-quote with a 25-license minimum",
    ],

    popularityScore: 48,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://aircall.io/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "justcall",
    name: "JustCall",
    // DRAFT - review before publish
    tagline: "AI-powered business calling and SMS platform built for sales teams, with per-user outbound minute allowances.",
    logoUrl: "https://www.google.com/s2/favicons?domain=justcall.io&sz=128",
    website: "https://justcall.io",

    category: "communication-telecoms",
    subCategory: "business-phone-voip",
    industries: ["consulting", "agencies", "retail", "real-estate"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current international number availability and per-country calling rates.",
    useCases: ["sales dialer", "business SMS", "AI voice agent", "call/SMS analytics", "CRM-integrated calling"],
    pricingModel: "subscription",

    pricing: [
      { name: "Team", priceMonthly: 29, priceAnnual: 29, currency: "USD", keyLimits: ["Per user, minimum 2 licenses; 1,000 outbound minutes/user/mo, 500 SMS segments/user/mo; annual billing advertised at up to 29% off monthly, exact discounted rate not separately itemized"] },
      { name: "Pro", priceMonthly: 49, priceAnnual: 49, currency: "USD", keyLimits: ["Per user, minimum 2 licenses; 1,000 outbound minutes/user/mo, 1,000 SMS segments/user/mo"] },
      { name: "Pro Plus", priceMonthly: 89, priceAnnual: 89, currency: "USD", keyLimits: ["Per user, minimum 2 licenses; 1,000 outbound minutes/user/mo, 1,000 SMS segments/user/mo, adds higher-tier AI features"] },
      { name: "Business", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote, minimum 10 licenses; unlimited calling and SMS"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — a 14-day free trial with full platform access is offered instead. All named self-serve tiers (Team/Pro/Pro Plus) require a minimum of 2 user licenses, so true single-user pricing isn't available. The vendor's page advertised 'up to 29% off' for annual billing without breaking out the exact discounted per-tier number, so priceAnnual is recorded here equal to the listed monthly figure pending that exact discount confirmation — do not assume no annual discount exists.",
    startingPrice: 29,
    currency: "USD",

    keyFeatures: [
      "Outbound/inbound calling with per-user minute allowances",
      "Business SMS with per-user segment allowances",
      "AI Voice Agent add-on (pay-as-you-go or bundled minutes)",
      "CRM and helpdesk integrations",
      "Call/SMS analytics and coaching insights",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for small sales teams that want calling and SMS bundled with AI features under one predictable per-user allowance — the 2-seat minimum on every self-serve tier rules out true solo use, and the exact annual-billing discount wasn't itemized on the vendor's page.",
    bestFor: [
      "Small sales teams wanting outbound calling and SMS with clear per-user minute/segment allowances",
      "Teams wanting AI voice agent capability without switching to a separate specialized vendor",
    ],
    avoidIf: [
      "You're a true solo user — every self-serve tier requires a 2-license minimum",
      "You need unlimited calling/SMS on a self-serve (non-custom-quote) plan — that's Business-tier-only and quote-gated",
    ],
    pros: [
      "Clear, itemized outbound minute and SMS segment allowances per tier rather than vague 'unlimited with fair use'",
      "AI Voice Agent add-on pricing is transparently tiered (PAYG, Agent Lite, Agent Max)",
      "14-day free trial with full platform access confirmed directly",
    ],
    cons: [
      "2-license minimum on every named tier rules out genuine single-user pricing",
      "Exact annual-billing discount percentage per tier wasn't itemized on the pricing page — only an 'up to 29% off' headline figure",
      "Business (unlimited) tier is fully custom-quote with a 10-license minimum",
    ],

    popularityScore: 47,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://justcall.io/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "cloudtalk",
    name: "CloudTalk",
    // DRAFT - review before publish
    tagline: "Cloud call center software for sales and support teams, with tiered included-minute allowances per plan.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.cloudtalk.io&sz=128",
    website: "https://www.cloudtalk.io",

    category: "communication-telecoms",
    subCategory: "business-phone-voip",
    industries: ["consulting", "agencies", "retail", "ecommerce"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["europe"],
    regionNotes: "Pricing verified from the vendor's EUR-priced pricing page; confirm whether a separate USD price list applies for North American customers before publishing region-specific figures.",
    useCases: ["sales/support call center", "AI receptionist and voice agents", "call routing and IVR", "call analytics", "CRM-integrated dialing"],
    pricingModel: "subscription",

    pricing: [
      { name: "Lite", priceMonthly: 27, priceAnnual: 19, currency: "EUR", keyLimits: ["Per user, minimum 1 license; ~250 international minutes/mo (varies by region)"] },
      { name: "Starter", priceMonthly: 34, priceAnnual: 25, currency: "EUR", keyLimits: ["Per user, minimum 1 license; ~500 domestic minutes/mo"] },
      { name: "Essential", priceMonthly: 39, priceAnnual: 29, currency: "EUR", keyLimits: ["Per user, minimum 1 license; ~1,000 domestic minutes/mo"] },
      { name: "Expert", priceMonthly: 69, priceAnnual: 49, currency: "EUR", keyLimits: ["Per user, minimum 3 licenses; unlimited calling in select regions"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier — a 14-day free trial is offered instead. Included calling minutes scale by plan (roughly 250-1,000/mo depending on tier and region) rather than being unlimited until the top Expert tier, which offers unlimited calling only in select regions. AI Receptionist and AI Specialist voice-agent features are separate add-ons starting around €99/mo and €349/mo respectively. Figures recorded here are from the vendor's EUR pricing page — confirm whether North American customers see a separate USD list before publishing region-specific figures.",
    startingPrice: 27,
    currency: "EUR",

    keyFeatures: [
      "Cloud call center with IVR and skills-based routing",
      "AI Receptionist and AI Specialist voice agents (add-ons)",
      "Call recording and analytics dashboards",
      "CRM integrations (Salesforce, HubSpot, Pipedrive, etc.)",
      "Multi-region local number provisioning",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for sales/support teams outside the US wanting a European-headquartered call-center platform with tiered minute allowances and AI voice-agent add-ons — pricing verified here is EUR; confirm a separate USD list exists before recommending to US-based buyers on price alone.",
    bestFor: [
      "European sales/support teams wanting a call-center platform priced and supported in EUR",
      "Teams wanting AI voice-agent add-ons (receptionist/specialist) alongside human-staffed calling",
    ],
    avoidIf: [
      "You're US-based and need confirmed USD pricing before committing — this pass only confirmed the EUR price list",
      "You need truly unlimited calling below the top (Expert) tier",
    ],
    pros: [
      "Included-minute allowances are itemized per tier rather than a single blanket 'unlimited' claim",
      "AI Receptionist/Specialist voice-agent add-ons are transparently priced with clear included-minute tiers",
      "Broad CRM integration catalog for sales-team workflows",
    ],
    cons: [
      "Pricing confirmed here is EUR-denominated — US/other-region pricing needs separate confirmation",
      "Unlimited calling is only available in 'select regions' on the top Expert tier, not universally",
      "Expert tier carries a 3-license minimum, ruling out solo use at that feature level",
    ],

    popularityScore: 40,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.cloudtalk.io/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "google-voice",
    name: "Google Voice",
    // DRAFT - review before publish
    tagline: "Simple, Google Workspace-integrated business phone numbers with straightforward per-user pricing tiers.",
    logoUrl: "https://www.google.com/s2/favicons?domain=workspace.google.com&sz=128",
    website: "https://workspace.google.com/products/voice/",

    category: "communication-telecoms",
    subCategory: "business-phone-voip",
    industries: ["freelancers", "consulting", "agencies", "real-estate"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["north-america", "global"],
    regionNotes: "Starter tier is available in the US (up to 10 users) or across 14 countries; Standard/Premier support unlimited regional billing locations — confirm the current full country list before publishing as exhaustive.",
    useCases: ["business phone number", "call recording/transcription", "auto attendant and ring groups", "Google Workspace-integrated calling", "eDiscovery for calls/texts (higher tiers)"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter", priceMonthly: 10, priceAnnual: null, currency: "USD", keyLimits: ["Per user; single phone number across devices, unlimited domestic calling and US texting, voicemail transcription; available in the US (up to 10 users) or 14 countries"] },
      { name: "Standard", priceMonthly: 20, priceAnnual: null, currency: "USD", keyLimits: ["Per user; unlimited users and regional billing locations, on-demand call recording, call queuing/ring groups, auto attendants"] },
      { name: "Premier", priceMonthly: 30, priceAnnual: null, currency: "USD", keyLimits: ["Per user; unlimited international billing locations, automatic call recording, advanced reporting via BigQuery"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free business tier — Google Voice's consumer/personal product (a single free number for individuals) is separate from this business product, which is paid from the first user across all three tiers. No annual-discount pricing was shown on the vendor's page; figures reflect standard monthly per-user rates.",
    startingPrice: 10,
    currency: "USD",

    keyFeatures: [
      "Single business phone number that follows the user across devices",
      "Voicemail transcription",
      "Auto attendant and ring-group call routing (Standard+)",
      "Native integration with Google Calendar and Gmail",
      "eDiscovery and BigQuery reporting on higher tiers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams already on Google Workspace wanting a simple, low-cost business number without a full call-center platform — it lacks the video-meeting and team-chat bundling that Microsoft Teams Phone or RingCentral offer at similar price points.",
    bestFor: [
      "Small teams and solo professionals already using Gmail/Google Calendar day-to-day",
      "Organizations wanting simple, flat per-user phone pricing without a call-center feature set",
    ],
    avoidIf: [
      "You want video meetings and team chat bundled into the same subscription — Voice is calling-only",
      "You need automatic call recording or advanced reporting below the $30/user Premier tier",
    ],
    pros: [
      "Clear, simple three-tier structure with transparent per-user monthly pricing",
      "Deep native integration with Gmail and Google Calendar for teams already on Workspace",
      "Starter tier at $10/user/mo is one of the more affordable confirmed entry points in this category",
    ],
    cons: [
      "No annual-discount pricing found — appears to be month-to-month only per the vendor's own page",
      "Automatic call recording requires the top Premier tier; Standard is on-demand only",
      "No bundled video meetings or team chat — purely a calling product, unlike several competitors",
    ],

    popularityScore: 53,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://workspace.google.com/products/voice/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
];
