"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

type SourceType = "website" | "book" | "journal";
type Style = "apa" | "mla" | "chicago";

interface Source {
  firstName: string;
  lastName: string;
  title: string;
  year: string;
  // website
  siteName: string;
  url: string;
  accessDate: string;
  // book
  publisher: string;
  city: string;
  // journal
  journal: string;
  volume: string;
  issue: string;
  pages: string;
}

const EMPTY: Source = {
  firstName: "",
  lastName: "",
  title: "",
  year: "",
  siteName: "",
  url: "",
  accessDate: "",
  publisher: "",
  city: "",
  journal: "",
  volume: "",
  issue: "",
  pages: "",
};

function dot(s: string): string {
  return s.trim().replace(/\.+$/, "") + ".";
}

/** Returns { plain, jsx } where jsx renders italic parts via <em>. */
function buildCitation(type: SourceType, style: Style, s: Source): { plain: string; jsx: React.ReactNode } {
  const last = s.lastName.trim() || "Author";
  const first = s.firstName.trim();
  const firstInitial = first ? `${first.charAt(0).toUpperCase()}.` : "";
  const year = s.year.trim() || "n.d.";
  const title = s.title.trim() || "Untitled";

  // Author by style.
  const authorApa = first ? `${last}, ${firstInitial}` : last;
  const authorMlaChicago = first ? `${last}, ${first}` : last;

  const italic = (text: string) => <em key={text}>{text}</em>;

  if (style === "apa") {
    if (type === "website") {
      const plain = `${dot(authorApa)} (${year}). ${title}. ${s.siteName.trim() || "Site"}. ${s.url.trim()}`;
      return {
        plain,
        jsx: <>{dot(authorApa)} ({year}). {italic(title)}. {dot(s.siteName.trim() || "Site")} {s.url.trim()}</>,
      };
    }
    if (type === "book") {
      const plain = `${dot(authorApa)} (${year}). ${title}. ${dot(s.publisher.trim() || "Publisher")}`;
      return { plain, jsx: <>{dot(authorApa)} ({year}). {italic(title)}. {dot(s.publisher.trim() || "Publisher")}</> };
    }
    const vol = s.volume.trim();
    const iss = s.issue.trim();
    const plain = `${dot(authorApa)} (${year}). ${title}. ${s.journal.trim() || "Journal"}, ${vol}${iss ? `(${iss})` : ""}, ${s.pages.trim()}.`;
    return {
      plain,
      jsx: <>{dot(authorApa)} ({year}). {title}. {italic(s.journal.trim() || "Journal")}, {italic(vol)}{iss ? `(${iss})` : ""}, {dot(s.pages.trim())}</>,
    };
  }

  if (style === "mla") {
    if (type === "website") {
      const plain = `${dot(authorMlaChicago)} "${title}." ${s.siteName.trim() || "Site"}, ${year}, ${s.url.trim()}.`;
      return {
        plain,
        jsx: <>{dot(authorMlaChicago)} &ldquo;{title}.&rdquo; {italic(s.siteName.trim() || "Site")}, {year}, {dot(s.url.trim())}</>,
      };
    }
    if (type === "book") {
      const plain = `${dot(authorMlaChicago)} ${title}. ${s.publisher.trim() || "Publisher"}, ${year}.`;
      return { plain, jsx: <>{dot(authorMlaChicago)} {italic(title)}. {s.publisher.trim() || "Publisher"}, {dot(year)}</> };
    }
    const vol = s.volume.trim();
    const iss = s.issue.trim();
    const plain = `${dot(authorMlaChicago)} "${title}." ${s.journal.trim() || "Journal"}, vol. ${vol}, no. ${iss}, ${year}, pp. ${s.pages.trim()}.`;
    return {
      plain,
      jsx: <>{dot(authorMlaChicago)} &ldquo;{title}.&rdquo; {italic(s.journal.trim() || "Journal")}, vol. {vol}, no. {iss}, {year}, pp. {dot(s.pages.trim())}</>,
    };
  }

  // Chicago — bibliography entry.
  if (type === "website") {
    const access = s.accessDate.trim();
    const plain = `${dot(authorMlaChicago)} "${title}." ${s.siteName.trim() || "Site"}.${access ? ` Accessed ${access}.` : ""} ${s.url.trim()}.`;
    return {
      plain,
      jsx: <>{dot(authorMlaChicago)} &ldquo;{title}.&rdquo; {dot(s.siteName.trim() || "Site")}{access ? ` Accessed ${access}.` : ""} {dot(s.url.trim())}</>,
    };
  }
  if (type === "book") {
    const plain = `${dot(authorMlaChicago)} ${title}. ${s.city.trim() || "City"}: ${s.publisher.trim() || "Publisher"}, ${year}.`;
    return { plain, jsx: <>{dot(authorMlaChicago)} {italic(title)}. {s.city.trim() || "City"}: {s.publisher.trim() || "Publisher"}, {dot(year)}</> };
  }
  const vol = s.volume.trim();
  const iss = s.issue.trim();
  const plain = `${dot(authorMlaChicago)} "${title}." ${s.journal.trim() || "Journal"} ${vol}, no. ${iss} (${year}): ${s.pages.trim()}.`;
  return {
    plain,
    jsx: <>{dot(authorMlaChicago)} &ldquo;{title}.&rdquo; {italic(s.journal.trim() || "Journal")} {vol}, no. {iss} ({year}): {dot(s.pages.trim())}</>,
  };
}

const FIELD_CLASS =
  "w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:outline-none dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500";

export function CitationGenerator() {
  const [type, setType] = useState<SourceType>("website");
  const [src, setSrc] = useState<Source>(EMPTY);
  const [copied, setCopied] = useState<Style | null>(null);

  const set = (k: keyof Source, v: string) => setSrc((s) => ({ ...s, [k]: v }));

  const citations = useMemo(
    () => ({
      apa: buildCitation(type, "apa", src),
      mla: buildCitation(type, "mla", src),
      chicago: buildCitation(type, "chicago", src),
    }),
    [type, src]
  );

  const handleCopy = async (style: Style) => {
    await navigator.clipboard.writeText(citations[style].plain);
    setCopied(style);
    window.setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Source type
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {([
            { id: "website", label: "Website" },
            { id: "book", label: "Book" },
            { id: "journal", label: "Journal article" },
          ] as { id: SourceType; label: string }[]).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setType(o.id)}
              className={cn(
                "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                type === o.id
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-500/10 dark:text-primary-200"
                  : "border-surface-200 text-surface-700 hover:border-primary-300 dark:border-surface-800 dark:text-surface-200 dark:hover:border-primary-700"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Author last name">
            <input value={src.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Smith" className={FIELD_CLASS} />
          </Field>
          <Field label="Author first name">
            <input value={src.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="John" className={FIELD_CLASS} />
          </Field>
          <Field label={type === "journal" ? "Article title" : type === "book" ? "Book title" : "Page title"}>
            <input value={src.title} onChange={(e) => set("title", e.target.value)} className={FIELD_CLASS} />
          </Field>
          <Field label="Year">
            <input value={src.year} onChange={(e) => set("year", e.target.value)} placeholder="2026" className={FIELD_CLASS} />
          </Field>

          {type === "website" && (
            <>
              <Field label="Site name">
                <input value={src.siteName} onChange={(e) => set("siteName", e.target.value)} className={FIELD_CLASS} />
              </Field>
              <Field label="URL">
                <input value={src.url} onChange={(e) => set("url", e.target.value)} className={FIELD_CLASS} />
              </Field>
              <Field label="Access date (Chicago)">
                <input value={src.accessDate} onChange={(e) => set("accessDate", e.target.value)} placeholder="May 16, 2026" className={FIELD_CLASS} />
              </Field>
            </>
          )}
          {type === "book" && (
            <>
              <Field label="Publisher">
                <input value={src.publisher} onChange={(e) => set("publisher", e.target.value)} className={FIELD_CLASS} />
              </Field>
              <Field label="City (Chicago)">
                <input value={src.city} onChange={(e) => set("city", e.target.value)} placeholder="New York" className={FIELD_CLASS} />
              </Field>
            </>
          )}
          {type === "journal" && (
            <>
              <Field label="Journal name">
                <input value={src.journal} onChange={(e) => set("journal", e.target.value)} className={FIELD_CLASS} />
              </Field>
              <Field label="Volume">
                <input value={src.volume} onChange={(e) => set("volume", e.target.value)} className={FIELD_CLASS} />
              </Field>
              <Field label="Issue">
                <input value={src.issue} onChange={(e) => set("issue", e.target.value)} className={FIELD_CLASS} />
              </Field>
              <Field label="Pages">
                <input value={src.pages} onChange={(e) => set("pages", e.target.value)} placeholder="12-28" className={FIELD_CLASS} />
              </Field>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {([
          { id: "apa", label: "APA 7th edition" },
          { id: "mla", label: "MLA 9th edition" },
          { id: "chicago", label: "Chicago (bibliography)" },
        ] as { id: Style; label: string }[]).map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border-2 border-primary-300 bg-primary-50/40 p-4 dark:border-primary-500/40 dark:bg-primary-500/10"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
                {s.label}
              </p>
              <button
                type="button"
                onClick={() => handleCopy(s.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-700"
              >
                {copied === s.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied === s.id ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="rounded-lg bg-white p-3 text-sm leading-relaxed text-surface-900 dark:bg-surface-900 dark:text-white">
              {citations[s.id].jsx}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{label}</span>
      {children}
    </label>
  );
}
