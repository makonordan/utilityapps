"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Datum {
  date: string;
  delta: number;
  cumulative: number;
}

function shortDate(date: string): string {
  // ISO date → "May 7"
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function SubscriberGrowthChart({ data }: { data: Datum[] }) {
  if (data.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-surface-200 p-8 text-center text-sm text-surface-500 dark:border-surface-800 dark:text-surface-400">
        No subscriber data yet.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 16 }}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            interval="preserveEnd"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} width={36} />
          <Tooltip
            cursor={{ stroke: "rgba(0, 102, 255, 0.4)", strokeDasharray: "3 3" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(15, 23, 42, 0.1)",
              fontSize: 12,
              padding: "8px 12px",
            }}
            labelFormatter={(label) => shortDate(String(label))}
            formatter={(value, name) => {
              const n = Number(value);
              if (name === "cumulative") return [n.toLocaleString(), "Total subscribers"];
              if (name === "delta") return [n.toLocaleString(), "New that day"];
              return [n.toString(), String(name)];
            }}
          />
          <defs>
            <linearGradient id="subscriberGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0066FF" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#0066FF"
            strokeWidth={2}
            fill="url(#subscriberGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
