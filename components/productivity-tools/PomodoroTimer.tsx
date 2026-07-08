"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, BellOff, Check, Pause, Play, Plus, RotateCcw, Settings, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Phase = "work" | "short-break" | "long-break";

interface Settings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  pomodorosBeforeLongBreak: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

interface Task {
  id: string;
  text: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  done: boolean;
}

const DEFAULTS: Settings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  pomodorosBeforeLongBreak: 4,
  soundEnabled: true,
  notificationsEnabled: false,
};

const STORAGE_KEY = "ua-pomodoro-v1";

interface Persisted {
  settings: Settings;
  tasks: Task[];
  completedPomodoros: number;
  activeTaskId: string | null;
}

function loadPersisted(): Persisted {
  if (typeof window === "undefined") {
    return { settings: DEFAULTS, tasks: [], completedPomodoros: 0, activeTaskId: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { settings: DEFAULTS, tasks: [], completedPomodoros: 0, activeTaskId: null };
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      settings: { ...DEFAULTS, ...(parsed.settings ?? {}) },
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      completedPomodoros: parsed.completedPomodoros ?? 0,
      activeTaskId: parsed.activeTaskId ?? null,
    };
  } catch {
    return { settings: DEFAULTS, tasks: [], completedPomodoros: 0, activeTaskId: null };
  }
}

function phaseLabel(phase: Phase): string {
  if (phase === "work") return "Focus";
  if (phase === "short-break") return "Short Break";
  return "Long Break";
}

function formatTime(seconds: number): string {
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

// Synthesise a short bell using the WebAudio API so we don't ship an audio
// asset just for one beep.
function playBell() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.4, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  } catch {
    /* audio unavailable, silently ignore */
  }
}

export function PomodoroTimer() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [phase, setPhase] = useState<Phase>("work");
  const [running, setRunning] = useState(false);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(DEFAULTS.workMinutes * 60);
  const [showSettings, setShowSettings] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const titleRestoreRef = useRef<string | null>(null);

  // Hydrate from local storage on first mount.
  useEffect(() => {
    const p = loadPersisted();
    setSettings(p.settings);
    setTasks(p.tasks);
    setActiveTaskId(p.activeTaskId);
    setCompletedPomodoros(p.completedPomodoros);
    setRemaining(p.settings.workMinutes * 60);
  }, []);

  // Persist whenever anything meaningful changes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p: Persisted = { settings, tasks, completedPomodoros, activeTaskId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }, [settings, tasks, completedPomodoros, activeTaskId]);

  // Tick every 250ms using the absolute end time so background tabs stay accurate.
  useEffect(() => {
    if (!running || endsAt === null) return;
    const tick = () => {
      const r = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemaining(r);
      if (r <= 0) {
        finishPhase();
      }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, endsAt]);

  // Mirror remaining time into the document title so the user sees it from any tab.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (titleRestoreRef.current === null) titleRestoreRef.current = document.title;
    document.title = running
      ? `${formatTime(remaining)} — ${phaseLabel(phase)} | UtilityApps`
      : titleRestoreRef.current;
    return () => {
      if (titleRestoreRef.current) document.title = titleRestoreRef.current;
    };
  }, [remaining, running, phase]);

  function phaseDuration(p: Phase): number {
    if (p === "work") return settings.workMinutes * 60;
    if (p === "short-break") return settings.shortBreakMinutes * 60;
    return settings.longBreakMinutes * 60;
  }

  function startPhase(p: Phase) {
    const seconds = phaseDuration(p);
    setPhase(p);
    setRemaining(seconds);
    setEndsAt(Date.now() + seconds * 1000);
    setRunning(true);
  }

  function pause() {
    setRunning(false);
    setEndsAt(null);
  }

  function resume() {
    setEndsAt(Date.now() + remaining * 1000);
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setEndsAt(null);
    setPhase("work");
    setRemaining(settings.workMinutes * 60);
  }

  function finishPhase() {
    setRunning(false);
    setEndsAt(null);

    if (settings.soundEnabled) playBell();
    if (settings.notificationsEnabled && typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification(phase === "work" ? "Work session done!" : "Break's over!", {
          body: phase === "work" ? "Take a break." : "Back to focus.",
        });
      } catch {
        /* ignore */
      }
    }

    if (phase === "work") {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      // Increment active task's pomodoro count.
      if (activeTaskId) {
        setTasks((t) =>
          t.map((task) =>
            task.id === activeTaskId
              ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
              : task
          )
        );
      }
      const isLongBreak = newCount % settings.pomodorosBeforeLongBreak === 0;
      const nextPhase: Phase = isLongBreak ? "long-break" : "short-break";
      setPhase(nextPhase);
      setRemaining(phaseDuration(nextPhase));
    } else {
      setPhase("work");
      setRemaining(phaseDuration("work"));
    }
  }

  function addTask() {
    const text = newTaskText.trim();
    if (!text) return;
    const t: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text,
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      done: false,
    };
    setTasks((prev) => [...prev, t]);
    setNewTaskText("");
    if (!activeTaskId) setActiveTaskId(t.id);
  }

  function toggleTaskDone(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  }

  async function requestNotificationPermission() {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "granted") {
      setSettings((s) => ({ ...s, notificationsEnabled: true }));
      return;
    }
    const result = await Notification.requestPermission();
    if (result === "granted") {
      setSettings((s) => ({ ...s, notificationsEnabled: true }));
    } else {
      setSettings((s) => ({ ...s, notificationsEnabled: false }));
    }
  }

  // If settings change while idle, refresh the displayed time.
  useEffect(() => {
    if (!running) setRemaining(phaseDuration(phase));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, phase]);

  const totalDuration = phaseDuration(phase);
  const progressRatio = totalDuration > 0 ? 1 - remaining / totalDuration : 0;

  const phaseAccent = useMemo(() => {
    if (phase === "work") return { ring: "ring-primary-300/60", from: "from-primary-500", to: "to-primary-700" };
    if (phase === "short-break") return { ring: "ring-success-300/60", from: "from-success-500", to: "to-success-700" };
    return { ring: "ring-accent-300/60", from: "from-accent-500", to: "to-accent-700" };
  }, [phase]);

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
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
          {phaseLabel(phase)} · {completedPomodoros} pomodoro{completedPomodoros === 1 ? "" : "s"} today
        </p>
        <p className="mt-3 font-mono text-7xl font-bold tracking-tight text-surface-900 sm:text-8xl dark:text-white">
          {formatTime(remaining)}
        </p>

        <div className="mx-auto mt-4 h-2 max-w-md overflow-hidden rounded-full bg-surface-200 dark:bg-surface-800">
          <div
            className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-300", phaseAccent.from, phaseAccent.to)}
            style={{ width: `${Math.round(progressRatio * 100)}%` }}
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {!running && remaining === phaseDuration(phase) && (
            <button
              type="button"
              onClick={() => startPhase(phase)}
              className={cn(
                "inline-flex items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]",
                phaseAccent.ring
              )}
            >
              <Play className="h-6 w-6" />
              Start {phaseLabel(phase)}
            </button>
          )}
          {!running && remaining !== phaseDuration(phase) && remaining > 0 && (
            <button
              type="button"
              onClick={resume}
              className={cn(
                "inline-flex items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]",
                phaseAccent.ring
              )}
            >
              <Play className="h-6 w-6" />
              Resume
            </button>
          )}
          {running && (
            <button
              type="button"
              onClick={pause}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-surface-700 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-surface-800 hover:scale-[1.01] active:scale-[0.99] dark:bg-surface-600 dark:hover:bg-surface-500"
            >
              <Pause className="h-6 w-6" />
              Pause
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-surface-300 bg-white px-4 py-2 text-sm font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => setShowSettings((s) => !s)}
            className="inline-flex items-center gap-2 rounded-xl border border-surface-300 bg-white px-4 py-2 text-sm font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Settings
          </p>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { key: "workMinutes" as const, label: "Work (min)", min: 1, max: 90 },
              { key: "shortBreakMinutes" as const, label: "Short break (min)", min: 1, max: 30 },
              { key: "longBreakMinutes" as const, label: "Long break (min)", min: 1, max: 60 },
              { key: "pomodorosBeforeLongBreak" as const, label: "Pomodoros / cycle", min: 2, max: 8 },
            ].map((s) => (
              <label key={s.key} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{s.label}</span>
                <input
                  type="number"
                  min={s.min}
                  max={s.max}
                  value={settings[s.key]}
                  onChange={(e) =>
                    setSettings((cur) => ({
                      ...cur,
                      [s.key]: Math.max(s.min, Math.min(s.max, Number(e.target.value))),
                    }))
                  }
                  className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
                />
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                settings.soundEnabled
                  ? "border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-500/60 dark:bg-primary-500/10 dark:text-primary-200"
                  : "border-surface-200 text-surface-700 dark:border-surface-700 dark:text-surface-300"
              )}
            >
              {settings.soundEnabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
              Sound on phase change
            </button>
            <button
              type="button"
              onClick={requestNotificationPermission}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                settings.notificationsEnabled
                  ? "border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-500/60 dark:bg-primary-500/10 dark:text-primary-200"
                  : "border-surface-200 text-surface-700 dark:border-surface-700 dark:text-surface-300"
              )}
            >
              Desktop notifications
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Tasks
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask();
          }}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="What are you working on?"
            className="flex-1 rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:outline-none dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </form>

        {tasks.length === 0 ? (
          <p className="mt-3 text-xs text-surface-500 dark:text-surface-400">
            Add your first task above. Active tasks accumulate Pomodoro counts as you complete focus intervals.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {tasks.map((t) => (
              <li
                key={t.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border px-3 py-2",
                  activeTaskId === t.id && !t.done
                    ? "border-primary-300 bg-primary-50/60 dark:border-primary-500/60 dark:bg-primary-500/10"
                    : "border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900",
                  t.done && "opacity-60"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleTaskDone(t.id)}
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
                    t.done
                      ? "border-success-500 bg-success-500 text-white"
                      : "border-surface-300 hover:border-primary-500 dark:border-surface-700"
                  )}
                  aria-label={t.done ? "Mark incomplete" : "Mark complete"}
                >
                  {t.done && <Check className="h-3 w-3" />}
                </button>
                <span
                  className={cn(
                    "flex-1 text-sm",
                    t.done && "line-through",
                    "text-surface-900 dark:text-white"
                  )}
                >
                  {t.text}
                </span>
                <span className="text-xs font-semibold text-surface-500 dark:text-surface-400">
                  {t.completedPomodoros} 🍅
                </span>
                {!t.done && activeTaskId !== t.id && (
                  <button
                    type="button"
                    onClick={() => setActiveTaskId(t.id)}
                    className="text-xs font-semibold text-primary-700 hover:underline dark:text-primary-300"
                  >
                    Set active
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeTask(t.id)}
                  className="text-surface-400 transition hover:text-error-600 dark:hover:text-error-400"
                  aria-label="Remove task"
                >
                  {activeTaskId === t.id ? <X className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
