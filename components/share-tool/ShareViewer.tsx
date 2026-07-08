"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Flag,
  Image as ImageIcon,
  Loader2,
  Lock,
} from "lucide-react";

import { formatBytes, getExtension } from "@/lib/file-validation";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  type: "text" | "url" | "file";
  hasPassword: boolean;
  viewCount: number;
  viewLimit: number | null;
  textLanguage: string | null;
}

interface FileViewData {
  filename: string;
  size: number | null;
  mimetype: string | null;
  downloadUrl: string;
  inlineUrl: string;
  viewCount: number;
  viewLimit: number | null;
}

type State =
  | { kind: "loading" }
  | { kind: "password-required"; error?: string }
  | { kind: "text"; content: string; language: string | null; viewCount: number; viewLimit: number | null }
  | { kind: "url"; url: string; viewCount: number; viewLimit: number | null }
  | { kind: "file"; data: FileViewData }
  | { kind: "unsupported"; message: string }
  | { kind: "error"; message: string };

const REDIRECT_SECONDS = 5;

export function ShareViewer({ slug, type, hasPassword }: Props) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [reported, setReported] = useState(false);
  const [reporting, setReporting] = useState(false);

  // First fetch: if no password, hit /access straight away. Otherwise show
  // the password prompt and wait for the user to submit it.
  useEffect(() => {
    if (hasPassword) {
      setState({ kind: "password-required" });
      return;
    }
    void fetchContent("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPassword]);

  const fetchContent = async (password: string) => {
    setState({ kind: "loading" });
    try {
      const res = await fetch(`/api/share/${encodeURIComponent(slug)}/access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(password ? { password } : {}),
      });
      const data = (await res.json()) as
        | {
            type: "text";
            content: string;
            language: string | null;
            viewCount: number;
            viewLimit: number | null;
          }
        | {
            type: "url";
            url: string;
            viewCount: number;
            viewLimit: number | null;
          }
        | {
            type: "file";
            filename: string;
            size: number | null;
            mimetype: string | null;
            downloadUrl: string;
            inlineUrl: string;
            viewCount: number;
            viewLimit: number | null;
          }
        | { error: string; passwordRequired?: boolean };

      if (!res.ok) {
        if ("passwordRequired" in data && data.passwordRequired) {
          setState({
            kind: "password-required",
            error: "error" in data ? data.error : undefined,
          });
          return;
        }
        setState({
          kind: "error",
          message: "error" in data ? data.error : "Couldn't load this share.",
        });
        return;
      }

      if ("type" in data && data.type === "text") {
        setState({
          kind: "text",
          content: data.content,
          language: data.language,
          viewCount: data.viewCount,
          viewLimit: data.viewLimit,
        });
        return;
      }
      if ("type" in data && data.type === "url") {
        setState({
          kind: "url",
          url: data.url,
          viewCount: data.viewCount,
          viewLimit: data.viewLimit,
        });
        return;
      }
      if ("type" in data && data.type === "file") {
        setState({
          kind: "file",
          data: {
            filename: data.filename,
            size: data.size,
            mimetype: data.mimetype,
            downloadUrl: data.downloadUrl,
            inlineUrl: data.inlineUrl,
            viewCount: data.viewCount,
            viewLimit: data.viewLimit,
          },
        });
        return;
      }
      setState({ kind: "unsupported", message: "Unknown share type." });
    } catch {
      setState({ kind: "error", message: "Couldn't reach the server." });
    }
  };

  const report = async () => {
    if (reported || reporting) return;
    setReporting(true);
    try {
      await fetch(`/api/share/${encodeURIComponent(slug)}/report`, {
        method: "POST",
      });
      setReported(true);
    } catch {
      // Even if the network fails, mark as reported on the client so the
      // button doesn't keep tempting the user.
      setReported(true);
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {state.kind === "loading" && <LoadingBlock />}
      {state.kind === "password-required" && (
        <PasswordPrompt onSubmit={fetchContent} error={state.error} />
      )}
      {state.kind === "text" && (
        <TextView content={state.content} language={state.language} viewCount={state.viewCount} viewLimit={state.viewLimit} />
      )}
      {state.kind === "url" && (
        <UrlView url={state.url} viewCount={state.viewCount} viewLimit={state.viewLimit} />
      )}
      {state.kind === "file" && <FileView data={state.data} />}
      {state.kind === "unsupported" && (
        <ErrorBlock message={state.message} />
      )}
      {state.kind === "error" && <ErrorBlock message={state.message} />}

      <ReportRow type={type} reported={reported} reporting={reporting} onReport={report} />
    </div>
  );
}

// ---------------------------------------------------------- subcomponents

function LoadingBlock() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-surface-200 bg-surface-50 px-4 py-10 text-sm text-surface-500 dark:border-surface-800 dark:bg-surface-900">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading…
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

function PasswordPrompt({
  onSubmit,
  error,
}: {
  onSubmit: (password: string) => void | Promise<void>;
  error?: string;
}) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!pw) return;
        setBusy(true);
        try {
          await onSubmit(pw);
        } finally {
          setBusy(false);
        }
      }}
      className="space-y-3 rounded-xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-surface-700 dark:text-surface-200">
        <Lock className="h-4 w-4" /> Password protected
      </div>
      <p className="text-sm text-surface-600 dark:text-surface-300">
        Enter the password the sender shared with you.
      </p>
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        autoFocus
        className="block w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-950"
        placeholder="Password"
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={!pw || busy}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition",
          !pw || busy ? "cursor-not-allowed opacity-60" : "hover:bg-blue-800"
        )}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        Unlock
      </button>
    </form>
  );
}

function TextView({
  content,
  language,
  viewCount,
  viewLimit,
}: {
  content: string;
  language: string | null;
  viewCount: number;
  viewLimit: number | null;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <div className="rounded-xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
      <div className="flex items-center justify-between gap-3 border-b border-surface-200 px-4 py-2 text-xs text-surface-500 dark:border-surface-800 dark:text-surface-400">
        <span>
          {language ? `Code · ${language}` : "Text snippet"} ·{" "}
          {viewCount} view{viewCount === 1 ? "" : "s"}
          {viewLimit ? ` of ${viewLimit}` : ""}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-500/15"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words p-4 text-sm font-mono text-surface-800 dark:text-surface-100">
        {content}
      </pre>
    </div>
  );
}

function UrlView({
  url,
  viewCount,
  viewLimit,
}: {
  url: string;
  viewCount: number;
  viewLimit: number | null;
}) {
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);
  const [paused, setPaused] = useState(false);
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    host = url;
  }

  useEffect(() => {
    if (paused) return;
    if (seconds <= 0) {
      window.location.href = url;
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, paused, url]);

  return (
    <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50 p-5 text-surface-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-surface-100">
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
        Redirecting to
      </p>
      <p className="break-all font-mono text-sm">{url}</p>
      <p className="text-xs text-surface-600 dark:text-surface-300">
        Domain: <span className="font-semibold">{host}</span> · {viewCount} view
        {viewCount === 1 ? "" : "s"}
        {viewLimit ? ` of ${viewLimit}` : ""}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={url}
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          <ExternalLink className="h-4 w-4" /> Continue now
        </a>
        {!paused ? (
          <button
            type="button"
            onClick={() => setPaused(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-xs font-semibold text-surface-700 transition hover:border-red-300 hover:text-red-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-200"
          >
            Cancel (continuing in {seconds}s)
          </button>
        ) : (
          <span className="text-xs text-surface-600 dark:text-surface-300">
            Auto-redirect cancelled — click Continue when ready.
          </span>
        )}
      </div>
    </div>
  );
}

function ReportRow({
  type,
  reported,
  reporting,
  onReport,
}: {
  type: "text" | "url" | "file";
  reported: boolean;
  reporting: boolean;
  onReport: () => void;
}) {
  if (reported) {
    return (
      <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
        Thanks for reporting. The share has been removed.
      </p>
    );
  }
  return (
    <button
      type="button"
      onClick={onReport}
      disabled={reporting}
      id="report"
      className="inline-flex items-center gap-1 text-xs text-surface-500 hover:text-red-600 dark:text-surface-400 dark:hover:text-red-400"
    >
      <Flag className="h-3 w-3" />{" "}
      Report this {type === "url" ? "link" : type === "file" ? "file" : "snippet"}
    </button>
  );
}

// =============================================================== FileView

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif", "heic"]);

function isImage(mimetype: string | null, filename: string): boolean {
  if (mimetype && mimetype.startsWith("image/")) return true;
  return IMAGE_EXTS.has(getExtension(filename));
}

function isPdf(mimetype: string | null, filename: string): boolean {
  if (mimetype === "application/pdf") return true;
  return getExtension(filename) === "pdf";
}

function FileView({ data }: { data: FileViewData }) {
  const { filename, size, mimetype, downloadUrl, inlineUrl, viewCount, viewLimit } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-3 py-2.5 dark:border-surface-800 dark:bg-surface-900">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
          {isImage(mimetype, filename) ? (
            <ImageIcon className="h-5 w-5" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-surface-900 dark:text-white">
            {filename}
          </p>
          <p className="text-[11px] text-surface-500 dark:text-surface-400">
            {size != null ? formatBytes(size) : "size unknown"}
            {mimetype ? ` · ${mimetype}` : ""} · {viewCount} view
            {viewCount === 1 ? "" : "s"}
            {viewLimit ? ` of ${viewLimit}` : ""}
          </p>
        </div>
        <a
          href={downloadUrl}
          rel="noopener noreferrer"
          download={filename}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
        >
          <Download className="h-3.5 w-3.5" /> Download
        </a>
      </div>

      {isImage(mimetype, filename) && (
        <div className="rounded-xl border border-surface-200 bg-surface-50 p-3 text-center dark:border-surface-800 dark:bg-surface-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={inlineUrl}
            alt={filename}
            className="mx-auto max-h-[520px] max-w-full rounded-md shadow-sm"
          />
        </div>
      )}

      {isPdf(mimetype, filename) && (
        <div className="overflow-hidden rounded-xl border border-surface-200 dark:border-surface-800">
          <iframe
            src={inlineUrl}
            title={`Preview: ${filename}`}
            className="h-[640px] w-full"
          />
        </div>
      )}

      {!isImage(mimetype, filename) && !isPdf(mimetype, filename) && (
        <p className="rounded-xl bg-surface-50 px-3 py-2.5 text-sm text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
          Inline preview isn&rsquo;t available for this file type. Click <strong>Download</strong>
          to save it.
        </p>
      )}
    </div>
  );
}
