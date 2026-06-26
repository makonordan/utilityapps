import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";
import ConvertAPI from "convertapi";

export const runtime = "nodejs";

// 10 MB cap per file — same as the upstream PDF_Converter project.
const MAX_SIZE = 10 * 1024 * 1024;

/**
 * Office ↔ PDF conversion endpoint, backed by ConvertAPI.
 *
 * Phase 1 of PDF Tools (Merge, Split, Rotate, etc.) runs entirely in the
 * browser. The conversions in *this* file are the Phase 2 server-backed
 * additions — Word, Excel and PowerPoint to/from PDF — that can't reliably
 * be done client-side.
 *
 * History: the iframe embed at /embeds/pdf-converter posts to this route
 * with a PDF and no `target` parameter, expecting a DOCX back. That path
 * stays as the default so the embed keeps working.
 *
 * Request shape (multipart/form-data):
 *   file:   File — the input document
 *   target: string (optional) — one of CONVERSIONS keys. Defaults to
 *           "pdf-to-docx" for backwards compatibility with the embed.
 *
 * Requires a CONVERTAPI_SECRET env var (paid third-party service).
 * Without it the conversion returns a friendly 503 error.
 */

interface ConversionConfig {
  /** What the user uploads. */
  inputMime: string[];
  /**
   * Filename extensions (with leading dot, lowercase) we accept as a
   * fallback when the browser-reported MIME doesn't match `inputMime`.
   * Real-world example: a valid .docx is just a ZIP, so browsers
   * sometimes report `application/zip` or `application/octet-stream`
   * instead of the official Word MIME.
   */
  inputExtensions: string[];
  /** Friendly name of the input format (for error messages). */
  inputName: string;
  /** ConvertAPI source format (left side of /convert/<from>/to/<to>). */
  fromFormat: string;
  /** ConvertAPI target format. */
  toFormat: string;
  /** MIME type to send back. */
  outputMime: string;
  /** Output file extension (with leading dot). */
  outputExt: string;
}

const CONVERSIONS: Record<string, ConversionConfig> = {
  // ----- PDF → Office
  "pdf-to-docx": {
    inputMime: ["application/pdf"],
    inputExtensions: [".pdf"],
    inputName: "PDF",
    fromFormat: "pdf",
    toFormat: "docx",
    outputMime:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    outputExt: ".docx",
  },
  "pdf-to-xlsx": {
    inputMime: ["application/pdf"],
    inputExtensions: [".pdf"],
    inputName: "PDF",
    fromFormat: "pdf",
    toFormat: "xlsx",
    outputMime:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    outputExt: ".xlsx",
  },
  "pdf-to-pptx": {
    inputMime: ["application/pdf"],
    inputExtensions: [".pdf"],
    inputName: "PDF",
    fromFormat: "pdf",
    toFormat: "pptx",
    outputMime:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    outputExt: ".pptx",
  },
  // ----- Office → PDF
  "docx-to-pdf": {
    inputMime: [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ],
    inputExtensions: [".docx", ".doc"],
    inputName: "Word document (.docx or .doc)",
    fromFormat: "docx",
    toFormat: "pdf",
    outputMime: "application/pdf",
    outputExt: ".pdf",
  },
  "xlsx-to-pdf": {
    inputMime: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ],
    inputExtensions: [".xlsx", ".xls"],
    inputName: "Excel workbook (.xlsx or .xls)",
    fromFormat: "xlsx",
    toFormat: "pdf",
    outputMime: "application/pdf",
    outputExt: ".pdf",
  },
  "pptx-to-pdf": {
    inputMime: [
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
    ],
    inputExtensions: [".pptx", ".ppt"],
    inputName: "PowerPoint deck (.pptx or .ppt)",
    fromFormat: "pptx",
    toFormat: "pdf",
    outputMime: "application/pdf",
    outputExt: ".pdf",
  },
};

/** Accept the upload if EITHER the browser-reported MIME matches OR the
 *  filename extension matches. Browsers report .docx / .xlsx / .pptx
 *  inconsistently — .docx is a ZIP at the byte level, so some browsers
 *  surface `application/zip` or `application/octet-stream`. We trust the
 *  extension as a fallback; the actual file format is re-verified by
 *  ConvertAPI on the conversion side. */
function isAcceptedFile(file: File, config: ConversionConfig): boolean {
  if (file.type && config.inputMime.includes(file.type)) return true;
  const lower = file.name.toLowerCase();
  return config.inputExtensions.some((ext) => lower.endsWith(ext));
}

// ---------------------------------------------------- per-IP rate limit
// In-memory token bucket. Best-effort only: Vercel serverless can spawn
// multiple instances, so this won't catch an abuser splitting requests
// across them. The real cap is ConvertAPI's account-level quota; this
// limit is here to deter casual scripting and absent-minded refresh loops.
const RATE_LIMIT_PER_HOUR = Number(
  process.env.CONVERT_RATE_LIMIT_PER_HOUR || 10
);
const RATE_WINDOW_MS = 60 * 60 * 1000;
const rateBuckets = new Map<string, number[]>();

function getClientIp(request: NextRequest): string {
  // Vercel / most proxies set x-forwarded-for; fall back to a safe default.
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

function checkRateLimit(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const history = (rateBuckets.get(ip) ?? []).filter((t) => t > cutoff);
  if (history.length >= RATE_LIMIT_PER_HOUR) {
    const retryAfter = Math.ceil((history[0] + RATE_WINDOW_MS - now) / 1000);
    rateBuckets.set(ip, history);
    return { ok: false, retryAfter };
  }
  history.push(now);
  rateBuckets.set(ip, history);

  // Prune rarely so the Map doesn't grow forever on busy servers.
  if (rateBuckets.size > 5_000 && Math.random() < 0.01) {
    for (const [k, v] of rateBuckets) {
      const kept = v.filter((t) => t > cutoff);
      if (kept.length === 0) rateBuckets.delete(k);
      else rateBuckets.set(k, kept);
    }
  }
  return { ok: true };
}

// -------------------------------------------------------------- handler
export async function POST(request: NextRequest) {
  if (!process.env.CONVERTAPI_SECRET) {
    return NextResponse.json(
      {
        error:
          "Conversion service is not configured on this server. Set CONVERTAPI_SECRET in your environment.",
      },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  // Default target keeps the existing /embeds/pdf-converter UI working.
  const target = String(formData.get("target") || "pdf-to-docx");
  const config = CONVERSIONS[target];
  if (!config) {
    return NextResponse.json(
      {
        error: `Unknown conversion target "${target}". Supported: ${Object.keys(CONVERSIONS).join(", ")}.`,
      },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  const blob = file as File;

  if (!isAcceptedFile(blob, config)) {
    return NextResponse.json(
      {
        error: `Only ${config.inputName} files are accepted for this conversion.`,
      },
      { status: 415 }
    );
  }

  if (blob.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File must be under 10 MB." },
      { status: 413 }
    );
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: `Rate limit reached (${RATE_LIMIT_PER_HOUR} conversions per hour). Try again in ${Math.ceil(limit.retryAfter / 60)} minute(s).`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter) },
      }
    );
  }

  try {
    const convertapi = new ConvertAPI(process.env.CONVERTAPI_SECRET, {
      conversionTimeout: 60,
    });

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    const uploaded = await convertapi.upload(stream, blob.name);
    const result = await convertapi.convert(
      config.toFormat,
      { File: uploaded },
      config.fromFormat
    );

    const outUrl = result.file.url;
    const outResponse = await fetch(outUrl);
    if (!outResponse.ok) {
      throw new Error(`Failed to fetch converted file: ${outResponse.status}`);
    }

    const outBuffer = await outResponse.arrayBuffer();
    // Strip the input extension and append the new one — robust for any case.
    const baseName = blob.name.replace(/\.[^.]+$/, "");
    const outputName = `${baseName}${config.outputExt}`;

    return new NextResponse(outBuffer, {
      status: 200,
      headers: {
        "Content-Type": config.outputMime,
        "Content-Disposition": `attachment; filename="${outputName}"`,
        "Content-Length": String(outBuffer.byteLength),
      },
    });
  } catch (err) {
    const { reportError } = await import("@/lib/error-reporting");
    reportError(err, {
      tag: `api/convert/${target}`,
      extra: { fileSize: blob.size, fileName: blob.name },
    });
    return classifyConversionError(err);
  }
}

/**
 * Map exceptions out of the ConvertAPI client into actionable HTTP
 * responses. Before this existed, every failure returned a generic
 * "Conversion failed. Please try again." — which hid the actual problem
 * from users AND made the support inbox useless because nobody could
 * tell apart "your file is broken" from "ConvertAPI is down" from
 * "secret expired".
 *
 * ConvertAPI's ClientError (node_modules/convertapi/lib/error.js) carries:
 *   - data.Code:    numeric error code from the upstream API
 *   - data.Message: human-readable description
 *   - response:     the underlying axios response (status etc.)
 *
 * The Code ranges roughly split into:
 *   4xxx → input/file problems the user can fix (corrupt, password
 *          protected, unsupported format, too large)
 *   5xxx → account/service problems the user can't fix (auth, quota,
 *          billing, internal)
 *
 * We map those into 422 (file problem) vs 503 (service problem) so the
 * front-end can show distinct messages — and so support escalations
 * include the actual ConvertAPI code rather than "try again".
 */
interface ConvertApiClientError {
  data?: { Code?: number; Message?: string };
  response?: { status?: number };
  message?: string;
}

function classifyConversionError(err: unknown): NextResponse {
  const e = err as ConvertApiClientError;

  const code = e?.data?.Code;
  const upstreamMessage = e?.data?.Message?.trim();
  const errMessage = typeof e?.message === "string" ? e.message : "";

  // Network timeouts to ConvertAPI surface as ETIMEDOUT / ECONNRESET or
  // "timeout exceeded" messages from the SDK itself.
  if (/timeout|ETIMEDOUT|ECONNRESET/i.test(errMessage)) {
    return NextResponse.json(
      {
        error:
          "The conversion took too long. Try a smaller file, or try again in a moment.",
        code: "TIMEOUT",
      },
      { status: 504 }
    );
  }

  if (typeof code === "number") {
    // 4xxx codes describe the input file → tell the user.
    if (code >= 4000 && code < 5000) {
      return NextResponse.json(
        {
          error:
            upstreamMessage ||
            "Your file couldn't be converted. It may be corrupt, password-protected, or in an unsupported format.",
          code: `CONVERTAPI_${code}`,
        },
        { status: 422 }
      );
    }
    // 5xxx codes describe an account/service problem → tell the user it's
    // on our side, log the upstream message for the operator.
    if (code >= 5000 && code < 6000) {
      return NextResponse.json(
        {
          error:
            "The conversion service is temporarily unavailable. Please try again in a few minutes — if this keeps happening, email hello@utilityapps.site.",
          code: `CONVERTAPI_${code}`,
        },
        { status: 503 }
      );
    }
  }

  // Authentication / billing failures from the SDK arrive with HTTP 401/403
  // on the response object, not a Code field.
  const status = e?.response?.status;
  if (status === 401 || status === 403) {
    return NextResponse.json(
      {
        error:
          "The conversion service is temporarily unavailable. Please try again in a few minutes — if this keeps happening, email hello@utilityapps.site.",
        code: "CONVERTAPI_AUTH",
      },
      { status: 503 }
    );
  }

  // Unknown failure. Surface a short snippet of the message so users can
  // include it in a support email. Trim to avoid leaking secrets that
  // might appear in a stack trace.
  const snippet = (upstreamMessage || errMessage).slice(0, 160);
  return NextResponse.json(
    {
      error: snippet
        ? `Conversion failed: ${snippet}`
        : "Conversion failed. Please try again.",
      code: "UNKNOWN",
    },
    { status: 500 }
  );
}
