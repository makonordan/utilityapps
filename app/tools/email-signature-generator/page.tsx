import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  DollarSign,
  Mail,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { EmailSignatureGenerator } from "@/components/business-tools/EmailSignatureGenerator";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getCategoryByName } from "@/lib/categories";
import { getIcon } from "@/lib/icons";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * /tools/email-signature-generator landing page.
 *
 * Server component — hero, ads, SEO body, FAQ, and related-tools rails
 * render once at build time. The actual generator (form + preview +
 * copy/install) is the <EmailSignatureGenerator /> client island in
 * the middle.
 *
 * Uses the site-wide TOOLS_BY_ID entry as the source of truth for
 * name/description/keywords so this file doesn't drift from the tool
 * catalog. Icon and category accent flow from lib/icons and
 * lib/categories the same way every other tool page does.
 */

const TOOL_ID = "email-signature-generator";
const tool = TOOLS_BY_ID[TOOL_ID];

const TITLE = "Free Email Signature Generator — Gmail & More";
const DESCRIPTION =
  "Create a professional HTML email signature free. Works in Gmail, Outlook, Apple Mail and Yahoo. Add your photo, logo, and social links. Copy-paste ready — no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: tool?.keywords ?? [],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: "Free Email Signature Generator — Copy-paste ready",
    description:
      "Professional HTML email signature that works in Gmail, Outlook, Apple Mail and Yahoo. 8 templates, live preview, no signup.",
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent("Free Email Signature Generator")}&description=${encodeURIComponent("Gmail, Outlook, Apple Mail, Yahoo — one signature")}&type=tool`,
        width: 1200,
        height: 630,
        alt: "Free Email Signature Generator — UtilityApps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// ── FAQ content — kept in one place so the FAQPage JSON-LD schema and
//    the rendered <FAQ> block stay in sync. ─────────────────────────────

const FAQS: { question: string; answer: string }[] = [
  {
    question: "Is this email signature generator free?",
    answer:
      "Yes, completely free. There's no signup, no watermark, no daily limit, and no paid tier. Fill in the form, copy the signature, paste it into your email client — that's the whole flow. UtilityApps is free to use forever.",
  },
  {
    question: "Will my signature work in Outlook?",
    answer:
      "Yes. Outlook desktop is the strictest email client on the market — it renders HTML using the Microsoft Word engine — so this tool outputs bulletproof, table-based markup designed specifically for it. For the most reliable install in Outlook desktop, use the 'Download .htm file' button and import the file via Outlook's Signature dialog rather than pasting from the clipboard.",
  },
  {
    question: "Will it work in Gmail?",
    answer:
      "Yes. Gmail is one of the easiest clients to install into: click 'Copy signature', then paste it into Gmail's Settings → General → Signature editor. Gmail preserves the formatting and renders identical output on the web, iOS, and Android.",
  },
  {
    question: "Why does my photo look square in Outlook?",
    answer:
      "Outlook desktop ignores the `border-radius` CSS property that makes photos appear circular in every other email client. This is a documented limitation of the Word rendering engine, not a bug in our tool. The photo still appears — just as a square instead of a circle. If a circular photo is critical, upload a photo that's already been circle-cropped and saved as a transparent PNG.",
  },
  {
    question: "Do I need to host my photo somewhere?",
    answer:
      "Yes — email clients block base64-embedded images (they treat them as spam), so photos must be referenced by a public URL. You have two paths in this tool: upload the photo through our form (it's compressed to under 50 KB and hosted for free on Supabase Storage under your account) or paste the URL of a photo you already host somewhere public like Cloudinary, S3, or your own site.",
  },
  {
    question: "Can I use my company logo?",
    answer:
      "Yes. The 'Photo & Logo' section has a dedicated logo upload alongside the profile photo. Some templates — Logo Focus in particular — feature the company logo prominently instead of the personal headshot. Same rules as the photo apply: it must be publicly hosted (upload here or paste a URL).",
  },
  {
    question: "How do I add the signature to Gmail?",
    answer:
      "Click 'Copy signature' on this page, open Gmail, click the gear icon → See all settings → General tab → scroll to Signature. Click 'Create new', paste with Ctrl+V (or ⌘+V on Mac), set it as the default for new emails and replies, then click Save Changes. Full step-by-step instructions live in the Gmail tab below the copy buttons.",
  },
  {
    question: "How do I add it to Outlook?",
    answer:
      "For Outlook desktop, download the .htm file from this page then import it via File → Options → Mail → Signatures → New. For Outlook on the web, open Settings → Mail → Compose and reply → New signature, paste the signature into the editor, and save. Full step-by-step instructions for both are in the Outlook (Desktop) and Outlook (Web) tabs below the copy buttons.",
  },
  {
    question: "Can I add social media icons?",
    answer:
      "Yes. The Social Links section supports LinkedIn, Twitter/X, Instagram, Facebook, YouTube, GitHub, WhatsApp, Calendly, and a generic Website link — up to 8 icons per signature. Icons render as 24×24 PNGs in the signature, linked to the URL you paste. As a best practice, keep it to 3–4 icons so the signature doesn't feel cluttered.",
  },
  {
    question: "Does this save my information?",
    answer:
      "No. Everything runs in your browser — the form values, the live preview, the HTML generation. Refresh the page and the form resets. The only thing that ever touches a server is images you choose to upload for hosting, which land in a public bucket so email clients can display them. We don't collect emails, don't track fields, don't have accounts or profiles for this tool.",
  },
];

// ── Related tools — link to the other Business Tools + QR generator
//    which many signature users also want. ────────────────────────────

const RELATED_TOOL_IDS = [
  "business-card",
  "invoice-generator",
  "qr-code-generator",
  "barcode-generator",
] as const;

export default function EmailSignatureGeneratorPage() {
  const category = tool ? getCategoryByName(tool.category) : undefined;
  const Icon = tool ? getIcon(tool.icon) : Mail;
  const accent = category?.color ?? "#2563EB";

  const breadcrumb = [
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}/tools` },
    {
      name: tool?.category ?? "Business Tools",
      url: category
        ? `${SITE_CONFIG.url}/tools/categories/${category.id}`
        : `${SITE_CONFIG.url}/tools`,
    },
    {
      name: tool?.name ?? "Email Signature Generator",
      url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool?.name ?? "Email Signature Generator",
    description: tool?.longDescription ?? DESCRIPTION,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any (Web)",
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <ScriptJsonLd data={breadcrumbJsonLd} />
      <ScriptJsonLd data={softwareJsonLd} />
      <ScriptJsonLd data={faqJsonLd} />
      <TrackToolVisit toolId={TOOL_ID} />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1 text-xs text-surface-500 dark:text-surface-400"
        >
          <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href="/tools"
            className="hover:text-primary-600 dark:hover:text-primary-400"
          >
            Tools
          </Link>
          <ChevronRight className="h-3 w-3" />
          {category && (
            <>
              <Link
                href={`/tools/categories/${category.id}`}
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                {tool?.category}
              </Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="font-medium text-surface-700 dark:text-surface-200">
            {tool?.name ?? "Email Signature Generator"}
          </span>
        </nav>

        {/* Hero */}
        <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-glow"
            style={{ backgroundColor: accent }}
          >
            {/* eslint-disable-next-line react-hooks/static-components */}
            <Icon className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {tool?.category ?? "Business Tools"}
            </p>
            <h1 className="mt-1 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
              Free Email Signature Generator
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-surface-600 dark:text-surface-300">
              Build a professional HTML email signature that renders correctly
              in Gmail, Outlook, Apple Mail, Yahoo, and every mobile client.
              Add your photo, company logo, contact details, and social links —
              live preview shows exactly what recipients will see. One click to
              copy, one paste to install.
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <TrustChip Icon={DollarSign}>Free</TrustChip>
              <TrustChip Icon={ShieldCheck}>No signup</TrustChip>
              <TrustChip Icon={Zap}>Copy-paste ready</TrustChip>
              <TrustChip Icon={Smartphone}>Mobile-friendly</TrustChip>
            </ul>
          </div>
        </header>

        {/* Top ad — placed between the hero and the tool so the ad load
            doesn't push the interactive component below the fold. */}
        <AdSlot position="top" className="mt-8" />

        {/* The generator */}
        <section className="mt-8">
          <EmailSignatureGenerator />
        </section>

        {/* Mid ad — after the tool + install instructions, before the
            long-form content. Gives ad viewability a boost since users
            who scroll past the tool are more engaged. */}
        <AdSlot position="mid" className="mt-10" />

        {/* SEO / long-form content */}
        <section className="mt-12 space-y-10">
          <ContentBlock
            title="Why a professional email signature matters"
            body={
              <>
                Every email you send is a tiny piece of branding. A clean,
                consistent signature carries your name, role, and a way to
                reach you into every reply chain your recipients forward, print,
                or forward again. For a founder or freelancer, that signature
                is often the second-most-visited piece of information about
                you after your website — quietly reinforcing who you are,
                where you work, and how to book more of your time. It's also
                the difference between an email that reads as personal and one
                that reads as spam: recipients trust senders who look
                identifiably human and identifiably corporate at the same
                time.
              </>
            }
          />
          <ContentBlock
            title="What makes an email signature render correctly"
            body={
              <>
                Email is not the web. Most mail clients don't support modern
                HTML or CSS — Outlook desktop still renders HTML using
                Microsoft Word's engine, Gmail strips <code>&lt;style&gt;</code>{" "}
                blocks and classes on load, and Yahoo drops arbitrary
                attributes. To get a signature that renders identically across
                every client, everything has to be built with the subset of
                HTML they all agree on: nested{" "}
                <code>&lt;table&gt;</code> elements for layout (no{" "}
                <code>&lt;div&gt;</code>, no flexbox, no grid), every style
                inline on the element (<code>style="…"</code>, never a{" "}
                <code>&lt;style&gt;</code> block), only web-safe fonts, and
                explicit width and height attributes on every image. This tool
                emits exactly that markup for you.
              </>
            }
          />
          <ContentBlock
            title="Why the same signature works across every email client"
            body={
              <>
                A lot of older signature guides recommend building different
                versions for Gmail versus Outlook. That advice is outdated.
                When you use table-based layouts with inline styles and
                public-URL images, the same HTML block renders correctly
                everywhere — Gmail, Outlook Web, Outlook Desktop, Apple Mail,
                Yahoo, Thunderbird, and every mobile mail app. One signature.
                One paste. No per-client versions to maintain. This is exactly
                what our generator produces, tested against the strictest
                client (Outlook Word engine) so the rest follow.
              </>
            }
          />
          <ContentBlock
            title="Best practices for a professional signature"
            body={
              <ul className="mt-1 space-y-2 pl-5 [list-style:disc]">
                <li>
                  Keep it under ~500 pixels wide. Anything wider forces
                  horizontal scrolling on mobile and gets awkwardly cropped
                  when users reply.
                </li>
                <li>
                  Limit yourself to 3–4 social icons. Every extra icon reduces
                  the odds someone clicks any of them, and clutters replies.
                </li>
                <li>
                  Use a professional, well-lit headshot — even a smartphone
                  selfie in good light beats a webcam still. Keep the crop
                  tight on your face.
                </li>
                <li>
                  Don't use huge images. A 200-pixel headshot at 40 KB reads
                  as sharp on retina screens; a 2 MB image bloats every reply
                  chain and gets stripped by corporate mail gateways.
                </li>
                <li>
                  Match your accent color to your brand or website, not a
                  default blue. Consistency is what makes a signature look
                  intentional.
                </li>
              </ul>
            }
          />
          <ContentBlock
            title="Common mistakes to avoid"
            body={
              <ul className="mt-1 space-y-2 pl-5 [list-style:disc]">
                <li>
                  <strong>Using Google Fonts</strong> — they don't work in
                  email. Every client either ignores them or falls back to a
                  system default, so your carefully-chosen typography reads
                  as Arial to most of your recipients. Stick to web-safe
                  fonts (Arial, Helvetica, Georgia, Verdana, Tahoma).
                </li>
                <li>
                  <strong>Base64-embedded images</strong> — Gmail blocks them
                  outright. Even when they load, they inflate every email by
                  the full image weight. Always reference images by a public
                  URL (upload here or use your own hosting).
                </li>
                <li>
                  <strong>Div-based layouts with CSS flexbox or grid</strong>{" "}
                  — Outlook desktop uses Microsoft Word to render HTML, and
                  Word has no idea what those are. Your carefully-aligned
                  design collapses into a single vertical stack.
                </li>
                <li>
                  <strong>Animated GIFs</strong> — Outlook desktop shows only
                  the first frame, so your looping animation reads as a
                  static image (usually a mid-loop frame that looks broken).
                </li>
                <li>
                  <strong>External stylesheets</strong> — Gmail strips{" "}
                  <code>&lt;link&gt;</code> tags at load. Any styles that
                  aren't inline on the element get dropped. Inline every
                  single style.
                </li>
              </ul>
            }
          />
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <header className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
              Frequently asked questions
            </h2>
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
              Short answers to the questions we hear most. Full step-by-step
              install guides live inside the tool above.
            </p>
          </header>
          <ul className="space-y-3">
            {FAQS.map((f) => (
              <li
                key={f.question}
                className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
              >
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
                  {f.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-600 dark:text-surface-300">
                  {f.answer}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Related */}
        <section className="mt-16">
          <header className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
              Related tools
            </h2>
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
              Other free tools people use alongside their email signature.
            </p>
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RELATED_TOOL_IDS.map((id) => {
              const t = TOOLS_BY_ID[id];
              if (!t) return null;
              const Ico = getIcon(t.icon);
              const cat = getCategoryByName(t.category);
              return (
                <Link
                  key={id}
                  href={t.href}
                  className="group flex flex-col rounded-2xl border border-surface-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ backgroundColor: cat?.color ?? "#0066FF" }}
                  >
                    {/* eslint-disable-next-line react-hooks/static-components */}
                    <Ico className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-surface-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                    {t.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-surface-600 dark:text-surface-300">
                    {t.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                    Try free <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Bottom ad */}
        <AdSlot position="bottom" className="mt-14" />
      </div>
    </>
  );
}

// ── Small helpers ────────────────────────────────────────────────────────

function ScriptJsonLd({ data }: { data: object }) {
  // Escape angle brackets so an unlucky </script> in the payload can't
  // break out of the tag. Matches the pattern used elsewhere on the site.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function TrustChip({
  Icon,
  children,
}: {
  Icon: typeof Zap;
  children: React.ReactNode;
}) {
  return (
    <li className="inline-flex items-center gap-1 rounded-full border border-surface-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-surface-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200">
      <Icon className="h-3 w-3 text-primary-500" />
      {children}
    </li>
  );
}

function ContentBlock({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900 sm:p-8">
      <h2 className="text-xl font-bold tracking-tight text-surface-900 sm:text-2xl dark:text-white">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-surface-600 dark:text-surface-300 sm:text-base">
        {body}
      </div>
    </article>
  );
}
