import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatDate(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" },
  locale: string = "en-US"
): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function truncate(text: string, length: number, suffix: string = "..."): string {
  if (text.length <= length) return text;
  return text.slice(0, Math.max(0, length - suffix.length)).trimEnd() + suffix;
}

export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const SITE_CONFIG = {
  name: "UtilityApps",
  description: "Hundreds of Free AI Utility Tools for Everyday Work",
  url: "https://utilityapps.site",
  ogImage: "https://utilityapps.site/og.png",
  twitterHandle: "@UtilityAppsSite",
  author: "UtilityApps Team",
  locale: "en_US",
  keywords: [
    "AI tools",
    "free AI tools",
    "online utilities",
    "utility apps",
    "productivity tools",
    "calculator",
    "loan calculator",
    "mortgage calculator",
    "BMI calculator",
    "percentage calculator",
    "age calculator",
    "word counter",
    "image tools",
    "image compressor",
    "image converter",
    "PDF converter",
    "PDF tools",
    "text tools",
    "developer tools",
    "SEO tools",
    "finance tools",
    "health tools",
    "online generator",
    "QR code generator",
    "password generator",
    "JSON formatter",
    "base64 encoder",
    "URL encoder",
    "color picker",
    "unit converter",
    "currency converter",
    "free online tools",
    "browser tools",
    "no signup tools",
    "AI utility platform",
    "everyday work tools",
    "AI productivity",
    "smart calculator",
    "tax calculator",
    "salary calculator",
    "tip calculator",
    "GPA calculator",
    "calorie calculator",
    "macros calculator",
  ],
} as const;

export type SiteConfig = typeof SITE_CONFIG;
