/**
 * File-type validation for the Share tool's file-share mode.
 *
 * Defense in depth — we check three things:
 *   1. Extension (cheap, catches the obvious .exe / .bat / .sh / etc).
 *   2. MIME type reported by the browser (less trustworthy, but still
 *      filters out the most common abuse vectors).
 *   3. Size (hard cap at 25 MB per file).
 *
 * Real protection from a determined attacker would need on-server byte
 * inspection (magic-number sniffing) — we deliberately don't do that
 * for Phase 2: the auto-delete-on-report policy is the actual safety
 * mechanism, not file-content scanning.
 */

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

/**
 * Extensions we refuse to host. Mostly executables and scripts that have
 * any chance of harming a recipient if double-clicked. Compressed archives
 * are allowed (.zip / .7z / .tar.gz) because blocking them gets in the way
 * of legitimate use; the warning text in the UI tells users that archive
 * contents are not inspected.
 */
const BLOCKED_EXTENSIONS = new Set([
  // Windows executables
  "exe",
  "bat",
  "cmd",
  "com",
  "scr",
  "msi",
  "msp",
  "msu",
  // Installers / disk images
  "dmg",
  "app",
  "pkg",
  "deb",
  "rpm",
  // Scripts
  "sh",
  "ps1",
  "vbs",
  "vbe",
  "wsf",
  "wsh",
  "hta",
  // Java / Android / iOS apps
  "jar",
  "apk",
  "ipa",
  // Native libraries
  "dll",
  "so",
  "dylib",
]);

/**
 * MIME prefixes we accept without question. Anything outside this list
 * still passes if its extension isn't in BLOCKED_EXTENSIONS — i.e. we
 * default to allow but block obvious risks.
 */
const SAFE_MIME_PREFIXES: readonly string[] = [
  "image/",
  "audio/",
  "text/",
  "application/pdf",
  "application/zip",
  "application/x-7z-compressed",
  "application/x-tar",
  "application/gzip",
  "application/json",
  "application/xml",
  // Microsoft Office
  "application/msword",
  "application/vnd.ms-",
  "application/vnd.openxmlformats-",
  // OpenDocument
  "application/vnd.oasis.opendocument.",
  // Apple iWork (also application/ but specific)
  "application/vnd.apple.",
];

/**
 * Hard-blocked MIME types — these get rejected even if the extension is
 * something innocent-looking. Catches the common "rename your .exe to
 * .pdf" attack at upload time.
 */
const BLOCKED_MIMES: readonly string[] = [
  "application/x-msdownload",
  "application/x-msdos-program",
  "application/x-executable",
  "application/x-mach-binary",
  "application/x-sh",
  "application/x-bat",
  // Video — explicitly out of scope for Phase 2 (file sizes are too large
  // for our 25 MB cap to be useful, and many video formats can carry
  // executable payloads in unusual containers).
  "video/",
];

export interface FileValidationResult {
  ok: boolean;
  /** User-readable rejection message when !ok. */
  error?: string;
}

/**
 * Extract the lowercased extension (no leading dot). Handles compound
 * extensions like `.tar.gz` by returning just the trailing piece.
 */
export function getExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot === -1 || dot === filename.length - 1) return "";
  return filename.slice(dot + 1).toLowerCase();
}

/**
 * Cheap server-side check: filename + size + MIME. Run this at the init
 * endpoint before issuing a signed upload URL — keeps obvious abuse from
 * burning a Storage write at all.
 */
export function validateFileMetadata(
  filename: string,
  size: number,
  mimetype: string
): FileValidationResult {
  if (!filename || !filename.trim()) {
    return { ok: false, error: "File needs a name." };
  }
  if (filename.length > 255) {
    return { ok: false, error: "Filename is too long." };
  }
  // Path-traversal / control chars — keep filenames simple.
  if (/[/\\]|[\x00-\x1f]/.test(filename)) {
    return {
      ok: false,
      error: "Filename contains characters that aren't allowed.",
    };
  }
  if (!Number.isFinite(size) || size <= 0) {
    return { ok: false, error: "File looks empty." };
  }
  if (size > MAX_FILE_SIZE_BYTES) {
    const mb = (size / 1024 / 1024).toFixed(1);
    return { ok: false, error: `File is ${mb} MB — the limit is 25 MB.` };
  }

  const ext = getExtension(filename);
  if (BLOCKED_EXTENSIONS.has(ext)) {
    return {
      ok: false,
      error:
        "For security reasons, we don't allow executable files. Please share it via a different method or compress into a zip if needed.",
    };
  }

  const m = (mimetype || "").toLowerCase();
  if (m) {
    for (const blocked of BLOCKED_MIMES) {
      if (m.startsWith(blocked)) {
        return {
          ok: false,
          error:
            blocked === "video/"
              ? "Video files aren't supported yet. (Coming later — they're too large for the current 25 MB cap.)"
              : "That file type isn't allowed for security reasons.",
        };
      }
    }
    // If MIME is provided but is not in the safe list AND the extension
    // is also unknown, we still allow — defaulting open is friendlier
    // than defaulting closed for legitimate use of unusual file types.
    // The blocklist above already covers the dangerous cases.
  }

  return { ok: true };
}

/** Sanitise a filename so it's safe as a Storage object key. */
export function sanitiseFilename(filename: string): string {
  // Replace anything that isn't a letter, number, dot, dash or underscore.
  // Storage paths allow most things, but this keeps download filenames
  // and Content-Disposition headers from getting weird.
  return filename
    .normalize("NFKD")
    .replace(/[^\w.\-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 200);
}

/** Format bytes the same way pdfClient.formatBytes does — duplicated here
 *  because lib/pdfClient.ts is "use client" and this file is shared. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Suffix the UI shows under the file dropzone — single source of truth
 *  so we never display a different cap than we enforce. */
export const FILE_LIMIT_LABEL = "25 MB per file";
