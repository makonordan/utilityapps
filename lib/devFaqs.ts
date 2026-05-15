import { type FAQItem } from "@/components/tools/ToolFAQ";
import { SITE_CONFIG } from "@/lib/utils";

export type DevToolId =
  | "jwt-decoder"
  | "uuid-generator"
  | "regex-tester"
  | "yaml-to-json"
  | "csv-to-json"
  | "cron-expression-builder"
  | "html-formatter"
  | "sql-formatter"
  | "hash-generator"
  | "color-converter";

export interface HowToStep {
  name: string;
  text: string;
}

export const DEV_FAQS: Record<DevToolId, FAQItem[]> = {
  "jwt-decoder": [
    { q: "Is the JWT decoder free?", a: "Yes — completely free, no signup, no quota. Decode as many tokens as you need." },
    { q: "Are my tokens uploaded?", a: "No. The header and payload are decoded locally using base64url decoding in your browser. Your token never leaves the page." },
    { q: "Which signing algorithms can be verified?", a: "HS256, HS384, and HS512 verification is supported with a shared secret you provide. Asymmetric algorithms (RS256, ES256) are decoded for inspection but not verified — pasting a private key in a browser tool is risky and not encouraged." },
    { q: "Why is my signature invalid?", a: "Most often the secret is wrong, the algorithm differs from what's in the header, or the token was modified after signing. Decoded payloads with no signature verification are still useful for debugging — just don't trust them in production." },
    { q: "What's a JWT made of?", a: "Three base64url-encoded segments joined with dots: header (algorithm + type), payload (claims), and signature (proof the token wasn't tampered with). The decoder shows each part on its own panel." },
  ],

  "uuid-generator": [
    { q: "Is the UUID generator free?", a: "Yes — free with no signup or limits. Generate single UUIDs or batches of up to 1,000 at once." },
    { q: "What's the difference between v1, v4, and v7?", a: "v1 is timestamp + machine identifier (sortable but leaks info). v4 is random (most common, opaque). v7 is timestamp-prefixed random (sortable and opaque, the modern default for new systems)." },
    { q: "Are the UUIDs cryptographically secure?", a: "v4 and v7 use the browser's WebCrypto random source. v1 uses a JavaScript-generated node ID since browsers don't expose hardware MAC addresses." },
    { q: "Can I download the batch?", a: "Yes — export the generated UUIDs as a plain text file (one per line) or copy them to the clipboard." },
    { q: "Should I use v7 in new code?", a: "Almost always yes. v7 is sortable by creation time (great for database primary keys), opaque enough to leak nothing meaningful, and supported by every modern UUID library." },
  ],

  "regex-tester": [
    { q: "Is the regex tester free?", a: "Yes — free, no signup. Test patterns as often as you like." },
    { q: "Which regex flavour is supported?", a: "JavaScript regex (ECMAScript). Most patterns work the same in PCRE / Python / .NET, but some advanced features (lookbehind, named groups syntax, atomic groups) differ across engines." },
    { q: "Does it show capture groups?", a: "Yes. Each match expands to show numbered and named capture groups, with positions in the source." },
    { q: "What flags are supported?", a: "g (global), i (case-insensitive), m (multiline), s (dotall), u (unicode), and y (sticky). Toggle each one above the test area." },
    { q: "Are large inputs handled?", a: "Yes, but very long inputs combined with greedy patterns can be slow because of catastrophic backtracking — that's regex behaviour, not a bug. The tester aborts after 2 seconds to keep the browser responsive." },
  ],

  "yaml-to-json": [
    { q: "Is the YAML / JSON converter free?", a: "Yes — completely free, no signup, no upload." },
    { q: "Does it work both ways?", a: "Yes. Toggle the direction button to switch between YAML → JSON and JSON → YAML." },
    { q: "What YAML version is supported?", a: "YAML 1.2, the spec used by most modern tools (Kubernetes, GitHub Actions, Ansible, Docker Compose). Powered by js-yaml." },
    { q: "Are anchors and aliases preserved?", a: "Anchors and aliases in YAML are resolved into duplicated values when converted to JSON — JSON doesn't have a way to express references natively." },
    { q: "Will my data be uploaded?", a: "No. Conversion runs entirely in your browser. The text never leaves your device." },
  ],

  "csv-to-json": [
    { q: "Is the CSV / JSON converter free?", a: "Yes — free, no signup, no quota." },
    { q: "Does it use the first row as field names?", a: "By default yes. Toggle 'First row is headers' off if your file has no header row — fields will be auto-named (column1, column2, …)." },
    { q: "What separators are supported?", a: "Comma, semicolon, tab, and pipe. Auto-detected from the first line, with a manual override available." },
    { q: "Does it handle quoted values?", a: "Yes. Standard CSV quoting and escape rules (RFC 4180) are honoured: double-quotes wrap values containing separators or newlines, and \"\" inside a quoted field becomes a literal quote." },
    { q: "Will my data be uploaded?", a: "No. Parsing runs entirely in your browser." },
  ],

  "cron-expression-builder": [
    { q: "Is the cron builder free?", a: "Yes — free with no signup." },
    { q: "Which cron flavour is supported?", a: "Standard 5-field Unix cron (minute hour day-of-month month day-of-week). The next-run preview also accepts 6-field expressions with seconds." },
    { q: "Can I see when it'll fire next?", a: "Yes. The next 5 fire times are shown in your local timezone, computed live as you build the expression." },
    { q: "Does it explain what the expression does?", a: "Yes — every change updates a human-readable description (e.g. 'Every Monday and Friday at 9:00 AM')." },
    { q: "Is the expression valid for my system?", a: "The standard form here is what most schedulers accept (cron, crontab, GitHub Actions, Render). Some platforms (Quartz, AWS) have extra fields — check their docs if you're outside the standard 5-field syntax." },
  ],

  "html-formatter": [
    { q: "Is the HTML formatter free?", a: "Yes — free, no signup, no upload." },
    { q: "Does it minify too?", a: "Yes. Switch the toggle to Minify to compress your HTML down by stripping whitespace and comments." },
    { q: "Will it break my markup?", a: "No. The formatter parses HTML using js-beautify, which preserves the document structure exactly — only whitespace and indentation change." },
    { q: "What about embedded scripts and styles?", a: "JavaScript inside <script> tags and CSS inside <style> tags are formatted with their own parsers. Indentation is preserved end-to-end." },
    { q: "How big can my input be?", a: "Up to about 1 MB before the formatter slows noticeably. Larger files are best handled by Prettier in your editor." },
  ],

  "sql-formatter": [
    { q: "Is the SQL formatter free?", a: "Yes — free, no signup, no upload." },
    { q: "Which SQL dialects are supported?", a: "Standard SQL plus PostgreSQL, MySQL, MariaDB, BigQuery, Snowflake, Redshift, SQLite, Db2, Trino / Presto, and SQL Server. Pick the one closest to your database in the dropdown." },
    { q: "Will it execute the query?", a: "No — this is a formatter, not a runner. It only reformats the text. No connection to a database is made." },
    { q: "Can I customise the output?", a: "Yes — pick the indentation width, keyword case (UPPER, lower, capitalize), and whether to align operators." },
    { q: "Will my SQL be uploaded?", a: "No. Formatting runs entirely in your browser." },
  ],

  "hash-generator": [
    { q: "Is the hash generator free?", a: "Yes — free, no signup, no quota." },
    { q: "Which algorithms are supported?", a: "MD5, SHA-1, SHA-256, and SHA-512. SHA family hashes use the browser's WebCrypto API; MD5 uses a small JavaScript implementation since browsers don't expose it natively." },
    { q: "Can I hash a file?", a: "Yes. Drop a file (up to ~500 MB) and the same algorithms produce the file's hash. Useful for verifying downloads against published checksums." },
    { q: "Are MD5 and SHA-1 still safe?", a: "MD5 and SHA-1 are broken for cryptographic security but remain useful for non-security checksums (file integrity, deduplication). Use SHA-256 or SHA-512 for password storage, signatures, or anywhere collision resistance matters." },
    { q: "Will my input be uploaded?", a: "No. Both text and file hashing run locally in your browser." },
  ],

  "color-converter": [
    { q: "Is the colour converter free?", a: "Yes — free, no signup, no quota." },
    { q: "What formats are supported?", a: "HEX (3, 4, 6, and 8 digit), RGB / RGBA, HSL / HSLA, and CSS named colours (147 of them). Paste in any format and see the others update live." },
    { q: "Does it include transparency?", a: "Yes — alpha channel is preserved across formats (HEX with 8 digits, rgba(...), hsla(...))." },
    { q: "Can I use it for accessibility checks?", a: "The converter shows the colour preview but doesn't run contrast checks. Pair it with a contrast-ratio tool for WCAG AA / AAA compliance." },
    { q: "Where do the named colours come from?", a: "The list is the CSS Color Module Level 4 specification — the 147 names recognised by modern browsers (red, hotpink, rebeccapurple, etc.)." },
  ],
};

export const DEV_HOWTOS: Record<DevToolId, HowToStep[]> = {
  "jwt-decoder": [
    { name: "Paste your token", text: "Drop a JWT into the input box. The header, payload, and raw signature appear instantly." },
    { name: "Inspect", text: "Read the decoded JSON header and payload. Standard claims (exp, iat, sub, etc.) are highlighted." },
    { name: "Verify (HS-family)", text: "If your token uses HS256 / HS384 / HS512, paste the shared secret to confirm the signature is valid." },
  ],
  "uuid-generator": [
    { name: "Pick a version", text: "v4 is the safe default; v7 is sortable; v1 leaks timestamp + node id (rarely the right choice today)." },
    { name: "Choose count", text: "Generate one UUID or up to 1,000 in a single batch." },
    { name: "Copy or download", text: "Copy individual UUIDs, copy the whole batch, or download as a text file." },
  ],
  "regex-tester": [
    { name: "Type your pattern", text: "Paste or type the regex. Validation errors show as you type." },
    { name: "Set flags", text: "Toggle g, i, m, s, u, y — each flag updates the matches live." },
    { name: "Provide test text", text: "Drop the string to test against. Matches are highlighted in the source and listed below with capture groups." },
  ],
  "yaml-to-json": [
    { name: "Pick a direction", text: "YAML → JSON or JSON → YAML." },
    { name: "Paste your input", text: "Drop the source on the left. Conversion runs as you type." },
    { name: "Copy the result", text: "The output panel updates live; click Copy to grab the result." },
  ],
  "csv-to-json": [
    { name: "Paste your CSV", text: "Drop a CSV table on the left. Auto-detect picks the separator." },
    { name: "Toggle headers", text: "Decide whether the first row contains field names." },
    { name: "Copy the JSON", text: "The output appears as an array of objects — copy or download." },
  ],
  "cron-expression-builder": [
    { name: "Pick a preset or build", text: "Start from a preset (every hour, every day at 9, weekdays at 8) or set each field manually." },
    { name: "Read the description", text: "A plain-English description and the next 5 fire times update as you change the expression." },
    { name: "Copy the expression", text: "Drop the string into your scheduler (cron, GitHub Actions, etc.)." },
  ],
  "html-formatter": [
    { name: "Paste your HTML", text: "Drop your markup on the left." },
    { name: "Pick a mode", text: "Pretty-print or Minify, with indentation control." },
    { name: "Copy the result", text: "Output updates live; click Copy to grab it." },
  ],
  "sql-formatter": [
    { name: "Paste your SQL", text: "Drop the query on the left." },
    { name: "Pick a dialect", text: "Standard / PostgreSQL / MySQL / Snowflake / BigQuery / etc." },
    { name: "Pick options", text: "Indentation width, keyword case (UPPER / lower / capitalize)." },
    { name: "Copy the formatted query", text: "Output updates live; click Copy." },
  ],
  "hash-generator": [
    { name: "Pick a source", text: "Type or paste text, or drop a file." },
    { name: "Select algorithms", text: "MD5, SHA-1, SHA-256, SHA-512 — pick one or all." },
    { name: "Copy the digest", text: "Each digest is shown as a hex string. Click to copy." },
  ],
  "color-converter": [
    { name: "Type a colour", text: "Paste any HEX, RGB, HSL, or named CSS colour." },
    { name: "See all formats", text: "The converter updates HEX, RGB, HSL, and the closest named colour live." },
    { name: "Copy what you need", text: "Click any value to copy it to the clipboard." },
  ],
};

export const DEV_FEATURE_LISTS: Record<DevToolId, string> = {
  "jwt-decoder":
    "Header + payload decoder, standard claim highlighting, HS256/HS384/HS512 signature verification, in-browser, no upload",
  "uuid-generator":
    "v1, v4, v7 generation, batches up to 1,000, copy + download, WebCrypto-backed randomness",
  "regex-tester":
    "JavaScript regex, live highlighting, capture groups, all standard flags (gimsuy), 2-second runtime cap",
  "yaml-to-json":
    "YAML 1.2 ↔ JSON conversion, live preview, anchors/aliases resolved, in-browser via js-yaml",
  "csv-to-json":
    "Auto-detect separator, header toggle, RFC 4180 quoting, JSON array of objects output",
  "cron-expression-builder":
    "Visual builder, plain-English description, next 5 fire times, presets, copy expression",
  "html-formatter":
    "Pretty-print + minify, embedded JS/CSS formatting, indentation control, in-browser via js-beautify",
  "sql-formatter":
    "Multi-dialect (Postgres, MySQL, BigQuery, Snowflake, Redshift, SQLite, T-SQL, Db2, Trino), keyword case, indent width",
  "hash-generator":
    "MD5, SHA-1, SHA-256, SHA-512 of text or files, WebCrypto-backed for SHA family, file support up to 500 MB",
  "color-converter":
    "HEX ↔ RGB ↔ HSL ↔ named, alpha-channel aware, 147 CSS colour names, live preview swatch",
};

export const DEV_TOOL_PUBLISHED = "2026-05-15";

export function getDevFaqs(toolId: string): FAQItem[] {
  return DEV_FAQS[toolId as DevToolId] ?? [];
}

export function getDevHowTo(toolId: string): HowToStep[] {
  return DEV_HOWTOS[toolId as DevToolId] ?? [];
}

export function getDevFeatureList(toolId: string): string {
  return DEV_FEATURE_LISTS[toolId as DevToolId] ?? "";
}

export function devToolOgUrl(title: string, description: string): string {
  const params = new URLSearchParams({ title, description, type: "dev-tool" });
  return `${SITE_CONFIG.url}/api/og?${params.toString()}`;
}
