"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Loader2,
  Mail,
  MessageCircle,
  Plus,
  QrCode,
  Send,
  Share2,
  Trash2,
  Type as TypeIcon,
} from "lucide-react";
import QRCode from "qrcode";

import { SITE_CONFIG, cn } from "@/lib/utils";

/**
 * Phase-1 Share tool: text snippets + URL shortener.
 *
 * Tabs share an options panel (expiration / custom slug / password /
 * view limit). The "My shares" list is purely localStorage on the
 * creator's device — there's no server-side concept of a session.
 */

type Tab = "text" | "url";
type ExpiryHours = 1 | 24 | 168 | 720;

const EXPIRY_OPTIONS: { value: ExpiryHours; label: string }[] = [
  { value: 1, label: "1 hour" },
  { value: 24, label: "24 hours" },
  { value: 168, label: "7 days" },
  { value: 720, label: "30 days" },
];

interface SharedOptions {
  expiresIn: ExpiryHours;
  customSlug: string;
  password: string;
  viewLimit: string;
}

const INITIAL_OPTIONS: SharedOptions = {
  expiresIn: 168,
  customSlug: "",
  password: "",
  viewLimit: "",
};

interface CreatedShare {
  slug: string;
  type: "text" | "url";
  expiresAt: string;
  hasPassword: boolean;
  createdAt: string;
}

const LS_KEY = "utilityapps:my-shares:v1";
const MAX_LOCAL_SHARES = 20;

function readMyShares(): CreatedShare[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s): s is CreatedShare =>
        !!s && typeof s === "object" &&
        typeof (s as CreatedShare).slug === "string" &&
        ((s as CreatedShare).type === "text" || (s as CreatedShare).type === "url")
      )
      .slice(0, MAX_LOCAL_SHARES);
  } catch {
    return [];
  }
}

function writeMyShares(shares: CreatedShare[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(shares.slice(0, MAX_LOCAL_SHARES)));
  } catch {
    /* quota or private mode — ignore */
  }
}

export function ShareTool() {
  const [tab, setTab] = useState<Tab>("text");
  const [options, setOptions] = useState<SharedOptions>(INITIAL_OPTIONS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Tab-specific state
  const [textContent, setTextContent] = useState("");
  const [textLanguage, setTextLanguage] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreatedShare | null>(null);

  // localStorage "My shares" list
  const [myShares, setMyShares] = useState<CreatedShare[]>([]);
  useEffect(() => {
    setMyShares(readMyShares());
  }, []);

  const reset = () => {
    setResult(null);
    setError(null);
    setTextContent("");
    setUrlInput("");
    setOptions(INITIAL_OPTIONS);
    setShowAdvanced(false);
  };

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const endpoint = tab === "text" ? "/api/share/text" : "/api/share/url";
      const body =
        tab === "text"
          ? {
              content: textContent,
              language: textLanguage || undefined,
              expiresIn: options.expiresIn,
              password: options.password || undefined,
              customSlug: options.customSlug || undefined,
              viewLimit: options.viewLimit ? Number(options.viewLimit) : undefined,
            }
          : {
              url: urlInput,
              expiresIn: options.expiresIn,
              password: options.password || undefined,
              customSlug: options.customSlug || undefined,
              viewLimit: options.viewLimit ? Number(options.viewLimit) : undefined,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { slug?: string; expiresAt?: string; error?: string };
      if (!res.ok || !data.slug) {
        setError(data.error ?? "Couldn't create the share.");
        return;
      }
      const created: CreatedShare = {
        slug: data.slug,
        type: tab,
        expiresAt: data.expiresAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        hasPassword: Boolean(options.password),
        createdAt: new Date().toISOString(),
      };
      setResult(created);
      const next = [created, ...myShares.filter((s) => s.slug !== created.slug)];
      setMyShares(next);
      writeMyShares(next);
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMyShare = async (slug: string) => {
    try {
      const res = await fetch(`/api/share/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Couldn't delete that share.");
        return;
      }
    } catch {
      // Even if the server fails, remove from local list — the creator
      // doesn't want to see it anymore.
    }
    const next = myShares.filter((s) => s.slug !== slug);
    setMyShares(next);
    writeMyShares(next);
  };

  const canSubmit =
    !submitting &&
    (tab === "text"
      ? textContent.trim().length > 0 && textContent.length <= 100_000
      : urlInput.trim().length > 0);

  return (
    <div className="space-y-6">
      {result ? (
        <ResultView created={result} onReset={reset} />
      ) : (
        <>
          <TabBar tab={tab} onChange={setTab} />

          {tab === "text" ? (
            <TextInput
              value={textContent}
              onChange={setTextContent}
              language={textLanguage}
              onLanguageChange={setTextLanguage}
            />
          ) : (
            <UrlInput value={urlInput} onChange={setUrlInput} />
          )}

          <AdvancedPanel
            open={showAdvanced}
            onOpenChange={setShowAdvanced}
            options={options}
            onChange={setOptions}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((p) => !p)}
          />

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition",
              canSubmit
                ? "hover:from-blue-700 hover:to-indigo-700"
                : "cursor-not-allowed opacity-60"
            )}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Create Share Link
              </>
            )}
          </button>
        </>
      )}

      {myShares.length > 0 && (
        <MyShares shares={myShares} onDelete={deleteMyShare} />
      )}
    </div>
  );
}

// =================================================================== Tab bar

function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const tabs: { value: Tab; label: string; icon: typeof TypeIcon }[] = [
    { value: "text", label: "Share Text", icon: TypeIcon },
    { value: "url", label: "Shorten Link", icon: LinkIcon },
  ];
  return (
    <div role="tablist" className="grid grid-cols-2 gap-1.5 rounded-xl bg-surface-100 p-1.5 dark:bg-surface-800">
      {tabs.map(({ value, label, icon: Icon }) => {
        const active = tab === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(value)}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
              active
                ? "bg-white text-blue-700 shadow-sm dark:bg-surface-950 dark:text-blue-300"
                : "text-surface-600 dark:text-surface-300"
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================ Text input pane

const PRISM_LANGUAGES = [
  { value: "", label: "Plain text" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "json", label: "JSON" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "bash", label: "Shell / Bash" },
  { value: "sql", label: "SQL" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
];

function TextInput({
  value,
  onChange,
  language,
  onLanguageChange,
}: {
  value: string;
  onChange: (v: string) => void;
  language: string;
  onLanguageChange: (v: string) => void;
}) {
  const used = value.length;
  const max = 100_000;
  const tooLong = used > max;
  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        placeholder="Paste anything: notes, code, a quick message…"
        className={cn(
          "block w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-mono text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 dark:bg-surface-950 dark:text-surface-100",
          tooLong
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
            : "border-surface-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-surface-700"
        )}
      />
      <div className="flex items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-xs text-surface-600 dark:text-surface-300">
          <span>Highlight as</span>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="rounded-md border border-surface-200 bg-white px-2 py-1 text-xs dark:border-surface-700 dark:bg-surface-900"
          >
            {PRISM_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <span
          className={cn(
            "text-xs",
            tooLong ? "text-red-600 dark:text-red-400" : "text-surface-500 dark:text-surface-400"
          )}
        >
          {used.toLocaleString()} / {max.toLocaleString()} characters
        </span>
      </div>
    </div>
  );
}

// ============================================================ URL input pane

function UrlInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // Show the destination domain once it parses.
  let host = "";
  try {
    if (value.trim()) host = new URL(value.trim()).hostname;
  } catch {
    host = "";
  }
  return (
    <div className="space-y-2">
      <label className="block">
        <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
          Long URL
        </span>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/some/long/path?with=query"
          className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-950"
        />
      </label>
      {host && (
        <p className="text-xs text-surface-500 dark:text-surface-400">
          → points to <span className="font-mono">{host}</span>
        </p>
      )}
    </div>
  );
}

// ========================================================= Options panel

function AdvancedPanel({
  open,
  onOpenChange,
  options,
  onChange,
  showPassword,
  onTogglePassword,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  options: SharedOptions;
  onChange: (o: SharedOptions) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
}) {
  return (
    <div className="rounded-xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-surface-700 dark:text-surface-200"
        aria-expanded={open}
      >
        <span>Advanced settings</span>
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="space-y-5 border-t border-surface-200 px-4 py-4 dark:border-surface-800">
          {/* Expiration */}
          <div>
            <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">
              Expires after
            </p>
            <div className="mt-2 grid grid-cols-4 gap-1.5 rounded-lg bg-surface-100 p-1.5 dark:bg-surface-800">
              {EXPIRY_OPTIONS.map((opt) => {
                const active = options.expiresIn === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ ...options, expiresIn: opt.value })}
                    className={cn(
                      "rounded-md px-2 py-1.5 text-xs font-semibold transition",
                      active
                        ? "bg-white text-blue-700 shadow-sm dark:bg-surface-950 dark:text-blue-300"
                        : "text-surface-600 dark:text-surface-300"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">
              Auto-deleted after this time.
            </p>
          </div>

          {/* Custom slug */}
          <label className="block">
            <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
              Custom link <span className="font-normal text-surface-500">(optional)</span>
            </span>
            <div className="mt-1.5 flex items-stretch overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700">
              <span className="bg-surface-100 px-3 py-2 text-xs text-surface-600 dark:bg-surface-800 dark:text-surface-300">
                {SITE_CONFIG.url.replace(/^https?:\/\//, "")}/s/
              </span>
              <input
                type="text"
                value={options.customSlug}
                onChange={(e) => onChange({ ...options, customSlug: e.target.value })}
                placeholder="my-link"
                className="flex-1 bg-white px-3 py-2 text-sm dark:bg-surface-950"
              />
            </div>
            <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">
              3–30 chars, lowercase letters, numbers, hyphens.
            </p>
          </label>

          {/* Password */}
          <label className="block">
            <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
              Password <span className="font-normal text-surface-500">(optional)</span>
            </span>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                value={options.password}
                onChange={(e) => onChange({ ...options, password: e.target.value })}
                placeholder="Recipients will need this"
                className="block w-full rounded-lg border border-surface-200 bg-white px-3 py-2 pr-10 text-sm dark:border-surface-700 dark:bg-surface-950"
              />
              <button
                type="button"
                onClick={onTogglePassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {/* View limit */}
          <label className="block">
            <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
              View limit <span className="font-normal text-surface-500">(optional)</span>
            </span>
            <input
              type="number"
              min={1}
              max={1000}
              value={options.viewLimit}
              onChange={(e) => onChange({ ...options, viewLimit: e.target.value })}
              placeholder="Unlimited"
              className="mt-1.5 block w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-950"
            />
            <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">
              Auto-deleted after this many views.
            </p>
          </label>
        </div>
      )}
    </div>
  );
}

// ============================================================ Result view

function ResultView({ created, onReset }: { created: CreatedShare; onReset: () => void }) {
  const shareUrl = `${SITE_CONFIG.url}/s/${created.slug}`;
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    QRCode.toDataURL(shareUrl, {
      width: 240,
      margin: 1,
      color: { dark: "#1E40AF", light: "#FFFFFF" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [shareUrl]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  const message = `${
    created.type === "url" ? "I shortened a link for you" : "I shared a snippet with you"
  }: ${shareUrl}`;

  return (
    <div className="space-y-5 rounded-2xl border border-success-200 bg-success-50 p-5 dark:border-success-500/30 dark:bg-success-500/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-success-700 dark:text-success-300">
            Share link ready
          </p>
          <h3 className="mt-1 text-lg font-bold text-surface-900 dark:text-white">
            Your link is live
          </h3>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-success-700 shadow-sm dark:bg-surface-950 dark:text-success-300">
          Expires {formatExpiresShort(created.expiresAt)}
        </span>
      </div>

      <div className="flex items-stretch gap-2 rounded-lg border border-success-200 bg-white p-1.5 dark:border-success-500/30 dark:bg-surface-950">
        <code className="flex-1 truncate px-2.5 py-2 text-sm text-surface-800 dark:text-surface-100">
          {shareUrl}
        </code>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Share it via
          </p>
          <div className="flex flex-wrap gap-2">
            <ShareButton
              href={`https://wa.me/?text=${encodeURIComponent(message)}`}
              icon={MessageCircle}
              label="WhatsApp"
            />
            <ShareButton
              href={`mailto:?subject=${encodeURIComponent("A quick share for you")}&body=${encodeURIComponent(message)}`}
              icon={Mail}
              label="Email"
            />
            <ShareButton
              href={`https://x.com/intent/post?text=${encodeURIComponent(message)}`}
              icon={Share2}
              label="X / Twitter"
            />
          </div>
          {created.hasPassword && (
            <p className="text-xs text-surface-600 dark:text-surface-300">
              🔒 Password-protected — send the password separately.
            </p>
          )}
        </div>
        {qrDataUrl && (
          <div className="flex flex-col items-center gap-1.5 rounded-lg bg-white p-2 dark:bg-surface-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR code for the share link" className="h-32 w-32" />
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-surface-500">
              <QrCode className="h-3 w-3" /> Scan to open
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline dark:text-blue-300"
      >
        <Plus className="h-3.5 w-3.5" /> Create another share
      </button>
    </div>
  );
}

function ShareButton({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Mail;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-xs font-semibold text-surface-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-blue-600 dark:hover:text-blue-300"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}

// =========================================================== "My shares"

function MyShares({
  shares,
  onDelete,
}: {
  shares: CreatedShare[];
  onDelete: (slug: string) => void;
}) {
  return (
    <div className="rounded-xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        My recent shares · this device
      </p>
      <ul className="divide-y divide-surface-200 dark:divide-surface-800">
        {shares.map((s) => {
          const shareUrl = `${SITE_CONFIG.url}/s/${s.slug}`;
          return (
            <li key={s.slug} className="flex items-center justify-between gap-2 py-2">
              <div className="min-w-0">
                <a
                  href={`/s/${s.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-sm font-medium text-blue-700 hover:underline dark:text-blue-300"
                >
                  {shareUrl}
                </a>
                <p className="text-[11px] text-surface-500 dark:text-surface-400">
                  {s.type} · expires {formatExpiresShort(s.expiresAt)}
                  {s.hasPassword && " · 🔒"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(s.slug)}
                aria-label={`Delete share ${s.slug}`}
                className="rounded-md p-1.5 text-surface-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/15"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[10px] text-surface-400">
        We can&rsquo;t list shares created on another device. This list is stored only in your browser.
      </p>
    </div>
  );
}

// ============================================================== helpers

function formatExpiresShort(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "soon";
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `in ${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `in ${hours}h`;
  const days = Math.round(hours / 24);
  return `in ${days}d`;
}

// Suppress unused-import warnings for icons used only conditionally above.
void useMemo;
