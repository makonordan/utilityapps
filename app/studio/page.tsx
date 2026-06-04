import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Mail,
  MessageCircle,
  ShieldCheck,
  X as XIcon,
} from "lucide-react";

import { CalendlyButton, CalendlyLink } from "@/components/studio/CalendlyButton";
import { HeroBackground } from "@/components/studio/HeroBackground";
import { StudioFAQ } from "@/components/studio/StudioFAQ";
import { getIcon } from "@/lib/icons";
import { generateBreadcrumbSchema, jsonLdString } from "@/lib/schema";
import {
  EXPERIENCE_INDUSTRIES,
  FAQ,
  INDUSTRIES,
  PORTFOLIO,
  PROCESS,
  SERVICES,
  STUDIO_EMAIL,
  formatWhatsapp,
  whatsappLink,
} from "@/lib/studio";
import { SITE_CONFIG, cn } from "@/lib/utils";

const TITLE = "UtilityApps Studio — Custom Development for Businesses";
const DESCRIPTION =
  "We build custom calculators, dashboards, document generators, and AI-powered tools for businesses. AI-augmented development. Delivered in weeks. By the team behind UtilityApps.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/studio" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/studio`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent("UtilityApps Studio")}&description=${encodeURIComponent("Custom internal tools, delivered in weeks")}&type=tool`,
        width: 1200,
        height: 630,
        alt: "UtilityApps Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function StudioPage() {
  return (
    <>
      <Schema />

      <Hero />
      <Problem />
      <Services />
      <Process />
      <Portfolio />
      <Founder />
      <Verticals />
      <Faq />
      <FinalCta />
    </>
  );
}

// ── Schemas ────────────────────────────────────────────────────────────────

function Schema() {
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Studio", url: `${SITE_CONFIG.url}/studio` },
  ]);
  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "UtilityApps Studio",
    description: "Custom development services for businesses",
    url: `${SITE_CONFIG.url}/studio`,
    areaServed: "Worldwide",
    provider: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    serviceType: [
      "Custom Software Development",
      "Business Tool Development",
      "AI Integration Services",
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(professionalService) }}
      />
    </>
  );
}

// ── Section: Hero ──────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-surface-200 bg-gradient-to-b from-surface-50 to-white pb-16 pt-16 sm:pt-24 dark:border-surface-800 dark:from-surface-950 dark:to-surface-950">
      <HeroBackground />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-xs text-surface-500 dark:text-surface-400">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-surface-700 dark:hover:text-surface-200">
                {SITE_CONFIG.name}
              </Link>
            </li>
            <ChevronRight className="h-3 w-3 text-surface-400" aria-hidden="true" />
            <li
              className="font-medium text-surface-700 dark:text-surface-200"
              aria-current="page"
            >
              Studio
            </li>
          </ol>
        </nav>

        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/70 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-700/50 dark:bg-primary-500/10 dark:text-primary-300">
          UtilityApps Studio
          <span className="text-surface-400 dark:text-surface-500">·</span>
          <span className="font-normal text-surface-600 dark:text-surface-300">
            Custom development
          </span>
        </p>

        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight text-surface-900 sm:text-6xl dark:text-white">
          Custom internal tools, built fast — by the team behind UtilityApps.
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-surface-600 dark:text-surface-300">
          We design and build digital products, web apps, internal dashboards,
          and AI-powered tools for small and growing businesses. Delivered in
          weeks, not months. At a fraction of agency timelines.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <CalendlyButton
            analyticsId="hero-primary"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3.5 text-base font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600"
          >
            Book a free 30-min discovery call
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CalendlyButton>
          <Link
            href="#portfolio"
            className="text-sm font-medium text-surface-600 underline decoration-dotted underline-offset-2 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
          >
            See what we&rsquo;ve built →
          </Link>
        </div>

        <a
          href={whatsappLink(
            "Hi Daniel — I need an immediate response on a project for UtilityApps Studio."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Need an immediate response? WhatsApp Daniel on {formatWhatsapp()}
        </a>

        <ul className="mt-8 grid gap-3 text-sm font-medium text-surface-700 sm:grid-cols-2 sm:gap-x-10 dark:text-surface-200">
          {[
            "100+ tools shipped on UtilityApps",
            "Users in 20+ countries",
            "Modern stack: Next.js, Supabase, Vercel",
            "AI-augmented development",
          ].map((t) => (
            <li key={t} className="inline-flex items-start gap-2">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-success-500"
                aria-hidden="true"
              />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-surface-500 dark:text-surface-400">
          Based in Lagos, Nigeria. Working globally.
        </p>
      </div>
    </section>
  );
}

// ── Section: Problem ───────────────────────────────────────────────────────

function Problem() {
  return (
    <section className="bg-white py-20 dark:bg-surface-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
          Stop overpaying for custom software.
        </h2>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <CompareCard
            title="Traditional Agencies"
            tone="warning"
            items={[
              "8–12 weeks for simple projects",
              "$20K–$100K+ for basic tools",
              "Rotating team of strangers",
              "Layers of project managers",
              "Outdated tech stacks",
              "Vendor lock-in",
            ]}
          />
          <CompareCard
            title="DIY / No-Code"
            tone="warning"
            items={[
              "Limited customization",
              "Monthly subscription costs forever",
              "Can't integrate with your systems",
              "Performance issues at scale",
              "You become an accidental developer",
              "No real ownership",
            ]}
          />
          <CompareCard
            title="UtilityApps Studio"
            tone="primary"
            items={[
              "2–4 weeks typical delivery",
              "Direct work with the founder",
              "Modern, maintainable code",
              "Full source code ownership",
              "Integrates with anything",
              "AI-augmented speed, agency quality",
            ]}
          />
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-surface-600 dark:text-surface-300">
          Most agencies charge a fortune and take 2–3 months for what&rsquo;s
          essentially a custom calculator, dashboard, or document generator.
          We use modern AI-augmented development to ship the same quality work
          in weeks, not months. You work directly with the founder who built
          UtilityApps — not a rotating team of project managers.
        </p>
      </div>
    </section>
  );
}

function CompareCard({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "warning" | "primary";
  items: string[];
}) {
  const isPrimary = tone === "primary";
  return (
    <article
      className={cn(
        "rounded-3xl border bg-white p-6 dark:bg-surface-900",
        isPrimary
          ? "border-primary-200 ring-2 ring-primary-200/60 dark:border-primary-700/50 dark:ring-primary-500/30"
          : "border-surface-200 dark:border-surface-800"
      )}
    >
      <h3
        className={cn(
          "text-lg font-bold tracking-tight",
          isPrimary
            ? "text-primary-700 dark:text-primary-300"
            : "text-surface-500 dark:text-surface-400"
        )}
      >
        {title}
      </h3>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((it) => (
          <li
            key={it}
            className={cn(
              "flex items-start gap-2",
              isPrimary
                ? "text-surface-800 dark:text-surface-100"
                : "text-surface-600 dark:text-surface-300"
            )}
          >
            {isPrimary ? (
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-success-500"
                aria-hidden="true"
              />
            ) : (
              <XIcon
                className="mt-0.5 h-4 w-4 shrink-0 text-warning-500"
                aria-hidden="true"
              />
            )}
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

// ── Section: Services ─────────────────────────────────────────────────────

function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-24 border-y border-surface-200 bg-gradient-to-b from-surface-50/60 to-white py-20 dark:border-surface-800 dark:from-surface-900/30 dark:to-surface-950"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
            What we build for businesses.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-surface-600 dark:text-surface-300">
            Four focus areas. Each shipped in 2–6 weeks. All scoped to your
            specific needs.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {SERVICES.map((svc) => {
            const Icon = getIcon(svc.icon);
            return (
              <article
                key={svc.id}
                className="flex flex-col rounded-3xl border border-surface-200 bg-white p-6 transition hover:border-primary-200 dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700/50"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-md"
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-surface-900 dark:text-white">
                  {svc.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-600 dark:text-surface-300">
                  {svc.description}
                </p>
                <blockquote className="mt-4 border-l-2 border-primary-200 pl-3 text-xs italic text-surface-600 dark:border-primary-700/50 dark:text-surface-400">
                  {svc.example}
                </blockquote>
                <p className="mt-4 text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {svc.delivery}
                </p>
                <CalendlyButton
                  topic={`Project: ${svc.title}`}
                  analyticsId={`service-${svc.id}`}
                  className="mt-5 inline-flex items-center gap-1.5 self-start rounded-xl bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700 transition hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:hover:bg-primary-500/20"
                >
                  Discuss this project
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </CalendlyButton>
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-surface-600 dark:text-surface-300">
          Don&rsquo;t see your project? We&rsquo;ve probably built something
          similar.{" "}
          <CalendlyLink
            analyticsId="services-fallback"
            className="font-semibold text-primary-700 underline decoration-dotted underline-offset-2 hover:text-primary-800 dark:text-primary-300"
          >
            Book a discovery call
          </CalendlyLink>{" "}
          and let&rsquo;s talk.
        </p>
      </div>
    </section>
  );
}

// ── Section: Process ──────────────────────────────────────────────────────

function Process() {
  return (
    <section
      id="process"
      className="scroll-mt-24 bg-surface-950 py-20 text-surface-100 dark:bg-surface-900/40"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A simple 4-step process.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-surface-300">
            No agency runaround. No hidden costs. Just straight-line execution
            from idea to launched product.
          </p>
        </header>

        <ol className="mt-12 grid gap-6 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li key={step.number} className="relative">
              <div className="rounded-3xl border border-surface-800 bg-surface-900/60 p-5">
                <span className="font-mono text-3xl font-bold text-primary-400">
                  {step.number}
                </span>
                <h3 className="mt-3 text-base font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-300">
                  {step.description}
                </p>
              </div>
              {i < PROCESS.length - 1 && (
                <ArrowRight
                  className="absolute right-[-1.5rem] top-1/2 hidden h-5 w-5 -translate-y-1/2 text-surface-700 lg:block"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-primary-700/40 bg-gradient-to-r from-primary-500/15 to-accent-500/10 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-surface-100">
            Ready to start? Most projects begin with a 30-minute discovery call.
          </p>
          <CalendlyButton
            analyticsId="process-cta"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-surface-900 transition hover:bg-surface-100"
          >
            Book your discovery call
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CalendlyButton>
        </div>
      </div>
    </section>
  );
}

// ── Section: Portfolio ─────────────────────────────────────────────────────

function Portfolio() {
  return (
    <section id="portfolio" className="scroll-mt-24 bg-white py-20 dark:bg-surface-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
            Recent work.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-surface-600 dark:text-surface-300">
            Tools we&rsquo;ve built and shipped, currently used by people in
            20+ countries through our flagship platform {SITE_CONFIG.name}. We
            can build something similar — customized and branded for your
            business — typically in 2–4 weeks.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO.map((p) => (
            <article
              key={p.toolId}
              className="flex flex-col rounded-3xl border border-surface-200 bg-white p-5 transition hover:border-primary-200 hover:shadow-card dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700/50"
            >
              <div
                aria-hidden="true"
                className="mb-4 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/15 to-accent-500/15"
              >
                <div className="flex h-full items-center justify-center text-3xl">
                  ✦
                </div>
              </div>
              <h3 className="text-base font-bold text-surface-900 dark:text-white">
                {p.title}
              </h3>
              <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
                {p.description}
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <li
                    key={t}
                    className="inline-flex rounded-full bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-700 dark:bg-surface-800 dark:text-surface-200"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary-700 hover:underline dark:text-primary-300"
              >
                View live
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <ConfidentialWorkCallout />
      </div>
    </section>
  );
}

function ConfidentialWorkCallout() {
  return (
    <div className="mt-12 overflow-hidden rounded-3xl border border-primary-200 bg-gradient-to-br from-primary-50 via-white to-accent-50/40 p-6 sm:p-8 dark:border-primary-700/40 dark:from-primary-500/10 dark:via-surface-900 dark:to-accent-500/10">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-md"
        >
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
            What you don&rsquo;t see above
          </p>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-surface-900 sm:text-2xl dark:text-white">
            Most of our client work is confidential.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-surface-700 dark:text-surface-200">
            The cards above are our public tools. Beyond them, Daniel has shipped
            software, data, and AI projects under NDA across multiple industries —
            ask about industry-specific examples during your discovery call.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Industries shipped in
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {EXPERIENCE_INDUSTRIES.map((industry) => (
              <li key={industry}>
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-surface-800 ring-1 ring-inset ring-primary-200 dark:bg-surface-900 dark:text-surface-100 dark:ring-primary-700/40">
                  {industry}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Section: Founder ──────────────────────────────────────────────────────

function Founder() {
  return (
    <section className="bg-surface-50/70 py-20 dark:bg-surface-900/30">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-5">
          <aside className="lg:col-span-2">
            <div className="rounded-3xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
              <div
                aria-hidden="true"
                className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-4xl font-bold text-white"
              >
                D
              </div>
              <p className="mt-4 text-center text-lg font-bold text-surface-900 dark:text-white">
                Daniel
              </p>
              <p className="text-center text-sm text-surface-500 dark:text-surface-400">
                Founder, UtilityApps Studio
              </p>
              <p className="mt-1 text-center text-xs text-surface-500 dark:text-surface-400">
                📍 Lagos, Nigeria
              </p>
              <ul className="mt-5 grid grid-cols-3 gap-2 text-center">
                <Stat label="Tools shipped" value="100+" />
                <Stat label="Countries" value="20+" />
                <Stat label="Team size" value="1" />
              </ul>
              <a
                href="https://www.linkedin.com/in/makonordaniel"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-surface-200 px-3 py-2 text-sm font-medium text-surface-700 transition hover:border-primary-200 hover:bg-primary-50/40 dark:border-surface-800 dark:text-surface-200 dark:hover:border-primary-700/50 dark:hover:bg-primary-500/5"
              >
                LinkedIn
              </a>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
              Why work with us.
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-surface-700 dark:text-surface-200">
              <p>
                I&rsquo;m Daniel — the developer behind UtilityApps and the
                person you&rsquo;ll actually work with on your project.
              </p>
              <p>
                I built UtilityApps alone using modern AI-augmented
                development. 100+ tools, 16 categories, users in 20+
                countries. I learned to ship fast without cutting corners.
              </p>
              <p>
                When you work with us, you work with me directly. Not a sales
                team. Not a project manager. Not a junior developer the agency
                assigned. You get the senior person from start to finish.
              </p>
              <p>
                That&rsquo;s why we can deliver faster, charge less, and ship
                higher quality. There&rsquo;s no overhead. Just focused work.
              </p>
            </div>

            <blockquote className="mt-8 rounded-3xl border border-primary-200 bg-primary-50/40 p-6 text-base italic text-surface-800 dark:border-primary-700/50 dark:bg-primary-500/10 dark:text-surface-100">
              &ldquo;The era of needing an agency and $50K for custom software
              is ending. I&rsquo;m proving that one person plus AI plus
              discipline can deliver agency-quality work in a fraction of the
              time. Let&rsquo;s build something together.&rdquo;
              <footer className="mt-3 text-xs font-semibold uppercase tracking-wider not-italic text-primary-700 dark:text-primary-300">
                — Daniel
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <li className="rounded-xl bg-surface-50 px-2 py-3 dark:bg-surface-800/60">
      <p className="text-base font-bold text-surface-900 dark:text-white">{value}</p>
      <p className="text-[10px] text-surface-500 dark:text-surface-400">{label}</p>
    </li>
  );
}

// ── Section: Verticals ────────────────────────────────────────────────────

function Verticals() {
  return (
    <section className="bg-gradient-to-br from-primary-500/10 via-white to-accent-500/10 py-20 dark:from-primary-500/10 dark:via-surface-950 dark:to-accent-500/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
            Industries we work with.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-surface-600 dark:text-surface-300">
            We&rsquo;ve built tools across these industries. If yours
            isn&rsquo;t listed, we still want to talk — most projects use
            similar building blocks.
          </p>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind) => {
            const Icon = getIcon(ind.icon);
            return (
              <article
                key={ind.id}
                className="rounded-3xl border border-surface-200 bg-white p-5 transition hover:border-primary-200 dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-700/50"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-base font-bold text-surface-900 dark:text-white">
                  {ind.name}
                </h3>
                <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
                  {ind.description}
                </p>
                <CalendlyButton
                  topic={ind.calendlyTopic}
                  analyticsId={`industry-${ind.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:underline dark:text-primary-300"
                >
                  {ind.calendlyTopic}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </CalendlyButton>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Section: FAQ ──────────────────────────────────────────────────────────

function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 bg-white py-20 dark:bg-surface-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
            Common questions.
          </h2>
        </header>
        <div className="mt-10">
          <StudioFAQ items={FAQ} />
        </div>
      </div>
    </section>
  );
}

// ── Section: Final CTA ────────────────────────────────────────────────────

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 py-24 text-white">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Ready to build something?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-white/90">
          Most projects start with a 30-minute discovery call. We learn about
          your business, you learn whether we&rsquo;re the right fit, and we
          both decide if it makes sense to work together. No pressure, no
          obligation.
        </p>
        <CalendlyButton
          analyticsId="final-cta"
          className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-primary-700 shadow-lg transition hover:bg-surface-50"
        >
          Book your free discovery call
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </CalendlyButton>

        <div className="mt-8 flex flex-col items-center gap-3 text-sm text-white/85 sm:flex-row sm:justify-center sm:gap-6">
          <a
            href={`mailto:${STUDIO_EMAIL}`}
            className="inline-flex items-center gap-1.5 hover:underline"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {STUDIO_EMAIL}
          </a>
          <a
            href={whatsappLink("Hi, I'd like to discuss a project with UtilityApps Studio.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:underline"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp {formatWhatsapp()}
          </a>
          <Link href="/studio/contact" className="hover:underline">
            Or fill the form →
          </Link>
        </div>
      </div>
    </section>
  );
}
