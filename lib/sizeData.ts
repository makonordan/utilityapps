/**
 * International clothing and shoe size conversion tables.
 *
 * Sizing varies meaningfully between brands and even between cuts within a
 * brand. The tables below are typical conversions used by retailers — always
 * cross-check the brand's own chart for a specific item.
 */

export type Region = "US" | "UK" | "EU" | "JP";
export type SizeCategory = "clothing-women" | "clothing-men" | "clothing-kids" | "shoes-women" | "shoes-men" | "shoes-kids";

export interface SizeRow {
  US: string;
  UK: string;
  EU: string;
  JP: string;
}

export const SIZE_REGIONS: Region[] = ["US", "UK", "EU", "JP"];

export const SIZE_CATEGORY_LABELS: Record<SizeCategory, string> = {
  "clothing-women": "Women's clothing",
  "clothing-men": "Men's clothing",
  "clothing-kids": "Kids' clothing",
  "shoes-women": "Women's shoes",
  "shoes-men": "Men's shoes",
  "shoes-kids": "Kids' shoes",
};

export const SIZE_CATEGORY_NOTES: Record<SizeCategory, string> = {
  "clothing-women": "Sizes refer to body-measurement equivalents. Cuts vary by brand — check the brand's chart for fitted items.",
  "clothing-men": "Sizes assume the most common chest-based labeling. Suit and shirt sizing uses different scales.",
  "clothing-kids": "Most regions label by age or height (cm). EU and JP use height in cm; US and UK use age. Pick by your child's height for best fit.",
  "shoes-women": "Shoe sizes vary widely between brands — these are typical conversions. Measure foot length in cm for the most accurate cross-region pick.",
  "shoes-men": "Shoe sizes vary between brands. Measure foot length in cm for the most accurate cross-region pick.",
  "shoes-kids": "Children's shoes are best chosen by foot length in cm rather than size number — feet grow fast.",
};

export const SIZE_TABLES: Record<SizeCategory, SizeRow[]> = {
  "clothing-women": [
    { US: "0", UK: "4", EU: "32", JP: "5" },
    { US: "2", UK: "6", EU: "34", JP: "7" },
    { US: "4", UK: "8", EU: "36", JP: "9" },
    { US: "6", UK: "10", EU: "38", JP: "11" },
    { US: "8", UK: "12", EU: "40", JP: "13" },
    { US: "10", UK: "14", EU: "42", JP: "15" },
    { US: "12", UK: "16", EU: "44", JP: "17" },
    { US: "14", UK: "18", EU: "46", JP: "19" },
    { US: "16", UK: "20", EU: "48", JP: "21" },
    { US: "18", UK: "22", EU: "50", JP: "23" },
  ],
  "clothing-men": [
    { US: "XS (32–34)", UK: "XS (32–34)", EU: "42–44", JP: "S" },
    { US: "S (36)", UK: "S (36)", EU: "46", JP: "M" },
    { US: "M (38–40)", UK: "M (38–40)", EU: "48–50", JP: "L" },
    { US: "L (42)", UK: "L (42)", EU: "52", JP: "LL / XL" },
    { US: "XL (44)", UK: "XL (44)", EU: "54", JP: "3L" },
    { US: "XXL (46)", UK: "XXL (46)", EU: "56", JP: "4L" },
    { US: "XXXL (48)", UK: "XXXL (48)", EU: "58", JP: "5L" },
  ],
  "clothing-kids": [
    { US: "2T", UK: "2 yr", EU: "92", JP: "90" },
    { US: "3T", UK: "3 yr", EU: "98", JP: "100" },
    { US: "4T", UK: "4 yr", EU: "104", JP: "100–110" },
    { US: "5", UK: "5 yr", EU: "110", JP: "110" },
    { US: "6", UK: "6 yr", EU: "116", JP: "120" },
    { US: "7", UK: "7 yr", EU: "122", JP: "120–130" },
    { US: "8", UK: "8 yr", EU: "128", JP: "130" },
    { US: "10", UK: "10 yr", EU: "140", JP: "140" },
    { US: "12", UK: "12 yr", EU: "152", JP: "150" },
    { US: "14", UK: "14 yr", EU: "164", JP: "160" },
  ],
  "shoes-women": [
    { US: "5", UK: "2.5", EU: "35", JP: "21.5" },
    { US: "5.5", UK: "3", EU: "35.5", JP: "22" },
    { US: "6", UK: "3.5", EU: "36", JP: "22.5" },
    { US: "6.5", UK: "4", EU: "37", JP: "23" },
    { US: "7", UK: "4.5", EU: "37.5", JP: "23.5" },
    { US: "7.5", UK: "5", EU: "38", JP: "24" },
    { US: "8", UK: "5.5", EU: "38.5", JP: "24.5" },
    { US: "8.5", UK: "6", EU: "39", JP: "25" },
    { US: "9", UK: "6.5", EU: "40", JP: "25.5" },
    { US: "9.5", UK: "7", EU: "40.5", JP: "26" },
    { US: "10", UK: "7.5", EU: "41", JP: "26.5" },
    { US: "10.5", UK: "8", EU: "42", JP: "27" },
    { US: "11", UK: "8.5", EU: "42.5", JP: "27.5" },
  ],
  "shoes-men": [
    { US: "6", UK: "5.5", EU: "39", JP: "24.5" },
    { US: "6.5", UK: "6", EU: "39.5", JP: "25" },
    { US: "7", UK: "6.5", EU: "40", JP: "25.5" },
    { US: "7.5", UK: "7", EU: "40.5", JP: "26" },
    { US: "8", UK: "7.5", EU: "41", JP: "26.5" },
    { US: "8.5", UK: "8", EU: "42", JP: "27" },
    { US: "9", UK: "8.5", EU: "42.5", JP: "27.5" },
    { US: "9.5", UK: "9", EU: "43", JP: "28" },
    { US: "10", UK: "9.5", EU: "44", JP: "28.5" },
    { US: "10.5", UK: "10", EU: "44.5", JP: "29" },
    { US: "11", UK: "10.5", EU: "45", JP: "29.5" },
    { US: "11.5", UK: "11", EU: "45.5", JP: "30" },
    { US: "12", UK: "11.5", EU: "46", JP: "30.5" },
    { US: "13", UK: "12.5", EU: "47", JP: "31.5" },
  ],
  "shoes-kids": [
    { US: "4 (toddler)", UK: "3.5", EU: "19", JP: "11.5" },
    { US: "5 (toddler)", UK: "4", EU: "20", JP: "12.5" },
    { US: "6 (toddler)", UK: "5", EU: "22", JP: "13.5" },
    { US: "7", UK: "6", EU: "23", JP: "14" },
    { US: "8", UK: "7", EU: "25", JP: "15" },
    { US: "9", UK: "8", EU: "26", JP: "16" },
    { US: "10", UK: "9", EU: "27", JP: "16.5" },
    { US: "11", UK: "10", EU: "28", JP: "17.5" },
    { US: "12", UK: "11", EU: "30", JP: "18.5" },
    { US: "13", UK: "12", EU: "31", JP: "19" },
    { US: "1 (youth)", UK: "13", EU: "32", JP: "20" },
    { US: "2 (youth)", UK: "1", EU: "33", JP: "21" },
    { US: "3 (youth)", UK: "2", EU: "34", JP: "22" },
    { US: "4 (youth)", UK: "3", EU: "36", JP: "23" },
  ],
};

/**
 * Find the row that matches a given size in a region.
 * Lenient match: exact, case-insensitive, or contains.
 */
export function findSizeRow(category: SizeCategory, region: Region, value: string): SizeRow | null {
  const needle = value.trim().toLowerCase();
  if (!needle) return null;
  const rows = SIZE_TABLES[category];
  // Exact match preferred.
  const exact = rows.find((r) => r[region].toLowerCase() === needle);
  if (exact) return exact;
  // Then "contains" — handles "8" matching "8 yr" or "M" matching "M (38-40)".
  return rows.find((r) => r[region].toLowerCase().includes(needle)) ?? null;
}
