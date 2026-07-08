import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  ChevronRight,
  DollarSign,
  Gift,
  GraduationCap,
  HeartHandshake,
  Infinity as InfinityIcon,
  Presentation,
  ShieldCheck,
  Ticket as TicketIcon,
  Users,
  Zap,
} from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { EventTicketGenerator } from "@/components/business-tools/EventTicketGenerator";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getCategoryByName } from "@/lib/categories";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * /tools/event-ticket-generator landing page.
 *
 * Server component — hero, ads, SEO body, use-case grid, FAQ, and
 * related-tools rails render statically. The interactive generator +
 * bulk pipeline lives in the <EventTicketGenerator /> client island
 * in the middle.
 *
 * Positioning angle: unlike Eventbrite / similar SaaS ticketing
 * platforms that charge per-ticket fees ($1.79 + 3.5% is Eventbrite's
 * baseline), this tool is completely free for unlimited tickets. Right
 * pick for FREE and small-community events (weddings, fundraisers,
 * church, school, workshops, meetups) — not high-security paid events
 * where fraud prevention justifies the platform overhead. We surface
 * this both ways: aggressively in the hero + FAQ, and honestly in
 * the security-oriented FAQ so buyers don't misuse the tool for
 * gated-money events.
 */

const TOOL_ID = "event-ticket-generator";
const tool = TOOLS_BY_ID[TOOL_ID];

const TITLE =
  "Free Event Ticket Generator — Create & Print Tickets with QR Codes | UtilityApps";
const DESCRIPTION =
  "Create free event tickets and passes with check-in QR codes. Design, personalize, and download printable tickets in seconds. No fees, no signup — perfect for events, fundraisers, and parties.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: tool?.keywords ?? [],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: "Free Event Ticket Generator — No fees, no signup",
    description:
      "6 templates, check-in QR codes, bulk generation, print + email — 100% free forever. Perfect for free events, fundraisers, and small paid events.",
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent("Free Event Ticket Generator")}&description=${encodeURIComponent("Print + email tickets with QR check-in. No per-ticket fees.")}&type=tool`,
        width: 1200,
        height: 630,
        alt: "Free Event Ticket Generator — UtilityApps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// ── FAQ — single source of truth for both the visible cards and
//    FAQPage JSON-LD so structured data + rendered content stay in
//    sync. ────────────────────────────────────────────────────────────

const FAQS: { question: string; answer: string }[] = [
  {
    question: "Is this event ticket generator free?",
    answer:
      "Yes, completely. No signup, no watermark, no monthly limit, no paid tier. Generate a single ticket or a batch of 500, keep them forever. UtilityApps runs on ads — that's it.",
  },
  {
    question: "Are there any per-ticket fees?",
    answer:
      "None. This tool doesn't process payments and doesn't sit between you and your attendees. That's the fundamental difference between us and platforms like Eventbrite — they charge $1.79 + 3.5% per ticket to cover their payment processing and fraud infrastructure. For a free 100-person event that's ~$179 in fees for zero value delivered. Here, tickets are always free; keeping 100% of any door money is between you and your attendees.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. Everything runs in your browser. You fill in the event details, download the tickets, and send them. No login, no email confirmation, no dashboard we retain. Refresh the page and it resets — this is intentional so your guest list never lives on our servers.",
  },
  {
    question: "How does the QR code check-in work?",
    answer:
      "Every ticket includes a QR code that encodes the ticket's unique ID (or a verification URL you provide). At the door, scan the QR with any phone camera — the ID appears as text. Match that ID against your guest list (a spreadsheet, printed sheet, or your own web app) and mark the person as arrived. This tool GENERATES tickets; it doesn't run door check-in — no central database of issued tickets exists on our side. That's a deliberate privacy trade-off.",
  },
  {
    question: "Can I create tickets for many people at once?",
    answer:
      "Yes. Switch to Bulk mode at the top of the form. Either pick a quantity (generate 100 numbered tickets with sequential IDs) or paste a named list / upload a CSV (name, ticketType, seatInfo, email). Each row becomes a personalised ticket. Cap is 500 per batch for browser performance — larger events can split into multiple batches.",
  },
  {
    question: "Can I add each guest's name to their ticket?",
    answer:
      "Yes. In single-ticket mode, fill in the Attendee name field. In bulk mode, upload a CSV where the first column is the attendee's name — each row generates a personalised ticket printed with that name.",
  },
  {
    question: "Can I email tickets to my guests?",
    answer:
      "Yes, via a creator-driven flow that keeps your guest list private. For a single ticket, the Email button opens your default mail client with subject + body pre-filled and downloads a PNG copy — you attach it and send from your own inbox. For bulk, if your CSV includes an email column, the Prepare Mail-Merge button bundles all tickets into a ZIP with an attendees.csv manifest that Gmail Mail Merge, Outlook Mail Merge, YAMM, or MailMeteor can feed directly.",
  },
  {
    question: "Do you store my guest list?",
    answer:
      "No. Every attendee name, email, and generated ticket lives in your browser only. The bulk-generation pipeline reads your CSV, generates QR codes locally, rasters the tickets in a hidden container, and streams the final PDF or ZIP straight to your disk. Nothing about your attendees ever hits our servers. When you close the tab, everything is gone — no way for us to see who you invited.",
  },
  {
    question: "What size are the printed tickets?",
    answer:
      "The 'Ticket size' PDF option is 5.5\" long on the long side (~140 mm), which is standard concert-stub proportions. The 'Full page' PDF centres the ticket on A4 with a 15 mm margin — the safer choice for home printers where borderless printing is unreliable. The wristband template runs longer (~8:1 aspect) for standard wristband stock. All templates output at 300 DPI so QR codes stay scannable at any print size down to ~2 cm × 2 cm.",
  },
  {
    question: "Can I add my own logo and colors?",
    answer:
      "Yes. In the Branding section, upload your logo (auto-compressed to ~200 px) and pick both a primary and accent colour via the pickers. Every template uses those inputs — the accent colour drives ticket-type badges, buttons, and highlights; the primary colour drives titles, borders, and gradient starts. Some templates (Concert, Modern Gradient) also accept an optional background/banner image.",
  },
  {
    question:
      "How do I stop people from copying tickets?",
    answer:
      "Honestly, you can't fully prevent it — anyone can photocopy a printed ticket or forward a PNG. The realistic model is: every ticket has a unique ID, and at the door you mark IDs as \"used\" the first time each one is scanned. Second scan of the same ID = duplicate, refuse entry. That works for trusted events (church, school, weddings, small paid events) where the risk of fraud is low. If you're running a high-security paid event where duplicate tickets would meaningfully cost you money, use a dedicated ticketing platform with server-side validation — not this tool.",
  },
  {
    question: "What's the best format — PDF or PNG?",
    answer:
      "PDF for print (it embeds the ticket at exact dimensions and scales cleanly on any printer). PNG for email attachments and messaging apps (universal, previews inline in Gmail / Outlook / WhatsApp / Signal). Both are generated at 300 DPI from a scale-3 canvas snapshot so QRs stay crisp either way. If you're printing at scale for the same event, use the ticket-size PDF; if you're sending each attendee their own ticket, use PNG.",
  },
];

// ── Use-case grid — six event types this tool is right for ────────────

interface UseCase {
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
}

const USE_CASES: UseCase[] = [
  {
    title: "Weddings",
    body: "Personalised entry passes for the reception. Different templates for VIP tables and general seating.",
    icon: HeartHandshake,
  },
  {
    title: "Fundraisers",
    body: "Charity dinners, raffles, sponsored runs. Print a sheet of tickets with the sponsor's logo in minutes.",
    icon: Gift,
  },
  {
    title: "Church events",
    body: "Youth retreats, revival nights, community meals. Bulk-generate free RSVPs with the congregant's name.",
    icon: Building2,
  },
  {
    title: "School functions",
    body: "Prom, graduation, drama nights. Numbered tickets with QR check-in for the door team.",
    icon: GraduationCap,
  },
  {
    title: "Workshops",
    body: "One-day classes, hackathons, industry meetups. Email each registrant their personalised ticket.",
    icon: Presentation,
  },
  {
    title: "Community meetups",
    body: "Book clubs, running groups, hobby gatherings. Free RSVPs, no signup demanded of your community.",
    icon: Users,
  },
];

const RELATED_TOOL_IDS = [
  "qr-code-generator",
  "business-card",
  "email-signature-generator",
] as const;

export default function EventTicketGeneratorPage() {
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
      name: tool?.name ?? "Event Ticket Generator",
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
    name: tool?.name ?? "Event Ticket Generator",
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
          className="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400"
        >
          <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary-600 dark:hover:text-primary-400">
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
            {tool?.name ?? "Event Ticket Generator"}
          </span>
        </nav>

        {/* Hero */}
        <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-glow"
            style={{ backgroundColor: accent }}
          >
            <TicketIcon className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {tool?.category ?? "Business Tools"}
            </p>
            <h1 className="mt-1 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
              Free Event Ticket Generator
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-surface-600 dark:text-surface-300">
              Design, personalise, and download printable event tickets with a
              check-in QR code — 6 templates, custom colours, single or bulk
              generation, and a creator-driven email path that keeps your guest
              list off our servers. Right pick for weddings, fundraisers, church
              events, school functions, workshops, and community meetups.
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <TrustChip Icon={DollarSign}>No per-ticket fees</TrustChip>
              <TrustChip Icon={InfinityIcon}>Unlimited tickets</TrustChip>
              <TrustChip Icon={ShieldCheck}>No signup, no tracking</TrustChip>
              <TrustChip Icon={Zap}>Print + email ready</TrustChip>
            </ul>
          </div>
        </header>

        {/* Differentiation banner — the fee-free pitch that separates
            this from Eventbrite / paid-per-ticket platforms. */}
        <section className="mt-6 rounded-3xl border border-success-200 bg-success-50/70 p-5 dark:border-success-500/30 dark:bg-success-500/10">
          <p className="flex items-start gap-3 text-sm text-success-900 dark:text-success-100">
            <Check className="mt-1 h-4 w-4 shrink-0 text-success-600 dark:text-success-400" />
            <span>
              <strong>
                No per-ticket fees, ever. Unlike Eventbrite, you keep 100% —
                create unlimited free tickets for your event.
              </strong>{" "}
              Fee-based platforms charge $1.79 + 3.5% per ticket to process
              payments they aren&rsquo;t needed for on free events. For a 100-person
              community gathering, that&rsquo;s ~$179 in fees to hand out tickets
              you were already giving away.
            </span>
          </p>
        </section>

        <AdSlot position="top" className="mt-8" />

        <section className="mt-8">
          <EventTicketGenerator />
        </section>

        <AdSlot position="mid" className="mt-10" />

        {/* Use-case grid */}
        <section className="mt-14">
          <header className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
              Made for
            </h2>
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
              Small events, community gatherings, and any use case where a paid
              platform&rsquo;s per-ticket fee is bigger than the value it adds.
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
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ backgroundColor: accent }}
                  >
                    <Ico className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-surface-900 dark:text-white">
                    {uc.title}
                  </h3>
                  <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">
                    {uc.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SEO body */}
        <section className="mt-14 space-y-10">
          <ContentBlock
            title="Who this tool is for"
            body={
              <>
                <p>
                  The Event Ticket Generator is designed for organisers who
                  don&rsquo;t need — or don&rsquo;t want to pay for — a full ticketing
                  platform. That includes weddings, fundraisers, church and
                  school events, workshops, community meetups, private parties,
                  book clubs, and any free-entry event where a professional-
                  looking ticket adds polish without adding cost.
                </p>
                <p>
                  It is <em>not</em> designed for high-volume, high-security
                  paid events where fraud prevention justifies platform fees. If
                  you&rsquo;re selling $200 concert tickets to 5,000 strangers, use
                  a real ticketing service with server-side validation. If
                  you&rsquo;re running a 50-person fundraising dinner, this tool
                  saves you $175 in Eventbrite fees for exactly the same
                  outcome.
                </p>
              </>
            }
          />
          <ContentBlock
            title="How the QR check-in actually works (be realistic)"
            body={
              <>
                <p>
                  Every ticket contains a QR code that encodes the ticket&rsquo;s
                  unique ID — a random-looking string like{" "}
                  <code>EVT-2026-00042</code>. At the door, someone with a phone
                  scans the QR (the built-in camera app works on every iPhone
                  since iOS 11 and every Android since ~2019). The ID appears
                  on screen; your door person matches it against a list you
                  brought — a spreadsheet, a printed sheet, or a simple web app
                  you run yourself.
                </p>
                <p>
                  There&rsquo;s no central database of issued tickets on our side.
                  That&rsquo;s deliberate: we never see your guest list, so we can&rsquo;t
                  &ldquo;confirm whether a ticket is real&rdquo; because we don&rsquo;t know what
                  you issued. If you want automated validation, use the QR&rsquo;s{" "}
                  <em>Verification URL</em> mode to point scanners at a page you
                  host (Google Form, Airtable interface, custom Next.js app),
                  which then looks up the ID in your own system.
                </p>
              </>
            }
          />
          <ContentBlock
            title="Printing your tickets"
            body={
              <ul className="mt-1 space-y-2 pl-5 [list-style:disc]">
                <li>
                  <strong>Paper weight.</strong> 200–300 gsm cardstock feels
                  professional and survives an evening in a coat pocket.
                  Standard printer paper works too but looks flimsy.
                </li>
                <li>
                  <strong>Sizing.</strong> The &ldquo;Ticket size&rdquo; PDF export lands at
                  5.5&Prime; long side (~140 mm) — standard concert stub
                  proportions. Home-printer users should pick &ldquo;Full page&rdquo;
                  instead: A4 with the ticket centred, 15 mm margin, no
                  bleed. Cut along the edge of the ticket after printing.
                </li>
                <li>
                  <strong>Cutting.</strong> Rotary trimmers give the cleanest
                  edge; scissors are fine for a stack of 20. For anything larger,
                  pay a local print shop $5 to cut a stack cleanly — cheaper
                  than doing it yourself and looks better.
                </li>
                <li>
                  <strong>Minimum QR size.</strong> Never print smaller than
                  2 cm × 2 cm — QR scanners struggle below that. Wristband
                  template already sizes the QR appropriately for its narrower
                  format.
                </li>
              </ul>
            }
          />
          <ContentBlock
            title="Emailing tickets to attendees"
            body={
              <>
                <p>
                  Two flows, both keeping your guest list private:
                </p>
                <ul className="mt-1 space-y-2 pl-5 [list-style:disc]">
                  <li>
                    <strong>Single ticket:</strong> Click Email this ticket. The
                    tool downloads a PNG copy and opens your default mail client
                    (Gmail, Outlook, Apple Mail) with a pre-filled subject and
                    body. You attach the downloaded PNG and click Send. The
                    email leaves your inbox — we never touched it.
                  </li>
                  <li>
                    <strong>Bulk:</strong> Upload a CSV with an email column.
                    Click Prepare Mail-Merge. The tool bundles every ticket
                    PNG plus an <code>attendees.csv</code> manifest into a ZIP.
                    Feed that ZIP to Gmail Mail Merge, YAMM, Outlook Mail Merge,
                    or MailMeteor — they send personalised emails from your
                    account with the matching PNG attached to each row.
                  </li>
                </ul>
              </>
            }
          />
          <ContentBlock
            title="Free ticket generator vs paid ticketing platforms"
            body={
              <>
                <p>
                  Fee-based platforms exist because they solve real problems for
                  large paid events: payment processing, chargeback protection,
                  fraud detection at scale, on-the-day support. Those services
                  cost money and the per-ticket fee funds them.
                </p>
                <p>
                  For a free or small event, none of that infrastructure is
                  earning its keep. A 100-person community meetup pays the same
                  $1.79 + 3.5% per RSVP that a 5,000-person concert pays, and
                  gets zero value from the payment layer since nobody paid to
                  attend. That&rsquo;s the gap this tool fills. You get the
                  professional-looking ticket with a scannable QR code, and you
                  keep every dollar (or, if the event was free, you at least
                  don&rsquo;t have to charge people a &ldquo;service fee&rdquo; to attend a free
                  event).
                </p>
              </>
            }
          />
          <ContentBlock
            title="Tips for running a smooth check-in"
            body={
              <ul className="mt-1 space-y-2 pl-5 [list-style:disc]">
                <li>
                  <strong>Unique IDs prevent duplicates.</strong> Every ticket
                  generated by this tool has its own ID. A photocopy of a
                  ticket has the same ID as the original — so the first scan
                  at the door &ldquo;uses&rdquo; that ID, and the second scan flags a
                  duplicate. Keep the list of used IDs somewhere the door team
                  can see (a shared Google Sheet works fine).
                </li>
                <li>
                  <strong>Keep your master list.</strong> Save the CSV you
                  uploaded or the numbered range you generated. If someone
                  loses their ticket, you can look up the ID and issue a fresh
                  copy. If someone shows up with a suspicious ticket, cross-
                  check against the list.
                </li>
                <li>
                  <strong>Test-scan before the event.</strong> Print one ticket
                  at your intended size, scan it with a couple of different
                  phone cameras. If any of them struggle, bump the QR&rsquo;s error-
                  correction level (via the Ticket details / Verification URL
                  section) or increase print size.
                </li>
                <li>
                  <strong>Have a plan B for no-Wi-Fi venues.</strong> The QR
                  encodes a plain ID by default, so no internet is needed to
                  read it — but if you&rsquo;re using URL mode for automated
                  validation, make sure the venue has connectivity or fall
                  back to a printed guest list.
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
              Twelve honest answers — including where this tool is <em>not</em>{" "}
              the right pick.
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
              Free tools organisers reach for alongside their tickets. The QR
              Code Generator shares the same rendering engine — if you already
              know how to use one, you know how to use both.
            </p>
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RELATED_TOOL_IDS.map((id) => {
              const t = TOOLS_BY_ID[id];
              if (!t) return null;
              const cat = getCategoryByName(t.category);
              // Cross-link the QR generator strongly — it's the shared
              // infrastructure. Emphasise via primary-tinted border.
              const emphasized = id === "qr-code-generator";
              return (
                <Link
                  key={id}
                  href={t.href}
                  className={cn(
                    "group flex flex-col rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-card-hover",
                    emphasized
                      ? "border-2 border-primary-400 bg-primary-50/40 dark:border-primary-500/60 dark:bg-primary-500/10"
                      : "border-surface-200 bg-white hover:border-primary-300 dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ backgroundColor: cat?.color ?? "#2563EB" }}
                    >
                      <span className="text-sm font-semibold">
                        {t.name.charAt(0)}
                      </span>
                    </span>
                    {emphasized && (
                      <span className="rounded-full bg-primary-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        Shared engine
                      </span>
                    )}
                  </div>
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
                <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-300" />
                <h3 className="mt-3 text-sm font-semibold text-primary-800 dark:text-primary-200">
                  All Business Tools
                </h3>
                <p className="mt-1 text-xs text-primary-800/80 dark:text-primary-200/80">
                  Business cards, invoices, email signatures, QR codes — everything in one place.
                </p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
                Browse the hub <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </section>

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

/** Tiny class-name merger so we don't have to import from lib/utils
 *  for a single call site. */
function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
