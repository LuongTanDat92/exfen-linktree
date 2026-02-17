"use client";

export default function LinkBlockItem({ block, onChange, onDelete }) {
  const data = block.data || {};

  return (
    <div className="border p-4 mb-4 rounded">
      <div className="text-sm font-semibold mb-2">🔗 Link</div>

      <input
        placeholder="Title"
        value={data.title || ""}
        onChange={(e) => onChange(block._id, { title: e.target.value })}
      />

      <input
        placeholder="Subtitle"
        value={data.subtitle || ""}
        onChange={(e) => onChange(block._id, { subtitle: e.target.value })}
      />

      <input
        placeholder="URL"
        value={data.url || ""}
        onChange={(e) => onChange(block._id, { url: e.target.value })}
      />

      <button
        onClick={() => onDelete(block._id)}
        className="text-red-400 text-sm mt-2"
      >
        Delete
      </button>
    </div>
  );
}
