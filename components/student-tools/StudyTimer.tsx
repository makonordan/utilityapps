"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface Session {
  id: string;
  subject: string;
  seconds: number;
  endedAt: number;
}

const STORAGE_KEY = "ua-study-timer-v1";

function fmt(totalSeconds: number): string {
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

interface Persisted {
  day: string;
  sessions: Session[];
}

function load(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Persisted;
    // Reset the log if it's from a previous day.
    if (parsed.day !== todayKey()) return [];
    return Array.isArray(parsed.sessions) ? parsed.sessions : [];
  } catch {
    return [];
  }
}

export function StudyTimer() {
  const [subject, setSubject] = useState("");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const startRef = useRef(0);
  const baseRef = useRef(0);
  const timerRef = useRef(0);

  useEffect(() => {
    setSessions(load());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const data: Persisted = { day: todayKey(), sessions };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [sessions]);

  useEffect(() => {
    if (!running) return;
    const tick = () => setElapsed(baseRef.current + (Date.now() - startRef.current) / 1000);
    tick();
    timerRef.current = window.setInterval(tick, 250);
    return () => window.clearInterval(timerRef.current);
  }, [running]);

  const start = () => {
    startRef.current = Date.now();
    setRunning(true);
  };

  const pause = () => {
    baseRef.current = elapsed;
    setRunning(false);
  };

  const logSession = () => {
    if (elapsed < 1) return;
    setSessions((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        subject: subject.trim() || "Untitled",
        seconds: Math.round(elapsed),
        endedAt: Date.now(),
      },
      ...prev,
    ]);
    setRunning(false);
    setElapsed(0);
    baseRef.current = 0;
  };

  const clearLog = () => {
    if (window.confirm("Clear today's study log?")) setSessions([]);
  };

  const totalToday = sessions.reduce((sum, s) => sum + s.seconds, 0);

  // Per-subject totals.
  const bySubject = new Map<string, number>();
  for (const s of sessions) bySubject.set(s.subject, (bySubject.get(s.subject) ?? 0) + s.seconds);

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "rounded-2xl border-2 p-8 text-center transition-colors",
          running
            ? "border-primary-400 bg-gradient-to-br from-primary-50 to-white dark:border-primary-500/60 dark:from-primary-500/10 dark:to-surface-900"
            : "border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900"
        )}
      >
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="What are you studying? (e.g. Biology — Chapter 4)"
          className="mx-auto block w-full max-w-md rounded-lg border border-surface-300 bg-white px-3 py-2 text-center text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:outline-none dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500"
        />
        <p className="mt-4 font-mono text-6xl font-bold tabular-nums text-surface-900 sm:text-7xl dark:text-white">
          {fmt(elapsed)}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {!running ? (
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
            >
              <Play className="h-6 w-6" />
              {elapsed > 0 ? "Resume" : "Start studying"}
            </button>
          ) : (
            <button
              type="button"
              onClick={pause}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-surface-700 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-surface-800 hover:scale-[1.01] active:scale-[0.99] dark:bg-surface-600 dark:hover:bg-surface-500"
            >
              <Pause className="h-6 w-6" />
              Pause
            </button>
          )}
          {elapsed > 0 && (
            <button
              type="button"
              onClick={logSession}
              className="inline-flex items-center gap-2 rounded-xl border border-success-400 px-4 py-2 text-sm font-semibold text-success-700 transition hover:bg-success-50 dark:border-success-500/60 dark:text-success-300 dark:hover:bg-success-500/10"
            >
              Log this session
            </button>
          )}
          {elapsed > 0 && (
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setElapsed(0);
                baseRef.current = 0;
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-surface-300 px-4 py-2 text-sm font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
            >
              <RotateCcw className="h-4 w-4" />
              Discard
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Today — {fmt(totalToday)} total
          </p>
          {sessions.length > 0 && (
            <button
              type="button"
              onClick={clearLog}
              className="inline-flex items-center gap-1 text-xs font-semibold text-surface-500 hover:text-error-600 dark:text-surface-400 dark:hover:text-error-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <p className="text-xs text-surface-500 dark:text-surface-400">
            No sessions logged yet today. Start the timer, then click &ldquo;Log this session&rdquo;.
          </p>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap gap-2">
              {Array.from(bySubject.entries()).map(([subj, secs]) => (
                <span
                  key={subj}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-500/15 dark:text-primary-200"
                >
                  {subj}: {fmt(secs)}
                </span>
              ))}
            </div>
            <ul className="space-y-1.5">
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-800"
                >
                  <span className="truncate text-surface-900 dark:text-white">{s.subject}</span>
                  <span className="ml-3 shrink-0 font-mono font-semibold text-surface-700 dark:text-surface-300">
                    {fmt(s.seconds)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
