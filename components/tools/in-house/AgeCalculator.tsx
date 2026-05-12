"use client";

import { useMemo, useState } from "react";

import { Field, INPUT_CLASS, ToolShell } from "./ToolShell";

function isValidDate(d: Date): boolean {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

function diffParts(birth: Date, today: Date) {
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function totalUnits(birth: Date, today: Date) {
  const ms = today.getTime() - birth.getTime();
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  return { seconds, minutes, hours, days, weeks, months };
}

function nextBirthday(birth: Date, today: Date): { date: Date; daysUntil: number } {
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) next.setFullYear(next.getFullYear() + 1);
  const daysUntil = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return { date: next, daysUntil };
}

export function AgeCalculator() {
  const today = useMemo(() => new Date(), []);
  const todayStr = today.toISOString().slice(0, 10);
  const [birthday, setBirthday] = useState("2000-01-01");
  const [target, setTarget] = useState(todayStr);

  const birth = new Date(birthday);
  const tgt = new Date(target);
  const valid = isValidDate(birth) && isValidDate(tgt) && tgt >= birth;

  return (
    <ToolShell
      eyebrow="Calculator"
      title="Age Calculator"
      description="Calculate exact age in years, months, and days — plus next-birthday countdown."
      onReset={() => {
        setBirthday("2000-01-01");
        setTarget(todayStr);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date of birth">
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            max={todayStr}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Calculate age on">
          <input
            type="date"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
      </div>

      {valid ? (
        <AgeOutput birth={birth} today={tgt} />
      ) : (
        <p className="mt-5 rounded-xl bg-warning-50 px-4 py-3 text-sm text-warning-800 dark:bg-warning-500/15 dark:text-warning-200">
          Pick a birth date that&apos;s earlier than the target date.
        </p>
      )}
    </ToolShell>
  );
}

function AgeOutput({ birth, today }: { birth: Date; today: Date }) {
  const parts = diffParts(birth, today);
  const totals = totalUnits(birth, today);
  const nb = nextBirthday(birth, today);
  const isBirthdayToday = nb.daysUntil === 0;

  return (
    <>
      <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50/60 p-5 dark:border-primary-500/30 dark:bg-primary-500/10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
          Age
        </p>
        <p className="mt-1 text-3xl font-bold text-primary-700 dark:text-primary-200">
          {parts.years} years, {parts.months} months, {parts.days} days
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Months", value: totals.months.toLocaleString() },
          { label: "Weeks", value: totals.weeks.toLocaleString() },
          { label: "Days", value: totals.days.toLocaleString() },
          { label: "Hours", value: totals.hours.toLocaleString() },
          { label: "Minutes", value: totals.minutes.toLocaleString() },
          { label: "Seconds", value: totals.seconds.toLocaleString() },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-surface-200 bg-surface-50 px-3 py-3 dark:border-surface-700 dark:bg-surface-800/60"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              {s.label}
            </p>
            <p className="mt-1 text-base font-bold text-surface-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-800/40">
        <p className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Next birthday
        </p>
        {isBirthdayToday ? (
          <p className="mt-1 text-base font-semibold text-success-700 dark:text-success-300">
            🎂 It&apos;s today! Happy birthday.
          </p>
        ) : (
          <p className="mt-1 text-base font-semibold text-surface-900 dark:text-white">
            {nb.daysUntil} day{nb.daysUntil === 1 ? "" : "s"} ·{" "}
            {nb.date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        )}
      </div>
    </>
  );
}
