"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function LineChartBox({ data, onlyClicks }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-center py-10 text-gray-400">No data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />

        {!onlyClicks && <Line dataKey="views" strokeWidth={2} />}

        <Line dataKey="clicks" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
