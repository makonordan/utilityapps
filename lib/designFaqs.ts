import { type FAQItem } from "@/components/tools/ToolFAQ";
import { SITE_CONFIG } from "@/lib/utils";

export type DesignToolId =
  | "gradient-generator"
  | "contrast-checker"
  | "css-shadow-builder"
  | "font-pairing";

export interface HowToStep {
  name: string;
  text: string;
}

export const DESIGN_FAQS: Record<DesignToolId, FAQItem[]> = {
  "gradient-generator": [
    { q: "Is the gradient generator free?", a: "Yes — free with no signup, no quota, no watermark." },
    { q: "What gradient types are supported?", a: "Linear, radial, and conic gradients. Each supports unlimited colour stops with adjustable positions." },
    { q: "Does it output ready-to-use CSS?", a: "Yes — the generated CSS updates live as you edit and is one click to copy. Paste it straight into a background or background-image property." },
    { q: "Can I control the angle?", a: "Yes for linear gradients (0–360°) and conic gradients (starting angle). Radial gradients expose shape and position instead." },
    { q: "Will my work be saved?", a: "Everything runs in your browser — nothing is uploaded. The generator doesn't persist between visits, so copy the CSS when you're happy with it." },
  ],
  "contrast-checker": [
    { q: "Is the contrast checker free?", a: "Yes — free, no signup." },
    { q: "What standard does it check against?", a: "WCAG 2.1. It reports the contrast ratio and whether the pair passes AA and AAA for both normal and large text." },
    { q: "What ratios do I need to pass?", a: "AA needs 4.5:1 for normal text and 3:1 for large text (18.66px bold or 24px regular and up). AAA needs 7:1 normal and 4.5:1 large." },
    { q: "Does it handle transparency?", a: "The checker works with solid colours. For semi-transparent text, composite it over the background first — alpha changes the effective contrast." },
    { q: "Why does contrast matter?", a: "Low-contrast text is hard to read for users with low vision, colour-blindness, or on bright screens outdoors. WCAG contrast is also a legal accessibility requirement in many jurisdictions." },
  ],
  "css-shadow-builder": [
    { q: "Is the shadow builder free?", a: "Yes — free, no signup." },
    { q: "Can I stack multiple shadows?", a: "Yes. CSS box-shadow accepts a comma-separated list — add as many layers as you like for realistic, layered depth." },
    { q: "Does it support inset shadows?", a: "Yes — toggle inset on any layer to create an inner shadow (useful for pressed buttons and inset panels)." },
    { q: "What does spread do?", a: "Spread grows (positive) or shrinks (negative) the shadow before the blur is applied. A small negative spread with a large blur produces a soft, natural drop shadow." },
    { q: "Is the output ready to paste?", a: "Yes — the box-shadow CSS updates live and copies in one click." },
  ],
  "font-pairing": [
    { q: "Is the font pairing tool free?", a: "Yes — free, no signup." },
    { q: "Where do the fonts come from?", a: "Every pairing uses Google Fonts, which are free for commercial use. The preview loads the actual fonts so you see exactly how they look." },
    { q: "Does it give me the import code?", a: "Yes — each pairing shows the Google Fonts <link> tag and the CSS font-family declarations, ready to paste into your project." },
    { q: "How were the pairings chosen?", a: "Each pairing balances a distinctive heading font with a highly readable body font, following classic typographic principles — contrast in weight or style, but harmony in proportion and era." },
    { q: "Can I use these commercially?", a: "Yes. All Google Fonts are licensed under open licences (mostly SIL Open Font License) that permit commercial use, including in products and client work." },
  ],
};

export const DESIGN_HOWTOS: Record<DesignToolId, HowToStep[]> = {
  "gradient-generator": [
    { name: "Pick a type", text: "Choose linear, radial, or conic." },
    { name: "Edit colour stops", text: "Add, remove, recolour, and reposition stops. Set the angle for linear/conic." },
    { name: "Copy the CSS", text: "The preview and CSS update live — click Copy and paste into your stylesheet." },
  ],
  "contrast-checker": [
    { name: "Set the colours", text: "Pick a text colour and a background colour." },
    { name: "Read the ratio", text: "The contrast ratio and AA/AAA pass-fail badges update instantly." },
    { name: "Adjust", text: "Tweak either colour until you hit the level you need." },
  ],
  "css-shadow-builder": [
    { name: "Add shadow layers", text: "Start with one layer; add more for depth." },
    { name: "Tune each layer", text: "Adjust X/Y offset, blur, spread, colour, and inset." },
    { name: "Copy the CSS", text: "The box-shadow string updates live — copy and paste." },
  ],
  "font-pairing": [
    { name: "Browse pairings", text: "Scroll the curated heading + body combinations." },
    { name: "Preview live", text: "Each card loads the real Google Fonts so you see the actual rendering." },
    { name: "Copy the code", text: "Grab the <link> tag and font-family CSS for the pairing you like." },
  ],
};

export const DESIGN_FEATURE_LISTS: Record<DesignToolId, string> = {
  "gradient-generator": "Linear/radial/conic gradients, unlimited colour stops, angle control, live preview, copy-ready CSS",
  "contrast-checker": "WCAG 2.1 contrast ratio, AA/AAA pass-fail for normal and large text, live preview",
  "css-shadow-builder": "Multi-layer box-shadow, inset support, X/Y/blur/spread control, live preview, copy-ready CSS",
  "font-pairing": "Curated Google Font pairings, live font preview, copy-ready link tag and font-family CSS",
};

export const DESIGN_TOOL_PUBLISHED = "2026-05-15";

export function getDesignFaqs(toolId: string): FAQItem[] {
  return DESIGN_FAQS[toolId as DesignToolId] ?? [];
}
export function getDesignHowTo(toolId: string): HowToStep[] {
  return DESIGN_HOWTOS[toolId as DesignToolId] ?? [];
}
export function getDesignFeatureList(toolId: string): string {
  return DESIGN_FEATURE_LISTS[toolId as DesignToolId] ?? "";
}
export function designToolOgUrl(title: string, description: string): string {
  const params = new URLSearchParams({ title, description, type: "design-tool" });
  return `${SITE_CONFIG.url}/api/og?${params.toString()}`;
}
