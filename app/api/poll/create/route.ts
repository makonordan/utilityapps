import { NextRequest, NextResponse } from "next/server";

import {
  checkRateLimit,
  getClientIp,
  hashIp,
} from "@/lib/pollRateLimit";
import {
  POLL_LIMITS,
  generateCreatorToken,
  generatePublicId,
  validatePollInput,
} from "@/lib/pollUtils";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { SITE_CONFIG } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/poll/create
 *
 * Body: { question, options[], pollType?, settings? }
 *   question:  string, 1..200 chars after trim
 *   options:   string[] OR { text: string }[], length 2..10
 *   pollType:  "single" (default) | "multiple"
 *   settings:  {
 *     showResultsBeforeVote?: boolean,
 *     allowMultiplePerDevice?: boolean,
 *   }
 *
 * Returns 200: { ok: true, publicId, creatorToken, shareUrl }
 *         400 for validation errors
 *         429 for per-IP rate limiting (20 polls / hour)
 *         500 for storage failure
 *         503 for missing SUPABASE_SERVICE_ROLE_KEY
 *
 * creatorToken is sensitive — the caller MUST store it in the browser's
 * localStorage under the poll's public_id key. It's the only way for
 * the creator to close/reopen/delete their own poll later, and this
 * endpoint is the last time the server surfaces it. It never appears
 * in the GET response.
 */
const CREATE_RATE_LIMIT_MAX = 20;
const CREATE_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
/** Fresh polls live 30 days by default; matches the schema DEFAULT. */
const POLL_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;
/** Retry cap when generatePublicId happens to collide. 54^8 ≈ 7.2e13
 *  so a single collision at millions of polls is unlikely; three
 *  retries is more than enough to absorb any realistic bad luck. */
const PUBLIC_ID_MAX_ATTEMPTS = 3;

export async function POST(request: NextRequest) {
  // ── Rate limit
  const ip = getClientIp(request.headers);
  const ipKey = await hashIp(ip);
  const rl = checkRateLimit(
    `poll:create:${ipKey}`,
    CREATE_RATE_LIMIT_MAX,
    CREATE_RATE_LIMIT_WINDOW_MS
  );
  if (!rl.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "You've created too many polls in the last hour. Please try again shortly.",
      },
      {
        status: 429,
        headers: rl.retryAfterSec
          ? { "Retry-After": String(rl.retryAfterSec) }
          : {},
      }
    );
  }

  // ── Parse body
  let body: {
    question?: unknown;
    options?: unknown;
    pollType?: unknown;
    settings?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Request body must be JSON." },
      { status: 400 }
    );
  }

  // Accept options as either string[] or { text: string }[] so both the
  // form component and CLI callers work without a wrapping step.
  const optionTexts = Array.isArray(body.options)
    ? (body.options as unknown[]).map((o) =>
        typeof o === "string"
          ? o
          : typeof o === "object" &&
              o !== null &&
              "text" in o &&
              typeof (o as { text: unknown }).text === "string"
            ? ((o as { text: string }).text as string)
            : ""
      )
    : [];
  const question = typeof body.question === "string" ? body.question : "";

  // ── Validate
  const validation = validatePollInput(question, optionTexts);
  if (!validation.valid) {
    return NextResponse.json(
      {
        ok: false,
        error: validation.errors[0]?.message ?? "Invalid poll input.",
        errors: validation.errors,
      },
      { status: 400 }
    );
  }

  // ── Normalise
  const pollType: "single" | "multiple" =
    body.pollType === "multiple" ? "multiple" : "single";
  const settingsInput =
    typeof body.settings === "object" && body.settings !== null
      ? (body.settings as {
          showResultsBeforeVote?: unknown;
          allowMultiplePerDevice?: unknown;
        })
      : {};
  const settings = {
    showResultsBeforeVote: Boolean(settingsInput.showResultsBeforeVote),
    allowMultiplePerDevice: Boolean(settingsInput.allowMultiplePerDevice),
  };

  // Trim, drop empties, cap length. validatePollInput already checked
  // the shape; this is just the canonical form we persist.
  const options = optionTexts
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, POLL_LIMITS.MAX_OPTIONS)
    .map((text) => ({
      id: generateOptionId(),
      text,
    }));

  const creatorToken = generateCreatorToken();
  const expiresAt = new Date(Date.now() + POLL_LIFETIME_MS).toISOString();

  // ── Storage
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "storage-unavailable" },
      { status: 503 }
    );
  }

  // Retry on the (astronomically rare) public_id collision. Postgres
  // signals unique-constraint violation with error code 23505; any
  // other error is fatal on the first attempt.
  let publicId = generatePublicId();
  let insertError: { code?: string; message: string } | null = null;
  for (let attempt = 0; attempt < PUBLIC_ID_MAX_ATTEMPTS; attempt++) {
    const { error } = await admin.from("polls").insert({
      public_id: publicId,
      question: question.trim(),
      options,
      poll_type: pollType,
      creator_token: creatorToken,
      settings,
      expires_at: expiresAt,
    });
    if (!error) {
      insertError = null;
      break;
    }
    insertError = error;
    if (error.code === "23505") {
      publicId = generatePublicId();
      continue;
    }
    break;
  }

  if (insertError) {
    return NextResponse.json(
      { ok: false, error: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    publicId,
    creatorToken,
    shareUrl: `${SITE_CONFIG.url}/tools/instant-poll/${publicId}`,
  });
}

/**
 * Short opaque option identifier. Vote-cast payloads reference options
 * by these strings so reordering / renaming an option in the future
 * wouldn't renumber existing votes. Alphanum from crypto.getRandomValues
 * → 6 chars. 62^6 ≈ 5.7e10 collision space per poll — no risk of
 * collisions within a single 10-option poll.
 */
const OPTION_ID_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateOptionId(): string {
  const buf = new Uint8Array(6);
  crypto.getRandomValues(buf);
  let out = "";
  for (let i = 0; i < buf.length; i++) {
    out += OPTION_ID_CHARSET[buf[i] % OPTION_ID_CHARSET.length];
  }
  return out;
}
