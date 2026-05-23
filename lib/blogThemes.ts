/**
 * Category-themed visuals for blog post hero images.
 *
 * Each blog post card renders a CSS gradient (no external image — keeps the
 * page fast) with a large, faint category icon. getCategoryTheme() returns the
 * gradient, the lucide icon component, and an accent colour for a category.
 */

import {
  Briefcase,
  Calculator,
  Code2,
  FileText,
  GraduationCap,
  Heart,
  Image as ImageIcon,
  Moon,
  Music,
  Palette,
  Plane,
  Search,
  TrendingUp,
  Video,
  type LucideIcon,
} from "lucide-react";

export interface CategoryTheme {
  /** CSS linear-gradient string for an inline `backgroundImage` style. */
  gradient: string;
  /** Lucide icon component for the category. */
  Icon: LucideIcon;
  /** Solid accent colour (the gradient's mid stop). */
  accentColor: string;
}

const THEMES: Record<string, CategoryTheme> = {
  "Image Tools": {
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)",
    Icon: ImageIcon,
    accentColor: "#8b5cf6",
  },
  "Finance Tools": {
    gradient: "linear-gradient(135deg, #1e3a8a, #3b82f6, #06b6d4)",
    Icon: TrendingUp,
    accentColor: "#3b82f6",
  },
  "Health Tools": {
    gradient: "linear-gradient(135deg, #dc2626, #f97316, #facc15)",
    Icon: Heart,
    accentColor: "#f97316",
  },
  "Calculator Tools": {
    gradient: "linear-gradient(135deg, #059669, #10b981, #34d399)",
    Icon: Calculator,
    accentColor: "#10b981",
  },
  "Text Tools": {
    gradient: "linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa)",
    Icon: FileText,
    accentColor: "#3b82f6",
  },
  "Video Tools": {
    gradient: "linear-gradient(135deg, #7c2d12, #ea580c, #fb923c)",
    Icon: Video,
    accentColor: "#ea580c",
  },
  "Audio Tools": {
    gradient: "linear-gradient(135deg, #581c87, #9333ea, #c084fc)",
    Icon: Music,
    accentColor: "#9333ea",
  },
  "Developer Tools": {
    gradient: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
    Icon: Code2,
    accentColor: "#334155",
  },
  "SEO Tools": {
    gradient: "linear-gradient(135deg, #064e3b, #10b981, #6ee7b7)",
    Icon: Search,
    accentColor: "#10b981",
  },
  "Productivity Tools": {
    gradient: "linear-gradient(135deg, #831843, #be185d, #f472b6)",
    Icon: Briefcase,
    accentColor: "#be185d",
  },
  "Student Tools": {
    gradient: "linear-gradient(135deg, #1e3a8a, #6366f1, #a855f7)",
    Icon: GraduationCap,
    accentColor: "#6366f1",
  },
  "Design Tools": {
    gradient: "linear-gradient(135deg, #4c1d95, #7c3aed, #c4b5fd)",
    Icon: Palette,
    accentColor: "#7c3aed",
  },
  "Sleep Tools": {
    gradient: "linear-gradient(135deg, #312e81, #4f46e5, #a5b4fc)",
    Icon: Moon,
    accentColor: "#4f46e5",
  },
  "Travel Tools": {
    gradient: "linear-gradient(135deg, #0c4a6e, #0ea5e9, #7dd3fc)",
    Icon: Plane,
    accentColor: "#0ea5e9",
  },
};

const FALLBACK: CategoryTheme = {
  gradient: "linear-gradient(135deg, #0066ff, #7c3aed)",
  Icon: FileText,
  accentColor: "#7c3aed",
};

/** Returns the visual theme for a blog category, with a safe fallback. */
export function getCategoryTheme(category: string): CategoryTheme {
  return THEMES[category] ?? FALLBACK;
}
