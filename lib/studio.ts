/**
 * Content registry for the /studio services page.
 *
 * Pricing is INTENTIONALLY absent from every entry. The marketing rule is:
 * pricing is discussed only in the discovery call. If you change that, do
 * it in one place — here — and audit the page after for hardcoded ranges.
 */

import type {
  StudioBudget,
  StudioCompanySize,
  StudioContactPref,
  StudioTimeline,
} from "./supabase";

// ── Config ─────────────────────────────────────────────────────────────────

export const STUDIO_EMAIL = process.env.NEXT_PUBLIC_STUDIO_EMAIL || "studio@utilityapps.site";
export const STUDIO_CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/makonordan/30min";
/** Raw E.164 digits, no plus. Used to build wa.me links. The default is
 *  Daniel's direct WhatsApp Business line for immediate-response inbound. */
export const STUDIO_WHATSAPP = process.env.NEXT_PUBLIC_STUDIO_WHATSAPP || "2348037723164";

export function whatsappLink(prefilledText?: string): string {
  const base = `https://wa.me/${STUDIO_WHATSAPP}`;
  return prefilledText ? `${base}?text=${encodeURIComponent(prefilledText)}` : base;
}

/** Pretty-prints the WhatsApp number as "+CC NNN NNN NNNN" for display.
 *  Assumes Nigerian +234 format by default; falls back to a `+`-prefixed
 *  digit string if the number isn't 13 digits long. */
export function formatWhatsapp(digits: string = STUDIO_WHATSAPP): string {
  const d = digits.replace(/\D+/g, "");
  if (d.length === 13 && d.startsWith("234")) {
    return `+234 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9, 13)}`;
  }
  return `+${d}`;
}

export function calendlyLinkFor(topic?: string): string {
  if (!topic) return STUDIO_CALENDLY_URL;
  const sep = STUDIO_CALENDLY_URL.includes("?") ? "&" : "?";
  return `${STUDIO_CALENDLY_URL}${sep}a1=${encodeURIComponent(topic)}`;
}

/** Industries Daniel has shipped software, data, or AI work in. Surfaced on
 *  the portfolio section's confidentiality callout — public tools are the
 *  showcase, but most actual client work is NDA-bound and lives across
 *  these verticals. Keep in priority/familiarity order (most experience
 *  first) — the page renders them as pills in this order. */
export const EXPERIENCE_INDUSTRIES = [
  "Telecoms",
  "Healthcare",
  "Education",
  "Consulting",
  "Finance",
  "Oil and Gas",
  "Ecommerce",
] as const;

// ── Services (4 cards) ─────────────────────────────────────────────────────

export interface StudioService {
  id: string;
  /** Lucide icon name — resolved via getIcon in the rendering layer. */
  icon: string;
  title: string;
  description: string;
  /** Real-world example italicized under the description. */
  example: string;
  /** Honest delivery-time estimate. NO pricing here. */
  delivery: string;
}

export const SERVICES: StudioService[] = [
  {
    id: "digital-products",
    icon: "Package",
    title: "Digital Products & Tools",
    description:
      "Branded calculators, ROI engines, quote generators, recommendation tools, automated proposal and contract builders, invoice systems — anything that turns user inputs into useful, on-brand outputs you can ship to customers or use internally.",
    example:
      "A real estate agency with a branded mortgage calculator plus lead capture; or a consultancy whose intake form auto-generates client-specific proposal PDFs.",
    delivery: "Typically 1–3 weeks",
  },
  {
    id: "webapp-app-dev",
    icon: "Globe",
    title: "Web Apps & App Development",
    description:
      "Full custom web applications and mobile apps — from MVPs validating a new business idea to internal SaaS platforms. Auth, payments, user dashboards, admin tools, API integrations, hosting. Built to be owned and extended by your team.",
    example:
      "A startup that needs a working MVP to take to investors; or an operations team replacing a tangle of spreadsheets with a single internal web app.",
    delivery: "Typically 4–8 weeks",
  },
  {
    id: "dashboards",
    icon: "LayoutDashboard",
    title: "Internal Dashboards & Operations Tools",
    description:
      "Custom dashboards for tracking what matters to your business. Operational tools for managing workflows. Data visualization for executives. Automated reporting that replaces hours of manual work.",
    example:
      "An accounting firm that needs a client-facing portal showing financial summaries, document uploads, and payment status.",
    delivery: "Typically 3–4 weeks",
  },
  {
    id: "ai",
    icon: "Sparkles",
    title: "AI-Powered Business Tools",
    description:
      "AI integrations for your existing workflow. ChatGPT-powered customer support. Document analysis tools. AI-assisted content generation. Custom AI features that actually solve business problems — not gimmicks.",
    example:
      "A small business that wants AI-generated personalized customer emails based on order history and previous interactions.",
    delivery: "Typically 2–4 weeks",
  },
];

// ── Industries (6 cards) ───────────────────────────────────────────────────

export interface StudioIndustry {
  id: string;
  icon: string;
  name: string;
  description: string;
  /** Pre-fills the Calendly topic when this card is clicked. */
  calendlyTopic: string;
}

export const INDUSTRIES: StudioIndustry[] = [
  {
    id: "real-estate",
    icon: "Home",
    name: "Real Estate Agencies",
    description: "Branded mortgage calculators, ROI tools, lead capture systems.",
    calendlyTopic: "Tools for real estate",
  },
  {
    id: "financial",
    icon: "TrendingUp",
    name: "Financial Advisors",
    description:
      "Retirement planning, client portals, tax estimators, net worth trackers.",
    calendlyTopic: "Tools for financial advisors",
  },
  {
    id: "hr",
    icon: "Users",
    name: "HR Consultancies",
    description:
      "Salary negotiation tools, offer letter generators, performance review systems.",
    calendlyTopic: "Tools for HR firms",
  },
  {
    id: "education",
    icon: "GraduationCap",
    name: "Educational Institutions",
    description:
      "Student information systems, fee payment portals, admissions platforms.",
    calendlyTopic: "Tools for schools",
  },
  {
    id: "healthcare",
    icon: "Stethoscope",
    name: "Healthcare Practices",
    description: "Appointment booking, patient intake forms, prescription generators.",
    calendlyTopic: "Tools for medical practices",
  },
  {
    id: "construction",
    icon: "HardHat",
    name: "Construction Firms",
    description: "Quote generators, project tracking, material calculators.",
    calendlyTopic: "Tools for construction",
  },
];

// ── Process (4 steps) ──────────────────────────────────────────────────────

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const PROCESS: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery Call (30 min, free)",
    description:
      "You tell us what you're building and why. We tell you honestly whether we can help, what it'll cost, and how long it'll take. No pressure. No sales tactics. If we're not the right fit, we'll tell you who is.",
  },
  {
    number: "02",
    title: "Scoped Proposal (within 48 hours)",
    description:
      "We send a fixed-price proposal covering exact deliverables, timeline, and milestones. You know the total cost upfront. No surprise invoices, no scope creep, no hourly billing games.",
  },
  {
    number: "03",
    title: "Build (2–6 weeks typical)",
    description:
      "We build with weekly check-ins. You see progress as it happens — not just at the end. Changes within original scope are included. You're never wondering what we're working on.",
  },
  {
    number: "04",
    title: "Delivery + 30 Days of Support",
    description:
      "We deliver the final product, train your team if needed, and provide 30 days of bug fixes and minor adjustments at no extra cost. You own the source code completely.",
  },
];

// ── Portfolio (6 cards — links to existing UtilityApps tools) ──────────────

export interface PortfolioItem {
  toolId: string;
  title: string;
  description: string;
  tech: string[];
  href: string;
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    toolId: "mortgage-calculator",
    title: "Mortgage Calculator with PMI & Tax",
    description:
      "Full mortgage calculation with PMI, taxes, insurance, and amortization schedule.",
    tech: ["Next.js", "TypeScript", "Recharts"],
    href: "/tools/mortgage-calculator",
  },
  {
    toolId: "salary-calculator",
    title: "Salary Calculator (US / UK / Canada)",
    description:
      "Take-home pay calculations across 50 US states, all UK regions, and Canadian provinces.",
    tech: ["Next.js", "TypeScript", "Complex calculations"],
    href: "/tools/salary-calculator",
  },
  {
    toolId: "remove-background",
    title: "AI Background Remover",
    description:
      "Removes image backgrounds using AI in under 3 seconds, all in the browser.",
    tech: ["Next.js", "Remove.bg API", "Image processing"],
    href: "/tools/remove-background",
  },
  {
    toolId: "pdf-to-word",
    title: "PDF to Word Converter",
    description:
      "Converts PDF files to editable Word documents while preserving formatting.",
    tech: ["Next.js", "ConvertAPI", "File processing"],
    href: "/tools/pdf-to-word",
  },
  {
    toolId: "currency-converter",
    title: "Currency Converter (Live Rates)",
    description:
      "Real-time currency conversion across 170+ currencies with cached rates.",
    tech: ["Next.js", "ExchangeRate-API", "Edge caching"],
    href: "/tools/currency-converter",
  },
  {
    toolId: "citation-generator",
    title: "Citation Generator",
    description:
      "Academic citation generator supporting APA, MLA, Chicago, and Harvard formats.",
    tech: ["Next.js", "Template generation", "PDF export"],
    href: "/tools/citation-generator",
  },
];

// ── FAQ ────────────────────────────────────────────────────────────────────
// IMPORTANT: pricing is discussed only on the discovery call. The "How is
// pricing structured?" answer below mentions fixed-price + no hourly billing
// — that's process, not numbers. Do NOT add a price range here.

export interface StudioFAQItem {
  q: string;
  a: string;
}

export const FAQ: StudioFAQItem[] = [
  {
    q: "What technologies do you build with?",
    a: "Next.js, TypeScript, Tailwind CSS, Supabase, Vercel, and various AI APIs (OpenAI, Anthropic, others as needed). Modern stack that's fast, maintainable, and easy for any developer to take over later.",
  },
  {
    q: "Can you work with our existing systems?",
    a: "Yes. We integrate with existing databases, CRMs (Salesforce, HubSpot, Zoho), payment systems (Stripe, Paystack, Flutterwave), email platforms (Mailchimp, Resend, SendGrid), or any tool with a public API.",
  },
  {
    q: "How is pricing structured?",
    a: "All projects are fixed-price, scoped specifically to your needs during the discovery call. You'll know your total cost before signing. We don't do hourly billing or surprise invoices. Every quote is custom and shared after we understand your project.",
  },
  {
    q: "Do you offer maintenance after delivery?",
    a: "Yes. 30 days of bug fixes and minor adjustments are included free. Ongoing maintenance and feature development contracts are available as monthly retainers — scoped during your discovery call.",
  },
  {
    q: "What if I need changes mid-project?",
    a: "Changes within original scope are included. Changes that expand scope are priced fairly and approved by you before we proceed. No surprises, ever.",
  },
  {
    q: "Where are you based and what time zones do you work in?",
    a: "We're based in Lagos, Nigeria (West Africa, GMT+1). We work with clients across US, UK, Europe, and Africa. Our schedule overlaps with US Eastern morning, UK afternoon, and most African time zones for real-time collaboration.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes, absolutely. Mutual NDA at no charge. Your business information stays confidential throughout and after the project.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Bank transfers (Nigerian Naira or USD), Stripe (international cards), Paystack (Nigerian + African cards), PayPal, and Wise. 50% deposit to start, 50% on delivery. Larger projects can be structured into milestone payments.",
  },
  {
    q: "How long does the average project take?",
    a: "Simple tools and calculators: 1–2 weeks. Mid-complexity dashboards and document systems: 2–4 weeks. Full custom internal applications: 4–8 weeks. We give specific timelines in the proposal after the discovery call.",
  },
  {
    q: "Can we see references from past clients?",
    a: "After the discovery call, and once we mutually agree to move forward, we'll connect you with relevant past projects in your industry or with similar project types.",
  },
  {
    q: "What happens if we're not happy with the work?",
    a: "We work in weekly iterations with your feedback at each stage, so 'final delivery surprise' shouldn't happen. If you're not happy with specific aspects, we fix them within the original scope. If something fundamentally isn't working, we have a fair refund policy outlined in the contract.",
  },
  {
    q: "Why work with you instead of a US agency?",
    a: "Three reasons: speed (we deliver faster with AI-augmented development), cost (we have lower overhead), and direct access (you work with the founder, not a project manager). Our work quality matches US agency standards — we just don't carry US agency costs.",
  },
];

// ── Form helpers ───────────────────────────────────────────────────────────

export const COMPANY_SIZE_OPTIONS: { value: StudioCompanySize; label: string }[] = [
  { value: "solo", label: "Solo (just me)" },
  { value: "small", label: "Small (2–10)" },
  { value: "medium", label: "Medium (11–50)" },
  { value: "large", label: "Large (51+)" },
];

export const TIMELINE_OPTIONS: { value: StudioTimeline; label: string }[] = [
  { value: "asap", label: "ASAP" },
  { value: "within_month", label: "Within a month" },
  { value: "within_quarter", label: "Within a quarter" },
  { value: "exploring", label: "Just exploring" },
];

export const BUDGET_OPTIONS: { value: StudioBudget; label: string }[] = [
  { value: "under_5k", label: "Under $5K" },
  { value: "5k_15k", label: "$5K – $15K" },
  { value: "15k_50k", label: "$15K – $50K" },
  { value: "over_50k", label: "Over $50K" },
  { value: "open", label: "Open / not sure" },
];

export const CONTACT_PREF_OPTIONS: { value: StudioContactPref; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "video_call", label: "Video call" },
  { value: "whatsapp", label: "WhatsApp" },
];

export const INDUSTRY_OPTIONS = [
  "Real Estate",
  "Financial Services",
  "HR",
  "Healthcare",
  "Education",
  "Construction",
  "Other",
];

export const PROJECT_TYPE_OPTIONS = [
  "Digital Product or Tool",
  "Web App / App Development",
  "Internal Dashboard",
  "AI-Powered Tool",
  "Something else",
];
