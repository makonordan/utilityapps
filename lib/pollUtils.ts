/**
 * Utility helpers for the Instant Poll tool at /tools/instant-poll.
 *
 * Pure TypeScript, no React, no browser DOM APIs. Works in Node (API
 * routes) and in the browser (client component) — the only platform
 * dependency is Web Crypto (`globalThis.crypto`), which is available
 * in Node 19+ and every modern browser.
 *
 * The four exports each cover one piece of the abuse-prevention story:
 *
 *   generatePublicId()       — the human-friendly shareable code
 *   generateCreatorToken()   — the secret only the creator holds
 *   computeVoterHash()       — dedupe key used to reject double-votes
 *   validatePollInput()      — content-shape + wordlist guardrail
 *
 * Everything cryptographic uses Web Crypto (`crypto.getRandomValues`,
 * `crypto.subtle.digest`). No third-party dependencies.
 */

// ── Charsets ────────────────────────────────────────────────────────────

/**
 * Unambiguous URL-safe alphabet for public poll IDs. Deliberately omits
 * chars a human would misread when copying from a screenshot or reading
 * aloud in a WhatsApp voice note:
 *   - 0 / O  (zero vs uppercase O)
 *   - 1 / l / I  (one vs lowercase L vs uppercase i)
 * Left with 55 chars → an 8-char id gives 55^8 ≈ 1.4 × 10^13 slots,
 * so accidental collisions are negligible even at millions of polls.
 */
const PUBLIC_ID_CHARSET =
  "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
const PUBLIC_ID_LENGTH = 8;

/** 32-byte creator token → 64 hex chars → 256 bits of entropy. Random
 *  enough to make brute-force impossible without leaking storage. */
const CREATOR_TOKEN_BYTES = 32;

// ── Random ID + token ───────────────────────────────────────────────────

/**
 * Produce an 8-char public poll id from the unambiguous charset above.
 * Uses crypto.getRandomValues so the codes are unpredictable enough that
 * enumerating them is not a viable attack vector.
 *
 * There's a minor modulo bias (256 % 55 ≠ 0) but at 8 chars the effect
 * on distribution is negligible for our purposes — collisions still round
 * to zero even with the bias.
 */
export function generatePublicId(): string {
  const buf = new Uint8Array(PUBLIC_ID_LENGTH);
  crypto.getRandomValues(buf);
  let out = "";
  for (let i = 0; i < PUBLIC_ID_LENGTH; i++) {
    out += PUBLIC_ID_CHARSET[buf[i] % PUBLIC_ID_CHARSET.length];
  }
  return out;
}

/**
 * Cryptographically random 32-byte token, hex-encoded. Stored ONLY in
 * the creator's browser localStorage; the server never exposes it to
 * poll viewers. Used to authorise close/delete requests without an
 * account: the browser sends the token, the API route compares to the
 * value on the polls row.
 */
export function generateCreatorToken(): string {
  const buf = new Uint8Array(CREATOR_TOKEN_BYTES);
  crypto.getRandomValues(buf);
  return bytesToHex(buf);
}

// ── Voter hash ──────────────────────────────────────────────────────────

/**
 * SHA-256 of `${pollId}|${deviceToken}|${userAgent}` → 64-char hex.
 *
 * Purpose: reject a second vote from the same device on the same poll
 * (unless the poll allows multiple votes per device).
 * Non-purpose: identity — the hash reveals nothing about who the voter
 * is. Even the inputs are non-PII: `deviceToken` is a random string the
 * browser generates on first vote and keeps in localStorage;
 * `userAgent` is public request metadata every server already sees.
 *
 * IPs are NOT part of the hash on purpose. Rate limiting uses IPs
 * transiently in the API route (never stored), but the persisted
 * voter_hash stays PII-free even if the database is ever leaked.
 *
 * Async because Web Crypto's subtle.digest is async-only. Callers
 * (API routes) are already async, so this is not a friction cost.
 */
export async function computeVoterHash(
  pollId: string,
  deviceToken: string,
  userAgent: string
): Promise<string> {
  const input = `${pollId}|${deviceToken}|${userAgent}`;
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return bytesToHex(new Uint8Array(digest));
}

// ── Validation ──────────────────────────────────────────────────────────

/** Shape of a validation result. `errors` is empty when valid. */
export interface PollValidationResult {
  valid: boolean;
  errors: PollValidationError[];
}

export interface PollValidationError {
  field: "question" | "options" | "content";
  message: string;
}

/** Max lengths from the DB CHECK constraints. Kept in sync with schema.sql
 *  section 18 — if the DB grows either cap, bump these too. */
export const POLL_LIMITS = {
  QUESTION_MAX_LEN: 200,
  OPTION_MAX_LEN: 80,
  MIN_OPTIONS: 2,
  MAX_OPTIONS: 10,
} as const;

/**
 * Basic profanity / spam wordlist. Deliberately EMPTY out of the box —
 * populating a slur list in a public repo bloats the source and burns
 * moderation credibility (real moderators use content-safety APIs, not
 * hardcoded arrays).
 *
 * Populate this array with lowercase substrings for anything you want
 * to reject at the form level, OR (recommended for anything approaching
 * production) route the input through a proper moderation API:
 *   - OpenAI Moderation (free, decent English coverage)
 *   - Google Perspective API (protected-class harassment)
 *   - Azure Content Safety (multi-lingual)
 * from the API route before writing to the polls table. This function
 * stays as the last-mile guardrail.
 */
const BANNED_TERMS: readonly string[] = [];

function containsAbusiveContent(text: string): boolean {
  if (BANNED_TERMS.length === 0) return false;
  const lower = text.toLowerCase();
  return BANNED_TERMS.some((term) => lower.includes(term));
}

/**
 * Validate a poll input pair (question + options) before it hits the API.
 * Called from both the client (for inline error UX) and the server (as
 * the enforcement point — client-side validation never gates
 * persistence).
 *
 * The rules mirror the DB constraints so a valid input always inserts
 * cleanly:
 *   - question: 1..200 chars after trim
 *   - options:  2..10 entries, each 1..80 chars after trim
 *   - content:  neither the question nor any option trips
 *               containsAbusiveContent()
 *
 * Returned errors are field-tagged so the form can highlight the right
 * input without string-matching on the message.
 */
export function validatePollInput(
  question: string,
  optionTexts: readonly string[]
): PollValidationResult {
  const errors: PollValidationError[] = [];
  const q = (question ?? "").trim();

  if (!q) {
    errors.push({ field: "question", message: "Question is required." });
  } else if (q.length > POLL_LIMITS.QUESTION_MAX_LEN) {
    errors.push({
      field: "question",
      message: `Question must be ${POLL_LIMITS.QUESTION_MAX_LEN} characters or fewer.`,
    });
  }

  const cleanOptions = (optionTexts ?? []).map((t) => (t ?? "").trim());
  const populated = cleanOptions.filter(Boolean);

  if (populated.length < POLL_LIMITS.MIN_OPTIONS) {
    errors.push({
      field: "options",
      message: `Add at least ${POLL_LIMITS.MIN_OPTIONS} options.`,
    });
  }
  if (populated.length > POLL_LIMITS.MAX_OPTIONS) {
    errors.push({
      field: "options",
      message: `Up to ${POLL_LIMITS.MAX_OPTIONS} options allowed.`,
    });
  }
  if (populated.some((o) => o.length > POLL_LIMITS.OPTION_MAX_LEN)) {
    errors.push({
      field: "options",
      message: `Each option must be ${POLL_LIMITS.OPTION_MAX_LEN} characters or fewer.`,
    });
  }
  if (hasDuplicateOptions(populated)) {
    errors.push({
      field: "options",
      message: "Options must be unique.",
    });
  }

  if (containsAbusiveContent(q) || populated.some(containsAbusiveContent)) {
    errors.push({
      field: "content",
      message:
        "This content isn't allowed. Please remove hateful or abusive language and try again.",
    });
  }

  return { valid: errors.length === 0, errors };
}

/** Case-insensitive duplicate check — "Yes" and "yes" collide. */
function hasDuplicateOptions(options: readonly string[]): boolean {
  const seen = new Set<string>();
  for (const o of options) {
    const key = o.toLowerCase();
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}

// ── Byte helpers ────────────────────────────────────────────────────────

function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}
