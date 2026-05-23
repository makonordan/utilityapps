"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Leaf, Plane, Search, Sparkles } from "lucide-react";

import { PlacePicker } from "@/components/travel-tools/PlacePicker";
import {
  AIRLINES,
  CABIN_COMPARISON,
  CO2_FACTORS,
  LAST_UPDATED,
  haversineKm,
  searchPlaces,
  type Airline,
  type CabinClass,
  type TravelPlace,
} from "@/lib/travelData";
import { cn } from "@/lib/utils";

type Tab = "codes" | "co2" | "cabin-bag" | "class";

export function FlightAirportHub() {
  const [tab, setTab] = useState<Tab>("codes");

  return (
    <div className="space-y-6">
      <Tabs tab={tab} onChange={setTab} />
      {tab === "codes" && <CodesPanel />}
      {tab === "co2" && <CO2Panel />}
      {tab === "cabin-bag" && <CabinBagPanel />}
      {tab === "class" && <ClassPanel />}
    </div>
  );
}

function Tabs({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; icon: typeof Plane; label: string }[] = [
    { id: "codes", icon: Search, label: "Airport codes" },
    { id: "co2", icon: Leaf, label: "Flight CO₂" },
    { id: "cabin-bag", icon: Plane, label: "Cabin bag size" },
    { id: "class", icon: Sparkles, label: "Class comparison" },
  ];
  return (
    <div role="tablist" aria-label="Flight tools" className="flex flex-wrap gap-2 rounded-2xl bg-surface-100 p-1.5 dark:bg-surface-800">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          role="tab"
          aria-selected={tab === it.id}
          onClick={() => onChange(it.id)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
            tab === it.id
              ? "bg-white text-sky-700 shadow-sm dark:bg-surface-950 dark:text-sky-300"
              : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
          )}
        >
          <it.icon className="h-4 w-4" />
          {it.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================ Airport codes

function CodesPanel() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => searchPlaces(query, 20), [query]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
          Search by IATA, ICAO, city, airport or country
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. LHR, KJFK, Tokyo, Heathrow"
          autoFocus
          className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-base dark:border-surface-700 dark:bg-surface-900"
        />
      </label>

      {query.trim() && matches.length === 0 && (
        <p className="rounded-xl border border-dashed border-surface-200 bg-white px-4 py-6 text-center text-sm text-surface-500 dark:border-surface-800 dark:bg-surface-900">
          No matches in the built-in database. The lookup covers ~80 major international airports.
        </p>
      )}

      {matches.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {matches.map((p) => (
            <li
              key={p.iata}
              className="rounded-xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-base font-bold text-sky-700 dark:text-sky-300">
                  {p.iata} <span className="text-xs text-surface-400">/ {p.icao}</span>
                </p>
                <span className="text-[11px] text-surface-500 dark:text-surface-400">{p.country}</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-surface-900 dark:text-white">{p.airport}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                {p.city}, {p.countryName} · {p.tz}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================ CO2 calculator

function CO2Panel() {
  const [from, setFrom] = useState<TravelPlace | null>(null);
  const [to, setTo] = useState<TravelPlace | null>(null);
  const [cabin, setCabin] = useState<CabinClass>("economy");
  const [roundTrip, setRoundTrip] = useState(true);

  const distanceKm = from && to ? haversineKm(from, to) : 0;
  const gPerKm = CO2_FACTORS[cabin];
  const kgOneWay = (distanceKm * gPerKm) / 1000;
  const kgTotal = roundTrip ? kgOneWay * 2 : kgOneWay;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <PlacePicker label="From" value={from} onChange={setFrom} />
        <PlacePicker label="To" value={to} onChange={setTo} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Cabin class</span>
          <select
            value={cabin}
            onChange={(e) => setCabin(e.target.value as CabinClass)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
          >
            <option value="economy">Economy</option>
            <option value="premium">Premium economy</option>
            <option value="business">Business</option>
            <option value="first">First</option>
          </select>
        </label>
        <label className="flex items-end gap-2 pb-1">
          <input
            type="checkbox"
            checked={roundTrip}
            onChange={(e) => setRoundTrip(e.target.checked)}
            className="h-4 w-4 accent-sky-500"
          />
          <span className="text-sm font-semibold text-surface-700 dark:text-surface-200">Round trip</span>
        </label>
      </div>

      <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 dark:border-sky-500/30 dark:from-sky-500/10 dark:to-surface-900">
        {!from || !to ? (
          <p className="text-sm text-surface-600 dark:text-surface-300">
            Pick an origin and destination to see distance and CO₂ estimates.
          </p>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              Estimated emissions
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1">
              <p className="text-4xl font-bold text-surface-900 dark:text-white">
                {kgTotal.toFixed(0)} <span className="text-base font-medium text-surface-500">kg CO₂</span>
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-300">
                {distanceKm.toFixed(0)} km{roundTrip ? " × 2" : ""} · {cabin} ({gPerKm} g/km)
              </p>
            </div>
            <p className="mt-3 text-xs text-surface-500 dark:text-surface-400">
              For context, the average European emits about 8,000 kg CO₂ per year across everything
              they do. A long-haul return flight in economy is often 10–15% of an annual footprint.
            </p>
          </>
        )}
      </div>

      <p className="text-xs text-surface-500 dark:text-surface-400">
        Order-of-magnitude estimate using per-passenger-km factors that match the published numbers
        from major airline and offset calculators (BA, Lufthansa, ICAO). Actual figures depend on
        aircraft type and load factor.
      </p>
    </div>
  );
}

// ============================================================ Cabin bag size

function CabinBagPanel() {
  const [selectedIata, setSelectedIata] = useState<string>(AIRLINES[0].iata);
  const airline = AIRLINES.find((a) => a.iata === selectedIata) ?? AIRLINES[0];

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Airline</span>
        <select
          value={selectedIata}
          onChange={(e) => setSelectedIata(e.target.value)}
          className="mt-1.5 block w-full max-w-md rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
        >
          {AIRLINES.map((a) => (
            <option key={a.iata} value={a.iata}>
              {a.name} ({a.iata})
            </option>
          ))}
        </select>
      </label>

      <AirlineCard airline={airline} />

      <p className="text-xs text-surface-500 dark:text-surface-400">
        Last reviewed {LAST_UPDATED}. Verify on the airline's website before flying — rules change.
      </p>
    </div>
  );
}

function AirlineCard({ airline }: { airline: Airline }) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white">{airline.name}</h3>
        <span className="font-mono text-xs text-surface-500 dark:text-surface-400">{airline.iata}</span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Stat
          title="Carry-on dimensions"
          value={`${airline.cabinCm.l} × ${airline.cabinCm.w} × ${airline.cabinCm.d} cm`}
          sub={airline.cabinKg ? `${airline.cabinKg} kg max` : "No weight limit enforced"}
        />
        <Stat
          title="Checked baggage"
          value={`${airline.checkedKg} kg`}
          sub={`Linear dimensions ≤ ${airline.checkedLinearCm} cm (L + W + D)`}
        />
      </div>

      {airline.notes && (
        <p className="mt-4 rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-900 dark:bg-sky-500/10 dark:text-sky-200">
          <CheckCircle2 className="mb-0.5 mr-1 inline h-3.5 w-3.5" /> {airline.notes}
        </p>
      )}
    </div>
  );
}

function Stat({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl bg-surface-50 p-3 dark:bg-surface-800/60">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{title}</p>
      <p className="mt-1 text-base font-bold text-surface-900 dark:text-white">{value}</p>
      <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">{sub}</p>
    </div>
  );
}

// ============================================================ Class compare

function ClassPanel() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-surface-600 dark:text-surface-300">
        Seat pitch and width across cabin classes for major long-haul aircraft. Pitch is the
        front-to-back distance between seats (in inches); higher means more legroom.
      </p>
      <div className="-mx-2 overflow-x-auto sm:mx-0">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              <th className="sticky left-0 z-10 bg-surface-50 px-3 py-2 dark:bg-surface-900">Airline / aircraft</th>
              <th className="px-3 py-2">Economy</th>
              <th className="px-3 py-2">Premium</th>
              <th className="px-3 py-2">Business</th>
              <th className="px-3 py-2">First</th>
            </tr>
          </thead>
          <tbody>
            {CABIN_COMPARISON.map((row, i) => (
              <tr key={row.airline} className={i % 2 ? "bg-surface-50 dark:bg-surface-900/40" : ""}>
                <td className="sticky left-0 z-10 bg-inherit px-3 py-2 font-medium text-surface-900 dark:text-white">{row.airline}</td>
                <td className="px-3 py-2 text-surface-700 dark:text-surface-200">
                  {row.economy.pitch}″ pitch · {row.economy.width}″ wide
                </td>
                <td className="px-3 py-2 text-surface-700 dark:text-surface-200">
                  {row.premium ? `${row.premium.pitch}″ · ${row.premium.width}″` : "—"}
                </td>
                <td className="px-3 py-2 text-surface-700 dark:text-surface-200">
                  {row.business
                    ? `${row.business.pitch}″ · ${row.business.width}″${row.business.lieFlat ? " · lie-flat" : ""}`
                    : "—"}
                </td>
                <td className="px-3 py-2 text-surface-700 dark:text-surface-200">
                  {row.first
                    ? `${row.first.pitch}″ · ${row.first.width}″${row.first.suite ? " · suite" : ""}`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-surface-500 dark:text-surface-400">
        Sources: airline configuration pages and SeatGuru. Actual seat depends on aircraft variant
        and route — confirm at booking.
      </p>
    </div>
  );
}
