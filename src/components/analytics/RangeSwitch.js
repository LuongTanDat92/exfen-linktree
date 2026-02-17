// "use client";

// export default function AnalyticsRangeSwitcher({ value, onChange }) {
//   return (
//     <div className="flex gap-2 justify-center mb-4">
//       {[7, 14, 30].map((d) => (
//         <button
//           key={d}
//           onClick={() => onChange(d)}
//           className={`px-3 py-1 rounded border ${
//             value === d ? "bg-blue-600 text-white" : "bg-white text-gray-600"
//           }`}
//         >
//           {d} days
//         </button>
//       ))}
//     </div>
//   );
// }

export default function RangeSwitch({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {[7, 14, 30, 90].map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={value === d ? "font-bold" : ""}
        >
          {d} days
        </button>
      ))}
    </div>
  );
}
