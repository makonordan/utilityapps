"use client";

import { useCallback, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  FileCode2,
} from "lucide-react";

import {
  INSTALL_INSTRUCTIONS,
  INSTALL_PLATFORM_ORDER,
  type InstallPlatform,
} from "@/lib/emailSignature";
import { cn } from "@/lib/utils";

/**
 * Copy/export + per-client install guide for the Email Signature
 * Generator. Sits below the two-column form-and-preview grid as a full
 * width row so the CTAs and step-by-step instructions get the same
 * horizontal real estate no matter which template the user picked.
 *
 * Three export paths, one per how people actually get signatures into
 * mail clients:
 *
 *  1. "Copy signature"   — rich HTML → clipboard. Paste into Gmail's
 *                          WYSIWYG editor, Outlook Web, Apple Mail,
 *                          Yahoo. Works everywhere except gateways
 *                          that strip formatted content.
 *  2. "Copy HTML source" — the same markup as plain text, for
 *                          Thunderbird / any client with an HTML-source
 *                          signature editor.
 *  3. "Download .htm"    — the signature wrapped in a minimal
 *                          <html><body> envelope, saved as an
 *                          Outlook-friendly .htm file. Outlook desktop
 *                          imports these way more reliably than a
 *                          clipboard paste.
 */

export function SignatureExport({
  html,
  plainText,
}: {
  html: string;
  plainText: string;
}) {
  const [activeTab, setActiveTab] = useState<InstallPlatform>("gmail");
  // Distinct kinds so we can show different confirmation copy per
  // button and so pressing one button doesn't reset the tick on
  // another button that was clicked seconds earlier.
  const [copiedKind, setCopiedKind] = useState<"html" | "source" | "file" | null>(
    null
  );
  const [copyError, setCopyError] = useState<string | null>(null);
  const installRef = useRef<HTMLDivElement>(null);

  const flashCopied = (kind: "html" | "source" | "file") => {
    setCopiedKind(kind);
    setCopyError(null);
    window.setTimeout(() => {
      // Only clear if we're still showing the same kind — a rapid
      // second click on a different button already replaced it.
      setCopiedKind((current) => (current === kind ? null : current));
    }, 2500);
  };

  const scrollToInstall = () => {
    installRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyRichHtml = useCallback(async () => {
    try {
      // Rich clipboard: recipient sees the RENDERED signature, not the
      // markup. text/plain fallback so plain-text editors get the
      // legible version, not tag soup.
      if (
        typeof ClipboardItem !== "undefined" &&
        navigator.clipboard &&
        "write" in navigator.clipboard
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([plainText], { type: "text/plain" }),
          }),
        ]);
        flashCopied("html");
      } else {
        // Older browsers (some in-app webviews, Safari before 13.4)
        // don't expose ClipboardItem. Fall back to copying the HTML
        // *source* as text — the user then needs to paste it into an
        // HTML-source signature editor, which we tell them explicitly
        // via the copyError banner below.
        await navigator.clipboard.writeText(html);
        setCopyError(
          "Your browser can't copy formatted content. We copied the HTML source instead — use the HTML-source method under the instructions below."
        );
        flashCopied("html");
      }
      scrollToInstall();
    } catch {
      setCopyError(
        "Copy failed. Your browser blocked clipboard access — click the button again, or use 'Copy HTML source' below."
      );
    }
  }, [html, plainText]);

  const copyHtmlSource = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(html);
      flashCopied("source");
    } catch {
      setCopyError("Copy failed. Try again or download the .htm file instead.");
    }
  }, [html]);

  const downloadHtmFile = useCallback(() => {
    // Minimal <html><body> envelope keeps the file valid HTML while
    // still being all-inline-styles internally. Outlook's "New
    // signature → Import" dialog reads .htm reliably.
    const doc = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Email signature</title>
</head>
<body>
${html}
</body>
</html>
`;
    const blob = new Blob([doc], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email-signature.htm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flashCopied("file");
  }, [html]);

  return (
    <section className="mt-8 space-y-6">
      {/* Reassurance box — three green ticks above the CTAs so users
          know they're not about to spend an hour tweaking Outlook. */}
      <ReassuranceBox />

      {/* Copy CTAs */}
      <div className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <button
            type="button"
            onClick={copyRichHtml}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition sm:text-base",
              copiedKind === "html"
                ? "bg-success-600 hover:bg-success-700"
                : "bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600"
            )}
          >
            {copiedKind === "html" ? (
              <Check className="h-5 w-5" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
            {copiedKind === "html" ? "Copied to clipboard" : "Copy signature"}
          </button>

          <button
            type="button"
            onClick={copyHtmlSource}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-surface-200 bg-white px-5 py-3.5 text-sm font-semibold text-surface-800 transition hover:border-surface-300 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100"
          >
            {copiedKind === "source" ? (
              <Check className="h-4 w-4 text-success-600" />
            ) : (
              <FileCode2 className="h-4 w-4" />
            )}
            {copiedKind === "source" ? "Copied source" : "Copy HTML source"}
          </button>

          <button
            type="button"
            onClick={downloadHtmFile}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-surface-200 bg-white px-5 py-3.5 text-sm font-semibold text-surface-800 transition hover:border-surface-300 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100"
          >
            {copiedKind === "file" ? (
              <Check className="h-4 w-4 text-success-600" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {copiedKind === "file" ? "File downloaded" : "Download .htm file"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-surface-500 dark:text-surface-400">
          The <strong>.htm file</strong> is designed for Outlook desktop — import it via the Signature dialog for the most reliable result.
        </p>

        {copiedKind === "html" && !copyError && (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-success-200 bg-success-50 px-3 py-2 text-xs font-medium text-success-800 dark:border-success-500/40 dark:bg-success-500/10 dark:text-success-200">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            Copied! Now paste into your email signature settings ↓
          </p>
        )}
        {copyError && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            {copyError}
          </p>
        )}
      </div>

      {/* Install instructions */}
      <div
        ref={installRef}
        className="rounded-3xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900 sm:p-6"
      >
        <header className="mb-4">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">
            How to install your signature
          </h2>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            Pick your mail client and follow the numbered steps. Same
            signature works in all of them.
          </p>
        </header>

        <PlatformTabs active={activeTab} onChange={setActiveTab} />

        <ActiveInstructions platform={activeTab} />
      </div>
    </section>
  );
}

// ── Reassurance box ──────────────────────────────────────────────────────

function ReassuranceBox() {
  const points = [
    "Works in Gmail, Outlook, Apple Mail, Yahoo and more",
    "One signature — no need for different versions per app",
    "Table-based HTML tested for maximum compatibility",
  ];
  return (
    <ul className="grid gap-2 rounded-3xl border border-success-200 bg-success-50/60 p-4 dark:border-success-500/30 dark:bg-success-500/10 sm:grid-cols-3">
      {points.map((p) => (
        <li
          key={p}
          className="flex items-start gap-2 text-xs font-medium text-success-800 dark:text-success-200"
        >
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-600 dark:text-success-400" />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Platform tabs ────────────────────────────────────────────────────────

function PlatformTabs({
  active,
  onChange,
}: {
  active: InstallPlatform;
  onChange: (p: InstallPlatform) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Choose your email client"
      // Horizontal scroll on mobile — tabs are 6 buttons, no dropdown
      // is needed. -mx-4 lets the scroll edge run to the card padding.
      className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {INSTALL_PLATFORM_ORDER.map((p) => {
        const isActive = p === active;
        return (
          <button
            key={p}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
              isActive
                ? "border-primary-500 bg-primary-500 text-white"
                : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:text-primary-300"
            )}
          >
            {INSTALL_INSTRUCTIONS[p].name}
          </button>
        );
      })}
    </div>
  );
}

// ── Active instructions ──────────────────────────────────────────────────

function ActiveInstructions({ platform }: { platform: InstallPlatform }) {
  const meta = INSTALL_INSTRUCTIONS[platform];
  const isOutlookDesktop = platform === "outlook-desktop";

  return (
    <div className="mt-4">
      <p className="text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {meta.scope}
      </p>

      {/* Highlight the .htm import path for Outlook desktop — it's much
          more reliable than clipboard paste into the Word-engine editor. */}
      {isOutlookDesktop && (
        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-primary-200 bg-primary-50/60 px-3 py-3 text-xs text-primary-800 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-200">
          <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>
            <strong>Recommended: use “Download .htm file” above</strong>, then
            import it via Outlook’s Signature dialog. Word-engine paste
            support is unreliable — the .htm file lands the layout intact.
          </p>
        </div>
      )}

      <ol className="mt-4 space-y-2.5 text-sm text-surface-700 dark:text-surface-200">
        {meta.steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span
              aria-hidden
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary-700 dark:bg-primary-500/15 dark:text-primary-300"
            >
              {i + 1}
            </span>
            <span className="flex-1 pt-0.5 leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>

      <p className="mt-5 rounded-xl bg-surface-50 px-3 py-2 text-xs text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
        <strong>Tip:</strong> send yourself a test email to confirm it looks
        right before using it — mail clients cache signatures aggressively.
      </p>
    </div>
  );
}
