import type {
  SignatureData,
  SocialPlatform,
  TemplateId,
} from "./emailSignature";

/**
 * Bulletproof HTML email-signature generator.
 *
 * This file is the single point where email-client hostility is
 * absorbed. Outlook desktop uses the Microsoft Word rendering engine,
 * Gmail strips <style> blocks and <link> tags, Yahoo drops class
 * attributes — so the output here uses the lowest-common-denominator
 * subset that works in every mainstream client:
 *
 *   - Layout is entirely nested <table>/<tr>/<td>. No <div>, no
 *     flexbox, no grid, no float.
 *   - Every style is inline via style="…". No <style> blocks, no
 *     classes, no external CSS.
 *   - Web-safe fonts only — data.font must be a stack from
 *     lib/emailSignature.ts WEB_SAFE_FONTS.
 *   - Images referenced by public URL. No base64 (Gmail blocks it).
 *   - Every <img> has explicit width, height, alt, and
 *     display:block; border:0;.
 *   - Dividers are <td> elements with a background-color and a fixed
 *     width or height — never a CSS border on a div.
 *   - Bulletproof CTA buttons: a <td> with background-color plus an
 *     <a> that has display:inline-block and padding. No <button>.
 *   - border-radius on avatars: Outlook desktop ignores it and shows a
 *     square; this is expected and acceptable.
 *   - All user-provided text is escaped for the five HTML chars before
 *     interpolation so an unclosed tag in a job title can never break
 *     the surrounding markup.
 *
 * The return value is JUST the signature block — no <html>, <head>,
 * <body>. Consumers concatenate it into whatever context they need.
 */

// ── Config ────────────────────────────────────────────────────────────────

/** Where the social-icon PNGs are hosted. Files must exist at:
 *    public/email-icons/<platform>.png
 *  for every platform in SOCIAL_LABELS below. 24×24, transparent bg,
 *  designed to read in both light and dark email clients. */
const SOCIAL_ICON_BASE = "https://utilityapps.site/email-icons";

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  twitter: "Twitter",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  github: "GitHub",
  whatsapp: "WhatsApp",
  calendly: "Calendly",
  website: "Website",
};

/** Muted grey used for the optional disclaimer. Deliberately not
 *  data.textColor — legal text should read as secondary. */
const DISCLAIMER_COLOR = "#9CA3AF";

// ── Escapers ──────────────────────────────────────────────────────────────

/** Escapes the five HTML special chars so user input can't break the
 *  surrounding markup or inject attributes. Used for both element
 *  content and attribute values — since we quote every attribute with
 *  ", encoding " → &quot; is enough for attribute-context safety too. */
function escape(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Multi-line user text (mainly the address and disclaimer): escape
 *  first, then convert newlines to <br> so the paragraph breaks the
 *  user typed survive into the rendered signature. */
function multiline(s: string): string {
  return escape(s).replace(/\r?\n/g, "<br>");
}

// ── Field helpers ─────────────────────────────────────────────────────────

function has(s: string | undefined | null): boolean {
  return typeof s === "string" && s.trim().length > 0;
}

/** Normalise a user-typed URL to an absolute one. "example.com" and
 *  "www.example.com" both become "https://…" so the href actually
 *  navigates. Already-absolute URLs pass through untouched. */
function normalizeUrl(url: string): string {
  const t = url.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

/** Human-friendly URL for display: strip protocol, `www.`, trailing
 *  slash. What we render inside the anchor, not what we href to. */
function displayUrl(url: string): string {
  return url
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

/** Strip formatting to build a valid tel: href. Retains + and digits. */
function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function mailtoHref(email: string): string {
  return `mailto:${email.trim()}`;
}

// ── Small building blocks ────────────────────────────────────────────────

interface StyleOptions {
  primary: string;
  text: string;
  font: string;
}

/** Inline-styled anchor used for every clickable value (email, phone,
 *  website, mobile). Underlined so it reads as a link even when
 *  colour is subtle. */
function link(href: string, innerHtml: string, color: string): string {
  return `<a href="${escape(href)}" style="color:${escape(color)}; text-decoration:underline;">${innerHtml}</a>`;
}

/** Stacked contact block — one line per contact channel, separated by
 *  <br>. Used inside details columns where vertical space is fine
 *  (classic-left, photo-right, modern-divider, minimal-text, etc.). */
function buildContactStack(data: SignatureData, opts: StyleOptions): string {
  const lines: string[] = [];
  if (has(data.email)) {
    lines.push(link(mailtoHref(data.email), escape(data.email), opts.text));
  }
  if (has(data.phone)) {
    lines.push(link(telHref(data.phone), escape(data.phone), opts.text));
  }
  if (has(data.mobile)) {
    // Prefix so mobile isn't confused with phone at a glance.
    lines.push(`M: ${link(telHref(data.mobile), escape(data.mobile), opts.text)}`);
  }
  if (has(data.website)) {
    lines.push(
      link(normalizeUrl(data.website), escape(displayUrl(data.website)), opts.text)
    );
  }
  if (has(data.address)) {
    lines.push(multiline(data.address));
  }
  return lines.join("<br>");
}

/** Inline contact block — all channels on one line separated by the
 *  primary-coloured middot. Used by compact and horizontal-bar. */
function buildContactInline(data: SignatureData, opts: StyleOptions): string {
  const items: string[] = [];
  if (has(data.email)) {
    items.push(link(mailtoHref(data.email), escape(data.email), opts.text));
  }
  if (has(data.phone)) {
    items.push(link(telHref(data.phone), escape(data.phone), opts.text));
  }
  if (has(data.mobile)) {
    items.push(link(telHref(data.mobile), `M ${escape(data.mobile)}`, opts.text));
  }
  if (has(data.website)) {
    items.push(
      link(normalizeUrl(data.website), escape(displayUrl(data.website)), opts.text)
    );
  }
  if (items.length === 0) return "";
  const sep = ` <span style="color:${escape(opts.primary)};">·</span> `;
  return items.join(sep);
}

/** Horizontal row of social-icon anchors. Each icon is 24×24, spaced
 *  by td padding — no CSS margin because Outlook eats margins in many
 *  contexts. */
function buildSocialRow(data: SignatureData): string {
  const links = (data.socialLinks ?? []).filter((s) => has(s.url));
  if (links.length === 0) return "";
  const cells = links
    .map((s) => {
      const url = normalizeUrl(s.url);
      const label = SOCIAL_LABELS[s.platform] ?? String(s.platform);
      const iconUrl = `${SOCIAL_ICON_BASE}/${s.platform}.png`;
      return `<td style="padding:0 6px 0 0;"><a href="${escape(url)}" style="text-decoration:none;"><img src="${escape(iconUrl)}" width="24" height="24" alt="${escape(label)}" style="display:block; border:0;"></a></td>`;
    })
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table>`;
}

/** Bulletproof CTA button. The <td> background paints the button
 *  colour even in clients that eat <a> backgrounds; the <a> gets the
 *  padding + inline-block so the whole button surface is clickable
 *  and hits its rendered size in Outlook. Returns "" when either
 *  ctaText or ctaUrl is empty. */
function buildCtaButton(data: SignatureData, opts: StyleOptions): string {
  if (!has(data.ctaText) || !has(data.ctaUrl)) return "";
  const url = normalizeUrl(data.ctaUrl);
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:${escape(opts.primary)}; border-radius:4px;"><a href="${escape(url)}" style="display:inline-block; padding:10px 20px; font-family:${escape(opts.font)}; font-size:13px; font-weight:bold; color:#ffffff; text-decoration:none; border-radius:4px;">${escape(data.ctaText)}</a></td></tr></table>`;
}

/** Small grey block for legal / confidentiality text. Its own
 *  nested table with padding — no <div>. */
function buildDisclaimer(data: SignatureData): string {
  if (!has(data.disclaimer)) return "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="font-size:10px; color:${DISCLAIMER_COLOR}; line-height:1.4;">${multiline(data.disclaimer)}</td></tr></table>`;
}

/** Outer table + optional CTA row + optional disclaimer row. Every
 *  template dispatches its layout-specific inner HTML through here so
 *  the CTA and disclaimer chrome stays consistent regardless of
 *  template choice. */
function frame(inner: string, data: SignatureData, opts: StyleOptions): string {
  const rows: string[] = [];
  rows.push(`<tr><td style="padding:0;">${inner}</td></tr>`);
  const cta = buildCtaButton(data, opts);
  if (cta) rows.push(`<tr><td style="padding:14px 0 0 0;">${cta}</td></tr>`);
  const disc = buildDisclaimer(data);
  if (disc) rows.push(`<tr><td style="padding:12px 0 0 0;">${disc}</td></tr>`);
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:500px; font-family:${escape(opts.font)}; color:${escape(opts.text)}; font-size:12px; line-height:1.4;">${rows.join("")}</table>`;
}

/** Combined title/company line — "Founder · UtilityApps". Skips
 *  whichever side is empty. */
function joinTitleCompany(data: SignatureData): string {
  const parts = [
    has(data.jobTitle) ? escape(data.jobTitle) : "",
    has(data.company) ? escape(data.company) : "",
  ].filter(Boolean);
  return parts.join(" · ");
}

// ── Photo / logo cells ────────────────────────────────────────────────────

/** Circular headshot (border-radius:50% ignored by Outlook → square,
 *  which we accept). Explicit width/height matter — some clients scale
 *  images down without them. */
function photoImg(data: SignatureData, size: number): string {
  if (!has(data.photoUrl)) return "";
  return `<img src="${escape(data.photoUrl)}" width="${size}" height="${size}" alt="${escape(data.fullName)}" style="display:block; border:0; border-radius:50%;">`;
}

/** Company logo. Not rounded — logos usually have their own crop /
 *  padding baked in and forcing a circle mask breaks brand marks. */
function logoImg(data: SignatureData, width: number, height: number): string {
  if (!has(data.logoUrl)) return "";
  return `<img src="${escape(data.logoUrl)}" width="${width}" height="${height}" alt="${escape(data.company) || "Company logo"}" style="display:block; border:0;">`;
}

// ── Templates ─────────────────────────────────────────────────────────────
//
// Every template renderer takes SignatureData → HTML string. Each one is
// self-contained (no shared "details column" abstraction), because email
// HTML layout tradeoffs differ enough per template that a shared helper
// would be full of if/else branches anyway.

/** Photo left, thin coloured vertical rule, details right. */
function renderClassicLeft(data: SignatureData): string {
  const opts: StyleOptions = {
    primary: data.primaryColor,
    text: data.textColor,
    font: data.font,
  };

  const detailRows: string[] = [];
  if (has(data.fullName)) {
    detailRows.push(
      `<tr><td style="font-size:16px; font-weight:bold; color:${escape(data.primaryColor)}; padding-bottom:2px;">${escape(data.fullName)}</td></tr>`
    );
  }
  const titleLine = joinTitleCompany(data);
  if (titleLine) {
    detailRows.push(
      `<tr><td style="font-size:13px; color:${escape(data.textColor)}; padding-bottom:2px;">${titleLine}</td></tr>`
    );
  }
  if (has(data.department)) {
    detailRows.push(
      `<tr><td style="font-size:12px; color:${escape(data.textColor)}; padding-bottom:8px;">${escape(data.department)}</td></tr>`
    );
  }
  const contact = buildContactStack(data, opts);
  if (contact) {
    detailRows.push(
      `<tr><td style="font-size:12px; color:${escape(data.textColor)}; padding-bottom:8px;">${contact}</td></tr>`
    );
  }
  const social = buildSocialRow(data);
  if (social) {
    detailRows.push(`<tr><td style="padding-top:2px;">${social}</td></tr>`);
  }

  const detailsCell = `<td valign="top" style="${has(data.photoUrl) ? "padding-left:16px;" : ""}"><table role="presentation" cellpadding="0" cellspacing="0" border="0">${detailRows.join("")}</table></td>`;

  const photoCell = has(data.photoUrl)
    ? `<td valign="top" width="80" style="padding-right:16px;">${photoImg(data, 80)}</td><td valign="top" width="1" style="background-color:${escape(data.primaryColor)}; width:1px; min-width:1px; font-size:1px; line-height:1px;">&nbsp;</td>`
    : "";

  const inner = `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${photoCell}${detailsCell}</tr></table>`;
  return frame(inner, data, opts);
}

/** Coloured top bar, name / title row underneath, contact strip. */
function renderHorizontalBar(data: SignatureData): string {
  const opts: StyleOptions = {
    primary: data.primaryColor,
    text: data.textColor,
    font: data.font,
  };

  const rows: string[] = [];
  // 4px coloured bar — a <td> with height + background, not a CSS border.
  rows.push(
    `<tr><td colspan="2" style="background-color:${escape(data.primaryColor)}; height:4px; line-height:4px; font-size:1px;">&nbsp;</td></tr>`
  );
  rows.push(
    `<tr><td colspan="2" style="height:10px; line-height:10px; font-size:1px;">&nbsp;</td></tr>`
  );

  // Name row (with an optional small photo on the right).
  const nameCell = has(data.fullName)
    ? `<td valign="middle" style="font-size:18px; font-weight:bold; color:${escape(data.primaryColor)};">${escape(data.fullName)}</td>`
    : `<td></td>`;
  const photoCell = has(data.photoUrl)
    ? `<td valign="middle" width="48" align="right">${photoImg(data, 48)}</td>`
    : `<td width="0"></td>`;
  rows.push(`<tr>${nameCell}${photoCell}</tr>`);

  const titleLine = joinTitleCompany(data);
  const meta = [titleLine, has(data.department) ? escape(data.department) : ""]
    .filter(Boolean)
    .join(" · ");
  if (meta) {
    rows.push(
      `<tr><td colspan="2" style="font-size:13px; color:${escape(data.textColor)}; padding-top:3px;">${meta}</td></tr>`
    );
  }

  const contact = buildContactInline(data, opts);
  if (contact) {
    rows.push(
      `<tr><td colspan="2" style="font-size:12px; color:${escape(data.textColor)}; padding-top:10px;">${contact}</td></tr>`
    );
  }
  if (has(data.address)) {
    rows.push(
      `<tr><td colspan="2" style="font-size:12px; color:${escape(data.textColor)}; padding-top:4px;">${multiline(data.address)}</td></tr>`
    );
  }
  const social = buildSocialRow(data);
  if (social) {
    rows.push(`<tr><td colspan="2" style="padding-top:10px;">${social}</td></tr>`);
  }

  const inner = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${rows.join("")}</table>`;
  return frame(inner, data, opts);
}

/** Everything centred and stacked, photo on top. */
function renderVerticalStack(data: SignatureData): string {
  const opts: StyleOptions = {
    primary: data.primaryColor,
    text: data.textColor,
    font: data.font,
  };

  const rows: string[] = [];
  if (has(data.photoUrl)) {
    // Centre the photo via align on the td — margin:auto is unreliable in email.
    rows.push(
      `<tr><td align="center" style="padding-bottom:10px;">${photoImg(data, 84)}</td></tr>`
    );
  }
  if (has(data.fullName)) {
    rows.push(
      `<tr><td align="center" style="font-size:16px; font-weight:bold; color:${escape(data.primaryColor)}; padding-bottom:2px;">${escape(data.fullName)}</td></tr>`
    );
  }
  const titleLine = joinTitleCompany(data);
  if (titleLine) {
    rows.push(
      `<tr><td align="center" style="font-size:13px; color:${escape(data.textColor)}; padding-bottom:2px;">${titleLine}</td></tr>`
    );
  }
  if (has(data.department)) {
    rows.push(
      `<tr><td align="center" style="font-size:12px; color:${escape(data.textColor)}; padding-bottom:8px;">${escape(data.department)}</td></tr>`
    );
  }
  const contact = buildContactStack(data, opts);
  if (contact) {
    rows.push(
      `<tr><td align="center" style="font-size:12px; color:${escape(data.textColor)}; padding-bottom:10px;">${contact}</td></tr>`
    );
  }
  const social = buildSocialRow(data);
  if (social) {
    rows.push(`<tr><td align="center" style="padding-top:2px;">${social}</td></tr>`);
  }

  const inner = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${rows.join("")}</table>`;
  return frame(inner, data, opts);
}

/** No photo, slim coloured accent bar on the left. Most Outlook-safe. */
function renderMinimalText(data: SignatureData): string {
  const opts: StyleOptions = {
    primary: data.primaryColor,
    text: data.textColor,
    font: data.font,
  };

  const detailRows: string[] = [];
  if (has(data.fullName)) {
    detailRows.push(
      `<tr><td style="font-size:16px; font-weight:bold; color:${escape(data.primaryColor)}; padding-bottom:2px;">${escape(data.fullName)}</td></tr>`
    );
  }
  const titleLine = joinTitleCompany(data);
  if (titleLine) {
    detailRows.push(
      `<tr><td style="font-size:13px; color:${escape(data.textColor)}; padding-bottom:2px;">${titleLine}</td></tr>`
    );
  }
  if (has(data.department)) {
    detailRows.push(
      `<tr><td style="font-size:12px; color:${escape(data.textColor)}; padding-bottom:8px;">${escape(data.department)}</td></tr>`
    );
  }
  const contact = buildContactStack(data, opts);
  if (contact) {
    detailRows.push(
      `<tr><td style="font-size:12px; color:${escape(data.textColor)}; padding-bottom:8px;">${contact}</td></tr>`
    );
  }
  const social = buildSocialRow(data);
  if (social) {
    detailRows.push(`<tr><td style="padding-top:2px;">${social}</td></tr>`);
  }

  const inner = `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top" width="3" style="background-color:${escape(data.primaryColor)}; width:3px; min-width:3px; font-size:1px; line-height:1px;">&nbsp;</td><td valign="top" style="padding-left:12px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0">${detailRows.join("")}</table></td></tr></table>`;
  return frame(inner, data, opts);
}

/** Mirror of classic-left: details on the left, photo on the right. */
function renderPhotoRight(data: SignatureData): string {
  const opts: StyleOptions = {
    primary: data.primaryColor,
    text: data.textColor,
    font: data.font,
  };

  const detailRows: string[] = [];
  if (has(data.fullName)) {
    detailRows.push(
      `<tr><td style="font-size:16px; font-weight:bold; color:${escape(data.primaryColor)}; padding-bottom:2px;">${escape(data.fullName)}</td></tr>`
    );
  }
  const titleLine = joinTitleCompany(data);
  if (titleLine) {
    detailRows.push(
      `<tr><td style="font-size:13px; color:${escape(data.textColor)}; padding-bottom:2px;">${titleLine}</td></tr>`
    );
  }
  if (has(data.department)) {
    detailRows.push(
      `<tr><td style="font-size:12px; color:${escape(data.textColor)}; padding-bottom:8px;">${escape(data.department)}</td></tr>`
    );
  }
  const contact = buildContactStack(data, opts);
  if (contact) {
    detailRows.push(
      `<tr><td style="font-size:12px; color:${escape(data.textColor)}; padding-bottom:8px;">${contact}</td></tr>`
    );
  }
  const social = buildSocialRow(data);
  if (social) {
    detailRows.push(`<tr><td style="padding-top:2px;">${social}</td></tr>`);
  }

  const photoCell = has(data.photoUrl)
    ? `<td valign="top" width="80" align="right" style="padding-left:16px;">${photoImg(data, 80)}</td>`
    : "";

  const inner = `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><table role="presentation" cellpadding="0" cellspacing="0" border="0">${detailRows.join("")}</table></td>${photoCell}</tr></table>`;
  return frame(inner, data, opts);
}

/** Company logo takes centre stage; personal details are secondary. */
function renderLogoFocus(data: SignatureData): string {
  const opts: StyleOptions = {
    primary: data.primaryColor,
    text: data.textColor,
    font: data.font,
  };

  const rows: string[] = [];
  if (has(data.logoUrl)) {
    // Logo displayed prominently. Fixed width so it doesn't blow past the
    // outer 500px cap on wide screens. Height auto is not respected by all
    // clients; picking a conservative 60px height reads well and keeps the
    // aspect ratio reasonable for most brand marks.
    rows.push(
      `<tr><td style="padding-bottom:14px;">${logoImg(data, 180, 60)}</td></tr>`
    );
  }
  if (has(data.fullName)) {
    rows.push(
      `<tr><td style="font-size:15px; font-weight:bold; color:${escape(data.textColor)}; padding-bottom:2px;">${escape(data.fullName)}</td></tr>`
    );
  }
  const titleLine = joinTitleCompany(data);
  if (titleLine) {
    rows.push(
      `<tr><td style="font-size:12px; color:${escape(data.primaryColor)}; padding-bottom:8px;">${titleLine}</td></tr>`
    );
  }
  const contact = buildContactStack(data, opts);
  if (contact) {
    rows.push(
      `<tr><td style="font-size:12px; color:${escape(data.textColor)}; padding-bottom:8px;">${contact}</td></tr>`
    );
  }
  const social = buildSocialRow(data);
  if (social) {
    rows.push(`<tr><td style="padding-top:2px;">${social}</td></tr>`);
  }

  const inner = `<table role="presentation" cellpadding="0" cellspacing="0" border="0">${rows.join("")}</table>`;
  return frame(inner, data, opts);
}

/** Dense single-line-per-item layout for long signatures. */
function renderCompact(data: SignatureData): string {
  const opts: StyleOptions = {
    primary: data.primaryColor,
    text: data.textColor,
    font: data.font,
  };

  const rows: string[] = [];
  if (has(data.fullName)) {
    rows.push(
      `<tr><td style="font-size:14px; font-weight:bold; color:${escape(data.primaryColor)};">${escape(data.fullName)}</td></tr>`
    );
  }
  const meta = [
    joinTitleCompany(data),
    has(data.department) ? escape(data.department) : "",
  ]
    .filter(Boolean)
    .join(" · ");
  if (meta) {
    rows.push(
      `<tr><td style="font-size:12px; color:${escape(data.textColor)}; padding-top:1px;">${meta}</td></tr>`
    );
  }
  const contact = buildContactInline(data, opts);
  if (contact) {
    rows.push(
      `<tr><td style="font-size:12px; color:${escape(data.textColor)}; padding-top:4px;">${contact}</td></tr>`
    );
  }
  if (has(data.address)) {
    rows.push(
      `<tr><td style="font-size:12px; color:${escape(data.textColor)}; padding-top:2px;">${multiline(data.address)}</td></tr>`
    );
  }
  const social = buildSocialRow(data);
  if (social) {
    rows.push(`<tr><td style="padding-top:6px;">${social}</td></tr>`);
  }

  const inner = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${rows.join("")}</table>`;
  return frame(inner, data, opts);
}

/** Photo left, details right, coloured 2px horizontal rule under name. */
function renderModernDivider(data: SignatureData): string {
  const opts: StyleOptions = {
    primary: data.primaryColor,
    text: data.textColor,
    font: data.font,
  };

  const detailRows: string[] = [];
  if (has(data.fullName)) {
    detailRows.push(
      `<tr><td style="font-size:16px; font-weight:bold; color:${escape(data.textColor)}; padding-bottom:6px;">${escape(data.fullName)}</td></tr>`
    );
    // Horizontal rule as its own row — <td> with background + fixed
    // height. CSS <hr> is inconsistent across clients.
    detailRows.push(
      `<tr><td style="height:2px; line-height:2px; font-size:1px; background-color:${escape(data.primaryColor)}; padding-bottom:0;">&nbsp;</td></tr>`
    );
    detailRows.push(
      `<tr><td style="height:8px; line-height:8px; font-size:1px;">&nbsp;</td></tr>`
    );
  }
  const titleLine = joinTitleCompany(data);
  if (titleLine) {
    detailRows.push(
      `<tr><td style="font-size:13px; color:${escape(data.textColor)}; padding-bottom:2px;">${titleLine}</td></tr>`
    );
  }
  if (has(data.department)) {
    detailRows.push(
      `<tr><td style="font-size:12px; color:${escape(data.textColor)}; padding-bottom:6px;">${escape(data.department)}</td></tr>`
    );
  }
  const contact = buildContactStack(data, opts);
  if (contact) {
    detailRows.push(
      `<tr><td style="font-size:12px; color:${escape(data.textColor)}; padding-bottom:6px;">${contact}</td></tr>`
    );
  }
  const social = buildSocialRow(data);
  if (social) {
    detailRows.push(`<tr><td style="padding-top:2px;">${social}</td></tr>`);
  }

  const photoCell = has(data.photoUrl)
    ? `<td valign="top" width="80" style="padding-right:16px;">${photoImg(data, 80)}</td>`
    : "";
  const inner = `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${photoCell}<td valign="top"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${detailRows.join("")}</table></td></tr></table>`;
  return frame(inner, data, opts);
}

// ── Public API ────────────────────────────────────────────────────────────

const RENDERERS: Record<TemplateId, (d: SignatureData) => string> = {
  "classic-left": renderClassicLeft,
  "horizontal-bar": renderHorizontalBar,
  "vertical-stack": renderVerticalStack,
  "minimal-text": renderMinimalText,
  "photo-right": renderPhotoRight,
  "logo-focus": renderLogoFocus,
  compact: renderCompact,
  "modern-divider": renderModernDivider,
};

/** Turn form-populated SignatureData into a self-contained signature
 *  HTML block. Returns just the signature — no <html>, <head>, <body>
 *  wrapper. Falls back to classic-left when data.template is somehow
 *  an unknown value (shouldn't happen given the union type, but users
 *  can hand us persisted JSON from an older version). */
export function generateSignatureHtml(data: SignatureData): string {
  const renderer = RENDERERS[data.template] ?? renderClassicLeft;
  return renderer(data);
}

/**
 * Plain-text signature — for clients that strip HTML entirely
 * (some corporate gateways, sms-to-email bridges, quoted-reply
 * chains that collapse to text). Kept intentionally sparse: name,
 * role, contact channels, no dividers or ASCII art.
 *
 * Empty fields are skipped, so a bare "name + email" input produces
 * a bare "name + email" output.
 */
export function generateSignaturePlainText(data: SignatureData): string {
  const lines: string[] = [];
  if (has(data.fullName)) lines.push(data.fullName.trim());
  const titleLine = [data.jobTitle, data.company]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join(", ");
  if (titleLine) lines.push(titleLine);
  if (has(data.department)) lines.push(data.department.trim());

  const contactLines: string[] = [];
  if (has(data.email)) contactLines.push(data.email.trim());
  if (has(data.phone)) contactLines.push(data.phone.trim());
  if (has(data.mobile)) contactLines.push(`Mobile: ${data.mobile.trim()}`);
  if (has(data.website)) contactLines.push(displayUrl(data.website));
  if (has(data.address)) contactLines.push(data.address.trim());
  if (contactLines.length > 0) {
    lines.push("");
    lines.push(...contactLines);
  }

  if (has(data.ctaText) && has(data.ctaUrl)) {
    lines.push("");
    lines.push(`${data.ctaText.trim()} → ${normalizeUrl(data.ctaUrl)}`);
  }

  if (has(data.disclaimer)) {
    lines.push("");
    lines.push("--");
    lines.push(data.disclaimer.trim());
  }

  return lines.join("\n");
}
