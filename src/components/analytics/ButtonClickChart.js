"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ButtonClickChart({ data, days }) {
  return (
    <div className="space-y-1">
      {/* TITLE */}
      <h3 className="text-lg font-semibold">Button clicks</h3>

      {/* SUBTITLE */}
      <p className="text-sm text-gray-500 mb-4">Clicks over last {days} days</p>

      {/* CHART */}
      <div className="h-64">
        <h3 className="font-semibold mb-2">Button Clicks</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line dataKey="buttonClicks" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
