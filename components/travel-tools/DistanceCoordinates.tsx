"use client";

import { useMemo, useState } from "react";
import { Compass, Map, MapPin, Navigation } from "lucide-react";

import { PlacePicker } from "@/components/travel-tools/PlacePicker";
import { PLACES, haversineKm, type TravelPlace } from "@/lib/travelData";
import { cn } from "@/lib/utils";

type Tab = "distance" | "convert" | "lookup" | "driving";

export function DistanceCoordinates() {
  const [tab, setTab] = useState<Tab>("distance");
  return (
    <div className="space-y-6">
      <Tabs tab={tab} onChange={setTab} />
      {tab === "distance" && <DistancePanel />}
      {tab === "convert" && <CoordConvertPanel />}
      {tab === "lookup" && <GpsLookupPanel />}
      {tab === "driving" && <DrivingPanel />}
    </div>
  );
}

function Tabs({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; icon: typeof Map; label: string }[] = [
    { id: "distance", icon: Map, label: "City distance" },
    { id: "convert", icon: Compass, label: "Coordinate converter" },
    { id: "lookup", icon: MapPin, label: "GPS lookup" },
    { id: "driving", icon: Navigation, label: "Driving time" },
  ];
  return (
    <div role="tablist" aria-label="Distance tools" className="flex flex-wrap gap-2 rounded-2xl bg-surface-100 p-1.5 dark:bg-surface-800">
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

// ============================================================ City distance

function DistancePanel() {
  const [from, setFrom] = useState<TravelPlace | null>(null);
  const [to, setTo] = useState<TravelPlace | null>(null);

  const km = from && to ? haversineKm(from, to) : 0;
  const miles = km * 0.621_371;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <PlacePicker label="From" value={from} onChange={setFrom} />
        <PlacePicker label="To" value={to} onChange={setTo} />
      </div>

      <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 dark:border-sky-500/30 dark:from-sky-500/10 dark:to-surface-900">
        {from && to ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              Great-circle distance
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1">
              <p className="text-4xl font-bold text-surface-900 dark:text-white">
                {km.toFixed(0)} <span className="text-base font-medium text-surface-500">km</span>
              </p>
              <p className="text-2xl font-semibold text-surface-600 dark:text-surface-300">
                {miles.toFixed(0)} <span className="text-sm">mi</span>
              </p>
            </div>
            <p className="mt-3 text-sm text-surface-600 dark:text-surface-300">
              {from.city} → {to.city}, as a flight crow flies.
            </p>
            <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
              Driving distance will be longer (typically 1.2–1.5×) because roads aren&apos;t straight.
            </p>
          </>
        ) : (
          <p className="text-sm text-surface-600 dark:text-surface-300">
            Pick two cities to see the great-circle distance.
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================ Coordinate converter

interface ParsedCoords {
  lat: number;
  lng: number;
}

function parseCoordinates(input: string): ParsedCoords | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Google Maps URL: ?q=lat,lng OR @lat,lng,z
  const maps =
    trimmed.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/) ||
    trimmed.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (maps) {
    const lat = parseFloat(maps[1]);
    const lng = parseFloat(maps[2]);
    if (validLatLng(lat, lng)) return { lat, lng };
  }

  // DMS: 40°42'46"N 74°00'21"W
  const dms = trimmed.match(
    /(\d+(?:\.\d+)?)\s*°\s*(\d+(?:\.\d+)?)\s*['′]\s*(?:(\d+(?:\.\d+)?)\s*["″])?\s*([NS])\s*[,;\s]+\s*(\d+(?:\.\d+)?)\s*°\s*(\d+(?:\.\d+)?)\s*['′]\s*(?:(\d+(?:\.\d+)?)\s*["″])?\s*([EW])/i
  );
  if (dms) {
    const latD = +dms[1];
    const latM = +dms[2];
    const latS = dms[3] ? +dms[3] : 0;
    const latSign = dms[4].toUpperCase() === "S" ? -1 : 1;
    const lngD = +dms[5];
    const lngM = +dms[6];
    const lngS = dms[7] ? +dms[7] : 0;
    const lngSign = dms[8].toUpperCase() === "W" ? -1 : 1;
    const lat = latSign * (latD + latM / 60 + latS / 3600);
    const lng = lngSign * (lngD + lngM / 60 + lngS / 3600);
    if (validLatLng(lat, lng)) return { lat, lng };
  }

  // Plain decimal: "40.7128, -74.0060" or "40.7128 -74.0060"
  const dec = trimmed.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (dec) {
    const lat = parseFloat(dec[1]);
    const lng = parseFloat(dec[2]);
    if (validLatLng(lat, lng)) return { lat, lng };
  }

  return null;
}

function validLatLng(lat: number, lng: number): boolean {
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && Number.isFinite(lat) && Number.isFinite(lng);
}

function decimalToDms(value: number, isLat: boolean): string {
  const abs = Math.abs(value);
  const d = Math.floor(abs);
  const mFloat = (abs - d) * 60;
  const m = Math.floor(mFloat);
  const s = ((mFloat - m) * 60).toFixed(2);
  const dir = value >= 0 ? (isLat ? "N" : "E") : isLat ? "S" : "W";
  return `${d}°${m.toString().padStart(2, "0")}'${s.padStart(5, "0")}"${dir}`;
}

function CoordConvertPanel() {
  const [input, setInput] = useState("");
  const parsed = useMemo(() => parseCoordinates(input), [input]);

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
          Paste coordinates or a Google Maps link
        </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'e.g. 40.7128, -74.0060   or   40°42\'46"N 74°00\'21"W'}
          className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
        />
      </label>

      {parsed ? (
        <div className="space-y-3 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 dark:border-sky-500/30 dark:from-sky-500/10 dark:to-surface-900">
          <CoordOutput
            label="Decimal degrees"
            value={`${parsed.lat.toFixed(6)}, ${parsed.lng.toFixed(6)}`}
          />
          <CoordOutput
            label="Degrees-minutes-seconds (DMS)"
            value={`${decimalToDms(parsed.lat, true)}  ${decimalToDms(parsed.lng, false)}`}
          />
          <CoordOutput
            label="Google Maps link"
            value={`https://www.google.com/maps?q=${parsed.lat.toFixed(6)},${parsed.lng.toFixed(6)}`}
            isLink
          />
          <CoordOutput
            label="OpenStreetMap link"
            value={`https://www.openstreetmap.org/?mlat=${parsed.lat.toFixed(6)}&mlon=${parsed.lng.toFixed(6)}&zoom=14`}
            isLink
          />
        </div>
      ) : input.trim() ? (
        <p className="rounded-xl border border-dashed border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
          Couldn&apos;t parse those coordinates. Supported formats: decimal (40.7128, -74.0060),
          DMS (40°42&apos;46&quot;N 74°00&apos;21&quot;W), and Google Maps share links.
        </p>
      ) : null}
    </div>
  );
}

function CoordOutput({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  const copy = () => {
    try {
      void navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">{label}</p>
      <div className="flex items-center gap-2">
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 break-all rounded-lg bg-white px-3 py-2 font-mono text-xs text-sky-700 underline-offset-4 hover:underline dark:bg-surface-900 dark:text-sky-300"
          >
            {value}
          </a>
        ) : (
          <span className="flex-1 break-all rounded-lg bg-white px-3 py-2 font-mono text-xs text-surface-700 dark:bg-surface-900 dark:text-surface-200">
            {value}
          </span>
        )}
        <button
          type="button"
          onClick={copy}
          className="rounded-lg border border-surface-200 px-2.5 py-2 text-[11px] font-semibold text-surface-600 transition hover:border-sky-300 hover:text-sky-700 dark:border-surface-700 dark:text-surface-300"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

// ============================================================ GPS lookup

function GpsLookupPanel() {
  const [input, setInput] = useState("");
  const parsed = useMemo(() => parseCoordinates(input), [input]);

  const nearest = useMemo(() => {
    if (!parsed) return null;
    let best: { place: TravelPlace; km: number } | null = null;
    for (const p of PLACES) {
      const km = haversineKm(parsed, p);
      if (!best || km < best.km) best = { place: p, km };
    }
    return best;
  }, [parsed]);

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
          Paste coordinates
        </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 35.6586, 139.7454"
          className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
        />
      </label>

      {nearest ? (
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 dark:border-sky-500/30 dark:from-sky-500/10 dark:to-surface-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            Nearest known city
          </p>
          <p className="mt-2 text-3xl font-bold text-surface-900 dark:text-white">
            {nearest.place.city}
          </p>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
            {nearest.place.countryName} · {nearest.place.tz}
          </p>
          <p className="mt-3 text-xs text-surface-500 dark:text-surface-400">
            About {nearest.km.toFixed(0)} km from your coordinates ({parsed?.lat.toFixed(4)}, {parsed?.lng.toFixed(4)})
          </p>
        </div>
      ) : input.trim() && !parsed ? (
        <p className="rounded-xl border border-dashed border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
          Couldn&apos;t parse those coordinates. Try decimal format like &ldquo;35.6586, 139.7454&rdquo;.
        </p>
      ) : null}

      <p className="text-xs text-surface-500 dark:text-surface-400">
        Compares against ~80 major international cities. The match shows the closest one, plus its
        time zone — handy when you get coordinates from a photo&apos;s EXIF or a location share.
      </p>
    </div>
  );
}

// ============================================================ Driving time

function DrivingPanel() {
  const [distance, setDistance] = useState(500);
  const [unit, setUnit] = useState<"km" | "mi">("km");
  const [speed, setSpeed] = useState(100);
  const [stopMinutes, setStopMinutes] = useState(15);
  const [stopEveryHours, setStopEveryHours] = useState(2);

  const drivingHours = speed > 0 ? distance / speed : 0;
  const stops = stopEveryHours > 0 ? Math.max(0, Math.floor(drivingHours / stopEveryHours)) : 0;
  const totalMinutes = drivingHours * 60 + stops * stopMinutes;
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Distance</span>
          <div className="mt-1.5 flex gap-2">
            <input
              type="number"
              min={1}
              max={9999}
              value={distance}
              onChange={(e) => setDistance(Math.max(1, Math.min(9999, Number(e.target.value) || 1)))}
              className="flex-1 rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as "km" | "mi")}
              className="rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
            >
              <option value="km">km</option>
              <option value="mi">mi</option>
            </select>
          </div>
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Average speed</span>
          <div className="mt-1.5 flex items-center gap-3">
            <input
              type="range"
              min={40}
              max={140}
              step={5}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-surface-200 accent-sky-500 dark:bg-surface-700"
            />
            <span className="w-20 text-right text-sm text-surface-600 dark:text-surface-300">
              {speed} {unit}/h
            </span>
          </div>
          <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">
            Highway with light traffic is usually 90–110 km/h average.
          </p>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
            Stop every (hours)
          </span>
          <input
            type="number"
            min={0}
            max={12}
            value={stopEveryHours}
            onChange={(e) => setStopEveryHours(Math.max(0, Math.min(12, Number(e.target.value) || 0)))}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">
            Each stop is (minutes)
          </span>
          <input
            type="number"
            min={0}
            max={120}
            value={stopMinutes}
            onChange={(e) => setStopMinutes(Math.max(0, Math.min(120, Number(e.target.value) || 0)))}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 dark:border-sky-500/30 dark:from-sky-500/10 dark:to-surface-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
          Estimated travel time
        </p>
        <p className="mt-2 text-4xl font-bold text-surface-900 dark:text-white">
          {h} hr {m} min
        </p>
        <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
          {drivingHours.toFixed(1)} hours driving + {stops} stop{stops === 1 ? "" : "s"} of {stopMinutes} min each.
        </p>
      </div>
    </div>
  );
}
