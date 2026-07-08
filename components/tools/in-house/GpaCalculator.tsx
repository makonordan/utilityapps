"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Field, INPUT_CLASS, ToolShell } from "./ToolShell";

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0,
};

const GRADE_OPTIONS = Object.keys(GRADE_POINTS);

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: string;
}

let nextId = 1;
function newCourse(grade = "A", credits = "3"): Course {
  return { id: String(nextId++), name: "", grade, credits };
}

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>(() => [newCourse("A", "3"), newCourse("B+", "4"), newCourse("A-", "3")]);

  function update(id: string, patch: Partial<Course>) {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function remove(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }
  function add() {
    setCourses((prev) => [...prev, newCourse()]);
  }
  function reset() {
    setCourses([newCourse("A", "3"), newCourse("B+", "4"), newCourse("A-", "3")]);
  }

  let totalCredits = 0;
  let totalPoints = 0;
  for (const c of courses) {
    const credits = Number(c.credits);
    const points = GRADE_POINTS[c.grade] ?? 0;
    if (Number.isFinite(credits) && credits > 0) {
      totalCredits += credits;
      totalPoints += credits * points;
    }
  }
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  return (
    <ToolShell
      eyebrow="Calculator"
      title="GPA Calculator"
      description="Standard 4.0 scale. Add a row per course, enter the grade and credit hours."
      onReset={reset}
    >
      <div className="space-y-3">
        {courses.map((c, i) => (
          <div
            key={c.id}
            className="grid gap-3 rounded-xl border border-surface-200 bg-white p-3 sm:grid-cols-[1fr_120px_120px_auto] dark:border-surface-700 dark:bg-surface-800/40"
          >
            <Field label={`Course ${i + 1}`} className="sm:col-span-1">
              <input
                type="text"
                value={c.name}
                onChange={(e) => update(c.id, { name: e.target.value })}
                placeholder="Optional name"
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Grade">
              <select
                value={c.grade}
                onChange={(e) => update(c.id, { grade: e.target.value })}
                className={INPUT_CLASS}
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Credits">
              <input
                type="number"
                value={c.credits}
                onChange={(e) => update(c.id, { credits: e.target.value })}
                className={INPUT_CLASS}
                min="0"
                step="0.5"
                inputMode="decimal"
              />
            </Field>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => remove(c.id)}
                aria-label={`Remove course ${i + 1}`}
                disabled={courses.length === 1}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-surface-500 hover:bg-error-50 hover:text-error-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-error-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-dashed border-surface-300 px-3 py-2 text-sm font-medium text-surface-700 transition hover:border-primary-400 hover:text-primary-700 dark:border-surface-600 dark:text-surface-300 dark:hover:border-primary-400"
      >
        <Plus className="h-4 w-4" />
        Add course
      </button>

      <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50/60 p-5 dark:border-primary-500/30 dark:bg-primary-500/10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
          Cumulative GPA
        </p>
        <p className="mt-1 text-3xl font-bold text-primary-700 dark:text-primary-200">{gpa.toFixed(2)}</p>
        <p className="mt-1 text-xs text-surface-600 dark:text-surface-300">
          {totalCredits} credit hour{totalCredits === 1 ? "" : "s"} · {totalPoints.toFixed(1)} grade points
        </p>
      </div>
    </ToolShell>
  );
}
