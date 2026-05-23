"use client";

import { useEffect, useId, useState } from "react";

import { PLACES, PLACES_BY_IATA, type TravelPlace } from "@/lib/travelData";

interface Props {
  value: TravelPlace | null;
  onChange: (place: TravelPlace | null) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

/**
 * Compact place picker backed by a native <datalist> — works on every device,
 * no extra deps. The user types a city or IATA code; if their input matches a
 * known `(IATA)` we resolve to the full TravelPlace.
 */
export function PlacePicker({
  value,
  onChange,
  placeholder = "Type a city or IATA code…",
  className = "mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900",
  label,
}: Props) {
  const listId = useId();
  const expected = value ? `${value.city} (${value.iata})` : "";
  const [text, setText] = useState(expected);

  useEffect(() => {
    setText(expected);
  }, [expected]);

  const handleChange = (v: string) => {
    setText(v);
    const m = v.match(/\(([A-Z]{3})\)/i);
    if (m) {
      const place = PLACES_BY_IATA[m[1].toUpperCase()];
      onChange(place ?? null);
    } else if (!v.trim()) {
      onChange(null);
    }
  };

  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">{label}</span>
      )}
      <input
        type="text"
        list={listId}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
      <datalist id={listId}>
        {PLACES.map((p) => (
          <option key={p.iata} value={`${p.city} (${p.iata})`}>
            {p.airport}, {p.countryName}
          </option>
        ))}
      </datalist>
    </label>
  );
}
