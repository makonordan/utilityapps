/**
 * vCard 3.0 generator. vCard is the actual differentiator for this
 * feature — scanning saves directly to the phone's contacts app,
 * unlike link-in-bio tools where scanning just opens a webpage.
 *
 * Compatibility target: iOS Contacts, Android Contacts, Gmail Contacts,
 * Microsoft Outlook. We stick to 3.0 (not 4.0) because 4.0 support is
 * still uneven — 3.0 is universally accepted.
 *
 * Reference: RFC 6350 (vCard 4.0) is spec, but real-world we use 3.0
 * per the widely-supported apple.com/business/schoolmanager format.
 */

import type { BcCardRow, BcSocialLink } from "./types";

/** Split a full name into "last;first" per vCard N property. */
function splitName(full: string): { last: string; first: string } {
  const trimmed = full.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length === 0) return { last: "", first: "" };
  if (parts.length === 1) return { last: "", first: parts[0] };
  return { last: parts[parts.length - 1], first: parts.slice(0, -1).join(" ") };
}

/**
 * Escape a value for vCard: commas, semicolons, backslashes, and newlines
 * per RFC 6350 §3.4. Newlines become literal \n in the output.
 */
function escapeVcf(v: string): string {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/**
 * Fold a line to <= 75 octets per RFC 6350 §3.2. Long lines break with
 * CRLF + a single leading space on the continuation. Real-world clients
 * mostly tolerate unfolded lines but strict parsers (Outlook older
 * versions) drop the whole record if a single line exceeds the limit.
 */
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let i = 0;
  while (i < line.length) {
    const end = Math.min(i + 74, line.length);
    chunks.push(line.slice(i, end));
    i = end;
  }
  return chunks.join("\r\n ");
}

function line(key: string, value: string): string {
  return foldLine(`${key}:${value}`);
}

/** vCard socialprofile TYPEs we know Apple / Google Contacts recognise. */
const SOCIAL_TYPE_MAP: Record<BcSocialLink["platform"], string> = {
  linkedin: "linkedin",
  twitter: "twitter",
  instagram: "instagram",
  facebook: "facebook",
  youtube: "youtube",
  tiktok: "tiktok",
  github: "github",
  dribbble: "dribbble",
  behance: "behance",
  whatsapp: "whatsapp",
  telegram: "telegram",
  calendly: "calendly",
  linktree: "linktree",
  custom: "url",
};

export interface VcfOptions {
  /** If set, embedded as base64 PHOTO in the vCard. Card must have
   *  `vcf_include_photo = true`; caller decides. Must be JPEG bytes. */
  photoJpegBase64?: string | null;
  /** REV timestamp. Defaults to card's updated_at. */
  rev?: string;
}

/**
 * Produce a valid vCard 3.0 file body. Returns a plain string (no BOM).
 *
 * The caller is responsible for setting Content-Type: text/vcard and
 * Content-Disposition: attachment; filename="..." — see /api/business-card/vcf/[cardId].
 */
export function buildVcard(card: BcCardRow, opts: VcfOptions = {}): string {
  const { first, last } = splitName(card.full_name);
  const lines: string[] = [];

  lines.push("BEGIN:VCARD");
  lines.push("VERSION:3.0");

  // FN is the display name; N is the structured surname/given breakdown.
  lines.push(line("FN", escapeVcf(card.full_name)));
  lines.push(line("N", `${escapeVcf(last)};${escapeVcf(first)};;;`));

  if (card.company_name || card.department) {
    const orgVal = card.department
      ? `${escapeVcf(card.company_name ?? "")};${escapeVcf(card.department)}`
      : escapeVcf(card.company_name ?? "");
    lines.push(line("ORG", orgVal));
  }
  if (card.job_title) {
    lines.push(line("TITLE", escapeVcf(card.job_title)));
  }

  // NOTE combines the card's tagline (if any) and the vcf_notes custom
  // note. Order: tagline, blank line, notes — so scanners see the
  // "hook" first and any context second.
  const noteParts = [card.tagline?.trim(), card.vcf_notes?.trim()].filter(
    (s): s is string => Boolean(s && s.length > 0)
  );
  if (noteParts.length) {
    lines.push(line("NOTE", escapeVcf(noteParts.join("\n\n"))));
  }

  if (card.email) {
    lines.push(line("EMAIL;TYPE=INTERNET", escapeVcf(card.email)));
  }
  if (card.phone_primary) {
    lines.push(line("TEL;TYPE=CELL", escapeVcf(card.phone_primary)));
  }
  if (card.phone_secondary) {
    lines.push(line("TEL;TYPE=WORK", escapeVcf(card.phone_secondary)));
  }
  if (card.website) {
    lines.push(line("URL", escapeVcf(card.website)));
  }

  if (card.vcf_include_address) {
    // ADR = pobox;extended;street;locality;region;postal;country
    const adr = [
      "", // po box
      "", // extended
      escapeVcf(card.address_street ?? ""),
      escapeVcf(card.address_city ?? ""),
      escapeVcf(card.address_state ?? ""),
      escapeVcf(card.address_postal ?? ""),
      escapeVcf(card.address_country ?? ""),
    ].join(";");
    if (adr.replace(/;/g, "").trim().length > 0) {
      lines.push(line("ADR;TYPE=WORK", adr));
    }
  }

  // Social profiles — X-SOCIALPROFILE is Apple/Google's accepted extension
  // for third-party network URLs. Falls back to URL for the custom case
  // (some parsers ignore unknown X- lines, so at least URL is captured).
  for (const s of card.social_links ?? []) {
    if (!s.url) continue;
    const t = SOCIAL_TYPE_MAP[s.platform] ?? "url";
    lines.push(line(`X-SOCIALPROFILE;TYPE=${t}`, escapeVcf(s.url)));
  }

  // PHOTO must be after the identity lines; base64 is folded into the
  // 75-byte chunks like any other line. Modern clients accept the URI
  // form too but base64 works offline and doesn't leak referrer.
  if (opts.photoJpegBase64) {
    // Strip any accidental `data:image/jpeg;base64,` prefix.
    const b64 = opts.photoJpegBase64.replace(/^data:image\/[^;]+;base64,/, "");
    lines.push(foldLine(`PHOTO;ENCODING=b;TYPE=JPEG:${b64}`));
  }

  const rev = opts.rev ?? card.updated_at;
  if (rev) {
    // Format REV as basic ISO without milliseconds — clients don't need them.
    const isoNoMs = rev.replace(/\.\d+/, "").replace(/[-:]/g, "");
    lines.push(line("REV", isoNoMs));
  }

  lines.push("END:VCARD");
  return lines.join("\r\n") + "\r\n";
}

/** Suggest a filename for the downloaded .vcf. Strips characters that
 *  break OS file managers on save. */
export function vcfFilename(fullName: string): string {
  const safe = fullName
    .trim()
    .replace(/[/\\:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${safe || "contact"}.vcf`;
}
