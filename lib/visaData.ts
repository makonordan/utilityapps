/**
 * Curated tourist-visa lookup data for the Visa Requirement tool.
 *
 * Covers 8 source passports × 20 destinations for short tourist visits
 * (typically up to 30–90 days). Visa rules change frequently — every result
 * surfaces the official verification link, and the table is dated below.
 *
 * Last reviewed: 2026-05-23.
 */

export const VISA_DATA_REVIEWED = "2026-05-23";

export type VisaStatus = "home" | "vf" | "eta" | "voa" | "evisa" | "visa";

export interface VisaCell {
  status: VisaStatus;
  /** Typical maximum stay in days for a tourist visit. */
  days?: number;
  /** Free-text note specific to this cell. */
  notes?: string;
}

export const VISA_STATUS_LABELS: Record<VisaStatus, string> = {
  home: "Home country",
  vf: "Visa-free",
  eta: "ETA / online authorisation",
  voa: "Visa on arrival",
  evisa: "e-Visa (apply online)",
  visa: "Visa required",
};

export const VISA_STATUS_DESCRIPTIONS: Record<VisaStatus, string> = {
  home: "You're already there — no visa needed.",
  vf: "No visa required for short tourist visits. Just present your passport at the border.",
  eta: "Apply for an electronic travel authorisation online before you fly. Quick approval, small fee.",
  voa: "Buy your visa at the border on arrival. Have proof of onward travel and cash for the fee.",
  evisa: "Apply for an e-visa online before travel. Usually 1–7 days processing.",
  visa: "Apply at the destination's embassy or consulate well before travel. Allow several weeks.",
};

const cell = (status: VisaStatus, days?: number, notes?: string): VisaCell => ({
  status,
  days,
  notes,
});
const vf = (days?: number, notes?: string) => cell("vf", days, notes);
const eta = (days?: number, notes?: string) => cell("eta", days, notes);
const voa = (days?: number, notes?: string) => cell("voa", days, notes);
const evisa = (days?: number, notes?: string) => cell("evisa", days, notes);
const visa = (notes?: string) => cell("visa", undefined, notes);
const home = (): VisaCell => cell("home");

export interface Country {
  code: string;
  name: string;
  flag: string;
}

/** Passports the tool covers. */
export const PASSPORT_COUNTRIES: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany (EU)", flag: "🇩🇪" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
];

/** Destinations the tool covers. */
export const DESTINATION_COUNTRIES: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "IN", name: "India", flag: "🇮🇳" },
];

/**
 * Official immigration / visa websites by destination. Always shown on results
 * so the user can verify the rules before booking.
 */
export const OFFICIAL_LINKS: Record<string, string> = {
  US: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit.html",
  GB: "https://www.gov.uk/check-uk-visa",
  FR: "https://france-visas.gouv.fr/",
  DE: "https://www.auswaertiges-amt.de/en/einreiseundaufenthalt/visabestimmungen-node",
  IT: "https://vistoperitalia.esteri.it/home/en",
  ES: "https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Visados.aspx",
  NL: "https://www.netherlandsworldwide.nl/visa-the-netherlands",
  CH: "https://www.sem.admin.ch/sem/en/home/themen/einreise.html",
  AE: "https://u.ae/en/information-and-services/visa-and-emirates-id",
  TR: "https://www.evisa.gov.tr/en/",
  TH: "https://www.thaiembassy.com/thailand-visa/tourist-visa",
  JP: "https://www.mofa.go.jp/j_info/visit/visa/",
  SG: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements",
  AU: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/visit",
  CA: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
  MX: "https://www.gob.mx/inm/en",
  BR: "https://www.gov.br/mre/en/consular-portal/visas",
  ZA: "https://www.dha.gov.za/index.php/immigration-services/types-of-temporary-residence-visas",
  KE: "https://www.etakenya.go.ke/",
  IN: "https://indianvisaonline.gov.in/evisa/tvoa.html",
};

/**
 * Visa requirement matrix [passport][destination] for tourist visits.
 *
 * Verify with the official link on the result page before travel.
 */
export const VISA_MATRIX: Record<string, Record<string, VisaCell>> = {
  // ---------- US passport ----------
  US: {
    US: home(),
    GB: vf(180),
    FR: vf(90, "90 days in any 180-day window across the Schengen area."),
    DE: vf(90, "90 days in any 180-day window across the Schengen area."),
    IT: vf(90, "90 days in any 180-day window across the Schengen area."),
    ES: vf(90, "90 days in any 180-day window across the Schengen area."),
    NL: vf(90, "90 days in any 180-day window across the Schengen area."),
    CH: vf(90, "90 days in any 180-day window across the Schengen area."),
    AE: vf(30, "Free 30-day stamp on arrival. Extendable once."),
    TR: vf(90, "90 days in any 180-day window."),
    TH: vf(60, "Up to 60 days visa-exempt for US passport holders."),
    JP: vf(90),
    SG: vf(90),
    AU: eta(90, "Apply for the ETA via the Australian ETA app before flying."),
    CA: eta(180, "Need an eTA when flying into Canada — apply online, US$7."),
    MX: vf(180),
    BR: vf(90),
    ZA: vf(90),
    KE: eta(90, "Apply for the Electronic Travel Authorisation (ETA) before departure."),
    IN: evisa(90, "Apply for the e-Tourist Visa online — 30, 60, 90, 1-yr and 5-yr options."),
  },

  // ---------- UK passport ----------
  GB: {
    US: eta(90, "Apply for ESTA online before flying. Valid two years."),
    GB: home(),
    FR: vf(90, "Post-Brexit: 90 days in any 180-day window across Schengen."),
    DE: vf(90, "Post-Brexit: 90 days in any 180-day window across Schengen."),
    IT: vf(90, "Post-Brexit: 90 days in any 180-day window across Schengen."),
    ES: vf(90, "Post-Brexit: 90 days in any 180-day window across Schengen."),
    NL: vf(90, "Post-Brexit: 90 days in any 180-day window across Schengen."),
    CH: vf(90, "Post-Brexit: 90 days in any 180-day window across Schengen."),
    AE: vf(30),
    TR: vf(90),
    TH: vf(60, "Up to 60 days visa-exempt for UK passport holders."),
    JP: vf(90),
    SG: vf(90),
    AU: eta(90, "Apply for the ETA via the Australian ETA app."),
    CA: eta(180),
    MX: vf(180),
    BR: vf(90),
    ZA: vf(90),
    KE: eta(90),
    IN: evisa(90),
  },

  // ---------- German / EU passport ----------
  DE: {
    US: eta(90, "Apply for ESTA online before flying."),
    GB: vf(180),
    FR: vf(undefined, "Freedom of movement within the EU/Schengen area."),
    DE: home(),
    IT: vf(undefined, "Freedom of movement within the EU/Schengen area."),
    ES: vf(undefined, "Freedom of movement within the EU/Schengen area."),
    NL: vf(undefined, "Freedom of movement within the EU/Schengen area."),
    CH: vf(undefined, "Switzerland is in Schengen — same rules as EU."),
    AE: vf(90),
    TR: vf(90),
    TH: vf(60),
    JP: vf(90),
    SG: vf(90),
    AU: eta(90, "Use the eVisitor (subclass 651) — free for EU passport holders."),
    CA: eta(180),
    MX: vf(180),
    BR: vf(90),
    ZA: vf(90),
    KE: eta(90),
    IN: evisa(90),
  },

  // ---------- Canadian passport ----------
  CA: {
    US: vf(180, "No visa for short tourist visits, but expect a brief CBP interview."),
    GB: vf(180),
    FR: vf(90, "Schengen 90/180 rule."),
    DE: vf(90, "Schengen 90/180 rule."),
    IT: vf(90, "Schengen 90/180 rule."),
    ES: vf(90, "Schengen 90/180 rule."),
    NL: vf(90, "Schengen 90/180 rule."),
    CH: vf(90, "Schengen 90/180 rule."),
    AE: vf(30),
    TR: vf(90),
    TH: vf(60),
    JP: vf(90),
    SG: vf(90),
    AU: eta(90),
    CA: home(),
    MX: vf(180),
    BR: vf(90),
    ZA: vf(90),
    KE: eta(90),
    IN: evisa(90),
  },

  // ---------- Australian passport ----------
  AU: {
    US: eta(90, "Apply for ESTA online."),
    GB: vf(180),
    FR: vf(90, "Schengen 90/180 rule."),
    DE: vf(90, "Schengen 90/180 rule."),
    IT: vf(90, "Schengen 90/180 rule."),
    ES: vf(90, "Schengen 90/180 rule."),
    NL: vf(90, "Schengen 90/180 rule."),
    CH: vf(90, "Schengen 90/180 rule."),
    AE: vf(30),
    TR: vf(90),
    TH: vf(60),
    JP: vf(90),
    SG: vf(90),
    AU: home(),
    CA: eta(180),
    MX: vf(180),
    BR: vf(90),
    ZA: vf(90),
    KE: eta(90),
    IN: evisa(90),
  },

  // ---------- Japanese passport ----------
  JP: {
    US: eta(90, "Apply for ESTA online."),
    GB: vf(180),
    FR: vf(90, "Schengen 90/180 rule."),
    DE: vf(90, "Schengen 90/180 rule."),
    IT: vf(90, "Schengen 90/180 rule."),
    ES: vf(90, "Schengen 90/180 rule."),
    NL: vf(90, "Schengen 90/180 rule."),
    CH: vf(90, "Schengen 90/180 rule."),
    AE: vf(30),
    TR: vf(90),
    TH: vf(30),
    JP: home(),
    SG: vf(30),
    AU: eta(90),
    CA: eta(180),
    MX: vf(180),
    BR: vf(90),
    ZA: vf(90),
    KE: eta(90),
    IN: evisa(90),
  },

  // ---------- Indian passport ----------
  IN: {
    US: visa("Apply for a B1/B2 tourist visa at a US embassy. Long wait times."),
    GB: visa("Apply for a Standard Visitor visa online."),
    FR: visa("Schengen tourist visa — apply at the destination's consulate."),
    DE: visa("Schengen tourist visa."),
    IT: visa("Schengen tourist visa."),
    ES: visa("Schengen tourist visa."),
    NL: visa("Schengen tourist visa."),
    CH: visa("Schengen tourist visa."),
    AE: evisa(60, "Apply online via the official UAE portal or your airline."),
    TR: evisa(30, "Apply via evisa.gov.tr."),
    TH: vf(30, "Visa-exempt since 2024 for Indian passport holders, 30 days."),
    JP: visa("Apply at the Japanese embassy in India."),
    SG: vf(30, "Singapore allows visa-free transit/short stay for Indian passport holders under some categories — verify."),
    AU: visa("Apply for a Visitor visa (subclass 600)."),
    CA: visa("Apply for a TRV — Temporary Resident Visa."),
    MX: vf(180, "Visa-free if you hold a valid US, Canadian, UK or Schengen visa."),
    BR: visa("Apply for an eVisa or paper visa via the Brazilian consulate."),
    ZA: visa("Apply at the South African mission. eVisa now available for some."),
    KE: vf(90, "Kenya is visa-free for many countries including India as of 2024."),
    IN: home(),
  },

  // ---------- Nigerian passport ----------
  NG: {
    US: visa("Apply for a B1/B2 tourist visa. Long wait times."),
    GB: visa("Apply for a Standard Visitor visa online."),
    FR: visa("Schengen tourist visa — apply at the consulate in Nigeria."),
    DE: visa("Schengen tourist visa."),
    IT: visa("Schengen tourist visa."),
    ES: visa("Schengen tourist visa."),
    NL: visa("Schengen tourist visa."),
    CH: visa("Schengen tourist visa."),
    AE: evisa(30, "Apply online via the official UAE portal or your airline."),
    TR: evisa(30, "Apply via evisa.gov.tr."),
    TH: visa("Tourist visa required — apply at the Thai embassy."),
    JP: visa("Apply at the Japanese embassy."),
    SG: visa("Apply at the Singapore mission or via an authorised agent."),
    AU: visa("Apply for a Visitor visa (subclass 600)."),
    CA: visa("Apply for a TRV — Temporary Resident Visa."),
    MX: visa("Visa required, unless you hold a valid US, Canadian, UK or Schengen visa."),
    BR: visa("Apply at the Brazilian consulate."),
    ZA: visa("Apply at the South African High Commission."),
    KE: vf(90, "Kenya is visa-free for many countries including Nigeria as of 2024."),
    IN: visa("Tourist visa via Indian mission; e-visa available for some categories."),
  },
};

export function lookupVisa(passportCode: string, destinationCode: string): VisaCell | null {
  return VISA_MATRIX[passportCode]?.[destinationCode] ?? null;
}
