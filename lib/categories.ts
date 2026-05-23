import { TOOLS } from "./tools";

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  toolCount: number;
  featured: boolean;
}

const CATEGORY_DEFINITIONS: Omit<Category, "toolCount">[] = [
  {
    id: "text-tools",
    name: "Text Tools",
    description:
      "Count, format, transform, and compare text for writing, editing, and publishing workflows.",
    icon: "Type",
    color: "#0066FF",
    featured: true,
  },
  {
    id: "image-tools",
    name: "Image Tools",
    description:
      "Compress, convert, and optimize images privately in your browser with no uploads required.",
    icon: "Image",
    color: "#7C3AED",
    featured: true,
  },
  {
    id: "calculator-tools",
    name: "Calculator Tools",
    description:
      "Everyday calculators for math, dates, percentages, tips, GPAs, and quick conversions.",
    icon: "Calculator",
    color: "#10B981",
    featured: true,
  },
  {
    id: "finance-tools",
    name: "Finance Tools",
    description:
      "Loan, mortgage, tax, salary, and currency calculators tailored for US, UK, CA, and EU users.",
    icon: "Banknote",
    color: "#F59E0B",
    featured: true,
  },
  {
    id: "health-tools",
    name: "Health Tools",
    description:
      "Track BMI, calories, macros, and hydration with science-backed formulas and unit support.",
    icon: "HeartPulse",
    color: "#EF4444",
    featured: true,
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    description:
      "Format, encode, and validate JSON, Base64, URLs, and passwords without leaving the browser.",
    icon: "Code2",
    color: "#0EA5E9",
    featured: false,
  },
  {
    id: "seo-tools",
    name: "SEO Tools",
    description:
      "Generate meta tags, Open Graph cards, schema markup, and clean URL slugs with live previews.",
    icon: "Search",
    color: "#22C55E",
    featured: false,
  },
  {
    id: "productivity-tools",
    name: "Productivity Tools",
    description:
      "PDF, QR code, and document utilities that streamline everyday office and freelance work.",
    icon: "Sparkles",
    color: "#A855F7",
    featured: true,
  },
  {
    id: "video-tools",
    name: "Video Tools",
    description:
      "Compress, trim, convert, mute, and resize MP4, MOV, WebM and more — all in your browser via ffmpeg.wasm. No upload, no signup.",
    icon: "Film",
    color: "#EC4899",
    featured: true,
  },
  {
    id: "audio-tools",
    name: "Audio Tools",
    description:
      "Cut, convert, record, and analyse MP3, WAV, OGG, FLAC and more — entirely in your browser. No upload, no signup.",
    icon: "Music",
    color: "#14B8A6",
    featured: true,
  },
  {
    id: "design-tools",
    name: "Design Tools",
    description:
      "Gradient generator, contrast checker, CSS shadow builder, and font pairing — copy-paste-ready CSS for designers and developers.",
    icon: "Palette",
    color: "#F43F5E",
    featured: true,
  },
  {
    id: "student-tools",
    name: "Student Tools",
    description:
      "Citation generator, paraphrasing tool, study timer, and flashcard maker — built for students, homework, and exam prep.",
    icon: "GraduationCap",
    color: "#6366F1",
    featured: true,
  },
  {
    id: "sleep-tools",
    name: "Sleep Tools",
    description:
      "Sleep cycle and nap calculators, brown-noise generator, ambient sound mixer, and caffeine cutoff timing — all browser-based, no signup.",
    icon: "Moon",
    color: "#4F46E5",
    featured: true,
  },
];

export const CATEGORIES: Category[] = CATEGORY_DEFINITIONS.map((category) => ({
  ...category,
  toolCount: TOOLS.filter((tool) => tool.category === category.name).length,
}));

export const CATEGORIES_BY_ID: Record<string, Category> = CATEGORIES.reduce(
  (acc, category) => {
    acc[category.id] = category;
    return acc;
  },
  {} as Record<string, Category>
);

export function getCategoryByName(name: string): Category | undefined {
  return CATEGORIES.find((category) => category.name === name);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES_BY_ID[slug];
}

export function getFeaturedCategories(): Category[] {
  return CATEGORIES.filter((category) => category.featured);
}
