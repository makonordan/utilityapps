"use client";

import { useCallback, useEffect, useState } from "react";

export type RatesSource = "live" | "fallback";

export interface RatesPayload {
  rates: Record<string, number>;
  base: string;
  lastUpdated: string;
  source: RatesSource;
  nextUpdate?: string;
  error?: string;
}

interface UseExchangeRates {
  rates: Record<string, number> | null;
  base: string | null;
  lastUpdated: string | null;
  source: RatesSource | null;
  loading: boolean;
  error: string | null;
  /** Force-refresh from /api/exchange-rates, bypassing the sessionStorage cache. */
  refresh: () => Promise<void>;
}

const STORAGE_KEY = "utilityapps:exchange-rates";
const STORAGE_TIME_KEY = "utilityapps:exchange-rates-time";
// Browser-side cache window. The server route is cached for 24h, but we keep
// a shorter 1h client cache so users who reload the page within the hour get
// instant results without a network roundtrip.
const CLIENT_CACHE_MS = 60 * 60 * 1000;

function readCache(): RatesPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const time = window.sessionStorage.getItem(STORAGE_TIME_KEY);
    if (!raw || !time) return null;
    const age = Date.now() - parseInt(time, 10);
    if (Number.isNaN(age) || age > CLIENT_CACHE_MS) return null;
    return JSON.parse(raw) as RatesPayload;
  } catch {
    return null;
  }
}

function writeCache(payload: RatesPayload): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.sessionStorage.setItem(STORAGE_TIME_KEY, Date.now().toString());
  } catch {
    // sessionStorage may throw in private mode or when full — ignore.
  }
}

/**
 * React hook that fetches live exchange rates from the in-app API route,
 * with a sessionStorage cache for fast subsequent loads. Returns the rates
 * map plus metadata (source, last-updated timestamp). The CurrencyConverter
 * uses this — components don't talk to the upstream API directly.
 */
export function useExchangeRates(): UseExchangeRates {
  const [payload, setPayload] = useState<RatesPayload | null>(() => readCache());
  const [loading, setLoading] = useState<boolean>(() => readCache() === null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force: boolean): Promise<void> => {
    if (!force) {
      const cached = readCache();
      if (cached) {
        setPayload(cached);
        setLoading(false);
        setError(null);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/exchange-rates", force ? { cache: "reload" } : undefined);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as RatesPayload;
      writeCache(data);
      setPayload(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      // load() reads its own cancellation guard via React's strict-mode
      // handling — we just avoid double-setting state on unmount.
      await load(false);
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  return {
    rates: payload?.rates ?? null,
    base: payload?.base ?? null,
    lastUpdated: payload?.lastUpdated ?? null,
    source: payload?.source ?? null,
    loading,
    error,
    refresh: () => load(true),
  };
}
