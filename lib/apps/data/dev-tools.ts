import type { AppListing } from "../types";

// Scaffolded via Prompt 2 — 20 well-known Developer Tools spanning cloud
// hosting, CI/CD & source control, monitoring/observability, no-code
// automation, and dev security/identity.
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

export const DEV_TOOLS_APPS: AppListing[] = [
  {
    id: "vercel",
    name: "Vercel",
    // DRAFT - review before publish
    tagline: "The default host for Next.js and modern frontend frameworks — deploy on git push.",
    logoUrl: "https://www.google.com/s2/favicons?domain=vercel.com&sz=128",
    website: "https://vercel.com",

    category: "dev-tools",
    subCategory: "hosting-infrastructure",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Global edge network with points of presence worldwide — no regional restrictions on sign-up or hosting.",
    useCases: ["deploy websites", "host frontend apps", "preview deployments per pull request", "serverless/edge functions", "static site hosting"],
    pricingModel: "freemium",

    pricing: [
      { name: "Hobby", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["1 developer seat, 1M edge requests/mo, 100 GB fast data transfer/mo, 1M function invocations/mo, 4 hrs active CPU/mo, no team collaboration"] },
      { name: "Pro", priceMonthly: 20, priceAnnual: null, currency: "USD", keyLimits: ["Per seat + $20/mo usage credit; 10M edge requests/mo then $2/1M; 1 TB data transfer/mo then $0.15/GB; unlimited viewer seats"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — 99.99% uptime SLA, SCIM, multi-region compute failover, custom usage limits"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Hobby is free forever for personal/non-commercial projects with real (if strict) caps: 1 seat, 1M edge requests/mo, 100 GB transfer/mo. There's no real team collaboration on Hobby — you need Pro ($20/seat/mo plus usage overages) the moment more than one person needs to work on a project commercially.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Git-push deployments with automatic CI/CD",
      "Preview deployments for every pull request",
      "Global edge network / CDN with DDoS mitigation",
      "Serverless and edge functions",
      "Built-in Web Application Firewall",
      "First-class Next.js integration",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams shipping frontend-heavy apps (especially Next.js) who want zero-config deploys and fast previews — usage-based overages on Pro can surprise teams with spiky traffic.",
    bestFor: [
      "Frontend teams and agencies deploying Next.js/React/Vue sites",
      "Solo developers who want free, fast hosting for side projects",
    ],
    avoidIf: [
      "You need a general-purpose backend/VM host, not primarily frontend/edge hosting",
      "Your traffic is spiky and you want fully predictable flat billing",
    ],
    pros: [
      "Extremely fast, low-friction deploy workflow tied to git",
      "Best-in-class preview deployments for reviewing changes",
      "Deep, first-party integration with Next.js",
    ],
    cons: [
      "Usage-based overage billing on Pro can be hard to predict at scale",
      "Hobby plan explicitly disallows commercial use in its terms — VERIFY current wording",
      "Bandwidth/function costs can run higher than raw IaaS at large scale",
    ],

    popularityScore: 90,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://vercel.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "netlify",
    name: "Netlify",
    // DRAFT - review before publish
    tagline: "Git-based deployment and hosting for static sites and JAMstack apps, credit-metered.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.netlify.com&sz=128",
    website: "https://www.netlify.com",

    category: "dev-tools",
    subCategory: "hosting-infrastructure",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Global CDN and build infrastructure — no regional sign-up restrictions.",
    useCases: ["deploy websites", "host static sites", "preview deployments", "serverless functions", "form handling"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["300 credits/mo (production deploys cost 15 credits each, bandwidth ~20 credits/GB); unlimited deploy previews"] },
      { name: "Personal", priceMonthly: 9, priceAnnual: null, currency: "USD", keyLimits: ["1,000 credits/mo; adds secret detection, 1-day observability, priority email support"] },
      { name: "Pro", priceMonthly: 20, priceAnnual: null, currency: "USD", keyLimits: ["3,000 credits/mo, unlimited team members, private repos, 3+ concurrent builds, 30-day analytics"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom quote — unlimited credits, 99.99% SLA, SSO/SCIM, 24/7 support"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan runs on a 300-credit/month allowance rather than fixed feature caps — deploys, bandwidth, and functions all draw down the same credit pool, so real capacity depends heavily on usage mix.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Git-based CI/CD deploys",
      "Deploy previews for every branch/PR",
      "Serverless functions",
      "Built-in forms and identity/auth",
      "Global CDN",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams hosting static sites, JAMstack apps, or Next.js/Astro projects who want a mature, git-driven workflow — the credit system takes some getting used to versus flat per-resource limits.",
    bestFor: [
      "Agencies and freelancers hosting client static sites and marketing pages",
      "Teams already comfortable with the JAMstack/git-deploy model",
    ],
    avoidIf: [
      "You want simple flat limits instead of a shared credit pool across deploys/bandwidth/functions",
      "You need heavy backend/database hosting, not primarily frontend delivery",
    ],
    pros: [
      "Mature, well-documented git-deploy workflow",
      "Strong free tier for low-traffic sites",
      "Built-in forms and identity add real value beyond raw hosting",
    ],
    cons: [
      "Credit-based free/paid tiers make usage harder to predict than flat limits",
      "Function cold starts and build minutes can push costs up quickly at scale",
      "Less first-party framework depth than Vercel for Next.js specifically",
    ],

    popularityScore: 82,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.netlify.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    // DRAFT - review before publish
    tagline: "Straightforward cloud VMs (Droplets), managed databases, and Kubernetes with simple, predictable pricing.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.digitalocean.com&sz=128",
    website: "https://www.digitalocean.com",

    category: "dev-tools",
    subCategory: "hosting-infrastructure",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Data centers across North America, Europe, Asia, and beyond — no sign-up region restrictions.",
    useCases: ["host virtual servers", "run containers/Kubernetes", "managed databases", "app platform deploys", "object storage"],
    pricingModel: "freemium",

    pricing: [
      { name: "Basic Droplet (entry)", priceMonthly: 4, priceAnnual: null, currency: "USD", keyLimits: ["512 MiB RAM, 1 vCPU, 500 GiB transfer/mo; billed per-second with a 60-second/$0.01 minimum"] },
      { name: "General Purpose Droplet (mid)", priceMonthly: 48, priceAnnual: null, currency: "USD", keyLimits: ["8 GiB RAM, 4 vCPUs, 5,000 GiB transfer/mo"] },
      { name: "Managed Kubernetes (control plane)", priceMonthly: 12, priceAnnual: null, currency: "USD", keyLimits: ["Per cluster; worker-node Droplets billed separately on top"] },
    ],
    hasFreeTier: true,
    freeTierReality: "No free Droplets, but App Platform includes a permanent $0/mo static-site tier, and new accounts historically get a limited-time free credit (confirm current offer amount/duration). Pricing overall is fully usage-based across dozens of separate products (Droplets, Kubernetes, Spaces, Managed Databases, App Platform, Functions) rather than one flat plan ladder.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Simple, transparent per-resource pricing",
      "Droplets (VMs) with per-second billing",
      "Managed Kubernetes, databases, and load balancers",
      "App Platform for git-based deploys",
      "Straightforward docs and community tutorials",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for developers and small teams who want real infrastructure control (VMs, Kubernetes) without AWS/GCP-level pricing complexity — you'll do more ops yourself than on a fully managed PaaS.",
    bestFor: [
      "Developers who want VM/container-level control at predictable, published prices",
      "Small teams that outgrew a PaaS but don't want AWS's complexity",
    ],
    avoidIf: [
      "You want a fully managed, zero-ops platform (App Platform exists but the brand is best known for raw infrastructure)",
      "You need the breadth of managed services AWS/GCP/Azure offer",
    ],
    pros: [
      "Published, easy-to-understand pricing versus hyperscaler complexity",
      "Strong documentation and community tutorials for self-managed infra",
      "Covers VMs, Kubernetes, databases, and storage under one account",
    ],
    cons: [
      "Still requires real ops/sysadmin knowledge for Droplets — not a hands-off PaaS",
      "Fewer managed-service options than AWS/GCP/Azure at the high end",
      "Support responsiveness varies by plan — VERIFY current SLAs",
    ],

    popularityScore: 78,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.digitalocean.com/pricing/droplets",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "render",
    name: "Render",
    // DRAFT - review before publish
    tagline: "Managed hosting for web services, static sites, and databases positioned as a simpler Heroku alternative.",
    logoUrl: "https://www.google.com/s2/favicons?domain=render.com&sz=128",
    website: "https://render.com",

    category: "dev-tools",
    subCategory: "hosting-infrastructure",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current data center regions and any region-based pricing differences.",
    useCases: ["deploy web services", "host static sites", "managed databases", "background workers", "cron jobs"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Git-based deploys for web services and static sites",
      "Managed PostgreSQL and Redis",
      "Background workers and cron jobs",
      "Private networking between services",
      "Autoscaling on paid tiers",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for small teams who want Heroku-style simplicity for full-stack apps (web service + database + workers) without managing raw VMs — pricing details need direct confirmation before publishing.",
    bestFor: [
      "Small teams wanting a simple, git-driven full-stack host (app + DB + workers)",
      "Developers who found Heroku's pricing/deprecation frustrating and want a similar workflow",
    ],
    avoidIf: [
      "You need the lowest possible always-on compute pricing — free/entry tiers tend to sleep on inactivity",
      "You need deep infrastructure control beyond what a managed PaaS exposes",
    ],
    pros: [
      "Simple, Heroku-like developer experience for full-stack apps",
      "Free tier exists for evaluating web services, databases, and static sites",
      "Built-in private networking and cron jobs without extra tooling",
    ],
    cons: [
      "Free/entry-tier services reportedly spin down after inactivity, adding cold-start latency",
      "Smaller ecosystem/marketplace than AWS or even DigitalOcean",
      "Pricing page did not render reliably during verification — confirm current tiers before trusting numbers",
    ],

    popularityScore: 68,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://render.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["cron-expression-builder"],
  },
  {
    id: "railway",
    name: "Railway",
    // DRAFT - review before publish
    tagline: "Deploy-anything cloud platform with usage-based pricing on top of a small monthly base fee.",
    logoUrl: "https://www.google.com/s2/favicons?domain=railway.com&sz=128",
    website: "https://railway.com",

    category: "dev-tools",
    subCategory: "hosting-infrastructure",
    industries: ["agencies", "consulting", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current data center regions available.",
    useCases: ["deploy web apps", "host databases", "background workers", "monorepo deploys", "preview environments"],
    pricingModel: "subscription",

    pricing: [
      { name: "Trial", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["One-time $5 usage credit, no credit card required — evaluation only, not an ongoing free tier"] },
      { name: "Hobby", priceMonthly: 5, priceAnnual: null, currency: "USD", keyLimits: ["$5/mo base fee includes usage credit; additional usage billed on top"] },
      { name: "Pro", priceMonthly: 20, priceAnnual: null, currency: "USD", keyLimits: ["Per seat; higher resource limits, extended log retention, team collaboration"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing — SSO, contractual SLAs, dedicated support"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No ongoing free tier — new accounts get a one-time $5 usage credit to trial the platform (no card required), after which you're on Hobby ($5/mo base plus metered usage) or Pro ($20/mo/seat plus usage).",
    startingPrice: 5,
    currency: "USD",

    keyFeatures: [
      "Deploy from git, Docker image, or template",
      "Usage-based billing on top of a low base fee",
      "Built-in databases (Postgres, MySQL, Redis, Mongo)",
      "Private networking between services",
      "Preview environments per branch",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for indie developers and small teams who want a fast, low-friction deploy experience and are comfortable with usage-based billing rather than flat plans.",
    bestFor: [
      "Solo developers and small teams shipping full-stack apps quickly",
      "Projects with light, predictable resource usage where usage-based billing stays cheap",
    ],
    avoidIf: [
      "You need guaranteed flat monthly costs regardless of usage spikes",
      "You're running high-traffic production workloads where usage-based pricing could get expensive fast",
    ],
    pros: [
      "Very fast, modern deploy experience with minimal configuration",
      "Usage-based pricing can be cheaper than flat plans for light workloads",
      "Built-in databases and private networking reduce third-party sprawl",
    ],
    cons: [
      "No permanent free tier — only a one-time trial credit",
      "Usage-based billing makes monthly costs less predictable than flat-fee competitors",
      "Smaller company/support footprint than Render or established PaaS players",
    ],

    popularityScore: 62,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://railway.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "fly-io",
    name: "Fly.io",
    // DRAFT - review before publish
    tagline: "Run full apps (including Docker containers) close to users on a global network, billed per-second.",
    logoUrl: "https://www.google.com/s2/favicons?domain=fly.io&sz=128",
    website: "https://fly.io",

    category: "dev-tools",
    subCategory: "hosting-infrastructure",
    industries: ["agencies", "consulting", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "Runs Micro VMs across regions worldwide, with different per-GB egress pricing by region (North America/Europe cheapest, Africa/India most expensive).",
    useCases: ["deploy containerized apps", "run global multi-region apps", "host databases via volumes", "run Kubernetes workloads"],
    pricingModel: "subscription",

    pricing: [
      { name: "Pay-as-you-go compute", priceMonthly: 2.02, priceAnnual: null, currency: "USD", keyLimits: ["Billed per-second; shared-cpu-1x/256MB ≈ $2.02/mo, performance-1x/2GB ≈ $32.19/mo, performance-4x/16GB ≈ $170.33/mo (Amsterdam region rates)"] },
      { name: "Standard Support (add-on)", priceMonthly: 29, priceAnnual: null, currency: "USD", keyLimits: ["Optional support plan on top of usage"] },
      { name: "Premium Support (add-on)", priceMonthly: 199, priceAnnual: null, currency: "USD", keyLimits: ["Optional higher-tier support plan"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No free tier for new accounts — fully pay-as-you-go from the first VM. Legacy accounts created before a pricing change retain a small grandfathered allowance (e.g. up to 3 shared-cpu-1x 256MB VMs, 3 GB volume storage), but new signups are billed on usage immediately.",
    startingPrice: 2.02,
    currency: "USD",

    keyFeatures: [
      "Deploy Docker containers as Micro VMs close to users",
      "Per-second usage billing",
      "Global anycast networking and private networking (6PN)",
      "Persistent volumes for stateful apps",
      "Fly Kubernetes option",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for developers who want real control over container placement and global latency and are comfortable reasoning about per-second usage pricing — not the easiest on-ramp for non-technical teams.",
    bestFor: [
      "Developers running latency-sensitive, multi-region containerized apps",
      "Teams who want fine-grained control over compute placement without managing raw cloud VMs",
    ],
    avoidIf: [
      "You want flat, predictable monthly pricing rather than granular per-second/per-GB billing",
      "You're new to Docker/containers and want a simpler git-push deploy experience",
    ],
    pros: [
      "Genuinely global, low-latency deployment model",
      "Transparent, granular usage-based pricing with no plan tiers to navigate",
      "Good fit for stateful apps via persistent volumes",
    ],
    cons: [
      "No ongoing free tier for new accounts — costs start immediately",
      "Per-second/per-region pricing requires more mental math than flat plans",
      "Steeper learning curve than PaaS competitors like Render/Railway",
    ],

    popularityScore: 55,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://fly.io/docs/about/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "github",
    name: "GitHub",
    // DRAFT - review before publish
    tagline: "The default home for git repos, pull requests, and CI/CD via Actions — where most open source lives.",
    logoUrl: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
    website: "https://github.com",

    category: "dev-tools",
    subCategory: "ci-cd-source-control",
    industries: ["agencies", "consulting", "ecommerce", "freelancers", "nonprofits"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Global service; Enterprise plans offer data residency options in select regions — VERIFY current regional coverage.",
    useCases: ["host git repositories", "code review / pull requests", "CI/CD pipelines", "package registry", "project tracking"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Unlimited public/private repos, 2,000 Actions minutes/mo (unlimited on public repos), 500 MB Packages storage"] },
      { name: "Team", priceMonthly: 4, priceAnnual: null, currency: "USD", keyLimits: ["Per user (introductory rate, first 12 months); 3,000 Actions minutes/mo, 2 GB Packages storage, Codespaces access"] },
      { name: "Enterprise", priceMonthly: 21, priceAnnual: null, currency: "USD", keyLimits: ["Per user (introductory rate, first 12 months); 50,000 Actions minutes/mo, 50 GB Packages storage, SAML SSO, SCIM"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan genuinely includes unlimited public and private repositories plus 2,000 CI/CD (Actions) minutes/month (unlimited and free on public repos). GitHub Copilot and GitHub Advanced Security are separate paid add-ons on every tier. Team/Enterprise per-seat prices shown are introductory first-12-months rates — confirm renewal pricing.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Git repository hosting with pull request review workflow",
      "GitHub Actions CI/CD",
      "Issues and Projects for lightweight project tracking",
      "Package registry (npm, Docker, etc.)",
      "Dependabot security updates",
      "Codespaces cloud dev environments (paid add-on tiers)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "The default choice for source control and CI/CD for the vast majority of teams — the free tier alone covers most small teams' needs, and switching away means leaving the ecosystem most contributors already know.",
    bestFor: [
      "Any team that wants the largest talent pool of developers already fluent in the tool",
      "Open source projects and small teams that fit comfortably in the free tier",
    ],
    avoidIf: [
      "You need on-premises/self-hosted source control with no cloud dependency (see GitLab self-managed instead)",
      "You want CI/CD minutes bundled generously into a low-cost plan — Actions minutes get expensive fast at scale",
    ],
    pros: [
      "Largest developer ecosystem, third-party integrations, and hiring familiarity",
      "Genuinely useful free tier, especially for public/open-source work",
      "Actions CI/CD is deeply integrated with the same repo/PR workflow",
    ],
    cons: [
      "Actions minutes and storage overages can get pricey for active private-repo teams",
      "Copilot and Advanced Security are separate paid add-ons, not included in base plans",
      "Introductory per-seat pricing renews at a higher (unconfirmed) rate after 12 months",
    ],

    popularityScore: 97,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://github.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["yaml-to-json", "cron-expression-builder"],
  },
  {
    id: "gitlab",
    name: "GitLab",
    // DRAFT - review before publish
    tagline: "Git hosting plus built-in CI/CD, security scanning, and planning tools in one platform — cloud or self-managed.",
    logoUrl: "https://www.google.com/s2/favicons?domain=gitlab.com&sz=128",
    website: "https://about.gitlab.com",

    category: "dev-tools",
    subCategory: "ci-cd-source-control",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Available as SaaS (GitLab.com) globally or fully self-managed for organizations with data residency requirements.",
    useCases: ["host git repositories", "CI/CD pipelines", "security/compliance scanning", "project planning", "self-hosted DevOps platform"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["5 users per top-level namespace (private projects), 400 CI/CD compute minutes/mo, 10 GiB storage"] },
      { name: "Premium", priceMonthly: 29, priceAnnual: null, currency: "USD", keyLimits: ["Per user, billed annually; unlimited users, 10,000 CI/CD compute minutes/mo, advanced CI/CD"] },
      { name: "Ultimate", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; 50,000 CI/CD compute minutes/mo, full application/supply-chain security suite, unlimited guest users"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan caps private-project namespaces at 5 users, 400 CI/CD compute minutes/month, and 10 GiB storage — public open-source projects get more generous treatment. Extra CI/CD minutes and storage are billed as add-ons ($10/1,000 minutes, $5/mo per 10 GiB storage).",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Git hosting with merge request review workflow",
      "Built-in CI/CD pipelines",
      "Security/dependency scanning (higher tiers)",
      "Issue boards and project planning",
      "Self-managed / on-premises deployment option",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want CI/CD, security scanning, and planning tools bundled with source control in a single platform — and for organizations that specifically need a self-managed/on-prem option GitHub doesn't offer the same way.",
    bestFor: [
      "Teams wanting an all-in-one DevOps platform rather than stitching together separate CI/CD and security tools",
      "Organizations with self-hosting or data-residency requirements",
    ],
    avoidIf: [
      "You want the largest possible community/ecosystem and hiring familiarity (GitHub is more common)",
      "Your team is small and fits well within the 5-user free-tier namespace limit but expects to outgrow it quickly",
    ],
    pros: [
      "Genuinely all-in-one: source control, CI/CD, security scanning, and planning in one product",
      "Self-managed option gives full control over hosting and data",
      "Free tier includes real CI/CD minutes, not just repo hosting",
    ],
    cons: [
      "Free tier's 5-user namespace cap is stricter than GitHub's unlimited-collaborator free repos",
      "Smaller ecosystem and community familiarity than GitHub",
      "Advanced security/compliance features are gated behind the costly Ultimate tier",
    ],

    popularityScore: 80,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://about.gitlab.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["yaml-to-json", "cron-expression-builder"],
  },
  {
    id: "circleci",
    name: "CircleCI",
    // DRAFT - review before publish
    tagline: "Dedicated CI/CD platform with generous free build minutes and high default concurrency.",
    logoUrl: "https://www.google.com/s2/favicons?domain=circleci.com&sz=128",
    website: "https://circleci.com",

    category: "dev-tools",
    subCategory: "ci-cd-source-control",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency/region options for Enterprise/Scale customers.",
    useCases: ["run CI/CD pipelines", "automated testing", "build and release automation", "self-hosted runners"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 6,000 build minutes/mo, up to 5 active users, 30x concurrency, no credit card required"] },
      { name: "Performance", priceMonthly: 15, priceAnnual: null, currency: "USD", keyLimits: ["30,000 credits/mo included, 5 active users (additional users $15/mo each), 80x concurrency"] },
      { name: "Scale", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom credit allocation, customizable user limits, unlimited concurrency, GPU environments"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan includes up to 6,000 build minutes/month, up to 5 active users, and 30x concurrency with no credit card required — one of the more generous free CI tiers among dedicated CI/CD platforms.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Docker, Linux, Windows, macOS, and Arm execution environments",
      "Self-hosted runners",
      "High-concurrency parallel job execution",
      "Orbs (reusable pipeline config packages)",
      "Insights/analytics on pipeline performance",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want a dedicated, high-performance CI/CD platform decoupled from their source-control host — the generous free tier makes it easy to try before switching from GitHub Actions/GitLab CI.",
    bestFor: [
      "Teams wanting best-in-class build concurrency and speed independent of their git host",
      "Projects needing macOS or GPU build environments not well supported elsewhere",
    ],
    avoidIf: [
      "You want CI/CD bundled into the same product as your source control (GitHub Actions/GitLab CI are simpler)",
      "You're cost-sensitive on per-user pricing at higher user counts",
    ],
    pros: [
      "Free tier is genuinely generous on both minutes and concurrency",
      "Wide range of execution environments including macOS and GPU",
      "Mature orbs ecosystem for reusable pipeline configuration",
    ],
    cons: [
      "Per-user pricing on Performance can add up for larger teams",
      "Another tool/dashboard to manage alongside your git host",
      "Credit-based billing on paid tiers requires understanding CircleCI's credit-to-resource conversion",
    ],

    popularityScore: 68,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://circleci.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["yaml-to-json", "cron-expression-builder"],
  },
  {
    id: "datadog",
    name: "Datadog",
    // DRAFT - review before publish
    tagline: "Full observability platform — infrastructure monitoring, APM, and log management — priced per host and per GB.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.datadoghq.com&sz=128",
    website: "https://www.datadoghq.com",

    category: "dev-tools",
    subCategory: "monitoring-observability",
    industries: ["agencies", "consulting", "ecommerce", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Multiple data center regions (US, EU, etc.) for data residency — VERIFY which regions apply to which product SKUs.",
    useCases: ["infrastructure monitoring", "application performance monitoring", "log management", "alerting", "dashboards"],
    pricingModel: "freemium",

    pricing: [
      { name: "Infrastructure — Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 5 hosts, 1-day metric retention, core dashboards and integrations"] },
      { name: "Infrastructure — Pro", priceMonthly: 15, priceAnnual: null, currency: "USD", keyLimits: ["Per host/mo billed annually ($18 on-demand)"] },
      { name: "Infrastructure — Enterprise", priceMonthly: 23, priceAnnual: null, currency: "USD", keyLimits: ["Per host/mo billed annually ($27 on-demand)"] },
      { name: "APM (with Infrastructure)", priceMonthly: 31, priceAnnual: null, currency: "USD", keyLimits: ["Per host/mo billed annually ($48 on-demand); APM Pro/Enterprise tiers add Data Streams Monitoring / Continuous Profiler"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Infrastructure Monitoring's free plan is capped at 5 hosts with only 1-day metric retention — enough to evaluate, not to run production monitoring. APM and Log Management have no dedicated free tier at all; Log Management is priced separately per GB ingested ($0.10/GB) plus per-million-events indexed ($1.70/million for 15-day retention). Real-world Datadog bills are a sum of many separately metered products.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Infrastructure and host monitoring",
      "Application performance monitoring (APM) and distributed tracing",
      "Log management and analytics",
      "Custom dashboards and alerting",
      "Broad integration catalog (700+ integrations)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want one platform covering infrastructure, APM, and logs and are prepared to actively manage per-host and per-GB costs — bills can balloon quickly without cost governance.",
    bestFor: [
      "Teams that want unified infrastructure, APM, and log observability in one vendor",
      "Organizations with the budget and discipline to actively manage usage-based monitoring spend",
    ],
    avoidIf: [
      "You're cost-sensitive and only need basic error tracking (Sentry) or logs, not full-stack observability",
      "You don't have someone actively watching host/data-ingest usage — Datadog bills can spiral without governance",
    ],
    pros: [
      "Extremely broad feature set spanning infra, APM, logs, RUM, and security monitoring in one platform",
      "Very large integration catalog covering most common infrastructure and cloud services",
      "Strong dashboarding and alerting UX widely regarded as industry-leading",
    ],
    cons: [
      "Pricing is complex and fully usage-based across many separately billed products — hard to predict total cost upfront",
      "Free tier's 5-host/1-day-retention cap is only useful for evaluation, not real monitoring",
      "Notorious in the industry for bill shock if usage isn't actively monitored and capped",
    ],

    popularityScore: 85,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.datadoghq.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["json-formatter"],
  },
  {
    id: "sentry",
    name: "Sentry",
    // DRAFT - review before publish
    tagline: "Error tracking and performance monitoring built for developers, with a real, usable free tier.",
    logoUrl: "https://www.google.com/s2/favicons?domain=sentry.io&sz=128",
    website: "https://sentry.io",

    category: "dev-tools",
    subCategory: "monitoring-observability",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options (US vs EU data storage).",
    useCases: ["error tracking", "crash reporting", "performance/tracing monitoring", "session replay", "release health monitoring"],
    pricingModel: "freemium",

    pricing: [
      { name: "Developer", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["1 user, 5,000 errors/mo, 50 session replays/mo, 10 custom dashboards, unlimited projects"] },
      { name: "Team", priceMonthly: 26, priceAnnual: 26, currency: "USD", keyLimits: ["Unlimited users, 50,000 errors/mo, 50 replays/mo, 20 dashboards, third-party integrations"] },
      { name: "Business", priceMonthly: 80, priceAnnual: 80, currency: "USD", keyLimits: ["Unlimited users, 50,000 errors/mo, 50 replays/mo, unlimited dashboards, SAML + SCIM"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing — technical account manager, dedicated support"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Developer plan is free forever for 1 user with 5,000 errors/month and 50 session replays/month — enough for a solo developer's side projects, but the single-user cap forces an upgrade the moment a second teammate needs access.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Automatic error and exception capture with stack traces",
      "Distributed tracing / performance monitoring",
      "Session replay",
      "Release health tracking",
      "AI-assisted debugging (Seer)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for development teams that want fast, actionable error/crash visibility without configuring a full observability stack — errors-per-month pricing needs watching as traffic grows.",
    bestFor: [
      "Development teams wanting fast setup for error tracking across web/mobile/backend",
      "Solo developers who want a genuinely free tier for side projects",
    ],
    avoidIf: [
      "You need full infrastructure/log observability, not primarily application error tracking",
      "Your error volume is unpredictable — event-based overage pricing can be hard to budget for",
    ],
    pros: [
      "Free tier is genuinely usable for solo developers, not just a trial",
      "Fast, low-friction setup via SDKs for most major languages/frameworks",
      "Strong error grouping and triage UX that developers generally like",
    ],
    cons: [
      "Team and Business plans both cap included errors/replays at the same 50k/50 level — event overages bill separately",
      "Not a substitute for infrastructure monitoring or full observability platforms like Datadog",
      "Free plan's 1-user limit means teams upgrade almost immediately",
    ],

    popularityScore: 75,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://sentry.io/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["json-formatter"],
  },
  {
    id: "new-relic",
    name: "New Relic",
    // DRAFT - review before publish
    tagline: "Full-stack observability with a genuinely generous free data allowance, priced per user and per GB beyond that.",
    logoUrl: "https://www.google.com/s2/favicons?domain=newrelic.com&sz=128",
    website: "https://newrelic.com",

    category: "dev-tools",
    subCategory: "monitoring-observability",
    industries: ["agencies", "consulting", "ecommerce", "healthcare"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data center/residency options.",
    useCases: ["infrastructure monitoring", "application performance monitoring", "log management", "dashboards and alerting"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["100 GB data ingest/mo, 1 full platform user, unlimited basic users, no credit card required"] },
      { name: "Standard", priceMonthly: 10, priceAnnual: null, currency: "USD", keyLimits: ["First full platform user $10/mo, additional full users $99/mo (max 5); core users $49/user/mo; data $0.40/GB beyond 100 GB free"] },
      { name: "Pro", priceMonthly: 349, priceAnnual: null, currency: "USD", keyLimits: ["Full platform users $349/user/mo billed annually ($418.80/mo month-to-month); unlimited full users"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; adds Data Plus (FedRAMP/HIPAA-eligible data handling)"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan includes a genuinely generous 100 GB/month of data ingest plus one full platform user and unlimited free \"basic\" (read-only-ish) users, no credit card required. Beyond 100 GB, data is billed at $0.40/GB on every paid edition, and full-platform-user seat pricing jumps sharply between Standard ($10-99/user) and Pro ($349/user annual).",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Infrastructure and APM monitoring",
      "Log management",
      "Custom dashboards and alerting",
      "Distributed tracing",
      "AI-assisted anomaly detection (higher tiers)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want a large free data allowance to get real production monitoring value before paying anything — the jump to Pro's per-seat pricing is steep, so plan seat counts carefully.",
    bestFor: [
      "Small-to-mid teams that can operate mostly within the 100 GB/mo free data allowance",
      "Organizations wanting one platform for infra, APM, and logs without per-host pricing",
    ],
    avoidIf: [
      "You need many full-platform seats — Pro's per-user pricing gets expensive fast",
      "Your data ingest is unpredictable and could blow past the 100 GB free allowance regularly",
    ],
    pros: [
      "100 GB/month free data ingest is unusually generous for the category",
      "Unified platform covering infra, APM, and logs under one pricing model",
      "No credit card required to start",
    ],
    cons: [
      "Full-platform-user pricing has a steep, confusing jump between Standard and Pro editions",
      "Data overage costs ($0.40/GB) can add up quickly for high-volume logging",
      "Pricing structure (core users, basic users, full users, data) has a real learning curve",
    ],

    popularityScore: 70,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://newrelic.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "zapier",
    name: "Zapier",
    // DRAFT - review before publish
    tagline: "The most widely integrated no-code automation platform — connect apps with triggers and actions, no code required.",
    logoUrl: "https://www.google.com/s2/favicons?domain=zapier.com&sz=128",
    website: "https://zapier.com",

    category: "dev-tools",
    subCategory: "no-code-automation",
    industries: ["agencies", "consulting", "ecommerce", "retail", "nonprofits", "real-estate", "hospitality"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment/tax handling.",
    useCases: ["automate workflows between apps", "connect SaaS tools", "trigger-based automation", "AI agent automation", "chatbots"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["100 tasks/mo, unlimited two-step Zaps only, 1 user"] },
      { name: "Professional", priceMonthly: 19.99, priceAnnual: null, currency: "USD", keyLimits: ["Starting price; task allowance scales from 100 up to 2M+ at higher price points; unlimited multi-step Zaps, 1 user"] },
      { name: "Team", priceMonthly: 69, priceAnnual: null, currency: "USD", keyLimits: ["Starting price; up to 25 users, shared Zaps/folders, SAML SSO"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom annual contract; unlimited users, advanced admin controls"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is capped at 100 tasks/month and limited to simple two-step Zaps (trigger + one action) — enough to test the concept, not to run real multi-step automation. Paid tiers scale task allowance with price rather than offering one flat number, so the effective starting price depends heavily on expected monthly task volume.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "8,000+ app integrations",
      "Multi-step workflow automation (Zaps)",
      "Built-in Tables and Forms",
      "AI-powered automation building (Copilot)",
      "Webhooks and premium app connectors",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for non-technical teams that need to connect SaaS tools without writing code and value having virtually every app already supported — task-based pricing can get expensive fast as automation volume grows.",
    bestFor: [
      "Non-technical teams automating workflows between common SaaS tools",
      "Organizations that need the widest possible app-integration coverage",
    ],
    avoidIf: [
      "You run high-volume automations — per-task pricing scales up quickly and Make is often cheaper at scale",
      "Your team is technical and comfortable building custom scripts/webhooks instead",
    ],
    pros: [
      "Largest app-integration catalog in the no-code automation category",
      "Genuinely easy to learn for non-technical users",
      "Free tier is enough to validate a simple automation idea before paying",
    ],
    cons: [
      "Task-based pricing gets expensive quickly at real production automation volume",
      "Free tier's two-step-only limit is quite restrictive for real workflows",
      "Complex multi-branch logic can be harder to build/debug than in code-first tools",
    ],

    popularityScore: 88,
    trending: false,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://zapier.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["json-formatter", "csv-to-json"],
  },
  {
    id: "make",
    name: "Make",
    // DRAFT - review before publish
    tagline: "Visual, scenario-based automation with more granular control and cheaper per-operation pricing than Zapier.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.make.com&sz=128",
    website: "https://www.make.com",

    category: "dev-tools",
    subCategory: "no-code-automation",
    industries: ["agencies", "consulting", "ecommerce", "retail", "nonprofits"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY regional payment/tax handling.",
    useCases: ["automate workflows between apps", "visual scenario building", "data transformation pipelines", "API orchestration"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Up to 1,000 operations/mo, 2 active scenarios max, 15-minute minimum interval, 5 MB max file size, 7-day execution log"] },
      { name: "Core", priceMonthly: 9, priceAnnual: null, currency: "USD", keyLimits: ["10,000 operations/mo; unlimited active scenarios, 1-minute scheduling, 5 GB data transfer, API access"] },
      { name: "Pro", priceMonthly: 16, priceAnnual: null, currency: "USD", keyLimits: ["10,000 operations/mo; priority execution, custom variables, full-text log search"] },
      { name: "Teams", priceMonthly: 29, priceAnnual: null, currency: "USD", keyLimits: ["10,000 operations/mo; team roles, scenario template sharing"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; custom functions, 24/7 support, overage protection"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan allows up to 1,000 operations/month but caps active scenarios at just 2 and enforces a 15-minute minimum run interval — real automation work needs a paid plan quickly. Unused monthly operation credits expire at end of billing term; annual-plan credits expire after 12 months.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Visual drag-and-drop scenario builder",
      "3,000+ app integrations",
      "Fine-grained control over data flow/routing (routers, filters)",
      "Make API for programmatic scenario management",
      "Custom functions (higher tiers)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for technically-minded users who want more granular workflow control and cheaper per-operation pricing than Zapier — the visual builder has a steeper learning curve than Zapier's linear Zap format.",
    bestFor: [
      "Users comfortable with a more visual, graph-based automation builder",
      "Teams running higher automation volume who want cheaper per-operation pricing than Zapier",
    ],
    avoidIf: [
      "You want the simplest possible linear automation builder — Zapier's UX is more beginner-friendly",
      "You need the absolute widest app-integration catalog (Zapier's is larger)",
    ],
    pros: [
      "Generally cheaper per-operation than Zapier's per-task pricing at comparable volume",
      "More granular control over branching/routing logic in workflows",
      "Free tier's 1,000 operations/mo is a reasonable starting allowance",
    ],
    cons: [
      "Visual scenario builder has a steeper learning curve than Zapier's simpler format",
      "Free tier's 2-scenario cap and 15-minute interval limit real usage quickly",
      "Smaller integration catalog than Zapier for long-tail/niche apps",
    ],

    popularityScore: 65,
    trending: true,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.make.com/en/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["json-formatter", "csv-to-json"],
  },
  {
    id: "airtable",
    name: "Airtable",
    // DRAFT - review before publish
    tagline: "Spreadsheet-database hybrid for building lightweight internal tools and workflows without code.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.airtable.com&sz=128",
    website: "https://www.airtable.com",

    category: "dev-tools",
    subCategory: "no-code-automation",
    industries: ["agencies", "consulting", "retail", "real-estate", "nonprofits", "hospitality"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY regional data residency options for Enterprise customers.",
    useCases: ["build internal databases", "project/content tracking", "workflow automation", "team collaboration on structured data"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["Aimed at individuals/very small teams — exact record/storage/automation caps not confirmed from the vendor page, VERIFY before publishing precise numbers"] },
      { name: "Team", priceMonthly: 20, priceAnnual: null, currency: "USD", keyLimits: ["Per user, billed annually; adds customization and collaboration features over Free"] },
      { name: "Business", priceMonthly: 45, priceAnnual: null, currency: "USD", keyLimits: ["Per user, billed annually; adds administrative controls and higher data scale/flexibility"] },
      { name: "Enterprise Scale", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; unlimited org units, workspaces, and bases"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is available to individuals and very small teams at no cost, but Airtable's own pricing page did not surface the exact per-base record/attachment/automation limits during verification — confirm precise caps (records per base, storage per base, automation runs) directly with Airtable before publishing this listing as fully accurate.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Spreadsheet-database hybrid with relational links between tables",
      "Multiple views (grid, kanban, calendar, gallery, gantt)",
      "No-code automations",
      "Forms for data collection",
      "Interfaces (custom app-like dashboards)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want a flexible, visual database for tracking structured work (content calendars, CRMs, project trackers) without engineering resources — not a substitute for a real relational database at high scale.",
    bestFor: [
      "Ops, marketing, and creative teams building lightweight internal tools without engineering help",
      "Small businesses tracking structured data (inventory, bookings, leads) with a spreadsheet-like interface",
    ],
    avoidIf: [
      "You need a true relational database with high record volumes and complex querying",
      "You want fully transparent, published limits before choosing a plan — confirm current record/storage caps directly, as they weren't clearly published",
    ],
    pros: [
      "Very approachable for non-technical users coming from spreadsheets",
      "Flexible views (kanban, calendar, gallery) on the same underlying data",
      "Built-in automations and forms reduce need for separate tools",
    ],
    cons: [
      "Per-seat pricing on Team/Business tiers adds up for larger teams",
      "Performance can degrade on very large bases compared to a real database",
      "Exact free-tier record/storage limits are not clearly published — confirm before relying on them",
    ],

    popularityScore: 78,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.airtable.com/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["csv-to-json", "json-formatter"],
  },
  {
    id: "bubble",
    name: "Bubble",
    // DRAFT - review before publish
    tagline: "Visual, no-code platform for building full web applications with a database and custom workflows.",
    logoUrl: "https://www.google.com/s2/favicons?domain=bubble.io&sz=128",
    website: "https://bubble.io",

    category: "dev-tools",
    subCategory: "no-code-automation",
    industries: ["agencies", "consulting", "ecommerce", "freelancers"],
    businessSizes: ["solo", "small", "medium"],
    regions: ["global"],
    regionNotes: "VERIFY current data center/region options.",
    useCases: ["build web apps without code", "internal tools", "MVP/prototype development", "marketplace and SaaS app building"],
    pricingModel: "freemium",

    pricing: [{ name: "VERIFY", priceMonthly: "VERIFY", priceAnnual: "VERIFY", currency: "VERIFY", keyLimits: ["VERIFY"] }],
    hasFreeTier: true,
    freeTierReality: "VERIFY",
    startingPrice: "VERIFY",
    currency: "VERIFY",

    keyFeatures: [
      "Visual, drag-and-drop app builder",
      "Built-in relational database",
      "Custom workflow/logic editor",
      "Plugin marketplace",
      "API Connector for external integrations",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for founders and non-engineers who want to build a genuinely full-featured web app (not just a simple form or automation) without writing code — pricing has shifted to a workload-unit model that needs careful confirmation before publishing.",
    bestFor: [
      "Non-technical founders building an MVP or full SaaS product without a dev team",
      "Agencies building client web apps rapidly on a visual platform",
    ],
    avoidIf: [
      "You need pixel-perfect custom UI or non-standard architecture — visual builders impose real constraints",
      "You're not prepared to eventually hire Bubble specialists as complexity grows — the platform has a real learning curve",
    ],
    pros: [
      "Can build genuinely full, database-backed web applications, not just simple automations",
      "Large plugin marketplace and active no-code community",
      "Faster path to a working MVP than hiring a dev team for many use cases",
    ],
    cons: [
      "Workload-unit-based pricing model was not confirmed during verification and needs direct confirmation before publishing accurate figures",
      "Steeper learning curve than simpler no-code tools like Zapier/Airtable",
      "Apps can become hard to maintain/scale past a certain complexity, and migrating off Bubble later is nontrivial",
    ],

    popularityScore: 58,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "",
    pricingSourceUrl: "https://bubble.io/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
  {
    id: "postman",
    name: "Postman",
    // DRAFT - review before publish
    tagline: "The standard API client for building, testing, and documenting APIs — now with AI-assisted workflows.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.postman.com&sz=128",
    website: "https://www.postman.com",

    category: "dev-tools",
    subCategory: "ci-cd-source-control",
    industries: ["agencies", "consulting", "ecommerce"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options for Enterprise customers.",
    useCases: ["build and test APIs", "API documentation", "mock servers", "API monitoring", "collaborative API development"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["1 user, 5 integrations, 50 AI credits/mo, unlimited collection runs, API monitoring capped at 1,000 requests/mo"] },
      { name: "Solo", priceMonthly: 9, priceAnnual: null, currency: "USD", keyLimits: ["Billed annually; 400 AI credits/mo, unlimited private NPM packages, 10,000 API monitoring requests/mo"] },
      { name: "Team", priceMonthly: 19, priceAnnual: null, currency: "USD", keyLimits: ["Per user, billed annually; 400 AI credits/user/mo, basic RBAC, unlimited workspace viewers, 1M Postman API calls/mo"] },
      { name: "Enterprise", priceMonthly: 49, priceAnnual: null, currency: "USD", keyLimits: ["Per user, billed annually; 800 pooled AI credits/user/mo, API Catalog, advanced RBAC, audit logs, private runners"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan supports 1 user with unlimited collection runs and performance testing, but caps API monitoring at 1,000 requests/month and limits integrations to 5 — enough for individual API development, not for a team's shared monitoring needs.",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "API client for building/sending requests",
      "Collections and environments for organizing API workflows",
      "Mock servers and automated testing",
      "API documentation generation",
      "Git-based version control for collections",
    ],
    integrations: ["VERIFY"],
    platforms: ["web"],

    // DRAFT - review before publish
    verdict:
      "Best for developer teams building and testing APIs who want one shared tool for the whole API lifecycle — free tier is genuinely useful solo, but team collaboration features require paid seats.",
    bestFor: [
      "API developers and QA teams needing a shared client, mock servers, and test automation",
      "Teams documenting APIs for internal or external consumers",
    ],
    avoidIf: [
      "You only occasionally test APIs and a lightweight open-source client would suffice",
      "You need heavy CI-integrated automated testing beyond what's included at your plan's usage caps",
    ],
    pros: [
      "De facto standard API client with huge community familiarity",
      "Free tier is genuinely capable for individual developers",
      "Strong collaboration features (shared collections, workspaces, mock servers) on paid tiers",
    ],
    cons: [
      "Team collaboration features require paid per-user seats fairly quickly",
      "AI credit system on paid tiers adds another usage dimension to track",
      "API monitoring request caps are fairly low even on mid-tier plans",
    ],

    popularityScore: 72,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.postman.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["json-formatter", "jwt-decoder", "base64-encoder", "url-encoder"],
  },
  {
    id: "okta",
    name: "Okta",
    // DRAFT - review before publish
    tagline: "Enterprise identity and access management — SSO, MFA, and lifecycle management for workforce and customer identity.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.okta.com&sz=128",
    website: "https://www.okta.com",

    category: "dev-tools",
    subCategory: "dev-security-identity",
    industries: ["consulting", "healthcare", "real-estate", "ecommerce"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options across regions.",
    useCases: ["single sign-on (SSO)", "multi-factor authentication", "identity lifecycle management", "customer identity (CIAM)", "API access management"],
    pricingModel: "subscription",

    pricing: [
      { name: "Starter", priceMonthly: 6, priceAnnual: null, currency: "USD", keyLimits: ["Per user, billed annually, $1,500 minimum contract; SSO, MFA, Universal Directory, 5 Workflows"] },
      { name: "Core Essentials", priceMonthly: 14, priceAnnual: null, currency: "USD", keyLimits: ["Per user, billed annually; adds adaptive MFA, Privileged Access, Lifecycle Management, 50 Workflows"] },
      { name: "Essentials", priceMonthly: 17, priceAnnual: null, currency: "USD", keyLimits: ["Per user, billed annually (most popular); adds governance and access controls"] },
      { name: "Professional / Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom pricing; adds device access, threat protection, API access management"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier for production use — Okta offers a 30-day free trial with no credit card required. Okta Customer Identity (Auth0) is priced separately, starting at a $3,000/mo Enterprise Base Platform plus usage-based Monthly Active User (MAU) pricing on top.",
    startingPrice: 6,
    currency: "USD",

    keyFeatures: [
      "Single sign-on (SSO) across thousands of pre-built app integrations",
      "Adaptive multi-factor authentication",
      "Universal Directory and lifecycle management",
      "Workflows (no-code identity automation)",
      "Separate Customer Identity (Auth0) product for consumer-facing apps",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for organizations that need enterprise-grade SSO/MFA across many apps and are prepared for per-user pricing plus a real minimum contract — overkill for a small team that just needs basic login.",
    bestFor: [
      "Mid-size and larger organizations standardizing identity/access across many SaaS apps",
      "Companies needing compliance-grade access governance and audit trails",
    ],
    avoidIf: [
      "You're a small team that just needs basic SSO — the $1,500 minimum contract makes Okta expensive at small scale",
      "You need consumer-facing customer identity (CIAM) on a budget — Auth0's separate pricing starts much higher",
    ],
    pros: [
      "Huge catalog of pre-built SSO integrations across enterprise SaaS apps",
      "Strong, well-established security/compliance track record",
      "Workflows add no-code identity automation without custom scripting",
    ],
    cons: [
      "$1,500 minimum annual contract makes it a poor fit for very small teams",
      "Feature tiers (Starter → Essentials → Professional) require careful navigation to avoid over/under-buying",
      "Customer Identity (Auth0) pricing is separate and starts notably higher",
    ],

    popularityScore: 74,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: false,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.okta.com/pricing/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["jwt-decoder"],
  },
  {
    id: "1password-business",
    name: "1Password Business",
    // DRAFT - review before publish
    tagline: "Team password manager and secrets vault with developer-friendly tooling (CLI, SSH agent, secrets automation).",
    logoUrl: "https://www.google.com/s2/favicons?domain=1password.com&sz=128",
    website: "https://1password.com",

    category: "dev-tools",
    subCategory: "dev-security-identity",
    industries: ["agencies", "consulting", "ecommerce", "healthcare", "real-estate"],
    businessSizes: ["small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "VERIFY current data residency options.",
    useCases: ["team password management", "secrets management for developers", "secure credential sharing", "SSO/identity provider integration"],
    pricingModel: "subscription",

    pricing: [
      { name: "Teams Starter Pack", priceMonthly: 24.95, priceAnnual: null, currency: "USD", keyLimits: ["Flat rate covering up to 10 members; additional seats billed separately"] },
      { name: "Business", priceMonthly: 8.99, priceAnnual: null, currency: "USD", keyLimits: ["Per user, billed annually; adds SSO/identity provider integration, advanced vault sharing"] },
    ],
    hasFreeTier: false,
    freeTierReality: "No permanent free tier for Business plans — a 14-day free trial is available for all paid plans. The flat-rate Teams Starter Pack ($24.95/mo for up to 10 members) can be cheaper than per-seat Business pricing for very small teams; larger teams needing SSO/advanced admin controls need the per-user Business plan.",
    startingPrice: 8.99,
    currency: "USD",

    keyFeatures: [
      "Shared team vaults with granular permissions",
      "Developer CLI and SSH agent for secrets in local workflows",
      "Secrets Automation for CI/CD pipelines",
      "SSO and identity provider integration",
      "Security alerts (breach/weak password monitoring)",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for teams that want a single tool covering both everyday team password management and developer secrets workflows (CLI, CI/CD) — the flat Starter Pack is good value for very small teams, but Business per-seat pricing is where most growing teams land.",
    bestFor: [
      "Small-to-mid teams wanting shared password vaults with admin oversight",
      "Development teams wanting secrets management (CLI, SSH agent, CI/CD) alongside team password sharing",
    ],
    avoidIf: [
      "You're a solo user — the personal 1Password plans are cheaper than any Business tier",
      "You need a dedicated enterprise secrets manager (e.g. Vault) rather than a password-manager-plus-secrets hybrid",
    ],
    pros: [
      "Developer-friendly extras (CLI, SSH agent, Secrets Automation) beyond a typical consumer password manager",
      "Flat Teams Starter Pack is good value for very small teams under 10 seats",
      "Strong reputation for security and ease of use",
    ],
    cons: [
      "No free tier — only a 14-day trial before you must pay",
      "Business per-seat pricing can add up for larger teams versus the flat Starter Pack ceiling",
      "Full secrets-management depth may still fall short of dedicated developer secrets platforms at scale",
    ],

    popularityScore: 76,
    trending: false,
    editorsPick: false,

    affiliateUrl: null,
    hasAffiliateProgram: true,

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://1password.com/business/pricing",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: ["password-generator"],
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    // DRAFT - review before publish
    tagline: "CDN, DNS, DDoS protection, and edge compute (Workers) with an unusually generous free tier.",
    logoUrl: "https://www.google.com/s2/favicons?domain=www.cloudflare.com&sz=128",
    website: "https://www.cloudflare.com",

    category: "dev-tools",
    subCategory: "dev-security-identity",
    industries: ["agencies", "consulting", "ecommerce", "retail"],
    businessSizes: ["solo", "small", "medium", "enterprise"],
    regions: ["global"],
    regionNotes: "Global anycast network with points of presence worldwide — no sign-up region restrictions.",
    useCases: ["DNS management", "CDN and content delivery", "DDoS protection and WAF", "edge compute (Workers)", "zero trust network access"],
    pricingModel: "freemium",

    pricing: [
      { name: "Free", priceMonthly: 0, priceAnnual: 0, currency: "USD", keyLimits: ["DNS, unmetered DDoS protection, CDN, universal SSL, WAF, role-based access control; no uptime SLA"] },
      { name: "Pro", priceMonthly: 25, priceAnnual: 20, currency: "USD", keyLimits: ["$20/mo billed annually or $25/mo month-to-month; adds lossless image optimization, AMP support"] },
      { name: "Business", priceMonthly: 250, priceAnnual: 200, currency: "USD", keyLimits: ["$200/mo billed annually or $250/mo month-to-month; adds 100% uptime SLA with service credits"] },
      { name: "Enterprise", priceMonthly: null, priceAnnual: null, currency: "USD", keyLimits: ["Custom annual pricing; 10x-25x uptime SLA credits, network prioritization, dedicated support"] },
    ],
    hasFreeTier: true,
    freeTierReality: "Free plan is unusually generous for a security/CDN product: unmetered DDoS protection, CDN, DNS, SSL, and a basic WAF at $0/mo with no site-count or bandwidth cap stated, though there's no uptime SLA. Compute/storage products (Workers, R2, D1, KV) are billed separately on their own usage-based free allowances (e.g. Workers: 100k requests/day free; R2: 10 GB-month free).",
    startingPrice: 0,
    currency: "USD",

    keyFeatures: [
      "Global CDN and DNS",
      "DDoS protection and Web Application Firewall",
      "Workers (edge compute/serverless)",
      "R2 object storage and D1/KV databases",
      "Zero Trust network access",
    ],
    integrations: ["VERIFY"],
    platforms: ["web", "ios", "android"],

    // DRAFT - review before publish
    verdict:
      "Best for any team that wants serious CDN/DDoS/WAF protection at zero cost to start, with a credible path into edge compute (Workers) as needs grow — the jump from Pro to Business ($200/mo) is steep if you need an uptime SLA.",
    bestFor: [
      "Any site or app wanting free-tier-grade CDN, DNS, and DDoS protection",
      "Developers building on edge compute (Workers) with generous free usage allowances",
    ],
    avoidIf: [
      "You need a contractual uptime SLA without jumping straight to the $200+/mo Business tier",
      "You want a single simple bill — Cloudflare's product surface (site plans plus separately metered compute/storage products) spans many SKUs",
    ],
    pros: [
      "Free tier genuinely includes unmetered DDoS protection and a real CDN, not just a trial",
      "Workers/R2/D1 give a credible edge-compute platform with generous free allowances",
      "Global network delivers strong real-world performance",
    ],
    cons: [
      "No uptime SLA until the $200-250/mo Business tier — a steep jump from Pro's $20-25/mo",
      "Product surface is broad (site plans, Workers, Zero Trust, R2, etc.), each billed somewhat separately",
      "Some advanced security features are enterprise-only with custom pricing",
    ],

    popularityScore: 88,
    trending: true,
    editorsPick: true,

    affiliateUrl: null,
    hasAffiliateProgram: "VERIFY",

    pricingVerifiedDate: "2026-07-17",
    pricingSourceUrl: "https://www.cloudflare.com/plans/",
    lastReviewed: "2026-07-17",

    relatedUtilityAppsTools: [],
  },
];
