import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock, Mail, Sparkles } from "lucide-react";

import { InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { ContactForm } from "@/components/contact/ContactForm";
import { SITE_CONFIG } from "@/lib/utils";

const TITLE = "Contact Us";
const DESCRIPTION =
  "Get in touch with the UtilityApps team. Tool requests, bug reports, partnerships, and press — we read everything.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["contact utilityapps", "tool request", "bug report", "partnership inquiries"],
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/contact`,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: TITLE,
  description: DESCRIPTION,
  url: `${SITE_CONFIG.url}/contact`,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
};

const SOCIALS = [
  { Icon: TwitterIcon, label: "X (Twitter)", href: "https://x.com/UtilityAppsSite" },
  { Icon: YoutubeIcon, label: "YouTube", href: "https://www.youtube.com/@UtilityAppsSite" },
  { Icon: LinkedinIcon, label: "LinkedIn", href: "https://www.linkedin.com/company/utilityapps/" },
  { Icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/utilityappssite" },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <Breadcrumb />

        <header className="mt-6 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/70 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-700/50 dark:bg-primary-500/10 dark:text-primary-300">
            <Sparkles className="h-3.5 w-3.5" />
            Get in touch
          </p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
            Hi! How can we help?
          </h1>
          <p className="mt-3 text-base text-surface-600 dark:text-surface-300">
            Tool requests, bug reports, partnerships, press — we read everything. The fastest way
            to get a response is the form below.
          </p>
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card sm:p-8 dark:border-surface-800 dark:bg-surface-900">
            <ContactForm />
          </div>

          <aside className="space-y-6">
            <SidebarCard
              icon={<Clock className="h-4 w-4" />}
              title="Response time"
              body="We reply within 2 business days, often sooner."
            />

            <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                Direct email
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:hello@utilityapps.site"
                    className="inline-flex items-center gap-2 font-medium text-surface-800 hover:text-primary-600 dark:text-surface-100 dark:hover:text-primary-400"
                  >
                    <Mail className="h-4 w-4" />
                    hello@utilityapps.site
                  </a>
                  <span className="ml-6 block text-xs text-surface-500 dark:text-surface-400">
                    For all inquiries — general questions, privacy concerns, press requests,
                    partnerships
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                Find us elsewhere
              </h2>
              <ul className="mt-3 flex items-center gap-2">
                {SOCIALS.map(({ Icon, label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-surface-200 text-surface-600 transition hover:border-primary-300 hover:text-primary-600 dark:border-surface-800 dark:text-surface-300 dark:hover:border-primary-700 dark:hover:text-primary-400"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-surface-200 bg-gradient-to-br from-primary-50/40 to-white p-5 dark:border-surface-800 dark:from-primary-500/10 dark:to-surface-900">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                Looking for something else?
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    href="/blog"
                    className="text-surface-700 hover:text-primary-600 dark:text-surface-200 dark:hover:text-primary-400"
                  >
                    Read the blog →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/youtube"
                    className="text-surface-700 hover:text-primary-600 dark:text-surface-200 dark:hover:text-primary-400"
                  >
                    Watch tutorials →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools"
                    className="text-surface-700 hover:text-primary-600 dark:text-surface-200 dark:hover:text-primary-400"
                  >
                    Browse all tools →
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-surface-500 dark:text-surface-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-surface-700 dark:hover:text-surface-200">
            Home
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
        <li className="font-medium text-surface-700 dark:text-surface-200" aria-current="page">
          Contact
        </li>
      </ol>
    </nav>
  );
}

function SidebarCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
        {icon}
      </span>
      <h2 className="mt-3 text-sm font-semibold text-surface-900 dark:text-white">{title}</h2>
      <p className="mt-1 text-xs text-surface-600 dark:text-surface-400">{body}</p>
    </div>
  );
}
