export interface Tool {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  icon: string;
  href: string;
  /** User-facing URL for the standalone tool site. Opens in a new tab. */
  externalHref: string | null;
  /** URL for the in-page iframe embed. Often the same as `externalHref`,
   *  but can differ if the standalone site has a dedicated embed view
   *  (e.g. /embed) without a header/footer. Null = no embed available. */
  embedUrl: string | null;
  keywords: string[];
  trending: boolean;
  new: boolean;
  featured: boolean;
  monthlySearches: number;
  cpc: number;
  relatedTools: string[];
}

export const TOOLS: Tool[] = [
  {
    id: "loan-calculator",
    name: "Loan Calculator",
    description:
      "Free loan calculator to estimate monthly payments, interest, and total cost across any loan term and rate.",
    longDescription:
      "Calculate monthly loan payments, total interest, and full amortization schedules for personal, auto, student, or business loans. Compare interest rates, terms, and down payments side-by-side and download a printable schedule. Works for US, UK, Canadian, and EU borrowers with full currency support.",
    category: "Finance Tools",
    icon: "Banknote",
    href: "/tools/loan-calculator",
    // Built static export lives at public/embeds/loan-calculator/.
    externalHref:
      process.env.NEXT_PUBLIC_TOOL_LOAN_URL ?? "/embeds/loan-calculator/tools/loan-calculator/",
    embedUrl:
      process.env.NEXT_PUBLIC_TOOL_LOAN_URL ?? "/embeds/loan-calculator/tools/loan-calculator/",
    keywords: [
      "loan calculator",
      "monthly payment calculator",
      "personal loan calculator",
      "auto loan calculator",
      "amortization schedule",
      "interest calculator",
    ],
    trending: true,
    new: false,
    featured: true,
    monthlySearches: 2200000,
    cpc: 35,
    relatedTools: ["mortgage-calculator", "compound-interest-calculator", "tax-calculator"],
  },
  {
    id: "mortgage-calculator",
    name: "Mortgage Calculator",
    description:
      "Estimate monthly mortgage payments, PMI, taxes, and insurance with a free mortgage affordability calculator.",
    longDescription:
      "Plan home purchases with a complete mortgage calculator that includes principal, interest, property tax, homeowners insurance, PMI, and HOA fees. Compare 15-year vs 30-year terms, see amortization schedules, and check affordability based on income and debt-to-income ratio.",
    category: "Finance Tools",
    icon: "Home",
    href: "/tools/mortgage-calculator",
    // Mortgage Calculator is bundled inside the Loan-Calculator static export.
    externalHref:
      process.env.NEXT_PUBLIC_TOOL_MORTGAGE_URL ??
      "/embeds/loan-calculator/tools/mortgage-calculator/",
    embedUrl:
      process.env.NEXT_PUBLIC_TOOL_MORTGAGE_URL ??
      "/embeds/loan-calculator/tools/mortgage-calculator/",
    keywords: [
      "mortgage calculator",
      "home loan calculator",
      "PITI calculator",
      "mortgage affordability",
      "refinance calculator",
    ],
    trending: true,
    new: false,
    featured: true,
    monthlySearches: 2700000,
    cpc: 35,
    relatedTools: ["loan-calculator", "tax-calculator", "salary-calculator"],
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description:
      "Calculate Body Mass Index instantly in metric or imperial units with healthy range guidance for adults.",
    longDescription:
      "Measure body mass index with support for both metric (kg/cm) and imperial (lb/ft-in) units. See WHO healthy range categories, ideal weight targets, and personalized guidance based on age and gender. Mobile-friendly and works offline.",
    category: "Health Tools",
    icon: "HeartPulse",
    href: "/tools/bmi-calculator",
    externalHref: process.env.NEXT_PUBLIC_TOOL_BMI_URL ?? "/embeds/bmi-calculator/",
    embedUrl: process.env.NEXT_PUBLIC_TOOL_BMI_URL ?? "/embeds/bmi-calculator/",
    keywords: [
      "BMI calculator",
      "body mass index",
      "healthy weight calculator",
      "BMI metric",
      "BMI imperial",
    ],
    trending: true,
    new: false,
    featured: true,
    monthlySearches: 1800000,
    cpc: 18,
    relatedTools: ["calorie-calculator", "macros-calculator", "water-intake-calculator"],
  },
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    description:
      "Calculate percentages, percent change, percent off, and percent of any number with a free online tool.",
    longDescription:
      "Solve every percentage problem in seconds: percent of a number, percent change, percent increase or decrease, tip and discount math, and grade calculations. Includes step-by-step explanations so you can learn the formula, not just the answer.",
    category: "Calculator Tools",
    icon: "Percent",
    href: "/tools/percentage-calculator",
    externalHref:
      process.env.NEXT_PUBLIC_TOOL_PERCENTAGE_URL ?? "/embeds/percentage-calculator/",
    embedUrl:
      process.env.NEXT_PUBLIC_TOOL_PERCENTAGE_URL ?? "/embeds/percentage-calculator/",
    keywords: [
      "percentage calculator",
      "percent change calculator",
      "percent off calculator",
      "discount calculator",
      "percentage formula",
    ],
    trending: true,
    new: false,
    featured: true,
    monthlySearches: 1400000,
    cpc: 8,
    relatedTools: ["tip-calculator", "tax-calculator", "gpa-calculator"],
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    description:
      "Calculate exact age in years, months, weeks, and days between any two dates with timezone-aware accuracy.",
    longDescription:
      "Find precise age or duration between any two dates down to the day, hour, and minute. Includes leap-year handling, next-birthday countdown, and zodiac/Chinese zodiac display. Useful for HR, legal forms, and birthday planning.",
    category: "Calculator Tools",
    icon: "CalendarDays",
    href: "/tools/age-calculator",
    externalHref: process.env.NEXT_PUBLIC_TOOL_AGE_URL ?? "/embeds/age-calculator/",
    embedUrl: process.env.NEXT_PUBLIC_TOOL_AGE_URL ?? "/embeds/age-calculator/",
    keywords: [
      "age calculator",
      "date difference calculator",
      "birthday calculator",
      "years months days",
    ],
    trending: false,
    new: false,
    featured: false,
    monthlySearches: 900000,
    cpc: 4,
    relatedTools: ["percentage-calculator", "gpa-calculator", "tip-calculator"],
  },
  {
    id: "word-counter",
    name: "Word Counter",
    description:
      "Count words, characters, sentences, paragraphs, and reading time for essays, articles, and social posts.",
    longDescription:
      "Instantly analyze any text for word count, character count (with and without spaces), sentence and paragraph totals, reading time, speaking time, and keyword density. Perfect for students, writers, marketers, and SEO specialists.",
    category: "Text Tools",
    icon: "Type",
    href: "/tools/word-counter",
    // Static HTML lives in /public/embeds/word-counter (same-origin).
    // The rewrite rule in next.config.js maps this directory path to its
    // index.html automatically, so the URL stays clean.
    externalHref: process.env.NEXT_PUBLIC_TOOL_WORD_URL ?? "/embeds/word-counter/",
    embedUrl: process.env.NEXT_PUBLIC_TOOL_WORD_URL ?? "/embeds/word-counter/",
    keywords: [
      "word counter",
      "character counter",
      "text analyzer",
      "reading time calculator",
      "keyword density",
    ],
    trending: true,
    new: false,
    featured: false,
    monthlySearches: 1100000,
    cpc: 3,
    relatedTools: ["character-counter", "case-converter", "text-diff-checker"],
  },
  {
    id: "character-counter",
    name: "Character Counter",
    description:
      "Count characters with and without spaces for tweets, SEO meta tags, SMS, and bio fields.",
    longDescription:
      "Real-time character counting with platform presets for X (Twitter), LinkedIn, Instagram bios, SMS messages, and meta descriptions. Live limit indicators, byte count for UTF-8, and copy-friendly export.",
    category: "Text Tools",
    icon: "Hash",
    href: "/tools/character-counter",
    externalHref: null,
    embedUrl: null,
    keywords: ["character counter", "letter counter", "tweet counter", "bio counter"],
    trending: false,
    new: false,
    featured: false,
    monthlySearches: 450000,
    cpc: 2,
    relatedTools: ["word-counter", "case-converter", "meta-tag-generator"],
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description:
      "Convert text to uppercase, lowercase, title case, sentence case, camelCase, and snake_case instantly.",
    longDescription:
      "One-click conversion between every common text case: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE. Preserves emojis and punctuation, with batch and clipboard support.",
    category: "Text Tools",
    icon: "CaseSensitive",
    href: "/tools/case-converter",
    externalHref: null,
    embedUrl: null,
    keywords: ["case converter", "uppercase to lowercase", "title case", "snake case converter"],
    trending: false,
    new: true,
    featured: false,
    monthlySearches: 320000,
    cpc: 2,
    relatedTools: ["word-counter", "character-counter", "slug-generator"],
  },
  {
    id: "text-diff-checker",
    name: "Text Diff Checker",
    description:
      "Compare two text blocks side-by-side and highlight added, removed, and changed lines instantly.",
    longDescription:
      "Diff any two pieces of text with line-by-line, word-by-word, and character-level highlights. Ideal for proofreading drafts, comparing contract revisions, debugging configs, and reviewing translations. Privacy-first: everything runs locally.",
    category: "Text Tools",
    icon: "GitCompare",
    href: "/tools/text-diff-checker",
    externalHref: null,
    embedUrl: null,
    keywords: ["text diff", "compare text", "diff checker", "text comparison tool"],
    trending: false,
    new: true,
    featured: false,
    monthlySearches: 220000,
    cpc: 3,
    relatedTools: ["word-counter", "json-formatter", "case-converter"],
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description:
      "Compress JPEG, PNG, and WebP images up to 90% smaller with no visible quality loss, all in your browser.",
    longDescription:
      "Drop in JPEG, PNG, WebP, or AVIF files and shrink them up to 90% with adjustable quality, target file size, and bulk processing. Runs fully client-side so files never leave your device — perfect for sensitive product photos and ID images.",
    category: "Image Tools",
    icon: "ImageDown",
    href: "/tools/image-compressor",
    externalHref: process.env.NEXT_PUBLIC_TOOL_IMAGE_URL ?? "/embeds/image-compressor/",
    embedUrl: process.env.NEXT_PUBLIC_TOOL_IMAGE_URL ?? "/embeds/image-compressor/",
    keywords: [
      "image compressor",
      "compress JPEG",
      "compress PNG",
      "image optimizer",
      "reduce image size",
    ],
    trending: true,
    new: false,
    featured: false,
    monthlySearches: 850000,
    cpc: 6,
    relatedTools: ["image-converter", "pdf-converter", "qr-code-generator"],
  },
  {
    id: "image-converter",
    name: "Image Converter",
    description:
      "Convert between JPEG, PNG, WebP, AVIF, GIF, BMP, and HEIC formats with batch support and zero uploads.",
    longDescription:
      "Convert any common image format to any other in a few clicks: JPEG, PNG, WebP, AVIF, GIF, BMP, TIFF, ICO, and HEIC. Preserves EXIF when you want it, strips it when you don't, and handles batch jobs entirely in-browser.",
    category: "Image Tools",
    icon: "Images",
    href: "/tools/image-converter",
    // Image Converter (convert-to-webp tool) is inside the Image_Tools static export.
    externalHref:
      process.env.NEXT_PUBLIC_TOOL_IMAGE_CONVERTER_URL ??
      "/embeds/image-compressor/tools/convert-to-webp/",
    embedUrl:
      process.env.NEXT_PUBLIC_TOOL_IMAGE_CONVERTER_URL ??
      "/embeds/image-compressor/tools/convert-to-webp/",
    keywords: [
      "image converter",
      "convert HEIC to JPG",
      "PNG to WebP",
      "AVIF converter",
      "image format converter",
    ],
    trending: true,
    new: false,
    featured: false,
    monthlySearches: 720000,
    cpc: 5,
    relatedTools: ["image-compressor", "pdf-converter", "qr-code-generator"],
  },
  {
    id: "pdf-converter",
    name: "PDF Converter",
    description:
      "Convert PDFs to Word, Excel, JPG, or PNG and merge, split, or compress PDF files online for free.",
    longDescription:
      "All-in-one PDF toolkit: convert PDF to Word, Excel, PowerPoint, JPG, or PNG, and merge, split, rotate, or compress documents. OCR available for scanned files. Files are processed in-browser when possible and auto-deleted from servers within an hour.",
    category: "Productivity Tools",
    icon: "FileText",
    href: "/tools/pdf-converter",
    // PDF_Converter has a server `/api/convert` route that doesn't ship in
    // the static export — the UI loads but conversion calls will 404.
    // Run the standalone PDF_Converter dev server alongside utilityapps and
    // set NEXT_PUBLIC_TOOL_PDF_URL to that origin if you need full function.
    externalHref: process.env.NEXT_PUBLIC_TOOL_PDF_URL ?? "/embeds/pdf-converter/",
    embedUrl: process.env.NEXT_PUBLIC_TOOL_PDF_URL ?? "/embeds/pdf-converter/",
    keywords: [
      "PDF converter",
      "PDF to Word",
      "PDF to Excel",
      "merge PDF",
      "compress PDF",
      "split PDF",
    ],
    trending: true,
    new: false,
    featured: false,
    monthlySearches: 1600000,
    cpc: 9,
    relatedTools: ["image-converter", "qr-code-generator", "image-compressor"],
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    description:
      "Generate custom QR codes for URLs, WiFi, vCards, and payments with logos, colors, and high-resolution export.",
    longDescription:
      "Create branded QR codes for URLs, WiFi networks, vCards, SMS, email, and payment links. Customize colors, add a logo, choose error-correction level, and download as PNG, SVG, or PDF up to 4096px. Free for personal and commercial use.",
    category: "Productivity Tools",
    icon: "QrCode",
    href: "/tools/qr-code-generator",
    externalHref: null,
    embedUrl: null,
    keywords: ["QR code generator", "custom QR code", "QR code with logo", "WiFi QR code"],
    trending: true,
    new: false,
    featured: false,
    monthlySearches: 1300000,
    cpc: 7,
    relatedTools: ["password-generator", "pdf-converter", "meta-tag-generator"],
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description:
      "Create strong, random passwords with adjustable length, symbols, and pronounceable options. 100% offline.",
    longDescription:
      "Generate cryptographically secure random passwords with full control over length, character classes, and exclusions. Optional pronounceable mode, passphrase mode (Diceware-style), and bulk export. All generation happens locally — nothing is logged or transmitted.",
    category: "Developer Tools",
    icon: "KeyRound",
    href: "/tools/password-generator",
    externalHref: null,
    embedUrl: null,
    keywords: ["password generator", "secure password", "random password", "passphrase generator"],
    trending: false,
    new: false,
    featured: false,
    monthlySearches: 540000,
    cpc: 5,
    relatedTools: ["qr-code-generator", "json-formatter", "base64-encoder"],
  },
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    description:
      "Format, validate, minify, and convert JSON with syntax error highlighting and JSONPath query support.",
    longDescription:
      "Pretty-print or minify JSON, validate against JSON Schema, and inspect huge payloads with collapsible tree view, search, and JSONPath queries. Convert between JSON, YAML, CSV, and XML in one click. Works with massive files — no server roundtrips.",
    category: "Developer Tools",
    icon: "Braces",
    href: "/tools/json-formatter",
    externalHref: null,
    embedUrl: null,
    keywords: ["JSON formatter", "JSON validator", "JSON beautifier", "JSON to YAML", "JSONPath"],
    trending: false,
    new: false,
    featured: false,
    monthlySearches: 480000,
    cpc: 4,
    relatedTools: ["base64-encoder", "password-generator", "text-diff-checker"],
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder & Decoder",
    description:
      "Encode and decode Base64 strings, files, and images instantly with URL-safe and standard variants.",
    longDescription:
      "Convert text, files, and images to and from Base64 with one click. Supports standard, URL-safe, and MIME variants, and handles both UTF-8 strings and binary blobs. All processing is local — perfect for handling tokens, secrets, and PII safely.",
    category: "Developer Tools",
    icon: "Binary",
    href: "/tools/base64-encoder",
    externalHref: null,
    embedUrl: null,
    keywords: ["base64 encoder", "base64 decoder", "encode base64", "decode base64"],
    trending: false,
    new: false,
    featured: false,
    monthlySearches: 360000,
    cpc: 3,
    relatedTools: ["json-formatter", "password-generator", "url-encoder"],
  },
  {
    id: "url-encoder",
    name: "URL Encoder & Decoder",
    description:
      "Percent-encode and decode URLs, query parameters, and components for safe links and API requests.",
    longDescription:
      "Encode or decode entire URLs or just components (path, query, fragment) using RFC-3986 percent encoding. Inspect and edit query parameters in a friendly grid view, then export the rebuilt URL. Great for debugging redirects and API integrations.",
    category: "Developer Tools",
    icon: "Link2",
    href: "/tools/url-encoder",
    externalHref: null,
    embedUrl: null,
    keywords: ["URL encoder", "URL decoder", "percent encoder", "query string encoder"],
    trending: false,
    new: true,
    featured: false,
    monthlySearches: 210000,
    cpc: 3,
    relatedTools: ["base64-encoder", "json-formatter", "meta-tag-generator"],
  },
  {
    id: "meta-tag-generator",
    name: "Meta Tag Generator",
    description:
      "Generate SEO meta tags, Open Graph, and Twitter Card markup with live preview for Google and social.",
    longDescription:
      "Build complete SEO and social meta tags — title, description, canonical, Open Graph, Twitter Cards, and JSON-LD — with live previews of Google SERP, Facebook, X, and LinkedIn share cards. Includes character-limit guards and best-practice tips.",
    category: "SEO Tools",
    icon: "Tag",
    href: "/tools/meta-tag-generator",
    externalHref: null,
    embedUrl: null,
    keywords: ["meta tag generator", "Open Graph generator", "Twitter Card generator", "SEO meta"],
    trending: true,
    new: false,
    featured: false,
    monthlySearches: 280000,
    cpc: 6,
    relatedTools: ["slug-generator", "character-counter", "json-formatter"],
  },
  {
    id: "slug-generator",
    name: "Slug Generator",
    description:
      "Convert any title or string into a clean, SEO-friendly URL slug with stop-word and locale support.",
    longDescription:
      "Turn article titles, product names, or any string into clean, lowercase, hyphenated slugs. Strips stop words, normalizes accents, supports custom separators, and handles non-Latin scripts (Cyrillic, Greek, CJK transliteration).",
    category: "SEO Tools",
    icon: "Slash",
    href: "/tools/slug-generator",
    externalHref: null,
    embedUrl: null,
    keywords: ["slug generator", "URL slug", "SEO slug", "permalink generator"],
    trending: false,
    new: true,
    featured: false,
    monthlySearches: 95000,
    cpc: 4,
    relatedTools: ["meta-tag-generator", "case-converter", "url-encoder"],
  },
  {
    id: "tip-calculator",
    name: "Tip Calculator",
    description:
      "Split bills and calculate tips by percentage, party size, and country tipping customs in seconds.",
    longDescription:
      "Calculate tips and split checks across any party size with country-aware presets for the US, UK, Canada, and EU. Round-up modes, separate-tax handling, and per-person totals make this the only tip calculator you'll need at the table.",
    category: "Calculator Tools",
    icon: "Receipt",
    href: "/tools/tip-calculator",
    externalHref: null,
    embedUrl: null,
    keywords: ["tip calculator", "bill splitter", "split the check", "gratuity calculator"],
    trending: false,
    new: false,
    featured: false,
    monthlySearches: 410000,
    cpc: 3,
    relatedTools: ["percentage-calculator", "tax-calculator", "currency-converter"],
  },
  {
    id: "gpa-calculator",
    name: "GPA Calculator",
    description:
      "Calculate weighted, unweighted, and cumulative GPA on 4.0 and 5.0 scales for high school and college.",
    longDescription:
      "Track GPA across semesters with support for 4.0 unweighted, 4.0 weighted, 5.0 weighted, and percentage scales. Add letter grades or numeric scores, set credit hours, and project the GPA you need next term to hit a target.",
    category: "Calculator Tools",
    icon: "GraduationCap",
    href: "/tools/gpa-calculator",
    externalHref: null,
    embedUrl: null,
    keywords: ["GPA calculator", "weighted GPA", "cumulative GPA", "college GPA"],
    trending: false,
    new: false,
    featured: false,
    monthlySearches: 520000,
    cpc: 5,
    relatedTools: ["percentage-calculator", "age-calculator", "tip-calculator"],
  },
  {
    id: "tax-calculator",
    name: "Income Tax Calculator",
    description:
      "Estimate federal and state income tax for the US, UK, Canada, and EU with current bracket data.",
    longDescription:
      "Estimate take-home pay after federal, state, and local income tax for the US, UK, Canada, Germany, France, and more. Includes standard deductions, common credits, and self-employment tax — updated each tax year.",
    category: "Finance Tools",
    icon: "Calculator",
    href: "/tools/tax-calculator",
    externalHref: null,
    embedUrl: null,
    keywords: ["tax calculator", "income tax calculator", "take home pay", "tax bracket calculator"],
    trending: true,
    new: false,
    featured: false,
    monthlySearches: 980000,
    cpc: 22,
    relatedTools: ["salary-calculator", "loan-calculator", "mortgage-calculator"],
  },
  {
    id: "salary-calculator",
    name: "Salary Calculator",
    description:
      "Convert hourly, weekly, monthly, and annual salary across currencies with tax and overtime support.",
    longDescription:
      "Compare offers and convert between hourly, weekly, biweekly, monthly, and annual pay across major currencies. Optional withholding, overtime, and benefits cost adjustments produce a true take-home estimate for the US, UK, Canada, and EU.",
    category: "Finance Tools",
    icon: "Wallet",
    href: "/tools/salary-calculator",
    externalHref: null,
    embedUrl: null,
    keywords: ["salary calculator", "hourly to annual", "take home calculator", "paycheck calculator"],
    trending: false,
    new: false,
    featured: false,
    monthlySearches: 760000,
    cpc: 14,
    relatedTools: ["tax-calculator", "loan-calculator", "currency-converter"],
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    description:
      "Convert between 160+ world currencies with live mid-market rates and multi-amount conversion tables.",
    longDescription:
      "Convert any amount between 160+ currencies using live mid-market exchange rates. View 30/90/365-day historical charts, set rate alerts, and export multi-currency tables for travel budgets and invoicing.",
    category: "Finance Tools",
    icon: "ArrowLeftRight",
    href: "/tools/currency-converter",
    externalHref: null,
    embedUrl: null,
    keywords: ["currency converter", "exchange rate", "USD to EUR", "live forex rates"],
    trending: false,
    new: false,
    featured: false,
    monthlySearches: 1200000,
    cpc: 6,
    relatedTools: ["salary-calculator", "tax-calculator", "tip-calculator"],
  },
  {
    id: "calorie-calculator",
    name: "Calorie Calculator",
    description:
      "Calculate daily calorie needs (TDEE) and calorie targets for weight loss, maintenance, or muscle gain.",
    longDescription:
      "Estimate daily calorie needs using Mifflin-St Jeor and Katch-McArdle equations. Get TDEE based on activity level, then targets for cutting, recomposition, or lean bulking with macro-aware recommendations.",
    category: "Health Tools",
    icon: "Flame",
    href: "/tools/calorie-calculator",
    externalHref: null,
    embedUrl: null,
    keywords: ["calorie calculator", "TDEE calculator", "BMR calculator", "weight loss calculator"],
    trending: true,
    new: false,
    featured: false,
    monthlySearches: 880000,
    cpc: 11,
    relatedTools: ["bmi-calculator", "macros-calculator", "water-intake-calculator"],
  },
];

export const TOOLS_BY_ID: Record<string, Tool> = TOOLS.reduce(
  (acc, tool) => {
    acc[tool.id] = tool;
    return acc;
  },
  {} as Record<string, Tool>
);

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS_BY_ID[slug];
}

export function getToolsByCategory(category: string): Tool[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function getFeaturedTools(): Tool[] {
  return TOOLS.filter((tool) => tool.featured);
}

export function getTrendingTools(): Tool[] {
  return TOOLS.filter((tool) => tool.trending);
}

export function getNewTools(): Tool[] {
  return TOOLS.filter((tool) => tool.new);
}
