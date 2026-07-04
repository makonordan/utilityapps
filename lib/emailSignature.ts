/**
 * Data + constants for the Email Signature Generator tool at
 * /tools/email-signature-generator.
 *
 * This file is pure TypeScript — no React, no browser APIs, no client
 * directive. It's imported by both server (metadata, structured data)
 * and client (form + preview) code, and by a follow-up renderer that
 * turns SignatureData into Outlook-safe HTML.
 *
 * The renderer that consumes these types MUST produce markup that
 * follows these rules WITHOUT EXCEPTION, because email clients (Outlook
 * desktop in particular — it uses Microsoft Word's rendering engine)
 * don't support modern HTML/CSS:
 *
 *   - Nested <table> elements for ALL layout. No <div>, flexbox, grid,
 *     or float for positioning.
 *   - Inline EVERY style directly on elements via style="…". No <style>
 *     blocks, no classes, no external CSS.
 *   - Web-safe fonts only (see WEB_SAFE_FONTS below). No Google Fonts.
 *   - Images by public URL via <img src="https://…">. No base64
 *     (Gmail blocks it).
 *   - table cellpadding / cellspacing / align for spacing where possible;
 *     inline padding on <td> otherwise.
 *   - Explicit width + height on every <img>.
 *   - <a href> with inline color styles on every link.
 *   - Wrap the whole signature in one outer <table role="presentation">
 *     with a fixed max-width around 500px.
 *
 * This produces ONE universal signature that renders correctly in Gmail,
 * Outlook (desktop + web), Apple Mail, Yahoo, and mobile clients. We do
 * NOT build separate versions per client — the whole point is that the
 * generated markup is bulletproof enough that we don't have to.
 */

// ── Types ─────────────────────────────────────────────────────────────────

export type SocialPlatform =
  | "linkedin"
  | "twitter"
  | "instagram"
  | "facebook"
  | "youtube"
  | "github"
  | "whatsapp"
  | "calendly"
  | "website";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export type TemplateId =
  | "classic-left"
  | "horizontal-bar"
  | "vertical-stack"
  | "minimal-text"
  | "photo-right"
  | "logo-focus"
  | "compact"
  | "modern-divider";

export interface SignatureData {
  fullName: string;
  jobTitle: string;
  company: string;
  department: string;
  email: string;
  phone: string;
  mobile: string;
  website: string;
  address: string;
  /** Public URL to a hosted headshot. Never base64. */
  photoUrl: string;
  /** Public URL to a hosted company logo. Never base64. */
  logoUrl: string;
  socialLinks: SocialLink[];
  /** Optional CTA button text ("Book a call", "Try the demo", …). */
  ctaText: string;
  /** Destination URL for the CTA button. */
  ctaUrl: string;
  /** Optional legal / confidentiality disclaimer shown below the signature. */
  disclaimer: string;
  /** Accent hex used for the name, divider, and CTA button. */
  primaryColor: string;
  /** Base text hex used for job title, contact rows, and disclaimer. */
  textColor: string;
  /** Web-safe font *stack* — the entire value of a CSS font-family declaration.
   *  Consumers should pick one from WEB_SAFE_FONTS[i].stack, not the display name. */
  font: string;
  template: TemplateId;
}

// ── Templates ─────────────────────────────────────────────────────────────

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  /**
   * Inline SVG markup (as a string) previewing the layout. ~140×80,
   * self-contained, safe to render via dangerouslySetInnerHTML. Uses a
   * fixed accent so the preview reads the same regardless of the user's
   * chosen primaryColor — the primary color is what shows in the live
   * preview, not in the template picker.
   */
  thumbnail: string;
}

/** Fixed accent used inside every template thumbnail SVG. Chosen to match
 *  the site's primary blue so previews feel native to the app. Only the
 *  live preview reflects the user's actual primaryColor selection. */
const THUMB_ACCENT = "#3B82F6";
const THUMB_HEADING = "#374151";
const THUMB_MUTED = "#9CA3AF";
const THUMB_BLOCK = "#D1D5DB";
const THUMB_BG = "#FAFAFA";

/** Wrap a template's inner shapes in a shared 140×80 svg envelope so
 *  every thumbnail is exactly the same size and background. */
function thumb(inner: string): string {
  return `<svg viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="0" width="140" height="80" fill="${THUMB_BG}"/>${inner}</svg>`;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "classic-left",
    name: "Classic Left",
    description:
      "Photo on the left, contact details stacked on the right, thin vertical divider between. The most-recognisable business signature layout.",
    thumbnail: thumb(
      `<rect x="8" y="12" width="40" height="40" rx="4" fill="${THUMB_BLOCK}"/>` +
        `<rect x="8" y="56" width="40" height="4" rx="1" fill="${THUMB_ACCENT}"/>` +
        `<line x1="56" y1="12" x2="56" y2="68" stroke="${THUMB_BLOCK}" stroke-width="1"/>` +
        `<rect x="64" y="14" width="60" height="6" rx="1" fill="${THUMB_HEADING}"/>` +
        `<rect x="64" y="26" width="48" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="64" y="38" width="52" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="64" y="46" width="40" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="64" y="54" width="44" height="4" rx="1" fill="${THUMB_MUTED}"/>`
    ),
  },
  {
    id: "horizontal-bar",
    name: "Horizontal Bar",
    description:
      "Coloured strip across the top, name + title beneath it, contact row along the bottom. Reads well when signatures need to sit under long email chains.",
    thumbnail: thumb(
      `<rect x="0" y="0" width="140" height="6" fill="${THUMB_ACCENT}"/>` +
        `<rect x="12" y="18" width="72" height="8" rx="1" fill="${THUMB_HEADING}"/>` +
        `<rect x="12" y="32" width="56" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="12" y="52" width="20" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="38" y="52" width="20" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="64" y="52" width="20" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="90" y="52" width="20" height="4" rx="1" fill="${THUMB_MUTED}"/>`
    ),
  },
  {
    id: "vertical-stack",
    name: "Vertical Stack",
    description:
      "Everything centred and stacked, photo up top. Reads best on mobile and looks intentional when the signature is short.",
    thumbnail: thumb(
      `<circle cx="70" cy="20" r="12" fill="${THUMB_BLOCK}"/>` +
        `<rect x="50" y="38" width="40" height="6" rx="1" fill="${THUMB_HEADING}"/>` +
        `<rect x="52" y="48" width="36" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="54" y="56" width="32" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="56" y="64" width="28" height="4" rx="1" fill="${THUMB_MUTED}"/>`
    ),
  },
  {
    id: "minimal-text",
    name: "Minimal Text",
    description:
      "No photo, no logo. Clean text with a slim coloured accent bar on the left. The most Outlook-safe template — reliable rendering in every client.",
    thumbnail: thumb(
      `<rect x="12" y="16" width="3" height="48" rx="1" fill="${THUMB_ACCENT}"/>` +
        `<rect x="24" y="18" width="80" height="8" rx="1" fill="${THUMB_HEADING}"/>` +
        `<rect x="24" y="32" width="60" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="24" y="42" width="70" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="24" y="52" width="52" height="4" rx="1" fill="${THUMB_MUTED}"/>`
    ),
  },
  {
    id: "photo-right",
    name: "Photo Right",
    description:
      "Contact details on the left, photo on the right. Mirrors 'Classic Left' — some brands prefer the eye to land on text first.",
    thumbnail: thumb(
      `<rect x="12" y="16" width="60" height="8" rx="1" fill="${THUMB_HEADING}"/>` +
        `<rect x="12" y="30" width="48" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="12" y="42" width="52" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="12" y="52" width="40" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="12" y="62" width="44" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="92" y="16" width="40" height="40" rx="4" fill="${THUMB_BLOCK}"/>`
    ),
  },
  {
    id: "logo-focus",
    name: "Logo Focus",
    description:
      "Company logo takes centre stage; personal details are secondary. Best when the brand matters more than the individual.",
    thumbnail: thumb(
      `<rect x="46" y="10" width="48" height="20" rx="3" fill="${THUMB_ACCENT}" opacity="0.85"/>` +
        `<rect x="30" y="40" width="80" height="6" rx="1" fill="${THUMB_HEADING}"/>` +
        `<rect x="36" y="52" width="68" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="42" y="62" width="56" height="4" rx="1" fill="${THUMB_MUTED}"/>`
    ),
  },
  {
    id: "compact",
    name: "Compact",
    description:
      "Dense single-line-per-item layout. Right pick for people with lots of contact channels — degrees, dual roles, multiple offices.",
    thumbnail: thumb(
      `<rect x="12" y="12" width="90" height="6" rx="1" fill="${THUMB_HEADING}"/>` +
        `<rect x="12" y="22" width="70" height="4" rx="1" fill="${THUMB_ACCENT}"/>` +
        `<rect x="12" y="32" width="110" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="12" y="40" width="100" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="12" y="48" width="105" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="12" y="56" width="90" height="3" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="12" y="64" width="95" height="3" rx="1" fill="${THUMB_MUTED}"/>`
    ),
  },
  {
    id: "modern-divider",
    name: "Modern Divider",
    description:
      "Photo on the left, details on the right, a coloured horizontal rule under the name. Feels current without breaking older clients.",
    thumbnail: thumb(
      `<rect x="8" y="12" width="40" height="40" rx="4" fill="${THUMB_BLOCK}"/>` +
        `<rect x="56" y="14" width="64" height="8" rx="1" fill="${THUMB_HEADING}"/>` +
        `<rect x="56" y="26" width="52" height="2" rx="1" fill="${THUMB_ACCENT}"/>` +
        `<rect x="56" y="34" width="60" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="56" y="44" width="48" height="4" rx="1" fill="${THUMB_MUTED}"/>` +
        `<rect x="56" y="54" width="52" height="4" rx="1" fill="${THUMB_MUTED}"/>`
    ),
  },
];

/** Convenience lookup — templates are frequently accessed by id from the
 *  form state and the renderer. */
export const TEMPLATES_BY_ID: Record<TemplateId, TemplateDefinition> =
  TEMPLATES.reduce(
    (acc, t) => {
      acc[t.id] = t;
      return acc;
    },
    {} as Record<TemplateId, TemplateDefinition>
  );

// ── Web-safe fonts ────────────────────────────────────────────────────────

export interface FontChoice {
  /** Human-friendly name shown in the font picker. */
  name: string;
  /** Full CSS font-family stack — assign this exact string to `font-family`
   *  in the generated signature. Includes fallbacks all the way down to a
   *  generic family, per email-HTML best practice. */
  stack: string;
}

export const WEB_SAFE_FONTS: FontChoice[] = [
  { name: "Arial", stack: "Arial, Helvetica, sans-serif" },
  { name: "Helvetica", stack: "Helvetica, Arial, sans-serif" },
  { name: "Georgia", stack: "Georgia, 'Times New Roman', serif" },
  { name: "Times New Roman", stack: "'Times New Roman', Times, serif" },
  { name: "Verdana", stack: "Verdana, Geneva, sans-serif" },
  { name: "Tahoma", stack: "Tahoma, Geneva, sans-serif" },
];

/** Default when the user hasn't picked yet — Arial is the safest default
 *  because every email client on every platform has it. */
export const DEFAULT_FONT_STACK = WEB_SAFE_FONTS[0].stack;

// ── Install instructions ──────────────────────────────────────────────────

export type InstallPlatform =
  | "gmail"
  | "outlook-desktop"
  | "outlook-web"
  | "apple-mail"
  | "yahoo"
  | "thunderbird";

export interface InstallPlatformMeta {
  /** Display name for the tab / heading. */
  name: string;
  /** One-sentence positioning ("Free Gmail on the web", "Outlook 365 for
   *  Windows/Mac", …) so users know they're on the right instructions. */
  scope: string;
  /** Ordered numbered steps. Each string is a full instruction sentence
   *  — the UI just renders them as an <ol>. */
  steps: string[];
}

/**
 * Where and how to paste the generated signature in each supported mail
 * client. Steps are written to match the current UI (2026) — worth an
 * eyes-on check whenever a vendor ships a UI overhaul.
 *
 * "Paste as rendered content" means the user is pasting the signature
 * into a WYSIWYG box, which is how every mainstream client works. The
 * copy button on the tool page hands the browser rich HTML; the mail
 * client then reads it as formatted content, not raw markup.
 */
export const INSTALL_INSTRUCTIONS: Record<InstallPlatform, InstallPlatformMeta> = {
  gmail: {
    name: "Gmail",
    scope: "Gmail on the web (mail.google.com)",
    steps: [
      "Open Gmail in your browser.",
      "Click the gear icon in the top right, then click 'See all settings'.",
      "On the General tab, scroll down to the Signature section.",
      "Click 'Create new' (or select an existing signature to overwrite).",
      "Click into the signature editor, then paste with Ctrl+V (Windows) or ⌘+V (Mac).",
      "Under 'Signature defaults', pick your new signature for 'For new emails use' and 'On reply/forward use'.",
      "Scroll to the bottom and click 'Save Changes'.",
    ],
  },
  "outlook-desktop": {
    name: "Outlook (desktop)",
    scope: "Outlook 365 / Outlook 2019+ for Windows and Mac",
    steps: [
      "Open Outlook.",
      "Click File in the top-left menu, then click Options.",
      "Choose 'Mail' from the left sidebar of the Options window.",
      "Click the 'Signatures…' button on the right.",
      "Click 'New', give the signature a name, then click OK.",
      "Click into the 'Edit signature' box, then paste with Ctrl+V (Windows) or ⌘+V (Mac).",
      "Under 'Choose default signature', set 'New messages' and 'Replies/forwards' to your new signature.",
      "Click OK to save, then close the Options window.",
    ],
  },
  "outlook-web": {
    name: "Outlook (web)",
    scope: "outlook.office.com / outlook.live.com (Outlook 365 in the browser)",
    steps: [
      "Open Outlook on the web.",
      "Click the gear icon in the top right.",
      "Click 'Mail' in the left column of the Settings panel, then 'Compose and reply'.",
      "Under 'Email signature', click 'New signature' and give it a name.",
      "Click into the editor, then paste with Ctrl+V (Windows) or ⌘+V (Mac).",
      "Under 'Select default signatures', choose your new signature for 'For new messages' and 'For replies/forwards'.",
      "Click Save.",
    ],
  },
  "apple-mail": {
    name: "Apple Mail",
    scope: "Mail.app on macOS (Ventura and newer)",
    steps: [
      "Open the Mail app.",
      "In the menu bar, click 'Mail' then 'Settings…' (called 'Preferences…' on older macOS versions).",
      "Click the 'Signatures' tab in the toolbar.",
      "In the left column, select the account you want the signature for.",
      "Click the '+' button below the middle column to create a new signature.",
      "Uncheck 'Always match my default message font' at the bottom so your fonts and colours are preserved.",
      "Click into the right pane and paste with ⌘+V.",
      "Below the middle column, use the 'Choose Signature' menu to make the new one your default for that account.",
      "Close the Settings window — changes save automatically.",
    ],
  },
  yahoo: {
    name: "Yahoo Mail",
    scope: "Yahoo Mail on the web (mail.yahoo.com)",
    steps: [
      "Open Yahoo Mail in your browser.",
      "Click the Settings gear icon in the top right, then click 'More Settings'.",
      "Click 'Writing email' in the left sidebar.",
      "Under 'Signature', toggle the switch on for the account you want to add the signature to.",
      "Click into the rich-text editor, then paste with Ctrl+V (Windows) or ⌘+V (Mac).",
      "Yahoo saves automatically — send yourself a test email to confirm.",
    ],
  },
  thunderbird: {
    name: "Thunderbird",
    scope: "Mozilla Thunderbird on Windows, Mac, and Linux",
    steps: [
      "Open Thunderbird.",
      "Right-click your email address in the folder tree on the left, then click 'Settings' (or use Tools → Account Settings).",
      "In the account settings, scroll to the 'Signature text' field.",
      "Check the box labelled 'Use HTML'.",
      "Click 'Show Source' on the tool page to reveal the raw HTML, copy it, then paste it into the 'Signature text' box.",
      "Click OK to save.",
    ],
  },
};

/** Ordering used by the UI when rendering install-instruction tabs. Gmail
 *  and Outlook lead because that's ~90% of business email; the rest
 *  follow in rough share order. */
export const INSTALL_PLATFORM_ORDER: InstallPlatform[] = [
  "gmail",
  "outlook-desktop",
  "outlook-web",
  "apple-mail",
  "yahoo",
  "thunderbird",
];
