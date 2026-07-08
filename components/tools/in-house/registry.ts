import type { ComponentType } from "react";
import dynamic from "next/dynamic";

/**
 * Lazy-loaded registry of in-house tool components, keyed by Tool.id.
 *
 * Adding a tool: drop a default-exported component file into this folder,
 * add an entry below, and ensure lib/tools.ts has a matching `id`. The
 * dynamic [slug] route (app/tools/[slug]/page.tsx) reads this map and
 * renders the component when present, falling back to the external stub.
 *
 * Each entry uses next/dynamic so a tool's bundle isn't shipped on routes
 * that don't use it. ssr is left enabled so the surrounding page stays
 * server-rendered for SEO; the components themselves are "use client".
 */
export const IN_HOUSE_TOOLS: Record<string, ComponentType> = {
  // Text Tools
  "word-counter": dynamic(() => import("./WordCounter").then((m) => m.WordCounter)),
  "character-counter": dynamic(() => import("./CharacterCounter").then((m) => m.CharacterCounter)),
  "case-converter": dynamic(() => import("./CaseConverter").then((m) => m.CaseConverter)),
  "text-diff-checker": dynamic(() => import("./TextDiffChecker").then((m) => m.TextDiffChecker)),

  // Calculator Tools
  "percentage-calculator": dynamic(() => import("./PercentageCalculator").then((m) => m.PercentageCalculator)),
  "age-calculator": dynamic(() => import("./AgeCalculator").then((m) => m.AgeCalculator)),
  "tip-calculator": dynamic(() => import("./TipCalculator").then((m) => m.TipCalculator)),
  "gpa-calculator": dynamic(() => import("./GpaCalculator").then((m) => m.GpaCalculator)),

  // Health Tools
  "bmi-calculator": dynamic(() => import("./BmiCalculator").then((m) => m.BmiCalculator)),
  "calorie-calculator": dynamic(() => import("./CalorieCalculator").then((m) => m.CalorieCalculator)),

  // Developer Tools
  "password-generator": dynamic(() => import("./PasswordGenerator").then((m) => m.PasswordGenerator)),
  "json-formatter": dynamic(() => import("./JsonFormatter").then((m) => m.JsonFormatter)),
  "base64-encoder": dynamic(() => import("./Base64Encoder").then((m) => m.Base64Encoder)),
  "url-encoder": dynamic(() => import("./UrlEncoder").then((m) => m.UrlEncoder)),

  // SEO Tools
  "slug-generator": dynamic(() => import("./SlugGenerator").then((m) => m.SlugGenerator)),
  "meta-tag-generator": dynamic(() => import("./MetaTagGenerator").then((m) => m.MetaTagGenerator)),

  // Finance Tools
  "loan-calculator": dynamic(() => import("./LoanCalculator").then((m) => m.LoanCalculator)),
  "mortgage-calculator": dynamic(() => import("./MortgageCalculator").then((m) => m.MortgageCalculator)),
  "salary-calculator": dynamic(() => import("./SalaryCalculator").then((m) => m.SalaryCalculator)),
  "tax-calculator": dynamic(() => import("./TaxCalculator").then((m) => m.TaxCalculator)),
  "currency-converter": dynamic(() => import("./CurrencyConverter").then((m) => m.CurrencyConverter)),

  // Productivity Tools
  "qr-code-generator": dynamic(() => import("./QrCodeGenerator").then((m) => m.QrCodeGenerator)),
  "pdf-converter": dynamic(() => import("./PdfConverter").then((m) => m.PdfConverter)),
};

export function hasInHouseTool(slug: string): boolean {
  return slug in IN_HOUSE_TOOLS;
}
