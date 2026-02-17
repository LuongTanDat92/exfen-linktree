"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function OverviewChart({ data, days }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-sm text-gray-400 text-center py-6">
        No analytics data
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* TITLE */}
      <h3 className="text-lg font-semibold">Overview Chart</h3>

      {/* SUBTITLE */}
      <p className="text-sm text-gray-500 mb-4">Clicks over last {days} days</p>

      {/* CHART */}
      <div className="h-64">
        <h3 className="font-semibold mb-2">Overview Chart</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line dataKey="views" stroke="#6366f1" />
            <Line dataKey="clicks" stroke="#22c55e" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
