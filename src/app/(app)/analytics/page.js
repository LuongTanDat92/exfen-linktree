import connectDB from "@/libs/mongodb";
import Page from "@/models/Page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AnalyticsClient from "./AnalyticsClient";

export default async function PageAnalytics() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) return null;

  const page = await Page.findOne({
    owner: session.user.email,
  }).lean();

  if (!page) return <div>No page</div>;

  return <AnalyticsClient pageId={page._id.toString()} />;
}

// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import Page from "@/models/Page";
// import Event from "@/models/Event";
// import connectDB from "@/libs/mongodb";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { formatISO9075, subDays, addDays } from "date-fns";

// import TrackButtonClick from "@/components/analytics/TrackButtonClick";

// import AnalyticsClient from "./AnalyticsClient";

// export default async function AnalyticsPage({ searchParams }) {
//   await connectDB();

//   const session = await getServerSession(authOptions);
//   if (!session) redirect("/");

//   const page = await Page.findOne({ owner: session.user.email });
//   if (!page) redirect("/");

//   /* ===== RANGE ===== */
//   const DAYS = Number(searchParams?.days) || 14;
//   const endDate = new Date();
//   const startDate = subDays(endDate, DAYS - 1);

//   /* ===== PAGE VIEWS ===== */
//   const rawViews = await Event.aggregate([
//     {
//       $match: {
//         type: "page_view",
//         uri: page.uri,
//         createdAt: { $gte: startDate, $lte: endDate },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: {
//             date: "$createdAt",
//             format: "%Y-%m-%d",
//           },
//         },
//         count: { $sum: 1 },
//       },
//     },
//   ]);

//   const viewMap = Object.fromEntries(rawViews.map((v) => [v._id, v.count]));

//   /* ===== CLICKS ===== */
//   const rawClicks = await Event.aggregate([
//     {
//       $match: {
//         type: "link_click",
//         page: page._id,
//         createdAt: { $gte: startDate, $lte: endDate },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: {
//             date: "$createdAt",
//             format: "%Y-%m-%d",
//           },
//         },
//         count: { $sum: 1 },
//       },
//     },
//   ]);

//   const clickMap = Object.fromEntries(rawClicks.map((c) => [c._id, c.count]));

//   /* ===== BUTTONS CLICKS ===== */
//   const rawButtonClicks = await Event.aggregate([
//     {
//       $match: {
//         type: "button_click",
//         page: page._id,
//         createdAt: { $gte: startDate, $lte: endDate },
//       },
//     },
//     {
//       $group: {
//         _id: "$target",
//         count: { $sum: 1 },
//       },
//     },
//   ]);

//   const buttonClickList = rawButtonClicks.map((b) => ({
//     key: b._id,
//     clicks: b.count,
//   }));

//   /* ===== MAIN CHART DATA ===== */
//   const analyticsData = [];
//   for (let i = 0; i < DAYS; i++) {
//     const date = formatISO9075(addDays(startDate, i)).split(" ")[0];
//     analyticsData.push({
//       date,
//       views: viewMap[date] || 0,
//       clicks: clickMap[date] || 0,
//     });
//   }

//   /* ===== LINKS ===== */
//   const linkBlocks = (page.blocks || []).filter(
//     (b) => b.type === "link" && b.data?.links,
//   );
//   const links = linkBlocks.flatMap((b) => b.data.links);

//   /* ===== CLICKS BY LINK (THEO NGÀY) ===== */
//   const rawLinkClicks = await Event.aggregate([
//     {
//       $match: {
//         type: "link_click",
//         page: page._id,
//       },
//     },
//     {
//       $group: {
//         _id: {
//           target: "$target",
//           day: {
//             $dateToString: {
//               date: "$createdAt",
//               format: "%Y-%m-%d",
//             },
//           },
//         },
//         count: { $sum: 1 },
//       },
//     },
//   ]);

//   const linkClickMap = {};
//   rawLinkClicks.forEach((c) => {
//     if (!linkClickMap[c._id.target]) {
//       linkClickMap[c._id.target] = {};
//     }
//     linkClickMap[c._id.target][c._id.day] = c.count;
//   });

//   return (
//     <AnalyticsClient
//       analyticsData={analyticsData}
//       links={links}
//       linkClickMap={linkClickMap}
//       days={DAYS}
//     />
//   );
// }
