"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  Loader2,
  MessageCircle,
  Plus,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";

import { TwitterIcon } from "@/components/icons/SocialIcons";
import { POLL_LIMITS, validatePollInput } from "@/lib/pollUtils";
import { cn } from "@/lib/utils";

/**
 * PollCreator — the entire /tools/instant-poll experience.
 *
 * One page, two states:
 *   1. Form (default) — question, options, quick settings, big submit.
 *   2. Success — share URL, WhatsApp / Twitter / Copy buttons, QR code
 *      with download, and a link into the live poll page.
 *
 * The whole point is speed. Autofocus lands the caret in the question
 * on mount so first paint is "just type." Enter in the last option
 * adds a new option (or submits if the row is full at 10 options).
 * Submit is one round-trip; success view renders synchronously the
 * moment /api/poll/create returns. QR is generated lazily so its
 * ~50ms overhead doesn't gate the "your poll is live" moment.
 *
 * The creator token that the API returns lives in localStorage keyed
 * by publicId — the only reason we keep it is so the creator can
 * close / reopen / delete their own poll later without an account.
 * We never surface it in the UI.
 */

// ── Types + init ───────────────────────────────────────────────────────

interface OptionEntry {
  /** Random client-side id purely for React key stability across
   *  add/remove. Has no relation to the opaque option ids the server
   *  generates on submit. */
  id: string;
  text: string;
}

interface SuccessData {
  publicId: string;
  shareUrl: string;
  question: string;
  qrDataUrl: string;
}

function makeLocalId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function makeInitialOptions(): OptionEntry[] {
  return [
    { id: makeLocalId(), text: "" },
    { id: makeLocalId(), text: "" },
  ];
}

// ── Main component ─────────────────────────────────────────────────────

export function PollCreator() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<OptionEntry[]>(makeInitialOptions);
  const [pollType, setPollType] = useState<"single" | "multiple">("single");
  const [showResultsBeforeVote, setShowResultsBeforeVote] = useState(false);
  const [allowMultiplePerDevice, setAllowMultiplePerDevice] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<"question" | "options" | "content" | "form", string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const [focusOptionIndex, setFocusOptionIndex] = useState<number | null>(null);

  const questionRef = useRef<HTMLTextAreaElement>(null);
  const optionRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Autofocus the question on first paint so users start typing immediately.
  useEffect(() => {
    if (!success) questionRef.current?.focus();
  }, [success]);

  // Focus a newly-added option after render.
  useEffect(() => {
    if (focusOptionIndex === null) return;
    const target = options[focusOptionIndex];
    if (target) optionRefs.current[target.id]?.focus();
    setFocusOptionIndex(null);
  }, [focusOptionIndex, options]);

  const canAddOption = options.length < POLL_LIMITS.MAX_OPTIONS;
  const canRemoveOption = options.length > POLL_LIMITS.MIN_OPTIONS;
  const questionCharsRemaining = POLL_LIMITS.QUESTION_MAX_LEN - question.length;

  const updateOption = useCallback((id: string, text: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  }, []);

  const addOption = useCallback(() => {
    setOptions((prev) => {
      if (prev.length >= POLL_LIMITS.MAX_OPTIONS) return prev;
      const next = [...prev, { id: makeLocalId(), text: "" }];
      // Defer focus request until after the state commit.
      setFocusOptionIndex(next.length - 1);
      return next;
    });
  }, []);

  const removeOption = useCallback((id: string) => {
    setOptions((prev) => {
      if (prev.length <= POLL_LIMITS.MIN_OPTIONS) return prev;
      return prev.filter((o) => o.id !== id);
    });
  }, []);

  const submit = useCallback(async () => {
    const optionTexts = options.map((o) => o.text.trim()).filter(Boolean);
    const validation = validatePollInput(question, optionTexts);
    if (!validation.valid) {
      const errMap: typeof errors = {};
      for (const e of validation.errors) errMap[e.field] = e.message;
      setErrors(errMap);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/poll/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          options: optionTexts,
          pollType,
          settings: {
            showResultsBeforeVote,
            allowMultiplePerDevice,
          },
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        publicId?: string;
        creatorToken?: string;
        shareUrl?: string;
        error?: string;
      };
      if (!res.ok || !json.ok || !json.publicId || !json.shareUrl) {
        setErrors({ form: json.error ?? "Couldn't create the poll. Please try again." });
        setSubmitting(false);
        return;
      }
      // Persist the creator token so THIS browser can close/reopen/delete
      // the poll later without an account. Silent-fail if localStorage is
      // blocked (private mode, disabled) — the poll still works, just no
      // creator management.
      if (json.creatorToken) {
        try {
          window.localStorage.setItem(
            `poll:${json.publicId}`,
            json.creatorToken
          );
        } catch {
          /* localStorage blocked; ignore */
        }
      }
      // QR generation is lazy — small overhead but nice to not block the
      // "your poll is live" moment on it. Guard against import failures
      // so the success screen still renders without a QR if something
      // goes wrong.
      let qrDataUrl = "";
      try {
        const QRCode = (await import("qrcode")).default;
        qrDataUrl = await QRCode.toDataURL(json.shareUrl, {
          width: 360,
          margin: 1,
          color: { dark: "#0F172A", light: "#FFFFFF" },
        });
      } catch {
        /* QR failed; success screen falls back without it */
      }
      setSuccess({
        publicId: json.publicId,
        shareUrl: json.shareUrl,
        question: question.trim(),
        qrDataUrl,
      });
    } catch {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }, [
    question,
    options,
    pollType,
    showResultsBeforeVote,
    allowMultiplePerDevice,
  ]);

  const reset = useCallback(() => {
    setSuccess(null);
    setQuestion("");
    setOptions(makeInitialOptions());
    setPollType("single");
    setShowResultsBeforeVote(false);
    setAllowMultiplePerDevice(false);
    setErrors({});
    setSubmitting(false);
  }, []);

  // Enter key handling for options: on the last non-empty row, add a
  // fresh option; if the row is full at 10, submit instead.
  const handleOptionKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const isLast = index === options.length - 1;
      const hasText = options[index].text.trim().length > 0;
      if (!isLast || !hasText) return;
      if (canAddOption) {
        addOption();
      } else {
        void submit();
      }
    },
    [options, canAddOption, addOption, submit]
  );

  if (success) {
    return <SuccessView data={success} onCreateAnother={reset} />;
  }

  return (
    <FormView
      question={question}
      onQuestionChange={setQuestion}
      questionRef={questionRef}
      questionCharsRemaining={questionCharsRemaining}
      options={options}
      onOptionChange={updateOption}
      onOptionKeyDown={handleOptionKeyDown}
      optionRefs={optionRefs}
      canAddOption={canAddOption}
      canRemoveOption={canRemoveOption}
      addOption={addOption}
      removeOption={removeOption}
      pollType={pollType}
      onPollTypeChange={setPollType}
      showResultsBeforeVote={showResultsBeforeVote}
      onShowResultsBeforeVoteChange={setShowResultsBeforeVote}
      allowMultiplePerDevice={allowMultiplePerDevice}
      onAllowMultiplePerDeviceChange={setAllowMultiplePerDevice}
      errors={errors}
      submitting={submitting}
      onSubmit={submit}
    />
  );
}

// ── Form view ──────────────────────────────────────────────────────────

interface FormViewProps {
  question: string;
  onQuestionChange: (v: string) => void;
  questionRef: React.RefObject<HTMLTextAreaElement | null>;
  questionCharsRemaining: number;
  options: OptionEntry[];
  onOptionChange: (id: string, text: string) => void;
  onOptionKeyDown: (e: KeyboardEvent<HTMLInputElement>, index: number) => void;
  optionRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  canAddOption: boolean;
  canRemoveOption: boolean;
  addOption: () => void;
  removeOption: (id: string) => void;
  pollType: "single" | "multiple";
  onPollTypeChange: (v: "single" | "multiple") => void;
  showResultsBeforeVote: boolean;
  onShowResultsBeforeVoteChange: (v: boolean) => void;
  allowMultiplePerDevice: boolean;
  onAllowMultiplePerDeviceChange: (v: boolean) => void;
  errors: Partial<Record<"question" | "options" | "content" | "form", string>>;
  submitting: boolean;
  onSubmit: () => void;
}

function FormView({
  question,
  onQuestionChange,
  questionRef,
  questionCharsRemaining,
  options,
  onOptionChange,
  onOptionKeyDown,
  optionRefs,
  canAddOption,
  canRemoveOption,
  addOption,
  removeOption,
  pollType,
  onPollTypeChange,
  showResultsBeforeVote,
  onShowResultsBeforeVoteChange,
  allowMultiplePerDevice,
  onAllowMultiplePerDeviceChange,
  errors,
  submitting,
  onSubmit,
}: FormViewProps) {
  const overLimit = questionCharsRemaining < 0;
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8 text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-300">
          <Sparkles className="h-3 w-3" />
          Instant Poll
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
          Ask anything. Share in seconds.
        </h1>
        <p className="mt-3 text-sm text-surface-600 sm:text-base dark:text-surface-300">
          No account, no signup. Perfect for WhatsApp groups, quick team calls, and classroom votes.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-6 rounded-3xl border border-surface-200 bg-white p-5 shadow-sm sm:p-7 dark:border-surface-800 dark:bg-surface-900"
      >
        {/* Question */}
        <div>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
              Your question
            </span>
            <textarea
              ref={questionRef}
              value={question}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="What's your question?"
              maxLength={POLL_LIMITS.QUESTION_MAX_LEN + 50}
              rows={2}
              aria-invalid={Boolean(errors.question)}
              className={cn(
                "mt-1.5 block w-full resize-y rounded-2xl border bg-white px-4 py-3 text-lg font-medium text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25 dark:bg-surface-950 dark:text-white sm:text-xl",
                errors.question
                  ? "border-red-400 focus:border-red-500"
                  : "border-surface-200 focus:border-primary-500 dark:border-surface-800"
              )}
            />
          </label>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className={cn(errors.question ? "text-red-600 dark:text-red-400" : "text-transparent")}>
              {errors.question || "—"}
            </span>
            <span
              className={cn(
                "tabular-nums",
                overLimit
                  ? "text-red-600 dark:text-red-400"
                  : "text-surface-500 dark:text-surface-400"
              )}
            >
              {question.length} / {POLL_LIMITS.QUESTION_MAX_LEN}
            </span>
          </div>
        </div>

        {/* Options */}
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Options
          </span>
          <ul className="mt-1.5 space-y-2">
            {options.map((opt, i) => (
              <li key={opt.id}>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-primary-500/25 dark:bg-surface-950",
                    errors.options
                      ? "border-red-400"
                      : "border-surface-200 focus-within:border-primary-500 dark:border-surface-800"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-100 text-[11px] font-bold text-surface-500 dark:bg-surface-800 dark:text-surface-400"
                  >
                    {i + 1}
                  </span>
                  <input
                    ref={(el) => {
                      optionRefs.current[opt.id] = el;
                    }}
                    value={opt.text}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      onOptionChange(opt.id, e.target.value)
                    }
                    onKeyDown={(e) => onOptionKeyDown(e, i)}
                    placeholder={`Option ${i + 1}`}
                    maxLength={POLL_LIMITS.OPTION_MAX_LEN + 10}
                    aria-invalid={Boolean(errors.options)}
                    className="min-w-0 flex-1 bg-transparent text-base text-surface-900 placeholder:text-surface-400 focus:outline-none dark:text-white"
                  />
                  {canRemoveOption && (
                    <button
                      type="button"
                      onClick={() => removeOption(opt.id)}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-surface-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                      aria-label={`Remove option ${i + 1}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {canAddOption && (
            <button
              type="button"
              onClick={addOption}
              className="mt-2 inline-flex items-center gap-1.5 rounded-2xl border border-dashed border-surface-300 px-3 py-2 text-sm font-semibold text-surface-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-surface-700 dark:text-surface-300 dark:hover:border-primary-500 dark:hover:text-primary-300"
            >
              <Plus className="h-3.5 w-3.5" /> Add option
            </button>
          )}
          {errors.options && (
            <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">
              {errors.options}
            </p>
          )}
        </div>

        {/* Quick settings */}
        <details className="group rounded-2xl border border-surface-200 bg-surface-50/50 px-4 py-3 dark:border-surface-800 dark:bg-surface-900/40">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-semibold text-surface-600 dark:text-surface-300">
            <span>Poll settings</span>
            <span className="text-[10px] text-surface-500 group-open:hidden">
              Single choice · Results hidden until vote
            </span>
            <span className="text-[10px] text-primary-600 dark:text-primary-400">
              <span className="group-open:hidden">Show</span>
              <span className="hidden group-open:inline">Hide</span>
            </span>
          </summary>
          <div className="mt-3 space-y-3">
            <div>
              <span className="mb-1 block text-[11px] font-medium text-surface-500 dark:text-surface-400">
                Poll type
              </span>
              <div
                role="tablist"
                aria-label="Poll type"
                className="inline-flex rounded-xl border border-surface-200 bg-white p-0.5 dark:border-surface-800 dark:bg-surface-900"
              >
                <TypeButton
                  active={pollType === "single"}
                  onClick={() => onPollTypeChange("single")}
                >
                  Single choice
                </TypeButton>
                <TypeButton
                  active={pollType === "multiple"}
                  onClick={() => onPollTypeChange("multiple")}
                >
                  Multiple choice
                </TypeButton>
              </div>
            </div>
            <SettingRow
              label="Show results before voting"
              value={showResultsBeforeVote}
              onChange={onShowResultsBeforeVoteChange}
            />
            <SettingRow
              label="Allow multiple votes per device"
              value={allowMultiplePerDevice}
              onChange={onAllowMultiplePerDeviceChange}
              hint="Off = one vote per browser. On = anyone can vote as often as they want."
            />
          </div>
        </details>

        {(errors.content || errors.form) && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
            {errors.form ?? errors.content}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || overLimit}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-semibold text-white shadow-glow transition disabled:opacity-60 sm:text-lg",
            "bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600"
          )}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating…
            </>
          ) : (
            <>
              Create poll <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-surface-500 dark:text-surface-400">
          Polls live for 30 days. No signup, no ads, no tracking of who voted.
        </p>
      </form>
    </div>
  );
}

function TypeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "bg-primary-500 text-white shadow-sm"
          : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function SettingRow({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-center gap-3 text-xs">
        <button
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => onChange(!value)}
          className={cn(
            "relative h-5 w-9 shrink-0 rounded-full transition",
            value ? "bg-primary-500" : "bg-surface-300 dark:bg-surface-700"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
              value ? "translate-x-4" : "translate-x-0.5"
            )}
          />
        </button>
        <span className="text-surface-700 dark:text-surface-200">{label}</span>
      </label>
      {hint && (
        <p className="mt-1 pl-12 text-[10px] leading-snug text-surface-500 dark:text-surface-400">
          {hint}
        </p>
      )}
    </div>
  );
}

// ── Success view ───────────────────────────────────────────────────────

function SuccessView({
  data,
  onCreateAnother,
}: {
  data: SuccessData;
  onCreateAnother: () => void;
}) {
  const [copiedField, setCopiedField] = useState<"link" | "share" | null>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  const copy = useCallback(
    async (value: string, kind: "link" | "share") => {
      try {
        await navigator.clipboard.writeText(value);
        setCopiedField(kind);
        window.setTimeout(() => setCopiedField(null), 1800);
      } catch {
        // Fallback: select + prompt to copy manually.
        linkRef.current?.select();
      }
    },
    []
  );

  const shareTargets = useMemo(() => {
    // The WhatsApp share intent takes a text= param; putting the
    // question first then the link is what group participants
    // actually want to see in the preview.
    const withQuestion = data.question
      ? `${data.question}\n${data.shareUrl}`
      : data.shareUrl;
    const wa = `https://wa.me/?text=${encodeURIComponent(withQuestion)}`;
    // Twitter's intent tweet endpoint takes both text and url so the
    // question stays inside the character budget and the link
    // renders as a card.
    const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      data.question || "Vote:"
    )}&url=${encodeURIComponent(data.shareUrl)}`;
    return { wa, tw };
  }, [data.question, data.shareUrl]);

  const downloadQr = useCallback(() => {
    if (!data.qrDataUrl) return;
    const a = document.createElement("a");
    a.href = data.qrDataUrl;
    a.download = `poll-${data.publicId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [data.qrDataUrl, data.publicId]);

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6 text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-success-200 bg-success-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-success-700 dark:border-success-500/40 dark:bg-success-500/10 dark:text-success-300">
          <Check className="h-3 w-3" />
          Live
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
          Your poll is live 🎉
        </h1>
        <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
          Share the link. Watch results roll in.
        </p>
      </header>

      <div className="space-y-4 rounded-3xl border border-surface-200 bg-white p-5 shadow-sm sm:p-7 dark:border-surface-800 dark:bg-surface-900">
        {/* Share URL */}
        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Share this link
          </span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              ref={linkRef}
              readOnly
              value={data.shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="min-w-0 flex-1 rounded-xl border border-surface-200 bg-surface-50 px-3 py-2.5 font-mono text-sm text-surface-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-800 dark:bg-surface-950 dark:text-surface-100"
            />
            <button
              type="button"
              onClick={() => copy(data.shareUrl, "link")}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition",
                copiedField === "link"
                  ? "bg-success-600 hover:bg-success-700"
                  : "bg-primary-600 hover:bg-primary-700"
              )}
            >
              {copiedField === "link" ? (
                <>
                  <Check className="h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share targets */}
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Share to
          </span>
          <div className="grid gap-2 sm:grid-cols-3">
            <a
              href={shareTargets.wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-95"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={shareTargets.tw}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              <TwitterIcon className="h-4 w-4" /> Twitter / X
            </a>
            <button
              type="button"
              onClick={() => copy(data.shareUrl, "share")}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                copiedField === "share"
                  ? "bg-success-600 text-white hover:bg-success-700"
                  : "border border-surface-200 bg-white text-surface-800 hover:border-surface-300 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100"
              )}
            >
              {copiedField === "share" ? (
                <>
                  <Check className="h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* QR code */}
        {data.qrDataUrl && (
          <div className="rounded-2xl border border-surface-200 bg-surface-50/60 p-4 dark:border-surface-800 dark:bg-surface-900/40">
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.qrDataUrl}
                alt="QR code linking to the poll"
                width={140}
                height={140}
                className="rounded-xl bg-white p-1 shadow-sm"
              />
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-semibold text-surface-900 dark:text-white">
                  QR code
                </p>
                <p className="mt-0.5 text-xs text-surface-600 dark:text-surface-300">
                  Point a phone camera. Ideal for classrooms, signage, and printed handouts.
                </p>
                <button
                  type="button"
                  onClick={downloadQr}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-surface-200 px-3 py-1.5 text-xs font-semibold text-surface-800 transition hover:border-surface-300 dark:border-surface-800 dark:text-surface-100"
                >
                  <Download className="h-3 w-3" /> Download QR
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <Link
            href={`/tools/instant-poll/${data.publicId}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600"
          >
            Open poll <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={onCreateAnother}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-surface-200 px-4 py-3 text-sm font-semibold text-surface-700 transition hover:border-surface-300 dark:border-surface-800 dark:text-surface-200"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Create another
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-surface-500 dark:text-surface-400">
        Only this browser can close or delete this poll. If you clear your cookies, that&rsquo;s lost — the poll itself keeps working.
      </p>
    </div>
  );
}
