import Link from "next/link";
import type { SVGProps } from "react";
import { Globe, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

import {
  BehanceIcon,
  CalendlyIcon,
  DribbbleIcon,
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  LinktreeIcon,
  TelegramIcon,
  TiktokIcon,
  TwitterIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "@/components/icons/SocialIcons";

import type { BcCardRow, BcSocialLink } from "@/lib/businessCard/types";
import { cn } from "@/lib/utils";

import { SaveContactButton } from "./SaveContactButton";

/**
 * Public individual-card page renderer. Also used inline on the master
 * selector page as a card tile (with `compact` mode).
 *
 * All 5 themes are handled by this one component via `renderTheme()`.
 * Colours come from `brand_color_primary` + `_secondary`.
 */

interface Props {
  card: BcCardRow;
  compact?: boolean;
  href?: string; // when compact, links the whole tile to this URL
  hideSaveButton?: boolean;
  /** Show the "Preview — not live" watermark used inside the editor. */
  isPreview?: boolean;
}

export function CardView({ card, compact = false, href, hideSaveButton = false, isPreview = false }: Props) {
  const styles = themeStyles(card);

  const body = (
    <article
      className={cn(
        "relative overflow-hidden",
        compact ? "rounded-2xl shadow-sm" : "rounded-3xl shadow-lg",
        styles.container
      )}
      style={styles.containerStyle}
    >
      {styles.decoration}

      <div className={cn("relative flex flex-col", compact ? "gap-3 p-5" : "gap-5 p-6 sm:p-8")}>
        {/* Header block */}
        <div className={cn("flex items-start gap-4", compact && "gap-3")}>
          <Avatar card={card} compact={compact} />
          <div className="min-w-0 flex-1">
            <h2
              className={cn(
                "truncate font-bold tracking-tight",
                compact ? "text-base" : "text-2xl sm:text-3xl",
                styles.headline
              )}
            >
              {card.full_name}
            </h2>
            {card.pronouns && (
              <p className={cn("text-xs opacity-70", styles.body)}>({card.pronouns})</p>
            )}
            {card.job_title && (
              <p className={cn("mt-0.5 truncate text-sm", styles.body)}>{card.job_title}</p>
            )}
            {card.company_name && (
              <p className={cn("truncate text-sm font-medium", styles.subhead)}>
                {card.company_name}
                {card.department ? ` · ${card.department}` : ""}
              </p>
            )}
          </div>
        </div>

        {card.tagline && (
          <p className={cn("text-sm italic leading-relaxed", styles.body)}>
            &ldquo;{card.tagline}&rdquo;
          </p>
        )}

        {/* Contact rows */}
        {!compact && (
          <>
            <ContactRows card={card} styles={styles} />
            {card.bio && (
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  styles.body,
                  "border-l-2 pl-3",
                  "border-white/20 dark:border-black/20"
                )}
                style={{ borderLeftColor: card.brand_color_primary }}
              >
                {card.bio}
              </p>
            )}
            <SocialGrid socials={card.social_links ?? []} styles={styles} />
          </>
        )}

        {compact && (
          <ContactSummary card={card} styles={styles} />
        )}

        {!hideSaveButton && !compact && (
          <SaveContactButton card={card} accent={card.brand_color_primary} />
        )}
      </div>

      {isPreview && (
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          Preview — not live
        </span>
      )}
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl">
        {body}
      </Link>
    );
  }
  return body;
}

// ── Theme system ───────────────────────────────────────────────────────────

interface ThemeStyles {
  container: string;
  containerStyle: React.CSSProperties;
  decoration: React.ReactNode;
  headline: string;
  subhead: string;
  body: string;
  iconBg: string;
  iconColor: string;
}

function themeStyles(card: BcCardRow): ThemeStyles {
  const primary = card.brand_color_primary;
  const secondary = card.brand_color_secondary;

  switch (card.card_theme) {
    case "gradient":
      return {
        container: "text-white",
        containerStyle: {
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
        },
        decoration: null,
        headline: "text-white",
        subhead: "text-white/85",
        body: "text-white/90",
        iconBg: "bg-white/20",
        iconColor: "text-white",
      };
    case "dark":
      return {
        container: "bg-surface-950 text-white",
        containerStyle: {},
        decoration: (
          <span
            aria-hidden
            className="absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full opacity-30 blur-3xl"
            style={{ background: primary }}
          />
        ),
        headline: "text-white",
        subhead: "text-white/70",
        body: "text-white/80",
        iconBg: "bg-white/10",
        iconColor: "text-white",
      };
    case "professional":
      return {
        container: "bg-[#0F172A] text-white",
        containerStyle: {},
        decoration: (
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1"
            style={{ background: `linear-gradient(90deg, ${primary}, ${secondary})` }}
          />
        ),
        headline: "text-white",
        subhead: "text-[#D4A24C]",
        body: "text-white/80",
        iconBg: "bg-white/10",
        iconColor: "text-[#D4A24C]",
      };
    case "creative":
      return {
        container: "text-white",
        containerStyle: {
          background: primary,
        },
        decoration: (
          <>
            <span
              aria-hidden
              className="absolute bottom-[-30px] left-[-30px] h-32 w-32 rounded-full opacity-40 blur-2xl"
              style={{ background: secondary }}
            />
            <span
              aria-hidden
              className="absolute right-[-20px] top-[-20px] h-24 w-24 rounded-full opacity-30 blur-2xl"
              style={{ background: "white" }}
            />
          </>
        ),
        headline: "text-white",
        subhead: "text-white/90",
        body: "text-white/85",
        iconBg: "bg-white/20",
        iconColor: "text-white",
      };
    case "minimal":
    default:
      return {
        container: "bg-white text-surface-900 dark:bg-surface-900 dark:text-white",
        containerStyle: {},
        decoration: (
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1"
            style={{ background: primary }}
          />
        ),
        headline: "text-surface-900 dark:text-white",
        subhead: "text-surface-600 dark:text-surface-300",
        body: "text-surface-700 dark:text-surface-200",
        iconBg: "bg-surface-100 dark:bg-surface-800",
        iconColor: "text-surface-700 dark:text-surface-200",
      };
  }
}

// ── Subcomponents ─────────────────────────────────────────────────────────

function Avatar({ card, compact }: { card: BcCardRow; compact: boolean }) {
  const initials = card.full_name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
  const size = compact ? "h-12 w-12" : "h-20 w-20 sm:h-24 sm:w-24";

  if (card.avatar_url) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={card.avatar_url}
        alt=""
        className={cn(size, "shrink-0 rounded-full border-2 border-white/20 object-cover shadow")}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        size,
        "flex shrink-0 items-center justify-center rounded-full text-lg font-bold shadow"
      )}
      style={{
        background: `linear-gradient(135deg, ${card.brand_color_primary}, ${card.brand_color_secondary})`,
        color: "white",
      }}
    >
      {initials || "·"}
    </span>
  );
}

function ContactRows({ card, styles }: { card: BcCardRow; styles: ThemeStyles }) {
  const rows: { icon: LucideIcon; href: string; label: string; scanType?: string }[] = [];
  if (card.email) rows.push({ icon: Mail, href: `mailto:${card.email}`, label: card.email, scanType: "email_tap" });
  if (card.phone_primary) rows.push({ icon: Phone, href: `tel:${card.phone_primary}`, label: card.phone_primary, scanType: "phone_tap" });
  if (card.phone_secondary) rows.push({ icon: Phone, href: `tel:${card.phone_secondary}`, label: card.phone_secondary, scanType: "phone_tap" });
  if (card.website) {
    const url = card.website.startsWith("http") ? card.website : `https://${card.website}`;
    rows.push({ icon: Globe, href: url, label: card.website.replace(/^https?:\/\//, ""), scanType: "website_tap" });
  }
  // Address shown on the card only when vcf_include_address is true —
  // otherwise the owner considered it private.
  if (card.vcf_include_address && (card.address_city || card.address_country)) {
    const line = [card.address_city, card.address_state, card.address_country].filter(Boolean).join(", ");
    if (line) rows.push({ icon: MapPin, href: `https://maps.google.com/?q=${encodeURIComponent(line)}`, label: line });
  }

  if (rows.length === 0) return null;
  return (
    <ul className="space-y-1.5">
      {rows.map((r, i) => (
        <li key={i}>
          <a
            href={r.href}
            target={r.href.startsWith("http") ? "_blank" : undefined}
            rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
            data-scan-type={r.scanType}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-white/10",
              styles.body
            )}
          >
            <span className={cn("inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full", styles.iconBg)}>
              <r.icon className={cn("h-4 w-4", styles.iconColor)} />
            </span>
            <span className="min-w-0 truncate">{r.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function ContactSummary({ card, styles }: { card: BcCardRow; styles: ThemeStyles }) {
  const parts: string[] = [];
  if (card.email) parts.push(card.email);
  else if (card.phone_primary) parts.push(card.phone_primary);
  else if (card.website) parts.push(card.website.replace(/^https?:\/\//, ""));
  if (parts.length === 0) return null;
  return <p className={cn("truncate text-xs opacity-80", styles.body)}>{parts[0]}</p>;
}

function SocialGrid({ socials, styles }: { socials: BcSocialLink[]; styles: ThemeStyles }) {
  if (!socials.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {socials.map((s, i) => {
        const Icon = platformIcon(s.platform);
        return (
          <li key={i}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              data-scan-type="social_click"
              data-scan-platform={s.platform}
              className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105", styles.iconBg)}
              aria-label={s.label ?? s.platform}
              title={s.label ?? s.platform}
            >
              <Icon className={cn("h-4 w-4", styles.iconColor)} width={16} height={16} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Icon picker for social platforms. Brand glyphs are shipped as inline
 *  currentColor SVGs (`components/icons/SocialIcons`) so they inherit the
 *  themed foreground colour just like the lucide icons do. `custom` and
 *  any unknown platform fall back to a generic globe. */
type IconComponent =
  | LucideIcon
  | ((props: SVGProps<SVGSVGElement>) => React.ReactElement);

function platformIcon(platform: BcSocialLink["platform"]): IconComponent {
  switch (platform) {
    case "linkedin":
      return LinkedinIcon;
    case "twitter":
      return TwitterIcon;
    case "instagram":
      return InstagramIcon;
    case "facebook":
      return FacebookIcon;
    case "youtube":
      return YoutubeIcon;
    case "tiktok":
      return TiktokIcon;
    case "github":
      return GithubIcon;
    case "dribbble":
      return DribbbleIcon;
    case "behance":
      return BehanceIcon;
    case "whatsapp":
      return WhatsappIcon;
    case "telegram":
      return TelegramIcon;
    case "calendly":
      return CalendlyIcon;
    case "linktree":
      return LinktreeIcon;
    case "custom":
    default:
      return Globe;
  }
}
