import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bitcoin,
  Calendar,
  Check,
  ChevronRight,
  Contact,
  DollarSign,
  Infinity as InfinityIcon,
  Link as LinkIcon,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Wifi,
  Zap,
} from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { QRCodeGenerator } from "@/components/business-tools/QRCodeGenerator";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getCategoryByName } from "@/lib/categories";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * /tools/qr-code-generator landing page.
 *
 * Server component — the hero, ads, SEO body, use-case grid, FAQ,
 * and related-tools rails render statically. The interactive QR
 * generator itself is the <QRCodeGenerator /> client island in the
 * middle.
 *
 * Positioning angle to lean on across the copy: our QR codes are
 * static, permanent, and unmetered. That contrasts every major
 * competitor that charges for "dynamic" codes which expire the moment
 * you stop paying. We flag this in the hero, in the SEO body's
 * static-vs-dynamic section, and in the FAQ.
 */

const TOOL_ID = "qr-code-generator";
const tool = TOOLS_BY_ID[TOOL_ID];

const TITLE = "Free QR Code Generator — URL, WiFi & More";
const DESCRIPTION =
  "Create free custom QR codes instantly. Generate QR codes for websites, WiFi, contact cards, WhatsApp, menus and more. Add your logo and colors. Download PNG or SVG. No signup, no expiry.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: tool?.keywords ?? [],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: "Free QR Code Generator — Static codes that never expire",
    description:
      "12 QR types, custom colours, logo embed, PNG/SVG export. Codes are static — no signup, no monthly limits, no tracking.",
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent("Free QR Code Generator")}&description=${encodeURIComponent("URL, WiFi, vCard, WhatsApp — codes that never expire")}&type=tool`,
        width: 1200,
        height: 630,
        alt: "Free QR Code Generator — UtilityApps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// ── FAQ — single source of truth for both the visible cards and the
//    FAQPage JSON-LD so structured data can't drift from the page. ──

const FAQS: { question: string; answer: string }[] = [
  {
    question: "Is this QR code generator really free?",
    answer:
      "Yes, completely. There's no signup, no watermark, no daily limit, no paid tier. Generate as many codes as you want, download in any size, keep them forever. UtilityApps runs on ads — that's it.",
  },
  {
    question: "Do the QR codes expire?",
    answer:
      "No. Every code this tool creates is static — the payload is baked into the pixel pattern of the image itself. That means it works the same on day one as it does in ten years. Nothing on our servers keeps it alive; nothing on our servers can turn it off. Many competitor tools generate 'dynamic' codes that route through their server and stop working the moment you cancel your subscription — ours never do that.",
  },
  {
    question: "Do you track scans or store my data?",
    answer:
      "No. Everything runs in your browser — the encoding, the rendering, the download. Nothing about what you encode or how many times the code is scanned is sent to us. That's a direct consequence of using static codes: since scans go directly from the phone to whatever destination is encoded (a URL, a WiFi network, a phone dialer), there's no server in the middle to record them.",
  },
  {
    question: "Can I add my logo to the QR code?",
    answer:
      "Yes. Upload any JPG, PNG, WEBP, or SVG in the Logo section. The tool compresses it to ~200 pixels on the longest side and embeds it in the centre of the code. Adding a logo automatically raises the error-correction level to H (30% recovery), which is what keeps the code scannable despite the logo covering part of it.",
  },
  {
    question: "What's the best size to download for printing?",
    answer:
      "Pick the size that matches how the code will be used. 500 px is fine for web / email. 1,000 px covers most business-card or flyer prints. 2,000 px is the safe pick for A4 posters and packaging. 4,000 px is for outdoor signage or anywhere the code will be scanned from a distance. If you're printing, prefer the SVG format — it's vector, so it stays sharp at any size.",
  },
  {
    question: "Why isn't my QR code scanning?",
    answer:
      "Three usual culprits: contrast is too low (the code needs a distinct dark-on-light look — a 3:1 ratio or better; the tool warns you when yours is under), the printed size is too small (aim for at least 2 cm × 2 cm), or the payload is too long and the code is too dense (long URLs or big vCards; try shortening the URL or bumping to a smaller error-correction level). If a logo is embedded, make sure error correction is set to H.",
  },
  {
    question: "What is the difference between static and dynamic QR codes?",
    answer:
      "A static code has its destination baked into the pixel pattern — the code IS the payload. It never expires, no server is involved after generation, and it can't be tracked. A dynamic code encodes a short URL that points to a redirect service; that service then sends the scanner to the real destination. Dynamic codes let the owner change the destination and see analytics, but they require an active subscription — cancel it and every code you've printed stops working. This tool only makes static codes, on purpose.",
  },
  {
    question: "Can I make a WiFi QR code?",
    answer:
      "Yes — pick 'WiFi network' as the content type. Enter the network name, password, and encryption (WPA/WPA2 covers almost every home router; WEP is legacy; None is for open networks). When someone scans the code with their phone camera, the OS offers to join the network automatically. Works on iPhones and Android phones from ~2019 onward.",
  },
  {
    question: "Can I make a QR code for my business card?",
    answer:
      "Yes — pick 'Contact card' as the type and fill in your details. The code encodes a vCard, so scanners offer to save the contact directly to the phone's address book. If you want a full-featured shareable card with analytics and multiple cards under one QR, UtilityApps also has a dedicated Digital Business Card tool at /tools/business-card.",
  },
  {
    question: "Can I change the colors of my QR code?",
    answer:
      "Yes. Both the foreground (the dark modules) and background (the light modules) are fully customisable — either via the five style presets or via the colour pickers. Keep in mind that QR codes need strong contrast to scan reliably. The tool warns when contrast drops below 3:1 with a red banner and the exact contrast ratio.",
  },
  {
    question: "What format should I download — PNG or SVG?",
    answer:
      "SVG for print or any use where the code might be resized (business cards, signage, PDFs) — it's vector so it stays sharp at any dimension. PNG for web, email, and messaging apps where you need a raster image. JPG only if you specifically need JPG — it's a lossy format so a QR code stored as JPG can end up with compression artifacts that make it harder to scan.",
  },
  {
    question: "Do QR codes work on all phones?",
    answer:
      "Every iPhone since iOS 11 (2017) and every Android phone since roughly the same era can scan QR codes natively from the built-in camera app — no separate scanner app needed. Older phones may need a free QR-scanner app from the App Store or Play Store, but that's now uncommon. All the code types this tool generates use standard formats (URL, vCard 3.0, WIFI Zebra-Crossing, geo, mailto, tel, iCalendar) that every mainstream scanner recognises.",
  },
];

// ── Use-case grid — six quick-start tiles pointing back at the tool
//    with the relevant content type highlighted. ──────────────────────

interface UseCase {
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
  hrefHash: string;
  crossLinkHref?: string;
  crossLinkLabel?: string;
}

const USE_CASES: UseCase[] = [
  {
    title: "Share your WiFi",
    body: "One code guests scan to join — no more spelling out passwords.",
    icon: Wifi,
    hrefHash: "#wifi",
  },
  {
    title: "Digital business card",
    body: "Scanners save your name, phone, email and website straight into their contacts.",
    icon: Contact,
    hrefHash: "#vcard",
    crossLinkHref: "/tools/business-card",
    crossLinkLabel: "or use the full Digital Business Card tool →",
  },
  {
    title: "Restaurant menu",
    body: "Print once, update the menu URL any time. Diners scan; the page loads.",
    icon: LinkIcon,
    hrefHash: "#url",
  },
  {
    title: "WhatsApp contact",
    body: "Open a WhatsApp chat with a pre-filled message. Great for pop-ups and events.",
    icon: MessageCircle,
    hrefHash: "#whatsapp",
  },
  {
    title: "Event details",
    body: "iCal payload adds title, location, and start/end times to the phone's calendar.",
    icon: Calendar,
    hrefHash: "#event",
  },
  {
    title: "Crypto payments",
    body: "BIP-21 for Bitcoin, ETH-style URIs for Ethereum. Wallets pre-fill the send screen.",
    icon: Bitcoin,
    hrefHash: "#crypto",
  },
];

const RELATED_TOOL_IDS = [
  "business-card",
  "email-signature-generator",
  "invoice-generator",
] as const;

export default function QrCodeGeneratorPage() {
  const category = tool ? getCategoryByName(tool.category) : undefined;
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
      name: tool?.name ?? "QR Code Generator",
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
    name: tool?.name ?? "QR Code Generator",
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
            {tool?.name ?? "QR Code Generator"}
          </span>
        </nav>

        {/* Hero */}
        <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-glow"
            style={{ backgroundColor: accent }}
          >
            <QrCode className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {tool?.category ?? "Business Tools"}
            </p>
            <h1 className="mt-1 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
              Free QR Code Generator
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-surface-600 dark:text-surface-300">
              Create a QR code for a website, WiFi network, contact card,
              WhatsApp chat, calendar event, map location, or crypto payment
              — 12 types, live preview, custom colours, optional logo. Every
              code is static and permanent: it works forever, whether or not
              this site is around next year.
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <TrustChip Icon={DollarSign}>100% free</TrustChip>
              <TrustChip Icon={InfinityIcon}>Never expires</TrustChip>
              <TrustChip Icon={ShieldCheck}>No signup, no tracking</TrustChip>
              <TrustChip Icon={Zap}>PNG & SVG export</TrustChip>
            </ul>
          </div>
        </header>

        {/* Differentiation banner — the "never expire" pitch that
            separates static from dynamic services. */}
        <section className="mt-6 rounded-3xl border border-success-200 bg-success-50/70 p-5 dark:border-success-500/30 dark:bg-success-500/10">
          <p className="flex items-start gap-3 text-sm text-success-900 dark:text-success-100">
            <Check className="mt-1 h-4 w-4 shrink-0 text-success-600 dark:text-success-400" />
            <span>
              <strong>
                Your QR codes never expire and are 100% free — no account, no
                tracking, no monthly limits.
              </strong>{" "}
              Every code is static: the payload lives inside the pixel pattern
              itself, not on our servers. Print it once and it works forever.
            </span>
          </p>
        </section>

        {/* Top ad */}
        <AdSlot position="top" className="mt-8" />

        {/* The generator */}
        <section className="mt-8">
          <QRCodeGenerator />
        </section>

        {/* Mid ad */}
        <AdSlot position="mid" className="mt-10" />

        {/* Use-case grid */}
        <section className="mt-14">
          <header className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
              What people use this for
            </h2>
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
              Six of the most common jobs — click a card to jump back to the
              tool with that content type.
            </p>
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((uc) => {
              const Ico = uc.icon;
              return (
                <div
                  key={uc.title}
                  className="rounded-2xl border border-surface-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ backgroundColor: accent }}
                    >
                      <Ico className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
                        {uc.title}
                      </h3>
                      <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">
                        {uc.body}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                    <Link
                      href={`/tools/${TOOL_ID}${uc.hrefHash}`}
                      className="inline-flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400"
                    >
                      Generate <ArrowRight className="h-3 w-3" />
                    </Link>
                    {uc.crossLinkHref && (
                      <Link
                        href={uc.crossLinkHref}
                        className="text-surface-500 underline decoration-dotted underline-offset-2 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-100"
                      >
                        {uc.crossLinkLabel}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SEO body */}
        <section className="mt-14 space-y-10">
          <ContentBlock
            title="What a QR code is (and how it actually works)"
            body={
              <>
                A QR code is a two-dimensional barcode invented by Denso Wave
                in 1994. Instead of a row of vertical bars, it uses a grid of
                black-and-white squares called modules — the position of each
                module encodes bits, and Reed–Solomon error-correction blocks
                are woven through the grid so the code can still decode even
                when a portion of it is damaged, dirty, or covered by a logo.
                The three big squares in the corners are position markers
                that tell scanners how the code is rotated; the payload is
                everything else. Modern smartphones detect QR codes directly
                from the camera preview — no scanner app required.
              </>
            }
          />
          <ContentBlock
            title="Static vs dynamic QR codes — why static is better for most people"
            body={
              <>
                <p>
                  A <strong>static</strong> QR code has its destination baked
                  directly into the pixel pattern. The URL, WiFi credentials,
                  contact card, or payment address <em>is</em> the code. Once
                  generated it works forever, with no server in the middle
                  and nothing to renew.
                </p>
                <p>
                  A <strong>dynamic</strong> QR code encodes a short URL
                  pointing to a redirect service (the QR provider's server),
                  which then forwards the scanner to the real destination.
                  This lets the owner change the destination after printing
                  and see scan analytics — but it also means the code is
                  paying rent. Cancel the subscription and every printed code
                  stops working. Most competitor tools charge $10–$30/month
                  for dynamic codes.
                </p>
                <p>
                  This generator only makes static codes. That's the honest
                  trade-off: no analytics and no post-print editing, but
                  your code works on day one, in ten years, and after we
                  stop existing. For 95% of use cases — sharing a URL,
                  joining WiFi, exchanging contact details, launching a
                  WhatsApp chat — static is the correct choice.
                </p>
              </>
            }
          />
          <ContentBlock
            title="What to encode in each type"
            body={
              <ul className="mt-1 space-y-2 pl-5 [list-style:disc]">
                <li>
                  <strong>vCard</strong> — sales, freelancers, and consultants
                  who want scanners to save their contact directly to the
                  phone's address book. Great alternative to a physical
                  business card at conferences.
                </li>
                <li>
                  <strong>URL</strong> — restaurant menus, product landing
                  pages, event ticketing, portfolio links, downloadable PDFs
                  on packaging.
                </li>
                <li>
                  <strong>WiFi</strong> — cafés, Airbnbs, offices, and events
                  where guests need one-tap access to the network without
                  spelling passwords.
                </li>
                <li>
                  <strong>Event</strong> — RSVPs, meetups, and printed
                  invitations. Scanning adds the event to the phone's
                  calendar in one tap.
                </li>
                <li>
                  <strong>WhatsApp</strong> — retail stores, market stalls,
                  and support desks. Scanning opens a chat with a pre-filled
                  intro message.
                </li>
                <li>
                  <strong>Crypto</strong> — payments displayed on-screen or
                  printed on packaging. Wallets like MetaMask, Rainbow, and
                  Trust Wallet parse the URI and pre-fill the send screen.
                </li>
              </ul>
            }
          />
          <ContentBlock
            title="How to make a QR code that actually scans"
            body={
              <ul className="mt-1 space-y-2 pl-5 [list-style:disc]">
                <li>
                  <strong>Contrast.</strong> Aim for a 3:1 luminance ratio
                  between foreground and background — the tool warns you when
                  you drop below. Dark-on-light is universally readable;
                  light-on-dark works but with slightly less margin.
                </li>
                <li>
                  <strong>Print size.</strong> The minimum reliable size is
                  ~2 cm × 2 cm. If the code will be scanned from further away
                  (a poster at 3 m), scale up proportionally — the rule of
                  thumb is 1:10 (2 cm code for a 20 cm scan distance).
                </li>
                <li>
                  <strong>Quiet zone.</strong> QR codes need clear whitespace
                  around them, usually four modules wide. Don't put text or
                  graphics right up against the edge or scanners struggle to
                  find the position markers.
                </li>
                <li>
                  <strong>Error correction.</strong> M (15% recovery) is a
                  sensible default. Bump to H (30%) when embedding a logo,
                  because the logo covers a chunk of the code and the
                  redundancy is what keeps it decodable.
                </li>
                <li>
                  <strong>Test before printing.</strong> Scan the on-screen
                  preview with your own phone camera before you send anything
                  to print. If it fails on the screen, it'll fail on the
                  poster.
                </li>
              </ul>
            }
          />
          <ContentBlock
            title="Why error correction matters when you add a logo"
            body={
              <>
                QR codes are designed with intentional redundancy — you can
                lose part of the code and still decode it. The four
                error-correction levels (L, M, Q, H) trade code density for
                recovery: at Level H, roughly 30% of the code can be missing
                or damaged and it still scans. That's exactly what happens
                when you embed a logo in the centre — you're deliberately
                deleting the modules under the logo and asking the
                error-correction blocks to fill them in. This tool
                auto-raises to H the moment you upload a logo, so codes with
                logos stay scannable without you having to think about it.
              </>
            }
          />
          <ContentBlock
            title="PNG, SVG, or JPG — which format to download"
            body={
              <>
                <p>
                  <strong>SVG</strong> is the right pick whenever the code
                  might be resized — business cards, flyers, posters,
                  packaging, PDFs. SVG is vector, so it stays pixel-perfect
                  at any dimension. It's also the smallest file for simple
                  codes.
                </p>
                <p>
                  <strong>PNG</strong> is the right pick for web, email, and
                  messaging apps that need a raster image. Choose the size
                  that matches the display (500 px for inline email, 1000 px
                  for a website hero, 2000 px for retina print at business-
                  card sizes).
                </p>
                <p>
                  <strong>JPG</strong> is only worth downloading when a
                  system you can't control specifically demands JPG. It's a
                  lossy format, so compression artifacts can accumulate
                  around the code's edges and make it harder to scan
                  reliably. Prefer PNG or SVG whenever the choice is yours.
                </p>
              </>
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
              Twelve short answers to the questions we hear most.
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

        {/* Related tools */}
        <section className="mt-16">
          <header className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
              Related tools
            </h2>
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
              Free tools people build alongside their QR code.
            </p>
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RELATED_TOOL_IDS.map((id) => {
              const t = TOOLS_BY_ID[id];
              if (!t) return null;
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
                    style={{ backgroundColor: cat?.color ?? "#2563EB" }}
                  >
                    <span className="text-sm font-semibold">
                      {t.name.charAt(0)}
                    </span>
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
            <Link
              href="/tools/categories/business-tools"
              className="group flex flex-col justify-between rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/40 p-4 transition hover:border-primary-400 hover:bg-primary-50 dark:border-primary-500/30 dark:bg-primary-500/10 dark:hover:border-primary-400/60"
            >
              <div>
                <h3 className="text-sm font-semibold text-primary-800 dark:text-primary-200">
                  All Business Tools
                </h3>
                <p className="mt-1 text-xs text-primary-800/80 dark:text-primary-200/80">
                  Digital business cards, invoice generator, email signature — everything in one place.
                </p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
                Browse the hub <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
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
