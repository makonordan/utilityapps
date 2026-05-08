"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Datum {
  name: string;
  count: number;
}

export function TrendingChart({ data, label }: { data: Datum[]; label: string }) {
  if (data.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-surface-200 p-8 text-center text-sm text-surface-500 dark:border-surface-800 dark:text-surface-400">
        No usage events yet.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 32 }}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-25}
            textAnchor="end"
            interval={0}
            height={60}
            fontSize={11}
            tickLine={false}
          />
          <YAxis allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(0, 102, 255, 0.06)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(15, 23, 42, 0.1)",
              fontSize: 12,
              padding: "6px 10px",
            }}
            labelStyle={{ fontWeight: 600 }}
            formatter={(value) => [Number(value).toLocaleString(), label]}
          />
          <Bar dataKey="count" fill="url(#trendingGradient)" radius={[6, 6, 0, 0]} />
          <defs>
            <linearGradient id="trendingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0066FF" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
