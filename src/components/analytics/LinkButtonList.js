export default function LinkButtonList({ items }) {
  if (!items.length) return <p>No links or buttons</p>;

  return (
    <div className="space-y-2">
      {items.map((i) => (
        <div key={i.target} className="flex justify-between border p-2">
          <span className="truncate">{i.target}</span>
          <b>{i.clicks}</b>
        </div>
      ))}
    </div>
  );
}
