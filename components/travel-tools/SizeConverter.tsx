"use client";

import { useMemo, useState } from "react";
import { Info, Ruler } from "lucide-react";

import {
  SIZE_CATEGORY_LABELS,
  SIZE_CATEGORY_NOTES,
  SIZE_REGIONS,
  SIZE_TABLES,
  findSizeRow,
  type Region,
  type SizeCategory,
} from "@/lib/sizeData";
import { cn } from "@/lib/utils";

export function SizeConverter() {
  const [category, setCategory] = useState<SizeCategory>("clothing-women");
  const [region, setRegion] = useState<Region>("US");
  const [value, setValue] = useState("");

  const rows = SIZE_TABLES[category];
  const matched = useMemo(() => findSizeRow(category, region, value), [category, region, value]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr_1fr]">
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SizeCategory)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
          >
            {(Object.keys(SIZE_CATEGORY_LABELS) as SizeCategory[]).map((c) => (
              <option key={c} value={c}>{SIZE_CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">I know my</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
          >
            {SIZE_REGIONS.map((r) => (
              <option key={r} value={r}>{r} size</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-surface-700 dark:text-surface-200">Size</span>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 8"
            className="mt-1.5 block w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-900"
          />
        </label>
      </div>

      {matched ? (
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 dark:border-sky-500/30 dark:from-sky-500/10 dark:to-surface-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            Your equivalent sizes
          </p>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {SIZE_REGIONS.map((r) => (
              <div
                key={r}
                className={cn(
                  "rounded-xl border bg-white p-3 text-center dark:bg-surface-900",
                  r === region
                    ? "border-sky-400 ring-2 ring-sky-500/20 dark:border-sky-500/50"
                    : "border-surface-200 dark:border-surface-800"
                )}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{r}</p>
                <p className="mt-1 text-lg font-bold text-surface-900 dark:text-white">{matched[r]}</p>
              </div>
            ))}
          </div>
        </div>
      ) : value.trim() ? (
        <p className="rounded-xl border border-dashed border-surface-200 bg-white px-4 py-6 text-center text-sm text-surface-500 dark:border-surface-800 dark:bg-surface-900">
          That size isn't in the {region} column of the {SIZE_CATEGORY_LABELS[category].toLowerCase()} table. Try a value from the list below.
        </p>
      ) : null}

      <div>
        <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">Full conversion table</p>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">{SIZE_CATEGORY_NOTES[category]}</p>
        <div className="mt-3 -mx-2 overflow-x-auto sm:mx-0">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                {SIZE_REGIONS.map((r) => (
                  <th key={r} className={cn(
                    "px-3 py-2 text-left",
                    r === region && "text-sky-700 dark:text-sky-300"
                  )}>
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isMatch = matched && matched === row;
                return (
                  <tr
                    key={i}
                    className={cn(
                      i % 2 ? "bg-surface-50 dark:bg-surface-900/40" : "",
                      isMatch && "ring-2 ring-sky-400 dark:ring-sky-500/50"
                    )}
                  >
                    {SIZE_REGIONS.map((r) => (
                      <td
                        key={r}
                        className={cn(
                          "px-3 py-2 text-surface-700 dark:text-surface-200",
                          r === region && "font-semibold text-sky-700 dark:text-sky-300"
                        )}
                      >
                        {row[r]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="inline-flex items-start gap-2 rounded-xl bg-surface-50 px-3.5 py-2.5 text-xs text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
        <span>
          Sizing varies between brands. For the closest fit, measure foot length in cm for shoes
          and check the brand's own clothing chart against your body measurements.
        </span>
      </p>

      <p className="inline-flex items-start gap-2 rounded-xl bg-surface-50 px-3.5 py-2.5 text-xs text-surface-600 dark:bg-surface-800/60 dark:text-surface-300">
        <Ruler className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
        <span>
          Kids' clothing in the EU and JP is measured by the child's height in centimetres rather
          than by age — pick by your child's measured height for the best fit.
        </span>
      </p>
    </div>
  );
}
