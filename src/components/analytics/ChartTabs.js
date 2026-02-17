"use client";

export default function ChartTabs({ value, onChange }) {
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "link", label: "Link clicks" },
    { key: "button", label: "Button clicks" },
  ];

  return (
    <div className="flex gap-2 border-b">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            value === t.key
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
