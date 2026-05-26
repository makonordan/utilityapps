/**
 * Slug generation + custom-slug validation for the Share tool.
 *
 * Random slugs use a 31-char unambiguous alphabet (no 0/O, 1/l/I, no
 * vowels-that-spell-words risk — though for 6-char strings collisions
 * with offensive words are still possible; the reserved list below
 * blocks the obvious ones).
 *
 * Uniqueness is checked by the caller, not here — keep this file
 * pure so the same logic is testable without a DB.
 */

// 31 chars: lowercase consonants + digits 2-9. No vowels => no real words.
// No ambiguous chars: omitted 0, 1, l, i, o.
const SLUG_ALPHABET = "bcdfghjkmnpqrstvwxyz23456789";

/** Generate a random slug of `length` chars. Default 6 → ~887M possibilities. */
export function generateSlug(length = 6): string {
  // crypto.getRandomValues for a uniform distribution. Math.random is biased
  // toward the lower end of the alphabet on some engines.
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += SLUG_ALPHABET[bytes[i] % SLUG_ALPHABET.length];
  }
  return out;
}

/**
 * Reserved slugs — never generated and never accepted as custom. Includes
 * route names we own and a small set of dangerous-looking words.
 */
const RESERVED_SLUGS = new Set([
  // Site routes that must not collide with /s/<slug>
  "admin",
  "api",
  "about",
  "blog",
  "categories",
  "contact",
  "donate",
  "embeds",
  "favicon",
  "feed",
  "help",
  "legal",
  "login",
  "logout",
  "manifest",
  "new",
  "pricing",
  "privacy",
  "products",
  "profile",
  "robots",
  "rss",
  "search",
  "settings",
  "share",
  "shares",
  "signin",
  "signup",
  "sitemap",
  "static",
  "support",
  "terms",
  "tools",
  "trending",
  "unsubscribe",
  "user",
  "users",
  "youtube",
  // Obvious abuse vectors
  "porn",
  "sex",
  "nazi",
  "kill",
  "rape",
  "drugs",
  "scam",
  "phish",
  "phishing",
  "malware",
  "virus",
  "exploit",
  "hack",
  "crack",
]);

export interface SlugValidationResult {
  valid: boolean;
  /** Empty when valid. Filled with a user-readable reason when not. */
  error?: string;
  /** Normalised slug (lowercased). Set when input was acceptable shape. */
  normalised?: string;
}

/**
 * Validate a user-supplied custom slug. Does NOT check database
 * uniqueness — call shares.findBySlug() separately for that.
 */
export function validateCustomSlug(input: string): SlugValidationResult {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) {
    return { valid: false, error: "Custom link can't be empty." };
  }
  if (trimmed.length < 3) {
    return { valid: false, error: "At least 3 characters." };
  }
  if (trimmed.length > 30) {
    return { valid: false, error: "30 characters maximum." };
  }
  if (!/^[a-z0-9-]+$/.test(trimmed)) {
    return {
      valid: false,
      error: "Lowercase letters, numbers and hyphens only.",
    };
  }
  if (trimmed.startsWith("-") || trimmed.endsWith("-")) {
    return { valid: false, error: "Can't start or end with a hyphen." };
  }
  if (trimmed.includes("--")) {
    return { valid: false, error: "Hyphens can't repeat." };
  }
  if (RESERVED_SLUGS.has(trimmed)) {
    return { valid: false, error: "That slug is reserved." };
  }
  return { valid: true, normalised: trimmed };
}

/**
 * Internal helper for the DB layer: confirms a server-generated random
 * slug is acceptable (e.g. accidentally matches a reserved word). Used in
 * the retry loop of generateUniqueSlug().
 */
export function isGeneratedSlugAcceptable(slug: string): boolean {
  return !RESERVED_SLUGS.has(slug);
}
