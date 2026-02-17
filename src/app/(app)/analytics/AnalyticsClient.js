"use client";

import { useEffect, useState } from "react";
import RangeSwitch from "@/components/analytics/RangeSwitch";
import LinkButtonList from "@/components/analytics/LinkButtonList";
import OverviewChart from "@/components/analytics/OverviewChart";
import LinkClickChart from "@/components/analytics/LinkClickChart";
import ButtonClickChart from "@/components/analytics/ButtonClickChart";
import ChartTabs from "@/components/analytics/ChartTabs";

function buildTimeline(raw, days) {
  const map = {};
  raw.forEach((d) => {
    map[d.date] = d;
  });

  const result = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const key = d.toISOString().slice(0, 10);

    result.push({
      date: key,
      views: map[key]?.views || 0,
      linkClicks: map[key]?.linkClicks || 0,
      buttonClicks: map[key]?.buttonClicks || 0,
    });
  }

  return result;
}

export default function AnalyticsClient({ pageId }) {
  const [days, setDays] = useState(14);
  const [data, setData] = useState(null);
  const [overview, setOverview] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetch(`/api/analytics/summary?pageId=${pageId}&days=${days}`)
      .then((r) => r.json())
      .then(setData);

    fetch(`/api/analytics/overview?pageId=${pageId}&days=${days}`)
      .then((r) => r.json())
      .then((raw) => {
        setOverview(buildTimeline(raw, days));
      });
  }, [days, pageId]);

  if (!data) return null;

  return (
    <div className="space-y-6">
      <RangeSwitch value={days} onChange={setDays} />

      <div className="text-xl">
        Views: <b>{data.views}</b>
      </div>

      <ChartTabs value={activeTab} onChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === "overview" && (
          <OverviewChart data={overview} days={days} />
        )}

        {activeTab === "link" && <LinkClickChart data={overview} days={days} />}

        {activeTab === "button" && (
          <ButtonClickChart data={overview} days={days} />
        )}
      </div>

      <LinkButtonList items={data.items} />
    </div>
  );
}

// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// import SectionBox from "@/components/layout/SectionBox";
// import RangeSwitch from "@/components/analytics/RangeSwitch";
// import LineChartBox from "@/components/charts/LineChartBox";
// import LinkClickList from "@/components/analytics/LinkClickList.old.";
// import LinkChartModal from "@/components/analytics/LinkChartModal.old";

// export default function AnalyticsClient({
//   analyticsData,
//   links,
//   linkClickMap,
//   days,
// }) {
//   const router = useRouter();
//   const [activeLink, setActiveLink] = useState(null);

//   function setDays(d) {
//     router.push(`/analytics?days=${d}`);
//   }

//   return (
//     <div className="space-y-10">
//       <RangeSwitch days={days} onChange={setDays} />

//       <SectionBox>
//         <h2 className="text-xl text-center mb-4">
//           Views & Clicks (last {days} days)
//         </h2>
//         <LineChartBox data={analyticsData} />
//       </SectionBox>

//       <SectionBox>
//         <h2 className="text-xl text-center mb-4">Link clicks</h2>
//         <LinkClickList
//           links={links}
//           linkClickMap={linkClickMap}
//           onSelect={setActiveLink}
//         />
//       </SectionBox>

//       {activeLink && (
//         <LinkChartModal
//           link={activeLink}
//           linkClickMap={linkClickMap[activeLink]}
//           onClose={() => setActiveLink(null)}
//         />
//       )}
//     </div>
//   );
// }
