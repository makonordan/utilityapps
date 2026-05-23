"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Droplets, Luggage, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { AIRLINES, LAST_UPDATED, type Airline } from "@/lib/travelData";
import { cn } from "@/lib/utils";

type Tab = "packing" | "liquids" | "luggage";

const PACKING_KEY = "ua-packing-list-v1";

// ---------------------------------------------------- Packing list data ----

const ALWAYS_ITEMS = [
  "Passport",
  "Tickets / boarding passes",
  "Phone + charger",
  "Universal travel adapter",
  "Headphones",
  "Travel insurance details",
  "Credit/debit cards",
  "Some local cash",
  "Reusable water bottle",
  "Toothbrush + toothpaste",
  "Deodorant",
  "Medication (if any)",
];

type TripType = "beach" | "city" | "business" | "hiking" | "ski";
type Climate = "hot" | "mild" | "cold";

const TRIP_LABELS: Record<TripType, string> = {
  beach: "Beach / resort",
  city: "City break",
  business: "Business trip",
  hiking: "Hiking / outdoors",
  ski: "Ski / snow",
};

const CLIMATE_LABELS: Record<Climate, string> = {
  hot: "Hot",
  mild: "Mild",
  cold: "Cold",
};

const TRIP_ITEMS: Record<TripType, string[]> = {
  beach: [
    "Swimsuit (2)",
    "Beach towel or sarong",
    "Flip-flops / sandals",
    "Sun hat",
    "Sunscreen SPF 50+",
    "After-sun cream",
    "Waterproof phone pouch",
    "Snorkel mask (optional)",
  ],
  city: [
    "Comfortable walking shoes",
    "Day bag / small backpack",
    "Power bank",
    "Offline maps downloaded",
    "Compact umbrella",
    "Cross-body anti-theft bag",
  ],
  business: [
    "Suit / blazer",
    "Formal shoes",
    "Tie / belt",
    "Laptop + charger",
    "Business cards",
    "Notebook + pen",
    "Reading glasses",
  ],
  hiking: [
    "Hiking boots",
    "Daypack 20–30L",
    "Refillable water bottle / hydration bladder",
    "Trail snacks",
    "First-aid kit",
    "Headlamp + spare batteries",
    "Map / compass / GPS",
    "Insect repellent",
    "Waterproof jacket",
  ],
  ski: [
    "Ski / snowboard jacket",
    "Salopettes / ski pants",
    "Base layers (top + bottom)",
    "Ski gloves",
    "Goggles",
    "Helmet",
    "Hand and foot warmers",
    "Lip balm with SPF",
  ],
};

const CLIMATE_ITEMS: Record<Climate, string[]> = {
  hot: [
    "Light cotton T-shirts",
    "Shorts / lightweight trousers",
    "Sun hat",
    "Sunglasses",
    "Sandals",
    "Lightweight scarf (for shoulders / temples)",
  ],
  mild: [
    "Layers (cardigan / jumper)",
    "Light rain jacket",
    "Long-sleeve shirts",
    "Closed-toe shoes",
  ],
  cold: [
    "Warm coat",
    "Thermal underwear",
    "Gloves",
    "Scarf",
    "Beanie / warm hat",
    "Wool / thick socks",
    "Boots",
  ],
};

interface PackingState {
  trip: TripType;
  climate: Climate;
  days: number;
  checked: Record<string, boolean>;
  custom: string[];
}

function defaultPacking(): PackingState {
  return { trip: "city", climate: "mild", days: 5, checked: {}, custom: [] };
}

function readPacking(): PackingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PACKING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PackingState>;
    if (!parsed.trip || !parsed.climate) return null;
    return { ...defaultPacking(), ...parsed } as PackingState;
  } catch {
    return null;
  }
}

function buildList(state: PackingState): string[] {
  const days = Math.max(1, state.days);
  const perDay = [
    `T-shirts × ${Math.ceil(days / 2) + 1}`,
    `Underwear × ${days + 1}`,
    `Socks × ${days}`,
    days >= 4 ? "Laundry detergent sheets" : null,
  ].filter(Boolean) as string[];
  return [
    ...perDay,
    ...TRIP_ITEMS[state.trip],
    ...CLIMATE_ITEMS[state.climate],
    ...ALWAYS_ITEMS,
    ...state.custom,
  ];
}

// ---------------------------------------------------- Liquids checker ----

interface Bottle {
  id: string;
  name: string;
  ml: number;
}

// ---------------------------------------------------- Component ----

export function PackingLuggageAssistant() {
  const [tab, setTab] = useState<Tab>("packing");

  return (
    <div className="space-y-6">
      <Tabs tab={tab} onChange={setTab} />
      {tab === "packing" && <PackingPanel />}
      {tab === "liquids" && <LiquidsPanel />}
      {tab === "luggage" && <LuggagePanel />}
    </div>
  );
}

function Tabs({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; icon: typeof Luggage; label: string }[] = [
    { id: "packing", icon: ShoppingBag, label: "Packing list" },
    { id: "liquids", icon: Droplets, label: "Liquids (100 ml rule)" },
    { id: "luggage", icon: Luggage, label: "Luggage size" },
  ];
  return (
    <div role="tablist" aria-label="Packing tools" className="flex flex-wrap gap-2 rounded-2xl bg-surface-100 p-1.5 dark:bg-surface-800">
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

// ============================================================ Packing tab

function PackingPanel() {
  const [state, setState] = useState<PackingState>(defaultPacking);
  const [hydrated, setHydrated] = useState(false);
  const [newItem, setNewItem] = useState("");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const saved = readPacking();
    if (saved) setState(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(PACKING_KEY, JSON.stringify(state));
    } catch {
      /* localStorage full / disabled */
    }
  }, [state, hydrated]);

  const items = useMemo(() => buildList(state), [state]);

  const toggle = (item: string) => {
    setState((prev) => ({ ...prev, checked: { ...prev.checked, [item]: !prev.checked[item] } }));
  };

  const addCustom = () => {
    const name = newItem.trim();
    if (!name) return;
    setState((prev) => ({ ...prev, custom: [...prev.custom, name] }));
    setNewItem("");
  };

  const removeCustom = (name: string) => {
    setState((prev) => ({
      ...prev,
      custom: prev.custom.filter((c) => c !== name),
    }));
  };

  const reset = () => setState({ ...state, checked: {}, custom: [] });

  const customSet = new Set(state.custom);
  const checkedCount = items.filter((i) => state.checked[i]).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Trip type</span>
          <select
            value={state.trip}
            onChange={(e) => setState({ ...state, trip: e.target.value as TripType })}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-900"
          >
            {(Object.keys(TRIP_LABELS) as TripType[]).map((t) => (
              <option key={t} value={t}>{TRIP_LABELS[t]}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Climate</span>
          <select
            value={state.climate}
            onChange={(e) => setState({ ...state, climate: e.target.value as Climate })}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-900"
          >
            {(Object.keys(CLIMATE_LABELS) as Climate[]).map((c) => (
              <option key={c} value={c}>{CLIMATE_LABELS[c]}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Number of days</span>
          <input
            type="number"
            min={1}
            max={60}
            value={state.days}
            onChange={(e) => setState({ ...state, days: Math.max(1, Math.min(60, Number(e.target.value) || 1)) })}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-900"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-sky-50 px-4 py-2.5 text-sm dark:bg-sky-500/10">
        <p className="text-sky-900 dark:text-sky-200">
          <strong>{checkedCount}</strong> of <strong>{items.length}</strong> items packed.
        </p>
        <button
          type="button"
          onClick={reset}
          className="text-xs font-semibold text-sky-700 underline-offset-4 hover:underline dark:text-sky-300"
        >
          Reset list
        </button>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const isCustom = customSet.has(item);
          return (
            <li key={item}>
              <label
                className={cn(
                  "flex items-center gap-3 rounded-xl border bg-white px-3 py-2 transition dark:bg-surface-900",
                  state.checked[item]
                    ? "border-sky-300 bg-sky-50/50 line-through dark:border-sky-500/40 dark:bg-sky-500/10"
                    : "border-surface-200 dark:border-surface-800"
                )}
              >
                <input
                  type="checkbox"
                  checked={Boolean(state.checked[item])}
                  onChange={() => toggle(item)}
                  className="h-4 w-4 accent-sky-500"
                />
                <span className="flex-1 text-sm text-surface-800 dark:text-surface-100">{item}</span>
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => removeCustom(item)}
                    aria-label={`Remove ${item}`}
                    className="text-surface-400 transition hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </label>
            </li>
          );
        })}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustom()}
          placeholder="Add your own item…"
          className="flex-1 rounded-xl border border-surface-200 bg-white px-3.5 py-2 text-sm dark:border-surface-700 dark:bg-surface-900"
        />
        <button
          type="button"
          onClick={addCustom}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <p className="text-xs text-surface-500 dark:text-surface-400">
        Your list is saved in this browser. Open the page from the same device and your check-offs
        and added items will still be here.
      </p>
    </div>
  );
}

// ============================================================ Liquids tab

const PRESET_BOTTLES = [
  { name: "Shampoo (travel)", ml: 100 },
  { name: "Conditioner (travel)", ml: 100 },
  { name: "Body wash (travel)", ml: 100 },
  { name: "Toothpaste tube", ml: 75 },
  { name: "Deodorant roll-on", ml: 50 },
  { name: "Moisturiser", ml: 50 },
  { name: "Sunscreen (travel)", ml: 100 },
  { name: "Perfume", ml: 30 },
  { name: "Contact lens solution", ml: 100 },
];

function LiquidsPanel() {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [name, setName] = useState("");
  const [ml, setMl] = useState(100);

  const totalMl = bottles.reduce((sum, b) => sum + b.ml, 0);
  const oversize = bottles.filter((b) => b.ml > 100);
  const totalOver = totalMl > 1000;

  const add = () => {
    const cleanName = name.trim() || "Bottle";
    setBottles((prev) => [...prev, { id: crypto.randomUUID(), name: cleanName, ml }]);
    setName("");
  };

  const addPreset = (preset: { name: string; ml: number }) => {
    setBottles((prev) => [...prev, { id: crypto.randomUUID(), ...preset }]);
  };

  const remove = (id: string) => setBottles((prev) => prev.filter((b) => b.id !== id));
  const clear = () => setBottles([]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-500/30 dark:bg-sky-500/10">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-200">
          The 100 ml / 1 L rule
        </p>
        <p className="mt-1 text-xs text-sky-800 dark:text-sky-300">
          Each container ≤ 100 ml, all containers fit in a single transparent 1 L resealable bag,
          one bag per passenger. Applies on most international flights — verify with your airport.
        </p>
      </div>

      {/* Quick add presets */}
      <div>
        <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Quick add</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESET_BOTTLES.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => addPreset(p)}
              className="inline-flex items-center gap-1.5 rounded-full border border-surface-200 bg-white px-3 py-1.5 text-xs font-medium text-surface-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
            >
              + {p.name} <span className="text-surface-400">({p.ml} ml)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom add */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Bottle name…"
          className="flex-1 min-w-[140px] rounded-xl border border-surface-200 bg-white px-3.5 py-2 text-sm dark:border-surface-700 dark:bg-surface-900"
        />
        <input
          type="number"
          min={1}
          max={500}
          value={ml}
          onChange={(e) => setMl(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
          className="w-24 rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-900"
          aria-label="Millilitres"
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {/* Bottles list */}
      {bottles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-surface-200 bg-white px-4 py-8 text-center text-sm text-surface-500 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-400">
          Add bottles above to start checking.
        </p>
      ) : (
        <ul className="space-y-2">
          {bottles.map((b) => (
            <li
              key={b.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 dark:bg-surface-900",
                b.ml > 100
                  ? "border-red-200 dark:border-red-500/40"
                  : "border-surface-200 dark:border-surface-800"
              )}
            >
              <Droplets className={cn("h-4 w-4", b.ml > 100 ? "text-red-500" : "text-sky-500")} />
              <span className="flex-1 text-sm text-surface-800 dark:text-surface-100">{b.name}</span>
              <span className={cn("text-sm font-semibold", b.ml > 100 ? "text-red-600 dark:text-red-400" : "text-surface-700 dark:text-surface-200")}>
                {b.ml} ml
              </span>
              <button
                type="button"
                onClick={() => remove(b.id)}
                aria-label={`Remove ${b.name}`}
                className="text-surface-400 transition hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Summary */}
      {bottles.length > 0 && (
        <div className="space-y-3">
          <div className={cn(
            "rounded-2xl border p-4",
            oversize.length === 0 && !totalOver
              ? "border-success-200 bg-success-50 dark:border-success-500/40 dark:bg-success-500/10"
              : "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10"
          )}>
            <p className="text-sm font-semibold text-surface-900 dark:text-white">
              {oversize.length === 0 && !totalOver ? (
                <>
                  <CheckCircle2 className="mb-0.5 mr-1 inline h-4 w-4 text-success-600 dark:text-success-400" />
                  All clear — {bottles.length} bottle{bottles.length === 1 ? "" : "s"}, {totalMl} ml total.
                </>
              ) : (
                <>
                  <AlertTriangle className="mb-0.5 mr-1 inline h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Issues found — {bottles.length} bottle{bottles.length === 1 ? "" : "s"}, {totalMl} ml total.
                </>
              )}
            </p>
            {oversize.length > 0 && (
              <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                {oversize.length} bottle{oversize.length === 1 ? " is" : "s are"} larger than 100 ml — must go in checked baggage:
                {" "}{oversize.map((b) => b.name).join(", ")}.
              </p>
            )}
            {totalOver && (
              <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                Total liquids exceed the 1 L bag limit by {totalMl - 1000} ml.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={clear}
            className="text-xs font-semibold text-sky-700 underline-offset-4 hover:underline dark:text-sky-300"
          >
            Clear all bottles
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================ Luggage tab

function LuggagePanel() {
  const [l, setL] = useState(55);
  const [w, setW] = useState(40);
  const [d, setD] = useState(23);
  const [kg, setKg] = useState(7);

  const results = AIRLINES.map((a) => evaluateAirline(a, { l, w, d, kg }));

  const passing = results.filter((r) => r.cabinPass).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Dim label="Length (cm)" value={l} onChange={setL} />
        <Dim label="Width (cm)" value={w} onChange={setW} />
        <Dim label="Depth (cm)" value={d} onChange={setD} />
        <Dim label="Weight (kg)" value={kg} onChange={setKg} max={50} />
      </div>

      <p className="text-sm text-surface-600 dark:text-surface-300">
        Your bag: <strong>{l} × {w} × {d} cm</strong> ({l + w + d} cm linear)
        {" · "}<strong>{kg} kg</strong> — passes carry-on for{" "}
        <strong>{passing} of {AIRLINES.length}</strong> airlines.
      </p>

      <ul className="grid gap-2 sm:grid-cols-2">
        {results.map((r) => (
          <li
            key={r.airline.iata}
            className={cn(
              "rounded-xl border bg-white p-3 dark:bg-surface-900",
              r.cabinPass
                ? "border-success-200 dark:border-success-500/40"
                : "border-red-200 dark:border-red-500/40"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-white">
                  {r.airline.name}
                </p>
                <p className="text-[11px] text-surface-500 dark:text-surface-400">
                  Carry-on: {r.airline.cabinCm.l}×{r.airline.cabinCm.w}×{r.airline.cabinCm.d} cm
                  {r.airline.cabinKg ? ` · ${r.airline.cabinKg} kg` : " · no weight limit"}
                </p>
              </div>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                r.cabinPass
                  ? "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-300"
                  : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
              )}>
                {r.cabinPass ? "Fits carry-on" : "Too large"}
              </span>
            </div>
            {!r.cabinPass && r.reason && (
              <p className="mt-1.5 text-[11px] text-red-700 dark:text-red-400">{r.reason}</p>
            )}
            {r.airline.notes && (
              <p className="mt-1.5 text-[11px] italic text-surface-500 dark:text-surface-400">
                {r.airline.notes}
              </p>
            )}
          </li>
        ))}
      </ul>

      <p className="text-xs text-surface-500 dark:text-surface-400">
        Last reviewed {LAST_UPDATED}. Always confirm on the airline's own site before flying —
        rules change.
      </p>
    </div>
  );
}

function Dim({ label, value, onChange, max = 100 }: { label: string; value: number; onChange: (n: number) => void; max?: number }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-surface-700 dark:text-surface-200">{label}</span>
      <input
        type="number"
        min={1}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(1, Math.min(max, Number(e.target.value) || 1)))}
        className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-900"
      />
    </label>
  );
}

interface BagEval {
  airline: Airline;
  cabinPass: boolean;
  reason?: string;
}

function evaluateAirline(a: Airline, bag: { l: number; w: number; d: number; kg: number }): BagEval {
  // Bag passes if each of (l,w,d) ≤ matching airline dimension (allow some
  // softness — sort the three sides so the largest matches the largest limit).
  const bagSides = [bag.l, bag.w, bag.d].sort((x, y) => y - x);
  const limitSides = [a.cabinCm.l, a.cabinCm.w, a.cabinCm.d].sort((x, y) => y - x);
  const dimensionFail = bagSides.some((side, i) => side > limitSides[i]);
  if (dimensionFail) {
    return { airline: a, cabinPass: false, reason: `Bag exceeds ${a.cabinCm.l}×${a.cabinCm.w}×${a.cabinCm.d} cm carry-on limit.` };
  }
  if (a.cabinKg != null && bag.kg > a.cabinKg) {
    return { airline: a, cabinPass: false, reason: `Bag weight ${bag.kg} kg exceeds ${a.cabinKg} kg carry-on limit.` };
  }
  return { airline: a, cabinPass: true };
}
