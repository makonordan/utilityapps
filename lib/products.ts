export type ProductPlatform =
  | "gumroad"
  | "etsy"
  | "shopify"
  | "gumroad-affiliate"
  | "utilityapps";

const PLATFORM_LABELS: Record<ProductPlatform, string> = {
  gumroad: "Gumroad",
  "gumroad-affiliate": "Gumroad",
  etsy: "Etsy",
  shopify: "Shopify",
  utilityapps: "UtilityApps",
};

export function platformLabel(platform: ProductPlatform): string {
  return PLATFORM_LABELS[platform];
}

export interface ProductReview {
  author: string;
  rating: number;
  body: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number;
  currency: "USD";
  category: string;
  tags: string[];
  /** Tailwind gradient class string used as a decorative overlay while the
   *  cover image loads. e.g. "from-primary-500 to-accent-500" */
  image: string;
  /** Cover image URL shown on product cards and detail pages. */
  imageUrl: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  platform: ProductPlatform;
  /** "owned" = sold directly by us via Korapay checkout. Absent / "affiliate"
   *  = an external buy link. */
  kind?: "owned" | "affiliate";
  /** External purchase link. Required for affiliate products; unused for owned. */
  affiliateUrl?: string;
  /** Supabase Storage object path for an owned product's downloadable file.
   *  Absent on an owned product => "coming soon" (not yet purchasable). */
  file?: string;
  /** Human-readable file format shown in the UI, e.g. "PDF", "XLSX". */
  fileFormat?: string;
  featured: boolean;
  bestseller: boolean;
  new: boolean;
  features: string[];
  reviews: ProductReview[];
}

/** An owned product sold directly through the on-site Korapay checkout. */
export function isOwnedProduct(p: Product): boolean {
  return p.kind === "owned";
}

/** An owned product whose downloadable file has not been uploaded yet. */
export function isComingSoon(p: Product): boolean {
  return p.kind === "owned" && !p.file;
}

// Deterministic placeholder cover images — picsum returns the same image for a
// given seed. Swap to custom artwork by replacing `imageUrl` on each product.
const img = (seed: string): string => `https://picsum.photos/seed/${seed}/640/400`;

export const PRODUCTS: Product[] = [
  // ---------- UtilityApps Originals (owned — sold direct via Korapay) --------
  // `file` is the object path inside the private `product-files` Supabase
  // Storage bucket. An owned product with no `file` shows as "Coming soon".
  {
    id: "ai-prompt-pack",
    name: "AI Prompt Pack — 60 Pro Prompts",
    description:
      "60 copy-paste prompts for ChatGPT, Claude and Gemini across writing, marketing, work, code and study.",
    longDescription:
      "A focused, no-filler prompt pack: 60 prompts you can paste straight into ChatGPT, Claude or Gemini. Organised into six practical sections — writing, marketing, business, coding, study and everyday life — each with a short note on how to adapt it to your situation. Delivered as a clean, searchable PDF you keep forever.",
    price: 4,
    originalPrice: 4,
    currency: "USD",
    category: "AI Prompt Bundles",
    tags: ["ChatGPT", "Claude", "prompts", "AI", "productivity"],
    image: "from-primary-500 to-accent-500",
    imageUrl: img("ua-ai-prompt-pack"),
    rating: 0,
    reviewCount: 0,
    salesCount: 0,
    platform: "utilityapps",
    kind: "owned",
    file: "ai-prompt-pack.pdf",
    fileFormat: "PDF",
    featured: true,
    bestseller: false,
    new: true,
    features: [
      "60 ready-to-use pro prompts",
      "Six practical sections — writing, marketing, work, code, study, life",
      "Works with ChatGPT, Claude and Gemini",
      "A short adaptation note on every prompt",
      "Instant download — clean, searchable PDF",
    ],
    reviews: [],
  },
  {
    id: "budget-spreadsheet",
    name: "Simple Monthly Budget Spreadsheet",
    description:
      "An auto-calculating budget tracker for income, expenses, savings rate and category breakdowns.",
    longDescription:
      "A clean budget spreadsheet that does the maths for you. Enter your income and expenses and it automatically calculates your totals, your savings rate, and a breakdown by category. A 12-month overview tab tracks the trend across the year. Opens in Excel, Google Sheets and Apple Numbers — no formulas to set up yourself.",
    price: 4,
    originalPrice: 4,
    currency: "USD",
    category: "Finance & Business Templates",
    tags: ["budget", "spreadsheet", "personal finance", "Excel", "Google Sheets"],
    image: "from-success-500 to-primary-500",
    imageUrl: img("ua-budget-spreadsheet"),
    rating: 0,
    reviewCount: 0,
    salesCount: 0,
    platform: "utilityapps",
    kind: "owned",
    file: "budget-spreadsheet.xlsx",
    fileFormat: "XLSX",
    featured: true,
    bestseller: false,
    new: true,
    features: [
      "Auto-calculating income and expense tracker",
      "Live savings-rate and category breakdown",
      "12-month overview tab for the whole year",
      "Opens in Excel, Google Sheets and Numbers",
      "Instant download",
    ],
    reviews: [],
  },
  {
    id: "resume-pack",
    name: "ATS-Friendly Resume Template Pack",
    description:
      "Clean, recruiter-tested resume layouts plus a matching cover letter — fully editable in Word.",
    longDescription:
      "Resume templates built the way Applicant Tracking Systems actually want them: single-column, standard fonts, and no graphics that break automated parsing. Includes several layouts for different career stages plus a matching cover letter, all fully editable in Microsoft Word or Google Docs, with a short guide on tailoring each section to the job.",
    price: 4,
    originalPrice: 4,
    currency: "USD",
    category: "Resume & Career Templates",
    tags: ["resume", "CV", "ATS", "cover letter", "job search"],
    image: "from-accent-500 to-primary-500",
    imageUrl: img("ua-resume-pack"),
    rating: 0,
    reviewCount: 0,
    salesCount: 0,
    platform: "utilityapps",
    kind: "owned",
    file: "resume-pack.docx",
    fileFormat: "DOCX",
    featured: true,
    bestseller: false,
    new: true,
    features: [
      "Multiple ATS-safe resume layouts",
      "Matching cover letter template",
      "Fully editable in Word and Google Docs",
      "Section-by-section tailoring guide",
      "Instant download",
    ],
    reviews: [],
  },
];

export const PRODUCTS_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p])
);

export const PRODUCT_CATEGORIES: string[] = Array.from(
  new Set(PRODUCTS.map((p) => p.category))
);

export function getProductById(id: string): Product | undefined {
  return PRODUCTS_BY_ID[id];
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts(limit: number = 4): Product[] {
  return PRODUCTS.filter((p) => p.featured).slice(0, limit);
}

export function getBestsellerProducts(limit: number = 3): Product[] {
  return PRODUCTS.filter((p) => p.bestseller).slice(0, limit);
}

export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const product = PRODUCTS_BY_ID[productId];
  if (!product) return [];
  const sameCategory = PRODUCTS.filter(
    (p) => p.id !== productId && p.category === product.category
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  // Pad with other products so the "related" section never looks empty.
  const fillers = PRODUCTS.filter(
    (p) => p.id !== productId && p.category !== product.category
  );
  return [...sameCategory, ...fillers].slice(0, limit);
}

/** Backwards-compat alias used by the homepage. */
export const FEATURED_PRODUCTS = getFeaturedProducts(4);

/** All products sold directly by us (owned), purchasable via Korapay checkout. */
export function getOwnedProducts(): Product[] {
  return PRODUCTS.filter(isOwnedProduct);
}
