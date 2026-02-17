import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Event from "@/models/Event";
import Page from "@/models/Page";
import { subDays, addDays, formatISO9075 } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = Number(searchParams.get("days") || 14);

  const page = await Page.findOne({ owner: session.user.email });
  if (!page) return NextResponse.json({});

  const endDate = new Date();
  const startDate = subDays(endDate, days - 1);

  /* ===== PAGE VIEWS ===== */
  const rawViews = await Event.aggregate([
    {
      $match: {
        type: "page_view",
        uri: page.uri,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            date: "$createdAt",
            format: "%Y-%m-%d",
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const rawClicks = await Event.aggregate([
    {
      $match: {
        type: "link_click",
        page: page._id,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            date: "$createdAt",
            format: "%Y-%m-%d",
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  /* ================= LINK CLICKS BY DAY (LEVEL 3) ================= */

  const linkClickMap = {};
  // structure:
  // {
  //   "https://abc.com": {
  //      "2026-01-10": 3,
  //      "2026-01-11": 5
  //   }
  // }

  clicksByLink.forEach((c) => {
    const url = c._id.target;
    const day = c._id.day;

    if (!linkClickMap[url]) {
      linkClickMap[url] = {};
    }

    linkClickMap[url][day] = c.count;
  });

  const viewMap = Object.fromEntries(rawViews.map((v) => [v._id, v.count]));
  const clickMap = Object.fromEntries(rawClicks.map((c) => [c._id, c.count]));

  const timeline = [];
  for (let i = 0; i < days; i++) {
    const date = formatISO9075(addDays(startDate, i)).split(" ")[0];
    timeline.push({
      date,
      views: viewMap[date] || 0,
      clicks: clickMap[date] || 0,
    });
  }

  return NextResponse.json({
    timeline,
  });
}
