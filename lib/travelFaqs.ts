/**
 * Per-tool metadata for the in-house Travel Tools. Mirrors lib/sleepFaqs and
 * lib/productivityFaqs so the rendered FAQ matches the JSON-LD schema exactly.
 */

import { type FAQItem } from "@/components/tools/ToolFAQ";
import { SITE_CONFIG } from "@/lib/utils";

export type TravelToolId =
  | "packing-luggage-assistant"
  | "flight-airport-hub"
  | "size-converter"
  | "visa-lookup"
  | "time-flight-calculator"
  | "distance-coordinates";

export interface HowToStep {
  name: string;
  text: string;
}

export const TRAVEL_FAQS: Record<TravelToolId, FAQItem[]> = {
  "packing-luggage-assistant": [
    {
      q: "What does the packing list generator include?",
      a: "Pick the trip type (beach, city, business, hiking, ski), the climate, and how many days you'll be away. The tool returns a checklist of clothing, toiletries, electronics and documents tailored to those choices. Your check-offs are saved in your browser.",
    },
    {
      q: "What is the 100ml liquids rule?",
      a: "Most airports cap each container of liquid, gel or aerosol in your carry-on at 100ml (3.4 oz). All containers must fit inside a single transparent resealable bag of roughly 1 litre capacity, one bag per traveller. The liquids checker totals your bottles and flags anything over 100ml.",
    },
    {
      q: "How accurate is the luggage size checker?",
      a: "It uses each airline's published carry-on and checked dimensions and weight limits. Airlines change these occasionally — the tool shows the values it has on file with the last-updated date, but always confirm on your airline's website before flying.",
    },
    {
      q: "Are my packing lists synced across devices?",
      a: "No — checked-off items are stored locally in your browser. That keeps the tool free with no signup. To share a list, screenshot it or print the page.",
    },
    {
      q: "Can I add my own packing items?",
      a: "Yes. Each generated category has an 'Add item' input at the bottom so you can append anything specific to your trip.",
    },
  ],

  "flight-airport-hub": [
    {
      q: "Which airports does the code lookup cover?",
      a: "About 80 of the world's busiest international airports, indexed by both IATA (3-letter, e.g. JFK) and ICAO (4-letter, e.g. KJFK) codes. Search by code, city or airport name.",
    },
    {
      q: "How is the flight CO2 figure calculated?",
      a: "Distance × emissions factor × class multiplier. We use ~120 g CO2/km per passenger for economy on a typical jet, lift it to ~180 g for premium economy, 240 g for business, and 320 g for first — these match the order-of-magnitude figures used by major airline calculators and offset providers.",
    },
    {
      q: "Are the airline cabin bag sizes official?",
      a: "Yes — sourced from the airline's published rules with a last-updated date shown. Airlines tighten or loosen these occasionally, so always verify on the airline's website near your travel date.",
    },
    {
      q: "What does the class comparison show?",
      a: "Seat pitch (legroom), seat width, recline angle and key in-flight amenities for economy, premium economy, business and first across major long-haul airlines — so you can decide whether the upgrade is worth it for a specific route.",
    },
  ],

  "size-converter": [
    {
      q: "Which size systems are supported?",
      a: "US, UK, EU and Japan (JP) sizes for clothing and shoes, split into men's, women's and kids' tables. Pick a system, enter your usual size, and the tool returns the matching size in every other system.",
    },
    {
      q: "Why don't my sizes match exactly across brands?",
      a: "Sizing tables are guidelines — actual fit varies by brand, cut and country of manufacture. Use the converter as a starting point and check the brand's own size chart before buying, especially for shoes.",
    },
    {
      q: "How do I convert kids' sizes?",
      a: "Choose 'Kids' for the category. Children's sizing in the US and UK is age- and inch-based, while EU and JP use length-based numbering. The table shows the typical match for each region.",
    },
    {
      q: "Does the tool work offline?",
      a: "Yes — once the page has loaded, all conversions happen client-side from a built-in table. No requests are made to any server.",
    },
  ],

  "visa-lookup": [
    {
      q: "How accurate is this visa lookup?",
      a: "It's a starting point. Visa rules change frequently and depend on stay length, purpose and your specific passport. We show the typical category for tourist visits up to 30 days. Always verify with the destination country's official immigration website before booking.",
    },
    {
      q: "What do the categories mean?",
      a: "Visa-free — no visa required for short tourist visits. e-Visa — apply online before travel. Visa on arrival — buy at the border. ETA — electronic travel authorisation (similar to e-Visa but lighter). Visa required — apply at an embassy in advance.",
    },
    {
      q: "Why isn't my passport country listed?",
      a: "The tool covers the most common passport countries. We add countries as we expand coverage — if yours is missing, use one of the authoritative links on the result page to check directly.",
    },
    {
      q: "Does this cover work, student or long-stay visas?",
      a: "No. The lookup is for tourist visits of up to 30 days only. Work, study, long-stay, residency and family visas all have their own application processes — check the embassy.",
    },
    {
      q: "Where does the data come from?",
      a: "Curated from each destination's official immigration policy as of the last-updated date on the result. We add a 'verify here' link to the official source so you can confirm the rules haven't changed.",
    },
  ],

  "time-flight-calculator": [
    {
      q: "What can I do with the time zone converter?",
      a: "Pick a time in one city and instantly see the equivalent in another. Handles daylight saving automatically. The world clock view lets you pin multiple cities to one page so you can scan them all at once.",
    },
    {
      q: "How does the flight arrival time calculator work?",
      a: "Enter your departure city and time plus the flight duration (or the destination and the tool estimates it). It returns the local arrival time at the destination, accounting for the time zone difference and DST.",
    },
    {
      q: "Why does my calculated arrival differ from the airline's?",
      a: "Airlines pad schedules with taxi and turn-around time. The calculator gives flight duration end-to-end, so use the airline's published arrival time for the official figure — this tool is best for quick mental math.",
    },
    {
      q: "Are time zones updated for daylight saving?",
      a: "Yes — the tool uses your browser's built-in time-zone database, which is updated by your operating system. DST transitions are handled automatically.",
    },
  ],

  "distance-coordinates": [
    {
      q: "How is the distance between two cities calculated?",
      a: "Using the Haversine formula on the great-circle distance between the two cities' latitude and longitude — the same approach airlines use. Driving distance from the same city pair will be longer because roads aren't straight.",
    },
    {
      q: "What formats does the coordinate converter handle?",
      a: "Decimal degrees (e.g. 40.7128, -74.0060), degrees-minutes-seconds (e.g. 40°42'46\"N 74°00'21\"W), and Google Maps share links. Paste any of them and the tool returns the others.",
    },
    {
      q: "What does GPS lookup return?",
      a: "Enter coordinates and the tool returns the nearest known city, country and IANA time zone. Useful when you're handed coordinates from a photo's EXIF or a friend's location share.",
    },
    {
      q: "Is my location ever sent to a server?",
      a: "No. All distance, coordinate and lookup logic runs in your browser against a built-in city table. Nothing about your coordinates leaves your device.",
    },
  ],
};

export const TRAVEL_HOWTOS: Record<TravelToolId, HowToStep[]> = {
  "packing-luggage-assistant": [
    { name: "Open the tab you need", text: "Switch between Packing list, Liquids checker, and Luggage size — they share one page." },
    { name: "Fill in your trip", text: "For packing, pick trip type, climate and days. For liquids, add each bottle. For luggage, type the dimensions you intend to fly with." },
    { name: "Use the result", text: "Tick off the packing items as you pack, see if your liquids exceed the 100ml rule, and confirm your bag fits each airline's carry-on or checked limits." },
  ],
  "flight-airport-hub": [
    { name: "Pick a tab", text: "Airport codes, CO2 calculator, cabin bag sizes or class comparison — all live in one tool." },
    { name: "Enter your route or airline", text: "Search an airport by code or city, enter origin and destination for CO2, or pick an airline to see its allowances and class details." },
    { name: "Compare and decide", text: "Use the results to plan baggage, evaluate an upgrade, or estimate the carbon footprint before booking." },
  ],
  "size-converter": [
    { name: "Pick your category", text: "Clothing or shoes, men / women / kids." },
    { name: "Enter your usual size", text: "Type the size you know — US, UK, EU or JP — into the matching field." },
    { name: "Read the row", text: "The table updates to show the equivalent size in every other region. Treat it as a starting point and verify with the brand's chart." },
  ],
  "visa-lookup": [
    { name: "Pick your passport", text: "Choose the country that issued your passport." },
    { name: "Pick a destination", text: "Choose where you're going. The result page shows the typical visa category for short tourist visits." },
    { name: "Always verify", text: "Click the official immigration link on the result and confirm the rules — visa policies change without notice." },
  ],
  "time-flight-calculator": [
    { name: "Choose a sub-tool", text: "Time zone converter for one pair, world clock for multiple cities, flight arrival for trip planning." },
    { name: "Enter the times and places", text: "Type the city or pick from the list. DST is handled automatically by your browser's time zone database." },
    { name: "Pin or copy", text: "Add cities to your world clock view, or copy the calculated arrival time straight into your itinerary." },
  ],
  "distance-coordinates": [
    { name: "Pick a sub-tool", text: "City distance for travel planning, coordinate converter for navigation apps, GPS lookup for unknown coordinates, driving time for a quick ETA." },
    { name: "Enter your input", text: "Type cities, paste coordinates in any format, or input distance + average speed for the driving estimate." },
    { name: "Use the result", text: "Distances are great-circle kilometres/miles; coordinates return in every format; GPS lookups return the nearest known city, country and time zone." },
  ],
};

export const TRAVEL_FEATURE_LISTS: Record<TravelToolId, string> = {
  "packing-luggage-assistant":
    "Packing list generator by trip type + climate + days, 100ml liquid checker, airline-specific luggage size checker, localStorage persistence",
  "flight-airport-hub":
    "IATA/ICAO airport code lookup for 80+ airports, flight CO2 calculator with class multipliers, cabin bag size by airline, cabin-class amenity comparison",
  "size-converter":
    "US/UK/EU/JP conversions for clothing and shoes, separate tables for men, women and kids, instant cross-region lookup",
  "visa-lookup":
    "Curated visa category lookup for top passport-destination pairs, plain-English explanations, authoritative verify-here link for every result",
  "time-flight-calculator":
    "Two-city time zone converter, pinnable multi-city world clock, departure-to-arrival flight time calculator with DST handling",
  "distance-coordinates":
    "Great-circle city distance, decimal/DMS/Maps-link coordinate converter, GPS-to-city lookup, driving time estimator",
};

export const TRAVEL_TOOL_PUBLISHED = "2026-05-23";

export function getTravelFaqs(toolId: string): FAQItem[] {
  return TRAVEL_FAQS[toolId as TravelToolId] ?? [];
}

export function getTravelHowTo(toolId: string): HowToStep[] {
  return TRAVEL_HOWTOS[toolId as TravelToolId] ?? [];
}

export function getTravelFeatureList(toolId: string): string {
  return TRAVEL_FEATURE_LISTS[toolId as TravelToolId] ?? "";
}

export function travelToolOgUrl(title: string, description: string): string {
  const params = new URLSearchParams({
    title,
    description,
    type: "travel-tool",
  });
  return `${SITE_CONFIG.url}/api/og?${params.toString()}`;
}
