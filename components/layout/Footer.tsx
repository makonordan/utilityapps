import Link from "next/link";

import { InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { CATEGORIES } from "@/lib/categories";
import { TOOLS } from "@/lib/tools";
import { SITE_CONFIG } from "@/lib/utils";

const TOP_TOOLS = [...TOOLS]
  .sort((a, b) => b.monthlySearches - a.monthlySearches)
  .slice(0, 8);

const RESOURCES = [
  { label: "Blog", href: "/blog" },
  { label: "Products", href: "/products" },
  { label: "YouTube", href: "/youtube" },
  { label: "Newsletter", href: "/newsletter" },
];

const COMPANY = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
];

const SOCIALS: { label: string; href: string; Icon: typeof TwitterIcon }[] = [
  { label: "X (Twitter)", href: "https://x.com/UtilityAppsSite", Icon: TwitterIcon },
  { label: "YouTube", href: "https://www.youtube.com/@UtilityAppsSite", Icon: YoutubeIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/utilityapps/", Icon: LinkedinIcon },
  { label: "Instagram", href: "https://www.instagram.com/utilityappssite", Icon: InstagramIcon },
];

function FooterLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 font-semibold" aria-label="UtilityApps home">
      <svg viewBox="0 0 32 32" width={28} height={28} aria-hidden="true" className="text-primary-500">
        <defs>
          <linearGradient id="ua-mark-footer" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="currentColor" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <path d="M16 1.5l12.124 7v15l-12.124 7L3.876 23.5v-15z" fill="url(#ua-mark-footer)" />
        <path d="M16 9.5l6.062 3.5v6L16 22.5l-6.062-3.5v-6z" fill="white" fillOpacity="0.92" />
      </svg>
      <span className="text-base tracking-tight">UtilityApps</span>
    </Link>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-surface-700 transition hover:text-primary-600 dark:text-surface-300 dark:hover:text-primary-400"
      >
        {children}
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-surface-200 bg-white text-surface-700 dark:border-surface-800 dark:bg-[#0a0a0a] dark:text-surface-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <FooterLogo />
          <p className="mt-3 text-sm text-surface-600 dark:text-surface-400">
            {SITE_CONFIG.description}
          </p>
          <div className="mt-5 flex items-center gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-surface-200 text-surface-600 transition hover:border-primary-500 hover:text-primary-600 dark:border-surface-800 dark:text-surface-300 dark:hover:border-primary-400 dark:hover:text-primary-400"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Top Tools">
          {TOP_TOOLS.map((tool) => (
            <FooterLink key={tool.id} href={tool.href}>
              {tool.name}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Categories">
          {CATEGORIES.map((cat) => (
            <FooterLink key={cat.id} href={`/tools/categories/${cat.id}`}>
              {cat.name}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Resources">
          {RESOURCES.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
          <li className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Get weekly tools
            </p>
            <div className="mt-3 max-w-sm">
              <NewsletterForm
                source="footer"
                buttonLabel="Subscribe"
                successLabel="Subscribed"
              />
            </div>
          </li>
        </FooterColumn>

        <FooterColumn title="Company">
          {COMPANY.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </FooterColumn>
      </div>

      <div className="border-t border-surface-200 py-5 dark:border-surface-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-surface-500 dark:text-surface-500 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p>Built for productivity. Free forever.</p>
        </div>
      </div>
    </footer>
  );
}
