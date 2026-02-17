"use client";

export default function TextBlock({ content }) {
  if (!content) return null;

  return (
    <div className="bg-white text-blue-950 p-4 rounded-lg">
      <p className="whitespace-pre-line">{content}</p>
    </div>
  );
}
