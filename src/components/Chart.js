"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Chart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-center text-gray-400 py-10">No data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />

        <Tooltip />
        <Legend />

        <Line
          type="monotone"
          dataKey="views"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ r: 3 }}
          name="Views"
        />

        <Line
          type="monotone"
          dataKey="clicks"
          stroke="#16a34a"
          strokeWidth={3}
          dot={{ r: 3 }}
          name="Clicks"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
