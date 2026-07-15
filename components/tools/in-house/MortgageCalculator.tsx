"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";

import { Field, INPUT_CLASS, ToolShell } from "./ToolShell";

function fmtUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function pmt(principal: number, annualRatePct: number, years: number): number {
  const months = years * 12;
  if (months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

interface ScheduleRow {
  key: number;
  label: string;
  principal: number;
  interest: number;
  balance: number;
}

/** Month-by-month principal/interest/balance split for the P&I portion of the loan. */
function buildMonthlySchedule(principal: number, annualRatePct: number, years: number): ScheduleRow[] {
  const months = Math.round(years * 12);
  if (months <= 0 || principal <= 0) return [];
  const monthlyRate = annualRatePct / 100 / 12;
  const payment = pmt(principal, annualRatePct, years);
  const rows: ScheduleRow[] = [];
  let balance = principal;
  for (let period = 1; period <= months; period++) {
    const interest = balance * monthlyRate;
    let principalPaid = payment - interest;
    if (period === months || principalPaid > balance) principalPaid = balance;
    balance = Math.max(0, balance - principalPaid);
    rows.push({ key: period, label: `Month ${period}`, principal: principalPaid, interest, balance });
  }
  return rows;
}

/** Rolls up a monthly schedule into one row per 12-month block. */
function buildYearlySchedule(monthly: ScheduleRow[]): ScheduleRow[] {
  const out: ScheduleRow[] = [];
  for (let i = 0; i < monthly.length; i += 12) {
    const chunk = monthly.slice(i, i + 12);
    const year = out.length + 1;
    out.push({
      key: year,
      label: `Year ${year}`,
      principal: chunk.reduce((sum, r) => sum + r.principal, 0),
      interest: chunk.reduce((sum, r) => sum + r.interest, 0),
      balance: chunk[chunk.length - 1].balance,
    });
  }
  return out;
}

function downloadScheduleCsv(rows: ScheduleRow[]) {
  const header = "Period,Principal,Interest,Balance\n";
  const body = rows
    .map((r) => `${r.label},${r.principal.toFixed(2)},${r.interest.toFixed(2)},${r.balance.toFixed(2)}`)
    .join("\n");
  const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "amortization-schedule.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function MortgageCalculator() {
  const [home, setHome] = useState("400000");
  const [down, setDown] = useState("80000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [tax, setTax] = useState("4800");
  const [insurance, setInsurance] = useState("1500");
  const [hoa, setHoa] = useState("0");
  const [scheduleView, setScheduleView] = useState<"yearly" | "monthly">("yearly");
  const [showSchedule, setShowSchedule] = useState(false);

  const homeNum = Number(home) || 0;
  const downNum = Number(down) || 0;
  const principal = Math.max(0, homeNum - downNum);
  const rateNum = Number(rate) || 0;
  const yearsNum = Number(years) || 0;
  const piPayment = pmt(principal, rateNum, yearsNum);
  const monthlyTax = (Number(tax) || 0) / 12;
  const monthlyIns = (Number(insurance) || 0) / 12;
  const monthlyHoa = Number(hoa) || 0;

  // PMI estimate: 0.5% / yr of loan amount when down payment < 20%.
  const downPct = homeNum > 0 ? (downNum / homeNum) * 100 : 0;
  const monthlyPmi = downPct < 20 ? (principal * 0.005) / 12 : 0;

  const totalPiti = piPayment + monthlyTax + monthlyIns + monthlyHoa + monthlyPmi;

  const monthlySchedule = useMemo(
    () => buildMonthlySchedule(principal, rateNum, yearsNum),
    [principal, rateNum, yearsNum]
  );
  const yearlySchedule = useMemo(() => buildYearlySchedule(monthlySchedule), [monthlySchedule]);
  const totalInterest = monthlySchedule.reduce((sum, r) => sum + r.interest, 0);
  const activeSchedule = scheduleView === "yearly" ? yearlySchedule : monthlySchedule;

  return (
    <ToolShell
      eyebrow="Finance"
      title="Mortgage Calculator"
      description="Full PITI: principal, interest, taxes, insurance, plus PMI estimate when applicable."
      onReset={() => {
        setHome("400000");
        setDown("80000");
        setRate("6.5");
        setYears("30");
        setTax("4800");
        setInsurance("1500");
        setHoa("0");
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Home price ($)">
          <input type="number" value={home} onChange={(e) => setHome(e.target.value)} className={INPUT_CLASS} inputMode="decimal" min="0" />
        </Field>
        <Field label={`Down payment ($)${downPct ? ` — ${downPct.toFixed(1)}%` : ""}`}>
          <input type="number" value={down} onChange={(e) => setDown(e.target.value)} className={INPUT_CLASS} inputMode="decimal" min="0" />
        </Field>
        <Field label="Interest rate (%)">
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className={INPUT_CLASS} inputMode="decimal" step="0.01" min="0" />
        </Field>
        <Field label="Term (years)">
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className={INPUT_CLASS} inputMode="numeric" min="1" />
        </Field>
        <Field label="Property tax / year ($)">
          <input type="number" value={tax} onChange={(e) => setTax(e.target.value)} className={INPUT_CLASS} inputMode="decimal" min="0" />
        </Field>
        <Field label="Insurance / year ($)">
          <input type="number" value={insurance} onChange={(e) => setInsurance(e.target.value)} className={INPUT_CLASS} inputMode="decimal" min="0" />
        </Field>
        <Field label="HOA / month ($)" className="sm:col-span-2">
          <input type="number" value={hoa} onChange={(e) => setHoa(e.target.value)} className={INPUT_CLASS} inputMode="decimal" min="0" />
        </Field>
      </div>

      <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50/60 p-5 dark:border-primary-500/30 dark:bg-primary-500/10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
          Estimated monthly payment
        </p>
        <p className="mt-1 text-3xl font-bold text-primary-700 dark:text-primary-200">{fmtUSD(totalPiti)}</p>
      </div>

      <div className="mt-4 grid gap-2 text-sm">
        {[
          { label: "Principal & interest", value: piPayment },
          { label: "Property tax", value: monthlyTax },
          { label: "Insurance", value: monthlyIns },
          monthlyPmi > 0 ? { label: "PMI estimate (down < 20%)", value: monthlyPmi } : null,
          monthlyHoa > 0 ? { label: "HOA", value: monthlyHoa } : null,
        ]
          .filter((x): x is { label: string; value: number } => x !== null)
          .map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-xl border border-surface-200 bg-white px-4 py-2.5 dark:border-surface-700 dark:bg-surface-800/40"
            >
              <span className="text-surface-700 dark:text-surface-300">{row.label}</span>
              <span className="font-semibold text-surface-900 dark:text-white">{fmtUSD(row.value)}</span>
            </div>
          ))}
      </div>

      {monthlySchedule.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
                Amortization schedule
              </p>
              <p className="mt-0.5 text-[11px] text-surface-500 dark:text-surface-400">
                Total interest over {yearsNum} years:{" "}
                <span className="font-semibold text-surface-700 dark:text-surface-200">{fmtUSD(totalInterest)}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl border border-surface-200 p-0.5 dark:border-surface-700">
                {(["yearly", "monthly"] as const).map((view) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => setScheduleView(view)}
                    className={
                      scheduleView === view
                        ? "rounded-[10px] bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white"
                        : "rounded-[10px] px-3 py-1.5 text-xs font-semibold text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
                    }
                  >
                    {view === "yearly" ? "Yearly" : "Monthly"}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowSchedule((s) => !s)}
                className="rounded-xl border border-surface-200 px-3 py-1.5 text-xs font-semibold text-surface-700 transition hover:border-surface-300 hover:bg-surface-50 dark:border-surface-700 dark:text-surface-200 dark:hover:bg-surface-800"
              >
                {showSchedule ? "Hide schedule" : "Show schedule"}
              </button>
              {showSchedule && (
                <button
                  type="button"
                  onClick={() => downloadScheduleCsv(monthlySchedule)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-surface-200 px-3 py-1.5 text-xs font-semibold text-surface-700 transition hover:border-surface-300 hover:bg-surface-50 dark:border-surface-700 dark:text-surface-200 dark:hover:bg-surface-800"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </button>
              )}
            </div>
          </div>

          {showSchedule && (
            <div className="mt-3 max-h-96 overflow-y-auto overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-700">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-surface-50 text-xs uppercase tracking-wider text-surface-500 dark:bg-surface-800 dark:text-surface-400">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">{scheduleView === "yearly" ? "Year" : "Month"}</th>
                    <th className="px-4 py-2 text-right font-semibold">Principal</th>
                    <th className="px-4 py-2 text-right font-semibold">Interest</th>
                    <th className="px-4 py-2 text-right font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200 bg-white dark:divide-surface-700 dark:bg-surface-900">
                  {activeSchedule.map((row) => (
                    <tr key={row.key}>
                      <td className="px-4 py-2 text-surface-700 dark:text-surface-200">{row.label}</td>
                      <td className="px-4 py-2 text-right text-surface-700 dark:text-surface-200">{fmtUSD(row.principal)}</td>
                      <td className="px-4 py-2 text-right text-surface-700 dark:text-surface-200">{fmtUSD(row.interest)}</td>
                      <td className="px-4 py-2 text-right font-semibold text-surface-900 dark:text-white">{fmtUSD(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}
