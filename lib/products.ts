export type ProductPlatform = "gumroad" | "etsy" | "shopify" | "gumroad-affiliate";

const PLATFORM_LABELS: Record<ProductPlatform, string> = {
  gumroad: "Gumroad",
  "gumroad-affiliate": "Gumroad",
  etsy: "Etsy",
  shopify: "Shopify",
};

export function platformLabel(platform: ProductPlatform): string {
  return PLATFORM_LABELS[platform];
}

export interface ProductReview {
  author: string;
  rating: number;
  body: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number;
  currency: "USD";
  category: string;
  tags: string[];
  /** Tailwind gradient class string, e.g. "from-primary-500 to-accent-500" */
  image: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  platform: ProductPlatform;
  affiliateUrl: string;
  featured: boolean;
  bestseller: boolean;
  new: boolean;
  features: string[];
  reviews: ProductReview[];
}

const r = (author: string, rating: number, body: string, date: string): ProductReview => ({
  author,
  rating,
  body,
  date,
});

export const PRODUCTS: Product[] = [
  // ---------- AI Prompt Bundles (5) ----------
  {
    id: "ai-prompt-vault",
    name: "AI Prompt Vault — 1,000 Pro Prompts",
    description: "Battle-tested prompts for ChatGPT, Claude, and Gemini across writing, code, marketing, and research.",
    longDescription:
      "1,000 hand-curated prompts that survived three months of daily use across writing, code, marketing, research, and product work. Organized by use case with usage notes, expected output length, and the model each prompt was tuned on. Updated quarterly.",
    price: 29,
    originalPrice: 49,
    currency: "USD",
    category: "AI Prompt Bundles",
    tags: ["ChatGPT", "Claude", "Gemini", "writing", "marketing", "code"],
    image: "from-primary-500 to-accent-500",
    rating: 4.9,
    reviewCount: 1280,
    salesCount: 4_300,
    platform: "gumroad",
    affiliateUrl: "https://utilityapps.gumroad.com/l/ai-prompt-vault?affiliate=utilityapps",
    featured: true,
    bestseller: true,
    new: false,
    features: [
      "1,000 prompts across 12 use cases",
      "Notes on which model each prompt is tuned for",
      "Quarterly updates included free",
      "Notion + Markdown + JSON formats",
      "Commercial use license",
    ],
    reviews: [
      r("Mara K.", 5, "Saved me probably 20 hours my first week. The 'rewrite for clarity' prompt alone was worth it.", "2026-03-12"),
      r("Devon S.", 5, "Better than the prompt collections I've paid 3x for. The model-specific notes are the killer feature.", "2026-02-28"),
      r("Priya R.", 4, "Excellent value. A few prompts felt redundant but the marketing section is gold.", "2026-02-10"),
    ],
  },
  {
    id: "claude-power-prompts",
    name: "Claude Power Prompts (200 Recipes)",
    description: "Long-context, code-heavy, and analysis prompts purpose-built for Claude Sonnet and Opus.",
    longDescription:
      "200 prompts written specifically for Claude's strengths: long-context analysis, code review, multi-step planning, and structured output. Each recipe includes the prompt, the system message, sample input, and expected output. Includes 30 prompts for Claude Code specifically.",
    price: 19,
    originalPrice: 29,
    currency: "USD",
    category: "AI Prompt Bundles",
    tags: ["Claude", "Anthropic", "Claude Code", "long context"],
    image: "from-accent-500 to-primary-500",
    rating: 4.8,
    reviewCount: 540,
    salesCount: 1_700,
    platform: "gumroad",
    affiliateUrl: "https://utilityapps.gumroad.com/l/claude-power-prompts?affiliate=utilityapps",
    featured: false,
    bestseller: true,
    new: false,
    features: [
      "200 Claude-tuned prompts",
      "30 dedicated Claude Code recipes",
      "System messages included",
      "Sample input + expected output for each",
    ],
    reviews: [
      r("Tomás L.", 5, "Buy this if you live inside Claude all day. The Claude Code prompts replaced my own scratch file.", "2026-04-02"),
      r("Anika P.", 4, "Great content. Could use more examples for Opus specifically.", "2026-03-18"),
      r("Hugh B.", 5, "The 'audit my plan' prompt has saved me from two bad refactors.", "2026-03-05"),
    ],
  },
  {
    id: "ai-marketing-stack",
    name: "AI Marketing Prompt Stack",
    description: "Email sequences, ad copy, landing pages, and SEO briefs in one bundle.",
    longDescription:
      "A full marketing stack of prompts: 8 cold-email frameworks, 12 ad-copy templates (Meta, X, LinkedIn, Google), 6 landing-page generators, and 10 SEO brief generators. Tested across DTC, SaaS, and creator businesses.",
    price: 35,
    originalPrice: 59,
    currency: "USD",
    category: "AI Prompt Bundles",
    tags: ["marketing", "email", "ads", "SEO", "copywriting"],
    image: "from-accent-500 to-warning-500",
    rating: 4.7,
    reviewCount: 412,
    salesCount: 1_200,
    platform: "gumroad-affiliate",
    affiliateUrl: "https://gumroad.com/a/123456789/ai-marketing-stack?utm=utilityapps",
    featured: true,
    bestseller: false,
    new: false,
    features: [
      "8 cold-email frameworks",
      "12 ad-copy templates across 4 platforms",
      "6 landing-page generators",
      "10 SEO brief generators",
      "Niche packs: DTC, SaaS, creators",
    ],
    reviews: [
      r("Ben H.", 5, "The cold-email frameworks alone replaced our $99/mo copy tool.", "2026-04-12"),
      r("Sasha V.", 4, "Solid. Wish more verticals were covered, but the SaaS pack is great.", "2026-03-22"),
      r("Lin C.", 5, "Used the SEO brief generator for 8 articles. Three are now ranking page one.", "2026-02-19"),
    ],
  },
  {
    id: "research-assistant-prompts",
    name: "AI Research Assistant Prompts",
    description: "Lit reviews, source synthesis, and structured note-taking for academic work.",
    longDescription:
      "60 prompts for graduate students and researchers: literature reviews, source synthesis, citation cross-checking, paper-style summaries, and structured note-taking. Designed for ChatGPT and Claude with explicit prompts to mitigate hallucinations.",
    price: 15,
    originalPrice: 25,
    currency: "USD",
    category: "AI Prompt Bundles",
    tags: ["research", "academic", "literature review", "citations"],
    image: "from-primary-500 to-success-500",
    rating: 4.6,
    reviewCount: 198,
    salesCount: 620,
    platform: "etsy",
    affiliateUrl: "https://www.etsy.com/listing/ai-research-prompts?ref=utilityapps",
    featured: false,
    bestseller: false,
    new: true,
    features: [
      "60 research-tuned prompts",
      "Hallucination-mitigation patterns",
      "APA / MLA / Chicago format helpers",
      "Notion + Obsidian templates included",
    ],
    reviews: [
      r("Eleanor W.", 5, "The citation cross-check prompt saved my thesis section twice.", "2026-04-22"),
      r("Marcos A.", 4, "Good for soft sciences. Less helpful for STEM-heavy reviews.", "2026-04-08"),
      r("Yuki H.", 5, "Worth it just for the paper-skim template.", "2026-03-30"),
    ],
  },
  {
    id: "creator-prompt-pack",
    name: "Creator Prompt Pack — YouTube + Newsletter",
    description: "Hooks, scripts, descriptions, and newsletter outlines for solo creators.",
    longDescription:
      "Everything a solo creator needs: 50 video hook formulas, 20 long-form script frameworks, YouTube description templates that rank, and newsletter outlines that convert. Tested on channels from 1K to 500K subs.",
    price: 24,
    originalPrice: 39,
    currency: "USD",
    category: "AI Prompt Bundles",
    tags: ["YouTube", "newsletter", "creator", "video scripts"],
    image: "from-warning-500 to-accent-500",
    rating: 4.8,
    reviewCount: 322,
    salesCount: 1_080,
    platform: "gumroad",
    affiliateUrl: "https://utilityapps.gumroad.com/l/creator-prompt-pack?affiliate=utilityapps",
    featured: false,
    bestseller: false,
    new: true,
    features: [
      "50 video hooks tested across niches",
      "20 long-form script frameworks",
      "YouTube SEO description templates",
      "Newsletter outline generator",
    ],
    reviews: [
      r("Aiden M.", 5, "My CTR jumped 40% after testing the hook formulas. Real receipts.", "2026-04-30"),
      r("Lana S.", 5, "Best $24 I've spent on my channel.", "2026-04-12"),
      r("Cole F.", 4, "Some hooks feel formulaic but they work.", "2026-03-25"),
    ],
  },

  // ---------- Resume & Career Templates (3) ----------
  {
    id: "resume-vault",
    name: "Resume Vault — 30 ATS-Ready Templates",
    description: "Pixel-perfect resume templates that pass every major ATS, in Word + Pages + Notion.",
    longDescription:
      "30 hand-built resume templates designed to clear Greenhouse, Lever, and Workday ATS filters. Word + Pages + Notion versions for each. Includes a 12-page job-search playbook covering negotiation, follow-ups, and post-offer due diligence.",
    price: 18,
    originalPrice: 29,
    currency: "USD",
    category: "Resume & Career Templates",
    tags: ["resume", "ATS", "career", "Word", "Notion"],
    image: "from-success-500 to-primary-500",
    rating: 4.9,
    reviewCount: 2_140,
    salesCount: 7_800,
    platform: "etsy",
    affiliateUrl: "https://www.etsy.com/listing/resume-vault?ref=utilityapps",
    featured: true,
    bestseller: true,
    new: false,
    features: [
      "30 ATS-tested templates",
      "Word, Pages, and Notion versions",
      "12-page job-search playbook",
      "Cover letter pack included",
    ],
    reviews: [
      r("Jamal P.", 5, "Got two FAANG interviews within a month after switching templates. Coincidence? Maybe. Worth $18 anyway.", "2026-04-18"),
      r("Naomi K.", 5, "Notion version is a game changer for tracking applications.", "2026-04-03"),
      r("Ravi T.", 4, "Solid templates. Some feel similar to each other.", "2026-03-12"),
    ],
  },
  {
    id: "cover-letter-kit",
    name: "Cover Letter Kit — 12 Frameworks",
    description: "Cover letter templates that get past the first 7 seconds, with prompts for each.",
    longDescription:
      "12 cover letter frameworks plus 30 ChatGPT prompts to tailor each one to a specific job posting in under 5 minutes. Field-tested on tech, design, finance, and operations roles.",
    price: 12,
    originalPrice: 19,
    currency: "USD",
    category: "Resume & Career Templates",
    tags: ["cover letter", "career", "job search"],
    image: "from-primary-500 to-success-500",
    rating: 4.7,
    reviewCount: 460,
    salesCount: 1_400,
    platform: "etsy",
    affiliateUrl: "https://www.etsy.com/listing/cover-letter-kit?ref=utilityapps",
    featured: false,
    bestseller: false,
    new: false,
    features: [
      "12 cover letter frameworks",
      "30 ChatGPT prompts to tailor them",
      "Industry-specific examples",
    ],
    reviews: [
      r("Zoe A.", 5, "Heard back on 4 of 5 applications using the 'specific accomplishment' framework.", "2026-04-09"),
      r("Diego R.", 4, "Great frameworks. Wish there were more for non-tech roles.", "2026-03-21"),
      r("Hana M.", 5, "Concise and immediately useful.", "2026-03-08"),
    ],
  },
  {
    id: "linkedin-makeover",
    name: "LinkedIn Profile Makeover Pack",
    description: "Headline templates, About-section frameworks, and a featured-section visual kit.",
    longDescription:
      "Everything to rebuild your LinkedIn profile in an afternoon: 25 headline templates, 8 About-section frameworks, banner image templates in Figma, and a featured-section visual kit. Includes recruiter-keyword cheat sheet by industry.",
    price: 22,
    originalPrice: 35,
    currency: "USD",
    category: "Resume & Career Templates",
    tags: ["LinkedIn", "personal brand", "job search"],
    image: "from-success-500 to-accent-500",
    rating: 4.6,
    reviewCount: 280,
    salesCount: 740,
    platform: "gumroad",
    affiliateUrl: "https://utilityapps.gumroad.com/l/linkedin-makeover?affiliate=utilityapps",
    featured: false,
    bestseller: false,
    new: true,
    features: [
      "25 headline templates",
      "8 About-section frameworks",
      "Figma banner templates",
      "Recruiter keyword cheat sheet",
    ],
    reviews: [
      r("Mei L.", 5, "Profile views 5x'd in two weeks.", "2026-04-25"),
      r("Owen H.", 4, "Useful but the Figma file took me longer to customize than expected.", "2026-04-11"),
      r("Bea S.", 5, "The keyword cheat sheet is the secret weapon.", "2026-03-29"),
    ],
  },

  // ---------- Social Media Kits (4) ----------
  {
    id: "instagram-post-kit",
    name: "Instagram Carousel Pack — 100 Templates",
    description: "100 editable Canva carousels for creators, coaches, and small brands.",
    longDescription:
      "100 high-converting Instagram carousel templates in Canva. Categories: educational, listicle, story, hook + payoff, and case study. All templates use the same color system so a brand swap takes 60 seconds.",
    price: 27,
    originalPrice: 49,
    currency: "USD",
    category: "Social Media Kits",
    tags: ["Instagram", "carousel", "Canva", "social media"],
    image: "from-accent-500 to-warning-500",
    rating: 4.8,
    reviewCount: 1_540,
    salesCount: 4_900,
    platform: "etsy",
    affiliateUrl: "https://www.etsy.com/listing/instagram-carousel-pack?ref=utilityapps",
    featured: true,
    bestseller: true,
    new: false,
    features: [
      "100 editable Canva carousels",
      "5 content categories",
      "60-second brand-swap system",
      "Mobile + desktop preview",
    ],
    reviews: [
      r("Tash R.", 5, "Carousels do 3x my old post engagement. This is the easiest yes I've made for my biz.", "2026-04-20"),
      r("Mateo V.", 5, "Clean, modern, and not overdone. Bought a Canva subscription just for these.", "2026-04-05"),
      r("Iris J.", 4, "Wish there were more vertical-specific examples but the base templates are great.", "2026-03-15"),
    ],
  },
  {
    id: "tiktok-script-pack",
    name: "TikTok Script Pack",
    description: "60 short-form scripts and 100 hook formulas for organic reach.",
    longDescription:
      "60 fully written TikTok / Reels scripts across 6 niches (fitness, finance, food, fashion, parenting, tech). Plus 100 hook formulas with examples that pulled 1M+ views. Updated monthly with new trending formats.",
    price: 19,
    originalPrice: 29,
    currency: "USD",
    category: "Social Media Kits",
    tags: ["TikTok", "Reels", "scripts", "short-form"],
    image: "from-warning-500 to-accent-500",
    rating: 4.7,
    reviewCount: 880,
    salesCount: 2_650,
    platform: "gumroad",
    affiliateUrl: "https://utilityapps.gumroad.com/l/tiktok-script-pack?affiliate=utilityapps",
    featured: false,
    bestseller: true,
    new: false,
    features: [
      "60 ready-to-film scripts",
      "100 hook formulas with viral examples",
      "Monthly updates",
      "Hooks tagged by niche",
    ],
    reviews: [
      r("Riya P.", 5, "First Reel using the templates hit 200K. Not luck.", "2026-04-28"),
      r("Felix B.", 4, "Solid scripts. Some hooks need tweaks for B2B.", "2026-04-10"),
      r("Cara N.", 5, "The monthly trends update is what sold me.", "2026-03-22"),
    ],
  },
  {
    id: "twitter-x-toolkit",
    name: "X (Twitter) Growth Toolkit",
    description: "Thread frameworks, reply scripts, and a 30-day content calendar.",
    longDescription:
      "Everything to grow on X without dancing for the algorithm: 25 thread frameworks, 15 reply scripts that get reach, a 30-day content calendar with prompts, and a Notion content board to plan everything.",
    price: 17,
    originalPrice: 25,
    currency: "USD",
    category: "Social Media Kits",
    tags: ["Twitter", "X", "threads", "growth"],
    image: "from-primary-500 to-accent-500",
    rating: 4.7,
    reviewCount: 410,
    salesCount: 1_120,
    platform: "gumroad",
    affiliateUrl: "https://utilityapps.gumroad.com/l/twitter-x-toolkit?affiliate=utilityapps",
    featured: false,
    bestseller: false,
    new: true,
    features: [
      "25 thread frameworks",
      "15 reply scripts",
      "30-day content calendar",
      "Notion content board",
    ],
    reviews: [
      r("Sam G.", 5, "Took my account from 800 to 9k followers in two months. Real receipts.", "2026-04-30"),
      r("Olu M.", 4, "Reply scripts are 🔥. Threads are good if you're B2B.", "2026-04-15"),
      r("Pia D.", 5, "Worth it for the content board alone.", "2026-04-02"),
    ],
  },
  {
    id: "youtube-thumbnail-pack",
    name: "YouTube Thumbnail Pack — 80 Templates",
    description: "Hand-built Photoshop and Canva thumbnails optimized for CTR.",
    longDescription:
      "80 thumbnail templates split between Photoshop (.psd) and Canva, organized by genre: tutorial, listicle, vlog, finance, tech review, and challenge. Includes a 4-page guide on what actually drives CTR in 2026.",
    price: 22,
    originalPrice: 35,
    currency: "USD",
    category: "Social Media Kits",
    tags: ["YouTube", "thumbnails", "Photoshop", "Canva"],
    image: "from-warning-500 to-success-500",
    rating: 4.6,
    reviewCount: 320,
    salesCount: 980,
    platform: "etsy",
    affiliateUrl: "https://www.etsy.com/listing/youtube-thumbnail-pack?ref=utilityapps",
    featured: false,
    bestseller: false,
    new: false,
    features: [
      "80 templates (PSD + Canva)",
      "6 genre-based categories",
      "CTR strategy guide",
      "Photoshop and Canva versions",
    ],
    reviews: [
      r("Jules K.", 5, "CTR went from 5% to 9% within a few weeks. Easy money.", "2026-04-10"),
      r("Marcus W.", 4, "Love the templates. Wish there were more dark-mode variants.", "2026-03-20"),
      r("Esme L.", 5, "Clean designs that don't look like fiverr stock.", "2026-03-05"),
    ],
  },

  // ---------- Finance & Business Templates (4) ----------
  {
    id: "freelance-finance-pack",
    name: "Freelance Finance Pack",
    description: "Tax, invoice, and rate calculators in a single Notion + spreadsheet bundle.",
    longDescription:
      "Everything a freelancer needs to handle money: a quarterly-tax projector, an invoice template that auto-calculates VAT/GST, a rate calculator that backs into your target take-home, and a Notion business dashboard. US, UK, CA, EU presets.",
    price: 19,
    originalPrice: 35,
    currency: "USD",
    category: "Finance & Business Templates",
    tags: ["freelance", "tax", "invoice", "Notion", "spreadsheet"],
    image: "from-success-500 to-primary-500",
    rating: 4.8,
    reviewCount: 540,
    salesCount: 1_900,
    platform: "gumroad",
    affiliateUrl: "https://utilityapps.gumroad.com/l/freelance-finance-pack?affiliate=utilityapps",
    featured: true,
    bestseller: true,
    new: false,
    features: [
      "Quarterly tax projector",
      "VAT/GST-aware invoice template",
      "Rate calculator with target take-home",
      "Notion business dashboard",
      "US, UK, CA, EU presets",
    ],
    reviews: [
      r("Ravi B.", 5, "I was undercharging by 30%. The rate calculator alone paid for this 100x over.", "2026-04-22"),
      r("Sienna F.", 5, "Tax projector saved me a quarterly surprise. Buy this.", "2026-04-08"),
      r("Henry J.", 4, "Notion dashboard is nicely built. EU VAT is fiddly but the templates handle it.", "2026-03-25"),
    ],
  },
  {
    id: "small-business-toolkit",
    name: "Small Business Operations Toolkit",
    description: "SOP templates, hiring scorecards, and a financial dashboard for sub-$1M businesses.",
    longDescription:
      "Built for owner-operated businesses doing $50K–$1M/year: 12 SOP templates, hiring scorecards, a financial dashboard, and a 30-page playbook on running the business without it running you.",
    price: 39,
    originalPrice: 69,
    currency: "USD",
    category: "Finance & Business Templates",
    tags: ["SOP", "operations", "small business", "hiring"],
    image: "from-success-500 to-warning-500",
    rating: 4.7,
    reviewCount: 290,
    salesCount: 720,
    platform: "shopify",
    affiliateUrl: "https://utilityapps.shopify.com/products/small-business-toolkit?ref=utilityapps",
    featured: false,
    bestseller: false,
    new: false,
    features: [
      "12 SOP templates",
      "Hiring scorecards",
      "Financial dashboard",
      "30-page operator playbook",
    ],
    reviews: [
      r("Alana C.", 5, "First week of using the SOPs and my team stopped Slacking me at 9pm. That's the ROI.", "2026-04-15"),
      r("Drew T.", 4, "Good for a small team. Outgrew it once we hit ~20 people.", "2026-04-01"),
      r("Kira N.", 5, "The hiring scorecard helped us close two roles in three weeks.", "2026-03-18"),
    ],
  },
  {
    id: "startup-pitch-deck",
    name: "Startup Pitch Deck Templates",
    description: "10 founder-tested pitch deck templates with annotated slide-by-slide notes.",
    longDescription:
      "10 pitch deck templates from real seed and Series A raises. Each slide has annotations explaining what investors look for and what to avoid. Keynote, PowerPoint, and Google Slides versions.",
    price: 49,
    originalPrice: 79,
    currency: "USD",
    category: "Finance & Business Templates",
    tags: ["pitch deck", "startup", "fundraising", "Keynote", "Slides"],
    image: "from-primary-500 to-warning-500",
    rating: 4.8,
    reviewCount: 220,
    salesCount: 510,
    platform: "gumroad-affiliate",
    affiliateUrl: "https://gumroad.com/a/123456789/startup-pitch-deck?utm=utilityapps",
    featured: false,
    bestseller: false,
    new: true,
    features: [
      "10 founder-tested templates",
      "Slide-by-slide annotations",
      "Keynote / PowerPoint / Slides",
      "Investor-focused storytelling guide",
    ],
    reviews: [
      r("Imani O.", 5, "Used the SaaS template to close our seed. Annotations are gold.", "2026-04-28"),
      r("Theo R.", 4, "Strong frameworks. Less helpful for non-tech raises.", "2026-04-10"),
      r("Vihaan G.", 5, "The 'why now' slide guide is worth the price.", "2026-03-22"),
    ],
  },
  {
    id: "product-launch-playbook",
    name: "Product Launch Playbook + Templates",
    description: "60-day launch calendar, email sequences, and a Notion command center.",
    longDescription:
      "A complete product launch system used to ship 4 launches at $100K+. Includes a 60-day calendar, 12 email sequences, social copy templates, and a Notion command center to keep everything in one place.",
    price: 29,
    originalPrice: 49,
    currency: "USD",
    category: "Finance & Business Templates",
    tags: ["product launch", "marketing", "Notion"],
    image: "from-warning-500 to-primary-500",
    rating: 4.6,
    reviewCount: 180,
    salesCount: 460,
    platform: "gumroad",
    affiliateUrl: "https://utilityapps.gumroad.com/l/product-launch-playbook?affiliate=utilityapps",
    featured: false,
    bestseller: false,
    new: false,
    features: [
      "60-day launch calendar",
      "12 email sequences",
      "Social copy templates",
      "Notion command center",
    ],
    reviews: [
      r("Lilou A.", 5, "Used this for a $48K launch. The email sequences pulled their weight.", "2026-04-19"),
      r("Casper E.", 4, "Solid. Some advice is over-tuned to SaaS.", "2026-04-02"),
      r("Nina M.", 5, "The command center is the part I keep using.", "2026-03-15"),
    ],
  },

  // ---------- Design & UI Kits (4) ----------
  {
    id: "ui-component-library",
    name: "Tailwind UI Component Library",
    description: "200+ Tailwind components in React, Vue, and HTML — copy-paste ready.",
    longDescription:
      "A handcrafted Tailwind UI library with 200+ components: hero sections, pricing tables, dashboards, auth forms, and more. React, Vue, and plain HTML versions with dark-mode support and accessibility baked in.",
    price: 59,
    originalPrice: 99,
    currency: "USD",
    category: "Design & UI Kits",
    tags: ["Tailwind", "components", "React", "Vue"],
    image: "from-accent-500 to-primary-500",
    rating: 4.9,
    reviewCount: 720,
    salesCount: 2_140,
    platform: "gumroad",
    affiliateUrl: "https://utilityapps.gumroad.com/l/ui-component-library?affiliate=utilityapps",
    featured: true,
    bestseller: true,
    new: false,
    features: [
      "200+ components",
      "React, Vue, and HTML versions",
      "Dark mode + a11y baked in",
      "Free updates for 12 months",
    ],
    reviews: [
      r("Akira S.", 5, "Easily replaces the $250+ libraries. Code quality is great.", "2026-04-14"),
      r("Mira V.", 5, "Built a marketing site in a weekend. Worth every dollar.", "2026-03-30"),
      r("Joaquín H.", 4, "Wish more dashboard layouts existed. Otherwise excellent.", "2026-03-12"),
    ],
  },
  {
    id: "icon-set-1000",
    name: "Studio Icon Set — 1,000 Icons",
    description: "1,000 hand-crafted icons in SVG, React, and Figma — 4 weights.",
    longDescription:
      "1,000 icons across 16 categories, drawn at 4 stroke weights for visual consistency. Ships as SVG, React, and a fully tagged Figma library. Free updates for 12 months.",
    price: 39,
    originalPrice: 59,
    currency: "USD",
    category: "Design & UI Kits",
    tags: ["icons", "SVG", "Figma", "React"],
    image: "from-primary-500 to-accent-500",
    rating: 4.8,
    reviewCount: 530,
    salesCount: 1_640,
    platform: "etsy",
    affiliateUrl: "https://www.etsy.com/listing/studio-icon-set?ref=utilityapps",
    featured: false,
    bestseller: true,
    new: false,
    features: [
      "1,000 icons in 16 categories",
      "4 stroke weights",
      "SVG, React, and Figma",
      "12 months of free updates",
    ],
    reviews: [
      r("Hana B.", 5, "More consistent than the big icon libraries. The 4 weights are the killer feature.", "2026-04-18"),
      r("Owen C.", 4, "Great icons. Some categories are thinner than others.", "2026-04-04"),
      r("Sofia P.", 5, "Replaced two icon libraries with this one.", "2026-03-22"),
    ],
  },
  {
    id: "notion-dashboard-pack",
    name: "Notion Dashboard Pack",
    description: "12 designed Notion dashboards for life, work, and side projects.",
    longDescription:
      "12 fully designed Notion dashboards covering life OS, project tracker, content calendar, reading list, finance, fitness, and more. Light and dark mode optimized layouts.",
    price: 25,
    originalPrice: 39,
    currency: "USD",
    category: "Design & UI Kits",
    tags: ["Notion", "dashboard", "templates", "productivity"],
    image: "from-accent-500 to-primary-500",
    rating: 4.7,
    reviewCount: 410,
    salesCount: 1_220,
    platform: "gumroad",
    affiliateUrl: "https://utilityapps.gumroad.com/l/notion-dashboard-pack?affiliate=utilityapps",
    featured: false,
    bestseller: false,
    new: true,
    features: [
      "12 ready-to-use dashboards",
      "Life, work, and side-project layouts",
      "Light + dark mode optimized",
    ],
    reviews: [
      r("Nilo F.", 5, "The life OS dashboard finally got me to stick with Notion.", "2026-04-26"),
      r("Aïsha R.", 4, "Good designs. Some require a paid Notion plan to fully use.", "2026-04-12"),
      r("Mateo S.", 5, "Stopped using a different paid Notion bundle for these.", "2026-03-30"),
    ],
  },
  {
    id: "figma-mockup-pack",
    name: "Figma Mockup Pack — 80 Devices",
    description: "Pixel-perfect mockups for iPhone, Android, MacBook, iPad, and web.",
    longDescription:
      "80 device mockups in Figma covering current iPhone, Android, MacBook, iPad, and a set of browser mockups. Includes a smart-component setup so swapping screens takes one click.",
    price: 29,
    originalPrice: 49,
    currency: "USD",
    category: "Design & UI Kits",
    tags: ["Figma", "mockups", "device", "design"],
    image: "from-primary-500 to-warning-500",
    rating: 4.7,
    reviewCount: 280,
    salesCount: 760,
    platform: "etsy",
    affiliateUrl: "https://www.etsy.com/listing/figma-mockup-pack?ref=utilityapps",
    featured: false,
    bestseller: false,
    new: false,
    features: [
      "80 high-fidelity device mockups",
      "Smart components for one-click screen swap",
      "Current iPhone, Android, MacBook, iPad",
      "Browser + tablet mockups",
    ],
    reviews: [
      r("Rin T.", 5, "Every product launch goes through these mockups now.", "2026-04-08"),
      r("Tamir J.", 4, "Need a new Pixel mockup but otherwise great.", "2026-03-19"),
      r("Cleo H.", 5, "Smart components are a dream. Saves hours.", "2026-03-04"),
    ],
  },
];

export const PRODUCTS_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p])
);

export const PRODUCT_CATEGORIES: string[] = Array.from(
  new Set(PRODUCTS.map((p) => p.category))
);

export function getProductById(id: string): Product | undefined {
  return PRODUCTS_BY_ID[id];
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts(limit: number = 4): Product[] {
  return PRODUCTS.filter((p) => p.featured).slice(0, limit);
}

export function getBestsellerProducts(limit: number = 3): Product[] {
  return PRODUCTS.filter((p) => p.bestseller).slice(0, limit);
}

export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const product = PRODUCTS_BY_ID[productId];
  if (!product) return [];
  return PRODUCTS.filter((p) => p.id !== productId && p.category === product.category)
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, limit);
}

/** Backwards-compat alias used by the homepage. */
export const FEATURED_PRODUCTS = getFeaturedProducts(4);
