"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock, Globe, PlaneTakeoff, Plus, X } from "lucide-react";

import { PlacePicker } from "@/components/travel-tools/PlacePicker";
import { PLACES, PLACES_BY_IATA, type TravelPlace } from "@/lib/travelData";
import { cn } from "@/lib/utils";

type Tab = "converter" | "world" | "flight";

const WORLD_KEY = "ua-world-clock-v1";

// ---------- Time helpers ----------

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function todayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function nowTimeStr(): string {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Minutes offset of a time zone at a given instant. */
function getTzOffsetMin(tz: string, instant: Date): number {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "longOffset",
    }).formatToParts(instant);
    const offsetStr = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+00:00";
    const m = offsetStr.match(/([+-])(\d{2}):?(\d{2})?/);
    if (!m) return 0;
    const sign = m[1] === "+" ? 1 : -1;
    const h = parseInt(m[2], 10);
    const min = m[3] ? parseInt(m[3], 10) : 0;
    return sign * (h * 60 + min);
  } catch {
    return 0;
  }
}

/** Interpret a wall-clock date+time as belonging to tz; return UTC instant. */
function wallTimeToInstant(date: string, time: string, tz: string): Date | null {
  const dm = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const tm = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!dm || !tm) return null;
  const [, y, mo, d] = dm;
  const [, h, mi] = tm;
  const utcCandidate = Date.UTC(+y, +mo - 1, +d, +h, +mi);
  const offsetMin = getTzOffsetMin(tz, new Date(utcCandidate));
  return new Date(utcCandidate - offsetMin * 60_000);
}

function formatInTz(instant: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(instant);
  } catch {
    return "—";
  }
}

function shortTimeInTz(instant: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(instant);
  } catch {
    return "—";
  }
}

function dayLabelInTz(instant: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(instant);
  } catch {
    return "";
  }
}

// ---------- Component ----------

export function TimeFlightCalculator() {
  const [tab, setTab] = useState<Tab>("converter");

  return (
    <div className="space-y-6">
      <Tabs tab={tab} onChange={setTab} />
      {tab === "converter" && <ConverterPanel />}
      {tab === "world" && <WorldClockPanel />}
      {tab === "flight" && <FlightArrivalPanel />}
    </div>
  );
}

function Tabs({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; icon: typeof Globe; label: string }[] = [
    { id: "converter", icon: Clock, label: "Time zone converter" },
    { id: "world", icon: Globe, label: "World clock" },
    { id: "flight", icon: PlaneTakeoff, label: "Flight arrival" },
  ];
  return (
    <div role="tablist" aria-label="Time tools" className="flex flex-wrap gap-2 rounded-2xl bg-surface-100 p-1.5 dark:bg-surface-800">
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

// ============================================================ Converter

function ConverterPanel() {
  const [from, setFrom] = useState<TravelPlace | null>(PLACES_BY_IATA.LHR ?? null);
  const [to, setTo] = useState<TravelPlace | null>(PLACES_BY_IATA.JFK ?? null);
  const [date, setDate] = useState(todayDateStr);
  const [time, setTime] = useState("14:00");

  const instant = useMemo(() => {
    if (!from) return null;
    return wallTimeToInstant(date, time, from.tz);
  }, [from, date, time]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <PlacePicker label="From city" value={from} onChange={setFrom} />
        <PlacePicker label="To city" value={to} onChange={setTo} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
            Time {from && <span className="text-surface-500">({from.tz})</span>}
          </span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 dark:border-sky-500/30 dark:from-sky-500/10 dark:to-surface-900">
        {from && to && instant ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              Equivalent time in {to.city}
            </p>
            <p className="mt-2 text-3xl font-bold text-surface-900 dark:text-white">
              {formatInTz(instant, to.tz)}
            </p>
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
              When it is <strong>{time}</strong> on {date} in {from.city} ({from.tz}).
            </p>
            <p className="mt-3 text-xs text-surface-500 dark:text-surface-400">
              Difference: {tzDiffHours(from.tz, to.tz, instant)} hours
            </p>
          </>
        ) : (
          <p className="text-sm text-surface-600 dark:text-surface-300">
            Pick both cities and a time to convert.
          </p>
        )}
      </div>
    </div>
  );
}

function tzDiffHours(fromTz: string, toTz: string, instant: Date): string {
  const f = getTzOffsetMin(fromTz, instant);
  const t = getTzOffsetMin(toTz, instant);
  const diff = (t - f) / 60;
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "";
  return `${sign}${Math.abs(diff)}`;
}

// ============================================================ World clock

function WorldClockPanel() {
  const [cities, setCities] = useState<string[]>([]); // IATA codes
  const [hydrated, setHydrated] = useState(false);
  const [pickerValue, setPickerValue] = useState<TravelPlace | null>(null);
  const [now, setNow] = useState(() => new Date());

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(WORLD_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCities(parsed.filter((c): c is string => typeof c === "string"));
      } else {
        // sensible defaults if first visit
        setCities(["LHR", "JFK", "LAX", "HND", "SYD"]);
      }
    } catch {
      /* localStorage disabled */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(WORLD_KEY, JSON.stringify(cities));
    } catch {
      /* ignore */
    }
  }, [cities, hydrated]);

  // tick every 30 seconds
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const addCity = () => {
    if (pickerValue && !cities.includes(pickerValue.iata)) {
      setCities((prev) => [...prev, pickerValue.iata]);
    }
    setPickerValue(null);
  };

  const remove = (iata: string) => setCities((prev) => prev.filter((c) => c !== iata));

  return (
    <div className="space-y-5">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <PlacePicker
          label="Add a city"
          value={pickerValue}
          onChange={setPickerValue}
          placeholder="Type a city, then click Add…"
        />
        <button
          type="button"
          onClick={addCity}
          disabled={!pickerValue}
          className="mt-7 inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Add city
        </button>
      </div>

      {cities.length === 0 ? (
        <p className="rounded-xl border border-dashed border-surface-200 bg-white px-4 py-8 text-center text-sm text-surface-500 dark:border-surface-800 dark:bg-surface-900">
          Add cities above to build your world clock.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((iata) => {
            const place = PLACES_BY_IATA[iata];
            if (!place) return null;
            return (
              <li
                key={iata}
                className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{place.city}</p>
                  <button
                    type="button"
                    onClick={() => remove(iata)}
                    aria-label={`Remove ${place.city}`}
                    className="text-surface-400 transition hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-3xl font-bold text-surface-900 dark:text-white">
                  {shortTimeInTz(now, place.tz)}
                </p>
                <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
                  {dayLabelInTz(now, place.tz)} · {place.tz}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-surface-500 dark:text-surface-400">
        Times refresh every 30 seconds. Pinned cities are saved in this browser.
      </p>
    </div>
  );
}

// ============================================================ Flight arrival

function FlightArrivalPanel() {
  const [from, setFrom] = useState<TravelPlace | null>(PLACES_BY_IATA.JFK ?? null);
  const [to, setTo] = useState<TravelPlace | null>(PLACES_BY_IATA.LHR ?? null);
  const [date, setDate] = useState(todayDateStr);
  const [time, setTime] = useState(nowTimeStr);
  const [durationHours, setDurationHours] = useState(7);
  const [durationMinutes, setDurationMinutes] = useState(0);

  const departureInstant = useMemo(() => {
    if (!from) return null;
    return wallTimeToInstant(date, time, from.tz);
  }, [from, date, time]);

  const arrivalInstant = useMemo(() => {
    if (!departureInstant) return null;
    const totalMinutes = Math.max(0, durationHours * 60 + durationMinutes);
    return new Date(departureInstant.getTime() + totalMinutes * 60_000);
  }, [departureInstant, durationHours, durationMinutes]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <PlacePicker label="From" value={from} onChange={setFrom} />
        <PlacePicker label="To" value={to} onChange={setTo} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Departure date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
            Departure time {from && <span className="text-surface-500">({from.tz})</span>}
          </span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
          />
        </label>
        <div>
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Flight duration</span>
          <div className="mt-1.5 flex gap-2">
            <input
              type="number"
              min={0}
              max={24}
              value={durationHours}
              onChange={(e) => setDurationHours(Math.max(0, Math.min(24, Number(e.target.value) || 0)))}
              className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
              aria-label="Hours"
            />
            <input
              type="number"
              min={0}
              max={59}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
              className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
              aria-label="Minutes"
            />
          </div>
          <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">Hours · minutes</p>
        </div>
      </div>

      <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 dark:border-sky-500/30 dark:from-sky-500/10 dark:to-surface-900">
        {from && to && departureInstant && arrivalInstant ? (
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                Departure
              </p>
              <p className="mt-1 text-xl font-bold text-surface-900 dark:text-white">
                {shortTimeInTz(departureInstant, from.tz)}
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                {dayLabelInTz(departureInstant, from.tz)} · {from.city}
              </p>
            </div>
            <ArrowRight className="hidden h-5 w-5 justify-self-center text-sky-500 sm:block" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                Arrival
              </p>
              <p className="mt-1 text-xl font-bold text-surface-900 dark:text-white">
                {shortTimeInTz(arrivalInstant, to.tz)}
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                {dayLabelInTz(arrivalInstant, to.tz)} · {to.city}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-surface-600 dark:text-surface-300">
            Pick both cities, a departure time and a flight duration to see the arrival.
          </p>
        )}
      </div>

      <p className="text-xs text-surface-500 dark:text-surface-400">
        Time zones use your browser's built-in IANA database (handles daylight saving automatically).
      </p>
    </div>
  );
}
