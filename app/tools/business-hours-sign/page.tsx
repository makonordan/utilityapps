import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  ChevronRight,
  Clock,
  Coffee,
  DollarSign,
  ShieldCheck,
  ShoppingBasket,
  Scissors,
  Stethoscope,
  Store,
  Zap,
} from "lucide-react";

import { AdSlot } from "@/components/ads/AdSlot";
import { BusinessHoursSign } from "@/components/business-tools/BusinessHoursSign";
import { TrackToolVisit } from "@/components/tools/TrackToolVisit";
import { getCategoryByName } from "@/lib/categories";
import { getIcon } from "@/lib/icons";
import { TOOLS_BY_ID } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * /tools/business-hours-sign landing page.
 *
 * Server component — hero, ads, SEO body, FAQ, and related-tools rails
 * render once at build time. The interactive generator (form + live
 * preview + PDF/image/print export) is the <BusinessHoursSign /> client
 * island in the middle.
 *
 * Structurally mirrors app/tools/receipt-generator/page.tsx and
 * app/tools/purchase-order-generator/page.tsx — same breadcrumb/hero/
 * ads/use-cases/SEO/FAQ/related-tools skeleton — so the Business Tools
 * pages read as one family.
 */

const TOOL_ID = "business-hours-sign";
const tool = TOOLS_BY_ID[TOOL_ID];

const TITLE = "Free Business Hours Sign Generator";
const DESCRIPTION =
  "Create a free printable business hours sign. Set your opening times, style it, and download an Open/Closed hours sign as image or PDF. No signup, nothing uploaded — it all runs in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: tool?.keywords ?? [],
  alternates: { canonical: `/tools/${TOOL_ID}` },
  openGraph: {
    type: "website",
    title: "Free Business Hours Sign Generator — Image or PDF, No Signup",
    description:
      "Design a printable business hours sign — logo, day-by-day hours, an Open Now badge — then download it as an image or PDF. Free, browser-side, no signup.",
    url: `${SITE_CONFIG.url}/tools/${TOOL_ID}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent("Free Business Hours Sign Generator")}&description=${encodeURIComponent("Create & download a printable Open/Closed hours sign")}&type=tool`,
        width: 1200,
        height: 630,
        alt: "Free Business Hours Sign Generator — UtilityApps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// ── Use cases ────────────────────────────────────────────────────────────

interface UseCase {
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
}

const USE_CASES: UseCase[] = [
  {
    title: "Retail store",
    body: "A clean, legible hours sign for the front door or window that customers can read from the sidewalk.",
    icon: Store,
  },
  {
    title: "Restaurant / café",
    body: "Post daily hours plus a note for kitchen last-call or a different weekend schedule.",
    icon: Coffee,
  },
  {
    title: "Salon",
    body: "Show 'by appointment' days alongside walk-in hours so clients know when to just show up.",
    icon: Scissors,
  },
  {
    title: "Clinic",
    body: "Clear opening times at reception or the entrance, with an Open Now badge for a same-day glance.",
    icon: Stethoscope,
  },
  {
    title: "Office",
    body: "A professional hours sign for a shared building entrance or a reception desk.",
    icon: Briefcase,
  },
  {
    title: "Market stall",
    body: "A square sign sized for a table or a door sticker — print it, or post it to your stall's social page.",
    icon: ShoppingBasket,
  },
];

// ── FAQ content — kept in one place so the FAQPage JSON-LD schema and
//    the rendered <FAQ> block stay in sync. ─────────────────────────────

const FAQS: { question: string; answer: string }[] = [
  {
    question: "Is this business hours sign generator free?",
    answer:
      "Yes, completely free. There's no signup, no watermark, and no limit on how many signs you create or download.",
  },
  {
    question: "What sizes are available?",
    answer:
      "A4, US Letter, A5, and a Square format sized for a door or window sticker (or a social media post). Pick one in the Template & size section — the preview and both exports update to match.",
  },
  {
    question: "Can I add my logo?",
    answer:
      "Yes. Upload a PNG, JPG, or WEBP file directly (it's compressed and hosted automatically), or paste the URL of a logo you already host somewhere.",
  },
  {
    question: "Should I download the image or the PDF?",
    answer:
      "PDF if you're printing it — it's drawn at your sign's real physical size, so it prints at the correct dimensions with no scaling guesswork. Image (PNG) if you're posting it to social media, sending it in a message, or printing it yourself from a photo app.",
  },
  {
    question: "Can it show an \"Open Now\" badge?",
    answer:
      "Yes. Set the Open Now badge to Auto and it's computed live from the hours you've entered and the current time — handy for checking the sign looks right at a glance. Since a printed or downloaded sign is a fixed snapshot, you can also force it to always show Open, always show Closed, or hide the badge entirely, if you'd rather flip that manually.",
  },
  {
    question: "How do I print it for a door or window?",
    answer:
      "Download the PDF at A5 or Square for a compact sign, or A4/Letter for a full sheet, then print normally — landscape or portrait, whichever your printer defaults to for that page size. For a sign that'll live outside or get touched a lot, see the printing tips below on paper weight and lamination.",
  },
  {
    question: "Do you store my business details?",
    answer:
      "No. Everything you type — business name, hours, colors — stays in your browser and is used only to render the sign you download. The one exception is a logo you choose to upload, which is hosted so it can be embedded in the file; nothing else is saved or sent anywhere.",
  },
  {
    question: "Can I add holiday or special hours?",
    answer:
      "There's no separate holiday-hours field, but you can use a day's note (e.g. \"Closed Dec 25\") for a specific date, or temporarily edit that day's hours and switch them back afterward. For hours that change every week, the day-by-day editor is the fastest way to keep the sign accurate.",
  },
  {
    question: "Can I use custom colors?",
    answer:
      "Yes — a primary color, an accent color, and a background color, each with a visual picker plus a hex input for an exact brand match. Different templates use them differently: modern-card uses the primary color for its header band, for instance, while elegant uses the accent color for its thin divider rule.",
  },
  {
    question: "Does this work on mobile?",
    answer:
      "Yes. The form and live preview both adapt to small screens — the preview stacks above the form on mobile — and image, PDF, and print all work the same on a phone or tablet as on desktop.",
  },
];

// ── Related tools ────────────────────────────────────────────────────────

const RELATED_TOOL_IDS = ["letterhead-generator", "business-card", "qr-code-generator"] as const;

export default function BusinessHoursSignPage() {
  const category = tool ? getCategoryByName(tool.category) : undefined;
  const Icon = tool ? getIcon(tool.icon) : Clock;
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
      name: tool?.name ?? "Business Hours Sign Generator",
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
    name: tool?.name ?? "Business Hours Sign Generator",
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
            {tool?.name ?? "Business Hours Sign Generator"}
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
              Free Business Hours Sign Generator
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-surface-600 dark:text-surface-300">
              Design a printable business hours sign — set your opening
              times day by day, add your logo and colors, then download
              it as an image or a print-ready PDF. Free, with no signup,
              and everything runs right in your browser.
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <TrustChip Icon={DollarSign}>Free</TrustChip>
              <TrustChip Icon={ShieldCheck}>No signup</TrustChip>
              <TrustChip Icon={Clock}>Open Now badge</TrustChip>
              <TrustChip Icon={Zap}>Image or PDF</TrustChip>
            </ul>
          </div>
        </header>

        {/* Top ad — placed between the hero and the tool so the ad load
            doesn't push the interactive component below the fold. */}
        <AdSlot position="top" className="mt-8" />

        {/* The generator */}
        <section className="mt-8">
          <BusinessHoursSign />
        </section>

        {/* Bottom ad — right after the tool, before the long-form content.
            Gives ad viewability a boost since users who scroll past the
            tool are more engaged. */}
        <AdSlot position="bottom" className="mt-10" />

        {/* Use-case grid */}
        <section className="mt-14">
          <header className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
              Made for
            </h2>
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
              Any storefront, office, or stall that needs its hours to be
              obvious at a glance.
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
                  <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">{uc.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SEO / long-form content */}
        <section className="mt-14 space-y-10">
          <ContentBlock
            title="Why clear hours signage matters"
            body={
              <p>
                A hard-to-read or missing hours sign costs a business real
                foot traffic — a customer who arrives during a gap they
                couldn&rsquo;t predict, or who can&rsquo;t tell from the
                sidewalk whether you&rsquo;re open right now, usually just
                leaves rather than waits or comes back. A dedicated hours
                sign, posted somewhere visible before someone reaches the
                door, removes that guesswork. It also does quiet work for
                the business itself: consistent, legible hours signal that
                an operation is organized and reliable, the same way a
                clean storefront does, before a customer has interacted
                with anyone inside.
              </p>
            }
          />
          <ContentBlock
            title="What a business hours sign should include"
            body={
              <p>
                At minimum: the business name and the hours for each day
                of the week, with closed days marked as closed rather than
                simply omitted — an absent day reads as a mistake, not an
                intentional closure. Beyond that, a logo makes the sign
                instantly recognizable as yours rather than a generic
                printout, and a note field per day covers exceptions like
                &ldquo;by appointment&rdquo; or a shortened lunch-hour
                schedule. An Open Now badge is optional but useful right
                at the door, since it answers the one question a hours
                list alone can&rsquo;t: whether you&rsquo;re open at this
                exact moment.
              </p>
            }
          />
          <ContentBlock
            title="Standard sizes for door and window signs"
            body={
              <p>
                A4 and US Letter both work well as a full-sheet sign taped
                inside a window or door — big enough to read from a few
                feet away, and sized to fit a standard printer without
                trimming. A5 (roughly a quarter of A4) suits a smaller
                window pane or a sign propped on a counter. A square
                format is the odd one out on purpose: it&rsquo;s sized for
                a door or window sticker, or for posting the same design
                directly to Instagram or a Google Business post without
                cropping.
              </p>
            }
          />
          <ContentBlock
            title="Printing tips: paper weight and lamination"
            body={
              <p>
                Standard 80gsm office paper works for a short-term or
                indoor sign, but for anything facing outward through a
                window — where sunlight and handling take a toll — a
                heavier cardstock (around 200–300gsm) holds up longer and
                looks more deliberate. If the sign is going on an exterior
                door or somewhere it&rsquo;ll get touched, wiped, or rained
                on, lamination (or a basic laminating pouch from an office
                supply store) is worth the extra step — it protects the
                print from fading and moisture and lets you wipe off
                fingerprints instead of replacing the sign.
              </p>
            }
          />
          <ContentBlock
            title="Handling holiday and special hours"
            body={
              <p>
                For a one-off closure — a public holiday, a private event,
                a staff day off — the fastest option is a day&rsquo;s note
                field (&ldquo;Closed Dec 25&rdquo;) or a second, smaller
                sign taped alongside the main one for just that date,
                rather than rebuilding the whole sign. For hours that
                genuinely change for a season — shorter winter hours, an
                extended holiday shopping schedule — it&rsquo;s usually
                cleaner to edit the day-by-day hours directly and print a
                fresh sign, then swap back once the regular schedule
                resumes.
              </p>
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
              Short answers to the questions we hear most.
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
          <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl dark:text-white">
                Related tools
              </h2>
              <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
                Other free tools people use to build out their storefront
                and business identity.
              </p>
            </div>
            {category && (
              <Link
                href={`/tools/categories/${category.id}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Browse all Business Tools <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

function ContentBlock({ title, body }: { title: string; body: React.ReactNode }) {
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
